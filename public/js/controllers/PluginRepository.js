/**
 * The plugin repository store. This is a singleton so you can get the instance with PluginRepository.INSTANCE
 */
class PluginRepository extends Repository {


    /**
     * Get a new repo instance
     * @returns {PluginRepository}
     */
    static get INSTANCE() {
        // TODO move the config of PluginModuleConfig to a concrete type
        if (!PluginRepository.instance) {
            PluginRepository.instance = new PluginRepository();
            PluginRepository.instance.add(new PluginModuleConfig(ArtikelController.ID, "Artikel", {
                "sort": 1,
                "enabled": false,
                "icon": "ic_artikel.png",

                "desc": 'module.artikel.desc',

                "editables": [{
                    "id": "visual",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "1.Liste",
                    "color": "blue",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "form",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "2.Liste",
                    "color": "green",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "online",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "3.Liste",
                    "color": "yellow",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "season",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "4.Liste",
                    "color": "sky",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "region",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "5.Liste",
                    "color": "lime",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "place",
                    "desc": "module.artikel.editable.desc",
                    "type": "select",
                    "label": "6.Liste",
                    "color": "orange",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "field.a",
                    "desc": "module.artikel.field-a.desc",
                    "type": "text",
                    "label": "Thema",
                    "placeholder": "Lauftext",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.artikel.field-b.desc",
                    "type": "text",
                    "label": "Input von",
                    "placeholder": "Name",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.c",
                    "desc": "module.artikel.field-c.desc",
                    "type": "text",
                    "label": "Textautor*in",
                    "placeholder": "Name",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.d",
                    "desc": "module.artikel.field-d.desc",
                    "type": "text",
                    "label": "Textbox",
                    "placeholder": "Lauftext",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "title",
                    "desc": "module.artikel.label.desc",
                    "type": "label",
                    "placeholder": "",
                    "label": "Artikel",
                    "visible": true,
                    "title": "Modul-Titel",
                }, {
                    "id": "field.e",
                    "desc": "module.artikel.field-e.desc",
                    "type": "text",
                    "label": "Pagina",
                    "placeholder": "Zahl",
                    "show": false,
                    "sortable": true,
                    "visible": true,
                    "color": "shades",
                    "sortable.hint": '(1 -> 99)'
                }, {
                    "id": "field.f",
                    "desc": "module.artikel.field-f.desc",
                    "type": "text",
                    "label": "Seiten Layout",
                    "placeholder": "Zahl",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.g",
                    "desc": "module.artikel.field-g.desc",
                    "type": "calc",
                    "label": "Seiten Total",
                    "placeholder": "Summe",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }]
            }), {"id": 1});
            PluginRepository.instance.add(new PluginModuleConfig(ModuleController.ID, "Beteiligt", {
                "sort": 3,
                "enabled": false,
                "icon": "ic_beteiligt.png",

                "desc": "module.beteiligt.desc",

                "editables": [{
                    "id": "title",
                    "desc": "module.beteiligt.label.desc",
                    "type": "label",
                    "placeholder": "",
                    "label": "Beteiligt",
                    "title": "Modul-Titel",
                }, {
                    "id": "onsite",
                    "desc": "module.beteiligt.layout.onsite",
                    "type": "layout",
                    "label": "1.Reiter",
                    "container": "pa.involved.onsite",
                    "layout": "regular",
                    "show": true,
                    "title": "Reiter-Titel",
                }, {
                    "id": "text",
                    "desc": "module.beteiligt.layout.text",
                    "type": "layout",
                    "label": "2.Reiter",
                    "container": "pa.involved.text",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "photo",
                    "desc": "module.beteiligt.layout.photo",
                    "type": "layout",
                    "label": "3.Reiter",
                    "container": "pa.involved.photo",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "video",
                    "desc": "module.beteiligt.layout.video",
                    "type": "layout",
                    "label": "4.Reiter",
                    "container": "pa.involved.video",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "illu",
                    "desc": "module.beteiligt.layout.illu",
                    "type": "layout",
                    "label": "5.Reiter",
                    "container": "pa.involved.illu",
                    "layout": "regular",
                    "show": true
                }, {
                    "id": "ad",
                    "desc": "module.beteiligt.layout.ad",
                    "type": "layout",
                    "label": "6.Reiter",
                    "container": "pa.involved.ad",
                    "layout": "regular",
                    "show": true
                }],
                "layouts": {
                    "regular": {
                        "desc": "module.beteiligt.regular.desc",
                        "label": "Kontakt",
                        "fields": [{
                            "id": "field.name",
                            "desc": "module.beteiligt.field-name.desc",
                            "type": "text",
                            "label": "Name",
                            "placeholder": "eintippen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.social",
                            "desc": "module.beteiligt.field-social.desc",
                            "type": "text",
                            "label": "Telefon.Mail.Webseite",
                            "placeholder": "notieren…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.address",
                            "desc": "module.beteiligt.field-address.desc",
                            "type": "text",
                            "label": "Adresse",
                            "placeholder": "festhalten…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.notes",
                            "desc": "module.beteiligt.field-notes.desc",
                            "type": "text",
                            "label": "Notizen",
                            "placeholder": "formulieren…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.deadline",
                            "desc": "module.beteiligt.field-deadline.desc",
                            "type": "text",
                            "label": "Deadline",
                            "placeholder": "bestimmen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.a",
                            "desc": "module.beteiligt.field-a.desc",
                            "type": "text",
                            "label": "Honorar Massnahme",
                            "placeholder": "Betrag…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.b",
                            "desc": "module.beteiligt.field-b.desc",
                            "type": "text",
                            "label": "Spesen Massnahme",
                            "placeholder": "Betrag…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.c",
                            "desc": "module.beteiligt.field-c.desc",
                            "type": "calc",
                            "label": "Total Beteiligte",
                            "placeholder": "Betrag…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }]
                    },
                    "ad": {
                        "desc": "module.beteiligt.special.desc",
                        "label": "Inserat",
                        "fields": [{
                            "id": "field.sujet",
                            "desc": "module.beteiligt.field-sujet.desc",
                            "type": "text",
                            "label": "Kunde.Sujet",
                            "placeholder": "Name.Stichwort…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.format",
                            "desc": "module.beteiligt.field-format.desc",
                            "type": "text",
                            "label": "Format",
                            "placeholder": "festhalten…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.placement",
                            "desc": "module.beteiligt.field-placement.desc",
                            "type": "text",
                            "label": "Platzierung",
                            "placeholder": "vormerken…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.price",
                            "desc": "module.beteiligt.field-price.desc",
                            "type": "text",
                            "label": "Preis CHF",
                            "placeholder": "bestimmen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.total",
                            "desc": "module.beteiligt.field-total.desc",
                            "type": "text",
                            "label": "Total",
                            "placeholder": "",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.name",
                            "desc": "module.beteiligt.field-name.desc",
                            "type": "text",
                            "label": "Kontakt",
                            "placeholder": "eintippen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.social",
                            "desc": "module.beteiligt.field-social.desc",
                            "type": "text",
                            "label": "Telefon.Mail.Webseite",
                            "placeholder": "notieren…",
                            "show": false,
                            "sortable": false,
                            "color": "shades"
                        }, {
                            "id": "field.address",
                            "desc": "module.beteiligt.field-address.desc",
                            "type": "text",
                            "label": "Adresse",
                            "placeholder": "festhalten…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }]
                    },
                    "blog": {
                        "desc": "module.beteiligt.blog.desc",
                        "label": "Blog",
                        "fields": [{
                            "id": "field.link",
                            "desc": "module.beteiligt.field-link.desc",
                            "type": "text",
                            "label": "Link",
                            "placeholder": "hinterlegen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.notes",
                            "desc": "module.beteiligt.field-notes.desc",
                            "type": "text",
                            "label": "Notiz",
                            "placeholder": "hinterlegen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.follower",
                            "desc": "module.beteiligt.field-follower.desc",
                            "type": "text",
                            "label": "Follower.Fans.Abos",
                            "placeholder": "eintippen…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }, {
                            "id": "field.date",
                            "desc": "module.beteiligt.field-date.desc",
                            "type": "text",
                            "label": "Stand.Datum",
                            "placeholder": "notieren…",
                            "show": false,
                            "sortable": false,
                            "visible": true,
                            "color": "shades"
                        }]
                    }
                },
            }), {"id": 2});
            PluginRepository.instance.add(new PluginModuleConfig(ModulePlanController.ID, "Plan", {
                "sort": 2,
                "enabled": false,
                "icon": "ic_plan.png",
                "desc": "module.plan.desc",
                "editables": [{
                    "id": "visual",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "1.Liste",
                    "color": "blue",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                    ]
                }, {
                    "id": "form",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "2.Liste",
                    "color": "green",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                    ]
                }, {
                    "id": "online",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "3.Liste",
                    "color": "yellow",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                        "6.Begriff",
                        "7.Begriff",
                    ]
                }, {
                    "id": "season",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "4.Liste",
                    "color": "sky",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                    ]
                }, {
                    "id": "region",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "5.Liste",
                    "color": "lime",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                    ]
                }, {
                    "id": "place",
                    "desc": "module.plan.editable.desc",
                    "type": "select",
                    "label": "6.Liste",
                    "color": "orange",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "values": [
                        "1.Begriff",
                        "2.Begriff",
                        "3.Begriff",
                        "4.Begriff",
                        "5.Begriff",
                        "6.Begriff",
                        "7.Begriff",
                    ]
                }, {
                    "id": "field.a",
                    "desc": "module.plan.field-a.desc",
                    "type": "text",
                    "label": "Massnahmen",
                    "placeholder": "notieren…",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "module.plan.field-b.desc",
                    "type": "text",
                    "label": "Beschreibung",
                    "placeholder": "notieren…",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "title",
                    "desc": "module.plan.label.desc",
                    "type": "label",
                    "placeholder": "",
                    "label": "Plan",
                    "title": "Modul-Titel",
                    "visible": true
                }, {
                    "id": "field.c",
                    "desc": "module.plan.field-c.desc",
                    "type": "calc",
                    "label": "Total Honorar Beteiligte",
                    "placeholder": "",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.d",
                    "desc": "module.plan.field-d.desc",
                    "type": "calc",
                    "label": "Total Honorar Projekt",
                    "placeholder": "",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.e",
                    "desc": "module.plan.field-e.desc",
                    "type": "calc",
                    "label": "Total Spesen Beteiligte",
                    "placeholder": "",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.f",
                    "desc": "module.plan.field-f.desc",
                    "type": "calc",
                    "label": "Total Spesen Projekt",
                    "placeholder": "",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.g",
                    "desc": "module.plan.field-g.desc",
                    "type": "text",
                    "label": "Kostendach Projekt…",
                    "placeholder": "Betrag…",
                    "show": false,
                    "sortable": false,
                    "visible": true,
                    "color": "shades"
                }, {
                    "id": "field.h",
                    "desc": "module.plan.field-h.desc",
                    "type": "calc",
                    "label": "Total Projekt",
                    "placeholder": "Betrag…",
                    "show": false,
                    "sortable": false,
                    "visible": true,
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