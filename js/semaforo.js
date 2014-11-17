/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
var humedad;
var temperatura;
var viento;
var presion;
var lluvia;
var fecha;
var hora;
var dia;
var mes;
var anio;
var ho;
var mi;
var mediaEva;

 try{var xmlHttp = new XMLHttpRequest()}
     catch (e){var xmlHttp = new ActiveXObject('Microsoft.XMLHTTP')}


function comparaFecha(fecha,hora){
    if (fecha.length===7){ 
                dia=parseInt(fecha.substr(0, 1),10);
                mes=parseInt(fecha.substr(2, 2),10);
                anio=parseInt(fecha.substr(5, 2),10);
       } else {
                dia=parseInt(fecha.substr(0, 2),10);
                mes=parseInt(fecha.substr(3, 2),10);
                anio=parseInt(fecha.substr(6, 2),10);
       } 
    console.log("d="+dia+" m="+mes+" ano="+anio);
    ho=parseInt(hora.substr(0, 2),10);
    mi=parseInt(hora.substr(3, 2),10);
    console.log("ho="+ho+" mi="+mi);
    var fechaActual = new Date(); 
    var diferencia=new Date();
    anio=anio+2000;
    mes=mes-1;
    var fechaFin = new Date(anio,mes,dia,ho,mi);
   // var fechaFin = mm + "/" + dd + "/" + aa;
   console.log("Fechafin="+fechaFin);
    var diferencia= fechaActual.getTime() - fechaFin.getTime();
    var difHoras = Math.floor(diferencia / (1000 * 60 * 60 )); 
    var texto="FA:"+fechaActual+'\nFF:'+fechaFin+'\nDif:'+difHoras;
   console.log(texto);
    if(difHoras<4){ 
                  //alert("paso >3");
                  return true;                 
         } else {  //window.plugins.toast.showLongCenter("La Estación Meteorológica Automática esta Fuera de Servicio");
                 return false;}
      }


function parserHistorico(contenido) {
    filas = contenido.split('\n');
    //console.log(filas);
    //console.log(filas.length);
    
   // alert("long:"+filas.length);
    if(filas.length<25){
        return true;
    }
    numerofila = filas.length - 2;
    ultima = parserHistoricolinea(filas, numerofila);
    mediaEva=mediaEvapo24hs(filas,numerofila);
    fecha=ultima[0];
    if (fecha.length===7){ 
                dia=parseInt(fecha.substr(0, 1),10);
                mes=parseInt(fecha.substr(2, 2),10);
                anio=parseInt(fecha.substr(5, 2),10);
       } else {
                dia=parseInt(fecha.substr(0, 2),10);
                mes=parseInt(fecha.substr(3, 2),10);
                anio=parseInt(fecha.substr(6, 2),10);
       } 
   // alert("d="+dia+" m="+mes+" ano="+anio);
    hora=ultima[1];
    ho=parseInt(hora.substr(0, 2),10);
    mi=parseInt(hora.substr(3, 2),10);
    temperatura = parseFloat(ultima[2]);
    humedad = parseFloat(ultima[5]);
    viento = parseFloat(ultima[10]);
    presion = parseFloat(ultima[16]);
    lluvia = parseFloat(ultima[17])*100;
    for (j = 1; j < 18; j++) {
        ultima = parserHistoricolinea(filas, numerofila - j);
        //console.log(ultima[17]);
        lluvia += parseFloat(ultima[17])*100;
    }

    lluvia = lluvia/100;
}


         /* función que envía la solicitud de parametros al servidor*/
    
        /*    function retornaDatosEma(ema,datos) {
               //var jsonData  = new Array();
                jQuery.support.cors = true;
                $.ajax({
                        async : false,
                        type: 'GET',    
                        url: "http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/"+ema+"?callback=callback",
                        dataType: 'jsonp',
                        //jsonpCallback:'callback',
                        success: function(resultados){
                          emaFS=false;
                          
                          if (comparaFecha(resultados.fecha,resultados.hora)){
                                // la EMA esta dentro de las 4 hs
                                emaFS=false;
                            } else {
                                alert("La Estación Meteorológica Automática esta Fuera de Servicio");
                                emaFS=true;
                            }
                          console.log("emaFS"+emaFS)  ;
                          datos(resultados);
                         },
                         error:function(){
                           emaFS=true;  
                           datos('error'); 
                         }
                    });
                
            }
*/