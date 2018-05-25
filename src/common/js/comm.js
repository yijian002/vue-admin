var config = require('../../../config/dev.env');

const CACHE_KEYWORD = 'operationplatform_';

export default {
    log(content, type) {
        if (!config.LOG_DEBUG) {
            return;
        }

        type = type || 'info';
        if (window.console) {
            if (type === 'error' && console.error) {
                console.error(content);
            } else if (type === 'warning' && console.warn) {
                console.warn(content);
            } else {
                console.log(content);
            }
        }
    },
    mergeArr() {
        return Array.prototype.concat.apply([], arguments);
    },
    getCache(name, isJson) {
        var _cache = window.localStorage.getItem(CACHE_KEYWORD + name);
        if (isJson && _cache) {
            _cache = JSON.parse(_cache);
        }
        return _cache;
    },
    setCache(name, val) {
        window.localStorage.setItem(CACHE_KEYWORD + name, val);
    },
    removeCache(name) {
        window.localStorage.removeItem(CACHE_KEYWORD + name);
    },
    getDate(int_time, type) {
        if (String(int_time).length === 10) {
            int_time *= 1000;
        }
        int_time = String(int_time).substr(0, 13);
        int_time = new Date(Number(int_time));

        var year = int_time.getFullYear(),
            month = int_time.getMonth() + 1,
            day = int_time.getDate(),
            hour = int_time.getHours(),
            minute = int_time.getMinutes(),
            s = int_time.getSeconds();

        var _zero = function(v) {
            return v < 10 ? ('0' + v) : v;
        };

        switch (type) {
            case 'MDHMS':
                int_time = _zero(month) + '/' + _zero(day) + ' ' + _zero(hour) + ':' + _zero(minute) + ':' + _zero(s);
                break;
            case 'MDHM':
                int_time = _zero(month) + '/' + _zero(day) + ' ' + _zero(hour) + ':' + _zero(minute);
                break;
            case 'MDHM-UT':
                int_time = _zero(month) + '月' + _zero(day) + '日 ' + _zero(hour) + ':' + _zero(minute);
                break;
            case 'YMD':
                int_time = year + '-' + _zero(month) + '-' + _zero(day);
                break;
            case 'MD':
                int_time = _zero(month) + '-' + _zero(day);
                break;
            case 'HM':
                int_time = _zero(hour) + ':' + _zero(minute);
                break;
            case 'HMS':
                int_time = _zero(hour) + ':' + _zero(minute) + ':' + _zero(s);
                break;
            default:
                int_time = year + '-' + _zero(month) + '-' + _zero(day) + ' ' + _zero(hour) + ':' + _zero(minute) + ':' + _zero(s);
        }

        return int_time;
    }
};
