/**
 * @type {ModuleController}
 */
let moduleController = ModuleController.getInstance(t);
t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction
    return t.get('card', 'shared', ModuleController.SHARED_NAME)
        .then(function (jsonobj) {
            moduleController.render(ModuleConfig.create(jsonobj));
        })
        .then(function() {
            return t.cards('id', 'closed');
        })
        .filter(function(card) {
            return !card.closed;
        })
        .each(function(card) {
            return t.get(card.id, 'shared', ModuleController.SHARED_NAME)
                .then(function(json) {
                    moduleController.insert(ModuleConfig.create(json), card);
                });
        })
        .then(function() {
            moduleController.update();
        })
        .then(function () {
            t.sizeTo('#panta\\.module').done();
        })
});
