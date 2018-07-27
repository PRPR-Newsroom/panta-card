var Promise = window.TrelloPowerUp.Promise;

TrelloPowerUp.initialize({
    'card-buttons': function(t, options){
        return [{
            icon: 'https://cdn.glitch.com/1b42d7fe-bda8-4af8-a6c8-eff0cea9e08a%2Frocket-ship.png?1494946700421',
            text: 'panta.Card',
            callback: function(t) {
              return t.popup({
                  title: "Einstellungen",
                  url: "settings.html"
              })
            }
        }];
    },
    'card-badges': function(t, options) {
        return t.getAll('card', 'shared')
            .then(function(sharedData) {
                if (Object.keys(sharedData).length < 1) {
                    return [];
                }
                console.log(JSON.stringify(sharedData));
                var card = sharedData.card;
                var badges = [];
                if (card && card.shared && card.shared["panta.Artikel"]) {
                    var artikel = card.shared["panta.Artikel"];
                    if (artikel.options) {
                        var count = 0;
                        for (var option in artikel.options) {
                            if (artikel.options[option] === true) {
                                count++;
                            }
                        }
                        badges.push({
                            text: count,
                            icon: './assets/ic_involved.png'
                        });
                    }
                    if (artikel.saldo) {
                        var count = 0;
                        for (var _saldo in artikel.saldo) {
                            if (artikel.saldo[_saldo] === true) {
                                count++;
                            }
                        }
                        badges.push({
                            text: count,
                            icon: './assets/ic_saldo.png'
                        });
                    }
                }
                console.log(JSON.stringify(badges));
                return badges;
            })
    },
    'card-back-section': function(t, opts) {
        return {
            title: 'panta.Artikel',
            icon: './assets/ic_pantarhei.png',
            content: {
                type: 'iframe',
                url: t.signUrl('./artikel.html', {}),
                height: 500 // Max height is 500
            }
        }
    },
    'list-sorters': function(t) {
        var cards;
        return t.list('name', 'id')
            .then(function(list) {
                console.log("List: " + list.id);
                return GET("/lists/" + list.id + "/cards");
            })
            .then(function(data) {
                cards = JSON.parse(data);
                console.log("Cards in list: " + cards.length);
                var promises = [];
                for (var card in cards) {
                    promises.push(new Promise(function(resolve,reject) {
                        resolve({
                            card: cards[card].id,
                            pluginData: GET("/cards/" + cards[card].id + "/plugindata")
                        })
                    }));
                }
                return Promise.all(promises)
            })
            .then(function(data) {
                var pagina = [];
                // for (var _key in data) {
                //     JSON.parse(data[_key]["pluginData"]).forEach(function(pluginData) {
                //         if (pluginData.idPlugin === "5b562cc1dd427b2c37d032d2") {
                //             var panta = JSON.parse(pluginData.value);
                //             if (panta && panta.pagina) {
                //                 var pvalue = -1;
                //                 try {
                //                     pvalue = parseInt(panta.pagina);
                //                 } catch (e) {
                //                     // ignore
                //                 }
                //                 pagina.push({
                //                     id: data[_key]["card"],
                //                     value: pvalue
                //                 });
                //             } else {
                //                 pagina.push({
                //                     id: data[_key]["card"],
                //                     value: -1
                //                 })
                //             }
                //         }
                //     });
                // }
                return [{
                    text: "Pagina",
                    callback: function (t, opts) {
                        // Trello will call this if the user clicks on this sort
                        // opts.cards contains all card objects in the list
                        var sortedCards = opts.cards.sort(
                            function(a,b) {
                                if (a.name > b.name) {
                                    return 1;
                                } else if (b.name > a.name) {
                                    return -1;
                                }
                                return 0;
                            });

                        return {
                            sortedIds: sortedCards.map(function (c) { return c.id; })
                        };
                    }
                }];
            })
    }
});

function GET(path) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest;
        xhr.addEventListener("error", reject);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        const key = "86a73cafa11d3834d4768a20a96b6786";
        const token = "5f7ab7be941155ed024f3d024a5043d198c23764c9ee5988543d4679dc411563"
        xhr.open("GET", "https://api.trello.com/1" + path + "?key=" + key + "&token=" + token);
        xhr.send(null);
    });
}