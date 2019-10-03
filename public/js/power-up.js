// This is a backup of the power-up.min.js to track changes from trello

!function (t) {
    "function" == typeof define && define.amd ? define(t) : t()
}(function () {
    "use strict";

    function t(e) {
        return (t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(e)
    }

    function e(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function r(t, e) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }

    function n(t, e, n) {
        return e && r(t.prototype, e), n && r(t, n), t
    }

    function o(t) {
        return i(t) || s(t) || a()
    }

    function i(t) {
        if (Array.isArray(t)) {
            for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e];
            return r
        }
    }

    function s(t) {
        if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
    }

    function a() {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
    }

    var c = function () {
        var t = new Error("yep");
        return !!t.stack && "Error: yep\n" === t.stack.substr(0, 11)
    }, u = function (t, e, r) {
        var n = e;
        return r && (n += ": " + r), t = n + t.slice(t.indexOf("\n"))
    }, l = c();

    function h(t, e) {
        function r(e) {
            if (!(this instanceof r)) return new r(e);
            try {
                throw new Error(e)
            } catch (e) {
                e.name = t, this.stack = e.stack
            }
            l && this.stack && (this.stack = u(this.stack, t, e)), this.message = e || "", this.name = t
        }

        return r.prototype = new (e || Error), r.prototype.constructor = r, r.prototype.inspect = function () {
            return this.message ? "[" + t + ": " + this.message + "]" : "[" + t + "]"
        }, r.prototype.name = t, r
    }

    var f = h;

    function p(t) {
        if (this._capacity = _(t), this._length = 0, this._front = 0, d(t)) {
            for (var e = t.length, r = 0; r < e; ++r) this[r] = t[r];
            this._length = e
        }
    }

    p.prototype.toArray = function () {
        for (var t = this._length, e = new Array(t), r = this._front, n = this._capacity, o = 0; o < t; ++o) e[o] = this[r + o & n - 1];
        return e
    }, p.prototype.push = function (t) {
        var e = arguments.length, r = this._length;
        if (e > 1) {
            var n = this._capacity;
            if (r + e > n) {
                for (var o = 0; o < e; ++o) {
                    this._checkCapacity(r + 1), this[i = this._front + r & this._capacity - 1] = arguments[o], r++, this._length = r
                }
                return r
            }
            for (var i = this._front, o = 0; o < e; ++o) this[i + r & n - 1] = arguments[o], i++;
            return this._length = r + e, r + e
        }
        return 0 === e ? r : (this._checkCapacity(r + 1), this[o = this._front + r & this._capacity - 1] = t, this._length = r + 1, r + 1)
    }, p.prototype.pop = function () {
        var t = this._length;
        if (0 !== t) {
            var e = this._front + t - 1 & this._capacity - 1, r = this[e];
            return this[e] = void 0, this._length = t - 1, r
        }
    }, p.prototype.shift = function () {
        var t = this._length;
        if (0 !== t) {
            var e = this._front, r = this[e];
            return this[e] = void 0, this._front = e + 1 & this._capacity - 1, this._length = t - 1, r
        }
    }, p.prototype.unshift = function (t) {
        var e = this._length, r = arguments.length;
        if (r > 1) {
            if (e + r > (o = this._capacity)) {
                for (var n = r - 1; n >= 0; n--) {
                    this._checkCapacity(e + 1);
                    var o = this._capacity;
                    this[s = (this._front - 1 & o - 1 ^ o) - o] = arguments[n], e++, this._length = e, this._front = s
                }
                return e
            }
            var i = this._front;
            for (n = r - 1; n >= 0; n--) {
                var s;
                this[s = (i - 1 & o - 1 ^ o) - o] = arguments[n], i = s
            }
            return this._front = i, this._length = e + r, e + r
        }
        if (0 === r) return e;
        this._checkCapacity(e + 1);
        o = this._capacity;
        return this[n = (this._front - 1 & o - 1 ^ o) - o] = t, this._length = e + 1, this._front = n, e + 1
    }, p.prototype.peekBack = function () {
        var t = this._length;
        if (0 !== t) return this[this._front + t - 1 & this._capacity - 1]
    }, p.prototype.peekFront = function () {
        if (0 !== this._length) return this[this._front]
    }, p.prototype.get = function (t) {
        var e = t;
        if (e === (0 | e)) {
            var r = this._length;
            if (e < 0 && (e += r), !(e < 0 || e >= r)) return this[this._front + e & this._capacity - 1]
        }
    }, p.prototype.isEmpty = function () {
        return 0 === this._length
    }, p.prototype.clear = function () {
        for (var t = this._length, e = this._front, r = this._capacity, n = 0; n < t; ++n) this[e + n & r - 1] = void 0;
        this._length = 0, this._front = 0
    }, p.prototype.toString = function () {
        return this.toArray().toString()
    }, p.prototype.valueOf = p.prototype.toString, p.prototype.removeFront = p.prototype.shift, p.prototype.removeBack = p.prototype.pop, p.prototype.insertFront = p.prototype.unshift, p.prototype.insertBack = p.prototype.push, p.prototype.enqueue = p.prototype.push, p.prototype.dequeue = p.prototype.shift, p.prototype.toJSON = p.prototype.toArray, Object.defineProperty(p.prototype, "length", {
        get: function () {
            return this._length
        }, set: function () {
            throw new RangeError("")
        }
    }), p.prototype._checkCapacity = function (t) {
        this._capacity < t && this._resizeTo(_(1.5 * this._capacity + 16))
    }, p.prototype._resizeTo = function (t) {
        var e = this._capacity;
        this._capacity = t;
        var r = this._front, n = this._length;
        r + n > e && v(this, 0, this, e, r + n & e - 1)
    };
    var d = Array.isArray;

    function v(t, e, r, n, o) {
        for (var i = 0; i < o; ++i) r[i + n] = t[i + e], t[i + e] = void 0
    }

    function y(t) {
        return t >>>= 0, t -= 1, t |= t >> 1, t |= t >> 2, t |= t >> 4, t |= t >> 8, (t |= t >> 16) + 1
    }

    function _(t) {
        if ("number" != typeof t) {
            if (!d(t)) return 16;
            t = t.length
        }
        return y(Math.min(Math.max(16, t), 1073741824))
    }

    var g = p, m = b, w = Object.prototype.hasOwnProperty;

    function b() {
        for (var t = {}, e = 0; e < arguments.length; e++) {
            var r = arguments[e];
            for (var n in r) w.call(r, n) && (t[n] = r[n])
        }
        return t
    }

    function k(t) {
        return (k = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (t) {
            return typeof t
        } : function (t) {
            return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t
        })(t)
    }

    function E(t, e) {
        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
    }

    function C(t, e) {
        for (var r = 0; r < e.length; r++) {
            var n = e[r];
            n.enumerable = n.enumerable || !1, n.configurable = !0, "value" in n && (n.writable = !0), Object.defineProperty(t, n.key, n)
        }
    }

    function j(t, e, r) {
        return e && C(t.prototype, e), r && C(t, r), t
    }

    function A(t) {
        return S(t) || F(t) || x()
    }

    function S(t) {
        if (Array.isArray(t)) {
            for (var e = 0, r = new Array(t.length); e < t.length; e++) r[e] = t[e];
            return r
        }
    }

    function F(t) {
        if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
    }

    function x() {
        throw new TypeError("Invalid attempt to spread non-iterable instance")
    }

    var O = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz", T = "plugin disabled",
        P = "invalid context", R = "not handled", D = "unsupported command", I = function () {
            function t(e) {
                E(this, t), this.local = e.local, this.remote = e.remote, this.targetOrigin = e.targetOrigin, this.secret = e.secret, this.handlers = e.handlers, this.hostHandlers = e.hostHandlers, this.Promise = e.Promise || window.Promise, this.bufferSize = e.bufferSize || 256, this.strict = !!e.strict, this.helpfulStacks = !!e.helpfulStacks, this.Sentry = e.Sentry, this._seed = t.randomId(16), this._ctr = 0, this._pendingRequests = {}, this._messageQueues = new Map;
                try {
                    this._messageQueues.set(this.remote, new g(this.bufferSize))
                } catch (t) {
                    this._targetsFallback = {remote: this.remote}
                }
                this.listen()
            }

            return j(t, [{
                key: "_handleMessage", value: function (t, e) {
                    var r = this, n = t.data;
                    switch (t.type) {
                        case"request":
                            this._handleRequest(n.id, n.command, n.args, e);
                            break;
                        case"response":
                            this._handleResponse(n.to, n.success, n.response);
                            break;
                        case"bulk":
                            n.forEach(function (t) {
                                return r._handleMessage(t, e)
                            })
                    }
                }
            }, {
                key: "listen", value: function () {
                    var t = this;
                    this.stop(), this.listener = function (e) {
                        var r = e.source;
                        r !== t.remote && e.data.secret !== t.secret || t._handleMessage(e.data, r)
                    }, this.local.addEventListener("message", this.listener)
                }
            }, {
                key: "stop", value: function () {
                    this.local.removeEventListener("message", this.listener)
                }
            }, {
                key: "_handleRequest", value: function (e, r, n, o) {
                    var i = this, s = m(this.hostHandlers, {
                        PluginDisabled: t.PluginDisabled,
                        InvalidContext: t.InvalidContext,
                        NotHandled: t.NotHandled,
                        command: r,
                        args: n,
                        source: o,
                        request: function () {
                            for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
                            return i.request.apply(i, A(e.concat([o])))
                        },
                        secret: this.secret
                    });
                    this.Promise.try(function () {
                        if (!Object.prototype.hasOwnProperty.call(i.handlers, r)) throw new t.UnsupportedCommand("unsupported command: ".concat(r));
                        return i.handlers[r].apply(i, [s].concat(n))
                    }).then(function (t) {
                        i.respond(e, !0, t, o)
                    }).catch(function (t) {
                        i.Sentry && t.code !== R && i.Sentry.withScope(function (e) {
                            if (e.setTag("command", r), n && n[0] && n[0].context) {
                                var o = n[0].context;
                                e.setTag("idBoard", o.board), "object" === k(o.permissions) && Object.keys(o.permissions).forEach(function (t) {
                                    e.setExtra("".concat(t, "_permission"), o.permissions[t])
                                })
                            }
                            i.Sentry.captureException(t)
                        }), i.respond(e, !1, {code: t.code, message: t.message}, o)
                    })
                }
            }, {
                key: "_handleResponse", value: function (e, r, n) {
                    if (!Object.prototype.hasOwnProperty.call(this._pendingRequests, e)) return null;
                    var o = this._pendingRequests[e];
                    if (delete this._pendingRequests[e], r) return o.resolve(n);
                    var i = "".concat(n.message || "", " (Command: ").concat(o.command, ")");
                    switch (n.code) {
                        case T:
                            return o.reject(t.errorWithStack(t.PluginDisabled, i, o.stack));
                        case P:
                            return o.reject(t.errorWithStack(t.InvalidContext, i, o.stack));
                        case R:
                            return o.reject(t.errorWithStack(t.NotHandled, i, o.stack));
                        case D:
                            return o.reject(t.errorWithStack(t.UnsupportedCommand, i, o.stack));
                        default:
                            return o.reject(t.errorWithStack(Error, i, o.stack))
                    }
                }
            }, {
                key: "raw", value: function (e, r, n) {
                    var o = this;
                    if ("bulk" === e) {
                        var i = {data: r, secret: this.secret, type: e};
                        n && n !== this.remote ? n.postMessage(i, this.strict ? this.targetOrigin : "*") : this.remote.postMessage(i, this.targetOrigin)
                    } else {
                        var s = n || this.remote;
                        if (this._targetsFallback) if (n === this.remote) s = "remote"; else {
                            s = void 0;
                            for (var a = Object.keys(this._targetsFallback), c = 0; c < a.length; c++) {
                                var u = a[c];
                                if (this._targetsFallback[u] === n) {
                                    s = u;
                                    break
                                }
                            }
                            s || (s = t.randomId(8), this._targetsFallback[s] = n)
                        }
                        this._messageQueues.has(s) || this._messageQueues.set(s, new g(this.bufferSize));
                        var l = this._messageQueues.get(s);
                        l.isEmpty() && setTimeout(function () {
                            return o.emptyQueue(s)
                        }, 0), l.push({type: e, data: r})
                    }
                }
            }, {
                key: "emptyQueue", value: function (t) {
                    var e = this._messageQueues.get(t);
                    if (!e.isEmpty()) {
                        var r = e.toArray();
                        e.clear();
                        var n = "string" == typeof t ? this._targetsFallback[t] : t;
                        t !== this.remote && "remote" !== t && (this._messageQueues.delete(t), this._targetsFallback && delete this._targetsFallback[t]), this.raw("bulk", r, n)
                    }
                }
            }, {
                key: "request", value: function (t) {
                    var e = this;
                    this._ctr += 1;
                    for (var r = this._seed + this._ctr, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++) o[i - 1] = arguments[i];
                    var s, a = o[o.length - 1];
                    a && "function" == typeof a.postMessage && (s = o.pop());
                    var c = {args: o, command: t, id: r};
                    return this.helpfulStacks && (c.stack = (new Error).stack), this.raw("request", {
                        args: o,
                        command: t,
                        id: r
                    }, s), new this.Promise(function (t, n) {
                        c.resolve = t, c.reject = n, e._pendingRequests[r] = c
                    })
                }
            }, {
                key: "respond", value: function (t, e, r, n) {
                    this.raw("response", {response: r, success: e, to: t}, n)
                }
            }], [{
                key: "randomId", value: function (t) {
                    var e = t || 16, r = [];
                    if (window.crypto && window.crypto.getRandomValues) r = window.crypto.getRandomValues(new Uint32Array(e)); else if ("object" === k(window.msCrypto) && "function" == typeof window.msCrypto.getRandomValues) r = window.msCrypto.getRandomValues(new Uint32Array(e)); else for (; r.length < e;) r.push(Math.floor(Math.random() * O.length));
                    for (var n = [], o = 0; o < e; o += 1) n.push(O[r[o] % O.length]);
                    return n.join("")
                }
            }, {
                key: "errorWithStack", value: function (t, e, r) {
                    var n = new t(e);
                    return r && (n.stack = r), n
                }
            }]), t
        }();
    I.PluginDisabled = f("PostMessageIO:PluginDisabled"), I.PluginDisabled.prototype.code = T, I.InvalidContext = f("PostMessageIO:InvalidContext"), I.InvalidContext.prototype.code = P, I.NotHandled = f("PostMessageIO:NotHandled"), I.NotHandled.prototype.code = R, I.UnsupportedCommand = f("PostMessageIO:UnsupportedCommand"), I.UnsupportedCommand.prototype.code = D;
    var B = I,
        N = "undefined" != typeof globalThis ? globalThis : "undefined" != typeof window ? window : "undefined" != typeof global ? global : "undefined" != typeof self ? self : {};

    function U(t, e) {
        return t(e = {exports: {}}, e.exports), e.exports
    }

    var M = U(function (t) {
            var e = function () {
                return void 0 === this
            }();
            if (e) t.exports = {
                freeze: Object.freeze,
                defineProperty: Object.defineProperty,
                getDescriptor: Object.getOwnPropertyDescriptor,
                keys: Object.keys,
                names: Object.getOwnPropertyNames,
                getPrototypeOf: Object.getPrototypeOf,
                isArray: Array.isArray,
                isES5: e,
                propertyIsWritable: function (t, e) {
                    var r = Object.getOwnPropertyDescriptor(t, e);
                    return !(r && !r.writable && !r.set)
                }
            }; else {
                var r = {}.hasOwnProperty, n = {}.toString, o = {}.constructor.prototype, i = function (t) {
                    var e = [];
                    for (var n in t) r.call(t, n) && e.push(n);
                    return e
                };
                t.exports = {
                    isArray: function (t) {
                        try {
                            return "[object Array]" === n.call(t)
                        } catch (t) {
                            return !1
                        }
                    }, keys: i, names: i, defineProperty: function (t, e, r) {
                        return t[e] = r.value, t
                    }, getDescriptor: function (t, e) {
                        return {value: t[e]}
                    }, freeze: function (t) {
                        return t
                    }, getPrototypeOf: function (t) {
                        try {
                            return Object(t).constructor.prototype
                        } catch (t) {
                            return o
                        }
                    }, isES5: e, propertyIsWritable: function () {
                        return !0
                    }
                }
            }
        }), z = M.freeze, L = M.defineProperty, q = M.getDescriptor, H = M.keys, V = M.names, W = M.getPrototypeOf,
        K = M.isArray, $ = M.isES5, Q = M.propertyIsWritable, J = "undefined" == typeof navigator, G = function () {
            try {
                var t = {};
                return M.defineProperty(t, "f", {
                    get: function () {
                        return 3
                    }
                }), 3 === t.f
            } catch (t) {
                return !1
            }
        }(), X = {e: {}}, Y;

    function Z() {
        try {
            var t = Y;
            return Y = null, t.apply(this, arguments)
        } catch (t) {
            return X.e = t, X
        }
    }

    function tt(t) {
        return Y = t, Z
    }

    var et = function (t, e) {
        var r = {}.hasOwnProperty;

        function n() {
            for (var n in this.constructor = t, this.constructor$ = e, e.prototype) r.call(e.prototype, n) && "$" !== n.charAt(n.length - 1) && (this[n + "$"] = e.prototype[n])
        }

        return n.prototype = e.prototype, t.prototype = new n, t.prototype
    };

    function rt(t) {
        return null == t || !0 === t || !1 === t || "string" == typeof t || "number" == typeof t
    }

    function nt(t) {
        return !rt(t)
    }

    function ot(t) {
        return rt(t) ? new Error(yt(t)) : t
    }

    function it(t, e) {
        var r, n = t.length, o = new Array(n + 1);
        for (r = 0; r < n; ++r) o[r] = t[r];
        return o[r] = e, o
    }

    function st(t, e, r) {
        if (!M.isES5) return {}.hasOwnProperty.call(t, e) ? t[e] : void 0;
        var n = Object.getOwnPropertyDescriptor(t, e);
        return null != n ? null == n.get && null == n.set ? n.value : r : void 0
    }

    function at(t, e, r) {
        if (rt(t)) return t;
        var n = {value: r, configurable: !0, enumerable: !1, writable: !0};
        return M.defineProperty(t, e, n), t
    }

    function ct(t) {
        throw t
    }

    var ut = function () {
        var t = [Array.prototype, Object.prototype, Function.prototype], e = function (e) {
            for (var r = 0; r < t.length; ++r) if (t[r] === e) return !0;
            return !1
        };
        if (M.isES5) {
            var r = Object.getOwnPropertyNames;
            return function (t) {
                for (var n = [], o = Object.create(null); null != t && !e(t);) {
                    var i;
                    try {
                        i = r(t)
                    } catch (t) {
                        return n
                    }
                    for (var s = 0; s < i.length; ++s) {
                        var a = i[s];
                        if (!o[a]) {
                            o[a] = !0;
                            var c = Object.getOwnPropertyDescriptor(t, a);
                            null != c && null == c.get && null == c.set && n.push(a)
                        }
                    }
                    t = M.getPrototypeOf(t)
                }
                return n
            }
        }
        var n = {}.hasOwnProperty;
        return function (r) {
            if (e(r)) return [];
            var o = [];
            t:for (var i in r) if (n.call(r, i)) o.push(i); else {
                for (var s = 0; s < t.length; ++s) if (n.call(t[s], i)) continue t;
                o.push(i)
            }
            return o
        }
    }(), lt = /this\s*\.\s*\S+\s*=/;

    function ht(t) {
        try {
            if ("function" == typeof t) {
                var e = M.names(t.prototype), r = M.isES5 && e.length > 1,
                    n = e.length > 0 && !(1 === e.length && "constructor" === e[0]),
                    o = lt.test(t + "") && M.names(t).length > 0;
                if (r || n || o) return !0
            }
            return !1
        } catch (t) {
            return !1
        }
    }

    function ft(t) {
        return t
    }

    var pt = /^[a-z$_][a-z$_0-9]*$/i;

    function dt(t) {
        return pt.test(t)
    }

    function vt(t, e, r) {
        for (var n = new Array(t), o = 0; o < t; ++o) n[o] = e + o + r;
        return n
    }

    function yt(t) {
        try {
            return t + ""
        } catch (t) {
            return "[no string representation]"
        }
    }

    function _t(t) {
        try {
            at(t, "isOperational", !0)
        } catch (t) {
        }
    }

    function gt(t) {
        return null != t && (t instanceof Error.__BluebirdErrorTypes__.OperationalError || !0 === t.isOperational)
    }

    function mt(t) {
        return t instanceof Error && M.propertyIsWritable(t, "stack")
    }

    var wt = "stack" in new Error ? function (t) {
        return mt(t) ? t : new Error(yt(t))
    } : function (t) {
        if (mt(t)) return t;
        try {
            throw new Error(yt(t))
        } catch (t) {
            return t
        }
    };

    function bt(t) {
        return {}.toString.call(t)
    }

    function kt(t, e, r) {
        for (var n = M.names(t), o = 0; o < n.length; ++o) {
            var i = n[o];
            if (r(i)) try {
                M.defineProperty(e, i, M.getDescriptor(t, i))
            } catch (t) {
            }
        }
    }

    var Et = {
        isClass: ht,
        isIdentifier: dt,
        inheritedDataKeys: ut,
        getDataPropertyOrDefault: st,
        thrower: ct,
        isArray: M.isArray,
        haveGetters: G,
        notEnumerableProp: at,
        isPrimitive: rt,
        isObject: nt,
        canEvaluate: J,
        errorObj: X,
        tryCatch: tt,
        inherits: et,
        withAppended: it,
        maybeWrapAsError: ot,
        toFastProperties: ft,
        filledRange: vt,
        toString: yt,
        canAttachTrace: mt,
        ensureErrorObject: wt,
        originatesFromRejection: gt,
        markAsOriginatingFromRejection: _t,
        classString: bt,
        copyDescriptors: kt,
        hasDevTools: "undefined" != typeof chrome && chrome && "function" == typeof chrome.loadTimes,
        isNode: "undefined" != typeof process && "[object process]" === bt(process).toLowerCase()
    }, Ct;
    Et.isRecentNode = Et.isNode && (Ct = process.versions.node.split(".").map(Number), 0 === Ct[0] && Ct[1] > 10 || Ct[0] > 0), Et.isNode && Et.toFastProperties(process);
    try {
        throw new Error
    } catch (t) {
        Et.lastLineError = t
    }
    var jt = Et, At, St = function () {
        throw new Error("No async scheduler available\n\n    See http://goo.gl/m3OTXk\n")
    };
    if (jt.isNode && "undefined" == typeof MutationObserver) {
        var Ft = N.setImmediate, xt = process.nextTick;
        At = jt.isRecentNode ? function (t) {
            Ft.call(N, t)
        } : function (t) {
            xt.call(process, t)
        }
    } else "undefined" == typeof MutationObserver || "undefined" != typeof window && window.navigator && window.navigator.standalone ? At = "undefined" != typeof setImmediate ? function (t) {
        setImmediate(t)
    } : "undefined" != typeof setTimeout ? function (t) {
        setTimeout(t, 0)
    } : St : (At = function (t) {
        var e = document.createElement("div");
        return new MutationObserver(t).observe(e, {attributes: !0}), function () {
            e.classList.toggle("foo")
        }
    }, At.isStatic = !0);
    var Ot = At;

    function Tt(t, e, r, n, o) {
        for (var i = 0; i < o; ++i) r[i + n] = t[i + e], t[i + e] = void 0
    }

    function Pt(t) {
        this._capacity = t, this._length = 0, this._front = 0
    }

    Pt.prototype._willBeOverCapacity = function (t) {
        return this._capacity < t
    }, Pt.prototype._pushOne = function (t) {
        var e = this.length();
        this._checkCapacity(e + 1), this[this._front + e & this._capacity - 1] = t, this._length = e + 1
    }, Pt.prototype._unshiftOne = function (t) {
        var e = this._capacity;
        this._checkCapacity(this.length() + 1);
        var r = (this._front - 1 & e - 1 ^ e) - e;
        this[r] = t, this._front = r, this._length = this.length() + 1
    }, Pt.prototype.unshift = function (t, e, r) {
        this._unshiftOne(r), this._unshiftOne(e), this._unshiftOne(t)
    }, Pt.prototype.push = function (t, e, r) {
        var n = this.length() + 3;
        if (this._willBeOverCapacity(n)) return this._pushOne(t), this._pushOne(e), void this._pushOne(r);
        var o = this._front + n - 3;
        this._checkCapacity(n);
        var i = this._capacity - 1;
        this[o + 0 & i] = t, this[o + 1 & i] = e, this[o + 2 & i] = r, this._length = n
    }, Pt.prototype.shift = function () {
        var t = this._front, e = this[t];
        return this[t] = void 0, this._front = t + 1 & this._capacity - 1, this._length--, e
    }, Pt.prototype.length = function () {
        return this._length
    }, Pt.prototype._checkCapacity = function (t) {
        this._capacity < t && this._resizeTo(this._capacity << 1)
    }, Pt.prototype._resizeTo = function (t) {
        var e = this._capacity;
        this._capacity = t, Tt(this, 0, this, e, this._front + this._length & e - 1)
    };
    var Rt = Pt, Dt;
    try {
        throw new Error
    } catch (t) {
        Dt = t
    }
    var It = Ot;

    function Bt() {
        this._isTickUsed = !1, this._lateQueue = new Rt(16), this._normalQueue = new Rt(16), this._trampolineEnabled = !0;
        var t = this;
        this.drainQueues = function () {
            t._drainQueues()
        }, this._schedule = It.isStatic ? It(this.drainQueues) : It
    }

    function Nt(t, e, r) {
        this._lateQueue.push(t, e, r), this._queueTick()
    }

    function Ut(t, e, r) {
        this._normalQueue.push(t, e, r), this._queueTick()
    }

    function Mt(t) {
        this._normalQueue._pushOne(t), this._queueTick()
    }

    Bt.prototype.disableTrampolineIfNecessary = function () {
        jt.hasDevTools && (this._trampolineEnabled = !1)
    }, Bt.prototype.enableTrampoline = function () {
        this._trampolineEnabled || (this._trampolineEnabled = !0, this._schedule = function (t) {
            setTimeout(t, 0)
        })
    }, Bt.prototype.haveItemsQueued = function () {
        return this._normalQueue.length() > 0
    }, Bt.prototype.throwLater = function (t, e) {
        if (1 === arguments.length && (e = t, t = function () {
            throw e
        }), "undefined" != typeof setTimeout) setTimeout(function () {
            t(e)
        }, 0); else try {
            this._schedule(function () {
                t(e)
            })
        } catch (t) {
            throw new Error("No async scheduler available\n\n    See http://goo.gl/m3OTXk\n")
        }
    }, jt.hasDevTools ? (It.isStatic && (It = function (t) {
        setTimeout(t, 0)
    }), Bt.prototype.invokeLater = function (t, e, r) {
        this._trampolineEnabled ? Nt.call(this, t, e, r) : this._schedule(function () {
            setTimeout(function () {
                t.call(e, r)
            }, 100)
        })
    }, Bt.prototype.invoke = function (t, e, r) {
        this._trampolineEnabled ? Ut.call(this, t, e, r) : this._schedule(function () {
            t.call(e, r)
        })
    }, Bt.prototype.settlePromises = function (t) {
        this._trampolineEnabled ? Mt.call(this, t) : this._schedule(function () {
            t._settlePromises()
        })
    }) : (Bt.prototype.invokeLater = Nt, Bt.prototype.invoke = Ut, Bt.prototype.settlePromises = Mt), Bt.prototype.invokeFirst = function (t, e, r) {
        this._normalQueue.unshift(t, e, r), this._queueTick()
    }, Bt.prototype._drainQueue = function (t) {
        for (; t.length() > 0;) {
            var e = t.shift();
            if ("function" == typeof e) {
                var r = t.shift(), n = t.shift();
                e.call(r, n)
            } else e._settlePromises()
        }
    }, Bt.prototype._drainQueues = function () {
        this._drainQueue(this._normalQueue), this._reset(), this._drainQueue(this._lateQueue)
    }, Bt.prototype._queueTick = function () {
        this._isTickUsed || (this._isTickUsed = !0, this._schedule(this.drainQueues))
    }, Bt.prototype._reset = function () {
        this._isTickUsed = !1
    };
    var zt = new Bt, Lt = Dt;
    zt.firstLineError = Lt;
    var qt = M.freeze, Ht = jt.inherits, Vt = jt.notEnumerableProp, Wt, Kt;

    function $t(t, e) {
        function r(n) {
            if (!(this instanceof r)) return new r(n);
            Vt(this, "message", "string" == typeof n ? n : e), Vt(this, "name", t), Error.captureStackTrace ? Error.captureStackTrace(this, this.constructor) : Error.call(this)
        }

        return Ht(r, Error), r
    }

    var Qt = $t("Warning", "warning"), Jt = $t("CancellationError", "cancellation error"),
        Gt = $t("TimeoutError", "timeout error"), Xt = $t("AggregateError", "aggregate error");
    try {
        Wt = TypeError, Kt = RangeError
    } catch (t) {
        Wt = $t("TypeError", "type error"), Kt = $t("RangeError", "range error")
    }
    for (var Yt = "join pop push shift unshift slice filter forEach some every map indexOf lastIndexOf reduce reduceRight sort reverse".split(" "), Zt = 0; Zt < Yt.length; ++Zt) "function" == typeof Array.prototype[Yt[Zt]] && (Xt.prototype[Yt[Zt]] = Array.prototype[Yt[Zt]]);
    M.defineProperty(Xt.prototype, "length", {
        value: 0,
        configurable: !1,
        writable: !0,
        enumerable: !0
    }), Xt.prototype.isOperational = !0;
    var te = 0;

    function ee(t) {
        if (!(this instanceof ee)) return new ee(t);
        Vt(this, "name", "OperationalError"), Vt(this, "message", t), this.cause = t, this.isOperational = !0, t instanceof Error ? (Vt(this, "message", t.message), Vt(this, "stack", t.stack)) : Error.captureStackTrace && Error.captureStackTrace(this, this.constructor)
    }

    Xt.prototype.toString = function () {
        var t = Array(4 * te + 1).join(" "), e = "\n" + t + "AggregateError of:\n";
        te++, t = Array(4 * te + 1).join(" ");
        for (var r = 0; r < this.length; ++r) {
            for (var n = this[r] === this ? "[Circular AggregateError]" : this[r] + "", o = n.split("\n"), i = 0; i < o.length; ++i) o[i] = t + o[i];
            e += (n = o.join("\n")) + "\n"
        }
        return te--, e
    }, Ht(ee, Error);
    var re = Error.__BluebirdErrorTypes__;
    re || (re = qt({
        CancellationError: Jt,
        TimeoutError: Gt,
        OperationalError: ee,
        RejectionError: ee,
        AggregateError: Xt
    }), Vt(Error, "__BluebirdErrorTypes__", re));
    var ne = {
        Error: Error,
        TypeError: Wt,
        RangeError: Kt,
        CancellationError: re.CancellationError,
        OperationalError: re.OperationalError,
        TimeoutError: re.TimeoutError,
        AggregateError: re.AggregateError,
        Warning: Qt
    }, oe = function (t, e) {
        var r = jt, n = r.errorObj, o = r.isObject;

        function i(t) {
            return t.then
        }

        var s = {}.hasOwnProperty;
        return function (a, c) {
            if (o(a)) {
                if (a instanceof t) return a;
                if (function (t) {
                    return s.call(t, "_promise0")
                }(a)) {
                    var u = new t(e);
                    return a._then(u._fulfillUnchecked, u._rejectUncheckedCheckError, u._progressUnchecked, u, null), u
                }
                var l = r.tryCatch(i)(a);
                if (l === n) return c && c._pushContext(), u = t.reject(l.e), c && c._popContext(), u;
                if ("function" == typeof l) return function (o, i, s) {
                    var a = new t(e), c = a;
                    s && s._pushContext(), a._captureStackTrace(), s && s._popContext();
                    var u = !0, l = r.tryCatch(i).call(o, function (t) {
                        a && (a._resolveCallback(t), a = null)
                    }, function (t) {
                        a && (a._rejectCallback(t, u, !0), a = null)
                    }, function (t) {
                        a && "function" == typeof a._progress && a._progress(t)
                    });
                    return u = !1, a && l === n && (a._rejectCallback(l.e, !0, !0), a = null), c
                }(a, l, c)
            }
            return a
        }
    }, ie = function (t, e, r, n) {
        var o = jt.isArray;

        function i(r) {
            var n, o = this._promise = new t(e);
            r instanceof t && (n = r, o._propagateFrom(n, 5)), this._values = r, this._length = 0, this._totalResolved = 0, this._init(void 0, -2)
        }

        return i.prototype.length = function () {
            return this._length
        }, i.prototype.promise = function () {
            return this._promise
        }, i.prototype._init = function e(i, s) {
            var a = r(this._values, this._promise);
            if (a instanceof t) {
                if (a = a._target(), this._values = a, !a._isFulfilled()) return a._isPending() ? void a._then(e, this._reject, void 0, this, s) : void this._reject(a._reason());
                if (a = a._value(), !o(a)) {
                    var c = new t.TypeError("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n");
                    return void this.__hardReject__(c)
                }
            } else if (!o(a)) return void this._promise._reject(n("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n")._reason());
            if (0 !== a.length) {
                var u = this.getActualLength(a.length);
                this._length = u, this._values = this.shouldCopyValues() ? new Array(u) : this._values;
                for (var l = this._promise, h = 0; h < u; ++h) {
                    var f = this._isResolved(), p = r(a[h], l);
                    p instanceof t ? (p = p._target(), f ? p._ignoreRejections() : p._isPending() ? p._proxyPromiseArray(this, h) : p._isFulfilled() ? this._promiseFulfilled(p._value(), h) : this._promiseRejected(p._reason(), h)) : f || this._promiseFulfilled(p, h)
                }
            } else -5 === s ? this._resolveEmptyArray() : this._resolve(function (t) {
                switch (t) {
                    case-2:
                        return [];
                    case-3:
                        return {}
                }
            }(s))
        }, i.prototype._isResolved = function () {
            return null === this._values
        }, i.prototype._resolve = function (t) {
            this._values = null, this._promise._fulfill(t)
        }, i.prototype.__hardReject__ = i.prototype._reject = function (t) {
            this._values = null, this._promise._rejectCallback(t, !1, !0)
        }, i.prototype._promiseProgressed = function (t, e) {
            this._promise._progress({index: e, value: t})
        }, i.prototype._promiseFulfilled = function (t, e) {
            this._values[e] = t, ++this._totalResolved >= this._length && this._resolve(this._values)
        }, i.prototype._promiseRejected = function (t, e) {
            this._totalResolved++, this._reject(t)
        }, i.prototype.shouldCopyValues = function () {
            return !0
        }, i.prototype.getActualLength = function (t) {
            return t
        }, i
    }, se = function () {
        var t, e = zt, r = jt, n = /[\\\/]bluebird[\\\/]js[\\\/](main|debug|zalgo|instrumented)/, o = null, i = null,
            s = !1;

        function a(t) {
            this._parent = t;
            var e = this._length = 1 + (void 0 === t ? 0 : t._length);
            d(this, a), e > 32 && this.uncycle()
        }

        function c(t) {
            for (var e = [], r = 0; r < t.length; ++r) {
                var n = t[r], i = o.test(n) || "    (No stack trace)" === n, a = i && l(n);
                i && !a && (s && " " !== n.charAt(0) && (n = "    " + n), e.push(n))
            }
            return e
        }

        function u(t) {
            var e;
            if ("function" == typeof t) e = "[function " + (t.name || "anonymous") + "]"; else {
                e = t.toString();
                if (/\[object [a-zA-Z0-9$_]+\]/.test(e)) try {
                    e = JSON.stringify(t)
                } catch (t) {
                }
                0 === e.length && (e = "(empty array)")
            }
            return "(<" + function (t) {
                if (t.length < 41) return t;
                return t.substr(0, 38) + "..."
            }(e) + ">, no stack trace)"
        }

        r.inherits(a, Error), a.prototype.uncycle = function () {
            var t = this._length;
            if (!(t < 2)) {
                for (var e = [], r = {}, n = 0, o = this; void 0 !== o; ++n) e.push(o), o = o._parent;
                for (n = (t = this._length = n) - 1; n >= 0; --n) {
                    var i = e[n].stack;
                    void 0 === r[i] && (r[i] = n)
                }
                for (n = 0; n < t; ++n) {
                    var s = r[e[n].stack];
                    if (void 0 !== s && s !== n) {
                        s > 0 && (e[s - 1]._parent = void 0, e[s - 1]._length = 1), e[n]._parent = void 0, e[n]._length = 1;
                        var a = n > 0 ? e[n - 1] : this;
                        s < t - 1 ? (a._parent = e[s + 1], a._parent.uncycle(), a._length = a._parent._length + 1) : (a._parent = void 0, a._length = 1);
                        for (var c = a._length + 1, u = n - 2; u >= 0; --u) e[u]._length = c, c++;
                        return
                    }
                }
            }
        }, a.prototype.parent = function () {
            return this._parent
        }, a.prototype.hasParent = function () {
            return void 0 !== this._parent
        }, a.prototype.attachExtraTrace = function (t) {
            if (!t.__stackCleaned__) {
                this.uncycle();
                for (var e = a.parseStackAndMessage(t), n = e.message, o = [e.stack], i = this; void 0 !== i;) o.push(c(i.stack.split("\n"))), i = i._parent;
                !function (t) {
                    for (var e = t[0], r = 1; r < t.length; ++r) {
                        for (var n = t[r], o = e.length - 1, i = e[o], s = -1, a = n.length - 1; a >= 0; --a) if (n[a] === i) {
                            s = a;
                            break
                        }
                        for (var a = s; a >= 0; --a) {
                            var c = n[a];
                            if (e[o] !== c) break;
                            e.pop(), o--
                        }
                        e = n
                    }
                }(o), function (t) {
                    for (var e = 0; e < t.length; ++e) (0 === t[e].length || e + 1 < t.length && t[e][0] === t[e + 1][0]) && (t.splice(e, 1), e--)
                }(o), r.notEnumerableProp(t, "stack", function (t, e) {
                    for (var r = 0; r < e.length - 1; ++r) e[r].push("From previous event:"), e[r] = e[r].join("\n");
                    r < e.length && (e[r] = e[r].join("\n"));
                    return t + "\n" + e.join("\n")
                }(n, o)), r.notEnumerableProp(t, "__stackCleaned__", !0)
            }
        }, a.parseStackAndMessage = function (t) {
            var e = t.stack;
            return {
                message: t.toString(), stack: c(e = "string" == typeof e && e.length > 0 ? function (t) {
                    for (var e = t.stack.replace(/\s+$/g, "").split("\n"), r = 0; r < e.length; ++r) {
                        var n = e[r];
                        if ("    (No stack trace)" === n || o.test(n)) break
                    }
                    return r > 0 && (e = e.slice(r)), e
                }(t) : ["    (No stack trace)"])
            }
        }, a.formatAndLogError = function (e, r) {
            if ("undefined" != typeof console) {
                var n;
                if ("object" == typeof e || "function" == typeof e) {
                    var o = e.stack;
                    n = r + i(o, e)
                } else n = r + String(e);
                "function" == typeof t ? t(n) : "function" != typeof console.log && "object" != typeof console.log || console.log(n)
            }
        }, a.unhandledRejection = function (t) {
            a.formatAndLogError(t, "^--- With additional stack trace: ")
        }, a.isSupported = function () {
            return "function" == typeof d
        }, a.fireRejectionEvent = function (t, r, n, o) {
            var i = !1;
            try {
                "function" == typeof r && (i = !0, "rejectionHandled" === t ? r(o) : r(n, o))
            } catch (t) {
                e.throwLater(t)
            }
            var s = !1;
            try {
                s = v(t, n, o)
            } catch (t) {
                s = !0, e.throwLater(t)
            }
            var c = !1;
            if (p) try {
                c = p(t.toLowerCase(), {reason: n, promise: o})
            } catch (t) {
                c = !0, e.throwLater(t)
            }
            s || i || c || "unhandledRejection" !== t || a.formatAndLogError(n, "Unhandled rejection ")
        };
        var l = function () {
            return !1
        }, h = /[\/<\(]([^:\/]+):(\d+):(?:\d+)\)?\s*$/;

        function f(t) {
            var e = t.match(h);
            if (e) return {fileName: e[1], line: parseInt(e[2], 10)}
        }

        a.setBounds = function (t, e) {
            if (a.isSupported()) {
                for (var r, o, i = t.stack.split("\n"), s = e.stack.split("\n"), c = -1, u = -1, h = 0; h < i.length; ++h) {
                    if (p = f(i[h])) {
                        r = p.fileName, c = p.line;
                        break
                    }
                }
                for (h = 0; h < s.length; ++h) {
                    var p;
                    if (p = f(s[h])) {
                        o = p.fileName, u = p.line;
                        break
                    }
                }
                c < 0 || u < 0 || !r || !o || r !== o || c >= u || (l = function (t) {
                    if (n.test(t)) return !0;
                    var e = f(t);
                    return !!(e && e.fileName === r && c <= e.line && e.line <= u)
                })
            }
        };
        var p, d = function () {
            var t = /^\s*at\s*/, e = function (t, e) {
                return "string" == typeof t ? t : void 0 !== e.name && void 0 !== e.message ? e.toString() : u(e)
            };
            if ("number" == typeof Error.stackTraceLimit && "function" == typeof Error.captureStackTrace) {
                Error.stackTraceLimit = Error.stackTraceLimit + 6, o = t, i = e;
                var r = Error.captureStackTrace;
                return l = function (t) {
                    return n.test(t)
                }, function (t, e) {
                    Error.stackTraceLimit = Error.stackTraceLimit + 6, r(t, e), Error.stackTraceLimit = Error.stackTraceLimit - 6
                }
            }
            var a, c = new Error;
            if ("string" == typeof c.stack && c.stack.split("\n")[0].indexOf("stackDetection@") >= 0) return o = /@/, i = e, s = !0, function (t) {
                t.stack = (new Error).stack
            };
            try {
                throw new Error
            } catch (t) {
                a = "stack" in t
            }
            return "stack" in c || !a || "number" != typeof Error.stackTraceLimit ? (i = function (t, e) {
                return "string" == typeof t ? t : "object" != typeof e && "function" != typeof e || void 0 === e.name || void 0 === e.message ? u(e) : e.toString()
            }, null) : (o = t, i = e, function (t) {
                Error.stackTraceLimit = Error.stackTraceLimit + 6;
                try {
                    throw new Error
                } catch (e) {
                    t.stack = e.stack
                }
                Error.stackTraceLimit = Error.stackTraceLimit - 6
            })
        }(), v = function () {
            if (r.isNode) return function (t, e, r) {
                return "rejectionHandled" === t ? process.emit(t, r) : process.emit(t, e, r)
            };
            var t = !1, e = !0;
            try {
                var n = new self.CustomEvent("test");
                t = n instanceof CustomEvent
            } catch (t) {
            }
            if (!t) try {
                var o = document.createEvent("CustomEvent");
                o.initCustomEvent("testingtheevent", !1, !0, {}), self.dispatchEvent(o)
            } catch (t) {
                e = !1
            }
            e && (p = function (e, r) {
                var n;
                return t ? n = new self.CustomEvent(e, {
                    detail: r,
                    bubbles: !1,
                    cancelable: !0
                }) : self.dispatchEvent && (n = document.createEvent("CustomEvent")).initCustomEvent(e, !1, !0, r), !!n && !self.dispatchEvent(n)
            });
            var i = {};
            return i.unhandledRejection = "onunhandledRejection".toLowerCase(), i.rejectionHandled = "onrejectionHandled".toLowerCase(), function (t, e, r) {
                var n = i[t], o = self[n];
                return !!o && ("rejectionHandled" === t ? o.call(self, r) : o.call(self, e, r), !0)
            }
        }();
        return "undefined" != typeof console && void 0 !== console.warn && (t = function (t) {
            console.warn(t)
        }, r.isNode && process.stderr.isTTY ? t = function (t) {
            process.stderr.write("[31m" + t + "[39m\n")
        } : r.isNode || "string" != typeof (new Error).stack || (t = function (t) {
            console.warn("%c" + t, "color: red")
        })), a
    }, ae = function (t, e) {
        var r, n, o = t._getDomain, i = zt, s = ne.Warning, a = jt, c = a.canAttachTrace,
            u = a.isNode && (!!process.env.BLUEBIRD_DEBUG || "development" === process.env.NODE_ENV);
        return a.isNode && 0 == process.env.BLUEBIRD_DEBUG && (u = !1), u && i.disableTrampolineIfNecessary(), t.prototype._ignoreRejections = function () {
            this._unsetRejectionIsUnhandled(), this._bitField = 16777216 | this._bitField
        }, t.prototype._ensurePossibleRejectionHandled = function () {
            0 == (16777216 & this._bitField) && (this._setRejectionIsUnhandled(), i.invokeLater(this._notifyUnhandledRejection, this, void 0))
        }, t.prototype._notifyUnhandledRejectionIsHandled = function () {
            e.fireRejectionEvent("rejectionHandled", r, void 0, this)
        }, t.prototype._notifyUnhandledRejection = function () {
            if (this._isRejectionUnhandled()) {
                var t = this._getCarriedStackTrace() || this._settledValue;
                this._setUnhandledRejectionIsNotified(), e.fireRejectionEvent("unhandledRejection", n, t, this)
            }
        }, t.prototype._setUnhandledRejectionIsNotified = function () {
            this._bitField = 524288 | this._bitField
        }, t.prototype._unsetUnhandledRejectionIsNotified = function () {
            this._bitField = -524289 & this._bitField
        }, t.prototype._isUnhandledRejectionNotified = function () {
            return (524288 & this._bitField) > 0
        }, t.prototype._setRejectionIsUnhandled = function () {
            this._bitField = 2097152 | this._bitField
        }, t.prototype._unsetRejectionIsUnhandled = function () {
            this._bitField = -2097153 & this._bitField, this._isUnhandledRejectionNotified() && (this._unsetUnhandledRejectionIsNotified(), this._notifyUnhandledRejectionIsHandled())
        }, t.prototype._isRejectionUnhandled = function () {
            return (2097152 & this._bitField) > 0
        }, t.prototype._setCarriedStackTrace = function (t) {
            this._bitField = 1048576 | this._bitField, this._fulfillmentHandler0 = t
        }, t.prototype._isCarryingStackTrace = function () {
            return (1048576 & this._bitField) > 0
        }, t.prototype._getCarriedStackTrace = function () {
            return this._isCarryingStackTrace() ? this._fulfillmentHandler0 : void 0
        }, t.prototype._captureStackTrace = function () {
            return u && (this._trace = new e(this._peekContext())), this
        }, t.prototype._attachExtraTrace = function (t, r) {
            if (u && c(t)) {
                var n = this._trace;
                if (void 0 !== n && r && (n = n._parent), void 0 !== n) n.attachExtraTrace(t); else if (!t.__stackCleaned__) {
                    var o = e.parseStackAndMessage(t);
                    a.notEnumerableProp(t, "stack", o.message + "\n" + o.stack.join("\n")), a.notEnumerableProp(t, "__stackCleaned__", !0)
                }
            }
        }, t.prototype._warn = function (t) {
            var r = new s(t), n = this._peekContext();
            if (n) n.attachExtraTrace(r); else {
                var o = e.parseStackAndMessage(r);
                r.stack = o.message + "\n" + o.stack.join("\n")
            }
            e.formatAndLogError(r, "")
        }, t.onPossiblyUnhandledRejection = function (t) {
            var e = o();
            n = "function" == typeof t ? null === e ? t : e.bind(t) : void 0
        }, t.onUnhandledRejectionHandled = function (t) {
            var e = o();
            r = "function" == typeof t ? null === e ? t : e.bind(t) : void 0
        }, t.longStackTraces = function () {
            if (i.haveItemsQueued() && !1 === u) throw new Error("cannot enable long stack traces after promises have been created\n\n    See http://goo.gl/DT1qyG\n");
            (u = e.isSupported()) && i.disableTrampolineIfNecessary()
        }, t.hasLongStackTraces = function () {
            return u && e.isSupported()
        }, e.isSupported() || (t.longStackTraces = function () {
        }, u = !1), function () {
            return u
        }
    }, ce = function (t, e, r) {
        var n = [];

        function o() {
            this._trace = new e(i())
        }

        function i() {
            var t = n.length - 1;
            if (t >= 0) return n[t]
        }

        return o.prototype._pushContext = function () {
            r() && void 0 !== this._trace && n.push(this._trace)
        }, o.prototype._popContext = function () {
            r() && void 0 !== this._trace && n.pop()
        }, t.prototype._peekContext = i, t.prototype._pushContext = o.prototype._pushContext, t.prototype._popContext = o.prototype._popContext, function () {
            if (r()) return new o
        }
    }, ue = function (t) {
        var e = jt, r = ne, n = e.tryCatch, o = e.errorObj, i = M.keys, s = r.TypeError;

        function a(t, e, r) {
            this._instances = t, this._callback = e, this._promise = r
        }

        function c(t, e) {
            var r = {}, a = n(t).call(r, e);
            return a === o ? a : i(r).length ? (o.e = new s("Catch filter must inherit from Error or be a simple predicate function\n\n    See http://goo.gl/o84o68\n"), o) : a
        }

        return a.prototype.doFilter = function (e) {
            for (var r = this._callback, i = this._promise._boundValue(), s = 0, a = this._instances.length; s < a; ++s) {
                var u = this._instances[s], l = u === Error || null != u && u.prototype instanceof Error;
                if (l && e instanceof u) return (h = n(r).call(i, e)) === o ? (t.e = h.e, t) : h;
                if ("function" == typeof u && !l) {
                    var h, f = c(u, e);
                    if (f === o) {
                        e = o.e;
                        break
                    }
                    if (f) return (h = n(r).call(i, e)) === o ? (t.e = h.e, t) : h
                }
            }
            return t.e = e, t
        }, a
    }, le = jt.maybeWrapAsError, he = ne.TimeoutError, fe = ne.OperationalError, pe = jt.haveGetters;

    function de(t) {
        return t instanceof Error && M.getPrototypeOf(t) === Error.prototype
    }

    var ve = /^(?:name|message|stack|cause)$/, ye;

    function _e(t) {
        var e;
        if (de(t)) {
            (e = new fe(t)).name = t.name, e.message = t.message, e.stack = t.stack;
            for (var r = M.keys(t), n = 0; n < r.length; ++n) {
                var o = r[n];
                ve.test(o) || (e[o] = t[o])
            }
            return e
        }
        return jt.markAsOriginatingFromRejection(t), t
    }

    function ge(t) {
        return function (e, r) {
            if (null !== t) {
                if (e) {
                    var n = _e(le(e));
                    t._attachExtraTrace(n), t._reject(n)
                } else if (arguments.length > 2) {
                    for (var o = arguments.length, i = new Array(o - 1), s = 1; s < o; ++s) i[s - 1] = arguments[s];
                    t._fulfill(i)
                } else t._fulfill(r);
                t = null
            }
        }
    }

    if (ye = pe ? function (t) {
        this.promise = t
    } : function (t) {
        this.promise = t, this.asCallback = ge(t), this.callback = this.asCallback
    }, pe) {
        var me = {
            get: function () {
                return ge(this.promise)
            }
        };
        M.defineProperty(ye.prototype, "asCallback", me), M.defineProperty(ye.prototype, "callback", me)
    }
    ye._nodebackForPromise = ge, ye.prototype.toString = function () {
        return "[object PromiseResolver]"
    }, ye.prototype.resolve = ye.prototype.fulfill = function (t) {
        if (!(this instanceof ye)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");
        this.promise._resolveCallback(t)
    }, ye.prototype.reject = function (t) {
        if (!(this instanceof ye)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");
        this.promise._rejectCallback(t)
    }, ye.prototype.progress = function (t) {
        if (!(this instanceof ye)) throw new TypeError("Illegal invocation, resolver resolve/reject must be called within a resolver context. Consider using the promise constructor instead.\n\n    See http://goo.gl/sdkXL9\n");
        this.promise._progress(t)
    }, ye.prototype.cancel = function (t) {
        this.promise.cancel(t)
    }, ye.prototype.timeout = function () {
        this.reject(new he("timeout"))
    }, ye.prototype.isResolved = function () {
        return this.promise.isResolved()
    }, ye.prototype.toJSON = function () {
        return this.promise.toJSON()
    };
    var we = ye, be = function (t, e) {
        var r = jt, n = zt, o = r.tryCatch, i = r.errorObj;
        t.prototype.progressed = function (t) {
            return this._then(void 0, void 0, t, void 0, void 0)
        }, t.prototype._progress = function (t) {
            this._isFollowingOrFulfilledOrRejected() || this._target()._progressUnchecked(t)
        }, t.prototype._progressHandlerAt = function (t) {
            return 0 === t ? this._progressHandler0 : this[(t << 2) + t - 5 + 2]
        }, t.prototype._doProgressWith = function (e) {
            var n = e.value, s = e.handler, a = e.promise, c = e.receiver, u = o(s).call(c, n);
            if (u === i) {
                if (null != u.e && "StopProgressPropagation" !== u.e.name) {
                    var l = r.canAttachTrace(u.e) ? u.e : new Error(r.toString(u.e));
                    a._attachExtraTrace(l), a._progress(u.e)
                }
            } else u instanceof t ? u._then(a._progress, null, null, a, void 0) : a._progress(u)
        }, t.prototype._progressUnchecked = function (r) {
            for (var o = this._length(), i = this._progress, s = 0; s < o; s++) {
                var a = this._progressHandlerAt(s), c = this._promiseAt(s);
                if (c instanceof t) "function" == typeof a ? n.invoke(this._doProgressWith, this, {
                    handler: a,
                    promise: c,
                    receiver: this._receiverAt(s),
                    value: r
                }) : n.invoke(i, c, r); else {
                    var u = this._receiverAt(s);
                    "function" == typeof a ? a.call(u, r, c) : u instanceof e && !u._isResolved() && u._promiseProgressed(r, c)
                }
            }
        }
    }, ke = function (t, e, r, n) {
        var o = jt, i = o.tryCatch;
        t.method = function (r) {
            if ("function" != typeof r) throw new t.TypeError("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
            return function () {
                var n = new t(e);
                n._captureStackTrace(), n._pushContext();
                var o = i(r).apply(this, arguments);
                return n._popContext(), n._resolveFromSyncValue(o), n
            }
        }, t.attempt = t.try = function (r, s, a) {
            if ("function" != typeof r) return n("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
            var c = new t(e);
            c._captureStackTrace(), c._pushContext();
            var u = o.isArray(s) ? i(r).apply(a, s) : i(r).call(a, s);
            return c._popContext(), c._resolveFromSyncValue(u), c
        }, t.prototype._resolveFromSyncValue = function (t) {
            t === o.errorObj ? this._rejectCallback(t.e, !1, !0) : this._resolveCallback(t, !0)
        }
    }, Ee = function (t, e, r) {
        var n = function (t, e) {
            this._reject(e)
        }, o = function (t, e) {
            e.promiseRejectionQueued = !0, e.bindingPromise._then(n, n, null, this, t)
        }, i = function (t, e) {
            this._isPending() && this._resolveCallback(e.target)
        }, s = function (t, e) {
            e.promiseRejectionQueued || this._reject(t)
        };
        t.prototype.bind = function (n) {
            var a = r(n), c = new t(e);
            c._propagateFrom(this, 1);
            var u = this._target();
            if (c._setBoundTo(a), a instanceof t) {
                var l = {promiseRejectionQueued: !1, promise: c, target: u, bindingPromise: a};
                u._then(e, o, c._progress, c, l), a._then(i, s, c._progress, c, l)
            } else c._resolveCallback(u);
            return c
        }, t.prototype._setBoundTo = function (t) {
            void 0 !== t ? (this._bitField = 131072 | this._bitField, this._boundTo = t) : this._bitField = -131073 & this._bitField
        }, t.prototype._isBound = function () {
            return 131072 == (131072 & this._bitField)
        }, t.bind = function (n, o) {
            var i = r(n), s = new t(e);
            return s._setBoundTo(i), i instanceof t ? i._then(function () {
                s._resolveCallback(o)
            }, s._reject, s._progress, s, null) : s._resolveCallback(o), s
        }
    }, Ce = function (t, e, r) {
        var n = jt, o = n.isPrimitive, i = n.thrower;

        function s() {
            return this
        }

        function a() {
            throw this
        }

        function c(t, e, r) {
            var n, c;
            return n = o(e) ? r ? (c = e, function () {
                return c
            }) : function (t) {
                return function () {
                    throw t
                }
            }(e) : r ? s : a, t._then(n, i, void 0, e, void 0)
        }

        function u(n) {
            var o = this.promise, i = this.handler, s = o._isBound() ? i.call(o._boundValue()) : i();
            if (void 0 !== s) {
                var a = r(s, o);
                if (a instanceof t) return c(a = a._target(), n, o.isFulfilled())
            }
            return o.isRejected() ? (e.e = n, e) : n
        }

        function l(e) {
            var n = this.promise, o = this.handler, i = n._isBound() ? o.call(n._boundValue(), e) : o(e);
            if (void 0 !== i) {
                var s = r(i, n);
                if (s instanceof t) return c(s = s._target(), e, !0)
            }
            return e
        }

        t.prototype._passThroughHandler = function (t, e) {
            if ("function" != typeof t) return this.then();
            var r = {promise: this, handler: t};
            return this._then(e ? u : l, e ? u : void 0, void 0, r, void 0)
        }, t.prototype.lastly = t.prototype.finally = function (t) {
            return this._passThroughHandler(t, !0)
        }, t.prototype.tap = function (t) {
            return this._passThroughHandler(t, !1)
        }
    }, je = jt.isPrimitive, Ae = function (t) {
        var e = function () {
            return this
        }, r = function () {
            throw this
        }, n = function () {
        }, o = function () {
            throw void 0
        }, i = function (t, e) {
            return 1 === e ? function () {
                throw t
            } : 2 === e ? function () {
                return t
            } : void 0
        };
        t.prototype.return = t.prototype.thenReturn = function (r) {
            return void 0 === r ? this.then(n) : je(r) ? this._then(i(r, 2), void 0, void 0, void 0, void 0) : (r instanceof t && r._ignoreRejections(), this._then(e, void 0, void 0, r, void 0))
        }, t.prototype.throw = t.prototype.thenThrow = function (t) {
            return void 0 === t ? this.then(o) : je(t) ? this._then(i(t, 1), void 0, void 0, void 0, void 0) : this._then(r, void 0, void 0, t, void 0)
        }
    }, Se = function (t) {
        function e(t) {
            void 0 !== t ? (t = t._target(), this._bitField = t._bitField, this._settledValue = t._settledValue) : (this._bitField = 0, this._settledValue = void 0)
        }

        e.prototype.value = function () {
            if (!this.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/hc1DLj\n");
            return this._settledValue
        }, e.prototype.error = e.prototype.reason = function () {
            if (!this.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/hPuiwB\n");
            return this._settledValue
        }, e.prototype.isFulfilled = t.prototype._isFulfilled = function () {
            return (268435456 & this._bitField) > 0
        }, e.prototype.isRejected = t.prototype._isRejected = function () {
            return (134217728 & this._bitField) > 0
        }, e.prototype.isPending = t.prototype._isPending = function () {
            return 0 == (402653184 & this._bitField)
        }, e.prototype.isResolved = t.prototype._isResolved = function () {
            return (402653184 & this._bitField) > 0
        }, t.prototype.isPending = function () {
            return this._target()._isPending()
        }, t.prototype.isRejected = function () {
            return this._target()._isRejected()
        }, t.prototype.isFulfilled = function () {
            return this._target()._isFulfilled()
        }, t.prototype.isResolved = function () {
            return this._target()._isResolved()
        }, t.prototype._value = function () {
            return this._settledValue
        }, t.prototype._reason = function () {
            return this._unsetRejectionIsUnhandled(), this._settledValue
        }, t.prototype.value = function () {
            var t = this._target();
            if (!t.isFulfilled()) throw new TypeError("cannot get fulfillment value of a non-fulfilled promise\n\n    See http://goo.gl/hc1DLj\n");
            return t._settledValue
        }, t.prototype.reason = function () {
            var t = this._target();
            if (!t.isRejected()) throw new TypeError("cannot get rejection reason of a non-rejected promise\n\n    See http://goo.gl/hPuiwB\n");
            return t._unsetRejectionIsUnhandled(), t._settledValue
        }, t.PromiseInspection = e
    }, Fe = function (t, e, r, n) {
        var o = jt, i = o.canEvaluate, s = o.tryCatch, a = o.errorObj;
        if (i) {
            for (var c = function (t) {
                return new Function("value", "holder", "                             \n            'use strict';                                                    \n            holder.pIndex = value;                                           \n            holder.checkFulfillment(this);                                   \n            ".replace(/Index/g, t))
            }, u = function (t) {
                for (var e = [], r = 1; r <= t; ++r) e.push("holder.p" + r);
                return new Function("holder", "                                      \n            'use strict';                                                    \n            var callback = holder.fn;                                        \n            return callback(values);                                         \n            ".replace(/values/g, e.join(", ")))
            }, l = [], h = [void 0], f = 1; f <= 5; ++f) l.push(c(f)), h.push(u(f));
            var p = function (t, e) {
                this.p1 = this.p2 = this.p3 = this.p4 = this.p5 = null, this.fn = e, this.total = t, this.now = 0
            };
            p.prototype.callers = h, p.prototype.checkFulfillment = function (t) {
                var e = this.now;
                e++;
                var r = this.total;
                if (e >= r) {
                    var n = this.callers[r];
                    t._pushContext();
                    var o = s(n)(this);
                    t._popContext(), o === a ? t._rejectCallback(o.e, !1, !0) : t._resolveCallback(o)
                } else this.now = e
            };
            var d = function (t) {
                this._reject(t)
            }
        }
        t.join = function () {
            var o, s = arguments.length - 1;
            if (s > 0 && "function" == typeof arguments[s] && (o = arguments[s], s < 6 && i)) {
                (_ = new t(n))._captureStackTrace();
                for (var a = new p(s, o), c = l, u = 0; u < s; ++u) {
                    var h = r(arguments[u], _);
                    h instanceof t ? (h = h._target())._isPending() ? h._then(c[u], d, void 0, _, a) : h._isFulfilled() ? c[u].call(_, h._value(), a) : _._reject(h._reason()) : c[u].call(_, h, a)
                }
                return _
            }
            for (var f = arguments.length, v = new Array(f), y = 0; y < f; ++y) v[y] = arguments[y];
            o && v.pop();
            var _ = new e(v).promise();
            return void 0 !== o ? _.spread(o) : _
        }
    }, xe = function (t, e, r, n, o) {
        var i = t._getDomain, s = zt, a = jt, c = a.tryCatch, u = a.errorObj, l = {}, h = [];

        function f(t, e, r, n) {
            this.constructor$(t), this._promise._captureStackTrace();
            var a = i();
            this._callback = null === a ? e : a.bind(e), this._preservedValues = n === o ? new Array(this.length()) : null, this._limit = r, this._inFlight = 0, this._queue = r >= 1 ? [] : h, s.invoke(p, this, void 0)
        }

        function p() {
            this._init$(void 0, -2)
        }

        function d(t, e, r, n) {
            var o = "object" == typeof r && null !== r ? r.concurrency : 0;
            return new f(t, e, o = "number" == typeof o && isFinite(o) && o >= 1 ? o : 0, n)
        }

        a.inherits(f, e), f.prototype._init = function () {
        }, f.prototype._promiseFulfilled = function (e, r) {
            var o = this._values, i = this.length(), s = this._preservedValues, a = this._limit;
            if (o[r] === l) {
                if (o[r] = e, a >= 1 && (this._inFlight--, this._drainQueue(), this._isResolved())) return
            } else {
                if (a >= 1 && this._inFlight >= a) return o[r] = e, void this._queue.push(r);
                null !== s && (s[r] = e);
                var h = this._callback, f = this._promise._boundValue();
                this._promise._pushContext();
                var p = c(h).call(f, e, r, i);
                if (this._promise._popContext(), p === u) return this._reject(p.e);
                var d = n(p, this._promise);
                if (d instanceof t) {
                    if ((d = d._target())._isPending()) return a >= 1 && this._inFlight++, o[r] = l, d._proxyPromiseArray(this, r);
                    if (!d._isFulfilled()) return this._reject(d._reason());
                    p = d._value()
                }
                o[r] = p
            }
            ++this._totalResolved >= i && (null !== s ? this._filter(o, s) : this._resolve(o))
        }, f.prototype._drainQueue = function () {
            for (var t = this._queue, e = this._limit, r = this._values; t.length > 0 && this._inFlight < e;) {
                if (this._isResolved()) return;
                var n = t.pop();
                this._promiseFulfilled(r[n], n)
            }
        }, f.prototype._filter = function (t, e) {
            for (var r = e.length, n = new Array(r), o = 0, i = 0; i < r; ++i) t[i] && (n[o++] = e[i]);
            n.length = o, this._resolve(n)
        }, f.prototype.preservedValues = function () {
            return this._preservedValues
        }, t.prototype.map = function (t, e) {
            return "function" != typeof t ? r("fn must be a function\n\n    See http://goo.gl/916lJJ\n") : d(this, t, e, null).promise()
        }, t.map = function (t, e, n, o) {
            return "function" != typeof e ? r("fn must be a function\n\n    See http://goo.gl/916lJJ\n") : d(t, e, n, o).promise()
        }
    }, Oe = function (t) {
        var e = zt, r = ne.CancellationError;
        t.prototype._cancel = function (t) {
            if (!this.isCancellable()) return this;
            for (var e, r = this; void 0 !== (e = r._cancellationParent) && e.isCancellable();) r = e;
            this._unsetCancellable(), r._target()._rejectCallback(t, !1, !0)
        }, t.prototype.cancel = function (t) {
            return this.isCancellable() ? (void 0 === t && (t = new r), e.invokeLater(this._cancel, this, t), this) : this
        }, t.prototype.cancellable = function () {
            return this._cancellable() ? this : (e.enableTrampoline(), this._setCancellable(), this._cancellationParent = void 0, this)
        }, t.prototype.uncancellable = function () {
            var t = this.then();
            return t._unsetCancellable(), t
        }, t.prototype.fork = function (t, e, r) {
            var n = this._then(t, e, r, void 0, void 0);
            return n._setCancellable(), n._cancellationParent = void 0, n
        }
    }, Te = function (t, e, r, n) {
        var o = ne.TypeError, i = jt.inherits, s = t.PromiseInspection;

        function a(e) {
            for (var r = e.length, n = 0; n < r; ++n) {
                var o = e[n];
                if (o.isRejected()) return t.reject(o.error());
                e[n] = o._settledValue
            }
            return e
        }

        function c(t) {
            setTimeout(function () {
                throw t
            }, 0)
        }

        function u(e, n) {
            var o = 0, i = e.length, s = t.defer();
            return function a() {
                if (o >= i) return s.resolve();
                var u = function (t) {
                    var e = r(t);
                    return e !== t && "function" == typeof t._isDisposable && "function" == typeof t._getDisposer && t._isDisposable() && e._setDisposable(t._getDisposer()), e
                }(e[o++]);
                if (u instanceof t && u._isDisposable()) {
                    try {
                        u = r(u._getDisposer().tryDispose(n), e.promise)
                    } catch (t) {
                        return c(t)
                    }
                    if (u instanceof t) return u._then(a, c, null, null, null)
                }
                a()
            }(), s.promise
        }

        function l(t) {
            var e = new s;
            return e._settledValue = t, e._bitField = 268435456, u(this, e).thenReturn(t)
        }

        function h(t) {
            var e = new s;
            return e._settledValue = t, e._bitField = 134217728, u(this, e).thenThrow(t)
        }

        function f(t, e, r) {
            this._data = t, this._promise = e, this._context = r
        }

        function p(t, e, r) {
            this.constructor$(t, e, r)
        }

        function d(t) {
            return f.isDisposer(t) ? (this.resources[this.index]._setDisposable(t), t.promise()) : t
        }

        f.prototype.data = function () {
            return this._data
        }, f.prototype.promise = function () {
            return this._promise
        }, f.prototype.resource = function () {
            return this.promise().isFulfilled() ? this.promise().value() : null
        }, f.prototype.tryDispose = function (t) {
            var e = this.resource(), r = this._context;
            void 0 !== r && r._pushContext();
            var n = null !== e ? this.doDispose(e, t) : null;
            return void 0 !== r && r._popContext(), this._promise._unsetDisposable(), this._data = null, n
        }, f.isDisposer = function (t) {
            return null != t && "function" == typeof t.resource && "function" == typeof t.tryDispose
        }, i(p, f), p.prototype.doDispose = function (t, e) {
            return this.data().call(t, t, e)
        }, t.using = function () {
            var n = arguments.length;
            if (n < 2) return e("you must pass at least 2 arguments to Promise.using");
            var o, i = arguments[n - 1];
            if ("function" != typeof i) return e("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
            var s = !0;
            2 === n && Array.isArray(arguments[0]) ? (n = (o = arguments[0]).length, s = !1) : (o = arguments, n--);
            for (var c = new Array(n), u = 0; u < n; ++u) {
                var p = o[u];
                if (f.isDisposer(p)) {
                    var v = p;
                    (p = p.promise())._setDisposable(v)
                } else {
                    var y = r(p);
                    y instanceof t && (p = y._then(d, null, null, {resources: c, index: u}, void 0))
                }
                c[u] = p
            }
            var _ = t.settle(c).then(a).then(function (t) {
                var e;
                _._pushContext();
                try {
                    e = s ? i.apply(void 0, t) : i.call(void 0, t)
                } finally {
                    _._popContext()
                }
                return e
            })._then(l, h, void 0, c, void 0);
            return c.promise = _, _
        }, t.prototype._setDisposable = function (t) {
            this._bitField = 262144 | this._bitField, this._disposer = t
        }, t.prototype._isDisposable = function () {
            return (262144 & this._bitField) > 0
        }, t.prototype._getDisposer = function () {
            return this._disposer
        }, t.prototype._unsetDisposable = function () {
            this._bitField = -262145 & this._bitField, this._disposer = void 0
        }, t.prototype.disposer = function (t) {
            if ("function" == typeof t) return new p(t, this, n());
            throw new o
        }
    }, Pe = function (t, e, r, n) {
        var o = ne.TypeError, i = jt, s = i.errorObj, a = i.tryCatch, c = [];

        function u(e, n, o, i) {
            (this._promise = new t(r))._captureStackTrace(), this._stack = i, this._generatorFunction = e, this._receiver = n, this._generator = void 0, this._yieldHandlers = "function" == typeof o ? [o].concat(c) : c
        }

        u.prototype.promise = function () {
            return this._promise
        }, u.prototype._run = function () {
            this._generator = this._generatorFunction.call(this._receiver), this._receiver = this._generatorFunction = void 0, this._next(void 0)
        }, u.prototype._continue = function (e) {
            if (e === s) return this._promise._rejectCallback(e.e, !1, !0);
            var r = e.value;
            if (!0 === e.done) this._promise._resolveCallback(r); else {
                var i = n(r, this._promise);
                if (!(i instanceof t) && null === (i = function (e, r, o) {
                    for (var i = 0; i < r.length; ++i) {
                        o._pushContext();
                        var c = a(r[i])(e);
                        if (o._popContext(), c === s) {
                            o._pushContext();
                            var u = t.reject(s.e);
                            return o._popContext(), u
                        }
                        var l = n(c, o);
                        if (l instanceof t) return l
                    }
                    return null
                }(i, this._yieldHandlers, this._promise))) return void this._throw(new o("A value %s was yielded that could not be treated as a promise\n\n    See http://goo.gl/4Y4pDk\n\n".replace("%s", r) + "From coroutine:\n" + this._stack.split("\n").slice(1, -7).join("\n")));
                i._then(this._next, this._throw, void 0, this, null)
            }
        }, u.prototype._throw = function (t) {
            this._promise._attachExtraTrace(t), this._promise._pushContext();
            var e = a(this._generator.throw).call(this._generator, t);
            this._promise._popContext(), this._continue(e)
        }, u.prototype._next = function (t) {
            this._promise._pushContext();
            var e = a(this._generator.next).call(this._generator, t);
            this._promise._popContext(), this._continue(e)
        }, t.coroutine = function (t, e) {
            if ("function" != typeof t) throw new o("generatorFunction must be a function\n\n    See http://goo.gl/6Vqhm0\n");
            var r = Object(e).yieldHandler, n = u, i = (new Error).stack;
            return function () {
                var e = t.apply(this, arguments), o = new n(void 0, void 0, r, i);
                return o._generator = e, o._next(void 0), o.promise()
            }
        }, t.coroutine.addYieldHandler = function (t) {
            if ("function" != typeof t) throw new o("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
            c.push(t)
        }, t.spawn = function (r) {
            if ("function" != typeof r) return e("generatorFunction must be a function\n\n    See http://goo.gl/6Vqhm0\n");
            var n = new u(r, this), o = n.promise();
            return n._run(t.spawn), o
        }
    }, Re = function (t) {
        var e = jt, r = zt, n = e.tryCatch, o = e.errorObj;

        function i(t, i) {
            if (!e.isArray(t)) return s.call(this, t, i);
            var a = n(i).apply(this._boundValue(), [null].concat(t));
            a === o && r.throwLater(a.e)
        }

        function s(t, e) {
            var i = this._boundValue(), s = void 0 === t ? n(e).call(i, null) : n(e).call(i, null, t);
            s === o && r.throwLater(s.e)
        }

        function a(t, e) {
            if (!t) {
                var i = this._target()._getCarriedStackTrace();
                i.cause = t, t = i
            }
            var s = n(e).call(this._boundValue(), t);
            s === o && r.throwLater(s.e)
        }

        t.prototype.asCallback = t.prototype.nodeify = function (t, e) {
            if ("function" == typeof t) {
                var r = s;
                void 0 !== e && Object(e).spread && (r = i), this._then(r, a, void 0, this, t)
            }
            return this
        }
    }, De = Object.create;
    if (De) {
        var Ie = De(null), Be = De(null);
        Ie[" size"] = Be[" size"] = 0
    }
    var Ne = function (t) {
        var e, r, n = jt, o = n.canEvaluate, i = n.isIdentifier, s = function (t) {
            return new Function("ensureMethod", "                                    \n        return function(obj) {                                               \n            'use strict'                                                     \n            var len = this.length;                                           \n            ensureMethod(obj, 'methodName');                                 \n            switch(len) {                                                    \n                case 1: return obj.methodName(this[0]);                      \n                case 2: return obj.methodName(this[0], this[1]);             \n                case 3: return obj.methodName(this[0], this[1], this[2]);    \n                case 0: return obj.methodName();                             \n                default:                                                     \n                    return obj.methodName.apply(obj, this);                  \n            }                                                                \n        };                                                                   \n        ".replace(/methodName/g, t))(u)
        }, a = function (t) {
            return new Function("obj", "                                             \n        'use strict';                                                        \n        return obj.propertyName;                                             \n        ".replace("propertyName", t))
        }, c = function (t, e, r) {
            var n = r[t];
            if ("function" != typeof n) {
                if (!i(t)) return null;
                if (n = e(t), r[t] = n, r[" size"]++, r[" size"] > 512) {
                    for (var o = Object.keys(r), s = 0; s < 256; ++s) delete r[o[s]];
                    r[" size"] = o.length - 256
                }
            }
            return n
        };

        function u(e, r) {
            var o;
            if (null != e && (o = e[r]), "function" != typeof o) {
                var i = "Object " + n.classString(e) + " has no method '" + n.toString(r) + "'";
                throw new t.TypeError(i)
            }
            return o
        }

        function l(t) {
            return u(t, this.pop()).apply(t, this)
        }

        function h(t) {
            return t[this]
        }

        function f(t) {
            var e = +this;
            return e < 0 && (e = Math.max(0, e + t.length)), t[e]
        }

        e = function (t) {
            return c(t, s, Ie)
        }, r = function (t) {
            return c(t, a, Be)
        }, t.prototype.call = function (t) {
            for (var r = arguments.length, n = new Array(r - 1), i = 1; i < r; ++i) n[i - 1] = arguments[i];
            if (o) {
                var s = e(t);
                if (null !== s) return this._then(s, void 0, void 0, n, void 0)
            }
            return n.push(t), this._then(l, void 0, void 0, n, void 0)
        }, t.prototype.get = function (t) {
            var e;
            if ("number" == typeof t) e = f; else if (o) {
                var n = r(t);
                e = null !== n ? n : h
            } else e = h;
            return this._then(e, void 0, void 0, t, void 0)
        }
    }, Ue = function (t, e, r, n) {
        var o = jt, i = o.isObject, s = M;

        function a(t) {
            for (var e = s.keys(t), r = e.length, n = new Array(2 * r), o = 0; o < r; ++o) {
                var i = e[o];
                n[o] = t[i], n[o + r] = i
            }
            this.constructor$(n)
        }

        function c(e) {
            var o, s = r(e);
            return i(s) ? (o = s instanceof t ? s._then(t.props, void 0, void 0, void 0, void 0) : new a(s).promise(), s instanceof t && o._propagateFrom(s, 4), o) : n("cannot await properties of a non-object\n\n    See http://goo.gl/OsFKC8\n")
        }

        o.inherits(a, e), a.prototype._init = function () {
            this._init$(void 0, -3)
        }, a.prototype._promiseFulfilled = function (t, e) {
            if (this._values[e] = t, ++this._totalResolved >= this._length) {
                for (var r = {}, n = this.length(), o = 0, i = this.length(); o < i; ++o) r[this._values[o + n]] = this._values[o];
                this._resolve(r)
            }
        }, a.prototype._promiseProgressed = function (t, e) {
            this._promise._progress({key: this._values[e + this.length()], value: t})
        }, a.prototype.shouldCopyValues = function () {
            return !1
        }, a.prototype.getActualLength = function (t) {
            return t >> 1
        }, t.prototype.props = function () {
            return c(this)
        }, t.props = function (t) {
            return c(t)
        }
    }, Me = function (t, e, r, n) {
        var o = jt.isArray, i = function (t) {
            return t.then(function (e) {
                return s(e, t)
            })
        };

        function s(s, a) {
            var c = r(s);
            if (c instanceof t) return i(c);
            if (!o(s)) return n("expecting an array, a promise or a thenable\n\n    See http://goo.gl/s8MMhc\n");
            var u = new t(e);
            void 0 !== a && u._propagateFrom(a, 5);
            for (var l = u._fulfill, h = u._reject, f = 0, p = s.length; f < p; ++f) {
                var d = s[f];
                (void 0 !== d || f in s) && t.cast(d)._then(l, h, void 0, u, null)
            }
            return u
        }

        t.race = function (t) {
            return s(t, void 0)
        }, t.prototype.race = function () {
            return s(this, void 0)
        }
    }, ze = function (t, e, r, n, o) {
        var i = t._getDomain, s = zt, a = jt, c = a.tryCatch, u = a.errorObj;

        function l(e, r, a, c) {
            this.constructor$(e), this._promise._captureStackTrace(), this._preservedValues = c === o ? [] : null, this._zerothIsAccum = void 0 === a, this._gotAccum = !1, this._reducingIndex = this._zerothIsAccum ? 1 : 0, this._valuesPhase = void 0;
            var u = n(a, this._promise), l = !1, f = u instanceof t;
            f && ((u = u._target())._isPending() ? u._proxyPromiseArray(this, -1) : u._isFulfilled() ? (a = u._value(), this._gotAccum = !0) : (this._reject(u._reason()), l = !0)), f || this._zerothIsAccum || (this._gotAccum = !0);
            var p = i();
            this._callback = null === p ? r : p.bind(r), this._accum = a, l || s.invoke(h, this, void 0)
        }

        function h() {
            this._init$(void 0, -5)
        }

        function f(t, e, n, o) {
            return "function" != typeof e ? r("fn must be a function\n\n    See http://goo.gl/916lJJ\n") : new l(t, e, n, o).promise()
        }

        a.inherits(l, e), l.prototype._init = function () {
        }, l.prototype._resolveEmptyArray = function () {
            (this._gotAccum || this._zerothIsAccum) && this._resolve(null !== this._preservedValues ? [] : this._accum)
        }, l.prototype._promiseFulfilled = function (e, r) {
            var o = this._values;
            o[r] = e;
            var i, s = this.length(), a = this._preservedValues, l = null !== a, h = this._gotAccum,
                f = this._valuesPhase;
            if (!f) for (f = this._valuesPhase = new Array(s), i = 0; i < s; ++i) f[i] = 0;
            if (i = f[r], 0 === r && this._zerothIsAccum ? (this._accum = e, this._gotAccum = h = !0, f[r] = 0 === i ? 1 : 2) : -1 === r ? (this._accum = e, this._gotAccum = h = !0) : 0 === i ? f[r] = 1 : (f[r] = 2, this._accum = e), h) {
                for (var p, d = this._callback, v = this._promise._boundValue(), y = this._reducingIndex; y < s; ++y) if (2 !== (i = f[y])) {
                    if (1 !== i) return;
                    if (e = o[y], this._promise._pushContext(), l ? (a.push(e), p = c(d).call(v, e, y, s)) : p = c(d).call(v, this._accum, e, y, s), this._promise._popContext(), p === u) return this._reject(p.e);
                    var _ = n(p, this._promise);
                    if (_ instanceof t) {
                        if ((_ = _._target())._isPending()) return f[y] = 4, _._proxyPromiseArray(this, y);
                        if (!_._isFulfilled()) return this._reject(_._reason());
                        p = _._value()
                    }
                    this._reducingIndex = y + 1, this._accum = p
                } else this._reducingIndex = y + 1;
                this._resolve(l ? a : this._accum)
            }
        }, t.prototype.reduce = function (t, e) {
            return f(this, t, e, null)
        }, t.reduce = function (t, e, r, n) {
            return f(t, e, r, n)
        }
    }, Le = function (t, e) {
        var r = t.PromiseInspection;

        function n(t) {
            this.constructor$(t)
        }

        jt.inherits(n, e), n.prototype._promiseResolved = function (t, e) {
            this._values[t] = e, ++this._totalResolved >= this._length && this._resolve(this._values)
        }, n.prototype._promiseFulfilled = function (t, e) {
            var n = new r;
            n._bitField = 268435456, n._settledValue = t, this._promiseResolved(e, n)
        }, n.prototype._promiseRejected = function (t, e) {
            var n = new r;
            n._bitField = 134217728, n._settledValue = t, this._promiseResolved(e, n)
        }, t.settle = function (t) {
            return new n(t).promise()
        }, t.prototype.settle = function () {
            return new n(this).promise()
        }
    }, qe = function (t, e, r) {
        var n = jt, o = ne.RangeError, i = ne.AggregateError, s = n.isArray;

        function a(t) {
            this.constructor$(t), this._howMany = 0, this._unwrap = !1, this._initialized = !1
        }

        function c(t, e) {
            if ((0 | e) !== e || e < 0) return r("expecting a positive integer\n\n    See http://goo.gl/1wAmHx\n");
            var n = new a(t), o = n.promise();
            return n.setHowMany(e), n.init(), o
        }

        n.inherits(a, e), a.prototype._init = function () {
            if (this._initialized) if (0 !== this._howMany) {
                this._init$(void 0, -5);
                var t = s(this._values);
                !this._isResolved() && t && this._howMany > this._canPossiblyFulfill() && this._reject(this._getRangeError(this.length()))
            } else this._resolve([])
        }, a.prototype.init = function () {
            this._initialized = !0, this._init()
        }, a.prototype.setUnwrap = function () {
            this._unwrap = !0
        }, a.prototype.howMany = function () {
            return this._howMany
        }, a.prototype.setHowMany = function (t) {
            this._howMany = t
        }, a.prototype._promiseFulfilled = function (t) {
            this._addFulfilled(t), this._fulfilled() === this.howMany() && (this._values.length = this.howMany(), 1 === this.howMany() && this._unwrap ? this._resolve(this._values[0]) : this._resolve(this._values))
        }, a.prototype._promiseRejected = function (t) {
            if (this._addRejected(t), this.howMany() > this._canPossiblyFulfill()) {
                for (var e = new i, r = this.length(); r < this._values.length; ++r) e.push(this._values[r]);
                this._reject(e)
            }
        }, a.prototype._fulfilled = function () {
            return this._totalResolved
        }, a.prototype._rejected = function () {
            return this._values.length - this.length()
        }, a.prototype._addRejected = function (t) {
            this._values.push(t)
        }, a.prototype._addFulfilled = function (t) {
            this._values[this._totalResolved++] = t
        }, a.prototype._canPossiblyFulfill = function () {
            return this.length() - this._rejected()
        }, a.prototype._getRangeError = function (t) {
            var e = "Input array must contain at least " + this._howMany + " items but contains only " + t + " items";
            return new o(e)
        }, a.prototype._resolveEmptyArray = function () {
            this._reject(this._getRangeError(0))
        }, t.some = function (t, e) {
            return c(t, e)
        }, t.prototype.some = function (t) {
            return c(this, t)
        }, t._SomePromiseArray = a
    }, He = function (t, e) {
        var r = {}, n = jt, o = we._nodebackForPromise, i = n.withAppended, s = n.maybeWrapAsError, a = n.canEvaluate,
            c = ne.TypeError, u = {__isPromisified__: !0},
            l = new RegExp("^(?:" + ["arity", "length", "name", "arguments", "caller", "callee", "prototype", "__isPromisified__"].join("|") + ")$"),
            h = function (t) {
                return n.isIdentifier(t) && "_" !== t.charAt(0) && "constructor" !== t
            };

        function f(t) {
            return !l.test(t)
        }

        function p(t) {
            try {
                return !0 === t.__isPromisified__
            } catch (t) {
                return !1
            }
        }

        function d(t, e, r) {
            var o = n.getDataPropertyOrDefault(t, e + r, u);
            return !!o && p(o)
        }

        function v(t, e, r, o) {
            for (var i = n.inheritedDataKeys(t), s = [], a = 0; a < i.length; ++a) {
                var u = i[a], l = t[u], f = o === h || h(u);
                "function" != typeof l || p(l) || d(t, u, e) || !o(u, l, t, f) || s.push(u, l)
            }
            return function (t, e, r) {
                for (var n = 0; n < t.length; n += 2) {
                    var o = t[n];
                    if (r.test(o)) for (var i = o.replace(r, ""), s = 0; s < t.length; s += 2) if (t[s] === i) throw new c("Cannot promisify an API that has normal methods with '%s'-suffix\n\n    See http://goo.gl/iWrZbw\n".replace("%s", e))
                }
            }(s, e, r), s
        }

        var y = function (t) {
            return t.replace(/([$])/, "\\$")
        }, _ = function (t) {
            return n.filledRange(t, "_arg", "")
        };
        var g = a ? function (a, c, u, l) {
            var h = Math.max(0, function (t) {
                return "number" == typeof t.length ? Math.max(Math.min(t.length, 1024), 0) : 0
            }(l) - 1), f = function (t) {
                for (var e = [t], r = Math.max(0, t - 1 - 3), n = t - 1; n >= r; --n) e.push(n);
                for (n = t + 1; n <= 3; ++n) e.push(n);
                return e
            }(h), p = "string" == typeof a || c === r;
            var d = "string" == typeof a ? "this != null ? this['" + a + "'] : fn" : "fn";
            return new Function("Promise", "fn", "receiver", "withAppended", "maybeWrapAsError", "nodebackForPromise", "tryCatch", "errorObj", "notEnumerableProp", "INTERNAL", "'use strict';                            \n        var ret = function (Parameters) {                                    \n            'use strict';                                                    \n            var len = arguments.length;                                      \n            var promise = new Promise(INTERNAL);                             \n            promise._captureStackTrace();                                    \n            var nodeback = nodebackForPromise(promise);                      \n            var ret;                                                         \n            var callback = tryCatch([GetFunctionCode]);                      \n            switch(len) {                                                    \n                [CodeForSwitchCase]                                          \n            }                                                                \n            if (ret === errorObj) {                                          \n                promise._rejectCallback(maybeWrapAsError(ret.e), true, true);\n            }                                                                \n            return promise;                                                  \n        };                                                                   \n        notEnumerableProp(ret, '__isPromisified__', true);                   \n        return ret;                                                          \n        ".replace("Parameters", function (t) {
                return n.filledRange(Math.max(t, 3), "_arg", "")
            }(h)).replace("[CodeForSwitchCase]", function () {
                for (var t, e, r, n = "", o = 0; o < f.length; ++o) n += "case " + f[o] + ":" + (t = f[o], e = void 0, r = void 0, e = _(t).join(", "), r = t > 0 ? ", " : "", (p ? "ret = callback.call(this, {{args}}, nodeback); break;\n" : void 0 === c ? "ret = callback({{args}}, nodeback); break;\n" : "ret = callback.call(receiver, {{args}}, nodeback); break;\n").replace("{{args}}", e).replace(", ", r));
                return n += "                                                             \n        default:                                                             \n            var args = new Array(len + 1);                                   \n            var i = 0;                                                       \n            for (var i = 0; i < len; ++i) {                                  \n               args[i] = arguments[i];                                       \n            }                                                                \n            args[i] = nodeback;                                              \n            [CodeForCall]                                                    \n            break;                                                           \n        ".replace("[CodeForCall]", p ? "ret = callback.apply(this, args);\n" : "ret = callback.apply(receiver, args);\n")
            }()).replace("[GetFunctionCode]", d))(t, l, c, i, s, o, n.tryCatch, n.errorObj, n.notEnumerableProp, e)
        } : function (a, c, u, l) {
            var h = function () {
                return this
            }(), f = a;

            function p() {
                var n = c;
                c === r && (n = this);
                var u = new t(e);
                u._captureStackTrace();
                var l = "string" == typeof f && this !== h ? this[f] : a, p = o(u);
                try {
                    l.apply(n, i(arguments, p))
                } catch (t) {
                    u._rejectCallback(s(t), !0, !0)
                }
                return u
            }

            return "string" == typeof f && (a = l), n.notEnumerableProp(p, "__isPromisified__", !0), p
        };

        function m(t, e, o, i) {
            for (var s = new RegExp(y(e) + "$"), a = v(t, e, s, o), c = 0, u = a.length; c < u; c += 2) {
                var l = a[c], h = a[c + 1], f = l + e;
                if (i === g) t[f] = g(l, r, l, h, e); else {
                    var p = i(h, function () {
                        return g(l, r, l, h, e)
                    });
                    n.notEnumerableProp(p, "__isPromisified__", !0), t[f] = p
                }
            }
            return n.toFastProperties(t), t
        }

        function w(t, e) {
            return g(t, e, void 0, t)
        }

        t.promisify = function (t, e) {
            if ("function" != typeof t) throw new c("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
            if (p(t)) return t;
            var o = w(t, arguments.length < 2 ? r : e);
            return n.copyDescriptors(t, o, f), o
        }, t.promisifyAll = function (t, e) {
            if ("function" != typeof t && "object" != typeof t) throw new c("the target of promisifyAll must be an object or a function\n\n    See http://goo.gl/9ITlV0\n");
            var r = (e = Object(e)).suffix;
            "string" != typeof r && (r = "Async");
            var o = e.filter;
            "function" != typeof o && (o = h);
            var i = e.promisifier;
            if ("function" != typeof i && (i = g), !n.isIdentifier(r)) throw new RangeError("suffix must be a valid identifier\n\n    See http://goo.gl/8FZo5V\n");
            for (var s = n.inheritedDataKeys(t), a = 0; a < s.length; ++a) {
                var u = t[s[a]];
                "constructor" !== s[a] && n.isClass(u) && (m(u.prototype, r, o, i), m(u, r, o, i))
            }
            return m(t, r, o, i)
        }
    }, Ve = function (t) {
        var e = t._SomePromiseArray;

        function r(t) {
            var r = new e(t), n = r.promise();
            return r.setHowMany(1), r.setUnwrap(), r.init(), n
        }

        t.any = function (t) {
            return r(t)
        }, t.prototype.any = function () {
            return r(this)
        }
    }, We = function (t, e) {
        var r = t.reduce;
        t.prototype.each = function (t) {
            return r(this, t, null, e)
        }, t.each = function (t, n) {
            return r(t, n, null, e)
        }
    }, Ke = function (t, e) {
        var r = jt, n = t.TimeoutError, o = function (t) {
            return i(+this).thenReturn(t)
        }, i = t.delay = function (r, n) {
            if (void 0 === n) {
                n = r, r = void 0;
                var i = new t(e);
                return setTimeout(function () {
                    i._fulfill()
                }, n), i
            }
            return n = +n, t.resolve(r)._then(o, null, null, n, void 0)
        };

        function s(t) {
            var e = this;
            return e instanceof Number && (e = +e), clearTimeout(e), t
        }

        function a(t) {
            var e = this;
            throw e instanceof Number && (e = +e), clearTimeout(e), t
        }

        t.prototype.delay = function (t) {
            return i(this, t)
        }, t.prototype.timeout = function (t, e) {
            t = +t;
            var o = this.then().cancellable();
            o._cancellationParent = this;
            var i = setTimeout(function () {
                !function (t, e) {
                    var o;
                    t.isPending() && (!r.isPrimitive(e) && e instanceof Error ? o = e : ("string" != typeof e && (e = "operation timed out"), o = new n(e)), r.markAsOriginatingFromRejection(o), t._attachExtraTrace(o), t._cancel(o))
                }(o, e)
            }, t);
            return o._then(s, a, void 0, i, void 0)
        }
    }, $e = function (t, e) {
        var r = t.map;
        t.prototype.filter = function (t, n) {
            return r(this, t, n, e)
        }, t.filter = function (t, n, o) {
            return r(t, n, o, e)
        }
    }, Qe = U(function (t) {
        t.exports = function () {
            var e, r = function () {
                return new u("circular promise resolution chain\n\n    See http://goo.gl/LhFpo0\n")
            }, n = function () {
                return new E.PromiseInspection(this._target())
            }, o = function (t) {
                return E.reject(new u(t))
            }, i = jt;
            e = i.isNode ? function () {
                var t = process.domain;
                return void 0 === t && (t = null), t
            } : function () {
                return null
            }, i.notEnumerableProp(E, "_getDomain", e);
            var s = {}, a = zt, c = ne, u = E.TypeError = c.TypeError;
            E.RangeError = c.RangeError, E.CancellationError = c.CancellationError, E.TimeoutError = c.TimeoutError, E.OperationalError = c.OperationalError, E.RejectionError = c.OperationalError, E.AggregateError = c.AggregateError;
            var l = function () {
                }, h = {}, f = {e: null}, p = oe(E, l), d = ie(E, l, p, o), v = se(), y = ae(E, v), _ = ce(E, v, y),
                g = ue(f), m = we, w = m._nodebackForPromise, b = i.errorObj, k = i.tryCatch;

            function E(t) {
                if ("function" != typeof t) throw new u("the promise constructor requires a resolver function\n\n    See http://goo.gl/EC22Yn\n");
                if (this.constructor !== E) throw new u("the promise constructor cannot be invoked directly\n\n    See http://goo.gl/KsIlge\n");
                this._bitField = 0, this._fulfillmentHandler0 = void 0, this._rejectionHandler0 = void 0, this._progressHandler0 = void 0, this._promise0 = void 0, this._receiver0 = void 0, this._settledValue = void 0, t !== l && this._resolveFromResolver(t)
            }

            function C(t) {
                var e = new E(l);
                e._fulfillmentHandler0 = t, e._rejectionHandler0 = t, e._progressHandler0 = t, e._promise0 = t, e._receiver0 = t, e._settledValue = t
            }

            return E.prototype.toString = function () {
                return "[object Promise]"
            }, E.prototype.caught = E.prototype.catch = function (t) {
                var e = arguments.length;
                if (e > 1) {
                    var r, n = new Array(e - 1), o = 0;
                    for (r = 0; r < e - 1; ++r) {
                        var i = arguments[r];
                        if ("function" != typeof i) return E.reject(new u("Catch filter must inherit from Error or be a simple predicate function\n\n    See http://goo.gl/o84o68\n"));
                        n[o++] = i
                    }
                    n.length = o, t = arguments[r];
                    var s = new g(n, t, this);
                    return this._then(void 0, s.doFilter, void 0, s, void 0)
                }
                return this._then(void 0, t, void 0, void 0, void 0)
            }, E.prototype.reflect = function () {
                return this._then(n, n, void 0, this, void 0)
            }, E.prototype.then = function (t, e, r) {
                if (y() && arguments.length > 0 && "function" != typeof t && "function" != typeof e) {
                    var n = ".then() only accepts functions but was passed: " + i.classString(t);
                    arguments.length > 1 && (n += ", " + i.classString(e)), this._warn(n)
                }
                return this._then(t, e, r, void 0, void 0)
            }, E.prototype.done = function (t, e, r) {
                this._then(t, e, r, void 0, void 0)._setIsFinal()
            }, E.prototype.spread = function (t, e) {
                return this.all()._then(t, e, void 0, h, void 0)
            }, E.prototype.isCancellable = function () {
                return !this.isResolved() && this._cancellable()
            }, E.prototype.toJSON = function () {
                var t = {isFulfilled: !1, isRejected: !1, fulfillmentValue: void 0, rejectionReason: void 0};
                return this.isFulfilled() ? (t.fulfillmentValue = this.value(), t.isFulfilled = !0) : this.isRejected() && (t.rejectionReason = this.reason(), t.isRejected = !0), t
            }, E.prototype.all = function () {
                return new d(this).promise()
            }, E.prototype.error = function (t) {
                return this.caught(i.originatesFromRejection, t)
            }, E.getNewLibraryCopy = t.exports, E.is = function (t) {
                return t instanceof E
            }, E.fromNode = function (t) {
                var e = new E(l), r = k(t)(w(e));
                return r === b && e._rejectCallback(r.e, !0, !0), e
            }, E.all = function (t) {
                return new d(t).promise()
            }, E.defer = E.pending = function () {
                var t = new E(l);
                return new m(t)
            }, E.cast = function (t) {
                var e = p(t);
                if (!(e instanceof E)) {
                    var r = e;
                    (e = new E(l))._fulfillUnchecked(r)
                }
                return e
            }, E.resolve = E.fulfilled = E.cast, E.reject = E.rejected = function (t) {
                var e = new E(l);
                return e._captureStackTrace(), e._rejectCallback(t, !0), e
            }, E.setScheduler = function (t) {
                if ("function" != typeof t) throw new u("fn must be a function\n\n    See http://goo.gl/916lJJ\n");
                var e = a._schedule;
                return a._schedule = t, e
            }, E.prototype._then = function (t, r, n, o, i) {
                var s = void 0 !== i, c = s ? i : new E(l);
                s || (c._propagateFrom(this, 5), c._captureStackTrace());
                var u = this._target();
                u !== this && (void 0 === o && (o = this._boundTo), s || c._setIsMigrated());
                var h = u._addCallbacks(t, r, n, c, o, e());
                return u._isResolved() && !u._isSettlePromisesQueued() && a.invoke(u._settlePromiseAtPostResolution, u, h), c
            }, E.prototype._settlePromiseAtPostResolution = function (t) {
                this._isRejectionUnhandled() && this._unsetRejectionIsUnhandled(), this._settlePromiseAt(t)
            }, E.prototype._length = function () {
                return 131071 & this._bitField
            }, E.prototype._isFollowingOrFulfilledOrRejected = function () {
                return (939524096 & this._bitField) > 0
            }, E.prototype._isFollowing = function () {
                return 536870912 == (536870912 & this._bitField)
            }, E.prototype._setLength = function (t) {
                this._bitField = -131072 & this._bitField | 131071 & t
            }, E.prototype._setFulfilled = function () {
                this._bitField = 268435456 | this._bitField
            }, E.prototype._setRejected = function () {
                this._bitField = 134217728 | this._bitField
            }, E.prototype._setFollowing = function () {
                this._bitField = 536870912 | this._bitField
            }, E.prototype._setIsFinal = function () {
                this._bitField = 33554432 | this._bitField
            }, E.prototype._isFinal = function () {
                return (33554432 & this._bitField) > 0
            }, E.prototype._cancellable = function () {
                return (67108864 & this._bitField) > 0
            }, E.prototype._setCancellable = function () {
                this._bitField = 67108864 | this._bitField
            }, E.prototype._unsetCancellable = function () {
                this._bitField = -67108865 & this._bitField
            }, E.prototype._setIsMigrated = function () {
                this._bitField = 4194304 | this._bitField
            }, E.prototype._unsetIsMigrated = function () {
                this._bitField = -4194305 & this._bitField
            }, E.prototype._isMigrated = function () {
                return (4194304 & this._bitField) > 0
            }, E.prototype._receiverAt = function (t) {
                var e = 0 === t ? this._receiver0 : this[5 * t - 5 + 4];
                if (e !== s) return void 0 === e && this._isBound() ? this._boundValue() : e
            }, E.prototype._promiseAt = function (t) {
                return 0 === t ? this._promise0 : this[5 * t - 5 + 3]
            }, E.prototype._fulfillmentHandlerAt = function (t) {
                return 0 === t ? this._fulfillmentHandler0 : this[5 * t - 5 + 0]
            }, E.prototype._rejectionHandlerAt = function (t) {
                return 0 === t ? this._rejectionHandler0 : this[5 * t - 5 + 1]
            }, E.prototype._boundValue = function () {
                var t = this._boundTo;
                return void 0 !== t && t instanceof E ? t.isFulfilled() ? t.value() : void 0 : t
            }, E.prototype._migrateCallbacks = function (t, e) {
                var r = t._fulfillmentHandlerAt(e), n = t._rejectionHandlerAt(e), o = t._progressHandlerAt(e),
                    i = t._promiseAt(e), a = t._receiverAt(e);
                i instanceof E && i._setIsMigrated(), void 0 === a && (a = s), this._addCallbacks(r, n, o, i, a, null)
            }, E.prototype._addCallbacks = function (t, e, r, n, o, i) {
                var s = this._length();
                if (s >= 131066 && (s = 0, this._setLength(0)), 0 === s) this._promise0 = n, void 0 !== o && (this._receiver0 = o), "function" != typeof t || this._isCarryingStackTrace() || (this._fulfillmentHandler0 = null === i ? t : i.bind(t)), "function" == typeof e && (this._rejectionHandler0 = null === i ? e : i.bind(e)), "function" == typeof r && (this._progressHandler0 = null === i ? r : i.bind(r)); else {
                    var a = 5 * s - 5;
                    this[a + 3] = n, this[a + 4] = o, "function" == typeof t && (this[a + 0] = null === i ? t : i.bind(t)), "function" == typeof e && (this[a + 1] = null === i ? e : i.bind(e)), "function" == typeof r && (this[a + 2] = null === i ? r : i.bind(r))
                }
                return this._setLength(s + 1), s
            }, E.prototype._setProxyHandlers = function (t, e) {
                var r = this._length();
                if (r >= 131066 && (r = 0, this._setLength(0)), 0 === r) this._promise0 = e, this._receiver0 = t; else {
                    var n = 5 * r - 5;
                    this[n + 3] = e, this[n + 4] = t
                }
                this._setLength(r + 1)
            }, E.prototype._proxyPromiseArray = function (t, e) {
                this._setProxyHandlers(t, e)
            }, E.prototype._resolveCallback = function (t, e) {
                if (!this._isFollowingOrFulfilledOrRejected()) {
                    if (t === this) return this._rejectCallback(r(), !1, !0);
                    var n = p(t, this);
                    if (!(n instanceof E)) return this._fulfill(t);
                    var o = 1 | (e ? 4 : 0);
                    this._propagateFrom(n, o);
                    var i = n._target();
                    if (i._isPending()) {
                        for (var s = this._length(), a = 0; a < s; ++a) i._migrateCallbacks(this, a);
                        this._setFollowing(), this._setLength(0), this._setFollowee(i)
                    } else i._isFulfilled() ? this._fulfillUnchecked(i._value()) : this._rejectUnchecked(i._reason(), i._getCarriedStackTrace())
                }
            }, E.prototype._rejectCallback = function (t, e, r) {
                r || i.markAsOriginatingFromRejection(t);
                var n = i.ensureErrorObject(t), o = n === t;
                this._attachExtraTrace(n, !!e && o), this._reject(t, o ? void 0 : n)
            }, E.prototype._resolveFromResolver = function (t) {
                var e = this;
                this._captureStackTrace(), this._pushContext();
                var r = !0, n = k(t)(function (t) {
                    null !== e && (e._resolveCallback(t), e = null)
                }, function (t) {
                    null !== e && (e._rejectCallback(t, r), e = null)
                });
                r = !1, this._popContext(), void 0 !== n && n === b && null !== e && (e._rejectCallback(n.e, !0, !0), e = null)
            }, E.prototype._settlePromiseFromHandler = function (t, e, n, o) {
                var i;
                if (!o._isRejected()) if (o._pushContext(), i = e !== h || this._isRejected() ? k(t).call(e, n) : k(t).apply(this._boundValue(), n), o._popContext(), i === b || i === o || i === f) {
                    var s = i === o ? r() : i.e;
                    o._rejectCallback(s, !1, !0)
                } else o._resolveCallback(i)
            }, E.prototype._target = function () {
                for (var t = this; t._isFollowing();) t = t._followee();
                return t
            }, E.prototype._followee = function () {
                return this._rejectionHandler0
            }, E.prototype._setFollowee = function (t) {
                this._rejectionHandler0 = t
            }, E.prototype._cleanValues = function () {
                this._cancellable() && (this._cancellationParent = void 0)
            }, E.prototype._propagateFrom = function (t, e) {
                (1 & e) > 0 && t._cancellable() && (this._setCancellable(), this._cancellationParent = t), (4 & e) > 0 && t._isBound() && this._setBoundTo(t._boundTo)
            }, E.prototype._fulfill = function (t) {
                this._isFollowingOrFulfilledOrRejected() || this._fulfillUnchecked(t)
            }, E.prototype._reject = function (t, e) {
                this._isFollowingOrFulfilledOrRejected() || this._rejectUnchecked(t, e)
            }, E.prototype._settlePromiseAt = function (t) {
                var e = this._promiseAt(t), r = e instanceof E;
                if (r && e._isMigrated()) return e._unsetIsMigrated(), a.invoke(this._settlePromiseAt, this, t);
                var n = this._isFulfilled() ? this._fulfillmentHandlerAt(t) : this._rejectionHandlerAt(t),
                    o = this._isCarryingStackTrace() ? this._getCarriedStackTrace() : void 0, i = this._settledValue,
                    s = this._receiverAt(t);
                this._clearCallbackDataAtIndex(t), "function" == typeof n ? r ? this._settlePromiseFromHandler(n, s, i, e) : n.call(s, i, e) : s instanceof d ? s._isResolved() || (this._isFulfilled() ? s._promiseFulfilled(i, e) : s._promiseRejected(i, e)) : r && (this._isFulfilled() ? e._fulfill(i) : e._reject(i, o)), t >= 4 && 4 == (31 & t) && a.invokeLater(this._setLength, this, 0)
            }, E.prototype._clearCallbackDataAtIndex = function (t) {
                if (0 === t) this._isCarryingStackTrace() || (this._fulfillmentHandler0 = void 0), this._rejectionHandler0 = this._progressHandler0 = this._receiver0 = this._promise0 = void 0; else {
                    var e = 5 * t - 5;
                    this[e + 3] = this[e + 4] = this[e + 0] = this[e + 1] = this[e + 2] = void 0
                }
            }, E.prototype._isSettlePromisesQueued = function () {
                return -1073741824 == (-1073741824 & this._bitField)
            }, E.prototype._setSettlePromisesQueued = function () {
                this._bitField = -1073741824 | this._bitField
            }, E.prototype._unsetSettlePromisesQueued = function () {
                this._bitField = 1073741823 & this._bitField
            }, E.prototype._queueSettlePromises = function () {
                a.settlePromises(this), this._setSettlePromisesQueued()
            }, E.prototype._fulfillUnchecked = function (t) {
                if (t === this) {
                    var e = r();
                    return this._attachExtraTrace(e), this._rejectUnchecked(e, void 0)
                }
                this._setFulfilled(), this._settledValue = t, this._cleanValues(), this._length() > 0 && this._queueSettlePromises()
            }, E.prototype._rejectUncheckedCheckError = function (t) {
                var e = i.ensureErrorObject(t);
                this._rejectUnchecked(t, e === t ? void 0 : e)
            }, E.prototype._rejectUnchecked = function (t, e) {
                if (t === this) {
                    var n = r();
                    return this._attachExtraTrace(n), this._rejectUnchecked(n)
                }
                this._setRejected(), this._settledValue = t, this._cleanValues(), this._isFinal() ? a.throwLater(function (t) {
                    throw"stack" in t && a.invokeFirst(v.unhandledRejection, void 0, t), t
                }, void 0 === e ? t : e) : (void 0 !== e && e !== t && this._setCarriedStackTrace(e), this._length() > 0 ? this._queueSettlePromises() : this._ensurePossibleRejectionHandled())
            }, E.prototype._settlePromises = function () {
                this._unsetSettlePromisesQueued();
                for (var t = this._length(), e = 0; e < t; e++) this._settlePromiseAt(e)
            }, i.notEnumerableProp(E, "_makeSelfResolutionError", r), be(E, d), ke(E, l, p, o), Ee(E, l, p), Ce(E, f, p), Ae(E), Se(E), Fe(E, d, p, l), E.version = "2.11.0", E.Promise = E, xe(E, d, o, p, l), Oe(E), Te(E, o, p, _), Pe(E, o, l, p), Re(E), Ne(E), Ue(E, d, p, o), Me(E, l, p, o), ze(E, d, o, p, l), Le(E, d), qe(E, d, o), He(E, l), Ve(E), We(E, l), Ke(E, l), $e(E, l), i.toFastProperties(E), i.toFastProperties(E.prototype), C({a: 1}), C({b: 2}), C({c: 3}), C(1), C(function () {
            }), C(void 0), C(!1),C(new E(l)),v.setBounds(a.firstLineError, i.lastLineError),E
        }
    }), Je;

    function Ge() {
        try {
            Promise === Xe && (Promise = Je)
        } catch (t) {
        }
        return Xe
    }

    "undefined" != typeof Promise && (Je = Promise);
    var Xe = Qe();
    Xe.noConflict = Ge;
    var Ye = Xe, Ze = "object" == typeof N && N && N.Object === Object && N,
        tr = "object" == typeof self && self && self.Object === Object && self,
        er = Ze || tr || Function("return this")(), rr = er.isFinite;

    function nr(t) {
        return "number" == typeof t && rr(t)
    }

    var or = nr, ir = {
        blue: {
            50: "#E4F0F6",
            100: "#BCD9EA",
            200: "#8BBDD9",
            300: "#5BA4CF",
            400: "#298FCA",
            500: "#0079BF",
            600: "#026AA7",
            700: "#055A8C",
            800: "#094C72",
            900: "#0C3953"
        },
        green: {
            50: "#EEF6EC",
            100: "#D6ECD2",
            200: "#B7DDB0",
            300: "#99D18F",
            400: "#7BC86C",
            500: "#61BD4F",
            600: "#5AAC44",
            700: "#519839",
            800: "#49852E",
            900: "#3F6F21"
        },
        orange: {
            50: "#FDF5EC",
            100: "#FCE8D2",
            200: "#FAD8B0",
            300: "#FDC788",
            400: "#FFB968",
            500: "#FFAB4A",
            600: "#E99E40",
            700: "#D29034",
            800: "#BB8129",
            900: "#A0711C"
        },
        red: {
            50: "#FBEDEB",
            100: "#F5D3CE",
            200: "#EFB3AB",
            300: "#EC9488",
            400: "#EF7564",
            500: "#EB5A46",
            600: "#CF513D",
            700: "#B04632",
            800: "#933B27",
            900: "#6E2F1A"
        },
        yellow: {
            50: "#FDFAE5",
            100: "#FAF3C0",
            200: "#F5EA92",
            300: "#F3E260",
            400: "#F5DD29",
            500: "#F2D600",
            600: "#E6C60D",
            700: "#D9B51C",
            800: "#CCA42B",
            900: "#BD903C"
        },
        purple: {
            50: "#F7F0FA",
            100: "#EDDBF4",
            200: "#DFC0EB",
            300: "#D5A6E6",
            400: "#CD8DE5",
            500: "#C377E0",
            600: "#A86CC1",
            700: "#89609E",
            800: "#6C547B",
            900: "#484553"
        },
        pink: {
            50: "#FEF2F9",
            100: "#FCDEF0",
            200: "#FAC6E5",
            300: "#FFB0E1",
            400: "#FF95D6",
            500: "#FF80CE",
            600: "#E76EB1",
            700: "#CD5A91",
            800: "#B44772",
            900: "#96304C"
        },
        sky: {
            50: "#E4F7FA",
            100: "#BDECF3",
            200: "#8FDFEB",
            300: "#5DD3E5",
            400: "#29CCE5",
            500: "#00C2E0",
            600: "#00AECC",
            700: "#0098B7",
            800: "#0082A0",
            900: "#006988"
        },
        lime: {
            50: "#ECFBF3",
            100: "#D3F6E4",
            200: "#B3F1D0",
            300: "#90ECC1",
            400: "#6DECA9",
            500: "#51E898",
            600: "#4FD683",
            700: "#4DC26B",
            800: "#4CAF54",
            900: "#4A9839"
        },
        gray: {
            50: "#F8F9F9",
            100: "#EDEFF0",
            200: "#E2E4E6",
            300: "#D6DADC",
            400: "#CDD2D4",
            500: "#C4C9CC",
            600: "#B6BBBF",
            700: "#A5ACB0",
            800: "#959DA1",
            900: "#838C91"
        },
        "business-blue": {
            50: "#EDEFF4",
            100: "#D2D7E5",
            200: "#B2B9D0",
            300: "#838FB5",
            400: "#6170A1",
            500: "#42548E",
            600: "#3E4D80",
            700: "#3A476F",
            800: "#36405F",
            900: "#30364C"
        },
        shades: {
            0: "#FFFFFF",
            10: "#FAFCFC",
            20: "#F5F6F7",
            30: "#EBEEF0",
            40: "#DFE3E6",
            50: "#C2CCD1",
            60: "#B3BEC4",
            70: "#A6B3BA",
            80: "#97A7B0",
            90: "#899AA3",
            100: "#798D99",
            200: "#6B808C",
            300: "#5E7785",
            400: "#516B7A",
            500: "#425E6E",
            600: "#355263",
            700: "#254659",
            800: "#17394D",
            900: "#092D42"
        }
    };
    ir.neutrals = ir.shades;
    var sr = function (t, e) {
        if (!t || "string" != typeof t) throw new Error("Invalid color name");
        var r = t.toLowerCase();
        if (!ir[r]) throw new Error("Unknown color name: ".concat(r));
        var n = or(e) ? e : 500;
        if (!ir[r][n]) throw new Error("Unknown color weight: ".concat(n));
        return ir[r][n]
    }, ar = function (t) {
        if (!t || "string" != typeof t) throw new Error("Invalid named color string");
        if (/^#[a-fA-F0-9]{6}$/.test(t)) return t;
        var e = /^([a-zA-Z-]+)(#[1-9]?0?0)?$/.exec(t);
        if (!e) throw new Error("Invalid accentColor provided");
        var r = e[1], n = 500;
        return e[2] && (n = parseInt(e[2].substring(1), 10)), sr(r, n)
    };

    function cr(t) {
        if (!t) return null;
        for (var e = 0; e < t.length; e += 1) {
            var r = t[e];
            if ("number" != typeof r || r % 1 != 0 || r > 255 || r < 0) throw new Error("Invalid bytes. Bytes must be 0 - 255")
        }
        for (var n = new Uint8Array(t), o = [], i = 0; i < n.length; i += 1) {
            var s = n[i].toString(16);
            s.length < 2 && (s = "0".concat(s)), o.push(s)
        }
        return o.join("")
    }

    function ur(t) {
        if (!t) throw new Error("Invalid hexString");
        var e = t.toLowerCase();
        if (!/^[0-9a-f]+$/.test(e) || e.length % 2 != 0) throw new Error("Invalid hexString");
        for (var r = new Uint8Array(e.length / 2), n = 0; n < e.length; n += 2) {
            var o = parseInt(e.substr(n, 2), 16);
            if (isNaN(o)) throw new Error("Invalid hexString");
            r[n / 2] = o
        }
        return r
    }

    function lr(t, e, r) {
        return e <= t && t <= r
    }

    function hr(t) {
        if (void 0 === t) return {};
        if (t === Object(t)) return t;
        throw TypeError("Could not convert argument to dictionary")
    }

    function fr(t) {
        for (var e = String(t), r = e.length, n = 0, o = []; n < r;) {
            var i = e.charCodeAt(n);
            if (i < 55296 || i > 57343) o.push(i); else if (56320 <= i && i <= 57343) o.push(65533); else if (55296 <= i && i <= 56319) if (n === r - 1) o.push(65533); else {
                var s = t.charCodeAt(n + 1);
                if (56320 <= s && s <= 57343) {
                    var a = 1023 & i, c = 1023 & s;
                    o.push(65536 + (a << 10) + c), n += 1
                } else o.push(65533)
            }
            n += 1
        }
        return o
    }

    function pr(t) {
        for (var e = "", r = 0; r < t.length; ++r) {
            var n = t[r];
            n <= 65535 ? e += String.fromCharCode(n) : (n -= 65536, e += String.fromCharCode(55296 + (n >> 10), 56320 + (1023 & n)))
        }
        return e
    }

    var dr = -1;

    function vr(t) {
        this.tokens = [].slice.call(t)
    }

    vr.prototype = {
        endOfStream: function () {
            return !this.tokens.length
        }, read: function () {
            return this.tokens.length ? this.tokens.shift() : dr
        }, prepend: function (t) {
            if (Array.isArray(t)) for (var e = t; e.length;) this.tokens.unshift(e.pop()); else this.tokens.unshift(t)
        }, push: function (t) {
            if (Array.isArray(t)) for (var e = t; e.length;) this.tokens.push(e.shift()); else this.tokens.push(t)
        }
    };
    var yr = -1;

    function _r(t, e) {
        if (t) throw TypeError("Decoder error");
        return e || 65533
    }

    var gr = "utf-8";

    function mr(t, e) {
        if (!(this instanceof mr)) return new mr(t, e);
        if ((t = void 0 !== t ? String(t).toLowerCase() : gr) !== gr) throw new Error("Encoding not supported. Only utf-8 is supported");
        e = hr(e), this._streaming = !1, this._BOMseen = !1, this._decoder = null, this._fatal = Boolean(e.fatal), this._ignoreBOM = Boolean(e.ignoreBOM), Object.defineProperty(this, "encoding", {value: "utf-8"}), Object.defineProperty(this, "fatal", {value: this._fatal}), Object.defineProperty(this, "ignoreBOM", {value: this._ignoreBOM})
    }

    function wr(t, e) {
        if (!(this instanceof wr)) return new wr(t, e);
        if ((t = void 0 !== t ? String(t).toLowerCase() : gr) !== gr) throw new Error("Encoding not supported. Only utf-8 is supported");
        e = hr(e), this._streaming = !1, this._encoder = null, this._options = {fatal: Boolean(e.fatal)}, Object.defineProperty(this, "encoding", {value: "utf-8"})
    }

    function br(t) {
        var e = t.fatal, r = 0, n = 0, o = 0, i = 128, s = 191;
        this.handler = function (t, a) {
            if (a === dr && 0 !== o) return o = 0, _r(e);
            if (a === dr) return yr;
            if (0 === o) {
                if (lr(a, 0, 127)) return a;
                if (lr(a, 194, 223)) o = 1, r = a - 192; else if (lr(a, 224, 239)) 224 === a && (i = 160), 237 === a && (s = 159), o = 2, r = a - 224; else {
                    if (!lr(a, 240, 244)) return _r(e);
                    240 === a && (i = 144), 244 === a && (s = 143), o = 3, r = a - 240
                }
                return r <<= 6 * o, null
            }
            if (!lr(a, i, s)) return r = o = n = 0, i = 128, s = 191, t.prepend(a), _r(e);
            if (i = 128, s = 191, r += a - 128 << 6 * (o - (n += 1)), n !== o) return null;
            var c = r;
            return r = o = n = 0, c
        }
    }

    function kr(t) {
        t.fatal;
        this.handler = function (t, e) {
            if (e === dr) return yr;
            if (lr(e, 0, 127)) return e;
            var r, n;
            lr(e, 128, 2047) ? (r = 1, n = 192) : lr(e, 2048, 65535) ? (r = 2, n = 224) : lr(e, 65536, 1114111) && (r = 3, n = 240);
            for (var o = [(e >> 6 * r) + n]; r > 0;) {
                var i = e >> 6 * (r - 1);
                o.push(128 | 63 & i), r -= 1
            }
            return o
        }
    }

    mr.prototype = {
        decode: function (t, e) {
            var r;
            r = "object" == typeof t && t instanceof ArrayBuffer ? new Uint8Array(t) : "object" == typeof t && "buffer" in t && t.buffer instanceof ArrayBuffer ? new Uint8Array(t.buffer, t.byteOffset, t.byteLength) : new Uint8Array(0), e = hr(e), this._streaming || (this._decoder = new br({fatal: this._fatal}), this._BOMseen = !1), this._streaming = Boolean(e.stream);
            for (var n, o = new vr(r), i = []; !o.endOfStream() && (n = this._decoder.handler(o, o.read())) !== yr;) null !== n && (Array.isArray(n) ? i.push.apply(i, n) : i.push(n));
            if (!this._streaming) {
                do {
                    if ((n = this._decoder.handler(o, o.read())) === yr) break;
                    null !== n && (Array.isArray(n) ? i.push.apply(i, n) : i.push(n))
                } while (!o.endOfStream());
                this._decoder = null
            }
            return i.length && (-1 === ["utf-8"].indexOf(this.encoding) || this._ignoreBOM || this._BOMseen || (65279 === i[0] ? (this._BOMseen = !0, i.shift()) : this._BOMseen = !0)), pr(i)
        }
    }, wr.prototype = {
        encode: function (t, e) {
            t = t ? String(t) : "", e = hr(e), this._streaming || (this._encoder = new kr(this._options)), this._streaming = Boolean(e.stream);
            for (var r, n = [], o = new vr(fr(t)); !o.endOfStream() && (r = this._encoder.handler(o, o.read())) !== yr;) Array.isArray(r) ? n.push.apply(n, r) : n.push(r);
            if (!this._streaming) {
                for (; (r = this._encoder.handler(o, o.read())) !== yr;) Array.isArray(r) ? n.push.apply(n, r) : n.push(r);
                this._encoder = null
            }
            return new Uint8Array(n)
        }
    };
    var Er = function (t) {
            return "function" == typeof t
        }, Cr = Er(window.TextEncoder) ? window.TextEncoder : wr, jr = Er(window.TextDecoder) ? window.TextDecoder : mr,
        Ar = "AES-CBC", Sr = {name: Ar, length: 256}, Fr = !0, xr = ["encrypt", "decrypt"],
        Or = "object" === t(window.crypto), Tr = !Or && "object" === t(window.msCrypto), Pr;
    Or ? Pr = null == window.crypto.subtle && null != window.crypto.webkitSubtle ? window.crypto.webkitSubtle : window.crypto.subtle : Tr && (Pr = window.msCrypto.subtle);
    var Rr = function (t) {
            var e = (new Cr).encode(t);
            return new Ye(function (t, r) {
                if (Or) Pr.digest({name: "SHA-256"}, e).then(function (e) {
                    return t(cr(e))
                }); else if (Tr) {
                    var n = Pr.digest({name: "SHA-256"}, e);
                    n.oncomplete = function (e) {
                        t(cr(e.target.result))
                    }, n.onerror = function (t) {
                        r(new Error("Error digesting text: ".concat(t.type)))
                    }
                } else r(new Error("Browser not supported."))
            })
        }, Dr = {
            generateInitVector: function () {
                if (Or && "function" == typeof window.crypto.getRandomValues) return window.crypto.getRandomValues(new Uint8Array(16));
                if (Tr && "function" == typeof window.msCrypto.getRandomValues) return window.msCrypto.getRandomValues(new Uint8Array(16));
                throw new Error("Browser not supported.")
            }, generateAESCBCKey: function () {
                return new Ye(function (t, e) {
                    if (Or) t(Pr.generateKey(Sr, Fr, xr)); else if (Tr) {
                        var r = Pr.generateKey(Sr, Fr, xr);
                        r.oncomplete = function (e) {
                            t(e.target.result)
                        }, r.onerror = function (t) {
                            e(new Error("Error generating key: ".concat(t.type)))
                        }
                    } else e(new Error("Browser not supported."))
                })
            }, importAESCBCKeyFromRaw: function (t) {
                var e = ur(t);
                return new Ye(function (t, r) {
                    if (Or) t(Pr.importKey("raw", e, Ar, Fr, xr)); else if (Tr) {
                        var n = Pr.importKey("raw", e, Ar, Fr, xr);
                        n.oncomplete = function (e) {
                            t(e.target.result)
                        }, n.onerror = function (t) {
                            r(new Error("Error importing key: ".concat(t.type)))
                        }
                    } else r(new Error("Browser not supported."))
                })
            }, exportAESCBCKeyToRaw: function (t) {
                return new Ye(function (e, r) {
                    if (Or) Pr.exportKey("raw", t).then(function (t) {
                        return e(cr(t))
                    }); else if (Tr) {
                        var n = Pr.exportKey("raw", t);
                        n.oncomplete = function (t) {
                            e(cr(t.target.result))
                        }, n.onerror = function (t) {
                            r(new Error("Error exporting key: ".concat(t.type)))
                        }
                    } else r(new Error("Browser not supported."))
                })
            }, encryptSecret: function (t, e, r) {
                return Rr(r).then(function (n) {
                    var o = (new Cr).encode(n + r);
                    return Or ? Pr.encrypt({name: Ar, iv: t}, e, o).then(function (t) {
                        return cr(t)
                    }) : Tr ? new Ye(function (r, n) {
                        var i = Pr.encrypt({name: Ar, iv: t}, e, o);
                        i.oncomplete = function (t) {
                            r(cr(t.target.result))
                        }, i.onerror = function (t) {
                            n(new Error("Error encrypting secret: ".concat(t.type)))
                        }
                    }) : Ye.reject(new Error("Browser not supported."))
                })
            }, decryptSecret: function (t, e, r) {
                var n = ur(r);
                return new Ye(function (r, o) {
                    if (Or) Pr.decrypt({name: Ar, iv: t}, e, n).then(function (t) {
                        r((new jr).decode(t))
                    }).catch(function (t) {
                        o(new Error("Decryption failed. Message: ".concat(t.message)))
                    }); else if (Tr) {
                        var i = Pr.decrypt({name: Ar, iv: t}, e, n);
                        i.oncomplete = function (t) {
                            r((new jr).decode(t.target.result))
                        }, i.onerror = function (t) {
                            o(new Error("Decryption failed. Message: ".concat(t.type)))
                        }
                    } else o(new Error("Browser not supported."))
                }).then(function (t) {
                    var e = t.substring(0, 64), r = t.substring(64);
                    if (!/^[a-f0-9]{64}$/.test(e)) throw new Error("Decryption failed. Unable to validate integrity.");
                    return Rr(r).then(function (t) {
                        if (t === e) return r;
                        throw new Error("Decryption failed. Unable to validate integrity.")
                    })
                })
            }, sha256Digest: Rr
        }, Ir = U(function (t, e) {
            var r = "undefined" != typeof Reflect ? Reflect.construct : void 0, n = Object.defineProperty,
                o = Error.captureStackTrace;

            function i(t) {
                void 0 !== t && n(this, "message", {configurable: !0, value: t, writable: !0});
                var e = this.constructor.name;
                void 0 !== e && e !== this.name && n(this, "name", {
                    configurable: !0,
                    value: e,
                    writable: !0
                }), o(this, this.constructor)
            }

            void 0 === o && (o = function (t) {
                var e = new Error;
                n(t, "stack", {
                    configurable: !0, get: function () {
                        var t = e.stack;
                        return n(this, "stack", {configurable: !0, value: t, writable: !0}), t
                    }, set: function (e) {
                        n(t, "stack", {configurable: !0, value: e, writable: !0})
                    }
                })
            }), i.prototype = Object.create(Error.prototype, {constructor: {configurable: !0, value: i, writable: !0}});
            var s = function () {
                function t(t, e) {
                    return n(t, "name", {configurable: !0, value: e})
                }

                try {
                    var e = function () {
                    };
                    if (t(e, "foo"), "foo" === e.name) return t
                } catch (t) {
                }
            }();
            (t.exports = function (t, e) {
                if (null == e || e === Error) e = i; else if ("function" != typeof e) throw new TypeError("super_ should be a function");
                var n;
                if ("string" == typeof t) n = t, t = void 0 !== r ? function () {
                    return r(e, arguments, this.constructor)
                } : function () {
                    e.apply(this, arguments)
                }, void 0 !== s && (s(t, n), n = void 0); else if ("function" != typeof t) throw new TypeError("constructor should be either a string or a function");
                t.super_ = t.super = e;
                var o = {constructor: {configurable: !0, value: t, writable: !0}};
                return void 0 !== n && (o.name = {
                    configurable: !0,
                    value: n,
                    writable: !0
                }), t.prototype = Object.create(e.prototype, o), t
            }).BaseError = i
        }), Br = Ir.BaseError, Nr = "Error", Ur = function (t, e) {
            var r = Ir([t, Nr].join("::"));
            return e.forEach(function (e) {
                r[e] = Ir([t, e].join("::"), r)
            }), r
        },
        Mr = Ur("i18n", ["ArgNotFound", "InvalidResourceUrl", "KeyNotFound", "LoadLocalizerNotAFunction", "LocaleNotFound", "LocaleNotSpecified", "LocalizerNotFound", "MissingDefaultLocale", "MissingResourceUrl", "MissingSupportedLocales", "UnableToParseArgs", "UnableToParseAttrs", "Unknown", "UnsupportedKeyType"]),
        zr = function (t, e) {
            if (t.indexOf("{locale}") < 0) throw new Mr.InvalidResourceUrl("ResourceUrl must specify where to place locale with {locale}");
            return t.replace("{locale}", e)
        }, Lr = function t(e, r, n) {
            return n.indexOf(e) > -1 ? e : e.indexOf("-") > -1 ? t(e.split("-")[0], r, n) : r
        }, qr = function () {
            function t(r) {
                e(this, t), this.resourceDictionary = r
            }

            return n(t, [{
                key: "localize", value: function (t, e) {
                    if (this.resourceDictionary[t]) {
                        var r = this.resourceDictionary[t];
                        if (e) {
                            for (var n = /\{(\w+?)\}/gi, o = "", i = n.exec(r), s = 0; i;) {
                                if (i.index > s && (o += r.substring(s, i.index)), !e[i[1]]) throw new Mr.ArgNotFound("Arg: ".concat(i[1]));
                                o += e[i[1]], s = i.index + i[0].length, i = n.exec(r)
                            }
                            return o += r.substring(s)
                        }
                        return r
                    }
                    throw new Mr.KeyNotFound("Key: ".concat(t))
                }
            }]), t
        }(), Hr, Vr, Wr = "", Kr = function (t, e, r, n) {
            return Ye.try(function () {
                var o;
                return (o = t ? Lr(t, e, r) : e) === Wr && Vr ? Vr : (Hr || (Hr = new Ye(function (t, e) {
                    var r = new XMLHttpRequest;
                    r.open("GET", zr(n, o), !0), r.onload = function () {
                        try {
                            if (200 === r.status) {
                                var n = JSON.parse(r.responseText);
                                return Vr = new qr(n), Wr = o, t(Vr)
                            }
                            return 404 === r.status ? e(new Mr.LocaleNotFound("".concat(o, " not found."))) : e(new Mr.Unknown("Unable to load locale, status: ".concat(r.status)))
                        } catch (t) {
                            return e(new Mr.Unknown(t.message))
                        }
                    }, r.send()
                })), Hr)
            })
        }, $r = {loadLocalizer: Kr}, Qr = function (t, e) {
            var r = e || {}, n = "";
            if (!t) return n = "Unable to load a localizer without a locale", Ye.reject(new Mr.LocaleNotSpecified(n));
            if (window.localizer) return Ye.resolve();
            if (r.localizer) window.localizer = r.localizer; else {
                if (r.loadLocalizer) return "function" == typeof r.loadLocalizer ? Ye.resolve(r.loadLocalizer(t)).then(function (t) {
                    return window.localizer = t, Ye.resolve()
                }) : (n = "Specified loadLocalizer must be a function that returns a localizer or a Promise resolving to a localizer", Ye.reject(new Mr.LoadLocalizerNotAFunction(n)));
                if (r.localization) {
                    var o = r.localization, i = o.defaultLocale, s = o.supportedLocales, a = o.resourceUrl;
                    return i ? s ? a ? $r.loadLocalizer(t, i, s, a).then(function (t) {
                        return window.localizer = t, Ye.resolve()
                    }) : Ye.reject(new Mr.MissingResourceUrl("Missing resourceUrl")) : Ye.reject(new Mr.MissingSupportedLocales("Missing supportedLocales")) : Ye.reject(new Mr.MissingDefaultLocale("Missing defaultLocale"))
                }
            }
            return Ye.resolve()
        }, Jr = function (t) {
            if (/^https?:\/\//.test(t)) return t;
            var e = window.location.origin || "".concat(window.location.protocol, "//").concat(window.location.host),
                r = window.location.pathname.replace(/[^\/]+$/, "");
            return /^\/\//.test(t) ? [e, t.substring(1)].join("") : /^\//.test(t) ? [e, t].join("") : [e, r, t].join("")
        }, Gr = "Expected a function", Xr = "__lodash_hash_undefined__", Yr = 1 / 0, Zr = 9007199254740991,
        tn = "[object Arguments]", en = "[object Function]", rn = "[object GeneratorFunction]", nn = "[object Symbol]",
        on = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, sn = /^\w*$/, an = /^\./,
        cn = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
        un = /[\\^$.*+?()[\]{}|]/g, ln = /\\(\\)?/g, hn = /^\[object .+?Constructor\]$/, fn = /^(?:0|[1-9]\d*)$/,
        pn = "object" == typeof N && N && N.Object === Object && N,
        dn = "object" == typeof self && self && self.Object === Object && self,
        vn = pn || dn || Function("return this")();

    function yn(t, e) {
        return null == t ? void 0 : t[e]
    }

    function _n(t) {
        var e = !1;
        if (null != t && "function" != typeof t.toString) try {
            e = !!(t + "")
        } catch (t) {
        }
        return e
    }

    var gn = Array.prototype, mn = Function.prototype, wn = Object.prototype, bn = vn["__core-js_shared__"],
        kn = (En = /[^.]+$/.exec(bn && bn.keys && bn.keys.IE_PROTO || ""), En ? "Symbol(src)_1." + En : ""), En,
        Cn = mn.toString, jn = wn.hasOwnProperty, An = wn.toString,
        Sn = RegExp("^" + Cn.call(jn).replace(un, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
        Fn = vn.Symbol, xn = wn.propertyIsEnumerable, On = gn.splice, Tn = io(vn, "Map"), Pn = io(Object, "create"),
        Rn = Fn ? Fn.prototype : void 0, Dn = Rn ? Rn.toString : void 0;

    function In(t) {
        var e = -1, r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function Bn() {
        this.__data__ = Pn ? Pn(null) : {}
    }

    function Nn(t) {
        return this.has(t) && delete this.__data__[t]
    }

    function Un(t) {
        var e = this.__data__;
        if (Pn) {
            var r = e[t];
            return r === Xr ? void 0 : r
        }
        return jn.call(e, t) ? e[t] : void 0
    }

    function Mn(t) {
        var e = this.__data__;
        return Pn ? void 0 !== e[t] : jn.call(e, t)
    }

    function zn(t, e) {
        return this.__data__[t] = Pn && void 0 === e ? Xr : e, this
    }

    function Ln(t) {
        var e = -1, r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function qn() {
        this.__data__ = []
    }

    function Hn(t) {
        var e = this.__data__, r = Zn(e, t);
        return !(r < 0) && (r == e.length - 1 ? e.pop() : On.call(e, r, 1), !0)
    }

    function Vn(t) {
        var e = this.__data__, r = Zn(e, t);
        return r < 0 ? void 0 : e[r][1]
    }

    function Wn(t) {
        return Zn(this.__data__, t) > -1
    }

    function Kn(t, e) {
        var r = this.__data__, n = Zn(r, t);
        return n < 0 ? r.push([t, e]) : r[n][1] = e, this
    }

    function $n(t) {
        var e = -1, r = t ? t.length : 0;
        for (this.clear(); ++e < r;) {
            var n = t[e];
            this.set(n[0], n[1])
        }
    }

    function Qn() {
        this.__data__ = {hash: new In, map: new (Tn || Ln), string: new In}
    }

    function Jn(t) {
        return oo(this, t).delete(t)
    }

    function Gn(t) {
        return oo(this, t).get(t)
    }

    function Xn(t) {
        return oo(this, t).has(t)
    }

    function Yn(t, e) {
        return oo(this, t).set(t, e), this
    }

    function Zn(t, e) {
        for (var r = t.length; r--;) if (yo(t[r][0], e)) return r;
        return -1
    }

    function to(t, e) {
        return null != t && jn.call(t, e)
    }

    function eo(t) {
        return !(!Eo(t) || lo(t)) && (bo(t) || _n(t) ? Sn : hn).test(po(t))
    }

    function ro(t) {
        if ("string" == typeof t) return t;
        if (jo(t)) return Dn ? Dn.call(t) : "";
        var e = t + "";
        return "0" == e && 1 / t == -Yr ? "-0" : e
    }

    function no(t) {
        return go(t) ? t : ho(t)
    }

    function oo(t, e) {
        var r = t.__data__;
        return uo(e) ? r["string" == typeof e ? "string" : "hash"] : r.map
    }

    function io(t, e) {
        var r = yn(t, e);
        return eo(r) ? r : void 0
    }

    function so(t, e, r) {
        for (var n, o = -1, i = (e = co(e, t) ? [e] : no(e)).length; ++o < i;) {
            var s = fo(e[o]);
            if (!(n = null != t && r(t, s))) break;
            t = t[s]
        }
        return n || !!(i = t ? t.length : 0) && ko(i) && ao(s, i) && (go(t) || _o(t))
    }

    function ao(t, e) {
        return !!(e = null == e ? Zr : e) && ("number" == typeof t || fn.test(t)) && t > -1 && t % 1 == 0 && t < e
    }

    function co(t, e) {
        if (go(t)) return !1;
        var r = typeof t;
        return !("number" != r && "symbol" != r && "boolean" != r && null != t && !jo(t)) || (sn.test(t) || !on.test(t) || null != e && t in Object(e))
    }

    function uo(t) {
        var e = typeof t;
        return "string" == e || "number" == e || "symbol" == e || "boolean" == e ? "__proto__" !== t : null === t
    }

    function lo(t) {
        return !!kn && kn in t
    }

    In.prototype.clear = Bn, In.prototype.delete = Nn, In.prototype.get = Un, In.prototype.has = Mn, In.prototype.set = zn, Ln.prototype.clear = qn, Ln.prototype.delete = Hn, Ln.prototype.get = Vn, Ln.prototype.has = Wn, Ln.prototype.set = Kn, $n.prototype.clear = Qn, $n.prototype.delete = Jn, $n.prototype.get = Gn, $n.prototype.has = Xn, $n.prototype.set = Yn;
    var ho = vo(function (t) {
        t = Ao(t);
        var e = [];
        return an.test(t) && e.push(""), t.replace(cn, function (t, r, n, o) {
            e.push(n ? o.replace(ln, "$1") : r || t)
        }), e
    });

    function fo(t) {
        if ("string" == typeof t || jo(t)) return t;
        var e = t + "";
        return "0" == e && 1 / t == -Yr ? "-0" : e
    }

    function po(t) {
        if (null != t) {
            try {
                return Cn.call(t)
            } catch (t) {
            }
            try {
                return t + ""
            } catch (t) {
            }
        }
        return ""
    }

    function vo(t, e) {
        if ("function" != typeof t || e && "function" != typeof e) throw new TypeError(Gr);
        var r = function () {
            var n = arguments, o = e ? e.apply(this, n) : n[0], i = r.cache;
            if (i.has(o)) return i.get(o);
            var s = t.apply(this, n);
            return r.cache = i.set(o, s), s
        };
        return r.cache = new (vo.Cache || $n), r
    }

    function yo(t, e) {
        return t === e || t != t && e != e
    }

    function _o(t) {
        return wo(t) && jn.call(t, "callee") && (!xn.call(t, "callee") || An.call(t) == tn)
    }

    vo.Cache = $n;
    var go = Array.isArray;

    function mo(t) {
        return null != t && ko(t.length) && !bo(t)
    }

    function wo(t) {
        return Co(t) && mo(t)
    }

    function bo(t) {
        var e = Eo(t) ? An.call(t) : "";
        return e == en || e == rn
    }

    function ko(t) {
        return "number" == typeof t && t > -1 && t % 1 == 0 && t <= Zr
    }

    function Eo(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }

    function Co(t) {
        return !!t && "object" == typeof t
    }

    function jo(t) {
        return "symbol" == typeof t || Co(t) && An.call(t) == nn
    }

    function Ao(t) {
        return null == t ? "" : ro(t)
    }

    function So(t, e) {
        return null != t && so(t, e, to)
    }

    var Fo = So, xo = function (t) {
        window.console && "function" == typeof console.warn && console.warn(t)
    }, Oo = {}, To = {}, Po = 0;
    setInterval(function () {
        var t = Object.keys(Oo), e = Date.now();
        t.forEach(function (t) {
            Oo[t].expires < e && delete Oo[t]
        })
    }, 5e3);
    var Ro = {
        callback: function (t, e, r) {
            var n = e.callback, o = e.action, i = e.options;
            return Ye.try(function () {
                switch (o) {
                    case"run":
                        if (Fo(To, n)) return To[n].call(null, t, i);
                        throw xo("Attempted to run callback that does not exist or was not retained"), t.NotHandled("callback does not exist or was not retained");
                    case"retain":
                        if (Fo(Oo, n)) return To[n] = Oo[n].fx, delete Oo[n], n;
                        throw xo("Attempted to retain callback that does not exist"), t.NotHandled("callback can no longer be retained");
                    case"release":
                        if (Fo(To, n)) return delete To[n], null;
                        throw xo("Attempted to release callback that is not retained"), t.NotHandled("callback can no longer be released");
                    default:
                        throw xo("Attempted an unknown callback action"), t.NotHandled("unknown callback action")
                }
            }).then(r)
        }, serialize: function (t) {
            var e = "cb".concat(Po += 1);
            return Oo[e] = {fx: t, expires: Date.now() + 3e4}, {_callback: e}
        }, reset: function () {
            Po = 0, Object.keys(Oo).forEach(function (t) {
                delete Oo[t]
            }), Object.keys(To).forEach(function (t) {
                delete To[t]
            })
        }
    }, Do = Bo, Io = Object.prototype.hasOwnProperty;

    function Bo() {
        for (var t = {}, e = 0; e < arguments.length; e++) {
            var r = arguments[e];
            for (var n in r) Io.call(r, n) && (t[n] = r[n])
        }
        return t
    }

    var No = null, Uo = function (t, e) {
            if (!No) try {
                No = JSON.parse(decodeURIComponent(window.location.hash.replace(/^#/, "")))
            } catch (t) {
                No = {}
            }
            return Fo(No, t) ? No[t] : e
        }, Mo = 1 / 0, zo = 9007199254740991, Lo = 17976931348623157e292, qo = NaN, Ho = "[object Arguments]",
        Vo = "[object Function]", Wo = "[object GeneratorFunction]", Ko = "[object String]", $o = "[object Symbol]",
        Qo = /^\s+|\s+$/g, Jo = /^[-+]0x[0-9a-f]+$/i, Go = /^0b[01]+$/i, Xo = /^0o[0-7]+$/i, Yo = /^(?:0|[1-9]\d*)$/,
        Zo = parseInt;

    function ti(t, e) {
        for (var r = -1, n = t ? t.length : 0, o = Array(n); ++r < n;) o[r] = e(t[r], r, t);
        return o
    }

    function ei(t, e, r, n) {
        for (var o = t.length, i = r + (n ? 1 : -1); n ? i-- : ++i < o;) if (e(t[i], i, t)) return i;
        return -1
    }

    function ri(t, e, r) {
        if (e != e) return ei(t, ni, r);
        for (var n = r - 1, o = t.length; ++n < o;) if (t[n] === e) return n;
        return -1
    }

    function ni(t) {
        return t != t
    }

    function oi(t, e) {
        for (var r = -1, n = Array(t); ++r < t;) n[r] = e(r);
        return n
    }

    function ii(t, e) {
        return ti(e, function (e) {
            return t[e]
        })
    }

    function si(t, e) {
        return function (r) {
            return t(e(r))
        }
    }

    var ai = Object.prototype, ci = ai.hasOwnProperty, ui = ai.toString, li = ai.propertyIsEnumerable,
        hi = si(Object.keys, Object), fi = Math.max;

    function pi(t, e) {
        var r = mi(t) || gi(t) ? oi(t.length, String) : [], n = r.length, o = !!n;
        for (var i in t) !e && !ci.call(t, i) || o && ("length" == i || vi(i, n)) || r.push(i);
        return r
    }

    function di(t) {
        if (!yi(t)) return hi(t);
        var e = [];
        for (var r in Object(t)) ci.call(t, r) && "constructor" != r && e.push(r);
        return e
    }

    function vi(t, e) {
        return !!(e = null == e ? zo : e) && ("number" == typeof t || Yo.test(t)) && t > -1 && t % 1 == 0 && t < e
    }

    function yi(t) {
        var e = t && t.constructor;
        return t === ("function" == typeof e && e.prototype || ai)
    }

    function _i(t, e, r, n) {
        t = wi(t) ? t : Pi(t), r = r && !n ? xi(r) : 0;
        var o = t.length;
        return r < 0 && (r = fi(o + r, 0)), Ai(t) ? r <= o && t.indexOf(e, r) > -1 : !!o && ri(t, e, r) > -1
    }

    function gi(t) {
        return bi(t) && ci.call(t, "callee") && (!li.call(t, "callee") || ui.call(t) == Ho)
    }

    var mi = Array.isArray;

    function wi(t) {
        return null != t && Ei(t.length) && !ki(t)
    }

    function bi(t) {
        return ji(t) && wi(t)
    }

    function ki(t) {
        var e = Ci(t) ? ui.call(t) : "";
        return e == Vo || e == Wo
    }

    function Ei(t) {
        return "number" == typeof t && t > -1 && t % 1 == 0 && t <= zo
    }

    function Ci(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }

    function ji(t) {
        return !!t && "object" == typeof t
    }

    function Ai(t) {
        return "string" == typeof t || !mi(t) && ji(t) && ui.call(t) == Ko
    }

    function Si(t) {
        return "symbol" == typeof t || ji(t) && ui.call(t) == $o
    }

    function Fi(t) {
        return t ? (t = Oi(t)) === Mo || t === -Mo ? (t < 0 ? -1 : 1) * Lo : t == t ? t : 0 : 0 === t ? t : 0
    }

    function xi(t) {
        var e = Fi(t), r = e % 1;
        return e == e ? r ? e - r : e : 0
    }

    function Oi(t) {
        if ("number" == typeof t) return t;
        if (Si(t)) return qo;
        if (Ci(t)) {
            var e = "function" == typeof t.valueOf ? t.valueOf() : t;
            t = Ci(e) ? e + "" : e
        }
        if ("string" != typeof t) return 0 === t ? t : +t;
        t = t.replace(Qo, "");
        var r = Go.test(t);
        return r || Xo.test(t) ? Zo(t.slice(2), r ? 2 : 8) : Jo.test(t) ? qo : +t
    }

    function Ti(t) {
        return wi(t) ? pi(t) : di(t)
    }

    function Pi(t) {
        return t ? ii(t, Ti(t)) : []
    }

    var Ri = _i, Di = "[object Object]";

    function Ii(t) {
        var e = !1;
        if (null != t && "function" != typeof t.toString) try {
            e = !!(t + "")
        } catch (t) {
        }
        return e
    }

    function Bi(t, e) {
        return function (r) {
            return t(e(r))
        }
    }

    var Ni = Function.prototype, Ui = Object.prototype, Mi = Ni.toString, zi = Ui.hasOwnProperty, Li = Mi.call(Object),
        qi = Ui.toString, Hi = Bi(Object.getPrototypeOf, Object);

    function Vi(t) {
        return !!t && 1 === t.nodeType && Wi(t) && !Ki(t)
    }

    function Wi(t) {
        return !!t && "object" == typeof t
    }

    function Ki(t) {
        if (!Wi(t) || qi.call(t) != Di || Ii(t)) return !1;
        var e = Hi(t);
        if (null === e) return !0;
        var r = zi.call(e, "constructor") && e.constructor;
        return "function" == typeof r && r instanceof r && Mi.call(r) == Li
    }

    var $i = Vi, Qi = "[object String]", Ji = Object.prototype, Gi = Ji.toString, Xi = Array.isArray;

    function Yi(t) {
        return !!t && "object" == typeof t
    }

    function Zi(t) {
        return "string" == typeof t || !Xi(t) && Yi(t) && Gi.call(t) == Qi
    }

    var ts = Zi, es = 1 / 0, rs = 9007199254740991, ns = "[object Arguments]", os = "[object Function]",
        is = "[object GeneratorFunction]", ss = "[object Symbol]",
        as = "object" == typeof N && N && N.Object === Object && N,
        cs = "object" == typeof self && self && self.Object === Object && self,
        us = as || cs || Function("return this")();

    function ls(t, e, r) {
        switch (r.length) {
            case 0:
                return t.call(e);
            case 1:
                return t.call(e, r[0]);
            case 2:
                return t.call(e, r[0], r[1]);
            case 3:
                return t.call(e, r[0], r[1], r[2])
        }
        return t.apply(e, r)
    }

    function hs(t, e) {
        for (var r = -1, n = t ? t.length : 0, o = Array(n); ++r < n;) o[r] = e(t[r], r, t);
        return o
    }

    function fs(t, e) {
        for (var r = -1, n = e.length, o = t.length; ++r < n;) t[o + r] = e[r];
        return t
    }

    var ps = Object.prototype, ds = ps.hasOwnProperty, vs = ps.toString, ys = us.Symbol, _s = ps.propertyIsEnumerable,
        gs = ys ? ys.isConcatSpreadable : void 0, ms = Math.max;

    function ws(t, e, r, n, o) {
        var i = -1, s = t.length;
        for (r || (r = Cs), o || (o = []); ++i < s;) {
            var a = t[i];
            e > 0 && r(a) ? e > 1 ? ws(a, e - 1, r, n, o) : fs(o, a) : n || (o[o.length] = a)
        }
        return o
    }

    function bs(t, e) {
        return ks(t = Object(t), e, function (e, r) {
            return r in t
        })
    }

    function ks(t, e, r) {
        for (var n = -1, o = e.length, i = {}; ++n < o;) {
            var s = e[n], a = t[s];
            r(a, s) && (i[s] = a)
        }
        return i
    }

    function Es(t, e) {
        return e = ms(void 0 === e ? t.length - 1 : e, 0), function () {
            for (var r = arguments, n = -1, o = ms(r.length - e, 0), i = Array(o); ++n < o;) i[n] = r[e + n];
            n = -1;
            for (var s = Array(e + 1); ++n < e;) s[n] = r[n];
            return s[e] = i, ls(t, this, s)
        }
    }

    function Cs(t) {
        return Ss(t) || As(t) || !!(gs && t && t[gs])
    }

    function js(t) {
        if ("string" == typeof t || Ds(t)) return t;
        var e = t + "";
        return "0" == e && 1 / t == -es ? "-0" : e
    }

    function As(t) {
        return xs(t) && ds.call(t, "callee") && (!_s.call(t, "callee") || vs.call(t) == ns)
    }

    var Ss = Array.isArray;

    function Fs(t) {
        return null != t && Ts(t.length) && !Os(t)
    }

    function xs(t) {
        return Rs(t) && Fs(t)
    }

    function Os(t) {
        var e = Ps(t) ? vs.call(t) : "";
        return e == os || e == is
    }

    function Ts(t) {
        return "number" == typeof t && t > -1 && t % 1 == 0 && t <= rs
    }

    function Ps(t) {
        var e = typeof t;
        return !!t && ("object" == e || "function" == e)
    }

    function Rs(t) {
        return !!t && "object" == typeof t
    }

    function Ds(t) {
        return "symbol" == typeof t || Rs(t) && vs.call(t) == ss
    }

    var Is = Es(function (t, e) {
        return null == t ? {} : bs(t, hs(ws(e, 1), js))
    }), Bs = Is, Ns = function e(r, n) {
        if (!r) return r;
        if (("url" === n || "icon" === n) && "string" == typeof r && 0 === r.indexOf("./")) return Jr(r.substr(2));
        var o = {};
        switch (t(r)) {
            case"object":
                return Array.isArray(r) ? r.map(e) : (Object.keys(r).forEach(function (t) {
                    o[t] = e(r[t], t)
                }), o);
            case"function":
                return Ro.serialize(r);
            default:
                return r
        }
    }, Us = function (t) {
        return String(null == t ? "" : t).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/`/g, "&#x60;")
    }, Ms = {
        isId: function (t) {
            return /^[a-f0-9]{24}$/.test(t)
        }, isShortLink: function (t) {
            return /^[a-zA-Z0-9]{8}$/.test(t)
        }, isAllowedVisibilty: function (t) {
            return -1 !== ["shared", "private"].indexOf(t)
        }, isAllowedScope: function (t) {
            return -1 !== ["board", "card", "member", "organization"].indexOf(t)
        }
    }, zs = 4096, Ls = {
        getContext: function () {
            return this.args[0].context
        }, isMemberSignedIn: function () {
            var t = this.getContext();
            return null != t && "notLoggedIn" !== t.member && null != t.member
        }, memberCanWriteToModel: function (t) {
            if (!this.isMemberSignedIn()) return !1;
            if ("string" != typeof t || !Ri(["board", "card", "organization"], t)) throw new Error("modelType must be one of: board, card, organization");
            var e = this.getContext();
            return null != e && null != e.permissions && "write" === e.permissions[t]
        }, requestWithContext: function (t, e) {
            var r = e || {};
            return r.context = "function" == typeof this.getContext ? this.getContext() : {}, this.request(t, Ns(r))
        }, getAll: function () {
            var t = this;
            return t.outstandingGetAllReq ? t.outstandingGetAllReq : (t.outstandingGetAllReq = t.requestWithContext("data").then(function (e) {
                var r = {};
                return Object.keys(e).forEach(function (t) {
                    r[t] = {}, Object.keys(e[t]).forEach(function (n) {
                        try {
                            r[t][n] = JSON.parse(e[t][n])
                        } catch (e) {
                            r[t][n] = {}
                        }
                    })
                }), t.outstandingGetAllReq = null, r
            }).catch(function (e) {
                throw t.outstandingGetAllReq = null, e
            }), t.outstandingGetAllReq)
        }, get: function (t, e, r, n) {
            var o = this;
            o.outstandingGetRequests || (o.outstandingGetRequests = new Map);
            var i = "GET", s = {};
            if ((Ms.isId(t) || Ms.isShortLink(t)) && (s.idCard = t, t = "card", i = "GET:".concat(s.idCard)), !Ms.isAllowedVisibilty(e)) throw new Error("Invalid value for visibility.");
            if (!Ms.isAllowedScope(t)) throw new Error("Invalid value for scope.");
            return o.outstandingGetRequests.has(i) || o.outstandingGetRequests.set(i, o.requestWithContext("data", s)), o.outstandingGetRequests.get(i).then(function (s) {
                var a = {};
                if (s && Fo(s, t) && Fo(s[t], e)) try {
                    a = JSON.parse(s[t][e])
                } catch (t) {
                }
                return o.outstandingGetRequests.delete(i), null == r ? a || n : null != a && Fo(a, r) ? a[r] : n
            }).catch(function (t) {
                throw o.outstandingGetRequests.delete(i), t
            })
        }, set: function (e, r, n, o) {
            var i = {scope: e, visibility: r}, s = this;
            if (!Ms.isAllowedVisibilty(r)) throw new Error("Invalid value for visibility.");
            if ((Ms.isId(e) || Ms.isShortLink(e)) && (i.idCard = e, i.scope = "card"), !Ms.isAllowedScope(i.scope)) throw new Error("Invalid value for scope.");
            return this.get(e, r).then(function (e) {
                var r = e || {};
                if ("object" === t(n) ? Object.keys(n).forEach(function (t) {
                    r[t] = n[t]
                }) : r[n] = o, i.data = JSON.stringify(r), i.data.length > zs) throw new Error("PluginData length of ".concat(zs, " characters exceeded. See: https://developers.trello.com/v1.0/reference#section-size-limit"));
                return s.requestWithContext("set", i)
            })
        }, remove: function (t, e, r) {
            var n = {scope: t, visibility: e}, o = r, i = this;
            if ((Ms.isId(t) || Ms.isShortLink(t)) && (n.idCard = t, n.scope = "card"), Array.isArray(o) || (o = [r]), o.some(function (t) {
                return "string" != typeof t
            })) return xo("t.remove function takes either a single string or an array of strings for which keys to remove"), null;
            if (!Ms.isAllowedScope(n.scope)) throw new Error("Invalid value for scope.");
            if (!Ms.isAllowedVisibilty(e)) throw new Error("Invalid value for visibility.");
            return this.get(t, e).then(function (t) {
                var e = t || {};
                return o.forEach(function (t) {
                    delete e[t]
                }), n.data = JSON.stringify(e), i.requestWithContext("set", n)
            })
        }
    };
    Ls.safe = Us, Ls.arg = function (e, r) {
        var n = this.args[1];
        return n && "object" === t(n) && Fo(n, e) ? n[e] : r
    }, Ls.signUrl = function (t, e) {
        var r = this.getContext();
        return [t, encodeURIComponent(JSON.stringify({
            secret: this.secret,
            context: r,
            locale: window.locale,
            args: e
        }))].join("#")
    }, Ls.navigate = function (e) {
        return e && "object" === t(e) && "string" == typeof e.url ? this.requestWithContext("navigate", e) : Ye.reject(new Error("Invalid or missing url provided in options object"))
    }, Ls.showCard = function (t) {
        return t && "string" == typeof t ? this.requestWithContext("showCard", {idCard: t}) : Ye.reject(new Error("Invalid idCard provided"))
    }, Ls.hideCard = function () {
        return this.requestWithContext("hideCard")
    }, Ls.alert = function (t) {
        var e = Bs(t, ["message", "duration", "display"]), r = e.message;
        return !ts(r) || r.length < 1 || r.length > 140 ? Ye.reject(new Error("Alert requires a message of 1 to 140 characters")) : this.requestWithContext("alert", e)
    }, Ls.hideAlert = function () {
        return this.requestWithContext("hideAlert")
    };
    var qs = function (e) {
        var r;
        if (Array.isArray(e.items) || "function" == typeof e.items) r = e.items; else {
            if ("object" !== t(e.items)) throw new Error("Unsupported items type for popup. Must be an array, object, or function");
            r = Object.keys(e.items).map(function (t) {
                var r = e.items[t];
                return "function" == typeof r ? {
                    text: t,
                    callback: r
                } : r && "function" == typeof r.callback ? Do({text: t}, r) : {text: t}
            })
        }
        return {items: r, type: "list", search: e.search}
    }, Hs = function (t) {
        if ("string" != typeof t.message || "string" != typeof t.confirmText) throw new Error("Confirm popups must have a message and confirmText");
        if ("function" != typeof t.onConfirm) throw new Error("Confirm popup requires onConfirm function");
        if ("function" == typeof t.onCancel && "string" != typeof t.cancelText) throw new Error("Confirm popup requires cancelText to support onCancel function");
        var e = {
            type: "confirm",
            message: t.message,
            confirmStyle: t.confirmStyle || "primary",
            confirmText: t.confirmText,
            onConfirm: t.onConfirm
        };
        return "string" == typeof t.cancelText && (e.cancelText = t.cancelText), "function" == typeof t.onCancel && (e.onCancel = t.onCancel), e
    }, Vs = function (t) {
        if ("function" != typeof t.callback) throw new Error("Date popups must have a callback function");
        var e = {type: t.type, callback: t.callback};
        if (t.date && "function" == typeof t.date.toISOString && (e.date = t.date.toISOString()), t.minDate && "function" == typeof t.minDate.toISOString && (e.minDate = t.minDate.toISOString()), t.maxDate && "function" == typeof t.maxDate.toISOString && (e.maxDate = t.maxDate.toISOString()), e.minDate && e.maxDate && e.minDate > e.maxDate) throw new Error("Date popup maxDate must come after minDate if specified");
        return e
    };
    Ls.popup = function (t) {
        if (!(this.getContext().el || t && t.mouseEvent)) return xo("Unable to open popup. Context missing target element or a mouseEvent was not provided. This usually means you are using the wrong t param, and should instead use the one provided to the callback function itself, not the capability handler. If you are within an iframe, then make sure you pass the mouse event."), Ye.reject(new Error("Context missing target element and no mouse event provided"));
        var e = {title: t.title};
        if (t && t.mouseEvent) {
            var r = t.mouseEvent, n = r.clientX, o = r.clientY;
            if (!or(n) || !or(o)) return Ye.reject(new Error("Invalid mouseEvent was provided"));
            var i = n, s = o;
            if (0 === i && 0 === s) {
                if (!r.target || !r.target.getBoundingClientRect) return Ye.reject(new Error("Invalid mouseEvent was provided"));
                var a = r.target.getBoundingClientRect();
                i = a.left, s = a.top
            }
            e.pos = {x: i, y: s}
        }
        t && "function" == typeof t.callback && (e.callback = t.callback);
        try {
            if (t.url && "string" == typeof t.url) e.content = {
                type: "iframe",
                url: this.signUrl(Jr(t.url), t.args),
                width: t.width,
                height: t.height
            }; else if (t.items) e.content = qs(t); else if ("confirm" === t.type) e.content = Hs(t); else {
                if ("datetime" !== t.type && "date" !== t.type) return Ye.reject(new Error("Unknown popup type requested"));
                delete e.callback, e.content = Vs(t)
            }
        } catch (t) {
            return Ye.reject(t)
        }
        return this.requestWithContext("popup", e)
    }, Ls.overlay = function (t) {
        xo("overlay() has been deprecated. Please use modal() instead. See: https://trello.readme.io/v1.0/reference#t-modal");
        var e = {};
        return t.url && (e.content = {
            type: "iframe",
            url: this.signUrl(Jr(t.url), t.args)
        }), this.requestWithContext("overlay", e)
    }, Ls.boardBar = function (t) {
        if (!t || !t.url || "string" != typeof t.url) throw new Error("BoardBar options requires a valid url");
        if (t.actions && !Array.isArray(t.actions)) throw new Error("BoardBar actions property must be an array");
        var e;
        t.accentColor && (e = ar(t.accentColor));
        var r = {
            content: {
                actions: t.actions || [],
                callback: t.callback,
                accentColor: e,
                height: t.height || 200,
                resizable: t.resizable || !1,
                title: t.title,
                type: "iframe",
                url: this.signUrl(Jr(t.url), t.args)
            }
        };
        return this.requestWithContext("board-bar", r)
    }, Ls.modal = function (t) {
        if (!t || !t.url || "string" != typeof t.url) throw new Error("Modal options requires a valid url");
        if (t.actions && !Array.isArray(t.actions)) throw new Error("Modal actions property must be an array");
        var e;
        t.accentColor && (e = ar(t.accentColor));
        var r = {
            content: {
                actions: t.actions || [],
                callback: t.callback,
                accentColor: e,
                fullscreen: t.fullscreen || !1,
                height: t.height || 400,
                title: t.title,
                type: "iframe",
                url: this.signUrl(Jr(t.url), t.args)
            }
        };
        return this.requestWithContext("modal", r)
    }, Ls.updateModal = function (t) {
        if (!t) return Ye.resolve();
        var e = t.accentColor, r = t.actions, n = t.fullscreen, o = t.title;
        if (!(e || r || n || o)) return Ye.resolve();
        if (t.url) throw new Error("Updating Modal url not allowed");
        if (t.callback) throw new Error("Unable to update callback. You can set onBeforeUnload to run code before Modal close: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload");
        if (r && !Array.isArray(r)) throw new Error("Modal actions property must be an array");
        var i = {content: Bs(t, ["actions", "accentColor", "fullscreen", "title"])};
        return e && (i.content.accentColor = ar(e)), this.requestWithContext("update-modal", i)
    }, Ls.hide = function () {
        return xo("hide() handler has been deprecated. Please use closePopup()"), this.requestWithContext("close-popup")
    }, Ls.closePopup = function () {
        return this.requestWithContext("close-popup")
    }, Ls.back = function () {
        return this.requestWithContext("pop-popup")
    }, Ls.hideOverlay = function () {
        return xo("hideOverlay() handler has been deprecated. Please use closeOverlay()"), this.requestWithContext("close-overlay")
    }, Ls.closeOverlay = function () {
        return xo("overlay() has been deprecated. Please use modal() instead. See: https://trello.readme.io/v1.0/reference#t-modal"), this.requestWithContext("close-overlay")
    }, Ls.hideBoardBar = function () {
        return xo("hideBoardBar() handler has been deprecated. Please use closeBoardBar()"), this.requestWithContext("close-board-bar")
    }, Ls.closeBoardBar = function () {
        return this.requestWithContext("close-board-bar")
    }, Ls.closeModal = function () {
        return this.requestWithContext("close-modal")
    }, Ls.sizeTo = function (t) {
        var e;
        if (ts(t)) {
            var r = document.querySelector(t);
            if (!r) return Ye.reject(new Error("No elements matched"));
            r.style.overflow = "hidden", e = Math.ceil(Math.max(r.scrollHeight, r.getBoundingClientRect().height))
        } else if ($i(t)) {
            var n = t;
            n.style.overflow = "hidden", e = Math.ceil(Math.max(n.scrollHeight, n.getBoundingClientRect().height))
        } else {
            if (!(or(t) && t > 0)) return Ye.reject(new Error("Invalid argument. Must be a selector, element, or positive number"));
            e = t
        }
        return e ? this.requestWithContext("resize", {height: e}) : Ye.reject(new Error("Unable to determine desired height."))
    }, Ls.localizeKey = function (t, e) {
        if (window.localizer && "function" == typeof window.localizer.localize) return window.localizer.localize(t, e);
        throw new Mr.LocalizerNotFound("No localizer available for localization.")
    }, Ls.localizeKeys = function (e) {
        if (!e) return [];
        var r = this;
        return e.map(function (e) {
            if ("string" == typeof e) return r.localizeKey(e);
            if (Array.isArray(e)) return r.localizeKey(e[0], e[1]);
            throw new Mr.UnsupportedKeyType("localizeKeys doesn't recognize the supplied key type: ".concat(t(e)))
        })
    }, Ls.localizeNode = function (t) {
        for (var e = t.querySelectorAll("[data-i18n-id],[data-i18n-attrs]"), r = 0, n = e.length; r < n; r += 1) {
            var o = {}, i = e[r];
            if (i.dataset.i18nArgs) try {
                o = JSON.parse(i.dataset.i18nArgs)
            } catch (t) {
                throw new Mr.UnableToParseArgs("Error parsing args. Error: ".concat(t.message))
            }
            if (i.dataset.i18nId && (i.textContent = this.localizeKey(i.dataset.i18nId, o)), i.dataset.i18nAttrs) {
                var s = void 0;
                try {
                    s = JSON.parse(i.dataset.i18nAttrs)
                } catch (t) {
                    throw new Mr.UnableToParseAttrs("Error parsing attrs. Error: ".concat(t.message))
                }
                s && s.placeholder && (i.placeholder = this.localizeKey(s.placeholder, o))
            }
        }
    }, Ls.card = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("card", {fields: e})
    }, Ls.cards = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("cards", {fields: e})
    }, Ls.list = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("list", {fields: e})
    }, Ls.lists = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("lists", {fields: e})
    }, Ls.member = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("member", {fields: e})
    }, Ls.board = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("board", {fields: e})
    }, Ls.organization = function () {
        for (var t = arguments.length, e = new Array(t), r = 0; r < t; r++) e[r] = arguments[r];
        return this.requestWithContext("organization", {fields: e})
    }, Ls.attach = function (t) {
        if (!this.memberCanWriteToModel("card")) throw new Error("User lacks write permission on card.");
        return this.requestWithContext("attach-to-card", t)
    }, Ls.requestToken = function (t) {
        if (!this.isMemberSignedIn()) throw new Error("No active member in context.");
        return this.requestWithContext("request-token", t)
    }, Ls.authorize = function (t, e) {
        var r, n = B.randomId(), o = e || {};
        if ("string" == typeof t) r = t; else {
            if ("function" != typeof t) throw xo("authorize requires a url or function that takes a secret and returns a url"), new Error("Invalid arguments passed to authorize");
            r = t(n)
        }
        var i = function () {
            return !0
        };
        o.validToken && "function" == typeof o.validToken && (i = o.validToken);
        var s = o.width || 800, a = o.height || 600,
            c = ["width=", s, ",height=", a, ",left=", window.screenX + Math.floor((window.outerWidth - s) / 2), ",top=", window.screenY + Math.floor((window.outerHeight - a) / 2)].join(""),
            u = function (t, e) {
                var r = window.open(t, "authorize", e);
                return "function" == typeof o.windowCallback && o.windowCallback(r), r
            };
        return new Ye(function (e) {
            window.addEventListener("storage", function (t) {
                return function e(r) {
                    "token" === r.key && r.newValue && i(r.newValue) && (localStorage.removeItem("token"), window.removeEventListener("storage", e, !1), delete window.authorize, t(r.newValue))
                }
            }(e), !1), "function" == typeof t ? new B({
                Promise: Ye,
                local: window,
                remote: u(r, c),
                targetOrigin: o.targetOrigin || "*",
                secret: n,
                handlers: {
                    value: function (t, r) {
                        r && r.token && i(r.token) && (this.stop(), e(r.token))
                    }
                }
            }) : (window.authorize = function (t) {
                t && i(t) && (delete window.authorize, e(t))
            }, u(r, c))
        })
    }, Ls.storeSecret = function (t, e) {
        if (!this.isMemberSignedIn()) throw new Error("No active member in context.");
        var r = this.getContext().member, n = "".concat(r, ":").concat(t), o = this;
        return Dr.sha256Digest(n).then(function (t) {
            return o.get("member", "private", "aescbc").then(function (t) {
                return t || Dr.generateAESCBCKey().then(function (t) {
                    return Dr.exportAESCBCKeyToRaw(t)
                }).then(function (t) {
                    return o.set("member", "private", "aescbc", t).then(function () {
                        return t
                    })
                })
            }).then(function (r) {
                return Dr.importAESCBCKeyFromRaw(r).then(function (r) {
                    var n = Dr.generateInitVector();
                    return Dr.encryptSecret(n, r, e).then(function (e) {
                        var r = "".concat(cr(n), ";").concat(e);
                        return window.localStorage.setItem(t, r), {key: t, value: r}
                    })
                })
            })
        })
    }, Ls.loadSecret = function (t) {
        if (!this.isMemberSignedIn()) throw new Error("No active member in context.");
        var e = this.getContext().member, r = this, n = "".concat(e, ":").concat(t);
        return Dr.sha256Digest(n).then(function (t) {
            return window.localStorage.getItem(t)
        }).then(function (t) {
            return t ? r.get("member", "private", "aescbc").then(function (e) {
                return e ? Dr.importAESCBCKeyFromRaw(e).then(function (e) {
                    var r = t.substring(0, t.indexOf(";")), n = t.substring(t.indexOf(";") + 1), o = ur(r);
                    return Dr.decryptSecret(o, e, n)
                }) : null
            }) : null
        })
    }, Ls.clearSecret = function (t) {
        if (!this.isMemberSignedIn()) throw new Error("No active member in context.");
        var e = this.getContext().member, r = "".concat(e, ":").concat(t);
        return Dr.sha256Digest(r).then(function (t) {
            return window.localStorage.removeItem(t), null
        })
    }, Ls.notifyParent = function (t, e) {
        var r = e || {};
        window.parent.postMessage(t, r.targetOrigin || "*")
    };
    var Ws = function (t, e) {
        var r = e || {};
        return new (r.io || B)({
            Promise: Ye,
            local: window,
            remote: window.parent,
            targetOrigin: r.targetOrigin || "https://trello.com",
            secret: r.secret,
            strict: !0,
            handlers: t,
            hostHandlers: r.hostHandlers,
            helpfulStacks: !!r.helpfulStacks,
            Sentry: r.Sentry
        })
    }, Ks = Ur("restApi", ["AuthDeniedError", "AuthNotReadyError", "ApiNotConfiguredError"]), $s = {
        makeWebCall: function (t) {
            var e, r = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : [];
            if (!this.t) throw new Ks.AuthNotReadyError("The API helper cannot be used from this context. This probably means that you are attemping to use it inside your iframe connector, but outside a capability handler. For more, http://developers.trello.com/v1.0/reference#api-client-availability.");
            if ("function" != typeof this.t[t]) throw new Ks.AuthNotReadyError("This method cannot be used in this context. This probably means that you are attemping to use it inside your iframe connector, but outside a capability handler. For more, http://developers.trello.com/v1.0/reference#api-client-availability.");
            return (e = this.t)[t].apply(e, o(r))
        }
    }, Qs = function (t) {
        return /^[a-z0-9]{64}$/.test(t)
    };
    $s.registerMessageHandler = function (t) {
        var e = this;
        return new Ye(function (r, n) {
            var o, i;
            o = setInterval(function () {
                t && t.closed && (clearInterval(o), n(new Ks.AuthDeniedError))
            }, 500);
            var s = function (e) {
                e.origin === window.location.origin && e.source === t && (i(), e.source.close(), e.data && Qs(e.data) ? r(e.data) : n(new Ks.AuthDeniedError))
            }, a = function (t) {
                t.key === e.tokenStorageKey && (i(), e.fetchAndStoreToken().then(function (t) {
                    t ? r(t) : n(new Ks.AuthDeniedError)
                }))
            };
            i = function () {
                window.removeEventListener("storage", a, !1), window.removeEventListener("message", s, !1), clearInterval(o)
            }, window.addEventListener("message", s, !1), window.addEventListener("storage", a, !1)
        })
    }, $s.storeToken = function (t) {
        return this.makeWebCall("set", ["member", "private", this.tokenStorageKey, t]).then(function () {
            return t
        })
    }, $s.checkForToken = function () {
        var t;
        try {
            t = this.localStorage.getItem(this.tokenStorageKey)
        } catch (t) {
        }
        return Qs(t) ? t : null
    }, $s.fetchAndStoreToken = function () {
        var t = this, e = this.checkForToken();
        return e ? this.storeToken(e).then(function () {
            return t.localStorage.removeItem(t.tokenStorageKey), e
        }) : Ye.resolve(null)
    }, $s.getToken = function () {
        var t = this;
        return this.fetchAndStoreToken().then(function (e) {
            return e || t.makeWebCall("get", ["member", "private", t.tokenStorageKey])
        })
    }, $s.clearToken = function () {
        try {
            this.localStorage.removeItem(this.tokenStorageKey)
        } catch (t) {
        }
        return this.makeWebCall("remove", ["member", "private", this.tokenStorageKey])
    }, $s.popupConfig = function () {
        var t = window.screenX + (window.outerWidth - 550) / 2, e = window.screenY + (window.outerHeight - 725) / 2;
        return "width=".concat(550, ",height=").concat(725, ",left=").concat(t, ",top=").concat(e)
    }, $s.showAuthPopup = function (t) {
        var e = t.expiration, r = void 0 === e ? "never" : e, n = t.scope, o = void 0 === n ? "read" : n,
            i = t.returnUrl, s = void 0 === i ? null : i, a = {
                name: this.appName,
                key: this.appKey,
                expiration: r,
                scope: o,
                callback_method: "fragment",
                response_type: "fragment"
            };
        a.return_url = s || window.location.href;
        var c = "".concat(this.authBase(), "/authorize?");
        return c += Object.keys(a).map(function (t) {
            return "".concat(t, "=").concat(encodeURIComponent(a[t]))
        }).join("&"), window.open(c, "authpopup", this.popupConfig())
    }, $s.authorize = function () {
        var t = this, e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
        return new Ye(function (r, n) {
            var o = t.showAuthPopup(e);
            t.getToken().then(function (t) {
                t && (o.close(), r(t))
            }), t.registerMessageHandler(o).then(r).catch(n)
        }).then(function (e) {
            return t.storeToken(e)
        })
    }, $s.isAuthorized = function () {
        return this.getToken().then(function (t) {
            return Qs(t)
        })
    }, $s.checkAndStoreToken = function () {
        var t = window.location.hash.match(/token=(.+)?/);
        if (t && 2 === t.length) {
            var e = Qs(t[1]) ? t[1] : "";
            try {
                this.localStorage.setItem(this.tokenStorageKey, e)
            } catch (t) {
            }
            try {
                window.opener && window.opener.postMessage(e, window.location.origin)
            } catch (t) {
            }
            window.setTimeout(function () {
                return window.close()
            }, 500)
        } else this.fetchAndStoreToken()
    };
    var Js = function () {
        function t(r) {
            var n = r.t, o = r.appKey, i = r.appName, s = r.apiOrigin, a = void 0 === s ? "https://api.trello.com" : s,
                c = r.authOrigin, u = void 0 === c ? "https://trello.com" : c, l = r.localStorage,
                h = void 0 === l ? window.localStorage : l, f = r.tokenStorageKey,
                p = void 0 === f ? "trello_token" : f;
            e(this, t), this.appKey = o, this.appName = i, this.apiOrigin = a, this.authOrigin = u, this.t = n, this.localStorage = h, this.tokenStorageKey = p
        }

        return n(t, [{
            key: "init", value: function () {
                this.checkAndStoreToken()
            }
        }, {
            key: "apiBase", value: function () {
                return "".concat(this.apiOrigin, "/1")
            }
        }, {
            key: "authBase", value: function () {
                return "".concat(this.authOrigin, "/1")
            }
        }]), t
    }();
    Object.keys($s).forEach(function (t) {
        Js.prototype[t] = $s[t]
    });
    var Gs = function () {
        function t(r) {
            var n = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {};
            e(this, t), this.handlers = {}, this.io = null, this.NotHandled = B.NotHandled, this.options = n, n.Sentry && n.Sentry.configureScope(function (t) {
                t.setTag("powerupjs_version", "1.18.3")
            });
            var o = this;
            Object.keys(r).forEach(function (t) {
                o.handlers[t] = function () {
                    for (var e = arguments.length, o = new Array(e), i = 0; i < e; i++) o[i] = arguments[i];
                    var s = this;
                    return window.locale = o[1].locale, Qr(window.locale, n).then(function () {
                        return Ye.try(function () {
                            return r[t].apply(s, o)
                        }).then(Ns)
                    })
                }
            }), this.handlers.callback = function (t, e) {
                return Ro.callback.call(this, t, e, Ns)
            };
            ["requestWithContext", "getAll", "get", "set", "remove", "safe", "localizeKey", "localizeKeys", "localizeNode", "board", "cards", "lists", "member", "organization"].forEach(function (t) {
                Fo(Ls, t) && (o[t] = Ls[t])
            })
        }

        return n(t, [{
            key: "connect", value: function () {
                var t = this, e = this, r = Ws(this.handlers, Do(this.options, {
                    secret: Uo("secret"),
                    hostHandlers: Do(Ls, {
                        getRestApi: function () {
                            if (!e.restApi) throw new Ks.ApiNotConfiguredError("To use the API helper, make sure you specify appKey and appName when you call TrelloPowerup.initialize. For more, https://developers.trello.com/v1.0/reference#rest-api.");
                            return e.restApi.t = this, e.restApi
                        }
                    })
                }));
                return this.io = r, r.request("initialize", Object.keys(this.handlers)).then(function (e) {
                    return t.options.Sentry && t.options.Sentry.configureScope(function (t) {
                        t.setTag("locale", e.locale || "en"), t.setTag("trello_version", e.version || "unknown"), e.member && t.setUser({id: e.member})
                    }), r.secret = e.secret, r.request("ready")
                }).then(function () {
                    return r
                })
            }
        }, {
            key: "request", value: function (t, e) {
                return this.io.request(t, e)
            }
        }, {
            key: "init", value: function () {
                var t = this;
                return this.options.appKey && this.options.appName ? (this.restApi = new Js({
                    t: this,
                    appKey: this.options.appKey,
                    appName: this.options.appName,
                    apiOrigin: this.options.apiOrigin,
                    authOrigin: this.options.authOrigin,
                    localStorage: this.options.localStorage,
                    tokenStorageKey: this.options.tokenStorageKey
                }), this.connect().tap(function () {
                    return t.restApi.init()
                })) : ((this.options.appKey || this.options.appName) && xo("Both appKey and appName must be included to use the API. See more https://developers.trello.com/v1.0/reference#rest-api."), this.connect())
            }
        }]), t
    }();
    Gs.prototype.NotHandled = B.NotHandled;
    var Xs = function () {
        function t() {
            var r = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
            e(this, t), this.io = null, this.args = [{
                context: Uo("context", r.context),
                secret: Uo("secret", r.secret)
            }].concat(Uo("args")), this.secret = Uo("secret", r.secret), this.options = r, window.locale = Uo("locale", "en")
        }

        return n(t, [{
            key: "init", value: function () {
                this.initSentry(), this.connect(), this.initApi()
            }
        }, {
            key: "connect", value: function () {
                var t = {
                    callback: function (t, e) {
                        return Ro.callback.call(this, t, e, Ns)
                    }
                };
                this.io = Ws(t, Do(this.options, {secret: Uo("secret"), hostHandlers: Ls}))
            }
        }, {
            key: "request", value: function (t, e) {
                return this.io.request(t, e)
            }
        }, {
            key: "render", value: function (t) {
                var e = this;
                window.addEventListener("message", function (r) {
                    r.source === window.parent && "render" === r.data && Qr(window.locale, e.options).then(function () {
                        t()
                    })
                }, !1)
            }
        }, {
            key: "initApi", value: function () {
                this.options.appKey && this.options.appName ? (this.restApi = new Js({
                    t: this,
                    appKey: this.options.appKey,
                    appName: this.options.appName,
                    apiOrigin: this.options.apiOrigin,
                    authOrigin: this.options.authOrigin,
                    localStorage: this.options.localStorage,
                    tokenStorageKey: this.options.tokenStorageKey
                }), this.restApi.init()) : (this.options.appKey || this.options.appName) && xo("Both appKey and appName must be included to use the API. See more at https://developers.trello.com/v1.0/reference#rest-api.")
            }
        }, {
            key: "getRestApi", value: function () {
                if (!this.restApi) throw new Ks.ApiNotConfiguredError("To use the API helper, make sure you specify appKey and appName when you call TrelloPowerUp.iframe. See more at https://developers.trello.com/v1.0/reference#rest-api");
                return this.restApi
            }
        }, {
            key: "initSentry", value: function () {
                if (this.options.Sentry) {
                    var t = Uo("context", this.options.context);
                    this.options.Sentry.configureScope(function (e) {
                        e.setTag("locale", Uo("locale", "en")), e.setTag("powerupjs_version", "1.18.3"), e.setTag("trello_version", t.version || "unknown"), t.member && e.setUser({id: t.member}), t.board && e.setTag("idBoard", t.board), t.permissions && Object.keys(t.permissions).forEach(function (r) {
                            e.setExtra("".concat(r, "_permission"), t.permissions[r])
                        })
                    })
                }
            }
        }]), t
    }(), Ys;
    for (var Zs in Xs.prototype.NotHandled = B.NotHandled, Ls) Fo(Ls, Zs) && (Xs.prototype[Zs] = Ls[Zs]);
    Ys = window.Element.prototype, Ys.matches = Ys.matches || Ys.mozMatchesSelector || Ys.msMatchesSelector || Ys.oMatchesSelector || Ys.webkitMatchesSelector, Ys.closest = Ys.closest || function (t) {
        for (var e = this; e && !e.matches(t);) e = e.parentElement;
        return e
    };
    var ta = function () {
        function t() {
            e(this, t), this.version = "1.18.3", this.CallbackCache = Ro, this.PostMessageIO = B, this.Promise = Ye, this.util = {
                colors: {
                    getHexString: sr,
                    namedColorStringToHex: ar
                },
                convert: {bytesToHexString: cr, hexStringToUint8Array: ur},
                crypto: Dr,
                initLocalizer: Qr,
                makeErrorEnum: Ur,
                relativeUrl: Jr
            }, this.restApiError = Ks, this.initialize = this.initialize.bind(this), this.iframe = this.iframe.bind(this)
        }

        return n(t, [{
            key: "initialize", value: function (t, e) {
                return null != this.iframeConnector && xo("Cannot call TrelloPowerUp.initialize() from a secondary iframe where you have already called TrelloPowerUp.iframe(). TrelloPowerUp.initialize() should only be called from your index connector page, and should not include a call to TrelloPowerUp.iframe()"), null != this.indexConnector ? (xo("Warning: calling TrelloPowerUp.initialize() more than once will have no effect. It is expected that you call it only once on your index connector."), this.indexConnector) : (this.indexConnector = new Gs(t, e), this.indexConnector.init(), this.indexConnector)
            }
        }, {
            key: "iframe", value: function (t) {
                return null != this.indexConnector && xo("Cannot call TrelloPowerUp.iframe() from your index connector where you call TrelloPowerUp.initialize(). TrelloPowerUp.iframe() is only used for secondary iframes you may create or request from Trello during the Power-Up lifecycle."), null != this.iframeConnector ? this.iframeConnector : (this.iframeConnector = new Xs(t), this.iframeConnector.init(), this.iframeConnector)
            }
        }]), t
    }();
    window.TrelloPowerUp = new ta
});
//# sourceMappingURL=power-up.min.js.map
