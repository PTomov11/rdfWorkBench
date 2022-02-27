export type Repository = {
    id: IdObject;
    title: IdObject;
    location: IdObject;
};

export type IdObject = {
    type: string,
    value: string
};