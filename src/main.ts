import { App, Notice, Plugin, TFile } from "obsidian";
import { DashboardView } from "./dashboard";
import { DashboardSettingsTab } from "./settings";
import { DASHBOARD_VIEW, type DashboardContext, type DashboardSettings, type DashboardWidgetDefinition, type WidgetLayout } from "./types";
import { defaultLayouts, defaultSettings, normalizeSettings, readManagedLayout, sanitizeLayout, writeLayoutNote, WIDGET_ORDER } from "./utils";

const VIEW_FALLBACKS: Record<string, string> = {
  "quote-library:open-dashboard": "quote-library-dashboard",
  "scripture-library:open-dashboard": "scripture-library-dashboard",
  "movie-library:open-dashboard": "movie-library-dashboard",
  "study-planner:open-dashboard": "mens-study-planner-dashboard",
  "mens-study-planner:open-dashboard": "mens-study-planner-dashboard",
  "marriage-companion:open-dashboard": "marriage-companion-dashboard",
  "vault-backup:open-dashboard": "vault-backup-dashboard",
  "prayer-library:open-dashboard": "prayer-library-dashboard"
};

// Commands are the preferred integration seam. View IDs are retained only as
// a fallback for older or disabled Red-Beard add-ons.
function execute(app: App, commandOrView: string): void {
  const commands = (app as App & { commands?: { executeCommandById: (id: string) => boolean } }).commands;
  if (commands?.executeCommandById(commandOrView)) return;
  const view = VIEW_FALLBACKS[commandOrView] ?? commandOrView;
  void app.workspace.getLeaf(true).setViewState({ type: view, active: true });
}

