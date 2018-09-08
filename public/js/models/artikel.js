class Artikel {

    static create(json) {
        let artikel = new Artikel(
            JsonSerialization.getProperty(json, 'topic'),
            JsonSerialization.getProperty(json, 'pagina'),
            JsonSerialization.getProperty(json, 'from'),
            JsonSerialization.getProperty(json, 'layout'),
            JsonSerialization.getProperty(json, 'total'),
            JsonSerialization.getProperty(json, 'tags'),
            JsonSerialization.getProperty(json, 'visual'),
            JsonSerialization.getProperty(json, 'region'),
            JsonSerialization.getProperty(json, 'season'),
            JsonSerialization.getProperty(json, 'author'),
            JsonSerialization.getProperty(json, 'text')
        );
        artikel.involved = JsonSerialization.getProperty(json, 'involved');
        return artikel;
    }



    /**
     *
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
     */
    constructor(topic, pagina, from, layout, total, tags, visual, region, season, author, text) {
        this._topic = topic;
        this._pagina = pagina;
        this._from = from;
        this._layout = layout;
        this._total = total;
        this._tags = tags;
        this._visual = visual;
        this._region = region;
        this._season = season;
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

    getInvolvedFor(name) {
        return this._involved[name];
    }

    putInvolved(name, involved) {
        this._involved[name] = involved;
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