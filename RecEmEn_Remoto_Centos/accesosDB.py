from pymongo import MongoClient
from bson import Binary, Code
from bson import json_util
from bson import ObjectId
from bson.json_util import dumps
from flask import jsonify

import json
import pprint
import datetime


def ultimaSesion():
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    existe = coll.find({'sesion':{'$exists': True}}).count()
    if existe > 0:
        sesion = int(coll.find().sort([('sesion', -1)]).limit(1)[0]["sesion"])
    else:
        sesion = 1
        
    client.close()
    return sesion

def grabafechaSesion(numsesion,fecha,fechaIni,activo):
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    if (activo == True):
        tipo="fechaIni"
    else:
        tipo="fechaFin"
    tiempoSesion= (fecha - fechaIni).total_seconds()
    post = {'sesion':numsesion, 'tipo':tipo, 'date':fecha, 'fechaIni':fechaIni, 'tiempoSesion':tiempoSesion}
    post_id = coll.insert_one(post)
    client.close()

def obtenerID():
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    IDalumno = 0
    existe = coll.find({'IDalumno':{'$exists': True}}).count()
    #cursor= coll.find({'IDalumno':{'$exists': True}}).sort([('IDalumno', -1)])
    #for post in cursor:
    #    print(post)
    if existe > 0:
        IDalumno = int(coll.find({'IDalumno':{'$exists': True}, 'tipo':'cookie'}).sort([('IDalumno', -1)]).limit(1)[0]["IDalumno"])  
    IDalumno += 1
    post = {'tipo':'cookie',"IDalumno": IDalumno}
    #print(existe)
    post_id = coll.insert_one(post)
    #print(post_id)
    client.close()
    return IDalumno

def grabaConexion(numsesion,IDalum,grabando,fecha,fechaIni):
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    tiempoSesion= (fecha - fechaIni).total_seconds()
    tipo = "conexion"
    
    existe = coll.find({'sesion':numsesion, 'IDalumno':IDalum,'conexion':{'$exists': True}}).count()
    if existe > 0:
        conexion = int(coll.find({'sesion':numsesion, 'IDalumno':IDalum}).sort([('conexion', -1)]).limit(1)[0]["conexion"])
    else:
        conexion = 0
        
    if (grabando == True):
        razon="conecta"
        conexion += 1
    else:
        razon="desconecta"
    
    identificador=str(numsesion)+str(IDalum)+str(conexion)
    post = {'sesion':numsesion, 'tipo':tipo, 'IDalumno':IDalum, 'conexion':conexion, 'identificador':identificador, 'razon': razon, 'date':fecha, 'tiempoSesion':tiempoSesion}
    post_id = coll.insert_one(post)
    client.close()


    
def calculaMedias(numsesion,filename,fechaIni,fechahora):
    nombre= filename.split(".")
    nameList=nombre[0].split("_")
    tipo="audio"
    anio=int(nameList[1])
    mes=int(nameList[2])
    dia=int(nameList[3])
    hora=int(nameList[4])
    minuto=int(nameList[5])
    segundo=int(nameList[6])
    fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
    fecha = fechahora
    client = MongoClient()

    db = client.test
    coll = db.tfm

    existe = coll.find({'sesion':numsesion, 'tipo':tipo,'date':{'$lt': fecha}}).count()
    if existe > 0:
        fechaAnt = coll.find({'sesion':numsesion, 'tipo':tipo,'date':{'$lt': fecha}}).sort([('date', -1)]).limit(1)[0]["date"]
    else:
        fechaAnt = fechaIni
  
    existe = coll.find({'sesion':numsesion,'tipo':'medias'}).count()
    print(existe)
    if existe > 0:
        ultimaMedia = coll.find({'sesion':numsesion,'tipo':'medias'}).sort([('tiempoSesion', -1)]).limit(1)[0]
        numAlumnosAnt=ultimaMedia['numAlumnos']
        conexionAnt=ultimaMedia['conexion']
    else:
        numAlumnosAnt=0
        conexionAnt=0

    tiempoSesion =int((fecha - fechaIni).total_seconds())
    numAlumnos = len(coll.distinct( "IDalumno", { 'sesion':numsesion, 'tipo':'pic', 'date':{ "$gte" :fechaAnt} } ))

    if numAlumnos > 0:
        '''
        if numAlumnosAnt > 0:
            conexion = conexionAnt
        else:
            conexion = conexionAnt +1
        '''
        conexion = conexionAnt
        identificador=str(numsesion)+"medias"+str(conexion)  
        pipeline = [
            {"$match":{'sesion':numsesion, 'tipo':'pic', 'date':{ "$gte" :fechaAnt}}}, 
            {"$group":{"_id":'$sesion', "alegria":{"$avg":'$alegria'}, "pena":{"$avg":'$pena'}, "enfado":{"$avg":'$enfado'},"sorpresa":{"$avg":'$sorpresa'}}},
            {"$project" : { "_id":0, "alegria" :1 , "pena" : 1, "enfado" : 1, "sorpresa" : 1}},
            {"$addFields": { 'sesion': numsesion , 'tipo': 'medias' ,'tiempoSesion': tiempoSesion,'numAlumnos': numAlumnos,'conexion':conexion,'identificador':identificador}}
        ]
        lista=list(coll.aggregate(pipeline));
        post=lista[0]
        #print(lista)
        #print(cursor.count())
        
    else:
        '''
        if numAlumnosAnt > 0:
            conexion = conexionAnt +1
        else:
            conexion = conexionAnt
        '''
        conexion = conexionAnt
            
        identificador=str(numsesion)+"medias"+str(conexion)
        post={'sesion': numsesion , 'tipo': 'medias' , 'conexion':conexion, 'identificador':identificador,'tiempoSesion': tiempoSesion, 'numAlumnos': 0,"alegria":0, "pena":0, "enfado":0,"sorpresa":0}
       
    post_id = coll.insert_one(post)
    client.close()


