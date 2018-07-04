var fechaIni;
var fechaFin;

//Variables para la gráfica
var fechaIni;
var tiempoSesion;
var Identificadores = [];
var IDalumnos = [];
var datos = [];
var datosRadar;
var medias = [];
var tfidf = [];
var pic = [];
var tiempo;
var ordenacion;
var width;
var height;

var mediasActual = [];
var picActual = [];
var tfidfActual = [];

var orden = {
    sesAsc: 0,
    sesDesc: 1,
    fechAsc: 2,
    fechDesc: 3,
    duraAsc: 4,
    duraDesc: 5
};
var ordenacion = orden.sesDesc;
$("#sesionB").click(function() {
    if (ordenacion == orden.sesDesc) {
        ordenacion = orden.sesAsc;
    } else {
        ordenacion = orden.sesDesc;
    }
    pintaListSes()
});

$("#fechB").click(function() {
    if (ordenacion == orden.fechDesc) {
        ordenacion = orden.fechAsc;
    } else {
        ordenacion = orden.fechDesc;
    }
    pintaListSes()
});
$("#duraB").click(function() {
    if (ordenacion == orden.duraDesc) {
        ordenacion = orden.duraAsc;
    } else {
        ordenacion = orden.duraDesc;
    }
    pintaListSes()
});

function pintaListSes() {
    switch (ordenacion) {
        case orden.sesAsc:
            ArraySesiones = _.orderBy(ArraySesiones, ['sesiones'], ['asc']);
            break;
        case orden.sesDesc:
            ArraySesiones = _.orderBy(ArraySesiones, ['sesiones'], ['desc']);
            break;
        case orden.fechAsc:
            ArraySesiones = _.orderBy(ArraySesiones, ['fechaIni'], ['asc']);
            break;
        case orden.fechDesc:
            ArraySesiones = _.orderBy(ArraySesiones, ['fechaIni'], ['desc']);
            break;
        case orden.duraAsc:
            ArraySesiones = _.orderBy(ArraySesiones, ['tiempoSesion'], ['asc']);
            break;
        case orden.duraDesc:
            ArraySesiones = _.orderBy(ArraySesiones, ['tiempoSesion'], ['desc']);
            break;
        default:
            ArraySesiones = _.orderBy(ArraySesiones, ['sesiones'], ['desc']);
    }
    codigo = "";
    for (var i = 0; i < ArraySesiones.length; i++) {
        codigo += '<button id="' + ArraySesiones[i].sesiones + '" type="button" class="botonListaSesion list-group-item list-group-item-action pl-0 pr-0"><div class="row  "><span class="col-4 text-center pl-0 pr-0">N<sup>o</sup> ' + ArraySesiones[i].sesiones + '</span><span class="col-4  text-center pl-0 pr-0">' + ArraySesiones[i].fechaIni + '</span><span class="col-4 text-center pl-0 pr-0">' + ArraySesiones[i].tiempoSesion + '</span></div></button>'
    }
    $("#ListaSesiones").html(codigo);

    $(".botonListaSesion").click(function() {
        $.ajax({
            url: '/consultaGrafica',
            data: {
                'sesion': this.id
            },
            type: 'POST',
            success: function(response) {
                console.log(response);
                parsearYrepresentar(response); //representa datos de llegada
            },
            error: function(error) {
                console.log(response);
            }
        });
        $('#MyCollapse').collapse('hide')
        $("#divses").html("Sesi&oacute;n: " + this.id);
        $("#divnum").html("N<sup>o</sup> alumnos actual: 0");
        $('#tiempoRange').prop('max', '0');
        $('#tiempoRange').val('0');
        $("#divtiempo").html("Tiempo actual (s): 0");
        $("#text1").html("null");
        $("#text2").html("null");
        $("#text3").html("null");
        $("#text4").html("null");
        d3.selectAll("[valor0='LineaTiempo']").attr("transform", "translate(0)");
    });

}

