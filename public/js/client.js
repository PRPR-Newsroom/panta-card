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
    }
});