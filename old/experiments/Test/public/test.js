(function() {
  var app;

  app = (function() {
    var c, canvas, draw, drawPanel, drawPanels, height, init, panels, resize, width;
    width = 0;
    height = 0;
    canvas = null;
    c = null;
    panels = {
      orientation: 'horizontal',
      children: [
        {
          fillStyle: '#FF0000'
        }, {
          fillStyle: '#00FF00'
        }
      ]
    };
    drawPanels = function(panel) {
      var h, w, x, y;
      x = 0;
      y = 0;
      w = width;
      h = height;
      return drawPanel(x, y, w, h, panel);
    };
    drawPanel = function(x, y, w, h, panel) {
      var child, i, numChildren, _ref, _results;
      if (panel.children) {
        numChildren = panels.children.length;
        _results = [];
        for (i = 0, _ref = numChildren - 1; 0 <= _ref ? i <= _ref : i >= _ref; 0 <= _ref ? i++ : i--) {
          child = panels.children[i];
          if (panels.orientation === 'horizontal') {
            _results.push(drawPanel(i / numChildren * w, y, w / numChildren, h, child));
          } else if (panels.orientation === 'vertical') {
            _results.push(drawPanel(x, i / numChildren * h, w, h / numChildren, child));
          } else {
            _results.push(void 0);
          }
        }
        return _results;
      } else if (panel.fillStyle) {
        c.fillStyle = panel.fillStyle;
        c.fillRect(x, y, w, h);
        c.moveTo(x, y);
        c.lineTo(x + w, y + h);
        c.moveTo(x + w, y);
        c.lineTo(x, y + h);
        return c.stroke();
      }
    };
    draw = function() {
      canvas.width = width;
      canvas.height = height;
      return drawPanels(panels);
    };
    resize = function() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      return draw();
    };
    init = function() {
      canvas = $('#c')[0];
      c = canvas.getContext('2d');
      return resize();
    };
    return {
      init: init,
      resize: resize
    };
  })();

  $(document).ready(app.init);

  $(window).resize(app.resize);

}).call(this);
