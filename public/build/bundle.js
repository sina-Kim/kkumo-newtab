
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35730/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    /* src/Searchbar.svelte generated by Svelte v3.46.4 */

    const file$2 = "src/Searchbar.svelte";

    function create_fragment$2(ctx) {
    	let div4;
    	let form;
    	let div3;
    	let div0;
    	let input;
    	let t0;
    	let div2;
    	let button;
    	let div1;
    	let t1;
    	let span;

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			form = element("form");
    			div3 = element("div");
    			div0 = element("div");
    			input = element("input");
    			t0 = space();
    			div2 = element("div");
    			button = element("button");
    			div1 = element("div");
    			t1 = space();
    			span = element("span");
    			attr_dev(input, "type", "text");
    			attr_dev(input, "placeholder", "Search");
    			input.required = true;
    			attr_dev(input, "class", "svelte-8df9df");
    			add_location(input, file$2, 8, 8, 214);
    			attr_dev(div0, "class", "td svelte-8df9df");
    			add_location(div0, file$2, 7, 6, 189);
    			attr_dev(div1, "id", "s-circle");
    			attr_dev(div1, "class", "svelte-8df9df");
    			add_location(div1, file$2, 12, 10, 356);
    			attr_dev(span, "class", "svelte-8df9df");
    			add_location(span, file$2, 13, 10, 388);
    			attr_dev(button, "type", "submit");
    			attr_dev(button, "class", "svelte-8df9df");
    			add_location(button, file$2, 11, 8, 323);
    			attr_dev(div2, "class", "td svelte-8df9df");
    			attr_dev(div2, "id", "s-cover");
    			add_location(div2, file$2, 10, 6, 285);
    			attr_dev(div3, "class", "tb svelte-8df9df");
    			add_location(div3, file$2, 6, 4, 166);
    			attr_dev(form, "method", "GET");
    			attr_dev(form, "action", "http://www.google.co.kr/search?p=");
    			attr_dev(form, "class", "svelte-8df9df");
    			add_location(form, file$2, 5, 2, 99);
    			attr_dev(div4, "id", "KkumoSearchbar");
    			attr_dev(div4, "class", "svelte-8df9df");
    			add_location(div4, file$2, 4, 0, 71);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, form);
    			append_dev(form, div3);
    			append_dev(div3, div0);
    			append_dev(div0, input);
    			append_dev(div3, t0);
    			append_dev(div3, div2);
    			append_dev(div2, button);
    			append_dev(button, div1);
    			append_dev(button, t1);
    			append_dev(button, span);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Searchbar', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Searchbar> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Searchbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Searchbar",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    var SECONDS_A_MINUTE = 60;
    var SECONDS_A_HOUR = SECONDS_A_MINUTE * 60;
    var SECONDS_A_DAY = SECONDS_A_HOUR * 24;
    var SECONDS_A_WEEK = SECONDS_A_DAY * 7;
    var MILLISECONDS_A_SECOND = 1e3;
    var MILLISECONDS_A_MINUTE = SECONDS_A_MINUTE * MILLISECONDS_A_SECOND;
    var MILLISECONDS_A_HOUR = SECONDS_A_HOUR * MILLISECONDS_A_SECOND;
    var MILLISECONDS_A_DAY = SECONDS_A_DAY * MILLISECONDS_A_SECOND;
    var MILLISECONDS_A_WEEK = SECONDS_A_WEEK * MILLISECONDS_A_SECOND; // English locales

    var MS = 'millisecond';
    var S = 'second';
    var MIN = 'minute';
    var H = 'hour';
    var D = 'day';
    var W = 'week';
    var M = 'month';
    var Q = 'quarter';
    var Y = 'year';
    var DATE = 'date';
    var FORMAT_DEFAULT = 'YYYY-MM-DDTHH:mm:ssZ';
    var INVALID_DATE_STRING = 'Invalid Date'; // regex

    var REGEX_PARSE = /^(\d{4})[-/]?(\d{1,2})?[-/]?(\d{0,2})[Tt\s]*(\d{1,2})?:?(\d{1,2})?:?(\d{1,2})?[.:]?(\d+)?$/;
    var REGEX_FORMAT = /\[([^\]]+)]|Y{1,4}|M{1,4}|D{1,2}|d{1,4}|H{1,2}|h{1,2}|a|A|m{1,2}|s{1,2}|Z{1,2}|SSS/g;

    // English [en]
    // We don't need weekdaysShort, weekdaysMin, monthsShort in en.js locale
    var en = {
      name: 'en',
      weekdays: 'Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday'.split('_'),
      months: 'January_February_March_April_May_June_July_August_September_October_November_December'.split('_')
    };

    var padStart = function padStart(string, length, pad) {
      var s = String(string);
      if (!s || s.length >= length) return string;
      return "" + Array(length + 1 - s.length).join(pad) + string;
    };

    var padZoneStr = function padZoneStr(instance) {
      var negMinutes = -instance.utcOffset();
      var minutes = Math.abs(negMinutes);
      var hourOffset = Math.floor(minutes / 60);
      var minuteOffset = minutes % 60;
      return "" + (negMinutes <= 0 ? '+' : '-') + padStart(hourOffset, 2, '0') + ":" + padStart(minuteOffset, 2, '0');
    };

    var monthDiff = function monthDiff(a, b) {
      // function from moment.js in order to keep the same result
      if (a.date() < b.date()) return -monthDiff(b, a);
      var wholeMonthDiff = (b.year() - a.year()) * 12 + (b.month() - a.month());
      var anchor = a.clone().add(wholeMonthDiff, M);
      var c = b - anchor < 0;
      var anchor2 = a.clone().add(wholeMonthDiff + (c ? -1 : 1), M);
      return +(-(wholeMonthDiff + (b - anchor) / (c ? anchor - anchor2 : anchor2 - anchor)) || 0);
    };

    var absFloor = function absFloor(n) {
      return n < 0 ? Math.ceil(n) || 0 : Math.floor(n);
    };

    var prettyUnit = function prettyUnit(u) {
      var special = {
        M: M,
        y: Y,
        w: W,
        d: D,
        D: DATE,
        h: H,
        m: MIN,
        s: S,
        ms: MS,
        Q: Q
      };
      return special[u] || String(u || '').toLowerCase().replace(/s$/, '');
    };

    var isUndefined = function isUndefined(s) {
      return s === undefined;
    };

    var U = {
      s: padStart,
      z: padZoneStr,
      m: monthDiff,
      a: absFloor,
      p: prettyUnit,
      u: isUndefined
    };

    var L = 'en'; // global locale

    var Ls = {}; // global loaded locale

    Ls[L] = en;

    var isDayjs = function isDayjs(d) {
      return d instanceof Dayjs;
    }; // eslint-disable-line no-use-before-define


    var parseLocale = function parseLocale(preset, object, isLocal) {
      var l;
      if (!preset) return L;

      if (typeof preset === 'string') {
        if (Ls[preset]) {
          l = preset;
        }

        if (object) {
          Ls[preset] = object;
          l = preset;
        }
      } else {
        var name = preset.name;
        Ls[name] = preset;
        l = name;
      }

      if (!isLocal && l) L = l;
      return l || !isLocal && L;
    };

    var dayjs = function dayjs(date, c) {
      if (isDayjs(date)) {
        return date.clone();
      } // eslint-disable-next-line no-nested-ternary


      var cfg = typeof c === 'object' ? c : {};
      cfg.date = date;
      cfg.args = arguments; // eslint-disable-line prefer-rest-params

      return new Dayjs(cfg); // eslint-disable-line no-use-before-define
    };

    var wrapper = function wrapper(date, instance) {
      return dayjs(date, {
        locale: instance.$L,
        utc: instance.$u,
        x: instance.$x,
        $offset: instance.$offset // todo: refactor; do not use this.$offset in you code

      });
    };

    var Utils = U; // for plugin use

    Utils.l = parseLocale;
    Utils.i = isDayjs;
    Utils.w = wrapper;

    var parseDate = function parseDate(cfg) {
      var date = cfg.date,
          utc = cfg.utc;
      if (date === null) return new Date(NaN); // null is invalid

      if (Utils.u(date)) return new Date(); // today

      if (date instanceof Date) return new Date(date);

      if (typeof date === 'string' && !/Z$/i.test(date)) {
        var d = date.match(REGEX_PARSE);

        if (d) {
          var m = d[2] - 1 || 0;
          var ms = (d[7] || '0').substring(0, 3);

          if (utc) {
            return new Date(Date.UTC(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms));
          }

          return new Date(d[1], m, d[3] || 1, d[4] || 0, d[5] || 0, d[6] || 0, ms);
        }
      }

      return new Date(date); // everything else
    };

    var Dayjs = /*#__PURE__*/function () {
      function Dayjs(cfg) {
        this.$L = parseLocale(cfg.locale, null, true);
        this.parse(cfg); // for plugin
      }

      var _proto = Dayjs.prototype;

      _proto.parse = function parse(cfg) {
        this.$d = parseDate(cfg);
        this.$x = cfg.x || {};
        this.init();
      };

      _proto.init = function init() {
        var $d = this.$d;
        this.$y = $d.getFullYear();
        this.$M = $d.getMonth();
        this.$D = $d.getDate();
        this.$W = $d.getDay();
        this.$H = $d.getHours();
        this.$m = $d.getMinutes();
        this.$s = $d.getSeconds();
        this.$ms = $d.getMilliseconds();
      } // eslint-disable-next-line class-methods-use-this
      ;

      _proto.$utils = function $utils() {
        return Utils;
      };

      _proto.isValid = function isValid() {
        return !(this.$d.toString() === INVALID_DATE_STRING);
      };

      _proto.isSame = function isSame(that, units) {
        var other = dayjs(that);
        return this.startOf(units) <= other && other <= this.endOf(units);
      };

      _proto.isAfter = function isAfter(that, units) {
        return dayjs(that) < this.startOf(units);
      };

      _proto.isBefore = function isBefore(that, units) {
        return this.endOf(units) < dayjs(that);
      };

      _proto.$g = function $g(input, get, set) {
        if (Utils.u(input)) return this[get];
        return this.set(set, input);
      };

      _proto.unix = function unix() {
        return Math.floor(this.valueOf() / 1000);
      };

      _proto.valueOf = function valueOf() {
        // timezone(hour) * 60 * 60 * 1000 => ms
        return this.$d.getTime();
      };

      _proto.startOf = function startOf(units, _startOf) {
        var _this = this;

        // startOf -> endOf
        var isStartOf = !Utils.u(_startOf) ? _startOf : true;
        var unit = Utils.p(units);

        var instanceFactory = function instanceFactory(d, m) {
          var ins = Utils.w(_this.$u ? Date.UTC(_this.$y, m, d) : new Date(_this.$y, m, d), _this);
          return isStartOf ? ins : ins.endOf(D);
        };

        var instanceFactorySet = function instanceFactorySet(method, slice) {
          var argumentStart = [0, 0, 0, 0];
          var argumentEnd = [23, 59, 59, 999];
          return Utils.w(_this.toDate()[method].apply( // eslint-disable-line prefer-spread
          _this.toDate('s'), (isStartOf ? argumentStart : argumentEnd).slice(slice)), _this);
        };

        var $W = this.$W,
            $M = this.$M,
            $D = this.$D;
        var utcPad = "set" + (this.$u ? 'UTC' : '');

        switch (unit) {
          case Y:
            return isStartOf ? instanceFactory(1, 0) : instanceFactory(31, 11);

          case M:
            return isStartOf ? instanceFactory(1, $M) : instanceFactory(0, $M + 1);

          case W:
            {
              var weekStart = this.$locale().weekStart || 0;
              var gap = ($W < weekStart ? $W + 7 : $W) - weekStart;
              return instanceFactory(isStartOf ? $D - gap : $D + (6 - gap), $M);
            }

          case D:
          case DATE:
            return instanceFactorySet(utcPad + "Hours", 0);

          case H:
            return instanceFactorySet(utcPad + "Minutes", 1);

          case MIN:
            return instanceFactorySet(utcPad + "Seconds", 2);

          case S:
            return instanceFactorySet(utcPad + "Milliseconds", 3);

          default:
            return this.clone();
        }
      };

      _proto.endOf = function endOf(arg) {
        return this.startOf(arg, false);
      };

      _proto.$set = function $set(units, _int) {
        var _C$D$C$DATE$C$M$C$Y$C;

        // private set
        var unit = Utils.p(units);
        var utcPad = "set" + (this.$u ? 'UTC' : '');
        var name = (_C$D$C$DATE$C$M$C$Y$C = {}, _C$D$C$DATE$C$M$C$Y$C[D] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[DATE] = utcPad + "Date", _C$D$C$DATE$C$M$C$Y$C[M] = utcPad + "Month", _C$D$C$DATE$C$M$C$Y$C[Y] = utcPad + "FullYear", _C$D$C$DATE$C$M$C$Y$C[H] = utcPad + "Hours", _C$D$C$DATE$C$M$C$Y$C[MIN] = utcPad + "Minutes", _C$D$C$DATE$C$M$C$Y$C[S] = utcPad + "Seconds", _C$D$C$DATE$C$M$C$Y$C[MS] = utcPad + "Milliseconds", _C$D$C$DATE$C$M$C$Y$C)[unit];
        var arg = unit === D ? this.$D + (_int - this.$W) : _int;

        if (unit === M || unit === Y) {
          // clone is for badMutable plugin
          var date = this.clone().set(DATE, 1);
          date.$d[name](arg);
          date.init();
          this.$d = date.set(DATE, Math.min(this.$D, date.daysInMonth())).$d;
        } else if (name) this.$d[name](arg);

        this.init();
        return this;
      };

      _proto.set = function set(string, _int2) {
        return this.clone().$set(string, _int2);
      };

      _proto.get = function get(unit) {
        return this[Utils.p(unit)]();
      };

      _proto.add = function add(number, units) {
        var _this2 = this,
            _C$MIN$C$H$C$S$unit;

        number = Number(number); // eslint-disable-line no-param-reassign

        var unit = Utils.p(units);

        var instanceFactorySet = function instanceFactorySet(n) {
          var d = dayjs(_this2);
          return Utils.w(d.date(d.date() + Math.round(n * number)), _this2);
        };

        if (unit === M) {
          return this.set(M, this.$M + number);
        }

        if (unit === Y) {
          return this.set(Y, this.$y + number);
        }

        if (unit === D) {
          return instanceFactorySet(1);
        }

        if (unit === W) {
          return instanceFactorySet(7);
        }

        var step = (_C$MIN$C$H$C$S$unit = {}, _C$MIN$C$H$C$S$unit[MIN] = MILLISECONDS_A_MINUTE, _C$MIN$C$H$C$S$unit[H] = MILLISECONDS_A_HOUR, _C$MIN$C$H$C$S$unit[S] = MILLISECONDS_A_SECOND, _C$MIN$C$H$C$S$unit)[unit] || 1; // ms

        var nextTimeStamp = this.$d.getTime() + number * step;
        return Utils.w(nextTimeStamp, this);
      };

      _proto.subtract = function subtract(number, string) {
        return this.add(number * -1, string);
      };

      _proto.format = function format(formatStr) {
        var _this3 = this;

        var locale = this.$locale();
        if (!this.isValid()) return locale.invalidDate || INVALID_DATE_STRING;
        var str = formatStr || FORMAT_DEFAULT;
        var zoneStr = Utils.z(this);
        var $H = this.$H,
            $m = this.$m,
            $M = this.$M;
        var weekdays = locale.weekdays,
            months = locale.months,
            meridiem = locale.meridiem;

        var getShort = function getShort(arr, index, full, length) {
          return arr && (arr[index] || arr(_this3, str)) || full[index].substr(0, length);
        };

        var get$H = function get$H(num) {
          return Utils.s($H % 12 || 12, num, '0');
        };

        var meridiemFunc = meridiem || function (hour, minute, isLowercase) {
          var m = hour < 12 ? 'AM' : 'PM';
          return isLowercase ? m.toLowerCase() : m;
        };

        var matches = {
          YY: String(this.$y).slice(-2),
          YYYY: this.$y,
          M: $M + 1,
          MM: Utils.s($M + 1, 2, '0'),
          MMM: getShort(locale.monthsShort, $M, months, 3),
          MMMM: getShort(months, $M),
          D: this.$D,
          DD: Utils.s(this.$D, 2, '0'),
          d: String(this.$W),
          dd: getShort(locale.weekdaysMin, this.$W, weekdays, 2),
          ddd: getShort(locale.weekdaysShort, this.$W, weekdays, 3),
          dddd: weekdays[this.$W],
          H: String($H),
          HH: Utils.s($H, 2, '0'),
          h: get$H(1),
          hh: get$H(2),
          a: meridiemFunc($H, $m, true),
          A: meridiemFunc($H, $m, false),
          m: String($m),
          mm: Utils.s($m, 2, '0'),
          s: String(this.$s),
          ss: Utils.s(this.$s, 2, '0'),
          SSS: Utils.s(this.$ms, 3, '0'),
          Z: zoneStr // 'ZZ' logic below

        };
        return str.replace(REGEX_FORMAT, function (match, $1) {
          return $1 || matches[match] || zoneStr.replace(':', '');
        }); // 'ZZ'
      };

      _proto.utcOffset = function utcOffset() {
        // Because a bug at FF24, we're rounding the timezone offset around 15 minutes
        // https://github.com/moment/moment/pull/1871
        return -Math.round(this.$d.getTimezoneOffset() / 15) * 15;
      };

      _proto.diff = function diff(input, units, _float) {
        var _C$Y$C$M$C$Q$C$W$C$D$;

        var unit = Utils.p(units);
        var that = dayjs(input);
        var zoneDelta = (that.utcOffset() - this.utcOffset()) * MILLISECONDS_A_MINUTE;
        var diff = this - that;
        var result = Utils.m(this, that);
        result = (_C$Y$C$M$C$Q$C$W$C$D$ = {}, _C$Y$C$M$C$Q$C$W$C$D$[Y] = result / 12, _C$Y$C$M$C$Q$C$W$C$D$[M] = result, _C$Y$C$M$C$Q$C$W$C$D$[Q] = result / 3, _C$Y$C$M$C$Q$C$W$C$D$[W] = (diff - zoneDelta) / MILLISECONDS_A_WEEK, _C$Y$C$M$C$Q$C$W$C$D$[D] = (diff - zoneDelta) / MILLISECONDS_A_DAY, _C$Y$C$M$C$Q$C$W$C$D$[H] = diff / MILLISECONDS_A_HOUR, _C$Y$C$M$C$Q$C$W$C$D$[MIN] = diff / MILLISECONDS_A_MINUTE, _C$Y$C$M$C$Q$C$W$C$D$[S] = diff / MILLISECONDS_A_SECOND, _C$Y$C$M$C$Q$C$W$C$D$)[unit] || diff; // milliseconds

        return _float ? result : Utils.a(result);
      };

      _proto.daysInMonth = function daysInMonth() {
        return this.endOf(M).$D;
      };

      _proto.$locale = function $locale() {
        // get locale object
        return Ls[this.$L];
      };

      _proto.locale = function locale(preset, object) {
        if (!preset) return this.$L;
        var that = this.clone();
        var nextLocaleName = parseLocale(preset, object, true);
        if (nextLocaleName) that.$L = nextLocaleName;
        return that;
      };

      _proto.clone = function clone() {
        return Utils.w(this.$d, this);
      };

      _proto.toDate = function toDate() {
        return new Date(this.valueOf());
      };

      _proto.toJSON = function toJSON() {
        return this.isValid() ? this.toISOString() : null;
      };

      _proto.toISOString = function toISOString() {
        // ie 8 return
        // new Dayjs(this.valueOf() + this.$d.getTimezoneOffset() * 60000)
        // .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
        return this.$d.toISOString();
      };

      _proto.toString = function toString() {
        return this.$d.toUTCString();
      };

      return Dayjs;
    }();

    var proto = Dayjs.prototype;
    dayjs.prototype = proto;
    [['$ms', MS], ['$s', S], ['$m', MIN], ['$H', H], ['$W', D], ['$M', M], ['$y', Y], ['$D', DATE]].forEach(function (g) {
      proto[g[1]] = function (input) {
        return this.$g(input, g[0], g[1]);
      };
    });

    dayjs.extend = function (plugin, option) {
      if (!plugin.$i) {
        // install plugin only once
        plugin(option, Dayjs, dayjs);
        plugin.$i = true;
      }

      return dayjs;
    };

    dayjs.locale = parseLocale;
    dayjs.isDayjs = isDayjs;

    dayjs.unix = function (timestamp) {
      return dayjs(timestamp * 1e3);
    };

    dayjs.en = Ls[L];
    dayjs.Ls = Ls;
    dayjs.p = {};

    var relativeTime = (function (o, c, d) {
      o = o || {};
      var proto = c.prototype;
      var relObj = {
        future: 'in %s',
        past: '%s ago',
        s: 'a few seconds',
        m: 'a minute',
        mm: '%d minutes',
        h: 'an hour',
        hh: '%d hours',
        d: 'a day',
        dd: '%d days',
        M: 'a month',
        MM: '%d months',
        y: 'a year',
        yy: '%d years'
      };
      d.en.relativeTime = relObj;

      proto.fromToBase = function (input, withoutSuffix, instance, isFrom, postFormat) {
        var loc = instance.$locale().relativeTime || relObj;
        var T = o.thresholds || [{
          l: 's',
          r: 44,
          d: S
        }, {
          l: 'm',
          r: 89
        }, {
          l: 'mm',
          r: 44,
          d: MIN
        }, {
          l: 'h',
          r: 89
        }, {
          l: 'hh',
          r: 21,
          d: H
        }, {
          l: 'd',
          r: 35
        }, {
          l: 'dd',
          r: 25,
          d: D
        }, {
          l: 'M',
          r: 45
        }, {
          l: 'MM',
          r: 10,
          d: M
        }, {
          l: 'y',
          r: 17
        }, {
          l: 'yy',
          d: Y
        }];
        var Tl = T.length;
        var result;
        var out;
        var isFuture;

        for (var i = 0; i < Tl; i += 1) {
          var t = T[i];

          if (t.d) {
            result = isFrom ? d(input).diff(instance, t.d, true) : instance.diff(input, t.d, true);
          }

          var abs = (o.rounding || Math.round)(Math.abs(result));
          isFuture = result > 0;

          if (abs <= t.r || !t.r) {
            if (abs <= 1 && i > 0) t = T[i - 1]; // 1 minutes -> a minute, 0 seconds -> 0 second

            var format = loc[t.l];

            if (postFormat) {
              abs = postFormat("" + abs);
            }

            if (typeof format === 'string') {
              out = format.replace('%d', abs);
            } else {
              out = format(abs, withoutSuffix, t.l, isFuture);
            }

            break;
          }
        }

        if (withoutSuffix) return out;
        var pastOrFuture = isFuture ? loc.future : loc.past;

        if (typeof pastOrFuture === 'function') {
          return pastOrFuture(out);
        }

        return pastOrFuture.replace('%s', out);
      };

      function fromTo(input, withoutSuffix, instance, isFrom) {
        return proto.fromToBase(input, withoutSuffix, instance, isFrom);
      }

      proto.to = function (input, withoutSuffix) {
        return fromTo(input, withoutSuffix, this, true);
      };

      proto.from = function (input, withoutSuffix) {
        return fromTo(input, withoutSuffix, this);
      };

      var makeNow = function makeNow(thisDay) {
        return thisDay.$u ? d.utc() : d();
      };

      proto.toNow = function (withoutSuffix) {
        return this.to(makeNow(this), withoutSuffix);
      };

      proto.fromNow = function (withoutSuffix) {
        return this.from(makeNow(this), withoutSuffix);
      };
    });

    dayjs.extend(relativeTime);

    /* node_modules/svelte-time/src/Time.svelte generated by Svelte v3.46.4 */
    const file$1 = "node_modules/svelte-time/src/Time.svelte";

    function create_fragment$1(ctx) {
    	let time;
    	let t;

    	let time_levels = [
    		/*$$restProps*/ ctx[3],
    		{ title: /*title*/ ctx[2] },
    		{ datetime: /*timestamp*/ ctx[1] }
    	];

    	let time_data = {};

    	for (let i = 0; i < time_levels.length; i += 1) {
    		time_data = assign(time_data, time_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			time = element("time");
    			t = text(/*formatted*/ ctx[0]);
    			set_attributes(time, time_data);
    			add_location(time, file$1, 60, 0, 1479);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, time, anchor);
    			append_dev(time, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*formatted*/ 1) set_data_dev(t, /*formatted*/ ctx[0]);

    			set_attributes(time, time_data = get_spread_update(time_levels, [
    				dirty & /*$$restProps*/ 8 && /*$$restProps*/ ctx[3],
    				dirty & /*title*/ 4 && { title: /*title*/ ctx[2] },
    				dirty & /*timestamp*/ 2 && { datetime: /*timestamp*/ ctx[1] }
    			]));
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(time);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let title;
    	const omit_props_names = ["timestamp","format","relative","live","formatted"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Time', slots, []);
    	let { timestamp = new Date().toISOString() } = $$props;
    	let { format = "MMM DD, YYYY" } = $$props;
    	let { relative = false } = $$props;
    	let { live = false } = $$props;
    	let { formatted = "" } = $$props;
    	let interval = undefined;
    	const DEFAULT_INTERVAL = 60 * 1000;

    	onMount(() => {
    		if (relative && live !== false) {
    			interval = setInterval(
    				() => {
    					$$invalidate(0, formatted = dayjs(timestamp).from());
    				},
    				Math.abs(typeof live === "number" ? live : DEFAULT_INTERVAL)
    			);
    		}

    		return () => {
    			if (typeof interval === "number") {
    				clearInterval(interval);
    			}
    		};
    	});

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(3, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ('timestamp' in $$new_props) $$invalidate(1, timestamp = $$new_props.timestamp);
    		if ('format' in $$new_props) $$invalidate(4, format = $$new_props.format);
    		if ('relative' in $$new_props) $$invalidate(5, relative = $$new_props.relative);
    		if ('live' in $$new_props) $$invalidate(6, live = $$new_props.live);
    		if ('formatted' in $$new_props) $$invalidate(0, formatted = $$new_props.formatted);
    	};

    	$$self.$capture_state = () => ({
    		timestamp,
    		format,
    		relative,
    		live,
    		formatted,
    		dayjs,
    		onMount,
    		interval,
    		DEFAULT_INTERVAL,
    		title
    	});

    	$$self.$inject_state = $$new_props => {
    		if ('timestamp' in $$props) $$invalidate(1, timestamp = $$new_props.timestamp);
    		if ('format' in $$props) $$invalidate(4, format = $$new_props.format);
    		if ('relative' in $$props) $$invalidate(5, relative = $$new_props.relative);
    		if ('live' in $$props) $$invalidate(6, live = $$new_props.live);
    		if ('formatted' in $$props) $$invalidate(0, formatted = $$new_props.formatted);
    		if ('interval' in $$props) interval = $$new_props.interval;
    		if ('title' in $$props) $$invalidate(2, title = $$new_props.title);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*relative, timestamp, format*/ 50) {
    			$$invalidate(0, formatted = relative
    			? dayjs(timestamp).from()
    			: dayjs(timestamp).format(format));
    		}

    		if ($$self.$$.dirty & /*relative, timestamp*/ 34) {
    			$$invalidate(2, title = relative ? timestamp : undefined);
    		}
    	};

    	return [formatted, timestamp, title, $$restProps, format, relative, live];
    }

    class Time extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			timestamp: 1,
    			format: 4,
    			relative: 5,
    			live: 6,
    			formatted: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Time",
    			options,
    			id: create_fragment$1.name
    		});
    	}

    	get timestamp() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set timestamp(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get format() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set format(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get relative() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set relative(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get live() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set live(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get formatted() {
    		throw new Error("<Time>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set formatted(value) {
    		throw new Error("<Time>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/Appdanni.svelte generated by Svelte v3.46.4 */
    const file = "src/Appdanni.svelte";

    function create_fragment(ctx) {
    	let header;
    	let meta0;
    	let t0;
    	let meta1;
    	let t1;
    	let meta2;
    	let t2;
    	let script0;
    	let t3;
    	let main;
    	let div14;
    	let div5;
    	let div0;
    	let a0;
    	let t5;
    	let a1;
    	let t7;
    	let div4;
    	let div2;
    	let div1;
    	let span0;
    	let img0;
    	let t8;
    	let span1;
    	let t10;
    	let span2;
    	let t12;
    	let div3;
    	let t13;
    	let div6;
    	let a2;
    	let img1;
    	let img1_src_value;
    	let t14;
    	let div13;
    	let div8;
    	let div7;
    	let i0;
    	let t15;
    	let input0;
    	let t16;
    	let i1;
    	let t17;
    	let i2;
    	let t18;
    	let div9;
    	let input1;
    	let t19;
    	let input2;
    	let t20;
    	let div10;
    	let t21;
    	let div12;
    	let div11;
    	let t23;
    	let script1;
    	let script1_src_value;

    	const block = {
    		c: function create() {
    			header = element("header");
    			meta0 = element("meta");
    			t0 = space();
    			meta1 = element("meta");
    			t1 = space();
    			meta2 = element("meta");
    			t2 = space();
    			script0 = element("script");
    			t3 = space();
    			main = element("main");
    			div14 = element("div");
    			div5 = element("div");
    			div0 = element("div");
    			a0 = element("a");
    			a0.textContent = "설정";
    			t5 = space();
    			a1 = element("a");
    			a1.textContent = "밥";
    			t7 = space();
    			div4 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			span0 = element("span");
    			img0 = element("img");
    			t8 = space();
    			span1 = element("span");
    			span1.textContent = "H";
    			t10 = space();
    			span2 = element("span");
    			span2.textContent = "A";
    			t12 = space();
    			div3 = element("div");
    			t13 = space();
    			div6 = element("div");
    			a2 = element("a");
    			img1 = element("img");
    			t14 = space();
    			div13 = element("div");
    			div8 = element("div");
    			div7 = element("div");
    			i0 = element("i");
    			t15 = space();
    			input0 = element("input");
    			t16 = space();
    			i1 = element("i");
    			t17 = space();
    			i2 = element("i");
    			t18 = space();
    			div9 = element("div");
    			input1 = element("input");
    			t19 = space();
    			input2 = element("input");
    			t20 = space();
    			div10 = element("div");
    			t21 = space();
    			div12 = element("div");
    			div11 = element("div");
    			div11.textContent = "대한민국";
    			t23 = space();
    			script1 = element("script");
    			attr_dev(meta0, "charset", "UTF-8");
    			attr_dev(meta0, "class", "svelte-s2vshy");
    			add_location(meta0, file, 9, 4, 323);
    			attr_dev(meta1, "http-equiv", "X-UA-Compatible");
    			attr_dev(meta1, "content", "IE=edge");
    			attr_dev(meta1, "class", "svelte-s2vshy");
    			add_location(meta1, file, 10, 4, 352);
    			attr_dev(meta2, "name", "viewport");
    			attr_dev(meta2, "content", "width=device-width, initial-scale=1.0");
    			attr_dev(meta2, "class", "svelte-s2vshy");
    			add_location(meta2, file, 11, 4, 412);
    			attr_dev(script0, "crossorigin", "anonymous");
    			attr_dev(script0, "class", "svelte-s2vshy");
    			add_location(script0, file, 12, 4, 489);
    			attr_dev(header, "class", "svelte-s2vshy");
    			add_location(header, file, 8, 0, 310);
    			attr_dev(a0, "href", "");
    			attr_dev(a0, "class", "login svelte-s2vshy");
    			add_location(a0, file, 20, 16, 670);
    			attr_dev(a1, "href", "");
    			attr_dev(a1, "class", "login svelte-s2vshy");
    			add_location(a1, file, 21, 16, 718);
    			attr_dev(div0, "class", "lefticon svelte-s2vshy");
    			add_location(div0, file, 19, 12, 631);
    			attr_dev(img0, "src1", /*src1*/ ctx[1]);
    			attr_dev(img0, "alt", "danni");
    			attr_dev(img0, "class", "svelte-s2vshy");
    			add_location(img0, file, 27, 28, 969);
    			attr_dev(span0, "class", "weather svelte-s2vshy");
    			add_location(span0, file, 26, 24, 918);
    			attr_dev(span1, "class", "weather svelte-s2vshy");
    			add_location(span1, file, 29, 24, 1051);
    			attr_dev(span2, "class", "weather svelte-s2vshy");
    			add_location(span2, file, 30, 24, 1106);
    			attr_dev(div1, "class", "icon icon-weather svelte-s2vshy");
    			add_location(div1, file, 25, 20, 862);
    			attr_dev(div2, "class", "img nav-icon svelte-s2vshy");
    			add_location(div2, file, 24, 16, 815);
    			attr_dev(div3, "class", "img nav-icon svelte-s2vshy");
    			add_location(div3, file, 33, 16, 1203);
    			attr_dev(div4, "class", "icon svelte-s2vshy");
    			add_location(div4, file, 23, 12, 780);
    			attr_dev(div5, "class", "top svelte-s2vshy");
    			add_location(div5, file, 18, 8, 601);
    			if (!src_url_equal(img1.src, img1_src_value = /*src*/ ctx[0])) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "alt", "danni");
    			attr_dev(img1, "class", "svelte-s2vshy");
    			add_location(img1, file, 41, 16, 1388);
    			attr_dev(a2, "href", "");
    			attr_dev(a2, "class", "logo svelte-s2vshy");
    			add_location(a2, file, 40, 12, 1347);
    			attr_dev(div6, "class", "logo svelte-s2vshy");
    			add_location(div6, file, 39, 8, 1316);
    			attr_dev(i0, "class", "fas fa-search svelte-s2vshy");
    			add_location(i0, file, 47, 20, 1585);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "searchInput svelte-s2vshy");
    			add_location(input0, file, 48, 20, 1633);
    			attr_dev(i1, "class", "fas fa-keyboard svelte-s2vshy");
    			add_location(i1, file, 49, 20, 1695);
    			attr_dev(i2, "class", "fas fa-microphone svelte-s2vshy");
    			add_location(i2, file, 50, 20, 1745);
    			attr_dev(div7, "class", "inputBox svelte-s2vshy");
    			add_location(div7, file, 46, 16, 1542);
    			attr_dev(div8, "class", "inputZone inputZone-size svelte-s2vshy");
    			add_location(div8, file, 45, 12, 1487);
    			attr_dev(input1, "type", "button");
    			attr_dev(input1, "class", "clickBoxBtn one svelte-s2vshy");
    			input1.value = "Google 검엄색ㅇㅇ";
    			add_location(input1, file, 54, 16, 1870);
    			attr_dev(input2, "type", "button");
    			attr_dev(input2, "class", "clickBoxBtn two svelte-s2vshy");
    			input2.value = "ㅇㅇ";
    			add_location(input2, file, 59, 16, 2031);
    			attr_dev(div9, "class", "clickBox svelte-s2vshy");
    			add_location(div9, file, 53, 12, 1831);
    			attr_dev(div10, "class", "blank blank-size svelte-s2vshy");
    			add_location(div10, file, 61, 12, 2121);
    			attr_dev(div11, "class", "location svelte-s2vshy");
    			add_location(div11, file, 64, 16, 2225);
    			attr_dev(div12, "class", "footer svelte-s2vshy");
    			add_location(div12, file, 63, 12, 2188);
    			attr_dev(div13, "class", "search svelte-s2vshy");
    			add_location(div13, file, 44, 8, 1454);
    			attr_dev(div14, "class", "screen svelte-s2vshy");
    			add_location(div14, file, 16, 4, 553);
    			if (!src_url_equal(script1.src, script1_src_value = "index.js")) attr_dev(script1, "src", script1_src_value);
    			attr_dev(script1, "class", "svelte-s2vshy");
    			add_location(script1, file, 68, 4, 2307);
    			attr_dev(main, "class", "svelte-s2vshy");
    			add_location(main, file, 15, 0, 542);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, meta0);
    			append_dev(header, t0);
    			append_dev(header, meta1);
    			append_dev(header, t1);
    			append_dev(header, meta2);
    			append_dev(header, t2);
    			append_dev(header, script0);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, main, anchor);
    			append_dev(main, div14);
    			append_dev(div14, div5);
    			append_dev(div5, div0);
    			append_dev(div0, a0);
    			append_dev(div0, t5);
    			append_dev(div0, a1);
    			append_dev(div5, t7);
    			append_dev(div5, div4);
    			append_dev(div4, div2);
    			append_dev(div2, div1);
    			append_dev(div1, span0);
    			append_dev(span0, img0);
    			append_dev(div1, t8);
    			append_dev(div1, span1);
    			append_dev(div1, t10);
    			append_dev(div1, span2);
    			append_dev(div4, t12);
    			append_dev(div4, div3);
    			append_dev(div14, t13);
    			append_dev(div14, div6);
    			append_dev(div6, a2);
    			append_dev(a2, img1);
    			append_dev(div14, t14);
    			append_dev(div14, div13);
    			append_dev(div13, div8);
    			append_dev(div8, div7);
    			append_dev(div7, i0);
    			append_dev(div7, t15);
    			append_dev(div7, input0);
    			append_dev(div7, t16);
    			append_dev(div7, i1);
    			append_dev(div7, t17);
    			append_dev(div7, i2);
    			append_dev(div13, t18);
    			append_dev(div13, div9);
    			append_dev(div9, input1);
    			append_dev(div9, t19);
    			append_dev(div9, input2);
    			append_dev(div13, t20);
    			append_dev(div13, div10);
    			append_dev(div13, t21);
    			append_dev(div13, div12);
    			append_dev(div12, div11);
    			append_dev(main, t23);
    			append_dev(main, script1);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(main);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Appdanni', slots, []);
    	let name = "world";
    	let src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_color_272x92dp.png";
    	let src1 = "https://ssl.gstatic.com/onebox/weather/48/partly_cloudy.png";
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Appdanni> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ KkumoSearchbar: Searchbar, Time, name, src, src1 });

    	$$self.$inject_state = $$props => {
    		if ('name' in $$props) name = $$props.name;
    		if ('src' in $$props) $$invalidate(0, src = $$props.src);
    		if ('src1' in $$props) $$invalidate(1, src1 = $$props.src1);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [src, src1];
    }

    class Appdanni extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Appdanni",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* 
     * sina-Kim, 진입 파일을 확인해주세요. 
     * 기능 영역을 확인하기 위해 별도의 진입 파일 App2.svelte를 생성하였습니다.
    */

    var app = new Appdanni({
    	target: document.body
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
