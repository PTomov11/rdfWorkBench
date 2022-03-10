export default class APIService {

    async getStatements(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/statements', {
            method: 'GET',
            headers: {
                'Accept': 'application/rdf+json'
            }
        }).then(response => response.json())
    }


    async createRepository(id: string, title: string, persist: boolean, delay: number, store: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + id, {
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
                      rep:repositoryID "${id}" ;
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
    async deleteRepository(repositoryName: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName, {
            method: 'DELETE',
        })
    }

    async getListOfRepositories() {
        return await fetch('http://localhost:8081/rdf4j-server/repositories', {
          method: 'GET',
          headers: {
            'Accept': 'application/sparql-results+json'
          }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    async getContextsOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/contexts', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    async getNamespacesOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces', {
            method: 'GET',
            headers: {
                'Accept': 'application/json'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    async updateNamespaceOfRepository(repositoryName: string, prefix: string, namespace: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces/' + prefix, {
            method: 'PUT',
            headers: {
                'Content-Type': 'text/plain'
            },
            body: `${namespace}`
        })
    }

    async deleteNamespaceOfRepository(repositoryName: string, prefix: string) {
        await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '/namespaces/' + prefix, {
            method: 'DELETE'
        })
    }

    async getTypesOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=select%20distinct%20?type%20where%20%7B?subj%20a%20?type%7D', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

    async query(repositoryName: string, queryString: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=' + queryString, {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }

}