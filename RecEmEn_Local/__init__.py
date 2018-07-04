import os, sys
import speechSub, accesosDB, cloudvisionSub, procestextoSub
from flask import Flask, render_template, request, redirect, url_for, session, escape, current_app
from werkzeug.utils import secure_filename
from datetime import timedelta
from datetime import datetime
import datetime

#para hacer llamadas a submodulos
sys.path.insert(0,os.getcwd())

numsesion=0
activo=False
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
        fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
        if (request.form['activo'] == "true"):
            numsesion = int(accesosDB.ultimaSesion())
            numsesion += 1
            fechaIni = fecha
            activo = True
            accesosDB.grabafechaSesion(numsesion,fecha,fechaIni,activo)
        if (request.form['activo'] == "false"):
            activo = False
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
        if (activo == True):
            fecha = datetime.datetime(anio, mes, dia, hora, minuto, segundo)
            if (request.form['grabando'] == "true"):
                grabando = True
            if (request.form['grabando'] == "false"):
                grabando = False
            accesosDB.grabaConexion(numsesion,IDalum,grabando,fecha,fechaIni)
        return str(numsesion)
    
@app.route('/add_foto', methods=['GET', 'POST'])
def add_foto():
        if request.method == 'POST':
            global activo
            global numsesion
            global fechaIni
            file = request.files['file']
            if (activo == True):
                IDalum=str(request.cookies['IDalumno'])+"_";
                filename = secure_filename(IDalum+file.filename)
                file.save(os.path.join("upload/", filename))
                cloudvisionSub.reconocerGuardar(filename,numsesion,fechaIni)
                os.remove(os.path.join("upload/", filename))
            return ("OK")
        
@app.route('/add_sound', methods=['GET', 'POST'])
def add_sound():
        if request.method == 'POST':
            global activo
            global numsesion
            global fechaIni
            file = request.files['file']
            filename = secure_filename(file.filename)
            file.save(os.path.join("upload/", filename))
            speechSub.reconocerGuardar(filename,numsesion,fechaIni)
            os.remove(os.path.join("upload/", filename))
            os.remove(os.path.join("upload/", filename.replace("wav", "flac")))
            accesosDB.calculaMedias(numsesion,filename,fechaIni)
            datosGrafica = accesosDB.enviaGrafProfe(numsesion,fechaIni)
            return datosGrafica
 
if __name__ == '__main__':
    
    app.run(host='127.0.0.1')
