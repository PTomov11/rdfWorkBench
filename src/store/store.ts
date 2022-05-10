import {defineStore} from "pinia";
import {Column, Namespace} from "@/views/Explore/types/ExploreTypes";
import {Repository} from "@/views/Repositories/types/RepositoriesTypes";

/*
 Author: Patrik Tomov
 Date: 7.5.2022
*/
/** Store, drží podstatné dáta, ktoré sú dostupné v každej komponente **/
export const useStore = defineStore({
    id: 'main',
    state: () => ({
        selectedRepository: {id: { type:"", value: ""}} as Repository,
        namespaces: [] as Namespace[],
        rdfServerUrl: 'http://localhost:8080/rdf4j-server' as string,
        numberOfStatements: 0 as number,
        numberOfContexts: 0 as number,
        collapsed: false as boolean,
        SIDEBAR_WIDTH: 200 as number,
        SIDEBAR_WIDTH_COLLAPSED: 50 as number,
        queryResults: [] as any,
        columns: [] as Column[],
    }),
    getters: {
        getSelectedRepository(): Repository {
            return this.selectedRepository
        },
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
        },
        getCollapsed(): boolean {
            return this.collapsed
        },
        getSideBarWidth(): string {
            return `${this.collapsed ? this.SIDEBAR_WIDTH_COLLAPSED : this.SIDEBAR_WIDTH}px`
        },
        getQueryResults(): [] {
            return this.queryResults
        },
        getColumns(): Column[] {
            return this.columns
        },
        getQueryResultsCount(): number {
            return this.queryResults.length
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
        },
        toggleSideBar() {
            this.collapsed = !this.collapsed
        },
        setQueryResults(queryResult: []) {
            this.queryResults = queryResult
        },
        setColumns(columns: Column[]) {
            this.columns = columns
        },
    }
})

export default useStore