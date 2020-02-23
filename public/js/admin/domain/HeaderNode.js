class HeaderNode {

    static create(json) {
        if (json) {
            return new HeaderNode(null,
                JsonSerialization.getProperty(json, 'label'),
                JsonSerialization.getProperty(json, 'address'),
                JsonSerialization.getProperty(json, 'comments'),
                JsonSerialization.getProperty(json, 'color')
            );
        } else {
            return null;
        }
    }

    /**
     * @param {HeaderNode} parent the parent node or null
     * @param {string} label the label of that cell
     * @param {{c: number, r: number, constant: string?}} address
     * @param {{a: string, h: string, r: string, t: string}[]|null} comments
     * @param {string?} color the trello color
     */
    constructor(parent, label, address, comments = [], color) {
        this._parent = parent;
        this._label = label;
        /**
         * @type {HeaderNode[]}
         */
        this._children = [];
        this._properties = [];
        this._address = address ? {c: address.c, r: address.r, constant: address.constant} : null;
        this._comments = comments ? comments : [];
        this._color = color;
    }

    get address() {
        return this._address;
    }

    /**
     * @return {HeaderNode}
     */
    get parent() {
        return this._parent;
    }

    /**
     * @return {HeaderNode[]}
     */
    get children() {
        return this._children;
    }

    /**
     * @return {Array}
     */
    get properties() {
        return this._properties;
    }

    get label() {
        return this._label;
    }

    set label(label) {
        this._label = label;
    }

    get comments() {
        return this._comments;
    }

    get color() {
        if (!isBlank(this._color)) {
            return this._color;
        } else {
            const comment = this.getComment(0);
            if (!isBlank(comment)) {
                return comment.t.toLowerCase().trim();
            }
            return null;
        }
    }

    set color(value) {
        this._color = value;
    }

    /**
     * @param {{r: number, c: number, constant: string}} another
     */
    isSameAddress(another) {
        return another ? another.c === this.address.c && another.r === this.address.r : false;
    }

    getAddressAsText() {
        return XLSX.utils.encode_cell(this.address);
    }

    /**
     *
     * @param index
     * @return {{a: string, h: string, r: string, t: string}|string}
     */
    getComment(index) {
        return this.comments.length > index ? this.comments[index] : null;
    }

    /**
     * @param {HeaderNode} child
     */
    add(child) {
        this.children.push(child);
    }

    /**
     * @param {HeaderNode[]} children
     */
    addAll(children) {
        const that = this;
        if (children && Array.isArray(children)) {
            children.forEach(it => that.add(it));
        }
    }

    /**
     * Get the child item at the argument position
     * @param index
     * @returns {HeaderNode}
     */
    get(index) {
        return this.children[index];
    }

    put(property) {
        if (this.properties.indexOf(property) === -1) {
            this.properties.push(property);
        }
    }

    hasChildren() {
        return this._children.length > 0;
    }

    hasParent() {
        return this.parent != null;
    }

    getPath() {
        if (this.hasParent()) {
            return this.parent.getPath() + " » " + this.label;
        } else {
            return this.label;
        }
    }

    /**
     * @return {HeaderNode[]}
     */
    getPathItems() {
        const items = [];
        if (this.hasParent()) {
            this.parent.getPathItems().forEach(it => {
                items.push(it);
            });
        }
        items.push(this);
        return items;
    }
}