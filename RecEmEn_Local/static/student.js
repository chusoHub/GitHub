navigator.getUserMedia = navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia;

var canvas, ctx;
var video1, video0;
var grabando = false;

$(window).on('unload', function() {
    if (grabando == true) {
        $.ajax({
            url: '/grabandoAlumno',
            data: {
                'grabando': 'false',
                'anio': d.getFullYear(),
                'mes': mes,
                'dia': d.getUTCDate(),
                'hora': d.getHours(),
                'minuto': d.getMinutes(),
                'segundo': d.getSeconds()
            },
            type: 'POST',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
    }
});

$('#roleEstudiante').click(function() {
    if ($("#roleEstudiante").html() == 'Grabar Imagen') {
        $("#roleEstudiante").html('Parar');
        var d0 = new Date();
        var offset = d0.getTimezoneOffset();
        console.log(offset)
        //milliseconds
        var d = new Date(d0.getTime() + offset * 60 * 1000);
        var mes = parseInt(d.getMonth()) + 1;

        $.ajax({
            url: '/grabandoAlumno',
            data: {
                'grabando': 'true',
                'anio': d.getFullYear(),
                'mes': mes,
                'dia': d.getUTCDate(),
                'hora': d.getHours(),
                'minuto': d.getMinutes(),
                'segundo': d.getSeconds()
            },
            type: 'POST',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        startWebcam();
        grabando = true;
    } else {
        $("#roleEstudiante").html('Grabar Imagen');
        var d0 = new Date();
        var offset = d0.getTimezoneOffset();
        console.log(offset)
        //milliseconds
        var d = new Date(d0.getTime() + offset * 60 * 1000);
        var mes = parseInt(d.getMonth()) + 1;

        $.ajax({
            url: '/grabandoAlumno',
            data: {
                'grabando': 'false',
                'anio': d.getFullYear(),
                'mes': mes,
                'dia': d.getUTCDate(),
                'hora': d.getHours(),
                'minuto': d.getMinutes(),
                'segundo': d.getSeconds()
            },
            type: 'POST',
            success: function(response) {
                console.log(response);
            },
            error: function(error) {
                console.log(error);
            }
        });
        stopWebcam();
        grabando = false;
    };
});

function init() {
    // Get the canvas and obtain a context for
    // drawing in it
    canvas = document.getElementById("myCanvas");
    ctx = canvas.getContext('2d');
}

function startWebcam() {
    if (navigator.getUserMedia) {
        navigator.getUserMedia({
                audio: false,
                video: {
                    width: 1280,
                    height: 720
                }
            },
            function(stream) {
                video0 = document.querySelector('#video0');
                video1 = document.querySelector('#video1');
                video0.srcObject = stream;
                video1.srcObject = stream;
                video0.onloadedmetadata = function(e) {
                    video0.play();
                };
                video1.onloadedmetadata = function(e) {
                    video1.play();
                };
                intervalo = setInterval(function() {
                    snapshot();
                }, 5000);
            },
            function(err) {
                console.log("The following error occurred: " + err.name);
            }
        );
    } else {
        console.log("getUserMedia not supported");
    }
}

function stopWebcam() {
    clearInterval(intervalo);

    let tracks0 = video0.srcObject.getTracks();
    let tracks1 = video1.srcObject.getTracks();

    tracks1.forEach(function(track) {
        track.stop();
    });

    tracks0.forEach(function(track) {
        track.stop();
    });

    video0.srcObject = null;
    video1.srcObject = null;
}

function snapshot() {
    // Draws current image from the video element into the canvas
    ctx.drawImage(video0, 0, 0, canvas.width, canvas.height);
    var d0 = new Date();
    //minutes
    var offset = d0.getTimezoneOffset();
    console.log(offset)
    //milliseconds
    var d = new Date(d0.getTime() + offset * 60 * 1000);
    var mes = parseInt(d.getMonth()) + 1;
    var namefile = 'pic' + "_" + d.getFullYear() + "_" + mes + "_" + d.getUTCDate() + "_" + d.getHours() + "_" + d.getMinutes() + "_" + d.getSeconds() + '.jpg'
    var dataURL = canvas.toDataURL('image/jpg', 1.0);
    var blob = dataURItoBlob(dataURL);
    var fd = new FormData();
    fd.append("file", blob, namefile);
    $.ajax({
        url: '/add_foto',
        data: fd,
        type: 'POST',
        cache: false,
        processData: false,
        contentType: false,
        success: function(response) {
            console.log(response);
        },
        error: function(error) {
            console.log(error);
        }
    });
}

function dataURItoBlob(dataURI) {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0)
        byteString = atob(dataURI.split(',')[1]);
    else
        byteString = unescape(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], {
        type: mimeString
    });
}