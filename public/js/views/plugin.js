document.getElementsByClassName("btn-settings").forEach(function(btn) {
    btn.setEventListener('click', function(e) {
        // this is not yet working because trello must be in a context
        // of TrelloPowerUp.initialize but this is only allowed once
        t.popup({
            title: 'Einstellungen',
            url: "settings.html"
        })
    });
});