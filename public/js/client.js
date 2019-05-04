TrelloPowerUp.initialize({
    // https://developers.trello.com/v1.0/reference#card-buttons
    'card-buttons': function (t, options) {
        return [{
            icon: './assets/ic_pantarhei.png',
            text: 'Panta.Card.Setup',
            callback: function (t) {
                console.log("open settings...");
                return t.member('all')
                    .then(function(member) {
                        console.log(JSON.stringify(member));
                        if (POWERUP_ADMINS.find(function(admin) { return member.username === admin; } )) {
                            return t.popup({
                                title: "Einstellungen",
                                url: "settings.html",
                                height: 184
                            });
                        } else {
                            t.alert({
                                message: "Du hast keine Berechtigung um Panta.Card zu konfigurieren. Bitte wenden dich an den Administrator, falls du die Berechtigung brauchst.",
                                duration: 15,
                                display: "error"
                            });
                            return null;
                        }
                    });
            }
        }];
    },
    // https://developers.trello.com/v1.0/reference#card-badges
    'card-badges': function (t, options) {
        /**
         * @type {ClientManager}
         */
        let cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
        return t.card('id')
            .then(function (card) {
                return t.get(card.id, 'shared', ArtikelController.SHARED_NAME)
                    .then(function (list_data) {
                        return Artikel.create(list_data);
                    })
                    .then(function (artikel) {
                        cm.getArticleController().insert(artikel, card);
                        return card;
                    });
            })
            .then(function (card) {
                return t.get(card.id, 'shared', ModuleController.SHARED_NAME)
                    .then(function (list_data) {
                        return ModuleConfig.create(list_data);
                    })
                    .then(function (config) {
                        cm.getModuleController().insert(config, card);
                        return card;
                    });
            })
            .then(function (card) {
                return t.get(card.id, 'shared', ModulePlanController.SHARED_NAME)
                    .then(function (list_data) {
                        return Plan.create(list_data);
                    })
                    .then(function (entity) {
                        cm.getPlanController().insert(entity, card);
                        return card;
                    });
            })
            .then(function (card) {
                // get all module condition promises
                return Promise.all([
                    cm.getArticleModuleContext(card),
                    cm.getBeteiligtModuleContext(card),
                    cm.getPlanModuleContext(card)
                ]);
            })
            .map(function (val) {
                // get the badges if the condition is met
                return val["condition"].then(function (enabled) {
                    if (enabled) {
                        return val["on"]();
                    } else {
                        return [];
                    }
                })
            })
            .reduce(function (prev, cur) {
                // create a flattened list from a nested list
                return prev.concat(cur);
            }, [])
            .then(function (values) {
                return values;
            });
    },
    // https://developers.trello.com/v1.0/reference#card-back-section
    'card-back-section': function (t, opts) {
        // Your Power-Up can have only one card back section and a maximum height of 500 pixels.
        let pc = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPluginController();
        return pc.getPluginConfiguration()
            .then(function (config) {
                if (config && config.hasActiveModules()) {
                    return {
                        title: config.card.title,
                        icon: config.card.icon,
                        content: {
                            type: 'iframe',
                            url: t.signUrl(config.card.content.file, {}),
                            height: 500 // Max height is 500
                        }
                    };
                } else {
                    return {
                        title: 'Panta Plugin',
                        icon: "./assets/ic_artikel.png",
                        content: {
                            type: 'iframe',
                            url: t.signUrl("./plugin.html")
                        }
                    }
                }
            });
    },
    // https://developers.trello.com/v1.0/reference#list-sorters
    'list-sorters': function (t) {
        let cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
        return t.list('id', 'name')
            .then(function (list) {
                // i didn't manage to do it without t.list()... somehow t.list returns another promise than Promise.all()
                return Promise.all([
                    cm.getArticleModuleSorters(),
                    cm.getPlanModuleSorters()
                ])
            }).map(function (context) {
                return context["configuration"]()
                    .then(function (configuration) {
                        return context["sorters"](configuration);
                    });
            }).reduce(function (prev, cur) {
                // create a flattened list from a nested list
                return prev.concat(cur);
            }, []);
    }
});