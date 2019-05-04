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

                    that.renderEditableHint(element, editable);

                    that.renderEditableLabel(mc, element, editable, editable.title || "Beschriftung");

                    that.renderEditable(mc, editable, element);
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

                    let hint = that.document.createElement("p");
                    hint.innerHTML = __(mc.config.desc);

                    element.appendChild(hint);

                    that.renderFieldGroup(mc, "label", element, "Beschriftungen");
                    that.renderFieldGroup(mc, "text", element, "Eingabefelder");
                    that.renderFieldGroup(mc, "select", element, "Auswahllisten");
                    that.renderFieldGroup(mc, "layout", element, "Layouts");
                });
                that.hideVersion();
                return true;
            });
    }

    /**
     * @param {PluginModuleConfig} mc
     * @param editable
     * @param element container element
     */
    renderEditable(mc, editable, element) {
        switch (editable.type) {
            case "select":
                this.renderEditableSelect(mc, editable, element, "Stichworte");
                break;
            case "text":
                this.renderEditableText(mc, editable, element, "Platzhalter");
                break;
            case "layout":
                this.renderEditableLayout(mc, editable, element, "Layout");
                break;
        }
    }

    /**
     * @param {PluginModuleConfig} mc
     * @param editable
     * @param element
     * @param label
     */
    renderEditableLayout(mc, editable, element, label) {
        let that = this;
        let group = this.document.createElement("span");
        group.innerHTML = "<strong>" + label + "</strong>";
        element.appendChild(group);

        /**
         * @type {ModuleEditableSelectItem}
         */
        let chooser = Object.keys(mc.config.layouts)
            .reduce(function (prev, id) {
                let layout = mc.config.layouts[id];
                let opt = that.document.createElement("option");
                opt.setAttribute("value", id);
                if (editable.layout === id) {
                    opt.setAttribute("selected", "selected");
                } else {
                    opt.removeAttribute("selected");
                }
                opt.innerText = layout.label;
                prev.addOption(opt);
                return prev;
            }, new ModuleEditableSelectItem(editable.layout));

        chooser.setOnTextChangeListener(function(prev, cur) {
            editable.layout = cur;
            // add layout form
            switch (editable.layout) {
                case "regular":
                case "ad":
                    that.renderLayoutForm(mc, editable.layout, element);
                    break;
                default:
                    console.error("Unknown layout: ", editable.layout);
                    break;
            }
            that.pluginController.setPluginModuleConfig(mc)
                .then(function() {
                    console.log("Updated");
                });
        });
        let column = that.document.createElement("div");
        element.appendChild(column);

        column.appendChild(chooser.render());

        chooser.fireOnCreate();
    }

    /**
     * @param {PluginModuleConfig} mc
     * @param {string} layout
     * @param {HTMLElement} element
     */
    renderLayoutForm(mc, layout, element) {
        let that = this;
        let layoutConfig = mc.config.layouts[layout];

        let holders = this.createLayoutFormHolder(element);

        holders.forEach(function(holder) {
            holder.removeChildren();

            let hint = that.document.createElement("p");
            hint.innerHTML = __("module.beteiligt.layout-" + layout + ".desc");
            holder.appendChild(hint);

            layoutConfig.fields.forEach(function(field) {
                that.renderEditableLabel(mc, holder, field, "Beschriftung");
                that.renderEditable(mc, field, holder);
            });
        });

    }

    createLayoutFormHolder(parent) {
        let that = this;
        let holders = that.document.getElementsByClassName("panta-js-layout-form");
        if (holders.length === 0) {
            holders = [that.document.createElement("div").addClass("panta-js-layout-form")];
            parent.append(holders[0]);
        }
        return holders;
    }

    renderEditableText(mc, editable, element, label) {
        let that = this;
        let group = this.document.createElement("span");
        group.innerHTML = "<strong>" + label + "</strong>";
        element.appendChild(group);

        let meti = new ModuleEditableTextItem(editable.placeholder, false);
        element.appendChild(meti.setOnTextChangeListener(function (previous, updated) {
            if (editable.placeholder !== updated) {
                editable.placeholder = updated;
                that.pluginController.setPluginModuleConfig(mc)
                    .then(function () {
                        console.log("Values updated");
                    });
                return updated;
            }
        }).render());
    }

    renderEditableSelect(mc, editable, element, label) {
        let that = this;
        let group = this.document.createElement("span");
        group.innerHTML = "<strong>" + label + "</strong>";
        element.appendChild(group);

        editable.values
            .map(function (item) {
                let meti = new ModuleEditableTextItem(item, true);
                meti.setOnDeleteListener(function (value) {
                    if (confirm("Feld löschen", "Möchten Sie das Feld endgültig löschen?")) {
                        let index = editable.values.indexOf(value);
                        if (index !== -1) {
                            editable.values.splice(index, 1);
                        }
                        that.pluginController.setPluginModuleConfig(mc)
                            .then(function () {
                                console.log("Field deleted");
                            });
                    }
                });
                meti.setOnTextChangeListener(function (previous, updated) {
                    let index = editable.values.indexOf(previous);
                    if (index !== -1) {
                        editable.values.splice(index, 1, updated);
                    } else {
                        editable.values.push(updated);
                    }
                    that.pluginController.setPluginModuleConfig(mc)
                        .then(function () {
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

        let sorter = new SwitchItem(that.document, "Sortierbar", editable.sortable)
        sorter.setOnActivationListener(function(previous, updated) {
            editable.sortable = updated;
            return that.pluginController.setPluginModuleConfig(mc)
                .then(function() {
                    return updated;
                });
        });
        element.appendChild(sorter.render());

        that.nl(element);

        let footer = that.document.createElement("div");
        let addAction = that.document.createElement("button");
        addAction
            .addClass("panta-btn");
        addAction.innerHTML = "Neues Stichwort";
        addAction.setEventListener('click', function (e) {
            editable.values.push("");
            that.pluginController.setPluginModuleConfig(mc)
                .then(function () {
                    console.log("New item added");
                });
        });
        footer.appendChild(addAction);
        element.appendChild(footer);
    }

    renderEditableHint(element, editable) {
        let that = this;
        let hint = that.document.createElement("p");
        hint.innerHTML = __(editable.desc);
        element.appendChild(hint);
    }

    /**
     * @param {PluginModuleConfig} mc
     * @param element
     * @param editable
     * @param label
     */
    renderEditableLabel(mc, element, editable, label) {
        let that = this;
        let name = that.document.createElement("span");
        name.innerHTML = "<strong>" + label + "</strong>";
        element.appendChild(name);
        let editableName = new ModuleEditableTextItem(editable.label, false);
        editableName.setOnTextChangeListener(function (previous, updated) {
            editable.label = updated;
            that.pluginController.setPluginModuleConfig(mc)
                .then(function () {
                    console.log("Label updated");
                });
        });
        element.appendChild(editableName.render());
    }

    /**
     * @param {PluginModuleConfig} mc
     * @param type the type of the fields
     * @param element
     * @param section the name of that section/group
     */
    renderFieldGroup(mc, type, element, section) {
        let that = this;
        let group = that.document.createElement("span");
        let typed = mc.config.editables
            .filter(function (editable) {
                return editable.type === type;
            });

        group.addClass(typed.length > 0 ? 'show' : 'hidden');
        group.innerHTML = "<strong>" + section + "</strong>";
        element.appendChild(group);

        typed.map(function (editable) {
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
                        editable.show = showOnFront;
                        that.pluginController.setPluginModuleConfig(module)
                            .then(function (pc) {
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

        if (typed.length > 0) {
            that.nl(element);
        }
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
                let header = that.document.createElement("span");
                header.innerHTML = "<strong>Module</strong>";

                let hint = that.document.createElement("p");
                hint.innerHTML =  __("module.settings.hint");

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
                            module.config.enabled = enabled;
                            // first we need to update the module (without card info)
                            that.pluginController.setPluginModuleConfig(module)
                                .then(function(pc) {
                                    if (pc instanceof PluginConfiguration) {
                                        // and after the module is disabled/enabled we can update the card info with the current main module
                                        let actives = pc.getActiveModules()
                                            .sort(function(lhs, rhs) {
                                                return lhs.config.sort - rhs.config.sort;
                                            });
                                        if (actives && actives.length > 0) {
                                            let active = actives[0];
                                            config.card = {
                                                "icon": "./assets/" + active.config.icon,
                                                "title": active.name,
                                                "content": {
                                                    "file": "./module.html"
                                                },
                                            };
                                        }
                                        that.pluginController.setPluginModuleConfig(module, config.card)
                                            .then(function(pc) {
                                                console.log("Main module set as card configuration");
                                            });
                                    }
                                });
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

    /**
     * Clear the content of the settings page completely by removing all child nodes from the
     * container
     */
    clearContent() {
        this.document.getElementsByClassName("settings-content").forEach(function (content) {
            content.removeChildren();
        });
    }

    /**
     * Add a new line to the element
     * @param element
     * @private
     */
    nl(element) {
        element.appendChild(this.document.createElement("br"));
    }

    /**
     * Hide the version on the page
     * @private
     */
    hideVersion() {
        this.document.getElementsByClassName("plugin-version-container")
            .forEach(function (version) {
                version.addClass("hidden");
            });
    }

}