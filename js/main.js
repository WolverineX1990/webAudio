;(function(win, doc) {
	var requestAnimationFrame = window.requestAnimationFrame ||
								window.webkitRequestAnimationFrame ||
								window.mozRequestAnimationFrame;
	function $(s) {
		return doc.querySelectorAll(s);
	}

	win.$ = $;

	var xhr = new XMLHttpRequest();
	var ac = new (win.AudioContext ||win.webkitAudioContext || win.mozAudioContext)();
	var gainNode = ac[ac.createGain ? 'createGain' : 'createGainNode']();
	gainNode.connect(ac.destination);
	var size = 128;
	var analyser = ac.createAnalyser();
	analyser.fftSize = size * 2;
	analyser.connect(gainNode);

	var box = $('.content')[0];
	var height;
	var width;

	var canvas = doc.createElement('canvas');
	var ctx = canvas.getContext('2d');
	box.appendChild(canvas);

	function resize() {
		height = box.clientHeight;
		width = box.clientWidth;
		canvas.height = height;
		canvas.width = width;
		var line = ctx.createLinearGradient(0, 0, 0, height);
		line.addColorStop(0, 'red');
		line.addColorStop(0.5, 'green');
		line.addColorStop(1, 'yellow');
		ctx.fillStyle = line;
	}

	resize();

	window.onresize = resize;

	function draw(arr) {
		ctx.clearRect(0, 0, width, height);
		var w = width / size;
		for(var i = 0; i < size;i++) {
			var h = arr[i] / 256 * height;
			ctx.fillRect(w * i, height - h, w * 0.6, h);
		}
	}

	function load(url) {
		xhr.open('GET', url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			ac.decodeAudioData(xhr.response, function(buffer){
				var bufferSource = ac.createBufferSource();
				bufferSource.buffer = buffer;
				bufferSource.connect(analyser);
				// bufferSource.connect(gainNode);
				// bufferSource.connect(ac.destination);
				bufferSource[bufferSource.start ? 'start' : 'noteOn'](0);
				visualizer();
			}, function(err) {
				console.log(err);
			});
		}
		xhr.send();
	}

	var arr = new Uint8Array(analyser.frequencyBinCount);
	function visualizer() {
		analyser.getByteFrequencyData(arr);
		draw(arr);
		requestAnimationFrame(visualizer);
	}

	function changeVolume(precent) {
		gainNode.gain.value = precent;
	}

	window.changeVolume = changeVolume;

	load('/assets/56245955.mp3');
})(window, document);