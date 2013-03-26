/**
 * (c) 2013 SaskTel Labs
 *
 * See AUTHORS file for contributors
 * See LICENSE for license
 */
(function ($) {

    var settings = $.extend({
        'lineWidth': 4,
        'strokeStyle': '#F00'
    }), started = false, canvas = null, button = null;

    var methods = {
        init: function (options) {
            // initialize settings, extend objects
            if (options !== undefined) {
                settings = $.extend(settings, options);
            }
            // initialize button
            if (button === null) {
                button = $('<button id="pencil-tool-button">Pencil Tool</button>');
            }
            // initialize canvas
            if (canvas === null) {
                canvas = $('<canvas id="pencil-tool-canvas" width="300" height="300" style="display: none; position: absolute; top: 40%; left: 40%; border: 1px solid;"></canvas>');
                canvasContext = canvas[0].getContext('2d');
                canvasContext.lineWidth = settings.lineWidth;
                canvasContext.strokeStyle = settings.strokeStyle;
            }
            // create click handler
            button.click(function (event) {
                $.fn.pencilTool('showCanvas');
            });
            // add button to div
            this.html(button);
            // add canvas to body
            $('body').append(canvas);
            // add canvas event listeners
            canvas.bind('mousemove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mousedown', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mouseup', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchmove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchstart', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchend', function (event) { $.fn.pencilTool('canvasEvent', event); });
        },
        showCanvas: function () {
            console.log('Opening canvas');
            // TODO - Properly position canvas element
            canvas.toggle();
        },
        canvasEvent: function(event) {
            //console.log('Received event');
            console.log(event);

            var targetElement = event.target;
            var x = y = 0;

            while (targetElement && !isNaN(targetElement.offsetLeft) && !isNaN(targetElement.offsetTop)) {
                x += targetElement.offsetLeft - targetElement.scrollLeft;
                y += targetElement.offsetTop - targetElement.scrollTop;
                targetElement = targetElement.offsetParent;
            }

            if (event.originalEvent.clientX && event.originalEvent.clientY) {
                console.log('chose client');
                event._x = event.clientX - x;
                event._y = event.clientY - y;
            }
            else {
                console.log('chose page');
                event._x = event.originalEvent.pageX - x;
                event._y = event.originalEvent.pageY - y;
            }
            console.log('x: ' + event._x + ' y: ' + event._y);
            $.fn.pencilTool(event.type, event);
        },
        touchstart: function (event) {
            console.log('touchstart');
            // stop elastic scrolling
            $('body').bind('touchmove', function (event) { event.preventDefault(); });
            // propagate event
            $.fn.pencilTool('mousedown', event);
        },
        mousedown: function (event) {
            console.log('mousedown');
            // start drawing
            canvasContext.beginPath();
            canvasContext.moveTo(event._x, event._y);
            started = true;
        },
        touchend: function (event) {
            console.log('touchend');
            // re-allow elastic scrolling
            $('body').unbind('touchmove');
            // propagate event
            $.fn.pencilTool('mouseup', event);
        },
        mouseup: function (event) {
            if (started) {
                console.log('mouseup');
                started = false;
            }
        },
        touchmove: function (event) {
            console.log('touchmove');
            $.fn.pencilTool('mousemove', event);
        },
        mousemove: function (event) {
            if (started) {
                console.log('mousemove');
                canvasContext.lineTo(event._x, event._y);
                canvasContext.stroke();
            }
        }
    };
    
    $.fn.pencilTool = function(method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist in pencilTool');
        }
    };
})(jQuery);