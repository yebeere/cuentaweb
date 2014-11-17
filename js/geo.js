
var ema= new Array();
 
/* for (var i = 0; i < 7; i++) {
    ema[i] = new Array(6);
}
   ema[0][0] ='Cinco Saltos';
   ema[0][1] =-38.845;
   ema[0][2] =-68.069;
   ema[0][3] =282;
   ema[0][4] ='http://anterior.inta.gov.ar/altovalle/cincosaltos/downld02.txt';
   
   ema[1][0] ='Cnte Guerrico';
   ema[1][1] =-39.026;
   ema[1][2] =-67.737;
   ema[1][3] =242;
   ema[1][4] ='http://anterior.inta.gov.ar/altovalle/met/downld02.txt';
   
   ema[2][0] ='Picún Leufú  ';
   ema[2][1] =-39.536;
   ema[2][2] =-69.298;
   ema[2][3] =393;
   ema[2][4] ='http://anterior.inta.gov.ar/altovalle/picunleufu/downld02.txt';

   ema[3][0] ='Cnel. Belisle';
   ema[3][1] =-39.197;
   ema[3][2] =-65.894;
   ema[3][3] =128;
   ema[3][4] ='http://anterior.inta.gov.ar/altovalle/belisle/downld02.txt';
   
   ema[4][0] ='Pomona';
   ema[4][1] =-39.478;
   ema[4][2] =-65.653;
   ema[4][3] =127;
   ema[4][4] ='http://anterior.inta.gov.ar/altovalle/pomona/downld08.txt';
   
   ema[5][0] ='Villa Regina';
   ema[5][1] =-39.126;
   ema[5][2] =-67.106;
   ema[5][3] =158;
   ema[5][4] ='http://anterior.inta.gov.ar/altovalle/regina/downld02.txt';   
 
   ema[6][0] ='San P.Chañar';
   ema[6][1] =-38.57;
   ema[6][2] =-68.36;
   ema[6][3] =334;
   ema[6][4] ='http://anterior.inta.gov.ar/altovalle/sanpatricio/downld02.txt';
  */
  var kc= new Array(3);
    for (var i = 0; i <3; i++) {
        kc[i] = new Array(4);
    }
    
    kc[0][0]=0.7;
    kc[0][1]=0.8;
    kc[0][2]=1;
    kc[0][3]=0.5;
    
    kc[1][0]=0.6;
    kc[1][1]=1.1;
    kc[1][2]=1.3;
    kc[1][3]=0.5;
    
    kc[2][0]=0.6;
    kc[2][1]=0.7;
    kc[2][2]=1.3;
    kc[2][3]=0.5;
    
    var kr= new Array(10);
    kr['10']=0.55;
    kr['20']=0.60;
    kr['30']=0.65;
    kr['40']=0.70;
    kr['50']=0.75;
    kr['60']=0.80;
    kr['70']=0.85;
    kr['80']=0.90;
    kr['90']=0.95;
    kr['100']=1.00;
    
    var ef= new Array(2);
    ef[0]=0.90;
    ef[1]=0.80;
    
    var epan= new Array(12);
    epan[0]=10.1;
    epan[1]=9.3;
    epan[2]=6.4;
    epan[3]=4.3;
    epan[4]=0;
    epan[5]=0;
    epan[6]=0;
    epan[7]=0;    
    epan[8]=4.7;
    epan[9]=6.6;
    epan[10]=8.6;
    epan[11]=9.9;

    var culti= new Array(3);
    culti[0]='Manzanos';
    culti[1]='Perales';
    culti[2]='Fr.de Carozo';
    
    var triego= new Array(2);
    triego['0.9']='Riego por Goteo';
    triego['0.8']='Riego por Microaspersión';

    var epoc= new Array (4);
    epoc[0]='Comienzo de temporada';
    epoc[1]='Mediados de temporada';
    epoc[2]='Cerca de la cosecha';
    epoc[3]='Después de la cosecha';
    
    var hayRed=false ;
    var hayGPS=false ;
    var emaFS;
    
