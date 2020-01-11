
class TrelloClient {

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
    }

    /**
     *
     * @return {Promise<string>}
     */
    withTrelloToken() {
        const that = this;
        return that.trello.getRestApi()
            .isAuthorized()
            .then(it => {
                if (it) {
                    return that.trello.getRestApi().getToken()
                        .then(it => {
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
                    that._loggingService.d(`Berechtigung erfolgreich erteilt`);
                    resolve(true);
                },
                error: () => {
                    that._loggingService.e(`Berechtigung konnte nicht erteilt werden`);
                    reject('Fehler bei der Autorisierung des Power-Ups');
                }
            });
        }).then(() => that.trello.getRestApi()
            .getToken().then(it => {
                return {token: it, key: that.trello.getRestApi().appKey};
            }));
    }

    getLabels() {
        const that = this;
        return that.trello.board("id", "name", "labels")
            .then(board => {
                return board.labels;
            });
    }

    /**
     *
     * @param {AbstractField[]} labels
     * @return {Promise<any>}
     * @private
     */
    createLabels(labels) {
        // get all labels of that board
        const that = this;
        return that.trello.board('id', 'labels')
            .then(board => {
                const existingLabels = board.labels;
                return Promise.all(labels.map((it) => {
                    const labelName = it.source.label;
                    const found = existingLabels.find(label => label.name === it.name && label.color === it.source.color);
                    if (!found) {
                        return that._createLabel(labelName, it.source.color, board.id)
                            .catch(it => {
                                that._loggingService.e(`Label «${labelName}» konnte nicht erstellt werden: ${it}`);
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
}