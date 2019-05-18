export interface DatabaseRequest{
    "isHidden"?: boolean;
    "$or"?: any;
    "companyAddress.city"?: string;
    "requiredSkills.technology"? :string;
    "experience"?: string;
    "salary.lowerLimit"?: {};
}