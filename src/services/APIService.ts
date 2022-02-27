export default class APIService {


    getStatements() {
        return fetch('http://localhost:8081/rdf4j-server/repositories/skuska/statements', {
            method: 'GET',
            headers: {
                'Accept': 'application/ld+json'
            }
        }).then(response => response.json())
            .then(data => console.log(data));
    }


    async createRepository(id: string, title: string, persist: boolean, delay: number, store: string) {
        const response = await fetch('http://localhost:8081/rdf4j-server/repositories/' + id, {
            method: 'PUT',
            headers: {
                'Content-Type' : 'text/turtle'
            }
        });
    }
    deleteRepository(id: string) {
        fetch('http://localhost:8081/rdf4j-server/repositories/' + id, {
            method: 'DELETE',
        }).then(response => response)
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

    async getTypesOfRepository(repositoryName: string) {
        return await fetch('http://localhost:8081/rdf4j-server/repositories/' + repositoryName + '?query=select%20distinct%20?type%20where%20%7B?subj%20a%20?type%7D', {
            method: 'GET',
            headers: {
                'Accept': 'application/sparql-results+json',
                // 'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }
}