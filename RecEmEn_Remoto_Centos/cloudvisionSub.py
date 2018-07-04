'''
UNKNOWN	Unknown likelihood.
VERY_UNLIKELY	It is very unlikely that the image belongs to the specified vertical.
UNLIKELY	It is unlikely that the image belongs to the specified vertical.
POSSIBLE	It is possible that the image belongs to the specified vertical.
LIKELY	It is likely that the image belongs to the specified vertical.
VERY_LIKELY	It is very likely that the image belongs to the specified vertical.
'''
from google.cloud import vision
from google.cloud.vision import types
import io
import os
from pymongo import MongoClient
import datetime

def reconocerGuardar(namefile, numsesion, fechaIni, fechahora):
    # Bloque 1
    #os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"C:\Users\Chuser\Desktop\Reconocimiento de Emociones en la Enseñanza\credentialCloud48484.json"
    file_name_cred = os.path.join(
    os.path.dirname(__file__),
    r"static/credentialCloud48484.json")
    os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = file_name_cred

     # Bloque 2 
    client = vision.ImageAnnotatorClient()
    # The name of the image file to annotate

    # Bloque 3
    nombre=r"upload/"
    nombre+=namefile
    file_name = os.path.join(
        os.path.dirname(__file__),
        nombre)

    # Loads the image into memory
    with io.open(file_name, 'rb') as image_file:
        content = image_file.read()

    image = types.Image(content=content)
    print(file_name)
    # Bloque 4
    #response = client.label_detection(image=image)
    response = client.annotate_image({
       'image': image,
       'features': [{'type': vision.enums.Feature.Type.FACE_DETECTION}],
       })
    print(response)
    # Bloque 5
    client = MongoClient()

    db = client.test
    coll = db.tfm
    nombre= namefile.split(".")
    nameList=nombre[0].split("_")
    IDalum=int(nameList[0])
    anio=int(nameList[2])
    mes=int(nameList[3])
    dia=int(nameList[4])
    hora=int(nameList[5])
    minuto=int(nameList[6])
    segundo=int(nameList[7])
    fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
    fecha = fechahora
    tiempoSesion = (fecha - fechaIni).total_seconds()
    
    existe = coll.find({'sesion':numsesion, 'IDalumno':IDalum,'conexion':{'$exists': True}}).count()
    if existe > 0:
        conexion = int(coll.find({'sesion':numsesion, 'IDalumno':IDalum}).sort([('conexion', -1)]).limit(1)[0]["conexion"])
    else:
        conexion = 1

    # Bloque 6
    if (len(response.face_annotations)== 0):
        tipo = "conexion"
        razon = "nodata"
        conexion += 1
        post = {'sesion':numsesion, 'tipo':tipo, 'IDalumno':IDalum, 'conexion':conexion, 'razon': razon, 'date':fecha, 'tiempoSesion':tiempoSesion}
        post_id = coll.insert_one(post)
    
        
    for result in response.face_annotations:
        tipo="pic"
        alegria=result.joy_likelihood
        pena=result.sorrow_likelihood
        enfado=result.anger_likelihood
        sorpresa=result.surprise_likelihood
        identificador=str(numsesion)+tipo+str(IDalum)+str(conexion)
        post = {'sesion':numsesion, 'tipo':tipo, 'IDalumno':IDalum, 'conexion':conexion, 'identificador':identificador, 'alegria': alegria,'pena': pena,'enfado': enfado,'sorpresa': sorpresa,'date':fecha, 'tiempoSesion':tiempoSesion}
        post_id = coll.insert_one(post)
        
    client.close()



