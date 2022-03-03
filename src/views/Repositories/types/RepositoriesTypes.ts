export type Repository = {
    id: IdObject;
    title: IdObject;
    uri: IdObject;
};

export type IdObject = {
    type: string,
    value: string
};