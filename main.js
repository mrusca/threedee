(function() {
'use strict';

    var cameras = new CameraSet().init();

    function shoot() {
        var images = [];
        var deferred = new $.Deferred();
        var promise = deferred.promise();
        
        _.forEach(cameras.cameras, function(camera) {
            promise = promise.then(function() {
                return camera.takeSnap().then(function(obj, camera) {
                    console.log('EEEEE');
                    images.push(obj.image);
                    addImage(obj.image);
                });
            });
        });

        promise.then(function() {
            gifshot.createGIF({
                'images': images
            }, function(obj) {
                addImage(obj.image);
            });
        });

        deferred.resolve(true);
    }

    function setup() {
        cameras.discover();
    }

    function addImage(image) {
        var el = document.createElement('img');
        el.src = image;
        document.body.appendChild(el);
    }

    $(document).ready(setup);

    var $button = $('button');
    $button.on('click', shoot);

})();
