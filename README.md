# Brave Shortcut Disabler

A dependency-free Manifest V3 extension for Brave that blocks keyboard shortcuts handled by web pages. It is enabled globally by default and applies to every ordinary page and frame.

## Install locally in Brave

1. Open `brave://extensions`.
2. Enable **Developer mode**.
3. Select **Load unpacked** and choose this repository folder.
4. Pin **Brave Shortcut Disabler** from the extensions menu if you want quick access to its toggle.

Changes to `manifest.json`, the popup, or the content script require selecting the extension's reload button in `brave://extensions`.

## Behavior

With shortcut blocking enabled, the extension prevents page scripts from receiving:

- Ctrl, Alt, and Command/Meta key combinations;
- Function keys that reach the page;
- Single-key page actions such as `J`, `K`, `Escape`, and `Space` when focus is outside a typing field (enabled by default).

Normal typing inside text fields, textareas, editable regions, select controls, IME composition, and AltGr text entry are preserved. The popup lets you turn blocking off globally or retain modified-key shortcuts while allowing single-key page actions.

## Important limitation

Extensions cannot override keyboard shortcuts Brave handles before a page receives the event, such as opening settings, changing tabs, opening DevTools, or addressing the browser UI. Operating-system and security-sensitive shortcuts are likewise outside the extension's reach. This is intentional browser security behavior; no extension should promise to disable *all* Brave or OS shortcuts.

## Security and privacy

The extension has no network code, analytics, background worker, or access to page contents beyond receiving keyboard events needed to suppress them. Its only permission is `storage`, which stores the two local toggle preferences. The broad content-script match is necessary to block page shortcuts on any site; only install this locally from a copy you trust. It does not capture, store, transmit, or log keystrokes.

Websites remain untrusted content. This extension stops DOM keyboard events at document capture time, but a page can still respond to mouse input or browser features that never emit a DOM keyboard event. Do not treat it as a kiosk, parental-control, access-control, or data-loss-prevention boundary. For those use cases, use Brave/OS policy controls designed to enforce them.
