import Technology from "static-data/technology.interface";
import User from "user/user.interface";

export interface Offer{
    companyName: string,
    companySize: number,
    companyLogo: string,
    companyAddress: {streetName: string, buildingNumber: number, city: string},
    companyWebPage: string,
    position: string,
    salary: {lowerLimit:number, upperLimit:number},
    tags: string[],
    routingTag: string,
    experience: string,
    agreementType: string,
    description: string,
    requiredSkills: {technology: Technology, level: number}[],
    insertionDate: Date, 
    author: User,
    isHidden: boolean
}

  
export default Offer;