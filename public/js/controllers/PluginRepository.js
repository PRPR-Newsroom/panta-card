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
                "icon": "ic_artikel.png",

                "desc": 'module.artikel.desc',

                "editables": [{
                    "id": "visual",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 1",
                    "color": "blue",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "form",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 2",
                    "color": "green",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "online",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 3",
                    "color": "yellow",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "season",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 4",
                    "color": "sky",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "region",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 5",
                    "color": "lime",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "place",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "Liste 6",
                    "color": "orange",
                    "active": true,
                    "show": false,
                    "sortable": false,
                    "values": [
                        "1. Stichwort",
                        "2. Stichwort",
                        "3. Stichwort",
                        "4. Stichwort",
                        "5. Stichwort",
                    ]
                }, {
                    "id": "field.a",
                    "desc": "module.artikel.field-a.desc",
                    "type": "text",
                    "label": "Thema",
                    "placeholder": "Lauftext",
                    "show": false,
                    "sortable": false,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.artikel.field-b.desc",
                    "type": "text",
                    "label": "Input von",
                    "placeholder": "Name",
                    "show": false,
                    "sortable": false,
                    "color": "shades"
                }, {
                    "id": "field.c",
                    "desc": "module.artikel.field-c.desc",
                    "type": "text",
                    "label": "Textautor*in",
                    "placeholder": "Name",
                    "show": false,
                    "sortable": false,
                    "color": "shades"
                }, {
                    "id": "field.d",
                    "desc": "module.artikel.field-d.desc",
                    "type": "text",
                    "label": "Textbox",
                    "placeholder": "Lauftext",
                    "show": false,
                    "sortable": false,
                    "color": "shades"
                }]
            }), {"id": 1});
            PluginRepository.instance.add(new PluginModuleConfig("module.beteiligt", "Beteiligt", {
                "sort": 3,
                "enabled": false,
                "icon": "ic_beteiligt.png",

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
                    "label": "Reiter 1",
                    "container": "pa.involved.onsite",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "text",
                    "desc": "module.beteiligt.layout.text",
                    "type": "layout",
                    "label": "Reiter 2",
                    "container": "pa.involved.text",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "photo",
                    "desc": "module.beteiligt.layout.photo",
                    "type": "layout",
                    "label": "Reiter 3",
                    "container": "pa.involved.photo",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "video",
                    "desc": "module.beteiligt.layout.video",
                    "type": "layout",
                    "label": "Reiter 4",
                    "container": "pa.involved.video",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "illu",
                    "desc": "module.beteiligt.layout.illu",
                    "type": "layout",
                    "label": "Reiter 5",
                    "container": "pa.involved.illu",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "ad",
                    "desc": "module.beteiligt.layout.ad",
                    "type": "layout",
                    "label": "Reiter 6",
                    "container": "pa.involved.ad",
                    "layout": "regular",
                    "show": true
                }],
                "layouts": {
                    "regular": {
                        "desc": "module.beteiligt.regular.desc",
                        "label": "Kontakt"
                    },
                    "ad": {
                        "desc": "module.beteiligt.special.desc",
                        "label": "Inserat"
                    }
                },
            }), {"id": 2});
            PluginRepository.instance.add(new PluginModuleConfig("module.plan", "Plan", {
                "sort": 2,
                "enabled": false,
                "icon": "ic_plan.png",
                "desc": "module.plan.desc",
                "editables": [{
                    "id": "visual",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "Visual",
                    "color": "blue",
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
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
                    "show": false,
                    "sortable": false,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.plan.field-b.desc",
                    "type": "text",
                    "label": "Beschreibung",
                    "placeholder": "notieren…",
                    "show": false,
                    "sortable": false,
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