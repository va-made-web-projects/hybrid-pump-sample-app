"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[9857],{9857:(E,u,c)=>{c.r(u),c.d(u,{ion_breadcrumb:()=>x,ion_breadcrumbs:()=>s});var o=c(1688),m=c(839),d=c(3567),f=c(3173),g=c(2085);const x=class{constructor(b){(0,o.r)(this,b),this.ionFocus=(0,o.d)(this,"ionFocus",7),this.ionBlur=(0,o.d)(this,"ionBlur",7),this.collapsedClick=(0,o.d)(this,"collapsedClick",7),this.inheritedAttributes={},this.onFocus=()=>{this.ionFocus.emit()},this.onBlur=()=>{this.ionBlur.emit()},this.collapsedIndicatorClick=()=>{this.collapsedClick.emit({ionShadowTarget:this.collapsedRef})},this.collapsed=!1,this.last=void 0,this.showCollapsedIndicator=void 0,this.color=void 0,this.active=!1,this.disabled=!1,this.download=void 0,this.href=void 0,this.rel=void 0,this.separator=void 0,this.target=void 0,this.routerDirection="forward",this.routerAnimation=void 0}componentWillLoad(){this.inheritedAttributes=(0,m.i)(this.el)}isClickable(){return void 0!==this.href}render(){const{color:b,active:l,collapsed:e,disabled:t,download:a,el:h,inheritedAttributes:r,last:p,routerAnimation:w,routerDirection:M,separator:z,showCollapsedIndicator:k,target:D}=this,_=this.isClickable(),B=void 0===this.href?"span":"a",I=t?void 0:this.href,A=(0,g.b)(this),O="span"===B?{}:{download:a,href:I,target:D},j=!p&&(e?!(!k||p):z);return(0,o.h)(o.H,{onClick:y=>(0,d.o)(I,y,M,w),"aria-disabled":t?"true":null,class:(0,d.c)(b,{[A]:!0,"breadcrumb-active":l,"breadcrumb-collapsed":e,"breadcrumb-disabled":t,"in-breadcrumbs-color":(0,d.h)("ion-breadcrumbs[color]",h),"in-toolbar":(0,d.h)("ion-toolbar",this.el),"in-toolbar-color":(0,d.h)("ion-toolbar[color]",this.el),"ion-activatable":_,"ion-focusable":_})},(0,o.h)(B,Object.assign({},O,{class:"breadcrumb-native",part:"native",disabled:t,onFocus:this.onFocus,onBlur:this.onBlur},r),(0,o.h)("slot",{name:"start"}),(0,o.h)("slot",null),(0,o.h)("slot",{name:"end"})),k&&(0,o.h)("button",{part:"collapsed-indicator","aria-label":"Show more breadcrumbs",onClick:()=>this.collapsedIndicatorClick(),ref:y=>this.collapsedRef=y,class:{"breadcrumbs-collapsed-indicator":!0}},(0,o.h)("ion-icon",{"aria-hidden":"true",icon:f.n,lazy:!1})),j&&(0,o.h)("span",{class:"breadcrumb-separator",part:"separator","aria-hidden":"true"},(0,o.h)("slot",{name:"separator"},"ios"===A?(0,o.h)("ion-icon",{icon:f.m,lazy:!1,"flip-rtl":!0}):(0,o.h)("span",null,"/"))))}get el(){return(0,o.f)(this)}};x.style={ios:":host{display:-ms-flexbox;display:flex;-ms-flex:0 0 auto;flex:0 0 auto;-ms-flex-align:center;align-items:center;color:var(--color);font-size:16px;font-weight:400;line-height:1.5}.breadcrumb-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;width:100%;outline:none;background:inherit}:host(.breadcrumb-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.breadcrumb-active){color:var(--color-active)}:host(.ion-focused){color:var(--color-focused)}:host(.ion-focused) .breadcrumb-native{background:var(--background-focused)}@media (any-hover: hover){:host(.ion-activatable:hover){color:var(--color-hover)}:host(.ion-activatable.in-breadcrumbs-color:hover),:host(.ion-activatable.ion-color:hover){color:var(--ion-color-shade)}}.breadcrumb-separator{display:-ms-inline-flexbox;display:inline-flex}:host(.breadcrumb-collapsed) .breadcrumb-native{display:none}:host(.in-breadcrumbs-color),:host(.in-breadcrumbs-color.breadcrumb-active){color:var(--ion-color-base)}:host(.in-breadcrumbs-color) .breadcrumb-separator{color:var(--ion-color-base)}:host(.ion-color){color:var(--ion-color-base)}:host(.in-toolbar-color),:host(.in-toolbar-color) .breadcrumb-separator{color:rgba(var(--ion-color-contrast-rgb), 0.8)}:host(.in-toolbar-color.breadcrumb-active){color:var(--ion-color-contrast)}.breadcrumbs-collapsed-indicator{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;-webkit-margin-start:14px;margin-inline-start:14px;-webkit-margin-end:14px;margin-inline-end:14px;margin-top:0;margin-bottom:0;display:-ms-flexbox;display:flex;-ms-flex:1 1 100%;flex:1 1 100%;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:32px;height:18px;border:0;outline:none;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}.breadcrumbs-collapsed-indicator ion-icon{margin-top:1px;font-size:22px}:host{--color:var(--ion-color-step-850, #2d4665);--color-active:var(--ion-text-color, #03060b);--color-hover:var(--ion-text-color, #03060b);--color-focused:var(--color-active);--background-focused:var(--ion-color-step-50, rgba(233, 237, 243, 0.7))}:host(.breadcrumb-active){font-weight:600}.breadcrumb-native{border-radius:4px;-webkit-padding-start:12px;padding-inline-start:12px;-webkit-padding-end:12px;padding-inline-end:12px;padding-top:5px;padding-bottom:5px;border:1px solid transparent}:host(.ion-focused) .breadcrumb-native{border-radius:8px}:host(.in-breadcrumbs-color.ion-focused) .breadcrumb-native,:host(.ion-color.ion-focused) .breadcrumb-native{background:rgba(var(--ion-color-base-rgb), 0.1);color:var(--ion-color-base)}:host(.ion-focused) ::slotted(ion-icon),:host(.in-breadcrumbs-color.ion-focused) ::slotted(ion-icon),:host(.ion-color.ion-focused) ::slotted(ion-icon){color:var(--ion-color-step-750, #445b78)}.breadcrumb-separator{color:var(--ion-color-step-550, #73849a)}::slotted(ion-icon){color:var(--ion-color-step-400, #92a0b3);font-size:18px}::slotted(ion-icon[slot=start]){-webkit-margin-end:8px;margin-inline-end:8px}::slotted(ion-icon[slot=end]){-webkit-margin-start:8px;margin-inline-start:8px}:host(.breadcrumb-active) ::slotted(ion-icon){color:var(--ion-color-step-850, #242d39)}.breadcrumbs-collapsed-indicator{border-radius:4px;background:var(--ion-color-step-100, #e9edf3);color:var(--ion-color-step-550, #73849a)}.breadcrumbs-collapsed-indicator:hover{opacity:0.45}.breadcrumbs-collapsed-indicator:focus{background:var(--ion-color-step-150, #d9e0ea)}",md:":host{display:-ms-flexbox;display:flex;-ms-flex:0 0 auto;flex:0 0 auto;-ms-flex-align:center;align-items:center;color:var(--color);font-size:16px;font-weight:400;line-height:1.5}.breadcrumb-native{font-family:inherit;font-size:inherit;font-style:inherit;font-weight:inherit;letter-spacing:inherit;text-decoration:inherit;text-indent:inherit;text-overflow:inherit;text-transform:inherit;text-align:inherit;white-space:inherit;color:inherit;padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;margin-left:0;margin-right:0;margin-top:0;margin-bottom:0;display:-ms-flexbox;display:flex;-ms-flex-align:center;align-items:center;width:100%;outline:none;background:inherit}:host(.breadcrumb-disabled){cursor:default;opacity:0.5;pointer-events:none}:host(.breadcrumb-active){color:var(--color-active)}:host(.ion-focused){color:var(--color-focused)}:host(.ion-focused) .breadcrumb-native{background:var(--background-focused)}@media (any-hover: hover){:host(.ion-activatable:hover){color:var(--color-hover)}:host(.ion-activatable.in-breadcrumbs-color:hover),:host(.ion-activatable.ion-color:hover){color:var(--ion-color-shade)}}.breadcrumb-separator{display:-ms-inline-flexbox;display:inline-flex}:host(.breadcrumb-collapsed) .breadcrumb-native{display:none}:host(.in-breadcrumbs-color),:host(.in-breadcrumbs-color.breadcrumb-active){color:var(--ion-color-base)}:host(.in-breadcrumbs-color) .breadcrumb-separator{color:var(--ion-color-base)}:host(.ion-color){color:var(--ion-color-base)}:host(.in-toolbar-color),:host(.in-toolbar-color) .breadcrumb-separator{color:rgba(var(--ion-color-contrast-rgb), 0.8)}:host(.in-toolbar-color.breadcrumb-active){color:var(--ion-color-contrast)}.breadcrumbs-collapsed-indicator{padding-left:0;padding-right:0;padding-top:0;padding-bottom:0;-webkit-margin-start:14px;margin-inline-start:14px;-webkit-margin-end:14px;margin-inline-end:14px;margin-top:0;margin-bottom:0;display:-ms-flexbox;display:flex;-ms-flex:1 1 100%;flex:1 1 100%;-ms-flex-align:center;align-items:center;-ms-flex-pack:center;justify-content:center;width:32px;height:18px;border:0;outline:none;cursor:pointer;-webkit-appearance:none;-moz-appearance:none;appearance:none}.breadcrumbs-collapsed-indicator ion-icon{margin-top:1px;font-size:22px}:host{--color:var(--ion-color-step-600, #677483);--color-active:var(--ion-text-color, #03060b);--color-hover:var(--ion-text-color, #03060b);--color-focused:var(--ion-color-step-800, #35404e);--background-focused:var(--ion-color-step-50, #fff)}:host(.breadcrumb-active){font-weight:500}.breadcrumb-native{-webkit-padding-start:12px;padding-inline-start:12px;-webkit-padding-end:12px;padding-inline-end:12px;padding-top:6px;padding-bottom:6px}.breadcrumb-separator{-webkit-margin-start:10px;margin-inline-start:10px;-webkit-margin-end:10px;margin-inline-end:10px;margin-top:-1px}:host(.ion-focused) .breadcrumb-native{border-radius:4px;-webkit-box-shadow:0px 1px 2px rgba(0, 0, 0, 0.2), 0px 2px 8px rgba(0, 0, 0, 0.12);box-shadow:0px 1px 2px rgba(0, 0, 0, 0.2), 0px 2px 8px rgba(0, 0, 0, 0.12)}.breadcrumb-separator{color:var(--ion-color-step-550, #73849a)}::slotted(ion-icon){color:var(--ion-color-step-550, #7d8894);font-size:18px}::slotted(ion-icon[slot=start]){-webkit-margin-end:8px;margin-inline-end:8px}::slotted(ion-icon[slot=end]){-webkit-margin-start:8px;margin-inline-start:8px}:host(.breadcrumb-active) ::slotted(ion-icon){color:var(--ion-color-step-850, #222d3a)}.breadcrumbs-collapsed-indicator{border-radius:2px;background:var(--ion-color-step-100, #eef1f3);color:var(--ion-color-step-550, #73849a)}.breadcrumbs-collapsed-indicator:hover{opacity:0.7}.breadcrumbs-collapsed-indicator:focus{background:var(--ion-color-step-150, #dfe5e8)}"};const s=class{constructor(b){(0,o.r)(this,b),this.ionCollapsedClick=(0,o.d)(this,"ionCollapsedClick",7),this.breadcrumbsInit=()=>{this.setBreadcrumbSeparator(),this.setMaxItems()},this.resetActiveBreadcrumb=()=>{const e=this.getBreadcrumbs().find(t=>t.active);e&&this.activeChanged&&(e.active=!1)},this.setMaxItems=()=>{const{itemsAfterCollapse:l,itemsBeforeCollapse:e,maxItems:t}=this,a=this.getBreadcrumbs();for(const r of a)r.showCollapsedIndicator=!1,r.collapsed=!1;void 0!==t&&a.length>t&&e+l<=t&&a.forEach((r,p)=>{p===e&&(r.showCollapsedIndicator=!0),p>=e&&p<a.length-l&&(r.collapsed=!0)})},this.setBreadcrumbSeparator=()=>{const{itemsAfterCollapse:l,itemsBeforeCollapse:e,maxItems:t}=this,a=this.getBreadcrumbs(),h=a.find(r=>r.active);for(const r of a){const p=void 0!==t&&0===l?r===a[e]:r===a[a.length-1];r.last=p,r.separator=void 0!==r.separator?r.separator:!p||void 0,!h&&p&&(r.active=!0,this.activeChanged=!0)}},this.getBreadcrumbs=()=>Array.from(this.el.querySelectorAll("ion-breadcrumb")),this.slotChanged=()=>{this.resetActiveBreadcrumb(),this.breadcrumbsInit()},this.collapsed=void 0,this.activeChanged=void 0,this.color=void 0,this.maxItems=void 0,this.itemsBeforeCollapse=1,this.itemsAfterCollapse=1}onCollapsedClick(b){const e=this.getBreadcrumbs().filter(t=>t.collapsed);this.ionCollapsedClick.emit(Object.assign(Object.assign({},b.detail),{collapsedBreadcrumbs:e}))}maxItemsChanged(){this.resetActiveBreadcrumb(),this.breadcrumbsInit()}componentWillLoad(){this.breadcrumbsInit()}render(){const{color:b,collapsed:l}=this,e=(0,g.b)(this);return(0,o.h)(o.H,{class:(0,d.c)(b,{[e]:!0,"in-toolbar":(0,d.h)("ion-toolbar",this.el),"in-toolbar-color":(0,d.h)("ion-toolbar[color]",this.el),"breadcrumbs-collapsed":l})},(0,o.h)("slot",{onSlotchange:this.slotChanged}))}get el(){return(0,o.f)(this)}static get watchers(){return{maxItems:["maxItemsChanged"],itemsBeforeCollapse:["maxItemsChanged"],itemsAfterCollapse:["maxItemsChanged"]}}};s.style={ios:":host{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center}:host(.in-toolbar-color),:host(.in-toolbar-color) .breadcrumbs-collapsed-indicator ion-icon{color:var(--ion-color-contrast)}:host(.in-toolbar-color) .breadcrumbs-collapsed-indicator{background:rgba(var(--ion-color-contrast-rgb), 0.11)}:host(.in-toolbar){-webkit-padding-start:20px;padding-inline-start:20px;-webkit-padding-end:20px;padding-inline-end:20px;padding-top:0;padding-bottom:0;-ms-flex-pack:center;justify-content:center}",md:":host{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;display:-ms-flexbox;display:flex;-ms-flex-wrap:wrap;flex-wrap:wrap;-ms-flex-align:center;align-items:center}:host(.in-toolbar-color),:host(.in-toolbar-color) .breadcrumbs-collapsed-indicator ion-icon{color:var(--ion-color-contrast)}:host(.in-toolbar-color) .breadcrumbs-collapsed-indicator{background:rgba(var(--ion-color-contrast-rgb), 0.11)}:host(.in-toolbar){-webkit-padding-start:8px;padding-inline-start:8px;-webkit-padding-end:8px;padding-inline-end:8px;padding-top:0;padding-bottom:0}"}},3567:(E,u,c)=>{c.d(u,{c:()=>f,g:()=>v,h:()=>d,o:()=>x});var m,o=c(5861);const d=(i,n)=>null!==n.closest(i),f=(i,n)=>"string"==typeof i&&i.length>0?Object.assign({"ion-color":!0,[`ion-color-${i}`]:!0},n):n,v=i=>{const n={};return(i=>void 0!==i?(Array.isArray(i)?i:i.split(" ")).filter(s=>null!=s).map(s=>s.trim()).filter(s=>""!==s):[])(i).forEach(s=>n[s]=!0),n},C=/^[a-z][a-z0-9+\-.]*:/,x=function(n,s,b,l){return(m=m||(0,o.Z)(function*(e,t,a,h){if(null!=e&&"#"!==e[0]&&!C.test(e)){const r=document.querySelector("ion-router");if(r)return null!=t&&t.preventDefault(),r.push(e,a,h)}return!1})).apply(this,arguments)}}}]);