/* Small vendored snapshot of the Red-Beard Foundation contract. Keeping these
 * adapters in the bundle makes the dashboard installable without a local
 * workspace dependency while preserving the shared API shape. */

import type { App, Modal, Vault } from "obsidian";

export interface RedBeardSettingsBase {
  settingsVersion: number;
  rootFolder: string;
  folders: Record<string, string>;
  files: Record<string, string>;
  naming: { idPrefix: string; filenameTemplate: string; dateFormat: string };
  taxonomy: { categories: string[]; statuses: string[]; archived: string[] };
  defaults: Record<string, string | number | boolean>;
  dashboard: { startup: boolean; autoRefreshSeconds: number; compact: boolean };
  migration: { sourceFolder: string; mode: "copy" | "in-place"; lastRun?: string };
  privacy: { showReminder: boolean };
}

export interface DashboardWidgetLayout { w: number; mobileW: number; h: number; order?: number; }
export interface DashboardWidgetContext<TSettings = unknown> {
  app: App;
  vault: Vault;
  settings: TSettings;
  refresh: () => Promise<void> | void;
  openNote: (path: string) => Promise<void> | void;
  notice: (message: string) => void;
}
export interface DashboardWidgetDefinition<TSettings = unknown> {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  defaultLayout: DashboardWidgetLayout;
  mobile?: "stack" | "responsive" | "hidden";
  settingsSchema?: unknown;
  render: (ctx: DashboardWidgetContext<TSettings>, container: HTMLElement) => void | Promise<void>;
  update?: (ctx: DashboardWidgetContext<TSettings>, container: HTMLElement) => void | Promise<void>;
  cleanup?: () => void;
}

export function normalizeVaultPath(value: string): string {
  const trimmed = String(value ?? "").trim();
  if (/^[/\\]{2}/.test(trimmed)) return "";
  const raw = trimmed.replace(/[\\]+/g, "/").replace(/^\/+/, "");
  if (!raw || /^[A-Za-z]:\//.test(raw)) return "";
  const segments = raw.split("/").filter(segment => segment && segment !== ".");
  if (segments.some(segment => segment === "..")) return "";
  return segments.join("/");
}

export function normalizeVaultFile(value: string, fallback: string): string {
  const normalized = normalizeVaultPath(value) || normalizeVaultPath(fallback);
  return normalized.toLowerCase().endsWith(".md") ? normalized : `${normalized}.md`;
}

export function normalizeVaultFolder(value: string, fallback: string): string {
  return normalizeVaultPath(value) || normalizeVaultPath(fallback);
}

export function replaceManagedBlock(text: string, markers: { start: string; end: string }, body: string): string {
  const replacement = `${markers.start}\n${body.trimEnd()}\n${markers.end}`;
  const start = text.indexOf(markers.start);
  if (start >= 0) {
    const bodyStart = start + markers.start.length;
    const end = text.indexOf(markers.end, bodyStart);
    if (end >= 0) return `${text.slice(0, start)}${replacement}${text.slice(end + markers.end.length)}`;
  }
  const prefix = text.trimEnd();
  return prefix ? `${prefix}\n\n${replacement}\n` : `${replacement}\n`;
}

export async function writeTextIfChanged(vault: Vault, file: { path: string }, next: string): Promise<boolean> {
  const current = await vault.read(file as never);
  if (current === next) return false;
  await vault.process(file as never, () => next);
  return true;
}

export function prepareMobileModal(modal: Modal, extraClass?: string): void {
  modal.modalEl.addClass("rb-addon-modal");
  if (extraClass) modal.modalEl.addClass(extraClass);
  modal.contentEl.addClass("rb-addon-modal-content");
  modal.contentEl.setAttr("tabindex", "-1");
}
