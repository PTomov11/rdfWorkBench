import {Column, Namespace, Statement} from "@/views/Explore/types/ExploreTypes";
import { DataFormat } from "@/views/Update/types/UpdateTypes";
export default class helperUtils {

    /** Parse functions **/
    // Help function to find number of columns in performed query with their names
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

    // Help function to parse data from query result
    async prepareResultsOfQuery(data: any, columns: Column[], namespaces: Namespace[]): Promise<[]> {
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
                    if (array.type === "uri") {
                        endObject[Object.keys(endObject)[index]] = `<${array.value}>`
                    } else if (array.type === "literal") {
                        endObject[Object.keys(endObject)[index]] = `"${array.value}"`
                    } else {
                        endObject[Object.keys(endObject)[index]] = array.value
                    }
                }
                index = index + 1
            }
            queryResults.push(endObject)
        }
        return queryResults
    }

    // Help functions to parse all statements in repository and unions queries
    async prepareUnionQueryResults(data: any, namespaces: Namespace[]): Promise<Statement[]> {
        console.log(data)
        const resultTriples = [] as Statement[]
        for (const item in data) {
            const endObject = {
                subject: '',
                predicate: '',
                object: '',
                context: ''
            } as Statement
            let subjectMatchedNamespace = false
            let predicateMatchedNamespace = false
            let objectMatchedNamespace = false
            for(let i = 0; i < namespaces.length; i++) {
                if ('subj' in data[item]) {
                    if (data[item]['subj']['value'].includes(namespaces[i].namespace.value)) {
                        endObject.subject = data[item]['subj']['value'].replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                        subjectMatchedNamespace = true
                    }
                }
                if ('pred' in data[item]) {
                    if (data[item]['pred']['value'].includes(namespaces[i].namespace.value)) {
                        endObject.predicate = data[item]['pred']['value'].replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                        predicateMatchedNamespace = true
                    }
                }
                if ('obj' in data[item]) {
                    if (data[item]['obj']['value'].includes(namespaces[i].namespace.value)) {
                        endObject.object = data[item]['obj']['value'].replace(namespaces[i].namespace.value, namespaces[i].prefix.value + ':')
                        objectMatchedNamespace = true
                    }
                }
                if ('context' in data[item]) {
                    endObject.context = `<${data[item]['context']['value']}>`
                }
            }
            if (!subjectMatchedNamespace) {
                if (data[item]['subj']['value'].includes("http")) {
                    endObject.subject = "<" + data[item]['subj']['value'] + ">"
                } else {
                    endObject.subject = data[item]['subj']['value']
                }
            }
            if (!predicateMatchedNamespace) {
                if (data[item]['pred']['value'].includes("http")) {
                    endObject.predicate = "<" + data[item]['pred']['value'] + ">"
                } else {
                    endObject.predicate = data[item]['pred']['value']
                }
            }
            if (!objectMatchedNamespace) {
                if (data[item]['obj']['type'] === "uri") {
                    endObject.object = `<${data[item]['obj']['value']}>`
                } else if (data[item]['obj']['type'] === "literal"){
                    endObject.object = `"${data[item]['obj']['value']}"`
                } else {
                    endObject.object = data[item]['obj']['value']
                }
            }
            resultTriples.push(endObject)
        }
        return resultTriples
    }

    findDataFormatFromExtension(type: string): string {
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
            case '.n3': {
                return DataFormat.N3
            }
            case '.xml': {
                return DataFormat.TRIX
            }
            default: {
                return ""
            }
        }
    }

    findDataFormatFromString(format: string): string {
        switch (format) {
            case 'TURTLE': {
                return DataFormat.TURTLE
            }
            case 'RDFXML': {
                return DataFormat.RDFXML
            }
            case 'NTRIPLES': {
                return DataFormat.NTRIPLES
            }
            case 'NQUADS': {
                return DataFormat.NQUADS
            }
            case 'JSON-LD': {
                return DataFormat.JSONLD
            }
            case 'RDFJSON': {
                return DataFormat.RDFJSON
            }
            case 'TRIG': {
                return DataFormat.TRIG
            }
            case 'N3': {
                return DataFormat.N3
            }
            case 'TRIX': {
                return DataFormat.TRIX
            }
            default: {
                return ""
            }
        }
    }

    /**  Validations functions **/
    processSubjectValue(value: string, namespaces: Namespace[]): string {
        if (value.charAt(0) === '<' && value.charAt(value.length-1) === '>') {
            return 'pass'
        }
        for(let i = 0; i < namespaces.length; i++) {
            if (value.includes(namespaces[i].prefix.value + ':')) {
                if(namespaces[i].prefix.value === '' && value.substr(0, value.indexOf(':')).length !== 0) {
                    continue
                }
                return `<${value.replace(namespaces[i].prefix.value + ':', namespaces[i].namespace.value)}>`
            }
        }
        return 'wrong'
    }

    processPredicateValue(value: string, namespaces: Namespace[]): string {
        if (value.charAt(0) === '<' && value.charAt(value.length-1) === '>') {
            return 'pass'
        }
        for(let i = 0; i < namespaces.length; i++) {
            if (value.includes(`${namespaces[i].prefix.value}:`)) {
                if(namespaces[i].prefix.value === '' && value.substr(0, value.indexOf(':')).length !== 0) {
                    continue
                }
                return `<${value.replace(`${namespaces[i].prefix.value}:`, namespaces[i].namespace.value)}>`
            }
        }
        return 'wrong'
    }

    processObjectValue(value: string, namespaces: Namespace[]): string {
        if (value.charAt(0) === '<' && value.charAt(value.length-1) === '>') {
            return 'pass'
        } else if (value.charAt(0) === '"' && value.charAt(value.length-1) === '"') {
            return 'pass'
        }
        for(let i = 0; i < namespaces.length; i++) {
            if (value.includes(namespaces[i].prefix.value + ':')) {
                if(namespaces[i].prefix.value === '' && value.substr(0, value.indexOf(':')).length !== 0) {
                    continue
                }
                return `<${value.replace(namespaces[i].prefix.value + ':', namespaces[i].namespace.value)}>`
            }
        }
        return 'wrong'
    }

    isGoodContextValue(value: string): boolean {
        if ((value.charAt(0) === '<' && value.charAt(value.length - 1) === '>') || value.length === 0) {
            return true
        }
        return false
    }

    isGoodResourceValue(value: string, namespaces: Namespace[]): boolean  {
        if (value.charAt(0) === '<' && value.charAt(value.length-1) === '>') {
            return true
        } else if (value.charAt(0) === '"' && value.charAt(value.length-1) === '"') {
            return true
        }
        for(let i = 0; i < namespaces.length; i++) {
            if (value.includes(namespaces[i].prefix.value + ':')) {
                if(namespaces[i].prefix.value === '' && value.substr(0, value.indexOf(':')).length !== 0) {
                    continue
                }
                return true
            }
        }
        return false
    }
}