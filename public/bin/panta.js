// Input 0
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
$jscomp.SIMPLE_FROUND_POLYFILL = !1;
$jscomp.objectCreate = $jscomp.ASSUME_ES5 || "function" == typeof Object.create ? Object.create : function(a) {
  var b = function() {
  };
  b.prototype = a;
  return new b;
};
$jscomp.underscoreProtoCanBeSet = function() {
  var a = {a:!0}, b = {};
  try {
    return b.__proto__ = a, b.a;
  } catch (c) {
  }
  return !1;
};
$jscomp.setPrototypeOf = "function" == typeof Object.setPrototypeOf ? Object.setPrototypeOf : $jscomp.underscoreProtoCanBeSet() ? function(a, b) {
  a.__proto__ = b;
  if (a.__proto__ !== b) {
    throw new TypeError(a + " is not extensible");
  }
  return a;
} : null;
$jscomp.inherits = function(a, b) {
  a.prototype = $jscomp.objectCreate(b.prototype);
  a.prototype.constructor = a;
  if ($jscomp.setPrototypeOf) {
    var c = $jscomp.setPrototypeOf;
    c(a, b);
  } else {
    for (c in b) {
      if ("prototype" != c) {
        if (Object.defineProperties) {
          var d = Object.getOwnPropertyDescriptor(b, c);
          d && Object.defineProperty(a, c, d);
        } else {
          a[c] = b[c];
        }
      }
    }
  }
  a.superClass_ = b.prototype;
};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
$jscomp.arrayIteratorImpl = function(a) {
  var b = 0;
  return function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  };
};
$jscomp.arrayIterator = function(a) {
  return {next:$jscomp.arrayIteratorImpl(a)};
};
$jscomp.makeIterator = function(a) {
  var b = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.polyfill = function(a, b, c, d) {
  if (b) {
    c = $jscomp.global;
    a = a.split(".");
    for (d = 0; d < a.length - 1; d++) {
      var e = a[d];
      e in c || (c[e] = {});
      c = c[e];
    }
    a = a[a.length - 1];
    d = c[a];
    b = b(d);
    b != d && null != b && $jscomp.defineProperty(c, a, {configurable:!0, writable:!0, value:b});
  }
};
$jscomp.FORCE_POLYFILL_PROMISE = !1;
$jscomp.polyfill("Promise", function(a) {
  function b() {
    this.batch_ = null;
  }
  function c(a) {
    return a instanceof e ? a : new e(function(b, c) {
      b(a);
    });
  }
  if (a && !$jscomp.FORCE_POLYFILL_PROMISE) {
    return a;
  }
  b.prototype.asyncExecute = function(a) {
    if (null == this.batch_) {
      this.batch_ = [];
      var b = this;
      this.asyncExecuteFunction(function() {
        b.executeBatch_();
      });
    }
    this.batch_.push(a);
  };
  var d = $jscomp.global.setTimeout;
  b.prototype.asyncExecuteFunction = function(a) {
    d(a, 0);
  };
  b.prototype.executeBatch_ = function() {
    for (; this.batch_ && this.batch_.length;) {
      var a = this.batch_;
      this.batch_ = [];
      for (var b = 0; b < a.length; ++b) {
        var c = a[b];
        a[b] = null;
        try {
          c();
        } catch (l) {
          this.asyncThrow_(l);
        }
      }
    }
    this.batch_ = null;
  };
  b.prototype.asyncThrow_ = function(a) {
    this.asyncExecuteFunction(function() {
      throw a;
    });
  };
  var e = function(a) {
    this.state_ = 0;
    this.result_ = void 0;
    this.onSettledCallbacks_ = [];
    var b = this.createResolveAndReject_();
    try {
      a(b.resolve, b.reject);
    } catch (k) {
      b.reject(k);
    }
  };
  e.prototype.createResolveAndReject_ = function() {
    function a(a) {
      return function(d) {
        c || (c = !0, a.call(b, d));
      };
    }
    var b = this, c = !1;
    return {resolve:a(this.resolveTo_), reject:a(this.reject_)};
  };
  e.prototype.resolveTo_ = function(a) {
    if (a === this) {
      this.reject_(new TypeError("A Promise cannot resolve to itself"));
    } else {
      if (a instanceof e) {
        this.settleSameAsPromise_(a);
      } else {
        a: {
          switch(typeof a) {
            case "object":
              var b = null != a;
              break a;
            case "function":
              b = !0;
              break a;
            default:
              b = !1;
          }
        }
        b ? this.resolveToNonPromiseObj_(a) : this.fulfill_(a);
      }
    }
  };
  e.prototype.resolveToNonPromiseObj_ = function(a) {
    var b = void 0;
    try {
      b = a.then;
    } catch (k) {
      this.reject_(k);
      return;
    }
    "function" == typeof b ? this.settleSameAsThenable_(b, a) : this.fulfill_(a);
  };
  e.prototype.reject_ = function(a) {
    this.settle_(2, a);
  };
  e.prototype.fulfill_ = function(a) {
    this.settle_(1, a);
  };
  e.prototype.settle_ = function(a, b) {
    if (0 != this.state_) {
      throw Error("Cannot settle(" + a + ", " + b + "): Promise already settled in state" + this.state_);
    }
    this.state_ = a;
    this.result_ = b;
    this.executeOnSettledCallbacks_();
  };
  e.prototype.executeOnSettledCallbacks_ = function() {
    if (null != this.onSettledCallbacks_) {
      for (var a = 0; a < this.onSettledCallbacks_.length; ++a) {
        f.asyncExecute(this.onSettledCallbacks_[a]);
      }
      this.onSettledCallbacks_ = null;
    }
  };
  var f = new b;
  e.prototype.settleSameAsPromise_ = function(a) {
    var b = this.createResolveAndReject_();
    a.callWhenSettled_(b.resolve, b.reject);
  };
  e.prototype.settleSameAsThenable_ = function(a, b) {
    var c = this.createResolveAndReject_();
    try {
      a.call(b, c.resolve, c.reject);
    } catch (l) {
      c.reject(l);
    }
  };
  e.prototype.then = function(a, b) {
    function c(a, b) {
      return "function" == typeof a ? function(b) {
        try {
          d(a(b));
        } catch (t) {
          f(t);
        }
      } : b;
    }
    var d, f, g = new e(function(a, b) {
      d = a;
      f = b;
    });
    this.callWhenSettled_(c(a, d), c(b, f));
    return g;
  };
  e.prototype.catch = function(a) {
    return this.then(void 0, a);
  };
  e.prototype.callWhenSettled_ = function(a, b) {
    function c() {
      switch(d.state_) {
        case 1:
          a(d.result_);
          break;
        case 2:
          b(d.result_);
          break;
        default:
          throw Error("Unexpected state: " + d.state_);
      }
    }
    var d = this;
    null == this.onSettledCallbacks_ ? f.asyncExecute(c) : this.onSettledCallbacks_.push(c);
  };
  e.resolve = c;
  e.reject = function(a) {
    return new e(function(b, c) {
      c(a);
    });
  };
  e.race = function(a) {
    return new e(function(b, d) {
      for (var e = $jscomp.makeIterator(a), f = e.next(); !f.done; f = e.next()) {
        c(f.value).callWhenSettled_(b, d);
      }
    });
  };
  e.all = function(a) {
    var b = $jscomp.makeIterator(a), d = b.next();
    return d.done ? c([]) : new e(function(a, e) {
      function f(b) {
        return function(c) {
          g[b] = c;
          h--;
          0 == h && a(g);
        };
      }
      var g = [], h = 0;
      do {
        g.push(void 0), h++, c(d.value).callWhenSettled_(f(g.length - 1), e), d = b.next();
      } while (!d.done);
    });
  };
  return e;
}, "es6", "es3");
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.SymbolClass = function(a, b) {
  this.$jscomp$symbol$id_ = a;
  $jscomp.defineProperty(this, "description", {configurable:!0, writable:!0, value:b});
};
$jscomp.SymbolClass.prototype.toString = function() {
  return this.$jscomp$symbol$id_;
};
$jscomp.Symbol = function() {
  function a(c) {
    if (this instanceof a) {
      throw new TypeError("Symbol is not a constructor");
    }
    return new $jscomp.SymbolClass($jscomp.SYMBOL_PREFIX + (c || "") + "_" + b++, c);
  }
  var b = 0;
  return a;
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("Symbol.iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.iteratorPrototype($jscomp.arrayIteratorImpl(this));
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.initSymbolAsyncIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.asyncIterator;
  a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("Symbol.asyncIterator"));
  $jscomp.initSymbolAsyncIterator = function() {
  };
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.iteratorFromArray = function(a, b) {
  $jscomp.initSymbolIterator();
  a instanceof String && (a += "");
  var c = 0, d = {next:function() {
    if (c < a.length) {
      var e = c++;
      return {value:b(e, a[e]), done:!1};
    }
    d.next = function() {
      return {done:!0, value:void 0};
    };
    return d.next();
  }};
  d[Symbol.iterator] = function() {
    return d;
  };
  return d;
};
$jscomp.polyfill("Array.prototype.values", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a, c) {
      return c;
    });
  };
}, "es8", "es3");
$jscomp.polyfill("Array.prototype.flat", function(a) {
  return a ? a : function(a) {
    a = void 0 === a ? 1 : Number(a);
    for (var b = [], d = 0; d < this.length; d++) {
      var e = this[d];
      Array.isArray(e) && 0 < a ? (e = Array.prototype.flat.call(e, a - 1), b.push.apply(b, e)) : b.push(e);
    }
    return b;
  };
}, "es9", "es5");
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a) {
      return a;
    });
  };
}, "es6", "es3");
$jscomp.owns = function(a, b) {
  return Object.prototype.hasOwnProperty.call(a, b);
};
$jscomp.polyfill("Object.values", function(a) {
  return a ? a : function(a) {
    var b = [], d;
    for (d in a) {
      $jscomp.owns(a, d) && b.push(a[d]);
    }
    return b;
  };
}, "es8", "es3");
$jscomp.findInternal = function(a, b, c) {
  a instanceof String && (a = String(a));
  for (var d = a.length, e = 0; e < d; e++) {
    var f = a[e];
    if (b.call(c, f, e, a)) {
      return {i:e, v:f};
    }
  }
  return {i:-1, v:void 0};
};
$jscomp.polyfill("Array.prototype.find", function(a) {
  return a ? a : function(a, c) {
    return $jscomp.findInternal(this, a, c).v;
  };
}, "es6", "es3");
$jscomp.checkStringArgs = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
};
$jscomp.polyfill("String.prototype.startsWith", function(a) {
  return a ? a : function(a, c) {
    var b = $jscomp.checkStringArgs(this, a, "startsWith");
    a += "";
    var e = b.length, f = a.length;
    c = Math.max(0, Math.min(c | 0, b.length));
    for (var h = 0; h < f && c < e;) {
      if (b[c++] != a[h++]) {
        return !1;
      }
    }
    return h >= f;
  };
}, "es6", "es3");
$jscomp.polyfill("Object.entries", function(a) {
  return a ? a : function(a) {
    var b = [], d;
    for (d in a) {
      $jscomp.owns(a, d) && b.push([d, a[d]]);
    }
    return b;
  };
}, "es8", "es3");
$jscomp.polyfill("Array.prototype.flatMap", function(a) {
  return a ? a : function(a, c) {
    for (var b = [], e = 0; e < this.length; e++) {
      var f = a.call(c, this[e], e, this);
      Array.isArray(f) ? b.push.apply(b, f) : b.push(f);
    }
    return b;
  };
}, "es9", "es5");
var Binding = function(a, b, c, d, e) {
  this.document = a;
  this._entity = b;
  this._action = c;
  this._context = d;
  this._autoUpdater = null;
  this._configuration = e;
};
Binding.prototype.update = function(a, b) {
};
Binding.prototype.bind = function() {
};
Binding.prototype.detach = function() {
};
Binding.prototype.blockUi = function() {
  if (0 < this.document.getElementsByClassName("overlay").length) {
    return Promise.resolve(!0);
  }
  var a = this, b = this.document.createElement("div");
  b.addClass("overlay");
  b.appendChild(this.document.createTextNode("Plugin Daten werden aktualisiert..."));
  this.document.getElementsByTagName("body").item(0).appendChild(b);
  this._autoUpdater = this._autoUpdater || setInterval(function() {
    a._context.canUnblock();
  }, 500);
  return Promise.resolve(!0);
};
Binding.prototype.unblock = function() {
  this.document.getElementsByClassName("overlay").forEach(function(a) {
    a.parentNode.removeChild(a);
  });
  this._autoUpdater && clearInterval(this._autoUpdater);
};
Binding.prototype.updateConfiguration = function(a) {
};
Binding.prototype.updateField = function(a, b) {
  !1 === this.getConfigurationFor(b).editable.visible ? a.hide() : a.show();
  a instanceof SingleLineInput ? this._updateText(a, b) : a instanceof MultiLineInput ? this._updateText(a, b) : a instanceof SingleSelectInput && this._updateSelect(a, b);
};
Binding.prototype._updateText = function(a, b) {
  b = this.getConfigurationFor(b);
  a.setLabel(b.editable.label);
  a.setPlaceholder(b.editable.placeholder);
};
Binding.prototype._updateSelect = function(a, b) {
  b = this.getConfigurationFor(b);
  a.clear();
  a.setLabel(b.label);
  a.addOption("-1", "\u2026");
  a.addOptions(b.options);
  a.invalidate();
};
Binding.prototype.getConfigurationFor = function(a) {
  var b = this._configuration.config.editables.filter(function(b) {
    return b.id === a;
  }), c = b[0].label, d = b.map(function(a) {
    return a.values;
  }).flat().map(function(a, b) {
    return newOption(b, a);
  }).reduce(function(a, b) {
    a.push(b);
    return a;
  }, []);
  return {label:c, options:d, editable:b[0]};
};
// Input 1
var TabIndexProvider = function() {
  this.current = 1;
};
TabIndexProvider.prototype.getAndIncrement = function() {
  return this.current++;
};
TabIndexProvider.prototype.reset = function() {
  this.current = 1;
};
// Input 2
var Repository = function() {
  this._repository = {};
};
Repository.prototype.all = function() {
  return this._repository;
};
Repository.prototype.add = function(a, b) {
  this._repository[b.id] = a;
};
Repository.prototype.replace = function(a, b) {
  this._repository[b.id] = a;
};
Repository.prototype.clearAll = function() {
  var a = this;
  Object.keys(this._repository).forEach(function(b) {
    delete a._repository[b];
  });
};
Repository.prototype.get = function(a) {
  return this._repository[a.id];
};
Repository.prototype.find = function(a) {
  return Object.values(this._repository).find(a);
};
Repository.prototype.isNew = function(a) {
};
// Input 3
var VERSION = "1.4.4-SNAPSHOT", PLUGIN_CONFIGURATION = {"module.artikel.enabled":!1, "module.beteiligt.enabled":!0, "module.plan.enabled":!0}, TEXTS = {"module.settings.hint":"Folgende MODULE sind f\u00fcr dieses BOARD verf\u00fcgbar:<br/>Sobald mindestens ein MODUL aktiviert ist, wird dieses in jeder CARD auf dem BOARD dargestellt.", "module.artikel.label.desc":"Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.", "module.artikel.desc":"ARTIKEL-Eingabefelder und LISTEN f\u00fcr dieses BOARD konfigurieren:<br/>F\u00fcr jedes Feld kann eine Farbe definiert werden.<br/>Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf der CARD Vorderseite \u2013 ansonsten wird es nur auf der CARD Innenseite dargestellt.", 
"module.artikel.editable.desc":"Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>Die Zahl der Stichwort ist NICHT begrenzt.<br/>Maximal vier der sechs LISTEN lassen sich sortieren.<br/>LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.", "module.artikel.field-a.desc":"Das Textfeld \u00abA\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-b.desc":"Das Textfeld \u00abB\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.artikel.field-c.desc":"Das Textfeld \u00abC\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-d.desc":"Das Textfeld \u00abD\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-e.desc":"Das Textfeld \u00abE\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-f.desc":"Das Textfeld \u00abF\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.artikel.field-g.desc":"Das Textfeld \u00abG\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.beteiligt.desc":"BETEILIGT kann als Erg\u00e4nzung zum ARTIKEL oder PLAN aktiviert werden.<br/>Hier die Eingabefelder und LISTEN f\u00fcr das ganze BOARD konfigurieren:", "module.beteiligt.label.desc":"Dieser Titel wird oberhalb des Modul BETEILIGT auf jeder CARD sichtbar.", "module.beteiligt.layout.onsite":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", 
"module.beteiligt.layout.text":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.photo":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.video":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.illu":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.ad":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.regular.desc":"Standard-Layout", "module.beteiligt.special.desc":"Inserat-Layout", "module.beteiligt.blog.desc":"Blog-Layout", 
"module.plan.label.desc":"Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.", "module.plan.desc":"PLAN-Eingabefelder und Auswahllisten f\u00fcr das BOARD konfigurieren:<br/>F\u00fcr jedes Feld kann eine Farbe definiert werden.<br/>Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf der CARD Vorderseite \u2013 ansonsten wird es nur auf der CARD Innenseite dargestellt.", "module.plan.editable.desc":"Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>Die Zahl der Stichwort ist NICHT begrenzt.<br/>Maximal vier der sechs LISTEN lassen sich sortieren.<br/>LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.", 
"module.plan.field-a.desc":"Das Textfeld \u00abA\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-b.desc":"Das Textfeld \u00abB\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-c.desc":"Das Textfeld \u00abC\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-d.desc":"Das Textfeld \u00abD\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.plan.field-e.desc":"Das Textfeld \u00abE\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-f.desc":"Das Textfeld \u00abF\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-g.desc":"Das Textfeld \u00abG\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-h.desc":"Das Textfeld \u00abH\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.beteiligt.layout-regular.desc":"Das Kontakt-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", "module.beteiligt.layout-ad.desc":"Das Inserat-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", "module.beteiligt.layout-blog.desc":"Das Blog-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", "module.beteiligt.field-name.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-social.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-address.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-notes.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-deadline.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-a.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-b.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-c.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-total.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-price.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-placement.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-format.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-sujet.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-link.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-follower.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-date.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an."}, POWERUP_ADMINS = ["manu29494020", "koni_nordmann", "ray2505"];
// Input 4
var DI = function() {
};
DI.getInstance = function() {
  null === DI.INSTANCE && this.create();
  return DI.INSTANCE;
};
DI.create = function(a) {
  if (DI.INSTANCE) {
    return DI.INSTANCE;
  }
  a && a.hasOwnProperty("implementation") ? DI.INSTANCE = a.implementation() : (a = function() {
    DI.call(this);
    this.tabIndexProvider = new TabIndexProvider;
  }, $jscomp.inherits(a, DI), a.INSTANCE = DI.INSTANCE, a.getInstance = DI.getInstance, a.prototype.getArticleRepository = function() {
    return new ArtikelRepository;
  }, a.prototype.getTabIndexProvider = function() {
    return this.tabIndexProvider;
  }, DI.INSTANCE = new a);
  return DI.INSTANCE;
};
DI.prototype.getArticleRepository = function() {
};
DI.prototype.getTabIndexProvider = function() {
};
DI.INSTANCE = null;
// Input 5
var Controller = function(a, b) {
  this._repository = b;
  this._binding = null;
  this._window = a;
};
Controller.prototype.canUnblock = function() {
  this._window.clientManager.getPluginController().upgrading || this._binding.unblock();
};
Controller.prototype.blockUi = function() {
  this._binding.blockUi();
  return Promise.resolve(!0);
};
Controller.prototype.update = function() {
};
Controller.prototype.render = function(a, b) {
};
Controller.prototype.detach = function() {
  this._binding && this._binding.detach();
};
Controller.prototype.insert = function(a, b) {
  a && this._repository.isNew(a) ? this._repository.add(a, b) : a && this._repository.replace(a, b);
};
Controller.prototype.create = function(a, b) {
};
Controller.prototype.onEvent = function(a, b) {
};
Controller.prototype.list = function() {
  return this._repository.all();
};
Controller.prototype.size = function() {
  return Object.keys(this.list()).length;
};
Controller.prototype.fetchAll = function() {
};
Controller.prototype.persist = function(a, b) {
};
Controller.prototype.clear = function() {
};
Controller.prototype.getByCard = function(a) {
  return this._repository.get(a);
};
Controller.prototype.hasContent = function(a) {
  return !a.isEmpty();
};
Controller.prototype.getMapping = function(a, b, c) {
  switch(a.type) {
    case "select":
      return b = this.getPropertyByName(b, a.id, -1), -1 !== b ? a.values[b] : c;
    default:
      return this.getPropertyByName(b, a.id, c);
  }
};
Controller.prototype.getPropertyByName = function(a, b, c) {
};
// Input 6
var AbstractItem = function() {
};
AbstractItem.prototype.decorate = function(a) {
  a.addClass("panta-item");
  a.setEventListener("mouseenter", function(b) {
    a.addClass("hovered");
  });
  a.setEventListener("mouseleave", function(b) {
    a.removeClass("hovered");
  });
  return this;
};
// Input 7
var PModuleConfig = function(a, b) {
  this.document = a;
  this.valueHolder = b;
  this.inputFields = {};
};
PModuleConfig.prototype.bind = function(a, b) {
  this._entity = a;
  this._property = b;
  this.valueHolder.data = a.sections[b];
  return this;
};
PModuleConfig.prototype.render = function() {
  this.update(this._entity);
  this.setTabName();
  var a = this;
  this.valueHolder.tab.addEventListener("click", function(b) {
    a.activate();
  });
  return this;
};
PModuleConfig.prototype.update = function(a) {
  null !== a && (this.valueHolder.data = a.sections[this._property]);
  this._entity = a;
  this.valueHolder.data.isEmpty() ? this.valueHolder.tab.removeClass("content") : this.valueHolder.tab.addClass("content");
  return this;
};
PModuleConfig.prototype.setTabName = function(a) {
  this.valueHolder.label = a || this.valueHolder.label;
  this.valueHolder.tab.innerHTML = "<span>" + this.valueHolder.label + "</span>";
};
PModuleConfig.prototype.activate = function() {
  this.valueHolder.renderer.call(this, this.valueHolder);
  this.valueHolder.tab.addClass("selected");
};
PModuleConfig.prototype.setField = function(a, b) {
  this.inputFields[a] = b;
};
PModuleConfig.prototype.setFieldValue = function(a, b, c) {
  (a = this.inputFields[a]) && a instanceof PInput && a.bind(b, c);
};
PModuleConfig.prototype.showHideField = function(a, b) {
  (a = this.inputFields[a]) && a instanceof PInput && (!1 === b ? a.hide() : a.show());
};
PModuleConfig.prototype.beginEditing = function() {
  this.valueHolder.tab.addClass("editing");
};
PModuleConfig.prototype.endEditing = function() {
  this.valueHolder.tab.removeClass("editing");
};
PModuleConfig.prototype.hasContent = function() {
  return this._entity.sections[this._property];
};
// Input 8
var ModuleEditableSelectItem = function(a) {
  AbstractItem.call(this);
  this._options = [];
  this._value = a;
};
$jscomp.inherits(ModuleEditableSelectItem, AbstractItem);
ModuleEditableSelectItem.prototype.addOption = function(a) {
  this._options.push(a);
};
ModuleEditableSelectItem.prototype.setOnTextChangeListener = function(a) {
  this._onTextChangeListener = a;
  return this;
};
ModuleEditableSelectItem.prototype.fireOnCreate = function() {
  this._onTextChangeListener && this._onTextChangeListener(this.value, this.value);
};
ModuleEditableSelectItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_editable_select, template_settings_editable_select);
  b.getElementsByClassName("module-editable-select-container").forEach(function(b) {
    if (b instanceof HTMLElement) {
      var c = b.getClosestChildByClassName("panta-js-select");
      c.setEventListener("change", function(b) {
        a._value = a._onTextChangeListener(a.value, b.srcElement.value);
      });
      a._options.forEach(function(a) {
        c.appendChild(a);
      });
      c.value = a.value;
    }
  });
  return b;
};
$jscomp.global.Object.defineProperties(ModuleEditableSelectItem.prototype, {value:{configurable:!0, enumerable:!0, get:function() {
  return this._value;
}, set:function(a) {
  this._value = a;
}}});
// Input 9
var ModuleEditableItem = function(a, b) {
  AbstractItem.call(this);
  this._module = a;
  this._editable = b;
};
$jscomp.inherits(ModuleEditableItem, AbstractItem);
ModuleEditableItem.prototype.setOnEnterListener = function(a) {
  this._onEnterHandler = a;
  return this;
};
ModuleEditableItem.prototype.setOnActivationListener = function(a) {
  this._onActivationHandler = a;
  return this;
};
ModuleEditableItem.prototype.setOnColorPickerClick = function(a) {
  this._onColorPickerHandler = a;
  return this;
};
ModuleEditableItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_editable, template_settings_editable);
  this.decorate(b);
  b.getElementsByClassName("module-editable-name").forEach(function(b) {
    b instanceof HTMLElement && (b.addClass("underline"), b.innerText = a.editable.label);
  });
  b.setEventListener("click", function() {
    a._onEnterHandler(a.module, a.editable);
  });
  var c = b.getClosestChildByClassName("panta-checkbox-container");
  "calc" !== this.editable.type && (c.removeClass("hidden").getClosestChildByClassName("panta-js-checkbox").checked = !0 === a.editable.show, c.setEventListener("click", function(b) {
    b.preventDefault();
    b.stopPropagation();
    b = b.srcElement.getClosestParentByClassName("panta-checkbox-container").getClosestChildByClassName("panta-js-checkbox");
    b.checked = !b.checked;
    a._onActivationHandler(a.module, a.editable, b.checked);
  }), this._renderColor(b));
  this._renderSortable(b);
  this._renderVisible(b);
  return b;
};
ModuleEditableItem.prototype._renderVisible = function(a) {
  a = a.getClosestChildByClassName("module-helper-visible").getClosestChildByClassName("panta-js-button");
  a.addClass("hidden");
  !0 === this.editable.visible && a.removeClass("hidden");
  a.setEventListener("click", function(a) {
    a.preventDefault();
    a.stopPropagation();
  });
};
ModuleEditableItem.prototype._renderSortable = function(a) {
  a = a.getClosestChildByClassName("module-helper-sortable").getClosestChildByClassName("panta-js-button");
  a.addClass("hidden");
  "select" === this.editable.type && !0 === this.editable.sortable && a.removeClass("hidden");
  a.setEventListener("click", function(a) {
    a.preventDefault();
    a.stopPropagation();
  });
};
ModuleEditableItem.prototype._renderColor = function(a) {
  var b = this;
  a = a.getClosestChildByClassName("module-editable-color").removeClass("invisible").getClosestChildByClassName("panta-js-button");
  switch(b.editable.type) {
    case "label":
    case "layout":
      a.addClass("hidden");
      break;
    default:
      a.addClass("panta-bgcolor-" + b.editable.color).removeClass("hidden").setEventListener("click", function(a) {
        a.preventDefault();
        a.stopPropagation();
        b._onColorPickerHandler(b.module, b.editable);
      });
  }
};
$jscomp.global.Object.defineProperties(ModuleEditableItem.prototype, {module:{configurable:!0, enumerable:!0, get:function() {
  return this._module;
}, set:function(a) {
  this._module = a;
}}, editable:{configurable:!0, enumerable:!0, get:function() {
  return this._editable;
}, set:function(a) {
  this._editable = a;
}}});
// Input 10
var ModuleSettingsItem = function(a, b) {
  AbstractItem.call(this);
  this._document = a;
  this._module = b;
};
$jscomp.inherits(ModuleSettingsItem, AbstractItem);
ModuleSettingsItem.prototype.setOnEnterListener = function(a) {
  this._onEnterHandler = a;
  return this;
};
ModuleSettingsItem.prototype.setOnActivationListener = function(a) {
  this._onActivationHandler = a;
  return this;
};
ModuleSettingsItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_module, template_settings_module);
  b.setEventListener("click", function(b) {
    a._onEnterHandler(a.module);
  });
  b.getElementsByClassName("module-title").forEach(function(b) {
    b.addClass("underline");
    b.innerText = a.module.name;
    b.setAttribute("id", a.module.id);
  });
  this.decorate(b);
  b.getClosestChildByClassName("panta-js-icon").setAttribute("src", "./assets/" + a.module.config.icon);
  var c = b.getClosestChildByClassName("panta-checkbox-container");
  c.getClosestChildByClassName("panta-js-checkbox").checked = a.module.config.enabled;
  c.setEventListener("click", function(b) {
    b.preventDefault();
    b.stopPropagation();
    b = b.srcElement.getClosestParentByClassName("panta-checkbox-container").getClosestChildByClassName("panta-js-checkbox");
    b.checked = !b.checked;
    a._onActivationHandler(a.module, b.checked);
  });
  return b;
};
$jscomp.global.Object.defineProperties(ModuleSettingsItem.prototype, {module:{configurable:!0, enumerable:!0, get:function() {
  return this._module;
}, set:function(a) {
  this._module = a;
}}, icon:{configurable:!0, enumerable:!0, get:function() {
  return this._icon;
}, set:function(a) {
  this._icon = a;
}}, enabled:{configurable:!0, enumerable:!0, get:function() {
  return this._enabled;
}, set:function(a) {
  this._enabled = a;
}}, label:{configurable:!0, enumerable:!0, get:function() {
  return this._label;
}, set:function(a) {
  this._label = a;
}}, document:{configurable:!0, enumerable:!0, get:function() {
  return this._document;
}}});
// Input 11
var SwitchItem = function(a, b, c) {
  AbstractItem.call(this);
  this._document = a;
  this._label = b;
  this._enabled = c;
};
$jscomp.inherits(SwitchItem, AbstractItem);
SwitchItem.prototype.setOnActivationListener = function(a) {
  this._onActivationHandler = a;
  return this;
};
SwitchItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_switch, template_settings_switch);
  b.getElementsByClassName("switch-title").forEach(function(b) {
    b.innerText = a.label;
  });
  a.decorate(b);
  var c = b.getClosestChildByClassName("panta-checkbox-container");
  c.getClosestChildByClassName("panta-js-checkbox").checked = a.enabled;
  c.setEventListener("click", function(b) {
    b.preventDefault();
    b.stopPropagation();
    b = b.srcElement.getClosestParentByClassName("panta-checkbox-container").getClosestChildByClassName("panta-js-checkbox");
    b.checked = !b.checked;
    a._onActivationHandler(a.enabled, b.checked).then(function(b) {
      a.enabled = b;
    });
  });
  return b;
};
$jscomp.global.Object.defineProperties(SwitchItem.prototype, {enabled:{configurable:!0, enumerable:!0, get:function() {
  return this._enabled;
}, set:function(a) {
  this._enabled = a;
}}, label:{configurable:!0, enumerable:!0, get:function() {
  return this._label;
}, set:function(a) {
  this._label = a;
}}, document:{configurable:!0, enumerable:!0, get:function() {
  return this._document;
}}});
// Input 12
var ModuleEditableTextItem = function(a, b, c) {
  AbstractItem.call(this);
  this._value = a;
  this._deletable = b;
  this._visibleSwitch = c;
};
$jscomp.inherits(ModuleEditableTextItem, AbstractItem);
ModuleEditableTextItem.prototype.setOnTextChangeListener = function(a) {
  this._onTextChangeListener = a;
  return this;
};
ModuleEditableTextItem.prototype.setOnDeleteListener = function(a) {
  this._onDeleteListener = a;
  return this;
};
ModuleEditableTextItem.prototype.setOnVisibleToggleListener = function(a) {
  this._onVisibleToggleListener = a;
  return this;
};
ModuleEditableTextItem.prototype.setOnReadyListener = function(a) {
  this._onReadyListener = a;
  return this;
};
ModuleEditableTextItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_editable_option, template_settings_editable_option);
  b.getElementsByClassName("module-editable-option-name").forEach(function(b) {
    b instanceof HTMLElement && (b = b.getClosestChildByClassName("panta-js-name"), b.setEventListener("change", function(b) {
      a._value = a._onTextChangeListener(a.value, b.srcElement.value);
    }), b.value = a.value);
  });
  b.getElementsByClassName("panta-js-delete").forEach(function(b) {
    b instanceof HTMLElement && (a._deletable ? (b.removeClass("hidden"), b.setEventListener("click", function(b) {
      a._onDeleteListener(a.value);
    })) : b.addClass("hidden"));
  });
  b.getElementsByClassName("panta-js-visible").forEach(function(b) {
    b instanceof HTMLElement && (a._visibleSwitch ? (b.removeClass("hidden"), b.setEventListener("click", function(b) {
      a._onVisibleToggleListener();
    })) : b.addClass("hidden"));
    b.getClosestChildByTagName("img").setAttribute("src", "assets/ic_invisible.png");
  });
  a._onReadyListener && a._onReadyListener(b);
  return b;
};
$jscomp.global.Object.defineProperties(ModuleEditableTextItem.prototype, {value:{configurable:!0, enumerable:!0, get:function() {
  return this._value;
}, set:function(a) {
  this._value = a;
}}});
// Input 13
var PInput = function(a, b, c, d, e, f, h, g) {
  this._document = a;
  this._label = 0 === b.length ? "" : b;
  this._value = c;
  this._name = "name_" + d;
  d.startsWith(".", 0) ? this._target = this._document.getElementsByClassName(d.substr(1)).item(0) : this._target = this._document.getElementById(d);
  this._type = f;
  this._placeholder = e;
  this._readonly = h;
  this._input = this._document.createElement(this._type);
  this._inputOverlay = this._document.createElement("div");
  this._property = this._labelInput = null;
  this._propertyType = "text";
  this._visible = g;
};
PInput.prototype.setPropertyType = function(a) {
  this.propertyType = a;
  return this;
};
PInput.prototype.bind = function(a, b) {
  this._entity = a;
  this._property = b;
  this._value = a[b];
  this._updateProperty();
  return this;
};
PInput.prototype._updateProperty = function() {
  var a = this._entity[this.getBoundProperty()];
  if (null === a) {
    this._input.value = null, this._inputOverlay.innerHTML = "<span class='placeholder'>" + this._placeholder + "</span>";
  } else {
    switch(this.propertyType) {
      case "number":
        this._updateValue(this._formatNumber(a));
        break;
      case "money":
        this._updateValue(this._formatNumber(a, {minimumFractionDigits:2}));
        break;
      default:
        this._updateValue(a || "");
    }
  }
};
PInput.prototype._updateValue = function(a) {
  null !== this._input && this._input.value !== a ? ("select" !== this._type && (this._input.value = a), isBlank(a.trim()) ? this._inputOverlay.innerHTML = "<span class='placeholder'>" + this._placeholder + "</span>" : this._inputOverlay.innerHTML = a.htmlify()) : isBlank(a.trim()) && (this._inputOverlay.innerHTML = "<span class='placeholder'>" + this._placeholder + "</span>");
};
PInput.prototype.update = function(a) {
  this._entity = a;
  this._updateProperty();
  this._updateConditionalFormatting();
  return this;
};
PInput.prototype.render = function() {
  var a = this._document.createElement("div");
  this._visible ? a.removeClass("invisible") : a.addClass("invisible");
  this._input.setAttribute("name", this._name);
  this.setPlaceholder();
  this._input.setAttribute("title", this._label);
  this._input.setAttribute("autocomplete", "new-password");
  this._value && this._updateProperty();
  this._renderType();
  this._readonly ? this._input.setAttribute("readonly", "readonly") : this._input.setAttribute("tabindex", autoTabIndex());
  this._input.addClass(this.propertyType).addClass("u-border").addClass("hidden");
  this._inputOverlay.addClass("input-overlay").addClass(this.propertyType).addClass("u-border");
  this.setupEvents();
  this._labelInput = this.setLabel();
  0 === this._label.length ? a.addClass("field").addClass("hidden") : a.addClass("field");
  a.appendChild(this._labelInput);
  a.appendChild(this._inputOverlay);
  a.appendChild(this._input);
  this._target && this._target.appendChild(a);
  this.doCustomization(this._input, this._labelInput, this._inputOverlay);
  return this;
};
PInput.prototype.setLabel = function(a) {
  this._label = a || this._label;
  a = this._labelInput || this._document.createElement("label");
  a.removeChildren();
  a.appendChild(this._document.createTextNode(this._label));
  a.setAttribute("for", this._input.getAttribute("name"));
  a.addClass("prop-" + this._type);
  return a;
};
PInput.prototype.setPlaceholder = function(a) {
  this._placeholder = a || this._placeholder;
  this._input.placeholder = this._placeholder;
  this._input.setAttribute("placeholder", this._placeholder);
};
PInput.prototype._renderType = function() {
  if ("input" === this._type) {
    if (this._readonly) {
      this._input.setAttribute("type", "text");
    } else {
      switch(this.propertyType) {
        case "money":
          this._input.setAttribute("type", "text");
          this._input.setAttribute("min", "0.00");
          this._input.setAttribute("max", "1000000000.00");
          this._input.setAttribute("step", "0.01");
          break;
        case "number":
          this._input.setAttribute("type", "text");
          break;
        default:
          this._input.setAttribute("type", "text");
      }
    }
  }
};
PInput.prototype.setupEvents = function() {
  var a = this;
  this._setClassWhenEvent(this._input, "focus", "blur", "focused");
  this._setClassWhenEvent(this._input, "mouseenter", "mouseleave", "hovered");
  var b = function() {
    a._inputOverlay.addClass("hidden");
    a._input.removeClass("hidden");
    a._input.focus();
    var b = function() {
      a._inputOverlay.removeClass("hidden");
      a._input.addClass("hidden");
    };
    a._input.removeEventListener("blur", b);
    a._input.addEventListener("blur", b);
  };
  this._inputOverlay.removeEventListener("click", b);
  this._inputOverlay.addEventListener("click", b);
};
PInput.prototype._setClassWhenEvent = function(a, b, c, d) {
  b && a.setEventListener(b, function(a) {
    a.currentTarget.previousElementSibling.addClass(d);
  });
  c && this._input.setEventListener(c, function(a) {
    a.currentTarget.previousElementSibling.removeClass(d);
  });
};
PInput.prototype.addClass = function(a, b) {
  !0 === b ? this._labelInput.addClass(a) : (this._input.addClass(a), this._inputOverlay.addClass(a));
  return this;
};
PInput.prototype.hide = function() {
  this._target && this._target.children.forEach(function(a) {
    a.addClass("invisible");
  });
  return this;
};
PInput.prototype.show = function() {
  this._target && this._target.children.forEach(function(a) {
    a.removeClass("invisible");
  });
  return this;
};
PInput.prototype.addConditionalFormatting = function(a, b) {
  !0 === b ? this._labelInput.addConditionalFormatting(a) : (this._input.addConditionalFormatting(a), this._inputOverlay.addConditionalFormatting(a));
  return this;
};
PInput.prototype._updateConditionalFormatting = function() {
  this._labelInput.applyConditionalFormatting(this._entity);
  this._input.applyConditionalFormatting(this._entity);
  this._inputOverlay.applyConditionalFormatting(this._entity);
};
PInput.prototype.setHeight = function(a) {
  this._input.style.height = a + "px";
  this._inputOverlay.style.height = a + "px";
  return this;
};
PInput.prototype.setPadding = function(a, b, c, d) {
  isNumber(a) && (this._input.style.paddingTop = a + "px", this._inputOverlay.style.paddingTop = a + "px");
  isNumber(b) && (this._input.style.paddingRight = b + "px", this._inputOverlay.style.paddingRight = b + "px");
  isNumber(c) && (this._input.style.paddingBottom = c + "px", this._inputOverlay.style.paddingBottom = c + "px");
  isNumber(d) && (this._input.style.paddingLeft = d + "px", this._inputOverlay.style.paddingLeft = d + "px");
  return this;
};
PInput.prototype.onChange = function(a, b) {
  var c = this;
  this._input.onchange = function() {
    b.event = "change";
    a(c, b);
  };
  return this;
};
PInput.prototype.onFocus = function(a, b) {
  var c = this;
  this._input.onfocus = function() {
    b.event = "focus";
    a(c, b);
  };
  return this;
};
PInput.prototype.onEnterEditing = function(a, b) {
  var c = this;
  this._input.onblur = function() {
    b.event = "blur";
    a(c, b);
  };
  return this;
};
PInput.prototype.doCustomization = function(a, b, c) {
};
PInput.prototype.getOffsetHeight = function() {
  return Math.max(0, this._input.offsetHeight, this._inputOverlay.offsetHeight);
};
PInput.prototype.getValue = function() {
  return this._input.value;
};
PInput.prototype.getBoundProperty = function() {
  return this._property;
};
PInput.prototype.getBinding = function() {
  return this._entity;
};
PInput.prototype.setProperty = function() {
  switch(this.propertyType) {
    case "money":
    case "number":
      var a = this._parseNumber(this.getValue());
      this._value = this._entity[this.getBoundProperty()] = a;
      this._inputOverlay.innerHTML = a;
      break;
    default:
      this._entity[this.getBoundProperty()] = this.getValue(), this._value = this.getValue(), this._inputOverlay.innerHTML = this.getValue().htmlify();
  }
};
PInput.prototype.getTabIndex = function() {
  return this._readonly ? -1 : parseInt(this._input.getAttribute("tabindex"));
};
PInput.prototype._formatNumber = function(a, b) {
  a = parseFloat(a);
  return isNaN(a) ? "" : a.toLocaleString(void 0, b);
};
PInput.prototype._parseNumber = function(a) {
  if (!a) {
    return null;
  }
  var b = (1.23).toLocaleString().substr(1, 1);
  a = parseFloat(a.replace(new RegExp("[^\\d" + b + "]"), "").replace(b, "."));
  return isNaN(a) ? null : a;
};
$jscomp.global.Object.defineProperties(PInput.prototype, {propertyType:{configurable:!0, enumerable:!0, get:function() {
  return this._propertyType;
}, set:function(a) {
  this._propertyType = a;
}}});
var MultiLineInput = function(a, b, c, d, e, f, h, g) {
  PInput.call(this, a, b, c, d, e, "textarea", !!h, g);
  this._rows = f;
};
$jscomp.inherits(MultiLineInput, PInput);
MultiLineInput.prototype.doCustomization = function(a, b, c) {
  a.setAttribute("rows", this._rows);
  if (isMobileBrowser()) {
    var d = a.getClosestParentByClassName("mobile-row") || a.getClosestParentByClassName("row");
    if (d) {
      var e = getComputedStyle(a.getClosestParentByClassName("field"));
      e = parseFloat(e.paddingTop) + parseFloat(e.paddingBottom);
      this.setHeight(d.offsetHeight - b.offsetHeight - a.getMarginBottom() - e - 1);
    } else {
      console.log("Could not find a parent with class \u00abrow\u00bb or \u00abmobile-row\u00bb");
    }
  }
  return PInput.prototype.doCustomization.call(this, a, b, c);
};
var SingleLineInput = function(a, b, c, d, e, f, h) {
  PInput.call(this, a, b, c, d, e, "textarea", !!f, h);
};
$jscomp.inherits(SingleLineInput, PInput);
SingleLineInput.prototype.doCustomization = function(a, b, c) {
  a.setAttribute("rows", 1);
  a.addClass("no-resize");
  if (isMobileBrowser()) {
    var d = a.getClosestParentByClassName("mobile-row") || a.getClosestParentByClassName("row");
    if (d) {
      var e = getComputedStyle(a.getClosestParentByClassName("field"));
      e = parseFloat(e.paddingTop) + parseFloat(e.paddingBottom);
      this.setHeight(d.offsetHeight - b.offsetHeight - a.getMarginBottom() - e);
    } else {
      console.log("Could not find a parent with class \u00abrow\u00bb or \u00abmobile-row\u00bb");
    }
  }
  this.setPadding(Math.max(0, this.getOffsetHeight() - 26));
  return PInput.prototype.doCustomization.call(this, a, b, c);
};
var SingleSelectInput = function(a, b, c, d, e, f, h) {
  PInput.call(this, a, b, c, d, e, "select", !!f, h);
  this._options = [];
};
$jscomp.inherits(SingleSelectInput, PInput);
SingleSelectInput.prototype.setEmpty = function(a, b) {
  this._options.splice(0, 0, {value:a, text:b, empty:!0});
  return this;
};
SingleSelectInput.prototype.clear = function() {
  this._options.splice(0, this._options.length);
};
SingleSelectInput.prototype.addOptions = function(a) {
  var b = this;
  a.forEach(function(a) {
    b.addOption(a.value, a.text);
  });
};
SingleSelectInput.prototype.addOption = function(a, b) {
  this._options.push({value:a, text:b, empty:!1});
  return this;
};
SingleSelectInput.prototype.doCustomization = function(a, b, c) {
  var d = this;
  this._options.forEach(function(b, c) {
    c = document.createElement("option");
    c.value = b.value;
    c.text = b.text;
    parseInt(b.value) === parseInt(d._value) && c.setAttribute("selected", "selected");
    a.appendChild(c);
  });
  b.addClass("focused-fix");
  d._inputOverlay.addClass("hidden");
  a.removeClass("hidden");
  return PInput.prototype.doCustomization.call(this, a, b, c);
};
SingleSelectInput.prototype.invalidate = function() {
  this._input.removeChildren();
  this._inputOverlay.removeChildren();
  this.doCustomization(this._input, this._labelInput, this._inputOverlay);
};
// Input 14
var PluginController = function(a, b) {
  this._window = b;
  this._trelloApi = a;
  this._upgrading = !1;
  this._upgrades = {1:this._upgrade_1, 2:this._upgrade_2};
  this._repository = PluginRepository.INSTANCE;
};
PluginController.getInstance = function(a, b) {
  b.hasOwnProperty("pluginController") || (b.pluginController = new PluginController(a, b));
  return b.pluginController;
};
PluginController.prototype.init = function() {
  var a = this;
  this._trelloApi.get("board", "shared", PluginController.SHARED_NAME, 1).then(function(b) {
    PluginController.VERSION > b && (a._upgrading = !0, a.update.call(a, b, PluginController.VERSION));
  });
};
PluginController.prototype.getPluginConfiguration = function() {
  var a = this;
  return this._trelloApi.get("board", "shared", PluginController.CONFIGURATION_NAME, null).then(function(b) {
    return b ? (b = JSON.parse(LZString.decompress(b)), PluginConfiguration.create(b)) : new PluginConfiguration(VERSION, "Panta.Card Power-Up", null, a.getAvailableModules());
  });
};
PluginController.prototype.setPluginModuleConfig = function(a, b) {
  var c = this;
  return this.getPluginConfiguration().then(function(d) {
    if (d instanceof PluginConfiguration) {
      return d.card = b || d.card, d.modules.find(function(b) {
        return b.id === a.id;
      }).config = a.config, console.debug("Set new plugin configuration", d), c._trelloApi.set("board", "shared", PluginController.CONFIGURATION_NAME, LZString.compress(JSON.stringify(d))), d;
    }
    throw "Invalid plugin configuration";
  });
};
PluginController.prototype.findPluginModuleConfigByModuleId = function(a) {
  return this.getPluginConfiguration().then(function(a) {
    return a.modules;
  }).filter(function(b) {
    return b.id === a;
  }).reduce(function(a, c) {
    return c;
  }, null);
};
PluginController.prototype.getAvailableModules = function() {
  return Object.values(PluginRepository.INSTANCE.all()).sort(function(a, b) {
    return a.config.sort - b.config.sort;
  });
};
PluginController.prototype.remove = function() {
  return this._trelloApi.remove("board", "shared", PluginController.SHARED_NAME);
};
PluginController.prototype.update = function(a, b) {
  this._update(a, b);
};
PluginController.prototype._update = function(a, b) {
  var c = this;
  a < b ? (console.log("Applying upgrade %d ...", a), c._upgrades[a].call(this).then(function() {
    console.log("... upgrade %d is successfully applied", a);
    c._trelloApi.set("board", "shared", PluginController.SHARED_NAME, a + 1).then(function() {
      c._update(a + 1, b);
    });
  })) : (console.log("No upgrades pending"), setTimeout(function() {
    c._upgrading = !1;
  }, 2000));
};
PluginController.prototype._upgrade_1 = function() {
  var a = this, b = this._window.clientManager.getArticleController(), c = this._window.clientManager.getModuleController();
  return b.fetchAll.call(b).then(function() {
    a._upgradeAllArticleToModuleConfig.call(a, b, c);
  }).then(function() {
    return !0;
  });
};
PluginController.prototype._upgrade_2 = function() {
  return Promise.resolve(!0);
};
PluginController.prototype._upgradeAllArticleToModuleConfig = function(a, b) {
  this._upgradeArticleToModuleConfig.call(this, a, b, Object.entries(a.list()), 0);
};
PluginController.prototype._upgradeArticleToModuleConfig = function(a, b, c, d) {
  if (d < c.length) {
    var e = this, f = c[d], h = f[0], g = f[1];
    if (1 === g.version) {
      if (g.involved) {
        f = Object.entries(g.involved).reduce(function(a, b) {
          a.sections[b[0]] = b[1];
          return a;
        }, ModuleConfig.create()), b.persist.call(b, f, h).then(function() {
          g.version = Artikel.VERSION;
          "function" === typeof g.clearInvolved && g.clearInvolved();
          return a.persist.call(a, g, h);
        }).then(function() {
          e._upgradeArticleToModuleConfig.call(e, a, b, c, d + 1, h);
        });
      } else {
        return console.log("The article does not have any involved data. Just update the version of the article and proceed to the next item."), g.version = Artikel.VERSION, a.persist.call(a, g, h).then(function() {
          e._upgradeArticleToModuleConfig.call(e, a, b, c, d + 1, h);
        });
      }
    } else {
      console.log("Skipping article because its at version %d", g.version), this._upgradeArticleToModuleConfig.call(this, a, b, c, d + 1, h);
    }
  } else {
    console.log("All articles updated");
  }
};
$jscomp.global.Object.defineProperties(PluginController.prototype, {upgrading:{configurable:!0, enumerable:!0, get:function() {
  return this._upgrading;
}}});
$jscomp.global.Object.defineProperties(PluginController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 3;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.App";
}}, CONFIGURATION_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.App.Configuration";
}}});
// Input 15
var ModuleController = function(a, b, c) {
  Controller.call(this, a, new BeteiligtRepository);
  this.document = a.document;
  this.trelloApi = b;
  this._entity = this._beteiligtBinding = null;
  this._propertyBag = {};
  this._telephone = c;
  this._telephone.onmessage = this._onMessage();
  this.setVersionInfo();
  this.readPropertyBag();
};
$jscomp.inherits(ModuleController, Controller);
ModuleController.getInstance = function(a, b, c) {
  b.hasOwnProperty("moduleController") || (b.moduleController = new ModuleController(b, a, c));
  return b.moduleController;
};
ModuleController.prototype._onMessage = function() {
  var a = this;
  return function(b) {
    Object.values(b.data.get).forEach(function(a) {
      switch(a) {
        case "fee:current":
          this._sendResponse(a, this.getTotalFee());
          break;
        case "fee:overall":
          this._sendResponse(a, this.getOverallTotalFee());
          break;
        case "charge:current":
          this._sendResponse(a, this.getTotalCharges());
          break;
        case "charge:overall":
          this._sendResponse(a, this.getOverallTotalCharges());
          break;
        case "costs:overall":
          this._sendResponse(a, this.getOverallCosts());
      }
    }, a);
  };
};
ModuleController.prototype._sendResponse = function(a, b) {
  var c = {};
  c[a] = b;
  this._telephone.postMessage({result:[c]});
};
ModuleController.prototype.setVersionInfo = function() {
  this.trelloApi.set("card", "shared", ModuleController.SHARED_META, this.getVersionInfo());
};
ModuleController.prototype.getVersionInfo = function() {
  return {version:ModuleController.VERSION};
};
ModuleController.prototype.render = function(a, b) {
  this._entity = a;
  this._beteiligtBinding = this._beteiligtBinding ? this._beteiligtBinding.update(a, b) : this._createBinding(a, b);
};
ModuleController.prototype._createBinding = function(a, b) {
  return (new BeteiligtBinding(this.document, a, this.onEvent, this, b)).bind();
};
ModuleController.prototype.hide = function() {
  this.document.getElementById("panta.module").addClass("hidden");
};
ModuleController.prototype.update = function() {
  if (!this._window.clientManager.isBeteiligtModuleEnabled()) {
    throw "Module is not enabled";
  }
  var a = this.getTotalPrice();
  Object.values(this._entity.sections).filter(function(a) {
    return a instanceof AdBeteiligt;
  }).forEach(function(b) {
    b.total = a;
  });
  var b = this.getTotalProject(), c = this.getCapOnDepenses();
  Object.values(this._entity.sections).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).forEach(function(a) {
    a.project = b;
    a.capOnDepenses = c;
  });
  this._beteiligtBinding.update(this._entity);
};
ModuleController.prototype.onEvent = function(a, b) {
  switch(b.hasOwnProperty("event") ? b.event : "change") {
    case "focus":
      b.context._onFocus.call(b.context, a, b);
      break;
    case "blur":
      b.context._onLooseFocus.call(b.context);
      break;
    default:
      b.context._onChange.call(b.context, a, b);
  }
};
ModuleController.prototype._onFocus = function(a, b) {
  this._beteiligtBinding.enterEditing();
};
ModuleController.prototype._onLooseFocus = function() {
  this._beteiligtBinding.leaveEditing();
};
ModuleController.prototype._onChange = function(a, b) {
  a.setProperty();
  b.config.sections[b.valueHolder["involved-in"]] = a.getBinding();
  this._beteiligtBinding.rememberFocus(a);
  this.persist.call(this, b.config).then(function() {
    console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue(), b.config);
  });
};
ModuleController.prototype.getTotalPrice = function() {
  return Object.values(this._repository.all()).flatMap(function(a) {
    return Object.values(a && a.sections ? a.sections : {}).filter(function(a) {
      return a instanceof AdBeteiligt;
    });
  }).filter(function(a) {
    return a instanceof AdBeteiligt && !isNaN(parseFloat(a.price));
  }).map(function(a) {
    return a.price;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalProjectCosts = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a && a.sections ? a.sections : {});
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return [isNumber(a.fee) ? a.fee : 0, isNumber(a.charges) ? a.charges : 0];
  }).flat().reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getOverallTotalFee = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a && a.sections ? a.sections : {});
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNumber(a.fee) ? a.fee : 0.0;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalFee = function() {
  return Object.values(this._entity && this._entity.sections ? this._entity.sections : {}).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNumber(a.fee) ? a.fee : 0.0;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalCharges = function() {
  return Object.values(this._entity && this._entity.sections ? this._entity.sections : {}).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNumber(a.charges) ? a.charges : 0.0;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalProject = function() {
  return Object.values(this._entity && this._entity.sections ? this._entity.sections : {}).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return [isNumber(a.fee) ? a.fee : 0, isNumber(a.charges) ? a.charges : 0];
  }).flat().reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getOverallTotalCharges = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a && a.sections ? a.sections : {});
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNumber(a.charges) ? a.charges : 0.0;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getOverallCosts = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a && a.sections ? a.sections : {});
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return [isNumber(a.charges) ? a.charges : 0.0, isNumber(a.fee) ? a.fee : 0.0];
  }).flat().reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getCapOnDepenses = function() {
  var a = this.getProperty("cap_on_depenses");
  return isNaN(a) ? 0.0 : parseFloat(a);
};
ModuleController.prototype.fetchAll = function(a) {
  var b = this;
  return this.trelloApi.cards("id", "closed").filter(function(a) {
    return !a.closed;
  }).each(function(a) {
    return b.trelloApi.get(a.id, "shared", ModuleController.SHARED_NAME).then(function(c) {
      b.insert(b.create(c), a);
    });
  }).then(function() {
    console.log("Fetch complete: " + b.size() + " module config(s)");
    a.call(b);
  });
};
ModuleController.prototype.persist = function(a, b) {
  return this.trelloApi.set(b || "card", "shared", ModuleController.SHARED_NAME, a);
};
ModuleController.prototype.setProperty = function(a, b) {
  this._propertyBag[a] = b;
  this.trelloApi.set("board", "shared", ModuleController.PROPERTY_BAG_NAME, this._propertyBag);
};
ModuleController.prototype.getProperty = function(a, b) {
  return this._propertyBag[a] || b;
};
ModuleController.prototype.readPropertyBag = function() {
  var a = this;
  this.trelloApi.get("board", "shared", ModuleController.PROPERTY_BAG_NAME, {}).then(function(b) {
    a._propertyBag = b;
  });
};
ModuleController.prototype.removePropertyBag = function() {
  return this.trelloApi.remove("board", "shared", ModuleController.PROPERTY_BAG_NAME);
};
ModuleController.prototype.clear = function() {
  Object.keys(this._repository.all()).forEach(function(a) {
    this.trelloApi.remove(a, "shared", ModuleController.SHARED_NAME);
  }, this);
  this._repository.clearAll();
};
ModuleController.prototype.create = function(a, b) {
  return ModuleConfig.create(a, b || this._beteiligtBinding.configuration);
};
$jscomp.global.Object.defineProperties(ModuleController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt";
}}, SHARED_META:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.Meta";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.PropertyBag";
}}});
// Input 16
var ModuleSettingsController = function(a, b, c, d, e, f) {
  this.trello = a;
  this.pluginController = b;
  this.module = c;
  this.document = e;
  this.editable = d;
  this.clientManager = f;
};
ModuleSettingsController.create = function(a, b, c, d, e, f) {
  return new ModuleSettingsController(a, b, c, d, e, f);
};
ModuleSettingsController.prototype.render = function(a) {
  this.clearContent();
  return this.module ? this.module && this.editable ? this.edit() : this.view(a) : this.index(a);
};
ModuleSettingsController.prototype.edit = function() {
  var a = this;
  return this.pluginController.findPluginModuleConfigByModuleId(this.module).then(function(b) {
    var c = b.config.editables.find(function(b) {
      return b.id === a.editable;
    });
    a.document.getElementsByClassName("settings-content").forEach(function(d) {
      a.renderEditableHint(d, c);
      a.renderEditableLabel(b, d, c, c.title || "Beschriftung");
      a.renderEditable(b, c, d);
    });
    a.hideVersion();
    return !0;
  });
};
ModuleSettingsController.prototype.view = function(a) {
  var b = this;
  return this.pluginController.findPluginModuleConfigByModuleId(this.module).then(function(a) {
    b.document.getElementsByClassName("settings-content").forEach(function(c) {
      var d = b.document.createElement("p");
      d.innerHTML = __(a.config.desc);
      c.appendChild(d);
      b.renderFieldGroup(a, "label", c, "Beschriftungen");
      b.renderFieldGroup(a, "text", c, "Eingabefelder");
      b.renderFieldGroup(a, "calc", c, "Berechnete Felder");
      b.renderFieldGroup(a, "select", c, "Auswahllisten");
      b.renderFieldGroup(a, "layout", c, "Layouts");
    });
    b.hideVersion();
    return !0;
  });
};
ModuleSettingsController.prototype.renderEditable = function(a, b, c) {
  switch(b.type) {
    case "select":
      this.renderEditableSelect(a, b, c, "Stichworte");
      break;
    case "calc":
    case "text":
      this.renderEditableText(a, b, c, "Platzhalter");
      break;
    case "layout":
      this.renderEditableLayout(a, b, c, "Layout");
  }
};
ModuleSettingsController.prototype.renderEditableLayout = function(a, b, c, d) {
  var e = this, f = this.document.createElement("span");
  f.innerHTML = e._createLabel(d);
  c.appendChild(f);
  d = Object.keys(a.config.layouts).reduce(function(c, d) {
    var f = a.config.layouts[d], g = e.document.createElement("option");
    g.setAttribute("value", d);
    b.layout === d ? g.setAttribute("selected", "selected") : g.removeAttribute("selected");
    g.innerText = f.label;
    c.addOption(g);
    return c;
  }, new ModuleEditableSelectItem(b.layout));
  d.setOnTextChangeListener(function(d, f) {
    b.layout = f;
    switch(b.layout) {
      case "regular":
      case "blog":
      case "ad":
        e.renderLayoutForm(a, b.layout, c);
        break;
      default:
        console.error("Unknown layout: ", b.layout);
    }
    e.pluginController.setPluginModuleConfig(a).then(function() {
    });
  });
  f = e.document.createElement("div");
  c.appendChild(f);
  f.appendChild(d.render());
  d.fireOnCreate();
};
ModuleSettingsController.prototype.renderLayoutForm = function(a, b, c) {
  var d = this, e = a.config.layouts[b];
  this.createLayoutFormHolder(c).forEach(function(c) {
    c.removeChildren();
    var f = d.document.createElement("p");
    f.innerHTML = __("module.beteiligt.layout-" + b + ".desc");
    c.appendChild(f);
    e.fields.forEach(function(b) {
      d.renderEditableLabel(a, c, b, "Beschriftung");
      d.renderEditable(a, b, c);
      d.hr(c);
    });
  });
};
ModuleSettingsController.prototype.createLayoutFormHolder = function(a) {
  var b = this.document.getElementsByClassName("panta-js-layout-form");
  0 === b.length && (b = [this.document.createElement("div").addClass("panta-js-layout-form")], a.append(b[0]));
  return b;
};
ModuleSettingsController.prototype.renderEditableText = function(a, b, c, d) {
  var e = this, f = this.document.createElement("span");
  f.innerHTML = e._createLabel(d);
  c.appendChild(f);
  d = new ModuleEditableTextItem(b.placeholder, !1, !1);
  c.appendChild(d.setOnTextChangeListener(function(c, d) {
    if (b.placeholder !== d) {
      return b.placeholder = d, e.pluginController.setPluginModuleConfig(a).then(function() {
        console.log("Values updated");
      }), d;
    }
  }).setOnVisibleToggleListener(function() {
    b.visible = !b.visible;
    e.pluginController.setPluginModuleConfig(a).then(function() {
      console.log("Values updated");
    });
    return b.visible;
  }).render());
};
ModuleSettingsController.prototype.renderEditableSelect = function(a, b, c, d) {
  var e = this, f = this.document.createElement("span");
  f.innerHTML = e._createLabel(d);
  c.appendChild(f);
  b.values.map(function(c) {
    c = new ModuleEditableTextItem(c, !0, !1);
    c.setOnDeleteListener(function(c) {
      confirm("Feld l\u00f6schen", "M\u00f6chten Sie das Feld endg\u00fcltig l\u00f6schen?") && (c = b.values.indexOf(c), -1 !== c && b.values.splice(c, 1), e.pluginController.setPluginModuleConfig(a).then(function() {
        console.log("Field deleted");
      }));
    });
    c.setOnTextChangeListener(function(c, d) {
      c = b.values.indexOf(c);
      -1 !== c ? b.values.splice(c, 1, d) : b.values.push(d);
      e.pluginController.setPluginModuleConfig(a).then(function() {
        console.log("Values updated");
      });
      return d;
    });
    c.setOnVisibleToggleListener(function() {
      b.visible = !b.visible;
      e.pluginController.setPluginModuleConfig(a).then(function() {
        console.log("Values updated");
      });
    });
    return c.render();
  }).reduce(function(a, b) {
    a.appendChild(b);
    return a;
  }, c);
  d = new SwitchItem(e.document, "Sortierbar", b.sortable);
  d.setOnActivationListener(function(c, d) {
    b.sortable = d;
    return e.pluginController.setPluginModuleConfig(a).then(function() {
      return d;
    });
  });
  c.appendChild(d.render());
  e.nl(c);
  d = e.document.createElement("div");
  f = e.document.createElement("button");
  f.addClass("panta-btn");
  f.innerHTML = "Neues Stichwort";
  f.setEventListener("click", function(c) {
    b.values.push("");
    e.pluginController.setPluginModuleConfig(a).then(function() {
      console.log("New item added");
    });
  });
  d.appendChild(f);
  c.appendChild(d);
};
ModuleSettingsController.prototype.renderEditableHint = function(a, b) {
  var c = this.document.createElement("p");
  c.innerHTML = __(b.desc);
  a.appendChild(c);
};
ModuleSettingsController.prototype.renderEditableLabel = function(a, b, c, d) {
  var e = this, f = e.document.createElement("span");
  f.innerHTML = e._createLabel(d);
  b.appendChild(f);
  d = new ModuleEditableTextItem(c.label, !1, !0);
  d.setOnTextChangeListener(function(b, d) {
    c.label = d;
    e.pluginController.setPluginModuleConfig(a).then(function() {
      console.log("Label updated");
    });
  });
  d.setOnVisibleToggleListener(function() {
    c.visible = !c.visible;
    e.pluginController.setPluginModuleConfig(a).then(function() {
      console.log("Values updated. Visible: " + c.visible);
    });
  });
  d.setOnReadyListener(function(a) {
    a.getElementsByClassName("panta-js-visible").forEach(function(a) {
      a.getClosestChildByTagName("img").setAttribute("src", c.visible ? "assets/ic_visible.png" : "assets/ic_invisible.png");
    });
  });
  b.appendChild(d.render());
};
ModuleSettingsController.prototype.renderFieldGroup = function(a, b, c, d) {
  var e = this, f = e.document.createElement("span"), h = a.config.editables.filter(function(a) {
    return a.type === b;
  });
  f.addClass(0 < h.length ? "show" : "hidden");
  f.innerHTML = e._createLabel(d);
  c.appendChild(f);
  h.map(function(b) {
    return (new ModuleEditableItem(a, b)).setOnEnterListener(function(a, b) {
      e.trello.popup({title:b.label, url:"settings.html", height:184, args:{module:a.id, editable:b.id}});
    }).setOnActivationListener(function(a, b, c) {
      b.show = c;
      e.pluginController.setPluginModuleConfig(a).then(function(a) {
        console.log("PluginConfiguration updated", a);
      });
    }).setOnColorPickerClick(function(a, b) {
      e.trello.popup({title:"Farbe w\u00e4hlen", url:"color-picker.html", height:184, args:{module:a.id, editable:b.id, color:b.color}});
    }).render();
  }).reduce(function(a, b) {
    a.appendChild(b);
    return a;
  }, c);
  0 < h.length && e.nl(c);
};
ModuleSettingsController.prototype.index = function(a) {
  var b = this;
  a instanceof PluginConfiguration && (this.document.getElementsByClassName("plugin-version").forEach(function(c) {
    c.setEventListener("click", function() {
      b.clientManager.removePluginData();
      b.trello.remove("board", "shared", PluginController.CONFIGURATION_NAME);
    });
    c.innerHTML = a.version;
  }), this.document.getElementsByClassName("plugin-description").forEach(function(b) {
    b.innerHTML = a.description;
    b.setAttribute("data-content", b.innerText);
    b.setAttribute("data-name", "description");
  }), this.document.getElementsByClassName("settings-content").forEach(function(c) {
    var d = b.document.createElement("span");
    d.innerHTML = b._createLabel("Module");
    var e = b.document.createElement("p");
    e.innerHTML = __("module.settings.hint");
    c.appendChild(e);
    c.appendChild(d);
    d = Object.values(a.modules).map(function(c) {
      return (new ModuleSettingsItem(b.document, c, b.trello)).setOnEnterListener(function(a) {
        b.trello.popup({title:a.name, url:"settings.html", height:184, args:{module:a.id}});
      }).setOnActivationListener(function(c, d) {
        c.config.enabled = d;
        b.pluginController.setPluginModuleConfig(c).then(function(d) {
          d instanceof PluginConfiguration && ((d = d.getActiveModules()) && 0 < d.length && (d = d[0], a.card = {icon:"./assets/" + d.config.icon, title:d.name, content:{file:"./module.html"}}), b.pluginController.setPluginModuleConfig(c, a.card).then(function(a) {
            console.log("Main module set as card configuration");
          }));
        });
      }).render();
    }).reduce(function(a, b) {
      a.appendChild(b);
      return a;
    }, document.createElement("div"));
    c.appendChild(d);
  }));
  return Promise.resolve(!0);
};
ModuleSettingsController.prototype._createLabel = function(a) {
  return "<strong class='label'>" + a + "</strong>";
};
ModuleSettingsController.prototype.clearContent = function() {
  this.document.getElementsByClassName("settings-content").forEach(function(a) {
    a.removeChildren();
  });
};
ModuleSettingsController.prototype.nl = function(a) {
  a.appendChild(this.document.createElement("br"));
};
ModuleSettingsController.prototype.hr = function(a) {
  a.appendChild(this.document.createElement("hr"));
};
ModuleSettingsController.prototype.hideVersion = function() {
  this.document.getElementsByClassName("plugin-version-container").forEach(function(a) {
    a.addClass("hidden");
  });
};
// Input 17
var BeteiligtBinding = function(a, b, c, d, e) {
  Binding.call(this, a, b, c, d, e);
  this._activated = this._ad = this._illu = this._video = this._photo = this._text = this._onsite = null;
  this._currentTabIndex = -1;
};
$jscomp.inherits(BeteiligtBinding, Binding);
BeteiligtBinding.prototype.initLayouts = function() {
  var a = this, b = (this._configuration && this._configuration.config && this._configuration.config.editables ? this._configuration.config.editables : []).filter(function(a) {
    return "layout" === a.type;
  });
  this._involvements = Object.values(b).reduce(function(b, d) {
    b[d.id] = a._buildValueHolder(d, a.onLayout);
    return b;
  }, {});
};
BeteiligtBinding.prototype._buildValueHolder = function(a, b) {
  var c = this, d = this._initTab(a);
  return {"involved-in":a.id, data:null, renderer:function(a) {
    b.call(c, this, a);
  }, tab:d, layout:a.layout || d.getAttribute("data-layout"), label:a.label || d.getAttribute("data-label"), binding:c, show:a.show};
};
BeteiligtBinding.prototype.detach = function() {
  var a = this.document.getElementById("panta.module");
  a && (a.removeChildren(), a.removeSelf());
};
BeteiligtBinding.prototype._initTab = function(a) {
  var b = this.document.getElementById("panta.module");
  b || (b = createByTemplate(template_beteiligt, template_beteiligt), this.document.getElementById("panta.content").appendChild(b));
  b = this.document.getElementById(a.container);
  a.show ? b.removeClass("hidden") : b.addClass("hidden");
  return b;
};
BeteiligtBinding.prototype.update = function(a, b) {
  this._activated.activate();
  Object.values(this).filter(function(a) {
    return a instanceof PModuleConfig;
  }).forEach(function(b) {
    b.update(a);
  });
  this._entity = a;
  b && this.updateConfiguration(b);
  return this;
};
BeteiligtBinding.prototype.bind = function() {
  this.initLayouts();
  this.doLabels();
  this._onsite = null !== this._onsite ? this._onsite.update(this._entity) : this._onsite = (new PModuleConfig(this.document, this._involvements.onsite)).bind(this._entity, "onsite").render();
  this._text = null !== this._text ? this._text.update(this._entity) : this._text = (new PModuleConfig(this.document, this._involvements.text)).bind(this._entity, "text").render();
  this._photo = null !== this._photo ? this._photo.update(this._entity) : this._photo = (new PModuleConfig(this.document, this._involvements.photo)).bind(this._entity, "photo").render();
  this._video = null !== this._video ? this._video.update(this._entity) : this._video = (new PModuleConfig(this.document, this._involvements.video)).bind(this._entity, "video").render();
  this._illu = null !== this._illu ? this._illu.update(this._entity) : this._illu = (new PModuleConfig(this.document, this._involvements.illu)).bind(this._entity, "illu").render();
  this._ad = null !== this._ad ? this._ad.update(this._entity) : this._ad = (new PModuleConfig(this.document, this._involvements.ad)).bind(this._entity, "ad").render();
  var a = Object.values(this).filter(function(a) {
    return a instanceof PModuleConfig && a.valueHolder.show;
  });
  a = a.find(function(a) {
    return !a.valueHolder.data.isEmpty();
  }) || a[0];
  a.activate();
  this._activated = a;
  return this;
};
BeteiligtBinding.prototype.onLayoutUpdate = function(a, b) {
  a.setFieldValue("name", b.data, "name");
  a.setFieldValue("social", b.data, "social");
  a.setFieldValue("address", b.data, "address");
  a.setFieldValue("notes", b.data, "notes");
  a.setFieldValue("duedate", b.data, "duedate");
  a.setFieldValue("fee", b.data, "fee");
  a.setFieldValue("charges", b.data, "charges");
  a.setFieldValue("project", b.data, "project");
  a.setFieldValue("capOnDepenses", b.data, "capOnDepenses");
  a.setFieldValue("price", b.data, "price");
  a.setFieldValue("format", b.data, "format");
  a.setFieldValue("placement", b.data, "placement");
  a.setFieldValue("total", b.data, "total");
  a.setFieldValue("date", b.data, "date");
};
BeteiligtBinding.prototype.onLayout = function(a, b) {
  if (a === this._activated) {
    this.onLayoutUpdate(a, b);
  } else {
    switch(b.layout) {
      case "ad":
        this.onAdLayout(a, b);
        break;
      case "blog":
        this.onBlogLayout(a, b);
        break;
      default:
        this.onRegularLayout(a, b);
    }
  }
};
BeteiligtBinding.prototype.onRegularLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = isMobileBrowser() ? template_regular_mobile : template_regular;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  if (b.show) {
    c = {context:this._context, valueHolder:b, config:this._entity};
    var d = this.getLayoutConfigurationFor("regular", "field.name");
    a.setField("name", this.document.newSingleLineInput(b, ".pa.name", "name", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.social");
    a.setField("social", this.document.newSingleLineInput(b, ".pa.social", "social", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.address");
    a.setField("address", this.document.newMultiLineInput(b, ".pa.address", "address", d.label, c, this._action, 2, d.placeholder, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.notes");
    a.setField("notes", this.document.newMultiLineInput(b, ".pa.notes", "notes", d.label, c, this._action, 6, d.placeholder, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.deadline");
    a.setField("duedate", this.document.newSingleLineInput(b, ".pa.duedate", "duedate", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.a");
    a.setField("fee", this.document.newSingleLineInput(b, ".pa.fee", "fee", d.label, c, this._action, d.placeholder, "money", !1, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.b");
    a.setField("charges", this.document.newSingleLineInput(b, ".pa.charges", "charges", d.label, c, this._action, d.placeholder, "money", !1, d.visible));
    d = this.getLayoutConfigurationFor("regular", "field.c");
    a.setField("project", this.document.newSingleLineInput(b, ".pa.project", "project", d.label, c, this._action, d.placeholder, "money", !0, d.visible).addClass("bold"));
  }
};
BeteiligtBinding.prototype.onAdLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_ad;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  if (b.show) {
    c = {context:this._context, valueHolder:b, config:this._entity};
    var d = this.getLayoutConfigurationFor("ad", "field.name");
    a.setField("name", this.document.newSingleLineInput(b, ".pa.name", "name", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.social");
    a.setField("social", this.document.newSingleLineInput(b, ".pa.social", "social", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.address");
    a.setField("address", this.document.newMultiLineInput(b, ".pa.address", "address", d.label, c, this._action, 2, d.placeholder, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.format");
    a.setField("format", this.document.newSingleLineInput(b, ".pa.format", "format", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.placement");
    a.setField("placement", this.document.newSingleLineInput(b, ".pa.placement", "placement", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.sujet");
    a.setField("notes", this.document.newMultiLineInput(b, ".pa.notes", "notes", d.label, c, this._action, 2, d.placeholder, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.price");
    a.setField("price", this.document.newSingleLineInput(b, ".pa.price", "price", d.label, c, this._action, d.placeholder, "money", !1, d.visible));
    d = this.getLayoutConfigurationFor("ad", "field.total");
    a.setField("total", this.document.newSingleLineInput(b, ".pa.total", "total", d.label, c, this._action, d.placeholder, "money", !0, d.visible).addClass("bold"));
  }
};
BeteiligtBinding.prototype.onBlogLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_blog;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  if (b.show) {
    c = {context:this._context, valueHolder:b, config:this._entity};
    var d = this.getLayoutConfigurationFor("blog", "field.link");
    a.setField("address", this.document.newSingleLineInput(b, ".pa.link", "address", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("blog", "field.notes");
    a.setField("notes", this.document.newMultiLineInput(b, ".pa.notes", "notes", d.label, c, this._action, 6, d.placeholder, d.visible));
    d = this.getLayoutConfigurationFor("blog", "field.follower");
    a.setField("social", this.document.newSingleLineInput(b, ".pa.follower", "social", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
    d = this.getLayoutConfigurationFor("blog", "field.date");
    a.setField("date", this.document.newSingleLineInput(b, ".pa.date", "date", d.label, c, this._action, d.placeholder, "text", !1, d.visible));
  }
};
BeteiligtBinding.prototype.doLabels = function() {
  var a = this;
  this.document.getElementsByClassName("js-panta-editable-title").forEach(function(b) {
    var c = a._configuration.config.editables.find(function(a) {
      return "title" === a.id;
    });
    c && (b.removeClasses(["hidden", "show"]), b.addClass(c.show ? "show" : "hidden"), b.getElementsByClassName("js-panta-label").forEach(function(a) {
      a instanceof HTMLElement && (a.innerText = c.label);
    }));
  });
};
BeteiligtBinding.prototype.updateConfiguration = function(a) {
  this._configuration = a;
  this.doLabels();
  this._updateTab(this._onsite, "onsite");
  this._updateTab(this._text, "text");
  this._updateTab(this._photo, "photo");
  this._updateTab(this._video, "video");
  this._updateTab(this._illu, "illu");
  this._updateTab(this._ad, "ad");
};
BeteiligtBinding.prototype._updateTab = function(a, b) {
  b = this.getConfigurationFor(b);
  a.setTabName(b.editable.label);
  b = this.getLayoutConfigurationFor("regular", "field.name");
  a.showHideField("name", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.social");
  a.showHideField("social", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.address");
  a.showHideField("address", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.notes");
  a.showHideField("notes", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.deadline");
  a.showHideField("duedate", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.a");
  a.showHideField("fee", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.b");
  a.showHideField("charges", !b || !b.editable || b.editable.visible);
  b = this.getLayoutConfigurationFor("regular", "field.c");
  a.showHideField("project", !b || !b.editable || b.editable.visible);
};
BeteiligtBinding.prototype._switchContent = function(a, b) {
  var c = this, d = this.document.getElementById("pa.tab.content"), e = this.document.getElementsByTagName("body")[0].scrollTop;
  d.removeChildren();
  this._onsite.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._text.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._photo.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._video.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._illu.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._ad.valueHolder.tab.removeClasses(["selected", "editing"]);
  d.appendChild(b);
  this._activated = a;
  setTimeout(function() {
    c.document.getElementsByTagName("body")[0].scrollTop = e;
  });
};
BeteiligtBinding.prototype.enterEditing = function() {
  this._activated.beginEditing();
};
BeteiligtBinding.prototype.leaveEditing = function() {
  this._activated.endEditing();
};
BeteiligtBinding.prototype.rememberFocus = function(a) {
  this._currentTabIndex = a.getTabIndex();
};
BeteiligtBinding.prototype.getLayoutConfigurationFor = function(a, b) {
  var c = Object.keys(this._configuration.config.layouts).find(function(b) {
    return b === a;
  });
  return this._configuration.config.layouts[c].fields.find(function(a) {
    return a.id === b;
  });
};
$jscomp.global.Object.defineProperties(BeteiligtBinding.prototype, {configuration:{configurable:!0, enumerable:!0, get:function() {
  return this._configuration;
}}});
// Input 18
var ArtikelController = function(a, b, c, d) {
  Controller.call(this, a, c);
  this.document = a.document;
  this.trelloApi = b;
  this._entity = null;
  this._telephone = d;
  this.setVersionInfo();
};
$jscomp.inherits(ArtikelController, Controller);
ArtikelController.getInstance = function(a, b, c) {
  b.hasOwnProperty("articleController") || (b.articleController = new ArtikelController(b, a, DI.getInstance().getArticleRepository(), c));
  return b.articleController;
};
ArtikelController.prototype.setVersionInfo = function() {
  this.trelloApi.set("card", "shared", ArtikelController.SHARED_META, this.getVersionInfo());
};
ArtikelController.prototype.getVersionInfo = function() {
  return {version:ArtikelController.VERSION};
};
ArtikelController.prototype.create = function(a, b) {
  return Artikel.create(a);
};
ArtikelController.prototype.getPropertyByName = function(a, b, c) {
  switch(b) {
    case "visual":
      return a.visual || c;
    case "form":
      return a.form || c;
    case "online":
      return a.tags || c;
    case "season":
      return a.season || c;
    case "region":
      return a.region || c;
    case "place":
      return a.location || c;
    case "field.a":
      return a.topic || c;
    case "field.b":
      return a.from || c;
    case "field.c":
      return a.author || c;
    case "field.d":
      return a.text || c;
    case "field.e":
      return a.pagina || c;
    case "field.f":
      return a.layout || c;
    case "field.g":
      return a.total || c;
    default:
      return a.hasOwnProperty(b), a[b];
  }
};
ArtikelController.prototype.fetchAll = function() {
  var a = this;
  return this.trelloApi.cards("id", "closed").filter(function(a) {
    return !a.closed;
  }).each(function(b) {
    return a.trelloApi.get(b.id, "shared", ArtikelController.SHARED_NAME).then(function(c) {
      a.insert(Artikel.create(c), b);
    });
  }).then(function() {
    console.log("Fetch complete: " + a.size() + " article(s) to process");
  });
};
ArtikelController.prototype.list = function() {
  return this._repository.all();
};
ArtikelController.prototype.size = function() {
  return Object.keys(this.list()).length;
};
ArtikelController.prototype.isManaged = function(a) {
  return null !== a.id;
};
ArtikelController.prototype.manage = function(a) {
  a.id = uuid();
  return a;
};
ArtikelController.prototype.update = function() {
  var a = this;
  this._window.clientManager.isArticleModuleEnabled().then(function(b) {
    if (!b) {
      throw "Module is not enabled";
    }
    a._entity.total = a.getTotalPageCount();
    a._binding.update(a._entity);
    return !0;
  });
};
ArtikelController.prototype.getTotalPageCount = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.layout);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
};
ArtikelController.prototype.render = function(a, b) {
  this._entity = a ? a : Artikel.create();
  this._binding = this._binding ? this._binding.update(this._entity, b) : (new ArtikelBinding(this.document, this._entity, this.onEvent, this, b)).bind();
};
ArtikelController.prototype.onEvent = function(a, b) {
  switch(b.hasOwnProperty("event") ? b.event : "change") {
    case "focus":
      b.context._onFocus.call(b.context, a, b);
      break;
    default:
      b.context._onChange.call(b.context, a, b);
  }
};
ArtikelController.prototype._onFocus = function(a, b) {
};
ArtikelController.prototype._onChange = function(a, b) {
  a.setProperty();
  this.persist.call(this, a.getBinding());
};
ArtikelController.prototype.persist = function(a, b) {
  return this.trelloApi.set(b || "card", "shared", ArtikelController.SHARED_NAME, a);
};
$jscomp.global.Object.defineProperties(ArtikelController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Artikel";
}}, SHARED_META:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Meta";
}}});
// Input 19
var ModulePlanController = function(a, b, c) {
  Controller.call(this, a, new ModulePlanRepository);
  this._trello = b;
  this._telephone = c;
  var d = this;
  this._telephone.onmessage = function(a) {
    a = Object.values(a.data.result || []).map(function(a) {
      return Object.entries(a);
    }).flat().reduce(function(a, b) {
      var c = b[1];
      switch(b[0]) {
        case "fee:current":
          a |= d._entity.fee !== c ? (d._entity.fee = c, 1) : 0;
          break;
        case "fee:overall":
          a |= d._entity.projectFee !== c ? (d._entity.projectFee = c, 1) : 0;
          break;
        case "charge:current":
          a |= d._entity.thirdPartyCharges !== c ? (d._entity.thirdPartyCharges = c, 1) : 0;
          break;
        case "charge:overall":
          a |= d._entity.thirdPartyTotalCosts !== c ? (d._entity.thirdPartyTotalCosts = c, 1) : 0;
          break;
        case "costs:overall":
          a |= d._entity.totalCosts !== c ? (d._entity.totalCosts = c, 1) : 0;
      }
      return a;
    }, !1);
    d._entity.capOnDepenses !== d.getCapOnDepenses() && (d._entity.capOnDepenses = d.getCapOnDepenses());
    a && d._binding.update(d._entity);
  };
  this._binding = null;
  this._propertyBag = {};
  this.readPropertyBag();
};
$jscomp.inherits(ModulePlanController, Controller);
ModulePlanController.getInstance = function(a, b, c) {
  b.hasOwnProperty("planController") || (b.planController = new ModulePlanController(b, a, c));
  return b.planController;
};
ModulePlanController.prototype.render = function(a, b) {
  this._entity = a;
  this._binding = this._binding ? this._binding.update(a, b) : (new ModulePlanBinding(this._window.document, a, this.onEvent, this, b)).bind();
  return Controller.prototype.render.call(this, a);
};
ModulePlanController.prototype.update = function() {
  if (!this._window.clientManager.isPlanModuleEnabled()) {
    throw "Module is not enabled";
  }
  this._telephone.postMessage({get:["fee:current", "fee:overall", "charge:current", "charge:overall", "costs:overall"]});
  this._entity && (this._entity.capOnDepenses = this.getCapOnDepenses());
  this._binding && this._binding.update(this._entity);
  return Controller.prototype.update.call(this);
};
ModulePlanController.prototype.onEvent = function(a, b) {
  switch(b.hasOwnProperty("event") ? b.event : "change") {
    case "change":
      b.context._onChange.call(b.context, a);
  }
};
ModulePlanController.prototype.getProperty = function(a, b) {
  return this._propertyBag[a] || b;
};
ModulePlanController.prototype.setProperty = function(a, b) {
  this._propertyBag[a] = b;
  this._trello.set("board", "shared", ModulePlanController.PROPERTY_BAG_NAME, this._propertyBag);
};
ModulePlanController.prototype.readPropertyBag = function() {
  var a = this;
  this._trello.get("board", "shared", ModulePlanController.PROPERTY_BAG_NAME, {}).then(function(b) {
    a._propertyBag = b;
  });
};
ModulePlanController.prototype.getCapOnDepenses = function() {
  var a = this.getProperty("cap_on_depenses");
  return isNaN(a) ? null : parseFloat(a);
};
ModulePlanController.prototype.getPropertyByName = function(a, b, c) {
  switch(b) {
    case "field.a":
      return a.measures || c;
    case "field.b":
      return a.description || c;
    case "field.c":
      return a.fee || c;
    case "field.d":
      return a.projectFee || c;
    case "field.e":
      return a.thirdPartyCharges || c;
    case "field.f":
      return a.thirdPartyTotalCosts || c;
    case "field.g":
      return a = this.getCapOnDepenses(), isBlank(a) ? c : a;
    case "field.h":
      return a.totalCosts || c;
    case "visual":
      return a.visual || c;
    case "form":
      return a.form || c;
    case "online":
      return a.online || c;
    case "season":
      return a.season || c;
    case "region":
      return a.region || c;
    case "place":
      return a.place || c;
    default:
      return a.hasOwnProperty(b), a[b];
  }
};
ModulePlanController.prototype.persist = function(a, b) {
  return this._trello.set(b || "card", "shared", ModulePlanController.SHARED_NAME, a);
};
ModulePlanController.prototype.remove = function() {
  var a = this;
  return this._trello.remove("board", "shared", ModulePlanController.SHARED_NAME).then(function() {
    return a._trello.remove("board", "shared", ModulePlanController.PROPERTY_BAG_NAME);
  });
};
ModulePlanController.prototype._onChange = function(a) {
  a.setProperty();
  switch(a.getBoundProperty()) {
    case "capOnDepenses":
      this.setProperty("cap_on_depenses", a.getValue());
      break;
    default:
      this.persist.call(this, a.getBinding());
  }
};
ModulePlanController.prototype.clear = function() {
  return Controller.prototype.clear.call(this);
};
ModulePlanController.prototype.create = function(a, b) {
  return Plan.create(a);
};
$jscomp.global.Object.defineProperties(ModulePlanController, {SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan.PropertyBag";
}}});
// Input 20
var ModulePlanRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(ModulePlanRepository, Repository);
// Input 21
var ClientManager = function(a, b, c) {
  this._window = a;
  this._trello = b;
  this._initialized = !1;
  this._options = c || {};
  this._keyBuffer = "";
};
ClientManager.VERSION = function() {
  return 1;
};
ClientManager.assertClientManager = function(a, b, c) {
  ClientManager.getOrCreateClientManager(a, b, c).init();
};
ClientManager.getOrCreateClientManager = function(a, b, c) {
  a.hasOwnProperty("clientManager") || (a.clientManager = new ClientManager(a, b, c), a.addEventListener("beforeunload", function(b) {
    b.target.defaultView instanceof Window && b.target.defaultView.clientManager && (b.target.defaultView.clientManager.onUnload(), a._manager = b.target.defaultView.clientManager, delete a._manager);
  }), a.addEventListener("keypress", function(b) {
    127 === b.keyCode ? a.clientManager.flushKeyBuffer.call(a.clientManager) : 13 === b.keyCode || 10 === b.keyCode ? "remove" === a.clientManager.readKeyBuffer.call(a.clientManager) && (a.clientManager.removePluginData.call(a.clientManager), a.clientManager.flushKeyBuffer.call(a.clientManager)) : a.clientManager.appendKeyBuffer.call(a.clientManager, b.key);
  }));
  return a.clientManager;
};
ClientManager.getInstance = function(a) {
  return a.clientManager;
};
ClientManager.prototype.onUnload = function() {
  delete this._articleController;
  delete this._moduleController;
  delete this._pluginController;
};
ClientManager.prototype.init = function() {
  this._initialized || (this._telephones = {}, this._telephones[ArtikelController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModuleController.SHARED_NAME] = this._createMessageChannel(), this._telephones[PluginController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModulePlanController.SHARED_NAME] = this._createMessageChannel(), this._pluginController = PluginController.getInstance(this._trello, this._window), this._articleController = ArtikelController.getInstance(this._trello, 
  this._window, this._telephones[ArtikelController.SHARED_NAME].port2), this._moduleController = ModuleController.getInstance(this._trello, this._window, this._telephones[ModuleController.SHARED_NAME].port2), this._planController = ModulePlanController.getInstance(this._trello, this._window, this._telephones[ModulePlanController.SHARED_NAME].port2), this._initialized = !0);
  return this;
};
ClientManager.prototype._createMessageChannel = function() {
  var a = this, b = new MessageChannel;
  b.port1.onmessage = function(b) {
    console.debug("Received data from sub-module: " + JSON.stringify(b.data));
    b = b.data;
    Object.values(b.get || []).forEach(function(b) {
      switch(b) {
        case "fee:current":
          a._getCurrentFee();
          break;
        case "fee:overall":
          a._getOverallFee();
          break;
        case "charge:current":
          a._getCurrentCharge();
          break;
        case "charge:overall":
          a._getOverallCharge();
          break;
        case "costs:overall":
          a._getOverallCosts();
      }
    }, a);
    Object.values(b.result || []).forEach(function(a) {
      Object.entries(a).forEach(function(a) {
        this._sendResponse(ModulePlanController.SHARED_NAME, a[0], a[1]);
      }, this);
    }, a);
  };
  return b;
};
ClientManager.prototype._sendResponse = function(a, b, c) {
  var d = {};
  d[b] = c;
  this._telephones[a].port1.postMessage({result:[d]});
};
ClientManager.prototype._getCurrentCharge = function() {
  this._telephones[ModuleController.SHARED_NAME].port1.postMessage({get:["charge:current"]});
};
ClientManager.prototype._getCurrentFee = function() {
  this._telephones[ModuleController.SHARED_NAME].port1.postMessage({get:["fee:current"]});
};
ClientManager.prototype._getOverallCharge = function() {
  this._telephones[ModuleController.SHARED_NAME].port1.postMessage({get:["charge:overall"]});
};
ClientManager.prototype._getOverallFee = function() {
  this._telephones[ModuleController.SHARED_NAME].port1.postMessage({get:["fee:overall"]});
};
ClientManager.prototype._getOverallCosts = function() {
  this._telephones[ModuleController.SHARED_NAME].port1.postMessage({get:["costs:overall"]});
};
ClientManager.prototype.readKeyBuffer = function() {
  return this._keyBuffer;
};
ClientManager.prototype.flushKeyBuffer = function() {
  this._keyBuffer = "";
};
ClientManager.prototype.appendKeyBuffer = function(a) {
  this._keyBuffer += a;
  console.debug("Key Buffer: " + this._keyBuffer);
  256 < this._keyBuffer.length && (this._keyBuffer = "");
};
ClientManager.prototype.isArticleModuleEnabled = function() {
  return this._isModuleEnabled("module.artikel");
};
ClientManager.prototype.isBeteiligtModuleEnabled = function() {
  return this._isModuleEnabled("module.beteiligt");
};
ClientManager.prototype.isPlanModuleEnabled = function() {
  return this._isModuleEnabled("module.plan");
};
ClientManager.prototype.getModuleConfiguration = function(a) {
  return this.getPluginController().getPluginConfiguration().then(function(b) {
    return b.getModule(a, !1);
  });
};
ClientManager.prototype.getController = function(a) {
  switch(a) {
    case "module.artikel":
      return this.getArticleController();
    case "module.beteiligt":
      return this.getModuleController();
    case "module.plan":
      return this.getPlanController();
    default:
      throw "Invalid ID: " + a;
  }
};
ClientManager.prototype._isModuleEnabled = function(a) {
  return this._pluginController.getPluginConfiguration().then(function(b) {
    return b.getActiveModules().find(function(b) {
      return b.id === a;
    });
  });
};
ClientManager.prototype.getArticleController = function() {
  return this._articleController;
};
ClientManager.prototype.getModuleController = function() {
  return this._moduleController;
};
ClientManager.prototype.getPluginController = function() {
  return this._pluginController;
};
ClientManager.prototype.getPlanController = function() {
  return this._planController;
};
ClientManager.prototype.removePluginData = function() {
  var a = this;
  this._pluginController.remove().then(function() {
    return a._moduleController.removePropertyBag();
  }).then(function() {
    return a._planController.remove();
  }).then(function() {
    console.log("All board data cleared");
  });
};
ClientManager.prototype.getArticleModuleSorters = function() {
  var a = this;
  return {name:"module.artikel.sorters", configuration:function() {
    return a.getModuleConfiguration("module.artikel");
  }, sorters:function(b) {
    return b.config.enabled ? b.config.editables.filter(function(a) {
      return a.sortable && "select" === a.type;
    }).map(function(b) {
      return {text:"Artikel: " + b.label + " (Position in Liste)", callback:function(c, e) {
        return a.sortOnSelect(a.getControllerWith(a.getArticleController(), e), e, "asc", function(a) {
          if (a instanceof Artikel) {
            var c = b.id;
            switch(b.id) {
              case "online":
                c = "tags";
                break;
              case "place":
                c = "location";
            }
            return b.values.indexOf(a[c]);
          }
          return Number.MAX_VALUE;
        });
      }};
    }).reduce(function(a, b) {
      a.push(b);
      return a;
    }, [{text:"Artikel: Pagina (1 -> 99)", callback:function(b, d) {
      return a.sortOnNumber(a.getControllerWith(a.getArticleController(), d), d, "asc", function(a) {
        return a.pagina;
      });
    }}]) : [];
  }};
};
ClientManager.prototype.getPlanModuleSorters = function() {
  var a = this;
  return {name:"module.plan.sorters", configuration:function() {
    return a.getModuleConfiguration("module.plan");
  }, sorters:function(b) {
    if (b.config.enabled) {
      return b.config.editables.filter(function(a) {
        return a.sortable && "select" === a.type;
      }).map(function(b) {
        return {text:"Plan: " + b.label + " (Position in Liste)", callback:function(c, e) {
          return a.sortOnSelect(a.getControllerWith(a.getPlanController(), e), e, "asc", function(a) {
            return a instanceof Plan ? b.values.indexOf(a[b.id]) : Number.MAX_VALUE;
          });
        }};
      }).reduce(function(a, b) {
        a.push(b);
        return a;
      }, []);
    }
    console.log("sorters: the module is \u00abPlan\u00bb is not enabled");
    return [];
  }};
};
ClientManager.prototype.getPlanModuleContext = function(a) {
  var b = this;
  return {id:"module.plan", shared:ModulePlanController.SHARED_NAME, card:a, configuration:b.getModuleConfiguration("module.plan"), condition:b.isPlanModuleEnabled(), on:function() {
    var c = [], d = b.getPlanController().getByCard(a);
    b.getPlanController().hasContent(d) && c.push({text:"", icon:"./assets/ic_plan.png"});
    return b.getModuleConfiguration("module.plan").then(function(a) {
      return a.config.editables;
    }).filter(function(a) {
      return null !== b.getPlanController().getMapping(a, d, null) && !0 === a.show;
    }).map(function(a) {
      return {text:a.label + ": " + b.getPlanController().getMapping(a, d, "-"), color:a.color};
    }).reduce(function(a, b) {
      a.push(b);
      return a;
    }, c);
  }};
};
ClientManager.prototype.getBeteiligtModuleContext = function(a) {
  var b = this;
  return {id:"module.beteiligt", shared:ModuleController.SHARED_NAME, card:a, configuration:b.getModuleConfiguration("module.beteiligt"), condition:b.isBeteiligtModuleEnabled(), on:function() {
    var c = [], d = b.getModuleController().getByCard(a);
    d instanceof ModuleConfig && (d = d.getContentCount(), 0 < d && c.push({text:d, icon:"./assets/ic_beteiligt.png"}));
    return c;
  }};
};
ClientManager.prototype.getArticleModuleContext = function(a) {
  var b = this;
  return {id:"module.artikel", shared:ArtikelController.SHARED_NAME, card:a, configuration:b.getModuleConfiguration("module.artikel"), condition:b.isArticleModuleEnabled(), on:function() {
    var c = [], d = b.getArticleController().getByCard(a);
    b.getArticleController().hasContent(d) && c.push({text:"", icon:"./assets/ic_artikel.png"});
    return b.getModuleConfiguration("module.artikel").then(function(a) {
      return a.config.editables;
    }).filter(function(a) {
      return b.getArticleController().getMapping(a, d, null) && !0 === a.show;
    }).map(function(a) {
      return {text:a.label + ": " + b.getArticleController().getMapping(a, d, ""), color:a.color};
    }).reduce(function(a, b) {
      a.push(b);
      return a;
    }, c);
  }};
};
ClientManager.prototype.getControllerWith = function(a, b) {
  for (var c in b.cards) {
    var d = b.cards[c], e = a.getByCard(d);
    e && !d.closed && a.insert(e, d);
  }
  return a;
};
ClientManager.prototype.sortOnNumber = function(a, b, c, d) {
  return {sortedIds:b.cards.sort(function(b, f) {
    b = a.getByCard(b);
    f = a.getByCard(f);
    b = b ? parseFloat(d(b) || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
    f = f ? parseFloat(d(f) || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
    return b > f ? "asc" === c ? 1 : -1 : f > b ? "asc" === c ? -1 : 1 : 0;
  }).map(function(a) {
    return a.id;
  })};
};
ClientManager.prototype.sortOnSelect = function(a, b, c, d) {
  return {sortedIds:b.cards.sort(function(b, f) {
    b = a.getByCard(b);
    f = a.getByCard(f);
    b = b ? d(b) : Number.MAX_VALUE;
    f = f ? d(f) : Number.MAX_VALUE;
    return b > f ? "asc" === c ? 1 : -1 : f > b ? "asc" === c ? -1 : 1 : 0;
  }).map(function(a) {
    return a.id;
  })};
};
// Input 22
var ColorPickerController = function(a, b, c) {
  this._windowManager = a;
  this._pluginController = b;
  this._trello = c;
};
ColorPickerController.prototype.render = function(a) {
  var b = this;
  return this._pluginController.findPluginModuleConfigByModuleId(a.module).then(function(c) {
    var d = [];
    b._windowManager.document.getElementsByClassName("panta-js-color-chooser").forEach(function(e) {
      e.setEventListener("click", function(f) {
        f.preventDefault();
        f.stopPropagation();
        b.updateColor(c, a.editable, b.renderControls(d, e.getAttribute("data-color")).color).then(function() {
        });
      });
      d.push({color:e.getAttribute("data-color"), control:e.getClosestChildByClassName("panta-js-checkbox")});
    });
    var e = b.getEditable(c, a.editable);
    b.renderControls(d, e.color);
  });
};
ColorPickerController.prototype.updateColor = function(a, b, c) {
  this.getEditable(a, b).color = c;
  return this._pluginController.setPluginModuleConfig(a).then(function(a) {
    return a;
  });
};
ColorPickerController.prototype.renderControls = function(a, b) {
  return a.reduce(function(a, d) {
    d.control.checked = d.color === b;
    return d.control.checked ? d : a;
  }, null);
};
ColorPickerController.prototype.getEditable = function(a, b) {
  return a.config.editables.find(function(a) {
    return a.id === b;
  });
};
// Input 23
var PluginRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(PluginRepository, Repository);
$jscomp.global.Object.defineProperties(PluginRepository, {INSTANCE:{configurable:!0, enumerable:!0, get:function() {
  PluginRepository.instance || (PluginRepository.instance = new PluginRepository, PluginRepository.instance.add(new PluginModuleConfig("module.artikel", "Artikel", {sort:1, enabled:!1, icon:"ic_artikel.png", desc:"module.artikel.desc", editables:[{id:"visual", desc:"module.artikel.editable.desc", type:"select", label:"1.Liste", color:"blue", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"form", desc:"module.artikel.editable.desc", 
  type:"select", label:"2.Liste", color:"green", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"online", desc:"module.artikel.editable.desc", type:"select", label:"3.Liste", color:"yellow", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"season", desc:"module.artikel.editable.desc", type:"select", label:"4.Liste", color:"sky", show:!1, sortable:!1, visible:!0, values:["1.Begriff", 
  "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"region", desc:"module.artikel.editable.desc", type:"select", label:"5.Liste", color:"lime", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"place", desc:"module.artikel.editable.desc", type:"select", label:"6.Liste", color:"orange", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"field.a", desc:"module.artikel.field-a.desc", 
  type:"text", label:"Thema", placeholder:"Lauftext", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.artikel.field-b.desc", type:"text", label:"Input von", placeholder:"Name", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.c", desc:"module.artikel.field-c.desc", type:"text", label:"Textautor*in", placeholder:"Name", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.d", desc:"module.artikel.field-d.desc", type:"text", label:"Textbox", placeholder:"Lauftext", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"title", desc:"module.artikel.label.desc", type:"label", placeholder:"", label:"Artikel", visible:!0, title:"Modul-Titel"}, {id:"field.e", desc:"module.artikel.field-e.desc", type:"text", label:"Pagina", placeholder:"Zahl", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.f", desc:"module.artikel.field-f.desc", type:"text", label:"Seiten Layout", placeholder:"Zahl", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.g", 
  desc:"module.artikel.field-g.desc", type:"calc", label:"Seiten Total", placeholder:"Summe", show:!1, sortable:!1, visible:!0, color:"shades"}]}), {id:1}), PluginRepository.instance.add(new PluginModuleConfig("module.beteiligt", "Beteiligt", {sort:3, enabled:!1, icon:"ic_beteiligt.png", desc:"module.beteiligt.desc", editables:[{id:"title", desc:"module.beteiligt.label.desc", type:"label", placeholder:"", label:"Beteiligt", title:"Modul-Titel"}, {id:"onsite", desc:"module.beteiligt.layout.onsite", 
  type:"layout", label:"1.Reiter", container:"pa.involved.onsite", layout:"regular", show:!0, title:"Reiter-Titel"}, {id:"text", desc:"module.beteiligt.layout.text", type:"layout", label:"2.Reiter", container:"pa.involved.text", layout:"regular", show:!0}, {id:"photo", desc:"module.beteiligt.layout.photo", type:"layout", label:"3.Reiter", container:"pa.involved.photo", layout:"regular", show:!0}, {id:"video", desc:"module.beteiligt.layout.video", type:"layout", label:"4.Reiter", container:"pa.involved.video", 
  layout:"regular", show:!0}, {id:"illu", desc:"module.beteiligt.layout.illu", type:"layout", label:"5.Reiter", container:"pa.involved.illu", layout:"regular", show:!0}, {id:"ad", desc:"module.beteiligt.layout.ad", type:"layout", label:"6.Reiter", container:"pa.involved.ad", layout:"regular", show:!0}], layouts:{regular:{desc:"module.beteiligt.regular.desc", label:"Kontakt", fields:[{id:"field.name", desc:"module.beteiligt.field-name.desc", type:"text", label:"Name", placeholder:"eintippen\u2026", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.social", desc:"module.beteiligt.field-social.desc", type:"text", label:"Telefon.Mail.Webseite", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.address", desc:"module.beteiligt.field-address.desc", type:"text", label:"Adresse", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.notes", desc:"module.beteiligt.field-notes.desc", type:"text", label:"Notizen", 
  placeholder:"formulieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.deadline", desc:"module.beteiligt.field-deadline.desc", type:"text", label:"Deadline", placeholder:"bestimmen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.a", desc:"module.beteiligt.field-a.desc", type:"text", label:"Honorar Massnahme", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.beteiligt.field-b.desc", type:"text", 
  label:"Spesen Massnahme", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.c", desc:"module.beteiligt.field-c.desc", type:"calc", label:"Total Beteiligte", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}, ad:{desc:"module.beteiligt.special.desc", label:"Inserat", fields:[{id:"field.sujet", desc:"module.beteiligt.field-sujet.desc", type:"text", label:"Kunde.Sujet", placeholder:"Name.Stichwort\u2026", show:!1, sortable:!1, visible:!0, 
  color:"shades"}, {id:"field.format", desc:"module.beteiligt.field-format.desc", type:"text", label:"Format", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.placement", desc:"module.beteiligt.field-placement.desc", type:"text", label:"Platzierung", placeholder:"vormerken\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.price", desc:"module.beteiligt.field-price.desc", type:"text", label:"Preis CHF", placeholder:"bestimmen\u2026", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.total", desc:"module.beteiligt.field-total.desc", type:"text", label:"Total", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.name", desc:"module.beteiligt.field-name.desc", type:"text", label:"Kontakt", placeholder:"eintippen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.social", desc:"module.beteiligt.field-social.desc", type:"text", label:"Telefon.Mail.Webseite", placeholder:"notieren\u2026", 
  show:!1, sortable:!1, color:"shades"}, {id:"field.address", desc:"module.beteiligt.field-address.desc", type:"text", label:"Adresse", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}, blog:{desc:"module.beteiligt.blog.desc", label:"Blog", fields:[{id:"field.link", desc:"module.beteiligt.field-link.desc", type:"text", label:"Link", placeholder:"hinterlegen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.notes", desc:"module.beteiligt.field-notes.desc", 
  type:"text", label:"Notiz", placeholder:"hinterlegen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.follower", desc:"module.beteiligt.field-follower.desc", type:"text", label:"Follower.Fans.Abos", placeholder:"eintippen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.date", desc:"module.beteiligt.field-date.desc", type:"text", label:"Stand.Datum", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}}}), {id:2}), PluginRepository.instance.add(new PluginModuleConfig("module.plan", 
  "Plan", {sort:2, enabled:!1, icon:"ic_plan.png", desc:"module.plan.desc", editables:[{id:"visual", desc:"module.plan.editable.desc", type:"select", label:"1.Liste", color:"blue", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"form", desc:"module.plan.editable.desc", type:"select", label:"2.Liste", color:"green", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff"]}, {id:"online", desc:"module.plan.editable.desc", 
  type:"select", label:"3.Liste", color:"yellow", show:!1, sortable:!1, visible:!0, values:"1.Begriff 2.Begriff 3.Begriff 4.Begriff 5.Begriff 6.Begriff 7.Begriff".split(" ")}, {id:"season", desc:"module.plan.editable.desc", type:"select", label:"4.Liste", color:"sky", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff"]}, {id:"region", desc:"module.plan.editable.desc", type:"select", label:"5.Liste", color:"lime", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff"]}, 
  {id:"place", desc:"module.plan.editable.desc", type:"select", label:"6.Liste", color:"orange", show:!1, sortable:!1, visible:!0, values:"1.Begriff 2.Begriff 3.Begriff 4.Begriff 5.Begriff 6.Begriff 7.Begriff".split(" ")}, {id:"field.a", desc:"module.plan.field-a.desc", type:"text", label:"Massnahmen", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.plan.field-b.desc", type:"text", label:"Beschreibung", placeholder:"notieren\u2026", show:!1, 
  sortable:!1, visible:!0, color:"shades"}, {id:"title", desc:"module.plan.label.desc", type:"label", placeholder:"", label:"Plan", title:"Modul-Titel", visible:!0}, {id:"field.c", desc:"module.plan.field-c.desc", type:"calc", label:"Total Honorar Beteiligte", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.d", desc:"module.plan.field-d.desc", type:"calc", label:"Total Honorar Projekt", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.e", 
  desc:"module.plan.field-e.desc", type:"calc", label:"Total Spesen Beteiligte", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.f", desc:"module.plan.field-f.desc", type:"calc", label:"Total Spesen Projekt", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.g", desc:"module.plan.field-g.desc", type:"text", label:"Kostendach Projekt\u2026", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.h", desc:"module.plan.field-h.desc", 
  type:"calc", label:"Total Projekt", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}), {id:3}));
  return PluginRepository.instance;
}}});
PluginRepository.instance = null;
// Input 24
var BeteiligtRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(BeteiligtRepository, Repository);
BeteiligtRepository.prototype.isNew = function(a) {
  var b = this;
  return null === Object.keys(this._repository).find(function(c, d) {
    return b._repository[c].id === a.id;
  });
};
// Input 25
var ArtikelRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(ArtikelRepository, Repository);
ArtikelRepository.prototype.add = function(a, b) {
  Repository.prototype.add.call(this, a, b);
};
ArtikelRepository.prototype.isNew = function(a) {
  var b = this;
  return null === Object.keys(this._repository).find(function(c, d) {
    return b._repository[c].id === a.id;
  });
};
// Input 26
var ModulePlanBinding = function(a, b, c, d, e) {
  Binding.call(this, a, b, c, d, e);
};
$jscomp.inherits(ModulePlanBinding, Binding);
ModulePlanBinding.prototype.update = function(a, b) {
  this._measures.update(a);
  this._description.update(a);
  this._fee.update(a);
  this._charges.update(a);
  this._thirdPartyCharges.update(a);
  this._thirdPartyTotalCosts.update(a);
  this._capOnDepenses.update(a);
  this._totalCosts.update(a);
  this._visual.update(a);
  this._form.update(a);
  this._online.update(a);
  this._region.update(a);
  this._season.update(a);
  this._place.update(a);
  this._entity = a;
  b && this.updateConfiguration(b);
  return this;
};
ModulePlanBinding.prototype.bind = function() {
  this.onLayout({data:this._entity});
  return this;
};
ModulePlanBinding.prototype.onLayout = function(a) {
  var b = createByTemplate(template_plan, template_plan_mobile);
  this._switchContent(b);
  b = {context:this._context, valueHolder:a, entity:this._entity};
  var c = this.getConfigurationFor("field.a");
  this._measures = this.document.newMultiLineInput(a, ".pa.plan.measures", "measures", c.label, b, this._action, 2, c.editable.placeholder, c.editable.visible).addClass("multiline");
  c = this.getConfigurationFor("field.b");
  this._description = this.document.newMultiLineInput(a, ".pa.plan.description", "description", c.label, b, this._action, 3, c.editable.placeholder, c.editable.visible).addClass("rows-2");
  c = this.getConfigurationFor("field.c");
  this._fee = this.document.newSingleLineInput(a, ".pa.plan.fee", "fee", c.label, b, this._action, c.editable.placeholder, "money", !0, c.editable.visible).addClass("multiline", !0);
  c = this.getConfigurationFor("field.d");
  this._charges = this.document.newSingleLineInput(a, ".pa.plan.projectFee", "projectFee", c.label, b, this._action, c.editable.placeholder, "money", !0, c.editable.visible).addClass("multiline", !0).addClass("bold");
  c = this.getConfigurationFor("field.e");
  this._thirdPartyCharges = this.document.newSingleLineInput(a, ".pa.plan.thirdPartyCharges", "thirdPartyCharges", c.label, b, this._action, c.editable.placeholder, "money", !0, c.editable.visible).addClass("multiline", !0);
  c = this.getConfigurationFor("field.f");
  this._thirdPartyTotalCosts = this.document.newSingleLineInput(a, ".pa.plan.thirdPartyTotalCosts", "thirdPartyTotalCosts", c.label, b, this._action, c.editable.placeholder, "money", !0, c.editable.visible).addClass("bold").addClass("multiline", !0);
  c = this.getConfigurationFor("field.g");
  this._capOnDepenses = this.document.newSingleLineInput(a, ".pa.plan.capOnDepenses", "capOnDepenses", c.label, b, this._action, c.editable.placeholder, "money", !1, c.editable.visible).addClass("multiline", !0);
  c = this.getConfigurationFor("field.h");
  this._totalCosts = this.document.newSingleLineInput(a, ".pa.plan.totalCosts", "totalCosts", c.label, b, this._action, c.editable.placeholder, "money", !0, c.editable.visible).addClass("bold").addClass("multiline", !0).addConditionalFormatting(function(a) {
    return {name:"rule-costs-exceeded", active:a.capOnDepenses < a.totalCosts};
  }, !1);
  this._visual = this.doLayout("pa.plan.visual", "visual", a, b);
  this._form = this.doLayout("pa.plan.form", "form", a, b);
  this._online = this.doLayout("pa.plan.online", "online", a, b);
  this._region = this.doLayout("pa.plan.region", "region", a, b);
  this._season = this.doLayout("pa.plan.season", "season", a, b);
  this._place = this.doLayout("pa.plan.place", "place", a, b);
};
ModulePlanBinding.prototype.detach = function() {
  var a = this.document.getElementById("pa.plan.content");
  a && (a.removeChildren(), a.removeSelf());
};
ModulePlanBinding.prototype.doLayout = function(a, b, c, d, e) {
  e = this.getConfigurationFor(e || b);
  return this.document.newSingleSelect(c, a, b, e.label, d, this._action, "Liste-Tag", newOption("-1", "\u2026"), e.options, e.editable.visible);
};
ModulePlanBinding.prototype.updateConfiguration = function(a) {
  this._configuration = a;
  this.updateField(this._measures, "field.a");
  this.updateField(this._description, "field.b");
  this.updateField(this._fee, "field.c");
  this.updateField(this._charges, "field.d");
  this.updateField(this._thirdPartyCharges, "field.e");
  this.updateField(this._thirdPartyTotalCosts, "field.f");
  this.updateField(this._capOnDepenses, "field.g");
  this.updateField(this._totalCosts, "field.h");
  this.updateField(this._online, "online");
  this.updateField(this._visual, "visual");
  this.updateField(this._region, "region");
  this.updateField(this._season, "season");
  this.updateField(this._form, "form");
  this.updateField(this._place, "place");
};
ModulePlanBinding.prototype._switchContent = function(a) {
  var b = this._initContent();
  b.removeChildren();
  b.appendChild(a);
};
ModulePlanBinding.prototype._initContent = function() {
  var a = this.document.getElementById("pa.plan.content") || this.document.createElement("span");
  if (!a.getAttribute("id")) {
    var b = this.document.createElement("form");
    b.setAttribute("autocomplete", "off");
    b.setAttribute("id", "panta.form.plan");
    a.setAttribute("id", "pa.plan.content");
    b.appendChild(a);
    this.document.getElementById("panta.content").appendChild(b);
  }
  return a;
};
// Input 27
var ArtikelBinding = function(a, b, c, d, e) {
  Binding.call(this, a, b, c, d, e);
};
$jscomp.inherits(ArtikelBinding, Binding);
ArtikelBinding.getRegionMapping = function(a) {
  switch(a) {
    case "nord":
    case "north":
      return "Nord";
    case "south":
      return "S\u00fcd";
    default:
      return a;
  }
};
ArtikelBinding.getTagMapping = function(a) {
  return a;
};
ArtikelBinding.prototype.update = function(a, b) {
  this._topic.update(a);
  this._from.update(a);
  this._author.update(a);
  this._text.update(a);
  this._pagina.update(a);
  this._layout.update(a);
  this._total.update(a);
  this._tags.update(a);
  this._visual.update(a);
  this._region.update(a);
  this._season.update(a);
  this._form.update(a);
  this._location.update(a);
  b && this.updateConfiguration(b);
  return this;
};
ArtikelBinding.prototype.bind = function() {
  this.onLayout({data:this._entity}, {context:this._context, artikel:this._entity});
  return this;
};
ArtikelBinding.prototype.onLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_artikel;
  c = c.cloneNode(!0);
  this._switchContent(c);
  c = this.getConfigurationFor("field.a");
  this._topic = this.document.newMultiLineInput(a, "pa.topic", "topic", c.label, b, this._action, 2, c.editable.placeholder, c.editable.visible);
  var d = this.getConfigurationFor("field.f");
  this._layout = this.document.newSingleLineInput(a, "pa.layout", "layout", d.label, b, this._action, d.editable.placeholder, "number", !1, c.editable.visible);
  c = this.getConfigurationFor("field.b");
  this._from = this.document.newSingleLineInput(a, "pa.input-from", "from", c.label, b, this._action, c.editable.placeholder, "text", !1, c.editable.visible);
  c = this.getConfigurationFor("field.c");
  this._author = this.document.newSingleLineInput(a, "pa.author", "author", c.label, b, this._action, c.editable.placeholder, "text", !1, c.editable.visible);
  c = this.getConfigurationFor("field.g");
  this._total = this.document.newSingleLineInput(a, "pa.total", "total", c.label, b, this._action, c.editable.placeholder, "number", !0, c.editable.visible).addClass("bold");
  c = this.getConfigurationFor("field.d");
  this._text = this.document.newMultiLineInput(a, "pa.text", "text", c.label, b, this._action, 2, c.editable.placeholder, c.editable.visible);
  c = this.getConfigurationFor("field.e");
  this._pagina = this.document.newSingleLineInput(a, "pa.pagina", "pagina", c.label, b, this._action, c.editable.placeholder, "number", !1, c.editable.visible).addClass("pagina").addClass("bold");
  this._tags = this.doLayout("pa.tags", "tags", a, b, "online");
  this._visual = this.doLayout("pa.visual", "visual", a, b);
  this._region = this.doLayout("pa.region", "region", a, b);
  this._season = this.doLayout("pa.season", "season", a, b);
  this._form = this.doLayout("pa.form", "form", a, b);
  this._location = this.doLayout("pa.location", "location", a, b, "place");
};
ArtikelBinding.prototype.detach = function() {
  var a = this.document.getElementById("pa.artikel.content");
  a && (a.removeChildren(), a.removeSelf());
};
ArtikelBinding.prototype._switchContent = function(a) {
  var b = this._initLayout();
  b.removeChildren();
  b.appendChild(a);
};
ArtikelBinding.prototype._initLayout = function() {
  var a = this.document.getElementById("pa.artikel.content") || this.document.createElement("span");
  if (!a.getAttribute("id")) {
    var b = this.document.createElement("form");
    b.setAttribute("autocomplete", "off");
    b.setAttribute("id", "panta.form");
    a.setAttribute("id", "pa.artikel.content");
    b.appendChild(a);
    this.document.getElementById("panta.content").appendChild(b);
  }
  return a;
};
ArtikelBinding.prototype.doLayout = function(a, b, c, d, e) {
  e = this.getConfigurationFor(e || b);
  return this.document.newSingleSelect(c, a, b, e.label, d, this._action, "Liste-Tag", newOption("-1", "\u2026"), e.options, e.editable.visible);
};
ArtikelBinding.prototype.updateConfiguration = function(a) {
  this._configuration = a;
  this.updateField(this._topic, "field.a");
  this.updateField(this._from, "field.b");
  this.updateField(this._author, "field.c");
  this.updateField(this._text, "field.d");
  this.updateField(this._pagina, "field.e");
  this.updateField(this._layout, "field.f");
  this.updateField(this._total, "field.g");
  this.updateField(this._tags, "online");
  this.updateField(this._visual, "visual");
  this.updateField(this._region, "region");
  this.updateField(this._season, "season");
  this.updateField(this._form, "form");
  this.updateField(this._location, "place");
};
// Input 28
var Artikel = function(a, b, c, d, e, f, h, g, k, l, m, q, n, p) {
  this._id = a || uuid();
  this._topic = b;
  this._pagina = c;
  this._from = d;
  this._layout = e;
  this._total = f;
  this._tags = h;
  this._form = n;
  this._visual = g;
  this._region = k;
  this._season = l;
  this._location = p;
  this._author = m;
  this._text = q;
  this._involved = {};
  this._version = Artikel.VERSION;
  this.putInvolved("onsite", new OtherBeteiligt);
  this.putInvolved("text", new OtherBeteiligt);
  this.putInvolved("photo", new OtherBeteiligt);
  this.putInvolved("video", new OtherBeteiligt);
  this.putInvolved("illu", new OtherBeteiligt);
  this.putInvolved("ad", new AdBeteiligt);
};
Artikel.create = function(a) {
  return this._create(a);
};
Artikel._create = function(a) {
  if (a) {
    var b = JsonSerialization.getProperty(a, "region");
    "nord" === b && (b = "north");
    b = new Artikel(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "topic"), JsonSerialization.getProperty(a, "pagina"), JsonSerialization.getProperty(a, "from"), JsonSerialization.getProperty(a, "layout"), JsonSerialization.getProperty(a, "total"), JsonSerialization.getProperty(a, "tags"), JsonSerialization.getProperty(a, "visual"), b, JsonSerialization.getProperty(a, "season"), JsonSerialization.getProperty(a, "author"), JsonSerialization.getProperty(a, "text"), JsonSerialization.getProperty(a, 
    "form"), JsonSerialization.getProperty(a, "location"));
    b.involved = JsonSerialization.getProperty(a, "involved");
    b.version = JsonSerialization.getProperty(a, "version");
    return b;
  }
  return new Artikel;
};
Artikel.prototype.isEmpty = function() {
  return isBlank(this.topic) && isBlank(this.pagina) && isBlank(this.from) && isBlank(this.layout) && isBlank(this.tags) && isBlank(this.visual) && isBlank(this.region) && isBlank(this.season) && isBlank(this.location) && isBlank(this.author) && isBlank(this.text);
};
Artikel.prototype.getInvolvedFor = function(a) {
  return this._involved[a];
};
Artikel.prototype.putInvolved = function(a, b) {
  this._involved[a] = b;
};
Artikel.prototype.getInvolvedCount = function() {
  var a = this, b = 0;
  Object.keys(this._involved).forEach(function(c) {
    a.getInvolvedFor(c).isEmpty() || b++;
  });
  return b;
};
Artikel.prototype.clearInvolved = function() {
  this._involved = {};
};
$jscomp.global.Object.defineProperties(Artikel.prototype, {id:{configurable:!0, enumerable:!0, get:function() {
  return this._id;
}, set:function(a) {
  this._id = a;
}}, involved:{configurable:!0, enumerable:!0, get:function() {
  return this._involved;
}, set:function(a) {
  for (var b in a) {
    if (a.hasOwnProperty(b)) {
      switch(b) {
        case "onsite":
        case "text":
        case "photo":
        case "video":
        case "illu":
          this.putInvolved(b, OtherBeteiligt.create(a[b]));
          break;
        case "ad":
          this.putInvolved(b, AdBeteiligt.create(a[b]));
          break;
        default:
          console.log("Unknown involved part: " + b);
      }
    }
  }
}}, from:{configurable:!0, enumerable:!0, get:function() {
  return this._from;
}, set:function(a) {
  this._from = a;
}}, location:{configurable:!0, enumerable:!0, get:function() {
  return this._location;
}, set:function(a) {
  this._location = a;
}}, topic:{configurable:!0, enumerable:!0, get:function() {
  return this._topic;
}, set:function(a) {
  this._topic = a;
}}, pagina:{configurable:!0, enumerable:!0, get:function() {
  return this._pagina;
}, set:function(a) {
  this._pagina = a;
}}, layout:{configurable:!0, enumerable:!0, get:function() {
  return this._layout;
}, set:function(a) {
  this._layout = a;
}}, total:{configurable:!0, enumerable:!0, get:function() {
  return this._total;
}, set:function(a) {
  this._total = a;
}}, tags:{configurable:!0, enumerable:!0, get:function() {
  return this._tags;
}, set:function(a) {
  this._tags = a;
}}, form:{configurable:!0, enumerable:!0, get:function() {
  return this._form;
}, set:function(a) {
  this._form = a;
}}, visual:{configurable:!0, enumerable:!0, get:function() {
  return this._visual;
}, set:function(a) {
  this._visual = a;
}}, region:{configurable:!0, enumerable:!0, get:function() {
  return this._region;
}, set:function(a) {
  this._region = a;
}}, season:{configurable:!0, enumerable:!0, get:function() {
  return this._season;
}, set:function(a) {
  this._season = a;
}}, author:{configurable:!0, enumerable:!0, get:function() {
  return this._author;
}, set:function(a) {
  this._author = a;
}}, text:{configurable:!0, enumerable:!0, get:function() {
  return this._text;
}, set:function(a) {
  this._text = a;
}}, version:{configurable:!0, enumerable:!0, get:function() {
  return this._version;
}, set:function(a) {
  this._version = a;
}}});
$jscomp.global.Object.defineProperties(Artikel, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 3;
}}});
// Input 29
var PluginCardConfig = function(a, b, c) {
  this._title = a;
  this._icon = b;
  this._content = c;
};
$jscomp.global.Object.defineProperties(PluginCardConfig.prototype, {title:{configurable:!0, enumerable:!0, get:function() {
  return this._title;
}, set:function(a) {
  this._title = a;
}}, icon:{configurable:!0, enumerable:!0, get:function() {
  return this._icon;
}, set:function(a) {
  this._icon = a;
}}, content:{configurable:!0, enumerable:!0, get:function() {
  return this._content;
}, set:function(a) {
  this._content = a;
}}});
// Input 30
var PluginModuleConfig = function(a, b, c) {
  this._id = a;
  this._name = b;
  this._config = c;
};
PluginModuleConfig.create = function(a) {
  return new PluginModuleConfig(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "config"));
};
$jscomp.global.Object.defineProperties(PluginModuleConfig.prototype, {config:{configurable:!0, enumerable:!0, get:function() {
  return this._config;
}, set:function(a) {
  this._config = a;
}}, name:{configurable:!0, enumerable:!0, get:function() {
  return this._name;
}, set:function(a) {
  this._name = a;
}}, id:{configurable:!0, enumerable:!0, get:function() {
  return this._id;
}, set:function(a) {
  this._id = a;
}}});
// Input 31
var ModuleConfig = function(a, b) {
  this._id = a || uuid();
  this._sections = b;
  this._version = CommonBeteiligt.VERSION;
};
ModuleConfig.create = function(a, b) {
  var c = JsonSerialization.getProperty(a, "sections") || {};
  a = JsonSerialization.getProperty(a, "id");
  return new ModuleConfig(a, {onsite:CommonBeteiligt.create(c.onsite, ModuleConfig._getSectionFactory(b, "onsite")), text:CommonBeteiligt.create(c.text, ModuleConfig._getSectionFactory(b, "text")), photo:CommonBeteiligt.create(c.photo, ModuleConfig._getSectionFactory(b, "photo")), video:CommonBeteiligt.create(c.video, ModuleConfig._getSectionFactory(b, "video")), illu:CommonBeteiligt.create(c.illu, ModuleConfig._getSectionFactory(b, "illu")), ad:CommonBeteiligt.create(c.ad, ModuleConfig._getSectionFactory(b, 
  "ad"))});
};
ModuleConfig._getSectionFactory = function(a, b) {
  if (!a || !a.config || !a.config.editables) {
    return function(a) {
      return OtherBeteiligt.create(a);
    };
  }
  a = a.config.editables.filter(function(a) {
    return a.id === b;
  })[0];
  return "regular" === a.layout ? function(a) {
    return OtherBeteiligt.create(a);
  } : "blog" === a.layout ? function(a) {
    return BlogBeteiligt.create(a);
  } : function(a) {
    return AdBeteiligt.create(a);
  };
};
ModuleConfig.prototype.getContentCount = function() {
  return Object.values(this.sections).filter(function(a) {
    return !a.isEmpty();
  }).length;
};
$jscomp.global.Object.defineProperties(ModuleConfig.prototype, {sections:{configurable:!0, enumerable:!0, get:function() {
  return this._sections;
}, set:function(a) {
  this._sections = a;
}}});
$jscomp.global.Object.defineProperties(ModuleConfig, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 2;
}}});
var CommonBeteiligt = function(a, b, c, d, e) {
  this._id = a || uuid();
  this._name = b;
  this._social = c;
  this._address = d;
  this._notes = e;
  this._version = CommonBeteiligt.VERSION;
  this._type = null;
  this._id = a;
};
CommonBeteiligt.create = function(a, b) {
  return b ? b.call(this, a) : null;
};
CommonBeteiligt.prototype.isEmpty = function() {
  return isBlank(this.name) && isBlank(this.social) && isBlank(this.address) && isBlank(this.notes);
};
$jscomp.global.Object.defineProperties(CommonBeteiligt.prototype, {id:{configurable:!0, enumerable:!0, get:function() {
  return this._id;
}}, name:{configurable:!0, enumerable:!0, get:function() {
  return this._name;
}, set:function(a) {
  this._name = a;
}}, social:{configurable:!0, enumerable:!0, get:function() {
  return this._social;
}, set:function(a) {
  this._social = a;
}}, address:{configurable:!0, enumerable:!0, get:function() {
  return this._address;
}, set:function(a) {
  this._address = a;
}}, notes:{configurable:!0, enumerable:!0, get:function() {
  return this._notes;
}, set:function(a) {
  this._notes = a;
}}, type:{configurable:!0, enumerable:!0, get:function() {
  return this._type;
}, set:function(a) {
  this._type = a;
}}, version:{configurable:!0, enumerable:!0, get:function() {
  return this._version;
}, set:function(a) {
  this._version = a;
}}});
$jscomp.global.Object.defineProperties(CommonBeteiligt, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 2;
}}});
var OtherBeteiligt = function(a, b, c, d, e, f, h, g, k, l) {
  CommonBeteiligt.call(this, a, b, c, d, e);
  this._duedate = f;
  this._fee = h;
  this._charges = g;
  this._project = k;
  this._capOnDepenses = l;
  this.type = "other";
};
$jscomp.inherits(OtherBeteiligt, CommonBeteiligt);
OtherBeteiligt.create = function(a) {
  return this._create(a);
};
OtherBeteiligt._create = function(a) {
  return a ? new OtherBeteiligt(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "duedate"), JsonSerialization.getProperty(a, "fee"), JsonSerialization.getProperty(a, "charges"), JsonSerialization.getProperty(a, "project"), JsonSerialization.getProperty(a, "capOnDepenses")) : new OtherBeteiligt;
};
OtherBeteiligt.prototype.isEmpty = function() {
  return CommonBeteiligt.prototype.isEmpty.call(this) && !this.duedate && !this.fee && !this.charges;
};
$jscomp.global.Object.defineProperties(OtherBeteiligt.prototype, {duedate:{configurable:!0, enumerable:!0, get:function() {
  return this._duedate;
}, set:function(a) {
  this._duedate = a;
}}, fee:{configurable:!0, enumerable:!0, get:function() {
  return this._fee;
}, set:function(a) {
  this._fee = a;
}}, charges:{configurable:!0, enumerable:!0, get:function() {
  return this._charges;
}, set:function(a) {
  this._charges = a;
}}, project:{configurable:!0, enumerable:!0, get:function() {
  return this._project;
}, set:function(a) {
  this._project = a;
}}, capOnDepenses:{configurable:!0, enumerable:!0, get:function() {
  return this._capOnDepenses;
}, set:function(a) {
  this._capOnDepenses = a;
}}});
var AdBeteiligt = function(a, b, c, d, e, f, h, g) {
  CommonBeteiligt.call(this, a, b, c, d, e);
  this._format = f;
  this._placement = h;
  this._price = g;
  this._total = 0;
  this.type = "ad";
};
$jscomp.inherits(AdBeteiligt, CommonBeteiligt);
AdBeteiligt.create = function(a) {
  return this._create(a);
};
AdBeteiligt._create = function(a) {
  return a ? new AdBeteiligt(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "format"), JsonSerialization.getProperty(a, "placement"), JsonSerialization.getProperty(a, "price")) : new AdBeteiligt;
};
AdBeteiligt.prototype.isEmpty = function() {
  return CommonBeteiligt.prototype.isEmpty.call(this) && !this.format && !this.placement && !this.price;
};
$jscomp.global.Object.defineProperties(AdBeteiligt.prototype, {format:{configurable:!0, enumerable:!0, get:function() {
  return this._format;
}, set:function(a) {
  this._format = a;
}}, placement:{configurable:!0, enumerable:!0, get:function() {
  return this._placement;
}, set:function(a) {
  this._placement = a;
}}, price:{configurable:!0, enumerable:!0, get:function() {
  return this._price;
}, set:function(a) {
  this._price = a;
}}, total:{configurable:!0, enumerable:!0, get:function() {
  return this._total;
}, set:function(a) {
  this._total = a;
}}});
var BlogBeteiligt = function(a, b, c, d, e) {
  CommonBeteiligt.call(this, a, "", b, c, d);
  this._date = e;
  this.type = "blog";
};
$jscomp.inherits(BlogBeteiligt, CommonBeteiligt);
BlogBeteiligt.create = function(a) {
  return this._create(a);
};
BlogBeteiligt._create = function(a) {
  return a ? new BlogBeteiligt(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "date")) : new BlogBeteiligt;
};
BlogBeteiligt.prototype.isEmpty = function() {
  return CommonBeteiligt.prototype.isEmpty.call(this) && isBlank(this.date);
};
$jscomp.global.Object.defineProperties(BlogBeteiligt.prototype, {date:{configurable:!0, enumerable:!0, get:function() {
  return this._date;
}, set:function(a) {
  this._date = a;
}}});
// Input 32
var PluginConfiguration = function(a, b, c, d) {
  this._version = a;
  this._description = b;
  this._card = c;
  this._modules = d || [];
};
PluginConfiguration.create = function(a) {
  return this._create(a);
};
PluginConfiguration._create = function(a) {
  return a ? new PluginConfiguration(VERSION, JsonSerialization.getProperty(a, "description") || "Dieses Panta.Card Power-Up umfasst das Modul:", JsonSerialization.getProperty(a, "card"), this._readModules(a)) : new PluginConfiguration(VERSION, "Panta.Card Power-Up", null, []);
};
PluginConfiguration._readModules = function(a) {
  a = JsonSerialization.getProperty(a, "modules") || {1:JSON.stringify(new PluginModuleConfig("module.artikel", "Artikel", {}))};
  return Object.values(a).map(function(a) {
    var b = PluginModuleConfig.create(a);
    a = PluginRepository.INSTANCE.find(function(a) {
      return a.id === b.id;
    });
    if (isSet(a) && a instanceof PluginModuleConfig) {
      a = JSON.parse(JSON.stringify(a.config));
      var d = JSON.parse(JSON.stringify(b.config));
      a = extend(a, d);
      b.config = a;
    }
    return b;
  });
};
PluginConfiguration.prototype.getActiveModules = function() {
  return Object.values(this._modules).filter(function(a) {
    return a && a.config && a.config.enabled;
  }).sort(function(a, b) {
    return a.config.sort - b.config.sort;
  });
};
PluginConfiguration.prototype.getModule = function(a, b) {
  return Object.values(this._modules).filter(function(a) {
    return a && a.config && (!b || a.config.enabled);
  }).find(function(b) {
    return b.id === a;
  });
};
PluginConfiguration.prototype.hasActiveModules = function() {
  return 0 < this.getActiveModules().length;
};
$jscomp.global.Object.defineProperties(PluginConfiguration.prototype, {card:{configurable:!0, enumerable:!0, get:function() {
  return this._card;
}, set:function(a) {
  this._card = a;
}}, modules:{configurable:!0, enumerable:!0, get:function() {
  return this._modules;
}, set:function(a) {
  this._modules = a;
}}, version:{configurable:!0, enumerable:!0, get:function() {
  return this._version;
}, set:function(a) {
  this._version = a;
}}, description:{configurable:!0, enumerable:!0, get:function() {
  return this._description;
}, set:function(a) {
  this._description = a;
}}});
$jscomp.global.Object.defineProperties(PluginConfiguration, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}});
// Input 33
var Plan = function(a, b, c, d, e, f, h, g, k, l, m, q, n, p, r) {
  this._id = a || uuid();
  this._fee = d;
  this._projectFee = e;
  this._thirdPartyCharges = f;
  this._thirdPartyTotalCosts = h;
  this._capOnDepenses = g;
  this._totalCosts = k;
  this._visual = l;
  this._form = m;
  this._online = q;
  this._season = n;
  this._region = p;
  this._place = r;
  this._measures = b;
  this._description = c;
  this._version = Plan.VERSION;
};
Plan.create = function(a) {
  return this._create(a);
};
Plan._create = function(a) {
  if (a) {
    var b = new Plan(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "measures"), JsonSerialization.getProperty(a, "description"), JsonSerialization.getProperty(a, "fee"), JsonSerialization.getProperty(a, "projectFee"), JsonSerialization.getProperty(a, "thirdPartyCharges"), JsonSerialization.getProperty(a, "thirdPartyTotalCosts"), 0.0, JsonSerialization.getProperty(a, "totalCosts"), JsonSerialization.getProperty(a, "visual"), JsonSerialization.getProperty(a, "form"), JsonSerialization.getProperty(a, 
    "online"), JsonSerialization.getProperty(a, "season"), JsonSerialization.getProperty(a, "region"), JsonSerialization.getProperty(a, "place"));
    b.version = JsonSerialization.getProperty(a, "version");
    return b;
  }
  return new Plan;
};
Plan.prototype.isEmpty = function() {
  return isBlank(this._fee) && isBlank(this._charges) && isBlank(this._thirdPartyCharges) && isBlank(this._capOnDepenses) && isBlank(this._visual) && isBlank(this._form) && isBlank(this._online) && isBlank(this._season) && isBlank(this._region) && isBlank(this._place) && isBlank(this._measures) && isBlank(this._description);
};
$jscomp.global.Object.defineProperties(Plan.prototype, {id:{configurable:!0, enumerable:!0, get:function() {
  return this._id;
}, set:function(a) {
  this._id = a;
}}, measures:{configurable:!0, enumerable:!0, get:function() {
  return this._measures;
}, set:function(a) {
  this._measures = a;
}}, description:{configurable:!0, enumerable:!0, get:function() {
  return this._description;
}, set:function(a) {
  this._description = a;
}}, fee:{configurable:!0, enumerable:!0, get:function() {
  return this._fee;
}, set:function(a) {
  this._fee = a;
}}, projectFee:{configurable:!0, enumerable:!0, get:function() {
  return this._projectFee;
}, set:function(a) {
  this._projectFee = a;
}}, thirdPartyCharges:{configurable:!0, enumerable:!0, get:function() {
  return this._thirdPartyCharges;
}, set:function(a) {
  this._thirdPartyCharges = a;
}}, thirdPartyTotalCosts:{configurable:!0, enumerable:!0, get:function() {
  return this._thirdPartyTotalCosts;
}, set:function(a) {
  this._thirdPartyTotalCosts = a;
}}, capOnDepenses:{configurable:!0, enumerable:!0, get:function() {
  return this._capOnDepenses;
}, set:function(a) {
  this._capOnDepenses = a;
}}, totalCosts:{configurable:!0, enumerable:!0, get:function() {
  return this._totalCosts;
}, set:function(a) {
  this._totalCosts = a;
}}, visual:{configurable:!0, enumerable:!0, get:function() {
  return this._visual;
}, set:function(a) {
  this._visual = a;
}}, form:{configurable:!0, enumerable:!0, get:function() {
  return this._form;
}, set:function(a) {
  this._form = a;
}}, online:{configurable:!0, enumerable:!0, get:function() {
  return this._online;
}, set:function(a) {
  this._online = a;
}}, season:{configurable:!0, enumerable:!0, get:function() {
  return this._season;
}, set:function(a) {
  this._season = a;
}}, region:{configurable:!0, enumerable:!0, get:function() {
  return this._region;
}, set:function(a) {
  this._region = a;
}}, place:{configurable:!0, enumerable:!0, get:function() {
  return this._place;
}, set:function(a) {
  this._place = a;
}}, version:{configurable:!0, enumerable:!0, get:function() {
  return this._version;
}, set:function(a) {
  this._version = a;
}}});
$jscomp.global.Object.defineProperties(Plan, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}});
// Input 34
HTMLElement.prototype.addClass = function(a) {
  this.hasClass(a) || (this.className += " " + a, this.className = this.className.trim());
  return this;
};
HTMLElement.prototype.hasClass = function(a) {
  return -1 !== this.className.split(" ").indexOf(a);
};
HTMLElement.prototype.addConditionalFormatting = function(a) {
  this.conditionalFormatting || (this.conditionalFormatting = []);
  this.conditionalFormatting.push(a);
};
HTMLElement.prototype.applyConditionalFormatting = function(a) {
  (this.conditionalFormatting || []).forEach(function(b) {
    b = b.call(this, a);
    this.removeClass(b.name + "-not");
    this.removeClass(b.name);
    b.active ? this.addClass(b.name) : this.addClass(b.name + "-not");
  }, this);
};
HTMLElement.prototype.removeClasses = function(a) {
  var b = this;
  a.forEach(function(a, d) {
    b.removeClass(a);
  });
};
HTMLElement.prototype.removeClass = function(a) {
  var b = this.className.split(" ");
  if (-1 !== b.indexOf(a)) {
    var c = "";
    b.forEach(function(b, e) {
      b !== a && (c += " " + b);
    });
    this.className = c.trim();
  }
  return this;
};
HTMLElement.prototype.removeChildren = function() {
  for (; this.firstChild;) {
    this.removeChild(this.firstChild);
  }
};
HTMLElement.prototype.removeSelf = function() {
  this.parentElement.removeChild(this);
};
HTMLElement.prototype.setEventListener = function(a, b) {
  this.removeEventListener(a, b);
  this.addEventListener(a, b);
};
HTMLElement.prototype.getMarginBottom = function() {
  var a = getComputedStyle(this);
  return parseFloat(a.marginBottom);
};
HTMLElement.prototype.getClosestChildByTagName = function(a) {
  var b = Object.values(this.children).find(function(b) {
    return b.tagName.toLowerCase() === a.toLowerCase();
  }, this);
  if (null !== b) {
    return b;
  }
  for (b = 0; b < this.children.length; b++) {
    var c = this.children.item(b).getClosestChildByTagName(a);
    if (null !== c) {
      return c;
    }
  }
  return null;
};
HTMLElement.prototype.getClosestChildByClassName = function(a) {
  var b = Object.values(this.children).find(function(b) {
    return b.hasClass(a);
  }, this);
  if (null != b) {
    return b;
  }
  for (b = 0; b < this.children.length; b++) {
    var c = this.children.item(b).getClosestChildByClassName(a);
    if (null !== c) {
      return c;
    }
  }
  return null;
};
HTMLElement.prototype.getClosestParentByClassName = function(a) {
  return null !== this.parentElement ? this.parentElement.hasClass(a) ? this.parentElement : this.parentElement.getClosestParentByClassName(a) : null;
};
HTMLCollection.prototype.forEach = function(a) {
  for (var b = 0; b < this.length; b++) {
    a(this[b]);
  }
};
function uuid() {
  var a = (new Date).getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(b) {
    var c = (a + 16 * Math.random()) % 16 | 0;
    a = Math.floor(a / 16);
    return ("x" === b ? c : c & 3 | 8).toString(16);
  });
}
HTMLDocument.prototype.newMultiLineInput = function(a, b, c, d, e, f, h, g, k) {
  return (new MultiLineInput(this, d, null, b, void 0 === g ? "" : g, void 0 === h ? 2 : h, !1, void 0 === k ? !0 : k)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e).render();
};
HTMLDocument.prototype.newSingleLineInput = function(a, b, c, d, e, f, h, g, k, l) {
  g = void 0 === g ? "text" : g;
  k = void 0 === k ? !1 : k;
  b = new SingleLineInput(this, d, null, b, void 0 === h ? "" : h, k, void 0 === l ? !0 : l);
  b.propertyType = g || "text";
  null !== c && b.bind(a.data, c);
  a = function() {
  };
  b.onFocus(f, e).onEnterEditing(f, e).onChange(k ? a : f, e).render();
  return b;
};
HTMLDocument.prototype.newSingleSelect = function(a, b, c, d, e, f, h, g, k, l) {
  var m = (new SingleSelectInput(this, d, null, b, void 0 === h ? "" : h, !1, void 0 === l ? !0 : l)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e);
  k.forEach(function(a, b) {
    m.addOption(a.value, a.text);
  });
  m.setEmpty(g.value, g.text);
  return m.render();
};
HTMLDocument.prototype.createStylesheet = function(a) {
  var b = this.createElement("link");
  b.rel = "stylesheet";
  b.type = "text/css";
  b.href = a;
  b.media = "all";
  return b;
};
Window.prototype.isBlank = function(a) {
  return !a || 0 === (a + "").trim().length;
};
String.prototype.toHTML = function() {
  var a = document.createElement("textarea");
  a.innerHTML = this;
  return a.value;
};
String.prototype.htmlify = function() {
  return this.replace(/(@?(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?)/g, function(a) {
    var b = a;
    if (a.startsWith("@")) {
      return a;
    }
    a.startsWith("http") || (b = "http://" + a);
    return '<a href="' + b + '" target="_blank" title=\'\u00d6ffne die Webseite \u00ab' + b + "\u00bb in einem neuen Fenster'>" + a + "</a>";
  }).replace(/([a-z0-9]+([\-.][a-z0-9]+)*@[a-z0-9]+([\-.][a-z0-9]+)*\.[a-z]{2,5})/g, function(a) {
    return '<a href="mailto:' + a + "\" title='Schreib eine Mail an \u00ab" + a + "\u00bb'>" + a + "</a>";
  }).replace(/(\r\n|\n|\r)/g, function(a) {
    return "<br />";
  });
};
String.prototype.toHtmlEntities = function() {
  return this.replace(/[\u00A0-\u9999<>&]/gim, function(a) {
    return "&#" + a.charCodeAt(0) + ";";
  });
};
Window.prototype.addCss = function(a) {
  document.getElementsByTagName("head")[0].appendChild(document.createStylesheet(a));
};
Window.prototype.useDefaultSelectStyle = function() {
  return null !== this.navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry|iPad|Windows Phone)/);
};
Window.prototype.isMobileBrowser = function() {
  return null !== this.navigator.userAgent.match(/(iPhone|iPod|Android|BlackBerry|Windows Phone)/);
};
Window.prototype.autoTabIndex = function() {
  return DI.getInstance().getTabIndexProvider().getAndIncrement();
};
Window.prototype.createByTemplate = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = isMobileBrowser() ? b : a;
  return c.cloneNode(!0);
};
function newOption(a, b) {
  return {value:a, text:b};
}
function isNumber(a) {
  return a && !isNaN(a);
}
function __(a) {
  return TEXTS[a];
}
function isSet(a) {
  return !("undefined" === typeof a || null === a);
}
function extend(a, b) {
  for (var c in b) {
    a.hasOwnProperty(c) ? "object" === typeof b[c] ? b.hasOwnProperty("type") && "select" === b.type ? b.hasOwnProperty("type") && "select" === b.type && (a[c] = b[c]) : a[c] = extend(a[c] || {}, b[c]) : a[c] = b[c] : a[c] = b[c];
  }
  return a;
}
;
// Input 35
var JsonSerialization = function() {
};
JsonSerialization.prototype.serialize = function(a) {
  if (null == a) {
    return null;
  }
  var b = {}, c = this.getAllProperties(a), d;
  for (d in c) {
    var e = c[d];
    "object" === typeof a[e] ? b[this.normalize(e)] = this.serialize(a[e]) : b[this.normalize(e)] = a[e];
  }
  return JSON.stringify(b);
};
JsonSerialization.prototype.deserialize = function(a, b) {
  return Artikel.create(a);
};
JsonSerialization.normalize = function(a) {
  return a.toString().startsWith("_") ? a.toString().substr(1) : a.toString();
};
JsonSerialization.denomalize = function(a) {
  return "_" + a;
};
JsonSerialization.getProperty = function(a, b) {
  return a ? a[JsonSerialization.denomalize(b)] : null;
};
JsonSerialization.prototype.getAllProperties = function(a) {
  return Object.getOwnPropertyNames(a);
};
// Input 36
var template_regular = '<div id="template">    <div class="row">        <div class="col-6 col-phone-12">            <div class="row">                <div class="col-12 col-phone-12">                    <div class="pa.name"></div>                </div>                <div class="col-12 col-phone-12">                    <div class="pa.social"></div>                </div>            </div>        </div>        <div class="col-6 col-phone-12 line-4 line-phone-4">            <div class="pa.notes"></div>        </div>    </div>    <div class="row">        <div class="col-6 col-phone-12">            <div class="pa.address"></div>        </div>        <div class="col-6 col-phone-12">            <div class="pa.duedate"></div>        </div>    </div>    <div class="row">        <div class="col-12 col-phone-12">            <div class="row">                <div class="col-4 col-phone-4">                    <div class="pa.fee"></div>                </div>                <div class="col-4 col-phone-4">                    <div class="pa.charges"></div>                </div>                <div class="col-4 col-phone-4">                    <div class="pa.project"></div>                </div>            </div>        </div>    </div></div>', 
template_regular_mobile = '<div id="template">    <div class="row">        <div class="col-phone-12">            <div class="pa.name"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12 line-phone-4">            <div class="pa.notes"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12">            <div class="pa.social"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12">            <div class="pa.address"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12">            <div class="pa.duedate"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12">            <div class="row">                <div class="col-phone-4">                    <div class="pa.fee"></div>                </div>                <div class="col-phone-4">                    <div class="pa.charges"></div>                </div>                <div class="col-phone-4">                    <div class="pa.project"></div>                </div>            </div>        </div>    </div></div>', 
template_ad = '<div id="template" class="row">    <div class="col-6 col-phone-12">        <div class="row">            <div class="col-12 col-phone-12">                <div class="pa.notes"></div>            </div>        </div>        <div class="row">            <div class="col-6 col-phone-6">                <div class="pa.format"></div>            </div>            <div class="col-6 col-phone-6">                <div class="pa.placement"></div>            </div>        </div>        <div class="row">            <div class="col-6 col-phone-6">                <div class="pa.price"></div>            </div>            <div class="col-6 col-phone-6">                <div class="pa.total"></div>            </div>        </div>    </div>    <div class="col-6 col-phone-12">        <div class="row">            <div class="col-12 col-phone-12">                <div class="pa.name"></div>            </div>            <div class="col-12 col-phone-12">                <div class="pa.social"></div>            </div>            <div class="col-12 col-phone-12">                <div class="pa.address"></div>            </div>        </div>    </div></div>', 
template_blog = '<div id="template" class="row">    <div class="col-12 col-phone-12">        <div class="row">            <div class="col-12 col-phone-12">                <div class="pa.link"></div>            </div>        </div>    </div>    <div class="col-6 col-phone-12">        <div class="row">            <div class="col-12 col-phone-12 line-7 line-phone-7">                <div class="pa.notes"></div>            </div>        </div>    </div>    <div class="col-6 col-phone-12">        <div class="row">            <div class="col-12 col-phone-12 phone-hidden">                <div class="empty-cell"><div class="field">                   <label class="invisible prop-textarea" for="empty-cell1">Empty</label> <textarea id="empty-cell1" class="invisible text u-border"></textarea>               </div>            </div>            </div>            <div class="col-12 col-phone-12">                <div class="pa.follower"></div>            </div>            <div class="col-12 col-phone-12">                <div class="pa.date"></div>            </div>        </div>    </div></div>', 
template_plan = '<div id="template">    <div class="row">        <div class="col-6 line-2">            <div class="pa.plan.measures"></div>        </div>        <div class="col-3">            <div class="pa.plan.fee"></div>        </div>        <div class="col-3">            <div class="pa.plan.projectFee"></div>        </div>    </div>    <div class="row">        <div class="col-6 line-6">            <div class="pa.plan.description"></div>        </div>        <div class="col-6">            <div class="row">                <div class="col-6">                    <div class="pa.plan.thirdPartyCharges"></div>                </div>                <div class="col-6">                    <div class="pa.plan.thirdPartyTotalCosts"></div>                </div>                <div class="col-6">                    <div class="pa.plan.capOnDepenses"></div>                </div>                <div class="col-6 line-2">                    <div class="pa.plan.totalCosts"></div>                </div>            </div>        </div>    </div>    <div class="row">        <div class="col-2">            <div id="pa.plan.visual"></div>        </div>        <div class="col-2">            <div id="pa.plan.form"></div>        </div>        <div class="col-2">            <div id="pa.plan.online"></div>        </div>        <div class="col-2">            <div id="pa.plan.season"></div>        </div>        <div class="col-2">            <div id="pa.plan.region"></div>        </div>        <div class="col-2">            <div id="pa.plan.place"></div>        </div>    </div></div>', 
template_artikel = '<div id="template">    <div class="row">        <div class="col-9 col-phone-9">            <div id="pa.topic"></div>        </div>        <div class="col-3 col-phone-3">            <div id="pa.pagina"></div>        </div>    </div>    <div class="row mobile-row">        <div class="col-9 col-phone-9">            <div class="row">                <div class="col-6 col-phone-6">                    <div id="pa.input-from"></div>                </div>                <div class="col-6 col-phone-6">                    <div id="pa.author"></div>                </div>            </div>        </div>        <div class="col-3 col-phone-3">            <div id="pa.layout"></div>        </div>    </div>    <div class="row mobile-row">        <div class="col-9 col-phone-9">            <div id="pa.text"></div>        </div>        <div class="col-3 col-phone-3">            <div id="pa.total"></div>        </div>    </div>    <div class="col-12 col-phone-12">        <div class="row">            <div class="col-2 col-phone-4">                <div id="pa.visual"></div>            </div>            <div class="col-2 col-phone-4">                <div id="pa.form"></div>            </div>            <div class="col-2 col-phone-4">                <div id="pa.tags"></div>            </div>            <div class="col-2 col-phone-4">                <div id="pa.season"></div>            </div>            <div class="col-2 col-phone-4">                <div id="pa.region"></div>            </div>            <div class="col-2 col-phone-4">                <div id="pa.location"></div>            </div>        </div>    </div></div>', 
template_plan_mobile = '<div id="template">    <div class="row">        <div class="col-phone-12 line-phone-2">            <div class="pa.plan.measures"></div>        </div>    </div>    <div class="row">        <div class="col-phone-12 line-phone-4">            <div class="pa.plan.description"></div>        </div>    </div>    <div class="row">        <div class="col-phone-6">            <div class="pa.plan.fee"></div>        </div>        <div class="col-phone-6">            <div class="pa.plan.projectFee"></div>        </div>    </div>    <div class="row">        <div class="col-phone-6">            <div class="pa.plan.thirdPartyCharges"></div>        </div>        <div class="col-phone-6">            <div class="pa.plan.thirdPartyTotalCosts"></div>        </div>    </div>    <div class="row">        <div class="col-phone-6">            <div class="pa.plan.capOnDepenses"></div>        </div>        <div class="col-phone-6">            <div class="pa.plan.totalCosts"></div>        </div>    </div>    <div class="row">        <div class=" col-phone-4">            <div id="pa.plan.visual"></div>        </div>        <div class=" col-phone-4">            <div id="pa.plan.form"></div>        </div>        <div class=" col-phone-4">            <div id="pa.plan.online"></div>        </div>    </div>    <div class="row">        <div class=" col-phone-4">            <div id="pa.plan.season"></div>        </div>        <div class=" col-phone-4">            <div id="pa.plan.region"></div>        </div>        <div class=" col-phone-4">            <div id="pa.plan.place"></div>        </div>    </div></div>', 
template_settings_switch = '<div class="row module-switch-container">    <div class="col-2">       <div class="panta-module-enabled">           <label class="panta-checkbox-container">              <input class="panta-js-checkbox" type="checkbox" checked="checked">               <span class="panta-checkbox-checkmark elevate"></span>           </label>       </div>    </div>    <div class="col-10 switch-title"></div></div>', template_settings_module = '<div class="row module-container">    <div class="col-2 col-phone-2">       <div class="panta-module-enabled">           <label class="panta-checkbox-container">              <input class="panta-js-checkbox" type="checkbox" checked="checked">               <span class="panta-checkbox-checkmark elevate"></span>           </label>       </div>    </div>    <div class="col-8 col-phone-8 module-title"></div>    <div class="col-2 col-phone-2 module-icon"><img src="assets/ic_pantarhei.png" class="panta-js-icon" width="16px" height="16px"/></div></div>', 
template_settings_editable = '<div class="row module-editable-container">    <div class="col-1 col-phone-1 module-editable-show">       <div class="panta-module-enabled">           <label class="panta-checkbox-container hidden">               <input class="panta-js-checkbox" type="checkbox" checked="checked">               <span class="panta-checkbox-checkmark elevate"></span>           </label>       </div>    </div>    <div class="col-8 col-phone-8 module-editable-name"></div>    <div class="col-1 col-phone-1 module-helper-visible">       <button class="panta-btn panta-btn-dot panta-js-button hidden" title="Dieses Feld ist sichtbar"><img src="assets/ic_visible.png" width="12px" height="12px"/></button>    </div>    <div class="col-1 col-phone-1 module-editable-color invisible">       <button class="panta-btn panta-btn-dot panta-js-button"></button>    </div>    <div class="col-1 col-phone-1 module-helper-sortable">       <button class="panta-btn panta-btn-dot panta-js-button" title="Dieses Feld kann f\u00fcr die Sortierung verwendet werden">S</button>    </div></div>', 
template_settings_editable_select = '<div class="row module-editable-select-container">   <select class="panta-js-select"></select></div>', template_settings_editable_option = '<div class="row module-editable-option-container">    <div class="col-10 module-editable-option-name">       <input type="text" class="panta-js-name"/>    </div>    <div class="col-2 module-editable-option-actions">       <button class="panta-btn panta-btn-icon panta-js-delete"><img src="assets/ic_trash.svg" width="16px" height="16px"/></button>       <button class="panta-btn panta-btn-icon panta-js-visible hidden"><img src="assets/ic_visible.png" width="16px" height="16px"/></button>    </div></div>', 
template_beteiligt = '<form id="panta.module">    <div class="js-panta-editable-title">        <div class="row min"><div class="col-12">\u00a0</div></div>        <div class="row min">           <div class="col-12">                <h3 class="js-panta-module js-panta-label"></h3>           </div>        </div>    </div>    <div class="row min navigation-bar">        <div id="pa.involved.onsite" class="col-2 col-phone-4 tab" data-label="vor.Ort" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.text" class="col-2 col-phone-4 tab" data-label="Journalist" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.photo" class="col-phone-4 col-2 tab" data-label="Visual" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.video" class="col-phone-4 col-2 tab" data-label="Event" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.illu" class="col-phone-4 col-2 tab" data-label="MC/Host" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.ad" class="col-phone-4 col-2 tab" data-label="weitere" data-layout="regular"><span>Placeholder</span></div>    </div>    <span id="pa.tab.content"></span></form>';

