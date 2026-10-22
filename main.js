/* Red-Beard Dashboard */
"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => RedBeardDashboard
});
module.exports = __toCommonJS(main_exports);
var import_obsidian4 = require("obsidian");

// src/dashboard.ts
var import_obsidian = require("obsidian");
var DashboardView = class extends import_obsidian.ItemView {
  constructor(leaf, plugin) {
    super(leaf);
    this.plugin = plugin;
  }
  getViewType() {
    return "red-beard-dashboard-view";
  }
  getDisplayText() {
    return "Red-Beard Dashboard";
  }
  getIcon() {
    return "layout-dashboard";
  }
  async onOpen() {
    await this.render();
  }
  async render() {
    var _a, _b;
    const root = this.containerEl;
    const mobile = import_obsidian.Platform.isMobile || import_obsidian.Platform.isMobileApp || import_obsidian.Platform.isIosApp;
    (_a = this.editorResizeObserver) == null ? void 0 : _a.disconnect();
    this.editorResizeObserver = void 0;
    root.empty();
    root.addClass("red-beard-dashboard");
    root.toggleClass("rbd-is-editing", this.plugin.editing);
    root.toggleClass("rbd-is-mobile", mobile);
    root.style.setProperty("--rbd-gap", `${this.plugin.settings.gap}px`);
    root.style.setProperty("--rbd-padding", `${this.plugin.settings.padding}px`);
    const hero = root.createDiv({ cls: "rbd-hero" });
    hero.createDiv({ cls: "rbd-eyebrow", text: "RED-BEARD \xB7 PERSONAL KNOWLEDGE VAULT" });
    hero.createEl("h1", { text: "Welcome home." });
    hero.createEl("p", { text: (/* @__PURE__ */ new Date()).toLocaleDateString(void 0, { weekday: "long", month: "long", day: "numeric", year: "numeric" }) });
    const toolbar = root.createDiv({ cls: "rbd-toolbar" });
    this.btn(toolbar, this.plugin.editing ? "Done editing" : "Edit layout", () => this.plugin.toggleEditor());
    if (this.plugin.editing) this.btn(toolbar, "Add widgets", () => this.plugin.openWidgetManager());
    this.btn(toolbar, "Refresh", () => void this.plugin.refreshViews());
    this.btn(toolbar, "Legacy dashboard", () => this.plugin.openNote(this.plugin.settings.legacyPath));
    this.btn(toolbar, "Settings", () => this.plugin.openSettings());
    const grid = root.createDiv({ cls: this.plugin.editing ? "rbd-grid rbd-masonry rbd-editing-masonry" : "rbd-grid rbd-masonry" });
    if (mobile) {
      root.style.setProperty("height", "auto", "important");
      root.style.setProperty("min-height", "100%", "important");
      root.style.setProperty("overflow-y", "auto", "important");
      root.style.setProperty("overflow-x", "hidden", "important");
      grid.style.setProperty("display", "block", "important");
      grid.style.setProperty("position", "relative", "important");
      grid.style.setProperty("height", "auto", "important");
      grid.style.setProperty("min-height", "0", "important");
      grid.style.setProperty("grid-template-columns", "none", "important");
      grid.style.setProperty("grid-auto-rows", "auto", "important");
      grid.style.setProperty("gap", "0", "important");
    }
    const items = [...this.plugin.widgets.values()].sort((a, b) => {
      var _a2, _b2, _c, _d;
      return ((_b2 = (_a2 = this.plugin.layout[a.id]) == null ? void 0 : _a2.order) != null ? _b2 : 99) - ((_d = (_c = this.plugin.layout[b.id]) == null ? void 0 : _c.order) != null ? _d : 99);
    });
    for (const def of items) {
      const l = (_b = this.plugin.layout[def.id]) != null ? _b : this.plugin.layoutFor(def);
      if (l.visible === false) continue;
      const card = grid.createDiv({ cls: "rbd-widget" });
      card.dataset.widgetId = def.id;
      if (mobile) card.addClass("rbd-mobile-flow-card");
      card.style.setProperty("--rbd-x", String(l.x));
      card.style.setProperty("--rbd-w", String(l.w));
      card.style.setProperty("--rbd-mobile-w", String(l.mobileW));
      card.style.setProperty("--rbd-mobile-span", String(Math.max(1, Math.min(12, l.mobileW))));
      card.style.setProperty("--rbd-h", String(l.h));
      if (mobile) {
        card.style.setProperty("position", "relative", "important");
        card.style.setProperty("display", "block", "important");
        card.style.setProperty("float", "none", "important");
        card.style.setProperty("left", "auto", "important");
        card.style.setProperty("top", "auto", "important");
        card.style.setProperty("right", "auto", "important");
        card.style.setProperty("bottom", "auto", "important");
        card.style.setProperty("width", "auto", "important");
        card.style.setProperty("height", "auto", "important");
        card.style.setProperty("min-height", "0", "important");
        card.style.setProperty("grid-column", "auto", "important");
        card.style.setProperty("grid-row", "auto", "important");
        card.style.setProperty("transform", "none", "important");
        card.style.setProperty("z-index", "auto", "important");
        card.style.setProperty("margin-bottom", `${this.plugin.settings.gap}px`);
      }
      if (this.plugin.editing && !l.locked) this.editor(card, def, l);
      const title = card.createDiv({ cls: "rbd-widget-title" });
      if (def.icon) {
        const icon = title.createSpan({ cls: "rbd-widget-icon" });
        try {
          (0, import_obsidian.setIcon)(icon, def.icon);
        } catch (e) {
        }
      }
      title.createEl("span", { text: def.name });
      if (this.plugin.editing) this.controls(card, l);
      const body = card.createDiv({ cls: "rbd-widget-body" });
      try {
        await def.render(this.plugin.context(), body);
      } catch (e) {
        body.createEl("p", { cls: "rbd-error", text: `Widget unavailable: ${e instanceof Error ? e.message : String(e)}` });
      }
    }
    if (!items.length) grid.createEl("p", { text: "No widgets are registered." });
    if (!mobile) {
      this.packMasonryLayout(grid);
      this.editorResizeObserver = new ResizeObserver(() => this.packMasonryLayout(grid));
      this.editorResizeObserver.observe(grid);
    }
    if (this.plugin.editing) {
      const dropGrid = root.createDiv({ cls: "rbd-column-drop-grid", attr: { "aria-label": "Drop zones for dashboard columns" } });
      [1, 5, 9].forEach((column) => {
        const zone = dropGrid.createDiv({ cls: "rbd-column-drop-zone", text: `Drop in column ${Math.ceil(column / 4)}` });
        zone.dataset.column = String(column);
        zone.ondragover = (e) => {
          e.preventDefault();
          zone.addClass("rbd-zone-active");
        };
        zone.ondragleave = () => zone.removeClass("rbd-zone-active");
        zone.ondrop = (e) => {
          var _a2;
          e.preventDefault();
          zone.removeClass("rbd-zone-active");
          const from = (_a2 = e.dataTransfer) == null ? void 0 : _a2.getData("text/plain");
          if (from) void this.plugin.placeWidgetInColumn(from, column);
        };
      });
    }
    if (this.plugin.editing) {
      for (const id of ["quick-actions", "modules"]) {
        const card = grid.querySelector(`[data-widget-id="${id}"]`);
        if (card) this.addCardManagerButton(card, id);
      }
    }
    root.appendChild(toolbar);
  }
  addCardManagerButton(card, kind) {
    const title = card.querySelector(".rbd-widget-title");
    if (!title) return;
    const button = title.createEl("button", { cls: "rbd-card-manage-button", text: "Manage" });
    button.onclick = (e) => {
      e.stopPropagation();
      this.plugin.openCardManager(kind);
    };
  }
  editor(card, def, _l) {
    card.addClass("rbd-editing");
    const handle = card.createDiv({ cls: "rbd-drag-handle", text: "\u22EE\u22EE Drag" });
    handle.draggable = true;
    handle.ondragstart = (e) => {
      var _a;
      (_a = e.dataTransfer) == null ? void 0 : _a.setData("text/plain", def.id);
      if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
    };
    handle.ondragend = () => card.removeClass("rbd-dragging");
    for (const side of ["top", "bottom"]) {
      const zone = card.createDiv({ cls: `rbd-drop-zone rbd-drop-${side}`, text: side === "top" ? "Insert above" : "Insert below", attr: { "aria-label": side === "top" ? "Insert above this widget" : "Insert below this widget" } });
      zone.ondragover = (e) => {
        e.preventDefault();
        e.stopPropagation();
        zone.addClass("rbd-zone-active");
      };
      zone.ondragleave = () => zone.removeClass("rbd-zone-active");
      zone.ondrop = (e) => {
        var _a;
        e.preventDefault();
        e.stopPropagation();
        zone.removeClass("rbd-zone-active");
        card.classList.remove("rbd-drop-target");
        const from = (_a = e.dataTransfer) == null ? void 0 : _a.getData("text/plain");
        if (from && from !== def.id) void this.plugin.moveWidget(from, def.id, side);
      };
    }
    card.ondragover = (e) => {
      e.preventDefault();
      if (e.target instanceof HTMLElement && e.target.closest(".rbd-drop-zone")) return;
      card.addClass("rbd-drop-target");
    };
    card.ondragleave = () => card.removeClass("rbd-drop-target");
    card.ondrop = (e) => {
      var _a;
      e.preventDefault();
      card.classList.remove("rbd-drop-target");
      if (e.target instanceof HTMLElement && e.target.closest(".rbd-drop-zone")) return;
      const from = (_a = e.dataTransfer) == null ? void 0 : _a.getData("text/plain");
      if (from && from !== def.id) void this.plugin.moveWidget(from, def.id, "top");
    };
  }
  controls(parent, l) {
    const c = parent.createDiv({ cls: "rbd-widget-controls" });
    this.field(c, "Width", l.w, 1, 12, (v) => {
      l.w = v;
      void this.plugin.saveLayout();
    });
    this.field(c, "Mobile", l.mobileW, 1, 12, (v) => {
      l.mobileW = v;
      void this.plugin.saveLayout();
    });
    this.field(c, "Height", l.h, 1, 8, (v) => {
      l.h = v;
      void this.plugin.saveLayout();
    });
    this.btn(c, l.locked ? "Unlock" : "Lock", () => {
      l.locked = !l.locked;
      void this.plugin.saveLayout();
    });
  }
  field(p, label, value, min, max, on) {
    const wrap = p.createDiv({ cls: "rbd-field" });
    wrap.createEl("span", { text: label });
    const i = wrap.createEl("input", { type: "number", value: String(value), attr: { "aria-label": label, min: String(min), max: String(max) } });
    i.onchange = () => on(Math.max(min, Math.min(max, Number(i.value) || value)));
  }
  btn(p, text, on) {
    const b = p.createEl("button", { text });
    b.onclick = on;
  }
  packMasonryLayout(grid) {
    var _a;
    if (!grid.isConnected) return;
    if (import_obsidian.Platform.isMobile || this.containerEl.classList.contains("rbd-is-mobile")) {
      grid.style.removeProperty("min-height");
      return;
    }
    const width = grid.clientWidth;
    if (width < 1) return;
    const gap = Number.parseFloat(getComputedStyle(grid).columnGap) || this.plugin.settings.gap || 16;
    const columns = 12;
    const columnWidth = Math.max(1, (width - gap * (columns - 1)) / columns);
    const heights = Array(columns).fill(0);
    const cards = Array.from(grid.querySelectorAll(".rbd-widget"));
    for (const card of cards) {
      const id = card.dataset.widgetId;
      if (!id) continue;
      const l = (_a = this.plugin.layout[id]) != null ? _a : { x: 1, w: 4 };
      const x = Math.max(1, Math.min(columns, Math.round(l.x || 1)));
      const w = Math.max(1, Math.min(columns - x + 1, Math.round(l.w || 4)));
      const start = x - 1;
      const top = Math.max(...heights.slice(start, start + w), 0);
      const left = start * (columnWidth + gap);
      const cardWidth = columnWidth * w + gap * (w - 1);
      card.style.setProperty("--rbd-edit-left", `${left}px`);
      card.style.setProperty("--rbd-edit-top", `${top}px`);
      card.style.setProperty("--rbd-edit-width", `${cardWidth}px`);
      const height = card.getBoundingClientRect().height;
      const bottom = top + height + gap;
      for (let i = start; i < start + w; i++) heights[i] = bottom;
    }
    grid.style.minHeight = `${Math.max(0, Math.max(...heights, 0) - gap)}px`;
  }
  async onClose() {
    var _a;
    (_a = this.editorResizeObserver) == null ? void 0 : _a.disconnect();
    this.editorResizeObserver = void 0;
    return Promise.resolve();
  }
};

