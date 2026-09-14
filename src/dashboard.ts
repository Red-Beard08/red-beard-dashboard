import { ItemView, WorkspaceLeaf } from "obsidian";
import type RedBeardDashboard from "./main";
import type { DashboardWidgetDefinition, WidgetLayout } from "./types";
export class DashboardView extends ItemView {
  constructor(leaf:WorkspaceLeaf,private plugin:RedBeardDashboard){super(leaf);}
  getViewType(){return "red-beard-dashboard-view";} getDisplayText(){return "Red-Beard Dashboard";} getIcon(){return "layout-dashboard";}
  async onOpen(){await this.render();}
  async render(){const root=this.containerEl;root.empty();root.addClass("red-beard-dashboard");root.style.setProperty("--rbd-gap",`${this.plugin.settings.gap}px`);root.style.setProperty("--rbd-padding",`${this.plugin.settings.padding}px`);
    const hero=root.createDiv({cls:"rbd-hero"});hero.createDiv({cls:"rbd-eyebrow",text:"RED-BEARD · PERSONAL KNOWLEDGE VAULT"});hero.createEl("h1",{text:"Welcome home."});hero.createEl("p",{text:new Date().toLocaleDateString(undefined,{weekday:"long",month:"long",day:"numeric",year:"numeric"})});
    const toolbar=root.createDiv({cls:"rbd-toolbar"});this.btn(toolbar,this.plugin.editing?"Done editing":"Edit layout",()=>this.plugin.toggleEditor());this.btn(toolbar,"Refresh",()=>void this.plugin.refreshViews());this.btn(toolbar,"Legacy dashboard",()=>this.plugin.openNote(this.plugin.settings.legacyPath));this.btn(toolbar,"Settings",()=>this.plugin.openSettings());
    const grid=root.createDiv({cls:"rbd-grid"});const items=[...this.plugin.widgets.values()].sort((a,b)=>(this.plugin.layout[a.id]?.order??99)-(this.plugin.layout[b.id]?.order??99));
    for(const def of items){const l=this.plugin.layout[def.id]??this.plugin.layoutFor(def);if(l.visible===false)continue;const card=grid.createDiv({cls:"rbd-widget"});card.dataset.widgetId=def.id;card.style.setProperty("--rbd-x",String(l.x));card.style.setProperty("--rbd-w",String(l.w));card.style.setProperty("--rbd-mobile-w",String(l.mobileW));card.style.setProperty("--rbd-h",String(l.h));
      if(this.plugin.editing&&!l.locked)this.editor(card,def,l);
      const title=card.createDiv({cls:"rbd-widget-title"});title.createEl("span",{text:def.name});if(this.plugin.editing)this.controls(title,l);
      const body=card.createDiv({cls:"rbd-widget-body"});try{await def.render(this.plugin.context(),body);}catch(e){body.createEl("p",{cls:"rbd-error",text:`Widget unavailable: ${e instanceof Error?e.message:String(e)}`});}
    }
    if(!items.length)grid.createEl("p",{text:"No widgets are registered."});
  }
  private editor(card:HTMLElement,def:DashboardWidgetDefinition,l:WidgetLayout){card.addClass("rbd-editing");const handle=card.createDiv({cls:"rbd-drag-handle",text:"⋮⋮ Drag"});handle.draggable=true;handle.ondragstart=e=>{e.dataTransfer?.setData("text/plain",def.id);};card.ondragover=e=>{e.preventDefault();card.addClass("rbd-drop-target")};card.ondragleave=()=>card.removeClass("rbd-drop-target");card.ondrop=e=>{e.preventDefault();card.removeClass("rbd-drop-target");const from=e.dataTransfer?.getData("text/plain");if(from&&from!==def.id)void this.plugin.moveWidget(from,def.id,e.clientY<card.getBoundingClientRect().top+card.getBoundingClientRect().height/2?"top":"bottom");};}
  private controls(parent:HTMLElement,l:WidgetLayout){const c=parent.createDiv({cls:"rbd-widget-controls"});this.num(c,"W",l.w,1,12,v=>{l.w=v;void this.plugin.saveLayout()});this.num(c,"M",l.mobileW,1,12,v=>{l.mobileW=v;void this.plugin.saveLayout()});this.num(c,"H",l.h,1,8,v=>{l.h=v;void this.plugin.saveLayout()});this.btn(c,l.locked?"Unlock":"Lock",()=>{l.locked=!l.locked;void this.plugin.saveLayout()});}
  private num(p:HTMLElement,label:string,value:number,min:number,max:number,on:(v:number)=>void){const i=p.createEl("input",{type:"number",value:String(value),attr:{"aria-label":label,min:String(min),max:String(max)}});i.onchange=()=>on(Math.max(min,Math.min(max,Number(i.value)||value)));}
  private btn(p:HTMLElement,text:string,on:()=>void){const b=p.createEl("button",{text});b.onclick=on;}
  async onClose(){return Promise.resolve();}
}
