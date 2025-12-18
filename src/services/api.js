// axios setup with auth token
// interceptors add kora ache for auth
import axios from 'axios';
import Cookies from 'js-cookie';
import API_URL from '../config/api';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,
    timeout: 10000
});

// request interceptor - add token
api.interceptors.request.use(config => {
    let token = Cookies.get('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    // console.log('request:', config.url) // debug
    return config
})

// response interceptor - error handle
api.interceptors.response.use(
    res => res,
    err => {
        var status = err.response?.status

        if (status === 401) {
            // token expired maybe
            Cookies.remove('token')
            console.log('401 - token issue')
            // redirect maybe - but breaks SSR/initial load
            // if (!window.location.pathname.includes('/login')) {
            //     window.location.href = '/login'
            // }
        } else if (status === 403) {
            console.warn('403 forbidden:', err.response?.data?.error)
        } else if (status === 404) {
            // let component handle
        } else {
            console.log('api error:', err.message)
        }

        return Promise.reject(err)
    }
)

export default api
