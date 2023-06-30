var t;
import {C as e, r as s, c as o, a as n, u as a, d as r, o as l, b as i, e as c, t as d, f as p, g as u, h, w as m, i as g, j as b, k as v, l as f, m as w, v as y, n as x, p as k, F as S, q as _, T as j, s as C, x as R, y as M, z as O, A as G, B as T, D as z, E as I, G as W, H as D, I as U, J as E, K as J, L} from "./vendor.5101602c.js";
const $ = t=>{
    if (!t.ok)
        throw new Error("Failed to fetch documentation data. Choose another version or category.\nCannot see the existing documentation? Let me know on the Support Server, https://discord.gg/4pWKq8vUnb, I will help!");
    return t.json()
}
;
class N {
    constructor(t) {
        var e, s, o, n, a;
        this.options = t,
        this.id = this.options.id,
        this.name = this.options.name,
        this.global = this.options.global,
        this.repo = this.options.repo,
        this.defaultTag = null != (e = this.options.defaultTag) ? e : "master",
        this.defaultFile = null != (s = this.options.defaultFile) ? s : {
            category: "general",
            id: "welcome"
        },
        this.source = null != (o = this.options.source) ? o : `https://github.com/${this.repo}/blob/`,
        this.branchFilter = null != (n = this.options.branchFilter) ? n : t=>"master" !== t,
        this.tagFilter = null != (a = this.options.tagFilter) ? a : ()=>!0,
        this.tags = null,
        this.recentTag = null
    }
    fetchTags() {
        return this.tags ? Promise.resolve(this.tags) : Promise.all([fetch(`https://api.github.com/repos/${this.repo}/branches?per_page=100`).then($), fetch(`https://api.github.com/repos/${this.repo}/tags?per_page=100`).then($)]).catch((t=>{
            if (localStorage[`source-${this.id}`]) {
                console.error(t);
                const e = JSON.parse(localStorage[`source-${this.id}`]);
                return [e.branches, e.tags]
            }
            throw t
        }
        )).then((t=>{
            const [s,o] = t;
            this.tags = [this.defaultTag],
            localStorage[`source-${this.id}`] = JSON.stringify({
                branches: s,
                tags: o
            });
            for (const e of s)
                e.name !== this.defaultTag && this.branchFilter(e.name) && this.tags.push(e.name);
            const n = {};
            for (const a of o)
                if (e.valid(a.name)) {
                    const t = `${e.major(a.name)}.${e.minor(a.name)}`
                      , s = e.patch(a.name);
                    if (s < n[t])
                        continue;
                    n[t] = s
                }
            for (const a of o)
                if (a.name !== this.defaultTag && this.tagFilter(a.name)) {
                    if (e.valid(a.name)) {
                        const t = `${e.major(a.name)}.${e.minor(a.name)}`;
                        if (e.patch(a.name) < n[t])
                            continue
                    }
                    this.tags.push(a.name)
                }
            return this.tags
        }
        ))
    }
    async fetchDocs(t) {
        const e = await fetch(`https://raw.githubusercontent.com/${this.repo}/docs/${t}.json`);
        return $(e)
    }
}
const P = "shadowplay1/discord-giveaways-super";
fetch(`https://api.github.com/repos/${P}/branches?per_page=100`).then((t=>t.json())).then((t=>{
    const e = t.map((t=>t.name)).filter((t=>"main" !== t && "readme" !== t && "stable" !== t)).sort(((t,e)=>{
        const s = Number(t.split(".").join(""));
        return Number(e.split(".").join("")) - s
    }
    ))[0];
    document.cookie = `latestVersion=${e}; path=/`,
    localStorage.setItem("latestVersion", e)
}
));
const B = new Set(["docs", "webpack", "v8"]);
var A = new N({
    id: "main",
    name: "Main library",
    global: "Economy",
    repo: P,
    defaultTag: localStorage.latestVersion || (null == (t = document.cookie.split("; ").find((t=>t.includes("latestVersion=")))) ? void 0 : t.slice("latestVersion=".length)),
    branchFilter: t=>!B.has(t) && !t.startsWith("dependabot/"),
    tagFilter: t=>e.gte(t, "9.0.0")
});
const F = new Set(["docs"]);
var q = new N({
    id: "collection",
    name: "Collection",
    global: "Collection",
    repo: "discordjs/collection",
    defaultTag: "master",
    branchFilter: t=>!F.has(t) && !t.startsWith("dependabot/")
});
const V = new Set(["gh-pages", "docs"]);
var H = new N({
    id: "commando",
    name: "Commando",
    global: "Commando",
    repo: "discordjs/Commando",
    branchFilter: t=>!V.has(t) && !t.startsWith("dependabot/"),
    tagFilter: t=>e.gt(t.replace(/^v/, ""), "0.4.1")
})
  , K = new N({
    id: "rpc",
    name: "RPC",
    global: "RPC",
    repo: "discordjs/RPC",
    defaultTag: "master",
    branchFilter: t=>"docs" !== t && !t.includes("greenkeeper"),
    tagFilter: t=>e.gte(t.replace(/^v/, ""), "3.0.0")
});
const Y = s(!1);
class Z {
    constructor(t, e) {
        this.name = t.toLowerCase(),
        this.related = new Set([e])
    }
    addRelated(t) {
        this.related.add(t)
    }
    matches(t) {
        return t.includes(this.name)
    }
}
var Q, X;
(X = Q || (Q = {}))[X.Class = 0] = "Class",
X[X.Method = 1] = "Method",
X[X.Property = 2] = "Property",
X[X.Events = 3] = "Events",
X[X.Typedefs = 4] = "Typedefs";
class tt {
    constructor(t, e, s, o, n, a) {
        switch (this.name = t,
        this.type = e,
        this.parentName = s,
        this.parentType = o,
        this.access = n,
        this.scope = a,
        e) {
        case 0:
        case 4:
            this.computedName = t;
            break;
        case 1:
            this.computedName = `${null != s ? s : ""}.${t}()`;
            break;
        case 2:
            this.computedName = `${null != s ? s : ""}.${t}`;
            break;
        case 3:
            this.computedName = `${null != s ? s : ""}#${t}`
        }
        this.nameLowerCase = t.toLowerCase(),
        this.cleanedComputedName = this.computedName.replace(/[().#]/, "").toLowerCase()
    }
    get isPriority() {
        return 0 === this.type || 4 === this.type
    }
    getLinkPath() {
        var t, e;
        if (4 === this.type || 4 === this.parentType)
            return {
                name: "docs-source-tag-typedef-typedef",
                params: {
                    typedef: null != (t = this.parentName) ? t : this.name
                }
            };
        const s = {
            name: "docs-source-tag-class-class",
            params: {
                class: null != (e = this.parentName) ? e : this.name
            }
        };
        return 1 !== this.type && 2 !== this.type || (s.query = {
            scrollTo: this.name
        }),
        3 === this.type && (s.query = {
            scrollTo: `e-${this.name}`
        }),
        s
    }
}
const et = o((()=>rt.state.searchIndex))
  , st = o((()=>rt.state.searchRef));
function ot(t) {
    const e = t.replace(/[\s().#]/g, "").toLowerCase();
    if ("" === e)
        return [];
    let s = et.value.reduce(((t,s)=>{
        if (e.includes(s.name))
            for (const e of s.related)
                t[e] ? t[e]++ : t[e] = 1;
        return t
    }
    ), {});
    0 === Object.keys(s).length && e.length < 10 && (s = et.value.reduce(((t,s)=>{
        if (s.name.includes(e))
            for (const e of s.related)
                t[e] ? t[e]++ : t[e] = 1;
        return t
    }
    ), {}));
    return Object.entries(s).map((([t,e])=>[st.value[parseInt(t, 10)], e])).filter((([t])=>"private" !== t.access || Y.value)).sort((([t,s],[o,n])=>{
        let a = 0;
        return t.nameLowerCase === e ? a += t.isPriority ? -10 : -4 : o.nameLowerCase === e && (a += o.isPriority ? 10 : 4),
        e.length > 7 && (t.cleanedComputedName.includes(e) && (a -= 30),
        o.cleanedComputedName.includes(e) && (a += 30)),
        s === n && (t.isPriority && (a -= 6),
        o.isPriority && (a += 6),
        s > 1 && (a += Math.abs(e.length - t.computedName.length) - Math.abs(e.length - o.computedName.length))),
        n - s + a
    }
    )).map((([t,e])=>t))
}
const nt = s(null)
  , at = Symbol("docs")
  , rt = n({
    state: {
        sources: [{
            source: A,
            name: A.name,
            id: A.id
        }, {
            source: q,
            name: q.name,
            id: q.id
        }, {
            source: H,
            name: H.name,
            id: H.id
        }, {
            source: K,
            name: K.name,
            id: K.id
        }],
        source: A,
        tag: A.defaultTag,
        docs: null,
        branches: [],
        file: null,
        stats: {
            downloads: `${(0).toLocaleString()}`,
            weeklyDownloads: `${(0).toLocaleString()}`,
            stars: `${(0).toLocaleString()}`,
            contributors: `${1..toLocaleString()}`
        },
        searchIndex: [],
        searchRef: []
    },
    mutations: {
        setSource(t, {source: e}) {
            t.source = e
        },
        setTag(t, {tag: e}) {
            t.tag = e
        },
        setDocs(t, {docs: e}) {
            t.docs = e
        },
        setBranches(t, {branches: e}) {
            t.branches = e
        },
        setFile(t, {file: e}) {
            t.file = e
        },
        setStats(t, {stats: e}) {
            t.stats = e
        },
        setSearchIndex(t, {searchIndex: e, searchRef: s}) {
            t.searchIndex = e,
            t.searchRef = s
        }
    },
    actions: {
        fetchStats: async({commit: t})=>{
            var e, s, o, n;
            let a = 0
              , r = 0
              , l = 0
              , i = 0;
            const c = t=>t.json()
              , d = ()=>{}
              , [p,u,h] = await Promise.all([fetch("https://api.npmjs.org/downloads/range/2021-03-01:2100-08-21/discord-giveaways-super").then(c, d), fetch("https://api.github.com/repos/shadowplay1/discord-giveaways-super").then(c, d).catch(console.error), fetch("https://api.github.com/repos/shadowplay1/discord-giveaways-super/stats/contributors").then(c, d).catch(console.error)]);
            if (p) {
                a = 0;
                for (const t of p.downloads || [])
                    a += t.downloads;
                r = null == (n = null == (o = null == (s = null == (e = p.downloads) ? void 0 : e.map((t=>t.downloads))) ? void 0 : s.filter((t=>0 !== t))) ? void 0 : o.slice(-7)) ? void 0 : n.reduce(((t,e)=>t + e))
            }
            u && (l = u.stargazers_count),
            h && (i = h.length),
            t({
                type: "setStats",
                stats: {
                    downloads: `${a.toLocaleString()}`,
                    weeklyDownloads: `${(null == r ? void 0 : r.toLocaleString()) || 0}`,
                    stars: `${(null == l ? void 0 : l.toLocaleString()) || 0}`,
                    contributors: `${(null == i ? void 0 : i.toLocaleString()) || 1}`
                }
            })
        }
        ,
        fetchDocs: async({commit: t},{inputSource: e, inputTag: s=e.defaultTag})=>{
            var o, n, a, r;
            let l;
            try {
                l = await e.fetchDocs(s)
            } catch (u) {
                return t({
                    type: "setDocs",
                    docs: null
                }),
                t({
                    type: "setTag",
                    docs: null
                }),
                void (nt.value = u)
            }
            const i = []
              , c = [];
            let d = 0;
            const p = (t,e,s,o,n,a)=>{
                const r = function(t) {
                    var e;
                    return null != (e = t.match(/(([A-Z]{2,})(?=[A-Z]))|[A-Z][a-z]+|[a-z]+/g)) ? e : []
                }(t)
                  , l = new tt(t,e,s,o,n,a);
                i.push(l);
                const p = [];
                for (const i of r) {
                    const t = i.toLowerCase();
                    let e = c.findIndex((e=>e.name === t));
                    e > -1 ? c[e].addRelated(d) : e = c.push(new Z(t,d)) - 1,
                    p.push(e)
                }
                return d += 1,
                p
            }
            ;
            for (const h of l.classes) {
                const t = p(h.name, Q.Class, void 0, void 0, h.access, h.scope)
                  , e = [];
                for (const s of null != (o = h.methods) ? o : [])
                    p(s.name, Q.Method, h.name, Q.Class, s.access, s.scope),
                    e.push(d - 1);
                for (const s of null != (n = h.props) ? n : [])
                    p(s.name, Q.Property, h.name, Q.Class, s.access, s.scope),
                    e.push(d - 1);
                for (const s of null != (a = h.events) ? a : [])
                    p(s.name, Q.Events, h.name, Q.Class, s.access, s.scope),
                    e.push(d - 1);
                for (const s of t)
                    for (const t of e)
                        c[s].related.add(t)
            }
            for (const h of l.typedefs) {
                const t = p(h.name, Q.Typedefs, void 0, void 0, h.access, h.scope)
                  , e = [];
                for (const s of null != (r = h.props) ? r : [])
                    p(s.name, Q.Property, h.name, Q.Typedefs, s.access, s.scope),
                    e.push(d - 1);
                for (const s of t)
                    for (const t of e)
                        c[s].related.add(t)
            }
            t({
                type: "setSearchIndex",
                searchIndex: c,
                searchRef: i
            }),
            l.classes.sort(((t,e)=>t.name.localeCompare(e.name))),
            l.typedefs.sort(((t,e)=>t.name.localeCompare(e.name)));
            for (const h of l.classes)
                h.props && h.props.sort(((t,e)=>t.name.localeCompare(e.name))),
                h.methods && h.methods.sort(((t,e)=>t.name.localeCompare(e.name))),
                h.events && h.events.sort(((t,e)=>t.name.localeCompare(e.name)));
            l.links = {
                String: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
                string: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String",
                Number: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
                number: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number",
                BigInt: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt",
                Boolean: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
                boolean: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
                true: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
                false: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Boolean",
                Symbol: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol",
                Void: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
                void: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
                undefined: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
                Undefined: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/undefined",
                null: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null",
                Null: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/null",
                Object: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
                object: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object",
                Function: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function",
                function: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function",
                Array: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array",
                Set: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set",
                Map: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Map",
                Date: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date",
                RegExp: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp",
                Promise: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise",
                Error: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error",
                EventEmitter: "https://nodejs.org/dist/latest/docs/api/events.html#events_class_eventemitter",
                Timeout: "https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_timeout",
                Immediate: "https://nodejs.org/dist/latest/docs/api/timers.html#timers_class_immediate",
                Buffer: "https://nodejs.org/dist/latest/docs/api/buffer.html#buffer_class_buffer",
                ReadableStream: "https://nodejs.org/dist/latest/docs/api/stream.html#stream_class_stream_readable",
                ChildProcess: "https://nodejs.org/dist/latest/docs/api/child_process.html#child_process_class_childprocess",
                Worker: "https://nodejs.org/api/worker_threads.html#worker_threads_class_worker",
                MessagePort: "https://nodejs.org/api/worker_threads.html#worker_threads_class_messageport",
                any: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any",
                unknown: "https://www.typescriptlang.org/docs/handbook/2/functions.html#unknown",
                readonly: "https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype",
                Readonly: "https://www.typescriptlang.org/docs/handbook/utility-types.html#readonlytype",
                Record: "https://www.typescriptlang.org/docs/handbook/utility-types.html#recordkeys-type",
                Exclude: "https://www.typescriptlang.org/docs/handbook/utility-types.html#excludetype-excludedunion",
                Omit: "https://www.typescriptlang.org/docs/handbook/utility-types.html#omittype-keys",
                IterableIterator: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols",
                Partial: "https://www.typescriptlang.org/docs/handbook/utility-types.html#partialtype",
                Client: "https://old.discordjs.dev/#/docs/discord.js/main/class/Client",
                GatewayIntentBits: "https://discord-api-types.dev/api/discord-api-types-v10/enum/GatewayIntentBits",
                IntentsBitField: "https://old.discordjs.dev/#/docs/discord.js/main/class/IntentsBitField",
                TextChannel: "https://old.discordjs.dev/#/docs/discord.js/main/class/TextChannel",
                User: "https://old.discordjs.dev/#/docs/discord.js/main/class/User",
                Guild: "https://old.discordjs.dev/#/docs/discord.js/main/class/Guild",
                ButtonStyle: "https://discord-api-types.dev/api/discord-api-types-v10/enum/ButtonStyle",
                ColorResolvable: "https://old.discordjs.dev/#/docs/discord.js/main/typedef/ColorResolvable",
                IMongoConnectionOptions: "https://www.npmjs.com/package/quick-mongo-super#examples",
                EnmapOptions: "https://enmap.evie.dev/api/#new-enmapiterable-options",
                Mongo: "https://www.npmjs.com/package/quick-mongo-super",
                Enmap: "https://www.npmjs.com/package/enmap"
            },
            l.externals = l.externals || [],
            l.classes = l.classes || [],
            l.typedefs = l.typedefs || [];
            for (const h of l.externals)
                l.links[h.name] = h.see[0].replace(/\{@link\s+(.+?)\s*\}/i, "$1");
            for (const h of l.classes)
                l.links[h.name] = {
                    name: "docs-source-tag-class-class",
                    params: {
                        class: h.name
                    }
                };
            for (const h of l.typedefs)
                l.links[h.name] = {
                    name: "docs-source-tag-typedef-typedef",
                    params: {
                        typedef: h.name
                    }
                };
            "commando" === e.id && (l.links.Message = {
                name: "docs-source-tag-class-class",
                params: {
                    source: "main",
                    tag: "master",
                    class: "Message"
                }
            }),
            console.log({
                documentation: l
            }),
            l.global = e.global,
            l.source = e.source,
            l.id = e.id,
            l.tag = s,
            t({
                type: "setDocs",
                docs: l
            })
        }
        ,
        fetchTags: async({commit: t},{currentSource: e})=>{
            t({
                type: "setBranches",
                branches: await e.fetchTags()
            })
        }
    }
});
function lt() {
    return a(at)
}
const it = u(" downloads ")
  , ct = u(" weekly downloads ")
  , dt = u(" stars ")
  , pt = u(" contributors ");
var ut = r({
    expose: [],
    setup(t) {
        const e = lt()
          , s = o((()=>e.state.stats.downloads))
          , n = o((()=>e.state.stats.weeklyDownloads))
          , a = o((()=>e.state.stats.stars))
          , r = o((()=>e.state.stats.contributors));
        return (t,e)=>(l(),
        i("ul", null, [c("li", null, [c("b", null, d(p(s)), 1), it]), c("li", null, [c("b", null, d(p(n)), 1), ct]), c("li", null, [c("b", null, d(p(a)), 1), dt]), c("li", null, [c("b", null, d(p(r)), 1), pt])]))
    }
});
const ht = {}
  , mt = {
    class: "bg-discord-blurple-560"
}
  , gt = {
    class: "max-w-3xl mx-auto text-center px-16 pt-10 pb-4 text-gray-200"
}
  , bt = u("discord-giveaways-super")
  , vt = c("p", {
    class: "mb-4"
}, "Create and manage giveaways in Discord.", -1);
ht.render = function(t, e) {
    const s = h("router-link")
      , o = ut;
    return l(),
    i("footer", mt, [c("div", gt, [c("strong", null, [c(s, {
        to: "/"
    }, {
        default: m((()=>[bt])),
        _: 1
    })]), vt, c(o, {
        class: "mb-4"
    })])])
}
;
const ft = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , wt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 1 1-8 0a4 4 0 0 1 8 0z",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var yt = {
    render: function(t, e) {
        return l(),
        i("svg", ft, [wt])
    }
};
const xt = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , kt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M20.354 15.354A9 9 0 0 1 8.646 3.646A9.003 9.003 0 0 0 12 21a9.003 9.003 0 0 0 8.354-5.646z",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var St = {
    render: function(t, e) {
        return l(),
        i("svg", xt, [kt])
    }
};
const _t = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , jt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M21 21l-6-6m2-5a7 7 0 1 1-14 0a7 7 0 0 1 14 0z",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Ct = {
    render: function(t, e) {
        return l(),
        i("svg", _t, [jt])
    }
};
const Rt = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , Mt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M14 5l7 7m0 0l-7 7m7-7H3",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Ot = {
    render: function(t, e) {
        return l(),
        i("svg", Rt, [Mt])
    }
};
const Gt = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , Tt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M4 6h16M4 12h16M4 18h16",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var zt = {
    render: function(t, e) {
        return l(),
        i("svg", Gt, [Tt])
    }
};
const It = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , Wt = c("g", {
    fill: "none"
}, [c("path", {
    d: "M6 18L18 6M6 6l12 12",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Dt = {
    render: function(t, e) {
        return l(),
        i("svg", It, [Wt])
    }
};
const Ut = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , Et = c("g", {
    fill: "none"
}, [c("path", {
    d: "M10 6H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4M14 4h6m0 0v6m0-6L10 14",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Jt = {
    render: function(t, e) {
        return l(),
        i("svg", Ut, [Et])
    }
};
const Lt = g({
    storageKey: "theme"
})
  , $t = b(Lt)
  , Nt = {
    class: "sticky top-0 z-20"
}
  , Pt = {
    class: "bg-discord-blurple-560"
}
  , Bt = {
    class: "max-w-7xl mx-auto px-2 sm:px-4 md:flex md:justify-between lg:px-8"
}
  , At = {
    class: "hidden md:flex md:py-2 md:space-x-4 lg:space-x-8",
    "aria-label": "Global navigation"
}
  , Ft = u(" discord-giveaways-super ")
  , qt = u(" Documentation ")
  , Vt = {
    class: "relative h-16 flex md:max-w-md md:w-full lg:max-w-lg"
}
  , Ht = {
    class: "relative z-10 flex items-center md:hidden"
}
  , Kt = {
    class: "relative z-0 flex-1 px-2 flex lg:gap-2 items-center justify-center md:justify-end"
}
  , Yt = c("label", {
    for: "search",
    class: "sr-only"
}, "Search", -1)
  , Zt = {
    class: "relative"
}
  , Qt = {
    class: "pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center",
    "aria-hidden": "true"
}
  , Xt = {
    class: "relative z-10 flex items-center md:hidden"
}
  , te = c("span", {
    class: "sr-only"
}, "Open menu", -1)
  , ee = {
    key: 0,
    id: "mobile-menu",
    class: "md:hidden",
    "aria-label": "Global navigation"
}
  , se = {
    class: "pt-2 pb-3 px-2 space-y-1"
}
  , oe = u("discord-giveaways-super")
  , ne = u("Documentation")
  , ae = c("span", {
    class: "mr-2"
}, "Github", -1);
var re = r({
    expose: [],
    setup(t) {
        const e = M()
          , n = C()
          , a = R(O).greater("md")
          , r = s(!1)
          , g = s()
          , b = s("")
          , G = s(!1)
          , T = s(-1)
          , z = "shadowplay1/discord-giveaways-super"
          , I = o((()=>(T.value = -1,
        ot(b.value).slice(0, 7))))
          , W = ()=>{
            if (I.value.length)
                return G.value = !1,
                T.value >= 0 ? (e.push(I.value[T.value].getLinkPath()),
                void (T.value = -1)) : e.push({
                    name: "docs-source-tag-search",
                    query: {
                        query: b.value
                    }
                })
        }
          , D = t=>{
            T.value += 1,
            T.value > Math.min(6, I.value.length - 1) && (T.value = 0),
            t.preventDefault()
        }
          , U = t=>{
            T.value -= 1,
            T.value < 0 && (T.value = Math.min(6, I.value.length - 1)),
            t.preventDefault()
        }
          , E = t=>{
            if (!t.target)
                return;
            const e = t.target.getAttribute("data-index");
            e && (T.value = parseInt(e, 10))
        }
        ;
        return v(a, (()=>r.value = !1)),
        f(g, (()=>{
            G.value = !1,
            T.value = -1
        }
        )),
        (t,e)=>{
            const s = h("router-link")
              , o = yt
              , a = St
              , v = Ct
              , f = Ot
              , C = zt
              , R = Dt
              , M = Jt;
            return l(),
            i("div", Nt, [c("header", Pt, [c("div", Bt, [c("nav", At, [c(s, {
                to: "/",
                class: "\n\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t",
                "active-class": "bg-discord-blurple-600"
            }, {
                default: m((()=>[Ft])),
                _: 1
            }), c(s, {
                to: "/docs",
                class: "\n\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t",
                "active-class": "bg-discord-blurple-600"
            }, {
                default: m((()=>[qt])),
                _: 1
            }), c("a", {
                href: `https://github.com/${z}`,
                class: "\n\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t",
                target: "_blank",
                rel: "noopener"
            }, " GitHub ", 8, ["href"]), c("a", {
                href: "https://discord.gg/4pWKq8vUnb",
                class: "\n\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t",
                target: "_blank",
                rel: "noopener"
            }, " Support Server ", 8, ["href"])]), c("div", Vt, [c("div", Ht, [c("button", {
                class: "\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tp-2\n\t\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\tjustify-center\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630\n\t\t\t\t\t\t\t\tfocus:outline-none focus:ring-2 focus:ring-inset focus:ring-white focus:bg-discord-blurple-630\n\t\t\t\t\t\t\t",
                "aria-label": "Switch to " + (p(Lt) ? "light theme" : "dark theme"),
                onClick: e[1] || (e[1] = t=>p($t)())
            }, [p(Lt) ? (l(),
            i(a, {
                key: 1,
                class: "fill-current text-gray-200 hover:text-white h-6 w-6",
                "aria-hidden": "true"
            })) : (l(),
            i(o, {
                key: 0,
                class: "fill-current text-gray-200 hover:text-white h-6 w-6",
                "aria-hidden": "true"
            }))], 8, ["aria-label"])]), c("div", Kt, [c("button", {
                class: "\n\t\t\t\t\t\t\t\thidden\n\t\t\t\t\t\t\t\tmd:block\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tp-2\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630\n\t\t\t\t\t\t\t\tfocus:outline-none focus:ring-1 focus:ring-inset focus:ring-white\n\t\t\t\t\t\t\t",
                "aria-label": "Switch to " + (p(Lt) ? "light theme" : "dark theme"),
                onClick: e[2] || (e[2] = t=>p($t)())
            }, [p(Lt) ? (l(),
            i(a, {
                key: 1,
                class: "fill-current text-gray-200 hover:text-white h-6 w-6",
                "aria-hidden": "true"
            })) : (l(),
            i(o, {
                key: 0,
                class: "fill-current text-gray-200 hover:text-white h-6 w-6",
                "aria-hidden": "true"
            }))], 8, ["aria-label"]), "/" !== p(n).path ? (l(),
            i("div", {
                key: 0,
                ref: g,
                class: "w-full sm:max-w-lg lg:max-w-xs"
            }, [Yt, c("div", Zt, [c("div", Qt, [c(v, {
                class: "h-5 w-5 text-gray-200"
            })]), w(c("input", {
                id: "search",
                "onUpdate:modelValue": e[3] || (e[3] = t=>b.value = t),
                name: "search",
                class: "\n\t\t\t\t\t\t\t\t\t\tblock\n\t\t\t\t\t\t\t\t\t\tw-full\n\t\t\t\t\t\t\t\t\t\tbg-discord-blurple-600\n\t\t\t\t\t\t\t\t\t\tborder border-transparent\n\t\t\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\t\t\tpl-10\n\t\t\t\t\t\t\t\t\t\tpr-3\n\t\t\t\t\t\t\t\t\t\ttext-base text-white\n\t\t\t\t\t\t\t\t\t\tplaceholder-gray-200\n\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\tfocus:bg-discord-blurple-630\n\t\t\t\t\t\t\t\t\t\tfocus:text-gray-200\n\t\t\t\t\t\t\t\t\t\tfocus:placeholder-gray-200\n\t\t\t\t\t\t\t\t\t\tfocus:ring-2\n\t\t\t\t\t\t\t\t\t\tfocus:ring-inset\n\t\t\t\t\t\t\t\t\t\tfocus:ring-white\n\t\t\t\t\t\t\t\t\t\tlg:focus:ring-1\n\t\t\t\t\t\t\t\t\t",
                placeholder: "Search",
                type: "search",
                autocomplete: "off",
                autocapitalize: "off",
                autocorrect: "off",
                onFocus: e[4] || (e[4] = t=>G.value = !0),
                onInput: e[5] || (e[5] = t=>G.value = !0),
                onKeyup: x(W, ["enter"]),
                onKeydown: [x(U, ["up"]), x(D, ["down"])]
            }, null, 40, ["onKeyup", "onKeydown"]), [[y, b.value]]), G.value && b.value && p(I).length ? (l(),
            i("div", {
                key: 0,
                class: "absolute cursor-pointer inset-y-0 right-0 pr-3 flex items-center",
                "aria-hidden": "true",
                onClick: W
            }, [c(f, {
                class: "h-5 w-5 text-gray-200"
            })])) : k("", !0), G.value && b.value && p(I).length ? (l(),
            i("div", {
                key: 1,
                class: "absolute mt-1 w-full break-words-legacy border bg-discord-blurple-600 rounded-md",
                onMouseover: E
            }, [c("ul", null, [(l(!0),
            i(S, null, _(p(I), ((t,o)=>(l(),
            i("li", {
                key: t.computedName,
                class: ["\n\t\t\t\t\t\t\t\t\t\t\t\teven:bg-discord-blurple-560\n\t\t\t\t\t\t\t\t\t\t\t\tdark:even:bg-discord-blurple-630\n\t\t\t\t\t\t\t\t\t\t\t\thover:bg-discord-blurple-630\n\t\t\t\t\t\t\t\t\t\t\t\tdark:hover:bg-discord-blurple-660\n\t\t\t\t\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\t\t\t\t", {
                    "ring-1 ring-gray-200 even:bg-discord-blurple-630 dark:even:bg-discord-blurple-660 bg-discord-blurple-630 dark:bg-discord-blurple-660": o === T.value
                }]
            }, [c(s, {
                class: "\n\t\t\t\t\t\t\t\t\t\t\t\t\tblock\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\t\t\t\t\t\tpy-3\n\t\t\t\t\t\t\t\t\t\t\t\t\tpx-4\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus-visible:ring-1\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus-visible:ring-gray-200\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus-visible:rounded-md\n\t\t\t\t\t\t\t\t\t\t\t\t\tfocus-visible:bg-discord-blurple-630\n\t\t\t\t\t\t\t\t\t\t\t\t\tdark:focus-visible:bg-discord-blurple-660\n\t\t\t\t\t\t\t\t\t\t\t\t",
                exact: "",
                to: t.getLinkPath(),
                "data-index": o,
                onClick: e[6] || (e[6] = t=>G.value = !1)
            }, {
                default: m((()=>[u(d(t.computedName), 1)])),
                _: 2
            }, 1032, ["to", "data-index"])], 2)))), 128))])], 32)) : k("", !0)])], 512)) : k("", !0)]), c("div", Xt, [c("button", {
                type: "button",
                class: "\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tp-2\n\t\t\t\t\t\t\t\tinline-flex\n\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\tjustify-center\n\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\t\tfocus:outline-none focus:ring-2 focus:ring-inset focus:ring-white\n\t\t\t\t\t\t\t",
                "aria-controls": "mobile-menu",
                "aria-expanded": r.value,
                onClick: e[7] || (e[7] = t=>r.value = !r.value)
            }, [te, c(C, {
                class: {
                    hidden: r.value,
                    block: !r.value
                },
                "aria-hidden": "true"
            }, null, 8, ["class"]), c(R, {
                class: {
                    block: r.value,
                    hidden: !r.value
                },
                "aria-hidden": "true"
            }, null, 8, ["class"])], 8, ["aria-expanded"])])])]), c(j, {
                "enter-active-class": "transition transform-gpu duration-300 ease-out",
                "enter-from-class": "translate-x-12 opacity-0",
                "enter-to-class": "translate-x-0 opacity-100"
            }, {
                default: m((()=>[r.value ? (l(),
                i("nav", ee, [c("div", se, [c(s, {
                    to: "/",
                    class: "\n\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\t\tblock\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\ttext-base\n\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t",
                    onClick: e[8] || (e[8] = t=>r.value = !r.value)
                }, {
                    default: m((()=>[oe])),
                    _: 1
                }), c(s, {
                    to: "/docs",
                    class: "\n\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\t\tblock\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\ttext-base\n\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t",
                    onClick: e[9] || (e[9] = t=>r.value = !r.value)
                }, {
                    default: m((()=>[ne])),
                    _: 1
                }), c("a", {
                    href: `https://github.com/${z}`,
                    class: "\n\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-630 hover:text-white\n\t\t\t\t\t\t\t\tblock\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\tpx-3\n\t\t\t\t\t\t\t\ttext-base\n\t\t\t\t\t\t\t\tfont-semibold\n\t\t\t\t\t\t\t",
                    target: "_blank",
                    rel: "noopener",
                    onClick: e[10] || (e[10] = t=>r.value = !r.value)
                }, [ae, c(M, {
                    class: "h-5 w-5 inline-block"
                })], 8, ["href"])])])) : k("", !0)])),
                _: 1
            })])])
        }
    }
});
const le = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , ie = c("g", {
    fill: "none"
}, [c("path", {
    d: "M4 16v1a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var ce = {
    render: function(t, e) {
        return l(),
        i("svg", le, [ie])
    }
};
function de(t={}) {
    const {immediate: e=!0, onNeedRefresh: o, onOfflineReady: n} = t
      , a = s(!1)
      , r = s(!1);
    return {
        updateServiceWorker: function(t={}) {
            const {immediate: e=!1, onNeedRefresh: s, onOfflineReady: o} = t;
            let n;
            return "serviceWorker"in navigator && (n = new G("./assets/sw.js",{
                scope: "/"
            }),
            n.addEventListener("activated", (t=>{
                t.isUpdate ? window.location.reload() : null == o || o()
            }
            )),
            n.register({
                immediate: e
            }).then((t=>t))),
            async(t=!0)=>{}
        }({
            immediate: e,
            onNeedRefresh() {
                a.value = !0,
                null == o || o()
            },
            onOfflineReady() {
                r.value = !0,
                null == n || n()
            }
        }),
        offlineReady: r,
        needRefresh: a
    }
}
const pe = {
    key: 0,
    class: "fixed bottom-0 inset-x-0 pb-2 sm:pb-5 z-20"
}
  , ue = {
    class: "max-w-7xl mx-auto px-2 sm:px-6 lg:px-8"
}
  , he = {
    class: "p-2 rounded-lg bg-discord-blurple-600 dark:bg-discord-blurple-700 shadow-lg sm:p-3"
}
  , me = {
    class: "flex items-center justify-between flex-wrap"
}
  , ge = {
    class: "w-0 flex-1 flex items-center"
}
  , be = {
    class: "flex p-2 rounded-lg bg-discord-blurple-530 dark:bg-discord-blurple-630"
}
  , ve = {
    class: "ml-3 font-medium text-white truncate"
}
  , fe = {
    class: "sm:hidden"
}
  , we = {
    class: "hidden sm:inline"
}
  , ye = {
    key: 0,
    class: "order-3 mt-2 flex-shrink-0 w-full sm:order-2 sm:mt-0 sm:w-auto"
}
  , xe = {
    class: "order-2 flex-shrink-0 sm:order-3 sm:ml-2"
}
  , ke = c("span", {
    class: "sr-only"
}, "Dismiss", -1);
var Se = r({
    expose: [],
    setup(t) {
        const {offlineReady: e, needRefresh: s, updateServiceWorker: o} = de()
          , n = ()=>{
            e.value = !1,
            s.value = !1
        }
        ;
        return (t,a)=>{
            const r = ce
              , u = Dt;
            return p(e) || p(s) ? (l(),
            i("div", pe, [c("div", ue, [c("div", he, [c("div", me, [c("div", ge, [c("span", be, [c(r, {
                class: "fill-current text-gray-200 h-6 w-6",
                "aria-hidden": "true"
            })]), c("p", ve, [c("span", fe, d(p(e) ? "App ready to work offline." : "New content available."), 1), c("span", we, d(p(e) ? "App ready to work offline." : "New content available, click refresh to update."), 1)])]), p(s) ? (l(),
            i("div", ye, [c("button", {
                class: "\n\t\t\t\t\t\t\t\tflex\n\t\t\t\t\t\t\t\titems-center\n\t\t\t\t\t\t\t\tjustify-center\n\t\t\t\t\t\t\t\tpx-4\n\t\t\t\t\t\t\t\tpy-2\n\t\t\t\t\t\t\t\tborder border-transparent\n\t\t\t\t\t\t\t\trounded-md\n\t\t\t\t\t\t\t\ttext-sm\n\t\t\t\t\t\t\t\tfont-medium\n\t\t\t\t\t\t\t\ttext-gray-200\n\t\t\t\t\t\t\t\tbg-discord-blurple-530\n\t\t\t\t\t\t\t\tdark:bg-discord-blurple-630\n\t\t\t\t\t\t\t\thover:bg-discord-blurple-460\n\t\t\t\t\t\t\t\tdark:hover:bg-discord-blurple-600\n\t\t\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-white\n\t\t\t\t\t\t\t",
                onClick: a[1] || (a[1] = t=>p(o)(!0))
            }, " Refresh ")])) : k("", !0), c("div", xe, [c("button", {
                type: "button",
                class: "-mr-1 flex p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white",
                onClick: n
            }, [ke, c(u, {
                class: "fill-current text-gray-200 h-6 w-6",
                "aria-hidden": "true"
            })])])])])])])) : k("", !0)
        }
    }
});
const _e = {
    class: "min-h-full grid grid-layout"
}
  , je = {
    id: "container",
    class: "grid grid-layout-container lg:custom-scroll"
}
  , Ce = {
    class: "bg-white dark:bg-[#1d1d1d]"
};
var Re = r({
    expose: [],
    setup: t=>(lt().dispatch("fetchStats"),
    (t,e)=>{
        const s = h("router-view")
          , o = ht;
        return l(),
        i(S, null, [c("div", _e, [c(re), c("div", je, [c("div", Ce, [c(s)]), c(o)])]), c(Se)], 64)
    }
    )
});
let Me;
const Oe = {}
  , Ge = function(t, e) {
    if (!e)
        return t();
    if (void 0 === Me) {
        const t = document.createElement("link").relList;
        Me = t && t.supports && t.supports("modulepreload") ? "modulepreload" : "preload"
    }
    return Promise.all(e.map((t=>{
        if (t in Oe)
            return;
        Oe[t] = !0;
        const e = t.endsWith(".css")
          , s = e ? '[rel="stylesheet"]' : "";
        if (document.querySelector(`link[href="${t}"]${s}`))
            return;
        const o = document.createElement("link");
        return o.rel = e ? "stylesheet" : Me,
        e || (o.as = "script",
        o.crossOrigin = ""),
        o.href = t,
        document.head.appendChild(o),
        e ? new Promise(((t,e)=>{
            o.addEventListener("load", t),
            o.addEventListener("error", e)
        }
        )) : void 0
    }
    ))).then((()=>t()))
}
  , Te = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , ze = c("g", {
    fill: "none"
}, [c("path", {
    d: "M8 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-1M8 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M8 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m0 0h2a2 2 0 0 1 2 2v3m2 4H10m0 0l3-3m-3 3l3 3",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Ie = {
    render: function(t, e) {
        return l(),
        i("svg", Te, [ze])
    }
};
const We = {
    xmlns: "http://www.w3.org/2000/svg",
    "xmlns:xlink": "http://www.w3.org/1999/xlink",
    width: "1.2em",
    height: "1.2em",
    preserveAspectRatio: "xMidYMid meet",
    viewBox: "0 0 24 24"
}
  , De = c("g", {
    fill: "none"
}, [c("path", {
    d: "M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2M9 5a2 2 0 0 0 2 2h2a2 2 0 0 0 2-2M9 5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2m-6 9l2 2l4-4",
    stroke: "currentColor",
    "stroke-width": "2",
    "stroke-linecap": "round",
    "stroke-linejoin": "round"
})], -1);
var Ue = {
    render: function(t, e) {
        return l(),
        i("svg", We, [De])
    }
};
const Ee = {
    class: "text-gray-200 bg-discord-blurple-560 p-4 md:text-lg mx-auto rounded-md shadow flex items-center"
}
  , Je = c("span", {
    class: "hover:text-white mr-2"
}, "npm install discord-giveaways-super", -1);
var Le = r({
    expose: [],
    setup(t) {
        const e = s()
          , o = s(!1)
          , n = T((t=>{
            t(),
            o.value = !1
        }
        ), 1e3)
          , {show: a, hide: r} = z(e, {
            theme: "discord",
            content: "Copied",
            trigger: "manual",
            hideOnClick: !1
        })
          , d = async()=>{
            try {
                await navigator.clipboard.writeText("npm install discord-giveaways-super"),
                a()
            } catch {}
            o.value = !0,
            n(r)
        }
        ;
        return (t,s)=>{
            const n = Ie
              , a = Ue;
            return l(),
            i("code", Ee, [Je, c("button", {
                ref: e,
                class: "focus:outline-none",
                "aria-label": "Copy install command"
            }, [o.value ? (l(),
            i(a, {
                key: 1,
                class: "inline-block fill-current text-discord-green-500 cursor-pointer mb-1",
                "aria-hidden": "true",
                onClick: d
            })) : (l(),
            i(n, {
                key: 0,
                class: "inline-block fill-current text-gray-200 cursor-pointer hover:text-white mb-1",
                "aria-hidden": "true",
                onClick: d
            }))], 512)])
        }
    }
});
const $e = {
    class: "grid"
}
  , Ne = {
    class: "overflow-x-auto lg:custom-scroll"
}
  , Pe = {
    class: "relative"
}
  , Be = {
    class: "my-0 javascript"
};
var Ae = r({
    expose: [],
    props: {
        code: {
            type: String,
            required: !0
        }
    },
    setup(t) {
        const e = t
          , o = s()
          , n = s(!1)
          , a = T((t=>{
            t(),
            n.value = !1
        }
        ), 1e3)
          , {show: r, hide: d} = z(o, {
            theme: "discord",
            content: "Copied",
            trigger: "manual",
            hideOnClick: !1
        })
          , u = async()=>{
            try {
                await navigator.clipboard.writeText(e.code),
                r()
            } catch {}
            n.value = !0,
            a(d)
        }
        ;
        return (e,s)=>{
            const a = Ie
              , r = Ue;
            return l(),
            i("div", $e, [c("div", Ne, [c("div", Pe, [c("pre", Be, [c("code", {
                innerHTML: p(I).highlight(t.code, {
                    language: "javascript"
                }).value
            }, null, 8, ["innerHTML"])]), c("button", {
                ref: o,
                class: "\n\t\t\t\t\t\tabsolute\n\t\t\t\t\t\tright-0\n\t\t\t\t\t\ttop-0\n\t\t\t\t\t\tmt-4\n\t\t\t\t\t\tmr-4\n\t\t\t\t\t\tinline-block\n\t\t\t\t\t\thover:text-white\n\t\t\t\t\t\tfocus:outline-none\n\t\t\t\t\t\tfocus-visible:ring-1 focus-visible:ring-gray-200\n\t\t\t\t\t",
                "aria-label": "Copy code"
            }, [n.value ? (l(),
            i(r, {
                key: 1,
                class: "fill-current text-discord-green-600 dark:text-discord-green-500",
                "aria-hidden": "true",
                onClick: u
            })) : (l(),
            i(a, {
                key: 0,
                class: "fill-current text-gray-700 dark:text-gray-200",
                "aria-hidden": "true",
                onClick: u
            }))], 512)])])])
        }
    }
});
const Fe = u(" downloads ")
  , qe = u(" weekly downloads ")
  , Ve = u(" stars ")
  , He = u(" contributors ")
  , Ke = c("li", null, [u("Developer: "), c("b", null, "ShadowPlay")], -1)
  , Ye = c("li", null, [u("Support Server: "), c("a", {
    href: "https://discord.gg/4pWKq8vUnb"
}, "https://discord.gg/4pWKq8vUnb")], -1);
var Ze = r({
    expose: [],
    setup(t) {
        const e = lt()
          , s = o((()=>e.state.stats.downloads))
          , n = o((()=>e.state.stats.weeklyDownloads))
          , a = o((()=>e.state.stats.stars))
          , r = o((()=>e.state.stats.contributors));
        return (t,e)=>(l(),
        i("ul", null, [c("li", null, [c("b", null, d(p(s)), 1), Fe]), c("li", null, [c("b", null, d(p(n)), 1), qe]), c("li", null, [c("b", null, d(p(a)), 1), Ve]), c("li", null, [c("b", null, d(p(r)), 1), He]), Ke, Ye]))
    }
});
const Qe = {
    class: "bg-discord-blurple-500 py-20"
}
  , Xe = {
    class: "max-w-3xl sm:mx-auto text-center px-8 sm:px-16 flex flex-col gap-10 md:px-12"
}
  , ts = c("a", {
    class: "fonted"
}, "discord-giveaways-super", -1)
  , es = {
    class: "\n\t\t\tprose prose-discord\n\t\t\tdark:prose-light\n\t\t\tlg:prose-lg\n\t\t\tpx-6\n\t\t\tmx-auto\n\t\t\tpb-8\n\t\t\tw-full\n\t\t\txl:grid xl:grid-cols-2 xl:gap-x-12 xl:max-w-7xl\n\t\t"
}
  , ss = c("h2", null, "About", -1)
  , os = c("h3", null, "What is discord-giveaways-super?", -1)
  , ns = u(" discord-giveaways-super is a powerful ")
  , as = {
    href: "https://nodejs.org",
    target: "_blank",
    rel: "noopener"
}
  , rs = u("Node.js ")
  , ls = u(" module that allows you to make a giveaways system in your bot very easily. It takes a much more object-oriented approach than most other libraries, making your bot's code much cleaner and easier to understand. It's also beginner friendly, easy to use and fully customizable Giveaways framework. ")
  , is = c("p", null, [u(" The module supports "), c("b", null, "JSON"), u(", "), c("b", null, "MongoDB"), u(" and "), c("b", null, "JSON"), u(" databases: it makes the module accessible for everyone! ")], -1)
  , cs = c("p", null, " Clean examples in both JavaScript and TypeScript for both MongoDB and JSON databases on the GitHub page will help you to get started with discord-giveaways-super! ", -1)
  , ds = u(" Usability, consistency, speed and performance are key focuses of discord-giveaways-super. If you found a bug or want to give me an idea, feel free to create an issue or pull request on the GitHub page or tell us on our ")
  , ps = {
    href: "https://discord.gg/4pWKq8vUnb",
    target: "_blank",
    rel: "noopener"
}
  , us = u("Support Server ")
  , hs = u("! It would be really appreciated! ")
  , ms = c("h2", null, "Example", -1)
  , gs = D("<div><h2>Why?</h2><ul><li><b>Clean TypeScript Defenitions</b></li><li><b>Multiple Databases Support</b></li><li><b>Object-Oriented</b></li><li><b>Flexible and Customizable</b></li><li><b>Giveaway <b>start</b>, <b>edit</b>, <b>delete</b>, <b>reroll</b>, <b>extension</b> and <i>many more</i>!</b></li><li><b>Handles Crashes/Restarts</b></li><li><b>Beginner Friendly</b></li></ul></div>", 1)
  , bs = c("h2", null, "Stats and Info", -1);
const vs = [{
    name: "all",
    path: "/:all(.*)",
    component: ()=>Ge((()=>import("./[...all].b7433654.js")), ["./[...all].b7433654.js", "./assets/vendor.5101602c.js"]),
    props: !0
}, {
    name: "index",
    path: "/",
    component: r({
        expose: [],
        setup(t) {
            const e = lt()
              , n = s(W`
const { Giveaways, DatabaseType } = require('discord-giveaways-super')

let giveaways = new Giveaways(this, {
	database: DatabaseType.JSON, // or any other database that is provided by module

	connection: {
		// database configuration object based on selected database
	}
});

giveaways.on('ready', () => {
	console.log('Giveaways module is ready!')

	const newGiveaway = await giveaways.start({
        channelID: 'Channel ID',
        guildID: 'Guild ID',
        hostMemberID: 'Host member ID',
        prize: 'My Giveaway',
        time: '1d',
        winnersCount: 1,

        defineEmbedStrings(giveaway, host) {
			return {
				// ...
			}
		},

		buttons: {
			// ...
		}
})`);
            return o((()=>e.state.docs)).value || (e.dispatch("fetchDocs", {
                inputSource: A
            }),
            e.dispatch("fetchTags", {
                currentSource: A
            })),
            (t,e)=>{
                const s = Le
                  , o = Jt
                  , a = Ae
                  , r = Ze;
                return l(),
                i(S, null, [c("div", Qe, [c("div", Xe, [ts, c(s)])]), c("div", es, [c("div", null, [ss, os, c("p", null, [ns, c("a", as, [rs, c(o, {
                    class: "h-5 w-5 inline-block mb-1",
                    "aria-hidden": "true"
                })]), ls]), is, cs, c("p", null, [ds, c("a", ps, [us, c(o, {
                    class: "h-5 w-5 inline-block mb-1",
                    "aria-hidden": "true"
                })]), hs])]), c("div", null, [ms, c(a, {
                    code: n.value
                }, null, 8, ["code"])]), gs, c("div", null, [bs, c(r)])])], 64)
            }
        }
    }),
    props: !0
}, {
    path: "/docs",
    component: ()=>Ge((()=>import("./assets/docs.62f036c5.js")), ["./assets/docs.62f036c5.js", "./assets/docs.5a672fae.css", "./assets/vendor.5101602c.js", "./assets/chevron-down.ba5bc4fc.js", "./assets/headlessui.esm.83123edc.js", "./assets/Spinner.ee5f11f6.js", "./assets/Spinner.af24072b.css"]),
    children: [{
        name: "docs-source",
        path: ":source",
        component: ()=>Ge((()=>import("./index.6c282508.js")), ["./index.6c282508.js", "./assets/Spinner.ee5f11f6.js", "./assets/Spinner.af24072b.css", "./assets/vendor.5101602c.js"]),
        props: !0
    }, {
        name: "docs-source-tag-search",
        path: ":source/:tag/search",
        component: ()=>Ge((()=>import("./search.83614047.js")), ["./search.83614047.js", "./search.055dc457.css", "./assets/vendor.5101602c.js"]),
        props: !0
    }, {
        name: "docs-source-tag-class-class",
        path: ":source/:tag/class/:class",
        component: ()=>Ge((()=>import("./[class].1594c02c.js")), ["./[class].1594c02c.js", "./[class].32241939.css", "./assets/vendor.5101602c.js", "./SourceButton.vue_vue&type=script&setup=true&lang.6b8dcc98.js", "./See.vue_vue&type=script&setup=true&lang.d86df4e1.js", "./See.vue_vue&type=script&setup=true&lang.9c59f874.css", "./assets/chevron-down.ba5bc4fc.js", "./assets/headlessui.esm.83123edc.js"]),
        props: !0
    }, {
        name: "docs-source-tag-typedef-typedef",
        path: ":source/:tag/typedef/:typedef",
        component: ()=>Ge((()=>import("./[typedef].d826f794.js")), ["./[typedef].d826f794.js", "./assets/vendor.5101602c.js", "./SourceButton.vue_vue&type=script&setup=true&lang.6b8dcc98.js", "./See.vue_vue&type=script&setup=true&lang.d86df4e1.js", "./See.vue_vue&type=script&setup=true&lang.9c59f874.css", "./assets/headlessui.esm.83123edc.js"]),
        props: !0
    }, {
        name: "docs-source-tag-category-file",
        path: ":source/:tag/:category/:file",
        component: ()=>Ge((()=>import("./[file].a587c2b9.js")), ["./[file].a587c2b9.js", "./assets/vendor.5101602c.js", "./SourceButton.vue_vue&type=script&setup=true&lang.6b8dcc98.js"]),
        props: !0
    }],
    props: !0
}];
var fs = U({
    history: E(),
    routes: vs
});
const ws = J(Re);
ws.use(rt, at),
ws.use(fs),
ws.use(L),
ws.mount("#app");
export {q as C, Q as D, A as M, K as R, Ae as _, H as a, Jt as b, nt as f, Y as i, ot as s, lt as u};
