(function() {
'use strict';

    var cameras = new CameraSet().init();

    function shoot() {
        var images = [];
        var deferred = new $.Deferred();
        var promise = deferred.promise();
        var rotate = false;

        _.forEach(cameras.cameras, function(camera) {
            promise = promise.then(function() {
                return camera.takeSnap().then(function(obj, camera) {
                    console.log('EEEEE');
                    if (rotate) {
                        return rotate180(obj.image).then(function(image) {
                            images.push(image);
                            addImage(image);
                        });
                    } else {
                        images.push(obj.image);
                        addImage(obj.image);
                    }
                    rotate = true;
                });
            });
        });

        promise.then(function() {
            gifshot.createGIF({
                'images': images,
                gifWidth: 960,
                gifHeight: 720
            }, function(obj) {
                addImage(obj.image);
            });
        });

        deferred.resolve(true);
    }

    function rotate180(base64data) {
        var deferred = new $.Deferred();
        var canvas = document.getElementById("c");
        var ctx = canvas.getContext("2d");

        var image = new Image();
        image.src = base64data;
        image.onload = function() {
            ctx.translate(image.width, image.height);
            ctx.rotate(Math.PI);
            ctx.drawImage(image, 0, 0); 
            deferred.resolve(canvas.toDataURL());

        };
        return deferred.promise();

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
