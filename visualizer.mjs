import {store} from './Store/Store.mjs'

class Visualizer {
    constructor({
        audio,
        canvas,
        loop,
        autoplay,
        timer,
        circumferenceSlice,
        radius,
        style,
        width,
        barWidth,
        barHeight,
        barColor,
        barSpacing,
        shadowBlur,
        shadowColor,
        font 
    }) {
        this.isPlaying = false;
        this.autoplay = autoplay || false;
        this.loop = loop || false;
        this.audio = audio || {};
        this.canvas = canvas || {};
        this.canvasCtx = this.canvas.getContext('2d') || null;
        this.author = this.audio.getAttribute('data-author') || '';
        this.title = this.audio.getAttribute('data-title') || '';
        this.ctx = null;
        this.analyser = null;
        this.radius = radius || canvas.width / 2
        this.sourceNode = null;
        this.timer = timer || false;
        this.frequencyData = [];
        this.circumferenceSlice = circumferenceSlice || 0  // 0.0 - 1.0
        this.audioSrc = null;
        this.duration = 0;
        this.radius = radius || 300,
        this.minutes = '00';
        this.seconds = '00';
        this.style = style || 'lounge';
        this.width = width || 300;
        this.barWidth = barWidth || 2;
        this.barHeight = barHeight || 2;
        this.barSpacing = barSpacing || 5;
        this.barColor = barColor || '#ffffff';
        this.shadowBlur = shadowBlur || 10;
        this.shadowColor = shadowColor || '#ffffff';
        this.font = font || ['12px', 'Helvetica'];
        this.gradient = null;
        this.xOff = 0;
        this.yOff = 0;
        

        this.INTERVAL = null
        this.FFT_SIZE = 512
        this.TYPE = {
            'lounge': 'renderLounge',
            'minimal': 'minimal',
            'flatline': 'flatline',
        }
        this.capturer = null
    }


