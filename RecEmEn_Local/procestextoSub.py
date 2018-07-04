from pymongo import MongoClient
from pymongo import MongoClient
from bson import Binary, Code
from bson import json_util

import json
from collections import defaultdict
from collections import Counter
from operator import itemgetter
from math import log
from string import punctuation
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords


def preprocesamiento(text):
    punct = list(punctuation)
    stop = stopwords.words('spanish') + punct
    text=text.lower()
    tokens = word_tokenize(text)
    return [tok for tok in tokens if tok not in stop]

def hacer_idf(corpus):
    df = defaultdict(int)
    for doc in corpus:
        terms=set(doc)  # cada término se representa una única vez
        for term in terms:
            df[term] +=1
    idf = {}
    for term, term_df in df.items():
        idf[term] = 1 +log(len(corpus)/term_df)
    return idf

def palabrasclave(doc, idf):
    tf=Counter(doc)
    tf = {term: tf_value/len(doc)
          for term, tf_value in tf.items()}
    tfidf = {term: tf_value*idf[term]
          for term, tf_value in tf.items()}
    return sorted(tfidf.items(),
                  key=itemgetter(1),
                  reverse=True)[0:4]

def tfidf(numsesion):
    # Bloque 1
    client = MongoClient()
    client = MongoClient('localhost', 27017,
                     username='cliente',
                     password='bhuikayksdhkjwbemnwRSsd.kjcaspoiudcj==',
                     authSource='test',
                     authMechanism='SCRAM-SHA-1')
    db = client.test
    coll = db.tfm

    # Bloque 2
    existe = coll.find({"sesion" : numsesion,  "tipo" : "audio", "datos":{"$ne":""}}).count()
    print(existe)
    print("existe")
    if existe > 0: 
        tiempoSesion=coll.find({"sesion" : numsesion, "tipo" : "audio"}).sort([('tiempoSesion', -1)]).limit(1)[0]["tiempoSesion"]     
        cursor = coll.find({"sesion" : numsesion,  "tipo" : "audio", "datos":{"$ne":""}})
        documentos=[]
        tiempoSesion=[]
        tokens=[]
        keywords=[]
        post=[]
        
        for docs in cursor:
            tiempoSesion.append(docs['tiempoSesion'])
            documentos.append(docs['datos'])
        # Bloque 3
        for i in range(0,len(documentos)):
            print(documentos[i])
            tokens.append(preprocesamiento(documentos[i]))
            
        # Bloque 4
        idf=hacer_idf(tokens)

        # Bloque 5
        for i in range(0,len(tokens)):
            keywords.append(palabrasclave(tokens[i],idf))

        # Bloque 6
        datos=[]
        datos.append("")
        datos.append("")
        datos.append("")
        datos.append("")
        
        for i in range(0,len(keywords)):
            for j in range(0,len(keywords[i])):
                 datos[j]=keywords[i][j][0]
            post.append({'sesion':numsesion, 'tipo':'tfidf', 'dato1': datos[0] , 'dato2': datos[1] , 'dato3': datos[2] , 'dato4': datos[3] ,'tiempoSesion':tiempoSesion[i]})

        post_id = coll.insert(post)

    client.close()
