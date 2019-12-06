let AV;


let lounge_default = {
    style: 'lounge',
    barWidth: 6,
    barHeight: 2,
    barSpacing: 10,
    radius: 90,
    circumferenceSlize: 0.5,
    barColor: '#cafdff',
    shadowBlur: 20,
    shadowColor: '#ffffff',
}

function start() {
    
}

const template = document.createElement('template')
template.innerHTML = `
<div id="container">
    <audio id="audio" src=""></audio>
    <canvas id="canvas" width="1024" height="1024"></canvas>
</div>
`

class Viz extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this.audio = this._shadowRoot.querySelector('#audio')
        this.canvas = this._shadowRoot.querySelector('#canvas')
        this.container = this._shadowRoot.querySelector('#container')
        this.container.addEventListener('click', () => this.initVisualizer)
    }

    initVisualizer() {
        if(!AV) {
            AV = AUDIO.VISUALIZER.getInstance({
                autoplay: false,
                loop: false,
                audio: 'myAudio',
                canvas: 'myCanvas',
                ...lounge_default,
                font: ['12px', 'Helvetica']
            });
        }
    }

    set audiosource(src) {
        this.audio.src = src
    }

    set backgroundImage(src) {
        this.canvas.style.backgroundImage = src
    }

    set visualizerStyle(styleName) {
        
    }
    
}

window.customElements.define('music-viz', Viz)

export default Viz

