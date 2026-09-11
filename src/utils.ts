import type { TFile, Vault } from "obsidian";
import { normalizeVaultFile, normalizeVaultFolder, replaceManagedBlock } from "./foundation-vendor";
import { LAYOUT_END, LAYOUT_START, type DashboardSettings, type DynamicWidth, type WidgetLayout } from "./types";

export const WIDGET_ORDER = ["quick-actions", "modules", "quote-of-day", "recently-changed", "favorites", "active-projects", "recent-journal", "vault-pulse"];
export const DYNAMIC_COLUMNS: Record<DynamicWidth, number> = { full: 12, half: 6, third: 4, quarter: 3 };

export function defaultSettings(): DashboardSettings {
  const rootFolder = "Dashboard";
  const files = { index: "Library Index.md", summary: "Summary.md", journal: "Migration Journal.md", layout: "Layout.md" };
  const folders = { records: "Records", profiles: "Profiles", archive: "Archive", reports: "Reports", backups: "Backups", widgets: "Widgets" };
  return {
    settingsVersion: 1,
    rootFolder,
    folders,
    files,
    naming: { idPrefix: "RBD", filenameTemplate: "{id} - {title}", dateFormat: "yyyy-MM-dd" },
    taxonomy: { categories: [], statuses: ["active", "archived"], archived: ["archived"] },
    defaults: {},
    dashboard: { startup: false, autoRefreshSeconds: 0, compact: false },
    migration: { sourceFolder: "", mode: "copy" },
    privacy: { showReminder: false },
    dashboardPath: `${rootFolder}/${files.layout}`,
    legacyPath: "Dashboard.md",
    widgetFolder: `${rootFolder}/${folders.widgets}`,
    mobileBreakpoint: 700,
    gap: 14,
    padding: 24,
    autoRefreshSeconds: 0,
    startup: false,
    showPlaceholders: true
  };
}

function number(value: unknown, fallback: number, min: number, max: number): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(max, Math.max(min, parsed)) : fallback;
}

/** Read both the original flat settings shape and the Foundation-shaped one. */
export function normalizeSettings(raw: unknown): DashboardSettings {
  const defaults = defaultSettings();
  const value = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawFolders = { ...defaults.folders, ...(value.folders && typeof value.folders === "object" ? value.folders : {}) } as Record<string, unknown>;
  const folders = Object.fromEntries(Object.entries(rawFolders).map(([key, item]) => [key, normalizeVaultFolder(String(item), defaults.folders[key] ?? key)])) as DashboardSettings["folders"];
  const rawFiles = { ...defaults.files, ...(value.files && typeof value.files === "object" ? value.files : {}) } as Record<string, unknown>;
  const files = Object.fromEntries(Object.entries(rawFiles).map(([key, item]) => [key, normalizeVaultFile(String(item), defaults.files[key] ?? `${key}.md`)])) as DashboardSettings["files"];
  const rootFolder = normalizeVaultFolder(String(value.rootFolder ?? defaults.rootFolder), defaults.rootFolder);
  const legacyPath = normalizeVaultFile(String(value.legacyPath ?? defaults.legacyPath), defaults.legacyPath);
  const dashboardPath = normalizeVaultFile(String(value.dashboardPath ?? `${rootFolder}/${files.layout}`), `${rootFolder}/${files.layout}`);
  const widgetFolder = normalizeVaultFolder(String(value.widgetFolder ?? `${rootFolder}/${folders.widgets}`), `${rootFolder}/${folders.widgets}`);
  const dashboard = { ...defaults.dashboard, ...(value.dashboard && typeof value.dashboard === "object" ? value.dashboard : {}) } as DashboardSettings["dashboard"];
  const autoRefreshSeconds = number(value.autoRefreshSeconds ?? dashboard.autoRefreshSeconds, 0, 0, 86_400);
  const startup = Boolean(value.startup ?? dashboard.startup);
  return {
    ...defaults,
    ...value,
    settingsVersion: number(value.settingsVersion, 1, 1, 99),
    rootFolder,
    folders,
    files,
    dashboard: { ...dashboard, startup, autoRefreshSeconds, compact: Boolean(dashboard.compact) },
    dashboardPath,
    legacyPath,
    widgetFolder,
    mobileBreakpoint: number(value.mobileBreakpoint, defaults.mobileBreakpoint, 320, 2400),
    gap: number(value.gap, defaults.gap, 0, 64),
    padding: number(value.padding, defaults.padding, 0, 96),
    autoRefreshSeconds,
    startup,
    showPlaceholders: value.showPlaceholders !== false
  } as DashboardSettings;
}

