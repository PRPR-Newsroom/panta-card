TrelloPowerUp.initialize({
    'card-buttons': function (t, options) {
        return [{
            icon: './assets/ic_pantarhei.png',
            text: 'panta.Card',
            callback: function (t) {
                return t.popup({
                    title: "Einstellungen",
                    url: "settings.html"
                })
            }
        }];
    },
    'card-badges': function (t, options) {
        window.articleController = new ArtikelController(document, t);
        return t.card('id')
            .then(function (card) {
                return t.get(card.id, 'shared', ArtikelController.SHARED_NAME)
                    .then(function (list_data) {
                        return Artikel.create(list_data);
                    })
                    .then(function (artikel) {
                        window.articleController.insert(artikel, card);
                        return card;
                    });
            })
            .then(function (card) {
                let badges = [];
                let artikel = window.articleController.getByCard(card);
                let counter = artikel.getInvolvedCount();

                if (window.articleController.hasArtikelContent(artikel)) {
                    badges.push({
                        text: "",
                        icon: './assets/ic_artikel.png'
                    });

                    if (artikel.region) {
                        badges.push({
                            text: 'region: ' + window.articleController.getRegionMapping(artikel.region),
                            color: 'sky'
                        });
                    }
                    if (artikel.tags) {
                        badges.push({
                            text: 'online: ' + window.articleController.getTagMapping(artikel.tags),
                            color: 'blue'
                        });
                    }
                }

                if (counter > 0) {
                    badges.push({
                        text: counter,
                        icon: './assets/ic_beteiligt.png'
                    });
                }

                return badges;
            })
    },
    'card-back-section': function (t, opts) {
        // Your Power-Up can have only one card back section and a maximum height of 500 pixels.
        return [{
            title: 'Artikel',
            icon: './assets/ic_pantarhei.png',
            content: {
                type: 'iframe',
                url: t.signUrl('./artikel.html', {}),
                height: 500 // Max height is 500
            }
        }]
    },
    'list-sorters': function (t) {
        window.articleController = new ArtikelController(document, t);
        return t.list('id', 'name')
            // .each(function (card) {
            //     return t.get(card.id, 'shared', ArtikelController.SHARED_NAME)
            //         .then(function (list_data) {
            //             return Artikel.create(list_data);
            //         })
            //         .then(function (artikel) {
            //             window.articleController.insert(artikel, card);
            //             return window.articleController;
            //         });
            // })
            // .then(function (list) {
            //     return [{
            //         text: "Pagina (1 -> 99)",
            //         callback: function (t, opts) {
            //             return sortOnPagina(t, opts, "asc");
            //         }
            //     }, {
            //         text: "Online (Mo. -> So.)",
            //         callback: function (t, opts) {
            //             return sortOnTags(t, opts, "asc");
            //         }
            //     }];
            // })
            .then(function(list) {
                    return [{
                        text: "Pagina (1 -> 99)",
                        callback: function (t, opts) {
                            let artikel = Artikel.create(list);
                            for (let card in opts.cards) {
                                window.articleController.insert(artikel, card);
                            }
                            return sortOnPagina(t, opts, "asc");
                        }
                    }, {
                        text: "Online (Mo. -> So.)",
                        callback: function (t, opts) {
                            let artikel = Artikel.create(list);
                            for (let card in opts.cards) {
                                window.articleController.insert(artikel, card);
                            }
                            return sortOnTags(t, opts, "asc");
                        }
                    }];
            })
            ;
    }
});

function sortOnPagina(t, opts, sort) {
    // Trello will call this if the user clicks on this sort
    // opts.cards contains all card objects in the list
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = window.articleController.getByCard(lhs_card);
            let rhs = window.articleController.getByCard(rhs_card);
            let lhsp = parseInt(lhs.pagina || "0");
            let rhsp = parseInt(rhs.pagina || "0");
            if (lhsp > rhsp) {
                return sort === "asc" ? 1 : -1;
            } else if (rhsp > lhsp) {
                return sort === "asc" ? -1 : 1;
            }
            return 0;
        });

    return {
        sortedIds: sortedCards.map(function (c) {
            return c.id;
        })
    };
}

function sortOnTags(t, opts, sort) {
    // Trello will call this if the user clicks on this sort
    // opts.cards contains all card objects in the list
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = window.articleController.getByCard(lhs_card);
            let rhs = window.articleController.getByCard(rhs_card);
            let lhsp = map(lhs.tags);
            let rhsp = map(rhs.tags);
            if (lhsp > rhsp) {
                return sort === "asc" ? 1 : -1;
            } else if (rhsp > lhsp) {
                return sort === "asc" ? -1 : 1;
            }
            return 0;
        });

    return {
        sortedIds: sortedCards.map(function (c) {
            return c.id;
        })
    };
}

function map(tag) {
    if (!tag) {
        return -1;
    }
    switch (tag) {
        case "monday":
            return 0;
        case "tuesday":
            return 1;
        case "wednesday":
            return 2;
        case "thursday":
            return 3;
        case "friday":
            return 4;
        case "saturday":
            return 5;
        case "sunday":
            return 6;
        default:
            return 7;
    }
}