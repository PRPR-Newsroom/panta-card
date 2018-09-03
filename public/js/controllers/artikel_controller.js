
class ArtikelController {

    static get SHARED_NAME() {
        return "panta.Artikel";
    }

    constructor(document, trelloApi) {
        this.document = document;
        this.trelloApi = trelloApi;
        this._entity = null;
        this._topic = null;
    }

    getArtikel() {
        return new Artikel();
        /*
        var option_onsite = document.getElementsByName("option_onsite")[0].checked === true || getData("onsite").length > 0;
    var option_text = document.getElementsByName("option_text")[0].checked === true || getData("text").length > 0;
    var option_photo = document.getElementsByName("option_photo")[0].checked === true || getData("photo").length > 0;
    var option_video = document.getElementsByName("option_video")[0].checked === true;
    var option_illu = document.getElementsByName("option_illu")[0].checked === true;
    var option_pubs = document.getElementsByName("option_pubs")[0].checked === true;

    var saldo_text = document.getElementsByName("saldo_text")[0].checked === true;
    var saldo_photo = document.getElementsByName("saldo_photo")[0].checked === true;
    var saldo_video = document.getElementsByName("saldo_video")[0].checked === true;
    var saldo_illu = document.getElementsByName("saldo_illu")[0].checked === true;
    var saldo_pubs = document.getElementsByName("saldo_pubs")[0].checked === true;
         */
    }

    /**
     * @param (Artikel) artikel
     */
    render(artikel) {
        this._entity = artikel ? artikel : new Artikel();
        if (this._topic === null) {
            this._topic = new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 2)
                .bind(this._entity, 'topic')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name")
                .bind(this._entity, 'from')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Textautor*in", null, "pa.author", "Name")
                .bind(this._entity, 'author')
                .onChange(this.putData, this)
                .render();
            new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 2)
                .bind(this._entity, 'text')
                .onChange(this.putData, this)
                .render();

            new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl")
                .bind(this._entity, 'pagina')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Seiten Layout", null, "pa.layout", "Zahl")
                .bind(this._entity, 'layout')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Seiten Total", null, "pa.total", "Summe")
                .bind(this._entity, 'total')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Online", null, "pa.tags", "Liste-Tag")
                .bind(this._entity, 'tags')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Visual", null, "pa.visual", "x-Liste")
                .bind(this._entity, 'visual')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Region", null, "pa.region", "x-Liste")
                .bind(this._entity, 'region')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Saison", null, "pa.season", "x-Liste")
                .bind(this._entity, 'season')
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "", null, "pa.additional.1", "", true)
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "", null, "pa.additional.2", "", true)
                .onChange(this.putData, this)
                .render();

            // beteiligt: onsite
            new SingleLineInput(this.document, "Name", null, "pa.onsite.name", "")
                .onChange(this.putData, this)
                .render();
            new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, "pa.onsite.social", "", 2)
                .onChange(this.putData, this)
                .render();
            new MultiLineInput(this.document, "Adresse", null, "pa.onsite.address", "", 2)
                .onChange(this.putData, this)
                .render();

            new SingleLineInput(this.document, "Format", null, "pa.onsite.format", "Beispiel: A4")
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Platzierung", null, "pa.onsite.placement", "")
                .onChange(this.putData, this)
                .render();
            new MultiLineInput(this.document, "Notiz", null, "pa.onsite.notes", "", 2)
                .onChange(this.putData, this)
                .render();
            new SingleLineInput(this.document, "Preis CHF", null, "pa.onsite.price", "")
                .render();
            new SingleLineInput(this.document, "Total CHF", null, "pa.onsite.total", "", true)
                .render();
        } else {
            this._topic.update(this._entity);
        }

        /*
        const options = artikel["options"];
                if (options) {
                    document.getElementsByName("option_onsite")[0].checked = options["onsite"] === true || options["onsite_data"];
                    document.getElementsByName("option_text")[0].checked = options["text"] === true || options["text_data"];
                    document.getElementsByName("option_photo")[0].checked = options["photo"] === true || options["photo_data"];
                    document.getElementsByName("option_video")[0].checked = options["video"] === true;
                    document.getElementsByName("option_illu")[0].checked = options["illu"] === true;
                    document.getElementsByName("option_pubs")[0].checked = options["pubs"] === true;
                }
                const saldo = artikel["saldo"];
                if (saldo) {
                    document.getElementsByName("saldo_text")[0].checked = saldo["text"] === true;
                    document.getElementsByName("saldo_photo")[0].checked = saldo["photo"] === true;
                    document.getElementsByName("saldo_video")[0].checked = saldo["video"] === true;
                    document.getElementsByName("saldo_illu")[0].checked = saldo["illu"] === true;
                    document.getElementsByName("saldo_pubs")[0].checked = saldo["pubs"] === true;
                }
         */
    }

    putData(source, ctx) {
        source.setProperty();
        ctx.trelloApi.set('card', 'shared', ArtikelController.SHARED_NAME, source.getBinding());
        console.log("Stored: " + source.getBoundProperty() + " = " + source.getValue());
    }

    getData(artikel, what) {
        if (this.document.getElementsByName(what + "_data").length === 1) {
            return this.document.getElementsByName(what + "_data")[0].value;
        } else if (artikel && artikel.options && artikel.options[what + "_data"]) {
            return artikel.options[what + "_data"];
        } else {
            return "";
        }
    }

}