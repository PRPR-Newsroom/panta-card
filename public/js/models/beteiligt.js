class Beteiligt {

    constructor(onsite, text, photo, video, graphics, publications) {
        this._onsite = onsite;
        this._text = text;
        this._photo = photo;
        this._video = video;
        this._graphics = graphics;
        this._publications = publications;
    }

    get onsite() {
        return this._onsite;
    }

    set onsite(value) {
        this._onsite = value;
    }

    get text() {
        return this._text;
    }

    set text(value) {
        this._text = value;
    }

    get photo() {
        return this._photo;
    }

    set photo(value) {
        this._photo = value;
    }

    get video() {
        return this._video;
    }

    set video(value) {
        this._video = value;
    }

    get graphics() {
        return this._graphics;
    }

    set graphics(value) {
        this._graphics = value;
    }

    get publications() {
        return this._publications;
    }

    set publications(value) {
        this._publications = value;
    }
}