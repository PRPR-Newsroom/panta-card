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

    /**
     * @param data
     * @return {PromiseLike<T>|Promise<T>}
     */
    render(data) {
        this.clearContent();
        if (this.module) {
            if (this.module && this.editable) {
                return this.edit();
            } else {
                return this.view(data);
            }
        } else {
            return this.index(data);
        }
    }

    /**
     * @return {PromiseLike<T>|Promise<T>}
     * @private
     */
    edit() {
        let that = this;
        return this.pluginController.findPluginModuleConfigByModuleId(this.module)
            .then(function (mc) {
                let editable = mc.config.editables.find(function (item) {
                    return item.id === that.editable;
                });
                that.document.getElementsByClassName("settings-content").forEach(function (element) {
                    let name = that.document.createElement("p");
                    name.innerHTML = "<strong>Name</strong>";

                    let header = that.document.createElement("p");
                    header.innerHTML = "<strong>Stichworte:</strong>";
                    let hint = that.document.createElement("p");
                    hint.innerHTML = "Die Stichworte werden für das ganze Board definiert. Wenn ein Stichwort bereits in einer Trello Card " +
                        "verwendet und hier das Stichwort entfernt wird, dann ist dieses Stichwort in dieser Trello Card " +
                        "ebenfalls nicht mehr vorhanden. Falls jedoch ein bestehendes Stichwort " +
                        "nur umbenannt wird, dann wird das dazugehörige Trello Card Stichwort ebenfalls " +
                        "den neuen Namen tragen.";

                    element.appendChild(hint);
                    element.appendChild(name);

                    let editableName = new ModuleEditableTextItem(editable.label);
                    editableName.setOnTextChangeListener(function(previous, updated) {
                        editable.label = updated;
                        that.pluginController.setPluginModuleConfig(mc)
                            .then(function() {
                                console.log("Label updated");
                            });
                    });
                    element.appendChild(editableName.render());

                    element.appendChild(header);

                    editable.values
                        .map(function (item) {
                            let meti = new ModuleEditableTextItem(item);
                            meti.setOnDeleteListener(function(value) {
                                if (confirm("Feld löschen", "Möchten Sie das Feld endgültig löschen?")) {
                                    let index = editable.values.indexOf(value);
                                    if (index !== -1) {
                                        editable.values.splice(index, 1);
                                    }
                                    that.pluginController.setPluginModuleConfig(mc)
                                        .then(function() {
                                            console.log("Field deleted");
                                        });
                                }
                            });
                            meti.setOnTextChangeListener(function(previous, updated) {
                                let index = editable.values.indexOf(previous);
                                if (index !== -1) {
                                    editable.values.splice(index, 1, updated);
                                } else {
                                    editable.values.push(updated);
                                }
                                that.pluginController.setPluginModuleConfig(mc)
                                    .then(function() {
                                        console.log("Values updated");
                                    });
                                return updated;
                            });
                            return meti.render();
                        })
                        .reduce(function (prev, curr) {
                            prev.appendChild(curr);
                            return prev;
                        }, element);

                    element.appendChild(that.document.createElement("br"));

                    let footer = that.document.createElement("div");
                    let addAction = that.document.createElement("button");
                    addAction
                        .addClass("panta-btn");
                    addAction.innerHTML = "Neues Stichwort";
                    addAction.setEventListener('click', function(e) {
                        editable.values.push("");
                        that.pluginController.setPluginModuleConfig(mc)
                            .then(function() {
                                console.log("New item added");
                            });
                    });
                    footer.appendChild(addAction);
                    element.appendChild(footer);
                });
                that.hideVersion();
                return true;
            });
    }

    /**
     * @param {PluginConfiguration} config
     * @return {PromiseLike<T>|Promise<T>}
     * @private
     */
    view(config) {
        let that = this;
        return this.pluginController.findPluginModuleConfigByModuleId(this.module)
            .then(function (mc) {
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
                                .setOnActivationListener(function (module, editable, showOnFront) {
                                    editable.show_on_front = showOnFront;
                                    that.pluginController.setPluginModuleConfig(module)
                                        .then(function(pc) {
                                            console.log("PluginConfiguration updated", pc);
                                        });
                                })
                                .setOnColorPickerClick(function (module, editable) {
                                    that.trello.popup({
                                        title: "Farbe wählen",
                                        url: "color-picker.html",
                                        height: 184,
                                        args: {
                                            "module": module.id,
                                            "editable": editable.id,
                                            "color": editable.color
                                        }
                                    });
                                })
                                .render();
                        })
                        .reduce(function (prev, curr) {
                            prev.appendChild(curr);
                            return prev;
                        }, element);
                });
                that.hideVersion();
                return true;
            });
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
     * @return {PromiseLike<T>|Promise<T>}
     * @private
     */
    index(data) {

        let that = this;
        let config = data;
        if (config instanceof PluginConfiguration) {
            this.document.getElementsByClassName("plugin-version").forEach(function (element) {
                element.setEventListener('click', function () {
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
        return Promise.resolve(true);
    }

    clearContent() {
        this.document.getElementsByClassName("settings-content").forEach(function (content) {
            content.removeChildren();
        });
    }

}