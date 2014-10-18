(function(global) {
	var Camera = function(){};

	Camera.prototype.init = function(data) {
		this.width = 1280;
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
		this.deferred.resolve(this);
	};

	Camera.prototype.streamError = function(e) {
		console.error('Stream error', e);
		this.deferred.reject(e);
	};

	global.Camera = Camera;
})(window);