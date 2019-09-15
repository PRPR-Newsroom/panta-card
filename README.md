# Panta.Card Power-Up

Das Panta.Card Power-Up umfasst folgende Module:

* Panta.Artikel
* Panta.Plan
* Panta.Beteiligt

Pro Trello Board werden die Module konfiguriert.

## Source-Code

Auf GitHub wird der Source-Code des Power-Ups versioniert. 

Der Besitzer ist PRPR-Newsroom: https://github.com/PRPR-Newsroom/panta-card

## CodeSandbox

Da GitHub seinen Dienst ([RawGit](https://rawgit.com/)) seit 2018/2019 eingestellt hat, wird
CodeSandbox für das Bereitstellen des Power-Ups verwendet.

Um das Projekt in CodeSandbox zu importieren, einfach den GitHub Repository Link auf der
Webseite https://codesandbox.io/s/github eingeben.

![CodeSandbox - Import](docs/codesandbox-import.png)

Den Link "Converted Sandbox URL" wird für die Installation des Trello Power-Ups
verwendet.

## Installation

Das Power-Up wird auf [Power-Up Admin Seite](https://trello.com/power-ups/admin) konfiguriert.

![Trello Power-Up Formular](docs/trello_create.png)

### Konfiguration

Die Konfiguration für das Power-Up "Panta.Card" für das Team "PRPR.9.labor"

![Panta.Card](docs/panta_card-konfiguration.png)

![Panta.Card Optional](docs/panta_card-optional.png)

## Weitere Teams

Um das Panta.Card Power-Up für andere Teams zu installieren, einfach auf die
[Power-Up Admin Seite](https://trello.com/power-ups/admin) navigieren und dort
das Team auswählen. Danach ein neues Power-Up erstellen und das Power-Up wie
oben aufgezeigt konfigurieren.

## Power-Up einschalten

Sobald das Power-Up für ein Team konfiguriert ist, kann es in den Boards aktiviert
werden.

![Trello Power-Up](docs/trello-powerup.png)

Nachdem das Power-Up aktiviert wurde, erscheint es in den Trello Cards.

![Trello Panta.Card](docs/trello_panta-card.png)

## Panta.Card Konfiguration

Für jedes Trello Board können die drei Module konfiguriert werden. Um das Power-Up zu konfigurieren, muss zunächst eine Trello Card
erstellt und geöffnet werden. In der Trello Card gibt's auf der rechten Seite ein Button "Panta.Card.Setup". Als Administrator des Power-Ups
wird beim Klick auf den Knopf folgende Seite geladen:

![Trello Panta.Card Settings](docs/1-settings.png)

Das entsprechende Modul kann mit der Checkbox (rundes Kästchen) (de-)aktiviert werden. Wenn auf den Modul-Namen
geklickt wird, dann wird die Modul-Konfiguration geöffnet.

Die Konfigurations-Möglichkeiten werden in den einzelnen Seiten erklärt.

## Debugging

Evtl. in `utils.js` ein Breakpoint im `tryCatcher` setzen, da der Fehler in diesem Block geschluckt wird

## Release

Es gibt drei «Main» Branches

1. **develop** Hier ist der aktuellste Code Stand. Wird nicht auf deployt
1. **staging** Das ist die TEST Umgebung. Bevor eine Version «Live» geht, wird die Version hier abgenommen
1. **production** Nachdem es auf «Staging» abgenommen wurde, wird hier die endgültige Version abgelegt

### Versionierung

In **develop** ist die Version mit dem Postfix «SNAPSHOT» ergänzt, d.h. bspw. die Version 1.3.0 heisst hier 1.3.0-SNAPSHOT.

In **staging** wird die Version von **develop** übernommen jedoch wird der Postfix auf «STAGING» geändert. Beispiel: 1.3.0-STAGING.

In **production** wird die Version von **staging** übernommen. Der Postfix wird komplett entfernt, d.h. die Version ist dann bspw. 1.3.0

### Changelog

Das Changelog dient als Nachschlagewerk. Das Changelog wird bei jeder Weiterentwicklung ergänzt. Wird in develop weiterentwickelt, dann werden die
Änderungen unter [UNRELEASED] festgehalten. Wenn die Version auf **staging** installiert wird, dann wird in diesem Branch auch das Changelog 
angepasst, d.h. die Änderungen unter [UNRELEASED] werden in den Versionsblock verschoben/kopiert, d.h. bspw. [1.3.0-STAGING]. Sobald die Version
in die Produktion hochgestuft werden kann, wird der Staging Block entsprechend umbenannt, d.h. bspw. [1.3.0]. 

### Bugfixing

Fehler, die nicht zwingend auf eine bestimmte Version gefixt werden müssen, gelten als Bugs und werden ab «develop» gefixt. Fehler, die bspw. während 
dem Testing in der Staging Umgebung festgestellt werden und in diese Version noch einfliessen müssen, werden ab dem Staging Branch gefixt. Wenn der
Bugfix validiert wurde, wird der Fix in **develop** übernommen (bspw. Cherry-Pick). Fehler, die in der Produktion entdeckt werden, müssen zuerst 
in der Staging Umgebung gefixt und getestet werden. Danach wird der Fix auf Produktion released