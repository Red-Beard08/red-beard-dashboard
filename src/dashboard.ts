import { ItemView, WorkspaceLeaf } from "obsidian";
import type RedBeardDashboard from "./main";
import { type DashboardWidgetDefinition, type WidgetLayout } from "./types";
import { DYNAMIC_COLUMNS } from "./utils";

export class DashboardView extends ItemView {
  private resizeObserver?: ResizeObserver;
  constructor(leaf: WorkspaceLeaf, private plugin: RedBeardDashboard) { super(leaf); }
  getViewType(): string { return "red-beard-dashboard-view"; }
  getDisplayText(): string { return "Red-Beard Dashboard"; }
  async onOpen(): Promise<void> { await this.render(); }

  // Rebuild the view from vault state. Rendering is intentionally read-only;
  // layout changes are saved only by explicit editor actions.
  async render(): Promise<void> {
    const root = this.containerEl;
    root.empty();
    root.addClass("red-beard-dashboard");
    root.style.setProperty("--rbd-gap", `${this.plugin.settings.gap}px`);
    root.style.setProperty("--rbd-padding", `${this.plugin.settings.padding}px`);
    this.resizeObserver?.disconnect();
    if (typeof ResizeObserver !== "undefined") {
      this.resizeObserver = new ResizeObserver(() => this.updateResponsive(root));
      this.resizeObserver.observe(root);
    }
    this.updateResponsive(root);
    const header = root.createDiv({ cls: "rbd-header" });
    header.createEl("h1", { text: "Red-Beard Dashboard" });
    header.createEl("p", { text: "A native, extensible homepage for your vault." });
    const toolbar = header.createDiv({ cls: "rbd-toolbar" });
    this.button(toolbar, this.plugin.editing ? "Done editing" : "Edit layout", () => this.plugin.toggleEditor());
    this.button(toolbar, "Refresh", () => void this.plugin.refreshViews());
    this.button(toolbar, "Legacy dashboard", () => this.plugin.openNote(this.plugin.settings.legacyPath));
    this.button(toolbar, "Settings", () => this.plugin.openSettings());

    const grid = root.createDiv({ cls: "rbd-grid" });
    const layouts = this.plugin.layout;
    const widgets = [...this.plugin.widgets.values()].sort((a, b) => (layouts[a.id]?.order ?? 99) - (layouts[b.id]?.order ?? 99));
    if (!widgets.length) grid.createEl("p", { text: "No dashboard widgets are available yet." });
    for (const definition of widgets) {
      const layout = layouts[definition.id] ?? this.plugin.layoutFor(definition);
      if (layout.visible === false) continue;
      const card = grid.createDiv({ cls: `rbd-widget${layout.sizingMode === "dynamic" ? " rbd-dynamic" : ""}` });
      card.dataset.widgetId = definition.id;
      const width = layout.sizingMode === "dynamic" ? (DYNAMIC_COLUMNS[layout.dynamicWidth ?? "half"] ?? 6) : layout.w;
      card.style.setProperty("--rbd-x", String(layout.sizingMode === "dynamic" && layout.dynamicWidth === "full" ? 1 : layout.x));
      card.style.setProperty("--rbd-w", String(width));
      card.style.setProperty("--rbd-mobile-w", String(layout.mobileW));
      card.style.setProperty("--rbd-h", String(layout.h));
      if (this.plugin.editing && !layout.locked) this.addEditorControls(card, grid, definition, layout);
      const title = card.createDiv({ cls: "rbd-widget-title" });
      title.createEl("span", { text: definition.name });
      if (this.plugin.editing) this.addLayoutControls(title, layout);
      const body = card.createDiv({ cls: "rbd-widget-body" });
      try { await definition.render(this.plugin.context(), body); }
      catch (error) { body.createEl("p", { cls: "rbd-widget-error", text: `Widget unavailable: ${error instanceof Error ? error.message : String(error)}` }); }
    }
    if (this.plugin.settings.showPlaceholders) {
      const registered = new Set(this.plugin.widgets.keys());
      Object.keys(layouts).filter(id => !registered.has(id)).forEach(id => {
        const card = grid.createDiv({ cls: "rbd-widget rbd-widget-placeholder" });
        card.createDiv({ cls: "rbd-widget-title", text: "Unavailable widget" });
        card.createEl("p", { text: `${id} is not currently registered. Enable its plugin or remove it from the layout.` });
      });
    }
  }

