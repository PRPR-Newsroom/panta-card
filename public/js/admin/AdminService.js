class AdminService {

    constructor(trello) {
        if (!window.hasOwnProperty("Trello")) {
            throw "Trello not correctly loaded";
        }
        this.trello = trello;
        /**
         * @type {FileReader}
         */
        this.fileReader = new FileReader();
        this.clientManager = ClientManager.getInstance(window);
        this.articleController = this.clientManager.getArticleController();
        this.planController = this.clientManager.getPlanController();
        this.moduleController = this.clientManager.getModuleController();
        this.excelService = this.clientManager.getExcelService();
    }

    hasLabel(label, color) {
        return this.getLabels()
            .map(it => it.name === label && it.color === color)
            .reduce((prev, cur) => prev | cur);
    }

    createLabel(label, color) {
        const that = this;
        return that._createLabel(label, color);
    }

    getCurrentCard() {
        const that = this;
        return that.trello.card('id');
    }

    /**
     *
     * @return {Promise<string>}
     */
    withTrelloToken() {
        const that = this;
        return that.trello.getRestApi()
            .getToken()
            .then(it => {
                console.debug(`trello token is ${it}`);
                if (it) {
                    return {token: it, key: that.trello.getRestApi().appKey};
                } else {
                    console.debug(`authorize app with key=${that.trello.getRestApi().appKey}`);
                    // return that.trello.getRestApi().authorize({
                    //     expiration: 'never',
                    //     scope: 'read,write'
                    // }).then(it => {
                    //     return {token: it, key: that.trello.getRestApi().appKey};
                    // }).catch(it => {
                    //     console.error(`Got error ${it}`);
                    //     that.trello.getRestApi().clearToken();
                    //     throw 'Unauthorized';
                    // });
                    return new Promise(function (resolve, reject) {
                        window.Trello.authorize({
                            expiration: 'never',
                            scope: {
                                read: 'true',
                                write: 'true'
                            },
                            success: () => {
                                console.debug(`Auth success`);
                                resolve(true);
                            },
                            error: () => {
                                console.error(`Auth error`);
                                reject('Could not authorize');
                            }
                        });
                    }).then(() => that.trello.getRestApi()
                        .getToken().then(it => {
                            return {token: it, key: that.trello.getRestApi().appKey};
                        }));
                }
            });
    }

    getLabels() {
        const that = this;
        return that.trello.board("id", "name", "labels")
            .then(board => {
                return board.labels;
            });
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
                    const file = files.item(index);
                    that.fileReader.onload = function (e) {
                        that._loadContent(e.target.result)
                            .then(model => {
                                if (model) {
                                    resolve({
                                        'file': file,
                                        'model': model
                                    });
                                } else {
                                    reject(`Could not successfully import all cards for file ${file.name}`);
                                }
                            });
                    };
                    that.getCurrentCard()
                        .then((card) => {
                            return that.withTrelloToken()
                                .then(token => {
                                    return that._uploadFileToCard(card, file, token);
                                })
                                .then(file => {
                                    window.setTimeout(() => that.fileReader.readAsArrayBuffer(file), 10);
                                })
                                .catch(err => {
                                    console.error(`Got an error while uploading to card: ${err}`);
                                    reject(file);
                                });
                        })
                }));
            }
        }
        return importers.length === 0 ? Promise.reject('No imports') : Promise.all(importers);
    }

    /**
     * @param card
     * @param file
     * @param {key: string, token: string} token
     * @return {Promise<Blob>}
     * @private
     */
    _uploadFileToCard(card, file, token) {
        const that = this;
        return new Promise(function (resolve, reject) {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("name", file.name);
            formData.append("key", token.key);
            formData.append("token", token.token);

            const request = new XMLHttpRequest();
            // what url to use?
            request.onload = function (e) {
                if (request.readyState === 4) {
                    if (request.status === 200) {
                        console.debug(`Successfully attached file to card ${card.id} at ${request.response.date}`, request);
                        resolve(file);
                    } else {
                        reject(`Ein Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten: \n\n${request.statusText}`);
                    }
                } else {
                    // still uploading...
                }
            };
            request.onerror = function (e) {
                reject(`Ein Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten: \n\n${request.statusText}`);
            };

            // even tough its async i get a IFrameIO request timed out. Command=card-back-section, Plugin=undefined, Elapsed=5029 which looks like it is blocking
            request.open("POST", `https://api.trello.com/1/cards/${card.id}/attachments`, true);
            request.send(formData);
        });
    }

    /**
     * @param content
     * @return {Promise<Import>}
     * @private
     */
    _loadContent(content) {
        /**
         * @type {Import}
         */
        const root = this.excelService.read(content);

        return Promise.resolve(root);
        // // TODO: bring the mapping to the UI... something like render(root, configuration) whereas the configuration is the predefined/saved mapping
        // return this._importCards(root);
    }

    /**
     * @param {Import} model
     * @param {ImportConfiguration} configuration
     * @return {Promise<any>}
     */
    importCards(model, configuration) {
        const that = this;
        // create all labels beforehand
        return this._createLabels(this._getLabels(configuration))
            .then(it => {
                console.debug('Labels', it);
                configuration.labels = it;
                return that._importCard(model, 0, configuration);

            });
        // return that._importCard(model, 0, configuration);
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
                .then(() => {
                    return new Promise(function (resolve, reject) {
                        window.setTimeout(() => {
                            // TODO update log on UI
                            resolve(that._importCard(model, index + 1, configuration));
                        }, 600);
                    });
                });
        } else {
            console.debug("Import completed");
            // TODO close the log and attach it to the card
            // TODO update process on UI and close
            return Promise.resolve(true);
        }
    }

    /**
     *
     * @param {AbstractField[]} labels
     * @return {Promise<any>}
     * @private
     */
    _createLabels(labels) {
        // get all labels of that board
        const that = this;
        return that.trello.board('id', 'labels')
            .then(board => {
                const existingLabels = board.labels;
                return Promise.all(labels
                    .map((it) => {
                        const found = existingLabels.find(label => label.name === it.name && label.color === it.source.color);
                        if (!found) {
                            return that._createLabel(it.source.label, it.source.color, board.id)
                        } else {
                            return Promise.resolve(found);
                        }
                    }));
            });
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
        return that._findListByName(listname)
            .reduce((prev, cur) => prev || cur, null)
            .then(list => {
                if (list == null) {
                    // TODO append to log
                    return that._createList(listname)
                        .then(list => {
                            return that._createCardInternal(list, data, configuration);
                        });
                } else {
                    // TODO append to log
                    return that._createCardInternal(list, data, configuration);
                }
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

        return that.withTrelloToken()
            .then(appToken => {
                return that._findCardByTitle(title)
                    .then(it => {
                        if (it) {
                            return it;
                        } else {
                            const searches = members.map((it, index, arr) => {
                                return new Promise(function (resolve, reject) {
                                    window.Trello.get('/search/members', that._createBody(appToken, {
                                        query: `${it}`,
                                        limit: 1
                                    }), (members) => {
                                        resolve(members);
                                    })
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
                                    // TODO log
                                    return new Promise(function (resolve, reject) {
                                        window.Trello.post("/cards", that._createBody(appToken, {
                                            name: title,
                                            desc: desc,
                                            idList: list.id,
                                            idLabels: labels.map(it => it.id).join(','),
                                            due: isBlank(frist) ? null : frist.toISOString(),
                                            idMembers: its.map(it => it.id).join(',')
                                        }), (card) => {
                                            resolve(card);
                                        })
                                    });
                                });
                        }
                    }).then(card => {
                        // TODO: all records must be imported sequentially otherwise records get overridden
                        const importArtikel = that.clientManager.isArticleModuleEnabled()
                            .then(enabled => {
                                if (enabled) {
                                    const fielda = this._getFieldValue(data, "module.artikel.field.a", configuration);
                                    const fieldb = this._getFieldValue(data, "module.artikel.field.b", configuration);
                                    const fieldc = this._getFieldValue(data, "module.artikel.field.c", configuration);
                                    const text = this._getFieldValue(data, "module.artikel.field.d", configuration);
                                    const fielde = this._getFieldValue(data, "module.artikel.field.e", configuration);
                                    const fieldf = this._getFieldValue(data, "module.artikel.field.f", configuration);

                                    // these fields are enums
                                    const online = this._getFieldValue(data, 'module.artikel.online', configuration);
                                    const visual = this._getFieldValue(data, 'module.artikel.visual', configuration);
                                    const region = this._getFieldValue(data, 'module.artikel.region', configuration);
                                    const season = this._getFieldValue(data, 'module.artikel.season', configuration);
                                    const form = this._getFieldValue(data, 'module.artikel.form', configuration);
                                    const place = this._getFieldValue(data, 'module.artikel.place', configuration);

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
                                            return that.articleController.persist(it, card.id)
                                                .then(() => {
                                                    // TODO append to log
                                                    console.debug(`Artikel created in card ${card.id}`);
                                                    return that._doImportBeteiligt(data, configuration, card);
                                                });
                                        });

                                } else {
                                    console.debug('Article Module is not enabled');
                                    return that._doImportBeteiligt(data, configuration, card);
                                }
                            });
                        const importPlan = that.clientManager.isPlanModuleEnabled()
                            .then(enabled => {
                                if (enabled) {
                                    const visual = this._getFieldValue(data, "module.plan.visual", configuration);
                                    const form = this._getFieldValue(data, "module.plan.form", configuration);
                                    const online = this._getFieldValue(data, "module.plan.online", configuration);
                                    const season = this._getFieldValue(data, "module.plan.season", configuration);
                                    const region = this._getFieldValue(data, "module.plan.region", configuration);
                                    const place = this._getFieldValue(data, "module.plan.place", configuration);
                                    const fielda = this._getFieldValue(data, "module.plan.field.a", configuration);
                                    const fieldb = this._getFieldValue(data, "module.plan.field.b", configuration);
                                    const fieldg = this._getFieldValue(data, "module.plan.field.g", configuration);
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
                                            return that.planController.persist(plan, card.id)
                                                .then(() => {
                                                    // TODO append to log
                                                    console.debug(`Plan created in card ${card.id}`);
                                                    return that._doImportBeteiligt(data, configuration, card);
                                                });
                                        })
                                } else {
                                    console.debug('Plan Module is not enabled');
                                    return that._doImportBeteiligt(data, configuration, card);
                                }
                            });
                        return [importArtikel, importPlan];
                    });
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
                            console.debug('sections', sections);
                            module.sections = sections;
                            return that.moduleController.persist(module, card.id)
                                .then(() => {
                                    // TODO append to log
                                    console.debug(`Beteiligt created in card ${card.id}`);
                                    return true;
                                });
                        });

                } else {
                    return false;
                }
            });
    }

    /**
     * @param name
     * @param onSuccess
     * @return {*|PromiseLike<string | never>|Promise<string | never>}
     * @private
     */
    _createList(name, onSuccess) {
        const that = this;
        return this.trello.board("id", "name", "labels")
            .then(board => {
                return that.withTrelloToken()
                    .then(it => {
                        return new Promise(function (resolve, reject) {
                            window.Trello.post("/lists", that._createBody(it, {
                                name: name,
                                idBoard: board.id,
                                pos: "bottom"
                            }), (list) => {
                                // TODO append to log
                                resolve(list);
                            });
                        });
                    });
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

    /**
     * @param title
     * @return {Promise<{id: string, name: string}>}
     * @private
     */
    _findCardByTitle(title) {
        return this.trello.cards('id', 'name')
            .reduce((prev, cur) => {
                prev = cur.name === title ? cur : prev;
                return prev;
            }, null)
    }

    _findListByName(name) {
        return this.trello.lists('all')
            .filter(list => {
                return list.name === name;
            });
    }

    /**
     *
     * @param label
     * @param color
     * @param boardId
     * @return {*|PromiseLike<T | never>|Promise<T | never>}
     * @private
     */
    _createLabel(label, color, boardId) {
        const that = this;
        return this.withTrelloToken()
            .then(it => {
                return new Promise(function (resolve, reject) {
                    window.Trello.post("/labels", that._createBody(it, {
                        name: label,
                        color: color,
                        idBoard: boardId
                    }), function (label) {
                        resolve(label);
                    });
                });
            });
    }

    _createBody(token, obj) {
        obj.key = token.key;
        obj.token = token.token;
        return obj;
    }

    _getMembersOfBoard() {
        return this.trello.board('members')
            .then(it => {
                console.debug('members are ', it);
            });
    }

}