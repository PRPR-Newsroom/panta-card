describe("The ArtikelController provides business logic", function() {

    // the trello API mock
    let trello = jasmine.createSpyObj('Trello', ['set', 'cards', 'get']);
    // the DI mock
    let mockdi = jasmine.createSpyObj("MockDI", ['getArticleRepository']);
    // the repo mock
    let repo = jasmine.createSpyObj("Repository", ['isNew', 'add', 'replace', 'get', 'all']);
    mockdi.getArticleRepository.and.returnValue(repo);
    let di = DI.create({
        implementation: function() {
            return mockdi;
        }
    });

    /**
     * @type {ArtikelController}
     */
    let sut = ArtikelController.getOrCreateInstance(trello, window);

    beforeEach(function() {
        expect(trello.set).toHaveBeenCalledWith('card', 'shared', 'panta.Meta', jasmine.objectContaining({"version": 1}));
    });

    describe("and with the entity management API you have access to the model", function() {

        it("inserts a new entity when it is not yet managed by the controller", function() {
            repo.isNew.and.returnValue(true);
            let artikel = Artikel.create();
            sut.insert(artikel, { id: 1});
            expect(di.getArticleRepository().isNew).toHaveBeenCalledWith(artikel);
            expect(di.getArticleRepository().add).toHaveBeenCalledWith(artikel, { id: 1 });
        });

        it("inserting a new entity that is already managed must replace the old one", function() {
            repo.isNew.and.returnValue(false);
            let artikel = Artikel.create();
            sut.insert(artikel, { id: 1});
            expect(di.getArticleRepository().isNew).toHaveBeenCalledWith(artikel);
            expect(di.getArticleRepository().replace).toHaveBeenCalledWith(artikel, { id: 1 });
        });

        it("can lookup the entity by a trello card", function() {
            let artikel = Artikel.create();
            repo.get.and.callFake(function(card) {
                if (card.id === 1) {
                    return artikel;
                } else {
                    return null;
                }
            });
            sut.insert(artikel, {id: 1});
            expect(sut.getByCard({id : 1})).toBe(artikel);
            expect(sut.getByCard({id : 2})).toBeNull();
        });

        it("checks if there's content in an article", function() {
            let mock = jasmine.createSpyObj('Article', ['isEmpty']);
            sut.hasArtikelContent(mock);
            expect(mock.isEmpty).toHaveBeenCalled();
        });

        it("can read all articles from the trello API", function() {
            // TODO does not work yet with promise :-(
            let data = {
                id: 1,
                closed: false
            };
            let article = Artikel.create();
            repo.all.and.returnValue({1: article});
            trello.get.and.callFake(function() {
                return {
                    then: function(callback) {
                        callback("{}");
                        return this;
                    }
                }
            });
            trello.cards.and.callFake(function() {
                return {
                    filter: function(callback) {
                        callback(data);
                        return this;
                    },
                    each: function(callback) {
                        callback(data);
                        return this;
                    },
                    then: function(callback) {
                        callback(data);
                        return this;
                    }
                };
            });
            sut.fetchAll()
                .then(function() {
                    expect(trello.cards).toHaveBeenCalledWith('id', 'closed');
                });
        });

    })

});
