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

        /**
         * @type {ArtikelController}
         */
        this._context = context;

        /**
         * @type {Artikel}
         * @private
         */
        this._entity = entity;

        this._autoUpdater = null;
    }


    /**
     * This is called when a property has changed and thus the form needs an update. All fields of the panta.Artikel are updated
     * @param artikel
     * @returns {ArtikelBinding}
     */
    update(artikel) {
        this._topic.update(artikel);
        this._from.update(artikel);
        this._author.update(artikel);
        this._text.update(artikel);
        this._pagina.update(artikel);
        this._layout.update(artikel);
        this._total.update(artikel);
        this._tags.update(artikel);
        this._visual.update(artikel);
        this._region.update(artikel);
        this._season.update(artikel);
        this._form.update(artikel);
        this._location.update(artikel);
        return this;
    }

    /**
     * Do the binding resp. render the panta.Artikel
     * @returns {ArtikelBinding}
     */
    bind() {
        let params = {'context': this._context, 'artikel': this._entity};
        let valueHolder = {'data': this._entity};
        this._topic = this.document.newMultiLineInput(valueHolder, "pa.topic", 'topic', 'Thema', params, this._action, 2, "Lauftext");
        this._from = this.document.newSingleLineInput(valueHolder, 'pa.input-from', 'from', 'Input von', params, this._action, "Name");
        this._author = this.document.newSingleLineInput(valueHolder, 'pa.author', 'author', 'Textautor*in', params, this._action, 'Name');
        this._text = this.document.newMultiLineInput(valueHolder, 'pa.text', 'text', 'Textbox', params, this._action, 2, 'Lauftext');
        this._pagina = this.document.newSingleLineInput(valueHolder, 'pa.pagina', 'pagina', 'Pagina', params, this._action, 'Zahl', 'number', false)
            .addClass('pagina')
            .addClass('bold');
        this._layout = this.document.newSingleLineInput(valueHolder, 'pa.layout', 'layout', 'Seiten Layout', params, this._action, 'Zahl', 'number', false);
        this._total = this.document.newSingleLineInput(valueHolder, 'pa.total', 'total', 'Seiten Total', params, this._action, 'Summe', 'number', true)
            .addClass('bold');

        this._tags = this.document.newSingleSelect(valueHolder, 'pa.tags', 'tags', 'Online', params, this._action, 'Liste-Tag', newOption('', '…'), [
            newOption("monday", ArtikelBinding.getTagMapping("monday")),
            newOption("tuesday", ArtikelBinding.getTagMapping("tuesday")),
            newOption("wednesday", ArtikelBinding.getTagMapping("wednesday")),
            newOption("thursday", ArtikelBinding.getTagMapping("thursday")),
            newOption("friday", ArtikelBinding.getTagMapping("friday")),
            newOption("saturday", ArtikelBinding.getTagMapping("saturday")),
            newOption("sunday", ArtikelBinding.getTagMapping("sunday")),
        ]);

        this._visual = this.document.newSingleSelect(valueHolder, 'pa.visual', 'visual', 'Visual', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("picture", "Bild"),
            newOption("icon", "Icon"),
            newOption("graphics", "Grafik"),
            newOption("videos", "Video"),
            newOption("illustrations", "Illu"),
        ]);

        this._region = this.document.newSingleSelect(valueHolder, 'pa.region', 'region', 'Region', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("north", ArtikelBinding.getRegionMapping("north")),
            newOption("south", ArtikelBinding.getRegionMapping("south")),
        ]);
        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._season = this.document.newSingleSelect(valueHolder, 'pa.season', 'season', 'Saison', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("summer", "Sommer"),
            newOption("fall", "Herbst"),
        ]);

        /**
         * @type {SingleSelectInput}
         * @private
         */
        this._form = this.document.newSingleSelect(valueHolder, 'pa.form', 'form', 'Form', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("news", "News"),
            newOption("article", "Artikel"),
            newOption("report", "Report"),
        ]);
        this._location = this.document.newSingleSelect(valueHolder, 'pa.location', 'location', 'Ort', params, this._action, 'x-Liste', newOption('', '…'), [
            newOption("cds", "CDS"),
            newOption("sto", "STO"),
            newOption("tam", "TAM"),
            newOption("wid", "WID"),
            newOption("buech", "Buech"),
            newOption("rustico", "Rustico"),
            newOption("schlatt", "Schlatt"),
        ]);

        return this;
    }

    blockUi() {
        if (this.document.getElementsByClassName('overlay').length > 0) {
            return;
        }
        let that = this;
        let overlay = this.document.createElement("div");
        overlay.addClass("overlay");

        overlay.appendChild(this.document.createTextNode("Plugin Daten werden aktualisiert..."));

        this.document.getElementsByTagName("body").item(0).appendChild(overlay);
        this._autoUpdater = this._autoUpdater || setInterval(function() {
            that._context.canUnblock();
        }, 500);
    }

    unblock() {
        this.document.getElementsByClassName("overlay").forEach(null, function(item) {
            item.parentNode.removeChild(item);
        });
        if (this._autoUpdater) {
            clearInterval(this._autoUpdater);
        }
    }

}