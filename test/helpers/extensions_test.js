require("../../public/js/helpers/extensions");

describe("Test extension functions", function () {

    describe("HTML prototype tests", function () {
        it("Add class to an HTML element", function () {
            let sut = document.createElement("div");
            sut.addClass("test");
            expect(sut.getAttribute("class")).toBe("test");
        });
    });


});