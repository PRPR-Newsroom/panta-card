TrelloPowerUp.initialize({
    // https://developers.trello.com/v1.0/reference#card-buttons
    'card-buttons': function (t, options) {
        return t.board('id','members')
            .then(it => {
                /**
                 * @type {string[]}
                 */
                const members = it.members.map(it => it.username);
                return t.member('id','username')
                    .then(me => {
                        if (members.indexOf(me.username) !== -1) {
                            return {
                                icon: './assets/ic_import_export.png',
                                text: 'Panta.Card.Data',
                                callback: function (t) {
                                    return t.modal({
                                        title: "Administration",
                                        url: "admin.html",
                                        accentColor: 'blue',
                                        fullscreen: true
                                    });
                                }
                            };
                        } else {
                            return null;
                        }
                    });
            })
            .then(it => {
                const features = [{
                    icon: './assets/ic_pantarhei.png',
                    text: 'Panta.Card.Setup',
                    condition: 'admin',
                    callback: function (t) {
                        return t.member('all')
                            .then(function (member) {
                                return t.popup({
                                    title: "Einstellungen",
                                    url: "settings.html",
                                    height: 184
                                });
                            });
                    }
                }];
                if (it != null) {
                    features.push(it);
                }
                return features;
            });
    },
    // https://developers.trello.com/v1.0/reference#card-badges
    'card-badges': function (t, options) {
        /**
         * @type {ClientManager}
         */
        const cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
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
                        return cm.getPluginController().getPluginConfiguration()
                            .then(function (configuration) {
                                let module_config = configuration.modules.filter(function (module) {
                                    return module.id === 'module.beteiligt';
                                })[0];
                                return ModuleConfig.create(list_data, module_config);
                            });
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
                    let modules = config.getActiveModules();
                    let defaults = {
                        "title": config.card.title
                    };
                    let title = modules.length > 0 ? modules[0].config.editables
                        .filter(function (editable) {
                            return editable.id === "title";
                        })
                        .map(function (editable) {
                            return editable.label;
                        })
                        .find(function (label) {
                            return !isBlank(label);
                        }) : null;

                    let options = extend(defaults, {
                        "title": title
                    });
                    return {
                        title: options.title,
                        icon: config.card.icon,
                        content: {
                            type: 'iframe',
                            url: t.signUrl(config.card.content.file, {}),
                            height: 500 // Max height is 500
                        }
                    };
                } else {
                    return {
                        title: 'Panta.Card',
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
        const cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
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
}, {
    appName: APP_NAME,
    appKey: APP_KEY
});