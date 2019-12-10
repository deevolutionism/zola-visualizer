const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
    }
    input {
        width: 40px;
    }
</style>
<div>
    <label id="label"></label>
    <input 
        type="number"
        step="2"
        min="1"
        max="100"
        value="50" 
        class="slider" 
        id="slider">
    <p id="slider-value"></p>
</div>
`;

class Slider extends HTMLElement {

    static get observedAttributes() {
        return ['value']
    }

    constructor() {
        super();
        this._shadowRoot = this.attachShadow({ 'mode': 'open' })
        this._shadowRoot.appendChild(template.content.cloneNode(true))

        this.name = this.getAttribute('name')
        this.paramName = this.getAttribute('param-name')
        
        this.$slider = this._shadowRoot.querySelector('#slider')
        this.$sliderValue = this._shadowRoot.querySelector('#slider-value')
        this.$label = this._shadowRoot.querySelector('#label')

        this.$label.innerHTML = this.getAttribute('name')

        this.$slider.oninput = (e) => {
            this.setAttribute('value', this.$slider.value)
            this.dispatchEvent(new CustomEvent('update-params', { bubbles: true, detail: { data: this.$slider.value, param: this.paramName }}))
        }
        

        // this.slideUpdate = new Event(this.name, { detail: { data: this.$slider.value} })
        

        this.getAttributeNames().forEach( attrKey => {
            this.$slider.setAttribute(attrKey, this.getAttribute(attrKey))
        })

        
    }

    _renderSlider() {
        
    }

    handleSliderChange() {

        updateAttribute(this)
    }

    

    attributeChangedCallback(name, oldValue, newValue) {
        switch(name) {
            case 'value':
                this.$sliderValue.innerHTML = newValue
                break;
        }
    }

    get sliderVal() {
        
    }
}

window.customElements.define('slider-param', Slider)

export default Slider