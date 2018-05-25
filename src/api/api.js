import axios from 'axios';

const BASE = '';

export default {
    get(url, params) {
            return axios.get(BASE + url, { params: params || {} }).then(res => res.data)
                .catch(function(error) {
                    return { code: 500, message: error.message };
                });
        },
        post(url, params) {
            return axios.post(BASE + url, params || {}).then(res => res.data)
                .catch(function(error) {
                    return { code: 500, message: error.message };
                });
        },
        put(url, params) {
            return axios.put(BASE + url, params || {}).then(res => res.data)
                .catch(function(error) {
                    return { code: 500, message: error.message };
                });
        },
        del(url, params) {
            return axios.delete(BASE + url, { params: params || {} }).then(res => res.data)
                .catch(function(error) {
                    return { code: 500, message: error.message };
                });
        }
};

export const requestLogin = params => {
    return axios.post(`${BASE}/sysmanage/login/`, params).then(res => res.data);
};
