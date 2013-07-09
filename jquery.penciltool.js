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

    var instances = {};
    var namespace = 'penciltool';
    var PencilTool = function () {
        this.init.apply(this, arguments);
    };

    PencilTool.prototype = {
        $container: null, // element we're in
        $canvas: null, // canvas cache
        $toolbar: null, // tool bar cache
        startedDrawing: false, // drawing state
        canvasContext: null, // canvas context cache
        default_settings: {
            'pencilButtonText': 'Tap to sign',
            'closeButtonText': 'Close',
            'clearButtonText': 'Clear',
            'lineWidth': 2,
            'strokeStyle': '#000',
            'canvasWidth': '700px',
            'canvasHeight': '300px',
            'toolbarTitle': '',
            'debug': false
        },

        init: function (element, settings) {
            this.settings = $.extend(true, {}, this.default_settings, settings);
            console.log(this.settings);
            this.$container = element;
            this.log('Initializing: ' + element.attr('id'));
        },
        log: function (message) {
            if (this.settings.debug === true) {
                if (typeof console !== 'undefined' || typeof console.log !== 'undefined') {
                    console.log(message);
                }
            }
        },
        _initializeContainer: function() {
            var scope = this;
            // create button
            var button = $('<button class="pencil-tool-button">' + this.settings.pencilButtonText + '</button>');
            // create click handler
            button.click(function (event) {
                scope.$container.pencilTool('show');
                event.preventDefault();
            });
            // add button to div
            this.$container.html(button);
            // create thumbnail holder
            var thumbnail = $('<img class="pencil-tool-thumbnail" />');
            thumbnail.css('height', button.css('height'));
            this.$container.append(thumbnail);
        },
        _initializeDisplayWrapper: function () {
            var blackOutExists = ($('#pencil-tool-blackout').length == 0) ? false : true;
            if (blackOutExists === false) {
                var canvasWrapper = $('<div id="pencil-tool-blackout">');
                var number = this.settings.canvasHeight.replace('px', '');
                var halfHeight = Math.round(parseInt(number) / 2);
                number = this.settings.canvasWidth.replace('px', '');
                var halfWidth = Math.round(parseInt(number) / 2);
                var innerContainer = $('<div id="pencil-tool-canvas-wrapper">');
                innerContainer.css({
                    'margin': '-' + halfHeight + 'px 0px 0px -' + halfWidth + 'px',
                    'width': this.settings.canvasWidth,
                    'min-height': this.settings.canvasHeight
                });
                canvasWrapper.append(innerContainer);
                $('body').append(canvasWrapper);
            }
        },
        _initializeToolbar: function () {
            var title = (this.settings.toolbarTitle === '') ? '&nbsp;' : this.settings.toolbarTitle;
            this.$toolbar = $('<div class="pencil-tool-toolbar"><span class="pencil-toolbar-help-message">' + title + '</span><div class="pencil-tool-control-wrapper"><button class="pencil-tool-button-clear">' + this.settings.clearButtonText + '</button><button class="pencil-tool-button-close">' + this.settings.closeButtonText + '</button></div>');
        },
        _setToolbarClickHandlers: function (toolbar) {
            var scope = this;
            toolbar.find('.pencil-tool-button-clear').click(function () {
                scope.reset();
            });
            toolbar.find('.pencil-tool-button-close').click(function () {
                scope.hide();
            });
        },
        _initializeCanvas: function() {
            this.$canvas = $('<canvas id="' + this.$container.attr('id') + '-canvas"></canvas>');
            this.$canvas.attr({
                'width': this.settings.canvasWidth,
                'height': this.settings.canvasHeight
            });
            // cache canvas context
            this.canvasContext = this.$canvas[0].getContext('2d');
            this.canvasContext.lineWidth = this.settings.lineWidth;
            this.canvasContext.strokeStyle = this.settings.strokeStyle;
        },
        _resetCanvas: function () {
            this.$canvas.remove();
            this.$canvas = null;
            this.canvasContext = null;
            this._initializeCanvas();
            this.log(this.$canvas);
            $('#pencil-tool-canvas-wrapper').append(this.$canvas);
        },
        _setCanvasEvents: function() {
            // add event handlers
            var scope = this;
            this.$canvas.on('mousedown', function (event) { scope._canvasEvent(event); });
            this.$canvas.on('mouseup', function (event) { scope._canvasEvent(event); });
            this.$canvas.on('mousemove', function (event) { scope._canvasEvent(event); });
            this.$canvas.on('touchstart', function (event) { scope._canvasEvent(event); });
            this.$canvas.on('touchend', function (event) { scope._canvasEvent(event); });
            this.$canvas.on('touchmove', function (event) { scope._canvasEvent(event); });
        },
        _removeCanvasEvents: function() {
            this.$canvas.off('mousedown');
            this.$canvas.off('mouseup');
            this.$canvas.off('mousemove');
            this.$canvas.off('touchstart');
            this.$canvas.off('touchend');
            this.$canvas.off('touchmove');
        },
        _canvasEvent: function(event) {
            this.log('Received event ' + event.type);

            var targetElement = event.target;
            var x = y = 0;

            if (this.startedDrawing) {
                while (targetElement && !isNaN(targetElement.offsetLeft) && !isNaN(targetElement.offsetTop)) {
                    x += targetElement.offsetLeft - targetElement.scrollLeft;
                    y += targetElement.offsetTop - targetElement.scrollTop;
                    targetElement = targetElement.offsetParent;
                }

                if (event.originalEvent.clientX && event.originalEvent.clientY) {
                    //$.fn.pencilTool('log', 'Chose client');
                    event._x = event.clientX - x;
                    event._y = event.clientY - y;
                }
                else {
                    //$.fn.pencilTool('log', 'Chose page');
                    event._x = event.originalEvent.pageX - x;
                    event._y = event.originalEvent.pageY - y;
                }
            }

            this['_' + event.type](event);
        },
        _touchstart: function (event) {
            // stop elastic scrolling
            $('body').on('touchmove', function (event) { event.preventDefault(); });
            // propagate event
            this._mousedown(event);
        },
        _mousedown: function (event) {
            // start drawing
            this.canvasContext.beginPath();
            this.canvasContext.moveTo(event._x, event._y);
            this.startedDrawing = true;
        },
        _touchend: function (event) {
            $('body').off('touchmove'); // re-allow elastic scrolling
            this._mouseup(event); // propagate event
        },
        _mouseup: function (event) {
            if (this.startedDrawing) {
                this.startedDrawing = false;
            }
        },
        _touchmove: function (event) {
            this._mousemove(event);
        },
        _mousemove: function (event) {
            if (this.startedDrawing) {
                this.canvasContext.lineTo(event._x, event._y);
                this.canvasContext.stroke();
            }
        },
        getCanvasImageAsTypeAndQuality: function (type, quality) {
            if (type === undefined) {
                type = 'image/png';
            }
            if (quality === undefined) {
                quality = 1;
            }
            if (type !== 'image/png') {
                return this.$canvas[0].toDataURL(type, quality);
            }
            return this.$canvas[0].toDataURL();
        },
        _saveCanvasToThumbnail: function () {
            var png = this.getCanvasImageAsTypeAndQuality();
            this.$container.find('.pencil-tool-thumbnail').attr('src', png);
        },
        show: function() {
            this.log('Showing: ' + this.$container.attr('id'));
            $('html').addClass('pt-editing');
            $('#pencil-tool-blackout').show();
            $('#pencil-tool-canvas-wrapper').append(this.$toolbar).append(this.$canvas);
            this._setToolbarClickHandlers(this.$toolbar);
            this._setCanvasEvents();
            this.log(this.canvasContext);
            this.log(this.$canvas);
        },
        hide: function () {
            this.log('Hiding: ' + this.$container.attr('id'));
            $('html').removeClass('pt-editing');
            this._saveCanvasToThumbnail();
            $('#pencil-tool-blackout').hide();
            $('#pencil-tool-canvas-wrapper').html('');
        },
        reset: function() {
            this.log('Resetting: ' + this.$container.attr('id'));
            this._removeCanvasEvents();
            this._resetCanvas();
            this._setCanvasEvents();
        },
        render: function() {
            this._initializeContainer();
            this._initializeDisplayWrapper();
            this._initializeToolbar();
            this._initializeCanvas();
            this.log('Rendering...');
        },
        call: function(arg) {
            this.arg();
        }
    };

    $.fn.pencilTool = function(args) {
        var elementId = this[0].id;
        return this.each(function () {
            if (instances.hasOwnProperty(elementId)) {
                if (instances[elementId][args]) {
                    instances[elementId][args].apply(instances[elementId], Array.prototype.slice.call(args, 1));
                }
                else {
                    $.error('Method ' + args + ' does not exist in pencilTool');
                }
            }
            else {
                var $element = $(this);
                if ($element.data(namespace)) {
                    $element.data(namespace).destroy();
                }
                instances[elementId] = new PencilTool($element, args);
                $element.data(namespace, instances[elementId].render());
            }
        });
    };
})(jQuery);