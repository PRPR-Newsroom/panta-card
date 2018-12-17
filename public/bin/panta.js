// Input 0
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.ASSUME_ES5 = !1;
$jscomp.ASSUME_NO_NATIVE_MAP = !1;
$jscomp.ASSUME_NO_NATIVE_SET = !1;
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
$jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(a, b, c) {
  a != Array.prototype && a != Object.prototype && (a[b] = c.value);
};
$jscomp.SYMBOL_PREFIX = "jscomp_symbol_";
$jscomp.initSymbol = function() {
  $jscomp.initSymbol = function() {
  };
  $jscomp.global.Symbol || ($jscomp.global.Symbol = $jscomp.Symbol);
};
$jscomp.Symbol = function() {
  var a = 0;
  return function(b) {
    return $jscomp.SYMBOL_PREFIX + (b || "") + a++;
  };
}();
$jscomp.initSymbolIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.iterator;
  a || (a = $jscomp.global.Symbol.iterator = $jscomp.global.Symbol("iterator"));
  "function" != typeof Array.prototype[a] && $jscomp.defineProperty(Array.prototype, a, {configurable:!0, writable:!0, value:function() {
    return $jscomp.arrayIterator(this);
  }});
  $jscomp.initSymbolIterator = function() {
  };
};
$jscomp.initSymbolAsyncIterator = function() {
  $jscomp.initSymbol();
  var a = $jscomp.global.Symbol.asyncIterator;
  a || (a = $jscomp.global.Symbol.asyncIterator = $jscomp.global.Symbol("asyncIterator"));
  $jscomp.initSymbolAsyncIterator = function() {
  };
};
$jscomp.arrayIterator = function(a) {
  var b = 0;
  return $jscomp.iteratorPrototype(function() {
    return b < a.length ? {done:!1, value:a[b++]} : {done:!0};
  });
};
$jscomp.iteratorPrototype = function(a) {
  $jscomp.initSymbolIterator();
  a = {next:a};
  a[$jscomp.global.Symbol.iterator] = function() {
    return this;
  };
  return a;
};
$jscomp.makeIterator = function(a) {
  $jscomp.initSymbolIterator();
  $jscomp.initSymbol();
  $jscomp.initSymbolIterator();
  var b = a[Symbol.iterator];
  return b ? b.call(a) : $jscomp.arrayIterator(a);
};
$jscomp.arrayFromIterator = function(a) {
  for (var b, c = []; !(b = a.next()).done;) {
    c.push(b.value);
  }
  return c;
};
$jscomp.arrayFromIterable = function(a) {
  return a instanceof Array ? a : $jscomp.arrayFromIterator($jscomp.makeIterator(a));
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
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a) {
      return a;
    });
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
    for (var g = 0; g < f && c < e;) {
      if (b[c++] != a[g++]) {
        return !1;
      }
    }
    return g >= f;
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
$jscomp.polyfill("Object.entries", function(a) {
  return a ? a : function(a) {
    var b = [], d;
    for (d in a) {
      $jscomp.owns(a, d) && b.push([d, a[d]]);
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
  a && a.hasOwnProperty("implementation") ? DI.INSTANCE = a.implementation() : (a = function(a) {
    DI.apply(this, arguments);
  }, $jscomp.inherits(a, DI), a.INSTANCE = DI.INSTANCE, a.getInstance = DI.getInstance, a.prototype.getArticleRepository = function() {
    return new ArtikelRepository;
  }, DI.INSTANCE = new a);
  return DI.INSTANCE;
};
DI.prototype.getArticleRepository = function() {
};
DI.INSTANCE = null;
// Input 1
var PLUGIN_CONFIGURATION = {"module.artikel.enabled":!1, "module.beteiligt.enabled":!0, "module.plan.enabled":!0};
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
Repository.prototype.isNew = function(a) {
};
// Input 3
var PInput = function(a, b, c, d, e, f, g) {
  this._document = a;
  this._label = 0 === b.length ? "" : b;
  this._value = c;
  this._name = "name_" + d;
  d.startsWith(".", 0) ? this._target = this._document.getElementsByClassName(d.substr(1)).item(0) : this._target = this._document.getElementById(d);
  this._type = f;
  this._placeholder = e;
  this._readonly = g;
  this._input = this._document.createElement(this._type);
  this._property = this._labelInput = null;
  this._propertyType = "text";
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
  a || (this._input.value = null);
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
};
PInput.prototype._updateValue = function(a) {
  null !== this._input && this._input.value !== a && (this._input.value = a);
};
PInput.prototype.update = function(a) {
  this._entity = a;
  "select" !== this._type && this._updateProperty();
  return this;
};
PInput.prototype.render = function() {
  var a = this._document.createElement("div");
  this._input.setAttribute("name", this._name);
  this._input.placeholder = this._placeholder;
  this._input.setAttribute("title", this._label);
  this._input.setAttribute("autocomplete", "new-password");
  this._value && this._updateProperty();
  this._renderType();
  this._readonly && this._input.setAttribute("readonly", "readonly");
  this._input.addClass(this.propertyType);
  this._input.addClass("u-border");
  this.setupEvents();
  this._labelInput = this._document.createElement("label");
  this._labelInput.appendChild(this._document.createTextNode(this._label));
  this._labelInput.setAttribute("for", this._input.getAttribute("name"));
  this._labelInput.addClass("prop-" + this._type);
  0 === this._label.length ? a.setAttribute("class", "field hidden") : a.setAttribute("class", "field");
  a.appendChild(this._labelInput);
  a.appendChild(this._input);
  this._target && this._target.appendChild(a);
  this.doCustomization(this._input, this._labelInput);
  return this;
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
  this._setClassWhenEvent(this._input, "focus", "blur", "focused");
  this._setClassWhenEvent(this._input, "mouseenter", "mouseleave", "hovered");
};
PInput.prototype._setClassWhenEvent = function(a, b, c, d) {
  a.setEventListener(b, function(a) {
    a.currentTarget.previousElementSibling.addClass(d);
  });
  this._input.setEventListener(c, function(a) {
    a.currentTarget.previousElementSibling.removeClass(d);
  });
};
PInput.prototype.addClass = function(a, b) {
  !0 === b ? this._labelInput.addClass(a) : this._input.addClass(a);
  return this;
};
PInput.prototype.setHeight = function(a) {
  this._input.style.height = a + "px";
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
PInput.prototype.doCustomization = function(a, b) {
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
      this._entity[this.getBoundProperty()] = a;
      break;
    default:
      this._entity[this.getBoundProperty()] = this.getValue();
  }
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
var MultiLineInput = function(a, b, c, d, e, f, g) {
  PInput.call(this, a, b, c, d, e, "textarea", !!g);
  this._rows = f;
};
$jscomp.inherits(MultiLineInput, PInput);
MultiLineInput.prototype.doCustomization = function(a, b) {
  a.setAttribute("rows", this._rows);
  return PInput.prototype.doCustomization.call(this, a);
};
var SingleLineInput = function(a, b, c, d, e, f) {
  PInput.call(this, a, b, c, d, e, "textarea", !!f);
};
$jscomp.inherits(SingleLineInput, PInput);
SingleLineInput.prototype.doCustomization = function(a, b) {
  a.setAttribute("rows", 1);
  a.addClass("no-resize");
  return PInput.prototype.doCustomization.call(this, a, b);
};
var SingleSelectInput = function(a, b, c, d, e, f) {
  PInput.call(this, a, b, c, d, e, "select", !!f);
  this._options = [];
};
$jscomp.inherits(SingleSelectInput, PInput);
SingleSelectInput.prototype.setEmpty = function(a, b) {
  this._options.splice(0, 0, {value:a, text:b, empty:!0});
  return this;
};
SingleSelectInput.prototype.addOption = function(a, b) {
  this._options.push({value:a, text:b, empty:!1});
  return this;
};
SingleSelectInput.prototype.doCustomization = function(a, b) {
  var c = this;
  this._options.forEach(function(b, e) {
    e = document.createElement("option");
    e.value = b.value;
    e.text = b.text;
    b.value === c._value && e.setAttribute("selected", "selected");
    a.appendChild(e);
  });
  b.addClass("focused-fix");
  return PInput.prototype.doCustomization.call(this, a);
};
// Input 4
var PModuleConfig = function(a, b, c) {
  this.document = a;
  this.label = b;
  this.valueHolder = c;
};
PModuleConfig.prototype.bind = function(a, b) {
  this._entity = a;
  this._property = b;
  this.valueHolder.data = a.sections[b];
  return this;
};
PModuleConfig.prototype.render = function() {
  this.update(this._entity);
  this.valueHolder.tab.innerHTML = "<span>" + (this.valueHolder.label || this.label) + "</span>";
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
PModuleConfig.prototype.activate = function() {
  this.valueHolder.renderer.call(this, this.valueHolder);
  this.valueHolder.tab.addClass("selected");
};
PModuleConfig.prototype.beginEditing = function() {
  this.valueHolder.tab.addClass("editing");
};
PModuleConfig.prototype.endEditing = function() {
  this.valueHolder.tab.removeClass("editing");
};
// Input 5
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
ClientManager.getOrCreateClientManager = function(a, b, c) {
  a.hasOwnProperty("clientManager") || (a.clientManager = new ClientManager(a, b, c), a.addEventListener("beforeunload", function(a) {
    a.target.defaultView instanceof Window && a.target.defaultView.clientManager && (a.target.defaultView.clientManager.onUnload(), delete a.target.defaultView.clientManager);
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
  this._initialized || (this._telephones = {}, this._telephones[ArtikelController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModuleController.SHARED_NAME] = this._createMessageChannel(), this._telephones[PluginController.SHARED_NAME] = this._createMessageChannel(), this._telephones[ModulePlanController.SHARED_NAME] = this._createMessageChannel(), this._articleController = ArtikelController.getInstance(this._trello, this._window, this._telephones[ArtikelController.SHARED_NAME].port2), 
  this._moduleController = ModuleController.getInstance(this._trello, this._window, this._telephones[ModuleController.SHARED_NAME].port2), this._pluginController = PluginController.getInstance(this._trello, this._window), this._planController = ModulePlanController.getInstance(this._trello, this._window, this._telephones[ModulePlanController.SHARED_NAME].port2), this._initialized = !0);
  return this;
};
ClientManager.prototype._createMessageChannel = function() {
  var a = this, b = new MessageChannel;
  b.port1.onmessage = function(b) {
    console.log("Received data from sub-module: " + JSON.stringify(b.data));
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
ClientManager.prototype.readKeyBuffer = function() {
  return this._keyBuffer;
};
ClientManager.prototype.flushKeyBuffer = function() {
  this._keyBuffer = "";
};
ClientManager.prototype.appendKeyBuffer = function(a) {
  this._keyBuffer += a;
  console.log("Key Buffer: " + this._keyBuffer);
};
ClientManager.prototype.isArticleModuleEnabled = function() {
  return this._options.hasOwnProperty("module.artikel.enabled") && !0 === this._options["module.artikel.enabled"];
};
ClientManager.prototype.isBeteiligtModuleEnabled = function() {
  return this._options.hasOwnProperty("module.beteiligt.enabled") && !0 === this._options["module.beteiligt.enabled"];
};
ClientManager.prototype.isPlanModuleEnabled = function() {
  return this._options.hasOwnProperty("module.plan.enabled") && !0 === this._options["module.plan.enabled"];
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
// Input 6
var Controller = function(a) {
  this._repository = a;
};
Controller.prototype.update = function() {
};
Controller.prototype.render = function(a) {
};
Controller.prototype.insert = function(a, b) {
  a && this._repository.isNew(a) ? this._repository.add(a, b) : a && this._repository.replace(a, b);
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
// Input 7
var ModulePlanRepository = function() {
  Repository.call(this);
};
$jscomp.inherits(ModulePlanRepository, Repository);
// Input 8
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
// Input 9
var ModuleController = function(a, b, c) {
  this.document = a.document;
  this._window = a;
  this.trelloApi = b;
  this._beteiligtBinding = null;
  this._repository = new BeteiligtRepository;
  this._entity = null;
  this._propertyBag = {};
  this._telephone = c;
  this._telephone.onmessage = this._onMessage();
  this.setVersionInfo();
  this.readPropertyBag();
};
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
ModuleController.prototype.render = function(a) {
  this._entity = a;
  this._beteiligtBinding = this._beteiligtBinding ? this._beteiligtBinding.update(a) : (new BeteiligtBinding(this.document, a, this.onEvent, this)).bind();
};
ModuleController.prototype.insert = function(a, b) {
  a && this._repository.isNew(a) ? this._repository.add(a, b) : a && this._repository.replace(a, b);
};
ModuleController.prototype.update = function() {
  this._entity.sections.ad.total = this.getTotalPrice();
  var a = this.getTotalProjectCosts(), b = this.getCapOnExpenses();
  Object.values(this._entity.sections).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).forEach(function(c) {
    c.project = a;
    c.capOnExpenses = b;
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
  this.persist.call(this, b.config).then(function() {
    console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue());
  });
};
ModuleController.prototype.getTotalPrice = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return a.sections.ad;
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
    return Object.values(a.sections);
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return [isNaN(a.fee) ? 0 : a.fee, isNaN(a.projectFee) ? 0 : a.projectFee];
  }).flat().reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getOverallTotalFee = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a.sections);
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNaN(a.fee) ? 0.0 : a.fee;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalFee = function() {
  return Object.values(this._entity.sections).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNaN(a.fee) ? 0.0 : a.fee;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getTotalCharges = function() {
  return Object.values(this._entity.sections).filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNaN(a.charges) ? 0.0 : a.charges;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getOverallTotalCharges = function() {
  return Object.values(this._repository.all()).map(function(a) {
    return Object.values(a.sections);
  }).flat().filter(function(a) {
    return a instanceof OtherBeteiligt;
  }).map(function(a) {
    return isNaN(a.charges) ? 0.0 : a.charges;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ModuleController.prototype.getCapOnExpenses = function() {
  var a = this.getProperty("cap_on_expenses");
  return isNaN(a) ? 0.0 : parseFloat(a);
};
ModuleController.prototype.getByCard = function(a) {
  return this._repository.get(a);
};
ModuleController.prototype.list = function() {
  return this._repository.all();
};
ModuleController.prototype.size = function() {
  return Object.keys(this.list()).length;
};
ModuleController.prototype.fetchAll = function(a) {
  var b = this;
  return this.trelloApi.cards("id", "closed").filter(function(a) {
    return !a.closed;
  }).each(function(a) {
    return b.trelloApi.get(a.id, "shared", ModuleController.SHARED_NAME).then(function(c) {
      b.insert(ModuleConfig.create(c), a);
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
$jscomp.global.Object.defineProperties(ModuleController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 1;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt";
}}, SHARED_META:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.Meta";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Beteiligt.PropertyBag";
}}});
// Input 10
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
// Input 11
var ArtikelController = function(a, b, c, d) {
  this.document = a.document;
  this._window = a;
  this.trelloApi = b;
  this._beteiligtBinding = this._artikelBinding = this._entity = null;
  this._repository = c;
  this._telephone = d;
  this.setVersionInfo();
};
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
ArtikelController.prototype.insert = function(a, b) {
  a && this._repository.isNew(a) ? this._repository.add(a, b) : a && this._repository.replace(a, b);
};
ArtikelController.prototype.getByCard = function(a) {
  return this._repository.get(a);
};
ArtikelController.prototype.hasArtikelContent = function(a) {
  return !a.isEmpty();
};
ArtikelController.prototype.getRegionMapping = function(a) {
  return ArtikelBinding.getRegionMapping(a);
};
ArtikelController.prototype.getTagMapping = function(a) {
  return ArtikelBinding.getTagMapping(a);
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
  this._entity.total = this.getTotalPageCount();
  this._artikelBinding.update(this._entity);
};
ArtikelController.prototype.blockUi = function() {
  this._artikelBinding.blockUi();
};
ArtikelController.prototype.canUnblock = function() {
  this._window.clientManager.getPluginController().upgrading || this._artikelBinding.unblock();
};
ArtikelController.prototype.getTotalPageCount = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.layout);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
};
ArtikelController.prototype.render = function(a) {
  this._entity = a ? a : Artikel.create();
  this._artikelBinding = this._artikelBinding ? this._artikelBinding.update(this._entity) : (new ArtikelBinding(this.document, this._entity, this.onEvent, this)).bind();
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
// Input 12
var ArtikelBinding = function(a, b, c, d) {
  this.document = a;
  this._action = c;
  this._context = d;
  this._entity = b;
  this._autoUpdater = null;
};
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
  switch(a) {
    case "monday":
      return "Mo.";
    case "tuesday":
      return "Di.";
    case "wednesday":
      return "Mi.";
    case "thursday":
      return "Do.";
    case "friday":
      return "Fr.";
    case "saturday":
      return "Sa.";
    case "sunday":
      return "So.";
    default:
      return a;
  }
};
ArtikelBinding.prototype.update = function(a) {
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
  return this;
};
ArtikelBinding.prototype.bind = function() {
  var a = {context:this._context, artikel:this._entity}, b = {data:this._entity};
  this._topic = this.document.newMultiLineInput(b, "pa.topic", "topic", "Thema", a, this._action, 2, "Lauftext");
  this._from = this.document.newSingleLineInput(b, "pa.input-from", "from", "Input von", a, this._action, "Name");
  this._author = this.document.newSingleLineInput(b, "pa.author", "author", "Textautor*in", a, this._action, "Name");
  this._text = this.document.newMultiLineInput(b, "pa.text", "text", "Textbox", a, this._action, 2, "Lauftext");
  this._pagina = this.document.newSingleLineInput(b, "pa.pagina", "pagina", "Pagina", a, this._action, "Zahl", "number", !1).addClass("pagina").addClass("bold");
  this._layout = this.document.newSingleLineInput(b, "pa.layout", "layout", "Seiten Layout", a, this._action, "Zahl", "number", !1);
  this._total = this.document.newSingleLineInput(b, "pa.total", "total", "Seiten Total", a, this._action, "Summe", "number", !0).addClass("bold");
  this._tags = this.document.newSingleSelect(b, "pa.tags", "tags", "Online", a, this._action, "Liste-Tag", newOption("", "\u2026"), [newOption("monday", ArtikelBinding.getTagMapping("monday")), newOption("tuesday", ArtikelBinding.getTagMapping("tuesday")), newOption("wednesday", ArtikelBinding.getTagMapping("wednesday")), newOption("thursday", ArtikelBinding.getTagMapping("thursday")), newOption("friday", ArtikelBinding.getTagMapping("friday")), newOption("saturday", ArtikelBinding.getTagMapping("saturday")), 
  newOption("sunday", ArtikelBinding.getTagMapping("sunday"))]);
  this._visual = this.document.newSingleSelect(b, "pa.visual", "visual", "Visual", a, this._action, "x-Liste", newOption("", "\u2026"), [newOption("picture", "Bild"), newOption("icon", "Icon"), newOption("graphics", "Grafik"), newOption("videos", "Video"), newOption("illustrations", "Illu")]);
  this._region = this.document.newSingleSelect(b, "pa.region", "region", "Region", a, this._action, "x-Liste", newOption("", "\u2026"), [newOption("north", ArtikelBinding.getRegionMapping("north")), newOption("south", ArtikelBinding.getRegionMapping("south"))]);
  this._season = this.document.newSingleSelect(b, "pa.season", "season", "Saison", a, this._action, "x-Liste", newOption("", "\u2026"), [newOption("summer", "Sommer"), newOption("fall", "Herbst")]);
  this._form = this.document.newSingleSelect(b, "pa.form", "form", "Form", a, this._action, "x-Liste", newOption("", "\u2026"), [newOption("news", "News"), newOption("article", "Artikel"), newOption("report", "Report")]);
  this._location = this.document.newSingleSelect(b, "pa.location", "location", "Ort", a, this._action, "x-Liste", newOption("", "\u2026"), [newOption("cds", "CDS"), newOption("sto", "STO"), newOption("tam", "TAM"), newOption("wid", "WID"), newOption("buech", "Buech"), newOption("rustico", "Rustico"), newOption("schlatt", "Schlatt")]);
  return this;
};
ArtikelBinding.prototype.blockUi = function() {
  if (!(0 < this.document.getElementsByClassName("overlay").length)) {
    var a = this, b = this.document.createElement("div");
    b.addClass("overlay");
    b.appendChild(this.document.createTextNode("Plugin Daten werden aktualisiert..."));
    this.document.getElementsByTagName("body").item(0).appendChild(b);
    this._autoUpdater = this._autoUpdater || setInterval(function() {
      a._context.canUnblock();
    }, 500);
  }
};
ArtikelBinding.prototype.unblock = function() {
  this.document.getElementsByClassName("overlay").forEach(function(a) {
    a.parentNode.removeChild(a);
  });
  this._autoUpdater && clearInterval(this._autoUpdater);
};
// Input 13
var Binding = function(a, b, c, d) {
  this.document = a;
  this._entity = b;
  this._action = c;
  this._context = d;
};
Binding.prototype.update = function(a) {
};
Binding.prototype.bind = function() {
};
// Input 14
var ModulePlanBinding = function(a, b, c, d) {
  Binding.call(this, a, b, c, d);
};
$jscomp.inherits(ModulePlanBinding, Binding);
ModulePlanBinding.prototype.update = function(a) {
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
  return this;
};
ModulePlanBinding.prototype.bind = function() {
  this.onLayout({data:this._entity});
  return this;
};
ModulePlanBinding.prototype.onLayout = function(a) {
  var b = this.document.createElement("div");
  b.innerHTML = template_plan;
  b = b.cloneNode(!0);
  this._switchContent(b);
  b = {context:this._context, valueHolder:a, entity:this._entity};
  this._measures = this.document.newMultiLineInput(a, ".pa.plan.measures", "measures", "Massnahme", b, this._action, 2, "notieren\u2026").addClass("multiline");
  this._description = this.document.newMultiLineInput(a, ".pa.plan.description", "description", "Beschreibung", b, this._action, 3, "notieren\u2026").addClass("rows-2").setHeight(128);
  this._fee = this.document.newSingleLineInput(a, ".pa.plan.fee", "fee", "Total Honorar Beteiligte", b, this._action, "", "money", !0).addClass("multiline", !0);
  this._charges = this.document.newSingleLineInput(a, ".pa.plan.projectFee", "projectFee", "Total Honorar Projekt", b, this._action, "", "money", !0).addClass("multiline", !0).addClass("bold");
  this._thirdPartyCharges = this.document.newSingleLineInput(a, ".pa.plan.thirdPartyCharges", "thirdPartyCharges", "Total Spesen Beteiligte", b, this._action, "", "money", !0).addClass("multiline", !0);
  this._thirdPartyTotalCosts = this.document.newSingleLineInput(a, ".pa.plan.thirdPartyTotalCosts", "thirdPartyTotalCosts", "Total Spesen Projekt", b, this._action, "", "money", !0).addClass("bold").addClass("multiline", !0);
  this._capOnDepenses = this.document.newSingleLineInput(a, ".pa.plan.capOnDepenses", "capOnDepenses", "Kostendach Projekt", b, this._action, "Betrag\u2026", "money", !1).addClass("multiline", !0);
  this._totalCosts = this.document.newSingleLineInput(a, ".pa.plan.totalCosts", "totalCosts", "Total Projekt", b, this._action, "Betrag\u2026", "money", !0).addClass("bold").addClass("multiline", !0);
  this._visual = this.document.newSingleSelect(a, "pa.plan.visual", "visual", "Visual", b, this._action, "x-Liste", newOption("", "\u2026"), [newOption("picture", "Bild"), newOption("icon", "Icon"), newOption("graphics", "Grafik"), newOption("videos", "Video"), newOption("illustrations", "Illu")]);
  this._form = this.document.newSingleSelect(a, "pa.plan.form", "form", "Form", b, this._action, "x-Liste", newOption("", "\u2026"), [newOption("news", "News"), newOption("article", "Artikel"), newOption("report", "Report")]);
  this._online = this.document.newSingleSelect(a, "pa.plan.online", "online", "Online", b, this._action, "Liste-Tag", newOption("", "\u2026"), [newOption("monday", ArtikelBinding.getTagMapping("monday")), newOption("tuesday", ArtikelBinding.getTagMapping("tuesday")), newOption("wednesday", ArtikelBinding.getTagMapping("wednesday")), newOption("thursday", ArtikelBinding.getTagMapping("thursday")), newOption("friday", ArtikelBinding.getTagMapping("friday")), newOption("saturday", ArtikelBinding.getTagMapping("saturday")), 
  newOption("sunday", ArtikelBinding.getTagMapping("sunday"))]);
  this._region = this.document.newSingleSelect(a, "pa.plan.region", "region", "Region", b, this._action, "x-Liste", newOption("", "\u2026"), [newOption("north", ArtikelBinding.getRegionMapping("north")), newOption("south", ArtikelBinding.getRegionMapping("south"))]);
  this._season = this.document.newSingleSelect(a, "pa.plan.season", "season", "Saison", b, this._action, "x-Liste", newOption("", "\u2026"), [newOption("summer", "Sommer"), newOption("fall", "Herbst")]);
  this._place = this.document.newSingleSelect(a, "pa.plan.place", "place", "Ort", b, this._action, "x-Liste", newOption("", "\u2026"), [newOption("cds", "CDS"), newOption("sto", "STO"), newOption("tam", "TAM"), newOption("wid", "WID"), newOption("buech", "Buech"), newOption("rustico", "Rustico"), newOption("schlatt", "Schlatt")]);
};
ModulePlanBinding.prototype._switchContent = function(a) {
  var b = this.document.getElementById("pa.plan.content");
  b.removeChildren();
  b.appendChild(a);
};
// Input 15
var ModulePlanController = function(a, b, c) {
  Controller.call(this, new ModulePlanRepository);
  this._window = a;
  this._trello = b;
  this._telephone = c;
  var d = this;
  this._telephone.onmessage = function(a) {
    Object.values(a.data.result || []).forEach(function(a) {
      Object.entries(a).forEach(function(a) {
        var b = a[1];
        switch(a[0]) {
          case "fee:current":
            this._entity.fee = b;
            break;
          case "fee:overall":
            this._entity.projectFee = b;
            break;
          case "charge:current":
            this._entity.thirdPartyCharges = b;
            break;
          case "charge:overall":
            this._entity.thirdPartyTotalCosts = b;
        }
        this._binding.update(this._entity);
      }, this);
    }, d);
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
ModulePlanController.prototype.render = function(a) {
  this._entity = a;
  this._binding = this._binding ? this._binding.update(a) : (new ModulePlanBinding(this._window.document, a, this.onEvent, this)).bind();
  return Controller.prototype.render.call(this, a);
};
ModulePlanController.prototype.update = function() {
  this._telephone.postMessage({get:["fee:current", "fee:overall", "charge:current", "charge:overall"]});
  this._entity.capOnDepenses = this.getCapOnDepenses();
  this._binding.update(this._entity);
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
  return isNaN(a) ? 0.0 : parseFloat(a);
};
ModulePlanController.prototype.getProjectCosts = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.thirdPartyCharges);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
};
ModulePlanController.prototype.getThirdPartyCosts = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.thirdPartyCharges);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
};
ModulePlanController.prototype.getTotalFeeCharges = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.fee);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return parseInt(a) + parseInt(b);
  }, 0);
};
ModulePlanController.prototype.getByCard = function(a) {
  return this._repository.get(a);
};
ModulePlanController.prototype.hasContent = function(a) {
  return !a.isEmpty();
};
ModulePlanController.prototype.getRegionMapping = function(a) {
  return ArtikelBinding.getRegionMapping(a);
};
ModulePlanController.prototype.getOnlineMapping = function(a) {
  return ArtikelBinding.getTagMapping(a);
};
ModulePlanController.prototype.persist = function(a, b) {
  return this._trello.set(b || "card", "shared", ModulePlanController.SHARED_NAME, a);
};
ModulePlanController.prototype.remove = function() {
  return this._trello.remove("board", "shared", ModulePlanController.SHARED_NAME);
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
$jscomp.global.Object.defineProperties(ModulePlanController, {SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan";
}}, PROPERTY_BAG_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Plan.PropertyBag";
}}});
// Input 16
var PluginController = function(a, b) {
  this._window = b;
  this._trelloApi = a;
  this._upgrading = !1;
  this._upgrades = {1:this._upgrade_1};
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
PluginController.prototype._upgradeAllArticleToModuleConfig = function(a, b) {
  this._upgradeArticleToModuleConfig.call(this, a, b, Object.entries(a.list()), 0);
};
PluginController.prototype._upgradeArticleToModuleConfig = function(a, b, c, d) {
  if (d < c.length) {
    var e = this, f = c[d], g = f[0], h = f[1];
    1 === h.version ? (f = Object.entries(h.involved).reduce(function(a, b) {
      a.sections[b[0]] = b[1];
      return a;
    }, ModuleConfig.create()), b.persist.call(b, f, g).then(function() {
      h.version = Artikel.VERSION;
      h.clearInvolved();
      return a.persist.call(a, h, g);
    }).then(function() {
      e._upgradeArticleToModuleConfig.call(e, a, b, c, d + 1, g);
    })) : (console.log("Skipping article because its at version %d", h.version), this._upgradeArticleToModuleConfig.call(this, a, b, c, d + 1, g));
  } else {
    console.log("All articles updated");
  }
};
$jscomp.global.Object.defineProperties(PluginController.prototype, {upgrading:{configurable:!0, enumerable:!0, get:function() {
  return this._upgrading;
}}});
$jscomp.global.Object.defineProperties(PluginController, {VERSION:{configurable:!0, enumerable:!0, get:function() {
  return 2;
}}, SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.App";
}}});
// Input 17
var BeteiligtBinding = function(a, b, c, d) {
  this.document = a;
  this._config = b;
  this._action = c;
  this._context = d;
  this._involvements = {onsite:this._buildValueHolder("onsite", "pa.involved.onsite", this.onLayout), text:this._buildValueHolder("text", "pa.involved.text", this.onLayout), photo:this._buildValueHolder("photo", "pa.involved.photo", this.onLayout), video:this._buildValueHolder("video", "pa.involved.video", this.onLayout), illu:this._buildValueHolder("illu", "pa.involved.illu", this.onLayout), ad:this._buildValueHolder("ad", "pa.involved.ad", this.onLayout)};
  this._activated = this._ad = this._illu = this._video = this._photo = this._text = this._onsite = null;
};
BeteiligtBinding.prototype._buildValueHolder = function(a, b, c) {
  var d = this;
  b = d.document.getElementById(b);
  return {"involved-in":a, data:null, renderer:function(a) {
    c.call(d, this, a);
  }, tab:b, layout:b.getAttribute("data-layout"), label:b.getAttribute("data-label"), binding:d};
};
BeteiligtBinding.prototype.update = function(a) {
  this._activated.activate();
  Object.values(this).filter(function(a) {
    return a instanceof PModuleConfig;
  }).forEach(function(b) {
    b.update(a);
  });
  this._config = a;
  return this;
};
BeteiligtBinding.prototype.bind = function() {
  this._onsite = null !== this._onsite ? this._onsite.update(this._config) : this._onsite = (new PModuleConfig(this.document, "vor.Ort", this._involvements.onsite)).bind(this._config, "onsite").render();
  this._text = null !== this._text ? this._text.update(this._config) : this._text = (new PModuleConfig(this.document, "Text", this._involvements.text)).bind(this._config, "text").render();
  this._photo = null !== this._photo ? this._photo.update(this._config) : this._photo = (new PModuleConfig(this.document, "Foto", this._involvements.photo)).bind(this._config, "photo").render();
  this._video = null !== this._video ? this._video.update(this._config) : this._video = (new PModuleConfig(this.document, "Video", this._involvements.video)).bind(this._config, "video").render();
  this._illu = null !== this._illu ? this._illu.update(this._config) : this._illu = (new PModuleConfig(this.document, "Illu.Grafik", this._involvements.illu)).bind(this._config, "illu").render();
  this._ad = null !== this._ad ? this._ad.update(this._config) : this._ad = (new PModuleConfig(this.document, "Inserat", this._involvements.ad)).bind(this._config, "ad").render();
  this._activated = this._onsite;
  this._activated.activate();
  return this;
};
BeteiligtBinding.prototype.onRegularLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_regular;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  a = {context:this._context, valueHolder:b, config:this._config};
  this.document.newSingleLineInput(b, ".pa.name", "name", "Name", a, this._action, "eintippen\u2026", "text", !1);
  this.document.newSingleLineInput(b, ".pa.social", "social", "Telefon.Mail.Webseite", a, this._action, "notieren\u2026");
  this.document.newMultiLineInput(b, ".pa.address", "address", "Adresse", a, this._action, 2, "festhalten\u2026");
  this.document.newMultiLineInput(b, ".pa.notes", "notes", "Notiz", a, this._action, 6, "formulieren\u2026").addClass("rows-2");
  this.document.newSingleLineInput(b, ".pa.duedate", "duedate", "Deadline", a, this._action, "bestimmen\u2026", "text", !1);
  this.document.newSingleLineInput(b, ".pa.fee", "fee", "Honorar Massnahme", a, this._action, "Betrag\u2026", "money", !1).addClass("multiline", !0);
  this.document.newSingleLineInput(b, ".pa.projectFee", "projectFee", "Spesen Massnahme", a, this._action, "Betrag\u2026", "money", !1).addClass("multiline", !0);
  this.document.newSingleLineInput(b, ".pa.project", "project", "Total Beteiligte", a, this._action, "Betrag\u2026", "money", !0).addClass("bold").addClass("multiline", !0);
  this.document.newSingleLineInput(b, ".pa.cap_on_expenses", "capOnExpenses", "Kostendach Total Projekt", a, this._action, "Betrag\u2026", "money", !1).addClass("multiline", !0);
};
BeteiligtBinding.prototype.onLayout = function(a, b) {
  switch(b.layout) {
    case "ad":
      this.onAdLayout(a, b);
      break;
    default:
      this.onRegularLayout(a, b);
  }
};
BeteiligtBinding.prototype.onAdLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_ad;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  a = {context:this._context, valueHolder:b, config:this._config};
  this.document.newSingleLineInput(b, ".pa.name", "name", "Kontakt", a, this._action, "eintippen\u2026", "text", !1);
  this.document.newSingleLineInput(b, ".pa.social", "social", "Telefon.Mail.Webseite", a, this._action, "notieren\u2026");
  this.document.newMultiLineInput(b, ".pa.address", "address", "Adresse", a, this._action, 2, "eingeben\u2026");
  this.document.newSingleLineInput(b, ".pa.format", "format", "Format", a, this._action, "festhalten\u2026", "text", !1);
  this.document.newSingleLineInput(b, ".pa.placement", "placement", "Platzierung", a, this._action, "vormerken\u2026", "text", !1);
  this.document.newMultiLineInput(b, ".pa.notes", "notes", "Kunde.Sujet", a, this._action, 2, "Name.Stichwort\u2026");
  this.document.newSingleLineInput(b, ".pa.price", "price", "Preis CHF", a, this._action, "bestimmen\u2026", "money", !1);
  this.document.newSingleLineInput(b, ".pa.total", "total", "Total CHF", a, this._action, "", "money", !0).addClass("bold");
};
BeteiligtBinding.prototype._switchContent = function(a, b) {
  var c = this.document.getElementById("pa.tab.content");
  c.removeChildren();
  this._onsite.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._text.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._photo.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._video.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._illu.valueHolder.tab.removeClasses(["selected", "editing"]);
  this._ad.valueHolder.tab.removeClasses(["selected", "editing"]);
  c.appendChild(b);
  this._activated = a;
};
BeteiligtBinding.prototype.enterEditing = function() {
  this._activated.beginEditing();
};
BeteiligtBinding.prototype.leaveEditing = function() {
  this._activated.endEditing();
};
// Input 18
var Plan = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q, r) {
  this._id = a || uuid();
  this._fee = d;
  this._projectFee = e;
  this._thirdPartyCharges = f;
  this._thirdPartyTotalCosts = g;
  this._capOnDepenses = h;
  this._totalCosts = k;
  this._visual = l;
  this._form = m;
  this._online = n;
  this._season = p;
  this._region = q;
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
// Input 19
var ModuleConfig = function(a, b) {
  this._id = a || uuid();
  this._sections = b;
  this._version = CommonBeteiligt.VERSION;
};
ModuleConfig.create = function(a) {
  var b = JsonSerialization.getProperty(a, "sections") || {};
  return new ModuleConfig(JsonSerialization.getProperty(a, "id"), {onsite:OtherBeteiligt.create(b.onsite), text:OtherBeteiligt.create(b.text), photo:OtherBeteiligt.create(b.photo), video:OtherBeteiligt.create(b.video), illu:OtherBeteiligt.create(b.illu), ad:OtherBeteiligt.create(b.ad)});
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
CommonBeteiligt.create = function(a) {
  if (a) {
    switch(JsonSerialization.getProperty(a, "type")) {
      case "ad":
        return AdBeteiligt.create(a);
      default:
        return OtherBeteiligt.create(a);
    }
  } else {
    throw Error("Invalid jsonObj: cannot create Beteiligt Entity");
  }
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
var OtherBeteiligt = function(a, b, c, d, e, f, g, h, k, l) {
  CommonBeteiligt.call(this, a, b, c, d, e);
  this._duedate = f;
  this._fee = g;
  this._charges = h;
  this._project = k;
  this._capOnExpenses = l;
  this.type = "other";
};
$jscomp.inherits(OtherBeteiligt, CommonBeteiligt);
OtherBeteiligt.create = function(a) {
  return this._create(a);
};
OtherBeteiligt._create = function(a) {
  return a ? new OtherBeteiligt(JsonSerialization.getProperty(a, "id"), JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "duedate"), JsonSerialization.getProperty(a, "fee"), JsonSerialization.getProperty(a, "charges"), JsonSerialization.getProperty(a, "project"), JsonSerialization.getProperty(a, "capOnExpenses")) : new OtherBeteiligt;
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
}}, capOnExpenses:{configurable:!0, enumerable:!0, get:function() {
  return this._capOnExpenses;
}, set:function(a) {
  this._capOnExpenses = a;
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
// Input 20
var Artikel = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
  this._id = a || uuid();
  this._measures = b;
  this._description = c;
  this._from = d;
  this._layout = e;
  this._total = f;
  this._tags = g;
  this._form = p;
  this._visual = h;
  this._region = k;
  this._season = l;
  this._location = q;
  this._author = m;
  this._text = n;
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
  return this._measures;
}, set:function(a) {
  this._measures = a;
}}, pagina:{configurable:!0, enumerable:!0, get:function() {
  return this._description;
}, set:function(a) {
  this._description = a;
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
  return 2;
}}});
// Input 21
HTMLElement.prototype.addClass = function(a) {
  -1 === this.className.split(" ").indexOf(a) && (this.className += " " + a, this.className = this.className.trim());
  return this;
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
HTMLElement.prototype.setEventListener = function(a, b) {
  this.removeEventListener(a, b);
  this.addEventListener(a, b);
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
HTMLDocument.prototype.newMultiLineInput = function(a, b, c, d, e, f, g, h) {
  return (new MultiLineInput(this, d, null, b, void 0 === h ? "" : h, void 0 === g ? 2 : g, !1)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e).render();
};
HTMLDocument.prototype.newSingleLineInput = function(a, b, c, d, e, f, g, h, k) {
  h = void 0 === h ? "text" : h;
  k = void 0 === k ? !1 : k;
  b = new SingleLineInput(this, d, null, b, void 0 === g ? "" : g, k);
  b.propertyType = h || "text";
  null !== c && b.bind(a.data, c);
  a = function() {
  };
  b.onFocus(f, e).onEnterEditing(f, e).onChange(k ? a : f, e).render();
  return b;
};
HTMLDocument.prototype.newSingleSelect = function(a, b, c, d, e, f, g, h, k) {
  var l = (new SingleSelectInput(this, d, null, b, void 0 === g ? "" : g)).bind(a.data, c).onFocus(f, e).onEnterEditing(f, e).onChange(f, e);
  k.forEach(function(a, b) {
    l.addOption(a.value, a.text);
  });
  l.setEmpty(h.value, h.text);
  return l.render();
};
Window.prototype.isBlank = function(a) {
  return !a || 0 === (a + "").trim().length;
};
function newOption(a, b) {
  return {value:a, text:b};
}
;
// Input 22
var template_regular = '<div id="template">    <div class="row">        <div class="col-6">            <div class="row">                <div class="col-12 less-padding-right">                    <div class="pa.name"></div>                </div>                <div class="col-12 less-padding-right">                    <div class="pa.social"></div>                </div>                <div class="col-12 less-padding-right">                    <div class="pa.address"></div>                </div>            </div>        </div>        <div class="col-6">            <div class="row">                <div class="col-12 less-padding-left before-last-row">                    <div class="pa.notes"></div>                </div>            </div>            <div class="row">                <div class="col-12 less-padding-left align-bottom">                    <div class="pa.duedate"></div>                </div>            </div>        </div>    </div>    <div class="row">        <div class="col-12">            <div class="row">                <div class="col-3 less-padding-right">                    <div class="pa.fee"></div>                </div>                <div class="col-3 less-padding">                    <div class="pa.projectFee"></div>                </div>                <div class="col-3 less-padding">                </div>                <div class="col-3 less-padding-left">                    <div class="pa.project"></div>                </div>            </div>        </div>    </div></div>', 
template_ad = '<div id="template" class="row">    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-right">                <div class="pa.notes"></div>            </div>        </div>        <div class="row before-last-row">            <div class="col-6 less-padding-right">                <div class="pa.format"></div>            </div>            <div class="col-6 less-padding">                <div class="pa.placement"></div>            </div>        </div>        <div class="row align-bottom">            <div class="col-6 less-padding-right">                <div class="pa.price"></div>            </div>            <div class="col-6 less-padding">                <div class="pa.total"></div>            </div>        </div>    </div>    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-left">                <div class="pa.name"></div>            </div>            <div class="col-12 less-padding-left">                <div class="pa.social"></div>            </div>            <div class="col-12 less-padding-left">                <div class="pa.address"></div>            </div>        </div>    </div></div>', 
template_plan = '<div id="template">    <div class="row">        <div class="col-6">            <div class="row">                <div class="col-12 less-padding-right">                    <div class="pa.plan.measures"></div>                </div>                <div class="col-12 less-padding-right before-last-row">                    <div class="pa.plan.description"></div>                </div>            </div>        </div>        <div class="col-6">            <div class="row">                <div class="col-6 less-padding">                    <div class="pa.plan.fee"></div>                </div>                <div class="col-6 less-padding-left">                    <div class="pa.plan.projectFee"></div>                </div>            </div>            <div class="row">                <div class="col-6 less-padding">                    <div class="pa.plan.thirdPartyCharges"></div>                </div>                <div class="col-6 less-padding-left">                    <div class="pa.plan.thirdPartyTotalCosts"></div>                </div>            </div>            <div class="row">                <div class="col-6 less-padding before-last-row">                    <div class="pa.plan.capOnDepenses"></div>                </div>                <div class="col-6 less-padding-left before-last-row">                    <div class="pa.plan.totalCosts"></div>                </div>            </div>        </div>    </div>    <div class="row">        <div class="col-12">            <div class="row align-bottom">                <div class="col-2 col-xs-4 less-padding-right">                    <div id="pa.plan.visual"></div>                </div>                <div class="col-2 col-xs-4 less-padding">                    <div id="pa.plan.form"></div>                </div>                <div class="col-2 col-xs-4 less-padding">                    <div id="pa.plan.online"></div>                </div>                <div class="col-2 col-xs-4 less-padding">                    <div id="pa.plan.season"></div>                </div>                <div class="col-2 col-xs-4 less-padding">                    <div id="pa.plan.region"></div>                </div>                <div class="col-2 col-xs-4 less-padding-left">                    <div id="pa.plan.place"></div>                </div>            </div>        </div>    </div></div>';
// Input 23
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

