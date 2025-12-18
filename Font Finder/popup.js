const toggleBtn = document.getElementById('toggleBtn');
const lockBtn = document.getElementById('lockBtn');
const state = document.getElementById('state');

let active = false;
let locked = false;

async function sendMessage(message) {
  const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, message);
}

toggleBtn.addEventListener('click', async () => {
  active = !active;
  if (active) {
    toggleBtn.textContent = 'Deactivate';
    toggleBtn.classList.add('active');
    state.textContent = 'Active';
    await sendMessage({action:'activate'});
  } else {
    toggleBtn.textContent = 'Activate';
    toggleBtn.classList.remove('active');
    state.textContent = 'Inactive';
    await sendMessage({action:'deactivate'});
  }
});

lockBtn.addEventListener('click', async () => {
  locked = !locked;
  lockBtn.textContent = locked ? 'Unlock' : 'Click to Lock';
  await sendMessage({action: 'setLock', locked});
});


document.addEventListener('DOMContentLoaded', async () => {
  const [tab] = await chrome.tabs.query({active:true, currentWindow:true});
  if (!tab) return;
  chrome.tabs.sendMessage(tab.id, {action:'queryState'}, (resp) => {
    if (resp && resp.active) {
      active = true;
      toggleBtn.textContent = 'Deactivate';
      toggleBtn.classList.add('active');
      state.textContent = 'Active';
    }
    if (resp && resp.locked) {
      locked = resp.locked;
      lockBtn.textContent = locked ? 'Unlock' : 'Click to Lock';
    }
  });
});
