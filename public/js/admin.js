let clientManager = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION);
/**
 * @type {PluginController}
 */
let pluginController = clientManager.init().getPluginController();

t.render(function () {

    return pluginController.getAdminConfiguration()
        .then(function (data) {
            const controller = AdminController.create(t, document, DI.getInstance().getAdminService(t), DI.getInstance().getLoggingService());
            data.page = t.arg('page');
            return controller.render.call(controller, data);
        })
        .catch(it => {
            const controller = AdminController.create(t, document, DI.getInstance().getAdminService(t), DI.getInstance().getLoggingService());
            const data = {
                'configuration': null,
                'page': 'error',
                'error': it,
                'error_details': it.stack
            };
            return controller.render.call(controller, data);
        });
});