export function emptyLayout(id: string, index = 99, partial: Partial<WidgetLayout> = {}): WidgetLayout {
  return {
    x: number(partial.x, 1, 1, 12),
    w: number(partial.w, 4, 1, 12),
    mobileW: number(partial.mobileW, 12, 1, 12),
    h: number(partial.h, 1, 1, 8),
    order: number(partial.order, index, 0, 10_000),
    visible: partial.visible !== false,
    locked: partial.locked === true,
    sizingMode: partial.sizingMode === "dynamic" ? "dynamic" : "grid",
    dynamicWidth: partial.dynamicWidth
  };
}

export function defaultLayouts(): Record<string, WidgetLayout> {
  return Object.fromEntries(WIDGET_ORDER.map((id, index) => {
    const w = index < 2 ? 6 : 4;
    const x = index < 2 ? (index * 6) + 1 : (((index - 2) % 3) * 4) + 1;
    return [id, emptyLayout(id, index, { x, w, mobileW: 12, h: 1 })];
  }));
}

export function sanitizeLayout(raw: unknown, fallback = defaultLayouts()): Record<string, WidgetLayout> {
  const source = raw && typeof raw === "object" ? raw as Record<string, unknown> : {};
  const result: Record<string, WidgetLayout> = { ...fallback };
  for (const [id, value] of Object.entries(source)) {
    if (!value || typeof value !== "object") continue;
    result[id] = emptyLayout(id, result[id]?.order ?? 99, { ...result[id], ...(value as Partial<WidgetLayout>) });
  }
  return result;
}

export function readManagedLayout(note: string): Record<string, WidgetLayout> | null {
  const start = note.indexOf(LAYOUT_START);
  if (start < 0) return null;
  const bodyStart = start + LAYOUT_START.length;
  const end = note.indexOf(LAYOUT_END, bodyStart);
  if (end < 0) return null;
  try { return sanitizeLayout(JSON.parse(note.slice(bodyStart, end).trim())); } catch { return null; }
}

export function renderLayoutNote(settings: DashboardSettings, layout: Record<string, WidgetLayout>, existing = ""): string {
  const body = JSON.stringify(layout, null, 2);
  const frontmatter = existing.startsWith("---\n") ? existing.slice(0, existing.indexOf("\n---\n", 4) + 5) : `---\ntype: red-beard-dashboard-layout\nschema_version: 1\nsource: ${JSON.stringify(settings.legacyPath)}\n---\n\n`;
  const content = existing.startsWith("---\n") ? existing.slice(frontmatter.length) : existing;
  return `${frontmatter}${replaceManagedBlock(content, { start: LAYOUT_START, end: LAYOUT_END }, body)}${content.endsWith("\n") ? "" : "\n"}`;
}

export async function ensureFolder(vault: Vault, path: string): Promise<void> {
  const normalized = normalizeVaultFolder(path, "");
  if (!normalized) return;
  const segments = normalized.split("/");
  let current = "";
  for (const segment of segments) {
    current = current ? `${current}/${segment}` : segment;
    if (vault.getAbstractFileByPath(current)) continue;
    try { await vault.createFolder(current); }
    catch { if (!vault.getAbstractFileByPath(current)) throw new Error(`Could not create dashboard folder: ${current}`); }
  }
}

export async function writeLayoutNote(vault: Vault, settings: DashboardSettings, layout: Record<string, WidgetLayout>): Promise<void> {
  await ensureFolder(vault, settings.rootFolder);
  const parent = settings.dashboardPath.split("/").slice(0, -1).join("/");
  await ensureFolder(vault, parent);
  const existing = vault.getAbstractFileByPath(settings.dashboardPath);
  if (existing && "extension" in existing && existing.extension === "md") {
    await vault.process(existing as TFile, current => { const next = renderLayoutNote(settings, layout, current); return next === current ? current : next; });
    return;
  }
  if (!existing) await vault.create(settings.dashboardPath, renderLayoutNote(settings, layout));
}
