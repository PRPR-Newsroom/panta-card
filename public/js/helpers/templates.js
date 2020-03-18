// use: http://pojo.sodhanalibrary.com/string.html
let template_regular = '<div id="template">' +
    '    <div class="row">' +
    '        <div class="col-6 col-phone-12">' +
    '            <div class="row">' +
    '                <div class="col-12 col-phone-12">' +
    '                    <div class="pa.name"></div>' +
    '                </div>' +
    '                <div class="col-12 col-phone-12">' +
    '                    <div class="pa.social"></div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '        <div class="col-6 col-phone-12 line-4 line-phone-4">' +
    '            <div class="pa.notes"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-6 col-phone-12">' +
    '            <div class="pa.address"></div>' +
    '        </div>' +
    '        <div class="col-6 col-phone-12">' +
    '            <div class="pa.duedate"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-12 col-phone-12">' +
    '            <div class="row">' +
    '                <div class="col-4 col-phone-4">' +
    '                    <div class="pa.fee"></div>' +
    '                </div>' +
    '                <div class="col-4 col-phone-4">' +
    '                    <div class="pa.charges"></div>' +
    '                </div>' +
    '                <div class="col-4 col-phone-4">' +
    '                    <div class="pa.project"></div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_regular_mobile = '<div id="template">' +
    '    <div class="row">' +
    '        <div class="col-phone-12">' +
    '            <div class="pa.name"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12 line-phone-4">' +
    '            <div class="pa.notes"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12">' +
    '            <div class="pa.social"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12">' +
    '            <div class="pa.address"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12">' +
    '            <div class="pa.duedate"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12">' +
    '            <div class="row">' +
    '                <div class="col-phone-4">' +
    '                    <div class="pa.fee"></div>' +
    '                </div>' +
    '                <div class="col-phone-4">' +
    '                    <div class="pa.charges"></div>' +
    '                </div>' +
    '                <div class="col-phone-4">' +
    '                    <div class="pa.project"></div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_ad = '<div id="template" class="row">' +
    '    <div class="col-6 col-phone-12">' +
    '        <div class="row">' +
    '            <div class="col-12 col-phone-12">' +
    '                <div class="pa.notes"></div>' +
    '            </div>' +
    '        </div>' +
    '        <div class="row">' +
    '            <div class="col-6 col-phone-6">' +
    '                <div class="pa.format"></div>' +
    '            </div>' +
    '            <div class="col-6 col-phone-6">' +
    '                <div class="pa.placement"></div>' +
    '            </div>' +
    '        </div>' +
    '        <div class="row">' +
    '            <div class="col-6 col-phone-6">' +
    '                <div class="pa.price"></div>' +
    '            </div>' +
    '            <div class="col-6 col-phone-6">' +
    '                <div class="pa.total"></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="col-6 col-phone-12">' +
    '        <div class="row">' +
    '            <div class="col-12 col-phone-12">' +
    '                <div class="pa.name"></div>' +
    '            </div>' +
    '            <div class="col-12 col-phone-12">' +
    '                <div class="pa.social"></div>' +
    '            </div>' +
    '            <div class="col-12 col-phone-12">' +
    '                <div class="pa.address"></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_blog = '<div id="template" class="row">' +
    '    <div class="col-12 col-phone-12">' +
    '        <div class="row">' +
    '            <div class="col-12 col-phone-12">' +
    '                <div class="pa.link"></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="col-12 col-phone-12">' +
    '        <div class="row">' +
    '            <div class="col-12 col-phone-12 line-7 line-phone-7">' +
    '                <div class="pa.notes"></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_plan = '<div id="template">' +
    '    <div class="row">' +
    '        <div class="col-6 line-2">' +
    '            <div class="pa.plan.measures"></div>' +
    '        </div>' +
    '        <div class="col-3">' +
    '            <div class="pa.plan.fee"></div>' +
    '        </div>' +
    '        <div class="col-3">' +
    '            <div class="pa.plan.projectFee"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-6 line-6">' +
    '            <div class="pa.plan.description"></div>' +
    '        </div>' +
    '        <div class="col-6">' +
    '            <div class="row">' +
    '                <div class="col-6">' +
    '                    <div class="pa.plan.thirdPartyCharges"></div>' +
    '                </div>' +
    '                <div class="col-6">' +
    '                    <div class="pa.plan.thirdPartyTotalCosts"></div>' +
    '                </div>' +
    '                <div class="col-6">' +
    '                    <div class="pa.plan.capOnDepenses"></div>' +
    '                </div>' +
    '                <div class="col-6 line-2">' +
    '                    <div class="pa.plan.totalCosts"></div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.visual"></div>' +
    '        </div>' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.form"></div>' +
    '        </div>' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.online"></div>' +
    '        </div>' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.season"></div>' +
    '        </div>' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.region"></div>' +
    '        </div>' +
    '        <div class="col-2">' +
    '            <div id="pa.plan.place"></div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_artikel = '<div id="template">' +
    '    <div class="row">' +
    '        <div class="col-9 col-phone-9">' +
    '            <div id="pa.topic"></div>' +
    '        </div>' +
    '        <div class="col-3 col-phone-3">' +
    '            <div id="pa.pagina"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row mobile-row">' +
    '        <div class="col-9 col-phone-9">' +
    '            <div class="row">' +
    '                <div class="col-6 col-phone-6">' +
    '                    <div id="pa.input-from"></div>' +
    '                </div>' +
    '                <div class="col-6 col-phone-6">' +
    '                    <div id="pa.author"></div>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '        <div class="col-3 col-phone-3">' +
    '            <div id="pa.layout"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row mobile-row">' +
    '        <div class="col-9 col-phone-9">' +
    '            <div id="pa.text"></div>' +
    '        </div>' +
    '        <div class="col-3 col-phone-3">' +
    '            <div id="pa.total"></div>' +
    '        </div>' +
    '    </div>' +
    '' +
    '    <div class="col-12 col-phone-12">' +
    '        <div class="row">' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.visual"></div>' +
    '            </div>' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.form"></div>' +
    '            </div>' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.tags"></div>' +
    '            </div>' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.season"></div>' +
    '            </div>' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.region"></div>' +
    '            </div>' +
    '            <div class="col-2 col-phone-4">' +
    '                <div id="pa.location"></div>' +
    '            </div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_plan_mobile = '<div id="template">' +
    '    <div class="row">' +
    '        <div class="col-phone-12 line-phone-2">' +
    '            <div class="pa.plan.measures"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-12 line-phone-4">' +
    '            <div class="pa.plan.description"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.fee"></div>' +
    '        </div>' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.projectFee"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.thirdPartyCharges"></div>' +
    '        </div>' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.thirdPartyTotalCosts"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.capOnDepenses"></div>' +
    '        </div>' +
    '        <div class="col-phone-6">' +
    '            <div class="pa.plan.totalCosts"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.visual"></div>' +
    '        </div>' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.form"></div>' +
    '        </div>' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.online"></div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row">' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.season"></div>' +
    '        </div>' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.region"></div>' +
    '        </div>' +
    '        <div class=" col-phone-4">' +
    '            <div id="pa.plan.place"></div>' +
    '        </div>' +
    '    </div>' +
    '</div>';

