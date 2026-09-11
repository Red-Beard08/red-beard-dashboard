# Red-Beard Dashboard

An extensible, responsive Obsidian homepage by Red-Beard. It provides native vault widgets, a desktop drag-and-drop grid editor, and a stable registration API for other plugins.

## Install and use

Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/red-beard-dashboard/`, enable the plugin, and use the ribbon icon or **Open dashboard** command. Open **Settings** to configure the dashboard and optional legacy paths. The configured legacy note is never overwritten.

Use **Import/re-import legacy dashboard** to create `Dashboard/Layout.md` and establish the current homepage as the visual baseline. Use **Edit layout** on desktop to drag widgets, change desktop width (`W`), mobile width (`M`), height (`H`), and lock widgets. Mobile uses the saved widths and remains view-first.

## Widget extensions

Other plugins can obtain the plugin instance and call `registerWidget(definition)`. Definitions provide a stable `id`, display `name`, optional `defaultLayout`, and a `render(context, container)` function. The context includes the Obsidian app, settings, layout, refresh, open-note, and notification helpers. The returned function unregisters the widget safely.

Markdown widget definitions may be placed in `Dashboard/Widgets/` with `type: dashboard-widget`, `widget_id`, `title`, and `enabled` properties. Markdown definitions reference built-in renderers only and never execute arbitrary JavaScript.

Built-in widgets replace the homepage's core Dataview widgets: Quick Actions, Modules, Quote of the Day, Recently Changed, Favorites, Active Projects, Recent Journal, and Vault Pulse. Legacy Dataview blocks remain available on the original page.

## Development

```text
npm ci
npm run typecheck
npm run build
```