def enviaGrafProfe(numsesion,fechaIni):
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    tiempoSesion=coll.find({"sesion" : numsesion, "tipo" : "audio"}).sort([('tiempoSesion', -1)]).limit(1)[0]["tiempoSesion"]
    #tiempoSesion = (fechaFin - fechaIni).total_seconds()
    
    Ident = coll.distinct( "identificador", { 'sesion': numsesion, "tipo" : { "$in": ["pic","medias"]}, "alegria":{"$ne":0} } )
    Idalum = coll.distinct( "IDalumno", { 'sesion': numsesion, "tipo":"pic" } )
    cursor = coll.find({"sesion" : numsesion, "tipo" : { "$in": ["pic","medias"]}, "alegria":{"$ne":0}})
    datos = json.dumps(json.loads(dumps(cursor), object_hook=json_util.object_hook), cls=APIEncoder)
    datos= datos.replace("_", "")
    respuesta=[{"fechaIni":fechaIni,"tiempoSesion":tiempoSesion,"Identificadores":Ident,"IDalumno":Idalum, "datos":datos}]
    print(respuesta)
    client.close()
    return jsonify(respuesta)

def consultaGrafica(numsesion):
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    registroFin=coll.find({"sesion" : numsesion, "tipo" : "fechaFin", 'date':{'$exists': True}})[0]
    tiempoSesion= registroFin["tiempoSesion"]
    fechaFin= registroFin["date"].strftime("%Y-%m-%d %H:%M:%S")
    fechaIni= registroFin["fechaIni"].strftime("%Y-%m-%d %H:%M:%S")
    
    Ident = coll.distinct( "identificador", { 'sesion': numsesion, "tipo" : { "$in": ["pic","medias"]}, "alegria":{"$ne":0} } )
    Idalum = coll.distinct( "IDalumno", { 'sesion': numsesion, "tipo":"pic" } )
    cursor = coll.find({"sesion" : numsesion, "$or":[{"tipo" : { "$in": ["pic","medias"]}, "alegria":{"$ne":0}},{"tipo" :"tfidf"}]})
    datos = json.dumps(json.loads(dumps(cursor), object_hook=json_util.object_hook), cls=APIEncoder)
    respuesta=[{"fechaIni":fechaIni,"fechaFin":fechaFin,"tiempoSesion":tiempoSesion,"Identificadores":Ident,"IDalumno":Idalum, "datos":datos}]
    print(respuesta)
    client.close()
    return jsonify(respuesta)

def findSesiones():
    client = MongoClient()

    db = client.test
    coll = db.tfm
    
    cursor = coll.find({"tipo" :'fechaFin'},{"_id":0,"sesion":1,"fechaIni":1,"tiempoSesion":1}).sort("sesion",-1)
    #print(json.dumps(json.loads(dumps(cursor), object_hook=json_util.object_hook), cls=APIEncoder))

    respuesta=[]

    for post in cursor:
        respuesta.append({"sesion":post["sesion"], "fechaIni":post["fechaIni"].strftime("%Y-%m-%d %H:%M:%S"),"tiempoSesion":post["tiempoSesion"]})
    client.close()
    print(respuesta)
    return respuesta

    


    
    
'''
pasar a segundos desde 1970 y leer en segundos desde 1970 trabajandoi en UTC
(t-datetime.datetime(1970,1,1)).total_seconds()
datetime.datetime.utcfromtimestamp(1284286794)

Lo soluciono poniendo la hora de my sistema a UTC
'''

class APIEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, datetime.datetime):
            return obj.strftime("%Y-%m-%d %H:%M:%S")
        elif isinstance(obj, ObjectId):
            return str(obj)
        return jsonJSONEncoder.default(obj)

