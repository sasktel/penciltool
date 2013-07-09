penciltool
=====
penciltool is a jQuery plugin that captures canvas drawings in an image.

It's intended use is signature capture for touch-screen devices.

Basic Usage
=====
Apply penciltool to any div and it will take care of the rest.

    <div id="pencil-tool">Loading...</div>
    
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js"></script>
    <script src="jquery.penciltool.js"></script>
    <script type="text/javascript">
    $(document).ready(function() {
        var pencilToolSettings = {
            'toolbarTitle': 'Sign below',
            'debug': true
        };
        $('#pencil-tool').pencilTool(pencilToolSettings);
    });
    </script>

A `.pt-editing` class is applied to `<html>` when the canvas is shown.

Settings
====
The following settings can be changed

    {
        'pencilButtonText': 'Tap to sign', // button text to open drawing canvas
        'closeButtonText': 'Close', // close button text
        'clearButtonText': 'Clear', // clear button text
        'lineWidth': 2, // thickness of line being drawn
        'strokeStyle': '#000', // colour of line being drawn
        'canvasWidth': '700px', // width of drawing area
        'canvasHeight': '300px', // height of drawing area
        'toolbarTitle': '', // title text
        'debug': false // see what's going on
    }

Styling
=====
See the `jquery.pencitool.css` for basic styling. The following elements can be modified to customize styling.

    #pencil-tool-canvas
    #pencil-tool-blackout
    #pencil-tool-canvas-wrapper
    .pencil-tool-toolbar button
    .pencil-tool-button
    .pencil-tool-thumbnail
    .pencil-tool-toolbar
    .pencil-tool-control-wrapper
