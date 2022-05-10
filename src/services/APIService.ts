import {LazyParam} from "@/views/Explore/types/ExploreTypes";
import useStore from "@/store/store";

/*
 Author: Patrik Tomov
 Date: 7.5.2022
*/
export default class APIService {
    /** Return all triples in specific format for download
     * @param {string} repositoryName
     * @param {string} dataFormat
     */
    async getStatementsForDownload(repositoryName: string, dataFormat: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/statements', {
            method: 'GET',
            headers: {
                'Accept': `${dataFormat}`
            }
        }).then(response => response.text())
    }

    /** Return size of repository
     * @param {string} repositoryName
     */
    async getRepositorySize(repositoryName: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/size', {
            method: 'GET'
        }).then(response => response.text())
    }

    /** Return number of contexts in repository
     * @param {string} repositoryName
     */
    async getRepositoryContexts(repositoryName: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/contexts', {
            method: 'GET'
        }).then(response => response.text())
    }

    /** Create repository with parameters
     * @param {string} repositoryName
     * @param {string} title
     * @param {boolean} persist
     * @param {number} delay
     * @param {string} store
     */
    async createRepository(repositoryName: string, title: string, persist: boolean, delay: number, typeOfStore: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'text/turtle'
            },
            body: `@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#>.
                   @prefix rep: <http://www.openrdf.org/config/repository#>.
                   @prefix sr: <http://www.openrdf.org/config/repository/sail#>.
                   @prefix sail: <http://www.openrdf.org/config/sail#>.
                   @prefix ms: <http://www.openrdf.org/config/sail/memory#>.

                   [] a rep:Repository ;
                      rep:repositoryID "${repositoryName}" ;
                      rdfs:label "${title}" ;
                      rep:repositoryImpl [
                         rep:repositoryType "openrdf:SailRepository" ;
                         sr:sailImpl [
                        sail:sailType "openrdf:${typeOfStore}" ;
                        ms:persist ${persist} ;
                        ms:syncDelay ${delay}
                         ]
                      ].`
        });
    }

    /** Delete whole repository
     * @param {string} repositoryName
     */
    async deleteRepository(repositoryName: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName, {
            method: 'DELETE',
        })
    }

    /** Return list of repositories
     */
    async getListOfRepositories() {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories`, {
          method: 'GET',
          headers: {
            'Accept': 'application/sparql-results+json'
          }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Return all repository contexts in repository
     * @param {string} repositoryName
     */
    async getContextsOfRepository(repositoryName: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/contexts', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Return all namespaces in repository
     * @param {string} repositoryName
     */
    async getNamespacesOfRepository(repositoryName: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/namespaces', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Update namespace and prefix of repository
     * @param {string} repositoryName
     * @param {string} prefix
     * @param {string} namespace
     */
    async updateNamespaceOfRepository(repositoryName: string, prefix: string, namespace: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/namespaces/' + prefix, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${namespace}`
        })
    }

    /** Delete namespace with prefix in repository
     * @param {string} repositoryName
     * @param {string} prefix
     */
    async deleteNamespaceOfRepository(repositoryName: string, prefix: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/namespaces/' + prefix, {
            method: 'DELETE'
        })
    }

    /** Return all types in repository
     * @param {string} repositoryName
     */
    async getTypesOfRepository(repositoryName: string) {
        const store =  useStore()
        return await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '?query=select%20distinct%20?type%20where%20%7B?subj%20a%20?type%7D', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Execute query in repository
     * @param {string} repositoryName
     * @param {string} queryString
     * @param {boolean} isAsk
     * @param {number} limit
     * @param {LazyParam} lazyParams
     */
    async query(repositoryName: string, queryString: string, isAsk: boolean, lazyParams:  LazyParam) {
        const store =  useStore()
        let apiString = ''
        if (lazyParams !== null) {
            apiString = `${store.rdfServerUrl}/repositories/` + repositoryName + '?query=' + queryString + `&limit=${lazyParams.rows}` + `&offset=${lazyParams.first}`
        } else {
            apiString = `${store.rdfServerUrl}/repositories/` + repositoryName + '?query=' + queryString
        }
        return await fetch(apiString, {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
            }
        }).then(response => response.json())
            .then(data => {
                if (isAsk) {
                    return data
                } else {
                    return data.results.bindings
                }
            })
    }

    /** Delete all statements in repository
     * @param {string} repositoryName
     */
    async deleteAllStatements(repositoryName: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/statements', {
            method: 'DELETE',
        })
    }

    /** Zmaže všetky trojice v repozitáry, ktoré vyhovujú parametrom
     * @param {string} repositoryName
     * @param {string} parameter - value subj, pred or obj
     * @param {string} value - value of resource
     * @param {string} context - context of deleted triple
     */
    async deleteSpecifiedStatements(repositoryName: string, parameter: string, value: string, context: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/statements' + `?${parameter}=${value}` + `&context=${context}`, {
            method: 'DELETE'
        })
    }

    /** Add data to repository with text content or file
     * @param {string} repositoryName
     * @param {boolean} replaceData - replace or add data
     * @param {string} type -
     * @param {any} file - file to be uploaded or null
     * @param {string} content - text data to be uploaded or null
     * @param {string} context - value of context (value or null)
     */
    async updateRepositoryStatementsWithFileOrContent(repositoryName: string, replaceData: boolean, type: string, file: any, content: string, context: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/statements' + `?context=${context}`, {
            method: replaceData ? 'PUT' : 'POST',
            headers: {
                'Content-Type': type,
            },
            body: file === null ? content : file
        })

    }

    /** Add data to repository with encoded query
     * @param {string} repositoryName
     * @param {string} type -
     * @param {string} content - encoded query
     * @param {string} context - value of context (value or null)
     */
    async updateRepositoryStatementsWithQuery(repositoryName: string, type: string, content: string, context: string) {
        const store =  useStore()
        await fetch(`${store.rdfServerUrl}/repositories/` + repositoryName + '/statements' + `?context=${context}`, {
            method: 'POST',
            headers: {
                'Content-Type': type,
            },
            body: "update=" + content
        })
    }
}