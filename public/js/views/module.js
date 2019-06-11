/**
 * THIS IS NOT USED ANYMORE. SEE PLUGIN.HTML
 *
 * @type {ModuleController}
 */
let moduleController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getModuleController();
t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    return t.get('card', 'shared', ModuleController.SHARED_NAME)
        .then(function (jsonobj) {
            return ClientManager.getInstance(window).getPluginController().getPluginConfiguration()
                .then(function (configuration) {
                    let module_config = configuration.modules.filter(function (module) {
                        return module.id === 'module.beteiligt';
                    }).map(function (module) {
                        return module.config.layouts;
                    })[0];
                    if (module_config) {
                        moduleController.render(ModuleConfig.create(jsonobj, module_config), module_config);
                    }
                });
        })
        .then(function () {
            return t.cards('id', 'closed');
        })
        .filter(function (card) {
            return !card.closed;
        })
        .each(function (card) {
            return t.get(card.id, 'shared', ModuleController.SHARED_NAME)
                .then(function (json) {
                    moduleController.insert(ModuleConfig.create(json), card);
                });
        })
        .then(function () {
            if (ClientManager.getInstance(window).isBeteiligtModuleEnabled()) {
                moduleController.update();
            } else {
                moduleController.hide()
            }
        })
        .then(function () {
            if (ClientManager.getInstance(window).isBeteiligtModuleEnabled()) {
                t.sizeTo('#panta\\.module').done();
            }
        })
});
