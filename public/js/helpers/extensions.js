HTMLElement.prototype.addClass = function (name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) === -1) {
        this.className += " " + name;
        this.className = this.className.trim();
    }
};

HTMLElement.prototype.removeClass = function (name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) !== -1) {
        let new_names = "";
        names.forEach(function (value, index) {
            if (value !== name) {
                new_names += " " + value;
            }
        });
        this.className = new_names.trim();
    }
};

HTMLElement.prototype.removeChildren = function () {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
};

function uuid() {
    let dt = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}