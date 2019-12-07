const template = document.createElement('template')
template.innerHTML = `
    <button id="start">play</button>
`

class Play extends HTMLElement {
    constructor() {
        super()

        this._shadowRoot = this.attachShadow({ 'mode': 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this.handleClick = this.handleClick.bind(this)
        this.button = this._shadowRoot.querySelector('#start');
        this.button.addEventListener('click', this.handleClick)
        
        this.name = this.getAttribute('name')
        
        this.state = {
            play: false
        }

    }

    handleClick() {
        this.state.play = !this.state.play
        this.dispatchEvent(new CustomEvent(this.name, { bubbles: true, detail: { data: this.state.play}}))
    }
}

window.customElements.define('play-button', Play)

export default Play