/**
 * @type {ClientManager}
 */
let clientManager = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
t.render(function () {

    // we need to get all data for all enabled modules

    return t.cards('id', 'closed')
        .filter(function (card) {
            return !card.closed;
        })
        .then(function (card) {
            return Promise.all([
                cm.getArticleModuleContext(card),
                cm.getPlanModuleContext(card),
                cm.getBeteiligtModuleContext(card)
            ]);
        })
        .filter(function (context) {
            return context["condition"].then(function (enabled) {
                return enabled;
            });
        })
        .each(function (context) {
            // render current card for each enabled module
            let controller = cm.getController(context.id);
            return t.get('card', 'shared', context["shared"])
                .then(function (json) {
                    return context["configuration"]
                        .then(function (configuration) {
                            let layouts = configuration && configuration.config ? configuration.config.layouts : null;
                            controller.render(controller.create(json), layouts);
                            return true;
                        })
                })
                // and add all entities from other cards on this board
                .then(function () {
                    return t.cards('id', 'closed');
                })
                .each(function (card) {
                    return t.get(card.id, 'shared', context["shared"])
                        .then(function (json) {
                            controller.insert(controller.create(json), card);
                        })
                });
        })
        .each(function (context) {
            /* TODO each enabled module must now be initialized with the card
                get the controller by its id
                add the entity to the controller
                render the content */
            if (cm.getPluginController().upgrading) {
                // TODO disable/block ui if plugin is upgrading
            }
            let controller = cm.getController(context.id);
            return controller.update();
        })

        .then(function (v) {
            t.sizeTo('#panta\\.content').done();
        });

    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    // return t.get('card', 'shared', ModuleController.SHARED_NAME)
    //     .then(function (jsonobj) {
    //         return ClientManager.getInstance(window).getPluginController().getPluginConfiguration()
    //             .then(function (configuration) {
    //                 let module_config = configuration.modules.filter(function (module) {
    //                     return module.id === 'module.beteiligt';
    //                 }).map(function (module) {
    //                     return module.config.layouts;
    //                 })[0];
    //                 if (module_config) {
    //                     moduleController.render(ModuleConfig.create(jsonobj), module_config);
    //                 }
    //             });
    //     })
    //     .then(function () {
    //         return t.cards('id', 'closed');
    //     })
    //     .filter(function (card) {
    //         return !card.closed;
    //     })
    //     .each(function (card) {
    //         return t.get(card.id, 'shared', ModuleController.SHARED_NAME)
    //             .then(function (json) {
    //                 moduleController.insert(ModuleConfig.create(json), card);
    //             });
    //     })
    //     .then(function () {
    //         if (ClientManager.getInstance(window).isBeteiligtModuleEnabled()) {
    //             moduleController.update();
    //         } else {
    //             moduleController.hide()
    //         }
    //     })
    //     .then(function () {
    //         if (ClientManager.getInstance(window).isBeteiligtModuleEnabled()) {
    //             t.sizeTo('#panta\\.module').done();
    //         }
    //     })
});