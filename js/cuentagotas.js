/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

    function isOffline() {
                     //  alert ('Su dispositivo móvil esta fuera de línea');
                       document.getElementById('net').className = 'estado no'; //pone la cruz roja de sin red
                       //carga los datos de evaporacion media segun tabla
                       hayRed=false;
                       
                   }
    function isOnline() {
        //    alert ('Su dispositivo móvil esta en línea');
            document.getElementById('net').className = 'estado ok'; //pone el tilde verde
            hayRed=true;
            //Accede a la geolocalizacion por GPS o Red
            //si se puede geolocalizar ir a onSuccessGPS en geo.js
            navigator.geolocation.getCurrentPosition(onSuccessGPS,onErrorGPS); 
            
//            if (navigator.geolocation) {
//                    navigator.geolocation.getCurrentPosition(onSuccessGPS,onErrorGPS,{ maximumAge: 100, timeout: 6000, enableHighAccuracy: true});
//                } else {
//                    alert('No se puede geolocalizar');
//                    onErrorGPS();
//                }
        }
        
    function resultado(){
        document.getElementById('resul').innerHTML = document.getElementById('esta').selectedIndex;
    } 
     
    function seleccion(){
               // obtiene los datos seleccionados
                var e = document.getElementById("select-choice-a");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                
//                 retornaDatosEma(ema[emaSeleccionada][4],function(datosEMA){
//                            console.log("emaFS="+emaFS +" hayRed="+hayRed)  ;
//                             valores=datosEMA; 
//                            });
                            
                var tipoCultivo=getRadioValue('frutal');
                var tipoRiego=getRadioValue('tipoRiego');
                var epoca = document.getElementById("epoca").options[document.getElementById("epoca").selectedIndex].value;
                var PC=document.getElementById("cobertura").value;
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}
                
                //imprime los valores elegidos
                
                document.getElementById('estacionAuto').innerHTML = ema[emaSeleccionada][0];
                document.getElementById('tipoFrutal').innerHTML = culti[tipoCultivo];
                document.getElementById('estadoCultivo').innerHTML =  epoc[epoca];
                document.getElementById('porcentajeCob').innerHTML =kr[PC] ; 
                document.getElementById('tipoRiego').innerHTML = triego[tipoRiego];
                // adquiere los datos de la EMA seleccionada
                // 
                
                 $jsonp.send('http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                //$jsonp.send('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema+'?callback=handleStuff', {
                        callbackName: 'handleStuff',
                        async:false,
                        onSuccess: function(json){
                                    console.log('success!', json);
                                    if (json.error!="Hay problemas con la EMA"){
                                            var datosEMA=json;
                                            // comparo fechas
                                             if (comparaFecha(datosEMA.fecha,datosEMA.hora)){
                                                    // la EMA esta dentro de las 4 hs
                                                    emaFS=false;
                                                    mediaEva=datosEMA.evap;
                                                    
                                                    
                                                    
                                                } else {
                                                    alert("La Estación Meteorológica Automática esta Fuera de Servicio");
                                                    emaFS=true;
                                                    document.getElementById('estacionAuto').innerHTML = "Se utilizan valores estandar";
                                                    //si no hay red calcular los datos de EPAN con las tablas
                                                     alert("Se utilizan valores estándar - Cambie de Estación Meteorológica") ;
                                                    var fechaActual = new Date();
                                                    var mes=fechaActual.getMonth();
                                                    mediaEva=epan[mes]*0.7;// 0.7 coeficiente del tanque Kp
                                                     console.log('mediaEva=', mediaEva);
                                                }



                                    } else {
                                            error="Problemas con la EMA";
                                            alert(error);
                                            
                                          }
                                          console.log("MediaEva="+mediaEva);
                                          console.log("kc="+kc[tipoCultivo][epoca]);
                                          console.log("kr="+kr[PC]);
                                          console.log("ef="+ef[tipoRiego]);
                                          console.log("tipoCultivo="+tipoCultivo);
                                          console.log("epoca="+epoca);
                                          console.log("tipoRiego="+tipoRiego);
                                          
                                     NR=mediaEva*kc[tipoCultivo][epoca]*kr[PC]/tipoRiego;     
                                     document.getElementById('nr').innerHTML =NR.toFixed(2);      
                                    },
                        onLoading:function(){console.log("Cargando emas");},
                        onTimeout: function(){
                               document.getElementById('estacionAuto').innerHTML = "Se utilizan valores estandar";
                               //si no hay red calcular los datos de EPAN con las tablas
                                alert("Se utilizan valores estándar - Cambie de Estación Meteorológica") ;
                               var fechaActual = new Date();
                               var mes=fechaActual.getMonth();
                               mediaEva=epan[mes]*0.7;// 0.7 coeficiente del tanque Kp
                        },
                    timeout: 1000
                });
                
                
                
                
                
