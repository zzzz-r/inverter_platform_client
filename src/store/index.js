import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    plantId: null,
    miListInfo: null,
  },
  getters: {
  },
  mutations: {
    setPlantId (state, plantId) {
      state.plantId = plantId;
    },
    setMiListInfo(state, miListInfo){
      state.miListInfo = miListInfo;
    }
  },
  actions: {
  },
  modules: {
  }
})
