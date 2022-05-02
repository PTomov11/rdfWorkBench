import {IdObject} from "@/views/Repositories/types/RepositoriesTypes";

export type ResultObject = {
    type: string,
    value: string
}

export type SavedQuery = {
    name: string,
    value: string
};

export type Context = {
    type: string,
    value: string
}

export type Namespace = {
    prefix: IdObject,
    namespace: IdObject
}

export type Type = {
    type: string,
    value: string
}

export type Statement = {
    subject: string,
    predicate: string,
    object: string,
    context: string
}
export type Column = {
    field: string,
    header: string
}
export type LazyParam = {
    page: number,
    first: number,
    rows: number,
    pageCount: number,
} | null
