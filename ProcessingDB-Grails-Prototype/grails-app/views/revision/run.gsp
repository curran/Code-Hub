<html>  
<meta name="viewport" content="width=device-width, maximum-scale=1.0" /> 
<head>  
<script src="${resource(dir:'js',file:'processing.js')}"></script>
<script src="${resource(dir:'js',file:'jquery.js')}"></script>
<script> 
window.onload = init;
var processing;
function init(){ 
  $.get("../get/${revisionInstance.id}", function(processingCode) {
    processing = new Processing($("#PJSCanvas")[0], processingCode);
    processing.mousePressed = function(){ processing.touchStart(buildMouseTouchEvent()); };
    processing.mouseDragged = function(){ processing.touchMove(buildMouseTouchEvent()); };
    processing.mouseReleased = function(){ processing.touchEnd(buildMouseTouchEvent()); };
    resize();
  });
}
function buildMouseTouchEvent(){
  return {"changedTouches": [{"identifier":1,
          "pageX":processing.mouseX, "pageY":processing.mouseY}]};
}
function resize(){
  processing.size(window.innerWidth,window.innerHeight);
}    
function touchStart(e){ processing.touchStart(e); }
function touchMove(e){ processing.touchMove(e); }
function touchEnd(e){ processing.touchEnd(e); }
function orientationChange(){ resize(); }
</script> 
</head> 
<body onorientationchange="orientationChange()" style="margin: 0px;"> 
<canvas ontouchstart="touchStart(event)"
	ontouchmove="touchMove(event);"
        ontouchend="touchEnd(event);" id="PJSCanvas"/> 
</body>
