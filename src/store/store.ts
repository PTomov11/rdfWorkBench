import { createStore } from 'vuex'
import {Namespace} from "@/views/Explore/types/ExploreTypes";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

// Create a new store instance.
const store = createStore({
    state: {
        selectedRepository: {
            id: { type: "aa", value: "skuska2"},
            title: { type: "aa", value: "aaa"},
            uri: { type: "aa", value: "http://localhost:8080/rdf4j-server/repositories/skuska2"},
        } as Repository,
        namespaces: [] as Namespace[],
    },
    mutations: {
        SET_SELECTED_REPOSITORY(state, repository: Repository) {
            state.selectedRepository = repository
        },
        SET_NAMESPACES(state, namespaces: Namespace[]) {
            state.namespaces = namespaces
        }
    },
    actions: {
        changeSelectedRepository({commit}, repository: Repository) {
            commit('SET_SELECTED_REPOSITORY', repository)
        },
        setNamespaces({commit}, namespaces: Namespace[]) {
            commit('SET_NAMESPACES', namespaces)
        }
    }
})

export default store