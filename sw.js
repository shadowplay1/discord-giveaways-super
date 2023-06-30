const e = Object.defineProperty;
const t = Object.defineProperties;
const s = Object.getOwnPropertyDescriptors;
const a = Object.getOwnPropertySymbols;
const n = Object.prototype.hasOwnProperty;
const r = Object.prototype.propertyIsEnumerable;
const i = (t, s, a) => (s in t ? e(t, s, { enumerable: !0, configurable: !0, writable: !0, value: a }) : (t[s] = a));
const c = (e, t) => {
	for (var s in t || (t = {})) n.call(t, s) && i(e, s, t[s]);
	if (a) for (var s of a(t)) r.call(t, s) && i(e, s, t[s]);
	return e;
};
const o = (e, a) => t(e, s(a));
try {
	self['workbox:core:6.1.5'] && _();
} catch (ee) {}
const h = (e, ...t) => {
	let s = e;
	return t.length > 0 && (s += ` :: ${JSON.stringify(t)}`), s;
};
class l extends Error {
	constructor(e, t) {
		super(h(e, t)), (this.name = e), (this.details = t);
	}
}
const u = {
	googleAnalytics: 'googleAnalytics',
	precache: 'precache-v2',
	prefix: 'workbox',
	runtime: 'runtime',
	suffix: typeof registration != 'undefined' ? registration.scope : '',
};
const d = (e) => [u.prefix, e, u.suffix].filter((e) => e && e.length > 0).join('-');
const p = (e) => {
	((e) => {
		for (const t of Object.keys(u)) e(t);
	})((t) => {
		typeof e[t] == 'string' && (u[t] = e[t]);
	});
};
const f = (e) => e || d(u.precache);
const g = (e) => e || d(u.runtime);
function w(e, t) {
	const s = t();
	return e.waitUntil(s), s;
}
try {
	self['workbox:precaching:6.1.5'] && _();
} catch (ee) {}
function m(e) {
	if (!e) throw new l('add-to-cache-list-unexpected-type', { entry: e });
	if (typeof e == 'string') {
		const t = new URL(e, location.href);
		return { cacheKey: t.href, url: t.href };
	}
	const { revision: t, url: s } = e;
	if (!s) throw new l('add-to-cache-list-unexpected-type', { entry: e });
	if (!t) {
		const e = new URL(s, location.href);
		return { cacheKey: e.href, url: e.href };
	}
	const a = new URL(s, location.href);
	const n = new URL(s, location.href);
	return a.searchParams.set('__WB_REVISION__', t), { cacheKey: a.href, url: n.href };
}
class y {
	constructor() {
		(this.updatedURLs = []),
			(this.notUpdatedURLs = []),
			(this.handlerWillStart = async ({ request: e, state: t }) => {
				t && (t.originalRequest = e);
			}),
			(this.cachedResponseWillBeUsed = async ({ event: e, state: t, cachedResponse: s }) => {
				if (e.type === 'install') {
					const e = t.originalRequest.url;
					s ? this.notUpdatedURLs.push(e) : this.updatedURLs.push(e);
				}
				return s;
			});
	}
}
class b {
	constructor({ precacheController: e }) {
		(this.cacheKeyWillBeUsed = async ({ request: e, params: t }) => {
			const s = (t && t.cacheKey) || this._precacheController.getCacheKeyForURL(e.url);
			return s ? new Request(s) : e;
		}),
			(this._precacheController = e);
	}
}
let v;
async function R(e, t) {
	let s = null;
	if (e.url) {
		s = new URL(e.url).origin;
	}
	if (s !== self.location.origin) throw new l('cross-origin-copy-response', { origin: s });
	const a = e.clone();
	const n = { headers: new Headers(a.headers), status: a.status, statusText: a.statusText };
	const r = t ? t(n) : n;
	const i = (function () {
		if (void 0 === v) {
			const t = new Response('');
			if ('body' in t)
				try {
					new Response(t.body), (v = !0);
				} catch (e) {
					v = !1;
				}
			v = !1;
		}
		return v;
	})()
		? a.body
		: await a.blob();
	return new Response(i, r);
}
function x(e, t) {
	const s = new URL(e);
	for (const a of t) s.searchParams.delete(a);
	return s.href;
}
class C {
	constructor() {
		this.promise = new Promise((e, t) => {
			(this.resolve = e), (this.reject = t);
		});
	}
}
const U = new Set();
try {
	self['workbox:strategies:6.1.5'] && _();
} catch (ee) {}
function q(e) {
	return typeof e == 'string' ? new Request(e) : e;
}
class T {
	constructor(e, t) {
		(this._cacheKeys = {}),
			Object.assign(this, t),
			(this.event = t.event),
			(this._strategy = e),
			(this._handlerDeferred = new C()),
			(this._extendLifetimePromises = []),
			(this._plugins = [...e.plugins]),
			(this._pluginStateMap = new Map());
		for (const s of this._plugins) this._pluginStateMap.set(s, {});
		this.event.waitUntil(this._handlerDeferred.promise);
	}

