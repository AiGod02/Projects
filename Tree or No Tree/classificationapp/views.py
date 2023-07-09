import os

from django.shortcuts import render
from django.core.files.storage import FileSystemStorage
from keras.models import load_model
from keras.preprocessing import image
import tensorflow as tf
import matplotlib.pyplot as plt
import cv2
import numpy as np
import json
model_new=load_model('./models/treemodel.h5')

# Create your views here.
def index(request):
    context={'a':1}
    return render(request,'index.html',context)
def predictImage(request):
    print(request)
    print(request.POST.dict())
    fileobj=request.FILES['filePath']
    fs=FileSystemStorage()
    filepathname=fs.save(fileobj.name,fileobj)
    filepathname=fs.url(filepathname)
    testimage='.'+filepathname


    img = cv2.imread(testimage)
    resize = tf.image.resize(img, (256, 256))

    yhatnew = model_new.predict(np.expand_dims(resize / 255, 0)).astype(int)
    mapper = {1: "Tree", 0: "Nottree"}
    e=np.vectorize(mapper.get)(yhatnew)


    context = {'filePathName': filepathname,'predictedLabel':e}
    return render(request, 'index.html', context)
def viewDataBase(request):
    import os

    listofImages=os.listdir('./media/')
    listofImagesPath=['./media/'+i for i in listofImages]
    context={'listOfImagesPath':listofImagesPath}
    return render(request,'viewDB.html',context)
