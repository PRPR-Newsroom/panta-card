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
            PluginRepository.instance.add(new PluginModuleConfig("module.artikel", "Artikel", {}), {"id": 1});
            PluginRepository.instance.add(new PluginModuleConfig("module.beteiligt", "Beteiligt", {
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
            PluginRepository.instance.add(new PluginModuleConfig("module.plan", "Plan", {}), {"id": 3});
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