	async fetch(e) {
		const { event: t } = this;
		let s = q(e);
		if (s.mode === 'navigate' && t instanceof FetchEvent && t.preloadResponse) {
			const e = await t.preloadResponse;
			if (e) return e;
		}
		const a = this.hasCallback('fetchDidFail') ? s.clone() : null;
		try {
			for (const e of this.iterateCallbacks('requestWillFetch')) s = await e({ request: s.clone(), event: t });
		} catch (r) {
			throw new l('plugin-error-request-will-fetch', { thrownError: r });
		}
		const n = s.clone();
		try {
			let e;
			e = await fetch(s, s.mode === 'navigate' ? void 0 : this._strategy.fetchOptions);
			for (const s of this.iterateCallbacks('fetchDidSucceed')) e = await s({ event: t, request: n, response: e });
			return e;
		} catch (i) {
			throw (
				(a &&
					(await this.runCallbacks('fetchDidFail', {
						error: i,
						event: t,
						originalRequest: a.clone(),
						request: n.clone(),
					})),
				i)
			);
		}
	}

	async fetchAndCachePut(e) {
		const t = await this.fetch(e);
		const s = t.clone();
		return this.waitUntil(this.cachePut(e, s)), t;
	}

	async cacheMatch(e) {
		const t = q(e);
		let s;
		const { cacheName: a, matchOptions: n } = this._strategy;
		const r = await this.getCacheKey(t, 'read');
		const i = c(c({}, n), { cacheName: a });
		s = await caches.match(r, i);
		for (const c of this.iterateCallbacks('cachedResponseWillBeUsed'))
			s = (await c({ cacheName: a, matchOptions: n, cachedResponse: s, request: r, event: this.event })) || void 0;
		return s;
	}

	async cachePut(e, t) {
		const s = q(e);
		let a;
		await ((a = 0), new Promise((e) => setTimeout(e, a)));
		const n = await this.getCacheKey(s, 'write');
		if (!t)
			throw new l('cache-put-with-no-response', {
				url: ((r = n.url), new URL(String(r), location.href).href.replace(new RegExp(`^${location.origin}`), '')),
			});
		let r;
		const i = await this._ensureResponseSafeToCache(t);
		if (!i) return !1;
		const { cacheName: h, matchOptions: u } = this._strategy;
		const d = await self.caches.open(h);
		const p = this.hasCallback('cacheDidUpdate');
		const f = p
			? await (async function (e, t, s, a) {
					const n = x(t.url, s);
					if (t.url === n) return e.match(t, a);
					const r = o(c({}, a), { ignoreSearch: !0 });
					const i = await e.keys(t, r);
					for (const c of i) if (n === x(c.url, s)) return e.match(c, a);
			  })(d, n.clone(), ['__WB_REVISION__'], u)
			: null;
		try {
			await d.put(n, p ? i.clone() : i);
		} catch (g) {
			throw (
				(g.name === 'QuotaExceededError' &&
					(await (async function () {
						for (const e of U) await e();
					})()),
				g)
			);
		}
		for (const c of this.iterateCallbacks('cacheDidUpdate'))
			await c({ cacheName: h, oldResponse: f, newResponse: i.clone(), request: n, event: this.event });
		return !0;
	}

	async getCacheKey(e, t) {
		if (!this._cacheKeys[t]) {
			let s = e;
			for (const e of this.iterateCallbacks('cacheKeyWillBeUsed'))
				s = q(await e({ mode: t, request: s, event: this.event, params: this.params }));
			this._cacheKeys[t] = s;
		}
		return this._cacheKeys[t];
	}

	hasCallback(e) {
		for (const t of this._strategy.plugins) if (e in t) return !0;
		return !1;
	}

	async runCallbacks(e, t) {
		for (const s of this.iterateCallbacks(e)) await s(t);
	}

	*iterateCallbacks(e) {
		for (const t of this._strategy.plugins)
			if (typeof t[e] == 'function') {
				const s = this._pluginStateMap.get(t);
				const a = (a) => {
					const n = o(c({}, a), { state: s });
					return t[e](n);
				};
				yield a;
			}
	}

	waitUntil(e) {
		return this._extendLifetimePromises.push(e), e;
	}

	async doneWaiting() {
		let e;
		for (; (e = this._extendLifetimePromises.shift()); ) await e;
	}

	destroy() {
		this._handlerDeferred.resolve();
	}

	async _ensureResponseSafeToCache(e) {
		let t = e;
		let s = !1;
		for (const a of this.iterateCallbacks('cacheWillUpdate'))
			if (((t = (await a({ request: this.request, response: t, event: this.event })) || void 0), (s = !0), !t)) break;
		return s || (t && t.status !== 200 && (t = void 0)), t;
	}
}
class k {
	constructor(e = {}) {
		(this.cacheName = g(e.cacheName)),
			(this.plugins = e.plugins || []),
			(this.fetchOptions = e.fetchOptions),
			(this.matchOptions = e.matchOptions);
	}

