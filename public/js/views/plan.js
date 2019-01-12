/**
 * @type {ModulePlanController}
 */
let planController = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init().getPlanController();

t.render(function () {
    // s. http://bluebirdjs.com/docs/api-reference.html
    // .each exists
    // noinspection JSUnresolvedFunction

    return t.get('card', 'shared', ModulePlanController.SHARED_NAME)
        .then(function (jsonobj) {
            planController.render(Plan.create(jsonobj));
        })
        .then(function() {
            return t.cards('id', 'closed');
        })
        .filter(function(card) {
            return !card.closed;
        })
        .each(function(card) {
            return t.get(card.id, 'shared', ModulePlanController.SHARED_NAME)
                .then(function(json) {
                    planController.insert(Plan.create(json), card);
                });
        })
        .then(function(card) {
            planController.update();
        })
        .then(function () {
            t.sizeTo('#panta\\.module\\.plan').done();
        })
});
