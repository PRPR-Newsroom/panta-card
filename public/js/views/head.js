
let isMobile = navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry)/) !== null;

if (!isMobile) {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/panta.responsive.css';
    link.media = 'all';
    head.appendChild(link);
} else {
    let head  = document.getElementsByTagName('head')[0];
    let link  = document.createElement('link');
    link.rel  = 'stylesheet';
    link.type = 'text/css';
    link.href = 'css/panta.mobile.css';
    link.media = 'all';
    head.appendChild(link);
}

let t = TrelloPowerUp.iframe();

if (!window.pluginController) {
    window.pluginController = new PluginController(t);
    window.pluginController.init();
}

ArtikelController.prepare(t);

// specials
function enableReset(t) {
    let btDelete = document.getElementById("bt_delete");
    if (btDelete) {
        btDelete.addEventListener('click', function (event) {
            event.preventDefault();
            return t.remove('card', 'shared', ArtikelController.SHARED_NAME)
                .then(function () {
                    t.closeModal();
                });
        });
    }
}

enableReset(t);