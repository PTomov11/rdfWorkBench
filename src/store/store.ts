import { createStore } from 'vuex'

// Create a new store instance.
const store = createStore({
    state: {
        selectedRepository: 'skuska',
    },
    mutations: {
        SET_SELECTED_REPOSITORY(state, name) {
            state.selectedRepository = name
        }
    },
    actions: {
        changeSelectedRepository({commit}, name) {
            commit('SET_SELECTED_REPOSITORY', name)
        }
    }
})

export default store