	handle(e) {
		const [t] = this.handleAll(e);
		return t;
	}

	handleAll(e) {
		e instanceof FetchEvent && (e = { event: e, request: e.request });
		const t = e.event;
		const s = typeof e.request == 'string' ? new Request(e.request) : e.request;
		const a = 'params' in e ? e.params : void 0;
		const n = new T(this, { event: t, request: s, params: a });
		const r = this._getResponse(n, s, t);
		return [r, this._awaitComplete(r, n, s, t)];
	}

	async _getResponse(e, t, s) {
		let a;
		await e.runCallbacks('handlerWillStart', { event: s, request: t });
		try {
			if (((a = await this._handle(t, e)), !a || a.type === 'error')) throw new l('no-response', { url: t.url });
		} catch (n) {
			for (const r of e.iterateCallbacks('handlerDidError'))
				if (((a = await r({ error: n, event: s, request: t })), a)) break;
			if (!a) throw n;
		}
		for (const r of e.iterateCallbacks('handlerWillRespond')) a = await r({ event: s, request: t, response: a });
		return a;
	}

	async _awaitComplete(e, t, s, a) {
		let n;
		let r;
		try {
			n = await e;
		} catch (i) {}
		try {
			await t.runCallbacks('handlerDidRespond', { event: a, request: s, response: n }), await t.doneWaiting();
		} catch (c) {
			r = c;
		}
		if ((await t.runCallbacks('handlerDidComplete', { event: a, request: s, response: n, error: r }), t.destroy(), r))
			throw r;
	}
}
class E extends k {
	constructor(e = {}) {
		(e.cacheName = f(e.cacheName)),
			super(e),
			(this._fallbackToNetwork = !1 !== e.fallbackToNetwork),
			this.plugins.push(E.copyRedirectedCacheableResponsesPlugin);
	}

	async _handle(e, t) {
		const s = await t.cacheMatch(e);
		return (
			s || (t.event && t.event.type === 'install' ? await this._handleInstall(e, t) : await this._handleFetch(e, t))
		);
	}

	async _handleFetch(e, t) {
		let s;
		if (!this._fallbackToNetwork) throw new l('missing-precache-entry', { cacheName: this.cacheName, url: e.url });
		return (s = await t.fetch(e)), s;
	}

	async _handleInstall(e, t) {
		this._useDefaultCacheabilityPluginIfNeeded();
		const s = await t.fetch(e);
		if (!(await t.cachePut(e, s.clone()))) throw new l('bad-precaching-response', { url: e.url, status: s.status });
		return s;
	}

	_useDefaultCacheabilityPluginIfNeeded() {
		let e = null;
		let t = 0;
		for (const [s, a] of this.plugins.entries())
			a !== E.copyRedirectedCacheableResponsesPlugin &&
				(a === E.defaultPrecacheCacheabilityPlugin && (e = s), a.cacheWillUpdate && t++);
		t === 0 ? this.plugins.push(E.defaultPrecacheCacheabilityPlugin) : t > 1 && e !== null && this.plugins.splice(e, 1);
	}
}
(E.defaultPrecacheCacheabilityPlugin = {
	cacheWillUpdate: async ({ response: e }) => (!e || e.status >= 400 ? null : e),
}),
	(E.copyRedirectedCacheableResponsesPlugin = {
		cacheWillUpdate: async ({ response: e }) => (e.redirected ? await R(e) : e),
	});
class L {
	constructor({ cacheName: e, plugins: t = [], fallbackToNetwork: s = !0 } = {}) {
		(this._urlsToCacheKeys = new Map()),
			(this._urlsToCacheModes = new Map()),
			(this._cacheKeysToIntegrities = new Map()),
			(this._strategy = new E({
				cacheName: f(e),
				plugins: [...t, new b({ precacheController: this })],
				fallbackToNetwork: s,
			})),
			(this.install = this.install.bind(this)),
			(this.activate = this.activate.bind(this));
	}

	get strategy() {
		return this._strategy;
	}

	precache(e) {
		this.addToCacheList(e),
			this._installAndActiveListenersAdded ||
				(self.addEventListener('install', this.install),
				self.addEventListener('activate', this.activate),
				(this._installAndActiveListenersAdded = !0));
	}

	addToCacheList(e) {
		const t = [];
		for (const s of e) {
			typeof s == 'string' ? t.push(s) : s && void 0 === s.revision && t.push(s.url);
			const { cacheKey: e, url: a } = m(s);
			const n = typeof s != 'string' && s.revision ? 'reload' : 'default';
			if (this._urlsToCacheKeys.has(a) && this._urlsToCacheKeys.get(a) !== e)
				throw new l('add-to-cache-list-conflicting-entries', {
					firstEntry: this._urlsToCacheKeys.get(a),
					secondEntry: e,
				});
			if (typeof s != 'string' && s.integrity) {
				if (this._cacheKeysToIntegrities.has(e) && this._cacheKeysToIntegrities.get(e) !== s.integrity)
					throw new l('add-to-cache-list-conflicting-integrities', { url: a });
				this._cacheKeysToIntegrities.set(e, s.integrity);
			}
			if ((this._urlsToCacheKeys.set(a, e), this._urlsToCacheModes.set(a, n), t.length > 0)) {
				const e = `Workbox is precaching URLs without revision info: ${t.join(
					', ',
				)}\nThis is generally NOT safe. Learn more at https://bit.ly/wb-precache`;
				console.warn(e);
			}
		}
	}

