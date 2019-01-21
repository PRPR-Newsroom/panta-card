
class TabIndexProvider {

    constructor() {
        this.current = 1;
    }

    getAndIncrement() {
        return this.current++;
    }

    reset() {
        this.current = 1;
    }

}