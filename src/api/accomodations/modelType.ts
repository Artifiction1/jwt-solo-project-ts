import { ObjectId } from "mongoose"
        
        interface accomodations {
        name: string
        host: ObjectId
        description: string
        city : string
        maxGuest: number
    }
    export interface AccomDocument extends accomodations, Document {}