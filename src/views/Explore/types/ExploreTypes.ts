export type SavedQuery = {
    name: string,
    value: string
};

export type Context = {
    type: string,
    value: string
}

export type Namespace = {
    prefix: string,
    namespace: string
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