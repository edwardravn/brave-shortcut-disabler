(() => {
  "use strict";

  const defaults = {
    enabled: true,
    blockSingleKeyActions: true
  };

  const enabled = document.querySelector("#enabled");
  const blockSingleKeyActions = document.querySelector("#block-single-key-actions");
  const status = document.querySelector("#status");

  function updateView(settings) {
    enabled.checked = settings.enabled !== false;
    blockSingleKeyActions.checked = settings.blockSingleKeyActions !== false;
    blockSingleKeyActions.disabled = !enabled.checked;
    status.textContent = enabled.checked
      ? "Web-page shortcut blocking is on."
      : "Web-page shortcut blocking is off.";
  }

  chrome.storage.local.get(defaults, updateView);

  enabled.addEventListener("change", () => {
    chrome.storage.local.set({ enabled: enabled.checked }, () => {
      updateView({ enabled: enabled.checked, blockSingleKeyActions: blockSingleKeyActions.checked });
    });
  });

  blockSingleKeyActions.addEventListener("change", () => {
    chrome.storage.local.set({ blockSingleKeyActions: blockSingleKeyActions.checked }, () => {
      updateView({ enabled: enabled.checked, blockSingleKeyActions: blockSingleKeyActions.checked });
    });
  });
})();