'''
for face in response.annotations[0].faces:
   print(face.joy)

for logo in response.annotations[0].logos:
   print(logo.description)
'google'
'github'
'''
'''
import io
import os

# Imports the Google Cloud client library
from google.cloud import vision
from google.cloud.vision import types

# Instantiates a client
client = vision.ImageAnnotatorClient()

# The name of the image file to annotate
file_name = os.path.join(
    os.path.dirname(__file__),
    'C:/Users/Chuser/Desktop/obama2.png')

# Loads the image into memory
with io.open(file_name, 'rb') as image_file:
    content = image_file.read()

image = types.Image(content=content)

# Performs label detection on the image file
response = client.label_detection(image=image)
labels = response.label_annotations

print('Labels:')
for label in labels:
    print(label.description)
'''

    
'''
>>> from google.cloud import vision
>>> client = vision.ImageAnnotatorClient()
>>> response = client.annotate_image({
...   'image': {'source': {'image_uri': 'gs://my-test-bucket/image.jpg'}},
...   'features': [{'type': vision.enums.Feature.Type.FACE_DETECTION}],
... })
>>> len(response.annotations)
2
>>> for face in response.annotations[0].faces:
...     print(face.joy)
Likelihood.VERY_LIKELY
Likelihood.VERY_LIKELY
Likelihood.VERY_LIKELY
>>> for logo in response.annotations[0].logos:
...     print(logo.description)
'google'
'github'








https://console.cloud.google.com/storage/browser/chusobucket?project=advance-engine-191012
https://developers.google.com/apis-explorer/?hl=es#p/vision/v1/vision.images.annotate?fields=responses&_h=3&resource=%257B%250A++%2522requests%2522%253A+%250A++%255B%250A++++%257B%250A++++++%2522image%2522%253A+%250A++++++%257B%250A++++++++%2522source%2522%253A+%250A++++++++%257B%250A++++++++++%2522imageUri%2522%253A+%2522gs%253A%252F%252Fchusobucket%252Fobama2.png%2522%250A++++++++%257D%250A++++++%257D%252C%250A++++++%2522features%2522%253A+%250A++++++%255B%250A++++++++%257B%250A++++++++++%2522type%2522%253A+%2522FACE_DETECTION%2522%250A++++++++%257D%252C%250A++++++++%257B%250A++++++++%257D%250A++++++%255D%250A++++%257D%250A++%255D%250A%257D&
{
  "requests": 
  [
    {
      "image": 
      {
        "source": 
        {
          "imageUri": "gs://chusobucket/obama2.png"
        }
      },
      "features": 
      [
        {
          "type": "FACE_DETECTION"
        },
        {
        }
      ]
    }
  ]
}
'''