//var respuesta = [{'fechaIni': "2018-04-26 11:10:03", 'tiempoSesion': 160.0, 'Identificadores': ['2pic31', '2pic41', '2medias1', '2pic38', '2pic39', '2pic313'], 'IDalumno': [3, 4], 'datos': '[{"id": "5ae1b38f66f50f2050f72929", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 1, "pena": 2, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:04", "tiempoSesion": 1.0}, {"id": "5ae1b39166f50f2050f7292c", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:06", "tiempoSesion": 3.0}, {"id": "5ae1b39466f50f2050f72932", "alegria": 1.0, "pena": 1.5, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 5, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b39666f50f2050f72937", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 1, "pena": 2, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:09", "tiempoSesion": 6.0}, {"id": "5ae1b39866f50f2050f7293a", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:11", "tiempoSesion": 8.0}, {"id": "5ae1b39a66f50f2050f72940", "alegria": 1.0, "pena": 1.5, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 10, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b39c66f50f2050f72945", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 1, "pena": 2, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:14", "tiempoSesion": 11.0}, {"id": "5ae1b39f66f50f2050f72948", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:16", "tiempoSesion": 13.0}, {"id": "5ae1b3a166f50f2050f7294e", "alegria": 1.0, "pena": 1.5, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 15, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3a366f50f2050f72953", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:19", "tiempoSesion": 16.0}, {"id": "5ae1b3a666f50f2050f72956", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:21", "tiempoSesion": 18.0}, {"id": "5ae1b3a866f50f2050f7295c", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 20, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3aa66f50f2050f72961", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:24", "tiempoSesion": 21.0}, {"id": "5ae1b3ac66f50f2050f72964", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 2, "date": "2018-04-26 11:10:26", "tiempoSesion": 23.0}, {"id": "5ae1b3af66f50f2050f7296a", "alegria": 5.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.5, "sesion": 2, "tipo": "medias", "tiempoSesion": 25, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3b066f50f2050f7296f", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 1, "identificador": "2pic31", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:29", "tiempoSesion": 26.0}, {"id": "5ae1b3b266f50f2050f72972", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:31", "tiempoSesion": 28.0}, {"id": "5ae1b3b566f50f2050f72978", "alegria": 5.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 30, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3b866f50f2050f72980", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 3, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:10:36", "tiempoSesion": 33.0}, {"id": "5ae1b3bb66f50f2050f72986", "alegria": 3.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 35, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3bf66f50f2050f7298e", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 5, "date": "2018-04-26 11:10:41", "tiempoSesion": 38.0}, {"id": "5ae1b3c166f50f2050f72994", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 5.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 40, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3c466f50f2050f7299c", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 5, "date": "2018-04-26 11:10:46", "tiempoSesion": 43.0}, {"id": "5ae1b3c766f50f2050f729a2", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 5.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 45, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3ca66f50f2050f729aa", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 5, "date": "2018-04-26 11:10:51", "tiempoSesion": 48.0}, {"id": "5ae1b3cd66f50f2050f729b0", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 5.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 50, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3d166f50f2050f729b8", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 2, "date": "2018-04-26 11:10:56", "tiempoSesion": 53.0}, {"id": "5ae1b3d366f50f2050f729be", "alegria": 5.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 2.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 55, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3d766f50f2050f729c6", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:01", "tiempoSesion": 58.0}, {"id": "5ae1b3da66f50f2050f729cc", "alegria": 5.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 60, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3de66f50f2050f729d4", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:06", "tiempoSesion": 63.0}, {"id": "5ae1b3e066f50f2050f729da", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 65, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3e266f50f2050f729df", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 8, "identificador": "2pic38", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:09", "tiempoSesion": 66.0}, {"id": "5ae1b3e466f50f2050f729e2", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:11", "tiempoSesion": 68.0}, {"id": "5ae1b3e866f50f2050f729eb", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 70, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3ea66f50f2050f729f0", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 9, "identificador": "2pic39", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:19", "tiempoSesion": 76.0}, {"id": "5ae1b3ec66f50f2050f729f3", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:16", "tiempoSesion": 73.0}, {"id": "5ae1b3ee66f50f2050f729f9", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 75, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3f266f50f2050f72a01", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:21", "tiempoSesion": 78.0}, {"id": "5ae1b3f466f50f2050f72a07", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 80, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3f766f50f2050f72a0f", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:26", "tiempoSesion": 83.0}, {"id": "5ae1b3fc66f50f2050f72a18", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 85, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b3ff66f50f2050f72a20", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:31", "tiempoSesion": 88.0}, {"id": "5ae1b40266f50f2050f72a26", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 90, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b40466f50f2050f72a2b", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 4, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:44", "tiempoSesion": 101.0}, {"id": "5ae1b40666f50f2050f72a2e", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:36", "tiempoSesion": 93.0}, {"id": "5ae1b40966f50f2050f72a34", "alegria": 2.5, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 95, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b40b66f50f2050f72a39", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 4, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:49", "tiempoSesion": 106.0}, {"id": "5ae1b40d66f50f2050f72a3f", "alegria": 4.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 100, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b40f66f50f2050f72a44", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:54", "tiempoSesion": 111.0}, {"id": "5ae1b41166f50f2050f72a47", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:11:44", "tiempoSesion": 101.0}, {"id": "5ae1b41366f50f2050f72a4a", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 2, "date": "2018-04-26 11:11:59", "tiempoSesion": 116.0}, {"id": "5ae1b41566f50f2050f72a50", "alegria": 3.8, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.2, "sesion": 2, "tipo": "medias", "tiempoSesion": 105, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b41766f50f2050f72a58", "alegria": 3.3333333333333335, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.3333333333333333, "sesion": 2, "tipo": "medias", "tiempoSesion": 110, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b41966f50f2050f72a5d", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 2, "date": "2018-04-26 11:12:04", "tiempoSesion": 121.0}, {"id": "5ae1b41c66f50f2050f72a63", "alegria": 2.3333333333333335, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.6666666666666667, "sesion": 2, "tipo": "medias", "tiempoSesion": 115, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b41e66f50f2050f72a6b", "alegria": 1.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 2.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 120, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b42066f50f2050f72a70", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:09", "tiempoSesion": 126.0}, {"id": "5ae1b42266f50f2050f72a73", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 5, "date": "2018-04-26 11:12:03", "tiempoSesion": 120.0}, {"id": "5ae1b42466f50f2050f72a76", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:14", "tiempoSesion": 131.0}, {"id": "5ae1b42666f50f2050f72a7c", "alegria": 2.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 2.25, "sesion": 2, "tipo": "medias", "tiempoSesion": 125, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b42866f50f2050f72a81", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:19", "tiempoSesion": 136.0}, {"id": "5ae1b42a66f50f2050f72a87", "alegria": 2.3333333333333335, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 130, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b42d66f50f2050f72a8f", "alegria": 3.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 135, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b42f66f50f2050f72a94", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 2, "date": "2018-04-26 11:12:24", "tiempoSesion": 141.0}, {"id": "5ae1b43066f50f2050f72a97", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:21", "tiempoSesion": 138.0}, {"id": "5ae1b43266f50f2050f72a9a", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 2, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:29", "tiempoSesion": 146.0}, {"id": "5ae1b43666f50f2050f72aa0", "alegria": 3.25, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.25, "sesion": 2, "tipo": "medias", "tiempoSesion": 140, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b43866f50f2050f72aa8", "alegria": 3.5, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.5, "sesion": 2, "tipo": "medias", "tiempoSesion": 145, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b43a66f50f2050f72aad", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:34", "tiempoSesion": 151.0}, {"id": "5ae1b43c66f50f2050f72ab3", "alegria": 3.5, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 150, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b43e66f50f2050f72ab8", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:39", "tiempoSesion": 156.0}, {"id": "5ae1b44166f50f2050f72abe", "alegria": 5.0, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 155, "numAlumnos": 1, "conexion": 1, "identificador": "2medias1"}, {"id": "5ae1b44366f50f2050f72ac3", "sesion": 2, "tipo": "pic", "IDalumno": 3, "conexion": 13, "identificador": "2pic313", "alegria": 1, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:44", "tiempoSesion": 161.0}, {"id": "5ae1b44566f50f2050f72ac6", "sesion": 2, "tipo": "pic", "IDalumno": 4, "conexion": 1, "identificador": "2pic41", "alegria": 5, "pena": 1, "enfado": 1, "sorpresa": 1, "date": "2018-04-26 11:12:40", "tiempoSesion": 157.0}, {"id": "5ae1b44766f50f2050f72acc", "alegria": 3.6666666666666665, "pena": 1.0, "enfado": 1.0, "sorpresa": 1.0, "sesion": 2, "tipo": "medias", "tiempoSesion": 160, "numAlumnos": 2, "conexion": 1, "identificador": "2medias1"}]'}];
var respuesta = [{
    'fechaIni': "2018-04-26 11:10:03",
    'tiempoSesion': 1.0,
    'Identificadores': [],
    'IDalumno': [],
    'datos': []
}];
//representación inicial
parsearYrepresentar(respuesta);

