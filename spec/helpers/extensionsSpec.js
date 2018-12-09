describe("Test extension functions", function () {

    describe("HTML prototype tests", function () {
        it("Add class to an HTML element", function () {
            let sut = document.createElement("div");
            sut.addClass("test").addClass("test");
            expect(sut.getAttribute("class")).toBe("test");
        });

        it("Remove class of an HTML element", function() {
            let sut = document.createElement("div");
            sut.addClass("test").addClass("another");
            expect(sut.getAttribute("class")).toBe("test another");
            sut.removeClass("test");
            expect(sut.getAttribute("class")).toBe("another");
        });

        it("Remove CSS classes on an HTML element", function() {
            let sut = document.createElement("div");
            sut.addClass("chuck").addClass("norris").addClass("fi");
            sut.removeClasses(["chuck", "norris"]);
            expect(sut.getAttribute("class")).toBe("fi");
        });

        it("Remove child nodes of an HTML element", function() {
            let sut = document.createElement("div");
            sut.appendChild(document.createElement("span"));
            sut.appendChild(document.createElement("span"));
            expect(sut.children.length).toBe(2);
            sut.removeChildren();
            expect(sut.children.length).toBe(0);
        });

    });

    describe("Test global functions", function() {
        it("Check if a text is considered blank", function() {
            expect(window.isBlank("")).toBe(true);
            expect(window.isBlank("  ")).toBe(true);
            expect(window.isBlank(" d ")).toBeFalsy();
        });
    })


});