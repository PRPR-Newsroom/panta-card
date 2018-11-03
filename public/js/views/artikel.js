// let btSave = document.getElementById("bt_save");
let isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) !== null;
if (!isMobile) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/panta.responsive.css';
    link.media = 'all';
    head.appendChild(link);
} else {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/panta.mobile.css';
    link.media = 'all';
    head.appendChild(link);
}

let btDelete = document.getElementById("bt_delete");
let t = TrelloPowerUp.iframe();

if (btDelete) {
    btDelete.addEventListener('click', function (event) {
        event.preventDefault();
        return t.remove('card', 'shared', ArtikelController.SHARED_NAME)
            .then(function () {
                t.closeModal();
            });
    });
}

function showTab(what) {
    var content = document.getElementById("tab-content");
    while (content.firstChild) {
        content.removeChild(content.firstChild);
    }

    var input = document.createElement("textarea");
    input.setAttribute("name", what + "_data");
    input.setAttribute("placeholder", "Eingabefeld für " + what);
    if (panta) {
        var options = panta["options"];
        if (options && options[what + "_data"]) {
            input.appendChild(document.createTextNode(options[what + "_data"]));
        }
    }
    content.appendChild(input);
}

let articleController = new ArtikelController(document, t);
t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    return t.get('card', 'shared', ArtikelController.SHARED_NAME)
        .then(function (jsonobj) {
            articleController.render(Artikel.create(jsonobj));
        })
        .then(function() {
            return t.cards('id', 'closed');
        })
        .filter(function(card) {
            return !card.closed;
        })
        .each(function(card) {
            return t.get(card.id, 'shared', ArtikelController.SHARED_NAME)
                .then(function(json) {
                    articleController.insert(Artikel.create(json), card);
                });
        })
        .then(function() {
            articleController.update();
        })

        .then(function () {
            t.sizeTo('#panta\\.artikel').done();
        })
});