	install(e) {
		return w(e, async () => {
			const t = new y();
			this.strategy.plugins.push(t);
			for (const [n, r] of this._urlsToCacheKeys) {
				const t = this._cacheKeysToIntegrities.get(r);
				const s = this._urlsToCacheModes.get(n);
				const a = new Request(n, { integrity: t, cache: s, credentials: 'same-origin' });
				await Promise.all(this.strategy.handleAll({ params: { cacheKey: r }, request: a, event: e }));
			}
			const { updatedURLs: s, notUpdatedURLs: a } = t;
			return { updatedURLs: s, notUpdatedURLs: a };
		});
	}

	activate(e) {
		return w(e, async () => {
			const e = await self.caches.open(this.strategy.cacheName);
			const t = await e.keys();
			const s = new Set(this._urlsToCacheKeys.values());
			const a = [];
			for (const n of t) s.has(n.url) || (await e.delete(n), a.push(n.url));
			return { deletedURLs: a };
		});
	}

	getURLsToCacheKeys() {
		return this._urlsToCacheKeys;
	}

	getCachedURLs() {
		return [...this._urlsToCacheKeys.keys()];
	}

	getCacheKeyForURL(e) {
		const t = new URL(e, location.href);
		return this._urlsToCacheKeys.get(t.href);
	}

	async matchPrecache(e) {
		const t = e instanceof Request ? e.url : e;
		const s = this.getCacheKeyForURL(t);
		if (s) {
			return (await self.caches.open(this.strategy.cacheName)).match(s);
		}
	}

	createHandlerBoundToURL(e) {
		const t = this.getCacheKeyForURL(e);
		if (!t) throw new l('non-precached-url', { url: e });
		return (s) => ((s.request = new Request(e)), (s.params = c({ cacheKey: t }, s.params)), this.strategy.handle(s));
	}
}
let N;
const P = () => (N || (N = new L()), N);
try {
	self['workbox:routing:6.1.5'] && _();
} catch (ee) {}
const K = (e) => (e && typeof e == 'object' ? e : { handle: e });
class O {
	constructor(e, t, s = 'GET') {
		(this.handler = K(t)), (this.match = e), (this.method = s);
	}

	setCatchHandler(e) {
		this.catchHandler = K(e);
	}
}
class A extends O {
	constructor(e, t, s) {
		super(
			({ url: t }) => {
				const s = e.exec(t.href);
				if (s && (t.origin === location.origin || s.index === 0)) return s.slice(1);
			},
			t,
			s,
		);
	}
}
class M {
	constructor() {
		(this._routes = new Map()), (this._defaultHandlerMap = new Map());
	}

	get routes() {
		return this._routes;
	}

	addFetchListener() {
		self.addEventListener('fetch', (e) => {
			const { request: t } = e;
			const s = this.handleRequest({ request: t, event: e });
			s && e.respondWith(s);
		});
	}

	addCacheListener() {
		self.addEventListener('message', (e) => {
			if (e.data && e.data.type === 'CACHE_URLS') {
				const { payload: t } = e.data;
				const s = Promise.all(
					t.urlsToCache.map((t) => {
						typeof t == 'string' && (t = [t]);
						const s = new Request(...t);
						return this.handleRequest({ request: s, event: e });
					}),
				);
				e.waitUntil(s), e.ports && e.ports[0] && s.then(() => e.ports[0].postMessage(!0));
			}
		});
	}

	handleRequest({ request: e, event: t }) {
		const s = new URL(e.url, location.href);
		if (!s.protocol.startsWith('http')) return;
		const a = s.origin === location.origin;
		const { params: n, route: r } = this.findMatchingRoute({ event: t, request: e, sameOrigin: a, url: s });
		let i = r && r.handler;
		const c = e.method;
		if ((!i && this._defaultHandlerMap.has(c) && (i = this._defaultHandlerMap.get(c)), !i)) return;
		let o;
		try {
			o = i.handle({ url: s, request: e, event: t, params: n });
		} catch (l) {
			o = Promise.reject(l);
		}
		const h = r && r.catchHandler;
		return (
			o instanceof Promise &&
				(this._catchHandler || h) &&
				(o = o.catch(async (a) => {
					if (h)
						try {
							return await h.handle({ url: s, request: e, event: t, params: n });
						} catch (r) {
							a = r;
						}
					if (this._catchHandler) return this._catchHandler.handle({ url: s, request: e, event: t });
					throw a;
				})),
			o
		);
	}

