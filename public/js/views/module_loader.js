ClientManager.assertClientManager(window, t, PLUGIN_CONFIGURATION);
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
                if (!enabled) {
                    // hmmm... the binding is only available after render
                    cm.getController(context.id).detach();
                }
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
                            controller.render(controller.create(json, configuration), configuration);
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
                            return context["configuration"]
                                .then(function (configuration) {
                                    controller.insert(controller.create(json, configuration), card);
                                    return true;
                                });

                        })
                });
        })
        .each(function (context) {
            const controller = cm.getController(context.id);
            if (cm.getPluginController().upgrading) {
                return controller.blockUi();
            } else {
                return controller.update();
            }
        })

        .then(function (v) {
            t.sizeTo('#panta\\.content').done();
        });
});