function distance(lat1,lon1,lat2,lon2) {
	var R = 6371; // km (change this constant to get miles)
	var dLat = (lat2-lat1) * Math.PI / 180;
	var dLon = (lon2-lon1) * Math.PI / 180;
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
		Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
		Math.sin(dLon/2) * Math.sin(dLon/2);
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
	var d = R * c;
//	if (d>1) return Math.round(d)+"km";
//	else if (d<=1) return Math.round(d*1000)+"m";
	return d;
}
var menorDistancia= new Array(7);

var onSuccessGPS  = function(position) {
                   hayGPS=true;
                   document.getElementById('gps').className = 'estado ok';
                    var latitud = position.coords.latitude;
                    var longitud = position.coords.longitude;
                    var precision = position.coords.accuracy;
                   //solicita el listado de EMAs al WebServer por JSONP
            	   $jsonp.send(' http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
                            callbackName: 'handleStuff',
                            onSuccess: function(json){
                                    var datosEMA=json;
                                    cantidad=datosEMA.length;
                                    texto="";
                                    var i;
                                    for (i=0;i<cantidad;i++) {
                                        ema.push([datosEMA[i].nombreEma,datosEMA[i].latitudEma,datosEMA[i].longitudEma,datosEMA[i].altitudEma,datosEMA[i].codigoEma,
                                            distance(datosEMA[i].latitudEma,datosEMA[i].longitudEma,latitud,longitud)]);

                                     }
                                    // ordena por menor distancia
                                    ema.sort(function(a,b) {
                                                    return a[5]- b[5];
                                        });
                                    //asigna
                                    for (var i = 0; i < cantidad; i++) { 
                                       //var j=i;
                                      $("<option value='"+i+"'>"+ema[i][0]+" (Dist:"+Math.round(ema[i][5]) +" km) </option>").appendTo("#select-choice-a");
                                      var myselect = $("#select-choice-a");
                                      myselect.selectmenu('refresh');
                                    }

                                    $("#select-choice-a option[value=0]").attr("selected",true);
                                    var myselect = $("#select-choice-a");
                                    myselect.selectmenu('refresh');
                            },
                            onTimeout: function(){
                                //console.log('timeout!');
                                    var option = document.createElement("option");
                                    option.text ="Hay problemas";
                                    option.value = 0;
                                    var select = document.getElementById("comboemas");
                                    select.appendChild(option);
                            },
                            timeout: 1000
                        });
           
    }

    function onErrorGPS() {
                        hayGPS=false;
                        document.getElementById('gps').className = 'estado no';
                        
                        $jsonp.send(' http://meta.fi.uncoma.edu.ar/cuentagotas/ws_clima_inta/index.php/api/listaEmas?callback=handleStuff', {
                            callbackName: 'handleStuff',
                            onSuccess: function(json){
                                   
                                    var datosEMA=json;
                                    var cantidad=datosEMA.length;
                                    texto="";
                                    var i;
                                    for (i=0;i<cantidad;i++) {
                                        ema.push([datosEMA[i].nombreEma,datosEMA[i].latitudEma,datosEMA[i].longitudEma,datosEMA[i].altitudEma,datosEMA[i].codigoEma,
                                            0]);

                                     }

                                    for (var i = 0; i < cantidad; i++) { 
                                       //var j=i;
                                       texto=  "<option value='"+i+"'>"+ema[i][0]+"</option>";
                                        //<option value="1"></option>
                                      $(texto).appendTo("#select-choice-a");
                                      var myselect = $("#select-choice-a");
                                      myselect.selectmenu('refresh');

                                    }
                                    $("#select-choice-a option[value=0]").attr("selected",true);
                                    var myselect = $("#select-choice-a");
                                    myselect.selectmenu('refresh');
                                    },
                                    onTimeout: function(){
                                        //console.log('timeout!');
                                            var option = document.createElement("option");
                                            option.text ="Hay problemas";
                                            option.value = 0;
                                            var select = document.getElementById("select-choice-a");
                                            select.appendChild(option);
                                    },
                                    timeout: 1000
                                });
                        
    }
    

 
 
 

