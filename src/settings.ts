import { App, PluginSettingTab, Setting } from "obsidian";
import type RedBeardDashboard from "./main";
import { normalizeSettings } from "./utils";

export class DashboardSettingsTab extends PluginSettingTab {
  constructor(app: App, private plugin: RedBeardDashboard) { super(app, plugin); }
  display(): void {
    const container = this.containerEl;
    container.empty();
    container.createEl("h2", { text: "Red-Beard Dashboard" });
    // Settings follow the shared Foundation headings so users can find the
    // same storage, UI, automation, and maintenance controls in every add-on.
    new Setting(container).setName("Storage").setHeading();
    new Setting(container).setName("Root folder").setDesc("Vault-relative base folder for dashboard configuration and widget definitions.").addText(text => text.setValue(this.plugin.settings.rootFolder).onChange(async value => { this.plugin.settings.rootFolder = normalizeSettings({ ...this.plugin.settings, rootFolder: value }).rootFolder; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Dashboard configuration note").setDesc("Vault-relative Markdown note containing the saved layout.").addText(text => text.setValue(this.plugin.settings.dashboardPath).onChange(async value => { this.plugin.settings.dashboardPath = normalizeSettings({ ...this.plugin.settings, dashboardPath: value }).dashboardPath; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Widget definition folder").setDesc("Markdown definitions use safe built-in renderers only.").addText(text => text.setValue(this.plugin.settings.widgetFolder).onChange(async value => { this.plugin.settings.widgetFolder = normalizeSettings({ ...this.plugin.settings, widgetFolder: value }).widgetFolder; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Legacy dashboard path").setDesc("Optional note used by the import action; it is never overwritten.").addText(text => text.setValue(this.plugin.settings.legacyPath).onChange(async value => { this.plugin.settings.legacyPath = normalizeSettings({ ...this.plugin.settings, legacyPath: value }).legacyPath; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Layout and appearance").setHeading();
    new Setting(container).setName("Mobile breakpoint").addText(text => text.setValue(String(this.plugin.settings.mobileBreakpoint)).onChange(async value => { this.plugin.settings.mobileBreakpoint = Math.max(320, Number(value) || 700); await this.plugin.saveSettings(); }));
    new Setting(container).setName("Widget gap").addText(text => text.setValue(String(this.plugin.settings.gap)).onChange(async value => { this.plugin.settings.gap = Math.max(0, Number(value) || 0); await this.plugin.saveSettings(); }));
    new Setting(container).setName("Page padding").addText(text => text.setValue(String(this.plugin.settings.padding)).onChange(async value => { this.plugin.settings.padding = Math.max(0, Number(value) || 0); await this.plugin.saveSettings(); }));
    new Setting(container).setName("Show missing-widget placeholders").addToggle(toggle => toggle.setValue(this.plugin.settings.showPlaceholders).onChange(async value => { this.plugin.settings.showPlaceholders = value; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Automation").setHeading();
    new Setting(container).setName("Automatic refresh (seconds)").setDesc("0 disables the timer.").addText(text => text.setValue(String(this.plugin.settings.autoRefreshSeconds)).onChange(async value => { this.plugin.settings.autoRefreshSeconds = Math.max(0, Number(value) || 0); this.plugin.settings.dashboard.autoRefreshSeconds = this.plugin.settings.autoRefreshSeconds; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Open dashboard on startup").addToggle(toggle => toggle.setValue(this.plugin.settings.startup).onChange(async value => { this.plugin.settings.startup = value; this.plugin.settings.dashboard.startup = value; await this.plugin.saveSettings(); }));
    new Setting(container).setName("Migration and maintenance").setHeading();
    new Setting(container).addButton(button => button.setButtonText("Import/re-import legacy dashboard").onClick(() => void this.plugin.importLegacy()));
    new Setting(container).addButton(button => button.setButtonText("Reset layout").setWarning().onClick(() => void this.plugin.resetLayout()));
  }
}
