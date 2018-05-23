import axios from 'axios';

const BASE = '';

export default {
    get: function(url, params) {
        return axios.get(BASE + url, params || {}).then(res => res.data);
    },
    post: function(url, params) {
        return axios.post(BASE + url, params || {}).then(res => res.data);
    },
    put: function(url, params) {
        return axios.put(BASE + url, params || {}).then(res => res.data);
    },
    del: function(url, params) {
        return axios.delete(BASE + url, params || {}).then(res => res.data);
    }
};

export const requestLogin = params => {
    return axios.post(`${BASE}/sysmanage/login`, params).then(res => res.data);
};
