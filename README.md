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
Styling can be customized by applying styling to the following IDs. See the CSS for basic styling.

    #pencil-tool-canvas
    #pencil-tool-toolbar button,
    #pencil-tool-button
    #pencil-tool-thumbnail
    #pencil-tool-blackout
    #pencil-tool-canvas-wrapper
    #pencil-tool-toolbar
    #pencil-tool-control-wrapper
