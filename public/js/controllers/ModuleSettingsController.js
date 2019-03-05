class ModuleSettingsController {

    /**
     * @param trello
     * @param pluginController
     * @param module
     * @param editable
     * @param document
     * @returns {ModuleSettingsController}
     */
    static create(trello, pluginController, module, editable, document) {
        return new ModuleSettingsController(trello, pluginController, module, editable, document);
    }

    /**
     *
     * @param trello
     * @param pluginController
     * @param module
     * @param editable
     * @param document
     * @private
     */
    constructor(trello, pluginController, module, editable, document) {
        this.trello = trello;
        /**
         * @type PluginController
         */
        this.pluginController = pluginController;

        this.module = module;
        /**
         * @type HTMLDocument
         */
        this.document = document;
        this.editable = editable;
    }

    render(data) {
        this.clearContent();
        if (this.module) {
            if (this.module && this.editable) {
                this.edit();
            } else {
                this.view();
            }
        } else {
            this.index(data);
        }
    }

    /**
     * @private
     */
    edit() {
        let that = this;
        /**
         * @type PluginModuleConfig
         */
        let mc = this.pluginController.findModuleById(this.module);
        let editable = mc.config.editables.find(function (item) {
            return item.id === that.editable;
        });
        that.document.getElementsByClassName("settings-content").forEach(function (element) {
            let header = that.document.createElement("p");
            header.innerHTML = "<strong>Stichworte:</strong>";
            let hint = that.document.createElement("p");
            hint.innerHTML = "Die Stichworte werden für das ganze Board definiert. Wenn ein Stichwort bereits in einer Trello Card " +
                "verwendet und hier das Stichwort entfernt wird, dann ist dieses Stichwort in dieser Trello Card " +
                "ebenfalls nicht mehr vorhanden. Falls jedoch ein bestehendes Stichwort " +
                "nur umbenannt wird, dann wird das dazugehörige Trello Card Stichwort ebenfalls " +
                "den neuen Namen tragen.";

            element.appendChild(hint);
            element.appendChild(header);

            editable.values
                .map(function (item) {
                    return new ModuleEditableTextItem(item).render();
                })
                .reduce(function (prev, curr) {
                    prev.appendChild(curr);
                    return prev;
                }, element);

            element.appendChild(that.document.createElement("br"));

            let footer = that.document.createElement("div");
            footer.addClass("panta-item");
            let addAction = that.document.createElement("a");
            addAction.innerHTML = "<strong>Neues Stichwort hinzufügen</strong>";
            footer.appendChild(addAction);
            element.appendChild(footer);
        });

        this.hideVersion();
    }

    /**
     * @private
     */
    view() {
        let that = this;
        /**
         * @type PluginModuleConfig
         */
        let mc = this.pluginController.findModuleById(this.module);
        // show all editables
        that.document.getElementsByClassName("settings-content").forEach(function (element) {
            let header = that.document.createElement("p");
            header.innerHTML = "<strong>Auswahllisten:</strong>";

            let hint = that.document.createElement("p");
            hint.innerHTML = "Die Auswahllisten werden für das ganze Trello Board definiert. Für jede " +
                "Auswahlliste kann eine Farbe angegeben, eine Bezeichnung vergeben werden. Zudem kann " +
                "angegeben werden, ob die Auswahlliste auf der Trello Card Vorderseite angezeigt " +
                "werden soll. Falls diese Option aktiviert ist, dann wird der Wert der Auswahlliste " +
                "in der ausgewählten Farbe angezeigt.";

            element.appendChild(hint);
            element.appendChild(header);

            mc.config.editables
                .map(function (editable) {
                    return new ModuleEditableItem(mc, editable, that.trello)
                        .setOnEnterListener(function (module, editable) {
                            that.trello.popup({
                                title: editable.label,
                                url: "settings.html",
                                height: 184,
                                args: {
                                    "module": module.id,
                                    "editable": editable.id,
                                },
                            });
                        })
                        .render();
                })
                .reduce(function (prev, curr) {
                    prev.appendChild(curr);
                    return prev;
                }, element);
        });

        this.hideVersion();
    }

    /**
     * @private
     */
    hideVersion() {
        this.document.getElementsByClassName("plugin-version-container")
            .forEach(function (version) {
                version.addClass("hidden");
            });
    }

    /**
     * @param data
     * @private
     */
    index(data) {

        let that = this;
        let config = data;
        if (config instanceof PluginConfiguration) {
            this.document.getElementsByClassName("plugin-version").forEach(function (element) {
                element.setEventListener('click', function() {
                    that.trello.remove('board', 'shared', PluginController.CONFIGURATION_NAME);
                });
                element.innerHTML = config.version;
            });

            this.document.getElementsByClassName("plugin-description").forEach(function (element) {
                element.innerHTML = config.description;
                element.setAttribute("data-content", element.innerText);
                element.setAttribute("data-name", "description");
            });

            this.document.getElementsByClassName("settings-content").forEach(function (element) {
                let header = that.document.createElement("p");
                header.innerHTML = "<strong>Module:</strong>";

                let hint = that.document.createElement("p");
                hint.innerHTML = "Folgende Module sind für dieses Board verfügbar. " +
                    "Sobald mindestens ein Modul aktiviert ist, wird dieses Modul in " +
                    "der Trello Card dargestellt.";

                element.appendChild(hint);
                element.appendChild(header);

                let list = Object.values(config.modules).map(function (module) {
                    return new ModuleSettingsItem(that.document, module, that.trello)
                        .setOnEnterListener(function (module) {
                            // when the user clicks on a module we want to navigate to another page.
                            that.trello.popup({
                                title: module.name,
                                url: "settings.html",
                                height: 184,
                                args: {
                                    "module": module.id
                                },
                            });
                        })
                        .setOnActivationListener(function (module, enabled) {
                            config.card = {
                                "icon": module.config.icon,
                                "title": module.name,
                                "content": {
                                    "file": module.config.view
                                },
                            };
                            module.config.enabled = enabled;
                            that.trello.set('board', 'shared', PluginController.CONFIGURATION_NAME, config);
                        })
                        .render();
                }).reduce(function (prev, curr) {
                    prev.appendChild(curr);
                    return prev;
                }, document.createElement("div"));
                element.appendChild(list);

            });

        }
    }

    clearContent() {
        this.document.getElementsByClassName("settings-content").forEach(function(content) {
            content.removeChildren();
        });
    }

}