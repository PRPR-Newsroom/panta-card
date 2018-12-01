
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

let cm = null;
if (!window.clientManager) {
    cm = ClientManager.getOrCreateClientManager(window, t, PLUGIN_CONFIGURATION).init();
    // initialize the plugin controller separately
    cm.getPluginController().init();
} else {
    cm = window.clientManager;
}

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