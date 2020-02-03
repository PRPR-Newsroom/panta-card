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
                return that._adminService.getLabels()
                    .then(its => {
                        config.export_configuration.labels = its;
                    });
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
                config.export_configuration.mapping
                return that.renderActions(config)
                    .then(() => {
                        return that.renderModel(model, config.export_configuration);
                    });
            });
    }

    renderModel(model, config) {
        const that = this;
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
                        return that._createPreviewSection(header, model, config);
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
                // TODO start progress
                that.progressPage()
                    .then(it => {
                        return that._doExport();
                    })
                    .then(it => {
                        that.finishProgress(true);
                    })
                    .finally(() => {
                        that.endProgress();
                    });
            });
            actionButton.setEventListener('update', e => {
                that.onUpdateActionButton(actionButton);
            });
        }

        return Promise.resolve(true);
    }

    _doExport() {
        const that = this;
        // read the data row by row
        // get all cards on this board
        const config = that._readConfiguration(that._model);
        const mapping = new ExportFieldMapping(this._trello, this._adminService, this._getPantaFieldItems());
        return that._adminService.getBoardCards()
            .then(cards => {

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
                return Promise.resolve(Object.values(that._model.getNormalizedHeaders()).map(it => {
                    return config.findByAddress(it.address);
                })).then(fields => {
                    return Promise.all(fields.flatMap(field => {
                        if (field.multi && field.reference === 'trello.labels') {
                            return that._adminService.getLabels()
                                .then(its => {
                                    return its.map(it => {
                                        return new BooleanField(it.name, field.reference, field.source, true);
                                    });
                                });
                        } else {
                            return Promise.all([field]);
                        }
                    }));
                }).then(its => its.flat())
                    .then(fields => {
                        return Promise.all(cards.map(card => {
                            return Promise.all(fields.filter(it => it != null).map(field => {
                                return mapping.map(card, field);
                            }));
                        }));
                    })
                    .reduce((prev, cur, index) => {
                        const node = new DataNode(index + 1);
                        cur.forEach(it => {
                            node.set(null, it);
                        });
                        prev.push(node);
                        return prev;
                    }, [])
                    .then(rows => {
                        that._model.data = rows;
                        // TODO headers must be extended with dynamic labels
                        const binary = that._adminService.excelService.write(that._model);
                        that._adminService.getCurrentCard()
                            .then(it => {
                                return that._adminService.uploadFileToCard(it, binary);
                            });
                    });
            });
    }

    /**
     * @param {Import} model
     * @return {Promise<HeaderNode[]>}
     * @private
     */
    _getTemplate(model) {
        return Promise.all([this._getTrelloHeaders(model.header), this._getPantaHeaders(model.header)])
            .then(its => {
                return its.flat();
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
    _getPantaHeaders(root) {
        const that = this;
        let column = root.children.length;
        const row = root.address.r;
        return this._getPantaFieldItems()
            .then(its => {
                return Promise.all(its
                    .flat()
                    .flatMap(it => {
                        return it.fields.map(field => {
                            const group = it.group;
                            return that._pluginController.findPluginModuleConfigByModuleId(it.moduleId)
                                .then(config => {
                                    return new HeaderNode(root, `${config.name}.${group}.${field.label}`, {c: column++, r: row});
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

    _createMore(header) {
        // TODO for export it must be possible to override the header column label
        return super._createMore(header);
    }
}