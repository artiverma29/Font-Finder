let enabled = false;
let locked = false;
let tooltip = null;
let lastElem = null;

function createTooltip() {
  tooltip = document.createElement('div');
  tooltip.id = 'font-finder-tooltip';
  tooltip.style.position = 'fixed';
  tooltip.style.pointerEvents = 'none';
  tooltip.style.zIndex = 2147483647;
  tooltip.style.background = 'rgba(0,0,0,0.8)';
  tooltip.style.color = 'white';
  tooltip.style.padding = '8px 10px';
  tooltip.style.borderRadius = '6px';
  tooltip.style.fontSize = '12px';
  tooltip.style.maxWidth = '320px';
  tooltip.style.boxShadow = '0 2px 10px rgba(0,0,0,0.5)';
  tooltip.style.transition = 'opacity 0.12s';
  tooltip.style.opacity = '0';
  document.documentElement.appendChild(tooltip);
}

function removeTooltip() {
  if (tooltip && tooltip.parentNode) tooltip.parentNode.removeChild(tooltip);
  tooltip = null;
}

function getFontInfo(el) {
  if (!el) return null;
  const style = window.getComputedStyle(el);
  return {
    family: style.getPropertyValue('font-family'),
    size: style.getPropertyValue('font-size'),
    weight: style.getPropertyValue('font-weight'),
    style: style.getPropertyValue('font-style'),
    lineHeight: style.getPropertyValue('line-height'),
    color: style.getPropertyValue('color'),
    tag: el.tagName.toLowerCase(),
    text: (el.innerText || el.textContent || '').trim().slice(0,200)
  };
}

function updateTooltip(x,y, info) {
  if (!tooltip) createTooltip();
  tooltip.style.left = (x + 12) + 'px';
  tooltip.style.top = (y + 12) + 'px';
  tooltip.style.opacity = '1';
  tooltip.innerHTML = `<div><strong>Font:</strong> ${escapeHtml(info.family)}</div>
    <div><strong>Size:</strong> ${escapeHtml(info.size)} &nbsp; <strong>Weight:</strong> ${escapeHtml(info.weight)}</div>
    <div><strong>Style:</strong> ${escapeHtml(info.style)} &nbsp; <strong>Line-height:</strong> ${escapeHtml(info.lineHeight)}</div>
    <div style="margin-top:6px; font-size:11px; color:#ddd;"><em>Tag:</em> ${escapeHtml(info.tag)} ${ info.text ? '<br><em>Text:</em> ' + escapeHtml(info.text) : '' }</div>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function onMove(e) {
  if (locked) return;
  const el = document.elementFromPoint(e.clientX, e.clientY);
  if (!el) {
    if (tooltip) tooltip.style.opacity = '0';
    return;
  }
  const info = getFontInfo(el);
  if (!info) return;
  lastElem = el;
  updateTooltip(e.clientX, e.clientY, info);
}

function onClick(e) {
  
  if (!enabled) return;
  if (!locked) {
    
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el) return;
    locked = true;
    showLockedInfo(el);
    
    e.preventDefault();
    e.stopPropagation();
  } else {
    
    locked = false;
    if (tooltip) tooltip.style.opacity = '0';
  }
  
  chrome.runtime.sendMessage({type:'stateUpdate', active: enabled, locked});
}

function showLockedInfo(el) {
  const rect = el.getBoundingClientRect();
  const info = getFontInfo(el);
  if (!info) return;
  
  const x = Math.min(window.innerWidth - 340, Math.max(8, rect.left + window.scrollX));
  const y = Math.min(window.innerHeight - 120, Math.max(8, rect.top + window.scrollY));
  updateTooltip(x, y, info);
  if (tooltip) {
    tooltip.style.pointerEvents = 'auto';
    tooltip.style.left = (x) + 'px';
    tooltip.style.top = (y) + 'px';
  }
}

function enable() {
  if (enabled) return;
  enabled = true;
  if (!tooltip) createTooltip();
  document.addEventListener('mousemove', onMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKeyDown, true);
}

function disable() {
  if (!enabled) return;
  enabled = false;
  locked = false;
  document.removeEventListener('mousemove', onMove, true);
  document.removeEventListener('click', onClick, true);
  document.removeEventListener('keydown', onKeyDown, true);
  if (tooltip) {
    tooltip.style.opacity = '0';
    
    setTimeout(() => { removeTooltip(); }, 200);
  }
}

function onKeyDown(e) {
  
  if (e.key === 'Escape') {
    if (locked) {
      locked = false;
      if (tooltip) tooltip.style.opacity = '0';
    } else {
      disable();
      chrome.runtime.sendMessage({type:'stateUpdate', active: false, locked: false});
    }
  }
}


chrome.runtime.onMessage.addListener((msg, sender, sendResp) => {
  if (msg && msg.action) {
    if (msg.action === 'activate') {
      enable();
      sendResp({ok:true});
    } else if (msg.action === 'deactivate') {
      disable();
      sendResp({ok:true});
    } else if (msg.action === 'setLock') {
      locked = !!msg.locked;
      sendResp({locked});
    } else if (msg.action === 'queryState') {
      sendResp({active: enabled, locked});
    }
  }
  
  return false;
});


chrome.runtime.onMessage.addListener((m) => {
  
});
