(function(global) {
	var CameraSet = function() {};

	CameraSet.prototype.init = function() {
		this.cameras = [];
		this.streams = [];
		return this;
	};

	CameraSet.prototype.shouldUseMediaSource = function(sourceInfo) {
		return sourceInfo.kind === 'video';
		/* && _.contains([
			'60b4e3d625241aff316425ee2e07ab9b5089eb36579edc264d47585a090c6ad5',
			'ef3120da5d3a83619f618b97ea218d6cba0a62e50d47cb34e5ed4bacb271c3e1'
		], sourceInfo.id);*/
	};

	CameraSet.prototype.discover = function() {
		var deferred = new $.Deferred();
        MediaStreamTrack.getSources(function(sourceInfos) {
            var audioSource = null;
            var videoSource = null;

            for (var i = 0; i != sourceInfos.length; ++i) {
                var sourceInfo = sourceInfos[i];
                if (this.shouldUseMediaSource(sourceInfo)) {
                    console.log(sourceInfo.id, sourceInfo);
                    this.cameras.push(new Camera().init(sourceInfo));
                }
            }
            deferred.resolve(this.cameras);
        }.bind(this));
        return deferred.promise();
	};

	CameraSet.prototype.getStreams = function() {
		var deferred = new $.Deferred();
		var promises = _.invoke(this.cameras, 'getStream');
		return $.when.apply($, promises).then(function() {
			// convert our multiple arguments into an array
			return $.when(_.toArray(arguments));
		});
	};

	CameraSet.prototype.getUserMedia = function() {
		var func = navigator.getUserMedia ||
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

        var args = _.toArray(arguments);

        // Chrome whinges if getUserMedia is not invoked on the navigator object
        return func.apply(navigator, args);
	};

	CameraSet.prototype.setupSlowVideo = function() {
		this.slowVideo = {
			canvas1: document.getElementById('canvas1'),
		    canvas2: document.getElementById('canvas2'),
		    context1: canvas1.getContext('2d'),
		    context2: canvas2.getContext('2d'),
		    cw: canvas1.clientWidth,
		    ch: canvas1.clientHeight,
		    video: document.getElementById('video'),
		    currentSource: 0,
		    videoSources: this.cameras,
		    lastStream: null
		};
		

	    //this.slowVideo.context2.translate(this.slowVideo.cw, this.slowVideo.ch);
	    //this.slowVideo.context2.rotate(Math.PI);

	    this.slowVideo.video.autoplay="autoplay";
	    var self = this;

	    this.slowVideo.video.addEventListener('playing', function() {
	    	var context = (self.slowVideo.currentSource === 0 ? self.slowVideo.context1 : self.slowVideo.context2);
	        self.drawSlowVideoFrame(this, context, self.slowVideo.currentSource, self.slowVideo.cw, self.slowVideo.ch);
	    }, false);

	    this.slowVideoNext();
	    
	};

    CameraSet.prototype.drawSlowVideoFrame = function(v, c, l, w, h) {
        if (v.paused || v.ended) {
        	return false;
        }
        c.drawImage(v, 0, 0, w, h);

        if (this.recordFrames > 0) {
        	var canvas = l === 0 ? this.slowVideo.canvas1 : this.slowVideo.canvas2;
        	this.recordFrames--;
        	this.recordBuffer.push(canvas.toDataURL());
        	Canvas2Image.saveAsJPEG(canvas);
        	if (this.recordFrames === 0) {
	        	this.recordDeferred.resolve(this.recordBuffer);
	        }
        }

        if (this.slowVideo.videoSources.length > 1) {
	        if (l === 0) {
	            this.slowVideo.canvas1.className = '';
	            this.slowVideo.canvas2.className = 'off';
	        } else {
	            this.slowVideo.canvas1.className = 'off';
	            this.slowVideo.canvas2.className = '';
	        }
	    }
    	this.slowVideoNext();
    };

    CameraSet.prototype.captureSlowVideoFrame = function() {
        var mediaOptions = {
            video: {
                mandatory: {
                    minWidth: 960,
                    minHeight: 720
                },
                optional: [
                    {sourceId: this.slowVideo.videoSources[this.slowVideo.currentSource].id}
                ]
            }
        };
        this.getUserMedia(mediaOptions, this.slowVideoSuccess.bind(this), this.slowVideoError.bind());
    };

	CameraSet.prototype.slowVideoError = function(error){
	    console.log("navigator.getUserMedia error: ", error);
	};

	CameraSet.prototype.slowVideoSuccess = function(stream) {
        this.slowVideo.video.src = window.URL.createObjectURL(stream);
        this.slowVideo.video.play();
        this.slowVideo.lastStream = stream;
    };

    CameraSet.prototype.slowVideoNext = function() {
    	if (this.slowVideo.videoSources.length === 1 && this.slowVideo.lastStream) {
    		this.captureSlowVideoFrame();
    		return;
    	}
        if (this.slowVideo.lastStream) {
            this.slowVideo.lastStream.stop();
        }
        this.slowVideo.video.src = "";
        if (this.slowVideo.currentSource < this.slowVideo.videoSources.length - 1) {
            this.slowVideo.currentSource += 1;
        } else {
            this.slowVideo.currentSource = 0;
        }
        this.captureSlowVideoFrame();
    };

    CameraSet.prototype.record = function(frameCount) {
    	this.recordFrames = frameCount;
    	this.recordBuffer = [];
    	this.recordDeferred = new $.Deferred();
    	return this.recordDeferred.promise();
    };

	global.CameraSet = CameraSet;
})(window);