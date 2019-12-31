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
        console.debug("workbook is", wb);
        const first_sheet_name = wb.SheetNames[0];

        /* Get worksheet */
        const worksheet = wb.Sheets[first_sheet_name];
        this.boundary = XLSX.utils.decode_range(worksheet['!ref']);

        const root = new Import(wb.Props.Title);

        if (!this._treatFirstRowAsRoot) {
            let header = new HeaderNode(null, 'Panta.Card', {constant: '/'});
            this._parseImportHeader(worksheet, 0, 0, header);
            root.header = header;
        } else {
            this._parseImportHeader(worksheet, 0, 0, null);
        }
        console.log('Header', root.header);
        this._readImportData(worksheet, root, 0, this.dataRowIndex);

        return root;
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

                const node = new HeaderNode(parent, cell.v, address, cell.c ? cell.c : []);
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