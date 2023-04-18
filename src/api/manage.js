import axios from "axios";

axios.defaults.baseURL = 'http://localhost:8082'
export const getAction = (url, params) => {
    return axios({
        url: url,
        method: 'get',
        params
    })
}

export const postAction = (url, data) => {
    return axios({
        url: url,
        method: 'post',
        data
    })
}
export const putAction = (url, data) => {
    return axios({
        url: url,
        method: 'put',
        data
    })
}
export const deleteAction = (url, params) => {
    return axios({
        url: url,
        method: 'delete',
        params
    })
}