$(function() {
    $('#MyCollapse').collapse('show');
})
$(".botonListaSesion").click(function() {
    $.ajax({
        url: '/consultaGrafica',
        data: {
            'sesion': this.id
        },
        type: 'POST',
        success: function(response) {
            console.log(response);
            parsearYrepresentar(response); //representa datos de llegada
        },
        error: function(error) {
            console.log(response);
        }
    });
    $('#MyCollapse').collapse('hide')
    $("#divses").html("Sesi&oacute;n: " + this.id);
    $("#divnum").html("N<sup>o</sup> alumnos actual: 0");
    $('#tiempoRange').prop('max', '0');
    $('#tiempoRange').val('0');
    $("#divtiempo").html("Tiempo actual (s): 0");
    $("#text1").html("null");
    $("#text2").html("null");
    $("#text3").html("null");
    $("#text4").html("null");
    d3.selectAll("[valor0='LineaTiempo']").attr("transform", "translate(0)");
});

function parsear(response) {
    fechaIni = response[0]["fechaIni"]
    fechaFin = response[0]["fechaFin"]
    tiempoSesion = response[0]["tiempoSesion"]
    Identificadores = response[0]["Identificadores"]
    IDalumnos = response[0]["IDalumno"]
    datos = JSON.parse(response[0]["datos"])
    medias = _.filter(datos, {
        "tipo": "medias"
    });
    pics = _.filter(datos, {
        "tipo": "pic"
    });
    audio = _.filter(datos, {
        "tipo": "audio"
    });

}

