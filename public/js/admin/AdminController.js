class AdminController {

    /**
     * The name of the property bag in trello
     * @returns {string}
     * @constructor
     */
    static get PROPERTY_BAG_NAME() {
        return "panta.Admin.PropertyBag";
    }

    /**
     * Create an admin controller
     * @param trello
     * @param document
     * @param adminService
     * @param loggingService
     * @return {AdminController}
     */
    static create(trello, document, adminService, loggingService) {
        return new AdminController(trello, adminService, document, loggingService);
    }


    /**
     * @param trello
     * @param {AdminService} adminService
     * @param {Document} document
     * @param {LoggingService} loggingService
     */
    constructor(trello, adminService, document, loggingService) {
        /**
         * @protected
         */
        this._trello = trello;
        /**
         * @type {AdminService}
         * @protected
         */
        this._adminService = adminService;
        /**
         * @type {Document}
         * @protected
         */
        this._document = document;
        /**
         * @type {ClientManager}
         * @protected
         */
        this._clientManager = ClientManager.getInstance(window);

        /**
         * @type {PluginController}
         * @protected
         */
        this._pluginController = this._clientManager.getPluginController();

        /**
         * @type {Import}
         * @protected
         */
        this._model = null;

        /**
         * A property bag that can be used to store just plain old values
         * @type {{}}
         * @protected
         */
        this._propertyBag = {};

        /**
         * @type {LoggingService}
         * @protected
         */
        this._loggingService = loggingService;

        /**
         * @type {string}
         * @protected
         */
        this._context = '';
    }

    /**
     * @param {{export_configuration: DataConfiguration, configuration: DataConfiguration, page: string?, error: string?, error_details: string?}} data
     * @return {Promise<boolean | *>}
     */
    render(data) {
        const context = data.page || 'home';
        this._clear();
        if (context === 'import') {
            return this.importPage(data.configuration)
        } else if (context === 'export') {
            return this.exportPage(data);
        } else if (context === 'error') {
            return this.errorPage(data.error, data.error_details);
        } else if (context === 'progress') {
            return this.progressPage();
        } else {
            return this.homePage();
        }
    }

    errorPage(error, error_details) {
        const that = this;
        const page = createByTemplate(template_admin_errorpage, template_admin_errorpage);
        this._document.querySelectorAll('.js-content').forEach(it => it.appendChild(page));
        this._document.querySelectorAll('.js-content').forEach(it => it.removeClass('hidden'));
        this._showErrors(page, `<h5>${error}</h5><p>${error_details}</p>`);
        this._document.querySelector('#btn-reset').setEventListener('click', (e) => {
            that._pluginController.resetAdminConfiguration();
        });
        return Promise.resolve(true);
    }

    homePage() {
        const that = this;
        const page = createByTemplate(template_admin_actions, template_admin_actions);
        this._document.querySelectorAll('.js-content').forEach(it => it.appendChild(page));
        this._document.querySelectorAll('.js-content').forEach(it => it.removeClass('hidden'));
        this._document.querySelector('#btn-action-import').setEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            that._trello.closeModal();
            that._trello.modal({
                title: 'Administration - Import',
                url: "admin.html",
                accentColor: 'blue',
                fullscreen: true,
                actions: [{
                    icon: './assets/ic_arrow_back.png',
                    callback: (t) => {
                        t.modal({
                            title: "Administration",
                            url: "admin.html",
                            accentColor: 'blue'
                        })
                    },
                    alt: 'Zurück',
                    position: 'left',
                }],
                args: {
                    "page": 'import'
                },
            });
        });
        this._document.querySelector('#btn-action-export').setEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            that._trello.closeModal();
            that._trello.modal({
                title: 'Administration - Export',
                url: "admin.html",
                accentColor: 'blue',
                fullscreen: true,
                actions: [{
                    icon: './assets/ic_arrow_back.png',
                    callback: (t) => {
                        t.modal({
                            title: "Administration",
                            url: "admin.html",
                            accentColor: 'blue'
                        })
                    },
                    alt: 'Zurück',
                    position: 'left',
                }],
                args: {
                    "page": 'export'
                },
            });
        });
        return Promise.resolve(true);
    }

    /**
     * Render the export page
     * @param config
     * @return {Promise<boolean>}
     */
    exportPage(config) {
        return new ExportController(this._trello, this._document, this._adminService, this._loggingService)
            .render(config);
    }

    /**
     * Render the import page
     * @param {DataConfiguration} previousConfig
     * @return {Promise<boolean>}
     */
    importPage(previousConfig) {
        return new ImportController(this._trello, this._adminService, this._document, this._loggingService)
            .render(previousConfig);
    }

    /**
     *
     * @param previousConfiguration
     * @return {Promise<boolean>}
     * @abstract
     */
    renderActions(previousConfiguration) {
        return Promise.resolve(false);
    }

    /**
     * Update the button state. This means that it will disable the button if the configuration is not
     * yet complete or invalid. It will also display a hint to the user if there are any validation 
     * failures
     * @param btnImport
     */
    onUpdateActionButton(btnImport) {
        const that = this;
        const configuration = that._readConfiguration(that._model);
        if (configuration.isValid()) {
            that._hideWarnings(document);
            btnImport.removeAttribute('disabled');
            btnImport.removeAttribute('title');
            btnImport.removeAttribute('data-validation');
        } else if (!btnImport.hasAttribute('data-validation')) {
            const validations = configuration.getValidationErrors();
            const errors = validations.map(it => it.id).join('<br/>');
            btnImport.setAttribute('disabled', 'disabled');
            btnImport.setAttribute('data-validation', 'invalid');
            btnImport.setAttribute('title', 'Es sind noch nicht alle notwendingen Felder konfiguriert.');
            console.warn(`Validation errors`, validations);
            that._showWarnings(document, `Es sind noch nicht alle notwendingen Felder konfiguriert.<br/>${errors}`);
        }
    }

    /**
     * @return {Promise<{each: function, done: function}>}
     */
    progressPage() {
        const that = this;
        this._document.querySelectorAll('.js-content').forEach(it => it.removeClass('hidden'));
        return new Promise(function (resolve, reject) {
            const page = createByTemplate(template_admin_progress, template_admin_progress);
            that._document.querySelectorAll('.js-content').forEach(it => it.appendChild(page));
            that._document.querySelectorAll('.js-panta-progress').forEach(it => {
                it.setEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                });
            });
            // that._testProgress(1, 3);
            resolve({
                'each': that.updateProgress,
                'context': that
            });
        });
    }

    _testProgress(current, total) {
        const that = this;
        setTimeout(() => {
            that.updateProgress(current, total, 'Datei(en) importiert', `Eintrag «Card-#${current}» wurde erfolgreich importiert`);
            if (current < total) {
                that._testProgress(current + 1, total);
            } else {
                that.finishProgress(true, 'Fertig');
            }
        }, 750);
    }

    finishProgress(success, reason) {
        const that = this;
        // let the final message still be visible for some time before removing it
        if (success) {
            this._document.querySelectorAll('.progress-overlay').forEach(it => {
                it.addClass('success');
            });
            this._document.querySelectorAll('.js-panta-record-details').forEach(it => {
                it.innerText = reason;
            });
        } else {
            this._document.querySelectorAll('.progress-overlay').forEach(it => {
                it.addClass('error');
            });
            this._document.querySelectorAll('.js-panta-record-details').forEach(it => {
                it.innerText = reason;
            });
        }
    }

    endProgress() {
        this._closeProgress(true, false);
    }

    closeProgress(success) {
        this._closeProgress(success, true);
    }

    _closeProgress(success, exit) {
        const that = this;
        setTimeout(() => {
            that._document.querySelectorAll('.js-panta-progress').forEach(it => {
                it.removeSelf();
            });
            if (exit) {
                that._trello.closeModal();
            }
        }, success ? 600 : 5000);
    }

    updateProgress(current, total, postfix, details) {
        this._document.querySelectorAll('.js-panta-current-record').forEach(it => {
            it.innerText = current;
        });
        this._document.querySelectorAll('.js-panta-total-records').forEach(it => {
            it.innerText = total;
        });
        this._document.querySelectorAll('.js-panta-progress-postfix').forEach(it => {
            it.innerText = postfix;
        });

        if (details) {
            this._document.querySelectorAll('.js-panta-record-details').forEach(it => {
                it.innerText = details;
            });
        }
    }

    /**
     * @param model
     * @return {DataConfiguration}
     * @protected
     */
    _readConfiguration(model) {
        const that = this;
        return Object.values(model.getNormalizedHeaders()).map(it => {
            /**
             * @type {HTMLSelectElement}
             */
            const select = that._document.querySelector(`#field-mapping-${it.getAddressAsText()}`);
            if (select === null) {
                return null;
            }
            const option = select.item(select.selectedIndex);
            if (option === null) {
                return null;
            }
            const type = option.getAttribute('data-type');
            const multi = option.getAttribute('data-multi') === 'true';
            return that._createFieldOfType(type, it, option.value, multi);
        }).filter(it => it != null)
            .reduce((prev, cur) => {
                prev.mapping.push(cur);
                return prev;
            }, new DataConfiguration());
    }

    /**
     * Create the field for the given type
     * @param type
     * @param {HeaderNode} header
     * @param value
     * @param {boolean} multi true if the field can be used multiple times in the configuration otherwise false
     * @return {AbstractField}
     * @protected
     */
    _createFieldOfType(type, header, value, multi) {
        switch (type) {
            case "boolean":
                return new BooleanField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments, header.color), multi);
            case 'date':
                return new DateField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments, header.color), multi);
            case 'array':
                return new ArrayField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments, header.color), multi);
            default:
                return new TextField(header.label, value, new HeaderNode(null, header.label, header.address, header.comments, header.color), multi);
        }
    }

    /**
     * @param {Import} model
     * @param {DataConfiguration} previousConfiguration
     * @abstract
     */
    renderModel(model, previousConfiguration) {

    }

    /**
     *
     * @param header
     * @param {DataConfiguration} config
     * @param {number} columns
     * @return {HTMLElement | HTMLDivElement | any}
     * @protected
     */
    _createMore(header, config = null, columns = 2) {
        const that = this;
        const more = that._document.createElement('div');
        more.setAttribute('id', `more-${header.getAddressAsText()}`);
        more.addClass(`col-${columns}`);
        return more;
    }

    /**
     * @param {HeaderNode} header
     * @param {DataConfiguration} configuration
     * @return {Promise<HTMLDivElement>}
     * @protected
     */
    _createChipsSection(header, configuration) {
        const that = this;
        const chips = that._document.createElement('div');
        chips.addClass('col-3').addClass('align-right');
        header.getPathItems().map((it, index, arr) => {
            const chip = that._document.createElement('div');
            chip.setAttribute('id', `chip-${header.getAddressAsText()}-${index + 1 < arr.length ? index : 'last'}`);
            chip.addClass('panta-chip');
            if (index + 2 < arr.length) {
                chip.addClass('panta-chip-grandpa');
            } else if (index + 1 < arr.length) {
                chip.addClass('panta-chip-parent');
            }
            it.comments.forEach((it, index, arr) => {
                chip.addClass(`panta-bgcolor-${it.t.toLowerCase()}`);
            });
            configuration.setColorByHeader(header)
                .then(it => {
                    chip.removeClassByPrefix("panta-bgcolor").addClass(`panta-bgcolor-${it}`);
                });
            const label = that._document.createElement('p');
            label.setAttribute('title', it.label);
            label.appendChild(that._document.createTextNode(it.label));
            chip.appendChild(label);
            return chip;
        }).forEach((it, index) => {
            if (that._adminService.excelService.treatFirstRowAsRoot || index > 0) {
                chips.appendChild(it);
            }
        });
        return Promise.resolve(chips);
    }

    /**
     * @param {HeaderNode} header
     * @param {Import} model
     * @param {DataConfiguration} configuration
     * @return {Promise<HTMLDivElement>}
     * @protected
     */
    _createPreviewSection(header, model, configuration, columns = 4) {
        const that = this;
        const preview = that._document.createElement('div');
        preview.setAttribute('id', `preview-${header.getAddressAsText()}`);
        preview.addClass(`col-${columns} preview-section js-preview`).addClass('align-left');
        preview.setEventListener('update', e => {
            const field = e.item || configuration.mapping.find(it => it.source.isSameAddress(header.address));

            const sample = that._context === 'import' ? model.getSample(header).then(it => {
                return model.getSampleHtml(it, that._document, field) || '<p>&nbsp;</p>';
            }) : that._getBoardSample(header, field);
            sample.then(it => {
                if (it != null) {
                    preview.setAttribute('title', it);
                    preview.innerHTML = `<p>${it}</p>`;
                } else {
                    preview.removeAttribute('title');
                    preview.innerHTML = `<p></p>`;
                }
            });
        });
        preview.innerHTML = '<p>&nbsp;</p>';
        return Promise.resolve(preview);
    }

    /**
     * @param {HeaderNode} header
     * @param {AbstractField} field
     * @return {Promise<string>}
     * @private
     */
    _getBoardSample(header, field) {
        const that = this;
        const mapping = new ImportFieldMapping(this._trello, this._adminService, this._getPantaFieldItems(), header);
        if (!field) {
            return Promise.resolve(mapping.emptyValue());
        }
        return that._trello.card('id', 'name', 'desc', 'due', 'members', 'labels', 'idList')
            .then(it => {
                return mapping.map(it, field);
            });
    }

    /**
     * Render the field mapping dropdown
     * @param {HeaderNode} header the header node
     * @param {DataConfiguration} configuration
     * @return {Promise<HTMLDivElement>}
     * @protected
     */
    _createFieldMappingSection(header, configuration) {
        const that = this;
        const linking = that._document.createElement('div');
        linking.addClass('col-3');

        const fields = that._document.createElement('select');
        fields.setAttribute('id', `field-mapping-${header.getAddressAsText()}`);
        fields.setEventListener('change', e => {
            this.onFieldMappingChange(e.target.item(e.target.selectedIndex), header, configuration);
        });
        const none = that._document.createElement('option');
        none.setAttribute('value', '-1');
        none.innerText = 'Feld auswählen...';
        fields.appendChild(none);

        return that._getTrelloFieldOptions()
            .then(it => {
                fields.appendChild(it);
                return fields;
            })
            .then(it => {
                return that._getPantaFieldOptions()
                    .then(its => {
                        return its.reduce((prev, cur) => {
                            prev.appendChild(cur);
                            return prev;
                        }, fields);
                    });
            })
            .then(it => {
                linking.appendChild(fields);
                const field = configuration.mapping.find(it => it.source.isSameAddress(header.address));
                fields.value = field && field.reference ? field.reference : '-1';
                if (isBlank(fields.value)) {
                    fields.value = '-1';
                }
                return linking;
            });
    }

    /**
     * @param {HTMLOptionElement} item
     * @param {HeaderNode} header
     * @param {DataConfiguration} configuration
     * @abstract
     */
    onFieldMappingChange(item, header, configuration) {
    }

    /**
     * @return {Element | any}
     * @protected
     */
    _getActionButton() {
        return this._document.querySelector(`#${this._context === 'import' ? 'btn-import' : 'btn-export'}`);
    }

    /**
     * Create the colorpicker dropdown
     * @param selected
     * @return {HTMLElement | HTMLSelectElement | any}
     * @private
     */
    _createColorPicker(selected = null) {
        const that = this;
        const colorPicker = that._document.createElement('select');
        Object.entries(TRELLO_COLORS).map(it => that._createColorOption(it[0], it[1], selected))
            .forEach(it => colorPicker.appendChild(it));
        return colorPicker;
    }

    /**
     * Create a color option for the dropdown
     * @param color
     * @param value
     * @param selected
     * @return {HTMLElement | HTMLOptionElement | any}
     * @private
     */
    _createColorOption(color, value, selected) {
        const opt = this._document.createElement('option');
        opt.setAttribute('value', value);
        opt.selected = selected === value;
        opt.innerText = color;
        return opt;
    }

    /**
     *
     * @return {PromiseLike<HTMLOptGroupElement>}
     * @protected
     */
    _getTrelloFieldOptions() {
        const that = this;
        const group = this._document.createElement('optgroup');
        group.setAttribute('label', 'Trello.Felder');
        return Promise.resolve(TRELLO_FIELDS.map(it => that._createFieldOption(it.id, __(it.desc), it.type, it.multi))
            .reduce((prev, cur) => {
                prev.appendChild(cur);
                return prev;
            }, group));
    }

    /**
     * Create an option element for the field mappings
     * @param fieldId
     * @param description
     * @param type
     * @param multi if the field can be used multiple times (default is false)
     * @return {HTMLElement | HTMLOptionElement | any}
     * @private
     */
    _createFieldOption(fieldId, description, type, multi) {
        const that = this;
        const option = that._document.createElement('option');
        option.setAttribute('value', fieldId);
        option.innerText = description;
        option.setAttribute('data-type', type || 'text');
        option.setAttribute('data-multi', multi || 'false');
        return option;
    }

    /**
     *
     * @return {PromiseLike<HTMLOptGroupElement>}
     * @protected
     */
    _getPantaFieldOptions() {
        // get the fields from the controllers
        const that = this;
        return this._pluginController.getEnabledModules()
            .then(its => {
                return its.flatMap(it => {
                    const modulename = it.name;
                    const controller = that._clientManager.getController(it.id);
                    return controller.getFields(it)
                        .flatMap(its => {
                            return its.map(it => {
                                const groupId = it.groupId;
                                const subgrp = that._document.createElement('optgroup');
                                subgrp.setAttribute('label', `${modulename}.${it.group}`);
                                return it.fields
                                    .map(it => that._createFieldOption(`${groupId}.${it.id}`, it.label, it.type, 'false'))
                                    .reduce((prev, cur) => {
                                        prev.appendChild(cur);
                                        return prev;
                                    }, subgrp);
                            });
                        });
                });
            });
    }

    /**
     *
     * @return {PromiseLike<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never> | Promise<{group: string, groupId: string, fields: {id: string, desc: string, visible: boolean, type: string, values?: string[]}[]}[][] | never>}
     * @protected
     */
    _getPantaFieldItems() {
        const that = this;
        return this._pluginController.getEnabledModules()
            .then(its => {
                return its.flatMap(it => {
                    const controller = that._clientManager.getController(it.id);
                    return controller.getFields(it);
                });
            });
    }

    /**
     * Clear the content of the settings page completely by removing all child nodes from the
     * container
     * @private
     */
    _clear() {
        this._document.querySelectorAll('.js-content').forEach(it => it.removeChildren());
    }

    /**
     * Clear the mapping content
     * @protected
     */
    _clearContent() {
        this._document.getElementsByClassName("mapping-content").forEach(it => it.removeChildren());
    }

    _showErrors(holder, message) {
        return this._show(holder, holder.querySelectorAll('.error-messages'), message, '#error-message');
    }

    _showWarnings(holder, message) {
        return this._show(holder, holder.querySelectorAll('.warning-messages'), message, '#warning-message');
    }

    _hideWarnings(holder) {
        return this._hide(holder.querySelectorAll('.warning-messages'), '#warning-message');
    }

    _hideErrors(holder) {
        return this._hide(holder.querySelectorAll('.error-messages'), '#error-message');
    }

    _show(holder, container, message, messageId) {
        container.forEach(errorMessageContainer => {
            errorMessageContainer.removeClass('hidden');
            const errorMessage = errorMessageContainer.querySelector(messageId);
            errorMessage.innerHTML = message;
        });
        return container;
    }

    _hide(container, messageId) {
        container.forEach(errorMessageContainer => {
            errorMessageContainer.addClass('hidden');
            const errorMessage = errorMessageContainer.querySelector(messageId);
            errorMessage.innerHTML = '';
        });
        return container;
    }
}