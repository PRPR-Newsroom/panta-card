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
        this.importConfiguration = new ImportConfiguration();
        this.clientManager = ClientManager.getInstance(window);
        this.articleController = this.clientManager.getArticleController();
        this.moduleController = this.clientManager.getModuleController();
    }

    hasLabel(label, color) {
        return this.getLabels()
            .map(it => it.name === label/* && it.color === color*/)
            .reduce((prev, cur) => prev | cur);
    }

    createLabel(label, color) {
        const that = this;
        this.doWithToken(function (token) {
            that._createLabel(label, color);
        });
    }

    getCurrentCard() {
        const that = this;
        return that.trello.card('id');
    }

    doWithToken(onAuthorized) {
        const that = this;
        if (!this.tryDoWithToken(onAuthorized)) {
            return window.Trello.authorize({
                type: "popup",
                persist: "true",
                expiration: "1day",
                scope: {read: true, write: true, account: false},
                success: () => {
                    that.trello.restApi.tokenExpirationKey = "app_token_exp";
                    const expdate = new Date();
                    expdate.setTime(expdate.getTime() + 60 * 55 * 1000);
                    that.trello.restApi.localStorage[that.trello.restApi.tokenExpirationKey] = expdate.toISOString();
                    that.trello.restApi.localStorage[that.trello.restApi.pantaCardToken] = that.trello.restApi.localStorage[that.trello.restApi.tokenStorageKey];
                    that.tryDoWithToken(onAuthorized);
                },
                error: function () {
                    console.error("Error authorizing");
                }
            });
        }
    }

    tryDoWithToken(onAuthorized) {
        const that = this;
        if (isBlank(that.trello.restApi.tokenExpirationKey)) {
            that.trello.restApi.tokenExpirationKey = "app_token_exp";
        }
        if (isBlank(that.trello.restApi.pantaCardToken)) {
            that.trello.restApi.pantaCardToken = "panta_app_token";
        }

        if (!isBlank(that.trello.restApi.localStorage[that.trello.restApi.tokenExpirationKey])) {
            const expdate = new Date(that.trello.restApi.localStorage[that.trello.restApi.tokenExpirationKey]);
            const now = new Date();
            if (expdate.getTime() > now.getTime()) {
                const apptoken = that.trello.restApi.localStorage[that.trello.restApi.tokenStorageKey];
                if (!isBlank(apptoken)) {
                    onAuthorized(apptoken);
                    return true;
                } else {
                    const papptoken = that.trello.restApi.localStorage[that.trello.restApi.pantaCardToken];
                    // if (!isBlank(papptoken)) {
                    //     that.trello.restApi.tokenStorageKey = "trello_token";
                    //     that.trello.restApi.localStorage[that.trello.restApi.tokenStorageKey] = papptoken;
                    //     onAuthorized(papptoken);
                    //     return true;
                    // }
                }
            } else {
                // delete that.trello.restApi.localStorage[that.trello.restApi.tokenStorageKey];
                delete that.trello.restApi.localStorage[that.trello.restApi.pantaCardToken];
            }
        }
        return false;
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
     */
    import(files) {
        const that = this;
        if (files.length > 0) {
            for (let index = 0; index < files.length; index++) {
                const file = files.item(index);
                that.fileReader.onload = function (e) {
                    that._processFile(e.target.result);
                };

                that.getCurrentCard()
                    .then((card) => {
                        that.doWithToken((token) => {
                            const formData = new FormData();
                            formData.append("file", file);
                            formData.append("name", file.name);
                            formData.append("key", that.trello.restApi.appKey);
                            formData.append("token", token);

                            const request = new XMLHttpRequest();
                            // what url to use?
                            request.onreadystatechange = function () {
                                // When we have a response back from the server we want to share it!
                                // https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/response
                                if (request.readyState === 4) {
                                    if (request.status === 200) {
                                        console.log(`Successfully uploaded at: ${request.response.date}`, request);
                                        that.fileReader.readAsArrayBuffer(file);
                                    } else {
                                        console.error(`Could not attach import file: ${file.name}`, request);
                                    }
                                } else {
                                    // still uploading...
                                }
                            };
                            request.open("POST", `https://api.trello.com/1/cards/${card.id}/attachments`);
                            request.send(formData);
                        });
                    });
            }
        }
    }

    /**
     * Process the excel file
     * @param content
     * @private
     */
    _processFile(content) {
        this.dataRowIndex = 4;

        const data = new Uint8Array(content);
        const wb = XLSX.read(data, {type: "array"});
        console.log("workbook is", wb);
        const first_sheet_name = wb.SheetNames[0];
        /* Get worksheet */
        const worksheet = wb.Sheets[first_sheet_name];
        this.boundary = XLSX.utils.decode_range(worksheet['!ref']);

        const root = new Import(wb.Props.Title);
        root.header = this._parseImportHeader(worksheet, 0, 0, null);
        this._readImportData(worksheet, root, 0, this.dataRowIndex);
        console.debug("Import: ", root);
        console.debug(root.getHeader(XLSX.utils.decode_cell("A4")).getPath());
        //labels
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.0", root.getHeader(XLSX.utils.decode_cell("A4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.1", root.getHeader(XLSX.utils.decode_cell("B4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.2", root.getHeader(XLSX.utils.decode_cell("C4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.3", root.getHeader(XLSX.utils.decode_cell("D4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.4", root.getHeader(XLSX.utils.decode_cell("E4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.5", root.getHeader(XLSX.utils.decode_cell("F4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.6", root.getHeader(XLSX.utils.decode_cell("G4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.7", root.getHeader(XLSX.utils.decode_cell("H4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.8", root.getHeader(XLSX.utils.decode_cell("I4"))));
        this.importConfiguration.mapping.push(new BooleanField("Trello Label", "trello.label.9", root.getHeader(XLSX.utils.decode_cell("J4"))));

        this.importConfiguration.mapping.push(new TextField("Trello Title", "trello.title", root.getHeader(XLSX.utils.decode_cell("L4"))));
        this.importConfiguration.mapping.push(new TextField("Trello Description", "trello.description", root.getHeader(XLSX.utils.decode_cell("M4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Artikel - Details", "panta.article.details", root.getHeader(XLSX.utils.decode_cell("U4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Artikel - Vorname", "panta.article.vorname", root.getHeader(XLSX.utils.decode_cell("V4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Artikel - Nachname", "panta.article.nachname", root.getHeader(XLSX.utils.decode_cell("W4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter1 - Address", "panta.beteiligt.0.address", root.getHeader(XLSX.utils.decode_cell("Z4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter2 - Link", "panta.beteiligt.1.name", root.getHeader(XLSX.utils.decode_cell("AF4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter3 - Link", "panta.beteiligt.2.name", root.getHeader(XLSX.utils.decode_cell("AG4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter4 - Link", "panta.beteiligt.3.name", root.getHeader(XLSX.utils.decode_cell("AH4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter5 - Link", "panta.beteiligt.4.name", root.getHeader(XLSX.utils.decode_cell("AI4"))));
        this.importConfiguration.mapping.push(new TextField("Panta.Card.Beteiligt.Reiter6 - Link", "panta.beteiligt.5.name", root.getHeader(XLSX.utils.decode_cell("AJ4"))));

        this._importCards(root);

    }

    /**
     * Read the data and link them with the headers
     * @param worksheet
     * @param {Import} root
     * @param column
     * @param row
     * @private
     */
    _readImportData(worksheet, root, column, row) {
        if (row <= this.boundary.e.r) {

            const node = new DataNode(row);

            for (let c = column; c <= this.boundary.e.c; c++) {
                const address = {r: row, c: c};
                const header = root.getHeader(address);
                let data = worksheet[XLSX.utils.encode_cell(address)];
                if (null != data) {
                    node.set(header, data);
                }
            }

            if (node.values.length !== 0) {
                root.put(node);
            }

            this._readImportData(worksheet, root, column, row + 1);
        }
    }

    /**
     * Parse the headers of that worksheet
     * @param worksheet
     * @param column
     * @param row
     * @param parent
     * @returns {null|HeaderNode}
     * @private
     */
    _parseImportHeader(worksheet, column, row, parent) {
        if (row < this.dataRowIndex) {
            if (column <= this.boundary.e.c) {
                let address = {c: column, r: row};
                let cell = worksheet[XLSX.utils.encode_cell(address)];
                if (cell == null) {
                    // if cell is empty then ignore it
                    return null;
                }

                const node = new HeaderNode(parent, cell.h, address);
                if (row === 0) {
                    // first row is special: all values on the same row are properties
                    for (let c = column + 1; c <= this.boundary.e.c; c++) {
                        const property = worksheet[XLSX.utils.encode_cell({c: c, r: row})];
                        if (property != null) {
                            node.put(property.h);
                        }
                    }
                }

                do {
                    let childNode = this._parseImportHeader(worksheet, column, row + 1, node);
                    if (childNode != null) {
                        node.add(childNode);
                    }
                } while (
                    ++column <= this.boundary.e.c &&
                    (row === 0 || null == worksheet[XLSX.utils.encode_cell({c: column, r: row})])
                    );

                return node;
            }
        }
        // when no more rows to parse or the last cell was reached abort by returning null
        return null;
    }

    /**
     * @param {Import} root
     * @private
     */
    _importCards(root) {
        const that = this;
        that._importCard(root, 0);
    }

    /**
     * Import the data at index and when the import was successful it will proceed to the next one
     * @param root
     * @param index
     * @private
     */
    _importCard(root, index) {
        const that = this;
        if (index < root.data.length) {
            that._createCard(root.data[index], () => {
                window.setTimeout(() => {
                    that._importCard(root, index + 1);
                }, 600);
            });
        } else {
            console.log("Import completed");
            that.trello.closeModal();
        }
    }

    /**
     *
     * @param {DataNode} data
     * @param onReady a callback to be called when the import was successful
     * @private
     */
    _createCard(data, onReady) {
        const that = this;

        that.doWithToken(token => {
            that._findListByName("Import Test")
                .reduce((prev, cur) => prev || cur, null)
                .then(list => {
                    if (list == null) {
                        that._createList("Import Test", list => {
                            that._createCardInternal(list, data, onReady);
                        });
                    } else {
                        that._createCardInternal(list, data, onReady);
                    }
                    return true;
                });
        });

    }

    _createCardInternal(list, data, onReady) {
        const that = this;
        const label0 = this._getField("trello.label.0");
        const label1 = this._getField("trello.label.1");
        const label2 = this._getField("trello.label.2");
        const label3 = this._getField("trello.label.3");
        const label4 = this._getField("trello.label.4");
        const label5 = this._getField("trello.label.5");
        const label6 = this._getField("trello.label.6");
        const label7 = this._getField("trello.label.7");
        const label8 = this._getField("trello.label.8");
        const label9 = this._getField("trello.label.9");
        const title = this._getFieldValue(data, "trello.title");
        const desc = this._getFieldValue(data, "trello.description");
        const details = this._getFieldValue(data, "panta.article.details");
        const vorname = this._getFieldValue(data, "panta.article.vorname");
        const nachname = this._getFieldValue(data, "panta.article.nachname");
        const b1address = this._getFieldValue(data, "panta.beteiligt.0.address");
        const b1name = this._getFieldValue(data, "panta.beteiligt.1.name");
        const b2name = this._getFieldValue(data, "panta.beteiligt.2.name");
        const b3name = this._getFieldValue(data, "panta.beteiligt.3.name");
        const b4name = this._getFieldValue(data, "panta.beteiligt.4.name");
        const b5name = this._getFieldValue(data, "panta.beteiligt.5.name");
        that.doWithToken(token => {
            window.Trello.post("/cards", {
                name: title,
                desc: desc,
                idList: list.id
            }, (card) => {
                console.log("Card created: ", card);
                [
                    label0,
                    label1,
                    label2,
                    label3,
                    label4,
                    label5,
                    label6,
                    label7,
                    label8,
                    label9
                ]
                    .filter(field => field != null)
                    .forEach(field => {
                        if (that._getFieldValue(data, field.reference)) {
                            window.Trello.post(`/cards/${card.id}/labels`, {
                                name: field.source.label,
                                color: null
                            }, (label) => {
                                console.log("Label added to card", label);
                            });
                            return true;
                        }
                        return false;
                    });

                const artikel = new Artikel(null, details, 0, vorname, 1, 1, null, null, null, null, nachname, null, null, null);
                that.articleController.persist(artikel, card.id)
                    .then((article) => {
                        console.log("Artikel created in card", article);
                        const module = ModuleConfig.create({}, null);
                        module.sections['onsite'].address = b1address;
                        module.sections['text'].name = b1name;
                        module.sections['photo'].name = b2name;
                        module.sections['video'].name = b3name;
                        module.sections['illu'].name = b4name;
                        module.sections['ad'].name = b5name;
                        that.moduleController.persist(module, card.id)
                            .then(() => {
                                console.log("Beteiligt created in card");
                                onReady();
                            });
                    });
            });
        });
    }

    _createList(name, onSuccess) {
        const that = this;
        return this.trello.board("id", "name", "labels")
            .then(board => {
                that.doWithToken(token => {
                    window.Trello.post("/lists", {
                        name: name,
                        idBoard: board.id,
                        pos: "bottom"
                    }, (list) => {
                        onSuccess(list);
                    });
                });
                return true;
            });
    }

    /**
     * @param name
     * @return {AbstractField}
     * @private
     */
    _getField(name) {
        return this.importConfiguration.get(name);
    }

    _getFieldValue(data, name) {
        /**
         * @type {AbstractField}
         */
        const field = this._getField(name)
        return field && data.get(field.source) ? field.getValue(data.get(field.source)) : null;
    }

    _findListByName(name) {
        return this.trello.lists('all')
            .filter(list => {
                return list.name === name;
            });
    }

    _createLabel(label, color) {
        return this.trello.board("id", "name", "labels")
            .then(board => {
                return window.Trello.post("/labels", {
                    name: label,
                    color: color,
                    idBoard: board.id
                }, function () {
                    console.debug("Label created");
                });
            });

    }

}