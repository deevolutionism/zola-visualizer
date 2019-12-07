const template = document.createElement('template')
template.innerHTML = `
    <style>
        :host {
            display: flex;
            justify-content: space-around;
        }
    </style>
    <div id="control-panel>
        <slot name="content">content</slot>
    </div>
`
class ControlPanel extends HTMLElement {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open'})
        this._shadowRoot.appendChild(template.content.cloneNode(true))
    }
}

window.customElements.define('control-panel', ControlPanel)

export default ControlPanel