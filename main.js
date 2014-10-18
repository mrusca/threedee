(function() {
'use strict';

    var cameras = new CameraSet().init();

    function shoot() {
        cameras.getStreams().then(function(cameras) {
            _.forEach(cameras, function(camera) {
                console.log('CAMURA', camera);
                var config = {
                    cameraStream: camera.localMediaStream,
                    keepCameraOn: true,
                    gifWidth: camera.width,
                    gifHeight: camera.height
                };
                gifshot.takeSnapShot(config, function(obj) {
                    if( ! obj.error) {
                        var image = obj.image,
                        animatedImage = document.createElement('img');
                        animatedImage.src = image;
                        document.body.appendChild(animatedImage);
                    }
                });
            });
        });
    }

    function setup() {
        cameras.discover();
    }

    $(document).ready(setup);

    var $button = $('button');
    $button.on('click', shoot);

})();
