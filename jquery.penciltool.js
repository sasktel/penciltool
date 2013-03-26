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
        'pencilButtonText': 'Tap to sign',
        'lineWidth': 2,
        'strokeStyle': '#000',
        'canvasWidth': '700px',
        'canvasHeight': '300px',
        'toolbarTitle': '',
        'debug': false
    }), started = false, initialized = false, canvasWrapper = null, canvas = null, button = null;

    var methods = {
        log: function (message) {
            if (settings.debug == true) {
                console.log(message);
            }
        },
        init: function (options) {
            // initialize settings, extend objects
            if (options !== undefined) {
                settings = $.extend(settings, options);
            }
            if (button === null) {
                // create button
                button = $('<button id="pencil-tool-button">' + settings.pencilButtonText + '</button>');
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
                    $.fn.pencilTool('resetCanvas');
                });
                $('#pencil-tool-button-close').click(function (event) {
                    $.fn.pencilTool('resetCanvas');
                    $.fn.pencilTool('hidePencilTool');
                });
                // add canvas to body
                $('body').append(canvasWrapper);

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
        addCanvasListeners: function () {
            canvas.bind('mousemove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mousedown', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('mouseup', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchmove', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchstart', function (event) { $.fn.pencilTool('canvasEvent', event); });
            canvas.bind('touchend', function (event) { $.fn.pencilTool('canvasEvent', event); });
        },
        resetCanvas: function () {
            $('#pencil-tool-canvas').remove();
            canvas = null
            $.fn.pencilTool('createCanvasElement');
            $.fn.pencilTool('initializeCanvasContext');
            $('#pencil-tool-canvas-wrapper').append(canvas);
            $.fn.pencilTool('addCanvasListeners');
        },
        createCanvasElement: function() {
            // create canvas element
            canvas = $('<canvas id="pencil-tool-canvas"></canvas>');
            canvas.attr('width', settings.canvasWidth);
            canvas.attr('height', settings.canvasHeight);
            // add canvas event listeners
            $.fn.pencilTool('addCanvasListeners');
        },
        createCanvasWrapper: function () {
            canvasWrapper = $('<div id="pencil-tool-blackout">');
            var innerContainer = $('<div id="pencil-tool-canvas-wrapper">');
            var number = settings.canvasHeight.replace('px', '');
            var halfHeight = Math.round(parseInt(number) / 2);
            number = settings.canvasWidth.replace('px', '');
            var halfWidth = Math.round(parseInt(number) / 2);
            innerContainer.css('margin', '-' + halfHeight + 'px 0px 0px -' + halfWidth + 'px');
            innerContainer.css('width', settings.canvasWidth);
            innerContainer.css('min-height', settings.canvasHeight);
            innerContainer.append(canvas);
            canvasWrapper.append(innerContainer);
            $('body').append(canvasWrapper);
        },
        createCanvasToolbar: function() {
            var toolbar = $('<div id="pencil-tool-toolbar"><span id="pencil-toolbar-help-message">' + settings.toolbarTitle + '</span><div id="pencil-tool-control-wrapper"><button id="pencil-tool-button-clear">Clear</button><button id="pencil-tool-button-close">Close</button></div>');
            $('#pencil-tool-canvas-wrapper').prepend(toolbar);
        },
        hidePencilTool: function() {
            canvasWrapper.toggle();
        },
        showPencilTool: function () {
            $.fn.pencilTool('log', 'Opening canvas');
            canvasWrapper.toggle();
        },
        canvasEvent: function(event) {
            $.fn.pencilTool('log', 'Received event');
            $.fn.pencilTool('log', event);

            var targetElement = event.target;
            var x = y = 0;

            while (targetElement && !isNaN(targetElement.offsetLeft) && !isNaN(targetElement.offsetTop)) {
                x += targetElement.offsetLeft - targetElement.scrollLeft;
                y += targetElement.offsetTop - targetElement.scrollTop;
                targetElement = targetElement.offsetParent;
            }

            if (event.originalEvent.clientX && event.originalEvent.clientY) {
                $.fn.pencilTool('log', 'Chose client');
                event._x = event.clientX - x;
                event._y = event.clientY - y;
            }
            else {
                $.fn.pencilTool('log', 'Chose page');
                event._x = event.originalEvent.pageX - x;
                event._y = event.originalEvent.pageY - y;
            }
            $.fn.pencilTool('log', 'x: ' + event._x + ' y: ' + event._y);
            $.fn.pencilTool(event.type, event);
        },
        touchstart: function (event) {
            $.fn.pencilTool('log', 'touchstart');
            // stop elastic scrolling
            $('body').bind('touchmove', function (event) { event.preventDefault(); });
            // propagate event
            $.fn.pencilTool('mousedown', event);
        },
        mousedown: function (event) {
            $.fn.pencilTool('log', 'mousedown');
            // start drawing
            canvasContext.beginPath();
            canvasContext.moveTo(event._x, event._y);
            started = true;
        },
        touchend: function (event) {
            $.fn.pencilTool('log', 'touchend');
            // re-allow elastic scrolling
            $('body').unbind('touchmove');
            // propagate event
            $.fn.pencilTool('mouseup', event);
        },
        mouseup: function (event) {
            if (started) {
                $.fn.pencilTool('log', 'mouseup');
                started = false;
            }
        },
        touchmove: function (event) {
            $.fn.pencilTool('log', 'touchmove');
            $.fn.pencilTool('mousemove', event);
        },
        mousemove: function (event) {
            if (started) {
                $.fn.pencilTool('log', 'mousemove');
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