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
        ArtikelController.prepare(t);
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
        return t.list('id', 'name')
            .then(function(list) {
                    return [{
                        text: "Pagina (1 -> 99)",
                        callback: function (t, opts) {
                            return sortOnPagina(getArticleControllerWith(t, list, opts), t, opts, "asc");
                        }
                    }, {
                        text: "Online (Mo. -> So.)",
                        callback: function (t, opts) {
                            return sortOnTags(getArticleControllerWith(t, list, opts), t, opts, "asc");
                        }
                    }];
            });
    }
});

/**
 * Get an articleController for this list and options
 * @param list the trello list
 * @param opts the trello callback options that contain the cards within this list
 * @returns {ArtikelController}
 */
function getArticleControllerWith(t, list, opts) {
    ArtikelController.prepare(t);

    for (let index in opts.cards) {
        let card = opts.cards[index];
        // let artikel = Promise.all([t.get(card.id, 'shared', ArtikelController.SHARED_NAME)]).then(function(jsonobj) {
        //     return Artikel.create(jsonobj);
        // });
        let artikel = window.articleController.getByCard(card);
        if (artikel && !card.closed) {
            window.articleController.insert(artikel, card);
        }
    }
    return window.articleController;
}

/**
 * Get the sorted cards using the article's pagina property
 * @param articleController
 * @param t the trello api
 * @param opts the options that contain the cards to be sorted
 * @param sort sort strategy: asc or desc
 * @returns {{sortedIds: *|{}|Uint8Array|any[]|Int32Array|Uint16Array}}
 */
function sortOnPagina(articleController, t, opts, sort) {
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = articleController.getByCard(lhs_card);
            let rhs = articleController.getByCard(rhs_card);
            let lhsp = lhs ? parseFloat(lhs.pagina || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
            let rhsp = rhs ? parseFloat(rhs.pagina || Number.MAX_VALUE.toString()) : Number.MAX_VALUE;
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

/**
 * Get the sorted cards using the article's tags (Tage) property
 * @param articleController
 * @param t the trello api
 * @param opts the options that contain the cards to be sorted
 * @param sort sort strategy: asc or desc
 * @returns {{sortedIds: *|{}|Uint8Array|any[]|Int32Array|Uint16Array}}
 */
function sortOnTags(articleController, t, opts, sort) {
    // Trello will call this if the user clicks on this sort
    // opts.cards contains all card objects in the list
    let sortedCards = opts.cards.sort(
        function (lhs_card, rhs_card) {
            let lhs = articleController.getByCard(lhs_card);
            let rhs = articleController.getByCard(rhs_card);
            let lhsp = lhs && lhs.tags ? map(lhs.tags) : Number.MAX_VALUE;
            let rhsp = rhs && rhs.tags ? map(rhs.tags) : Number.MAX_VALUE;
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

/**
 * Map the parameter tag to a numeric value that can be sorted. Monday starts at zero and ends on sunday with six
 * @param tag
 * @returns {number}
 */
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