let template_settings_switch = '<div class="row module-switch-container">' +
    '    <div class="col-2">' +
    '       <div class="panta-module-enabled">' +
    '           <label class="panta-checkbox-container">' +
    '              <input class="panta-js-checkbox" type="checkbox" checked="checked">' +
    '               <span class="panta-checkbox-checkmark elevate"></span>' +
    '           </label>' +
    '       </div>' +
    '    </div>' +
    '    <div class="col-10 switch-title"></div>' +
    '</div>';

let template_settings_module = '<div class="row module-container">' +
    '    <div class="col-2 col-phone-2">' +
    '       <div class="panta-module-enabled">' +
    '           <label class="panta-checkbox-container">' +
    '              <input class="panta-js-checkbox" type="checkbox" checked="checked">' +
    '               <span class="panta-checkbox-checkmark elevate"></span>' +
    '           </label>' +
    '       </div>' +
    '    </div>' +
    '    <div class="col-8 col-phone-8 module-title"></div>' +
    '    <div class="col-2 col-phone-2 module-icon"><img src="assets/ic_pantarhei.png" class="panta-js-icon" width="16px" height="16px"/></div>' +
    '</div>';

let template_settings_editable = '<div class="row module-editable-container">' +
    '    <div class="col-1 col-phone-1 module-editable-show">' +
    '       <div class="panta-module-enabled">' +
    '           <label class="panta-checkbox-container hidden">' +
    '               <input class="panta-js-checkbox" type="checkbox" checked="checked">' +
    '               <span class="panta-checkbox-checkmark elevate"></span>' +
    '           </label>' +
    '       </div>' +
    '    </div>' +
    '    <div class="col-8 col-phone-8 module-editable-name"></div>' +
    '    <div class="col-1 col-phone-1 module-helper-visible">' +
    '       <button class="panta-btn panta-btn-dot panta-js-button hidden" title="Dieses Feld ist sichtbar"><img src="assets/ic_visible.png" width="12px" height="12px"/></button>' +
    '    </div>' +
    '    <div class="col-1 col-phone-1 module-editable-color invisible">' +
    '       <button class="panta-btn panta-btn-dot panta-js-button"></button>' +
    '    </div>' +
    '    <div class="col-1 col-phone-1 module-helper-sortable">' +
    '       <button class="panta-btn panta-btn-dot panta-js-button" title="Dieses Feld kann für die Sortierung verwendet werden">S</button>' +
    '    </div>' +
    '</div>';

