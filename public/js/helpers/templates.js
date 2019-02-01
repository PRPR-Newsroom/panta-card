// use: http://pojo.sodhanalibrary.com/string.html
let template_regular = '<div id="template">'+
    '    <div class="row">'+
    '        <div class="col-6 col-phone-12">'+
    '            <div class="row">'+
    '                <div class="col-12 col-phone-12">'+
    '                    <div class="pa.name"></div>'+
    '                </div>'+
    '                <div class="col-12 col-phone-12">'+
    '                    <div class="pa.social"></div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '        <div class="col-6 col-phone-12 line-4 line-phone-4">'+
    '            <div class="pa.notes"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-6 col-phone-12">'+
    '            <div class="pa.address"></div>'+
    '        </div>'+
    '        <div class="col-6 col-phone-12">'+
    '            <div class="pa.duedate"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-12 col-phone-12">'+
    '            <div class="row">'+
    '                <div class="col-4 col-phone-4">'+
    '                    <div class="pa.fee"></div>'+
    '                </div>'+
    '                <div class="col-4 col-phone-4">'+
    '                    <div class="pa.charges"></div>'+
    '                </div>'+
    '                <div class="col-4 col-phone-4">'+
    '                    <div class="pa.project"></div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

let template_regular_mobile = '<div id="template">'+
    '    <div class="row">'+
    '        <div class="col-phone-12">'+
    '            <div class="pa.name"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12 line-phone-4">'+
    '            <div class="pa.notes"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12">'+
    '            <div class="pa.social"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12">'+
    '            <div class="pa.address"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12">'+
    '            <div class="pa.duedate"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12">'+
    '            <div class="row">'+
    '                <div class="col-phone-4">'+
    '                    <div class="pa.fee"></div>'+
    '                </div>'+
    '                <div class="col-phone-4">'+
    '                    <div class="pa.charges"></div>'+
    '                </div>'+
    '                <div class="col-phone-4">'+
    '                    <div class="pa.project"></div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

let template_ad = '<div id="template" class="row">'+
    '    <div class="col-6 col-phone-12">'+
    '        <div class="row">'+
    '            <div class="col-12 col-phone-12">'+
    '                <div class="pa.notes"></div>'+
    '            </div>'+
    '        </div>'+
    '        <div class="row">'+
    '            <div class="col-6 col-phone-6">'+
    '                <div class="pa.format"></div>'+
    '            </div>'+
    '            <div class="col-6 col-phone-6">'+
    '                <div class="pa.placement"></div>'+
    '            </div>'+
    '        </div>'+
    '        <div class="row">'+
    '            <div class="col-6 col-phone-6">'+
    '                <div class="pa.price"></div>'+
    '            </div>'+
    '            <div class="col-6 col-phone-6">'+
    '                <div class="pa.total"></div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="col-6 col-phone-12">'+
    '        <div class="row">'+
    '            <div class="col-12 col-phone-12">'+
    '                <div class="pa.name"></div>'+
    '            </div>'+
    '            <div class="col-12 col-phone-12">'+
    '                <div class="pa.social"></div>'+
    '            </div>'+
    '            <div class="col-12 col-phone-12">'+
    '                <div class="pa.address"></div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

let template_plan = '<div id="template">'+
    '    <div class="row">'+
    '        <div class="col-6 line-2">'+
    '            <div class="pa.plan.measures"></div>'+
    '        </div>'+
    '        <div class="col-3">'+
    '            <div class="pa.plan.fee"></div>'+
    '        </div>'+
    '        <div class="col-3">'+
    '            <div class="pa.plan.projectFee"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-6 line-6">'+
    '            <div class="pa.plan.description"></div>'+
    '        </div>'+
    '        <div class="col-6">'+
    '            <div class="row">'+
    '                <div class="col-6">'+
    '                    <div class="pa.plan.thirdPartyCharges"></div>'+
    '                </div>'+
    '                <div class="col-6">'+
    '                    <div class="pa.plan.thirdPartyTotalCosts"></div>'+
    '                </div>'+
    '                <div class="col-6">'+
    '                    <div class="pa.plan.capOnDepenses"></div>'+
    '                </div>'+
    '                <div class="col-6 line-2">'+
    '                    <div class="pa.plan.totalCosts"></div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    ''+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.visual"></div>'+
    '        </div>'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.form"></div>'+
    '        </div>'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.online"></div>'+
    '        </div>'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.season"></div>'+
    '        </div>'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.region"></div>'+
    '        </div>'+
    '        <div class="col-2">'+
    '            <div id="pa.plan.place"></div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

let template_artikel = '<div id="template">'+
    '    <div class="row">'+
    '        <div class="col-9 col-phone-9">'+
    '            <div id="pa.topic"></div>'+
    '        </div>'+
    '        <div class="col-3 col-phone-3">'+
    '            <div id="pa.pagina"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-9 col-phone-9">'+
    '            <div class="row">'+
    '                <div class="col-6 col-phone-6">'+
    '                    <div id="pa.input-from"></div>'+
    '                </div>'+
    '                <div class="col-6 col-phone-6">'+
    '                    <div id="pa.author"></div>'+
    '                </div>'+
    '            </div>'+
    '        </div>'+
    '        <div class="col-3 col-phone-3">'+
    '            <div id="pa.layout"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-9 col-phone-9">'+
    '            <div id="pa.text"></div>'+
    '        </div>'+
    '        <div class="col-3 col-phone-3">'+
    '            <div id="pa.total"></div>'+
    '        </div>'+
    '    </div>'+
    ''+
    '    <div class="col-12 col-phone-12">'+
    '        <div class="row">'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.visual"></div>'+
    '            </div>'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.form"></div>'+
    '            </div>'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.tags"></div>'+
    '            </div>'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.season"></div>'+
    '            </div>'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.region"></div>'+
    '            </div>'+
    '            <div class="col-2 col-phone-4">'+
    '                <div id="pa.location"></div>'+
    '            </div>'+
    '        </div>'+
    '    </div>'+
    '</div>';

let template_plan_mobile = '<div id="template">'+
    '    <div class="row">'+
    '        <div class="col-phone-12 line-phone-2">'+
    '            <div class="pa.plan.measures"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-12 line-phone-4">'+
    '            <div class="pa.plan.description"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.fee"></div>'+
    '        </div>'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.projectFee"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.thirdPartyCharges"></div>'+
    '        </div>'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.thirdPartyTotalCosts"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.capOnDepenses"></div>'+
    '        </div>'+
    '        <div class="col-phone-6">'+
    '            <div class="pa.plan.totalCosts"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.visual"></div>'+
    '        </div>'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.form"></div>'+
    '        </div>'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.online"></div>'+
    '        </div>'+
    '    </div>'+
    '    <div class="row">'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.season"></div>'+
    '        </div>'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.region"></div>'+
    '        </div>'+
    '        <div class=" col-phone-4">'+
    '            <div id="pa.plan.place"></div>'+
    '        </div>'+
    '    </div>'+
    '</div>';