// src/modals.ts
var import_obsidian2 = require("obsidian");
var STYLE_LABELS = { default: "Standard", blue: "Blue highlight", red: "Red highlight", hollow: "Hollow" };
var DashboardCardManagerModal = class extends import_obsidian2.Modal {
  constructor(app, plugin, kind) {
    super(app);
    this.plugin = plugin;
    this.kind = kind;
    this.entries = [];
  }
  onOpen() {
    this.modalEl.addClass("rbd-card-manager-modal");
    this.contentEl.empty();
    this.contentEl.addClass("rbd-card-manager-content");
    const title = this.kind === "quick-actions" ? "Manage quick actions" : this.kind === "modules" ? "Manage dashboard modules" : "Manage dashboard widgets";
    const intro = this.kind === "quick-actions" ? "Choose which shortcuts appear, set their order, and give important actions a visual treatment." : this.kind === "modules" ? "Choose which connected add-ons appear, set their order, and give important modules a visual treatment." : "Choose which widgets appear on the dashboard. Hidden widgets stay available here with their saved layout, so you can add them back later.";
    this.contentEl.createEl("h2", { text: title });
    this.contentEl.createEl("p", { cls: "rbd-card-manager-intro", text: intro });
    this.entries = this.readEntries();
    this.renderEntries();
    const footer = this.contentEl.createDiv({ cls: "rbd-card-manager-footer" });
    const cancel = footer.createEl("button", { text: "Cancel" });
    cancel.onclick = () => this.close();
    const save = footer.createEl("button", { text: "Save changes", cls: "mod-cta" });
    save.onclick = () => void this.save();
  }
  onClose() {
    this.contentEl.empty();
  }
  readEntries() {
    if (this.kind === "quick-actions") {
      return this.plugin.getQuickActions().map((a, index) => {
        var _a;
        return { id: a.id, name: a.name, description: a.description, command: a.command, enabled: this.plugin.settings.quickActionVisibility[a.id] !== false, style: (_a = this.plugin.settings.quickActionStyle[a.id]) != null ? _a : index === 0 ? "blue" : "default" };
      }).sort((a, b) => {
        var _a, _b;
        return ((_a = this.plugin.settings.quickActionOrder[a.id]) != null ? _a : 99) - ((_b = this.plugin.settings.quickActionOrder[b.id]) != null ? _b : 99);
      });
    }
    if (this.kind === "modules") return this.plugin.getModules().map((m) => {
      var _a;
      const hasCustomFlavor = Object.prototype.hasOwnProperty.call(this.plugin.settings.moduleFlavor, m.id);
      return { id: m.id, name: m.name, description: m.description, flavor: hasCustomFlavor ? this.plugin.settings.moduleFlavor[m.id] : m.description, command: m.command, enabled: this.plugin.isModuleEnabled(m.id), style: (_a = this.plugin.settings.moduleStyle[m.id]) != null ? _a : "default" };
    }).sort((a, b) => {
      var _a, _b;
      return ((_a = this.plugin.settings.moduleOrder[a.id]) != null ? _a : 99) - ((_b = this.plugin.settings.moduleOrder[b.id]) != null ? _b : 99) || a.name.localeCompare(b.name);
    });
    return this.plugin.getWidgets().map((w) => ({ id: w.id, name: w.name, description: w.description, enabled: this.plugin.isWidgetVisible(w.id), style: "default" })).sort((a, b) => {
      var _a, _b, _c, _d;
      return ((_b = (_a = this.plugin.layout[a.id]) == null ? void 0 : _a.order) != null ? _b : 99) - ((_d = (_c = this.plugin.layout[b.id]) == null ? void 0 : _c.order) != null ? _d : 99) || a.name.localeCompare(b.name);
    });
  }
  renderEntries() {
    var _a;
    (_a = this.contentEl.querySelector(".rbd-card-manager-list")) == null ? void 0 : _a.remove();
    const list = this.contentEl.createDiv({ cls: "rbd-card-manager-list" });
    if (!this.entries.length) {
      list.createDiv({ cls: "rbd-empty-state", text: this.kind === "modules" ? "No connected modules are available." : this.kind === "widgets" ? "No widgets are registered yet." : "No quick actions are configured." });
      return;
    }
    this.entries.forEach((entry, index) => {
      var _a2;
      const row = list.createDiv({ cls: `rbd-card-manager-row${this.kind === "widgets" ? " rbd-card-manager-widget-row" : ""}` });
      const check = row.createEl("input", { attr: { type: "checkbox", "aria-label": `Show ${entry.name}` } });
      check.checked = entry.enabled;
      check.onchange = () => {
        entry.enabled = check.checked;
      };
      const copy = row.createDiv({ cls: "rbd-card-manager-copy" });
      copy.createDiv({ cls: "rbd-card-manager-name", text: entry.name });
      if (entry.description) copy.createDiv({ cls: "rbd-card-manager-description", text: entry.description });
      if (this.kind === "modules") {
        const flavor = copy.createEl("input", { cls: "rbd-card-manager-flavor", attr: { type: "text", placeholder: "Flavor text shown on the card", value: (_a2 = entry.flavor) != null ? _a2 : "", "aria-label": `Flavor text for ${entry.name}` } });
        flavor.onchange = () => {
          entry.flavor = flavor.value.trim();
        };
      }
      if (this.kind !== "widgets") {
        const style = row.createEl("select", { cls: "rbd-card-manager-style", attr: { "aria-label": `Style for ${entry.name}` } });
        for (const [value, label] of Object.entries(STYLE_LABELS)) {
          const option = style.createEl("option", { text: label, value });
          if (value === entry.style) option.selected = true;
        }
        style.onchange = () => {
          entry.style = style.value;
        };
        const move = row.createDiv({ cls: "rbd-card-manager-order" });
        move.createSpan({ cls: "rbd-card-manager-order-label", text: "Position" });
        const position = move.createEl("input", { type: "number", value: String(index + 1), attr: { min: "1", max: String(this.entries.length), "aria-label": `Display position for ${entry.name}` } });
        position.onchange = () => {
          const requested = Number(position.value);
          if (!Number.isFinite(requested)) return;
          const next = Math.max(1, Math.min(this.entries.length, Math.round(requested)));
          const ordered = this.entries.filter((item) => item.id !== entry.id);
          ordered.splice(next - 1, 0, entry);
          this.entries = ordered;
          this.renderEntries();
        };
        const up = move.createEl("button", { text: "\u2191", attr: { "aria-label": `Move ${entry.name} up` } });
        up.disabled = index === 0;
        up.onclick = () => {
          if (index > 0) {
            [this.entries[index - 1], this.entries[index]] = [this.entries[index], this.entries[index - 1]];
            this.renderEntries();
          }
        };
        const down = move.createEl("button", { text: "\u2193", attr: { "aria-label": `Move ${entry.name} down` } });
        down.disabled = index === this.entries.length - 1;
        down.onclick = () => {
          if (index < this.entries.length - 1) {
            [this.entries[index + 1], this.entries[index]] = [this.entries[index], this.entries[index + 1]];
            this.renderEntries();
          }
        };
      }
    });
  }
  async save() {
    if (this.kind === "quick-actions") this.entries.forEach((entry, index) => {
      this.plugin.settings.quickActionVisibility[entry.id] = entry.enabled;
      this.plugin.settings.quickActionOrder[entry.id] = index;
      this.plugin.settings.quickActionStyle[entry.id] = entry.style;
    });
    else if (this.kind === "modules") this.entries.forEach((entry, index) => {
      var _a;
      this.plugin.settings.moduleVisibility[entry.id] = entry.enabled;
      this.plugin.settings.moduleOrder[entry.id] = index + 1;
      this.plugin.settings.moduleStyle[entry.id] = entry.style;
      this.plugin.settings.moduleFlavor[entry.id] = ((_a = entry.flavor) != null ? _a : "").trim();
    });
    else {
      this.entries.forEach((entry) => {
        const layout = this.plugin.layout[entry.id];
        if (layout) layout.visible = entry.enabled;
      });
      await this.plugin.saveLayout();
      new import_obsidian2.Notice("Dashboard widgets updated.");
      this.close();
      return;
    }
    await this.plugin.saveSettings();
    await this.plugin.refreshViews();
    new import_obsidian2.Notice(`${this.kind === "quick-actions" ? "Quick actions" : "Modules"} updated.`);
    this.close();
  }
};

// src/settings.ts
var import_obsidian3 = require("obsidian");

// src/foundation-vendor.ts
function normalizeVaultPath(value) {
  const trimmed = String(value != null ? value : "").trim();
  if (/^[/\\]{2}/.test(trimmed)) return "";
  const raw = trimmed.replace(/[\\]+/g, "/").replace(/^\/+/, "");
  if (!raw || /^[A-Za-z]:\//.test(raw)) return "";
  const segments = raw.split("/").filter((segment) => segment && segment !== ".");
  if (segments.some((segment) => segment === "..")) return "";
  return segments.join("/");
}
function normalizeVaultFile(value, fallback) {
  const normalized = normalizeVaultPath(value) || normalizeVaultPath(fallback);
  return normalized.toLowerCase().endsWith(".md") ? normalized : `${normalized}.md`;
}
function normalizeVaultFolder(value, fallback) {
  return normalizeVaultPath(value) || normalizeVaultPath(fallback);
}
function replaceManagedBlock(text, markers, body) {
  const replacement = `${markers.start}
${body.trimEnd()}
${markers.end}`;
  const start = text.indexOf(markers.start);
  if (start >= 0) {
    const bodyStart = start + markers.start.length;
    const end = text.indexOf(markers.end, bodyStart);
    if (end >= 0) return `${text.slice(0, start)}${replacement}${text.slice(end + markers.end.length)}`;
  }
  const prefix = text.trimEnd();
  return prefix ? `${prefix}

${replacement}
` : `${replacement}
`;
}

// src/types.ts
var DASHBOARD_VIEW = "red-beard-dashboard-view";
var LAYOUT_START = "<!-- red-beard-dashboard:managed-start -->";
var LAYOUT_END = "<!-- red-beard-dashboard:managed-end -->";
var DEFAULT_QUICK_ACTIONS = [
  { id: "new-quote", name: "New Quote", command: "quote-library:add-quote" },
  { id: "new-scripture", name: "New Scripture", command: "scripture-library:add-passage" },
  { id: "new-prayer", name: "New Prayer", command: "prayer-library:add-prayer" },
  { id: "new-journal-entry", name: "New Journal Entry", command: "journal-companion:new-today" },
  { id: "new-contact", name: "New Contact", command: "personal-crm:new-contact" },
  { id: "pray-now", name: "Pray Now", command: "prayer-library:pray-now" },
  { id: "new-movie", name: "New Movie", command: "movie-library:manual-entry" },
  { id: "new-interaction", name: "New Interaction", command: "shepherds-ledger:record-interaction" }
];

// src/utils.ts
var WIDGET_ORDER = ["quick-actions", "modules", "quote-of-day", "recently-changed", "favorites", "active-projects", "recent-journal", "vault-pulse"];
function defaultSettings() {
  const root = "Dashboard";
  return { settingsVersion: 1, rootFolder: root, folders: { records: "Records", profiles: "Profiles", archive: "Archive", reports: "Reports", backups: "Backups", widgets: "Widgets" }, files: { index: "Library Index.md", summary: "Summary.md", journal: "Migration Journal.md", layout: "Layout.md" }, naming: { idPrefix: "RBD", filenameTemplate: "{id} - {title}", dateFormat: "yyyy-MM-dd" }, taxonomy: { categories: [], statuses: ["active", "archived"], archived: ["archived"] }, defaults: {}, dashboard: { startup: false, autoRefreshSeconds: 0, compact: false }, migration: { sourceFolder: "", mode: "copy" }, privacy: { showReminder: false }, dashboardPath: `${root}/Layout.md`, legacyPath: "Dashboard.md", widgetFolder: `${root}/Widgets`, mobileBreakpoint: 700, gap: 16, padding: 24, showPlaceholders: true, moduleVisibility: {}, moduleOrder: {}, moduleStyle: {}, moduleFlavor: {}, quickActionVisibility: {}, quickActionOrder: Object.fromEntries(DEFAULT_QUICK_ACTIONS.map((a, i) => [a.id, i])), quickActionStyle: {} };
}
var num = (v, f, min, max) => Number.isFinite(Number(v)) ? Math.max(min, Math.min(max, Number(v))) : f;
var styles = (v) => {
  const allowed = /* @__PURE__ */ new Set(["default", "blue", "red", "hollow"]), out = {};
  if (v && typeof v === "object") {
    for (const [id, value] of Object.entries(v)) if (allowed.has(value)) out[id] = value;
  }
  return out;
};
var bools = (v) => v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([, value]) => typeof value === "boolean").map(([id, value]) => [id, value])) : {};
var texts = (v) => v && typeof v === "object" ? Object.fromEntries(Object.entries(v).filter(([, value]) => typeof value === "string").map(([id, value]) => [id, String(value)])) : {};
var orders = (v) => v && typeof v === "object" ? Object.fromEntries(Object.entries(v).map(([id, value]) => [id, num(value, 99, 0, 9999)])) : {};
function normalizeSettings(raw) {
  var _a, _b, _c, _d;
  const d = defaultSettings(), v = raw && typeof raw === "object" ? raw : {}, root = normalizeVaultFolder(String((_a = v.rootFolder) != null ? _a : d.rootFolder), d.rootFolder), visibility = bools(v.moduleVisibility), moduleOrder = orders(v.moduleOrder), quickActionVisibility = bools(v.quickActionVisibility), quickActionOrder = { ...d.quickActionOrder, ...orders(v.quickActionOrder) }, moduleStyle = styles(v.moduleStyle), moduleFlavor = texts(v.moduleFlavor), quickActionStyle = styles(v.quickActionStyle);
  return { ...d, ...v, rootFolder: root, moduleVisibility: { ...visibility }, moduleOrder: { ...moduleOrder }, moduleStyle, moduleFlavor, quickActionVisibility, quickActionOrder, quickActionStyle, dashboardPath: normalizeVaultFile(String((_b = v.dashboardPath) != null ? _b : `${root}/Layout.md`), `${root}/Layout.md`), legacyPath: normalizeVaultFile(String((_c = v.legacyPath) != null ? _c : d.legacyPath), d.legacyPath), widgetFolder: normalizeVaultFolder(String((_d = v.widgetFolder) != null ? _d : `${root}/Widgets`), `${root}/Widgets`), mobileBreakpoint: num(v.mobileBreakpoint, d.mobileBreakpoint, 320, 2400), gap: num(v.gap, d.gap, 0, 64), padding: num(v.padding, d.padding, 0, 96), showPlaceholders: v.showPlaceholders !== false, dashboard: { ...d.dashboard, ...v.dashboard || {} } };
}
function defaultLayouts() {
  return Object.fromEntries(WIDGET_ORDER.map((id, i) => {
    if (i < 2) return [id, { x: 1, w: 12, mobileW: 12, h: 1, order: i, visible: true, locked: false }];
    const col = (i - 2) % 3;
    return [id, { x: col * 4 + 1, w: 4, mobileW: 12, h: 2, order: i, visible: true, locked: false }];
  }));
}
function sanitizeLayout(raw, fallback = defaultLayouts()) {
  var _a;
  const result = { ...fallback };
  if (raw && typeof raw === "object") {
    for (const [id, val] of Object.entries(raw)) if (val && typeof val === "object") {
      const base = (_a = result[id]) != null ? _a : { x: 1, w: 4, mobileW: 12, h: 1, order: 99, visible: true, locked: false };
      result[id] = { ...base, ...val, x: num(val.x, base.x, 1, 12), w: num(val.w, base.w, 1, 12), mobileW: num(val.mobileW, base.mobileW, 1, 12), h: num(val.h, base.h, 1, 8), order: num(val.order, base.order, 0, 9999), visible: val.visible !== false, locked: val.locked === true };
    }
  }
  return result;
}
function readManagedLayout(text) {
  const a = text.indexOf(LAYOUT_START), b = text.indexOf(LAYOUT_END, a + 1);
  if (a < 0 || b < 0) return null;
  try {
    return sanitizeLayout(JSON.parse(text.slice(a + LAYOUT_START.length, b).trim()));
  } catch (e) {
    return null;
  }
}
function renderLayoutNote(_settings, layout, existing = "") {
  const body = JSON.stringify(layout, null, 2), fm = existing.startsWith("---\n") ? existing.slice(0, existing.indexOf("\n---\n", 4) + 5) : "---\ntype: red-beard-dashboard-layout\nschema_version: 1\n---\n\n", content = existing.startsWith("---\n") ? existing.slice(fm.length) : existing;
  return fm + replaceManagedBlock(content, { start: LAYOUT_START, end: LAYOUT_END }, body);
}
async function ensureFolder(vault, path) {
  let cur = "";
  for (const s of normalizeVaultFolder(path, "").split("/").filter(Boolean)) {
    cur = cur ? `${cur}/${s}` : s;
    if (!vault.getAbstractFileByPath(cur)) await vault.createFolder(cur);
  }
}
async function writeLayoutNote(vault, settings, layout) {
  await ensureFolder(vault, settings.rootFolder);
  const f = vault.getAbstractFileByPath(settings.dashboardPath);
  if (f && "extension" in f) {
    await vault.process(f, (c) => {
      const n = renderLayoutNote(settings, layout, c);
      return n === c ? c : n;
    });
  } else if (!f) await vault.create(settings.dashboardPath, renderLayoutNote(settings, layout));
}

