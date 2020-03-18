[UNRELEASED]

[1.5.21-STAGING]

# Changes

* Follower und Date aus Blog Layout komplett entfernt

[1.5.20-STAGING]

# Changes

* Hinweis für Layout-Konfiguration
* Notiz Feld in Blog Layout vergrössert und die zwei Felder «Follower» und «Date» ausgeblendet

# Fixes

* Fehler bei der Sortierung gefixt
* Mail- & Webadressen Prüfung

[1.5.19-STAGING]

# Changes

* Reiter zentrieren
* Import von Listen Werten anhand fuzzy Check (ignore case und trim)
* Import von Listen Werten anhand des angegebenen Indexes (wenn kein Text Match gefunden wurde)

# Fixes

* NPE Prüfungen

[1.5.18-STAGING]

# Changes

* Validation texts
* Enable feature for board members
* Export feature
* Import feature
* Load a different configuration from a decompressed base64 encoded string
* Progress dialog when importing
* Do not show invisible/deactivated fields in sorters

# Fixes

* Error handling when there's a problem with the configuration
* Visiblity for Artikel Badge
* Visiblity for fields

[1.4.3]

Released on 3.10.2019

# Changes

* Show web- and mail addresses as clickable links

# Fixes

* Fix label height in settings

[1.4.2-STAGING]

# Changes

* The blog layout must have the same height as the other layouts to avoid scrollbars when switching betweeen tabs

# Fixes

* Trello changed their stylesheets. This changes made the Panta Power-Up look strange because some properties were changed. To fix this the Panta Power-Up either overrides or sets those properties now
* Active tab must have a black bar no matter if it has content or not

[1.3.5_1]

# Features

* New Layout "Blog" in "Beteiligt"
* Fields in all modules can be made visible or hidden on the card back
* Fields in all modules can be made visible or hidden on the card front as badges \*
* Show symbol "(S)" next to a field to easily see if a field is used for "sorting"
* Show an eye symbol next to a field to easily see if a field is visible
* Minor text changes
* In "Beteiligt" the first tab with content is activated by default instead of the always the first one. If there's no tab with content it will be still the first one
* Title for all modules can be configured

\* Only regular fields can be made visible as badges. Therefore computed fields do not have a checkbox in front to show/hide the field as a badge

# Fixes

* Fixed: Restore scroll position when user changes tabs
* Fixed: Wrong fields are displayed as badges
* Fixed: "Schwarzer Balken" for active tabs
* Fixed: Font-style for labels in settings as the labels on the card-back section of the input fields
* Fixed: List elements in settings cannot be deleted

[1.3.4]

* Tab layouts can now be switched back and forth
* Removed unused console output

[1.3.3]

* Making Beteiligt Module work with dynamic layouts (Kontakt and Inserat)

[1.3.2]

Hotfix Release, da es beim Migrieren von Daten aus Artikel Version 1 Probleme gab.
