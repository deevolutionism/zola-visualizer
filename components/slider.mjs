const template = document.createElement('template');
template.innerHTML = `
<style>
    :host {
        display: block;
    }
    #canvas {
        background-size: contain;
        background-repeat: no-repeat;
    }
</style>
<div>
    <label id="label"></label>
    <input 
        type="range" 
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
        
        this.$slider = this._shadowRoot.querySelector('#slider')
        this.$sliderValue = this._shadowRoot.querySelector('#slider-value')
        this.$label = this._shadowRoot.querySelector('#label')

        this.$label.innerHTML = this.getAttribute('name')

        this.$slider.oninput = (e) => {
            this.setAttribute('value', this.$slider.value)
        }

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