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
    for (var g = 0; g < f && c < e;) {
      if (b[c++] != a[g++]) {
        return !1;
      }
    }
    return g >= f;
  };
}, "es6", "es3");
$jscomp.polyfill("Array.prototype.findIndex", function(a) {
  return a ? a : function(a, c) {
    return $jscomp.findInternal(this, a, c).i;
  };
}, "es6", "es3");
$jscomp.polyfill("Promise.prototype.finally", function(a) {
  return a ? a : function(a) {
    return this.then(function(b) {
      return Promise.resolve(a()).then(function() {
        return b;
      });
    }, function(b) {
      return Promise.resolve(a()).then(function() {
        throw b;
      });
    });
  };
}, "es9", "es3");
$jscomp.polyfill("Array.from", function(a) {
  return a ? a : function(a, c, d) {
    c = null != c ? c : function(a) {
      return a;
    };
    var b = [], f = "undefined" != typeof Symbol && Symbol.iterator && a[Symbol.iterator];
    if ("function" == typeof f) {
      a = f.call(a);
      for (var g = 0; !(f = a.next()).done;) {
        b.push(c.call(d, f.value, g++));
      }
    } else {
      for (f = a.length, g = 0; g < f; g++) {
        b.push(c.call(d, a[g], g));
      }
    }
    return b;
  };
}, "es6", "es3");
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
var TrelloClient = function(a, b) {
  if (!window.hasOwnProperty("Trello")) {
    throw "Trello not correctly loaded";
  }
  this.trello = a;
  this._loggingService = b;
  this._requests = 0;
};
TrelloClient.prototype.getCurrentCard = function() {
  var a = this;
  return a.trello.card("id").then(function(b) {
    a._requests++;
    return b;
  });
};
TrelloClient.prototype.getAllBoardCards = function() {
  return this.trello.cards("id", "name", "desc", "due", "members", "labels", "idList");
};
TrelloClient.prototype.getListById = function(a) {
  return this.trello.lists("id", "name").filter(function(b) {
    return b.id === a;
  }).reduce(function(a, c) {
    return c;
  }, null);
};
TrelloClient.prototype.attachFile = function(a, b, c) {
  var d = this;
  return d.withTrelloToken().then(function(e) {
    return new Promise(function(f, g) {
      var h = new FormData, k = new Date, l = "Datei \u00ab" + b.name + "\u00bb von \u00ab" + c + "\u00bb am " + k.toLocaleDateString() + " um " + k.toLocaleTimeString();
      h.append("file", b);
      h.append("name", "" + l);
      h.append("key", e.key);
      h.append("token", e.token);
      var m = new XMLHttpRequest;
      m.onload = function(c) {
        if (4 === m.readyState) {
          switch(m.status) {
            case 200:
              d._loggingService.i("Datei als \u00ab" + l + "\u00bb in \u00ab" + a.id + "\u00bb gespeichert");
              f(b);
              break;
            case 401:
              d.resetToken();
            default:
              d._loggingService.e("Ein Fehler beim Verarbeiten der Datei \u00ab" + b.name + "\u00bb ist aufgetreten}"), d._loggingService.d("Details zum Fehler: " + m.statusText), g("Ein Fehler beim Verarbeiten der Datei \u00ab" + b.name + "\u00bb ist aufgetreten: \n\n" + m.statusText);
          }
        }
      };
      m.onerror = function(a) {
        d._loggingService.e("Ein I/O-Fehler beim Verarbeiten der Datei \u00ab" + b.name + "\u00bb ist aufgetreten");
        d._loggingService.d("Details zum Fehler: " + m.statusText);
        g("Ein I/O-Fehler beim Verarbeiten der Datei \u00ab" + b.name + "\u00bb ist aufgetreten: \n\n" + m.statusText);
      };
      m.open("POST", "https://api.trello.com/1/cards/" + a.id + "/attachments", !0);
      m.send(h);
    });
  });
};
TrelloClient.prototype.withTrelloToken = function() {
  var a = this;
  return a.trello.getRestApi().isAuthorized().then(function(b) {
    a._requests++;
    return b ? a.trello.getRestApi().getToken().then(function(b) {
      a._requests++;
      return b ? {token:b, key:a.trello.getRestApi().appKey} : a._authorize();
    }) : a._authorize();
  });
};
TrelloClient.prototype._authorize = function() {
  var a = this;
  return (new Promise(function(b, c) {
    window.Trello.authorize({type:"popup", expiration:"never", scope:{read:"true", write:"true"}, success:function() {
      a._requests++;
      a._loggingService.d("Berechtigung erfolgreich erteilt");
      b(!0);
    }, error:function() {
      a._requests++;
      a._loggingService.e("Berechtigung konnte nicht erteilt werden");
      c("Fehler bei der Autorisierung des Power-Ups");
    }});
  })).then(function() {
    return a.trello.getRestApi().getToken().then(function(b) {
      a._requests++;
      return {token:b, key:a.trello.getRestApi().appKey};
    });
  });
};
TrelloClient.prototype.resetToken = function() {
  this._requests++;
  return this.trello.getRestApi().clearToken();
};
TrelloClient.prototype.getCurrentMember = function() {
  var a = this;
  return this.trello.member("username").then(function(b) {
    a._requests++;
    return b;
  });
};
TrelloClient.prototype.createCard = function(a, b, c, d, e, f) {
  var g = this;
  return this.withTrelloToken().then(function(h) {
    return new Promise(function(k, l) {
      g._loggingService.d("Erstelle Trello Card \u00ab" + a + "\u00bb in " + c);
      var m = g._createBody(h, {name:a, desc:b, idList:c, idLabels:d, due:e, idMembers:f});
      g._requests++;
      window.Trello.post("/cards", m, function(a) {
        g._loggingService.d("Trello Card erstellt mit ID \u00ab" + a.id + "\u00bb");
        g._assertCard(a, k, l, !0);
      }, function() {
        l("Fehler beim Erstellen der Karte mit Titel \u00ab" + a + "\u00bb");
      });
    });
  });
};
TrelloClient.prototype._assertCard = function(a, b, c, d) {
  var e = this;
  setTimeout(function() {
    e.trello.cards("id").then(function(f) {
      1 === f.filter(function(b) {
        return b.id === a.id;
      }).length ? b(a) : d ? e._assertCard(a, b, c, !1) : c("Konnte die Trello Card \u00ab" + a.id + "\u00bb nicht finden");
    });
  }, d ? 1 : 100);
};
TrelloClient.prototype.searchMember = function(a) {
  var b = this;
  return b.withTrelloToken().then(function(c) {
    return new Promise(function(d, e) {
      b._requests++;
      window.Trello.get("/search/members", b._createBody(c, {query:"" + it, limit:1}), function(a) {
        d(a);
      }, function() {
        e("Fehler beim Suchen des Mitglieds mit dem Namen \u00ab" + a + "\u00bb");
      });
    });
  });
};
TrelloClient.prototype.getLabels = function() {
  var a = this;
  return a.trello.board("id", "name", "labels").then(function(b) {
    a._requests++;
    return b.labels;
  });
};
TrelloClient.prototype.createLabels = function(a) {
  var b = this;
  return b.trello.board("id", "labels").then(function(c) {
    b._requests++;
    var d = c.labels;
    return Promise.all(a.map(function(a) {
      var e = a.source.label, g = d.find(function(b) {
        return b.name === a.name && b.color === a.source.color;
      });
      return g ? Promise.resolve(g) : b.createLabel(e, a.source.color, c.id).catch(function(a) {
        b._loggingService.w("Label \u00ab" + e + "\u00bb konnte nicht erstellt werden: " + a);
        return !1;
      });
    })).then(function(a) {
      return a.filter(function(a) {
        return !1 !== a;
      });
    });
  });
};
TrelloClient.prototype.findCardByTitle = function(a, b) {
  this._loggingService.d("Sucht nach bestehender Trello Card mit Namen \u00ab" + a + "\u00bb in Trello Liste \u00ab" + b.id + "\u00bb");
  this._requests++;
  return this.trello.cards("id", "name", "idList").reduce(function(c, d) {
    return c = d.name === a && d.idList === b.id ? d : c;
  }, null);
};
TrelloClient.prototype.findListByName = function(a) {
  this._requests++;
  return this.trello.lists("all").filter(function(b) {
    return b.name === a;
  });
};
TrelloClient.prototype.createLabel = function(a, b, c) {
  var d = this;
  return -1 === Object.values(TRELLO_COLORS).indexOf(b) ? Promise.reject("Ung\u00fcltige Farbe: " + b + ". G\u00fcltige Farben sind: " + Object.values(TRELLO_COLORS).join()) : this.withTrelloToken().then(function(e) {
    return new Promise(function(f, g) {
      d._loggingService.d("Label \u00ab" + a + "\u00bb (" + b + ") wird erstellt in Board \u00ab" + c + "\u00bb");
      var h = d._createBody(e, {name:a, color:b, idBoard:c});
      window.Trello.post("/labels", h, function(a) {
        d._requests++;
        f(a);
      }, function() {
        g("Fehler beim Erstellen des Labels \u00ab" + a + "\u00bb (" + b + ")");
      });
    });
  });
};
TrelloClient.prototype.createList = function(a) {
  var b = this;
  return this.trello.board("id", "name", "labels").then(function(c) {
    b._requests++;
    return b.withTrelloToken().then(function(d) {
      return new Promise(function(e, f) {
        window.Trello.post("/lists", b._createBody(d, {name:a, idBoard:c.id, pos:"bottom"}), function(c) {
          b._requests++;
          b._loggingService.d("Liste \u00ab" + a + "\u00bb wurde erstellt");
          e(c);
        }, function() {
          f("Fehler beim Erstellen der List mit dem Namen \u00ab" + a + "\u00bb");
        });
      });
    });
  });
};
TrelloClient.prototype._createBody = function(a, b) {
  b.key = a.key;
  b.token = a.token;
  this._loggingService.t(">> " + JSON.stringify(b));
  return b;
};
$jscomp.global.Object.defineProperties(TrelloClient.prototype, {requests:{configurable:!0, enumerable:!0, get:function() {
  return this._requests;
}}});
$jscomp.global.Object.defineProperties(TrelloClient, {MAX_REQUESTS:{configurable:!0, enumerable:!0, get:function() {
  return 300;
}}});
// Input 4
var LoggingService = function() {
};
LoggingService.prototype.flush = function() {
  var a = new Blob([this._logs.map(function(a) {
    return a.at.toISOString() + ": [" + a.level + "]\t" + a.msg;
  }).join("\n")], {type:"text/plain"});
  return new File([a], "log.txt", {type:"text/plain;charset=utf-8"});
};
LoggingService.prototype.open = function() {
  this._reset();
  return this;
};
LoggingService.prototype._reset = function() {
  this._logs = [];
};
LoggingService.prototype.i = function(a) {
  return this._log(this._logs, a, "INFO");
};
LoggingService.prototype.d = function(a) {
  return this._log(this._logs, a, "DEBUG");
};
LoggingService.prototype.t = function(a) {
  return this._log(this._logs, a, "TRACE");
};
LoggingService.prototype.w = function(a) {
  return this._log(this._logs, a, "WARN");
};
LoggingService.prototype.e = function(a) {
  return this._log(this._logs, a, "ERROR");
};
LoggingService.prototype._log = function(a, b, c) {
  c = void 0 === c ? "INFO" : c;
  if (!a) {
    return console.warn("The logging service is not yet opened"), this;
  }
  a.push({at:new Date, level:c, msg:b});
  return this;
};
// Input 5
var VERSION = "0.99-SNAPSHOT", APP_NAME = "Panta.Cards", APP_KEY = "0bdd0023d8f9b9a23ed80260495bbe9b", PLUGIN_CONFIGURATION = {"module.artikel.enabled":!1, "module.beteiligt.enabled":!0, "module.plan.enabled":!0}, TEXTS = {"module.settings.hint":"Folgende MODULE sind f\u00fcr dieses BOARD verf\u00fcgbar:<br/>Sobald mindestens ein MODUL aktiviert ist, wird dieses in jeder CARD auf dem BOARD dargestellt.", "module.artikel.label.desc":"Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.", 
"module.artikel.desc":"ARTIKEL-Eingabefelder und LISTEN f\u00fcr dieses BOARD konfigurieren:<br/>F\u00fcr jedes Feld kann eine Farbe definiert werden.<br/>Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf der CARD Vorderseite \u2013 ansonsten wird es nur auf der CARD Innenseite dargestellt.", "module.artikel.editable.desc":"Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>Die Zahl der Stichwort ist NICHT begrenzt.<br/>Maximal vier der sechs LISTEN lassen sich sortieren.<br/>LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.", 
"module.artikel.field-a.desc":"Das Textfeld \u00abA\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-b.desc":"Das Textfeld \u00abB\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-c.desc":"Das Textfeld \u00abC\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-d.desc":"Das Textfeld \u00abD\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.artikel.field-e.desc":"Das Textfeld \u00abE\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-f.desc":"Das Textfeld \u00abF\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.artikel.field-g.desc":"Das Textfeld \u00abG\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.beteiligt.desc":"BETEILIGT kann als Erg\u00e4nzung zum ARTIKEL oder PLAN aktiviert werden.<br/>Hier die Eingabefelder und LISTEN f\u00fcr das ganze BOARD konfigurieren:", 
"module.beteiligt.label.desc":"Dieser Titel wird oberhalb des Modul BETEILIGT auf jeder CARD sichtbar.", "module.beteiligt.layout.onsite":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.text":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.photo":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.video":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.illu":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", "module.beteiligt.layout.ad":"TAB-Titel tippen und LAYOUT ausw\u00e4hlen.", 
"module.beteiligt.regular.desc":"Standard-Layout", "module.beteiligt.special.desc":"Inserat-Layout", "module.beteiligt.blog.desc":"Blog-Layout", "module.plan.label.desc":"Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.", "module.plan.desc":"PLAN-Eingabefelder und Auswahllisten f\u00fcr das BOARD konfigurieren:<br/>F\u00fcr jedes Feld kann eine Farbe definiert werden.<br/>Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf der CARD Vorderseite \u2013 ansonsten wird es nur auf der CARD Innenseite dargestellt.", 
"module.plan.editable.desc":"Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>Die Zahl der Stichwort ist NICHT begrenzt.<br/>Maximal vier der sechs LISTEN lassen sich sortieren.<br/>LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.", "module.plan.field-a.desc":"Das Textfeld \u00abA\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-b.desc":"Das Textfeld \u00abB\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.plan.field-c.desc":"Das Textfeld \u00abC\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-d.desc":"Das Textfeld \u00abD\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-e.desc":"Das Textfeld \u00abE\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-f.desc":"Das Textfeld \u00abF\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", 
"module.plan.field-g.desc":"Das Textfeld \u00abG\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.plan.field-h.desc":"Das Textfeld \u00abH\u00bb ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.", "module.beteiligt.layout-regular.desc":"Das Kontakt-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", "module.beteiligt.layout-ad.desc":"Das Inserat-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", 
"module.beteiligt.layout-blog.desc":"Das Blog-Formular hat folgende Felder, die individualisert werden k\u00f6nnen", "module.beteiligt.field-name.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-social.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-address.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-notes.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-deadline.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-a.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-b.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-c.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-total.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-price.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-placement.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-format.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-sujet.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-link.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "module.beteiligt.field-follower.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", 
"module.beteiligt.field-date.desc":"Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.", "trello.list.desc":"Trello.Liste", "trello.title.desc":"Card.Titel", "trello.description.desc":"Card.Beschreibung", "trello.members.desc":"Card.Mitglieder", "trello.duedate.desc":"Card.Frist", "trello.labels.desc":"Card.Label", "admin.import.select.label.text":"Felder", "admin.import.select.label.select":"Listen"}, TRELLO_FIELDS = [{id:"trello.list", desc:"trello.list.desc"}, 
{id:"trello.title", desc:"trello.title.desc"}, {id:"trello.description", desc:"trello.description.desc"}, {id:"trello.members", desc:"trello.members.desc", type:"array"}, {id:"trello.duedate", desc:"trello.duedate.desc", type:"date"}, {id:"trello.labels", desc:"trello.labels.desc", type:"boolean", multi:!0}], TRELLO_COLORS = {Blue:"blue", Green:"green", Orange:"orange", Red:"red", Yellow:"yellow", Purple:"purple", Pink:"pink", Sky:"sky", Lime:"lime", Black:"black"};
// Input 6
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
    this.loggingService = (new LoggingService).open();
  }, $jscomp.inherits(a, DI), a.INSTANCE = DI.INSTANCE, a.getInstance = DI.getInstance, a.prototype.getArticleRepository = function() {
    return new ArtikelRepository;
  }, a.prototype.getTabIndexProvider = function() {
    return this.tabIndexProvider;
  }, a.prototype.getAdminService = function(a) {
    return new AdminService(this.getTrelloClient(a), this.loggingService);
  }, a.prototype.getLoggingService = function() {
    return this.loggingService;
  }, a.prototype.getTrelloClient = function(a) {
    return new TrelloClient(a, this.loggingService);
  }, DI.INSTANCE = new a);
  return DI.INSTANCE;
};
DI.prototype.getArticleRepository = function() {
};
DI.prototype.getTabIndexProvider = function() {
};
DI.prototype.getAdminService = function(a) {
};
DI.prototype.getLoggingService = function() {
};
DI.prototype.getTrelloClient = function(a) {
};
DI.INSTANCE = null;
// Input 7
var Controller = function(a, b, c) {
  this._repository = b;
  this._binding = null;
  this._window = a;
  this.trelloApi = c;
};
Controller.prototype.canUnblock = function() {
  this._binding && !this._window.clientManager.getPluginController().upgrading && this._binding.unblock();
};
Controller.prototype.blockUi = function() {
  this._binding && this._binding.blockUi();
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
Controller.prototype.fetchAll = function(a) {
  a = void 0 === a ? function() {
    return console.debug("noop");
  } : a;
  var b = this;
  return this.trelloApi.cards("id", "closed").filter(function(a) {
    return !a.closed;
  }).each(function(a) {
    return b.trelloApi.get(a.id, "shared", b.getSharedName()).then(function(c) {
      b.insert(b.create(c), a);
    });
  }).then(function() {
    console.log(b.getSharedName() + ": Fetch complete: " + b.size());
    a.call(b);
  });
};
Controller.prototype.fetchByCard = function(a, b) {
  var c = this;
  return this.trelloApi.get(a.id, "shared", this.getSharedName()).then(function(d) {
    d = c.create(d, b);
    c.insert(d, a);
    return d;
  });
};
Controller.prototype.getSharedName = function() {
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
Controller.prototype.getMapping = function(a, b, c, d) {
  switch(a.type) {
    case "select":
      return b = this.getPropertyByName(b, c, a.id, -1), -1 !== b ? a.values[b] : d;
    default:
      return this.getPropertyByName(b, c, a.id, d);
  }
};
Controller.prototype.getPropertyByName = function(a, b, c, d) {
};
Controller.prototype.getFields = function(a) {
  return [Object.entries(a.config.editables.filter(this.isImportableField).reduce(function(a, c) {
    a.hasOwnProperty(c.type) || (a[c.type] = []);
    a[c.type].push(c);
    return a;
  }, {})).map(function(b) {
    var c = b[1];
    return {group:__("admin.import.select.label." + b[0]), section:"main", moduleId:"" + a.id, groupId:"" + a.id, fields:c};
  })];
};
Controller.prototype.isImportableField = function(a) {
  return a.visible && ("text" === a.type || "select" === a.type);
};
// Input 8
var FieldMapping = function(a, b, c) {
  this._trello = a;
  this._adminService = b;
  this._clientManager = ClientManager.getInstance(window);
  this._pantaFields = c;
};
FieldMapping.prototype.map = function(a, b) {
  var c = this;
  switch(b.reference) {
    case "trello.title":
      return Promise.resolve(a.name);
    case "trello.description":
      return Promise.resolve(a.desc);
    case "trello.duedate":
      return Promise.resolve(a.due);
    case "trello.members":
      return Promise.resolve(c.mapMembers(a.members.map(c.mapMember)));
    case "trello.labels":
      return Promise.resolve(c.mapArray(a.labels.filter(function(a) {
        return c.labelFilter(a, b);
      }).map(function(a) {
        return c.mapLabel(a, b);
      })) || c.emptyValue());
    case "trello.list":
      return c._adminService.getListById(a.idList).then(function(a) {
        return a.name;
      });
    default:
      return c._getPantaFields().then(function(d) {
        d = d.flatMap(function(a) {
          return a;
        }).map(function(d) {
          var e = d.groupId, g = d.moduleId, h = d.section;
          if (d = d.fields.find(function(a) {
            return e + "." + a.id === b.reference;
          })) {
            g = c._clientManager.getController(g);
            var k = g.getByCard(a);
            return g.getPropertyByName(k, h, d.id, c.emptyValue());
          }
          return null;
        }).find(function(a) {
          return null !== a;
        });
        return Promise.resolve(d ? d : c.emptyValue());
      });
  }
};
FieldMapping.prototype.emptyValue = function() {
  return "";
};
FieldMapping.prototype.mapLabel = function(a, b) {
  return "";
};
FieldMapping.prototype.labelFilter = function(a, b) {
  return !!a;
};
FieldMapping.prototype.mapMember = function(a) {
  return "";
};
FieldMapping.prototype.mapMembers = function(a) {
  return a;
};
FieldMapping.prototype.mapArray = function(a) {
  return a;
};
FieldMapping.prototype._getPantaFields = function() {
  return this._pantaFields;
};
// Input 9
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
// Input 10
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
// Input 11
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
// Input 12
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
// Input 13
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
// Input 14
var SwitchItem = function(a, b, c, d) {
  d = void 0 === d ? !1 : d;
  AbstractItem.call(this);
  this._document = a;
  this._label = b;
  this._enabled = c;
  this._readonly = d;
  this._additionalStyles = "";
};
$jscomp.inherits(SwitchItem, AbstractItem);
SwitchItem.prototype.setOnActivationListener = function(a) {
  this._onActivationHandler = a;
  return this;
};
SwitchItem.prototype.render = function() {
  var a = this, b = createByTemplate(template_settings_switch, template_settings_switch);
  isBlank(a.label) || b.getElementsByClassName("switch-title").forEach(function(b) {
    b.innerText = a.label;
  });
  a.decorate(b);
  var c = b.getClosestChildByClassName("panta-checkbox-container");
  isBlank(this.additionalStyles) || c.addClass(this.additionalStyles);
  var d = c.getClosestChildByClassName("panta-js-checkbox");
  a.enabled ? d.setAttribute("checked", "checked") : d.removeAttribute("checked");
  (d.disabled = this.readonly) || c.setEventListener("click", function(b) {
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
$jscomp.global.Object.defineProperties(SwitchItem.prototype, {additionalStyles:{configurable:!0, enumerable:!0, get:function() {
  return this._additionalStyles;
}, set:function(a) {
  this._additionalStyles = a;
}}, readonly:{configurable:!0, enumerable:!0, get:function() {
  return this._readonly;
}, set:function(a) {
  this._readonly = a;
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
// Input 15
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
// Input 16
var PInput = function(a, b, c, d, e, f, g, h) {
  this._document = a;
  this._label = 0 === b.length ? "" : b;
  this._value = c;
  this._name = "name_" + d;
  d.startsWith(".", 0) ? this._target = this._document.getElementsByClassName(d.substr(1)).item(0) : this._target = this._document.getElementById(d);
  this._type = f;
  this._placeholder = e;
  this._readonly = g;
  this._input = this._document.createElement(this._type);
  this._inputOverlay = this._document.createElement("div");
  this._property = this._labelInput = null;
  this._propertyType = "text";
  this._visible = h;
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
  null !== this._input && this._input.value !== a ? ("select" !== this._type && (this._input.value = a), isBlank(a) ? this._inputOverlay.innerHTML = "<span class='placeholder'>" + this._placeholder + "</span>" : this._inputOverlay.innerHTML = isString(a) ? a.htmlify() : "") : isBlank(a) && (this._inputOverlay.innerHTML = "<span class='placeholder'>" + this._placeholder + "</span>");
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
var MultiLineInput = function(a, b, c, d, e, f, g, h) {
  PInput.call(this, a, b, c, d, e, "textarea", !!g, h);
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
var SingleLineInput = function(a, b, c, d, e, f, g) {
  PInput.call(this, a, b, c, d, e, "textarea", !!f, g);
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
var SingleSelectInput = function(a, b, c, d, e, f, g) {
  PInput.call(this, a, b, c, d, e, "select", !!f, g);
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
// Input 17
var PluginController = function(a, b) {
  this._window = b;
  this._trelloApi = a;
  this._upgrading = !1;
  this._upgrades = {1:this._upgrade_1, 2:this._upgrade_2, 3:this._upgrade_3_to_4};
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
PluginController.prototype.getAdminConfiguration = function() {
  var a = this;
  return a._trelloApi.get("board", "private", AdminController.PROPERTY_BAG_NAME, null).then(function(b) {
    return a._parseAdminConfiguration(b);
  });
};
PluginController.prototype.setAdminConfiguration = function(a) {
  if (a) {
    var b = LZString.compress(JSON.stringify(a));
    return this._trelloApi.set("board", "private", AdminController.PROPERTY_BAG_NAME, b).then(function() {
      return Base64.encode(b);
    });
  }
  return this.getAdminConfiguration().then(function(a) {
    return Base64.encode(LZString.compress(JSON.stringify(a.configuration)));
  });
};
PluginController.prototype.resetAdminConfiguration = function() {
  var a = this;
  return this._trelloApi.remove("board", "private", AdminController.PROPERTY_BAG_NAME).then(function() {
    return a.getAdminConfiguration();
  });
};
PluginController.prototype.parseAdminConfiguration = function(a) {
  return Promise.resolve(this._createAdminConfiguration(JSON.parse(a)));
};
PluginController.prototype._parseAdminConfiguration = function(a) {
  try {
    if (isString(a) && !isBlank(a)) {
      var b = JSON.parse(LZString.decompress(a) || '{ "configuration": null, "export_configuration": null }');
      return this._createAdminConfiguration(b);
    }
    return this._createAdminConfiguration();
  } catch (c) {
    throw Error("Could not read configuration: " + Base64.encode(a));
  }
};
PluginController.prototype._createAdminConfiguration = function(a) {
  var b = {};
  a && a.hasOwnProperty("configuration") ? b.configuration = DataConfiguration.create(a.configuration) : b.configuration = DataConfiguration.create();
  a && a.hasOwnProperty("export_configuration") ? b.export_configuration = DataConfiguration.create(a.export_configuration) : b.export_configuration = DataConfiguration.create();
  return b;
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
PluginController.prototype.getEnabledModules = function() {
  return this.getPluginConfiguration().then(function(a) {
    return a.modules.filter(function(a) {
      return a.config.enabled;
    });
  });
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
PluginController.prototype._upgrade_3_to_4 = function() {
  return this._trelloApi.getRestApi().clearToken();
};
PluginController.prototype._upgradeAllArticleToModuleConfig = function(a, b) {
  this._upgradeArticleToModuleConfig.call(this, a, b, Object.entries(a.list()), 0);
};
PluginController.prototype._upgradeArticleToModuleConfig = function(a, b, c, d) {
  if (d < c.length) {
    var e = this, f = c[d], g = f[0], h = f[1];
    if (1 === h.version) {
      if (h.involved) {
        f = Object.entries(h.involved).reduce(function(a, b) {
          a.sections[b[0]] = b[1];
          return a;
        }, ModuleConfig.create()), b.persist.call(b, f, g).then(function() {
          h.version = Artikel.VERSION;
          "function" === typeof h.clearInvolved && h.clearInvolved();
          return a.persist.call(a, h, g);
        }).then(function() {
          e._upgradeArticleToModuleConfig.call(e, a, b, c, d + 1, g);
        });
      } else {
        return console.log("The article does not have any involved data. Just update the version of the article and proceed to the next item."), h.version = Artikel.VERSION, a.persist.call(a, h, g).then(function() {
          e._upgradeArticleToModuleConfig.call(e, a, b, c, d + 1, g);
        });
      }
    } else {
      console.log("Skipping article because its at version %d", h.version), this._upgradeArticleToModuleConfig.call(this, a, b, c, d + 1, g);
    }
  } else {
    console.log("All articles updated");
  }
};
$jscomp.global.Object.defineProperties(PluginController.prototype, {upgrading:{configurable:!0, enumerable:!0, get:function() {
  return this._upgrading;
}}});
$jscomp.global.Object.defineProperties(PluginController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 4;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.App";
}}, CONFIGURATION_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.App.Configuration";
}}});
// Input 18
var ModuleController = function(a, b, c) {
  Controller.call(this, a, new BeteiligtRepository, b);
  this.document = a.document;
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
ModuleController.prototype.getFields = function(a) {
  var b = this;
  return a.config.editables.filter(function(a) {
    return "layout" === a.type && a.show;
  }).map(function(c) {
    return [{group:c.label, section:c.id, moduleId:"" + a.id, groupId:a.id + "." + c.id, fields:a.config.layouts[c.layout].fields.filter(b.isImportableField)}];
  });
};
ModuleController.prototype.getPropertyByName = function(a, b, c, d) {
  return this._getSectionByName(a, b).getByEditable(c);
};
ModuleController.prototype._getSectionByName = function(a, b) {
  switch(b) {
    case "ad":
      return a.sections.ad;
    case "illu":
      return a.sections.illu;
    case "onsite":
      return a.sections.onsite;
    case "photo":
      return a.sections.photo;
    case "text":
      return a.sections.text;
    case "video":
      return a.sections.video;
    default:
      throw "invalid configuration";
  }
};
ModuleController.prototype.getSharedName = function() {
  return ModuleController.SHARED_NAME;
};
$jscomp.global.Object.defineProperties(ModuleController, {ID:{configurable:!0, enumerable:!0, get:function() {
  return "module.beteiligt";
}}, VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt";
}}, SHARED_META:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.Meta";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.PropertyBag";
}}});
// Input 19
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
  var e = this, f = e.document.createElement("span"), g = a.config.editables.filter(function(a) {
    return a.type === b;
  });
  f.addClass(0 < g.length ? "show" : "hidden");
  f.innerHTML = e._createLabel(d);
  c.appendChild(f);
  g.map(function(b) {
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
  0 < g.length && e.nl(c);
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
// Input 20
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
BeteiligtBinding.getFieldMapping = function(a, b) {
  switch(a) {
    case "regular":
      switch(b.id) {
        case "field.deadline":
          return "duedate";
        case "field.a":
          return "fee";
        case "field.b":
          return "charges";
        case "field.c":
          return "project";
        default:
          return b.id.substr(b.id.indexOf(".") + 1);
      }case "ad":
      switch(b.id) {
        case "field.sujet":
          return "notes";
        default:
          return b.id.substr(b.id.indexOf(".") + 1);
      }case "blog":
      switch(b.id) {
        case "field.link":
          return "address";
        case "field.follower":
          return "social";
        default:
          return b.id.substr(b.id.indexOf(".") + 1);
      }default:
      return console.warn("No mapping for " + a + " and field " + b.id), b.id;
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
// Input 21
var ArtikelController = function(a, b, c, d) {
  Controller.call(this, a, c, b);
  this.document = a.document;
  this._entity = null;
  this._telephone = d;
  this.setVersionInfo();
};
$jscomp.inherits(ArtikelController, Controller);
ArtikelController.getOrCreateInstance = function(a, b, c) {
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
ArtikelController.prototype.getPropertyByName = function(a, b, c, d) {
  switch(c) {
    case "visual":
      return a.visual || d;
    case "form":
      return a.form || d;
    case "online":
      return a.tags || d;
    case "season":
      return a.season || d;
    case "region":
      return a.region || d;
    case "place":
      return a.location || d;
    case "field.a":
      return a.topic || d;
    case "field.b":
      return a.from || d;
    case "field.c":
      return a.author || d;
    case "field.d":
      return a.text || d;
    case "field.e":
      return a.pagina || d;
    case "field.f":
      return a.layout || d;
    case "field.g":
      return a.total || d;
    default:
      return a.hasOwnProperty(c), a[c];
  }
};
ArtikelController.prototype.list = function() {
  return this._repository.all();
};
ArtikelController.prototype.size = function() {
  return Object.keys(this.list()).length;
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
ArtikelController.prototype.getSharedName = function() {
  return ArtikelController.SHARED_NAME;
};
$jscomp.global.Object.defineProperties(ArtikelController, {ID:{configurable:!0, enumerable:!0, get:function() {
  return "module.artikel";
}}, VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Artikel";
}}, SHARED_META:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Meta";
}}});
// Input 22
var ModulePlanController = function(a, b, c) {
  Controller.call(this, a, new ModulePlanRepository, b);
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
  this.trelloApi.set("board", "shared", ModulePlanController.PROPERTY_BAG_NAME, this._propertyBag);
};
ModulePlanController.prototype.readPropertyBag = function() {
  var a = this;
  this.trelloApi.get("board", "shared", ModulePlanController.PROPERTY_BAG_NAME, {}).then(function(b) {
    a._propertyBag = b;
  });
};
ModulePlanController.prototype.getCapOnDepenses = function() {
  var a = this.getProperty("cap_on_depenses");
  return isNaN(a) ? null : parseFloat(a);
};
ModulePlanController.prototype.getPropertyByName = function(a, b, c, d) {
  switch(c) {
    case "field.a":
      return a.measures || d;
    case "field.b":
      return a.description || d;
    case "field.c":
      return a.fee || d;
    case "field.d":
      return a.projectFee || d;
    case "field.e":
      return a.thirdPartyCharges || d;
    case "field.f":
      return a.thirdPartyTotalCosts || d;
    case "field.g":
      return a = this.getCapOnDepenses(), isBlank(a) ? d : a;
    case "field.h":
      return a.totalCosts || d;
    case "visual":
      return a.visual || d;
    case "form":
      return a.form || d;
    case "online":
      return a.online || d;
    case "season":
      return a.season || d;
    case "region":
      return a.region || d;
    case "place":
      return a.place || d;
    default:
      return a.hasOwnProperty(c), a[c];
  }
};
ModulePlanController.prototype.persist = function(a, b) {
  return this.trelloApi.set(b || "card", "shared", ModulePlanController.SHARED_NAME, a);
};
ModulePlanController.prototype.remove = function() {
  var a = this;
  return this.trelloApi.remove("board", "shared", ModulePlanController.SHARED_NAME).then(function() {
    return a.trelloApi.remove("board", "shared", ModulePlanController.PROPERTY_BAG_NAME);
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
ModulePlanController.prototype.getSharedName = function() {
  return ModulePlanController.SHARED_NAME;
};
$jscomp.global.Object.defineProperties(ModulePlanController, {ID:{configurable:!0, enumerable:!0, get:function() {
  return "module.plan";
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan.PropertyBag";
}}});
// Input 23
var ModulePlanRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(ModulePlanRepository, Repository);
// Input 24
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
  this._initialized || (this._telephones = {}, this._telephones[ArtikelController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModuleController.SHARED_NAME] = this._createMessageChannel(), this._telephones[PluginController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModulePlanController.SHARED_NAME] = this._createMessageChannel(), this._pluginController = PluginController.getInstance(this._trello, this._window), this._articleController = ArtikelController.getOrCreateInstance(this._trello, 
  this._window, this._telephones[ArtikelController.SHARED_NAME].port2), this._moduleController = ModuleController.getInstance(this._trello, this._window, this._telephones[ModuleController.SHARED_NAME].port2), this._planController = ModulePlanController.getInstance(this._trello, this._window, this._telephones[ModulePlanController.SHARED_NAME].port2), this._excelService = new ExcelService, this._initialized = !0);
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
  return this._isModuleEnabled(ArtikelController.ID);
};
ClientManager.prototype.isBeteiligtModuleEnabled = function() {
  return this._isModuleEnabled(ModuleController.ID);
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
    case ArtikelController.ID:
      return this.getArticleController();
    case ModuleController.ID:
      return this.getModuleController();
    case ModulePlanController.ID:
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
ClientManager.prototype.getExcelService = function() {
  return this._excelService;
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
      return null !== b.getPlanController().getMapping(a, d, "main", null) && !0 === a.show;
    }).map(function(a) {
      return {text:a.label + ": " + b.getPlanController().getMapping(a, d, "main", "-"), color:a.color};
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
  return {id:ArtikelController.ID, shared:ArtikelController.SHARED_NAME, card:a, configuration:b.getModuleConfiguration(ArtikelController.ID), condition:b.isArticleModuleEnabled(), on:function() {
    var c = [], d = b.getArticleController().getByCard(a);
    b.getArticleController().hasContent(d) && c.push({text:"", icon:"./assets/ic_artikel.png"});
    return b.getModuleConfiguration(ArtikelController.ID).then(function(a) {
      return a.config.editables;
    }).filter(function(a) {
      return b.getArticleController().getMapping(a, d, "main", null) && !0 === a.show;
    }).map(function(a) {
      return {text:a.label + ": " + b.getArticleController().getMapping(a, d, "main", ""), color:a.color};
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
// Input 25
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
// Input 26
var PluginRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(PluginRepository, Repository);
$jscomp.global.Object.defineProperties(PluginRepository, {INSTANCE:{configurable:!0, enumerable:!0, get:function() {
  PluginRepository.instance || (PluginRepository.instance = new PluginRepository, PluginRepository.instance.add(new PluginModuleConfig(ArtikelController.ID, "Artikel", {sort:1, enabled:!1, icon:"ic_artikel.png", desc:"module.artikel.desc", editables:[{id:"visual", desc:"module.artikel.editable.desc", type:"select", label:"1.Liste", color:"blue", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"form", desc:"module.artikel.editable.desc", 
  type:"select", label:"2.Liste", color:"green", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"online", desc:"module.artikel.editable.desc", type:"select", label:"3.Liste", color:"yellow", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"season", desc:"module.artikel.editable.desc", type:"select", label:"4.Liste", color:"sky", show:!1, sortable:!1, visible:!0, values:["1.Begriff", 
  "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"region", desc:"module.artikel.editable.desc", type:"select", label:"5.Liste", color:"lime", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"place", desc:"module.artikel.editable.desc", type:"select", label:"6.Liste", color:"orange", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"field.a", desc:"module.artikel.field-a.desc", 
  type:"text", label:"Thema", placeholder:"Lauftext", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.artikel.field-b.desc", type:"text", label:"Input von", placeholder:"Name", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.c", desc:"module.artikel.field-c.desc", type:"text", label:"Textautor*in", placeholder:"Name", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.d", desc:"module.artikel.field-d.desc", type:"text", label:"Textbox", placeholder:"Lauftext", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"title", desc:"module.artikel.label.desc", type:"label", placeholder:"", label:"Artikel", visible:!0, title:"Modul-Titel"}, {id:"field.e", desc:"module.artikel.field-e.desc", type:"text", label:"Pagina", placeholder:"Zahl", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.f", desc:"module.artikel.field-f.desc", type:"text", label:"Seiten Layout", placeholder:"Zahl", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.g", 
  desc:"module.artikel.field-g.desc", type:"calc", label:"Seiten Total", placeholder:"Summe", show:!1, sortable:!1, visible:!0, color:"shades"}]}), {id:1}), PluginRepository.instance.add(new PluginModuleConfig(ModuleController.ID, "Beteiligt", {sort:3, enabled:!1, icon:"ic_beteiligt.png", desc:"module.beteiligt.desc", editables:[{id:"title", desc:"module.beteiligt.label.desc", type:"label", placeholder:"", label:"Beteiligt", title:"Modul-Titel"}, {id:"onsite", desc:"module.beteiligt.layout.onsite", 
  type:"layout", label:"1.Reiter", container:"pa.involved.onsite", layout:"regular", show:!0, title:"Reiter-Titel"}, {id:"text", desc:"module.beteiligt.layout.text", type:"layout", label:"2.Reiter", container:"pa.involved.text", layout:"regular", show:!0}, {id:"photo", desc:"module.beteiligt.layout.photo", type:"layout", label:"3.Reiter", container:"pa.involved.photo", layout:"regular", show:!0}, {id:"video", desc:"module.beteiligt.layout.video", type:"layout", label:"4.Reiter", container:"pa.involved.video", 
  layout:"regular", show:!0}, {id:"illu", desc:"module.beteiligt.layout.illu", type:"layout", label:"5.Reiter", container:"pa.involved.illu", layout:"regular", show:!0}, {id:"ad", desc:"module.beteiligt.layout.ad", type:"layout", label:"6.Reiter", container:"pa.involved.ad", layout:"regular", show:!0}], layouts:{regular:{desc:"module.beteiligt.regular.desc", label:"Kontakt", fields:[{id:"field.name", desc:"module.beteiligt.field-name.desc", type:"text", label:"Name", placeholder:"eintippen\u2026", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.social", desc:"module.beteiligt.field-social.desc", type:"text", label:"Telefon.Mail.Webseite", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.address", desc:"module.beteiligt.field-address.desc", type:"text", label:"Adresse", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.notes", desc:"module.beteiligt.field-notes.desc", type:"text", label:"Notizen", 
  placeholder:"formulieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.deadline", desc:"module.beteiligt.field-deadline.desc", type:"text", label:"Deadline", placeholder:"bestimmen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.a", desc:"module.beteiligt.field-a.desc", type:"text", label:"Honorar Massnahme", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.beteiligt.field-b.desc", type:"text", 
  label:"Spesen Massnahme", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.c", desc:"module.beteiligt.field-c.desc", type:"calc", label:"Total Beteiligte", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}, ad:{desc:"module.beteiligt.special.desc", label:"Inserat", fields:[{id:"field.sujet", desc:"module.beteiligt.field-sujet.desc", type:"text", label:"Kunde.Sujet", placeholder:"Name.Stichwort\u2026", show:!1, sortable:!1, visible:!0, 
  color:"shades"}, {id:"field.format", desc:"module.beteiligt.field-format.desc", type:"text", label:"Format", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.placement", desc:"module.beteiligt.field-placement.desc", type:"text", label:"Platzierung", placeholder:"vormerken\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.price", desc:"module.beteiligt.field-price.desc", type:"text", label:"Preis CHF", placeholder:"bestimmen\u2026", 
  show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.total", desc:"module.beteiligt.field-total.desc", type:"text", label:"Total", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.name", desc:"module.beteiligt.field-name.desc", type:"text", label:"Kontakt", placeholder:"eintippen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.social", desc:"module.beteiligt.field-social.desc", type:"text", label:"Telefon.Mail.Webseite", placeholder:"notieren\u2026", 
  show:!1, sortable:!1, color:"shades"}, {id:"field.address", desc:"module.beteiligt.field-address.desc", type:"text", label:"Adresse", placeholder:"festhalten\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}, blog:{desc:"module.beteiligt.blog.desc", label:"Blog", fields:[{id:"field.link", desc:"module.beteiligt.field-link.desc", type:"text", label:"Link", placeholder:"hinterlegen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.notes", desc:"module.beteiligt.field-notes.desc", 
  type:"text", label:"Notiz", placeholder:"hinterlegen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.follower", desc:"module.beteiligt.field-follower.desc", type:"text", label:"Follower.Fans.Abos", placeholder:"eintippen\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.date", desc:"module.beteiligt.field-date.desc", type:"text", label:"Stand.Datum", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}}}), {id:2}), PluginRepository.instance.add(new PluginModuleConfig(ModulePlanController.ID, 
  "Plan", {sort:2, enabled:!1, icon:"ic_plan.png", desc:"module.plan.desc", editables:[{id:"visual", desc:"module.plan.editable.desc", type:"select", label:"1.Liste", color:"blue", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff", "4.Begriff", "5.Begriff"]}, {id:"form", desc:"module.plan.editable.desc", type:"select", label:"2.Liste", color:"green", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff", "3.Begriff"]}, {id:"online", desc:"module.plan.editable.desc", 
  type:"select", label:"3.Liste", color:"yellow", show:!1, sortable:!1, visible:!0, values:"1.Begriff 2.Begriff 3.Begriff 4.Begriff 5.Begriff 6.Begriff 7.Begriff".split(" ")}, {id:"season", desc:"module.plan.editable.desc", type:"select", label:"4.Liste", color:"sky", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff"]}, {id:"region", desc:"module.plan.editable.desc", type:"select", label:"5.Liste", color:"lime", show:!1, sortable:!1, visible:!0, values:["1.Begriff", "2.Begriff"]}, 
  {id:"place", desc:"module.plan.editable.desc", type:"select", label:"6.Liste", color:"orange", show:!1, sortable:!1, visible:!0, values:"1.Begriff 2.Begriff 3.Begriff 4.Begriff 5.Begriff 6.Begriff 7.Begriff".split(" ")}, {id:"field.a", desc:"module.plan.field-a.desc", type:"text", label:"Massnahmen", placeholder:"notieren\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.b", desc:"module.plan.field-b.desc", type:"text", label:"Beschreibung", placeholder:"notieren\u2026", show:!1, 
  sortable:!1, visible:!0, color:"shades"}, {id:"title", desc:"module.plan.label.desc", type:"label", placeholder:"", label:"Plan", title:"Modul-Titel", visible:!0}, {id:"field.c", desc:"module.plan.field-c.desc", type:"calc", label:"Total Honorar Beteiligte", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.d", desc:"module.plan.field-d.desc", type:"calc", label:"Total Honorar Projekt", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.e", 
  desc:"module.plan.field-e.desc", type:"calc", label:"Total Spesen Beteiligte", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.f", desc:"module.plan.field-f.desc", type:"calc", label:"Total Spesen Projekt", placeholder:"", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.g", desc:"module.plan.field-g.desc", type:"text", label:"Kostendach Projekt\u2026", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}, {id:"field.h", desc:"module.plan.field-h.desc", 
  type:"calc", label:"Total Projekt", placeholder:"Betrag\u2026", show:!1, sortable:!1, visible:!0, color:"shades"}]}), {id:3}));
  return PluginRepository.instance;
}}});
PluginRepository.instance = null;
// Input 27
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
// Input 28
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
// Input 29
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
// Input 30
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
// Input 31
var AbstractField = function(a, b, c, d) {
  d = void 0 === d ? !1 : d;
  this._name = a;
  this._reference = b;
  this._source = c;
  this._type = this.getType();
  this._multi = d || !1;
};
AbstractField.prototype.getValue = function(a) {
};
AbstractField.prototype.getType = function() {
};
$jscomp.global.Object.defineProperties(AbstractField.prototype, {multi:{configurable:!0, enumerable:!0, get:function() {
  return this._multi;
}, set:function(a) {
  this._multi = a;
}}, source:{configurable:!0, enumerable:!0, get:function() {
  return this._source;
}}, reference:{configurable:!0, enumerable:!0, get:function() {
  return this._reference;
}, set:function(a) {
  this._reference = a;
}}, name:{configurable:!0, enumerable:!0, get:function() {
  return this._name;
}, set:function(a) {
  this._name = a;
}}});
// Input 32
var AdminService = function(a, b) {
  this.trelloClient = a;
  this.fileReader = new FileReader;
  this.clientManager = ClientManager.getInstance(window);
  this.articleController = this.clientManager.getArticleController();
  this.planController = this.clientManager.getPlanController();
  this.moduleController = this.clientManager.getModuleController();
  this.excelService = this.clientManager.getExcelService();
  this._loggingService = b;
  this._context = null;
};
AdminService.prototype.getLabels = function() {
  return this.trelloClient.getLabels();
};
AdminService.prototype.hasLabel = function(a, b) {
  return this.trelloClient.getLabels().map(function(c) {
    return c.name === a && c.color === b;
  }).reduce(function(a, b) {
    return a | b;
  });
};
AdminService.prototype.load = function(a) {
  var b = this, c = [];
  if (0 < a.length) {
    for (var d = {$jscomp$loop$prop$index$1:0}; d.$jscomp$loop$prop$index$1 < a.length; d = {$jscomp$loop$prop$index$1:d.$jscomp$loop$prop$index$1}, d.$jscomp$loop$prop$index$1++) {
      c.push(new Promise(function(c) {
        return function(d, e) {
          var f = a.item(c.$jscomp$loop$prop$index$1);
          b._loggingService.i("Processing file " + f.name);
          b.fileReader.onload = function(a) {
            b._loadContent(a.target.result).then(function(a) {
              a ? (b._loggingService.i("File " + f.name + " loaded successfully"), d({file:f, model:a})) : (b._loggingService.i("Fehler beim Einlesen der Datei \u00ab" + f.name + "\u00bb"), e("Fehler beim Einlesen der Datei \u00ab" + f.name + "\u00bb"));
            });
          };
          window.setTimeout(function() {
            b.fileReader.readAsArrayBuffer(f);
          }, 10);
        };
      }(d)));
    }
  }
  return 0 === c.length ? Promise.reject("No imports") : Promise.all(c);
};
AdminService.prototype.getCurrentCard = function() {
  return this.trelloClient.getCurrentCard();
};
AdminService.prototype.getBoardCards = function() {
  return this.trelloClient.getAllBoardCards();
};
AdminService.prototype.getListById = function(a) {
  return this.trelloClient.getListById(a);
};
AdminService.prototype.uploadFileToCard = function(a, b) {
  var c = this;
  return c.trelloClient.getCurrentMember().then(function(d) {
    return c.trelloClient.attachFile(a, b, d.username);
  });
};
AdminService.prototype._loadContent = function(a) {
  return Promise.resolve(this.excelService.read(a));
};
AdminService.prototype.importCards = function(a, b) {
  var c = this;
  return c.trelloClient.createLabels(this._getLabels(b)).then(function(d) {
    c._loggingService.d("Die Labels (" + d.map(function(a) {
      return a.name;
    }).join(",") + ") sind nun verf\u00fcgbar");
    b.labels = d;
    return c._importCard(a, 0, b);
  });
};
AdminService.prototype._importCard = function(a, b, c) {
  var d = this;
  if (b < a.data.length) {
    return d._createCard(a.data[b], c).then(function(e) {
      return new Promise(function(e, g) {
        g = Math.min((b + 1.0) / Math.max(1.0, a.data.length) * 100, 100.0).toFixed(2) + "%";
        d.context.each.apply(d.context.context, [b + 1, a.data.length, "Eintr\u00e4ge importiert...", g]);
        e(d._importCard(a, b + 1, c));
      });
    });
  }
  this._loggingService.d("Insgesamt wurden " + this.trelloClient.requests + " Anfragen an Trello geschickt");
  return Promise.resolve(!0);
};
AdminService.prototype._createCard = function(a, b) {
  var c = this, d = a.get(c._getList(b).source).value.v;
  return c.trelloClient.findListByName(d).reduce(function(a, b) {
    return a || b;
  }, null).then(function(e) {
    if (null == e) {
      return c._loggingService.i("Liste \u00ab" + d + "\u00bb wird erstellt"), c.trelloClient.createList(d).then(function(d) {
        return c._createCardInternal(d, a, b);
      });
    }
    c._loggingService.i("Liste \u00ab" + d + "\u00bb exisitert bereits");
    return c._createCardInternal(e, a, b);
  }).catch(function(a) {
    c._loggingService.e("Fehler beim Importieren in die Liste \u00ab" + d + "\u00bb (" + a + ")");
    return !1;
  });
};
AdminService.prototype._createCardInternal = function(a, b, c) {
  var d = this, e = c.labels.filter(function(a) {
    return 1 === c.get("trello.labels").filter(function(b) {
      return a.name === b.name;
    }).filter(function(a) {
      return a.getValue(b.get(a.source));
    }).length;
  }), f = this._getFieldValue(b, "trello.title", c), g = this._getFieldValue(b, "trello.description", c), h = this._getFieldValue(b, "trello.duedate", c), k = this._getFieldValue(b, "trello.members", c) || [];
  return d.trelloClient.findCardByTitle(f, a).then(function(b) {
    if (b) {
      return d._loggingService.i("Trello Card \u00ab" + f + "\u00bb ist bereits in \u00ab" + a.id + "\u00bb vorhanden"), b;
    }
    b = k.map(function(a, b, c) {
      return d.trelloClient.searchMember(a).catch(function(b) {
        d._loggingService.e("Mitglied f\u00fcr \u00ab" + a + "\u00bb nicht gefunden (" + b + ")");
        return [];
      });
    }).reduce(function(a, b) {
      a.push(b);
      return a;
    }, []);
    return Promise.all(b).then(function(a) {
      return a.flatMap(function(a) {
        return a;
      });
    }).then(function(b) {
      return d.trelloClient.createCard(f, g, a.id, e.map(function(a) {
        return a.id;
      }).join(","), isBlank(h) ? null : h.toISOString(), b.map(function(a) {
        return a.id;
      }).join(","));
    });
  }).then(function(a) {
    return Promise.resolve([]).then(function(e) {
      return d._doImportArtikel(b, c, a).then(function(a) {
        e.push({id:ArtikelController.ID, card:f, success:!!a});
        return e;
      });
    }).then(function(e) {
      return d._doImportPlan(b, c, a).then(function(a) {
        e.push({id:ModulePlanController.ID, card:f, success:!!a});
        return e;
      });
    }).then(function(e) {
      return d._doImportBeteiligt(b, c, a).then(function(a) {
        e.push({id:ModuleController.ID, card:f, success:!!a});
        return e;
      });
    });
  });
};
AdminService.prototype._doImportPlan = function(a, b, c) {
  var d = this;
  return d.clientManager.isPlanModuleEnabled().then(function(e) {
    if (e) {
      var f = d._getFieldValue(a, "module.plan.visual", b), g = d._getFieldValue(a, "module.plan.form", b), h = d._getFieldValue(a, "module.plan.online", b), k = d._getFieldValue(a, "module.plan.season", b), l = d._getFieldValue(a, "module.plan.region", b), m = d._getFieldValue(a, "module.plan.place", b), q = d._getFieldValue(a, "module.plan.field.a", b), n = d._getFieldValue(a, "module.plan.field.b", b), p = d._getFieldValue(a, "module.plan.field.g", b);
      return d.clientManager.getModuleConfiguration(ModulePlanController.ID).then(function(a) {
        return new Plan(null, q, n, 0, 0, 0, 0, p, 0, a.getEditableOptionValue("visual", f), a.getEditableOptionValue("form", g), a.getEditableOptionValue("online", h), a.getEditableOptionValue("season", k), a.getEditableOptionValue("region", l), a.getEditableOptionValue("place", m));
      }).then(function(a) {
        d._loggingService.d("Plan wird angelegt in Card \u00ab" + c.id + "\u00bb");
        d._loggingService.t(">> " + JSON.stringify(a));
        return d.planController.persist(a, c.id).then(function() {
          d._loggingService.i("Plan erstellt in Trello Card \u00ab" + c.id + "\u00bb");
          return a;
        });
      });
    }
    d._loggingService.d("Plan Module ist deaktiviert");
    return !1;
  }).catch(function(a) {
    d._loggingService.e("Fehler beim Speichern von Plan in Card \u00ab" + c.id + "\u00bb (" + a + ")");
    return !1;
  });
};
AdminService.prototype._doImportArtikel = function(a, b, c) {
  var d = this;
  return d.clientManager.isArticleModuleEnabled().then(function(e) {
    if (e) {
      var f = d._getFieldValue(a, "module.artikel.field.a", b), g = d._getFieldValue(a, "module.artikel.field.b", b), h = d._getFieldValue(a, "module.artikel.field.c", b), k = d._getFieldValue(a, "module.artikel.field.d", b), l = d._getFieldValue(a, "module.artikel.field.e", b), m = d._getFieldValue(a, "module.artikel.field.f", b), q = d._getFieldValue(a, "module.artikel.online", b), n = d._getFieldValue(a, "module.artikel.visual", b), p = d._getFieldValue(a, "module.artikel.region", b), r = d._getFieldValue(a, 
      "module.artikel.season", b), t = d._getFieldValue(a, "module.artikel.form", b), u = d._getFieldValue(a, "module.artikel.place", b);
      return d.clientManager.getModuleConfiguration(ArtikelController.ID).then(function(a) {
        return new Artikel(null, f, l, g, m, 1, a.getEditableOptionValue("online", q), a.getEditableOptionValue("visual", n), a.getEditableOptionValue("region", p), a.getEditableOptionValue("season", r), h, k, a.getEditableOptionValue("form", t), u);
      }).then(function(a) {
        d._loggingService.d("Artikel wird angelegt in Card \u00ab" + c.id + "\u00bb");
        d._loggingService.t(">> " + JSON.stringify(a));
        return d.articleController.persist(a, c.id).then(function() {
          d._loggingService.i("Artikel erstellt in Trello Card \u00ab" + c.id + "\u00bb");
          return a;
        });
      });
    }
    d._loggingService.d("Artikel Module ist deaktiviert");
    return !1;
  }).catch(function(a) {
    d._loggingService.e("Fehler beim Speichern des Artikels in Card \u00ab" + c.id + "\u00bb (" + a + ")");
    return !1;
  });
};
AdminService.prototype._doImportBeteiligt = function(a, b, c) {
  var d = this;
  return d.clientManager.isBeteiligtModuleEnabled().then(function(e) {
    return e ? d.clientManager.getModuleConfiguration(ModuleController.ID).then(function(e) {
      var f = ModuleConfig.create({}, null), h = {onsite:e.getEditableLayout("onsite").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("onsite").layout, c)] = d._getFieldValue(a, "module.beteiligt.onsite." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {}), text:e.getEditableLayout("text").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("text").layout, c)] = d._getFieldValue(a, "module.beteiligt.text." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {}), photo:e.getEditableLayout("photo").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("photo").layout, c)] = d._getFieldValue(a, "module.beteiligt.photo." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {}), video:e.getEditableLayout("video").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("video").layout, c)] = d._getFieldValue(a, "module.beteiligt.video." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {}), illu:e.getEditableLayout("illu").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("illu").layout, c)] = d._getFieldValue(a, "module.beteiligt.illu." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {}), ad:e.getEditableLayout("ad").fields.map(function(c) {
        var f = {};
        f[BeteiligtBinding.getFieldMapping(e.getEditable("ad").layout, c)] = d._getFieldValue(a, "module.beteiligt.ad." + c.id, b);
        return f;
      }).reduce(Reducers.asKeyValue, {})};
      f.sections = h;
      d._loggingService.d("Beteiligt wird angelegt in Card \u00ab" + c.id + "\u00bb");
      d._loggingService.t(">> " + JSON.stringify(f));
      return d.moduleController.persist(f, c.id).then(function() {
        d._loggingService.i("Beteiligt erstellt in Trello Card \u00ab" + c.id + "\u00bb");
        return !0;
      });
    }) : !1;
  }).catch(function(a) {
    d._loggingService.e("Fehler beim Speichern von Beteiligt in Card \u00ab" + c.id + "\u00bb (" + a + ")");
  });
};
AdminService.prototype._getField = function(a, b) {
  return b.single(a);
};
AdminService.prototype._getLabels = function(a) {
  return a.get("trello.labels");
};
AdminService.prototype._getList = function(a) {
  return a.single("trello.list");
};
AdminService.prototype._getFieldValue = function(a, b, c) {
  return (b = this._getField(b, c)) && a.get(b.source) ? b.getValue(a.get(b.source)) : null;
};
$jscomp.global.Object.defineProperties(AdminService.prototype, {context:{configurable:!0, enumerable:!0, set:function(a) {
  this._context = a;
}, get:function() {
  return this._context;
}}});
// Input 33
var ImportFieldMapping = function(a, b, c, d) {
  FieldMapping.call(this, a, b, c);
  this.header = d;
};
$jscomp.inherits(ImportFieldMapping, FieldMapping);
ImportFieldMapping.prototype.mapMember = function(a) {
  return a.fullName + " (" + a.username + ")";
};
ImportFieldMapping.prototype.labelFilter = function(a, b) {
  return a.name === this.header.label && a.color === this.header.color;
};
ImportFieldMapping.prototype.mapLabel = function(a, b) {
  return a.name + " (" + a.color + ")";
};
ImportFieldMapping.prototype.emptyValue = function() {
  return "&nbsp;";
};
ImportFieldMapping.prototype.mapArray = function(a) {
  return a.join("<br/>");
};
ImportFieldMapping.prototype.mapMembers = function(a) {
  return a;
};
// Input 34
var HeaderNode = function(a, b, c, d, e) {
  d = void 0 === d ? [] : d;
  this._parent = a;
  this._label = b;
  this._children = [];
  this._properties = [];
  this._address = c ? {c:c.c, r:c.r, constant:c.constant} : null;
  this._comments = d ? d : [];
  this._color = e;
};
HeaderNode.create = function(a) {
  return a ? new HeaderNode(null, JsonSerialization.getProperty(a, "label"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "comments"), JsonSerialization.getProperty(a, "color")) : null;
};
HeaderNode.prototype.isSameAddress = function(a) {
  return a ? a.c === this.address.c && a.r === this.address.r : !1;
};
HeaderNode.prototype.getAddressAsText = function() {
  return XLSX.utils.encode_cell(this.address);
};
HeaderNode.prototype.getComment = function(a) {
  return this.comments.length > a ? this.comments[a] : null;
};
HeaderNode.prototype.add = function(a) {
  this.children.push(a);
};
HeaderNode.prototype.addAll = function(a) {
  var b = this;
  a && Array.isArray(a) && a.forEach(function(a) {
    return b.add(a);
  });
};
HeaderNode.prototype.get = function(a) {
  return this.children[a];
};
HeaderNode.prototype.put = function(a) {
  -1 === this.properties.indexOf(a) && this.properties.push(a);
};
HeaderNode.prototype.hasChildren = function() {
  return 0 < this._children.length;
};
HeaderNode.prototype.hasParent = function() {
  return null != this.parent;
};
HeaderNode.prototype.getPath = function() {
  return this.hasParent() ? this.parent.getPath() + " \u00bb " + this.label : this.label;
};
HeaderNode.prototype.getPathItems = function() {
  var a = [];
  this.hasParent() && this.parent.getPathItems().forEach(function(b) {
    a.push(b);
  });
  a.push(this);
  return a;
};
$jscomp.global.Object.defineProperties(HeaderNode.prototype, {address:{configurable:!0, enumerable:!0, get:function() {
  return this._address;
}}, parent:{configurable:!0, enumerable:!0, get:function() {
  return this._parent;
}}, children:{configurable:!0, enumerable:!0, get:function() {
  return this._children;
}}, properties:{configurable:!0, enumerable:!0, get:function() {
  return this._properties;
}}, label:{configurable:!0, enumerable:!0, get:function() {
  return this._label;
}, set:function(a) {
  this._label = a;
}}, comments:{configurable:!0, enumerable:!0, get:function() {
  return this._comments;
}}, color:{configurable:!0, enumerable:!0, get:function() {
  if (isBlank(this._color)) {
    var a = this.getComment(0);
    return isBlank(a) ? null : a.t.toLowerCase().trim();
  }
  return this._color;
}, set:function(a) {
  this._color = a;
}}});
// Input 35
var ArrayField = function(a) {
  AbstractField.apply(this, arguments);
};
$jscomp.inherits(ArrayField, AbstractField);
ArrayField.getArrayValue = function(a) {
  return a.split(",");
};
ArrayField.prototype.getValue = function(a) {
  return ArrayField.getArrayValue(a.value.v);
};
ArrayField.prototype.getType = function() {
  return "array";
};
// Input 36
var BooleanField = function(a) {
  AbstractField.apply(this, arguments);
};
$jscomp.inherits(BooleanField, AbstractField);
BooleanField.getBooleanValue = function(a) {
  return "0" != a;
};
BooleanField.prototype.getValue = function(a) {
  return a && a.value ? BooleanField.getBooleanValue(a.value.v) : !1;
};
BooleanField.prototype.getType = function() {
  return "boolean";
};
// Input 37
var DateField = function(a) {
  AbstractField.apply(this, arguments);
};
$jscomp.inherits(DateField, AbstractField);
DateField.getDateOf = function(a) {
  a = parseFloat(a);
  return isNaN(a) ? null : (a = XLSX.SSF.parse_date_code(a), new Date(a.y, a.m - 1, a.d, a.H, a.M, a.S));
};
DateField.prototype.getValue = function(a) {
  return DateField.getDateOf(parseFloat(a.value.v));
};
DateField.prototype.getType = function() {
  return "date";
};
// Input 38
var DataNode = function(a) {
  this._row = a;
  this._values = [];
};
DataNode.prototype.set = function(a, b) {
  this._values.push({header:a, value:b});
};
DataNode.prototype.get = function(a) {
  return this._values.find(function(b) {
    return b.header.isSameAddress(a.address);
  });
};
$jscomp.global.Object.defineProperties(DataNode.prototype, {row:{configurable:!0, enumerable:!0, get:function() {
  return this._row;
}}, values:{configurable:!0, enumerable:!0, get:function() {
  return this._values;
}}});
// Input 39
var Import = function(a) {
  this._title = a;
  this._header = null;
  this._data = [];
};
Import.create = function(a, b) {
  a = new Import(a);
  if (b) {
    b = JsonSerialization.getProperty(b, "header");
    var c = new HeaderNode(null, b._label, b._address, b._comments, b._color);
    c.addAll(b._children.map(function(a) {
      return new HeaderNode(c, a._label, a._address, a._comments, a._color);
    }));
    a.header = c;
  }
  return a;
};
Import.prototype.getHeader = function(a) {
  var b = this.getHeaders(this.header);
  return Object.entries(b).filter(function(b) {
    return XLSX.utils.decode_cell(b[0]).c === a.c;
  }).map(function(a) {
    return a[1];
  })[0];
};
Import.prototype.getHeaders = function(a) {
  var b = this, c = {};
  a.children.forEach(function(a) {
    a.hasChildren() ? Object.entries(b.getHeaders(a)).forEach(function(a) {
      c[a[0]] = a[1];
    }) : a.address.hasOwnProperty("c") && a.address.hasOwnProperty("r") ? c[XLSX.utils.encode_cell(a.address)] = a : a.address.hasOwnProperty("constant") && (c[XLSX.utils.encode_cell(a.address)] = a.address.constant);
  });
  return c;
};
Import.prototype.getNormalizedHeaders = function() {
  return this.getHeaders(this.header);
};
Import.prototype.put = function(a) {
  this.data.push(a);
};
Import.prototype.insertAt = function(a, b) {
  var c = this.getHeader(a.address).parent, d = c.children.findIndex(function(b) {
    return b.isSameAddress(a.address);
  });
  -1 !== d && c.children.splice(d + 1, 0, b);
};
Import.prototype.getSample = function(a) {
  return 0 < this.data.length ? Promise.resolve(this.data[0].get(a)) : Promise.resolve(null);
};
Import.prototype.getSampleText = function(a, b) {
  if (b && a) {
    return b.getValue(a);
  }
  if (a && a.value) {
    switch(b = a.value.v, a.value.t) {
      case "b":
        return !0 === b ? "An" : "Aus";
      case "e":
        return "Ung\u00fcltiger Wert";
      case "n":
        return a.value.w ? a.value.w : b;
      case "d":
        return b.toISOString();
      case "s":
        return a.value.w ? a.value.w : b;
      default:
        return a.value.w ? a.value.w : b;
    }
  } else {
    return "";
  }
};
Import.prototype.getSampleHtml = function(a, b, c) {
  return (c = void 0 === c ? null : c) && a ? this._getHtml(c.getValue(a), b) : a && a.value ? this._getSampleHtml(a, a.value.v, a.value.t, b) : "<p>&nbsp;</p>";
};
Import.prototype._getSampleHtml = function(a, b, c, d) {
  switch(c) {
    case "b":
      return this._getHtml(b, d);
    case "e":
      return "Ung\u00fcltiger Wert";
    case "n":
      return this._getHtml(a.value.w ? a.value.w : b, d);
    case "d":
      return this._getHtml(b, d);
    case "s":
      return this._getHtml(this.getSampleText(a), d);
    default:
      return this._getHtml(a.value.w ? a.value.w : b, d);
  }
};
Import.prototype._getHtml = function(a, b) {
  var c = this;
  return "boolean" === typeof a ? this._getSwitch(a, b) : a instanceof Date ? this._getDateTime(a) : isNumber(a) ? a : Array.isArray(a) ? a.map(function(a) {
    return c._getHtml(a, b);
  }).reduce(function(a, b) {
    return a + b;
  }, "") : null !== a ? '<p class="nobreak" title="' + a + '">' + a + "</p>" : "<p>&nbsp;</p>";
};
Import.prototype._getDateTime = function(a) {
  var b = a instanceof Date ? a : DateField.getDateOf(a);
  return b ? b.toLocaleDateString() : a;
};
Import.prototype._getSwitch = function(a, b) {
  a = "boolean" === typeof a ? a : BooleanField.getBooleanValue(a);
  b = new SwitchItem(b, "", a, !0);
  b.additionalStyles = "borderless";
  return b.render().innerHTML;
};
$jscomp.global.Object.defineProperties(Import.prototype, {data:{configurable:!0, enumerable:!0, get:function() {
  return this._data;
}, set:function(a) {
  this._data = a;
}}, header:{configurable:!0, enumerable:!0, get:function() {
  return this._header;
}, set:function(a) {
  this._header = a;
}}, title:{configurable:!0, enumerable:!0, get:function() {
  return this._title;
}, set:function(a) {
  this._title = a;
}}});
// Input 40
var DataConfiguration = function() {
  this._mapping = [];
  this._labels = [];
};
DataConfiguration.create = function(a) {
  var b = new DataConfiguration;
  a && (b.mapping = JsonSerialization.getProperty(a, "mapping").map(function(a) {
    switch(JsonSerialization.getProperty(a, "type")) {
      case "date":
        return new DateField(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "reference"), HeaderNode.create(JsonSerialization.getProperty(a, "source")));
      case "text":
        return new TextField(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "reference"), HeaderNode.create(JsonSerialization.getProperty(a, "source")));
      case "boolean":
        return new BooleanField(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "reference"), HeaderNode.create(JsonSerialization.getProperty(a, "source")));
      case "array":
        return new ArrayField(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "reference"), HeaderNode.create(JsonSerialization.getProperty(a, "source")));
      default:
        return null;
    }
  }), b.labels = JsonSerialization.getProperty(a, "labels"));
  return b;
};
DataConfiguration.prototype.isValid = function() {
  return 0 === this.getValidationErrors().length;
};
DataConfiguration.prototype.getValidationErrors = function() {
  var a = [], b = this.single("trello.list");
  null !== b && null !== b.source || a.push({id:"validation.error.trello-list", details:""});
  b = Object.entries(this.mapping.filter(function(a) {
    return !a.multi;
  }).map(function(a) {
    return a.reference;
  }).reduce(Reducers.asOccurrenceMap, {})).filter(function(a) {
    return "-1" !== a[0] && 1 < a[1];
  });
  0 < b.length && a.push({id:"validation.error.multiple-mapping", details:"" + b.map(function(a) {
    return a[0];
  }).join(",")});
  return a;
};
DataConfiguration.prototype.get = function(a) {
  return this.mapping.filter(function(b) {
    return b.reference === a;
  });
};
DataConfiguration.prototype.single = function(a) {
  return (a = this.get(a)) && 1 === a.length ? a[0] : null;
};
DataConfiguration.prototype.findByAddress = function(a) {
  return this.mapping.filter(function(b) {
    return b.source.isSameAddress(a);
  }).reduce(function(a, c) {
    return c;
  }, null);
};
$jscomp.global.Object.defineProperties(DataConfiguration.prototype, {labels:{configurable:!0, enumerable:!0, get:function() {
  return this._labels;
}, set:function(a) {
  this._labels = a;
}}, mapping:{configurable:!0, enumerable:!0, get:function() {
  return this._mapping;
}, set:function(a) {
  this._mapping = a;
}}});
// Input 41
var TextField = function(a) {
  AbstractField.apply(this, arguments);
};
$jscomp.inherits(TextField, AbstractField);
TextField.prototype.getValue = function(a) {
  return a.value.v;
};
TextField.prototype.getType = function() {
  return "text";
};
// Input 42
var AdminController = function(a, b, c, d) {
  this._trello = a;
  this._adminService = b;
  this._document = c;
  this._clientManager = ClientManager.getInstance(window);
  this._pluginController = this._clientManager.getPluginController();
  this._model = null;
  this._propertyBag = {};
  this._loggingService = d;
  this._files = [];
};
AdminController.create = function(a, b, c, d) {
  return new AdminController(a, c, b, d);
};
AdminController.prototype.render = function(a) {
  this._context = a.page || "home";
  return "import" === this._context ? this.importPage(a.configuration) : "export" === this._context ? this.exportPage(a) : "error" === this._context ? this.errorPage(a.error, a.error_details) : "progress" === this._context ? this.progressPage() : this.homePage();
};
AdminController.prototype.errorPage = function(a, b) {
  var c = this, d = createByTemplate(template_admin_errorpage, template_admin_errorpage);
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.appendChild(d);
  });
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.removeClass("hidden");
  });
  this._showErrors(d, "<h5>" + a + "</h5><p>" + b + "</p>");
  this._document.querySelector("#btn-reset").setEventListener("click", function(a) {
    c._pluginController.resetAdminConfiguration();
  });
  return Promise.resolve(!0);
};
AdminController.prototype.homePage = function() {
  var a = this, b = createByTemplate(template_admin_actions, template_admin_actions);
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.appendChild(b);
  });
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.removeClass("hidden");
  });
  this._document.querySelector("#btn-action-import").setEventListener("click", function(b) {
    b.preventDefault();
    b.stopPropagation();
    a._trello.closeModal();
    a._trello.modal({title:"Administration - Import", url:"admin.html", accentColor:"blue", fullscreen:!0, actions:[{icon:"./assets/ic_arrow_back.png", callback:function(a) {
      a.modal({title:"Administration", url:"admin.html", accentColor:"blue"});
    }, alt:"Zur\u00fcck", position:"left"}], args:{page:"import"}});
  });
  this._document.querySelector("#btn-action-export").setEventListener("click", function(b) {
    b.preventDefault();
    b.stopPropagation();
    a._trello.closeModal();
    a._trello.modal({title:"Administration - Export", url:"admin.html", accentColor:"blue", fullscreen:!0, actions:[{icon:"./assets/ic_arrow_back.png", callback:function(a) {
      a.modal({title:"Administration", url:"admin.html", accentColor:"blue"});
    }, alt:"Zur\u00fcck", position:"left"}], args:{page:"export"}});
  });
  return Promise.resolve(!0);
};
AdminController.prototype.exportPage = function(a) {
  return (new ExportController(this._trello, this._document, this._adminService, this._loggingService)).render(a);
};
AdminController.prototype.importPage = function(a) {
  this._model = null;
  var b = createByTemplate(template_admin_import, template_admin_import);
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.appendChild(b);
  });
  this._clearContent();
  return this.renderActions(a).then(function(a) {
    a = Import.create("Sample", SAMPLE_IMPORT);
    var b = new DataNode(1), c = a.header;
    b.set(c.get(0), {v:"Test Liste", t:"s"});
    b.set(c.get(1), {v:43830, w:"31/12/2019", t:"n"});
    b.set(c.get(2), {v:"me@m3ns1.com", t:"s"});
    b.set(c.get(3), {v:"", t:"n"});
    b.set(c.get(4), {v:1, t:"n"});
    b.set(c.get(5), {v:1, t:"n"});
    b.set(c.get(6), {v:1, t:"n"});
    b.set(c.get(7), {v:1, t:"n"});
    b.set(c.get(8), {v:1, t:"n"});
    b.set(c.get(9), {v:1, t:"n"});
    b.set(c.get(10), {v:1, t:"n"});
    b.set(c.get(11), {v:1, t:"n"});
    b.set(c.get(12), {v:1, t:"n"});
    b.set(c.get(13), {v:"A cocktail a day", t:"s"});
    b.set(c.get(14), {v:"https://a-cocktail-a-day.com/", t:"s"});
    b.set(c.get(15), {v:"3.Begriff", t:"s"});
    b.set(c.get(16), {v:"", t:"s"});
    b.set(c.get(17), {v:"", t:"s"});
    b.set(c.get(18), {v:"", t:"s"});
    b.set(c.get(19), {v:"", t:"s"});
    b.set(c.get(20), {v:"Blog zum Thema: Reisen, Lifestyle, Fliegen", t:"s"});
    b.set(c.get(21), {v:"Kristina", t:"s"});
    b.set(c.get(22), {v:"Roder", t:"s"});
    b.set(c.get(23), {v:"Test Notiz", t:"s"});
    b.set(c.get(24), {v:"kristina@a-cocktail-a-day.com", t:"s"});
    b.set(c.get(25), {v:"n.a.", t:"s"});
    b.set(c.get(26), {v:"", t:"s"});
    b.set(c.get(27), {v:"Offen f\u00fcr Kooperationen", t:"s"});
    b.set(c.get(28), {v:"", t:"s"});
    b.set(c.get(29), {v:"https://facebook.com", t:"s"});
    b.set(c.get(30), {v:"https://instagram.com", t:"s"});
    b.set(c.get(31), {v:"https://twitter.com", t:"s"});
    b.set(c.get(32), {v:"https://youtube.com", t:"s"});
    b.set(c.get(33), {v:"https://flickr.com", t:"s"});
    a.data.push(b);
    return !0;
  });
};
AdminController.prototype.renderActions = function(a) {
  var b = this, c = this;
  this._document.querySelectorAll(".js-content").forEach(function(b) {
    b.removeClass("hidden");
    b.querySelector("#btn-load") && b.querySelector("#btn-load").setEventListener("click", function(d) {
      c._doLoad(d, b, a);
    });
    b.querySelector("#btn-load-config") && b.querySelector("#btn-load-config").setEventListener("click", function(a) {
      a.preventDefault();
      a = prompt("Bitte gib hier die Konfiguration: ");
      isString(a) && !isBlank(a) && c._pluginController.parseAdminConfiguration(a).then(function(a) {
        c.renderModel(c._model, a.configuration);
      });
    });
  });
  var d = c._getActionButton();
  d && (d.setEventListener("update", function(a) {
    b.onUpdateActionButton(d);
  }), d.setEventListener("click", function(a) {
    c._doImport(a);
  }));
  return Promise.resolve(!0);
};
AdminController.prototype.onUpdateActionButton = function(a) {
  var b = this._readConfiguration(this._model);
  if (b.isValid()) {
    this._hideWarnings(document), a.removeAttribute("disabled"), a.removeAttribute("title"), a.removeAttribute("data-validation");
  } else {
    if (!a.hasAttribute("data-validation")) {
      b = b.getValidationErrors();
      var c = b.map(function(a) {
        return a.id;
      }).join("<br/>");
      a.setAttribute("disabled", "disabled");
      a.setAttribute("data-validation", "invalid");
      a.setAttribute("title", "Es sind noch nicht alle notwendingen Felder konfiguriert.");
      console.warn("Validation errors", b);
      this._showWarnings(document, "Es sind noch nicht alle notwendingen Felder konfiguriert.<br/>" + c);
    }
  }
};
AdminController.prototype._doImport = function(a) {
  var b = this;
  a.preventDefault();
  var c = a.target;
  c.setAttribute("disabled", "disabled");
  b.progressPage().then(function(a) {
    if (b._model) {
      var d = b._readConfiguration(b._model);
      d.isValid() ? (b._adminService.context = a, b._adminService.importCards(b._model, d).then(function(a) {
        if (a) {
          return b._loggingService.i("Import Datei(en) wurde(n) erfolgreich importiert"), b._propertyBag.configuration = d, b._loggingService.d("Die Konfiguration wird f\u00fcr zuk\u00fcnftige Imports gespeichert: " + JSON.stringify(b._propertyBag)), b._pluginController.setAdminConfiguration(b._propertyBag);
        }
        b._loggingService.i("Es konnten nicht alle Import Dateien korrekt importiert werden");
        return Promise.reject("See log for more details");
      }).then(function(a) {
        b._loggingService.d("Folgende komprimierte Konfiguration wurde gespeichert: (Base64) " + a);
        b.finishProgress(!0, "Fertig");
      }).catch(function(a) {
        b._loggingService.e("Es trat folgender Fehler auf: " + a.stack);
        b.finishProgress(!1, "Es traten Fehler beim Import auf. Ein detaillierter Rapport wurde dieser Trello Card angeh\u00e4ngt.");
        console.error(a.stack);
      }).finally(function() {
        c.removeAttribute("disabled");
        return b._adminService.getCurrentCard().then(function(a) {
          var c = b._files.map(function(c) {
            return b._adminService.uploadFileToCard(a, c);
          });
          return Promise.all(c).then(function(b) {
            return a;
          });
        }).then(function(a) {
          b._files = [];
          var c = b._loggingService.flush();
          return b._adminService.uploadFileToCard(a, c);
        }).then(function(a) {
          b.closeImport(!0);
        }).catch(function(a) {
          console.error("Konnte Datei(en) nicht hochladen", a);
          b._showErrors(document, "Konnte Datei(en) nicht hochladen");
          b.closeImport(!1);
        });
      })) : (a = d.getValidationErrors().join("<br/>"), b._showWarnings(document, "Die Konfiguration ist unvollst\u00e4ndig. Bitte korrigieren sie die Konfiguration und versuchen sie es erneut.<br/>" + a));
    }
  });
};
AdminController.prototype._doLoad = function(a, b, c) {
  var d = this;
  a.preventDefault();
  var e = a.target;
  d._hideErrors(b);
  d._hideWarnings(b);
  e.disabled = !0;
  d.progressPage().then(function(a) {
    var b = d._document.querySelector("#file-import").files;
    try {
      d.updateProgress(0, b.length, "Datei(en) eingelesen", "Datei(en) werden eingelesen"), d._adminService.load(b).then(function(a) {
        a.forEach(function(a, e) {
          d._files.push(a.file);
          d.renderModel(a.model, c);
          d.updateProgress(e, b.length, "Datei(en) eingelesen", "Datei \u00ab" + a.file.name + "\u00bb geladen");
        });
      }).catch(function(b) {
        d._showErrors(a, "Unerwarteter Fehler beim Einlesen der Datei \u00ab" + b.name + "\u00bb");
        d.finishProgress(!1, "Fehler beim Einlesen");
      }).finally(function() {
        e.disabled = !1;
        d.finishProgress(!0, "Fertig");
      });
    } catch (h) {
      d._showErrors(a, "Schwerwiegender Fehler beim Einlesen: " + h), e.disabled = !1, d.finishProgress(!1, "Fehler beim Einlesen");
    } finally {
      d.endProgress();
    }
  });
};
AdminController.prototype.progressPage = function() {
  var a = this;
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.removeClass("hidden");
  });
  return new Promise(function(b, c) {
    var d = createByTemplate(template_admin_progress, template_admin_progress);
    a._document.querySelectorAll(".js-content").forEach(function(a) {
      return a.appendChild(d);
    });
    a._document.querySelectorAll(".js-panta-progress").forEach(function(a) {
      a.setEventListener("click", function(a) {
        a.preventDefault();
        a.stopPropagation();
      });
    });
    b({each:a.updateProgress, context:a});
  });
};
AdminController.prototype._testProgress = function(a, b) {
  var c = this;
  setTimeout(function() {
    c.updateProgress(a, b, "Datei(en) importiert", "Eintrag \u00abCard-#" + a + "\u00bb wurde erfolgreich importiert");
    a < b ? c._testProgress(a + 1, b) : c.finishProgress(!0, "Fertig");
  }, 750);
};
AdminController.prototype.finishProgress = function(a, b) {
  a ? (this._document.querySelectorAll(".progress-overlay").forEach(function(a) {
    a.addClass("success");
  }), this._document.querySelectorAll(".js-panta-record-details").forEach(function(a) {
    a.innerText = b;
  })) : (this._document.querySelectorAll(".progress-overlay").forEach(function(a) {
    a.addClass("error");
  }), this._document.querySelectorAll(".js-panta-record-details").forEach(function(a) {
    a.innerText = b;
  }));
};
AdminController.prototype.endProgress = function() {
  this._closeImport(!0, !1);
};
AdminController.prototype.closeImport = function(a) {
  this._closeImport(a, !0);
};
AdminController.prototype._closeImport = function(a, b) {
  var c = this;
  setTimeout(function() {
    c._document.querySelectorAll(".js-panta-progress").forEach(function(a) {
      a.removeSelf();
    });
    b && c._trello.closeModal();
  }, a ? 600 : 5000);
};
AdminController.prototype.updateProgress = function(a, b, c, d) {
  this._document.querySelectorAll(".js-panta-current-record").forEach(function(b) {
    b.innerText = a;
  });
  this._document.querySelectorAll(".js-panta-total-records").forEach(function(a) {
    a.innerText = b;
  });
  this._document.querySelectorAll(".js-panta-progress-postfix").forEach(function(a) {
    a.innerText = c;
  });
  d && this._document.querySelectorAll(".js-panta-record-details").forEach(function(a) {
    a.innerText = d;
  });
};
AdminController.prototype._readConfiguration = function(a) {
  var b = this;
  return Object.values(a.getNormalizedHeaders()).map(function(a) {
    var c = b._document.querySelector("#field-mapping-" + a.getAddressAsText());
    if (null === c) {
      return null;
    }
    c = c.item(c.selectedIndex);
    if (null === c) {
      return null;
    }
    var e = c.getAttribute("data-type"), f = "true" === c.getAttribute("data-multi");
    return b._createFieldOfType(e, a, c.value, f);
  }).filter(function(a) {
    return null != a;
  }).reduce(function(a, b) {
    a.mapping.push(b);
    return a;
  }, new DataConfiguration);
};
AdminController.prototype._createFieldOfType = function(a, b, c, d) {
  switch(a) {
    case "boolean":
      return new BooleanField(b.label, c, new HeaderNode(null, b.label, b.address, b.comments, b.color), d);
    case "date":
      return new DateField(b.label, c, new HeaderNode(null, b.label, b.address, b.comments, b.color), d);
    case "array":
      return new ArrayField(b.label, c, new HeaderNode(null, b.label, b.address, b.comments, b.color), d);
    default:
      return new TextField(b.label, c, new HeaderNode(null, b.label, b.address, b.comments, b.color), d);
  }
};
AdminController.prototype.renderModel = function(a, b) {
  var c = this;
  c._clearContent();
  if (a) {
    this._document.getElementsByClassName("mapping-content-header").forEach(function(a) {
      a.removeClass("hidden");
    });
    var d = [];
    this._document.getElementsByClassName("mapping-content").forEach(function(e) {
      e.removeClass("hidden");
      Object.entries(a.getNormalizedHeaders()).forEach(function(f) {
        var g = f[1], h = c._document.createElement("div");
        h.addClass("row space full");
        d.push(c._createChipsSection(g).then(function(a) {
          h.appendChild(a);
          return c._createFieldMappingSection(g, b);
        }).then(function(d) {
          h.appendChild(d);
          return c._createPreviewSection(g, a, b);
        }).then(function(a) {
          h.appendChild(a);
          return c._createMore(g);
        }).then(function(a) {
          h.appendChild(a);
          return h;
        }).then(function(a) {
          e.appendChild(a);
          return Array.from(a.querySelectorAll("select").values());
        }).then(function(b) {
          c._model = a;
          b.forEach(function(a) {
            a.dispatchEvent(new Event("change"));
          });
          return Array.from(h.querySelectorAll(".js-preview").values());
        }).then(function(a) {
          a.forEach(function(a) {
            a.dispatchEvent(new Event("update"));
          });
          return e;
        }));
      });
    });
  }
};
AdminController.prototype._createMore = function(a) {
  var b = this._document.createElement("div");
  b.setAttribute("id", "more-" + a.getAddressAsText());
  b.addClass("col-2");
  return b;
};
AdminController.prototype._createChipsSection = function(a) {
  var b = this, c = b._document.createElement("div");
  c.addClass("col-3").addClass("align-right");
  a.getPathItems().map(function(c, e, f) {
    var d = b._document.createElement("div");
    d.setAttribute("id", "chip-" + a.getAddressAsText() + "-" + (e + 1 < f.length ? e : "last"));
    d.addClass("panta-chip");
    e + 2 < f.length ? d.addClass("panta-chip-grandpa") : e + 1 < f.length && d.addClass("panta-chip-parent");
    c.comments.forEach(function(a, b, c) {
      d.addClass("panta-bgcolor-" + a.t.toLowerCase());
    });
    e = b._document.createElement("p");
    e.appendChild(b._document.createTextNode(c.label));
    d.appendChild(e);
    return d;
  }).forEach(function(a, e) {
    (b._adminService.excelService.treatFirstRowAsRoot || 0 < e) && c.appendChild(a);
  });
  return Promise.resolve(c);
};
AdminController.prototype._createPreviewSection = function(a, b, c) {
  var d = this, e = d._document.createElement("div");
  e.setAttribute("id", "preview-" + a.getAddressAsText());
  e.addClass("col-4 js-preview").addClass("align-left");
  e.setEventListener("update", function(f) {
    var g = f.item || c.mapping.find(function(b) {
      return b.source.isSameAddress(a.address);
    });
    ("import" === d._context ? b.getSample(a).then(function(a) {
      return b.getSampleHtml(a, d._document, g) || "<p>&nbsp;</p>";
    }) : d._getBoardSample(a, g)).then(function(a) {
      e.innerHTML = a;
    });
  });
  e.innerHTML = "<p>&nbsp;</p>";
  return Promise.resolve(e);
};
AdminController.prototype._getBoardSample = function(a, b) {
  var c = new ImportFieldMapping(this._trello, this._adminService, this._getPantaFieldItems(), a);
  return b ? this._trello.card("id", "name", "desc", "due", "members", "labels", "idList").then(function(a) {
    return c.map(a, b);
  }) : Promise.resolve(c.emptyValue());
};
AdminController.prototype._createFieldMappingSection = function(a, b) {
  var c = this, d = this, e = d._document.createElement("div");
  e.addClass("col-3");
  var f = d._document.createElement("select");
  f.setAttribute("id", "field-mapping-" + a.getAddressAsText());
  f.setEventListener("change", function(b) {
    c._onFieldMappingChange(b.target.item(b.target.selectedIndex), a);
  });
  var g = d._document.createElement("option");
  g.setAttribute("value", "-1");
  g.innerText = "Feld ausw\u00e4hlen...";
  f.appendChild(g);
  return d._getTrelloFieldOptions().then(function(a) {
    f.appendChild(a);
    return f;
  }).then(function(a) {
    return d._getPantaFieldOptions().then(function(a) {
      return a.reduce(function(a, b) {
        a.appendChild(b);
        return a;
      }, f);
    });
  }).then(function(c) {
    e.appendChild(f);
    c = b.mapping.find(function(b) {
      return b.source.isSameAddress(a.address);
    });
    f.value = c && c.reference ? c.reference : "-1";
    isBlank(f.value) && (f.value = "-1");
    return e;
  });
};
AdminController.prototype._onFieldMappingChange = function(a, b) {
  if (null !== a) {
    var c = this, d = b.getAddressAsText(), e = c._document.querySelector("#more-" + d), f = new Event("update");
    e.removeChildren();
    if ("trello.labels" === a.getAttribute("value")) {
      f.item = new BooleanField(a);
      var g = c._createColorPicker(b.color);
      g.setEventListener("change", function(a) {
        a = a.target.item(a.target.selectedIndex).getAttribute("value");
        var e = c._document.querySelector("#chip-" + d + "-last");
        e.removeClassByPrefix("panta-bgcolor-");
        "0" !== a && e.addClass("panta-bgcolor-" + a);
        b.color = a;
      });
      e.appendChild(g);
    }
    e = "true" === a.getAttribute("data-multi");
    f.item = this._createFieldOfType(a.getAttribute("data-type"), b, a.value, e);
    c._document.querySelector("#preview-" + d).dispatchEvent(f);
    c._getActionButton().dispatchEvent(f);
  }
};
AdminController.prototype._getActionButton = function() {
  return this._document.querySelector("#" + ("import" === this._context ? "btn-import" : "btn-export"));
};
AdminController.prototype._createColorPicker = function(a) {
  a = void 0 === a ? null : a;
  var b = this, c = b._document.createElement("select");
  c.appendChild(b._createColorOption("Farbe w\u00e4hlen...", "0", a));
  Object.entries(TRELLO_COLORS).map(function(c) {
    return b._createColorOption(c[0], c[1], a);
  }).forEach(function(a) {
    return c.appendChild(a);
  });
  return c;
};
AdminController.prototype._createColorOption = function(a, b, c) {
  var d = this._document.createElement("option");
  d.setAttribute("value", b);
  d.selected = c === b;
  d.innerText = a;
  return d;
};
AdminController.prototype._getTrelloFieldOptions = function() {
  var a = this, b = this._document.createElement("optgroup");
  b.setAttribute("label", "Trello.Felder");
  return Promise.resolve(TRELLO_FIELDS.map(function(b) {
    return a._createFieldOption(b.id, __(b.desc), b.type, b.multi);
  }).reduce(function(a, b) {
    a.appendChild(b);
    return a;
  }, b));
};
AdminController.prototype._createFieldOption = function(a, b, c, d) {
  var e = this._document.createElement("option");
  e.setAttribute("value", a);
  e.innerText = b;
  e.setAttribute("data-type", c || "text");
  e.setAttribute("data-multi", d || "false");
  return e;
};
AdminController.prototype._getPantaFieldOptions = function() {
  var a = this;
  return this._pluginController.getEnabledModules().then(function(b) {
    return b.flatMap(function(b) {
      var c = b.name;
      return a._clientManager.getController(b.id).getFields(b).flatMap(function(b) {
        return b.map(function(b) {
          var d = b.groupId, e = a._document.createElement("optgroup");
          e.setAttribute("label", c + "." + b.group);
          return b.fields.map(function(b) {
            return a._createFieldOption(d + "." + b.id, b.label, b.type, "false");
          }).reduce(function(a, b) {
            a.appendChild(b);
            return a;
          }, e);
        });
      });
    });
  });
};
AdminController.prototype._getPantaFieldItems = function() {
  var a = this;
  return this._pluginController.getEnabledModules().then(function(b) {
    return b.flatMap(function(b) {
      return a._clientManager.getController(b.id).getFields(b);
    });
  });
};
AdminController.prototype._clear = function() {
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.removeChildren();
  });
};
AdminController.prototype._clearContent = function() {
  this._document.getElementsByClassName("mapping-content").forEach(function(a) {
    return a.removeChildren();
  });
};
AdminController.prototype._showErrors = function(a, b) {
  return this._show(a, a.querySelectorAll(".error-messages"), b, "#error-message");
};
AdminController.prototype._showWarnings = function(a, b) {
  return this._show(a, a.querySelectorAll(".warning-messages"), b, "#warning-message");
};
AdminController.prototype._hideWarnings = function(a) {
  return this._hide(a.querySelectorAll(".warning-messages"), "#warning-message");
};
AdminController.prototype._hideErrors = function(a) {
  return this._hide(a.querySelectorAll(".error-messages"), "#error-message");
};
AdminController.prototype._show = function(a, b, c, d) {
  b.forEach(function(a) {
    a.removeClass("hidden");
    a.querySelector(d).innerHTML = c;
  });
  return b;
};
AdminController.prototype._hide = function(a, b) {
  a.forEach(function(a) {
    a.addClass("hidden");
    a.querySelector(b).innerHTML = "";
  });
  return a;
};
$jscomp.global.Object.defineProperties(AdminController, {PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Admin.PropertyBag";
}}});
// Input 43
var ExportFieldMapping = function(a) {
  FieldMapping.apply(this, arguments);
};
$jscomp.inherits(ExportFieldMapping, FieldMapping);
ExportFieldMapping.prototype.mapLabel = function(a, b) {
  return !!a;
};
ExportFieldMapping.prototype.labelFilter = function(a, b) {
  return a.name === b.name;
};
ExportFieldMapping.prototype.mapMember = function(a) {
  return a.email;
};
ExportFieldMapping.prototype.emptyValue = function() {
  return "";
};
ExportFieldMapping.prototype.mapArray = function(a) {
  return a;
};
ExportFieldMapping.prototype.mapMembers = function(a) {
  return a.join(",");
};
// Input 44
var ExportController = function(a, b, c, d) {
  AdminController.call(this, a, c, b, d);
};
$jscomp.inherits(ExportController, AdminController);
ExportController.prototype.render = function(a) {
  var b = this;
  this._model = null;
  var c = createByTemplate(template_admin_export, template_admin_export);
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    return a.appendChild(c);
  });
  this._clearContent();
  return this._pluginController.getEnabledModules().then(function(a) {
    return Promise.all(a.map(function(a) {
      return b._adminService.getCurrentCard().then(function(c) {
        return b._clientManager.getController(a.id).fetchByCard(c, a);
      });
    }));
  }).then(function() {
    var a = Import.create("Export");
    a.header = new HeaderNode(null, "Root", {c:-1, r:-1, constant:"Virtual Node"});
    return b._getTemplate(a).then(function(b) {
      a.header.addAll(b);
      return a;
    });
  }).then(function(c) {
    return b.renderActions(a).then(function() {
      return b.renderModel(c, a.export_configuration);
    });
  });
};
ExportController.prototype.renderModel = function(a, b) {
  var c = this;
  console.debug("renderModel with config", b);
  c._clearContent();
  this._document.getElementsByClassName("mapping-content-header").forEach(function(a) {
    a.removeClass("hidden");
  });
  this._document.getElementsByClassName("mapping-content").forEach(function(d) {
    d.removeClass("hidden");
    Object.values(a.getNormalizedHeaders()).map(function(e) {
      var f = c._document.createElement("div");
      f.addClass("row space full");
      return c._createChipsSection(e).then(function(a) {
        f.appendChild(a);
        return c._createFieldMappingSection(e, b);
      }).then(function(d) {
        f.appendChild(d);
        return c._createPreviewSection(e, a, b);
      }).then(function(a) {
        f.appendChild(a);
        return c._createMore(e);
      }).then(function(a) {
        f.appendChild(a);
        return f;
      }).then(function(a) {
        d.appendChild(a);
        return Array.from(a.querySelectorAll("select").values());
      }).then(function(b) {
        c._model = a;
        b.forEach(function(a) {
          a.dispatchEvent(new Event("change"));
        });
        return Array.from(f.querySelectorAll(".js-preview").values());
      }).then(function(a) {
        a.forEach(function(a) {
          a.dispatchEvent(new Event("update"));
        });
        return d;
      });
    });
  });
};
ExportController.prototype.renderActions = function(a) {
  var b = this;
  this._document.querySelectorAll(".js-content").forEach(function(a) {
    a.removeClass("hidden");
  });
  var c = b._getActionButton();
  c && (c.setEventListener("click", function(a) {
    a.preventDefault();
    a.stopPropagation();
    a.target.disabled = !0;
    b.progressPage().then(function(a) {
      return b._doExport(a);
    }).catch(function(a) {
      console.debug("got an error", a);
      b.finishProgress(!1, a);
    }).then(function(a) {
      b.finishProgress(!0, "Fertig");
    }).finally(function() {
      a.target.disabled = !1;
    });
  }), c.setEventListener("update", function(a) {
    b.onUpdateActionButton(c);
  }));
  return Promise.resolve(!0);
};
ExportController.prototype._doExport = function(a) {
  var b = this, c = b._readConfiguration(b._model);
  if (c.isValid()) {
    var d = new ExportFieldMapping(this._trello, this._adminService, this._getPantaFieldItems());
    return b._adminService.getBoardCards().then(function(a) {
      return b._pluginController.getEnabledModules().then(function(c) {
        return c.flatMap(function(c) {
          var d = b._clientManager.getController(c.id);
          return a.map(function(a) {
            return d.fetchByCard(a, c).then(function(b) {
              d.insert(b, a);
              return b;
            });
          });
        });
      }).then(function() {
        return a;
      });
    }).then(function(e) {
      a.each.apply(b, [0, e.length, "Eintr\u00e4ge exportiert...", "0.00%"]);
      return Promise.resolve(Object.values(b._model.getNormalizedHeaders()).map(function(a) {
        return c.findByAddress(a.address);
      })).then(function(a) {
        return Promise.all(a.flatMap(function(a) {
          return a.multi && "trello.labels" === a.reference ? b._adminService.getLabels().then(function(c) {
            c.forEach(function(c, d) {
              0 < d ? (c = new HeaderNode(a.source.parent, "" + c.name, {c:a.source.address.c + 100 + d, r:a.source.address.r}, null, c.color), b._model.insertAt(a.source, c)) : (b._model.getHeader(a.source.address).label = c.name, b._model.getHeader(a.source.address).color = c.color);
            });
            return c;
          }).then(function(b) {
            return b.map(function(b) {
              return new BooleanField(b.name, a.reference, a.source, !0);
            });
          }) : Promise.all([a]);
        }));
      }).then(function(a) {
        return a.flat();
      }).then(function(a) {
        return Promise.all(e.map(function(b) {
          return Promise.all(a.filter(function(a) {
            return null != a;
          }).map(function(a) {
            return d.map(b, a);
          }));
        }));
      }).reduce(function(c, d, f) {
        var g = new DataNode(f + 1);
        d.forEach(function(a) {
          g.set(null, a);
        });
        c.push(g);
        d = Math.min((f + 1.0) / Math.max(1.0, e.length) * 100, 100.0).toFixed(2) + "%";
        a.each.apply(b, [f + 1, e.length, "Eintr\u00e4ge exportiert...", d]);
        return c;
      }, []).then(function(a) {
        b._model.data = a;
        var c = b._adminService.excelService.write(b._model);
        b._adminService.getCurrentCard().then(function(a) {
          return b._adminService.uploadFileToCard(a, c);
        });
      });
    }).then(function(a) {
      console.debug("Saving configuration", c);
      b._propertyBag.export_configuration = c;
      return b._pluginController.setAdminConfiguration(b._propertyBag);
    });
  }
  var e = c.getValidationErrors().join("<br/>");
  b._showWarnings(document, "Die Konfiguration ist unvollst\u00e4ndig. Bitte korrigieren sie die Konfiguration und versuchen sie es erneut.<br/>" + e);
};
ExportController.prototype._getTemplate = function(a) {
  return Promise.all([this._getTrelloHeaders(a.header), this._getPantaHeaders(a.header)]).then(function(a) {
    return a.flat();
  });
};
ExportController.prototype._getTrelloHeaders = function(a) {
  return Promise.resolve(TRELLO_FIELDS.map(function(b, c) {
    return new HeaderNode(a, __(b.desc), {c:c, r:1});
  }));
};
ExportController.prototype._getPantaHeaders = function(a) {
  var b = this, c = a.children.length, d = a.address.r;
  return this._getPantaFieldItems().then(function(e) {
    return Promise.all(e.flat().flatMap(function(e) {
      return e.fields.map(function(f) {
        var g = e.group;
        return b._pluginController.findPluginModuleConfigByModuleId(e.moduleId).then(function(b) {
          return new HeaderNode(a, b.name + "." + g + "." + f.label, {c:c++, r:d});
        });
      });
    }));
  });
};
ExportController.prototype._clearContent = function() {
  this._document.getElementsByClassName("mapping-content").forEach(function(a) {
    return a.removeChildren();
  });
};
ExportController.prototype._createMore = function(a) {
  return AdminController.prototype._createMore.call(this, a);
};
// Input 45
var ExcelService = function() {
  this._treatFirstRowAsRoot = !1;
};
ExcelService.prototype.read = function(a) {
  this.dataRowIndex = 1;
  a = new Uint8Array(a);
  var b = XLSX.read(a, {type:"array"});
  a = b.Sheets[b.SheetNames[0]];
  this.boundary = XLSX.utils.decode_range(a["!ref"]);
  b = new Import(b.Props.Title);
  if (this._treatFirstRowAsRoot) {
    this._parseImportHeader(a, 0, 0, null);
  } else {
    var c = new HeaderNode(null, "Panta.Card", {constant:"/"}, null);
    this._parseImportHeader(a, 0, 0, c);
    b.header = c;
  }
  this._readImportData(a, b, 0, this.dataRowIndex);
  return b;
};
ExcelService.prototype.write = function(a) {
  var b = XLSX.utils.book_new();
  b.Props = {Title:"Sample Export", Subject:"Panta.Card Export", Author:"PantaRhei", CreatedDate:new Date};
  b.SheetNames.push(a.title);
  var c = [], d = Object.values(a.getNormalizedHeaders()).reduce(function(a, b) {
    a.push(b.label);
    return a;
  }, []);
  c.push(d);
  a.data.map(function(a) {
    return a.values.map(function(a) {
      return a.value;
    });
  }).forEach(function(a) {
    c.push(a);
  });
  b.Sheets[a.title] = XLSX.utils.aoa_to_sheet(c);
  a = XLSX.write(b, {bookType:"xlsx", type:"binary"});
  return new File([function(a) {
    for (var b = new ArrayBuffer(a.length), c = new Uint8Array(b), d = 0; d < a.length; d++) {
      c[d] = a.charCodeAt(d) & 255;
    }
    return b;
  }(a)], "test.xlsx");
};
ExcelService.prototype._parseImportHeader = function(a, b, c, d) {
  if (c < this.dataRowIndex && b <= this.boundary.e.c) {
    var e = {c:b, r:c}, f = a[XLSX.utils.encode_cell(e)];
    if (null == f) {
      return this.treatFirstRowAsRoot ? null : this._parseImportHeader(a, b + 1, c, d);
    }
    e = new HeaderNode(d, f.v, e, f.c ? f.c : [], null);
    if (0 === c && this._treatFirstRowAsRoot) {
      for (d = b + 1; d <= this.boundary.e.c; d++) {
        f = a[XLSX.utils.encode_cell({c:d, r:c})], null != f && e.put(f.h);
      }
    } else {
      0 !== c || this._treatFirstRowAsRoot || (d.add(e), this._parseImportHeader(a, b + 1, c, d));
    }
    do {
      d = this._parseImportHeader(a, b, c + 1, e), null != d && e.add(d);
    } while (++b <= this.boundary.e.c && (0 === c || null == a[XLSX.utils.encode_cell({c:b, r:c})]));
    return e;
  }
  return null;
};
ExcelService.prototype._readImportData = function(a, b, c, d) {
  if (d <= this.boundary.e.r) {
    for (var e = new DataNode(d), f = c; f <= this.boundary.e.c; f++) {
      var g = {r:d, c:f}, h = b.getHeader(g);
      g = a[XLSX.utils.encode_cell(g)];
      null != g && e.set(h, g);
    }
    0 !== e.values.length && b.put(e);
    this._readImportData(a, b, c, d + 1);
  }
};
$jscomp.global.Object.defineProperties(ExcelService.prototype, {treatFirstRowAsRoot:{configurable:!0, enumerable:!0, get:function() {
  return this._treatFirstRowAsRoot;
}, set:function(a) {
  this._treatFirstRowAsRoot = a;
}}});
// Input 46
var Artikel = function(a, b, c, d, e, f, g, h, k, l, m, q, n, p) {
  this._id = a || uuid();
  this._topic = b;
  this._pagina = c;
  this._from = d;
  this._layout = e;
  this._total = f;
  this._tags = g;
  this._form = n;
  this._visual = h;
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
// Input 47
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
// Input 48
var PluginModuleConfig = function(a, b, c) {
  this._id = a;
  this._name = b;
  this._config = c;
};
PluginModuleConfig.prototype.getEditable = function(a) {
  return this.config.editables.find(function(b) {
    return b.id === a;
  });
};
PluginModuleConfig.prototype.getEditableOptionValue = function(a, b) {
  return (a = this.getEditable(a)) && a.values ? a.values.indexOf(b) : -1;
};
PluginModuleConfig.prototype.getEditableLayout = function(a) {
  a = this.getEditable(a);
  if ("layout" === a.type) {
    return this.config.layouts[a.layout];
  }
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
// Input 49
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
CommonBeteiligt.prototype.getByEditable = function(a) {
  return "<" + a + ">";
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
var OtherBeteiligt = function(a, b, c, d, e, f, g, h, k, l) {
  CommonBeteiligt.call(this, a, b, c, d, e);
  this._duedate = f;
  this._fee = g;
  this._charges = h;
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
OtherBeteiligt.prototype.getByEditable = function(a) {
  switch(a) {
    case "field.id":
      return this.id;
    case "field.name":
      return this.name;
    case "field.social":
      return this.social;
    case "field.address":
      return this.address;
    case "field.notes":
      return this.notes;
    case "field.deadline":
      return this.duedate;
    case "field.a":
      return this.fee;
    case "field.b":
      return this.charges;
    case "field.c":
      return this.project;
    default:
      return CommonBeteiligt.prototype.getByEditable.call(this, a);
  }
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
var AdBeteiligt = function(a, b, c, d, e, f, g, h) {
  CommonBeteiligt.call(this, a, b, c, d, e);
  this._format = f;
  this._placement = g;
  this._price = h;
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
AdBeteiligt.prototype.getByEditable = function(a) {
  switch(a) {
    case "field.id":
      return this.id;
    case "field.sujet":
      return this.notes;
    case "field.format":
      return this.format;
    case "field.placement":
      return this.placement;
    case "field.price":
      return this.price;
    case "field.total":
      return this.total;
    case "field.name":
      return this.name;
    case "field.social":
      return this.social;
    case "field.address":
      return this.address;
    default:
      return CommonBeteiligt.prototype.getByEditable.call(this, a);
  }
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
BlogBeteiligt.prototype.getByEditable = function(a) {
  switch(a) {
    case "field.id":
      return this.id;
    case "field.follower":
      return this.social;
    case "field.notes":
      return this.notes;
    case "field.date":
      return this.date;
    case "field.link":
      return this.address;
    default:
      return CommonBeteiligt.prototype.getByEditable.call(this, a);
  }
};
$jscomp.global.Object.defineProperties(BlogBeteiligt.prototype, {date:{configurable:!0, enumerable:!0, get:function() {
  return this._date;
}, set:function(a) {
  this._date = a;
}}});
// Input 50
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
// Input 51
var Plan = function(a, b, c, d, e, f, g, h, k, l, m, q, n, p, r) {
  this._id = a || uuid();
  this._fee = d;
  this._projectFee = e;
  this._thirdPartyCharges = f;
  this._thirdPartyTotalCosts = g;
  this._capOnDepenses = h;
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
// Input 52
var SAMPLE_IMPORT = {_title:"Test", _header:{_label:"Listen-Name", _children:[{_label:"Listen-Name", _children:[], _properties:[], _address:{c:0, r:0}, _comments:[], _color:null}, {_label:"Frist (Datum)", _children:[], _properties:[], _address:{c:1, r:0}, _comments:[], _color:null}, {_label:"Mitglieder(Mehrere M\u00f6glich)", _children:[], _properties:[], _address:{c:2, r:0}, _comments:[], _color:null}, {_label:"Wasser", _children:[], _properties:[], _address:{c:3, r:0}, _comments:[{a:" ", t:"Sky", 
r:'<r><rPr><sz val="10"/><color rgb="FF000000"/><rFont val="Arial"/><family val="2"/><charset val="1"/></rPr><t xml:space="preserve">Sky</t></r>', h:'<span style="font-size:10pt;">Sky</span>'}], _color:null}, {_label:"Wiese", _children:[], _properties:[], _address:{c:4, r:0}, _comments:[{a:" ", t:"Lime", r:'<r><rPr><sz val="10"/><color rgb="FF000000"/><rFont val="Arial"/><family val="2"/><charset val="1"/></rPr><t xml:space="preserve">Lime</t></r>', h:'<span style="font-size:10pt;">Lime</span>'}], 
_color:null}, {_label:"Strasse", _children:[], _properties:[], _address:{c:5, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:6, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:7, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:8, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:9, r:0}, _comments:[], _color:null}, {_label:"Label", 
_children:[], _properties:[], _address:{c:10, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:11, r:0}, _comments:[], _color:null}, {_label:"Label", _children:[], _properties:[], _address:{c:12, r:0}, _comments:[], _color:null}, {_label:"Trello-Feld: TITEL", _children:[], _properties:[], _address:{c:14, r:0}, _comments:[], _color:null}, {_label:"Trello-Feld: Beschreibung", _children:[], _properties:[], _address:{c:15, r:0}, _comments:[], _color:null}, 
{_label:"1. Auswahlliste", _children:[], _properties:[], _address:{c:17, r:0}, _comments:[], _color:null}, {_parent:null, _label:"2. Auswahlliste", _children:[], _properties:[], _address:{c:18, r:0}, _comments:[], _color:null}, {_label:"3. Auswahlliste", _children:[], _properties:[], _address:{c:19, r:0}, _comments:[], _color:null}, {_label:"4. Auswahlliste", _children:[], _properties:[], _address:{c:20, r:0}, _comments:[], _color:null}, {_label:"5. Auswahlliste", _children:[], _properties:[], _address:{c:21, 
r:0}, _comments:[], _color:null}, {_label:"Feld: Details ", _children:[], _properties:[], _address:{c:23, r:0}, _comments:[], _color:null}, {_label:"Feld: Vorname", _children:[], _properties:[], _address:{c:24, r:0}, _comments:[], _color:null}, {_label:"Feld: Name", _children:[], _properties:[], _address:{c:25, r:0}, _comments:[], _color:null}, {_label:"Noitzen (nur im TRELLO)", _children:[], _properties:[], _address:{c:26, r:0}, _comments:[], _color:null}, {_label:"Feld: E-Mail", _children:[], _properties:[], 
_address:{c:28, r:0}, _comments:[], _color:null}, {_label:" Feld: Telefon", _children:[], _properties:[], _address:{c:29, r:0}, _comments:[], _color:null}, {_label:"Feld: Adresse", _children:[], _properties:[], _address:{c:30, r:0}, _comments:[], _color:null}, {_label:"Feld: Konditionen", _children:[], _properties:[], _address:{c:31, r:0}, _comments:[], _color:null}, {_label:"Feld: Erfahrungen", _children:[], _properties:[], _address:{c:32, r:0}, _comments:[], _color:null}, {_label:"Facebook Feld: Link", 
_children:[], _properties:[], _address:{c:34, r:0}, _comments:[], _color:null}, {_label:"Instagram Feld: Link", _children:[], _properties:[], _address:{c:35, r:0}, _comments:[], _color:null}, {_label:"Twitter Feld: Link", _children:[], _properties:[], _address:{c:36, r:0}, _comments:[], _color:null}, {_label:"Youtube Feld: Link", _children:[], _properties:[], _address:{c:37, r:0}, _comments:[], _color:null}, {_label:"Flickr Feld: Link", _children:[], _properties:[], _address:{c:38, r:0}, _comments:[], 
_color:null}], _properties:[], _address:{c:-1, r:-1}, _comments:[], _color:null}};
// Input 53
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
HTMLElement.prototype.removeClassByPrefix = function(a) {
  var b = "";
  this.className.split(" ").forEach(function(c, d) {
    c.startsWith(a) || (b += " " + c);
  });
  this.className = b.trim();
  return this;
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
HTMLDocument.prototype.newMultiLineInput = function(a, b, c, d, e, f, g, h, k) {
  return (new MultiLineInput(this, d, null, b, void 0 === h ? "" : h, void 0 === g ? 2 : g, !1, void 0 === k ? !0 : k)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e).render();
};
HTMLDocument.prototype.newSingleLineInput = function(a, b, c, d, e, f, g, h, k, l) {
  h = void 0 === h ? "text" : h;
  k = void 0 === k ? !1 : k;
  b = new SingleLineInput(this, d, null, b, void 0 === g ? "" : g, k, void 0 === l ? !0 : l);
  b.propertyType = h || "text";
  null !== c && b.bind(a.data, c);
  a = function() {
  };
  b.onFocus(f, e).onEnterEditing(f, e).onChange(k ? a : f, e).render();
  return b;
};
HTMLDocument.prototype.newSingleSelect = function(a, b, c, d, e, f, g, h, k, l) {
  var m = (new SingleSelectInput(this, d, null, b, void 0 === g ? "" : g, !1, void 0 === l ? !0 : l)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e);
  k.forEach(function(a, b) {
    m.addOption(a.value, a.text);
  });
  m.setEmpty(h.value, h.text);
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
Window.prototype.isString = function(a) {
  return "string" === typeof a;
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
Array.prototype.switch = function() {
  var a = [];
  this.forEach(function(b) {
    Array.isArray(b) && b.forEach(function(b, d) {
      a[d] || (a[d] = []);
      a[d].push(b);
    });
  });
  return a;
};
Promise.prototype.reduce = function(a, b) {
  return this.then(function(c) {
    c.forEach(function(c, e) {
      a(b, c, e);
    });
    return b;
  });
};
function newOption(a, b) {
  return {value:a, text:b};
}
function isNumber(a) {
  return !(!a || isNaN(a));
}
function __(a) {
  return TEXTS[a] || a;
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
// Input 54
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
// Input 55
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
template_beteiligt = '<form id="panta.module">    <div class="js-panta-editable-title">        <div class="row min"><div class="col-12">\u00a0</div></div>        <div class="row min">           <div class="col-12">                <h3 class="js-panta-module js-panta-label"></h3>           </div>        </div>    </div>    <div class="row min navigation-bar">        <div id="pa.involved.onsite" class="col-2 col-phone-4 tab" data-label="vor.Ort" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.text" class="col-2 col-phone-4 tab" data-label="Journalist" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.photo" class="col-phone-4 col-2 tab" data-label="Visual" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.video" class="col-phone-4 col-2 tab" data-label="Event" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.illu" class="col-phone-4 col-2 tab" data-label="MC/Host" data-layout="regular"><span>Placeholder</span></div>        <div id="pa.involved.ad" class="col-phone-4 col-2 tab" data-label="weitere" data-layout="regular"><span>Placeholder</span></div>    </div>    <span id="pa.tab.content"></span></form>', 
template_admin_actions = '<div class="row full">            <div class="col-12">                <p>Was willst du tun?</p>            </div>        </div>        <div class="row full">            <div class="col-6 space">                <button id="btn-action-import" class="panta-btn action">Import</button>            </div>            <div class="col-6 space">                <button id="btn-action-export" class="panta-btn action js-button-export">Export</button>            </div>        </div>', 
template_admin_import = '<div class="row full">            <div class="col-12">                <p>W\u00e4hle hier die Excel Datei aus, die importiert werden soll.</p>            </div>            <div class="col-10">                <input class="panta-btn" type="file" id="file-import">            </div>            <div class="col-2">                <button class="panta-btn" id="btn-load">Laden</button>            </div>            <div class="col-12">                <button class="panta-btn panta-bgcolor-yellow" id="btn-load-config">Konfiguration laden</button>            </div>        </div>        <div class="hidden mapping-content-header">            <div class="row full">                <div class="col-12">                    <hr/>                </div>            </div>            <div class="row space full">                <div class="col-3 align-right">                    <b>Excel Feld</b>                </div>                <div class="col-3">                    <b>Trello Feld</b>                </div>                <div class="col-4 align-left">                    <b>Beispiel Wert</b>                </div>                <div class="col-2 align-left">                    <b>Mehr</b>                </div>            </div>        </div>        <form>            <div class="hidden mapping-content">            </div>            <div class="row space full">                <div class="col-10">\u00a0</div>                <div class="col-2">                    <button class="panta-btn panta-bgcolor-green panta-js-button" disabled="disabled" id="btn-import">                        Importieren                    </button>                </div>            </div>            <div class="row">                <div class="col-12 hidden error-messages">                    <p class="error" id="error-message"></p>                </div>                <div class="col-12 hidden warning-messages">                    <p class="warning" id="warning-message"></p>                </div>            </div>        </form>', 
template_admin_export = '<div class="row">            <div class="col-12">                <p>Standardm\u00e4ssig werden alle Trello und Panta.Card Felder exportiert</p>            </div>        </div>        <div class="hidden mapping-content-header">            <div class="row full">                <div class="col-12">                    <hr/>                </div>            </div>            <div class="row space full">                <div class="col-3 align-right">                    <b>Excel Feld</b>                </div>                <div class="col-3">                    <b>Trello Feld</b>                </div>                <div class="col-4 align-left">                    <b>Beispiel Wert</b>                </div>                <div class="col-2 align-left">                    <b>Mehr</b>                </div>            </div>        </div>        <form>            <div class="hidden mapping-content">            </div>            <div class="row space full">                <div class="col-10">\u00a0</div>                <div class="col-2">                    <button class="panta-btn panta-bgcolor-green panta-js-button" disabled="disabled" id="btn-export">                        Exportieren                    </button>                </div>            </div>            <div class="row">                <div class="col-12 hidden error-messages">                    <p class="error" id="error-message"></p>                </div>                <div class="col-12 hidden warning-messages">                    <p class="warning" id="warning-message"></p>                </div>            </div>        </form>', 
template_admin_errorpage = '<div class="row full">   <div class="col-12 hidden error-messages">       <p class="error" id="error-message"></p>   </div>   <div class="col-12 hidden warning-messages">       <p class="warning" id="warning-message"></p>   </div>   <div class="col-12 space">       <button id="btn-reset" class="panta-btn panta-bgcolor-red">Zur\u00fccksetzen</button>   </div></div>', template_admin_progress = '<div class="overlay js-panta-progress progress-overlay">            <div class="row full">                <div class="col-12">                    <p class="space"><span class="js-panta-current-record">?</span>/<span class="js-panta-total-records">?</span> <span class="js-panta-progress-postfix"></span></p>                    <p class="details js-panta-record-details"></p>';
"                </div>            </div>        </div>";
// Input 56
var Reducers = function() {
};
Reducers.asKeyValue = function(a, b) {
  Object.entries(b).forEach(function(b) {
    a[JsonSerialization.denomalize(b[0])] = b[1];
  });
  return a;
};
Reducers.asOccurrenceMap = function(a, b) {
  void 0 === a[b] ? a[b] = 1 : a[b]++;
  return a;
};

