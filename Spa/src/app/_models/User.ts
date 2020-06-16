import { Photo } from './Photo';

export interface User {
    id: number;
    username: string;
    gender: string;
    age: number;
    knownAs: string;
    created: Date;
    lastActive: Date;
    city: string;
    country: string;
    photoUrl: string;
    // Optional -> Only Returned On DetailDTO
    introduction?: string;
    lookingFor?: string;
    interests?: string;
    photos?: Photo[];
};