const PLUGIN_CONFIGURATION = {
    'module.artikel.enabled': false, // 1
    'module.beteiligt.enabled': true, // 2
    'module.plan.enabled': true // 3
};

const TEXTS = {

    "module.settings.hint": "Folgende MODULE sind für dieses BOARD verfügbar:<br/>" +
        "Sobald mindestens ein MODUL aktiviert ist, wird dieses in jeder CARD auf dem BOARD dargestellt.",

    'module.artikel.label.desc': "Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.",
    'module.artikel.desc': "ARTIKEL-Eingabefelder und LISTEN für dieses BOARD konfigurieren:<br/>" +
        "Für jedes Feld kann eine Farbe definiert werden.<br/>" +
        "Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf der CARD Vorderseite – ansonsten wird es nur auf der CARD Innenseite dargestellt.",

    'module.artikel.editable.desc': "Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>" +
        "Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>" +
        "Die Zahl der Stichwort ist NICHT begrenzt.<br/>" +
        "Maximal vier der sechs LISTEN lassen sich sortieren.<br/>" +
        "LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.",

    'module.artikel.field-a.desc': "Das Textfeld «A» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.artikel.field-b.desc': "Das Textfeld «B» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.artikel.field-c.desc': "Das Textfeld «C» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.artikel.field-d.desc': "Das Textfeld «D» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",

    'module.beteiligt.desc': "BETEILIGT kann als Ergänzung zum ARTIKEL oder PLAN aktiviert werden.<br/>" +
        "Hier die Eingabefelder und LISTEN für das ganze BOARD konfigurieren:",
    'module.beteiligt.label.desc': "Dieser Titel wird oberhalb des Modul BETEILIGT auf jeder CARD sichtbar.",

    'module.beteiligt.layout.onsite': "TAB-Titel tippen und LAYOUT auswählen.",
    'module.beteiligt.layout.text': "TAB-Titel tippen und LAYOUT auswählen.",
    'module.beteiligt.layout.photo': "TAB-Titel tippen und LAYOUT auswählen.",
    'module.beteiligt.layout.video': "TAB-Titel tippen und LAYOUT auswählen.",
    'module.beteiligt.layout.illu': "TAB-Titel tippen und LAYOUT auswählen.",
    'module.beteiligt.layout.ad': "TAB-Titel tippen und LAYOUT auswählen.",

    'module.beteiligt.regular.desc': "Standard-Layout",
    'module.beteiligt.special.desc': "Spezial-Layout",

    'module.plan.label.desc': "Dieser Titel wird oberhalb des Moduls auf jeder CARD sichtbar.",
    'module.plan.desc': "PLAN-Eingabefelder und Auswahllisten für das BOARD konfigurieren:<br/>" +
        "Für jedes Feld kann eine Farbe definiert werden.<br/>" +
        "Ist ein Feld aktiviert, dann erscheint es in dieser Farbe auf " +
        "der CARD Vorderseite – ansonsten wird es nur auf der CARD " +
        "Innenseite dargestellt.",

    'module.plan.editable.desc': "Beschriftung und Stichworte der maximal sechs LISTEN definieren:<br/>" +
        "Die Reihenfolge der Stichwort muss fix erfasst werden.<br/>" +
        "Die Zahl der Stichwort ist NICHT begrenzt.<br/>" +
        "Maximal vier der sechs LISTEN lassen sich sortieren.<br/>" +
        "LISTEN ohne Beschriftung werden auf der CARD nicht dargestellt.",

    'module.plan.field-a.desc': "Das Textfeld «A» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-b.desc': "Das Textfeld «B» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",

    "module.beteiligt.layout-regular.desc": "Das Kontakt-Formular hat folgende Felder, die individualisert werden können",
    "module.beteiligt.layout-ad.desc": "Das Inserat-Formular hat folgende Felder, die individualisert werden können",

    "module.beteiligt.field-name.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-social.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-address.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-notes.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-deadline.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-total.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-price.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-placement.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-format.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-sujet.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",

};

const POWERUP_ADMINS = [
    "manu29494020",
    "koni_nordmann",
    "ray2505",
];