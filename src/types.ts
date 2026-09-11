import type { App } from "obsidian";
import type { DashboardWidgetContext, DashboardWidgetDefinition as FoundationWidgetDefinition, RedBeardSettingsBase } from "./foundation-vendor";

export const DASHBOARD_VIEW = "red-beard-dashboard-view";
export const DEFAULT_LAYOUT_PATH = "Dashboard/Layout.md";
export const LAYOUT_START = "<!-- red-beard-dashboard:managed-start -->";
export const LAYOUT_END = "<!-- red-beard-dashboard:managed-end -->";

export type SizingMode = "grid" | "dynamic";
export type DynamicWidth = "full" | "half" | "third" | "quarter";

export interface WidgetLayout {
  x: number;
  w: number;
  mobileW: number;
  h: number;
  order: number;
  visible: boolean;
  locked: boolean;
  sizingMode: SizingMode;
  dynamicWidth?: DynamicWidth;
}

export interface DashboardSettings extends Omit<RedBeardSettingsBase, "folders" | "files" | "dashboard"> {
  rootFolder: string;
  folders: RedBeardSettingsBase["folders"] & { widgets: string };
  files: RedBeardSettingsBase["files"] & { layout: string };
  dashboard: RedBeardSettingsBase["dashboard"];
  dashboardPath: string;
  legacyPath: string;
  widgetFolder: string;
  mobileBreakpoint: number;
  gap: number;
  padding: number;
  autoRefreshSeconds: number;
  startup: boolean;
  showPlaceholders: boolean;
}

export type WidgetRenderer = (ctx: DashboardWidgetContext<DashboardSettings> & { layout: Record<string, WidgetLayout> }, container: HTMLElement) => void | Promise<void>;
export interface DashboardWidgetDefinition extends Omit<FoundationWidgetDefinition<DashboardSettings>, "defaultLayout" | "render"> {
  defaultLayout?: Partial<WidgetLayout>;
  render: WidgetRenderer;
}

export interface DashboardContext extends DashboardWidgetContext<DashboardSettings> {
  layout: Record<string, WidgetLayout>;
}

export type CommandExecutor = (id: string) => boolean;
export type DashboardApp = App & { commands?: { executeCommandById: CommandExecutor } };
