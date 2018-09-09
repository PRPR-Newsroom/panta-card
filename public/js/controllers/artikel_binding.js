class ArtikelBinding {

    constructor(document, entity, action, context) {

        /**
         * @type {HTMLDocument}
         */
        this.document = document;

        /**
         * @type {function(source, ctx)}
         */
        this._action = action;
        
        this._context = context;

        /**
         * @type {Artikel}
         * @private
         */
        this._artikel = entity;
    }

    update() {
        return this;
    }

    bind() {
        this._topic = new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)
            .bind(this._artikel, 'topic')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._from = new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")
            .bind(this._artikel, 'from')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._author = new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")
            .bind(this._artikel, 'author')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._text = new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 2)
            .bind(this._artikel, 'text')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._pagina = new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")
            .bind(this._artikel, 'pagina')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._layout = new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")
            .bind(this._artikel, 'layout')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._total = new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe")
            .bind(this._artikel, 'total')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._tags = new SingleSelectInput(this.document, "Online", null, "pa.tags", "Liste-Tag")
            .addOption("monday", "Mo.")
            .addOption("tuesday", "Di.")
            .addOption("wednesday", "Mi.")
            .addOption("thursday", "Do.")
            .addOption("friday", "Fr.")
            .addOption("saturday", "Sa.")
            .addOption("sunday", "So.")
            .bind(this._artikel, 'tags')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._visual = new SingleSelectInput(this.document, "Visual", null, "pa.visual", "x-Liste")
            .addOption("picture", "Bild")
            .addOption("icon", "Icon")
            .addOption("graphics", "Grafik")
            .addOption("videos", "Video")
            .addOption("illustrations", "Illu")
            .bind(this._artikel, 'visual')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._region = new SingleSelectInput(this.document, "Region", null, "pa.region", "x-Liste")
            .addOption("nord", "Nord")
            .addOption("south", "Süd")
            .bind(this._artikel, 'region')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._season = new SingleSelectInput(this.document, "Saison", null, "pa.season", "x-Liste")
            .addOption("summer", "Sommer")
            .addOption("fall", "Herbst")
            .bind(this._artikel, 'season')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
         new SingleLineInput(this.document, "", null, "pa.additional.1", "", true)
            .render();
        new SingleLineInput(this.document, "", null, "pa.additional.2", "", true)
            .render();
        return this;
    }

}