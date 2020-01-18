class AdminService {
    /**
     * @param {{each: function, done: function}} value
     */
    set context(value) {
        this._context = value;
    }

    get context() {
        return this._context;
    }

    /**
     * @param {TrelloClient} trelloClient
     * @param {LoggingService} loggingService
     */
    constructor(trelloClient, loggingService) {
        this.trelloClient = trelloClient;
        /**
         * @type {FileReader}
         */
        this.fileReader = new FileReader();
        this.clientManager = ClientManager.getInstance(window);
        this.articleController = this.clientManager.getArticleController();
        this.planController = this.clientManager.getPlanController();
        this.moduleController = this.clientManager.getModuleController();
        this.excelService = this.clientManager.getExcelService();
        /**
         * @type {LoggingService}
         * @private
         */
        this._loggingService = loggingService;
        /**
         * @type {{each: function, done: function}}
         * @private
         */
        this._context = null;
    }

    hasLabel(label, color) {
        return this.trelloClient.getLabels()
            .map(it => it.name === label && it.color === color)
            .reduce((prev, cur) => prev | cur);
    }

    /**
     * @param {FileList} files
     * @return {PromiseLike<T>|Promise<T>}
     */
    load(files) {
        const that = this;
        const importers = [];
        if (files.length > 0) {
            for (let index = 0; index < files.length; index++) {
                importers.push(new Promise(function (resolve, reject) {
                    /**
                     * @type {File}
                     */
                    const file = files.item(index);
                    that._loggingService.i(`Processing file ${file.name}`);
                    that.fileReader.onload = function (e) {
                        that._loadContent(e.target.result)
                            .then(model => {
                                if (model) {
                                    that._loggingService.i(`File ${file.name} loaded successfully`);
                                    resolve({
                                        'file': file,
                                        'model': model
                                    });
                                } else {
                                    that._loggingService.i(`Fehler beim Einlesen der Datei «${file.name}»`);
                                    reject(`Fehler beim Einlesen der Datei «${file.name}»`);
                                }
                            });
                    };
                    window.setTimeout(() => {
                        that.fileReader.readAsArrayBuffer(file);
                    }, 10);
                }));
            }
        }
        return importers.length === 0 ? Promise.reject('No imports') : Promise.all(importers);
    }

    getCurrentCard() {
        return this.trelloClient.getCurrentCard();
    }

    /**
     * @param {{id: string}} card
     * @param {File} file
     * @return {Promise<Blob>}
     */
    uploadFileToCard(card, file) {
        const that = this;

        return that.trelloClient.getCurrentMember()
            .then(it => that.trelloClient.attachFile(card, file, it.username));
    }

    /**
     * @param content
     * @return {Promise<Import>}
     * @private
     */
    _loadContent(content) {
        return Promise.resolve(this.excelService.read(content));
    }

    /**
     * @param {Import} model
     * @param {ImportConfiguration} configuration
     * @return {Promise<any>}
     */
    importCards(model, configuration) {
        const that = this;
        // create all labels beforehand
        return that.trelloClient.createLabels(this._getLabels(configuration))
            .then(its => {
                that._loggingService.d(`Die Labels (${its.map(it => it.name).join(',')}) sind nun verfügbar`);
                configuration.labels = its;
                return that._importCard(model, 0, configuration);
            });
    }

    /**
     * Import the data at index and when the import was successful it will proceed to the next one
     * @param {Import} model
     * @param index
     * @param {ImportConfiguration} configuration
     * @return {Promise<boolean>}
     * @private
     */
    _importCard(model, index, configuration) {
        const that = this;
        if (index < model.data.length) {
            return that._createCard(model.data[index], configuration)
                .then((it) => {
                    return new Promise(function (resolve, reject) {
                        const percent = Math.min(((index+1.0)/Math.max(1.0, model.data.length))*100, 100.0);
                        const progress = `${percent.toFixed(2)}%`;
                        that.context.each.apply(that.context.context, [index+1, model.data.length, progress]);
                        resolve(that._importCard(model, index + 1, configuration));
                    });
                });
        } else {
            // TODO update process on UI and close
            this._loggingService.d(`Insgesamt wurden ${this.trelloClient.requests} Anfragen an Trello geschickt`);
            return Promise.resolve(true);
        }
    }

    /**
     *
     * @param {DataNode} data
     * @param {ImportConfiguration} configuration
     * @return {Promise<T>}
     * @private
     */
    _createCard(data, configuration) {
        const that = this;
        const listname = data.get(that._getList(configuration).source).value.v;
        return that.trelloClient.findListByName(listname)
            .reduce((prev, cur) => prev || cur, null)
            .then(list => {
                if (list == null) {
                    that._loggingService.i(`Liste «${listname}» wird erstellt`);
                    return that.trelloClient.createList(listname)
                        .then(list => {
                            return that._createCardInternal(list, data, configuration);
                        });
                } else {
                    that._loggingService.i(`Liste «${listname}» exisitert bereits`);
                    return that._createCardInternal(list, data, configuration);
                }
            })
            .catch(reason => {
                that._loggingService.e(`Fehler beim Importieren in die Liste «${listname}» (${reason})`);
                return false;
            });
    }

    /**
     * @param {{id: string}} list
     * @param {DataNode} data
     * @param {ImportConfiguration} configuration
     * @return {Promise<any>}
     * @private
     */
    _createCardInternal(list, data, configuration) {
        const that = this;
        const labels = configuration.labels
            .filter(label => {
                return configuration.get('trello.labels')
                    .filter(it => label.name === it.name)
                    .filter(it => it.getValue(data.get(it.source))).length === 1;
            });

        // trello fields
        const title = this._getFieldValue(data, "trello.title", configuration);
        const desc = this._getFieldValue(data, "trello.description", configuration);
        const frist = this._getFieldValue(data, 'trello.duedate', configuration);
        const members = this._getFieldValue(data, 'trello.members', configuration) || [];


        return that.trelloClient.findCardByTitle(title, list)
            .then(it => {
                if (it) {
                    that._loggingService.i(`Trello Card «${title}» ist bereits in «${list.id}» vorhanden`);
                    // CHECKME update description, due date etc.? this is not MVP
                    return it;
                } else {
                    const searches = members.map((it, index, arr) => {
                        // trelloClient
                        return that.trelloClient.searchMember(it)
                            .catch(reason => {
                                that._loggingService.e(`Mitglied für «${it}» nicht gefunden (${reason})`);
                                return [];
                            });
                    }).reduce((prev, cur) => {
                        prev.push(cur);
                        return prev;
                    }, []);
                    return Promise.all(searches)
                        .then(its => {
                            return its.flatMap(it => it);
                        })
                        .then(its => {
                            // if there's an error it must abort this record completely thus do not catch it here
                            return that.trelloClient.createCard(title, desc, list.id,
                                labels.map(it => it.id).join(','),
                                isBlank(frist) ? null : frist.toISOString(),
                                its.map(it => it.id).join(','));
                        });
                }
            })
            .then(card => {
                return Promise.resolve([])
                    .then((result) => {
                        return that._doImportArtikel(data, configuration, card)
                            .then(it => {
                                result.push({
                                    'id': ArtikelController.ID,
                                    'card': title,
                                    'success': !!it
                                });
                                return result;
                            });
                    })
                    .then((result) => {
                        return that._doImportPlan(data, configuration, card)
                            .then(it => {
                                result.push({
                                    'id': ModulePlanController.ID,
                                    'card': title,
                                    'success': !!it
                                });
                                return result;
                            });
                    })
                    .then((result) => {
                        return that._doImportBeteiligt(data, configuration, card)
                            .then(it => {
                                result.push({
                                    'id': ModuleController.ID,
                                    'card': title,
                                    'success': !!it
                                });
                                return result;
                            });
                    });
            });
    }

    /**
     * Import Plan if the module is enabled
     * @param data
     * @param {ImportConfiguration} configuration
     * @param {{id: string}} card
     * @return {PromiseLike<T | never> | Promise<T | never>}
     * @private
     */
    _doImportPlan(data, configuration, card) {
        const that = this;
        return that.clientManager.isPlanModuleEnabled()
            .then(enabled => {
                if (enabled) {
                    const visual = that._getFieldValue(data, "module.plan.visual", configuration);
                    const form = that._getFieldValue(data, "module.plan.form", configuration);
                    const online = that._getFieldValue(data, "module.plan.online", configuration);
                    const season = that._getFieldValue(data, "module.plan.season", configuration);
                    const region = that._getFieldValue(data, "module.plan.region", configuration);
                    const place = that._getFieldValue(data, "module.plan.place", configuration);
                    const fielda = that._getFieldValue(data, "module.plan.field.a", configuration);
                    const fieldb = that._getFieldValue(data, "module.plan.field.b", configuration);
                    const fieldg = that._getFieldValue(data, "module.plan.field.g", configuration);
                    return that.clientManager.getModuleConfiguration(ModulePlanController.ID)
                        .then(it => {
                            return new Plan(null,
                                fielda, fieldb, 0, 0, 0, 0, fieldg, 0,
                                it.getEditableOptionValue('visual', visual),
                                it.getEditableOptionValue('form', form),
                                it.getEditableOptionValue('online', online),
                                it.getEditableOptionValue('season', season),
                                it.getEditableOptionValue('region', region),
                                it.getEditableOptionValue('place', place));
                        })
                        .then(plan => {
                            that._loggingService.d(`Plan wird angelegt in Card «${card.id}»`);
                            that._loggingService.t(`>> ${JSON.stringify(plan)}`);
                            return that.planController.persist(plan, card.id)
                                .then(() => {
                                    that._loggingService.i(`Plan erstellt in Trello Card «${card.id}»`);
                                    return plan;
                                });
                        });
                } else {
                    that._loggingService.d('Plan Module ist deaktiviert');
                    return false;
                }
            })
            .catch(ex => {
                that._loggingService.e(`Fehler beim Speichern von Plan in Card «${card.id}» (${ex})`);
                return false;
            });
    }

    /**
     * Import the Artikel if the module is enabled
     * @param data
     * @param {ImportConfiguration} configuration
     * @param {{id: string}} card
     * @return {PromiseLike<T | never> | Promise<T | never>}
     * @private
     */
    _doImportArtikel(data, configuration, card) {
        const that = this;
        return that.clientManager.isArticleModuleEnabled()
            .then(enabled => {
                if (enabled) {
                    const fielda = that._getFieldValue(data, "module.artikel.field.a", configuration);
                    const fieldb = that._getFieldValue(data, "module.artikel.field.b", configuration);
                    const fieldc = that._getFieldValue(data, "module.artikel.field.c", configuration);
                    const text = that._getFieldValue(data, "module.artikel.field.d", configuration);
                    const fielde = that._getFieldValue(data, "module.artikel.field.e", configuration);
                    const fieldf = that._getFieldValue(data, "module.artikel.field.f", configuration);

                    // these fields are enums
                    const online = that._getFieldValue(data, 'module.artikel.online', configuration);
                    const visual = that._getFieldValue(data, 'module.artikel.visual', configuration);
                    const region = that._getFieldValue(data, 'module.artikel.region', configuration);
                    const season = that._getFieldValue(data, 'module.artikel.season', configuration);
                    const form = that._getFieldValue(data, 'module.artikel.form', configuration);
                    const place = that._getFieldValue(data, 'module.artikel.place', configuration);

                    return that.clientManager.getModuleConfiguration(ArtikelController.ID)
                        .then(it => {
                            return new Artikel(null,
                                fielda, fielde, fieldb, fieldf, 1,
                                it.getEditableOptionValue('online', online),
                                it.getEditableOptionValue('visual', visual),
                                it.getEditableOptionValue('region', region),
                                it.getEditableOptionValue('season', season),
                                fieldc, text,
                                it.getEditableOptionValue('form', form), place);
                        })
                        .then(it => {
                            that._loggingService.d(`Artikel wird angelegt in Card «${card.id}»`);
                            that._loggingService.t(`>> ${JSON.stringify(it)}`);
                            return that.articleController.persist(it, card.id)
                                .then(() => {
                                    that._loggingService.i(`Artikel erstellt in Trello Card «${card.id}»`);
                                    return it;
                                });
                        });
                } else {
                    that._loggingService.d('Artikel Module ist deaktiviert');
                    return false;
                }
            })
            .catch(ex => {
                that._loggingService.e(`Fehler beim Speichern des Artikels in Card «${card.id}» (${ex})`);
                return false;
            });
    }

    /**
     * Import the beteiligt record
     * @param data
     * @param configuration
     * @param card
     * @return {PromiseLike<T | never> | Promise<T | never>}
     * @private
     */
    _doImportBeteiligt(data, configuration, card) {
        const that = this;
        return that.clientManager.isBeteiligtModuleEnabled()
            .then(enabled => {
                if (enabled) {
                    // get the section depending on the configured layout
                    return that.clientManager.getModuleConfiguration(ModuleController.ID)
                        .then(config => {
                            const module = ModuleConfig.create({}, null);
                            const sections = {
                                'onsite': config.getEditableLayout('onsite').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('onsite').layout, it)] = that._getFieldValue(data, `module.beteiligt.onsite.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {}),
                                'text': config.getEditableLayout('text').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('text').layout, it)] = that._getFieldValue(data, `module.beteiligt.text.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {}),
                                'photo': config.getEditableLayout('photo').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('photo').layout, it)] = that._getFieldValue(data, `module.beteiligt.photo.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {}),
                                'video': config.getEditableLayout('video').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('video').layout, it)] = that._getFieldValue(data, `module.beteiligt.video.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {}),
                                'illu': config.getEditableLayout('illu').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('illu').layout, it)] = that._getFieldValue(data, `module.beteiligt.illu.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {}),
                                'ad': config.getEditableLayout('ad').fields.map(it => {
                                    const obj = {};
                                    obj[BeteiligtBinding.getFieldMapping(config.getEditable('ad').layout, it)] = that._getFieldValue(data, `module.beteiligt.ad.${it.id}`, configuration);
                                    return obj;
                                }).reduce(Reducers.asKeyValue, {})
                            };
                            module.sections = sections;
                            that._loggingService.d(`Beteiligt wird angelegt in Card «${card.id}»`);
                            that._loggingService.t(`>> ${JSON.stringify(module)}`);
                            return that.moduleController.persist(module, card.id)
                                .then(() => {
                                    that._loggingService.i(`Beteiligt erstellt in Trello Card «${card.id}»`);
                                    return true;
                                });
                        });

                } else {
                    return false;
                }
            })
            .catch(ex => {
                that._loggingService.e(`Fehler beim Speichern von Beteiligt in Card «${card.id}» (${ex})`);
            });
    }

    /**
     * @param name
     * @param {ImportConfiguration} configuration
     * @return {AbstractField}
     * @private
     */
    _getField(name, configuration) {
        return configuration.single(name);
    }

    /**
     * @param {ImportConfiguration} configuration
     * @return {AbstractField[]} all trello label fields
     * @private
     */
    _getLabels(configuration) {
        return configuration.get('trello.labels');
    }

    /**
     *
     * @param {ImportConfiguration} configuration
     * @return {AbstractField} all trello list fields
     * @private
     */
    _getList(configuration) {
        return configuration.single('trello.list');
    }

    /**
     *
     * @param {DataNode} data
     * @param name
     * @param {ImportConfiguration} configuration
     * @return {null}
     * @private
     */
    _getFieldValue(data, name, configuration) {
        /**
         * @type {AbstractField}
         */
        const field = this._getField(name, configuration);
        return field && data.get(field.source) ? field.getValue(data.get(field.source)) : null;
    }

}