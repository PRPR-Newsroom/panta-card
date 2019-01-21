/**
 * @type {PluginController}
 */
let pluginController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPluginController();

t.render(function () {

    return pluginController.getPluginConfiguration()
        .then(function (data) {
            let config = data instanceof PluginConfiguration ? data : new PluginConfiguration("1.0.0", "Beschreibung hinzufügen...", null, pluginController.getAvailableModules());
            if (config instanceof PluginConfiguration) {
                document.getElementsByClassName("plugin-version").forEach(function (element) {
                    element.innerHTML = config.version;
                });

                document.getElementsByClassName("plugin-description").forEach(function (element) {
                    element.innerHTML = config.description;
                    element.setAttribute("data-content", element.innerText);
                    element.setAttribute("data-name", "description");
                });

                document.getElementsByClassName("plugin-modules").forEach(function (element) {
                    let list = Object.values(config.modules).map(function (module) {
                        let item = document.createElement("li");
                        item.setAttribute("id", module.id);
                        item.innerText = module.name;
                        return item;
                    }).reduce(function (prev, curr) {
                        prev.appendChild(curr);
                        return prev;
                    }, document.createElement("ul"));
                    element.appendChild(list);
                });

            }

            let editables = document.getElementsByClassName("editable");
            editables.forEach(function (editable) {
                editable.setEventListener('click', function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    let content = editable.getAttribute("data-content");
                    let input = document.createElement("textarea");
                    input.setAttribute("class", "editor")
                    input.innerText = content;
                    input.setEventListener('click', function (e) {
                        e.stopPropagation();
                    });
                    let container = editable.parentElement;
                    container.appendChild(input);
                    editable.addClass("hidden");
                    t.sizeTo("#content").done();
                });
            });

            document.getElementById("content").setEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                let updates = Object.values(editables).map(function (editable) {
                    let container = editable.parentElement;
                    let editors = container.getElementsByClassName("editor");
                    if (editors.length === 1) {
                        let content = editors.item(0).value;
                        editable.innerText = content.toHTML();
                        editable.setAttribute("data-content", editable.innerText);
                        editable.removeClass("hidden");
                        editors.item(0).remove();
                        return {
                            "name": editable.getAttribute("data-name"),
                            "content": content
                        }
                    } else {
                        editable.removeClass("hidden");
                        return null;
                    }
                }).filter(function (item) {
                    return item !== null;
                });
                if (updates.length > 0) {
                    console.log("Update: " + JSON.stringify(updates));
                    // TODO do update in Trello
                } else {
                    // no updates
                }
            });

            return t.sizeTo("#content").done();
        });
});