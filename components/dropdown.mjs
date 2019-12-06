import { vizStyles } from '../constants'
import store from '../store'

const template = document.createElement('template')
template.innerHTML = `
    <form action="">
        <select id="select">
        </select>
    </form>
`



class Dropdown extends customElements {
    constructor() {
        super();

        this._shadowRoot = this.attachShadow({ mode: 'open'});
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this.select = this._shadowRoot.querySelector('#select')
        
        store[this.getAttribute('options')].forEach( option => {
            this.select.appendChild(`<option value=${option}></option>`)
        })

        this.handleChange = this.handleChange.bind(this)

        this.select.oninput = this.handleChange

    }


    handleChange() {
        console.log(this.select.value)
    }

}


window.customElements.define('drop-down', Dropdown)

export default Dropdown