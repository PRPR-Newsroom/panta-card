
class AbstractItem {
    constructor() {
    }

    decorate(element) {

        element.addClass("panta-item");
        element.setEventListener('mouseenter', function(e) {
            element.addClass("hovered");
        });
        element.setEventListener('mouseleave', function(e) {
            element.removeClass("hovered");
        });
        return this;
    }

}