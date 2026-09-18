import { App, Modal, Notice } from "obsidian";
import type RedBeardDashboard from "./main";
import type { CardHighlightStyle } from "./types";

type CardKind = "quick-actions" | "modules";
type ManagedEntry = { id:string; name:string; description?:string; flavor?:string; command?:string; enabled:boolean; style:CardHighlightStyle };

const STYLE_LABELS:Record<CardHighlightStyle,string>={default:"Standard",blue:"Blue highlight",red:"Red highlight",hollow:"Hollow"};

/** Mobile-safe manager for the two dashboard-owned launcher cards. */
export class DashboardCardManagerModal extends Modal {
  private entries:ManagedEntry[]=[];
  constructor(app:App,private plugin:RedBeardDashboard,private kind:CardKind){super(app);}

  onOpen(){
    this.modalEl.addClass("rbd-card-manager-modal");
    this.contentEl.empty();
    this.contentEl.addClass("rbd-card-manager-content");
    const title=this.kind==="quick-actions"?"Manage quick actions":"Manage dashboard modules";
    const intro=this.kind==="quick-actions"?"Choose which shortcuts appear, set their order, and give important actions a visual treatment.":"Choose which connected add-ons appear, set their order, and give important modules a visual treatment.";
    this.contentEl.createEl("h2",{text:title});
    this.contentEl.createEl("p",{cls:"rbd-card-manager-intro",text:intro});
    this.entries=this.readEntries();
    this.renderEntries();
    const footer=this.contentEl.createDiv({cls:"rbd-card-manager-footer"});
    const cancel=footer.createEl("button",{text:"Cancel"});cancel.onclick=()=>this.close();
    const save=footer.createEl("button",{text:"Save changes",cls:"mod-cta"});save.onclick=()=>void this.save();
  }

  onClose(){this.contentEl.empty();}

  private readEntries():ManagedEntry[]{
    if(this.kind==="quick-actions"){
      return this.plugin.getQuickActions().map((a,index)=>({id:a.id,name:a.name,description:a.description,command:a.command,enabled:this.plugin.settings.quickActionVisibility[a.id]!==false,style:this.plugin.settings.quickActionStyle[a.id]??(index===0?"blue":"default")})).sort((a,b)=>(this.plugin.settings.quickActionOrder[a.id]??99)-(this.plugin.settings.quickActionOrder[b.id]??99));
    }
    return this.plugin.getModules().map(m=>{const hasCustomFlavor=Object.prototype.hasOwnProperty.call(this.plugin.settings.moduleFlavor,m.id);return{id:m.id,name:m.name,description:m.description,flavor:hasCustomFlavor?this.plugin.settings.moduleFlavor[m.id]:m.description,command:m.command,enabled:this.plugin.isModuleEnabled(m.id),style:this.plugin.settings.moduleStyle[m.id]??"default"};}).sort((a,b)=>(this.plugin.settings.moduleOrder[a.id]??99)-(this.plugin.settings.moduleOrder[b.id]??99)||a.name.localeCompare(b.name));
  }

  private renderEntries(){
    this.contentEl.querySelector(".rbd-card-manager-list")?.remove();
    const list=this.contentEl.createDiv({cls:"rbd-card-manager-list"});
    if(!this.entries.length){list.createDiv({cls:"rbd-empty-state",text:this.kind==="modules"?"No connected modules are available.":"No quick actions are configured."});return;}
    this.entries.forEach((entry,index)=>{
      const row=list.createDiv({cls:"rbd-card-manager-row"});
      const check=row.createEl("input",{attr:{type:"checkbox","aria-label":`Show ${entry.name}`}});check.checked=entry.enabled;check.onchange=()=>{entry.enabled=check.checked;};
      const copy=row.createDiv({cls:"rbd-card-manager-copy"});copy.createDiv({cls:"rbd-card-manager-name",text:entry.name});if(entry.description)copy.createDiv({cls:"rbd-card-manager-description",text:entry.description});if(this.kind==="modules"){const flavor=copy.createEl("input",{cls:"rbd-card-manager-flavor",attr:{type:"text",placeholder:"Flavor text shown on the card",value:entry.flavor??"", "aria-label":`Flavor text for ${entry.name}`}});flavor.onchange=()=>{entry.flavor=flavor.value.trim();};}
      const style=row.createEl("select",{cls:"rbd-card-manager-style",attr:{"aria-label":`Style for ${entry.name}`}});for(const [value,label] of Object.entries(STYLE_LABELS)){const option=style.createEl("option",{text:label,value});if(value===entry.style)option.selected=true;}style.onchange=()=>{entry.style=style.value as CardHighlightStyle;};
      const move=row.createDiv({cls:"rbd-card-manager-order"});move.createSpan({cls:"rbd-card-manager-order-label",text:"Position"});const position=move.createEl("input",{type:"number",value:String(index+1),attr:{min:"1",max:String(this.entries.length),"aria-label":`Display position for ${entry.name}`}});position.onchange=()=>{const requested=Number(position.value);if(!Number.isFinite(requested))return;const next=Math.max(1,Math.min(this.entries.length,Math.round(requested)));const ordered=this.entries.filter(item=>item.id!==entry.id);ordered.splice(next-1,0,entry);this.entries=ordered;this.renderEntries();};
      const up=move.createEl("button",{text:"↑",attr:{"aria-label":`Move ${entry.name} up`}});up.disabled=index===0;up.onclick=()=>{if(index>0){[this.entries[index-1],this.entries[index]]=[this.entries[index],this.entries[index-1]];this.renderEntries();}};
      const down=move.createEl("button",{text:"↓",attr:{"aria-label":`Move ${entry.name} down`}});down.disabled=index===this.entries.length-1;down.onclick=()=>{if(index<this.entries.length-1){[this.entries[index+1],this.entries[index]]=[this.entries[index],this.entries[index+1]];this.renderEntries();}};
    });
  }

  private async save(){
    if(this.kind==="quick-actions")this.entries.forEach((entry,index)=>{this.plugin.settings.quickActionVisibility[entry.id]=entry.enabled;this.plugin.settings.quickActionOrder[entry.id]=index;this.plugin.settings.quickActionStyle[entry.id]=entry.style;});
    else this.entries.forEach((entry,index)=>{this.plugin.settings.moduleVisibility[entry.id]=entry.enabled;this.plugin.settings.moduleOrder[entry.id]=index+1;this.plugin.settings.moduleStyle[entry.id]=entry.style;this.plugin.settings.moduleFlavor[entry.id]=(entry.flavor??"").trim();});
    await this.plugin.saveSettings();
    await this.plugin.refreshViews();
    new Notice(`${this.kind==="quick-actions"?"Quick actions":"Modules"} updated.`);
    this.close();
  }
}