//                
//                if (hayRed && !emaFS){ // si hay red busca losdatos en los archivos de las EMA
//                             document.getElementById('estacionAuto').innerHTML = ema[emaSeleccionada][0];
//                             console.log("es="+valores.estacion);
//                            // buscardatosHistoricos(ema[emaSeleccionada][4]);     //obtiene los ultimos datos y mediaEva
//                             ;
//                    } else{
//                               console.log("fs="+valores.estacion);
//                               document.getElementById('estacionAuto').innerHTML = "Se utilizan valores estandar";
//                               //si no hay red calcular los datos de EPAN con las tablas
//                                alert("Se utilizan valores estándar - Cambie de Estación Meteorológica") ;
//                               var fechaActual = new Date();
//                               var mes=fechaActual.getMonth();
//                               mediaEva=epan[mes]*0.7;// 0.7 coeficiente del tanque Kp
//                      }
                
                
            }
          function verDatosEMA(){
                var e = document.getElementById("select-choice-a");
                var emaSeleccionada = e.options[e.selectedIndex].value;
                if (emaSeleccionada==='Estaciones Meteorológicas') {emaSeleccionada=0;}
                console.log(emaSeleccionada+'  #  '+ema[emaSeleccionada][4]);
              /*  
                retornaDatosEma(ema[emaSeleccionada][4],function(datosEMA){
                        //console.log(datosEMA);
                        publicarDatosEMA(emaSeleccionada,datosEMA);
                });
               */ 
                $jsonp.send('http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/datosActuales/ema/'+ema[emaSeleccionada][4]+'?callback=handleStuff', {
                //$jsonp.send('http://localhost/yii/ws_clima_inta/index.php/api/datosActuales/ema/'+ema+'?callback=handleStuff', {
                        callbackName: 'handleStuff',
                        onSuccess: function(json){
                        console.log('success!', json);
                        if (json.error!="Hay problemas con la EMA"){
                                var datosEMA=json;
                                document.getElementById("ema").innerHTML=datosEMA.estacion;
                                document.getElementById("date").innerHTML=datosEMA.fecha;
                                document.getElementById("hour").innerHTML=datosEMA.hora;
                                document.getElementById("temperatura").innerHTML=datosEMA.temperatura+' ºC';
                                document.getElementById("humedad").innerHTML=datosEMA.humedad+' %';
                                document.getElementById("presion").innerHTML=datosEMA.presion+'mB';
                                document.getElementById("lluvia").innerHTML=datosEMA.lluvia+' mm';
                                document.getElementById("viento").innerHTML=datosEMA.viento+' km/h';
                        } else {
                                document.getElementById("ema").innerHTML="Problemas con la EMA";
                                document.getElementById("temperatura").innerHTML='Sin Datos';
                                document.getElementById("humedad").innerHTML='Sin Datos';
                                document.getElementById("presion").innerHTML='Sin Datos';
                                document.getElementById("lluvia").innerHTML='Sin Datos';
                                document.getElementById("viento").innerHTML='Sin Datos';
                              }
                        },
                        onLoading:function(){console.log("Cargando datos emas");},
                        
                        onTimeout: function(){
                            //console.log('timeout!');
                            document.getElementById("ema").innerHTML='Sin Datos';
                            document.getElementById("date").innerHTML='Sin Datos';
                            document.getElementById("temperatura").innerHTML='Sin Datos';
                            document.getElementById("humedad").innerHTML='Sin Datos';
                            document.getElementById("presion").innerHTML='Sin Datos';
                            document.getElementById("lluvia").innerHTML='Sin Datos';
                            document.getElementById("viento").innerHTML='Sin Datos';
                        },
                    timeout: 1000
                });
                
                
          }  
          
          function publicarDatosEMA(emaSeleccionada,datosEMA){
                if (hayRed && !emaFS) {
                 document.getElementById('ema').innerHTML = datosEMA.estacion;
                 document.getElementById('date').innerHTML = datosEMA.fecha;
                 document.getElementById('hour').innerHTML = datosEMA.hora;
                 document.getElementById('temperatura').innerHTML = datosEMA.temperatura+" ºC";
                 document.getElementById('humedad').innerHTML = datosEMA.humedad+" %"; 
                 document.getElementById('presion').innerHTML = datosEMA.presion+" hPa";
                 document.getElementById('viento').innerHTML = datosEMA.viento+" km/h";
                 document.getElementById('lluvia').innerHTML = datosEMA.lluvia+" mm";
                 document.getElementById('evaporacion').innerHTML = mediaEva;
                } else {
                     document.getElementById('ema').innerHTML = ema[emaSeleccionada][0];
                     document.getElementById('date').innerHTML = "&nbsp";
                     document.getElementById('hour').innerHTML = "&nbsp";
                     document.getElementById('temperatura').innerHTML = "s/dato";
                     document.getElementById('humedad').innerHTML = "s/dato"; 
                     document.getElementById('presion').innerHTML ="s/dato";
                     document.getElementById('viento').innerHTML = "s/dato";
                     document.getElementById('lluvia').innerHTML = "s/dato";
                     document.getElementById('evaporacion').innerHTML = "s/dato";
                } 
                 //document.getElementById('resultados').style.display = 'block';
               //  document.getElementById('resultados').innerHTML = 'Hora: '+hora+'<br>Temp.: ' + temperatura +
               //      'ºC <br/>Humed: ' + humedad + '%<br/>Viento: ' + viento + 'km/h<br/> Lluvia: ' + lluvia + 'mm<br/>Media Evap:'+mediaEva;
             return true;  
         }

          
          
            function getRadioValue(groupName) {
                var _result;
                try {
                    var o_radio_group = document.getElementsByName(groupName);
                    for (var a = 0; a < o_radio_group.length; a++) {
                        if (o_radio_group[a].checked) {
                            _result = o_radio_group[a].value;
                            break;
                        }
                    }
                } catch (e) { }
                return _result;
            }

