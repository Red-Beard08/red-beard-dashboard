import { App, PluginSettingTab, Setting } from "obsidian";
import type RedBeardDashboard from "./main";
import { normalizeSettings } from "./utils";
export class DashboardSettingsTab extends PluginSettingTab{
 constructor(app:App,private plugin:RedBeardDashboard){super(app,plugin);}
 display(){const c=this.containerEl;c.empty();c.createEl("h2",{text:"Red-Beard Dashboard"});
  new Setting(c).setName("Storage").setHeading();
  this.text(c,"Root folder","Vault-relative folder for dashboard configuration.","rootFolder");this.text(c,"Layout note","Markdown note that stores widget positions.","dashboardPath");this.text(c,"Legacy dashboard path","Existing page used as the visual baseline.","legacyPath");this.text(c,"Widget definition folder","Safe Markdown widget definitions.","widgetFolder");
  new Setting(c).setName("Dashboard and appearance").setHeading();this.number(c,"Mobile breakpoint","Pixels before widgets stack.","mobileBreakpoint",320,2400);this.number(c,"Widget gap","Spacing between cards in pixels.","gap",0,64);this.number(c,"Page padding","Outer page padding in pixels.","padding",0,96);
  new Setting(c).setName("Modules").setHeading();
  c.createEl("p",{text:"Choose which registered app dashboards appear in the Dashboards card. Other Red-Beard add-ons can register here without changing this plugin."});
  for(const module of this.plugin.modules.values()) new Setting(c).setName(module.name).setDesc(module.description??module.command).addToggle(t=>t.setValue(this.plugin.isModuleEnabled(module.id)).onChange(async enabled=>{this.plugin.settings.moduleVisibility[module.id]=enabled;await this.plugin.saveSettings();await this.plugin.refreshViews();}));
  new Setting(c).setName("Automation").setHeading();new Setting(c).setName("Refresh interval (seconds)").setDesc("0 disables automatic refresh.").addText(t=>t.setValue(String(this.plugin.settings.dashboard.autoRefreshSeconds)).onChange(async v=>{this.plugin.settings.dashboard.autoRefreshSeconds=Math.max(0,Number(v)||0);await this.plugin.saveSettings();}));new Setting(c).setName("Open on startup").addToggle(t=>t.setValue(this.plugin.settings.dashboard.startup).onChange(async v=>{this.plugin.settings.dashboard.startup=v;await this.plugin.saveSettings();}));new Setting(c).setName("Show unavailable widget placeholders").addToggle(t=>t.setValue(this.plugin.settings.showPlaceholders).onChange(async v=>{this.plugin.settings.showPlaceholders=v;await this.plugin.saveSettings();}));
  new Setting(c).setName("Maintenance").setHeading();new Setting(c).addButton(b=>b.setButtonText("Import/re-import legacy dashboard").onClick(()=>void this.plugin.importLegacy()));new Setting(c).addButton(b=>b.setButtonText("Reset layout").onClick(()=>void this.plugin.resetLayout()));
 }
 private text(c:HTMLElement,name:string,desc:string,key:"rootFolder"|"dashboardPath"|"legacyPath"|"widgetFolder"){new Setting(c).setName(name).setDesc(desc).addText(t=>t.setValue(this.plugin.settings[key]).onChange(async v=>{this.plugin.settings=normalizeSettings({...this.plugin.settings,[key]:v});await this.plugin.saveSettings();}));}
 private number(c:HTMLElement,name:string,desc:string,key:"mobileBreakpoint"|"gap"|"padding",min:number,max:number){new Setting(c).setName(name).setDesc(desc).addText(t=>t.setValue(String(this.plugin.settings[key])).onChange(async v=>{this.plugin.settings[key]=Math.max(min,Math.min(max,Number(v)||0));await this.plugin.saveSettings();}));}
}
