import { Authority } from "./Authority";

export class User {
    id: number;
    username: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    enabled: boolean;
    authorities: Authority[];

    constructor() { }
}