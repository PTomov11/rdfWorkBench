export default class APIService {


    getStatements() {
        return fetch('http://localhost:8080/rdf4j-server/repositories/skuska/statements', {
            method: 'GET',
            headers: {
                'Accept': 'application/ld+json'
            }
        }).then(response => response.json())
            .then(data => console.log(data));
    }




    getListOfRepositories() {
        return fetch('http://localhost:8080/rdf4j-server/repositories', {
          method: 'GET',
          headers: {
            'Accept': 'application/sparql-results+json'
          }
        }).then(response => response.json())
            .then(data => data.results.bindings)
    }
}