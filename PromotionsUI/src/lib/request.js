import axios from 'axios';
import { get } from 'lodash';

const API = axios.create({
    baseURL: 'http://localhost:3000/',
    timeout: 30000,
});

const authHeader = () => {
    const { auth: { token, user: { id } } } = window.store.getState();
    return { headers: { Authorization: `Bearer ${token}`, identity: id } };
};

const handle = (promise) => promise.then((res) => Promise.resolve(res)).catch((err) => get(err, 'response.status', '') === '401' ? window.open('/#/login', '_self') : Promise.reject(err));

export const request = {
    get: (url) => handle(API.get(url)),
    delete: ({ url }) => handle(API.delete(url, { data: {} })),
    login: ({ data, url }) => API.post(url, data),
    post: ({ data, url }) => handle(API.post(url, data)),
    multipart: ({ data, url }) => handle(API.post(url, data, {
        headers: {
            ...authHeader().headers,
            'Content-Type': 'multipart/form-data',
        },
    })),
    patch: ({ data, url }) => handle(API.patch(url, data)),
    put: ({ data, url }) => handle(API.put(url, data, authHeader())),
};

export default request;