let template_settings_editable_select = '<div class="row module-editable-select-container">' +
    '   <select class="panta-js-select"></select>' +
    '</div>';

let template_settings_editable_option = '<div class="row module-editable-option-container">' +
    '    <div class="col-10 module-editable-option-name">' +
    '       <input type="text" class="panta-js-name"/>' +
    '    </div>' +
    '    <div class="col-2 module-editable-option-actions">' +
    '       <button class="panta-btn panta-btn-icon panta-js-delete"><img src="assets/ic_trash.svg" width="16px" height="16px"/></button>' +
    '       <button class="panta-btn panta-btn-icon panta-js-visible hidden"><img src="assets/ic_visible.png" width="16px" height="16px"/></button>' +
    '    </div>' +
    '</div>';

let template_beteiligt = '<form id="panta.module">' +
    '    <div class="js-panta-editable-title">' +
    '        <div class="row min"><div class="col-12"> </div></div>' +
    '        <div class="row min">' +
    '           <div class="col-12">' +
    '                <h3 class="js-panta-module js-panta-label"></h3>' +
    '           </div>' +
    '        </div>' +
    '    </div>' +
    '    <div class="row min navigation-bar">' +
    '        <div id="pa.involved.onsite" class="col-2 col-phone-4 tab" data-label="vor.Ort" data-layout="regular"><span>Placeholder</span></div>' +
    '        <div id="pa.involved.text" class="col-2 col-phone-4 tab" data-label="Journalist" data-layout="regular"><span>Placeholder</span></div>' +
    '        <div id="pa.involved.photo" class="col-phone-4 col-2 tab" data-label="Visual" data-layout="regular"><span>Placeholder</span></div>' +
    '        <div id="pa.involved.video" class="col-phone-4 col-2 tab" data-label="Event" data-layout="regular"><span>Placeholder</span></div>' +
    '        <div id="pa.involved.illu" class="col-phone-4 col-2 tab" data-label="MC/Host" data-layout="regular"><span>Placeholder</span></div>' +
    '        <div id="pa.involved.ad" class="col-phone-4 col-2 tab" data-label="weitere" data-layout="regular"><span>Placeholder</span></div>' +
    '    </div>' +
    '' +
    '    <span id="pa.tab.content"></span>' +
    '</form>';

const template_admin_actions = '<div class="row full">' +
    '            <div class="col-12">' +
    '                <p class="topic">Was willst du tun?</p>' +
    '            </div>' +
    '        </div>' +
    '        <div class="row full">' +
    '            <div class="col-6 space">' +
    '                <button id="btn-action-import" class="panta-btn action">Import</button>' +
    '            </div>' +
    '            <div class="col-6 space">' +
    '                <button id="btn-action-export" class="panta-btn action js-button-export">Export</button>' +
    '            </div>' +
    '        </div>';

