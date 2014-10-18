(function() {
'use strict';

    var cameraSet = new CameraSet().init();
    
    function shoot() {
        cameraSet.record(2).then(function(images) {
            gifshot.createGIF({
                images: images,
                gifWidth: 960,
                gifHeight: 720
            }, function(obj) {
                addImage(obj.image);
            });

        });

    }

    function addImage(image) {
        var el = document.createElement('img');
        el.src = image;
        document.body.appendChild(el);
    }

    function setup() {
        cameraSet.discover().then(cameraSet.setupSlowVideo.bind(cameraSet));
    }

    $(document).ready(setup);

    var $button = $('button');
    $button.on('click', shoot);

})();