    /**
     * @description
     * Set current audio context.
     *
     * @return {Object}
     */
    setContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new window.AudioContext();
            return this;
        } catch (e) {
            console.info('Web Audio API is not supported.', e);
        }
    }

    /**
     * @description
     * Set buffer analyser.
     *
     * @return {Object}
     */
    setAnalyzer() {
        this.analyser = this.ctx.createAnalyser();
        this.analyser.smoothingTimeConstant = 0.3;
        this.analyser.fftSize = this.FFT_SIZE;
        return this;
    }

    /**
     * @description
     * Set frequency data.
     *
     * @return {Object}
     */
    setFrequencyData() {
        this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        return this;
    }

    /**
     * @description
     * Set source buffer and connect processor and analyser.
     *
     * @return {Object}
     */
    setBufferSourceNode() {
        this.sourceNode = this.ctx.createBufferSource();
        this.sourceNode.loop = this.loop;
        this.sourceNode.connect(this.analyser);
        this.sourceNode.connect(this.ctx.destination);

        this.sourceNode.onended = function () {
            clearInterval(this.INTERVAL);
            this.sourceNode.disconnect();
            this.resetTimer();
            this.isPlaying = false;
            this.sourceNode = this.ctx.createBufferSource();
        }.bind(this);

        return this;
    }

    /**
     * @description
     * Set current media source url.
     *
     * @return {Object}
     */
    setMediaSource() {
        this.audioSrc = this.audio.getAttribute('src');
        return this;
    }

    /**
     * @description
     * Set canvas gradient color.
     *
     * @return {Object}
     */
    setCanvasStyles() {
        this.gradient = this.canvasCtx.createLinearGradient(0, 0, 0, 300);
        this.gradient.addColorStop(1, this.barColor);
        this.canvasCtx.fillStyle = this.gradient;
        this.canvasCtx.shadowBlur = this.shadowBlur;
        this.canvasCtx.shadowColor = this.shadowColor;
        this.canvasCtx.font = this.font.join(' ');
        this.canvasCtx.textAlign = 'center';
        return this;
    }

    updateConfig() {
        let { radius, xOff, yOff } = store
        this.radius = radius
        this.xOff = xOff
        this.yOff = yOff
    }


    /**
     * @description
     * Bind click events.
     *
     * @return {Object}
     */
    bindEvents() {

        // this.capturer = new CCapture({
        //     format: 'webm',
        //     framerate: 24,
        //     quality: 100,
        //     verbose: true,
        //     timeLimit: 5
        // });
        // console.log(this.capturer)

        document.addEventListener('click',  e => {
            if (e.target === this.canvas) {
                e.stopPropagation();
                if (!this.isPlaying) {
                    return (this.ctx.state === 'suspended') ? this.playSound() : this.loadSound();
                } else {
                    return this.pauseSound();
                }
            }
        });

        console.log('attach update viz event')
        window.addEventListener('update-params', e => {
            this.renderFrame()
        })

        window.addEventListener('play', e => {
            console.log('play')
            this.loadSound()
            this.updateConfig()
            // this.playSound()
        })

        if (this.autoplay) {
            this.loadSound();
        }

        return this;
    }


    /**
     * @description
     * Load sound file.
     */
    loadSound() {
        console.log('load sound')
        var req = new XMLHttpRequest();
        req.open('GET', this.audioSrc, true);
        req.responseType = 'arraybuffer';
        console.log('loading')
        this.canvasCtx.fillText('Loading...', this.canvas.width / 2 + 10, this.canvas.height / 2);

        req.onload = function () {
            console.log('finished')
            this.ctx.decodeAudioData(req.response, this.playSound.bind(this), this.onError.bind(this));
        }.bind(this);

        req.send();
    }


    /**
     * @description
     * Play sound from the given buffer.
     *
     * @param  {Object} buffer
     */
    playSound(buffer) {
        this.isPlaying = true;

        if (this.ctx.state === 'suspended') {
            return this.ctx.resume();
        }

        this.sourceNode.buffer = buffer;
        this.sourceNode.start(0);
        this.resetTimer();
        this.startTimer();
        // this.capturer.start();
        console.log('begin capture')
        this.renderFrame();
    }

    /**
     * @description
     * Pause current sound.
     */
    pauseSound(){
        this.ctx.suspend();
        this.isPlaying = false;
    }

     /**
     * @description
     * Start playing timer.
     */
    startTimer() {
        var _this = this;
        this.interval = setInterval(function () {
            if (_this.isPlaying) {
                var now = new Date(_this.duration);
                var min = now.getHours();
                var sec = now.getMinutes();
                _this.minutes = (min < 10) ? '0' + min : min;
                _this.seconds = (sec < 10) ? '0' + sec : sec;
                _this.duration = now.setMinutes(sec + 1);
            }
        }, 1000);
    }

    /**
     * @description
     * Reset time counter.
     */
    resetTimer() {
        var time =  new Date(0, 0);
        this.duration = time.getTime();
    }

    /**
     * @description
     * On audio data stream error fn.
     *
     * @param  {Object} e
     */
    onError() {
        console.info('Error decoding audio file. -- ', e);
    }

    /**
     * @description
     * Render frame on canvas.
     */
    renderFrame() {
        window.requestAnimationFrame(this.renderFrame.bind(this));
        // this.capturer.capture( this.canvas )
        this.analyser.getByteFrequencyData(this.frequencyData);

        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if(this.timer) {
            this.renderTime();
        }
        this.renderText();
        this.renderByStyleType();
        
    }

    /**
     * @description
     * Render audio author and title.
     */
    renderText() {
        var cx = this.canvas.width / 2;
        var cy = this.canvas.height / 2;
        var correction = 10;

        this.canvasCtx.textBaseline = 'top';
        this.canvasCtx.fillText(this.author, cx + correction, cy);
        this.canvasCtx.font = parseInt(this.font[0], 10) + 8 + 'px ' + this.font[1];
        this.canvasCtx.textBaseline = 'bottom';
        this.canvasCtx.fillText(this.title, cx + correction, cy);
        this.canvasCtx.font = this.font.join(' ');
    }

    /**
     * @description
     * Render audio time.
     */
    renderTime() {
        var time = this.minutes + ':' + this.seconds;
        this.canvasCtx.fillText(time, this.canvas.width / 2 + 10, this.canvas.height / 2 + 40);
    }

    /**
     * @description
     * Render frame by style type.
     *
     * @return {Function}
     */
    renderByStyleType() {
        return this[this.TYPE[this.style]]();
    }

    randomNum(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
    }

    affineMap(val,a,b,c,d) {
        return (val - a) * ((d - c) / (b - a)) + c
    }

    ampAverage(val) {
        let average = ( val.reduce( (x, x1) => x + x1) / val.length)
        return average
    }

    minimal() {
        // console.log(this.frequencyData[this.randomNum(0,this.frequencyData.length-1)])
        var cx = this.canvas.width / 2
        var cy = this.canvas.height / 2
        this.ctx.strokeStyle = 'red'
        
        // let freq = this.frequencyData[this.randomNum(0,this.frequencyData.length-1)]
        let freq = this.frequencyData[2]
        // console.log(this.frequencyData.length)

        let scale = this.affineMap(freq, 0, 255, 400, 600)
        // console.log(scale)
        // this.canvasCtx.save();
        this.canvasCtx.beginPath()
        // this.canvasCtx.scale(1.1,1.1)
        this.canvasCtx.rect(cx - scale/2, cy - scale/2, scale, scale)
        this.canvasCtx.strokeStyle = "red"
        this.canvasCtx.lineWidth = 10
        this.canvasCtx.stroke()
        // this.canvasCtx.fill()
        // this.canvasCtx.clearRect(0, 0, this.canvasCtx.width, this.canvasCtx.height);
        // this.canvasCtx.restore()
    }

    flatline() {
        var cx = this.canvas.width / 2
        var cy = this.canvas.height / 2
        var radius = this.radius
        var circumferenceSlice = this.circumferenceSlice
        var maxBarNum = this.width / this.barWidth + this.barSpacing
        // var slicedPercent = Math.floor(maxBarNum * circumferenceSlice);
        // var barNum = maxBarNum - slicedPercent;
        let barNum = maxBarNum;
        var freqJump = Math.floor(this.frequencyData.length / maxBarNum);
        var yoffset = 500
        var xoffset = 510
        // let padding = this.barWidth
        let padding = this.barWidth / 2 ;
        // this.barHeight = 200
        for (let i = 0; i < this.frequencyData.length; i+= 4) {
            let amplitude = this.ampAverage(this.frequencyData.slice(i,i+4)) * 4
            // var amplitude = (this.frequencyData[i] * 3);
            var x = i + ( i/4 * padding);
            let x1 = (barNum - i) - (i/4 * padding);
            // var y = this.affineMap(amplitude, 0,256, 0, 25)
            var y = 0
            // var y = radius - (amplitude / 24 - this.barHeight);
            // var y = amplitude / 24 - this.barHeight
            var w = this.barWidth;
            // var h = amplitude / 12 + this.barHeight;
            var h = this.affineMap(amplitude, 0, 256, 0, 30) + this.barHeight

            this.canvasCtx.save();
                this.canvasCtx.translate(xoffset,yoffset);
                // this.canvasCtx.rotate(alpha - beta);
                this.canvasCtx.fillRect(x, y, w, h);
                this.canvasCtx.fillRect(x1-29, y, w, h);
            this.canvasCtx.restore();

        } 
    }

    /**
     * @description
     * Render lounge style type.
     */
    renderLounge() {
        // var cx = this.canvas.width / 2;
        // var cy = this.canvas.height / 2;
        var cx = this.xOff;
        var cy = this.yOff;
        var radius = this.radius // 
        var circumferenceSlice = this.circumferenceSlice //
        var maxBarNum = Math.floor((radius * 2 * Math.PI) / (this.barWidth + this.barSpacing));
        var slicedPercent = Math.floor(maxBarNum * circumferenceSlice);
        var barNum = maxBarNum - slicedPercent;
        var freqJump = Math.floor(this.frequencyData.length / maxBarNum);

        for (var i = 0; i < barNum; i++) {
            var amplitude = this.frequencyData[i * freqJump] * 3;
            var alpha = (i * 2 * Math.PI ) / maxBarNum;
            var beta = (3 * 45 - this.barWidth) * Math.PI / 180;
            var x = 0;
            var y = radius - (amplitude / 24 - this.barHeight);
            var w = this.barWidth;
            var h = amplitude / 12 + this.barHeight;

            this.canvasCtx.save();
                this.canvasCtx.translate(cx + this.barSpacing, cy + this.barSpacing);
                this.canvasCtx.rotate(alpha - beta);
                this.canvasCtx.fillRect(x, y, w, h);
            this.canvasCtx.restore();
        }
        
    }

    init() {
        console.log('init visualizer')
        this.setContext()
            .setAnalyzer()
            .setFrequencyData()
            .setBufferSourceNode()
            .setMediaSource()
            .setCanvasStyles()
            .bindEvents();
    }

}

export default Visualizer