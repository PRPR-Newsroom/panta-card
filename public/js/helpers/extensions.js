
HTMLElement.prototype.addClass = function(name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) === -1) {
        this.className += " " + name;
        this.className = this.className.trim();
    }
};

HTMLElement.prototype.removeClass = function(name) {
    let names = this.className.split(" ");
    if (names.indexOf(name) !== -1) {
        let new_names = "";
        names.forEach(function(value, index) {
            if (value !== name) {
                new_names += " " + value;
            }
        });
        this.className = new_names.trim();
    }
};

HTMLElement.prototype.removeChildren = function() {
    while (this.firstChild) {
        this.removeChild(this.firstChild);
    }
}