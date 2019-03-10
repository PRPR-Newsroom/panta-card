TrelloPowerUp.initialize({
    // https://developers.trello.com/v1.0/reference#card-buttons
    'card-buttons': function (t, options) {
        return [{
            icon: './assets/ic_pantarhei.png',
            text: 'Panta Einstellungen',
            callback: function (t) {
                return t.popup({
                    title: "Einstellungen",
                    url: "settings.html",
                    height: 184
                })
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
                    console.log("hasActiveModules");
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
                return cm.isArticleModuleEnabled();
            })
            .then(function (enabled) {
                let sorters = [];
                if (enabled) {
                    sorters.push({
                        text: "Pagina (1 -> 99)",
                        callback: function (t, opts) {
                            return sortOnPagina(getArticleControllerWith(cm, list, opts), t, opts, "asc");
                        }
                    });
                    sorters.push({
                        text: "Online (Mo. -> So.)",
                        callback: function (t, opts) {
                            return sortOnTags(getArticleControllerWith(cm, list, opts), t, opts, "asc");
                        }
                    });
                }
                return sorters;
            });
    }
});

/**
 * Get an articleController for this list and options
 * @param {ClientManager} cm the client manager
 * @param list the trello list
 * @param opts the trello callback options that contain the cards within this list
 * @returns {ArtikelController}
 */
function getArticleControllerWith(cm, list, opts) {

    for (let index in opts.cards) {
        let card = opts.cards[index];
        let artikel = cm.getArticleController().getByCard(card);
        if (artikel && !card.closed) {
            cm.getArticleController().insert(artikel, card);
        }
    }
    return cm.getArticleController();
}

/**
 * Get the sorted cards using the article's pagina property
 * @param articleController
 * @param t the trello api
 * @param opts the options that contain the cards to be sorted
 * @param sort sort strategy: asc or desc
 * @returns {{sortedIds: *|{}|Uint8Array|any[]|Int32Array|Uint16Array}}
 */
function sortOnPagina(articleController, t, opts, sort) {
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = articleController.getByCard(lhs_card);
            let rhs = articleController.getByCard(rhs_card);
            let lhsp = lhs ? parseFloat(lhs.pagina || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
            let rhsp = rhs ? parseFloat(rhs.pagina || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
            if (lhsp > rhsp) {
                return sort === "asc" ? 1 : -1;
            } else if (rhsp > lhsp) {
                return sort === "asc" ? -1 : 1;
            }
            return 0;
        });

    return {
        sortedIds: sortedCards.map(function (c) {
            return c.id;
        })
    };
}

/**
 * Get the sorted cards using the article's tags (Tage) property
 * @param articleController
 * @param t the trello api
 * @param opts the options that contain the cards to be sorted
 * @param sort sort strategy: asc or desc
 * @returns {{sortedIds: *|{}|Uint8Array|any[]|Int32Array|Uint16Array}}
 */
function sortOnTags(articleController, t, opts, sort) {
    // Trello will call this if the user clicks on this sort
    // opts.cards contains all card objects in the list
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = articleController.getByCard(lhs_card);
            let rhs = articleController.getByCard(rhs_card);
            let lhsp = lhs && lhs.tags ? map(lhs.tags) : Number.MAX_VALUE;
            let rhsp = rhs && rhs.tags ? map(rhs.tags) : Number.MAX_VALUE;
            if (lhsp > rhsp) {
                return sort === "asc" ? 1 : -1;
            } else if (rhsp > lhsp) {
                return sort === "asc" ? -1 : 1;
            }
            return 0;
        });

    return {
        sortedIds: sortedCards.map(function (c) {
            return c.id;
        })
    };
}

/**
 * Map the parameter tag to a numeric value that can be sorted. Monday starts at zero and ends on sunday with six
 * @param tag
 * @returns {number}
 */
function map(tag) {
    if (!tag) {
        return -1;
    }
    switch (tag) {
        case "monday":
            return 0;
        case "tuesday":
            return 1;
        case "wednesday":
            return 2;
        case "thursday":
            return 3;
        case "friday":
            return 4;
        case "saturday":
            return 5;
        case "sunday":
            return 6;
        default:
            return 7;
    }
}