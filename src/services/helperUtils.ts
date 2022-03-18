import {Column, Namespace, Statement} from "@/views/Explore/types/ExploreTypes";
import { DataFormat } from "@/views/Update/types/UpdateTypes";
export default class helperUtils {

    prepareColumnsOfQuery(data: any): Column[] {
        const columns = [] as Column[]
        for (const object in data) {
            for(const predicate in data[object]) {
                const column = {
                    field: `${predicate}`,
                    header: predicate
                } as Column
                columns.push(column)
            }
            break
        }
        return columns
    }

    prepareResultsOfQuery(data: any, columns: Column[], namespaces: Namespace[]): [] {
        const queryResults = [] as any
        for (const subject in data) {
            const endObject = [] as any
            for (let i = 0; i < columns.length; i++) {
                const obj = {} as any
                obj[columns[i].field] = ''
                endObject.push(obj)
            }
            let index = 0
            for(const predicate in data[subject]) {
                const array = data[subject][predicate]
                let matched = false
                for(let i = 0; i < namespaces.length; i++) {
                    if(array.value.includes(namespaces[i].namespace.value)) {
                        endObject[Object.keys(endObject)[index]] = array.value.replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                        matched = true
                    }
                }
                if (!matched) {
                    endObject[Object.keys(endObject)[index]] = array.value
                }
                index = index + 1
            }
            queryResults.push(endObject)
        }
        return queryResults
    }

    prepareStatements(data: any, namespaces: Namespace[]): Statement[] {
        console.log(data)
        const resultTriples = [] as Statement[]
        for (const subject in data) {
            for(const predicate in data[subject]) {
                const array = data[subject][predicate]
                array.forEach((object: any) =>{
                    const hasContext = this.hasContext(object)
                    const endObject = {
                        subject: '',
                        predicate: '',
                        object: '',
                        // TODO: nemusi but zadany context pri statemente
                        context: hasContext ? object.graphs[0] : ''
                    } as Statement
                    let subjectMatchedNamespace = false
                    let predicateMatchedNamespace = false
                    let objectMatchedNamespace = false
                    for(let i = 0; i < namespaces.length; i++) {
                        if(subject.includes(namespaces[i].namespace.value)) {
                            endObject["subject"] = subject.replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                            subjectMatchedNamespace = true
                        }
                        if(predicate.includes(namespaces[i].namespace.value)) {
                            endObject["predicate"] = predicate.replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                            predicateMatchedNamespace = true
                        }
                        if(object.value.includes(namespaces[i].namespace.value)) {
                            endObject["object"] = object.value.replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                            objectMatchedNamespace = true
                        }
                    }
                    if (!subjectMatchedNamespace) {
                        if (subject.includes("http")) {
                            // endObject["subject"] = "<" + subject + ">"
                            endObject["subject"] = subject
                        } else {
                            endObject["subject"] = subject
                        }
                    }
                    if (!predicateMatchedNamespace) {
                        if (predicate.includes("http")) {
                            // endObject["predicate"] = "<" + predicate + ">"
                            endObject["predicate"] = predicate
                        } else {
                            endObject["predicate"] = predicate
                        }
                    }
                    if (!objectMatchedNamespace) {
                        if (object.type === "uri") {
                            endObject["object"] = `<${object.value}>`
                            // endObject["object"] = object.value
                        } else if (object.type === "literal"){
                            endObject["object"] = `"${object.value}"`
                        }
                    }
                    resultTriples.push(endObject)
                })
            }
        }

        return resultTriples
    }

    hasContext(object: any): boolean {
        if (object.type === "uri") {
            return Object.keys(object).length > 2
        } else {
            return Object.keys(object).length > 3
        }
    }

    findDataFormat(type: string): string {
        switch (type) {
            case '.ttl': {
                return DataFormat.TURTLE
            }
            case '.rdf': {
                return DataFormat.RDFXML
            }
            case '.nt': {
                return DataFormat.NTRIPLES
            }
            case '.nq': {
                return DataFormat.NQUADS
            }
            case '.jsonld': {
                return DataFormat.JSONLD
            }
            case '.rj': {
                return DataFormat.RDFJSON
            }
            case '.trig': {
                return DataFormat.TRIG
            }
            default: {
                return ""
            }
        }
    }

}