import test, { afterEach } from 'node:test';
import assert from 'node:assert/strict';

class FakeStyle {
  setProperty(name, value) {
    this[name] = value;
  }

  getPropertyValue(name) {
    return this[name] || '';
  }
}

class FakeElement {
  constructor() {
    this.children = [];
    this.attributes = new Map();
    this.style = new FakeStyle();
    this.listeners = new Map();
    this.parentElement = null;
    this._rect = { top: 0, height: 0 };
    this._height = 0;
    this.clientHeight = 0;
    this.scrollHeight = 0;
    this.scrollTop = 0;
  }

  get parentNode() {
    return this.parentElement;
  }

  get dataset() {
    return Object.fromEntries([...this.attributes]
      .filter(([name]) => name.startsWith('data-'))
      .map(([name, value]) => [
        name.slice(5).replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()),
        value
      ]));
  }

  get offsetHeight() {
    return this._height;
  }

  set className(value) {
    this.attributes.set('class', value);
  }

  get className() {
    return this.attributes.get('class') || '';
  }

  setAttribute(name, value) {
    this.attributes.set(name, String(value));
  }

  hasAttribute(name) {
    return this.attributes.has(name);
  }

  appendChild(child) {
    child.parentElement = this;
    this.children.push(child);
    return child;
  }

  insertBefore(child, reference) {
    child.parentElement = this;
    const index = this.children.indexOf(reference);
    this.children.splice(index < 0 ? this.children.length : index, 0, child);
    return child;
  }

  removeChild(child) {
    this.children.splice(this.children.indexOf(child), 1);
    child.parentElement = null;
    return child;
  }

  contains(child) {
    return this.children.includes(child) || this.children.some((item) => item.contains(child));
  }

  getBoundingClientRect() {
    return this._rect;
  }

  addEventListener(type, listener) {
    if (!this.listeners.has(type)) this.listeners.set(type, new Set());
    this.listeners.get(type).add(listener);
  }

  removeEventListener(type, listener) {
    this.listeners.get(type)?.delete(listener);
  }
}

class FakeHTMLElement extends FakeElement {}

const body = new FakeElement();
const head = new FakeElement();
const documentElement = new FakeElement();
globalThis.HTMLElement = FakeHTMLElement;
globalThis.document = {
  body,
  head,
  documentElement,
  createElement: () => new FakeElement(),
  getElementById(id) {
    return [head, ...head.children].find((element) => element.attributes.get('id') === id) || null;
  }
};
globalThis.customElements = {
  registry: new Map(),
  define(name, constructor) {
    this.registry.set(name, constructor);
  },
  get(name) {
    return this.registry.get(name);
  }
};
globalThis.innerHeight = 1000;
globalThis.pageYOffset = 0;
globalThis.scrollY = 0;
globalThis.listeners = new Map();
globalThis.addEventListener = (type, listener) => {
  if (!globalThis.listeners.has(type)) globalThis.listeners.set(type, new Set());
  globalThis.listeners.get(type).add(listener);
};
globalThis.removeEventListener = (type, listener) => globalThis.listeners.get(type)?.delete(listener);
globalThis.getComputedStyle = (element) => ({
  overflow: element._overflow || 'visible',
  overflowY: element._overflowY || 'visible'
});

await import('../atharvmandlavdiya.js');

const ProgressCard = customElements.get('progress-card');
const createdCards = [];

afterEach(() => {
  for (const card of createdCards.splice(0)) {
    card.parentElement?.removeChild(card);
    card.disconnectedCallback();
  }
  globalThis.pageYOffset = 0;
});

function createCard(parent = body, scrollLength = '300') {
  const card = new ProgressCard();
  card.setAttribute('data-scroll-length', scrollLength);
  parent.appendChild(card);
  card.connectedCallback();
  createdCards.push(card);
  const wrapper = card.parentElement;
  wrapper._height = 3000;
  wrapper._rect = { top: 0, height: 3000 };
  card._onScroll();
  return { card, wrapper };
}

test('registers automatically, injects CSS, and needs no StringTune', () => {
  assert.equal(typeof ProgressCard, 'function');
  assert.match(head.children[0].textContent || head.children[0].style?.textContent || '', /progress-wrapper/);
  assert.equal(globalThis.StringTune, undefined);
});

test('uses the window scroll range and clamps at both ends', () => {
  const { card } = createCard();
  assert.equal(card.style.getPropertyValue('--progress'), '0');
  globalThis.pageYOffset = 1000;
  card.parentElement._rect = { top: -1000, height: 3000 };
  card._onScroll();
  assert.equal(card.style.getPropertyValue('--progress'), '0.5');
  globalThis.pageYOffset = 2000;
  card.parentElement._rect = { top: -2000, height: 3000 };
  card._onScroll();
  assert.equal(card.style.getPropertyValue('--progress'), '1');
  globalThis.pageYOffset = 2500;
  card.parentElement._rect = { top: -2500, height: 3000 };
  card._onScroll();
  assert.equal(card.style.getPropertyValue('--progress'), '1');
});

test('uses the nearest nested scroll container', () => {
  globalThis.pageYOffset = 0;
  const brand = new FakeElement();
  brand._overflowY = 'auto';
  brand.clientHeight = 500;
  brand.scrollHeight = 2000;
  brand._rect = { top: 10, height: 500 };
  body.appendChild(brand);
  const { card, wrapper } = createCard(brand);
  wrapper._height = 1500;
  wrapper._rect = { top: 10, height: 1500 };
  brand.scrollTop = 500;
  wrapper._rect = { top: -490, height: 1500 };
  card._onScroll();
  assert.equal(card.style.getPropertyValue('--progress'), '0.5');
});

test('keeps cards independent and removes listeners on disconnect', () => {
  const first = createCard();
  const second = createCard();
  assert.notEqual(first.card, second.card);
  assert.equal(globalThis.listeners.get('resize').size >= 2, true);
  first.card.parentElement.removeChild(first.card);
  first.card.disconnectedCallback();
  assert.equal(globalThis.listeners.get('resize').size >= 1, true);
  second.card.parentElement.removeChild(second.card);
  second.card.disconnectedCallback();
  assert.equal(globalThis.listeners.get('resize').size, 0);
});
