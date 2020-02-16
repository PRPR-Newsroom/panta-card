class ExcelService {
    
    get treatFirstRowAsRoot() {
        return this._treatFirstRowAsRoot;
    }

    set treatFirstRowAsRoot(value) {
        this._treatFirstRowAsRoot = value;
    }

    constructor() {
        this._treatFirstRowAsRoot = false;
    }

    /**
     * @param content
     * @return {Import}
     */
    read(content) {
        this.dataRowIndex = 1;

        const data = new Uint8Array(content);
        const wb = XLSX.read(data, {type: "array"});
        const first_sheet_name = wb.SheetNames[0];
        /* Get worksheet */
        const worksheet = wb.Sheets[first_sheet_name];
        this.boundary = XLSX.utils.decode_range(worksheet['!ref']);

        const root = new Import(wb.Props.Title);

        if (!this._treatFirstRowAsRoot) {
            let header = new HeaderNode(null, 'Panta.Card', {constant: '/'}, null);
            this._parseImportHeader(worksheet, 0, 0, header);
            root.header = header;
        } else {
            this._parseImportHeader(worksheet, 0, 0, null);
        }
        this._readImportData(worksheet, root, 0, this.dataRowIndex);

        return root;
    }

    /**
     * @param {Import} model
     * @param {string} filename
     * @return {File}
     */
    write(model, filename) {
        const wb = XLSX.utils.book_new();
        wb.Props = {
            Title: 'Sample Export',
            Subject: 'Panta.Card Export',
            Author: 'PantaRhei',
            CreatedDate: new Date()
        };
        wb.SheetNames.push(model.title);

        const rows = [];
        const cols = Object.values(model.getNormalizedHeaders()).reduce((prev, cur) => {
            prev.push(cur.label);
            return prev;
        }, []);
        rows.push(cols);
        model.data.map(it => {
            return it.values.map(it => it.value);
        }).forEach(it => {
            rows.push(it);
        });

        wb.Sheets[model.title] = XLSX.utils.aoa_to_sheet(rows);

        const bin = XLSX.write(wb, {bookType: 'xlsx', type: 'binary'});

        function s2ab(s) {
            const buf = new ArrayBuffer(s.length);
            const view = new Uint8Array(buf);
            for(let i=0;i<s.length;i++) {
                view[i] = s.charCodeAt(i) & 0xFF;
            }
            return buf;
        }
        return new File([s2ab(bin)], `${filename}.xlsx`);
    }

    /**
     * Parse the headers of that worksheet
     * @param worksheet
     * @param column
     * @param row
     * @param {HeaderNode} parent
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
                    return this.treatFirstRowAsRoot ? null : this._parseImportHeader(worksheet, column + 1, row, parent);
                }

                const node = new HeaderNode(parent, cell.v, address, cell.c ? cell.c : [], null);
                if (row === 0 && this._treatFirstRowAsRoot) {
                    // first row is special: all values on the same row are properties
                    for (let c = column + 1; c <= this.boundary.e.c; c++) {
                        const property = worksheet[XLSX.utils.encode_cell({c: c, r: row})];
                        if (property != null) {
                            node.put(property.h);
                        }
                    }
                } else if (row === 0 && !this._treatFirstRowAsRoot) {
                    parent.add(node);
                    this._parseImportHeader(worksheet, column + 1, row, parent);
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

}