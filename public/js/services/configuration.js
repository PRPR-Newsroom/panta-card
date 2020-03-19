// SEE ALSO VERSION FILE
const VERSION = "1.5.22";

const APP_NAME = "Panta.Cards";
// when changing this API Key you should also change the key parameter where you load the Trello client.js
// const APP_KEY = "86b7da26cc27ae039a161c97dfa56156";
const APP_KEY = "86b7da26cc27ae039a161c97dfa56156";

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

    // pagina
    'module.artikel.field-e.desc': "Das Textfeld «E» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    // seiten layout
    'module.artikel.field-f.desc': "Das Textfeld «F» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    // total seiten
    'module.artikel.field-g.desc': "Das Textfeld «G» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",

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
    'module.beteiligt.special.desc': "Inserat-Layout",
    'module.beteiligt.blog.desc': "Blog-Layout",

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
    'module.plan.field-c.desc': "Das Textfeld «C» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-d.desc': "Das Textfeld «D» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-e.desc': "Das Textfeld «E» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-f.desc': "Das Textfeld «F» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-g.desc': "Das Textfeld «G» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",
    'module.plan.field-h.desc': "Das Textfeld «H» ist individuell konfigurierbar:<br/>Hier Beschriftungs- und Platzhalter-Text anpassen.",

    // the description text for the layouts
    "module.beteiligt.layout-regular.desc": "Das Kontakt-Formular hat folgende Felder, die individualisert werden können.<p><i>Hinweis: Die hier konfigurierten Felder gelten für alle Reiter, die dieses Layout verwenden. Eine Konfiguration pro Reiter ist nicht möglich.</i></p>",
    "module.beteiligt.layout-ad.desc": "Das Inserat-Formular hat folgende Felder, die individualisert werden können.<p><i>Hinweis: Die hier konfigurierten Felder gelten für alle Reiter, die dieses Layout verwenden. Eine Konfiguration pro Reiter ist nicht möglich.</i></p>",
    "module.beteiligt.layout-blog.desc": "Das Blog-Formular hat folgende Felder, die individualisert werden können.<p><i>Hinweis: Die hier konfigurierten Felder gelten für alle Reiter, die dieses Layout verwenden. Eine Konfiguration pro Reiter ist nicht möglich.</i></p>",

    "module.beteiligt.field-name.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-social.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-address.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-notes.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-deadline.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    // honorar massnahmen
    "module.beteiligt.field-a.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    // spesen massnahmen
    "module.beteiligt.field-b.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    // total beteiligt
    "module.beteiligt.field-c.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",

    "module.beteiligt.field-total.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-price.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-placement.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-format.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",
    "module.beteiligt.field-sujet.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",

    "module.beteiligt.field-link.desc": "Das Feld ist ein individuell konfigurierbares Feld. Geben Sie hier die Beschriftung und Platzhalter an.",

    'trello.list.desc': 'Board.Liste',
    'trello.title.desc': 'Card.Titel',
    'trello.description.desc': 'Card.Beschreibung',
    'trello.members.desc': 'Card.Mitglieder',
    'trello.duedate.desc': 'Card.Frist',
    'trello.labels.desc': 'Card.Label',

    'admin.import.select.label.text': 'Felder',
    'admin.import.select.label.select': 'Listen',

    'admin.export.labels.hint.label': 'Dynamisch erstellt',
    'admin.export.labels.hint.desc': 'Labels werden dynamisch anhand den verfügbaren Board Labels erstellt.',

    'validation.error.multiple-mapping': 'Excel Felder werden mehrfach dem gleichen Trello/Panta.Card Feld zugeordnet',
    'validation.error.trello-list': 'Es muss mindestens die Trello Liste angegeben werden'
};

/**
 * @type {{id: string, desc: string, type: string?, multi: string?}[]}
 */
const TRELLO_FIELDS = [{
    'id': 'trello.list',
    'desc': 'trello.list.desc',
}, {
    'id': 'trello.title',
    'desc': 'trello.title.desc',
}, {
    'id': 'trello.description',
    'desc': 'trello.description.desc',
}, {
    'id': 'trello.members',
    'desc': 'trello.members.desc',
    'type': 'array'
}, {
    'id': 'trello.duedate',
    'desc': 'trello.duedate.desc',
    'type': 'date'
}, {
    'id': 'trello.labels',
    'desc': 'trello.labels.desc',
    'type': 'boolean',
    'multi': true
}];

const TRELLO_COLORS = {
    'Transparent': 'transparent',
    'Blue': 'blue',
    'Green': 'green',
    'Orange': 'orange',
    'Red': 'red',
    'Yellow': 'yellow',
    'Purple': 'purple',
    'Pink': 'pink',
    'Sky': 'sky',
    'Lime': 'lime',
    'Black': 'black'
};