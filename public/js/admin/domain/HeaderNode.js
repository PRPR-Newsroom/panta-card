
class HeaderNode {

    
    constructor(parent, label, address) {
        this._parent = parent;
        this._label = label;
        /**
         * @type {Array}
         */
        this._children = [];
        this._properties = [];
        this._address = address;
    }

    get address() {
        return this._address;
    }

    get parent() {
        return this._parent;
    }

    get children() {
        return this._children;
    }

    get properties() {
        return this._properties;
    }

    get label() {
        return this._label;
    }

    /**
     * @param {HeaderNode} child
     */
    add(child) {
        this.children.push(child);
    }

    /**
     * @param index
     * @returns {HeaderNode}
     */
    get(index) {
        return this.children[index];
    }

    put(property) {
        if (this.properties.indexOf(property)===-1) {
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
}