/**
 * Trello Client that can be used to access the Trello API and tracks the Trello API Rate Limit
 */
class TrelloClient {

    get requests() {
        return this._requests;
    }

    static get MAX_REQUESTS() {
        return 300;
    }

    /**
     * @param trello
     * @param {LoggingService} loggingService
     */
    constructor(trello, loggingService) {
        if (!window.hasOwnProperty("Trello")) {
            throw "Trello not correctly loaded";
        }
        this.trello = trello;
        /**
         * @type {LoggingService}
         * @private
         */
        this._loggingService = loggingService;

        this._requests = 0;
    }

    /**
     * @return {Promise<{id: string}>}
     */
    getCurrentCard() {
        const that = this;
        return that.trello.card('id')
            .then(it => {
                that._requests++;
                return it;
            });
    }

    /**
     *
     * @return {{id: string, name: string, desc: string, due: Date?, members: string[], labels: {}[], idList: string}[]}
     */
    getAllBoardCards() {
        return this.trello.cards('id', 'name', 'desc', 'due', 'members', 'labels', 'idList');
    }

    /**
     * Get the list by its id
     * @param id
     * @return {*}
     */
    getListById(id) {
        const that = this;
        return that.trello.lists('id','name')
            .filter(it => it.id === id)
            .reduce((prev, cur) => {
                prev = cur;
                return prev;
            }, null);
    }

    /**
     * @param {{id: string}} card
     * @param {File} file
     * @param {string} username
     * @return {Promise<any>}
     */
    attachFile(card, file, username) {
        const that = this;
        return that.withTrelloToken()
            .then(token => {
                return new Promise(function (resolve, reject) {
                    const formData = new FormData();
                    const now = new Date();
                    const filename = `Datei «${file.name}» von «${username}» am ${now.toLocaleDateString()} um ${now.toLocaleTimeString()}`;
                    formData.append("file", file);
                    formData.append("name", `${filename}`);
                    formData.append("key", token.key);
                    formData.append("token", token.token);

                    const request = new XMLHttpRequest();
                    // what url to use?
                    request.onload = function (e) {
                        if (request.readyState === 4) {
                            switch (request.status) {
                                case 200:
                                    that._loggingService.i(`Datei als "${filename}" in Card «${card.id}» gespeichert`);
                                    resolve(file);
                                    break;
                                case 401:
                                    // unauthorized: reset the token
                                    that.resetToken();
                                default:
                                    that._loggingService.e(`Ein Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten}`);
                                    that._loggingService.d(`Details zum Fehler: ${request.statusText}`);
                                    reject(`Ein Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten: \n\n${request.statusText}`);
                            }
                        } else {
                            // still uploading...
                        }
                    };
                    request.onerror = function (e) {
                        that._loggingService.e(`Ein I/O-Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten`);
                        that._loggingService.d(`Details zum Fehler: ${request.statusText}`);
                        reject(`Ein I/O-Fehler beim Verarbeiten der Datei «${file.name}» ist aufgetreten: \n\n${request.statusText}`);
                    };

                    // even tough its async i get a IFrameIO request timed out. Command=card-back-section, Plugin=undefined, Elapsed=5029 which looks like it is blocking
                    request.open("POST", `https://api.trello.com/1/cards/${card.id}/attachments`, true);
                    request.send(formData);
                })
            });
    }

    /**
     *
     * @return {Promise<{token: string, key: string}>}
     */
    withTrelloToken() {
        const that = this;
        return that.trello.getRestApi()
            .isAuthorized()
            .then(it => {
                that._requests++;
                if (it) {
                    return that.trello.getRestApi().getToken()
                        .then(it => {
                            that._requests++;
                            if (it) {
                                return {token: it, key: that.trello.getRestApi().appKey};
                            } else {
                                return that._authorize();
                            }
                        });
                } else {
                    return that._authorize();
                }
            });
    }

    _authorize() {
        const that = this;
        return new Promise(function (resolve, reject) {
            window.Trello.authorize({
                type: 'popup',
                expiration: 'never',
                scope: {
                    read: 'true',
                    write: 'true'
                },
                success: () => {
                    that._requests++;
                    that._loggingService.d(`Berechtigung erfolgreich erteilt`);
                    resolve(true);
                },
                error: () => {
                    that._requests++;
                    that._loggingService.e(`Berechtigung konnte nicht erteilt werden`);
                    reject('Fehler bei der Autorisierung des Power-Ups');
                }
            });
        }).then(() => that.trello.getRestApi()
            .getToken().then(it => {
                that._requests++;
                return {token: it, key: that.trello.getRestApi().appKey};
            }));
    }

    resetToken() {
        this._requests++;
        return this.trello.getRestApi()
            .clearToken();
    }

    /**
     * @return {PromiseLike<{username: string}>}
     */
    getCurrentMember() {
        const that = this;
        return this.trello.member('username')
            .then(it => {
                that._requests++;
                return it;
            });
    }

