import { DocumentReference } from "@angular/fire/firestore";

export class User {

    name: string;
    surname: string;
    age: number;
    email: string;
    profile: string;
    score: number;
    routines: number;
    exercises: number;
    challenges: number;
    max_score: number
    ref: DocumentReference

    constructor() {}

}