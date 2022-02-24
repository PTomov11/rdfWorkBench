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
}