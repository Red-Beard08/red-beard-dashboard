# Red-Beard Dashboard 1.2.0

An extensible, responsive Obsidian homepage by Red-Beard. It recreates the visual rhythm of an existing Red-Beard homepage while using native Markdown widgets and a Foundation-shaped registration API. The original page is never overwritten.

## Install and use

Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/red-beard-dashboard/`, enable the plugin, and use the ribbon icon or **Open dashboard** command. The dashboard is mobile-compatible and uses a 12-column desktop grid that becomes one column on narrow screens. Open **Settings** to configure storage paths, spacing, breakpoint, refresh, startup, and maintenance actions.

Use **Edit layout** to expose safe drag handles and precise width/mobile-width/height controls. Use **Import/re-import legacy dashboard** only when you want to reorder the native widgets from the legacy page; the source note remains byte-for-byte untouched. Migration and maintenance controls are intentionally kept in Settings.

## Widget extensions

Other plugins can obtain the plugin instance and call `registerWidget(definition)`. Definitions provide a stable `id`, display `name`, optional `defaultLayout`, and a `render(context, container)` function. The context follows the Foundation contract (`app`, `vault`, `settings`, `refresh`, `openNote`, and `notice`) and adds the current layout. Unregistering a widget removes it from the view without deleting its saved layout.

Markdown widget definitions may be placed in `Dashboard/Widgets/` with `type: dashboard-widget`, `widget_id`, `title`, and `enabled` properties. Markdown definitions reference built-in renderers only and never execute arbitrary JavaScript.

Built-in widgets replace the homepage's core Dataview widgets: Quick Actions, Modules, Quote of the Day, Recently Changed, Favorites, Active Projects, Recent Journal, and Vault Pulse. Legacy Dataview blocks remain available on the original page. Missing registered widgets appear as recoverable placeholders when enabled in settings.

The managed layout note uses bounded `red-beard-dashboard:managed-start` and `red-beard-dashboard:managed-end` markers. Refreshes use `Vault.process()` and skip unchanged Markdown, preserving user-authored content outside the block.

## Development

```text
npm ci
npm run typecheck
npm run build
```
