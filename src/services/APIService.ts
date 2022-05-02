import router from "@/router/router";
import {LazyParam} from "@/views/Explore/types/ExploreTypes";

export default class APIService {

    /** Vracia všetky trojice v repozitáry
     * @param {string} repositoryName
     */
    async getStatements(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements', {
            method: 'GET',
            headers: {
                'Accept': 'application/rdf+json'
            }
        }).then(response => response.json())
    }

    /** Vracia všetky trojice v danom formáte pre stiahnutie
     * @param {string} repositoryName
     * @param {string} dataFormat
     */
    async getStatementsForDownload(repositoryName: string, dataFormat: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements', {
            method: 'GET',
            headers: {
                'Accept': `${dataFormat}`
            }
        }).then(response => response.text())
    }

    /** Vracia veľkosť daného repozitára
     * @param {string} repositoryName
     */
    async getRepositorySize(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/size', {
            method: 'GET'
        }).then(response => response.text())
    }

    /** Vracia počet kontextov v danom repozitáry
     * @param {string} repositoryName
     */
    async getRepositoryContexts(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/contexts', {
            method: 'GET'
        }).then(response => response.text())
    }

    /** Vytvorí repozitár so zadanými hodnotami
     * @param {string} repositoryName
     * @param {string} title
     * @param {boolean} persist
     * @param {number} delay
     * @param {string} store
     */
    async createRepository(repositoryName: string, title: string, persist: boolean, delay: number, store: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName, {
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
                        sail:sailType "openrdf:${store}" ;
                        ms:persist ${persist} ;
                        ms:syncDelay ${delay}
                         ]
                      ].`
        });
    }

    /** Zmaže daný repozitár
     * @param {string} repositoryName
     */
    async deleteRepository(repositoryName: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName, {
            method: 'DELETE',
        })
    }

    /** Vytvorí repozitár so zadanými hodnotami
     * @param {string} repositoryName
     * @param {string} title
     * @param {boolean} persist
     * @param {number} delay
     * @param {string} store
     */
    async getListOfRepositories() {
        return await fetch('http://localhost:8081/rdf4j-server/repositories', {
          method: 'GET',
          headers: {
            'Accept': 'application/sparql-results+json'
          }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Vráti všetky kontexty repozitára
     * @param {string} repositoryName
     */
    async getContextsOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/contexts', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Vráti všetky namespacy repozitára
     * @param {string} repositoryName
     */
    async getNamespacesOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Aktualizuje namespace a prefix repozitára
     * @param {string} repositoryName
     * @param {string} prefix
     * @param {string} namespace
     */
    async updateNamespaceOfRepository(repositoryName: string, prefix: string, namespace: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces/' + prefix, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${namespace}`
        })
    }

    /** Zmaže namespace s daným prefixom v repozitáry
     * @param {string} repositoryName
     * @param {string} prefix
     */
    async deleteNamespaceOfRepository(repositoryName: string, prefix: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces/' + prefix, {
            method: 'DELETE'
        })
    }

    /** Vráti všetky typy v repozitáry
     * @param {string} repositoryName
     */
    async getTypesOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=select%20distinct%20?type%20where%20%7B?subj%20a%20?type%7D', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    /** Vykoná dotaz nad repozitárom
     * @param {string} repositoryName
     * @param {string} queryString
     * @param {boolean} isAsk
     * @param {number} limit
     * @param {LazyParam} lazyParams
     */
    async query(repositoryName: string, queryString: string, isAsk: boolean, lazyParams:  LazyParam) {
        let apiString = ''
        if (lazyParams !== null) {
            apiString = 'http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=' + queryString + `&limit=${lazyParams.rows}` + `&offset=${lazyParams.first}`
        } else {
            apiString = 'http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=' + queryString
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

    /** Zmaže celý repozitár
     * @param {string} repositoryName
     */
    async deleteAllStatements(repositoryName: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements', {
            method: 'DELETE'
        })
    }

    /** Zmaže všetky trojice v repozitáry, ktoré vyhovujú parametrom
     * @param {string} repositoryName
     * @param {string} parameter - hodnota subj, pred alebo obj
     * @param {string} value - hodnota daného zdroja
     * @param {string} context - kontext, ktoreho sa tyka zmazanie
     */
    async deleteSpecifiedStatements(repositoryName: string, parameter: string, value: string, context: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements' + `?${parameter}=${value}` + `&context=${context}`, {
            method: 'DELETE'
        })
    }

    /** Pridá dáta do repozitorá prostredníctvom textového kontentu alebo prostredníctvom súboru
     * @param {string} repositoryName
     * @param {boolean} replaceData - označuje či sa majú nahradiť alebo pridať dáta
     * @param {string} type -
     * @param {any} file - súbor, ktorého obsah sa pridá do repozitára alebo null ak je to textovy kontent
     * @param {string} content - textové data pre pridanie do repozitára alebo null ak je to súbor
     * @param {string} context - hodnota kontextu s ktorým sa pridajú data alebo hodnota null kedy sa dáta pridajú bez kontextu
     */
    async updateRepositoryStatementsWithFileOrContent(repositoryName: string, replaceData: boolean, type: string, file: any, content: string, context: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements' + `?context=${context}`, {
            method: replaceData ? 'PUT' : 'POST',
            headers: {
                'Content-Type': type,
            },
            body: file === null ? content : file
        }).then(response => {
            if (!response.ok) {
                router.push({name: 'ErrorPage'})
            }
        })

    }

    /** Pridá dáta do repozitorá prostredníctvom zakódováneho query stringu
     * @param {string} repositoryName
     * @param {string} type -
     * @param {string} content - zakódovány dotaz
     * @param {string} context - hodnota kontextu s ktorým sa pridajú data alebo hodnota null kedy sa dáta pridajú bez kontextu
     */
    async updateRepositoryStatementsWithQuery(repositoryName: string, type: string, content: string, context: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements' + `?context=${context}`, {
            method: 'POST',
            headers: {
                'Content-Type': type,
            },
            body: "update=" + content
        }).then(response => {
            if (!response.ok) {
                console.log("network response not ok", response)
            }
        })
    }
}