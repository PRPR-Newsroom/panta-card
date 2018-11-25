t.render(function () {

    let stag = document.createElement('script');
    stag.setAttribute('src', '/version.js');
    stag.async = true;
    stag.addEventListener('load', function (e) {
        document.getElementsByClassName("plugin-version").forEach(function (element) {
            element.innerText = "1.1.0";
        });
    });
    document.getElementsByTagName("body")[0].appendChild(stag);

    return t.sizeTo("#content").done();
});