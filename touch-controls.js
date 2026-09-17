/* Touch controls for keyboard-first HTML5/Ruffle games.
   Hidden on pointer devices; shown on iPad/tablet touch screens. */
(() => {
  if (window.__mlvTouchControls) return;
  window.__mlvTouchControls = true;
  const coarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  const ua = navigator.userAgent || '';
  const touchCapable = (navigator.maxTouchPoints || 0) > 1 && /iPad|iPhone|iPod|Android|Macintosh/i.test(ua);
  if (!coarse && !touchCapable) return;

  const keys = [
    ['left', 'ArrowLeft', '◀'],
    ['right', 'ArrowRight', '▶'],
    ['up', 'ArrowUp', '▲'],
    ['down', 'ArrowDown', '▼'],
    ['space', ' ', 'SPACE'],
    ['enter', 'Enter', 'ENTER']
  ];
  const style = document.createElement('style');
  style.textContent = `
    #mlv-touch-controls{position:fixed;z-index:2147483646;left:0;right:0;bottom:max(10px,env(safe-area-inset-bottom));display:flex;justify-content:center;align-items:end;gap:10px;padding:8px 12px;pointer-events:none;font:600 13px system-ui,sans-serif;user-select:none;-webkit-user-select:none}
    #mlv-touch-controls .mlv-pad{display:grid;grid-template-columns:repeat(3,52px);grid-template-rows:repeat(2,48px);gap:6px;pointer-events:auto}
    #mlv-touch-controls button{appearance:none;border:1px solid rgba(255,255,255,.5);border-radius:10px;background:rgba(18,18,24,.78);color:#fff;box-shadow:0 3px 10px rgba(0,0,0,.35);min-width:52px;height:48px;font:inherit;touch-action:none;-webkit-tap-highlight-color:transparent}
    #mlv-touch-controls button:active,#mlv-touch-controls button.mlv-down{background:rgba(105,64,210,.92);transform:translateY(1px)}
    #mlv-touch-controls .mlv-up{grid-column:2}.mlv-left{grid-column:1;grid-row:2}.mlv-down{grid-column:2;grid-row:2}.mlv-right{grid-column:3;grid-row:2}
    #mlv-touch-controls .mlv-actions{display:flex;flex-direction:column;gap:6px;pointer-events:auto}
    #mlv-touch-controls .mlv-actions button{min-width:82px}
    @media (orientation:portrait){#mlv-touch-controls{transform:scale(.9);transform-origin:bottom center}}
  `;
  document.head.appendChild(style);
  const root = document.createElement('div');
  root.id = 'mlv-touch-controls';
  const pad = document.createElement('div'); pad.className = 'mlv-pad';
  const actions = document.createElement('div'); actions.className = 'mlv-actions';
  const dispatch = (type, key) => {
    const init = {key, code:key === ' ' ? 'Space' : key, bubbles:true, cancelable:true, composed:true};
    const ev = new KeyboardEvent(type, init);
    try { Object.defineProperty(ev, 'keyCode', {get: () => key === ' ' ? 32 : key === 'Enter' ? 13 : ({ArrowLeft:37,ArrowUp:38,ArrowRight:39,ArrowDown:40}[key] || 0)}); } catch (_) {}
    window.dispatchEvent(ev); document.dispatchEvent(ev);
    if (document.activeElement && document.activeElement !== document.body) document.activeElement.dispatchEvent(ev);
  };
  keys.forEach(([cls,key,label]) => {
    const b = document.createElement('button'); b.type='button'; b.className = `mlv-${cls}`; b.textContent=label; b.setAttribute('aria-label', key === ' ' ? 'Space' : key);
    const press = e => { e.preventDefault(); b.classList.add('mlv-down'); dispatch('keydown',key); };
    const release = e => { e.preventDefault(); b.classList.remove('mlv-down'); dispatch('keyup',key); };
    b.addEventListener('pointerdown', press, {passive:false}); b.addEventListener('pointerup', release, {passive:false}); b.addEventListener('pointercancel', release, {passive:false}); b.addEventListener('pointerleave', release, {passive:false});
    (cls === 'space' || cls === 'enter' ? actions : pad).appendChild(b);
  });
  root.append(pad, actions); document.body.appendChild(root);
})();
