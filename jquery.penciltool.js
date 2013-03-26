/**
 * (c) 2013 SaskTel Labs
 *
 * See AUTHORS file for contributors
 * See LICENSE for license
 *
 * For examples, notes and new versions check github
 * https://github.com/sasktel/penciltool
 *
 */
(function ($) {

    var settings = $.extend({
        'lineWidth': 4,
        'strokeStyle': '#F00',
        'canvasWidth': '700px',
        'canvasHeight': '300px'
    }), started = false, initialized = false, canvasWrapper = null, canvas = null, button = null;

    var methods = {
        init: function (options) {
            // initialize settings, extend objects
            if (options !== undefined) {
                settings = $.extend(settings, options);
            }
            if (button === null) {
                // create button
                button = $('<button id="pencil-tool-button">Pencil Tool</button>');
                // create click handler
                button.click(function (event) {
                    $.fn.pencilTool('showPencilTool');
                });
                // add button to div
                this.html(button);
            }
            if (initialized === false) {
                // initialize all elements
                $.fn.pencilTool('initializeElements');
                // initialize context
                $.fn.pencilTool('initializeCanvasContext');
                // click handlers
                $('#pencil-tool-button-clear').click(function (event) {
                    $.fn.pencilTool('destroyCanvas');
                    canvas = null
                    $.fn.pencilTool('createCanvasElement');
                    $.fn.pencilTool('initializeCanvasContext');
                    canvasWrapper.append(canvas);
                    $.fn.pencilTool('addCanvasListeners');
                });
                $('#pencil-tool-button-close').click(function (event) {
                    $.fn.pencilTool('hidePencilTool');
                });
                // add canvas to body
                $('body').append(canvasWrapper);
                // add canvas event listeners
                $.fn.pencilTool('addCanvasListeners');

                initialized = true;
            }
        },
        initializeElements: function() {
            $.fn.pencilTool('createCanvasElement');
            $.fn.pencilTool('createCanvasWrapper');
            $.fn.pencilTool('createCanvasToolbar');
        },
        initializeCanvasContext: function () {
            // set canvas context options
            canvasContext = canvas[0].getContext('2d');
            canvasContext.lineWidth = settings.lineWidth;
            canvasContext.strokeStyle = settings.strokeStyle;
        },
        destroyCanvas: function () {
            $('#pencil-tool-canvas').remove();
        },
        addCanvasListeners: function () {
            canvas.bind('mousemove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mousedown', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mouseup', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchmove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchstart', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchend', function (event) { $.fn.pencilTool('canvasEvent', event); });
        },
        createCanvasElement: function() {
            // create canvas element
            canvas = $('<canvas id="pencil-tool-canvas"></canvas>');
            canvas.attr('width', settings.canvasWidth);
            canvas.attr('height', settings.canvasHeight);
            canvas.css('background-color', '#FFF');
            canvas.css('z-index', 9999);
        },
        createCanvasWrapper: function () {
            canvasWrapper = $('<div id="pencil-tool-blackout">');
            canvasWrapper.css('display', 'none');
            canvasWrapper.css('position', 'absolute');
            canvasWrapper.css('top', '0');
            canvasWrapper.css('left', '0');
            canvasWrapper.css('bottom', '0');
            canvasWrapper.css('right', '0');
            canvasWrapper.css('z-index', 9997);
            canvasWrapper.css('background-color', '#333');
            var innerContainer = $('<div id="pencil-tool-canvas-wrapper">');
            //innerContainer.css('position', 'absolute');
            innerContainer.css('border', '1px solid #000');
            //innerContainer.css('left', '200px');
            //innerContainer.css('top', '200px');
            innerContainer.css('background-color', '#FFF');
            innerContainer.css('z-index', 9998);
            canvasWrapper.append(innerContainer);
            canvasWrapper.append(canvas);
            $('body').append(canvasWrapper);
        },
        createCanvasToolbar: function() {
            var toolbar = $('<div id="pencil-tool-toolbar"><span id="pencil-toolbar-help-message">ASFDASDF</span><button id="pencil-tool-button-clear">CLEAR</button><button id="pencil-tool-button-close">CLOSE</button>');
            $('#pencil-tool-canvas-wrapper').prepend(toolbar);
        },
        hidePencilTool: function() {
            canvasWrapper.toggle();
        },
        showPencilTool: function () {
            console.log('Opening canvas');
            // TODO - Properly position canvas element
            /*
            var div = $('<div id="pencil-tool-blackout">');
            div.css('position', 'absolute');
            div.css('top', '0');
            div.css('left', '0');
            div.css('bottom', '0');
            div.css('right', '0');
            div.css('z-index', 9997);
            div.css('background-color', '#333');
            $('body').append(div);
            */
            
            canvasWrapper.toggle();
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