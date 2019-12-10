import { store } from '../store/store.mjs'
import Viz from './viz.mjs'

const template = document.createElement('template')
template.innerHTML = `
    <button id="reset">reset</button>
`

class Reset extends HTMLElement {
    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))
        
        this.button = this._shadowRoot.querySelector('#reset')
        this.button.addEventListener('click', this.handleClick)
    }

    handleClick() {
        console.log('delete player')
        store.AV = null
        let visualizer = document.querySelector('music-viz')
        visualizer.parentNode.removeChild(visualizer)
        let elem = document.createElement('div', { is: 'music-viz' })
        console.log(elem)
        document.body.appendChild(elem)
    }

    
}


window.customElements.define('reset-button', Reset)

export default Reset