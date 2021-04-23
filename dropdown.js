const templateString = `
<style>
  :host {
    display: inline-block;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    cursor: pointer;
    position: relative
  }
  ul{
    border: 1px solid #efefef;
    border-radius: .25rem;
    margin: 0;
    list-style: none;
    padding: 0;
    position: absolute;
    width: 100%;
    box-sizing: border-box;
    top: calc(100% - 1px);
    overflow: auto;
    left: 0;
    max-height: 12rem;
    font-size: .9rem;
    color: #515151
  }
  ul::-webkit-scrollbar-track
  {
    background-color: #fafafa;
  }

  ul::-webkit-scrollbar
  {
    width: 4px;
  }

  ul::-webkit-scrollbar-thumb
  {
    background-color: #cbcbcb;
  }

  input {
    border: 1px solid #efefef;
    padding: .5rem;
    font-size: .9rem;
    pointer-events: none;
    color: #515151
  }
  li {
    padding: .5rem;
    border-bottom: 1px solid #efefef;
  }
  li:hover {
    background-color: #fafafa;
  }
  li:last-child {
    border-bottom: none;
  }

</style>
<div><input /></div>`;

const template = document.createElement('template');
template.innerHTML = templateString;

class Dropdown extends HTMLElement {
  constructor() {
    super();
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));
    this._options = new Proxy({ data: [] }, {
      set: (obj, prop, value) => {
        this.render(value);
        obj[prop] = value;
        return true
      }
    });
    document.addEventListener("click", function (e) {
      console.log(shadowRoot.childNodes[0])
      if (e.target !== shadowRoot.childNodes[0] && !shadowRoot.childNodes[0].contains(e.target)) {
        console.log('outside')
      } else {
        e.preventDefault()
      }
    });
  }

  render(arr) {
    const ul = document.createElement('ul');
    arr.forEach(element => {
      const li = document.createElement('li');
      li.textContent = element.label;
      li.addEventListener('click', () => {
        this.shadowRoot.querySelector('input').value = element.label
        this.dispatchEvent(new CustomEvent("onSelectChange", {detail: element}));
      });
      ul.appendChild(li);
    });
    this.shadowRoot.appendChild(ul);
  }

  set options(val) {
    this._options.data = val;
  }

  get options() {
    return this._options.data;
  }
}

if (!customElements.get('spili-dropdown')) {
	window.customElements.define('spili-dropdown', Dropdown);
}
