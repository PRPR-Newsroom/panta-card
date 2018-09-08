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
var PInput = function(a, b, c, d, e, f, g) {
  this._document = a;
  this._label = 0 === b.length ? "" : b;
  this._value = c;
  this._name = "name_" + d;
  d.startsWith(".", 0) ? this._target = this._document.getElementsByClassName(d.substr(1)).item(0) : this._target = this._document.getElementById(d);
  this._type = f;
  this._placeholder = e;
  this._readonly = g;
  this._onchange = function() {
  };
  this._input = this._document.createElement(this._type);
  this._property = null;
};
PInput.prototype.bind = function(a, b) {
  this._entity = a;
  this._property = b;
  this._value = a[b];
  return this;
};
PInput.prototype.update = function() {
  this._input.value = this.getValue();
  return this;
};
PInput.prototype.render = function() {
  var a = this._document.createElement("div");
  this._input.setAttribute("name", this._name);
  this._input.placeholder = this._placeholder;
  this._input.setAttribute("title", this._label);
  this._value && (this._input.value = this._value, "textarea" === this._type && this._input.appendChild(this._document.createTextNode(this._value)));
  "input" === this._type && this._input.setAttribute("type", "text");
  this._readonly && this._input.setAttribute("readonly", "readonly");
  this.doCustomization(this._input);
  var b = this._document.createElement("label");
  b.appendChild(this._document.createTextNode(this._label));
  b.setAttribute("for", this._input.getAttribute("name"));
  a.appendChild(this._input);
  a.appendChild(b);
  0 === this._label.length ? a.setAttribute("class", "field hidden") : a.setAttribute("class", "field");
  if (this._target instanceof HTMLCollection) {
    b = this._target;
    for (var c = 0; c < b.length; c++) {
      b.item(c).appendChild(a.cloneNode(!0));
    }
  } else {
    this._target.appendChild(a);
  }
  return this;
};
PInput.prototype.onChange = function(a, b) {
  var c = this;
  this._input.onchange = function() {
    a(c, b);
  };
  return this;
};
PInput.prototype.doCustomization = function(a) {
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
  this._entity[this.getBoundProperty()] = this.getValue();
};
var MultiLineInput = function(a, b, c, d, e, f, g) {
  PInput.call(this, a, b, c, d, e, "textarea", !!g);
  this._rows = f;
};
$jscomp.inherits(MultiLineInput, PInput);
MultiLineInput.prototype.doCustomization = function(a) {
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
SingleSelectInput.prototype.addOption = function(a, b) {
  this._options.push({value:a, text:b});
  return this;
};
SingleSelectInput.prototype.doCustomization = function(a) {
  this._options.forEach(function(b, c) {
    c = document.createElement("option");
    c.value = b.value;
    c.text = b.text;
    a.appendChild(c);
  });
  return PInput.prototype.doCustomization.call(this, a);
};
// Input 1
var PForms = function(a, b, c) {
  this.document = a;
  this.label = b;
  this.valueHolder = c;
};
PForms.prototype.bind = function(a, b) {
  this._entity = a;
  this._property = b;
  this.valueHolder.data = a.getInvolvedFor(b);
  return this;
};
PForms.prototype.render = function() {
  this.update();
  this.valueHolder.tab.innerHTML = "<span>" + this.label + "</span>";
  var a = this;
  this.valueHolder.tab.addEventListener("click", function(b) {
    a.activate();
  });
  return this;
};
PForms.prototype.update = function() {
  this.valueHolder.data.isEmpty() ? this.valueHolder.tab.removeClass("content") : this.valueHolder.tab.addClass("content");
  return this;
};
PForms.prototype.activate = function() {
  this.valueHolder.renderer.call(this, this.valueHolder);
  this.valueHolder.tab.addClass("selected");
};
// Input 2
var ArtikelController = function(a, b) {
  this.document = a;
  this.trelloApi = b;
  this._activated = this._ad = this._illu = this._video = this._photo = this._text = this._onsite = this._topic = this._entity = null;
  this._involvements = {onsite:this._buildValueHolder("onsite", "pa.involved.onsite", this.onRegularLayout), text:this._buildValueHolder("text", "pa.involved.text", this.onRegularLayout), photo:this._buildValueHolder("photo", "pa.involved.photo", this.onRegularLayout), video:this._buildValueHolder("video", "pa.involved.video", this.onRegularLayout), illu:this._buildValueHolder("illu", "pa.involved.illu", this.onRegularLayout), ad:this._buildValueHolder("ad", "pa.involved.ad", this.onAdLayout)};
};
ArtikelController.prototype._buildValueHolder = function(a, b, c) {
  var d = this;
  return {"involved-in":a, data:null, renderer:function(a) {
    c.call(d, this, a);
  }, tab:d.document.getElementById(b)};
};
ArtikelController.prototype.onAdLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_ad;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  (new SingleLineInput(this.document, "Name", null, ".pa.name", "")).bind(b.data, "name").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, ".pa.social", "", 2, !1)).bind(b.data, "social").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Adresse", null, ".pa.address", "", 2, !1)).bind(b.data, "address").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new SingleLineInput(this.document, "Format", null, ".pa.format", "")).bind(b.data, "format").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new SingleLineInput(this.document, "Platzierung", null, ".pa.placement", "")).bind(b.data, "placement").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Notiz", null, ".pa.notes", "", 2, !1)).bind(b.data, "notes").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new SingleLineInput(this.document, "Preis CHF", null, ".pa.price", "")).bind(b.data, "price").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new SingleLineInput(this.document, "Total CHF", null, ".pa.total", "", !0)).onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
};
ArtikelController.prototype.onRegularLayout = function(a, b) {
  var c = this.document.createElement("div");
  c.innerHTML = template_regular;
  c = c.cloneNode(!0);
  this._switchContent(a, c);
  (new SingleLineInput(this.document, "Name", null, ".pa.name", "")).bind(b.data, "name").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, ".pa.social", "", 2, !1)).bind(b.data, "social").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Adresse", null, ".pa.address", "", 2, !1)).bind(b.data, "address").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new MultiLineInput(this.document, "Notiz", null, ".pa.notes", "", 5, !1)).bind(b.data, "notes").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
  (new SingleLineInput(this.document, "Deadline", null, ".pa.duedate", "")).bind(b.data, "duedate").onChange(this.putDataInvolved, {trelloApi:this.trelloApi, valueHolder:b, artikel:this._entity}).render();
};
ArtikelController.prototype._switchContent = function(a, b) {
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
ArtikelController.prototype.render = function(a) {
  this._entity = a ? a : new Artikel;
  null == this._topic ? this._doArtikel() : this._topic.update(this._entity);
  this._doInvolvements();
  this._activated || (this._activated = this._onsite);
  this._activated.activate();
};
ArtikelController.prototype._doInvolvements = function() {
  this._onsite = null !== this._onsite ? this._onsite.update() : this._onsite = (new PForms(this.document, "vor Ort", this._involvements.onsite)).bind(this._entity, "onsite").render();
  this._text = null !== this._text ? this._text.update() : this._text = (new PForms(this.document, "Text", this._involvements.text)).bind(this._entity, "text").render();
  this._photo = null !== this._photo ? this._photo.update() : this._photo = (new PForms(this.document, "Foto", this._involvements.photo)).bind(this._entity, "photo").render();
  this._video = null !== this._video ? this._video.update() : this._video = (new PForms(this.document, "Video", this._involvements.video)).bind(this._entity, "video").render();
  this._illu = null !== this._illu ? this._illu.update() : this._illu = (new PForms(this.document, "Illu.Grafik", this._involvements.illu)).bind(this._entity, "illu").render();
  this._ad = null !== this._ad ? this._ad.update() : this._ad = (new PForms(this.document, "Inserat", this._involvements.ad)).bind(this._entity, "ad").render();
};
ArtikelController.prototype._doArtikel = function() {
  this._topic = (new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)).bind(this._entity, "topic").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")).bind(this._entity, "from").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")).bind(this._entity, "author").onChange(this.putData, this).render();
  (new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 2)).bind(this._entity, "text").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")).bind(this._entity, "pagina").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")).bind(this._entity, "layout").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe")).bind(this._entity, "total").onChange(this.putData, this).render();
  (new SingleSelectInput(this.document, "Online", null, "pa.tags", "Liste-Tag")).addOption("monday", "Mo.").addOption("tuesday", "Di.").addOption("wednesday", "Mi.").addOption("thursday", "Do.").addOption("friday", "Fr.").addOption("saturday", "Sa.").addOption("sunday", "So.").bind(this._entity, "tags").onChange(this.putData, this).render();
  (new SingleSelectInput(this.document, "Visual", null, "pa.visual", "x-Liste")).addOption("picture", "Bild").addOption("icon", "Icon").addOption("graphics", "Grafik").addOption("videos", "Video").addOption("illustrations", "Illu").bind(this._entity, "visual").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "Region", null, "pa.region", "x-Liste")).bind(this._entity, "region").onChange(this.putData, this).render();
  (new SingleSelectInput(this.document, "Saison", null, "pa.season", "x-Liste")).addOption("summer", "Sommer").addOption("fall", "Herbst").bind(this._entity, "season").onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "", null, "pa.additional.1", "", !0)).onChange(this.putData, this).render();
  (new SingleLineInput(this.document, "", null, "pa.additional.2", "", !0)).onChange(this.putData, this).render();
};
ArtikelController.prototype.putDataInvolved = function(a, b) {
  a.setProperty();
  var c = b.trelloApi, d = b.valueHolder;
  b = b.artikel;
  var e = a.getBinding();
  b.putInvolved(d["involved-in"], e);
  c.set("card", "shared", ArtikelController.SHARED_NAME, b);
  console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue());
};
ArtikelController.prototype.putData = function(a, b) {
  a.setProperty();
  b.trelloApi.set("card", "shared", ArtikelController.SHARED_NAME, a.getBinding());
  console.log("Stored: " + a.getBoundProperty() + " = " + a.getValue());
};
ArtikelController.prototype.getData = function(a, b) {
  return 1 === this.document.getElementsByName(b + "_data").length ? this.document.getElementsByName(b + "_data")[0].value : a && a.options && a.options[b + "_data"] ? a.options[b + "_data"] : "";
};
$jscomp.global.Object.defineProperties(ArtikelController, {SHARED_NAME:{configurable:!0, enumerable:!0, get:function() {
  return "panta.Artikel";
}}});
// Input 3
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
  return new OtherBeteiligt(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "duedate"));
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
};
$jscomp.inherits(AdBeteiligt, CommonBeteiligt);
AdBeteiligt.create = function(a) {
  return new AdBeteiligt(JsonSerialization.getProperty(a, "name"), JsonSerialization.getProperty(a, "social"), JsonSerialization.getProperty(a, "address"), JsonSerialization.getProperty(a, "notes"), JsonSerialization.getProperty(a, "format"), JsonSerialization.getProperty(a, "placement"), JsonSerialization.getProperty(a, "price"));
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
}}});
// Input 4
var Artikel = function(a, b, c, d, e, f, g, h, k, l, m) {
  this._topic = a;
  this._pagina = b;
  this._from = c;
  this._layout = d;
  this._total = e;
  this._tags = f;
  this._visual = g;
  this._region = h;
  this._season = k;
  this._author = l;
  this._text = m;
  this._involved = {};
  this.putInvolved("onsite", new OtherBeteiligt);
  this.putInvolved("text", new OtherBeteiligt);
  this.putInvolved("photo", new OtherBeteiligt);
  this.putInvolved("video", new OtherBeteiligt);
  this.putInvolved("illu", new OtherBeteiligt);
  this.putInvolved("ad", new AdBeteiligt);
};
Artikel.create = function(a) {
  var b = new Artikel(JsonSerialization.getProperty(a, "topic"), JsonSerialization.getProperty(a, "pagina"), JsonSerialization.getProperty(a, "from"), JsonSerialization.getProperty(a, "layout"), JsonSerialization.getProperty(a, "total"), JsonSerialization.getProperty(a, "tags"), JsonSerialization.getProperty(a, "visual"), JsonSerialization.getProperty(a, "region"), JsonSerialization.getProperty(a, "season"), JsonSerialization.getProperty(a, "author"), JsonSerialization.getProperty(a, "text"));
  b.involved = JsonSerialization.getProperty(a, "involved");
  return b;
};
Artikel.prototype.getInvolvedFor = function(a) {
  return this._involved[a];
};
Artikel.prototype.putInvolved = function(a, b) {
  this._involved[a] = b;
};
$jscomp.global.Object.defineProperties(Artikel.prototype, {involved:{configurable:!0, enumerable:!0, get:function() {
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
// Input 5
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
// Input 6
var template_regular = '<div id="template" class="row">    <div class="col-6">        <div class="row">            <div class="col-12 less-padding-right">                <div class="pa.name"></div>            </div>            <div class="col-12 less-padding-right">                <div class="pa.social"></div>            </div>            <div class="col-12 less-padding-right">                <div class="pa.address"></div>            </div>        </div>    </div>    <div class="col-6">        <div class="row before-last-row">            <div class="col-12 less-padding-left">                <div class="pa.notes"></div>            </div>        </div>        <div class="row align-bottom">            <div class="col-12 less-padding">                <div class="pa.duedate"></div>            </div>        </div>    </div></div>', 
template_ad = '<div id="template" class="row">        <div class="col-6">            <div class="row">                <div class="col-12 less-padding-right">                    <div class="pa.name"></div>                </div>                <div class="col-12 less-padding-right">                    <div class="pa.social"></div>                </div>                <div class="col-12 less-padding-right">                    <div class="pa.address"></div>                </div>            </div>        </div>        <div class="col-6">            <div class="row">                <div class="col-6 less-padding">                    <div class="pa.format"></div>                </div>                <div class="col-6 less-padding-left">                    <div class="pa.placement"></div>                </div>            </div>            <div class="row before-last-row">                <div class="col-12 less-padding-left">                    <div class="pa.notes"></div>                </div>            </div>            <div class="row align-bottom">                <div class="col-6 less-padding">                    <div class="pa.price"></div>                </div>                <div class="col-6 less-padding-left">                    <div class="pa.total"></div>                </div>            </div>        </div>    </div>';
// Input 7
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
// Input 8
var btDelete = document.getElementById("bt_delete"), t = TrelloPowerUp.iframe();
btDelete && btDelete.addEventListener("click", function(a) {
  a.preventDefault();
  return t.remove("card", "shared", ArtikelController.SHARED_NAME).then(function() {
    t.closeModal();
  });
});
function showTab(a) {
  for (var b = document.getElementById("tab-content"); b.firstChild;) {
    b.removeChild(b.firstChild);
  }
  var c = document.createElement("textarea");
  c.setAttribute("name", a + "_data");
  c.setAttribute("placeholder", "Eingabefeld f\u00fcr " + a);
  if (panta) {
    var d = panta.options;
    d && d[a + "_data"] && c.appendChild(document.createTextNode(d[a + "_data"]));
  }
  b.appendChild(c);
}
var articleController = new ArtikelController(document, t), om = new JsonSerialization;
t.render(function() {
  return t.get("card", "shared", ArtikelController.SHARED_NAME).then(function(a) {
    a = Artikel.create(a);
    articleController.render(a);
  }).then(function() {
    return t.card("all");
  }).then(function(a) {
    return t.cards("customFieldItems");
  }).then(function(a) {
    console.log(JSON.stringify(a));
    return new window.TrelloPowerUp.Promise(function(a, c) {
      var b = new XMLHttpRequest;
      b.addEventListener("error", c);
      b.onload = function() {
        200 <= this.status && 300 > this.status ? a(b.response) : c({status:this.status, statusText:b.statusText});
      };
      b.open("GET", "https://api.trello.com/1/cards/5b49a8c00e5a2f4f5ba0111e/customFields?key=86a73cafa11d3834d4768a20a96b6786&token=5f7ab7be941155ed024f3d024a5043d198c23764c9ee5988543d4679dc411563");
      b.send(null);
    });
  }).then(function(a) {
    a = JSON.parse(a);
    for (var b in a) {
      var c = document.getElementsByName(a[b].name);
      if (c && c[0]) {
        var d = document.createElement("select"), e;
        for (e in a[b].options) {
          var f = document.createElement("option");
          f.value = a[b].options[e].value.text;
          f.appendChild(document.createTextNode(a[b].options[e].value.text));
          d.appendChild(f);
        }
        c[0].style.display = "none";
        c[0].parentElement.appendChild(d);
      }
      console.log("Region: " + JSON.stringify(a[b].name));
    }
  }).then(function() {
    t.sizeTo("#panta\\.artikel").done();
  });
});

