(function (root) {
  'use strict';

  var _counter = 0;
  var _started = false;
  var _instance = null;

  function uid() {
    _counter += 1;
    return 'progress-' + _counter;
  }

  function getStringTune() {
    if (_instance) return _instance;
    var ST = root.StringTune;
    if (!ST) return null;
    var Ctor = (ST.StringTune && typeof ST.StringTune.getInstance === 'function')
      ? ST.StringTune
      : (typeof ST.getInstance === 'function' ? ST : null);
    if (!Ctor) return null;
    _instance = Ctor.getInstance();
    return _instance;
  }

  function wrapElement(el) {
    if (el.hasAttribute('data-progress-init')) return;
    var scrollLen = parseInt(el.dataset.scrollLength, 10) || 1024;
    var id = uid();

    var wrapper = document.createElement('div');
    wrapper.className = 'progress-wrapper';
    wrapper.setAttribute('string', 'progress');
    wrapper.setAttribute('string-id', id);
    wrapper.setAttribute('string-enter-vp', 'top');
    wrapper.setAttribute('string-exit-vp', 'bottom');
    wrapper.style.minHeight = scrollLen + 'vh';

    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
    el.setAttribute('data-progress-init', id);
  }

  function startStringTune() {
    if (_started) return;
    var st = getStringTune();
    if (!st) return;
    var ST = root.StringTune;
    if (ST.StringLazy) st.use(ST.StringLazy);
    if (!ST.StringProgress) return;
    st.use(ST.StringProgress);
    st.start(0);
    _started = true;
    root.StringTuneContext = st;
  }

  if (root.customElements) {
    root.customElements.define('progress-card', class extends HTMLElement {
      connectedCallback() {
        wrapElement(this);
        startStringTune();
      }
    });
  }

}(typeof globalThis !== 'undefined' ? globalThis : window));
