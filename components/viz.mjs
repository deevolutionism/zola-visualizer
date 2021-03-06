import Visualizer from '../Visualizer.mjs'
import { store } from '../Store/store.mjs'

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

const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        background-size: contain;
        background-repeat: no-repeat;
    }
</style>
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
        
        this.handleClick = this.handleClick.bind(this)
        this.onclick = this.handleClick

        this.container.style.backgroundImage = `url(${this.getAttribute('img-src')})`
        this.audio.src = this.getAttribute('audio-src')
        this.AV = null
        
        this.loop = this.getAttribute('loop') || false
        this.autoplay = this.getAttribute('autoplay') || false
        this.style

        /* visualizer parameters. * = required
            audio*, 
            canvas*,
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
        */

        
    }

    handleClick() {
        console.log('click')
        this.initVisualizer()
    }

    initVisualizer() {
        if(!store.AV) {
            let { width, barWidth, barHeight, barSpacing, xOff, yOff } = store
            store.AV = new Visualizer(
                {
                    autoplay: false,
                    loop: true,
                    audio: this.audio,
                    canvas: this.canvas,
                    circumferenceSlize: 90,
                    style: 'lounge',
                    width,
                    barWidth,
                    barHeight,
                    barSpacing,
                    xOff,
                    yOff
                }
            )
            store.AV.init()
            console.log(store.AV)
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

