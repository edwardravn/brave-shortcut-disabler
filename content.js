(() => {
  "use strict";

  const DEFAULT_SETTINGS = Object.freeze({
    enabled: true,
    blockSingleKeyActions: true
  });

  let settings = { ...DEFAULT_SETTINGS };
  const blockedKeys = new Set();

  // Apply the default immediately. Loading storage asynchronously must not leave
  // a window in which a document can register its keyboard shortcuts first.
  chrome.storage.local.get(DEFAULT_SETTINGS, (stored) => {
    settings = {
      enabled: stored.enabled !== false,
      blockSingleKeyActions: stored.blockSingleKeyActions !== false
    };
  });

  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName !== "local") {
      return;
    }

    if (changes.enabled) {
      settings.enabled = changes.enabled.newValue !== false;
    }
    if (changes.blockSingleKeyActions) {
      settings.blockSingleKeyActions = changes.blockSingleKeyActions.newValue !== false;
    }
  });

  function eventIdentifier(event) {
    return event.code || `${event.key}:${event.location}`;
  }

  function isEditableTarget(event) {
    const target = event.composedPath().find((node) => node instanceof Element);
    if (!(target instanceof Element)) {
      return false;
    }

    return Boolean(target.closest(
      "textarea, select, [contenteditable]:not([contenteditable='false']), " +
      "input:not([type='button']):not([type='checkbox']):not([type='color']):" +
      "not([type='file']):not([type='image']):not([type='radio']):not([type='range']):" +
      "not([type='reset']):not([type='submit']), [role='textbox'], [role='searchbox'], [role='combobox']"
    ));
  }

  function isFunctionKey(key) {
    return /^F(?:[1-9]|1[0-9]|2[0-4])$/.test(key);
  }

  function hasShortcutModifier(event) {
    // AltGr commonly appears as Ctrl+Alt. Treat it as text input so layouts that
    // depend on AltGr are not broken by the extension.
    if (event.getModifierState?.("AltGraph")) {
      return false;
    }

    return event.ctrlKey || event.metaKey || event.altKey;
  }

  function shouldBlock(event) {
    if (!settings.enabled || event.isComposing || event.defaultPrevented) {
      return false;
    }

    if (["Alt", "AltGraph", "CapsLock", "Control", "Fn", "Meta", "NumLock", "ScrollLock", "Shift"].includes(event.key)) {
      return false;
    }

    if (hasShortcutModifier(event) || isFunctionKey(event.key)) {
      return true;
    }

    // Outside editable controls, individual letters and action keys are often
    // website shortcuts (for example, J/K navigation). Block them when the
    // stricter setting is selected, while retaining normal typing in fields.
    return settings.blockSingleKeyActions && !isEditableTarget(event);
  }

  function cancel(event) {
    event.preventDefault();
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  document.addEventListener("keydown", (event) => {
    if (!shouldBlock(event)) {
      return;
    }

    blockedKeys.add(eventIdentifier(event));
    cancel(event);
  }, true);

  document.addEventListener("keypress", (event) => {
    if (blockedKeys.has(eventIdentifier(event)) || shouldBlock(event)) {
      cancel(event);
    }
  }, true);

  document.addEventListener("keyup", (event) => {
    const identifier = eventIdentifier(event);
    if (blockedKeys.delete(identifier) || shouldBlock(event)) {
      cancel(event);
    }
  }, true);
})();