function parseFrontmatter(content: string): Record<string, string | boolean> {
  // Markdown widget definitions are deliberately limited to flat scalar
  // frontmatter; JavaScript in widget notes is never evaluated.
  if (!content.startsWith("---\n")) return {};
  const end = content.indexOf("\n---\n", 4);
  if (end < 0) return {};
  const result: Record<string, string | boolean> = {};
  for (const line of content.slice(4, end).split("\n")) {
    const match = /^([A-Za-z0-9_-]+):\s*(.*)$/.exec(line);
    if (!match) continue;
    const value = match[2].trim();
    result[match[1]] = value === "true" ? true : value === "false" ? false : value.replace(/^['"]|['"]$/g, "");
  }
  return result;
}

export default class RedBeardDashboard extends Plugin {
  settings: DashboardSettings = defaultSettings();
  layout: Record<string, WidgetLayout> = defaultLayouts();
  widgets = new Map<string, DashboardWidgetDefinition>();
  editing = false;
  private interval?: number;
  private markdownWidgetIds = new Set<string>();

  async onload(): Promise<void> {
    const stored = await this.loadData() as (Partial<DashboardSettings> & { layout?: Record<string, WidgetLayout> }) | null;
    this.settings = normalizeSettings(stored);
    this.layout = sanitizeLayout(stored?.layout);
    await this.loadLayoutNote();
    this.registerView(DASHBOARD_VIEW, leaf => new DashboardView(leaf, this));
    this.addSettingTab(new DashboardSettingsTab(this.app, this));
    this.registerNativeWidgets();
    await this.loadMarkdownWidgets();
    this.addRibbonIcon("layout-dashboard", "Open Red-Beard Dashboard", () => void this.openDashboard());
    this.addCommand({ id: "open-dashboard", name: "Open dashboard", callback: () => void this.openDashboard() });
    this.addCommand({ id: "edit-layout", name: "Edit dashboard layout", callback: () => this.toggleEditor() });
    this.addCommand({ id: "refresh", name: "Refresh dashboard", callback: () => void this.refreshViews() });
    this.addCommand({ id: "open-settings", name: "Open dashboard settings", callback: () => this.openSettings() });
    this.addCommand({ id: "import-legacy", name: "Import/re-import legacy dashboard", callback: () => void this.importLegacy() });
    this.addCommand({ id: "reset-layout", name: "Reset dashboard layout", callback: () => void this.resetLayout() });
    if (this.settings.autoRefreshSeconds > 0) this.interval = window.setInterval(() => void this.refreshViews(), this.settings.autoRefreshSeconds * 1000);
    if (this.settings.startup) this.app.workspace.onLayoutReady(() => void this.openDashboard());
  }

  onunload(): void {
    if (this.interval) window.clearInterval(this.interval);
    for (const widget of this.widgets.values()) widget.cleanup?.();
    this.app.workspace.getLeavesOfType(DASHBOARD_VIEW).forEach(leaf => leaf.detach());
  }

  registerWidget(definition: DashboardWidgetDefinition): () => void {
    if (!definition.id || this.widgets.has(definition.id)) throw new Error(`Widget ID already registered: ${definition.id}`);
    this.widgets.set(definition.id, definition);
    if (!this.layout[definition.id]) this.layout[definition.id] = this.layoutFor(definition);
    void this.refreshViews();
    return () => { this.widgets.delete(definition.id); void this.refreshViews(); };
  }

  layoutFor(definition: DashboardWidgetDefinition): WidgetLayout {
    return sanitizeLayout({ [definition.id]: definition.defaultLayout ?? {} }, this.layout)[definition.id] ?? {
      x: 1, w: 4, mobileW: 12, h: 1, order: 99, visible: true, locked: false, sizingMode: "grid"
    };
  }

  context(): DashboardContext {
    return { app: this.app, vault: this.app.vault, settings: this.settings, layout: this.layout, refresh: () => this.refreshViews(), openNote: path => this.openNote(path), notice: message => new Notice(message) };
  }

  async saveSettings(): Promise<void> { await this.saveData({ ...this.settings, layout: this.layout }); }

  async saveLayout(): Promise<void> {
    await this.saveSettings();
    try { await writeLayoutNote(this.app.vault, this.settings, this.layout); }
    catch (error) { new Notice(`Dashboard layout could not be saved: ${error instanceof Error ? error.message : String(error)}`); }
    await this.refreshViews();
  }

  async resetLayout(): Promise<void> { this.layout = defaultLayouts(); await this.saveLayout(); new Notice("Dashboard layout reset."); }

  async openDashboard(): Promise<void> {
    const leaf = this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: DASHBOARD_VIEW, active: true });
    this.app.workspace.revealLeaf(leaf);
    await this.refreshViews();
  }

  openNote(path: string): void { void this.app.workspace.openLinkText(path.replace(/\.md$/i, ""), "", false); }
  openSettings(): void { const setting = (this.app as typeof this.app & { setting?: { open?: () => void; openTabById?: (id: string) => void } }).setting; setting?.open?.(); window.setTimeout(() => setting?.openTabById?.(this.manifest.id), 100); }
  toggleEditor(): void { this.editing = !this.editing; void this.refreshViews(); }

  async refreshViews(): Promise<void> {
    for (const leaf of this.app.workspace.getLeavesOfType(DASHBOARD_VIEW)) {
      if (leaf.view instanceof DashboardView) {
        try { await (leaf.view as DashboardView).render(); } catch (error) { new Notice(`Dashboard refresh failed: ${error instanceof Error ? error.message : String(error)}`); }
      }
    }
  }

  async moveWidget(fromId: string, toId: string, side: "top" | "left" | "right" | "bottom"): Promise<void> {
    const from = this.layout[fromId]; const to = this.layout[toId]; if (!from || !to || fromId === toId) return;
    if (side === "top" || side === "bottom") {
      const order = [...this.widgets.keys()].sort((a, b) => (this.layout[a]?.order ?? 99) - (this.layout[b]?.order ?? 99));
      const oldIndex = order.indexOf(fromId); if (oldIndex >= 0) order.splice(oldIndex, 1);
      const targetIndex = order.indexOf(toId); order.splice(Math.max(0, targetIndex + (side === "bottom" ? 1 : 0)), 0, fromId);
      order.forEach((id, index) => { if (this.layout[id]) this.layout[id].order = index; });
    } else {
      const width = from.sizingMode === "dynamic" ? ({ full: 12, half: 6, third: 4, quarter: 3 }[from.dynamicWidth ?? "half"] ?? 6) : from.w;
      from.x = side === "left" ? Math.max(1, to.x - width) : Math.min(13 - width, to.x + to.w);
    }
    await this.saveLayout();
  }

  async importLegacy(): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(this.settings.legacyPath);
    if (!(file instanceof TFile)) { new Notice(`Legacy dashboard not found: ${this.settings.legacyPath}`); return; }
    const text = await this.app.vault.read(file);
    const imported = WIDGET_ORDER.filter(id => text.toLowerCase().includes(id.replace(/-/g, " ")) || text.toLowerCase().includes(id));
    (imported.length ? imported : WIDGET_ORDER).forEach((id, index) => { if (this.layout[id]) this.layout[id].order = index; });
    await this.saveLayout();
    new Notice("Legacy dashboard imported; the original note was preserved.");
  }

  private async loadLayoutNote(): Promise<void> {
    const file = this.app.vault.getAbstractFileByPath(this.settings.dashboardPath);
    if (!(file instanceof TFile)) return;
    try { const layout = readManagedLayout(await this.app.vault.cachedRead(file)); if (layout) this.layout = sanitizeLayout(layout, this.layout); }
    catch (error) { console.warn("Red-Beard Dashboard layout note could not be read.", error); }
  }

  private registerNativeWidgets(): void {
    // Built-in widgets query Obsidian's Vault API directly so the dashboard
    // remains useful without Dataview, Templater, or another plugin.
    this.registerWidget({ id: "quick-actions", name: "Quick Actions", description: "Start common workflows without leaving the homepage.", defaultLayout: this.layoutForId("quick-actions"), render: (_, container) => {
      [["New Quote", "quote-library:add-quote"], ["New Scripture", "scripture-library:add-passage"], ["Pray Now", "prayer-library:pray-now"], ["New Prayer", "prayer-library:add-prayer"], ["New Movie", "movie-library:manual-entry"], ["New Interaction", "shepherds-ledger:record-interaction"]].forEach(([label, command]) => { const button = container.createEl("button", { text: label }); button.onclick = () => execute(this.app, command); });
    } });
    this.registerWidget({ id: "modules", name: "Modules", description: "Open a Red-Beard add-on dashboard or module.", defaultLayout: this.layoutForId("modules"), render: (_, container) => {
      [["Quote Library", "quote-library:open-dashboard"], ["Scripture Library", "scripture-library:open-dashboard"], ["Movie Library", "movie-library:open-dashboard"], ["Study Planner", "study-planner:open-dashboard"], ["Family Companion", "marriage-companion:open-dashboard"], ["Vault Backup", "vault-backup:open-dashboard"], ["Prayer Library", "prayer-library:open-dashboard"]].forEach(([label, command]) => { const button = container.createEl("button", { text: label }); button.onclick = () => execute(this.app, command); });
    } });
    this.registerWidget({ id: "quote-of-day", name: "Quote of the Day", description: "Shows the most recently changed note in your quote area.", defaultLayout: this.layoutForId("quote-of-day"), render: (_, container) => { const file = this.app.vault.getMarkdownFiles().filter(item => item.path.toLowerCase().includes("quotes")).sort((a, b) => b.stat.mtime - a.stat.mtime)[0]; container.createEl("p", { text: file ? `Latest quote note: ${file.basename}` : "Your saved quotes will appear here." }); } });
    this.registerWidget({ id: "recently-changed", name: "Recently Changed", description: "The eight vault files with the newest modification times.", defaultLayout: this.layoutForId("recently-changed"), render: (_, container) => { const list = container.createEl("ul"); this.app.vault.getFiles().sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 8).forEach(file => { const item = list.createEl("li"); const link = item.createEl("a", { text: file.path }); link.onclick = () => this.openNote(file.path); }); } });
    this.registerWidget({ id: "favorites", name: "Favorites", description: "Notes whose paths identify them as favorites.", defaultLayout: this.layoutForId("favorites"), render: (_, container) => { const files = this.app.vault.getMarkdownFiles().filter(file => file.path.toLowerCase().includes("favorite")); if (!files.length) container.createEl("p", { text: "Add favorites through your normal vault workflow." }); const list = container.createEl("ul"); files.slice(0, 8).forEach(file => list.createEl("li", { text: file.basename })); } });
    this.registerWidget({ id: "active-projects", name: "Active Projects", description: "Recent notes found under the vault's Projects folder.", defaultLayout: this.layoutForId("active-projects"), render: (_, container) => { const list = container.createEl("ul"); this.app.vault.getMarkdownFiles().filter(file => file.path.toLowerCase().startsWith("projects/")).sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 8).forEach(file => list.createEl("li", { text: file.basename })); } });
    this.registerWidget({ id: "recent-journal", name: "Recent Journal", description: "Recent notes found under the vault's Journal folder.", defaultLayout: this.layoutForId("recent-journal"), render: (_, container) => { const list = container.createEl("ul"); this.app.vault.getMarkdownFiles().filter(file => file.path.toLowerCase().startsWith("journal/")).sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, 7).forEach(file => list.createEl("li", { text: file.basename })); } });
    this.registerWidget({ id: "vault-pulse", name: "Vault Pulse", description: "A quick count of files, folders, and changes in the last 24 hours.", defaultLayout: this.layoutForId("vault-pulse"), render: (_, container) => { const files = this.app.vault.getFiles(); const folders = new Set(files.map(file => file.parent?.path).filter(Boolean)); const day = Date.now() - 86_400_000; container.createEl("p", { text: `${files.length} files · ${folders.size} folders · ${files.filter(file => file.stat.mtime >= day).length} changed in 24h` }); } });
  }

  private layoutForId(id: string): WidgetLayout { return this.layout[id] ?? defaultLayouts()[id] ?? { x: 1, w: 4, mobileW: 12, h: 1, order: 99, visible: true, locked: false, sizingMode: "grid" }; }

  private async loadMarkdownWidgets(): Promise<void> {
    // Widget definitions are optional; do not create folders merely by opening the dashboard.
    const widgetRoot = this.app.vault.getAbstractFileByPath(this.settings.widgetFolder);
    if (!widgetRoot || !("children" in widgetRoot)) return;
    const files = this.app.vault.getMarkdownFiles().filter(file => file.path.startsWith(`${this.settings.widgetFolder}/`));
    for (const file of files) {
      const frontmatter = parseFrontmatter(await this.app.vault.cachedRead(file));
      if (frontmatter.type !== "dashboard-widget" || frontmatter.enabled === false) continue;
      const widgetId = String(frontmatter.widget_id ?? file.basename).trim();
      if (!widgetId || this.markdownWidgetIds.has(widgetId)) continue;
      const renderer = String(frontmatter.renderer ?? widgetId);
      const native = this.widgets.get(renderer);
      if (!native) continue;
      const id = `markdown/${widgetId}`;
      this.markdownWidgetIds.add(widgetId);
      this.registerWidget({ id, name: String(frontmatter.title ?? native.name), description: "Markdown-defined safe widget", defaultLayout: native.defaultLayout, render: (ctx, container) => native.render(ctx, container) });
    }
  }
}
