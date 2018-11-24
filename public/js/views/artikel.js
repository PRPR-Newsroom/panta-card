t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    return t.get('card', 'shared', ArtikelController.SHARED_NAME)
        .then(function (jsonobj) {
            cm.getArticleController().render(Artikel.create(jsonobj));
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
                    cm.getArticleController().insert(Artikel.create(json), card);
                });
        })
        .then(function() {
            if (cm.getPluginController().upgrading) {
                cm.getArticleController().blockUi();
            } else {
                cm.getArticleController().update();
            }
        })

        .then(function () {
            t.sizeTo('#panta\\.artikel').done();
        })
});
