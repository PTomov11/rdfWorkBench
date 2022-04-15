import {defineStore} from "pinia";
import {Namespace} from "@/views/Explore/types/ExploreTypes";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

export const useStore = defineStore({
    id: 'main',
    state: () => ({
        selectedRepository: {id: { type:"", value: ""}} as Repository,
        namespaces: [] as Namespace[],
        rdfServerUrl: 'http://localhost:8080/rdf4j-server' as string,
        numberOfStatements: 0 as number,
        numberOfContexts: 0 as number,
    }),
    getters: {
        getNamespaces(): Namespace[] {
            return this.namespaces
        },
        getRdfServerUrl(): string {
          return this.rdfServerUrl
        },
        getNumberOfStatements(): number {
            return this.numberOfStatements
        },
        getNumberOfContexts(): number {
            return this.numberOfContexts
        }
    },
    actions: {
        setRepository(repository: Repository) {
            this.selectedRepository = repository
        },
        setNamespaces(namespaces: Namespace[]) {
          this.namespaces = namespaces
        },
        setRdfServerUrl(url: string) {
            this.rdfServerUrl = url
        },
        setNumberOfStatements(count: number) {
            this.numberOfStatements = count
        },
        setNumberOfContexts(count: number) {
            this.numberOfContexts = count
        }
    }
})

export default useStore