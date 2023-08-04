import{o as t,b as e,e as a,d as l,r as n,c as s,l as r,k as o,M as i,p as u,f as d,w as c,t as p,F as f,q as g,N as v,g as m,s as x,x as y,h as b,y as h,z as k,O as w,P as _,Q as F,R as S,S as j}from"./vendor.5101602c.js";import{M as T,i as C,u as E,C as M,a as z,R as V,f as B}from"./index.570d0ac5.js";import{_ as D,a as R}from"./chevron-down.ba5bc4fc.js";import{D as I,a as N,b as A,L as K,c as O,d as U,e as Y,S as q,f as L,g as P}from"./headlessui.esm.83123edc.js";import{_ as Q}from"./Spinner.ee5f11f6.js";const $={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},G=a("g",{fill:"none"},[a("path",{d:"M5 15l7-7l7 7",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})],-1);var H={render:function(a,l){return t(),e("svg",$,[G])}};const J=a("span",{class:"sr-only"},"Open menu",-1),W={class:"sticky top-0 overflow-y-auto overflow-x-hidden w-72 md:w-80 lg:custom-scroll sidebar-height"},X={class:"my-5 px-2 space-y-1 z-10"},Z={class:"pb-1"},tt={class:"text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center"},et={class:"sr-only"},at=m(" Docs settings "),lt=a("div",{class:"white"},"Select a version:",-1),nt={class:"relative mt-1"},st={class:"truncate"},rt={class:"truncate"},ot={class:"flex justify-between px-2"},it=m("Show privates"),ut={class:"text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center"},dt={class:"sr-only"},ct={class:"truncate"},pt={class:"truncate"},ft={class:"text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center"},gt={class:"sr-only"},vt=m(" Classes "),mt={class:"truncate"},xt={class:"text-gray-800 dark:text-gray-100 py-2 text-md font-bold uppercase flex gap-1 items-center"},yt={class:"sr-only"},bt=m(" Typedefs "),ht={class:"truncate"};var kt=l({expose:[],setup(l){var m,w,_,F,S;const j=h(),M=x(),z=E(),V=y(k).greater("lg"),B=n(!1),Q=n(),$=s((()=>z.state.sources)),G=s((()=>z.state.source)),kt=s((()=>z.state.tag)),wt=s((()=>z.state.docs)),_t=s((()=>z.state.branches.filter((t=>!["main","readme","docs","gh-pages","master"].includes(t))).sort(((t,e)=>{const a=Number(t.split(".").join(""));return Number(e.split(".").join(""))-a})))),Ft=s((()=>$.value.find((t=>M.params.source===t.id)))),St=n({source:null!=(w=null==(m=Ft.value)?void 0:m.source)?w:T,name:null!=(F=null==(_=Ft.value)?void 0:_.name)?F:T.name}),jt=n(null!=(S=M.params.tag)?S:T.defaultTag),Tt=s((()=>{var t,e;return C.value?null==(t=wt.value)?void 0:t.classes:null==(e=wt.value)?void 0:e.classes.filter((t=>"private"!==t.access))})),Ct=s((()=>{var t,e;return C.value?null==(t=wt.value)?void 0:t.typedefs:null==(e=wt.value)?void 0:e.typedefs.filter((t=>"private"!==t.access))}));return r(Q,(()=>B.value=!1)),o(V,(()=>B.value=!1),{immediate:!0}),i([St,jt],(async([t,e],[a,l])=>t!==a?(jt.value=t.source.defaultTag,j.push({name:"docs-source-tag-category-file",params:{source:t.source.id,tag:t.source.defaultTag,category:t.source.defaultFile.category,file:t.source.defaultFile.id}})):e!==l?j.push({name:"docs-source-tag-category-file",params:{source:t.source.id,tag:e,category:t.source.defaultFile.category,file:t.source.defaultFile.id}}):void 0)),(l,n)=>{var s,r,o;const i=D,m=R,x=H,y=b("router-link");return t(),e(f,null,[B.value?u("",!0):(t(),e("div",{key:0,class:["block fixed lg:hidden z-10 transition-transform transform-gpu",B.value?"translate-x-72 md:translate-x-80":null]},[a("button",{type:"button",class:"\n\t\t\t\trounded-md rounded-l-none rounded-tr-none\n\t\t\t\tp-3\n\t\t\t\tinline-flex\n\t\t\t\titems-center\n\t\t\t\tjustify-center\n\t\t\t\ttext-gray-200\n\t\t\t\tbg-discord-blurple-600\n\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\tfocus:outline-none focus:ring-2 focus:ring-inset focus:ring-white\n\t\t\t","aria-controls":"sidebar-menu","aria-expanded":B.value,onClick:n[1]||(n[1]=t=>B.value=!B.value)},[J,a(i,{class:["h-6 w-6",{hidden:B.value,block:!B.value}],"aria-hidden":"true"},null,8,["class"])],8,["aria-expanded"])],2)),a("div",{ref:Q,class:["inline-block fixed lg:block lg:relative z-10 sidebar-color transition transform-gpu",B.value?"translate-x-0":"-translate-x-full lg:translate-x-0"]},[a("div",W,[a("nav",X,[a("ul",null,[a("li",Z,[a(d(I),{"default-open":!0},{default:c((({open:l})=>[a(d(N),{class:"w-full focus:outline-none",tabindex:"-1"},{default:c((()=>[a("div",tt,[a("button",{class:"leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white","aria-expanded":l},[a("span",et,p(l?"Shrink":"Expand"),1),a(i,{class:["inline-block",{hidden:l}],"aria-hidden":"true"},null,8,["class"]),a(m,{class:["inline-block",{hidden:!l}],"aria-hidden":"true"},null,8,["class"])],8,["aria-expanded"]),at])])),_:2},1024),a(d(A),{as:"ul",class:"px-2 space-y-3"},{default:c((()=>[a("li",null,[lt,a(d(K),{modelValue:jt.value,"onUpdate:modelValue":n[2]||(n[2]=t=>jt.value=t)},{default:c((({open:l})=>[a("div",nt,[a(d(O),{class:"\n\t\t\t\t\t\t\t\t\t\t\t\t\trelative\n\t\t\t\t\t\t\t\t\t\t\t\t\tw-full\n\t\t\t\t\t\t\t\t\t\t\t\t\tpy-1\n\t\t\t\t\t\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext-left\n\t\t\t\t\t\t\t\t\t\t\t\t\tflex\n\t\t\t\t\t\t\t\t\t\t\t\t\tjustify-between\n\t\t\t\t\t\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:text-gray-200\n\t\t\t\t\t\t\t\t\t\t\t\t\trounded\n\t\t\t\t\t\t\t\t\t\t\t\t\tbg-gray-100\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:bg-[#1d1d1d]\n\t\t\t\t\t\t\t\t\t\t\t\t\tborder\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:border-[#101010]\n\t\t\t\t\t\t\t\t\t\t\t\t\tcursor-pointer\n\t\t\t\t\t\t\t\t\t\t\t\t"},{default:c((()=>[a("span",st,p(jt.value),1),l?u("",!0):(t(),e(m,{key:0})),l?(t(),e(x,{key:1})):u("",!0)])),_:2},1024),a(d(U),{class:"\n\t\t\t\t\t\t\t\t\t\t\t\t\tabsolute\n\t\t\t\t\t\t\t\t\t\t\t\t\tw-full\n\t\t\t\t\t\t\t\t\t\t\t\t\tmt-1\n\t\t\t\t\t\t\t\t\t\t\t\t\toverflow-auto\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext-base\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:text-white\n\t\t\t\t\t\t\t\t\t\t\t\t\tbg-gray-100\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:bg-[#1d1d1d]\n\t\t\t\t\t\t\t\t\t\t\t\t\trounded\n\t\t\t\t\t\t\t\t\t\t\t\t\tmax-h-60\n\t\t\t\t\t\t\t\t\t\t\t\t\tborder\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:border-[#101010]\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\t\t\t\tz-40\n\t\t\t\t\t\t\t\t\t\t\t\t\tlg:custom-scroll\n\t\t\t\t\t\t\t\t\t\t\t\t"},{default:c((()=>[(t(!0),e(f,null,g(d(_t),(l=>(t(),e(d(Y),{key:l,class:"cursor-default",value:l},{default:c((({active:t})=>[a("li",{class:["px-3 py-1",{"bg-discord-blurple-500 text-gray-200":t}]},[a("span",rt,p(l),1)],2)])),_:2},1032,["value"])))),128))])),_:1})])])),_:1},8,["modelValue"])]),a("li",null,[a(d(q),null,{default:c((()=>[a("div",ot,[a(d(L),{class:"mr-4 dark:text-gray-200"},{default:c((()=>[it])),_:1}),a(d(P),{modelValue:d(C),"onUpdate:modelValue":n[3]||(n[3]=t=>v(C)?C.value=t:null),class:["relative inline-flex h-6 items-center rounded-full w-11 focus:outline-none",d(C)?"bg-discord-red-500":"bg-gray-500"]},{default:c((()=>[a("span",{class:["inline-block w-4 h-4 bg-white rounded-full transition transform-gpu z-20",d(C)?"translate-x-6":"translate-x-1"]},null,2)])),_:1},8,["modelValue","class"])])])),_:1})])])),_:1})])),_:1})]),(t(!0),e(f,null,g(null==(s=d(wt))?void 0:s.custom,((l,s)=>(t(),e("li",{key:s},[a(d(I),{"default-open":!0},{default:c((({open:r})=>[a(d(N),{class:"w-full focus:outline-none",tabindex:"-1"},{default:c((()=>[a("div",ut,[a("button",{class:"leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white","aria-expanded":r},[a("span",dt,p(r?"Shrink":"Expand"),1),a(i,{class:["inline-block",{hidden:r}],"aria-hidden":"true"},null,8,["class"]),a(m,{class:["inline-block",{hidden:!r}],"aria-hidden":"true"},null,8,["class"])],8,["aria-expanded"]),a("span",ct,p(l.name),1)])])),_:2},1024),a(d(A),{as:"ul"},{default:c((()=>[(t(!0),e(f,null,g(l.files,((l,r)=>{var o;return t(),e("li",{key:r},[a(y,{to:{name:"docs-source-tag-category-file",params:{source:null==(o=d(G))?void 0:o.id,tag:d(kt),category:s,file:r}},class:"\n\t\t\t\t\t\t\t\t\t\t\ttext-gray-600\n\t\t\t\t\t\t\t\t\t\t\tdark:text-gray-300\n\t\t\t\t\t\t\t\t\t\t\tborder-l-4 border-transparent\n\t\t\t\t\t\t\t\t\t\t\trounded-sm\n\t\t\t\t\t\t\t\t\t\t\thover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800\n\t\t\t\t\t\t\t\t\t\t\tdark:hover:text-gray-100\n\t\t\t\t\t\t\t\t\t\t\tgroup\n\t\t\t\t\t\t\t\t\t\t\tflex\n\t\t\t\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t\t\t\t\t","exact-active-class":"border-l-4 border-discord-blurple-530 text-gray-900",onClick:n[4]||(n[4]=t=>B.value=!1)},{default:c((()=>[a("span",pt,p("object"==typeof l?l.name:l),1)])),_:2},1032,["to"])])})),128))])),_:2},1024)])),_:2},1024)])))),128)),(null==(r=d(Tt))?void 0:r.length)?(t(),e(d(I),{key:0,as:"li","default-open":!0},{default:c((({open:l})=>[a(d(N),{class:"w-full focus:outline-none",tabindex:"-1"},{default:c((()=>[a("div",ft,[a("button",{class:"leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white","aria-expanded":l},[a("span",gt,p(l?"Shrink":"Expand"),1),a(i,{class:["inline-block",{hidden:l}],"aria-hidden":"true"},null,8,["class"]),a(m,{class:["inline-block",{hidden:!l}],"aria-hidden":"true"},null,8,["class"])],8,["aria-expanded"]),vt])])),_:2},1024),a(d(A),{as:"ul"},{default:c((()=>[(t(!0),e(f,null,g(d(Tt),(l=>{var s;return t(),e("li",{key:l.name},[a(y,{exact:"",to:{name:"docs-source-tag-class-class",params:{source:null==(s=d(G))?void 0:s.id,tag:d(kt),class:l.name}},class:"\n\t\t\t\t\t\t\t\t\t\ttext-gray-600\n\t\t\t\t\t\t\t\t\t\tdark:text-gray-300\n\t\t\t\t\t\t\t\t\t\tborder-l-4 border-transparent\n\t\t\t\t\t\t\t\t\t\trounded-sm\n\t\t\t\t\t\t\t\t\t\thover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800\n\t\t\t\t\t\t\t\t\t\tdark:hover:text-gray-100\n\t\t\t\t\t\t\t\t\t\tgroup\n\t\t\t\t\t\t\t\t\t\tflex\n\t\t\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t\t\t\t","exact-active-class":"border-l-4 border-discord-blurple-530 text-gray-900",onClick:n[5]||(n[5]=t=>B.value=!1)},{default:c((()=>[a("span",mt,p(l.name),1)])),_:2},1032,["to"])])})),128))])),_:1})])),_:1})):u("",!0),(null==(o=d(Ct))?void 0:o.length)?(t(),e(d(I),{key:1,as:"li","default-open":!0},{default:c((({open:l})=>[a(d(N),{class:"w-full focus:outline-none",tabindex:"-1"},{default:c((()=>[a("div",xt,[a("button",{class:"leading-3 rounded-md p-1 focus:outline-none focus-visible:ring-1 focus-visible:ring-white","aria-expanded":l},[a("span",yt,p(l?"Shrink":"Expand"),1),a(i,{class:["inline-block",{hidden:l}],"aria-hidden":"true"},null,8,["class"]),a(m,{class:["inline-block",{hidden:!l}],"aria-hidden":"true"},null,8,["class"])],8,["aria-expanded"]),bt])])),_:2},1024),a(d(A),{as:"ul"},{default:c((()=>[(t(!0),e(f,null,g(d(Ct),(l=>{var s;return t(),e("li",{key:l.name},[a(y,{exact:"",to:{name:"docs-source-tag-typedef-typedef",params:{source:null==(s=d(G))?void 0:s.id,tag:d(kt),typedef:l.name}},class:"\n\t\t\t\t\t\t\t\t\t\ttext-gray-600\n\t\t\t\t\t\t\t\t\t\tdark:text-gray-300\n\t\t\t\t\t\t\t\t\t\tborder-l-4 border-transparent\n\t\t\t\t\t\t\t\t\t\trounded-sm\n\t\t\t\t\t\t\t\t\t\thover:border-l-4 hover:border-discord-blurple-500 hover:text-gray-800\n\t\t\t\t\t\t\t\t\t\tdark:hover:text-gray-100\n\t\t\t\t\t\t\t\t\t\tgroup\n\t\t\t\t\t\t\t\t\t\tflex\n\t\t\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t\t\t\t","exact-active-class":"border-l-4 border-discord-blurple-530 text-gray-900",onClick:n[6]||(n[6]=t=>B.value=!1)},{default:c((()=>[a("span",ht,p(l.name),1)])),_:2},1032,["to"])])})),128))])),_:1})])),_:1})):u("",!0)])])])],2)],64)}}});const wt={xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink",width:"1.2em",height:"1.2em",preserveAspectRatio:"xMidYMid meet",viewBox:"0 0 24 24"},_t=a("g",{fill:"none"},[a("path",{d:"M8 7l4-4m0 0l4 4m-4-4v18",stroke:"currentColor","stroke-width":"2","stroke-linecap":"round","stroke-linejoin":"round"})],-1);var Ft={render:function(a,l){return t(),e("svg",wt,[_t])}};const St={class:"fixed bottom-0 right-0 pb-4"},jt={class:"px-6 lg:px-8"};var Tt=l({expose:[],setup:l=>(l,n)=>{const s=Ft;return t(),e("div",St,[a("div",jt,[a("button",{class:"\n\t\t\t\t\tbg-discord-blurple-500\n\t\t\t\t\thover:bg-discord-blurple-530\n\t\t\t\t\tdark:hover:bg-discord-blurple-560\n\t\t\t\t\ttext-gray-200\n\t\t\t\t\thover:text-white\n\t\t\t\t\trounded-md\n\t\t\t\t\tp-2\n\t\t\t\t\tleading-3\n\t\t\t\t\tfocus:outline-none\n\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-gray-200\n\t\t\t\t",onClick:n[1]||(n[1]=t=>{return null==(e=document.getElementById("container"))?void 0:e.scrollTo({top:0,behavior:"smooth"});var e})},[a(s,{class:"h-6 w-6"})])])])}});const Ct={class:"lg:flex mx-auto w-full max-w-screen-2xl"},Et={key:1,class:"mx-auto py-16 sm:px-8 lg:py-8 w-full text-center dark:text-gray-200"},Mt=m(" Couldn't load the documentation data. ");var zt=l({expose:[],setup(l){const r=h(),i=x(),c=E(),{Ctrl_K:f}=w({passive:!1,onEventFired(t){t.ctrlKey&&"k"===t.key&&"keydown"===t.type&&t.preventDefault()}}),g=_({[T.id]:T,[M.id]:M,[z.id]:z,[V.id]:V}),v=n(!1),m=s((()=>c.state.source)),y=s((()=>c.state.tag)),k=s((()=>c.state.docs));F((()=>{const t=document.getElementById("container");S(t,"scroll",(()=>{t&&t.scrollTop>300?v.value=!0:v.value=!1}))})),o(f,(()=>{var t;null==(t=document.getElementById("search"))||t.focus()}));return j((()=>{(async()=>{var t,e,a,l,n,s,o,u,d,p,f,v,x,b,h,w,_,F,S,j;if("/"!==i.path)i.params.source&&i.params.tag&&((null==(t=k.value)?void 0:t.id)!==g[i.params.source].id||(null==(e=k.value)?void 0:e.tag)!==i.params.tag)&&(await c.dispatch({type:"fetchDocs",inputSource:null!=(a=g[i.params.source])?a:T,inputTag:null!=(l=i.params.tag)?l:y.value}),await c.dispatch({type:"fetchTags",currentSource:null!=(n=g[i.params.source])?n:T})),i.params.source&&g[i.params.source]?(c.commit({type:"setSource",source:g[i.params.source]}),i.params.tag?(c.commit({type:"setTag",tag:i.params.tag}),c.commit({type:"setSource",source:g[i.params.source]}),i.params.file||i.params.class||i.params.typedef||"docs-source-tag-search"===i.name||r.replace({name:"docs-source-tag-category-file",params:{source:null!=(h=null==(b=m.value)?void 0:b.id)?h:T.id,tag:null!=(w=y.value)?w:T.defaultTag,category:null!=(F=null==(_=m.value)?void 0:_.defaultFile.category)?F:T.defaultFile.category,file:null!=(j=null==(S=m.value)?void 0:S.defaultFile.id)?j:T.defaultFile.id}})):r.replace({name:"docs-source-tag-category-file",params:{source:null!=(o=null==(s=m.value)?void 0:s.id)?o:T.id,tag:(null==(u=m.value)?void 0:u.recentTag)||(null==(d=m.value)?void 0:d.defaultTag),category:null!=(f=null==(p=m.value)?void 0:p.defaultFile.category)?f:T.defaultFile.category,file:null!=(x=null==(v=m.value)?void 0:v.defaultFile.id)?x:T.defaultFile.id}})):r.replace({name:"docs-source-tag-category-file",params:{source:T.id,tag:T.defaultTag,category:T.defaultFile.category,file:T.defaultFile.id}})})()})),(l,n)=>{const s=b("router-view");return t(),e("div",null,[a("div",Ct,[a(kt),d(k)?(t(),e(s,{key:l.$route.path})):d(B)?(t(),e("div",Et,[Mt,a("pre",null,p(d(B).toString()),1)])):(t(),e(Q,{key:2}))]),v.value?(t(),e(Tt,{key:0})):u("",!0)])}}});export default zt;