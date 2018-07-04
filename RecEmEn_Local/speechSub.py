import io
import os

# Imports the Google Cloud client library
from google.cloud import speech
from google.cloud.speech import enums
from google.cloud.speech import types
from pymongo import MongoClient
import datetime
import ffmpy


def reconocerGuardar(namefile, numsesion, fechaIni):   
    # Bloque 1
    #os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\Chuser\Desktop\Reconocimiento de Emociones en la Enseñanza\MyProject48484.json"
    file_name_cred = os.path.join(
    os.path.dirname(__file__),
    "static\\MyProject48484.json")
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = file_name_cred

    # Bloque 2
    # Instantiates a client
    client = speech.SpeechClient()

    # Bloque 3
    nombre= namefile.split(".")
    nombreini="upload\\"
    nombreini+=nombre[0]
    nombrefin=nombreini
    nombreini+=".wav"
    nombrefin+=".flac"
    # The name of the audio file to transcribe
    file_name = os.path.join(
        os.path.dirname(__file__),
        nombreini)
  
    file_name2 = os.path.join(
        os.path.dirname(__file__),
       nombrefin)

    # Bloque 4
    if os.path.isfile(file_name2): 
        os.remove(file_name2)
    ff = ffmpy.FFmpeg(inputs={file_name: None},outputs={file_name2: None})
    ff.run()

    # Bloque 5
    # Loads the audio into memory
    with io.open(file_name2, 'rb') as audio_file:
        content = audio_file.read()
        audio = types.RecognitionAudio(content=content)

    config = types.RecognitionConfig(
        encoding=enums.RecognitionConfig.AudioEncoding.FLAC,
        sample_rate_hertz=48000,
        language_code='es-ES')

    # Bloque 6
    # Detects speech in the audio file
    response = client.recognize(config, audio)

    # Bloque 7
    client = MongoClient()
    client = MongoClient('localhost', 27017,
                     username='cliente',
                     password='bhuikayksdhkjwbemnwRSsd.kjcaspoiudcj==',
                     authSource='test',
                     authMechanism='SCRAM-SHA-1')
    db = client.test
    coll = db.tfm
    nameList=nombre[0].split("_")
    tipo="audio"
    anio=int(nameList[1])
    mes=int(nameList[2])
    dia=int(nameList[3])
    hora=int(nameList[4])
    minuto=int(nameList[5])
    segundo=int(nameList[6])
    fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
    tiempoSesion = (fecha - fechaIni).total_seconds()

    datos=""
    if (len(response.results)> 0):
        for result in response.results:
            datos += str(result.alternatives[0].transcript)

    post = {'sesion':numsesion, 'tipo':tipo, 'datos': datos ,'date':fecha, 'tiempoSesion':tiempoSesion}
    post_id = coll.insert_one(post)

    client.close()

    



