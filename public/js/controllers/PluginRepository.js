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

                "desc": "Die Eingabefelder und Auswahllisten werden für das ganze Trello Board konfiguriert. Für jedes Feld kann eine Farbe definiert werden. Wenn das Feld " +
                "mit dem «Gutzeichen» aktiviert wird, dann erscheint es in dieser Farbe auf der Trello Card Vorderseite, ansonsten wird es nur für die Trello Card Rückseite " +
                "verwendet.",

                "editables": [{
                    "id": "visual",
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
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
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
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
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
                    "type": "select",
                    "label": "Online",
                    "color": "yellow",
                    "show_on_front": false,
                    "values": [
                        "...",
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
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
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
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
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
                    "desc": "Definieren Sie die Auswahlliste, die für das ganze Board gelten.",
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
                    "desc": "Das Artikelfeld «A» ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
                    "type": "text",
                    "label": "Input von",
                    "placeholder": "Name",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.b",
                    "desc": "Das Artikelfeld «B» ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
                    "type": "text",
                    "label": "Textautor*in",
                    "placeholder": "Name",
                    "show_on_front": false,
                    "color": "shades"
                }, {
                    "id": "field.c",
                    "desc": "Das Artikelfeld «C» ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
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

                "desc": "Folgende Felder können individuell konfiguriert werden.",

                "editables": [{
                    "id": "title",
                    "desc": "Diese Beschriftung wird oberhalb des Moduls als Überschrift verwendet.",
                    "type": "text",
                    "placeholder": "",
                    "label": "Beteiligt"
                }],
                "layouts": {
                    "onsite": {
                        "name": "onsite",
                        "container": "pa.involved.onsite",
                        "layout": "regular",
                        "label": "vor.Ort"
                    },
                    "text": {
                        "name": "text",
                        "container": "pa.involved.text",
                        "layout": "regular",
                        "label": "Journalist"
                    },
                    "photo": {
                        "name": "photo",
                        "container": "pa.involved.photo",
                        "layout": "regular",
                        "label": "Visual"
                    },
                    "video": {
                        "name": "video",
                        "container": "pa.involved.video",
                        "layout": "regular",
                        "label": "Event"
                    },
                    "illu": {
                        "name": "illu",
                        "container": "pa.involved.illu",
                        "layout": "regular",
                        "label": "MC/Host"
                    },
                    "ad": {
                        "name": "ad",
                        "container": "pa.involved.ad",
                        "layout": "regular",
                        "label": "weitere"
                    }
                },
            }), {"id": 2});
            PluginRepository.instance.add(new PluginModuleConfig("module.plan", "Plan", {
                "sort": 2,
                "enabled": false,
                "icon": "./assets/ic_plan.png",
                "view": "./module.html",
                "desc": "Folgende Felder können individuell konfiguriert werden.",
                "editables": [

                ]
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