import assert from "node:assert/strict";
import {build} from "esbuild";
const result=await build({entryPoints:["src/main.ts"],bundle:true,write:false,platform:"node",format:"esm",loader:{".css":"text"},plugins:[{
  name:"obsidian-test-host",setup(b){
    b.onResolve({filter:/^obsidian$/},()=>({path:"obsidian",namespace:"stub"}));
    b.onLoad({filter:/.*/,namespace:"stub"},()=>({contents:`export class Plugin{};export class App{};export class Notice{};export class TFile{};export class WorkspaceLeaf{};export class ItemView{};export class Modal{};export class Setting{};export class PluginSettingTab{};export const Platform={};export const setIcon=()=>{};`}));
  }
}]});
const {default:Dashboard}=await import(`data:text/javascript;base64,${Buffer.from(result.outputFiles[0].text).toString("base64")}`);
const dashboard=new Dashboard();dashboard.refreshViews=async()=>{};
dashboard.registerNativeWidgets();
const initial=dashboard.getQuickActions().length;
const first={id:"weather/snapshot",name:"New Weather Snapshot",command:"red-beard-weather:new-snapshot"};
const removeFirst=dashboard.registerQuickAction(first);
assert.equal(dashboard.getQuickActions().length,initial+1);
const renderedButtons=[];
dashboard.widgets.get("quick-actions").render({}, {createDiv:()=>({createEl:(_tag,options)=>{renderedButtons.push(options.text);return {};}})});
assert(renderedButtons.includes(first.name),"New registrations must appear when the existing Quick Actions widget rerenders");
const second={...first,name:"Snapshot again"};const removeSecond=dashboard.registerQuickAction(second);
removeFirst();assert.equal(dashboard.getQuickActions().find(a=>a.id===first.id),second,"Old cleanup must not remove a newer registration");
dashboard.settings.quickActionVisibility[first.id]=false;dashboard.settings.quickActionOrder[first.id]=4;
removeSecond();assert.equal(dashboard.getQuickActions().length,initial);
assert.equal(dashboard.settings.quickActionVisibility[first.id],false);assert.equal(dashboard.settings.quickActionOrder[first.id],4);
const native=dashboard.getQuickActions()[0],removeOverride=dashboard.registerQuickAction({...native,name:"Override"});
assert.equal(dashboard.getQuickActions().filter(a=>a.id===native.id).length,1);
removeOverride();assert.equal(dashboard.getQuickActions().find(a=>a.id===native.id),native);
console.log("Extension registration, ownership, cleanup, and saved-preference tests passed.");
