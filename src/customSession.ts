export interface CustomSession {
    accessToken?: string;
    authServer?: string;
    dataServer?: string;

    clientId?: string;
    email?: string;
    password?: string;
    flow?: string;


    settings?: any
}