	findMatchingRoute({ url: e, sameOrigin: t, request: s, event: a }) {
		const n = this._routes.get(s.method) || [];
		for (const r of n) {
			let n;
			const i = r.match({ url: e, sameOrigin: t, request: s, event: a });
			if (i)
				return (
					(n = i),
					((Array.isArray(i) && i.length === 0) ||
						(i.constructor === Object && Object.keys(i).length === 0) ||
						typeof i == 'boolean') &&
						(n = void 0),
					{ route: r, params: n }
				);
		}
		return {};
	}

	setDefaultHandler(e, t = 'GET') {
		this._defaultHandlerMap.set(t, K(e));
	}

	setCatchHandler(e) {
		this._catchHandler = K(e);
	}

	registerRoute(e) {
		this._routes.has(e.method) || this._routes.set(e.method, []), this._routes.get(e.method).push(e);
	}

	unregisterRoute(e) {
		if (!this._routes.has(e.method)) throw new l('unregister-route-but-not-found-with-method', { method: e.method });
		const t = this._routes.get(e.method).indexOf(e);
		if (!(t > -1)) throw new l('unregister-route-route-not-registered');
		this._routes.get(e.method).splice(t, 1);
	}
}
let S;
const j = () => (S || ((S = new M()), S.addFetchListener(), S.addCacheListener()), S);
function D(e, t, s) {
	let a;
	if (typeof e == 'string') {
		const n = new URL(e, location.href);
		a = new O(({ url: e }) => e.href === n.href, t, s);
	} else if (e instanceof RegExp) a = new A(e, t, s);
	else if (typeof e == 'function') a = new O(e, t, s);
	else {
		if (!(e instanceof O))
			throw new l('unsupported-route-type', {
				moduleName: 'workbox-routing',
				funcName: 'registerRoute',
				paramName: 'capture',
			});
		a = e;
	}
	return j().registerRoute(a), a;
}
class I extends O {
	constructor(e, t) {
		super(({ request: s }) => {
			const a = e.getURLsToCacheKeys();
			for (const e of (function* (
				e,
				{
					ignoreURLParametersMatching: t = [/^utm_/, /^fbclid$/],
					directoryIndex: s = 'index.html',
					cleanURLs: a = !0,
					urlManipulation: n,
				} = {},
			) {
				const r = new URL(e, location.href);
				(r.hash = ''), yield r.href;
				const i = (function (e, t = []) {
					for (const s of [...e.searchParams.keys()]) t.some((e) => e.test(s)) && e.searchParams.delete(s);
					return e;
				})(r, t);
				if ((yield i.href, s && i.pathname.endsWith('/'))) {
					const e = new URL(i.href);
					(e.pathname += s), yield e.href;
				}
				if (a) {
					const e = new URL(i.href);
					(e.pathname += '.html'), yield e.href;
				}
				if (n) {
					const e = n({ url: r });
					for (const t of e) yield t.href;
				}
			})(s.url, t)) {
				const t = a.get(e);
				if (t) return { cacheKey: t };
			}
		}, e.strategy);
	}
}
function W(e) {
	e.then(() => {});
}
class H {
	constructor(e, t, { onupgradeneeded: s, onversionchange: a } = {}) {
		(this._db = null),
			(this._name = e),
			(this._version = t),
			(this._onupgradeneeded = s),
			(this._onversionchange = a || (() => this.close()));
	}

	get db() {
		return this._db;
	}

	async open() {
		if (!this._db)
			return (
				(this._db = await new Promise((e, t) => {
					let s = !1;
					setTimeout(() => {
						(s = !0), t(new Error('The open request was blocked and timed out'));
					}, this.OPEN_TIMEOUT);
					const a = indexedDB.open(this._name, this._version);
					(a.onerror = () => t(a.error)),
						(a.onupgradeneeded = (e) => {
							s
								? (a.transaction.abort(), a.result.close())
								: typeof this._onupgradeneeded == 'function' && this._onupgradeneeded(e);
						}),
						(a.onsuccess = () => {
							const t = a.result;
							s ? t.close() : ((t.onversionchange = this._onversionchange.bind(this)), e(t));
						});
				})),
				this
			);
	}

	async getKey(e, t) {
		return (await this.getAllKeys(e, t, 1))[0];
	}

	async getAll(e, t, s) {
		return await this.getAllMatching(e, { query: t, count: s });
	}

	async getAllKeys(e, t, s) {
		return (await this.getAllMatching(e, { query: t, count: s, includeKeys: !0 })).map((e) => e.key);
	}

	async getAllMatching(e, { index: t, query: s = null, direction: a = 'next', count: n, includeKeys: r = !1 } = {}) {
		return await this.transaction([e], 'readonly', (i, c) => {
			const o = i.objectStore(e);
			const h = t ? o.index(t) : o;
			const l = [];
			const u = h.openCursor(s, a);
			u.onsuccess = () => {
				const e = u.result;
				e ? (l.push(r ? e : e.value), n && l.length >= n ? c(l) : e.continue()) : c(l);
			};
		});
	}