//Represesntación gráfica
function parsearYrepresentar(response) {
    medias = [];
    tfidf = [];
    pic = [];
    fechaIni = response[0]["fechaIni"]
    tiempoSesion = response[0]["tiempoSesion"]
    Identificadores = response[0]["Identificadores"]
    IDalumnos = response[0]["IDalumno"]
    datos = response[0]["datos"]
    $('#tiempoRange').prop('max', tiempoSesion);
    tiempo = 0;
    if (datos.length > 0) {
        datos = JSON.parse(datos)
        tfidf = _.filter(datos, {
            "tipo": "tfidf"
        });
        console.log(tfidf)
    }
    //filtra para recoger documentos del json por cada tipo
    if (Identificadores.length > 0) {
        medias = _.filter(datos, {
            "tipo": "medias"
        });
        pics = _.filter(datos, {
            "tipo": "pic"
        });

        $("#divnum").html("N<sup>o</sup> alumnos actual: 0");

        medias = _.orderBy(medias, ['tiempoSesion'], ['desc']);

    }

    //representa gráficas
    representa("#graphDiv1", "alegria", "Alegría");
    representa("#graphDiv2", "sorpresa", "Sorpresa");
    representa("#graphDiv3", "pena", "Pena");
    representa("#graphDiv4", "enfado", "Enfado");
    datosRadar = [ //si no hay datos
        [{
                "area": "Alegría ",
                "value": 1
            },
            {
                "area": "Enfado ",
                "value": 1
            },
            {
                "area": "Pena ",
                "value": 1
            },

            {
                "area": "Sorpresa",
                "value": 1
            }
        ]
    ]
    representaradar();

}

