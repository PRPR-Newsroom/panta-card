class ExportController extends AdminController {

    constructor(trello, document, adminService, loggingService) {
        super(trello, adminService, document, loggingService);
    }

    render(config) {
        const that = this;
        this._model = null;
        const page = createByTemplate(template_admin_export, template_admin_export);
        this._document.querySelectorAll('.js-content').forEach(it => it.appendChild(page));
        this._clearContent();
        return this._pluginController.getEnabledModules()
        // load the current card plugin data
            .then(its => {
                return Promise.all(its.map(it => {
                    return that._adminService.getCurrentCard()
                        .then(card => {
                            return that._clientManager.getController(it.id).fetchByCard(card, it);
                        })
                }));
            })
            .then(() => {
                const model = Import.create('Export');
                model.header = new HeaderNode(null, 'Root', {c: -1, r: -1, constant: 'Virtual Node'});
                return that._getTemplate(model)
                    .then(its => {
                        model.header.addAll(its);
                        return model;
                    })
            })
            .then((model) => {
                // TODO create default mapping header <-> field
                return that.renderActions(config)
                    .then(() => {
                        return that.renderModel(model, config.export_configuration);
                    });
            });
    }

    renderModel(model, config) {
        const that = this;
        console.debug('renderModel with config', config);
        that._clearContent();
        this._document.getElementsByClassName("mapping-content-header").forEach(it => {
            it.removeClass("hidden");
        });

        // the model contains the structure
        this._document.getElementsByClassName("mapping-content").forEach(container => {
            container.removeClass('hidden');
            Object.values(model.getNormalizedHeaders()).map(header => {
                const row = that._document.createElement('div');
                row.addClass('row space full');
                return that._createChipsSection(header)
                    .then(it => {
                        row.appendChild(it);
                        return that._createFieldMappingSection(header, config);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createPreviewSection(header, model, config, 3);
                    })
                    .then(it => {
                        row.appendChild(it);
                        return that._createMore(header, config);
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
                        its.forEach(it => {
                            it.dispatchEvent(new Event('change'));
                        });
                        return Array.from(row.querySelectorAll('.js-preview').values());
                    })
                    .then(its => {
                        its.forEach(it => {
                            it.dispatchEvent(new Event('update'));
                        });
                        return container;
                    })
            });
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
            });

        const actionButton = that._getActionButton();
        if (actionButton) {
            actionButton.setEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                e.target.disabled = true;
                that.progressPage()
                    .then(it => {
                        that._loggingService.i(`Export um ${new Date()} gestartet`);
                        return that._doExport(it);
                    })
                    .catch(reason => {
                        that._loggingService.e(`Ein Fehler beim Exportieren des Boards ist aufgetreten: ${reason.stack}`);
                        that.finishProgress(false, `Es traten Fehler beim Export auf. Ein detaillierter Rapport wurde dieser Trello Card angehängt.`);
                        console.error(reason.stack);
                    })
                    .then(it => {
                        that._loggingService.i(`Export erfolgreich abgeschlossen`);
                        that.finishProgress(true, 'Fertig');
                    })
                    .finally(() => {
                        // that.endProgress();
                        e.target.disabled = false;
                        return that._adminService.getCurrentCard()
                            .then(card => {
                                const file = that._loggingService.flush();
                                return that._adminService.uploadFileToCard(card, file);
                            })
                            .then(it => {
                                that.closeProgress(true);
                            })
                            .catch(err => {
                                console.error(`Konnte Datei(en) nicht hochladen`, err);
                                that._showErrors(document, `Konnte Datei(en) nicht hochladen`);
                                that.closeProgress(false);
                            })
                    });
            });
            actionButton.setEventListener('update', e => {
                that.onUpdateActionButton(actionButton);
            });
        }

        return Promise.resolve(true);
    }


    /**
     * @param {HTMLOptionElement} item
     * @param {HeaderNode} header
     */
    onFieldMappingChange(item, header) {
        if (item === null) {
            return;
        }
        const that = this;
        const address = header.getAddressAsText();
        const more = that._document.querySelector(`#more-${address}`);
        const event = new Event('update');
        more.removeChildren();

        if (item.getAttribute('value') === 'trello.labels') {
            // labels are added dynamically and thus cannot be overridden
            const hint = that._document.createElement('p');
            // TODO externalize
            hint.setAttribute('title', 'Labels werden dynamisch anhand den verfügbaren Board Labels erstellt.');
            hint.innerHTML = `<i>Dynamisch erstellt</i>`;
            more.appendChild(hint);
            return null;
        }
        const renamer = that._document.createElement('input');
        renamer.setAttribute('id', `renamer-${header.address.r}-${header.address.c}`)
        renamer.setAttribute('type', 'text');
        const lastchip = that._document.querySelector(`#chip-${address}-last > p`);
        const saved = header.properties.find(it => it.hasOwnProperty('name'));
        renamer.value = saved ? saved.name : lastchip.innerText;
        renamer.addClass(saved && saved.name !== lastchip.innerText ? 'overridden-value' : 'default-value');
        more.appendChild(renamer);
        that._getActionButton().dispatchEvent(event);

    }

    _doExport(progress) {
        const that = this;
        // read the data row by row
        // get all cards on this board
        const config = that._readConfiguration(that._model);
        that._loggingService.d('Konfiguration für den Export: ' + JSON.stringify(config));
        if (config.isValid()) {
            const mapper = new ExportFieldMapping(this._trello, this._adminService, this._getPantaFieldItems());
            return that._adminService.getBoardCards()
                .then(cards => {
                    // load the content of all cards
                    return that._pluginController.getEnabledModules()
                        .then(its => {
                            return its.flatMap(it => {
                                const controller = that._clientManager.getController(it.id);
                                return cards.map(card => {
                                    return controller.fetchByCard(card, it)
                                        .then(it => {
                                            controller.insert(it, card);
                                            return it;
                                        });
                                });
                            });
                        })
                        .then(() => {
                            return cards;
                        });
                })
                .then(cards => {
                    progress.each.apply(that, [0, cards.length, 'Einträge exportiert...', '0.00%']);
                    return Promise.resolve(Object.values(that._model.getNormalizedHeaders()).map(it => {
                        return config.findByAddress(it.address);
                    })).then(fields => {
                        return Promise.all(fields.flatMap(field => {
                            if (field.multi && field.reference === 'trello.labels') {
                                return that._adminService.getLabels()
                                    .then(its => {
                                        // reverse is necessary because otherwise the order in the model must be the same as the
                                        // fields returned here in this 'then' block
                                        its.reverse().forEach((it, index) => {
                                            if (index > 0) {
                                                const labeledHeader = new HeaderNode(field.source.parent, `${it.name}`, {
                                                    c: field.source.address.c + 1000 + index,
                                                    r: field.source.address.r
                                                }, null, it.color);
                                                that._model.insertAt(field.source, labeledHeader);
                                            } else {
                                                // rename first label
                                                that._model.getHeader(field.source.address).label = it.name;
                                                that._model.getHeader(field.source.address).color = it.color;
                                            }
                                        });
                                        return its;
                                    })
                                    .then(its => {
                                        return its.map(it => {
                                            return new BooleanField(it.name, field.reference, it, true);
                                        });
                                    });
                            } else {
                                /**
                                 * @type {HeaderNode}
                                 */
                                const header = that._model.getHeader(field.source.address);
                                // override label of model.header with user input
                                const renamer = that._document.querySelector(`#renamer-${header.address.r}-${header.address.c}`);
                                header.label = renamer && !isBlank(renamer.value) ? renamer.value : header.label;
                                config.findByAddress(field.source.address).name = header.label;
                                return Promise.all([field]);
                            }
                        }));
                    })
                        .then(its => its.flat())
                        .then(fields => {
                            return Promise.all(cards.map(card => {
                                const cardfields = fields.filter(it => it != null);
                                that._loggingService.i(`Trello Card «${card.name}» wird mit den Feldern ${JSON.stringify(cardfields)} exportiert`);
                                return Promise.all(cardfields
                                    .map(field => {
                                        return mapper.map(card, field);
                                    }));
                            }));
                        })
                        .reduce((prev, cur, index) => {
                            const node = new DataNode(index + 1);
                            cur.forEach(it => {
                                node.set(null, it);
                            });
                            prev.push(node);

                            const percent = Math.min(((index + 1.0) / Math.max(1.0, cards.length)) * 100, 100.0);
                            const details = `${percent.toFixed(2)}%`;
                            progress.each.apply(that, [index + 1, cards.length, 'Einträge exportiert...', details]);

                            return prev;
                        }, [])
                        .then(rows => {
                            that._model.data = rows;
                            return that._adminService.getCurrentBoard()
                                .then(board => {
                                    const filename = `Export ${board.name}`;
                                    that._loggingService.i(`${rows.length} Einträge in die Export-Datei «${filename}» exportiert`);
                                    const binary = that._adminService.excelService.write(that._model, filename);
                                    return that._adminService.getCurrentCard()
                                        .then(it => {
                                            return that._adminService.uploadFileToCard(it, binary);
                                        });
                                });
                        });
                })
                .then(it => {
                    console.debug('Saving configuration', config);
                    that._propertyBag['export_configuration'] = config;
                    that._loggingService.d(`Die Konfiguration wird für zukünftige Exports gespeichert: ${JSON.stringify(config)}`);
                    return that._pluginController.setAdminConfiguration(that._propertyBag);
                });
        } else {
            const validations = config.getValidationErrors();
            const errors = validations.join('<br/>');
            that._showWarnings(document, `Die Konfiguration ist unvollständig. Bitte korrigieren sie die Konfiguration und versuchen sie es erneut.<br/>${errors}`);
        }
    }

    /**
     * @param {Import} model
     * @return {Promise<HeaderNode[]>}
     * @private
     */
    _getTemplate(model) {
        const that = this;
        return this._getTrelloHeaders(model.header)
            .then(its => {
                return that._getPantaHeaders(model.header, its.length, 1)
                    .then(pantas => {
                        return its.concat(pantas);
                    });
            });
    }

    /**
     * @param root
     * @return {Promise<HeaderNode[]>}
     * @private
     */
    _getTrelloHeaders(root) {
        return Promise.resolve(TRELLO_FIELDS.map((it, index) => {
            return new HeaderNode(root, __(it.desc), {c: index, r: 1});
        }));
    }

    /**
     *
     * @param root
     * @return {PromiseLike<HeaderNode[] | never> | Promise<HeaderNode[] | never>}
     * @private
     */
    _getPantaHeaders(root, column, row) {
        const that = this;
        return this._getPantaFieldItems()
            .then(its => {
                return Promise.all(its
                    .flat()
                    .flatMap(it => {
                        return it.fields.map(field => {
                            const group = it.group;
                            return that._pluginController.findPluginModuleConfigByModuleId(it.moduleId)
                                .then(config => {
                                    // const first = new HeaderNode(root, config.name, {c: column++, r: row});
                                    // const second = new HeaderNode(first, group, {c: column, r: row});
                                    // const last = new HeaderNode(second, field.label, {c: column, r: row});
                                    // return last;
                                    return new HeaderNode(root, `${config.name}.${group}.${field.label}`, {
                                        c: column++,
                                        r: row
                                    });
                                });
                        });
                    }));
            })
    }

    /**
     * Clear the mapping content
     * @private
     */
    _clearContent() {
        this._document.getElementsByClassName("mapping-content").forEach(it => it.removeChildren());
    }

    /**
     * @param {HeaderNode} header
     * @param {DataConfiguration} config
     * @param {number} columns
     * @return {HTMLElement | HTMLDivElement | any}
     * @protected
     */
    _createMore(header, config = null, columns = 3) {
        // TODO for export it must be possible to override the header column label
        const field = config.findByAddress(header.address);
        if (field && isBlank(field.name)) {
            header.put({'name': field.name});
        }
        return super._createMore(header, config, columns);
    }
}