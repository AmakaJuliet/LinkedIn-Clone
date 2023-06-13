import { User } from "src/auth/module/user.interface";

export interface FeedPost {
    id?: number;
    body?: string;
    createdAt?: Date;
    author?: User,
}