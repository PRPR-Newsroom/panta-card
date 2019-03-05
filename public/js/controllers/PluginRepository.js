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
                "enabled": false,
                "icon": "./assets/ic_artikel.png",
                "view": "./artikel.html",
                "editables": [{
                    "id": "visual",
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
                    "label": "Saison",
                    "color": "sky",
                    "show_on_front": false,
                    "values": [
                        "Sommer",
                        "Herbst",
                    ]
                }, {
                    "id": "region",
                    "label": "Region",
                    "color": "lime",
                    "show_on_front": false,
                    "values": [
                        "Nord",
                        "Süd",
                    ]
                }, {
                    "id": "place",
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
                }]
            }), {"id": 1});
            PluginRepository.instance.add(new PluginModuleConfig("module.beteiligt", "Beteiligt", {
                "enabled": false,
                "icon": "./assets/ic_beteiligt.png",
                "view": "./artikel.html",
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
                "enabled": false,
                "icon": "./assets/ic_plan.png",
                "view": "./plan.html",
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