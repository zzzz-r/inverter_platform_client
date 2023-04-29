import axios from "axios";
import {request} from "./request"

export const getAction = (url,params) => {
    return request.get(url, params)
}
export const postAction = (url, data) => {
    return request.post(url, data)
}
export const putAction = (url, data) => {
    return request.put(url, data)
}
export const deleteAction = (url, params) => {
    return request.delete(url, params)
}