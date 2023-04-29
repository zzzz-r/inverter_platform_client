import {deleteAction, getAction, postAction, putAction} from "@/api/manage";

export const addPlant = (param) => postAction("/plant/add", param)
export const listPlant = (param) => getAction("/plant/list", param)
export const detailPlant = (id) => getAction("/plant/detail/info/"+id, null)
export const detailPlantList = (id) => getAction("/plant/detail/plantList/"+id, null)
export const detailPlantHistory = (id) => getAction("/plant/detail/history/"+id, null)
export const deletePlant = (id) => deleteAction("/plant/delete/"+id, null)
export const editPlant = (id, param) => putAction("/plant/edit/"+id, param)
export const userLogin = (param) => postAction("/user/login", param)
export const userRegister = (param) => postAction("/user/register", param)
export const getUser = (username) => getAction("/user/username/"+username, null)
export const updateUser = (id, param) => putAction("/user/update/"+id, param)
export const listMi = (plantId) => getAction("/mi/list/"+plantId, null)
export const getMiAllInfo = (miId) => getAction("/mi/detail/"+miId, null)
export const getMiDayPowerInfo = (miId) => getAction("/mi/dayInfo/"+miId, null)
export const listAlarmMi = () => getAction("/mi/alarm/", null)
export const listAlarmDtu = () => getAction("/dtu/alarm/", null)
export const listDtu = (plantId) => getAction("/dtu/list/"+plantId, null)
