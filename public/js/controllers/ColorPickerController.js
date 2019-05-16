class ColorPickerController {

    /**
     * @param {Window} windowManager
     * @param {PluginController} pluginController
     */
    constructor(windowManager, pluginController, trello) {
        /**
         * @type {Window}
         * @private
         */
        this._windowManager = windowManager;
        /**
         * @type {PluginController}
         * @private
         */
        this._pluginController = pluginController;

        this._trello = trello;
    }

    /**
     *
     * @param {{"module": String, "editable": String, "color": String}} args
     * @return {*|{its}|void|PromiseLike<T>|Promise<T>}
     */
    render(args) {
        let that = this;
        return this._pluginController.findPluginModuleConfigByModuleId(args["module"])
            .then(function (module) {
                // find all color choosers and activate the currently active (args)
                let controls = [];
                let choosers = that._windowManager.document.getElementsByClassName("panta-js-color-chooser");
                choosers.forEach(function (chooser) {
                    chooser.setEventListener('click', function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        that.updateColor(module, args["editable"], that.renderControls(controls, chooser.getAttribute("data-color"))["color"])
                            .then(function() {
                                // if we navigate back the setting does somehow not get persisted even if we do it here in "then()" chain
                                // that._trello.back();
                            });

                    });
                    controls.push({
                        "color": chooser.getAttribute("data-color"),
                        "control": chooser.getClosestChildByClassName("panta-js-checkbox")
                    });
                });

                let editable = that.getEditable(module, args["editable"]);
                that.renderControls(controls, editable.color);
            });
    }

    /**
     * @param {PluginModuleConfig} module
     * @param editableId
     * @param color
     */
    updateColor(module, editableId, color) {
        let editable = this.getEditable(module, editableId);
        editable["color"] = color;
        return this._pluginController.setPluginModuleConfig(module)
            .then(function (pc) {
                console.log("updateColor done", pc);
                return pc;
            });
    }

    /**
     * Render the controls
     * @param controls
     * @param color
     */
    renderControls(controls, color) {
        return controls.reduce(function (prev, item) {
            item["control"].checked = item["color"] === color;
            return item["control"].checked ? item : prev;
        }, null);
    }

    /**
     * Get the editable by its id from the PluginModuleConfig
     * @param {PluginModuleConfig} module
     * @param editableId
     * @return {T | undefined}
     */
    getEditable(module, editableId) {
        return module.config.editables.find(function(item) {
            return item.id === editableId;
        });
    }

}