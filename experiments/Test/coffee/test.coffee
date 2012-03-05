app = (() ->
  width = 0     # The height of the canvas
  height = 0    # The width of the canvas
  canvas = null # A reference to the canvas
  c = null      # A reference to the canvas 2D context

  #panels = {    # The tree of panels
  #  orientation: 'horizontal'
  #  children:[
  #    {fillStyle:'#FF0000'},
  #    {fillStyle:'#0000FF'},
  #    {fillStyle:'#00FF00'}
  #  ]
  #}
  panels = {    # The tree of panels
    orientation: 'horizontal'
    children:[
      {fillStyle:'#FF0000'},
      #{
      #  orientation: 'horizontal',
      #  children:[
      #    {fillStyle:'#FF0000'},
      #    {fillStyle:'#0000FF'},
      #    {fillStyle:'#00FF00'}
      #  ]
      #},
      {fillStyle:'#00FF00'}
    ]
  }

  drawPanels = (panel) ->
    x = 0
    y = 0
    w = width
    h = height
    drawPanel(x, y, w, h, panel)

  drawPanel = (x, y, w, h, panel) ->
    if panel.children
      numChildren = panels.children.length
      for i in [0..numChildren - 1]
        child = panels.children[i]
        if panels.orientation == 'horizontal'
          drawPanel(i / numChildren * w, y,
            w / numChildren, h, child)
        else if panels.orientation == 'vertical'
          drawPanel(x, i / numChildren * h,
            w, h / numChildren, child)
    else if panel.fillStyle
      c.fillStyle = panel.fillStyle
      c.fillRect x, y, w, h
      c.moveTo x, y;     c.lineTo x + w, y + h
      c.moveTo x + w, y; c.lineTo x, y + h
      c.stroke()
    
  draw = () ->
    # clear the background
    canvas.width = width
    canvas.height = height
    drawPanels(panels)

  resize = () ->
    width  = canvas.width  = window.innerWidth
    height = canvas.height = window.innerHeight
    draw()

  init = () ->
    canvas = $('#c')[0]
    c = canvas.getContext '2d'
    resize()
    #setInterval draw, 20

  # Return the public interface to the module
  init: init
  resize: resize
)()
$(document).ready app.init
$(window).resize app.resize
