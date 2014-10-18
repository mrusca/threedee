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
        }.bind(this));
	};

	CameraSet.prototype.getStreams = function() {
		var deferred = new $.Deferred();
		var promises = _.invoke(this.cameras, 'getStream');
		return $.when.apply($, promises).then(function() {
			// convert our multiple arguments into an array
			return $.when(_.toArray(arguments));
		});
	};
	

	global.CameraSet = CameraSet;
})(window);