// src/settings.ts
var DashboardSettingsTab = class extends import_obsidian3.PluginSettingTab {
  constructor(app, plugin) {
    super(app, plugin);
    this.plugin = plugin;
  }
  display() {
    const c = this.containerEl;
    c.empty();
    c.createEl("h2", { text: "Red-Beard Dashboard" });
    new import_obsidian3.Setting(c).setName("Storage").setHeading();
    this.text(c, "Root folder", "Vault-relative folder for dashboard configuration.", "rootFolder");
    this.text(c, "Layout note", "Markdown note that stores widget positions.", "dashboardPath");
    this.text(c, "Legacy dashboard path", "Existing page used as the visual baseline.", "legacyPath");
    this.text(c, "Widget definition folder", "Safe Markdown widget definitions.", "widgetFolder");
    new import_obsidian3.Setting(c).setName("Dashboard and appearance").setHeading();
    this.number(c, "Mobile breakpoint", "Pixels before widgets stack.", "mobileBreakpoint", 320, 2400);
    this.number(c, "Widget gap", "Spacing between cards in pixels.", "gap", 0, 64);
    this.number(c, "Page padding", "Outer page padding in pixels.", "padding", 0, 96);
    new import_obsidian3.Setting(c).setName("Modules").setHeading();
    c.createEl("p", { text: "Choose which registered app dashboards appear in the Modules card. Other Red-Beard add-ons can register here without changing this plugin." });
    c.createEl("p", { cls: "setting-item-description rbd-module-order-help", text: "Display position controls the left-to-right order in the Modules card. Position 1 is first. If you give a module a position already used by another module, the modules between them shift down automatically." });
    new import_obsidian3.Setting(c).setName("Quick Actions").setDesc("Choose, order, and style the shortcuts shown on the dashboard.").addButton((b) => b.setButtonText("Manage quick actions").onClick(() => new DashboardCardManagerModal(this.app, this.plugin, "quick-actions").open()));
    new import_obsidian3.Setting(c).setName("Module presentation").setDesc("Choose, order, and style connected app launchers.").addButton((b) => b.setButtonText("Manage modules").onClick(() => new DashboardCardManagerModal(this.app, this.plugin, "modules").open()));
    new import_obsidian3.Setting(c).setName("Widgets").setHeading();
    c.createEl("p", { text: "This is the global widget library. It includes native Dashboard widgets, widgets registered by other Red-Beard add-ons, and safe Markdown-defined widgets. Removing a widget from the dashboard only hides it; its saved layout and registration remain available." });
    new import_obsidian3.Setting(c).setName("Dashboard widget library").setDesc(`${this.plugin.getWidgets().length} widgets are available. Choose which ones appear on the dashboard.`).addButton((b) => b.setButtonText("Manage widgets").onClick(() => this.plugin.openWidgetManager()));
    const modules = [...this.plugin.modules.values()].sort((a, b) => {
      var _a, _b, _c, _d;
      return ((_b = (_a = this.plugin.settings.moduleOrder[a.id]) != null ? _a : a.order) != null ? _b : 99) - ((_d = (_c = this.plugin.settings.moduleOrder[b.id]) != null ? _c : b.order) != null ? _d : 99) || a.name.localeCompare(b.name);
    });
    modules.forEach((module2, index) => {
      var _a;
      const hasCustomFlavor = Object.prototype.hasOwnProperty.call(this.plugin.settings.moduleFlavor, module2.id), flavor = hasCustomFlavor ? this.plugin.settings.moduleFlavor[module2.id] : (_a = module2.description) != null ? _a : "";
      const setting = new import_obsidian3.Setting(c).setName(module2.name).setDesc(`${flavor || "No flavor text set."} \xB7 Display position ${index + 1} of ${modules.length}`);
      setting.addToggle((t) => t.setValue(this.plugin.isModuleEnabled(module2.id)).onChange(async (enabled) => {
        this.plugin.settings.moduleVisibility[module2.id] = enabled;
        await this.plugin.saveSettings();
        await this.plugin.refreshViews();
      }));
      setting.addText((t) => {
        t.setValue(String(index + 1)).setPlaceholder("Position");
        t.inputEl.addClass("rbd-module-position-input");
        t.inputEl.setAttribute("aria-label", `Display position for ${module2.name}`);
        t.onChange(async (value) => {
          const requested = Number(value);
          if (!Number.isFinite(requested)) return;
          this.setModulePosition(modules, module2.id, requested);
          await this.plugin.saveSettings();
          this.scheduleOrderRefresh();
        });
      });
      setting.addText((t) => {
        t.setValue(flavor).setPlaceholder("Flavor text shown on the card");
        t.inputEl.addClass("rbd-module-flavor-input");
        t.inputEl.setAttribute("aria-label", `Flavor text for ${module2.name}`);
        t.onChange(async (value) => {
          this.plugin.settings.moduleFlavor[module2.id] = value.trim();
          await this.plugin.saveSettings();
          await this.plugin.refreshViews();
        });
      });
      if (index > 0) setting.addButton((b) => b.setButtonText("\u2191").setTooltip("Move up").onClick(async () => {
        this.moveModule(modules, index, -1);
        await this.plugin.saveSettings();
        this.display();
      }));
      if (index < modules.length - 1) setting.addButton((b) => b.setButtonText("\u2193").setTooltip("Move down").onClick(async () => {
        this.moveModule(modules, index, 1);
        await this.plugin.saveSettings();
        this.display();
      }));
    });
    new import_obsidian3.Setting(c).setName("Connected modules").setDesc("Refresh this list after enabling or reloading an add-on.").addButton((b) => b.setButtonText("Refresh module list").onClick(async () => {
      this.plugin.ensureKnownIntegrations();
      this.plugin.announceReady();
      await this.plugin.refreshViews();
      this.display();
    }));
    new import_obsidian3.Setting(c).setName("Automation").setHeading();
    new import_obsidian3.Setting(c).setName("Refresh interval (seconds)").setDesc("0 disables automatic refresh.").addText((t) => t.setValue(String(this.plugin.settings.dashboard.autoRefreshSeconds)).onChange(async (v) => {
      this.plugin.settings.dashboard.autoRefreshSeconds = Math.max(0, Number(v) || 0);
      await this.plugin.saveSettings();
    }));
    new import_obsidian3.Setting(c).setName("Open on startup").addToggle((t) => t.setValue(this.plugin.settings.dashboard.startup).onChange(async (v) => {
      this.plugin.settings.dashboard.startup = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian3.Setting(c).setName("Show unavailable widget placeholders").addToggle((t) => t.setValue(this.plugin.settings.showPlaceholders).onChange(async (v) => {
      this.plugin.settings.showPlaceholders = v;
      await this.plugin.saveSettings();
    }));
    new import_obsidian3.Setting(c).setName("Maintenance").setHeading();
    new import_obsidian3.Setting(c).addButton((b) => b.setButtonText("Import/re-import legacy dashboard").onClick(() => void this.plugin.importLegacy()));
    new import_obsidian3.Setting(c).addButton((b) => b.setButtonText("Reset layout").onClick(() => void this.plugin.resetLayout()));
  }
  text(c, name, desc, key) {
    new import_obsidian3.Setting(c).setName(name).setDesc(desc).addText((t) => t.setValue(this.plugin.settings[key]).onChange(async (v) => {
      this.plugin.settings = normalizeSettings({ ...this.plugin.settings, [key]: v });
      await this.plugin.saveSettings();
    }));
  }
  number(c, name, desc, key, min, max) {
    new import_obsidian3.Setting(c).setName(name).setDesc(desc).addText((t) => t.setValue(String(this.plugin.settings[key])).onChange(async (v) => {
      this.plugin.settings[key] = Math.max(min, Math.min(max, Number(v) || 0));
      await this.plugin.saveSettings();
    }));
  }
  setModulePosition(modules, id, requested) {
    const target = modules.find((module2) => module2.id === id);
    if (!target) return;
    const position = Math.max(1, Math.min(modules.length, Math.round(requested)));
    const ordered = modules.filter((module2) => module2.id !== id);
    ordered.splice(position - 1, 0, target);
    ordered.forEach((module2, index) => this.plugin.settings.moduleOrder[module2.id] = index + 1);
  }
  scheduleOrderRefresh() {
    window.clearTimeout(this.orderRefreshTimer);
    this.orderRefreshTimer = window.setTimeout(() => this.display(), 450);
  }
  moveModule(modules, index, delta) {
    var _a, _b;
    const target = modules[index], other = modules[index + delta];
    if (!target || !other) return;
    const targetOrder = (_a = this.plugin.settings.moduleOrder[target.id]) != null ? _a : index + 1, otherOrder = (_b = this.plugin.settings.moduleOrder[other.id]) != null ? _b : index + delta + 1;
    this.plugin.settings.moduleOrder[target.id] = otherOrder;
    this.plugin.settings.moduleOrder[other.id] = targetOrder;
  }
};

// styles.css
var styles_default = `/* Native dashboard skin, intentionally aligned with the vault homepage. */
.red-beard-dashboard{--rbd-accent:#b85c38;--rbd-accent-soft:color-mix(in srgb,var(--rbd-accent) 16%,transparent);--rbd-card:color-mix(in srgb,var(--background-secondary) 88%,transparent);--rbd-border:color-mix(in srgb,var(--text-muted) 24%,transparent);box-sizing:border-box;width:100%;height:100%;max-width:1180px;margin:0 auto;padding:18px var(--rbd-padding);padding-bottom:calc(var(--rbd-padding) + env(safe-area-inset-bottom,0px));font-family:var(--font-interface);overflow-y:auto;overflow-x:hidden}
.rbd-hero{position:relative;overflow:hidden;min-height:230px;box-sizing:border-box;margin:0 0 22px;padding:clamp(28px,5vw,58px);border:1px solid var(--rbd-border);border-radius:26px;background:radial-gradient(circle at 88% 18%,var(--rbd-accent-soft),transparent 32%),linear-gradient(135deg,var(--background-secondary),var(--background-primary));box-shadow:0 10px 32px #0002}.rbd-hero:after{content:"RB";position:absolute;right:clamp(18px,5vw,60px);bottom:-.28em;color:var(--rbd-accent-soft);font:800 clamp(7rem,19vw,15rem)/1 var(--font-interface);pointer-events:none}.rbd-eyebrow{position:relative;z-index:1;color:var(--rbd-accent);font-size:.72rem;font-weight:750;letter-spacing:.18em}.rbd-hero h1{position:relative;z-index:1;margin:.22em 0 .08em;font-family:var(--font-text);font-size:clamp(2.4rem,7vw,5.6rem);letter-spacing:-.045em;line-height:.98}.rbd-hero p{position:relative;z-index:1;margin:1rem 0 0;color:var(--text-muted)}
.rbd-toolbar{display:flex;flex-wrap:wrap;gap:10px;margin:0 0 22px;padding:12px 16px;border:1px solid var(--rbd-border);border-radius:18px;background:var(--rbd-card);box-shadow:0 5px 20px #0001}.rbd-toolbar button{min-height:34px}.rbd-toolbar button:first-child{background:var(--rbd-accent);color:#fff}
.rbd-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;margin:0 0 28px}.rbd-widget{min-width:0;min-height:0;padding:16px 18px;border:1px solid var(--rbd-border);border-radius:18px;background:var(--rbd-card);box-shadow:0 5px 20px #0001;overflow:hidden}.rbd-widget[data-widget-id="quick-actions"],.rbd-widget[data-widget-id="modules"]{grid-column:1/-1;padding:12px 16px}.rbd-widget-title{display:flex;align-items:center;gap:8px;margin:0 0 8px;color:var(--text-normal);font-size:.78rem;font-weight:750;letter-spacing:.08em;text-transform:uppercase}.rbd-widget-title:before{content:"";width:3px;height:1em;border-radius:3px;background:var(--rbd-accent)}.rbd-widget-body{display:flex;flex-wrap:wrap;gap:10px;line-height:1.5}.rbd-widget-body button{display:inline-flex;align-items:center;gap:6px;min-height:34px;margin:0;white-space:nowrap}.rbd-widget-body ul{width:100%;margin:10px 0 0;padding-left:1.15rem}.rbd-widget-body li{margin:.38em 0}.rbd-widget-body a{color:var(--text-accent);cursor:pointer}.rbd-widget-body blockquote{width:100%;margin:4px 0;padding:12px 16px;border-left:4px solid var(--rbd-accent);border-radius:0 16px 16px 0;background:var(--rbd-accent-soft);font-size:1.02em}.rbd-quote-meta{width:100%;margin:0;color:var(--text-muted);font-size:.85em}.rbd-widget p{margin:.3em 0}.rbd-error{color:var(--text-error)}
.rbd-grid{grid-auto-rows:104px;grid-auto-flow:row dense;align-items:stretch}
.rbd-editing{outline:1px dashed var(--rbd-accent);outline-offset:3px}.rbd-drag-handle{display:inline-flex;cursor:grab;align-items:center;margin:-8px 0 8px;padding:3px 8px;border-radius:5px;background:var(--background-modifier-hover);color:var(--text-muted);font-size:.8em}.rbd-drop-target{outline:2px solid var(--rbd-accent);background:var(--background-modifier-hover)}.rbd-widget-controls{display:flex;flex-wrap:wrap;align-items:center;gap:4px;margin-left:auto}.rbd-widget-controls input{width:42px;padding:2px 4px}.rbd-widget-controls button{padding:2px 7px;font-size:.78em}
@media(max-width:900px){.red-beard-dashboard{max-width:100%}.rbd-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}@media(max-width:600px){.red-beard-dashboard{--rbd-padding:12px;padding-top:12px}.rbd-hero{border-radius:20px}.rbd-grid{grid-template-columns:minmax(0,1fr)}.rbd-widget,.rbd-widget[data-widget-id="quick-actions"],.rbd-widget[data-widget-id="modules"]{grid-column:1}.rbd-toolbar{gap:7px}.rbd-toolbar button{flex:1 1 auto;min-height:40px}.rbd-widget-body button{min-height:40px}.rbd-widget-controls,.rbd-drag-handle{display:none}}

/* Editor behavior: saved coordinates now directly control the native grid. */
.rbd-widget{grid-column:var(--rbd-x)/span var(--rbd-w);grid-row:span var(--rbd-h);min-height:calc(104px * var(--rbd-h) + (var(--rbd-h) - 1) * var(--rbd-gap));height:100%}.rbd-widget.rbd-editing{overflow:visible}.rbd-widget-controls{gap:8px}.rbd-field{display:inline-flex;align-items:center;gap:3px;color:var(--text-muted);font-size:.72em;font-weight:600}.rbd-field input{width:42px!important}.rbd-drop-zone{position:absolute;z-index:3;display:none;align-items:center;justify-content:center;border:1px dashed var(--rbd-accent);border-radius:8px;background:color-mix(in srgb,var(--rbd-accent) 13%,var(--background-primary));color:var(--rbd-accent);font-size:.68em;font-weight:700;letter-spacing:.05em;text-transform:uppercase}.rbd-editing .rbd-drop-zone{display:flex}.rbd-drop-top,.rbd-drop-bottom{left:18%;right:18%;height:18px}.rbd-drop-top{top:-28px}.rbd-drop-bottom{bottom:-28px}.rbd-drop-left,.rbd-drop-right{top:18%;bottom:18%;width:18px}.rbd-drop-left{left:-28px}.rbd-drop-right{right:-28px}.rbd-zone-active{background:var(--rbd-accent);color:#fff;box-shadow:0 0 0 3px var(--rbd-accent-soft)}
@media(max-width:600px){.rbd-widget{grid-column:1!important;min-height:0}.rbd-drop-zone{display:none!important}}

/* Shared card language for connected Red-Beard modules.  Keep this additive so
   existing layouts and user themes continue to work. */
.rbd-widget-title{margin-bottom:12px}
.rbd-widget-icon{display:inline-flex;align-items:center;justify-content:center;width:16px;height:16px;color:var(--rbd-accent)}
.rbd-widget-icon svg{width:15px;height:15px;stroke-width:2.2}
.rbd-action-grid{display:flex;flex-wrap:wrap;gap:9px;width:100%}
.rbd-module-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:9px;width:100%}
.rbd-module-button{display:flex!important;align-items:center!important;justify-content:flex-start!important;gap:10px!important;width:100%;min-height:48px!important;padding:8px 12px!important;text-align:left;white-space:normal!important}
.rbd-module-icon{display:inline-flex;flex:0 0 20px;align-items:center;justify-content:center;color:var(--rbd-accent)}
.rbd-module-icon svg{width:18px;height:18px;stroke-width:2.1}
.rbd-module-copy{display:flex;min-width:0;flex-direction:column;gap:2px}
.rbd-module-label{font-weight:650;line-height:1.2}
.rbd-module-description{overflow:hidden;color:var(--text-muted);font-size:.72rem;line-height:1.25;text-overflow:ellipsis;white-space:nowrap}
.rbd-empty-state{width:100%;padding:8px 0;color:var(--text-muted)}
.rbd-empty-state p{margin:0}.rbd-empty-state small{display:block;margin-top:3px;color:var(--text-faint)}
.rbd-muted{color:var(--text-muted)}.rbd-pulse-metric{font-size:1.45rem;font-weight:700;letter-spacing:-.02em}
.rbd-link-list{list-style:none!important;padding-left:0!important}.rbd-link-row{display:flex;align-items:center;min-height:30px;margin:2px 0!important;padding:3px 8px;border-radius:8px;transition:background .15s ease}.rbd-link-row:before{content:"";width:5px;height:5px;margin-right:9px;border-radius:50%;background:var(--text-muted);opacity:.7}.rbd-link-row:hover{background:var(--background-modifier-hover)}
.rbd-widget-body blockquote{margin:0;padding:18px 20px;font-size:1.08em;line-height:1.65}
.rbd-quote-card{display:flex;width:100%;flex-direction:column;gap:12px}.rbd-quote-card-link{cursor:pointer;border-radius:16px;padding:2px;outline:0;transition:transform .16s ease,background .16s ease,box-shadow .16s ease}.rbd-quote-card-link:hover{background:color-mix(in srgb,var(--rbd-accent) 7%,transparent);transform:translateY(-1px)}.rbd-quote-card-link:focus-visible{box-shadow:0 0 0 3px color-mix(in srgb,var(--rbd-accent) 42%,transparent)}.rbd-quote-text{font-family:var(--font-text);font-size:1.1em;letter-spacing:.005em}.rbd-quote-footer{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;padding:0 6px;color:var(--text-muted);font-size:.86em}.rbd-quote-author{font-weight:700;color:var(--text-normal)}.rbd-quote-source{color:var(--text-faint);font-size:.92em}.rbd-quote-actions{display:flex;gap:8px;flex-wrap:wrap;padding:0 6px}.rbd-secondary-button{align-self:flex-start;margin-top:2px!important}
@media(max-width:600px){.rbd-module-grid{grid-template-columns:1fr}.rbd-module-button{min-height:52px!important}.rbd-module-description{white-space:normal}}
.rbd-quote-attribution{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px;margin-top:12px;color:var(--text-muted);font-family:var(--font-interface);font-size:.82em}

/* Keep the editor's 1\u201312 values meaningful at every responsive width. */
.rbd-grid{grid-template-columns:repeat(12,minmax(0,1fr))}.rbd-widget{grid-column:span var(--rbd-w)}
@media(max-width:900px){.rbd-grid{grid-template-columns:repeat(12,minmax(0,1fr))}.rbd-widget{grid-column:span var(--rbd-mobile-span)}}
@media(max-width:600px){.red-beard-dashboard{height:auto;min-height:100%;overflow-y:visible}.rbd-hero{min-height:190px}.rbd-grid{grid-template-columns:minmax(0,1fr)}.rbd-widget{grid-column:1!important}}

/* Final placement override: keep each card's explicit start column and height span. */
.rbd-grid .rbd-widget{grid-column:var(--rbd-x)/span var(--rbd-w);grid-row:span var(--rbd-h);min-height:104px;height:auto;}
@media(max-width:900px){.rbd-grid .rbd-widget{grid-column:var(--rbd-x)/span var(--rbd-w);}}
@media(max-width:600px){.rbd-grid .rbd-widget{grid-column:1!important;grid-row:auto;}}

/* Editing chrome stays over the card so height units describe the card itself. */
.rbd-widget.rbd-editing{position:relative}
.rbd-widget.rbd-editing .rbd-drag-handle{position:absolute;z-index:5;top:8px;left:10px;margin:0;padding:3px 7px;border:1px solid var(--rbd-border);background:var(--background-modifier-hover);font-size:.72em}
.rbd-widget.rbd-editing .rbd-widget-title{padding-left:66px}
.rbd-widget.rbd-editing .rbd-drop-bottom{display:none!important}
.rbd-column-drop-grid{display:grid;grid-column:1/-1;grid-template-columns:repeat(12,minmax(0,1fr));gap:16px;margin:2px 0 24px}
.rbd-column-drop-zone{grid-column:span 4;display:flex;align-items:center;justify-content:center;min-height:58px;border:1px dashed color-mix(in srgb,var(--rbd-accent) 65%,var(--rbd-border));border-radius:14px;background:color-mix(in srgb,var(--rbd-accent) 7%,transparent);color:var(--rbd-accent);font-size:.78em;font-weight:700;letter-spacing:.04em;text-transform:uppercase;transition:background .15s ease,box-shadow .15s ease}
.rbd-column-drop-zone:hover,.rbd-column-drop-zone.rbd-zone-active{background:color-mix(in srgb,var(--rbd-accent) 18%,transparent);box-shadow:0 0 0 2px var(--rbd-accent-soft)}
@media(max-width:600px){.rbd-column-drop-grid{grid-template-columns:1fr;gap:10px}.rbd-column-drop-zone{grid-column:1;min-height:50px}.rbd-widget.rbd-editing .rbd-widget-title{padding-left:58px}}

/* Editor polish: controls have their own compact row and vertical zones are visual affordances. */
.rbd-widget.rbd-editing .rbd-widget-title{display:flex;min-height:24px;margin-bottom:7px;padding-left:66px;line-height:1.2}
.rbd-widget.rbd-editing .rbd-widget-controls{display:flex;align-items:center;justify-content:flex-end;gap:8px;margin:0 0 10px;padding:6px 0;border-top:1px solid color-mix(in srgb,var(--rbd-border) 70%,transparent);border-bottom:1px solid color-mix(in srgb,var(--rbd-border) 70%,transparent)}
.rbd-widget.rbd-editing .rbd-widget-controls button{min-height:28px}
.rbd-widget.rbd-editing .rbd-widget-controls .rbd-field{font-size:.68em;letter-spacing:.03em;text-transform:uppercase}
.rbd-widget.rbd-editing .rbd-drop-left,.rbd-widget.rbd-editing .rbd-drop-right{width:10px;border-color:color-mix(in srgb,var(--rbd-accent) 48%,transparent);background:color-mix(in srgb,var(--rbd-accent) 6%,transparent);font-size:0;opacity:.75}
.rbd-widget.rbd-editing .rbd-drop-left{left:-17px}.rbd-widget.rbd-editing .rbd-drop-right{right:-17px}
.rbd-widget.rbd-editing .rbd-drop-top{height:14px;top:-21px;left:22%;right:22%;font-size:.62em;opacity:.88}
.rbd-widget.rbd-editing .rbd-drag-handle{letter-spacing:.02em;text-transform:uppercase}

/* Editing is an inspection mode, so content always wins over the saved
   compact height.  Auto-sized tracks keep long lists and controls inside the
   card instead of letting them paint over the next widget.  The saved height
   remains visible/editable, while the preview grows enough to be usable. */
.rbd-is-editing .rbd-grid{grid-auto-flow:row;grid-auto-rows:minmax(120px,auto);align-items:stretch}
.rbd-is-editing .rbd-grid .rbd-widget{min-height:120px;height:auto;overflow:visible}
.rbd-is-editing .rbd-widget-body{min-height:0}

/* Keep insertion affordances in the grid gap, never over the widget body. */
.rbd-is-editing .rbd-drop-top{top:-14px;height:9px;left:24%;right:24%;font-size:0}
.rbd-is-editing .rbd-drop-left,.rbd-is-editing .rbd-drop-right{top:22%;bottom:22%;width:6px;font-size:0;opacity:.55}
.rbd-is-editing .rbd-drop-left{left:-11px}.rbd-is-editing .rbd-drop-right{right:-11px}
.rbd-is-editing .rbd-drop-zone{border-radius:5px;background:color-mix(in srgb,var(--rbd-accent) 5%,transparent)}
.rbd-is-editing .rbd-drop-zone.rbd-zone-active{background:var(--rbd-accent);opacity:1}
.rbd-is-editing .rbd-drag-handle{top:7px;left:8px;max-width:58px;overflow:hidden;padding:2px 5px;font-size:.62rem;line-height:1.2;white-space:nowrap}
.rbd-is-editing .rbd-widget-title{padding-right:6px}

/* The editor uses a measured masonry canvas. CSS grid rows are shared across
   columns, which is useful for the finished dashboard but creates large blank
   bands while arranging cards. Each card is therefore packed against the
   current height of the columns it occupies; multi-column cards still push all
   of their columns down together. */
.rbd-is-editing .rbd-grid.rbd-editing-masonry{display:block;position:relative;min-height:120px;grid-template-columns:none;grid-auto-rows:none;gap:0}
.rbd-is-editing .rbd-grid.rbd-editing-masonry>.rbd-widget{position:absolute;box-sizing:border-box;left:var(--rbd-edit-left);top:var(--rbd-edit-top);width:var(--rbd-edit-width);grid-column:auto!important;grid-row:auto!important}

@media(max-width:600px){
  .rbd-is-editing .rbd-grid.rbd-editing-masonry{display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(120px,auto);gap:var(--rbd-gap);min-height:0!important}
  .rbd-is-editing .rbd-grid.rbd-editing-masonry>.rbd-widget{position:relative!important;left:auto!important;top:auto!important;width:auto!important;grid-column:1!important;grid-row:auto!important}
}

.rbd-prayer-list{display:grid;gap:8px;width:100%;margin:10px 0}.rbd-prayer-row{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:10px;align-items:center;padding:10px 12px;border:1px solid var(--rbd-border);border-radius:12px;background:linear-gradient(135deg,var(--rbd-card),color-mix(in srgb,var(--rbd-accent) 7%,var(--rbd-card)))}.rbd-prayer-copy{min-width:0}.rbd-prayer-copy strong{display:block}.rbd-prayer-copy small{color:var(--text-muted)}.rbd-prayer-copy p{margin:.3rem 0 0;color:var(--text-muted);font-size:.84em;white-space:pre-line}.rbd-prayer-row button{white-space:nowrap}.rbd-scripture-card{display:flex;width:100%;flex-direction:column;gap:10px;padding:14px 16px;border:1px solid var(--rbd-border);border-radius:16px;background:linear-gradient(135deg,var(--rbd-card),color-mix(in srgb,var(--rbd-accent) 8%,var(--rbd-card)));box-shadow:0 8px 24px #0001}.rbd-scripture-heading{display:flex;align-items:center;justify-content:space-between;gap:10px}.rbd-scripture-card blockquote{margin:0;padding:14px 16px;border-left:4px solid var(--rbd-accent);border-radius:0 12px 12px 0;background:var(--rbd-accent-soft);white-space:pre-line;line-height:1.6}.rbd-scripture-card .rbd-muted{margin:0}@media(max-width:600px){.rbd-prayer-row{grid-template-columns:1fr}.rbd-prayer-row button{width:100%}.rbd-scripture-heading{align-items:flex-start;flex-direction:column}}

/* Keep the insertion marker fully inside the masonry gap.  The earlier
   card-scoped rules are intentionally more specific, so these selectors
   explicitly win without changing the normal viewing layout. */
.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-top{top:-10px!important;height:6px!important;left:24%!important;right:24%!important;font-size:0!important;border-radius:4px}
.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-left,.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-right{top:24%!important;bottom:24%!important;width:12px!important;font-size:0!important}
.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-left{left:-15px!important}.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-right{right:-15px!important}

/* Vertical insertion is the only card-to-card drop interaction.  Side zones
   are intentionally hidden; use the column drop row to start a new column. */
.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-left,.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-right{display:none!important}
.rbd-is-editing .rbd-widget.rbd-editing .rbd-drop-bottom{display:flex!important;top:auto!important;bottom:-10px!important;height:6px!important;left:24%!important;right:24%!important;font-size:0!important;border-radius:4px}

/* Use the same packed coordinates after leaving edit mode. This keeps the
   saved dashboard visually identical to the editor instead of handing the
   cards back to a shared-row CSS grid. */
.rbd-grid.rbd-masonry{display:block;position:relative;min-height:120px;grid-template-columns:none;grid-auto-rows:none;gap:0}
.rbd-grid.rbd-masonry>.rbd-widget{position:absolute;box-sizing:border-box;left:var(--rbd-edit-left);top:var(--rbd-edit-top);width:var(--rbd-edit-width);grid-column:auto!important;grid-row:auto!important}
@media(max-width:600px){
  .rbd-grid.rbd-masonry{display:grid;grid-template-columns:minmax(0,1fr);grid-auto-rows:minmax(120px,auto);gap:var(--rbd-gap);min-height:0!important}
  .rbd-grid.rbd-masonry>.rbd-widget{position:relative!important;left:auto!important;top:auto!important;width:auto!important;grid-column:1!important;grid-row:auto!important}
}

/* The toolbar is a secondary utility strip, not dashboard content. It is
   rendered after the widgets and kept visually quiet so the useful cards get
   the first attention on both desktop and mobile. */
.rbd-toolbar{order:10;margin:28px 0 0;padding:7px 10px;justify-content:flex-end;border-color:transparent;background:transparent;box-shadow:none;opacity:.78}
.rbd-toolbar button{min-height:28px;padding:4px 10px;font-size:.76rem}
.rbd-toolbar button:first-child{background:var(--background-modifier-hover);color:var(--text-muted)}
@media(max-width:600px){
  .rbd-toolbar{margin:24px 0 calc(8px + env(safe-area-inset-bottom,0px));padding:5px 0;gap:6px;opacity:.72}
  .rbd-toolbar button{flex:0 0 auto;min-height:28px;padding:4px 8px;font-size:.68rem}
  .rbd-grid.rbd-masonry>.rbd-widget{min-height:0!important;height:auto!important;overflow:visible}
  .rbd-widget-body{min-height:0}
  .rbd-action-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
  .rbd-action-grid button{width:100%;min-height:42px!important;white-space:normal}
  .rbd-module-grid{gap:8px}
  .rbd-module-button{min-height:52px!important}
}

/* Obsidian's iOS webview can report a desktop-sized CSS viewport while still
   rendering in a narrow mobile pane. Use its mobile body marker as the
   authoritative signal so absolute desktop coordinates never overlap cards. */
body.is-mobile .rbd-grid.rbd-masonry{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;gap:var(--rbd-gap)!important;min-height:0!important}
body.is-mobile .rbd-grid.rbd-masonry>.rbd-widget{position:relative!important;left:auto!important;top:auto!important;width:auto!important;grid-column:1!important;grid-row:auto!important;min-height:0!important;height:auto!important;overflow:visible!important}
body.is-mobile .rbd-toolbar{margin:24px 0 calc(8px + env(safe-area-inset-bottom,0px));padding:5px 0;gap:6px;opacity:.72}
body.is-mobile .rbd-toolbar button{flex:0 0 auto;min-height:28px;padding:4px 8px;font-size:.68rem}
@media(max-width:900px){
  .rbd-grid.rbd-masonry{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;gap:var(--rbd-gap)!important;min-height:0!important}
  .rbd-grid.rbd-masonry>.rbd-widget{position:relative!important;left:auto!important;top:auto!important;width:auto!important;grid-column:1!important;grid-row:auto!important;min-height:0!important;height:auto!important;overflow:visible!important}
  .rbd-toolbar{margin:24px 0 calc(8px + env(safe-area-inset-bottom,0px));padding:5px 0;gap:6px;opacity:.72}
  .rbd-toolbar button{flex:0 0 auto;min-height:28px;padding:4px 8px;font-size:.68rem}
}

/* Platform.isMobile adds this class from the plugin itself, so this remains
   reliable in Obsidian's native iOS webview even when viewport CSS lies. */
.rbd-is-mobile .rbd-grid.rbd-masonry{display:grid!important;grid-template-columns:minmax(0,1fr)!important;grid-auto-rows:auto!important;gap:var(--rbd-gap)!important;min-height:0!important}
.rbd-is-mobile .rbd-grid.rbd-masonry>.rbd-widget{position:relative!important;left:auto!important;top:auto!important;width:auto!important;grid-column:1!important;grid-row:auto!important;min-height:0!important;height:auto!important;overflow:visible!important}
.rbd-is-mobile .rbd-toolbar{margin:24px 0 calc(8px + env(safe-area-inset-bottom,0px));padding:5px 0;gap:6px;opacity:.72}
.rbd-is-mobile .rbd-toolbar button{flex:0 0 auto;min-height:28px;padding:4px 8px;font-size:.68rem}

/* Native mobile flow: Platform.isMobile is authoritative in Obsidian.  These
   rules are deliberately last and scoped to the class added by the view so a
   desktop theme or a misleading web viewport cannot resurrect absolute card
   coordinates on iOS. */
.red-beard-dashboard.rbd-is-mobile{display:block!important;height:auto!important;min-height:100%!important;overflow-x:hidden!important;overflow-y:auto!important}
.red-beard-dashboard.rbd-is-mobile .rbd-grid{display:block!important;position:relative!important;height:auto!important;min-height:0!important;margin-bottom:24px!important;overflow:visible!important}
.red-beard-dashboard.rbd-is-mobile .rbd-grid>.rbd-mobile-flow-card{display:block!important;position:relative!important;float:none!important;box-sizing:border-box!important;left:auto!important;top:auto!important;right:auto!important;bottom:auto!important;width:auto!important;height:auto!important;min-height:0!important;grid-column:auto!important;grid-row:auto!important;transform:none!important;z-index:auto!important;overflow:visible!important}
.red-beard-dashboard.rbd-is-mobile .rbd-mobile-flow-card:last-child{margin-bottom:0!important}
.red-beard-dashboard.rbd-is-mobile .rbd-widget-title{position:relative!important;display:flex!important;min-height:0!important;transform:none!important}
.red-beard-dashboard.rbd-is-mobile .rbd-widget-body{position:relative!important;display:flex!important;min-height:0!important;height:auto!important;transform:none!important;overflow:visible!important}
.red-beard-dashboard.rbd-is-mobile .rbd-toolbar{position:relative!important;display:flex!important;clear:both!important;transform:none!important}

/* Dashboard-owned launcher styling.  These classes are deliberately applied
   to individual buttons, so a highlighted action never recolors the whole
   card or affects a contributing add-on's widget. */
.rbd-action-button.rbd-highlight-blue,.rbd-module-button.rbd-highlight-blue{border-color:#4389e8;background:color-mix(in srgb,#4389e8 22%,var(--background-secondary));color:var(--text-normal)}
.rbd-action-button.rbd-highlight-red,.rbd-module-button.rbd-highlight-red{border-color:#d05a5a;background:color-mix(in srgb,#d05a5a 20%,var(--background-secondary));color:var(--text-normal)}
.rbd-action-button.rbd-highlight-hollow,.rbd-module-button.rbd-highlight-hollow{border:1px solid var(--rbd-accent);background:transparent;box-shadow:none;color:var(--text-normal)}
.rbd-action-button.rbd-highlight-blue:hover,.rbd-module-button.rbd-highlight-blue:hover{background:color-mix(in srgb,#4389e8 32%,var(--background-secondary))}
.rbd-action-button.rbd-highlight-red:hover,.rbd-module-button.rbd-highlight-red:hover{background:color-mix(in srgb,#d05a5a 30%,var(--background-secondary))}
.rbd-card-manage-button{margin-left:auto!important;padding:3px 8px!important;border:1px solid var(--rbd-border)!important;background:var(--background-modifier-hover)!important;color:var(--text-muted)!important;font-size:.72rem!important;font-weight:600}
.rbd-card-manage-button:hover{border-color:var(--rbd-accent)!important;color:var(--text-normal)!important}

/* The manager uses one intentional scroll region and a sticky action footer,
   keeping every item and Save button reachable in a narrow Obsidian pane. */
.rbd-card-manager-modal{width:min(720px,calc(100vw - 24px))!important;max-width:none!important}
.rbd-card-manager-content{display:flex;max-height:min(78vh,720px);flex-direction:column;overflow:hidden;padding-bottom:env(safe-area-inset-bottom,0px)}
.rbd-card-manager-content h2{margin-top:0}
.rbd-card-manager-intro{margin-top:0;color:var(--text-muted)}
.rbd-card-manager-list{min-height:0;overflow-y:auto;padding:4px 2px 28px}
.rbd-card-manager-row{display:grid;grid-template-columns:auto minmax(0,1fr) minmax(135px,170px) auto;align-items:center;gap:10px;margin:6px 0;padding:10px 12px;border:1px solid var(--rbd-border);border-radius:12px;background:var(--background-secondary)}
.rbd-card-manager-row>input{margin:0;width:18px;height:18px}
.rbd-card-manager-copy{min-width:0}.rbd-card-manager-name{font-weight:650}.rbd-card-manager-description{overflow:hidden;color:var(--text-muted);font-size:.78rem;text-overflow:ellipsis;white-space:nowrap}.rbd-card-manager-flavor{display:block;width:100%;margin-top:7px;padding:5px 7px;border:1px solid var(--background-modifier-border);border-radius:6px;background:var(--background-primary);color:var(--text-normal);font-size:.8rem}.rbd-card-manager-order-label{color:var(--text-muted);font-size:.7rem;letter-spacing:.04em;text-transform:uppercase}.rbd-card-manager-order input{width:54px;min-height:30px;padding:3px 5px}.rbd-card-manager-widget-row{grid-template-columns:auto minmax(0,1fr)}
.rbd-module-position-input{width:70px!important}.rbd-module-flavor-input{min-width:180px}
.rbd-card-manager-style{width:100%;min-height:32px}
.rbd-card-manager-order{display:flex;gap:4px}.rbd-card-manager-order button{min-width:30px;padding:4px 7px}
.rbd-card-manager-footer{display:flex;justify-content:flex-end;gap:8px;margin-top:8px;padding:12px 0 0;border-top:1px solid var(--rbd-border)}
@media(max-width:600px){
  .rbd-card-manager-modal{width:calc(100vw - 16px)!important;margin:8px!important}
  .rbd-card-manager-content{max-height:calc(100dvh - 32px);padding-bottom:calc(8px + env(safe-area-inset-bottom,0px))}
  .rbd-card-manager-row{grid-template-columns:auto minmax(0,1fr) auto;gap:8px;padding:9px}
  .rbd-card-manager-widget-row{grid-template-columns:auto minmax(0,1fr)}
  .rbd-card-manager-style{grid-column:2;grid-row:2;width:100%}
  .rbd-card-manager-flavor{font-size:.85rem}
  .rbd-card-manager-order{grid-column:3;grid-row:1;align-self:start}
  .rbd-card-manage-button{min-height:28px!important}
}
`;

// src/main.ts
var FALLBACKS = { "quote-library:open-dashboard": "quote-library-dashboard", "scripture-library:open-dashboard": "scripture-library-dashboard", "movie-library:open-dashboard": "movie-library-dashboard", "study-planner:open-dashboard": "study-planner-dashboard", "season-planner:open-dashboard": "season-planner-dashboard", "marriage-companion:open-dashboard": "marriage-companion-dashboard", "vault-backup:open-dashboard": "vault-backup-dashboard", "prayer-library:open-dashboard": "prayer-library-dashboard", "journal-companion:open-dashboard": "journal-companion-dashboard" };
function resolveCommand(app, id) {
  var _a;
  if (id === "study-planner:open-dashboard") {
    const commandApi = app.commands;
    const alternate = Object.keys((_a = commandApi == null ? void 0 : commandApi.commands) != null ? _a : {}).find((candidate) => {
      var _a2, _b, _c;
      return candidate !== id && candidate.endsWith(":open-dashboard") && /study[- ]planner/i.test(`${candidate} ${(_c = (_b = (_a2 = commandApi == null ? void 0 : commandApi.commands) == null ? void 0 : _a2[candidate]) == null ? void 0 : _b.name) != null ? _c : ""}`);
    });
    if (alternate) return alternate;
  }
  return id;
}
function execute(app, id) {
  var _a;
  const commandId = resolveCommand(app, id);
  const c = app.commands;
  if (c == null ? void 0 : c.executeCommandById(commandId)) return;
  void app.workspace.getLeaf(true).setViewState({ type: (_a = FALLBACKS[commandId]) != null ? _a : commandId, active: true });
}
function frontmatter(text) {
  const out = {};
  if (!text.startsWith("---\n")) return out;
  const end = text.indexOf("\n---\n", 4);
  if (end < 0) return out;
  for (const line of text.slice(4, end).split("\n")) {
    const m = /^([\w-]+):\s*(.*)$/.exec(line);
    if (m) {
      const raw = m[2].replace(/^['"]|['"]$/g, "");
      out[m[1]] = raw === "true" ? true : raw === "false" ? false : raw;
    }
  }
  return out;
}
function dashboardExcluded(app, file) {
  var _a, _b;
  const value = (_b = (_a = app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) == null ? void 0 : _b.dashboard_exclude;
  return value === true || String(value != null ? value : "").toLowerCase() === "true";
}
var RedBeardDashboard = class extends import_obsidian4.Plugin {
  constructor() {
    super(...arguments);
    this.settings = defaultSettings();
    this.layout = defaultLayouts();
    this.widgets = /* @__PURE__ */ new Map();
    this.modules = /* @__PURE__ */ new Map();
    this.editing = false;
  }
  async onload() {
    this.ensureStyles();
    const d = await this.loadData();
    this.settings = normalizeSettings(d);
    const legacy = Boolean((d == null ? void 0 : d.layout) && Object.values(d.layout).some((v) => v && typeof v === "object" && ("sizingMode" in v || "dynamicWidth" in v)));
    this.layout = legacy ? defaultLayouts() : sanitizeLayout(d == null ? void 0 : d.layout);
    if (legacy) await this.saveData({ ...this.settings, layout: this.layout });
    await this.loadLayout();
    this.registerView(DASHBOARD_VIEW, (l) => new DashboardView(l, this));
    this.addSettingTab(new DashboardSettingsTab(this.app, this));
    this.registerNativeWidgets();
    this.widgets.delete("quote-of-day");
    await this.loadMarkdownWidgets();
    this.ensureKnownIntegrations();
    this.announceReady();
    this.addRibbonIcon("layout-dashboard", "Open Red-Beard Dashboard", () => void this.openDashboard());
    this.addCommand({ id: "open-dashboard", name: "Open dashboard", callback: () => void this.openDashboard() });
    this.addCommand({ id: "edit-layout", name: "Edit dashboard layout", callback: () => this.toggleEditor() });
    this.addCommand({ id: "refresh", name: "Refresh dashboard", callback: () => void this.refreshViews() });
    this.addCommand({ id: "open-settings", name: "Open dashboard settings", callback: () => this.openSettings() });
    this.addCommand({ id: "import-legacy", name: "Import/re-import legacy dashboard", callback: () => void this.importLegacy() });
    this.addCommand({ id: "reset-layout", name: "Reset dashboard layout", callback: () => void this.resetLayout() });
    if (this.settings.dashboard.autoRefreshSeconds > 0) this.timer = window.setInterval(() => void this.refreshViews(), this.settings.dashboard.autoRefreshSeconds * 1e3);
    if (this.settings.dashboard.startup) this.app.workspace.onLayoutReady(() => void this.openDashboard());
  }
  ensureStyles() {
    if (document.head.querySelector("style[data-red-beard-dashboard]") || !styles_default) return;
    const style = document.createElement("style");
    style.dataset.redBeardDashboard = "";
    style.textContent = styles_default;
    document.head.appendChild(style);
    this.register(() => style.remove());
  }
  onunload() {
    if (this.timer) window.clearInterval(this.timer);
    this.widgets.forEach((w) => {
      var _a;
      return (_a = w.cleanup) == null ? void 0 : _a.call(w);
    });
  }
  registerWidget(def) {
    this.widgets.set(def.id, def);
    if (!this.layout[def.id]) this.layout[def.id] = sanitizeLayout({ [def.id]: def.defaultLayout })[def.id];
    void this.refreshViews();
    return () => {
      if (this.widgets.get(def.id) === def) {
        this.widgets.delete(def.id);
        void this.refreshViews();
      }
    };
  }
  registerModule(def) {
    const previous = this.modules.get(def.id);
    this.modules.set(def.id, def);
    if (typeof this.settings.moduleVisibility[def.id] !== "boolean") this.settings.moduleVisibility[def.id] = true;
    void this.saveSettings();
    void this.refreshViews();
    return () => {
      if (this.modules.get(def.id) === def) {
        if (previous) this.modules.set(def.id, previous);
        else this.modules.delete(def.id);
        void this.refreshViews();
      }
    };
  }
  getQuickActions() {
    return DEFAULT_QUICK_ACTIONS;
  }
  getModules() {
    return [...this.modules.values()];
  }
  getWidgets() {
    return [...this.widgets.values()];
  }
  openCardManager(kind) {
    new DashboardCardManagerModal(this.app, this, kind).open();
  }
  openWidgetManager() {
    new DashboardCardManagerModal(this.app, this, "widgets").open();
  }
  isModuleEnabled(id) {
    return this.settings.moduleVisibility[id] !== false;
  }
  isWidgetVisible(id) {
    var _a;
    return ((_a = this.layout[id]) == null ? void 0 : _a.visible) !== false;
  }
  layoutFor(def) {
    var _a, _b;
    return (_b = (_a = this.layout[def.id]) != null ? _a : defaultLayouts()[def.id]) != null ? _b : { x: 1, w: 4, mobileW: 12, h: 1, order: 99, visible: true, locked: false };
  }
  context() {
    return { app: this.app, vault: this.app.vault, settings: this.settings, layout: this.layout, refresh: () => this.refreshViews(), openNote: (p) => this.openNote(p), notice: (m) => new import_obsidian4.Notice(m) };
  }
  async saveSettings() {
    await this.saveData({ ...this.settings, layout: this.layout });
  }
  async saveLayout() {
    await this.saveSettings();
    try {
      await writeLayoutNote(this.app.vault, this.settings, this.layout);
    } catch (e) {
      new import_obsidian4.Notice(`Could not save layout: ${e instanceof Error ? e.message : String(e)}`);
    }
    await this.refreshViews();
  }
  async resetLayout() {
    this.layout = defaultLayouts();
    await this.saveLayout();
    new import_obsidian4.Notice("Dashboard layout reset.");
  }
  existingDashboardLeaf() {
    var _a, _b, _c;
    const leaves = this.app.workspace.getLeavesOfType(DASHBOARD_VIEW);
    const active = this.app.workspace.activeLeaf;
    return (_c = (_b = (_a = leaves.find((leaf) => leaf === active)) != null ? _a : leaves.find((leaf) => leaf.getViewState().pinned === true)) != null ? _b : leaves[0]) != null ? _c : null;
  }
  async openDashboard() {
    var _a;
    this.ensureKnownIntegrations();
    const leaf = (_a = this.existingDashboardLeaf()) != null ? _a : this.app.workspace.getLeaf(true);
    await leaf.setViewState({ type: DASHBOARD_VIEW, active: true });
    this.app.workspace.revealLeaf(leaf);
    await this.refreshViews();
  }
  openNote(path) {
    void this.app.workspace.openLinkText(path.replace(/\.md$/i, ""), "", false);
  }
  openSettings() {
    var _a;
    const s = this.app.setting;
    (_a = s == null ? void 0 : s.open) == null ? void 0 : _a.call(s);
    window.setTimeout(() => {
      var _a2;
      return (_a2 = s == null ? void 0 : s.openTabById) == null ? void 0 : _a2.call(s, this.manifest.id);
    }, 100);
  }
  toggleEditor() {
    this.editing = !this.editing;
    void this.refreshViews();
  }
  announceReady() {
    window.dispatchEvent(new CustomEvent("red-beard-dashboard-ready"));
  }
  async refreshViews() {
    for (const l of this.app.workspace.getLeavesOfType(DASHBOARD_VIEW)) if (l.view instanceof DashboardView) try {
      await l.view.render();
    } catch (e) {
      new import_obsidian4.Notice(`Dashboard refresh failed: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  ensureKnownIntegrations() {
    const plugins = this.app.plugins;
    const available = (id) => {
      var _a, _b;
      const enabled = plugins == null ? void 0 : plugins.enabledPlugins;
      const listed = Array.isArray(enabled) ? enabled.includes(id) : enabled instanceof Set ? enabled.has(id) : Boolean(enabled && typeof enabled === "object" && id in enabled);
      return Boolean(((_a = plugins == null ? void 0 : plugins.getPlugin) == null ? void 0 : _a.call(plugins, id)) || ((_b = plugins == null ? void 0 : plugins.plugins) == null ? void 0 : _b[id]) || listed);
    };
    if (available("quote-library")) {
      if (!this.modules.has("quote-library")) this.registerModule({ id: "quote-library", name: "Quote Library", command: "quote-library:open-dashboard", icon: "quote", description: "Browse and manage saved quotes.", order: 10 });
      this.registerFallbackQuoteWidgets();
    }
    if (available("prayer-library")) {
      if (!this.modules.has("prayer-library")) this.registerModule({ id: "prayer-library", name: "Prayer Library", command: "prayer-library:open-dashboard", icon: "heart", description: "Daily prayer rotation and schedules.", order: 20 });
      this.registerFallbackPrayerWidget();
    }
    if (available("scripture-library")) {
      if (!this.modules.has("scripture-library")) this.registerModule({ id: "scripture-library", name: "Scripture Library", command: "scripture-library:open-dashboard", icon: "book-open", description: "Saved passages, topics, and daily Scripture.", order: 30 });
      this.registerFallbackScriptureWidget();
    }
    if (available("season-planner")) {
      if (!this.modules.has("season-planner")) this.registerModule({ id: "season-planner", name: "Season Planner", command: "season-planner:open-dashboard", icon: "calendar-range", description: "Life load, cadence, and overlapping seasons.", order: 65 });
    }
    if (available("personal-crm")) {
      if (!this.modules.has("personal-crm")) this.registerModule({ id: "personal-crm", name: "Personal CRM", command: "personal-crm:open-dashboard", icon: "users", description: "People, relationships, follow-ups, and prayer connections.", order: 25 });
      this.registerFallbackPersonalCrmWidget();
    }
  }
  registerFallbackPersonalCrmWidget() {
    const id = "personal-crm/overview";
    if (this.widgets.has(id)) return;
    this.registerWidget({ id, name: "Personal CRM", icon: "users", description: "People, follow-ups, and iCloud sync status.", defaultLayout: { x: 1, w: 4, mobileW: 12, h: 3, order: 45 }, render: (_, container) => {
      var _a, _b, _c, _d, _e;
      container.empty();
      const plugin = (_b = (_a = this.app.plugins) == null ? void 0 : _a.getPlugin) == null ? void 0 : _b.call(_a, "personal-crm");
      const contacts = (_e = (_d = (_c = plugin == null ? void 0 : plugin.repository) == null ? void 0 : _c.getContacts) == null ? void 0 : _d.call(_c)) != null ? _e : [];
      const active = contacts.filter((c) => c.recordState !== "inactive").length;
      container.createEl("strong", { text: `${active} active contacts` });
      container.createEl("p", { cls: "rbd-muted", text: `${contacts.filter((c) => c.syncState === "conflict").length} conflicts \xB7 ${contacts.filter((c) => c.prayerEnabled).length} prayer-enabled` });
      const button = container.createEl("button", { text: "Open Personal CRM" });
      button.onclick = () => execute(this.app, "personal-crm:open-dashboard");
    } });
  }
  registerFallbackQuoteWidgets() {
    const quoteFiles = () => this.app.vault.getMarkdownFiles().map((file) => {
      var _a, _b;
      return { file, meta: (_b = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) != null ? _b : {} };
    }).filter((item) => typeof item.meta.quote_text === "string" && !Boolean(item.meta.quote_archive));
    const render = (kind, container) => {
      var _a, _b;
      const candidates = quoteFiles();
      const pool = kind === "pinned" ? candidates.filter((item2) => item2.meta.quote_pin === true || String(item2.meta.quote_pin).toLowerCase() === "true") : kind === "recent" ? candidates.sort((a, b) => b.file.stat.mtime - a.file.stat.mtime) : candidates;
      const item = (pool.length ? pool : candidates)[kind === "daily" && pool.length ? Math.floor(Date.now() / 864e5) % pool.length : 0];
      if (!item) {
        container.createDiv({ cls: "rbd-empty-state", text: "No quotes available yet." });
        return;
      }
      const text = String(item.meta.quote_text).replace(/^['"]|['"]$/g, "");
      container.createEl("blockquote", { cls: "rbd-quote-text", text });
      const author = String((_a = item.meta.quote_author) != null ? _a : "").trim(), source = String((_b = item.meta.quote_source) != null ? _b : "").trim();
      if (author || source) container.createDiv({ cls: "rbd-quote-footer", text: [author ? `\u2014 ${author}` : "", source].filter(Boolean).join(" \xB7 ") });
      const button = container.createEl("button", { text: "Open quote" });
      button.onclick = () => this.openNote(item.file.path);
    };
    const definitions = [["quote-library.quote-of-day", "Quote of the Day", "quote", "The latest saved quote.", { x: 1, w: 4, mobileW: 12, h: 2, order: 2 }], ["quote-library.pinned", "Pinned Quotes", "pin", "Pinned saved quotes.", { x: 1, w: 4, mobileW: 12, h: 2, order: 30 }], ["quote-library.recent", "Recent Quotes", "clock-3", "Recently added quotes.", { x: 1, w: 4, mobileW: 12, h: 2, order: 31 }]];
    for (const [id, name, icon, description, defaultLayout] of definitions) if (!this.widgets.has(id)) this.registerWidget({ id, name, icon, description, defaultLayout, render: (_, container) => render(id.endsWith("quote-of-day") ? "daily" : id.endsWith("pinned") ? "pinned" : "recent", container) });
  }
  registerFallbackPrayerWidget() {
    const id = "prayer-library/overview";
    if (this.widgets.has(id)) return;
    this.registerWidget({ id, name: "Prayer Library", icon: "heart", description: "Today\u2019s prayers with quick mark-prayed actions.", defaultLayout: { x: 9, w: 4, mobileW: 12, h: 3, order: 32 }, render: async (_, container) => {
      var _a, _b;
      container.empty();
      const plugin = ((_b = (_a = this.app.plugins) == null ? void 0 : _a.getPlugin) == null ? void 0 : _b.call(_a, "prayer-library")) || {};
      const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      const items = plugin.getDailyPrayers ? await plugin.getDailyPrayers(date, []) : [];
      container.createEl("p", { cls: "rbd-muted", text: items.length ? `${date} \xB7 ${items.length} ${items.length === 1 ? "prayer" : "prayers"}:` : `No prayers scheduled for today.` });
      const list = container.createDiv({ cls: "rbd-prayer-list" });
      items.forEach((p) => {
        const row = list.createDiv({ cls: "rbd-prayer-row" }), copy = row.createDiv({ cls: "rbd-prayer-copy" });
        copy.createEl("strong", { text: String(p.title || p.id || "Prayer") });
        const prayed = Boolean(p.prayed), button = row.createEl("button", { text: prayed ? "Prayed \u2713" : "Mark prayed" });
        button.disabled = prayed;
        button.onclick = async () => {
          var _a2;
          if (plugin.markPrayedById) await plugin.markPrayedById(String(p.id), date);
          else if (plugin.markPrayed) {
            const record = (_a2 = plugin.getPrayers) == null ? void 0 : _a2.call(plugin).find((item) => item.id === p.id);
            if (record) await plugin.markPrayed(record, date);
          }
          button.setText("Prayed \u2713");
          button.disabled = true;
        };
      });
      const open = container.createEl("button", { text: "Open Prayer Library" });
      open.onclick = () => execute(this.app, "prayer-library:open-dashboard");
    } });
  }
  registerFallbackScriptureWidget() {
    const id = "scripture-library/passage-of-day";
    if (this.widgets.has(id)) return;
    this.registerWidget({ id, name: "Scripture of the Day", icon: "book-open", description: "One saved passage selected for today.", defaultLayout: { x: 5, w: 4, mobileW: 12, h: 3, order: 33 }, render: async (_, container) => {
      var _a, _b, _c;
      container.empty();
      const plugin = (_b = (_a = this.app.plugins) == null ? void 0 : _a.getPlugin) == null ? void 0 : _b.call(_a, "scripture-library");
      const date = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
      let passage = await ((_c = plugin == null ? void 0 : plugin.getPassageOfDay) == null ? void 0 : _c.call(plugin, date));
      if (!passage) {
        const files = this.app.vault.getMarkdownFiles().map((file) => {
          var _a2, _b2;
          return { file, meta: (_b2 = (_a2 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.frontmatter) != null ? _b2 : {} };
        }).filter((x) => String(x.meta.type || "") === "scripture-library-passage");
        if (files.length) {
          let hash = 0;
          for (const char of date) hash = hash * 31 + char.charCodeAt(0) >>> 0;
          const item = files.sort((a, b) => a.file.path.localeCompare(b.file.path))[hash % files.length];
          passage = { path: item.file.path, reference: String(item.meta.reference || item.file.basename), translation: String(item.meta.translation || ""), text: String(item.meta.passage_text || item.meta.text || "") };
        }
      }
      if (!passage) {
        container.createDiv({ cls: "rbd-empty-state", text: "Save a Scripture passage to begin." });
        return;
      }
      const card = container.createDiv({ cls: "rbd-scripture-card" }), heading = card.createDiv({ cls: "rbd-scripture-heading" });
      heading.createEl("strong", { text: String(passage.reference || "Scripture") });
      if (passage.translation) heading.createEl("span", { text: String(passage.translation), cls: "rbd-badge" });
      card.createEl("blockquote", { text: String(passage.text || "(No passage text yet)") });
      const details = [passage.book, passage.category].filter(Boolean).join(" \xB7 ");
      if (details) card.createEl("p", { text: details, cls: "rbd-muted" });
      const open = card.createEl("button", { text: "Open passage" });
      open.onclick = () => this.openNote(String(passage.path));
    } });
  }
  async moveWidget(fromId, toId, side) {
    var _a, _b;
    const from = this.layout[fromId], to = this.layout[toId];
    if (!from || !to) return;
    const targetX = side === "top" || side === "bottom" ? to.x : side === "left" ? to.x - from.w : to.x + to.w;
    from.x = Math.max(1, Math.min(13 - from.w, targetX));
    if (side === "top" || side === "left") from.order = ((_a = to.order) != null ? _a : 99) - 0.25;
    else if (side === "bottom" || side === "right") from.order = ((_b = to.order) != null ? _b : 99) + 0.25;
    await this.saveLayout();
  }
  async placeWidgetInColumn(id, column) {
    const from = this.layout[id];
    if (!from) return;
    from.x = Math.max(1, Math.min(13 - from.w, column));
    const orders2 = Object.values(this.layout).map((l) => l.order).filter((v) => Number.isFinite(v));
    from.order = (orders2.length ? Math.max(...orders2) : 0) + 0.25;
    await this.saveLayout();
  }
  async importLegacy() {
    const f = this.app.vault.getAbstractFileByPath(this.settings.legacyPath);
    if (!(f instanceof import_obsidian4.TFile)) {
      new import_obsidian4.Notice(`Legacy dashboard not found: ${this.settings.legacyPath}`);
      return;
    }
    const text = await this.app.vault.read(f);
    WIDGET_ORDER.forEach((id, i) => {
      if (this.layout[id] && text.toLowerCase().includes(id.replace(/-/g, " "))) this.layout[id].order = i;
    });
    await this.saveLayout();
    new import_obsidian4.Notice("Legacy dashboard imported; original note preserved.");
  }
  async loadLayout() {
    const f = this.app.vault.getAbstractFileByPath(this.settings.dashboardPath);
    if (f instanceof import_obsidian4.TFile) {
      const l = readManagedLayout(await this.app.vault.cachedRead(f));
      if (l) this.layout = sanitizeLayout(l, this.layout);
    }
  }
  registerNativeWidgets() {
    const actions = this.getQuickActions();
    this.registerWidget({ id: "quick-actions", name: "Quick Actions", icon: "zap", defaultLayout: { x: 1, w: 12, mobileW: 12, h: 1, order: 0 }, render: (_, c) => {
      const group = c.createDiv({ cls: "rbd-action-grid" });
      actions.filter((a) => this.settings.quickActionVisibility[a.id] !== false).sort((a, b) => {
        var _a, _b;
        return ((_a = this.settings.quickActionOrder[a.id]) != null ? _a : 99) - ((_b = this.settings.quickActionOrder[b.id]) != null ? _b : 99);
      }).forEach((action, index) => {
        var _a;
        const style = (_a = this.settings.quickActionStyle[action.id]) != null ? _a : index === 0 ? "blue" : "default";
        const b = group.createEl("button", { text: action.name, cls: `rbd-action-button rbd-highlight-${style}` });
        b.onclick = () => execute(this.app, action.command);
      });
    } });
    this.registerWidget({ id: "modules", name: "Modules", icon: "layout-grid", defaultLayout: { x: 1, w: 12, mobileW: 12, h: 1, order: 1 }, render: (_, c) => {
      const modules = [...this.modules.values()].filter((m) => this.isModuleEnabled(m.id)).sort((a, b) => {
        var _a, _b, _c, _d;
        return ((_b = (_a = this.settings.moduleOrder[a.id]) != null ? _a : a.order) != null ? _b : 99) - ((_d = (_c = this.settings.moduleOrder[b.id]) != null ? _c : b.order) != null ? _d : 99) || a.name.localeCompare(b.name);
      });
      if (!modules.length) {
        const empty = c.createDiv({ cls: "rbd-empty-state" });
        empty.createEl("p", { text: "No connected modules are available yet." });
        empty.createEl("small", { text: "Enable an add-on, then reopen or refresh this dashboard." });
        return;
      }
      const group = c.createDiv({ cls: "rbd-module-grid" });
      modules.forEach((m) => {
        var _a;
        const hasCustomFlavor = Object.prototype.hasOwnProperty.call(this.settings.moduleFlavor, m.id), flavor = hasCustomFlavor ? this.settings.moduleFlavor[m.id].trim() : m.description || "", style = (_a = this.settings.moduleStyle[m.id]) != null ? _a : "default", b = group.createEl("button", { cls: `rbd-module-button rbd-highlight-${style}`, attr: { "aria-label": flavor ? `${m.name}: ${flavor}` : m.name, "title": flavor || m.name } });
        if (m.icon) {
          const icon = b.createSpan({ cls: "rbd-module-icon" });
          try {
            (0, import_obsidian4.setIcon)(icon, m.icon);
          } catch (e) {
            icon.setText("\u2022");
          }
        }
        const copy = b.createSpan({ cls: "rbd-module-copy" });
        copy.createSpan({ cls: "rbd-module-label", text: m.name });
        if (flavor) copy.createSpan({ cls: "rbd-module-description", text: flavor });
        b.onclick = () => execute(this.app, m.command);
      });
    } });
    this.registerWidget({ id: "quote-of-day", name: "Quote of the Day", icon: "quote", defaultLayout: { x: 1, w: 4, mobileW: 12, h: 2, order: 2 }, render: (_, c) => this.renderQuote(c) });
    this.listWidget("recently-changed", "Recently Changed", (f) => !dashboardExcluded(this.app, f), 8, { x: 5, w: 4, order: 3 });
    this.registerFavoriteWidget();
    this.registerActiveProjectsWidget();
    this.registerRecentJournalWidget();
    this.registerWidget({ id: "vault-pulse", name: "Vault Pulse", icon: "activity", defaultLayout: { x: 9, w: 4, order: 7 }, render: (_, c) => {
      const fs = this.app.vault.getFiles(), day = Date.now() - 864e5;
      c.createDiv({ cls: "rbd-pulse-metric", text: `${fs.length} files` });
      c.createEl("p", { cls: "rbd-muted", text: `${new Set(fs.map((f) => {
        var _a;
        return (_a = f.parent) == null ? void 0 : _a.path;
      })).size} folders \xB7 ${fs.filter((f) => f.stat.mtime > day).length} changed today` });
    } });
  }
  registerFavoriteWidget() {
    this.registerWidget({ id: "favorites", name: "Favorites", icon: "star", defaultLayout: { x: 9, w: 4, order: 4 }, render: (_, c) => this.renderFavorites(c) });
  }
  renderFavorites(c) {
    const paths = this.bookmarkPaths();
    let files = paths.length ? paths.map((path) => this.app.vault.getAbstractFileByPath(path)).filter((file) => file instanceof import_obsidian4.TFile && file.extension.toLowerCase() === "md" && !dashboardExcluded(this.app, file)) : this.app.vault.getMarkdownFiles().filter((file) => !dashboardExcluded(this.app, file) && this.explicitFavorite(file)).sort((a, b) => b.stat.mtime - a.stat.mtime);
    if (!files.length) {
      c.createDiv({ cls: "rbd-empty-state", text: "No bookmarked pages yet." });
      return;
    }
    const list = c.createEl("ul", { cls: "rbd-link-list" });
    files.slice(0, 8).forEach((file) => {
      const li = list.createEl("li", { cls: "rbd-link-row" }), a = li.createEl("a", { text: file.basename });
      a.onclick = () => this.openNote(file.path);
    });
  }
  bookmarkPaths() {
    var _a, _b, _c, _d, _e;
    const app = this.app;
    const internal = (_b = (_a = app.internalPlugins) == null ? void 0 : _a.getPluginById) == null ? void 0 : _b.call(_a, "bookmarks");
    const instance = internal == null ? void 0 : internal.instance;
    const raw = (_e = (_d = instance == null ? void 0 : instance.items) != null ? _d : (_c = instance == null ? void 0 : instance.data) == null ? void 0 : _c.items) != null ? _e : internal == null ? void 0 : internal.items;
    const paths = [];
    const visit = (value) => {
      if (Array.isArray(value)) {
        value.forEach(visit);
        return;
      }
      if (!value || typeof value !== "object") return;
      const item = value;
      if (item.type === "file" && typeof item.path === "string" && !paths.includes(item.path)) paths.push(item.path);
      if (Array.isArray(item.items)) item.items.forEach(visit);
    };
    visit(raw);
    return paths;
  }
  explicitFavorite(file) {
    var _a, _b;
    const fm = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter;
    const value = (_b = fm == null ? void 0 : fm.favorite) != null ? _b : fm == null ? void 0 : fm.favourite;
    const tags = Array.isArray(fm == null ? void 0 : fm.tags) ? fm.tags.map(String) : typeof (fm == null ? void 0 : fm.tags) === "string" ? String(fm.tags).split(/[\s,]+/) : [];
    return value === true || String(value != null ? value : "").toLowerCase() === "true" || tags.some((tag) => tag.replace(/^#/, "").toLowerCase() === "favorite");
  }
  registerActiveProjectsWidget() {
    this.registerWidget({ id: "active-projects", name: "Active Projects", icon: "folder-kanban", defaultLayout: { x: 1, w: 4, order: 5 }, render: (_, c) => this.renderActiveProjects(c) });
  }
  renderActiveProjects(c) {
    var _a, _b, _c;
    const organizer = this.vaultOrganizer();
    let projects = [];
    try {
      projects = (_c = (_b = (_a = organizer == null ? void 0 : organizer.repository) == null ? void 0 : _a.getProjectFolders) == null ? void 0 : _b.call(_a)) != null ? _c : [];
    } catch (e) {
    }
    if (!projects.length) projects = this.fallbackProjectFolders(organizer);
    if (!projects.length) {
      c.createDiv({ cls: "rbd-empty-state", text: "No Vault Organizer projects yet." });
      return;
    }
    const list = c.createEl("ul", { cls: "rbd-link-list" });
    projects.slice(0, 8).forEach((project) => {
      const li = list.createEl("li", { cls: "rbd-link-row" }), a = li.createEl("a", { text: project.name });
      a.onclick = () => {
        if (organizer == null ? void 0 : organizer.openProject) organizer.openProject.call(organizer, project);
        else this.openNote(project.hub);
      };
      li.createEl("span", { cls: "rbd-muted", text: `${project.files} file${project.files === 1 ? "" : "s"}` });
    });
  }
  vaultOrganizer() {
    var _a;
    const plugins = this.app.plugins;
    return (_a = plugins == null ? void 0 : plugins.getPlugin) == null ? void 0 : _a.call(plugins, "vault-organizer");
  }
  fallbackProjectFolders(organizer) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const root = String((_d = (_c = (_b = (_a = organizer == null ? void 0 : organizer.settings) == null ? void 0 : _a.projects) == null ? void 0 : _b.root) == null ? void 0 : _c.path) != null ? _d : "").replace(/\/+$/g, "");
    const files = this.app.vault.getMarkdownFiles().filter((file) => !dashboardExcluded(this.app, file));
    const marked = files.filter((file) => {
      var _a2;
      const fm = (_a2 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.frontmatter;
      const owner = fm == null ? void 0 : fm.vault_organizer;
      return (owner == null ? void 0 : owner.kind) === "project" || (fm == null ? void 0 : fm.type) === "project";
    });
    const source = root ? files.filter((file) => file.path === root || file.path.startsWith(`${root}/`)) : marked;
    const groups = /* @__PURE__ */ new Map();
    for (const file of source) {
      const relative = root && file.path.startsWith(`${root}/`) ? file.path.slice(root.length + 1) : file.path;
      const parts = relative.split("/");
      const isMarked = marked.includes(file);
      if (parts.length < 2 && !isMarked) continue;
      const name = root && parts.length >= 2 ? parts[0] : (_f = (_e = file.parent) == null ? void 0 : _e.name) != null ? _f : file.basename;
      const existing = (_g = groups.get(name)) != null ? _g : { name, hub: file.path, files: 0, modified: 0 };
      existing.files++;
      existing.modified = Math.max(existing.modified, file.stat.mtime);
      if (((_h = file.parent) == null ? void 0 : _h.name) === name && file.path.split("/").length <= existing.hub.split("/").length) existing.hub = file.path;
      groups.set(name, existing);
    }
    return [...groups.values()].sort((a, b) => b.modified - a.modified);
  }
  registerRecentJournalWidget() {
    this.registerWidget({ id: "recent-journal", name: "Recent Journal", icon: "book-open", defaultLayout: { x: 5, w: 4, order: 6 }, render: async (_, c) => this.renderRecentJournal(c) });
  }
  async renderRecentJournal(c) {
    var _a;
    const journal = this.journalCompanion();
    let records = [];
    try {
      records = ((_a = journal == null ? void 0 : journal.repository) == null ? void 0 : _a.getRecent) ? await journal.repository.getRecent(7) : [];
    } catch (e) {
    }
    if (!records.length) records = this.fallbackJournalRecords(journal);
    if (!records.length) {
      c.createDiv({ cls: "rbd-empty-state", text: "No Journal Companion entries yet." });
      return;
    }
    const list = c.createEl("ul", { cls: "rbd-link-list" });
    records.slice(0, 7).forEach((record) => {
      const li = list.createEl("li", { cls: "rbd-link-row" }), a = li.createEl("a", { text: record.date || record.file.basename });
      a.onclick = () => this.openNote(record.file.path);
    });
  }
  journalCompanion() {
    var _a;
    const plugins = this.app.plugins;
    return (_a = plugins == null ? void 0 : plugins.getPlugin) == null ? void 0 : _a.call(plugins, "journal-companion");
  }
  fallbackJournalRecords(journal) {
    var _a, _b, _c, _d, _e;
    const daily = String((_c = (_b = (_a = journal == null ? void 0 : journal.settings) == null ? void 0 : _a.folders) == null ? void 0 : _b.daily) != null ? _c : "Journal Companion/Daily").replace(/\/+$/g, "");
    const legacy = String((_e = (_d = journal == null ? void 0 : journal.settings) == null ? void 0 : _d.legacySourceFolder) != null ? _e : "Journal").replace(/\/+$/g, "");
    const month = { jan: "01", feb: "02", mar: "03", apr: "04", may: "05", jun: "06", jul: "07", aug: "08", sep: "09", oct: "10", nov: "11", dec: "12" };
    const extractDate = (file, fm) => {
      var _a2;
      const value = String((_a2 = fm == null ? void 0 : fm.date) != null ? _a2 : "");
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const match = /(\d{4})[-_]([A-Za-z]{3}|\d{2})[-_](\d{2})/.exec(value || file.basename);
      if (!match) return value;
      const m = /^\d{2}$/.test(match[2]) ? match[2] : month[match[2].toLowerCase()];
      return m ? `${match[1]}-${m}-${match[3]}` : value;
    };
    const under = (path, root) => Boolean(root) && (path === root || path.startsWith(`${root}/`));
    return this.app.vault.getMarkdownFiles().filter((file) => !dashboardExcluded(this.app, file)).map((file) => {
      var _a2, _b2, _c2;
      const fm = (_a2 = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a2.frontmatter;
      const type = String((_b2 = fm == null ? void 0 : fm.type) != null ? _b2 : "");
      const tags = Array.isArray(fm == null ? void 0 : fm.tags) ? fm.tags.map(String).map((tag) => tag.replace(/^#/, "").toLowerCase()) : [];
      const isTyped = type === "journal-companion-daily";
      const inDaily = under(file.path, daily);
      const inLegacy = under(file.path, legacy);
      const looksDated = /\d{4}[-_](?:\d{2}|[A-Za-z]{3})[-_]\d{2}/i.test(file.basename);
      const isLegacy = inLegacy && (String((_c2 = fm == null ? void 0 : fm.category) != null ? _c2 : "").toLowerCase() === "daily_note" || tags.includes("journal") || looksDated);
      if (file.basename.toLowerCase() === "journal" && !isTyped && !inDaily) return null;
      if (!isTyped && !inDaily && !isLegacy) return null;
      return { file, date: extractDate(file, fm) };
    }).filter((record) => Boolean(record)).sort((a, b) => b.date.localeCompare(a.date) || b.file.stat.mtime - a.file.stat.mtime).slice(0, 7);
  }
  async renderQuote(c) {
    const candidates = this.app.vault.getMarkdownFiles().map((file) => {
      var _a, _b;
      return { file, meta: (_b = (_a = this.app.metadataCache.getFileCache(file)) == null ? void 0 : _a.frontmatter) != null ? _b : {} };
    }).filter((x) => typeof x.meta.quote_text === "string" && !Boolean(x.meta.quote_archive));
    if (!candidates.length) {
      c.createDiv({ cls: "rbd-empty-state", text: "Your saved quotes will appear here." });
      return;
    }
    const item = candidates[Math.floor(Date.now() / 864e5) % candidates.length], text = String(item.meta.quote_text).replace(/^['"]|['"]$/g, "");
    const author = String(item.meta.quote_author || "").trim(), source = String(item.meta.quote_source || "").trim();
    const card = c.createDiv({ cls: "rbd-quote-card rbd-quote-card-link", attr: { role: "link", tabindex: "0", "aria-label": `Open quote${author ? ` by ${author}` : ""}` } });
    const quoteBox = card.createEl("blockquote", { cls: "rbd-quote-text" });
    quoteBox.createDiv({ text });
    if (author || source) {
      const attribution = quoteBox.createDiv({ cls: "rbd-quote-attribution" });
      if (author) attribution.createSpan({ cls: "rbd-quote-author", text: `\u2014 ${author}` });
      if (source) attribution.createSpan({ cls: "rbd-quote-source", text: source });
    }
    const actions = card.createDiv({ cls: "rbd-quote-actions" });
    const copy = actions.createEl("button", { text: "Copy", cls: "rbd-secondary-button" });
    copy.setAttribute("aria-label", "Copy quote and author");
    copy.onclick = async (event) => {
      event.stopPropagation();
      try {
        await navigator.clipboard.writeText(`\u201C${text}\u201D${author ? ` \u2014 ${author}` : ""}`);
        new import_obsidian4.Notice("Quote copied.");
      } catch (e) {
        new import_obsidian4.Notice("The quote could not be copied on this device.");
      }
    };
    const open = () => {
      if (!this.editing) this.openNote(item.file.path);
    };
    card.onclick = open;
    card.onkeydown = (e) => {
      if (e.target instanceof HTMLButtonElement) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    };
  }
  listWidget(id, name, filter, limit, layout) {
    this.registerWidget({ id, name, icon: id === "recently-changed" ? "clock-3" : id === "favorites" ? "star" : id === "active-projects" ? "folder-kanban" : id === "recent-journal" ? "book-open" : "list", defaultLayout: layout, render: (_, c) => {
      const files = this.app.vault.getMarkdownFiles().filter(filter).sort((a, b) => b.stat.mtime - a.stat.mtime).slice(0, limit);
      if (!files.length) {
        c.createDiv({ cls: "rbd-empty-state", text: "Nothing here yet." });
        return;
      }
      const list = c.createEl("ul", { cls: "rbd-link-list" });
      files.forEach((f) => {
        const li = list.createEl("li", { cls: "rbd-link-row" }), a = li.createEl("a", { text: f.basename });
        a.onclick = () => this.openNote(f.path);
      });
    } });
  }
  async loadMarkdownWidgets() {
    const files = this.app.vault.getMarkdownFiles().filter((f) => f.path.startsWith(`${this.settings.widgetFolder}/`));
    for (const f of files) {
      const fm = frontmatter(await this.app.vault.cachedRead(f));
      if (fm.type !== "dashboard-widget" || fm.enabled === false) continue;
      const id = String(fm.widget_id || f.basename);
      this.registerWidget({ id, name: String(fm.title || f.basename), defaultLayout: { w: 4, order: 99 }, render: (_, c) => {
        c.createEl("p", { text: `Widget definition: ${f.basename}` });
      } });
    }
  }
};
