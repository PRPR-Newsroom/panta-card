/**
 * The plugin repository store. This is a singleton so you can get the instance with PluginRepository.INSTANCE
 */
class PluginRepository extends Repository {


    /**
     * Get a new repo instance
     * @returns {PluginRepository}
     */
    static get INSTANCE() {
        if (!PluginRepository.instance) {
            PluginRepository.instance = new PluginRepository();
            PluginRepository.instance.add(new PluginModuleConfig("module.artikel", "Artikel", {
                "sort": 1,
                "enabled": false,
                "icon": "./assets/ic_artikel.png",
                "view": "./module.html",

                "desc": 'module.artikel.desc',

                "editables": [{
                    "id": "visual",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Visual",
                    "color": "blue",
                    "show_on_front": false,
                    "values": [
                        "Bild",
                        "Icon",
                        "Grafik",
                        "Video",
                        "Illu",
                    ]
                }, {
                    "id": "form",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Form",
                    "color": "green",
                    "show_on_front": false,
                    "values": [
                        "News",
                        "Artikel",
                        "Report",
                    ]
                }, {
                    "id": "online",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Online",
                    "color": "yellow",
                    "show_on_front": false,
                    "values": [
                        "Mo",
                        "Di",
                        "Mi",
                        "Do",
                        "Fr",
                        "Sa",
                        "So",
                    ]
                }, {
                    "id": "season",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Saison",
                    "color": "sky",
                    "show_on_front": false,
                    "values": [
                        "Sommer",
                        "Herbst",
                    ]
                }, {
                    "id": "region",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Region",
                    "color": "lime",
                    "show_on_front": false,
                    "values": [
                        "Nord",
                        "Süd",
                    ]
                }, {
                    "id": "place",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Ort",
                    "color": "orange",
                    "show_on_front": false,
                    "values": [
                        "CDS",
                        "STO",
                        "TAM",
                        "WID",
                        "Buech",
                        "Rustico",
                        "Schlatt",
                    ]
                }, {
                    "id": "field.a",
                    "desc": "module.artikel.field-a.desc",
                    "type": "text",
                    "label": "Thema",
                    "placeholder": "Lauftext",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.artikel.field-b.desc",
                    "type": "text",
                    "label": "Input von",
                    "placeholder": "Name",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.c",
                    "desc": "module.artikel.field-c.desc",
                    "type": "text",
                    "label": "Textautor*in",
                    "placeholder": "Name",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.d",
                    "desc": "module.artikel.field-d.desc",
                    "type": "text",
                    "label": "Textbox",
                    "placeholder": "Lauftext",
                    "show_on_front": false,
                    "color": "shades"
                }]
            }), {"id": 1});
            PluginRepository.instance.add(new PluginModuleConfig("module.beteiligt", "Beteiligt", {
                "sort": 3,
                "enabled": false,
                "icon": "./assets/ic_beteiligt.png",
                "view": "./module.html",

                "desc": "module.beteiligt.desc",

                "editables": [{
                    "id": "title",
                    "desc": "module.beteiligt.label.desc",
                    "type": "label",
                    "placeholder": "",
                    "label": "Beteiligt"
                }, {
                    "id": "onsite",
                    "desc": "module.beteiligt.layout.onsite",
                    "type": "layout",
                    "label": "vor.Ort",
                    "container": "pa.involved.onsite",
                    "layout": "regular",
                    "show_on_front": true
                }, {
                    "id": "text",
                    "desc": "module.beteiligt.layout.text",
                    "type": "layout",
                    "label": "Journalist",
                    "container": "pa.involved.text",
                    "layout": "regular",
                    "show_on_front": true
                }, {
                    "id": "photo",
                    "desc": "module.beteiligt.layout.photo",
                    "type": "layout",
                    "label": "Photo",
                    "container": "pa.involved.photo",
                    "layout": "regular",
                    "show_on_front": true
                }, {
                    "id": "video",
                    "desc": "module.beteiligt.layout.video",
                    "type": "layout",
                    "label": "Event",
                    "container": "pa.involved.video",
                    "layout": "regular",
                    "show_on_front": true
                }, {
                    "id": "illu",
                    "desc": "module.beteiligt.layout.illu",
                    "type": "layout",
                    "label": "Illu",
                    "container": "pa.involved.illu",
                    "layout": "regular",
                    "show_on_front": true
                }, {
                    "id": "ad",
                    "desc": "module.beteiligt.layout.ad",
                    "type": "layout",
                    "label": "weitere",
                    "container": "pa.involved.ad",
                    "layout": "regular",
                    "show_on_front": true
                }],
                "layouts": {
                    "regular": {
                        "desc": "module.beteiligt.regular.desc",
                        "label": "Regulär"
                    },
                    "ad": {
                        "desc": "module.beteiligt.special.desc",
                        "label": "Spezial"
                    }
                },
            }), {"id": 2});
            PluginRepository.instance.add(new PluginModuleConfig("module.plan", "Plan", {
                "sort": 2,
                "enabled": false,
                "icon": "./assets/ic_plan.png",
                "view": "./module.html",
                "desc": "module.plan.desc",
                "editables": [{
                    "id": "visual",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Visual",
                    "color": "blue",
                    "show_on_front": false,
                    "values": [
                        "Bild",
                        "Icon",
                        "Grafik",
                        "Video",
                        "Illu",
                    ]
                }, {
                    "id": "form",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Form",
                    "color": "green",
                    "show_on_front": false,
                    "values": [
                        "News",
                        "Artikel",
                        "Report",
                    ]
                }, {
                    "id": "online",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Online",
                    "color": "yellow",
                    "show_on_front": false,
                    "values": [
                        "Mo",
                        "Di",
                        "Mi",
                        "Do",
                        "Fr",
                        "Sa",
                        "So",
                    ]
                }, {
                    "id": "season",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Saison",
                    "color": "sky",
                    "show_on_front": false,
                    "values": [
                        "Sommer",
                        "Herbst",
                    ]
                }, {
                    "id": "region",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Region",
                    "color": "lime",
                    "show_on_front": false,
                    "values": [
                        "Nord",
                        "Süd",
                    ]
                }, {
                    "id": "place",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Ort",
                    "color": "orange",
                    "show_on_front": false,
                    "values": [
                        "CDS",
                        "STO",
                        "TAM",
                        "WID",
                        "Buech",
                        "Rustico",
                        "Schlatt",
                    ]
                }, {
                    "id": "field.a",
                    "desc": "module.plan.field-a.desc",
                    "type": "text",
                    "label": "Massnahmen",
                    "placeholder": "notieren…",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.plan.field-b.desc",
                    "type": "text",
                    "label": "Beschreibung",
                    "placeholder": "notieren…",
                    "show_on_front": false,
                    "color": "shades"
                }]
            }), {"id": 3});
        }
        return PluginRepository.instance;
    }

    /**
     * @private
     */
    constructor() {
        super();
    }
}

PluginRepository.instance = null;