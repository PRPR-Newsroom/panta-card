class ImportController extends AdminController {

    constructor(trello, adminService, document, loggingService) {
        super(trello, adminService, document, loggingService);
        /**
         * @type {File[]}
         * @private
         */
        this._files = [];
    }


    render(previousConfig) {
        this._model = null;
        this._context = 'import';
        const page = createByTemplate(template_admin_import, template_admin_import);
        this._document.querySelectorAll('.js-content').forEach(it => it.appendChild(page));
        this._clearContent();
        return this.renderActions(previousConfig)
            .then(it => {
                // Sample data
                const model = Import.create('Sample', SAMPLE_IMPORT);
                const sample1 = new DataNode(1);
                const header = model.header;
                sample1.set(header.get(0), {v: 'Test Liste', t: 's'});
                sample1.set(header.get(1), {v: 43830, w: '31/12/2019', t: 'n'});
                sample1.set(header.get(2), {v: 'me@m3ns1.com', t: 's'});
                sample1.set(header.get(3), {v: '', t: 'n'});
                sample1.set(header.get(4), {v: 1, t: 'n'});
                sample1.set(header.get(5), {v: 1, t: 'n'});
                sample1.set(header.get(6), {v: 1, t: 'n'});
                sample1.set(header.get(7), {v: 1, t: 'n'});
                sample1.set(header.get(8), {v: 1, t: 'n'});
                sample1.set(header.get(9), {v: 1, t: 'n'});
                sample1.set(header.get(10), {v: 1, t: 'n'});
                sample1.set(header.get(11), {v: 1, t: 'n'});
                sample1.set(header.get(12), {v: 1, t: 'n'});
                sample1.set(header.get(13), {v: 'A cocktail a day', t: 's'});
                sample1.set(header.get(14), {v: 'https://a-cocktail-a-day.com/', t: 's'});
                sample1.set(header.get(15), {v: '3.Begriff', t: 's'});
                sample1.set(header.get(16), {v: '', t: 's'});
                sample1.set(header.get(17), {v: '', t: 's'});
                sample1.set(header.get(18), {v: '', t: 's'});
                sample1.set(header.get(19), {v: '', t: 's'});
                sample1.set(header.get(20), {v: 'Blog zum Thema: Reisen, Lifestyle, Fliegen', t: 's'});
                sample1.set(header.get(21), {v: 'Kristina', t: 's'});
                sample1.set(header.get(22), {v: 'Roder', t: 's'});
                sample1.set(header.get(23), {v: 'Test Notiz', t: 's'});
                sample1.set(header.get(24), {v: 'kristina@a-cocktail-a-day.com', t: 's'});
                sample1.set(header.get(25), {v: 'n.a.', t: 's'});
                sample1.set(header.get(26), {v: '', t: 's'});
                sample1.set(header.get(27), {v: 'Offen für Kooperationen', t: 's'});
                sample1.set(header.get(28), {v: '', t: 's'});
                sample1.set(header.get(29), {v: 'https://facebook.com', t: 's'});
                sample1.set(header.get(30), {v: 'https://instagram.com', t: 's'});
                sample1.set(header.get(31), {v: 'https://twitter.com', t: 's'});
                sample1.set(header.get(32), {v: 'https://youtube.com', t: 's'});
                sample1.set(header.get(33), {v: 'https://flickr.com', t: 's'});
                model.data.push(sample1);
                // that.renderModel(model, previousConfig);
                return true;
            });
    }

    /**
     *
     * @param previousConfiguration
     * @return {Promise<boolean>}
     */
    renderActions(previousConfiguration) {
        const that = this;
        this._document.querySelectorAll(".js-content")
            .forEach(it => {
                it.removeClass("hidden");
                if (it.querySelector("#btn-load")) {
                    it.querySelector("#btn-load").setEventListener('click', function (e) {
                        that._doLoad(e, it, previousConfiguration);
                    });
                }
                if (it.querySelector('#btn-load-config')) {
                    it.querySelector('#btn-load-config').setEventListener('click', (e) => {
                        e.preventDefault();
                        const config = prompt('Bitte gib hier die Konfiguration: ');
                        if (isString(config) && !isBlank(config)) {
                            that._pluginController.parseAdminConfiguration(config)
                                .then(it => {
                                    that.renderModel(that._model, it.configuration);
                                });
                        }
                    });
                }

            });
        const btnImport = that._getActionButton();
        if (btnImport) {
            btnImport.setEventListener('update', e => {
                that.onUpdateActionButton(btnImport);
            });
            btnImport.setEventListener('click', function (e) {
                that._doImport(e);
            });
        }
        return Promise.resolve(true);
    }

    /**
     * @param event
     * @private
     */
    _doImport(event) {
        const that = this;
        // read configuration
        event.preventDefault();
        const button = event.target;
        button.setAttribute('disabled', 'disabled');
        // show progress dialog
        that.progressPage()
            .then(it => {
                if (that._model) {
                    /**
                     * @type {DataConfiguration}
                     */
                    const configuration = that._readConfiguration(that._model);
                    if (configuration.isValid()) {
                        that._adminService.context = it;
                        that._adminService.importCards(that._model, configuration)
                            .then(success => {
                                if (success) {
                                    that._loggingService.i(`Import Datei(en) wurde(n) erfolgreich importiert`);
                                    that._propertyBag['configuration'] = configuration;
                                    that._loggingService.d(`Die Konfiguration wird für zukünftige Imports gespeichert: ${JSON.stringify(that._propertyBag)}`);
                                    return that._pluginController.setAdminConfiguration(that._propertyBag);
                                } else {
                                    that._loggingService.i(`Es konnten nicht alle Import Dateien korrekt importiert werden`);
                                    return Promise.reject(`See log for more details`);
                                }
                            })
                            .then(it => {
                                that._loggingService.d(`Folgende komprimierte Konfiguration wurde gespeichert: (Base64) ${it}`);
                                that.finishProgress(true, 'Dateien werden hochgeladen...');
                            })
                            .catch(it => {
                                that._loggingService.e(`Es trat folgender Fehler auf: ${it.stack}`);
                                that.finishProgress(false, `Es traten Fehler beim Import auf. Ein detaillierter Rapport wurde dieser Trello Card angehängt.`);
                                console.error(it.stack);
                            })
                            .finally(() => {
                                button.removeAttribute('disabled');
                                return that._adminService.getCurrentCard()
                                    .then(card => {
                                        const attachements = that._files.map(it => that._adminService.uploadFileToCard(card, it)
                                            .then(it => {
                                                that.finishProgress(true, `Datei «${it.name}» hochgeladen`);
                                            }));
                                        return Promise.all(attachements)
                                            .then(its => {
                                                return card;
                                            });
                                    })
                                    .then(card => {
                                        that._files = [];
                                        const file = that._loggingService.flush("import.log");
                                        return that._adminService.uploadFileToCard(card, file)
                                            .then(it => {
                                                that.finishProgress(true, `Datei «${it.name}» hochgeladen`);
                                            });
                                    })
                                    .then(it => {
                                        that.closeProgress(true);
                                    })
                                    .catch(err => {
                                        console.error(`Fehler beim Hochladen der Datei(en)`, err);
                                        that._showErrors(document, `Fehler beim Hochladen der Datei(en)`);
                                        that.closeProgress(false);
                                    });
                            });
                    } else {
                        const validations = configuration.getValidationErrors();
                        const errors = validations.join('<br/>');
                        that._showWarnings(document, `Die Konfiguration ist unvollständig. Bitte korrigieren sie die Konfiguration und versuchen sie es erneut.<br/>${errors}`);
                    }
                }
            });
    }

    /**
     * @param event
     * @param {HTMLElement} container
     * @param {DataConfiguration} previousConfiguration
     * @private
     */
    _doLoad(event, container, previousConfiguration) {
        const that = this;
        event.preventDefault();
        const button = event.target;
        that._hideErrors(container);
        that._hideWarnings(container);
        button.disabled = true;
        that.progressPage()
            .then(it => {
                const files = that._document.querySelector("#file-import").files;
                try {
                    that.updateProgress(0, files.length, 'Datei(en) eingelesen', `Datei(en) werden eingelesen`);
                    that._adminService.load(files)
                        .then(imports => {
                            imports.forEach((it, index) => {
                                that._files.push(it.file);
                                that.renderModel(it.model, previousConfiguration);
                                that.updateProgress(index, files.length, 'Datei(en) eingelesen', `Datei «${it.file.name}» geladen`);
                            });
                        })
                        .catch(err => {
                            that._showErrors(it, `Unerwarteter Fehler beim Einlesen der Datei «${err.name}»`);
                            that.finishProgress(false, `Fehler beim Einlesen`);
                        })
                        .finally(() => {
                            button.disabled = false;
                            that.finishProgress(true, 'Fertig');
                        });
                } catch (ex) {
                    that._showErrors(it, `Schwerwiegender Fehler beim Einlesen: ${ex}`);
                    button.disabled = false;
                    that.finishProgress(false, 'Fehler beim Einlesen');
                } finally {
                    that.endProgress();
                }
            });
    }


    /**
     * @param {Import} model
     * @param {DataConfiguration} previousConfiguration
     */
    renderModel(model, previousConfiguration) {
        const that = this;
        that._clearContent();
        if (!model) {
            return;
        }
        this._document.getElementsByClassName("mapping-content-header").forEach(it => {
            it.removeClass("hidden");
        });
        const all = [];
        this._document.getElementsByClassName("mapping-content").forEach(container => {
            container.removeClass('hidden');
            Object.entries(model.getNormalizedHeaders()).forEach(entry => {
                const header = entry[1];
                const row = that._document.createElement('div');
                row.addClass('row space full');

                all.push(that._createChipsSection(header, previousConfiguration)
                    .then(it => {
                        row.appendChild(it);
                        return that._createFieldMappingSection(header, previousConfiguration);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createPreviewSection(header, model, previousConfiguration);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createMore(header);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return row;
                    })
                    .then(it => {
                        container.appendChild(it);
                        return Array.from(it.querySelectorAll('select').values());
                    })
                    .then(its => {
                        that._model = model;
                        // update the "more" action elements
                        its.forEach(it => {
                            it.dispatchEvent(new Event('change'));
                        });
                        return Array.from(row.querySelectorAll('.js-preview').values());
                    })
                    .then(its => {
                        // update the preview sections
                        its.forEach(it => {
                            // it.dispatchEvent(new Event('update'));
                        });
                        return container;
                    })
                    .then(it => {
                        // that._getActionButton().dispatchEvent(new Event("update"));
                        return it;
                    })
                );

            });
        });

    }

    /**
     * @param {HTMLOptionElement} item
     * @param {HeaderNode} header
     * @param {DataConfiguration} configuration
     */
    onFieldMappingChange(item, header, configuration) {
        if (item === null) {
            console.debug(`onFieldMapping with null`);
            return;
        }
        const that = this;
        const address = header.getAddressAsText();
        const more = that._document.querySelector(`#more-${address}`);
        const event = new Event('update');
        more.removeChildren();
        if (item.getAttribute('value') === 'trello.labels') {

            configuration.setColorByHeader(header)
                .then(it => {
                    const colorPicker = that._createColorPicker(it);
                    colorPicker.setEventListener('change', e => {
                        const item = e.target.item(e.target.selectedIndex);
                        const color = item.getAttribute('value');
                        const lastchip = that._document.querySelector(`#chip-${address}-last`);
                        lastchip.removeClassByPrefix('panta-bgcolor-');
                        if (color != null) {
                            lastchip.addClass(`panta-bgcolor-${color}`);
                        }
                        // set the new color on the header
                        header.color = color;
                    });
                    more.appendChild(colorPicker);
                });
        }
        // dispatch update event to update the preview section
        const multi = item.getAttribute('data-multi') === 'true';
        event.item = this._createFieldOfType(item.getAttribute('data-type'), header, item.value, multi);
        that._document.querySelector(`#preview-${address}`).dispatchEvent(event);
        // update the action button
        that._getActionButton().dispatchEvent(event);
    }


}