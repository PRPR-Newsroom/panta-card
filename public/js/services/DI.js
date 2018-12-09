/**
 * @abstract
 */
class DI {

    static getInstance() {
        if (DI.INSTANCE === null) {
            this.create();
        }
        return DI.INSTANCE;
    }

    /**
     * @param configuration
     * @returns {DI}
     */
    static create(configuration) {

        if (DI.INSTANCE) {
            return DI.INSTANCE;
        }

        if (configuration && configuration.hasOwnProperty("implementation")) {
            DI.INSTANCE = configuration["implementation"]();
        } else {
            /**
             * Default implementation
             */
            class DefaultDI extends DI {

                getArticleRepository() {
                    return new ArtikelRepository();
                }
            }
            DI.INSTANCE = new DefaultDI();
        }
        return DI.INSTANCE;
    }

    /**
     * @returns {Repository}
     * @abstract
     */
    getArticleRepository() {}

}

DI.INSTANCE = null;