	async transaction(e, t, s) {
		return (
			await this.open(),
			await new Promise((a, n) => {
				const r = this._db.transaction(e, t);
				(r.onabort = () => n(r.error)), (r.oncomplete = () => a()), s(r, (e) => a(e));
			})
		);
	}

	async _call(e, t, s, ...a) {
		return await this.transaction([t], s, (s, n) => {
			const r = s.objectStore(t);
			const i = r[e].apply(r, a);
			i.onsuccess = () => n(i.result);
		});
	}

	close() {
		this._db && (this._db.close(), (this._db = null));
	}
}
H.prototype.OPEN_TIMEOUT = 2e3;
const F = {
	readonly: ['get', 'count', 'getKey', 'getAll', 'getAllKeys'],
	readwrite: ['add', 'put', 'clear', 'delete'],
};
for (const [_, te] of Object.entries(F))
	for (const e of te)
		e in IDBObjectStore.prototype &&
			(H.prototype[e] = async function (t, ...s) {
				return await this._call(e, t, _, ...s);
			});
const B = { cacheWillUpdate: async ({ response: e }) => (e.status === 200 || e.status === 0 ? e : null) };
try {
	self['workbox:expiration:6.1.5'] && _();
} catch (ee) {}
const Q = (e) => {
	const t = new URL(e, location.href);
	return (t.hash = ''), t.href;
};
class G {
	constructor(e) {
		(this._cacheName = e),
			(this._db = new H('workbox-expiration', 1, { onupgradeneeded: (e) => this._handleUpgrade(e) }));
	}

	_handleUpgrade(e) {
		const t = e.target.result.createObjectStore('cache-entries', { keyPath: 'id' });
		t.createIndex('cacheName', 'cacheName', { unique: !1 }),
			t.createIndex('timestamp', 'timestamp', { unique: !1 }),
			(async (e) => {
				await new Promise((t, s) => {
					const a = indexedDB.deleteDatabase(e);
					(a.onerror = () => {
						s(a.error);
					}),
						(a.onblocked = () => {
							s(new Error('Delete blocked'));
						}),
						(a.onsuccess = () => {
							t();
						});
				});
			})(this._cacheName);
	}

	async setTimestamp(e, t) {
		const s = { url: (e = Q(e)), timestamp: t, cacheName: this._cacheName, id: this._getId(e) };
		await this._db.put('cache-entries', s);
	}

	async getTimestamp(e) {
		return (await this._db.get('cache-entries', this._getId(e))).timestamp;
	}

	async expireEntries(e, t) {
		const s = await this._db.transaction('cache-entries', 'readwrite', (s, a) => {
			const n = s.objectStore('cache-entries').index('timestamp').openCursor(null, 'prev');
			const r = [];
			let i = 0;
			n.onsuccess = () => {
				const s = n.result;
				if (s) {
					const a = s.value;
					a.cacheName === this._cacheName && ((e && a.timestamp < e) || (t && i >= t) ? r.push(s.value) : i++),
						s.continue();
				} else a(r);
			};
		});
		const a = [];
		for (const n of s) await this._db.delete('cache-entries', n.id), a.push(n.url);
		return a;
	}

	_getId(e) {
		return `${this._cacheName}|${Q(e)}`;
	}
}
class $ {
	constructor(e, t = {}) {
		(this._isRunning = !1),
			(this._rerunRequested = !1),
			(this._maxEntries = t.maxEntries),
			(this._maxAgeSeconds = t.maxAgeSeconds),
			(this._matchOptions = t.matchOptions),
			(this._cacheName = e),
			(this._timestampModel = new G(e));
	}

	async expireEntries() {
		if (this._isRunning) return void (this._rerunRequested = !0);
		this._isRunning = !0;
		const e = this._maxAgeSeconds ? Date.now() - 1e3 * this._maxAgeSeconds : 0;
		const t = await this._timestampModel.expireEntries(e, this._maxEntries);
		const s = await self.caches.open(this._cacheName);
		for (const a of t) await s.delete(a, this._matchOptions);
		(this._isRunning = !1), this._rerunRequested && ((this._rerunRequested = !1), W(this.expireEntries()));
	}

	async updateTimestamp(e) {
		await this._timestampModel.setTimestamp(e, Date.now());
	}

	async isURLExpired(e) {
		if (this._maxAgeSeconds) {
			return (await this._timestampModel.getTimestamp(e)) < Date.now() - 1e3 * this._maxAgeSeconds;
		}
		return !1;
	}

