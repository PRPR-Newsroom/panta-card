/**
 * @type {PluginController}
 */
let pluginController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPluginController();

t.render(function () {

    return pluginController.getPluginConfiguration()
        .then(function (data) {
            let controller = new ColorPickerController(window, pluginController, t);

            return controller.render.call(controller, {
                "module": t.arg("module"),
                "editable": t.arg("editable"),
                "color": t.arg("color")
            })
                .then(function () {
                    return t.sizeTo("#content").done();
                });
        });
});
