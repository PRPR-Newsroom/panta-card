let clientManager = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION);
/**
 * @type {PluginController}
 */
let pluginController = clientManager.init().getPluginController();

t.render(function () {

    // pluginController.setAdminConfiguration({
    //     configuration: new ImportConfiguration()
    // });
    return pluginController.getAdminConfiguration()
        .then(function (data) {
            let controller = AdminController.create(t, document, DI.getInstance().getAdminService(t));

            return controller.render.call(controller, data)
                .then(function() {
                    return t.sizeTo("#content").done();
                });
        });
});