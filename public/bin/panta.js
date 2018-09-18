// Input 0
var $jscomp = $jscomp || {};
$jscomp.scope = {};
$jscomp.getGlobal = function(a) {
  return "undefined" != typeof window && window === a ? a : "undefined" != typeof global && null != global ? global : a;
};
$jscomp.global = $jscomp.getGlobal(this);
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
$jscomp.checkStringArgs = function(a, b, c) {
  if (null == a) {
    throw new TypeError("The 'this' value for String.prototype." + c + " must not be null or undefined");
  }
  if (b instanceof RegExp) {
    throw new TypeError("First argument to String.prototype." + c + " must not be a regular expression");
  }
  return a + "";
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
$jscomp.polyfill("Array.prototype.keys", function(a) {
  return a ? a : function() {
    return $jscomp.iteratorFromArray(this, function(a) {
      return a;
    });
  };
}, "es6", "es3");
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
  this._property = null;
  this._propertyType = "text";
};
PInput.prototype.setPropertyType = function(a) {
  this.propertyType = a;
  return this;
};
PInput.prototype.bind = function(a, b) {
  this._artikel = a;
  this._property = b;
  this._value = a[b];
  this._updateProperty();
  return this;
};
PInput.prototype._updateProperty = function() {
  var a = this._artikel[this.getBoundProperty()];
  a || (this._input.value = null);
  switch(this.propertyType) {
    case "number":
      this._input.value = this._formatNumber(a);
      break;
    case "money":
      this._input.value = this._formatNumber(a, {minimumFractionDigits:2});
      break;
    default:
      this._input.value = a || "";
  }
};
PInput.prototype.update = function(a) {
  this._artikel = a;
  this._updateProperty();
  return this;
};
PInput.prototype.render = function() {
  var a = this._document.createElement("div");
  this._input.setAttribute("name", this._name);
  this._input.placeholder = this._placeholder;
  this._input.setAttribute("title", this._label);
  this._value && (this._updateProperty(), "textarea" === this._type && this._input.appendChild(this._document.createTextNode(this._value)));
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
  this._readonly && this._input.setAttribute("readonly", "readonly");
  this._input.addClass(this.propertyType);
  this.setupEvents();
  this._input.addClass("u-border");
  var b = this._document.createElement("label");
  b.appendChild(this._document.createTextNode(this._label));
  b.setAttribute("for", this._input.getAttribute("name"));
  b.addClass("prop-" + this._type);
  a.appendChild(b);
  a.appendChild(this._input);
  0 === this._label.length ? a.setAttribute("class", "field hidden") : a.setAttribute("class", "field");
  if (this._target instanceof HTMLCollection) {
    for (var c = this._target, d = 0; d < c.length; d++) {
      c.item(d).appendChild(a.cloneNode(!0));
    }
  } else {
    null !== this._target && this._target.appendChild(a);
  }
  this.doCustomization(this._input, b);
  return this;
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
PInput.prototype.addClass = function(a) {
  this._input.addClass(a);
  return this;
};
PInput.prototype.onChange = function(a, b) {
  var c = this;
  this._input.onchange = function() {
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
  return this._artikel;
};
PInput.prototype.setProperty = function() {
  switch(this.propertyType) {
    case "money":
    case "number":
      var a = this._parseNumber(this.getValue());
      this._artikel[this.getBoundProperty()] = a;
      break;
    default:
      this._artikel[this.getBoundProperty()] = this.getValue();
  }
};
PInput.prototype._formatNumber = function(a, b) {
  a = parseFloat(a);
  return isNaN(a) ? null : a.toLocaleString(void 0, b);
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
  PInput.call(this, a, b, c, d, e, "input", !!f);
};
$jscomp.inherits(SingleLineInput, PInput);
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
// Input 1
var PForms = function(a, b, c) {
  this.document = a;
  this.label = b;
  this.valueHolder = c;
};
PForms.prototype.bind = function(a, b) {
  this._artikel = a;
  this._property = b;
  this.valueHolder.data = a.getInvolvedFor(b);
  return this;
};
PForms.prototype.render = function() {
  this.update(this._artikel);
  this.valueHolder.tab.innerHTML = "<span>" + this.label + "</span>";
  var a = this;
  this.valueHolder.tab.addEventListener("click", function(b) {
    a.activate();
  });
  return this;
};
PForms.prototype.update = function(a) {
  null !== a && (this.valueHolder.data = a.getInvolvedFor(this._property));
  this.valueHolder.data.isEmpty() ? this.valueHolder.tab.removeClass("content") : this.valueHolder.tab.addClass("content");
  return this;
};
PForms.prototype.activate = function() {
  this.valueHolder.renderer.call(this, this.valueHolder);
  this.valueHolder.tab.addClass("selected");
};
// Input 2
var ArtikelRepository = function() {
  this._repository = {};
  this._contains = function(a) {
    return function(b, c) {
      return b.id === a.id;
    };
  };
};
ArtikelRepository.prototype.all = function() {
  return this._repository;
};
ArtikelRepository.prototype.add = function(a, b) {
  this._repository[b.id] = a;
  console.debug("Artikel added: " + a.id + " (size=" + this._repository.length + ")");
};
ArtikelRepository.prototype.replace = function(a, b) {
  this._repository[b.id] = a;
};
ArtikelRepository.prototype.get = function(a) {
  return this._repository[a.id];
};
ArtikelRepository.prototype.isNew = function(a) {
  var b = this;
  return null === Object.keys(this._repository).find(function(c, d) {
    return b._repository[c].id === a.id;
  });
};
// Input 3
var ArtikelController = function(a, b) {
  this.document = a;
  this.trelloApi = b;
  this._beteiligtBinding = this._artikelBinding = this._artikel = null;
  this._repository = new ArtikelRepository;
};
ArtikelController.prototype.insert = function(a, b) {
  a && this._repository.isNew(a) ? this._repository.add(a) : a && this._repository.replace(a, b);
};
ArtikelController.prototype.getByCard = function(a) {
  return this._repository.get(a);
};
ArtikelController.prototype.getRegionMapping = function(a) {
  return ArtikelBinding.getRegionMapping(a);
};
ArtikelController.prototype.getTagMapping = function(a) {
  return ArtikelBinding.getTagMapping(a);
};
ArtikelController.prototype.list = function() {
  return this._repository.all();
};
ArtikelController.prototype.isManaged = function(a) {
  return null !== a.id;
};
ArtikelController.prototype.manage = function(a) {
  a.id = uuid();
  return a;
};
ArtikelController.prototype.update = function() {
  this._artikel.total = this.getTotalPageCount();
  this._artikel.getInvolvedFor("ad").total = this.getTotalPrice();
  this._artikelBinding.update(this._artikel);
  this._beteiligtBinding.update(this._artikel);
};
ArtikelController.prototype.getTotalPrice = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    return a.getInvolvedFor("ad");
  }).filter(function(a, b) {
    return a instanceof AdBeteiligt && !isNaN(parseFloat(a.price));
  }).map(function(a, b) {
    return a.price;
  }).reduce(function(a, b) {
    return parseFloat(a) + parseFloat(b);
  }, 0.0);
};
ArtikelController.prototype.getTotalPageCount = function() {
  return Object.values(this._repository.all()).map(function(a, b) {
    a = parseInt(a.layout);
    return isNaN(a) ? 0 : a;
  }).reduce(function(a, b) {
    return a + b;
  }, 0);
};
ArtikelController.prototype.render = function(a) {
  this._artikel = a ? a : Artikel.create();
  this._artikelBinding = this._artikelBinding ? this._artikelBinding.update(this._artikel) : (new ArtikelBinding(this.document, this._artikel, this.onArtikelChanged, this)).bind();
  this._beteiligtBinding = this._beteiligtBinding ? this._beteiligtBinding.update(this._artikel) : (new BeteiligtBinding(this.document, this._artikel, this.onDataInvolvedChanged, this)).bind();
};
ArtikelController.prototype.onDataInvolvedChanged = function(a, b) {
  a.setProperty();
  var c = b.context, d = b.valueHolder;
  b = b.artikel;
  var e = a.getBinding();
  b.putInvolved(d["involved-in"], e);
  c._persistArtikel(c.trelloApi, b);
  console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue());
};
ArtikelController.prototype.onArtikelChanged = function(a, b) {
  a.setProperty();
  b.context._persistArtikel(b.context.trelloApi, a.getBinding());
  console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue());
};
ArtikelController.prototype._persistArtikel = function(a, b) {
  a.set("card", "shared", ArtikelController.SHARED_NAME, b);
};
$jscomp.global.Object.defineProperties(ArtikelController, {SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Artikel";
}}});
// Input 4
var ArtikelBinding = function(a, b, c, d) {
  this.document = a;
  this._action = c;
  this._context = d;
  this._artikel = b;
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
  this._total.update(a);
  this._layout.update(a);
  return this;
};
ArtikelBinding.prototype.bind = function() {
  this._topic = (new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)).bind(this._artikel, "topic").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._from = (new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")).bind(this._artikel, "from").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._author = (new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")).bind(this._artikel, "author").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._text = (new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 2)).bind(this._artikel, "text").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._pagina = (new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")).addClass("pagina").addClass("bold").bind(this._artikel, "pagina").setPropertyType("number").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._layout = (new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")).setPropertyType("number").bind(this._artikel, "layout").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._total = (new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe", !0)).setPropertyType("number").addClass("bold").bind(this._artikel, "total").render();
  this._total.propertyType = "number";
  this._tags = (new SingleSelectInput(this.document, "Online", null, "pa.tags", "Liste-Tag")).addOption("monday", ArtikelBinding.getTagMapping("monday")).addOption("tuesday", ArtikelBinding.getTagMapping("tuesday")).addOption("wednesday", ArtikelBinding.getTagMapping("wednesday")).addOption("thursday", ArtikelBinding.getTagMapping("thursday")).addOption("friday", ArtikelBinding.getTagMapping("friday")).addOption("saturday", ArtikelBinding.getTagMapping("saturday")).addOption("sunday", ArtikelBinding.getTagMapping("sunday")).setEmpty("", 
  "\u2026").bind(this._artikel, "tags").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._visual = (new SingleSelectInput(this.document, "Visual", null, "pa.visual", "x-Liste")).addOption("picture", "Bild").addOption("icon", "Icon").addOption("graphics", "Grafik").addOption("videos", "Video").addOption("illustrations", "Illu").setEmpty("", "\u2026").bind(this._artikel, "visual").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._region = (new SingleSelectInput(this.document, "Region", null, "pa.region", "x-Liste")).addOption("north", ArtikelBinding.getRegionMapping("north")).addOption("south", ArtikelBinding.getRegionMapping("south")).setEmpty("", "\u2026").bind(this._artikel, "region").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._season = (new SingleSelectInput(this.document, "Saison", null, "pa.season", "x-Liste")).addOption("summer", "Sommer").addOption("fall", "Herbst").setEmpty("", "\u2026").bind(this._artikel, "season").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._form = (new SingleSelectInput(this.document, "Form", null, "pa.form", "x-Liste")).addOption("news", "News").addOption("article", "Artikel").addOption("report", "Report").setEmpty("", "\u2026").bind(this._artikel, "form").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  this._location = (new SingleSelectInput(this.document, "Ort", null, "pa.location", "x-Liste")).addOption("cds", "CDS").addOption("sto", "STO").addOption("tam", "TAM").addOption("wid", "WID").addOption("buech", "Buech").addOption("rustico", "Rustico").addOption("schlatt", "Schlatt").setEmpty("", "\u2026").bind(this._artikel, "location").onChange(this._action, {context:this._context, artikel:this._artikel}).render();
  (new SingleLineInput(this.document, "", null, "pa.additional.1", "", !0)).render();
  (new SingleLineInput(this.document, "", null, "pa.additional.2", "", !0)).render();
  return this;
};
// Input 5
var BeteiligtBinding = function(a, b, c, d) {
  this.document = a;
  this._artikel = b;
  this._action = c;
  this._context = d;
  this._involvements = {onsite:this._buildValueHolder("onsite", "pa.involved.onsite", this.onRegularLayout), text:this._buildValueHolder("text", "pa.involved.text", this.onRegularLayout), photo:this._buildValueHolder("photo", "pa.involved.photo", this.onRegularLayout), video:this._buildValueHolder("video", "pa.involved.video", this.onRegularLayout), illu:this._buildValueHolder("illu", "pa.involved.illu", this.onRegularLayout), ad:this._buildValueHolder("ad", "pa.involved.ad", this.onAdLayout)};
  this._activated = this._ad = this._illu = this._video = this._photo = this._text = this._onsite = null;
};
BeteiligtBinding.prototype._buildValueHolder = function(a, b, c) {
  var d = this;
  return {"involved-in":a, data:null, renderer:function(a) {
    c.call(d, this, a);
  }, tab:d.document.getElementById(b), binding:d};
};
BeteiligtBinding.prototype.update = function(a) {
  this._activated.activate();
  this._activated.update(a);
  this._ad.update(a);
  return this;
};
BeteiligtBinding.prototype.bind = function() {
  this._onsite = null !== this._onsite ? this._onsite.update(this._artikel) : this._onsite = (new PForms(this.document, "vor.Ort", this._involvements.onsite)).bind(this._artikel, "onsite").render();
  this._text = null !== this._text ? this._text.update(this._artikel) : this._text = (new PForms(this.document, "Text", this._involvements.text)).bind(this._artikel, "text").render();
  this._photo = null !== this._photo ? this._photo.update(this._artikel) : this._photo = (new PForms(this.document, "Foto", this._involvements.photo)).bind(this._artikel, "photo").render();
  this._video = null !== this._video ? this._video.update(this._artikel) : this._video = (new PForms(this.document, "Video", this._involvements.video)).bind(this._artikel, "video").render();
  this._illu = null !== this._illu ? this._illu.update(this._artikel) : this._illu = (new PForms(this.document, "Illu.Grafik", this._involvements.illu)).bind(this._artikel, "illu").render();
  this._ad = null !== this._ad ? this._ad.update(this._artikel) : this._ad = (new PForms(this.document, "Inserat", this._involvements.ad)).bind(this._artikel, "ad").render();
  this._activated = this._onsite;
  this._activated.activate();
  return this;
};
BeteiligtBinding.prototype.onRegularLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_regular;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  this.newSingleLineInput(b, ".pa.name", "name", "Name", !1, "text", "eintippen\u2026");
  this.newMultiLineInput(b, ".pa.social", "social", "Telefon.Mail.Webseite", 2, "notieren\u2026");
  this.newMultiLineInput(b, ".pa.address", "address", "Adresse", 2, "festhalten\u2026");
  this.newMultiLineInput(b, ".pa.notes", "notes", "Notiz", 4, "formulieren\u2026");
  this.newSingleLineInput(b, ".pa.duedate", "duedate", "Deadline", !1, "text", "bestimmen\u2026");
};
BeteiligtBinding.prototype.onAdLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_ad;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  this.newSingleLineInput(b, ".pa.name", "name", "Kontakt", !1, "text", "eintippen\u2026");
  this.newMultiLineInput(b, ".pa.social", "social", "Telefon.Mail.Webseite", 2, "notieren\u2026");
  this.newMultiLineInput(b, ".pa.address", "address", "Adresse", 2, "eingeben\u2026");
  this.newSingleLineInput(b, ".pa.format", "format", "Format", !1, "text", "festhalten\u2026");
  this.newSingleLineInput(b, ".pa.placement", "placement", "Platzierung", !1, "text", "vormerken\u2026");
  this.newMultiLineInput(b, ".pa.notes", "notes", "Kunde.Sujet", 2, "Name.Stichwort\u2026");
  this.newSingleLineInput(b, ".pa.price", "price", "Preis CHF", !1, "money", "bestimmen\u2026");
  this.newSingleLineInput(b, ".pa.total", "total", "Total CHF", !0, "money", "").addClass("bold");
};
BeteiligtBinding.prototype.newMultiLineInput = function(a, b, c, d, e, f) {
  c = void 0 === c ? "social" : c;
  return (new MultiLineInput(this.document, void 0 === d ? "Telefon.Mail.Webseite" : d, null, void 0 === b ? ".pa.social" : b, void 0 === f ? "" : f, e, !1)).bind(a.data, c).onChange(this._action, {context:this._context, valueHolder:a, artikel:this._artikel}).render();
};
BeteiligtBinding.prototype.newSingleLineInput = function(a, b, c, d, e, f, g) {
  c = void 0 === c ? null : c;
  f = void 0 === f ? "text" : f;
  b = new SingleLineInput(this.document, void 0 === d ? "Name" : d, null, void 0 === b ? ".pa.name" : b, void 0 === g ? "" : g, void 0 === e ? !1 : e);
  b.propertyType = f || "text";
  null !== c && b.bind(a.data, c);
  b.onChange(this._action, {context:this._context, valueHolder:a, artikel:this._artikel}).render();
  return b;
};
BeteiligtBinding.prototype._switchContent = function(a, b) {
  var c = this.document.getElementById("pa.tab.content");
  c.removeChildren();
  this._onsite.valueHolder.tab.removeClass("selected");
  this._text.valueHolder.tab.removeClass("selected");
  this._photo.valueHolder.tab.removeClass("selected");
  this._video.valueHolder.tab.removeClass("selected");
  this._illu.valueHolder.tab.removeClass("selected");
  this._ad.valueHolder.tab.removeClass("selected");
  c.appendChild(b);
  this._activated = a;
};
// Input 6
var CommonBeteiligt = function(a, b, c, d) {
  this._name = a;
  this._social = b;
  this._address = c;
  this._notes = d;
};
CommonBeteiligt.prototype.isEmpty = function() {
  return !this.name && !this.social && !this.address && !this.notes;
};
$jscomp.global.Object.defineProperties(CommonBeteiligt.prototype, {name:{configurable:!0, enumerable:!0, get:function() {
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
}}});
var OtherBeteiligt = function(a, b, c, d, e) {
  CommonBeteiligt.call(this, a, b, c, d);
  this._duedate = e;
};
$jscomp.inherits(OtherBeteiligt, CommonBeteiligt);
OtherBeteiligt.create = function(a) {
  return this._create(a);
};
OtherBeteiligt._create = function(a) {
  return a ? new OtherBeteiligt(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "duedate")) : new OtherBeteiligt;
};
OtherBeteiligt.prototype.isEmpty = function() {
  return CommonBeteiligt.prototype.isEmpty.call(this) && !this.duedate;
};
$jscomp.global.Object.defineProperties(OtherBeteiligt.prototype, {duedate:{configurable:!0, enumerable:!0, get:function() {
  return this._duedate;
}, set:function(a) {
  this._duedate = a;
}}});
var AdBeteiligt = function(a, b, c, d, e, f, g) {
  CommonBeteiligt.call(this, a, b, c, d);
  this._format = e;
  this._placement = f;
  this._price = g;
  this._total = 0;
};
$jscomp.inherits(AdBeteiligt, CommonBeteiligt);
AdBeteiligt.create = function(a) {
  return this._create(a);
};
AdBeteiligt._create = function(a) {
  return a ? new AdBeteiligt(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "format"), JsonSerialization.getProperty(a, "placement"), JsonSerialization.getProperty(a, "price")) : new AdBeteiligt;
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
// Input 7
var Artikel = function(a, b, c, d, e, f, g, h, k, l, m, n, p, q) {
  this._id = a || uuid();
  this._topic = b;
  this._pagina = c;
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
    "location"), JsonSerialization.getProperty(a, "form"));
    b.involved = JsonSerialization.getProperty(a, "involved");
    return b;
  }
  return new Artikel;
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
}}});
// Input 8
HTMLElement.prototype.addClass = function(a) {
  -1 === this.className.split(" ").indexOf(a) && (this.className += " " + a, this.className = this.className.trim());
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
HTMLCollection.prototype.forEach = function(a, b) {
  for (a = 0; a < this.length; a++) {
    b(this[a]);
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
;
// Input 9
var template_regular = '<div id="template" class="row">    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-right">                <div class="pa.name"></div>            </div>            <div class="col-12 less-padding-right">                <div class="pa.social"></div>            </div>            <div class="col-12 less-padding-right">                <div class="pa.address"></div>            </div>        </div>    </div>    <div class="col-6">        <div class="row before-last-row">            <div class="col-12 less-padding-left">                <div class="pa.notes"></div>            </div>        </div>        <div class="row align-bottom">            <div class="col-12 less-padding-left">                <div class="pa.duedate"></div>            </div>        </div>    </div></div>', 
template_ad = '<div id="template" class="row">    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-right">                <div class="pa.notes"></div>            </div>        </div>        <div class="row before-last-row">            <div class="col-6 less-padding-right">                <div class="pa.format"></div>            </div>            <div class="col-6 less-padding">                <div class="pa.placement"></div>            </div>        </div>        <div class="row align-bottom">            <div class="col-6 less-padding-right">                <div class="pa.price"></div>            </div>            <div class="col-6 less-padding">                <div class="pa.total"></div>            </div>        </div>    </div>    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-left">                <div class="pa.name"></div>            </div>            <div class="col-12 less-padding-left">                <div class="pa.social"></div>            </div>            <div class="col-12 less-padding-left">                <div class="pa.address"></div>            </div>        </div>    </div></div>';
// Input 10
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
  return a[JsonSerialization.denomalize(b)];
};
JsonSerialization.prototype.getAllProperties = function(a) {
  return Object.getOwnPropertyNames(a);
};