const template_admin_import = '<div class="row full">' +
    '            <div class="col-12">' +
    '                <p class="topic">Wähle hier die Excel Datei aus, die importiert werden soll.</p>' +
    '            </div>' +
    '            <div class="col-10">' +
    '                <input class="panta-btn" type="file" id="file-import">' +
    '            </div>' +
    '            <div class="col-2">' +
    '                <button class="panta-btn" id="btn-load">Laden</button>' +
    '            </div>' +
    '            <div class="col-12">' +
    '                <button class="panta-btn panta-bgcolor-yellow hidden" id="btn-load-config">Konfiguration laden</button>' +
    '            </div>' +
    '        </div>' +
    '' +
    '        <div class="hidden mapping-content-header">' +
    '            <div class="row full">' +
    '                <div class="col-12">' +
    '                    <hr/>' +
    '                </div>' +
    '            </div>' +
    '            <div class="row space full">' +
    '                <div class="col-3 align-right">' +
    '                    <b>Excel Feld</b>' +
    '                </div>' +
    '                <div class="col-3">' +
    '                    <b>Trello Feld</b>' +
    '                </div>' +
    '                <div class="col-4 align-left">' +
    '                    <b>Beispiel Wert</b>' +
    '                </div>' +
    '                <div class="col-2 align-left">' +
    '                    <b>Mehr</b>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '        <form>' +
    '            <div class="hidden mapping-content">' +
    '            </div>' +
    '' +
    '            <div class="row space full">' +
    '                <div class="col-10"> </div>' +
    '                <div class="col-2">' +
    '                    <button class="panta-btn panta-bgcolor-green panta-js-button" disabled="disabled" id="btn-import">' +
    '                        Importieren' +
    '                    </button>' +
    '                </div>' +
    '            </div>' +
    '' +
    '            <div class="row">' +
    '                <div class="col-12 hidden error-messages">' +
    '                    <p class="error" id="error-message"></p>' +
    '                </div>' +
    '                <div class="col-12 hidden warning-messages">' +
    '                    <p class="warning" id="warning-message"></p>' +
    '                </div>' +
    '            </div>' +
    '        </form>';

const template_admin_export = '<div class="row full">' +
    '            <div class="col-12">' +
    '                <p class="topic">Standardmässig werden alle Trello und Panta.Card Felder exportiert</p>' +
    '            </div>' +
    '        </div>' +
    '        <div class="hidden mapping-content-header">' +
    '            <div class="row full">' +
    '                <div class="col-12">' +
    '                    <hr/>' +
    '                </div>' +
    '            </div>' +
    '            <div class="row space full">' +
    '                <div class="col-3 align-right">' +
    '                    <b>Excel Feld</b>' +
    '                </div>' +
    '                <div class="col-3">' +
    '                    <b>Trello Feld</b>' +
    '                </div>' +
    '                <div class="col-3 align-left">' +
    '                    <b>Beispiel Wert</b>' +
    '                </div>' +
    '                <div class="col-3 align-left">' +
    '                    <b>Beschriftung überschreiben</b>' +
    '                </div>' +
    '            </div>' +
    '        </div>' +
    '        <form>' +
    '            <div class="hidden mapping-content">' +
    '            </div>' +
    '            <div class="row space full">' +
    '                <div class="col-9"> </div>' +
    '                <div class="col-3">' +
    '                    <button class="panta-btn panta-bgcolor-green panta-js-button" disabled="disabled" id="btn-export">' +
    '                        Exportieren' +
    '                    </button>' +
    '                </div>' +
    '            </div>' +
    '            <div class="row">' +
    '                <div class="col-12 hidden error-messages">' +
    '                    <p class="error" id="error-message"></p>' +
    '                </div>' +
    '                <div class="col-12 hidden warning-messages">' +
    '                    <p class="warning" id="warning-message"></p>' +
    '                </div>' +
    '            </div>' +
    '        </form>';

const template_admin_errorpage =
    '<div class="row full">' +
    '   <div class="col-12 hidden error-messages">' +
    '       <p class="error" id="error-message"></p>' +
    '   </div>' +
    '   <div class="col-12 hidden warning-messages">' +
    '       <p class="warning" id="warning-message"></p>' +
    '   </div>' +
    '   <div class="col-12 space">' +
    '       <button id="btn-reset" class="panta-btn panta-bgcolor-red">Zurücksetzen</button>' +
    '   </div>' +
    '</div>';

const template_admin_progress = '<div class="overlay js-panta-progress progress-overlay">' +
    '            <div class="row full">' +
    '                <div class="col-12">' +
    '                    <p class="space"><span class="js-panta-current-record">?</span>/<span class="js-panta-total-records">?</span> <span class="js-panta-progress-postfix"></span></p>' +
    '                    <p class="details js-panta-record-details"></p>'
'                </div>' +
'            </div>' +
'        </div>';