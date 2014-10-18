(function(global) {
	var Camera = function(){};

	Camera.prototype.init = function(data) {
		this.width = 960;
		this.height = 720;
		if (data) {
			_.merge(this, data);
		}
		return this;
	};

	Camera.prototype.getUserMedia = function() {
		var func = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

        var args = _.toArray(arguments);

        // Chrome whinges if getUserMedia is not invoked on the navigator object
        return func.apply(navigator, args);
	};

	Camera.prototype.getStream = function() {

		var constraints = {
			video: {
				mandatory: {
					minWidth: this.width,
					minHeight: this.height
				},
				optional: [{sourceId: this.id}]
			}
		};
		this.deferred = new $.Deferred();
    	this.getUserMedia(constraints, this.receivedStream.bind(this), this.streamError.bind(this));
    	return this.deferred.promise();
	};

	Camera.prototype.receivedStream = function(localMediaStream) {
		console.log('Received stream', localMediaStream);
		this.localMediaStream = localMediaStream;
		setTimeout(function() {
			this.deferred.resolve(this);
		}.bind(this), 1000);
	};

	Camera.prototype.streamError = function(e) {
		console.error('Stream error', e);
		this.deferred.reject(e);
	};

	Camera.prototype.takeSnap = function() {
		var deferred = new $.Deferred();
		this.getStream().then(function(camera) {
			console.log('Taking snap');
			var config = {
	            cameraStream: camera.localMediaStream,
	            keepCameraOn: false,
	            gifWidth: camera.width,
	            gifHeight: camera.height,
	        };
			gifshot.takeSnapShot(config, function(obj) {
	            camera.localMediaStream.stop();
	            camera.localMediaStream = null;
	            console.log('Got snap');
	            deferred.resolve(obj, camera);
	        });
	    });
	    return deferred.promise();
	};

	global.Camera = Camera;
})(window);