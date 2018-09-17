/**
 * This artikel binding class binds an artikel with the view/layout
 */
class ArtikelBinding {

    /**
     * Get the german name for that region
     * @param region
     * @returns {*}
     */
    static getRegionMapping(region) {
        switch (region) {
            case "nord":
            case "north":
                return "Nord";
            case "south":
                return "Süd";
            default:
                return region;
        }
    }

    /**
     * Get the german name for that 'tag' (day)
     * @param tag
     * @returns {*}
     */
    static getTagMapping(tag) {
        switch (tag) {
            case "monday":
                return "Mo.";
            case "tuesday":
                return "Di.";
            case "wednesday":
                return "Mi.";
            case "thursday":
                return "Do.";
            case "friday":
                return "Fr.";
            case "saturday":
                return "Sa.";
            case "sunday":
                return "So.";
            default:
                return tag;
        }
    }

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



    /**
     * This is called when
     * @param artikel
     * @returns {ArtikelBinding}
     */
    update(artikel) {
        this._total.update(artikel);
        this._layout.update(artikel);
        return this;
    }

    bind() {
        // TODO simplify these line using a factory (like in beteiligt binding)
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
            .addClass("pagina")
            .addClass("bold")
            .bind(this._artikel, 'pagina')
            .setPropertyType("number")
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._layout = new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")
            .setPropertyType("number")
            .bind(this._artikel, 'layout')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._total = new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe", true)
            .setPropertyType("number")
            .addClass("bold")
            .bind(this._artikel, 'total')
            .render();
        this._total.propertyType = "number";
        this._tags = new SingleSelectInput(this.document, "Online", null, "pa.tags", "Liste-Tag")
            .addOption("monday", ArtikelBinding.getTagMapping("monday"))
            .addOption("tuesday", ArtikelBinding.getTagMapping("tuesday"))
            .addOption("wednesday", ArtikelBinding.getTagMapping("wednesday"))
            .addOption("thursday", ArtikelBinding.getTagMapping("thursday"))
            .addOption("friday", ArtikelBinding.getTagMapping("friday"))
            .addOption("saturday", ArtikelBinding.getTagMapping("saturday"))
            .addOption("sunday", ArtikelBinding.getTagMapping("sunday"))
            .setEmpty("", "…")
            .bind(this._artikel, 'tags')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._visual = new SingleSelectInput(this.document, "Visual", null, "pa.visual", "x-Liste")
            .addOption("picture", "Bild")
            .addOption("icon", "Icon")
            .addOption("graphics", "Grafik")
            .addOption("videos", "Video")
            .addOption("illustrations", "Illu")
            .setEmpty("", "…")
            .bind(this._artikel, 'visual')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._region = new SingleSelectInput(this.document, "Region", null, "pa.region", "x-Liste")
            .addOption("north", ArtikelBinding.getRegionMapping("north"))
            .addOption("south", ArtikelBinding.getRegionMapping("south"))
            .setEmpty("", "…")
            .bind(this._artikel, 'region')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._season = new SingleSelectInput(this.document, "Saison", null, "pa.season", "x-Liste")
            .addOption("summer", "Sommer")
            .addOption("fall", "Herbst")
            .setEmpty("", "…")
            .bind(this._artikel, 'season')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._form = new SingleSelectInput(this.document, "Form", null, "pa.form", "x-Liste")
            .addOption("news", "News")
            .addOption("article", "Artikel")
            .addOption("report", "Report")
            .setEmpty("", "…")
            .bind(this._artikel, 'form')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();
        this._location = new SingleSelectInput(this.document, "Ort", null, "pa.location", "x-Liste")
            .addOption("cds", "CDS")
            .addOption("sto", "STO")
            .addOption("tam", "TAM")
            .addOption("wid", "WID")
            .addOption("buech", "Buech")
            .addOption("rustico", "Rustico")
            .addOption("schlatt", "Schlatt")
            .setEmpty("", "…")
            .bind(this._artikel, 'location')
            .onChange(this._action, { 'context': this._context, 'artikel': this._artikel })
            .render();

        new SingleLineInput(this.document, "", null, "pa.additional.1", "", true)
            .render();
        new SingleLineInput(this.document, "", null, "pa.additional.2", "", true)
            .render();
        return this;
    }

}