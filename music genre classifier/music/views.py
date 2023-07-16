import json
import os

from django.http import HttpResponse
from django.shortcuts import render
import pyaudio
import wave
from django.core.files.storage import FileSystemStorage
from keras.models import load_model
from .data import getmetadata
from keras.preprocessing import image
import tensorflow as tf
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler


# model_new=load_model('./model/genre1.h5')

# Create your views here.


def index(request):
    return render(request,'base.html')
def predictmusic(request):
    print(request)
    print(request.POST.dict())
    fileobj=request.FILES['audiopath']
    # file_path = os.path.join('media', fileobj.name)
    # file_path = os.path.abspath(os.path.join('media', fileobj.name))
    # print(str(file_path)+"file obj")

    fs=FileSystemStorage()
    filepathname=fs.save(fileobj.name,fileobj)
    filepathname=fs.url(filepathname)
    audio='.'+filepathname
    print("audio"+audio+"file"+fileobj.name)
    model_new = load_model('./model/genrenew1.h5')
    fit = StandardScaler()
    file=getmetadata(audio)
    # d=np.array(file)
    # d=d*1000



    yhat=model_new.predict(np.expand_dims(file,0))
    print(yhat)
    mapper={0: 'blues', 1: 'classical', 2: 'country', 3: 'disco', 4: 'hiphop', 5: 'jazz', 6: 'metal', 7: 'pop', 8: 'reggae', 9: 'rock'}
    e = np.vectorize(mapper.get)(int(np.argmax(yhat)))



    # e=fileobj.name.split(".")[0]


    context = {'filePathName': audio,'predicted_label':e}
    del yhat
    return render(request,'base.html',context)

def record_audio(request):
    # Set the recording parameters
    FORMAT = pyaudio.paInt16
    CHANNELS = 1
    RATE = 44100
    CHUNK = 1024
    RECORD_SECONDS = 5
    WAVE_OUTPUT_FILENAME = "output.wav"

    # Initialize the PyAudio object
    audio = pyaudio.PyAudio()

    # Open the microphone stream
    stream = audio.open(format=FORMAT, channels=CHANNELS,
                        rate=RATE, input=True,
                        frames_per_buffer=CHUNK)

    # Record the audio data
    frames = []
    for i in range(0, int(RATE / CHUNK * RECORD_SECONDS)):
        data = stream.read(CHUNK)
        frames.append(data)

    # Stop the microphone stream
    stream.stop_stream()
    stream.close()
    audio.terminate()

    # Save the recorded audio data as a WAV file
    wf = wave.open(WAVE_OUTPUT_FILENAME, 'wb')
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(audio.get_sample_size(FORMAT))
    wf.setframerate(RATE)
    wf.writeframes(b''.join(frames))
    wf.close()
    # fs = FileSystemStorage()
    # filepathname = fs.save(WAVE_OUTPUT_FILENAME, WAVE_OUTPUT_FILENAME)
    # filepathname = fs.url(filepathname)
    # Return a response to the user

    sound=WAVE_OUTPUT_FILENAME
    file = getmetadata(sound)
    model_new = load_model('./model/genre1.h5')
    yhat = model_new.predict(np.expand_dims(file, 0))
    mapper = {0: 'blues', 1: 'classical', 2: 'country', 3: 'disco', 4: 'hiphop', 5: 'jazz', 6: 'metal', 7: 'pop',
              8: 'reggae', 9: 'rock'}
    e = np.vectorize(mapper.get)(np.argmax(yhat))

    context={'sound':sound,'predictedlabel':e}

    return render(request, 'record.html',context)

def play_audio(request):
    # Get the file path of the WAV file
    # fileobj = request.FILES['WAVE_OUTPUT_FILENAME']
    file_path = os.path.join('media', 'output.wav')

    # Open the file and read its contents
    with open(file_path, 'rb') as file:
        response = HttpResponse(file.read())

    # Set the content type header to "audio/wav"
    response['Content-Type'] = 'audio/wav'

    # Set the Content-Disposition header to force download
    response['Content-Disposition'] = 'attachment; filename="record/output.wav"'

    return response