  onClose(): Promise<void> {
    this.resizeObserver?.disconnect();
    return Promise.resolve();
  }

  private updateResponsive(root: HTMLElement): void {
    root.toggleClass("rbd-narrow", root.clientWidth > 0 && root.clientWidth < this.plugin.settings.mobileBreakpoint);
  }

  private addEditorControls(card: HTMLElement, grid: HTMLElement, definition: DashboardWidgetDefinition, layout: WidgetLayout): void {
    // The drag handle and external drop zones keep placement discoverable on
    // desktop while remaining hidden in the mobile view.
    card.addClass("rbd-editing");
    const handle = card.createDiv({ cls: "rbd-drag-handle", text: "⋮⋮ Drag" });
    handle.draggable = true;
    handle.addEventListener("dragstart", event => { event.dataTransfer?.setData("text/plain", definition.id); if (event.dataTransfer) event.dataTransfer.effectAllowed = "move"; card.addClass("rbd-dragging"); });
    handle.addEventListener("dragend", () => card.removeClass("rbd-dragging"));
    (["top", "left", "right", "bottom"] as const).forEach(side => {
      const zone = card.createDiv({ cls: `rbd-drop-zone rbd-drop-${side}`, text: side });
      zone.addEventListener("dragover", event => { event.preventDefault(); zone.addClass("rbd-zone-active"); });
      zone.addEventListener("dragleave", () => zone.removeClass("rbd-zone-active"));
      zone.addEventListener("drop", event => { event.preventDefault(); zone.removeClass("rbd-zone-active"); const from = event.dataTransfer?.getData("text/plain"); if (from) void this.plugin.moveWidget(from, definition.id, side); });
    });
    card.addEventListener("dragover", event => { event.preventDefault(); card.addClass("rbd-drop-target"); });
    card.addEventListener("dragleave", () => card.removeClass("rbd-drop-target"));
    card.addEventListener("drop", event => { event.preventDefault(); card.removeClass("rbd-drop-target"); const from = event.dataTransfer?.getData("text/plain"); if (from && from !== definition.id) void this.plugin.moveWidget(from, definition.id, event.clientX < card.getBoundingClientRect().left + card.getBoundingClientRect().width / 2 ? "left" : "right"); });
  }

  private addLayoutControls(parent: HTMLElement, layout: WidgetLayout): void {
    const controls = parent.createDiv({ cls: "rbd-widget-controls" });
    const mode = controls.createEl("select", { attr: { "aria-label": "Sizing mode" } });
    mode.createEl("option", { value: "grid", text: "Grid" });
    mode.createEl("option", { value: "dynamic", text: "Dynamic" });
    mode.value = layout.sizingMode;
    mode.onchange = () => { layout.sizingMode = mode.value as WidgetLayout["sizingMode"]; if (layout.sizingMode === "dynamic" && !layout.dynamicWidth) layout.dynamicWidth = "half"; void this.plugin.saveLayout(); };
    if (layout.sizingMode === "dynamic") {
      const width = controls.createEl("select", { attr: { "aria-label": "Dynamic width" } });
      (["full", "half", "third", "quarter"] as const).forEach(value => width.createEl("option", { value, text: value }));
      width.value = layout.dynamicWidth ?? "half";
      width.onchange = () => { layout.dynamicWidth = width.value as WidgetLayout["dynamicWidth"]; void this.plugin.saveLayout(); };
    }
    this.number(controls, "W", layout.w, value => { layout.w = value; void this.plugin.saveLayout(); });
    this.number(controls, "M", layout.mobileW, value => { layout.mobileW = value; void this.plugin.saveLayout(); });
    this.number(controls, "H", layout.h, value => { layout.h = value; void this.plugin.saveLayout(); });
    this.button(controls, layout.locked ? "Unlock" : "Lock", () => { layout.locked = !layout.locked; void this.plugin.saveLayout(); });
  }

  private number(parent: HTMLElement, label: string, value: number, onChange: (value: number) => void): void {
    const input = parent.createEl("input", { type: "number", value: String(value), attr: { "aria-label": label, min: "1", max: label === "H" ? "8" : "12" } });
    input.onchange = () => onChange(Math.max(1, Math.min(label === "H" ? 8 : 12, Number(input.value) || 1)));
  }
  private button(parent: HTMLElement, text: string, onClick: () => void): void { const button = parent.createEl("button", { text }); button.onclick = onClick; }
}