	async delete() {
		(this._rerunRequested = !1), await this._timestampModel.expireEntries(1 / 0);
	}
}
class V {
	constructor(e = {}) {
		let t;
		(this.cachedResponseWillBeUsed = async ({ event: e, request: t, cacheName: s, cachedResponse: a }) => {
			if (!a) return null;
			const n = this._isResponseDateFresh(a);
			const r = this._getCacheExpiration(s);
			W(r.expireEntries());
			const i = r.updateTimestamp(t.url);
			if (e)
				try {
					e.waitUntil(i);
				} catch (c) {}
			return n ? a : null;
		}),
			(this.cacheDidUpdate = async ({ cacheName: e, request: t }) => {
				const s = this._getCacheExpiration(e);
				await s.updateTimestamp(t.url), await s.expireEntries();
			}),
			(this._config = e),
			(this._maxAgeSeconds = e.maxAgeSeconds),
			(this._cacheExpirations = new Map()),
			e.purgeOnQuotaError && ((t = () => this.deleteCacheAndMetadata()), U.add(t));
	}

	_getCacheExpiration(e) {
		if (e === g()) throw new l('expire-custom-caches-only');
		let t = this._cacheExpirations.get(e);
		return t || ((t = new $(e, this._config)), this._cacheExpirations.set(e, t)), t;
	}

	_isResponseDateFresh(e) {
		if (!this._maxAgeSeconds) return !0;
		const t = this._getDateHeaderTimestamp(e);
		if (t === null) return !0;
		return t >= Date.now() - 1e3 * this._maxAgeSeconds;
	}

	_getDateHeaderTimestamp(e) {
		if (!e.headers.has('date')) return null;
		const t = e.headers.get('date');
		const s = new Date(t).getTime();
		return isNaN(s) ? null : s;
	}

	async deleteCacheAndMetadata() {
		for (const [e, t] of this._cacheExpirations) await self.caches.delete(e), await t.delete();
		this._cacheExpirations = new Map();
	}
}
try {
	self['workbox:cacheable-response:6.1.5'] && _();
} catch (ee) {}
class J {
	constructor(e = {}) {
		(this._statuses = e.statuses), (this._headers = e.headers);
	}

	isResponseCacheable(e) {
		let t = !0;
		return (
			this._statuses && (t = this._statuses.includes(e.status)),
			this._headers && t && (t = Object.keys(this._headers).some((t) => e.headers.get(t) === this._headers[t])),
			t
		);
	}
}
let z;
let X;
p({ prefix: 'djs', suffix: 'v3', precache: 'precache', runtime: 'runtime' }),
	caches.delete('djs-precache-v1'),
	caches.delete('djs-cdn-v1'),
	caches.delete('djs-external-v1'),
	caches.delete('djs-docs-v1'),
	(function (e) {
		P().precache(e);
	})([
		{ revision: '342a859d9ac838e641dad9c346ef75e6', url: './assets/[...all].b7433654.js' },
		{ revision: 'e4ee30d0fc6168e33844e71af88991e0', url: './assets/[class].1594c02c.js' },
		{ revision: '3daa89a40a51671c07008ebd0c51828c', url: './assets/[class].32241939.css' },
		{ revision: 'f59af218dce066bfb7a5527879b053aa', url: './assets/[file].a587c2b9.js' },
		{ revision: 'fe9ffd05502dd60aa6712e68f15df881', url: './assets/[typedef].d826f794.js' },
		{ revision: 'a848a7fe5442591ba9fd285c5ea7258c', url: './assets/chevron-down.ba5bc4fc.js' },
		{ revision: 'eb785ac203dda36049c68d17671c1b52', url: './assets/docs.5a672fae.css' },
		{ revision: 'c158ee17b7a9f36ad76317647815e724', url: './assets/docs.62f036c5.js' },
		{ revision: 'f1b732c6ad1cff374c008e8f85ac93e3', url: './assets/headlessui.esm.83123edc.js' },
		{ revision: '2868c0c2c3e4f901971fe4b9c3985dec', url: './assets/index.6c282508.js' },
		{ revision: 'a10d406bc40a338ea7e44272cf45a9cb', url: './assets/index.8188dd96.js' },
		{ revision: '96ec497fd3e49283c6eb7a1dd562e4f6', url: './assets/index.8c6d65a9.css' },
		{ revision: '85318940f0219997c7e2b0fb96a835ee', url: './assets/search.055dc457.css' },
		{ revision: '8243a23c346353d833b6ac054958c017', url: './assets/search.83614047.js' },
		{
			revision: '43521ec5c448d0cf3d04cf45d245a1c0',
			url: './assets/See.vue_vue&type=script&setup=true&lang.9c59f874.css',
		},
		{
			revision: '919c40b96eba4a772ea000979f96d525',
			url: './assets/See.vue_vue&type=script&setup=true&lang.d86df4e1.js',
		},
		{
			revision: 'b97894229cdff817f0b8646c26e5eb31',
			url: './assets/SourceButton.vue_vue&type=script&setup=true&lang.6b8dcc98.js',
		},
		{ revision: '54f81455561049f59a226ec21e2968c7', url: './assets/Spinner.af24072b.css' },
		{ revision: '9fe7392b9780503b28bcbb15ec80ec29', url: './assets/Spinner.ee5f11f6.js' },
		{ revision: '0f4af853e8ab33a53f08edf6f3a5fdf5', url: './assets/vendor.5101602c.js' },
		{ revision: 'de5a310bc2ff23e89c3f9d64ede4cf28', url: 'index.html' },
		{ revision: '399792787f22d2d23920f097016e0587', url: 'service-worker.js' },
	]),
	(function (e) {
		const t = P();
		D(new I(t, e));
	})(z),
	self.addEventListener('activate', (e) => {
		const t = f();
		e.waitUntil(
			(async (e, t = '-precache-') => {
				const s = (await self.caches.keys()).filter(
					(s) => s.includes(t) && s.includes(self.registration.scope) && s !== e,
				);
				return await Promise.all(s.map((e) => self.caches.delete(e))), s;
			})(t).then((e) => {}),
		);
	}),
	D(
		new (class extends O {
			constructor(e, { allowlist: t = [/./], denylist: s = [] } = {}) {
				super((e) => this._match(e), e), (this._allowlist = t), (this._denylist = s);
			}

			_match({ url: e, request: t }) {
				if (t && t.mode !== 'navigate') return !1;
				const s = e.pathname + e.search;
				for (const a of this._denylist) if (a.test(s)) return !1;
				return Boolean(this._allowlist.some((e) => e.test(s)));
			}
		})(((X = 'index.html'), P().createHandlerBoundToURL(X))),
	);
