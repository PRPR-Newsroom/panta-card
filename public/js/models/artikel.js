class Artikel {

    /**
     *
     * @param topic Textfeld – Stichwort zum Inhalt immer fix hinterlegt
     * @param pagina Fixe Zahl, entspricht der Seitenzahl = Start des Arikels in einem Projekt. Ist zentral für das SORTIEREN innerhalb der Liste
     * @param layout Zahlenfeld = Anzahl Seiten dieses Artikels im Layout
     * @param tags ?
     * @param visual ?
     * @param region Beispiele für Dropdown-Felder, nach Projekt anpassbar
     * @param season Beispiele für Dropdown-Felder, nach Projekt anpassbar
     * @param author Name des Authors
     * @param text Ein Textfeld für eine kurze Inhaltsangabe
     */
    constructor(topic, pagina, layout, total, tags, visual, region, season, author, text) {
        this._topic = topic;
        this._pagina = pagina;
        this._involved = null;
        this._pagina = pagina;
        this._layout = layout;
        this._total = total;
        this._tags = tags;
        this._visual = visual;
        this._region = region;
        this._season = season;
        this._author = author;
        this._text = text;
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

    get involved() {
        return this._involved;
    }

    set involved(value) {
        this._involved = value;
    }
}