function representa(contenedor, propiedad, titulo) {

    width = $(contenedor).width() - 100;
    height = 100;
    var margin = {
        top: 40,
        bottom: 30,
        left: 50,
        right: 30
    };

    d3.select(contenedor + " svg").remove();
    var svg = d3.select(contenedor)
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom);

    var container = svg
        .append("g")
        .attr("transform", "translate(" + margin.left + ", " + margin.top + ")");

    var xScale = d3.scaleLinear()
        .domain([1, tiempoSesion])
        .range([0, width]);

    var yScale = d3.scaleLinear()
        .domain([5, 1])
        .range([0, height]);

    var xAxis = d3.axisBottom(xScale)
        .ticks(10);
    //.style("stroke-width","0");

    var yAxis = d3.axisLeft(yScale)
        .ticks(5);

    //pinta eje X
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + (margin.top + height) + ")")
        .attr("class", "axisColor")
        .style("stroke-width", "0")
        .call(xAxis);

    //pinta eje Y
    svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .attr("class", "axisColor")
        .style("stroke-opacity", 0.25)
        .call(yAxis);

    //función para pintar las líneas de la rejilla
    var lineFunctionSist = d3.line()
        .x(function(d) {
            return d[0];
        })
        .y(function(d) {
            return yScale(d[1]);
        })
        .curve(d3.curveLinear);

    var LineaTiempo = [
        [0, 1],
        [0, 5]
    ];
    container.append('path')
        .style("stroke-width", "10")
        .style("stroke", "rgb(0, 0, 0)")
        .style("stroke-opacity", 0.3)
        .attr("valor0", "LineaTiempo")
        .datum(LineaTiempo)
        .attr('d', lineFunctionSist);

    //pinta las líneas de la rejilla
    var Rejilla = [
        [0, 1.05],
        [width, 1.05]
    ];
    for (var i = 0; i < 5; i++) {
        container.append('path')
            .style("stroke-width", "0.1")
            .style("stroke", "rgb(0, 0, 0)")
            .style("stroke-opacity", 0.75)
            .datum(Rejilla)
            .attr('d', lineFunctionSist);
        Rejilla = [
            [0, 1.98 + i],
            [width, 1.98 + i]
        ];
    };

    //escribe el título de cada gráfica de líneas
    svg.append("text")
        .attr("x", margin.left)
        .attr("y", margin.top / 2)
        .attr("class", "font-weight-light")
        .style("font-size", "1.5em")
        .text(titulo);

    //escribe 'medias' en cada gráfica de líneas
    svg.append("text")
        .attr("x", margin.left + 100)
        .attr("y", margin.top / 2)
        .attr("fill", "#428bca")
        .style("font-size", "1em")
        .text("Media");

    //función para pintar las líneas de las gráficas más adelante con los datos
    var lineFunction = d3.line()
        .x(function(d) {
            return xScale(d.tiempoSesion);
        })
        .y(function(d) {
            return yScale(eval("d." + propiedad));
        })
        .curve(d3.curveLinear)

    if (Identificadores.length > 0) { //Si vienen datos
        //pinta gáfica por cada lína diferente que venga // pueden venr líneas diferentes por cada alumno // cada línea se identifica con los 'Identificadores'
        for (var index = 0; index < Identificadores.length; index++) {

            datosfilatrados = _.filter(datos, {
                "identificador": Identificadores[index]
            });
			
			datosfilatrados = _.orderBy(datosfilatrados, ['tiempoSesion'], ['asc']);
			
            tipo = _.filter(datosfilatrados, {
                "identificador": Identificadores[index]
            })[0]["tipo"];
            var ID;

            var color;
            var anchoLinea;
            var anchoLineax2;
            var opacidad;
            var funcionColor = d3.scaleOrdinal().domain(d3.extent(pics, function(d) {
                return d.IDalumno;
            })).range(["#6F257F", "#CA0D59"]);
            if (tipo == "pic") {
                //color=funcionColor(_.filter(datosfilatrados, { "identificador": Identificadores[index]})[0]["IDalumno"]);
                color = d3.interpolateWarm(_.filter(datosfilatrados, {
                    "identificador": Identificadores[index]
                })[0]["IDalumno"] / d3.max(pics, function(d) {
                    return d.IDalumno; //el color depende del alumno no del identificador
                }) / 2);
                ID = _.filter(datosfilatrados, {
                    "identificador": Identificadores[index]
                })[0]["IDalumno"];
                anchoLinea = "2px";
                anchoLineax2 = "4px";
                opacidad = 0.5;
            }

            if (tipo == "medias") {
                ID = "medias";
                color = "rgb(66,139,202)"; //las medias en azul y con mayor ancho
                anchoLinea = "3px";
                anchoLineax2 = "5px";
                opacidad = 0.75;
            }

            //líneas
            container.append("path")
                .style("fill", "none")
                .style("stroke", color)
                .style("stroke-width", anchoLinea)
                .style("stroke-opacity", opacidad)
                .attr("valor1", ID) //se crea el atributo valor1 para identificar todas las líneas del mismo alumno
                .attr("valor2", Identificadores[index]) //se crea el atributo valor para identificar su identificador dinámicamente en un tootltip de prueba ahora oculto
                .attr("anchoL", anchoLinea)
                .attr("anchoL2", anchoLineax2)
                .attr("d", function(d, i) {
                    return lineFunction(datosfilatrados);
                })
                .on("mouseout", function() { //cuando se va vuelve a las condicines iniciales
                    d3.selectAll("[valor1='" + d3.select(this).attr("valor1") + "']").style("stroke-width", d3.select(this).attr("anchoL"))
                })
                .on("mouseover", function() { //uando entra se seleccionan todas las líneas del mismo Alumno gracias al atributo valor1
                    d3.selectAll("[valor1='" + d3.select(this).attr("valor1") + "']").style("stroke-width", d3.select(this).attr("anchoL2"))
                    /*d3.select("#tooltip").html("<span style='color: #93d2c7'>" + d3.select(this).attr("valor1") + "<br></span>" + "<span style='color: #93d2c7'>" + d3.select(this).attr("valor2") + "</span>")
                        .transition()
                        .duration(450)
                        .style("opacity", 1);*/
                });

            //puntos
            container
                .selectAll(".circle")
                .data(datosfilatrados)
                .enter()
                .append("circle")
                .classed("circle", false)
                .attr("cx", d => xScale(d.tiempoSesion))
                .attr("cy", d => yScale(eval("d." + propiedad)))
                .attr("r", "1.5")
                .attr("fill", color);

        }
    }
}

