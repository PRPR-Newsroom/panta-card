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
var PInput = function(a, b, c, d, e, f, g) {
  this._document = a;
  this._label = 0 === b.length ? "" : b;
  this._value = c;
  this._name = "name_" + d;
  this._target = this._document.getElementById(d);
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
  this._target.appendChild(a);
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
var ArtikelController = function(a, b) {
  this.document = a;
  this.trelloApi = b;
  this._topic = this._entity = null;
};
ArtikelController.prototype.getArtikel = function() {
  return new Artikel;
};
ArtikelController.prototype.render = function(a) {
  this._entity = a ? a : new Artikel;
  null === this._topic ? (this._topic = (new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)).bind(this._entity, "topic").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")).bind(this._entity, "from").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")).bind(this._entity, "author").onChange(this.putData, this).render(), (new MultiLineInput(this.document, 
  "Textbox", null, "pa.text", "Lauftext", 2)).bind(this._entity, "text").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")).bind(this._entity, "pagina").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")).bind(this._entity, "layout").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe")).bind(this._entity, 
  "total").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Online", null, "pa.tags", "Liste-Tag")).bind(this._entity, "tags").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Visual", null, "pa.visual", "x-Liste")).bind(this._entity, "visual").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Region", null, "pa.region", "x-Liste")).bind(this._entity, "region").onChange(this.putData, this).render(), (new SingleLineInput(this.document, 
  "Saison", null, "pa.season", "x-Liste")).bind(this._entity, "season").onChange(this.putData, this).render(), (new SingleLineInput(this.document, "", null, "pa.additional.1", "", !0)).onChange(this.putData, this).render(), (new SingleLineInput(this.document, "", null, "pa.additional.2", "", !0)).onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Name", null, "pa.onsite.name", "")).onChange(this.putData, this).render(), (new MultiLineInput(this.document, "Telefon.Mail.Webseite", 
  null, "pa.onsite.social", "", 2)).onChange(this.putData, this).render(), (new MultiLineInput(this.document, "Adresse", null, "pa.onsite.address", "", 2)).onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Format", null, "pa.onsite.format", "Beispiel: A4")).onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Platzierung", null, "pa.onsite.placement", "")).onChange(this.putData, this).render(), (new MultiLineInput(this.document, "Notiz", null, "pa.onsite.notes", 
  "", 2)).onChange(this.putData, this).render(), (new SingleLineInput(this.document, "Preis CHF", null, "pa.onsite.price", "")).render(), (new SingleLineInput(this.document, "Total CHF", null, "pa.onsite.total", "", !0)).render()) : this._topic.update(this._entity);
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
var Beteiligt = function(a, b, c, d, e, f) {
  this._onsite = a;
  this._text = b;
  this._photo = c;
  this._video = d;
  this._graphics = e;
  this._publications = f;
};
$jscomp.global.Object.defineProperties(Beteiligt.prototype, {onsite:{configurable:!0, enumerable:!0, get:function() {
  return this._onsite;
}, set:function(a) {
  this._onsite = a;
}}, text:{configurable:!0, enumerable:!0, get:function() {
  return this._text;
}, set:function(a) {
  this._text = a;
}}, photo:{configurable:!0, enumerable:!0, get:function() {
  return this._photo;
}, set:function(a) {
  this._photo = a;
}}, video:{configurable:!0, enumerable:!0, get:function() {
  return this._video;
}, set:function(a) {
  this._video = a;
}}, graphics:{configurable:!0, enumerable:!0, get:function() {
  return this._graphics;
}, set:function(a) {
  this._graphics = a;
}}, publications:{configurable:!0, enumerable:!0, get:function() {
  return this._publications;
}, set:function(a) {
  this._publications = a;
}}});
var Artikel = function(a, b, c, d, e, f, g, h, k, l, m) {
  this._topic = a;
  this._pagina = b;
  this._from = c;
  this._involved = null;
  this._layout = d;
  this._total = e;
  this._tags = f;
  this._visual = g;
  this._region = h;
  this._season = k;
  this._author = l;
  this._text = m;
};
$jscomp.global.Object.defineProperties(Artikel.prototype, {from:{configurable:!0, enumerable:!0, get:function() {
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
}}, involved:{configurable:!0, enumerable:!0, get:function() {
  return this._involved;
}, set:function(a) {
  this._involved = a;
}}});
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
  var c = this, d = this.getAllProperties(b);
  console.log(a);
  JSON.parse(a, function(a, f) {
    var e = c.denomalize(a);
    -1 != d.indexOf(e) && (b[a] = f);
  });
};
JsonSerialization.prototype.normalize = function(a) {
  return a.toString().substr(1);
};
JsonSerialization.prototype.denomalize = function(a) {
  return "_" + a;
};
JsonSerialization.prototype.getAllProperties = function(a) {
  return Object.getOwnPropertyNames(a);
};
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
    var b = new Artikel;
    om.deserialize(om.serialize(a), b);
    articleController.render(b);
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

