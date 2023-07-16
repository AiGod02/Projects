def getmetadata(filename):
    import librosa
    import numpy as np

    y, sr = librosa.load(filename)
    # fetching tempo

    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo = librosa.beat.tempo(y=y, sr=sr)

    # fetching beats

    y_harmonic, y_percussive = librosa.effects.hpss(y)
    tempo, beat_frames = librosa.beat.beat_track(y=y_percussive, sr=sr)

    # chroma_stft

    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr)

    # rmse

    rms = librosa.feature.rms(y=y)

    # fetching spectral centroid

    spec_centroid = librosa.feature.spectral_centroid(y=y, sr=sr)[0]

    # spectral bandwidth

    spec_bw = librosa.feature.spectral_bandwidth(y=y, sr=sr)

    # fetching spectral rolloff

    spec_rolloff = librosa.feature.spectral_rolloff(y=y + 0.01, sr=sr)[0]

    # zero crossing rate

    zero_crossing = librosa.feature.zero_crossing_rate(y)
    # harmonic
    harmonic = librosa.effects.harmonic(y=y)

    C = np.abs(librosa.cqt(y, sr=sr, fmin=librosa.note_to_hz('A1')))

    freqs = librosa.cqt_frequencies(C.shape[0],

                                    fmin=librosa.note_to_hz('A1'))

    perceptual_CQT = librosa.perceptual_weighting(C ** 2,

                                                  freqs,

                                                  ref=np.max)
    length = librosa.get_duration(y=y, sr=sr)
    # mfcc

    mfcc = librosa.feature.mfcc(y=y, sr=sr)

    # metadata dictionary

    metadata_dict = {'length': length, 'chroma_stft_mean': np.mean(chroma_stft), 'chroma_stft_var': np.var(chroma_stft),
                     'rms_mean': np.mean(rms), 'rms_var': np.var(rms),

                     'spectral_centroid_mean': np.mean(spec_centroid), 'spectral_centroid_var': np.var(spec_centroid),
                     'spectral_bandwidth_mean': np.mean(spec_bw),
                     'spectral_bandwidth_var': np.var(spec_bw), 'rolloff_mean': np.mean(spec_rolloff),
                     'rolloff_var': np.var(spec_rolloff), 'zero_crossing_rate_mean': np.mean(zero_crossing),
                     'zero_crossing_rate_var': np.var(zero_crossing), 'harmony_mean': np.mean(harmonic),
                     'harmony_var': np.var(harmonic), 'perceptr_mean': np.mean(perceptual_CQT),
                     'perceptr_var': np.var(perceptual_CQT), 'tempo': tempo}

    for i in range(1, 21):
        metadata_dict.update({'mfcc' + str(i) + '_mean': np.mean(mfcc[i - 1])})
    for i in range(1, 21):
        metadata_dict.update({'mfcc' + str(i) + '-var': np.var(mfcc[i - 1])})
    return list(metadata_dict.values())

