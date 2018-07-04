import os, sys
import speechSub, accesosDB, cloudvisionSub, procestextoSub
from flask import Flask, render_template, request, redirect, url_for, session, escape, current_app
from OpenSSL import SSL

from werkzeug.utils import secure_filename
from datetime import timedelta
from datetime import datetime
import datetime

#para hacer llamadas a submodulos
sys.path.insert(0,os.getcwd())

file_key = os.path.join(
    os.path.dirname(__file__),
    r"privateKey.key")

file_cert = os.path.join(
    os.path.dirname(__file__),
    r"certificate.crt")

context = SSL.Context(SSL.SSLv23_METHOD)
context = (file_cert, file_key)

numsesion=0
activo=False
os.environ["activo"] = "false"
os.environ["numsesion"] = ""
os.environ["fechaini"] = ""
fechaIni=None

UPLOAD_FOLDER = '/upload'
app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER



@app.route('/')
def rol():
    return render_template('rol.html')

@app.route('/alumno', methods=['GET', 'POST'])
def alumno():
    if request.method == 'POST':
         if ('acepta' in request.form):
            response = current_app.make_response(render_template('alumno.html'))
            IDalum = accesosDB.obtenerID()
            response.set_cookie('IDalumno',str(IDalum))
            return response
         else:
            return render_template('rol.html')
    if ('IDalumno' in request.cookies):
        return render_template('alumno.html')
    else:
        return redirect('/cookies')

@app.route('/cookies')
def cookies():
    return render_template('cookies.html')

@app.route('/profesor')
def profesor():
    numsesion = int(accesosDB.ultimaSesion())
    return render_template('profesor.html',sesion=str(numsesion))

@app.route('/consulta')
def consulta():
    listasesiones = accesosDB.findSesiones()
    return render_template('consulta.html', lista = listasesiones)

@app.route('/consultaGrafica', methods=['GET', 'POST'])
def consultaGrafica():
    if request.method == 'POST':
        sesionSeleccion=int(request.form['sesion'])
        datosGrafica = accesosDB.consultaGrafica(sesionSeleccion)
        return datosGrafica

@app.route('/grabandoProfe', methods=['GET', 'POST'])
def grabandoProfe():
    if request.method == 'POST':
        global activo
        global numsesion
        global fechaIni
        anio=int(request.form['anio'])
        mes=int(request.form['mes'])
        dia=int(request.form['dia'])
        hora=int(request.form['hora'])
        minuto=int(request.form['minuto'])
        segundo=int(request.form['segundo'])
        print(request.form['activo'])
        fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
        fecha = datetime.datetime.now()
        if (request.form['activo'] == "true"):
            numsesion = int(accesosDB.ultimaSesion())
            numsesion += 1
            fechaIni = fecha
            activo = True
            os.environ["activo"] = "true"
            os.environ["numsesion"] = str(numsesion)
            os.environ["fechaini"] = fechaIni.strftime('%Y-%m-%d %H:%M:%S')
            print('grabaprofe')
            print(os.environ["activo"])
            print(os.environ["numsesion"])
            print(os.environ["fechaini"])
            accesosDB.grabafechaSesion(numsesion,fecha,fechaIni,activo)
        if (request.form['activo'] == "false"):
            activo = False
            os.environ["activo"] = "false"
            print(request.form['activo'])
            numsesion = int(os.environ["numsesion"])
            fechaIni = datetime.datetime.strptime(os.environ["fechaini"], '%Y-%m-%d %H:%M:%S')
            accesosDB.grabafechaSesion(numsesion,fecha,fechaIni,activo)
            procestextoSub.tfidf(numsesion)
        return str(numsesion)

@app.route('/grabandoAlumno', methods=['GET', 'POST'])
def grabandoAlumno():
    if request.method == 'POST':
        global activo
        global numsesion
        global fechaIni
        anio=int(request.form['anio'])
        mes=int(request.form['mes'])
        dia=int(request.form['dia'])
        hora=int(request.form['hora'])
        minuto=int(request.form['minuto'])
        segundo=int(request.form['segundo'])
        IDalum=str(request.cookies['IDalumno'])
        #if (activo == True):
        if(os.environ["activo"] == "true"):
            fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
            fecha = datetime.datetime.now()
            if (request.form['grabando'] == "true"):
                grabando = True
            if (request.form['grabando'] == "false"):
                grabando = False
            numsesion = int(os.environ["numsesion"])
            fechaIni = datetime.datetime.strptime(os.environ["fechaini"], '%Y-%m-%d %H:%M:%S')
            accesosDB.grabaConexion(numsesion,IDalum,grabando,fecha,fechaIni)
        return str(numsesion)
    
@app.route('/add_foto', methods=['GET', 'POST'])
def add_foto():
        if request.method == 'POST':
            global activo
            global numsesion
            global fechaIni
            file = request.files['file']
            #if (activo == True):
            print("hola")
            print(os.environ["activo"])
            print(os.environ["numsesion"])
            print(os.environ["fechaini"])
            if(os.environ["activo"] == "true"):
                IDalum=str(request.cookies['IDalumno'])+"_";
                filename = secure_filename(IDalum+file.filename)
                file.save(os.path.join(r"/home/jesus/upload", filename))
                numsesion = int(os.environ["numsesion"])
                fechaIni = datetime.datetime.strptime(os.environ["fechaini"], '%Y-%m-%d %H:%M:%S')
                fechahora = datetime.datetime.now()
                cloudvisionSub.reconocerGuardar(filename,numsesion,fechaIni,fechahora)
                os.remove(os.path.join(r"/home/jesus/upload", filename))
            return ("OK")
        
@app.route('/add_sound', methods=['GET', 'POST'])
def add_sound():
        if request.method == 'POST':
            global activo
            global numsesion
            global fechaIni
            numsesion = int(os.environ["numsesion"])
            fechaIni = datetime.datetime.strptime(os.environ["fechaini"], '%Y-%m-%d %H:%M:%S')
            file = request.files['file']
            filename = secure_filename(file.filename)
            file.save(os.path.join(r"/home/jesus/upload", filename))
            fechahora = datetime.datetime.now()
            speechSub.reconocerGuardar(filename,numsesion,fechaIni,fechahora)
            os.remove(os.path.join(r"/home/jesus/upload/", filename))
            os.remove(os.path.join(r"/home/jesus/upload/", filename.replace("wav", "flac")))
            accesosDB.calculaMedias(numsesion,filename,fechaIni,fechahora)
            datosGrafica = accesosDB.enviaGrafProfe(numsesion,fechaIni)
            return datosGrafica
 
if __name__ == '__main__':
    
    app.run(host='0.0.0.0', ssl_context=context)
