/**
 * @abstract
 */
class DI {

    /**
     * @returns {DI}
     */
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

                constructor() {
                    super();
                    /**
                     * @type {TabIndexProvider}
                     */
                    this.tabIndexProvider = new TabIndexProvider();
                    //
                    // /**
                    //  * @type {AdminService}
                    //  */
                    // this.adminService = new AdminService("0bdd0023d8f9b9a23ed80260495bbe9b");
                }

                getArticleRepository() {
                    return new ArtikelRepository();
                }

                getTabIndexProvider() {
                    return this.tabIndexProvider;
                }

                getAdminService(trello) {
                    return new AdminService(trello);
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

    /**
     * Get a singleton provider
     * @return {TabIndexProvider}
     * @abstract
     */
    getTabIndexProvider() {}

    /**
     * Get the trello remote service
     * @return {AdminService}
     */
    getAdminService(trello) {}

}

DI.INSTANCE = null;