    /**
     * @param {string} title
     * @param {string} desc
     * @param {string} idList
     * @param {string} idLabels
     * @param {string} due
     * @param {string} idMembers
     * @return {Promise<any | never>}
     */
    createCard(title, desc, idList, idLabels, due, idMembers) {
        const that = this;
        return this.withTrelloToken()
            .then(appToken => {
                return new Promise(function (resolve, reject) {
                    that._loggingService.d(`Erstelle Trello Card «${title}» in ${idList}`);
                    const request = that._createBody(appToken, {
                        'name': title,
                        'desc': desc,
                        'idList': idList,
                        'idLabels': idLabels,
                        'due': due,
                        'idMembers': idMembers
                    });
                    that._requests++;
                    window.Trello.post("/cards", request, (card) => {
                        that._loggingService.d(`Trello Card erstellt mit ID «${card.id}»`);
                        that._assertCard(card, resolve, reject, true);
                    }, () => {
                        reject(`Fehler beim Erstellen der Karte mit Titel «${title}» (Evtl. wurde die Karte bereits einmal `);
                    });
                });
            });
    }

    _assertCard(card, resolve, reject, retry) {
        const that = this;
        setTimeout(() => {
            that.trello.cards('id')
                .then(cards => {
                    if (cards.filter(it => it.id === card.id).length === 1) {
                        resolve(card);
                    } else if (retry) {
                        that._assertCard(card, resolve, reject, false);
                    } else {
                        reject(`Konnte die Trello Card «${card.id}» nicht finden`);
                    }
                });
        }, retry ? 1 : 100); // if not retry anymore then give some time to let trello sync its cards
    }

    /**
     * @param {string} name
     * @return {Promise<any | never>}
     */
    searchMember(name) {
        const that = this;
        return that.withTrelloToken()
            .then(appToken => {
                return new Promise(function (resolve, reject) {
                    that._requests++;
                    window.Trello.get('/search/members', that._createBody(appToken, {
                        query: `${name}`,
                        limit: 1
                    }), (members) => {
                        resolve(members);
                    }, () => {
                        reject(`Fehler beim Suchen des Mitglieds mit dem Namen «${name}»`);
                    });
                });
            });
    }

    getLabels() {
        const that = this;
        return that.trello.board("id", "name", "labels")
            .then(board => {
                that._requests++;
                return board.labels;
            });
    }

    /**
     * @return {Promise<{id: string, name: string}>}
     */
    getCurrentBoard() {
        return this.trello.board('id','name');
    }

    /**
     *
     * @param {AbstractField[]} labels
     * @return {Promise<any>}
     */
    createLabels(labels) {
        // get all labels of that board
        const that = this;
        return that.trello.board('id', 'labels')
            .then(board => {
                that._requests++;
                const existingLabels = board.labels;
                return Promise.all(labels.map((it) => {
                    const labelName = it.source.label;
                    const found = existingLabels.find(label => label.name === it.name && label.color === it.source.color);
                    if (!found) {
                        return that.createLabel(labelName, it.source.color, board.id)
                            .catch(it => {
                                that._loggingService.w(`Label «${labelName}» konnte nicht erstellt werden: ${it}`);
                                return false;
                            });
                    } else {
                        return Promise.resolve(found);
                    }
                })).then(its => {
                    return its.filter(it => it !== false);
                });
            });
    }

    /**
     * @param title
     * @param {{id: string}} list
     * @return {Promise<{id: string, name: string, idList: string, closed: boolean}>}
     */
    findCardByTitle(title, list) {
        // trello.cards sucht in allen offenen cards vom aktuellen board
        this._loggingService.d(`Sucht nach bestehender Trello Card mit Namen «${title}» in Trello Liste «${list.id}»`);
        this._requests++;
        return this.trello.cards('id', 'name', 'idList', 'closed')
            .reduce((prev, cur) => {
                prev = cur.name === title && cur.idList === list.id ? cur : prev;
                return prev;
            }, null)
    }

    findListByName(name) {
        this._requests++;
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
    createLabel(label, color, boardId) {
        const that = this;
        if (Object.values(TRELLO_COLORS).indexOf(color) === -1) {
            return Promise.reject(`Ungültige Farbe: ${color}. Gültige Farben sind: ${Object.values(TRELLO_COLORS).join()}`);
        }
        return this.withTrelloToken()
            .then(it => {
                return new Promise(function (resolve, reject) {
                    that._loggingService.d(`Label «${label}» (${color}) wird erstellt in Board «${boardId}»`);
                    const request = that._createBody(it, {
                        name: label,
                        color: color === "transparent" ? null : color,
                        idBoard: boardId
                    });
                    window.Trello.post("/labels", request, function (label) {
                        that._requests++;
                        resolve(label);
                    }, () => {
                        reject(`Fehler beim Erstellen des Labels «${label}» (${color})`);
                    });
                });
            });
    }

    /**
     * @param name
     * @return {*|PromiseLike<string | never>|Promise<string | never>}
     */
    createList(name) {
        const that = this;
        return this.trello.board("id", "name", "labels")
            .then(board => {
                that._requests++;
                return that.withTrelloToken()
                    .then(it => {
                        return new Promise(function (resolve, reject) {
                            window.Trello.post("/lists", that._createBody(it, {
                                name: name,
                                idBoard: board.id,
                                pos: "bottom"
                            }), (list) => {
                                that._requests++;
                                that._loggingService.d(`Liste «${name}» wurde erstellt`);
                                resolve(list);
                            }, () => {
                                reject(`Fehler beim Erstellen der List mit dem Namen «${name}»`);
                            });
                        });
                    });
            });
    }

    _createBody(token, obj) {
        obj.key = token.key;
        obj.token = token.token;
        this._loggingService.t(`>> ${JSON.stringify(obj)}`);
        return obj;
    }
}