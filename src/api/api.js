import {deleteAction, getAction, postAction, putAction} from "@/api/manage";

export const addPlant = (param) => postAction("/plant/add", param)
export const listPlant = (param) => getAction("/plant/list", param)
export const detailPlant = (id) => getAction("/plant/detail/"+id, null)
export const deletePlant = (id) => deleteAction("/plant/delete/"+id, null)
export const editPlant = (id, param) => putAction("/plant/edit/"+id, param)