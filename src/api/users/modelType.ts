import {Model, Document, ObjectId} from "mongoose"

interface User {
    email: string
    password?: string
    role : "guest"| "host"
    accomodations : Array<ObjectId>
}
export interface UserDocument extends User, Document {}

export interface UsersModel extends Model <UserDocument>{
    checkCredentials(email:string, password: string): Promise<UserDocument>
}