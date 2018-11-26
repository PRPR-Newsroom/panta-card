t.render(function () {

    let stag = document.createElement('script');
    // TODO this is somehow not yet working because on sandbox the /version resource cannot be created somehow
    stag.setAttribute('src', '/version.jsonp');
    stag.async = true;
    stag.addEventListener('load', function (e) {
        document.getElementsByClassName("plugin-version").forEach(function (element) {
            element.innerText = "1.1.0";
        });
    });
    document.getElementsByTagName("body")[0].appendChild(stag);

    return t.sizeTo("#content").done();
});