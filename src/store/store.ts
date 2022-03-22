import { createStore } from 'vuex'
import {Namespace} from "@/views/Explore/types/ExploreTypes";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

// export const SIDEBAR_WIDTH = 200
// export const SIDEBAR_WIDTH_COLLAPSED = 50

// Create a new store instance.
const store = createStore({
    state: {
        selectedRepository: {
            id: { type: "aa", value: "skuska2"},
            title: { type: "aa", value: "aaa"},
            uri: { type: "aa", value: "http://localhost:8080/rdf4j-server/repositories/skuska2"},
        } as Repository,
        namespaces: [] as Namespace[],
        // collapsed: false
    },
    mutations: {
        SET_SELECTED_REPOSITORY(state, repository: Repository) {
            state.selectedRepository = repository
        },
        SET_NAMESPACES(state, namespaces: Namespace[]) {
            state.namespaces = namespaces
        },
        // SET_COLLAPSED(state, collapsed: boolean) {
        //     state.collapsed = collapsed
        // }
    },
    actions: {
        changeSelectedRepository({commit}, repository: Repository) {
            commit('SET_SELECTED_REPOSITORY', repository)
        },
        setNamespaces({commit}, namespaces: Namespace[]) {
            commit('SET_NAMESPACES', namespaces)
        },
        // setCollapsed({commit}, collapsed: boolean) {
        //     commit('SET_COLLAPSED', collapsed)
        // }
    }
})

export default store