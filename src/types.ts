import type { App } from "obsidian";
import type { DashboardWidgetContext, DashboardWidgetDefinition as FoundationWidgetDefinition, RedBeardSettingsBase } from "./foundation-vendor";
export const DASHBOARD_VIEW = "red-beard-dashboard-view";
export const LAYOUT_START = "<!-- red-beard-dashboard:managed-start -->";
export const LAYOUT_END = "<!-- red-beard-dashboard:managed-end -->";
export interface WidgetLayout { x:number; w:number; mobileW:number; h:number; order:number; visible:boolean; locked:boolean; }
export interface DashboardSettings extends Omit<RedBeardSettingsBase,"folders"|"files"|"dashboard"> { rootFolder:string; dashboardPath:string; legacyPath:string; widgetFolder:string; folders:RedBeardSettingsBase["folders"] & {widgets:string}; files:RedBeardSettingsBase["files"] & {layout:string}; dashboard:RedBeardSettingsBase["dashboard"]; mobileBreakpoint:number; gap:number; padding:number; showPlaceholders:boolean; moduleVisibility:Record<string,boolean>; moduleOrder:Record<string,number>; }
export interface DashboardModuleDefinition { id:string; name:string; command:string; icon?:string; description?:string; order?:number; }
export type WidgetRenderer=(ctx:DashboardWidgetContext<DashboardSettings>&{layout:Record<string,WidgetLayout>},container:HTMLElement)=>void|Promise<void>;
export interface DashboardWidgetDefinition extends Omit<FoundationWidgetDefinition<DashboardSettings>,"defaultLayout"|"render"> { defaultLayout?:Partial<WidgetLayout>; render:WidgetRenderer; }
export interface DashboardContext extends DashboardWidgetContext<DashboardSettings>{layout:Record<string,WidgetLayout>}
export type DashboardApp=App&{commands?:{executeCommandById:(id:string)=>boolean}};
