ArtikelController.prepare(t);

t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    return t.get('card', 'shared', ArtikelController.SHARED_NAME)
        .then(function (jsonobj) {
            window.articleController.render(Artikel.create(jsonobj));
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
                    window.articleController.insert(Artikel.create(json), card);
                });
        })
        .then(function() {
            if (window.pluginController.upgrading) {
                window.articleController.blockUi();
            } else {
                window.articleController.update();
            }
        })

        .then(function () {
            t.sizeTo('#panta\\.artikel').done();
        })
});
