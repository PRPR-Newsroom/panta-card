class Artikel {

    /**
     * Create a new artikel out of this json object
     * @param json
     * @returns {Artikel}
     */
    static create(json) {
        return this._create(json);
    }

    /**
     * Create a new artikel using this json object
     * @param json
     * @returns {Artikel}
     * @private
     */
    static _create(json) {
        if (json) {
            let region = JsonSerialization.getProperty(json, 'region');
            if (region === 'nord') {
                region = 'north';
            }
            let artikel = new Artikel(
                JsonSerialization.getProperty(json, 'id'),
                JsonSerialization.getProperty(json, 'topic'),
                JsonSerialization.getProperty(json, 'pagina'),
                JsonSerialization.getProperty(json, 'from'),
                JsonSerialization.getProperty(json, 'layout'),
                JsonSerialization.getProperty(json, 'total'),
                JsonSerialization.getProperty(json, 'tags'),
                JsonSerialization.getProperty(json, 'visual'),
                region,
                JsonSerialization.getProperty(json, 'season'),
                JsonSerialization.getProperty(json, 'author'),
                JsonSerialization.getProperty(json, 'text'),
                JsonSerialization.getProperty(json, 'location'),
                JsonSerialization.getProperty(json, 'form')
            );
            // involved constains the whole panta.Beteiligt datastore
            artikel.involved = JsonSerialization.getProperty(json, 'involved');
            return artikel;
        } else {
            return new Artikel();
        }
    }

    /**
     *
     * @param id string
     * @param topic Textfeld – Stichwort zum Inhalt immer fix hinterlegt
     * @param pagina Fixe Zahl, entspricht der Seitenzahl = Start des Arikels in einem Projekt. Ist zentral für das SORTIEREN innerhalb der Liste
     * @param from Input von
     * @param layout Zahlenfeld = Anzahl Seiten dieses Artikels im Layout
     * @param total Total Anzahl Seiten
     * @param tags ?
     * @param visual ?
     * @param region Beispiele für Dropdown-Felder, nach Projekt anpassbar
     * @param season Beispiele für Dropdown-Felder, nach Projekt anpassbar
     * @param author Name des Authors
     * @param text Ein Textfeld für eine kurze Inhaltsangabe
     * @param form
     * @param location
     */
    constructor(id, topic, pagina, from, layout, total, tags, visual, region, season, author, text, form, location) {
        this._id = id || uuid();
        this._topic = topic;
        this._pagina = pagina;
        this._from = from;
        this._layout = layout;
        this._total = total;
        this._tags = tags;
        this._form = form;
        this._visual = visual;
        this._region = region;
        this._season = season;
        this._location = location;
        this._author = author;
        this._text = text;
        this._involved = {};
        this.putInvolved('onsite', new OtherBeteiligt());
        this.putInvolved('text', new OtherBeteiligt());
        this.putInvolved('photo', new OtherBeteiligt());
        this.putInvolved('video', new OtherBeteiligt());
        this.putInvolved('illu', new OtherBeteiligt());
        this.putInvolved('ad', new AdBeteiligt());
    }

    /**
     * Get the associated involved container
     * @param name
     * @returns {CommonBeteiligt}
     */
    getInvolvedFor(name) {
        return this._involved[name];
    }

    /**
     * Put a new involved container onto the model and associate it with the given name
     * @param name
     * @param involved
     */
    putInvolved(name, involved) {
        this._involved[name] = involved;
    }

    /**
     * Get the number of involvements
     * @returns {number}
     */
    getInvolvedCount() {
        let that = this;
        let count = 0;
        Object.keys(this._involved).forEach(function(key) {
            if (!that.getInvolvedFor(key).isEmpty()) {
                count++;
            }
        });
        return count;
    }

    // GETTER & SETTER

    get id() {
        return this._id;
    }

    set id(value) {
        this._id = value;
    }

    get involved() {
        return this._involved;
    }

    set involved(involved) {
        for (let key in involved) {
            if (involved.hasOwnProperty(key)) {
                switch (key) {
                    case 'onsite':
                    case 'text':
                    case 'photo':
                    case 'video':
                    case 'illu':
                        this.putInvolved(key, OtherBeteiligt.create(involved[key]));
                        break;
                    case 'ad':
                        this.putInvolved(key, AdBeteiligt.create(involved[key]));
                        break;
                    default:
                        console.log("Unknown involved part: " + key);
                        break;
                }
            }
        }
    }

    get from() {
        return this._from;
    }

    set from(value) {
        this._from = value;
    }

    get location() {
        return this._location;
    }

    set location(value) {
        this._location = value;
    }

    get topic() {
        return this._topic;
    }

    set topic(value) {
        this._topic = value;
    }

    get pagina() {
        return this._pagina;
    }

    set pagina(value) {
        this._pagina = value;
    }

    get layout() {
        return this._layout;
    }

    set layout(value) {
        this._layout = value;
    }

    get total() {
        return this._total;
    }

    set total(value) {
        this._total = value;
    }

    get tags() {
        return this._tags;
    }

    set tags(value) {
        this._tags = value;
    }

    get form() {
        return this._form;
    }

    set form(value) {
        this._form = value;
    }

    get visual() {
        return this._visual;
    }

    set visual(value) {
        this._visual = value;
    }

    get region() {
        return this._region;
    }

    set region(value) {
        this._region = value;
    }

    get season() {
        return this._season;
    }

    set season(value) {
        this._season = value;
    }

    get author() {
        return this._author;
    }

    set author(value) {
        this._author = value;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

}