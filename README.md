# Red-Beard Dashboard 1.1.0

An extensible, responsive Obsidian homepage by Red-Beard. It provides native vault widgets, a desktop drag-and-drop grid editor, and a stable registration API for other plugins. This release follows the Red-Beard Add-on Foundation contract while remaining self-contained: no local machine path or Foundation workspace dependency is required.

## Install and use

Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/red-beard-dashboard/`, enable the plugin, and use the ribbon icon or **Open dashboard** command. Open **Settings** to configure the vault-relative root, layout note, widget-definition folder, legacy path, responsive breakpoint, spacing, refresh behavior, and startup behavior. Paths are normalized and cannot escape the vault. The configured legacy note is never overwritten.

Use **Import/re-import legacy dashboard** to create the managed configuration note (default `Dashboard/Layout.md`) and establish the current homepage as the visual baseline. Use **Edit layout** on desktop to drag widgets into the shaded top/left/right/bottom drop zones, change desktop width (`W`), mobile width (`M`), height (`H`), and lock widgets. Mobile uses the saved widths, collapses to one column at the configured breakpoint, and remains view-first.

## Widget extensions

Other plugins can obtain the plugin instance and call `registerWidget(definition)`. Definitions provide a stable `id`, display `name`, `defaultLayout`, optional `mobile` behavior/settings schema, and a `render(context, container)` function. The context follows the Foundation contract (`app`, `vault`, `settings`, `refresh`, `openNote`, and `notice`) and adds the current dashboard layout. The returned function unregisters the widget safely; saved layouts are retained if a contributing plugin is temporarily unavailable.

Markdown widget definitions may be placed in `Dashboard/Widgets/` with `type: dashboard-widget`, `widget_id`, `title`, and `enabled` properties. Markdown definitions reference built-in renderers only and never execute arbitrary JavaScript.

Built-in widgets replace the homepage's core Dataview widgets: Quick Actions, Modules, Quote of the Day, Recently Changed, Favorites, Active Projects, Recent Journal, and Vault Pulse. Legacy Dataview blocks remain available on the original page. Missing registered widgets appear as recoverable placeholders when enabled in settings.

The managed layout note uses bounded `red-beard-dashboard:managed-start` and `red-beard-dashboard:managed-end` markers. Refreshes use `Vault.process()` and skip unchanged Markdown, preserving user-authored content outside the block.

## Development

```text
npm ci
npm run typecheck
npm run build
```
