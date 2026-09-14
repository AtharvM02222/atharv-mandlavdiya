(function (root) {
  'use strict';

  if (!root.document || !root.customElements || root.customElements.get('progress-card')) return;

  function scrollParent(element) {
    var parent = element.parentElement;
    while (parent) {
      var style = root.getComputedStyle(parent);
      if (/(auto|scroll|overlay)/.test(style.overflow + ' ' + style.overflowY)) return parent;
      parent = parent.parentElement;
    }
    return root;
  }

  function scrollPosition(container) {
    return container === root ? (root.pageYOffset || root.scrollY || 0) : container.scrollTop;
  }

  function update(card, wrapper, container) {
    var viewport = container === root ? root.innerHeight : container.clientHeight;
    var wrapperRect = wrapper.getBoundingClientRect();
    var start = container === root
      ? wrapperRect.top + scrollPosition(container)
      : wrapperRect.top - container.getBoundingClientRect().top + scrollPosition(container);
    var end = start + (wrapper.offsetHeight || wrapperRect.height) - viewport;
    var range = end - start;
    var progress = range > 0 ? (scrollPosition(container) - start) / range : 0;
    card.style.setProperty('--progress', String(Math.min(1, Math.max(0, progress))));
  }

  root.customElements.define('progress-card', class extends root.HTMLElement {
    connectedCallback() {
      this._wrapper = root.document.createElement('div');
      this._wrapper.className = 'progress-wrapper';
      this._wrapper.style.minHeight = (parseFloat(this.dataset.scrollLength) || 300) + 'vh';
      this.parentNode.insertBefore(this._wrapper, this);
      this._wrapper.appendChild(this);
      this._container = scrollParent(this);
      this._update = () => update(this, this._wrapper, this._container);
      this._container.addEventListener('scroll', this._update, { passive: true });
      root.addEventListener('resize', this._update, { passive: true });
      this._update();
    }

    disconnectedCallback() {
      if (this._container) this._container.removeEventListener('scroll', this._update);
      root.removeEventListener('resize', this._update);
    }
  });
}(typeof globalThis !== 'undefined' ? globalThis : window));