//Representación gráfica de radar
function representaradar() { //muestra el último registro de medias

    d3.select("#graphPolar svg").remove();

    // Config for the Radar chart
    var config = {
        w: 230,
        h: 230,
        maxValue: 5,
        levels: 5,
        ExtraWidthX: 220,
        ExtraWidthY: 80,
    }

    RadarChart.draw("#graphPolar", datosRadar, config);

    var svg = d3.select('graphPolar')
        .selectAll('svg')
        .append('svg')
        .attr("width", width)
        .attr("height", height);

}

/*
$(window).resize(function() { //vuelve a pintar todo
    representa("#graphDiv1", "alegria", "Alegría");
    representa("#graphDiv2", "sorpresa", "Sorpresa");
    representa("#graphDiv3", "pena", "Pena");
    representa("#graphDiv4", "enfado", "Enfado");
    interaccionTiempo();
});
*/

$(document).on('input', '#tiempoRange', function() {
    tiempo = $(this).val();
    interaccionTiempo();

});

function interaccionTiempo() {
    mediasActual = [];
    picActual = [];
    tfidfActual = [];
    $("#divtiempo").html("Tiempo actual (s): " + tiempo);

    var EscalaTiempo = d3.scaleLinear()
        .domain([0, tiempoSesion])
        .range([0, width]);
    d3.selectAll("[valor0='LineaTiempo']").attr("transform", "translate(" + EscalaTiempo(tiempo) + ")");

    if (tfidf.length > 0) {
        tfidfActual = _.filter(tfidf, (d) => d.tiempoSesion < (parseInt(tiempo)+7));
        tfidfActual = _.orderBy(tfidfActual, ['tiempoSesion'], ['desc']);
    }

        $("#text1").html("null");
        $("#text2").html("null");
        $("#text3").html("null");
        $("#text4").html("null");
		
    if (tfidfActual.length > 0) {
        $("#text1").html(tfidfActual[0].dato1);
        $("#text2").html(tfidfActual[0].dato2);
        $("#text3").html(tfidfActual[0].dato3);
        $("#text4").html(tfidfActual[0].dato4);
    } 

    if (medias.length > 0) {
        mediasActual = _.filter(medias, (d) => d.tiempoSesion < tiempo);
        mediasActual = _.orderBy(mediasActual, ['tiempoSesion'], ['desc']);
    }

    if (mediasActual.length > 0) {

        $("#divnum").html("N<sup>o</sup> alumnos actual: " + mediasActual[0].numAlumnos);
        datosRadar = [
            [{
                    "area": "Alegría ",
                    "value": mediasActual[0].alegria
                },
                {
                    "area": "Enfado ",
                    "value": mediasActual[0].enfado
                },
                {
                    "area": "Pena ",
                    "value": mediasActual[0].pena
                },

                {
                    "area": "Sorpresa",
                    "value": mediasActual[0].sorpresa
                }
            ]
        ];
    } else {
        $("#divnum").html("N<sup>o</sup> alumnos actual: 0");
        datosRadar = [
            [{
                    "area": "Alegría ",
                    "value": 1
                },
                {
                    "area": "Enfado ",
                    "value": 1
                },
                {
                    "area": "Pena ",
                    "value": 1
                },

                {
                    "area": "Sorpresa",
                    "value": 1
                }
            ]
        ];
    }
    representaradar();
}