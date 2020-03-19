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
                    this.loggingService = new LoggingService().open();

                }

                getArticleRepository() {
                    return new ArtikelRepository();
                }

                getTabIndexProvider() {
                    return this.tabIndexProvider;
                }

                getAdminService(trello) {
                    return new AdminService(this.getTrelloClient(trello), this.loggingService);
                }

                getLoggingService() {
                    return this.loggingService;
                }

                getTrelloClient(trello) {
                    return new TrelloClient(trello, this.loggingService);
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

    /**
     * @return {LoggingService}
     */
    getLoggingService() {}

    /**
     * @return {TrelloClient}
     */
    getTrelloClient(trello) {}

}

DI.INSTANCE = null;