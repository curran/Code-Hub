app = (() ->
  width = 0     # The height of the canvas
  height = 0    # The width of the canvas
  canvas = null # A reference to the canvas
  c = null      # A reference to the canvas 2D context
  angle = 0     # The angle of the text rotation
  angleIncrement = 0.01 # The per-frame angle increment

  drawX = () ->
    c.moveTo 0, 0;     c.lineTo width, height
    c.moveTo width, 0; c.lineTo 0, height
    c.stroke()
    
  drawCircle = () ->
    x = width/2
    y = height/2
    radius = Math.min(x,y)

    c.beginPath()
    c.arc x,y,radius,0,Math.PI*2,true
    c.closePath()
    c.fillStyle = '#888888'
    c.fill()

  drawText = () ->
    x = width/2
    y = height/2
    c.font = 'italic bold 60px cursive'
    c.textBaseline = 'middle'
    c.textAlign = 'center'
    c.save()
    c.translate x, y
    c.rotate angle += angleIncrement
    s = Math.min(x,y)/250
    c.scale s, s
    c.fillStyle = '#FFFFFF'
    c.fillText 'Hello CoffeeScript!', 0, 0
    c.restore()

  draw = () ->
    canvas.width = width
    canvas.height = height
    # see http://simonsarris.com/blog/346-how-you-clear-your-canvas-matters
    # this performs poorly -> c.clearRect 0, 0, width, height
    drawX()
    drawCircle()
    drawText()

  resize = () ->
    width  = canvas.width  = window.innerWidth
    height = canvas.height = window.innerHeight
    draw()

  init = () ->
    canvas = $('#c')[0]
    c = canvas.getContext '2d'
    resize()
    setInterval draw, 20

  # Return the public interface to the module
  init: init
  resize: resize
)()
$(document).ready app.init
$(window).resize app.resize