const Y = new (class extends k {
	constructor(e) {
		super(e), this.plugins.some((e) => 'cacheWillUpdate' in e) || this.plugins.unshift(B);
	}

	async _handle(e, t) {
		const s = t.fetchAndCachePut(e).catch(() => {});
		let a;
		let n = await t.cacheMatch(e);
		if (n);
		else
			try {
				n = await s;
			} catch (r) {
				a = r;
			}
		if (!n) throw new l('no-response', { url: e.url, error: a });
		return n;
	}
})({
	cacheName: 'djs-external-v3',
	plugins: [
		new V({ maxEntries: 50, maxAgeSeconds: 86400, purgeOnQuotaError: !0 }),
		new (class {
			constructor(e) {
				(this.cacheWillUpdate = async ({ response: e }) => (this._cacheableResponse.isResponseCacheable(e) ? e : null)),
					(this._cacheableResponse = new J(e));
			}
		})({ statuses: [0, 200] }),
	],
});
let Z;
(Z = (e) => (e.request.method === 'GET' ? Y.handle(e) : fetch(e.request))),
	j().setDefaultHandler(Z),
	D(
		/^https:\/\/raw\.githubusercontent\.com\/discordjs\/.*\.json/i,
		new (class extends k {
			constructor(e = {}) {
				super(e),
					this.plugins.some((e) => 'cacheWillUpdate' in e) || this.plugins.unshift(B),
					(this._networkTimeoutSeconds = e.networkTimeoutSeconds || 0);
			}

			async _handle(e, t) {
				const s = [];
				const a = [];
				let n;
				if (this._networkTimeoutSeconds) {
					const { id: r, promise: i } = this._getTimeoutPromise({ request: e, logs: s, handler: t });
					(n = r), a.push(i);
				}
				const r = this._getNetworkPromise({ timeoutId: n, request: e, logs: s, handler: t });
				a.push(r);
				const i = await t.waitUntil((async () => (await t.waitUntil(Promise.race(a))) || (await r))());
				if (!i) throw new l('no-response', { url: e.url });
				return i;
			}

			_getTimeoutPromise({ request: e, logs: t, handler: s }) {
				let a;
				return {
					promise: new Promise((t) => {
						a = setTimeout(async () => {
							t(await s.cacheMatch(e));
						}, 1e3 * this._networkTimeoutSeconds);
					}),
					id: a,
				};
			}

			async _getNetworkPromise({ timeoutId: e, request: t, logs: s, handler: a }) {
				let n;
				let r;
				try {
					r = await a.fetchAndCachePut(t);
				} catch (i) {
					n = i;
				}
				return e && clearTimeout(e), (!n && r) || (r = await a.cacheMatch(t)), r;
			}
		})({ cacheName: 'dgs-docs', plugins: [new V({ maxEntries: 20, maxAgeSeconds: 604800, purgeOnQuotaError: !0 })] }),
	),
	D(
		/^.*\\.(png|jpg|jpeg|gif|svg|ico)/i,
		new (class extends k {
			async _handle(e, t) {
				let s;
				let a = await t.cacheMatch(e);
				if (!a)
					try {
						a = await t.fetchAndCachePut(e);
					} catch (n) {
						s = n;
					}
				if (!a) throw new l('no-response', { url: e.url, error: s });
				return a;
			}
		})({
			cacheName: 'djs-media-v3',
			plugins: [new V({ maxEntries: 50, maxAgeSeconds: 86400, purgeOnQuotaError: !0 })],
		}),
	),
	self.addEventListener('install', () => {
		self.skipWaiting();
	}),
	self.addEventListener('message', (e) => {
		e.data && e.data.type === 'SKIP_WAITING' && self.skipWaiting();
	});