"""
[bounding_poly {
  vertices {
    x: 276
    y: 183
  }
  vertices {
    x: 561
    y: 183
  }
  vertices {
    x: 561
    y: 515
  }
  vertices {
    x: 276
    y: 515
  }
}
fd_bounding_poly {
  vertices {
    x: 305
    y: 272
  }
  vertices {
    x: 523
    y: 272
  }
  vertices {
    x: 523
    y: 490
  }
  vertices {
    x: 305
    y: 490
  }
}
landmarks {
  type: LEFT_EYE
  position {
    x: 377.12237548828125
    y: 338.3894348144531
    z: -0.0007016299641691148
  }
}
landmarks {
  type: RIGHT_EYE
  position {
    x: 459.7108459472656
    y: 345.13677978515625
    z: -2.2751529216766357
  }
}
landmarks {
  type: LEFT_OF_LEFT_EYEBROW
  position {
    x: 348.2125244140625
    y: 317.76751708984375
    z: 6.935851097106934
  }
}
landmarks {
  type: RIGHT_OF_LEFT_EYEBROW
  position {
    x: 401.1133728027344
    y: 323.6121826171875
    z: -19.69095802307129
  }
}
landmarks {
  type: LEFT_OF_RIGHT_EYEBROW
  position {
    x: 440.2525329589844
    y: 326.62652587890625
    z: -20.798885345458984
  }
}
landmarks {
  type: RIGHT_OF_RIGHT_EYEBROW
  position {
    x: 493.557373046875
    y: 330.3188781738281
    z: 3.1688666343688965
  }
}
landmarks {
  type: MIDPOINT_BETWEEN_EYES
  position {
    x: 418.918212890625
    y: 341.6053161621094
    z: -19.568904876708984
  }
}
landmarks {
  type: NOSE_TIP
  position {
    x: 414.3005676269531
    y: 394.4632873535156
    z: -38.99134826660156
  }
}
landmarks {
  type: UPPER_LIP
  position {
    x: 412.41229248046875
    y: 422.8302001953125
    z: -15.392487525939941
  }
}
landmarks {
  type: LOWER_LIP
  position {
    x: 410.57977294921875
    y: 455.4622802734375
    z: -5.087759017944336
  }
}
landmarks {
  type: MOUTH_LEFT
  position {
    x: 372.13836669921875
    y: 425.41888427734375
    z: 12.098878860473633
  }
}
landmarks {
  type: MOUTH_RIGHT
  position {
    x: 452.2402648925781
    y: 433.1651611328125
    z: 9.823189735412598
  }
}
landmarks {
  type: MOUTH_CENTER
  position {
    x: 412.7198486328125
    y: 439.06903076171875
    z: -7.030002593994141
  }
}
landmarks {
  type: NOSE_BOTTOM_RIGHT
  position {
    x: 439.3584899902344
    y: 398.9114990234375
    z: -5.608383655548096
  }
}
landmarks {
  type: NOSE_BOTTOM_LEFT
  position {
    x: 389.80511474609375
    y: 396.25048828125
    z: -4.145647048950195
  }
}
landmarks {
  type: NOSE_BOTTOM_CENTER
  position {
    x: 414.0461120605469
    y: 406.4605407714844
    z: -17.647228240966797
  }
}
landmarks {
  type: LEFT_EYE_TOP_BOUNDARY
  position {
    x: 376.3304748535156
    y: 334.5985412597656
    z: -6.360433578491211
  }
}
landmarks {
  type: LEFT_EYE_RIGHT_CORNER
  position {
    x: 393.10693359375
    y: 341.874755859375
    z: 0.022843848913908005
  }
}
landmarks {
  type: LEFT_EYE_BOTTOM_BOUNDARY
  position {
    x: 375.8148498535156
    y: 344.8191223144531
    z: -0.04445789009332657
  }
}
landmarks {
  type: LEFT_EYE_LEFT_CORNER
  position {
    x: 359.2690734863281
    y: 338.1783752441406
    z: 8.456012725830078
  }
}
landmarks {
  type: LEFT_EYE_PUPIL
  position {
    x: 374.5869445800781
    y: 340.032958984375
    z: -2.088315963745117
  }
}
landmarks {
  type: RIGHT_EYE_TOP_BOUNDARY
  position {
    x: 462.3820495605469
    y: 341.3447265625
    z: -8.713495254516602
  }
}
landmarks {
  type: RIGHT_EYE_RIGHT_CORNER
  position {
    x: 478.9416809082031
    y: 347.4906311035156
    z: 5.072975158691406
  }
}
landmarks {
  type: RIGHT_EYE_BOTTOM_BOUNDARY
  position {
    x: 460.61322021484375
    y: 352.16748046875
    z: -2.380582094192505
  }
}
landmarks {
  type: RIGHT_EYE_LEFT_CORNER
  position {
    x: 443.9153137207031
    y: 346.7323303222656
    z: -1.3612133264541626
  }
}
landmarks {
  type: RIGHT_EYE_PUPIL
  position {
    x: 462.96612548828125
    y: 347.0175476074219
    z: -4.632290363311768
  }
}
landmarks {
  type: LEFT_EYEBROW_UPPER_MIDPOINT
  position {
    x: 374.4063720703125
    y: 310.0869140625
    z: -13.518686294555664
  }
}
landmarks {
  type: RIGHT_EYEBROW_UPPER_MIDPOINT
  position {
    x: 467.8057861328125
    y: 317.4305419921875
    z: -16.100910186767578
  }
}
landmarks {
  type: LEFT_EAR_TRAGION
  position {
    x: 322.10247802734375
    y: 365.7123718261719
    z: 112.4316177368164
  }
}
landmarks {
  type: RIGHT_EAR_TRAGION
  position {
    x: 517.8045043945312
    y: 381.01446533203125
    z: 107.34221649169922
  }
}
landmarks {
  type: FOREHEAD_GLABELLA
  position {
    x: 420.0701904296875
    y: 324.01141357421875
    z: -23.646024703979492
  }
}
landmarks {
  type: CHIN_GNATHION
  position {
    x: 408.01519775390625
    y: 489.8136901855469
    z: 10.82774543762207
  }
}
landmarks {
  type: CHIN_LEFT_GONION
  position {
    x: 325.9984436035156
    y: 425.3343811035156
    z: 83.63182067871094
  }
}
landmarks {
  type: CHIN_RIGHT_GONION
  position {
    x: 502.85711669921875
    y: 439.12811279296875
    z: 78.81409454345703
  }
}
roll_angle: 4.282350540161133
pan_angle: -1.5618544816970825
tilt_angle: -6.503391265869141
detection_confidence: 0.9971544742584229
landmarking_confidence: 0.7923771739006042
joy_likelihood: VERY_LIKELY
sorrow_likelihood: VERY_UNLIKELY
anger_likelihood: VERY_UNLIKELY
surprise_likelihood: VERY_UNLIKELY
under_exposed_likelihood: VERY_UNLIKELY
blurred_likelihood: VERY_UNLIKELY
headwear_likelihood: UNLIKELY
]
"""
