<script src="${resource(dir:'js',file:'processing.js')}"></script>
<script src="${resource(dir:'js',file:'jquery.js')}"></script>
<script> 
 
window.onload = init;
 
var canvas;
var processing;
var t = 0;
var touches;
 
function init(){ 
    $.get("../get/${scriptInstance.id}", function(processingCode) {
      processing = new Processing($("#PJSCanvas")[0], processingCode);
      document.write(processingCode)
      resize();
    });
}
function resize(){
    var displayWidth = window.innerWidth;
    var displayHeight = window.innerHeight;
    processing.size(displayWidth,displayHeight);
}    
function draw(p){
    p.setup = function() { p.background(0,0,20); }
    p.draw = function(){
	if(touches != undefined){
	    var r = (Math.sin(t)/2.0+0.5)*255;
	    var g = (Math.sin(t*1.3)/2.0+0.5)*255;
	    var b = (Math.sin(t*1.4)/2.0+0.5)*255;
	    p.noStroke();
	    p.fill(r,g,b);
	    t += 0.1;
	    var i;
	    for(i=0;i < touches.length;i++)
		p.ellipse(touches[i].pageX,touches[i].pageY,30,30);
	}
    }
}
function touchStart(e){ processing.touchStart(e); }
function touchMove(e){ processing.touchMove(e); }
function touchEnd(e){ processing.touchEnd(e); }
function orientationChange(){
    resize();
}
</script> 
</head> 
<body onorientationchange="orientationChange()" style="margin: 0px;"> 
 <h1>Hello</h1>
 <h1>${scriptInstance.name}</h1>
<canvas ontouchstart="touchStart(event)"
	ontouchmove="touchMove(event);"
        ontouchend="touchEnd(event);" id="PJSCanvas"/> 
</body> 
