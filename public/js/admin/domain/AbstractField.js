/**
 * The base field class. This class links the excel fields to trello/panta.card
 * fields and can set the value of a {DataNode} into the target field.
 *
 * A concrete implementation defines the type of the «target» field. So this concrete
 * class knows how to transform the values that should be put into those fields. The
 * simplest field will be a text field that can be used to place text into fields
 *
 * @abstract
 */
class AbstractField {

    /**
     * @return {boolean}
     */
    get multi() {
        return this._multi;
    }

    set multi(value) {
        this._multi = value;
    }

    /**
     * @return {HeaderNode} the header node in the Excel file that this field is mapped to
     */
    get source() {
        return this._source;
    }

    /**
     * @return {string}
     */
    get reference() {
        return this._reference;
    }

    set reference(value) {
        this._reference = value;
    }

    get name() {
        return this._name;
    }

    set name(name) {
        this._name = name;
    }

    /**
     * @param name a human readable name
     * @param {string} reference the referenced, target field (e.g. the trello field but also any panta.card field)
     * @param {HeaderNode} source field
     * @param {boolean?} multi
     */
    constructor(name, reference, source, multi = false) {
        this._name = name;
        /**
         * @type {string}
         * @private
         */
        this._reference = reference;
        /**
         * @type {HeaderNode}
         */
        this._source = source;

        this._type = this.getType();

        /**
         * @type {boolean}
         * @private
         */
        this._multi = multi || false;
    }

    /**
     * @param {{value: {h: string, v: string, t: string}}} node
     * @abstract
     */
    getValue(node) {}

    /**
     * @abstract
     */
    getType() {}
}