
class LoggingService {

    constructor() {
    }

    /**
     * @return {File}
     */
    flush(name = "log.txt") {
        const blob = new Blob([this._logs.map(it => `${it.at.toISOString()}: [${it.level}]\t${it.msg}`).join(`\n`)], {type: 'text/plain'});
        return new File([blob], name, {type: "text/plain;charset=utf-8"});
    }

    /**
     * @return {LoggingService}
     */
    open() {
        this._reset();
        return this;
    }

    _reset() {
        this._logs = [];
    }

    i(info) {
        return this._log(this._logs, info, 'INFO');
    }

    d(debug) {
        return this._log(this._logs, debug, 'DEBUG');
    }

    t(trace) {
        return this._log(this._logs, trace, 'TRACE');
    }

    w(warn) {
       return this._log(this._logs, warn, 'WARN');
    }

    e(error) {
        return this._log(this._logs, error, 'ERROR');
    }

    _log(ctx, msg, level = 'INFO') {
        if (!ctx) {
            console.warn('The logging service is not yet opened');
            return this;
        }
        ctx.push({
            'at': new Date(),
            'level': level,
            'msg': msg
        });
        return this;
    }

}