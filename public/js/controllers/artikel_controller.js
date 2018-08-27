
class ArtikelController {

    static get SHARED_NAME() {
        return "panta.Artikel";
    }

    constructor(document) {
        this.document = document;
    }

    getArtikel() {
        return new Artikel(
            this.document.getElementsByName("thema")[0].value,
            this.document.getElementsByName("pagina")[0].value,
            this.document.getElementsByName("page_layout")[0].value,
            this.document.getElementsByName("page_total")[0].value,
            null, null,
            this.document.getElementsByName("region")[0].value,
            this.document.getElementsByName("season")[0].value,
            null,
            this.document.getElementsByName("textbox")[0].value
        );
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
        if (artikel) {
            new MultiLineInput(this.document, "Thema", artikel.topic, "pa.topic").render();

            this.document.getElementsByName("pagina")[0].value = artikel.pagina;
            this.document.getElementsByName("page_layout")[0].value = artikel.layout;
            this.document.getElementsByName("page_total")[0].value = artikel.total;

            this.document.getElementsByName("textbox")[0].value = artikel.text;

            this.document.getElementsByName("region")[0].value = artikel.region;
            this.document.getElementsByName("season")[0].value = artikel.season;
        } else {
            new MultiLineInput(this.document, "Thema", null, "pa.topic", "Lauftext", 8).render();
            new SingleLineInput(this.document, "Input von", null, "pa.input-from", "Name").render();
            new SingleLineInput(this.document, "Textautor* in", null, "pa.author", "Name").render();
            new MultiLineInput(this.document, "Textbox", null, "pa.text", "Lauftext", 7).render();

            new SingleLineInput(this.document, "Pagina", null, "pa.pagina", "Zahl").render();
            new SingleLineInput(this.document, "S. Layout", null, "pa.layout", "Zahl").render();
            new SingleLineInput(this.document, "S. Total", null, "pa.total", "Summe").render();
            new SingleLineInput(this.document, "Online", null, "pa.tags", "Liste-Tag").render();
            new SingleLineInput(this.document, "Visual", null, "pa.visual", "x-Liste").render();
            new SingleLineInput(this.document, "Region", null, "pa.region", "x-Liste").render();
            new SingleLineInput(this.document, "Saison", null, "pa.season", "x-Liste").render();

            // beteiligt: onsite
            new SingleLineInput(this.document, "Name", null, "pa.onsite.name", "").render();
            new MultiLineInput(this.document, "Telefon.Mail.Webseite", null, "pa.onsite.social", "", 3).render();
            new MultiLineInput(this.document, "Adresse", null, "pa.onsite.address", "", 3).render();

            new SingleLineInput(this.document, "Format", null, "pa.onsite.format", "Beispiel: A4").render();
            new SingleLineInput(this.document, "Platzierung", null, "pa.onsite.placement", "").render();
            new MultiLineInput(this.document, "Notiz", null, "pa.onsite.notes", "", 4).render();
            new SingleLineInput(this.document, "Preis CHF", null, "pa.onsite.price", "").render();
            new SingleLineInput(this.document, "Total CHF", null, "pa.onsite.total", "", true).render();
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