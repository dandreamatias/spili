const templateString = `
<style>
  :host {
    display: inline-block;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: pointer;
  }
    button {
    padding: 0 1.5rem;
    height: 2.625rem;
    text-transform: capitalize;
    cursor: pointer;
    }
</style>
<button><slot></slot></button>
`;
const template = document.createElement('template');
template.innerHTML = templateString;

class Button extends HTMLElement {
	constructor() {
		super();
		const shadowRoot = this.attachShadow({ mode: 'open' });
		shadowRoot.appendChild(template.content.cloneNode(true));
		shadowRoot.addEventListener('click', () => console.log('click'));
	}
}

if (!customElements.get('spili-button')) {
	window.customElements.define('spili-button', Button);
}
