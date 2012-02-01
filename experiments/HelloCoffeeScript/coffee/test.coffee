resize = () ->
  canvas = $('#c')[0]
  canvas.width  = window.innerWidth
  canvas.height = window.innerHeight
  c = canvas.getContext('2d');
  c.moveTo 0, 0
  c.lineTo 100, 100
  c.stroke()

$(document).ready resize
$(window).resize resize
