# Red-Beard Dashboard 1.3.0

An extensible, responsive Obsidian homepage by Red-Beard. It recreates the visual rhythm of an existing Red-Beard homepage while using native Markdown widgets and a Foundation-shaped registration API. The original page is never overwritten.

## Install and use

Copy `main.js`, `manifest.json`, and `styles.css` to `.obsidian/plugins/red-beard-dashboard/`, enable the plugin, and use the ribbon icon or **Open dashboard** command. The dashboard is mobile-compatible and uses a 12-column desktop grid that becomes one column on narrow screens. Open **Settings** to configure storage paths, spacing, breakpoint, refresh, startup, and maintenance actions.

Use **Edit layout** to expose safe drag handles and precise width/mobile-width/height controls. While editing, **Add widgets** opens the global widget library, where native, add-on, and Markdown-defined widgets can be added or removed from the live dashboard without deleting their saved layouts. Card-to-card movement uses vertical **Insert above** and **Insert below** zones; the column drop row starts a new column/row placement. The **Manage** action on Quick Actions or Modules opens a focused manager where you can hide entries, reorder them, and choose Standard, Blue highlight, Red highlight, or Hollow styling. Use **Import/re-import legacy dashboard** only when you want to reorder the native widgets from the legacy page; the source note remains byte-for-byte untouched. Migration and maintenance controls are intentionally kept in Settings.

## Widget extensions

Other plugins can obtain the plugin instance and call `registerWidget(definition)`. Definitions provide a stable `id`, display `name`, optional `defaultLayout`, and a `render(context, container)` function. The context follows the Foundation contract (`app`, `vault`, `settings`, `refresh`, `openNote`, and `notice`) and adds the current layout. Unregistering a widget removes it from the view without deleting its saved layout.

Other add-ons can also expose a dashboard button through `registerModule({ id, name, command, icon, description, order })`. Registered modules appear in the Modules card and in Settings, where users can enable or disable them. Module ownership lives with the contributing add-on, so a disabled or unavailable add-on disappears automatically while its visibility preference is retained. Registration tolerates slow plugin startup, so modules such as Vault Backup can appear even when their add-on loads after the dashboard.

Module settings include a display position and optional flavor text. Position `1` is first; entering a position already used by another module shifts the intervening modules down and renumbers the complete list. Flavor text replaces the registering add-on's default description on the dashboard card, and can be left blank to show only the module name. The same controls are available from the Modules manager opened during layout editing.

Markdown widget definitions may be placed in `Dashboard/Widgets/` with `type: dashboard-widget`, `widget_id`, `title`, and `enabled` properties. Markdown definitions reference built-in renderers only and never execute arbitrary JavaScript.

Built-in widgets replace the homepage's core Dataview widgets: Quick Actions, Modules, Quote of the Day, Recently Changed, Favorites, Active Projects, Recent Journal, and Vault Pulse. Legacy Dataview blocks remain available on the original page. Missing registered widgets appear as recoverable placeholders when enabled in settings.

The Settings → Widgets section is the authoritative global list. A hidden widget remains registered and keeps its layout, but is omitted from the dashboard until enabled again. This applies equally to built-in widgets, add-on widgets, and safe Markdown widget definitions.

The managed layout note uses bounded `red-beard-dashboard:managed-start` and `red-beard-dashboard:managed-end` markers. Refreshes use `Vault.process()` and skip unchanged Markdown, preserving user-authored content outside the block.

## Development

```text
npm ci
npm run typecheck
npm run build
```
