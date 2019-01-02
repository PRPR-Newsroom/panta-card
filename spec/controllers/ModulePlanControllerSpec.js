describe('The Module Plan Controller provides business logic for Module «Plan»', function () {

    // the trello API mock
    let trello = jasmine.createSpyObj('Trello', ['set', 'cards', 'get', 'board']);
    // the DI mock
    let mockdi = jasmine.createSpyObj("MockDI", ['getArticleRepository']);
    // the repo mock
    let repo = jasmine.createSpyObj("Repository", ['isNew', 'add', 'replace', 'get', 'all']);
    mockdi.getArticleRepository.and.returnValue(repo);
    let di = DI.create({
        implementation: function () {
            return mockdi;
        }
    });

    let phone = jasmine.createSpyObj("Telephone", ['postMessage']);

    let data = {
        "cap_on_depenses": 1
    };
    trello.get.and.callFake(function () {
        return {
            then: function (callback) {
                callback(data);
                return this;
            }
        };
    });

    /**
     * @type {ModulePlanController}
     */
    let sut = ModulePlanController.getInstance(trello, window, phone);

    it('Properties are read on startup', function () {
        let result = sut.getCapOnDepenses();
        expect(result).toBe(1);
    });

    it('When updating the telephone is used', function () {
        // sut.render(new Plan(1, null, null, 0, 0, 0, 0, 0, 0, null, null, null, null, null, null));
        sut.update();
        expect(phone.postMessage).toHaveBeenCalledWith({
            'get': ['fee:current',
                'fee:overall',
                'charge:current',
                'charge:overall',
                'costs:overall']
        });
    });

});