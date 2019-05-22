import * as mongoose from 'mongoose';
import Offer from '../interfaces/offer.interface';

const offerSchema = new mongoose.Schema({
    companyName: String,
    companySize: Number,
    companyLogo: String,
    companyAddress: {streetName: String, buildingNumber: Number, city: String},
    companyWebPage: String,
    position: String,
    salary: {lowerLimit: Number, upperLimit: Number},
    tags: [String],
    routingTag: String,
    experience: String,
    agreementType: String,
    description: String,
    requiredSkills: [{technology: {type: mongoose.Schema.Types.ObjectId, ref: 'Technology'}, level: Number}],
    insertionDate: Date, 
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    isHidden: Boolean, 
    isAddressTransformed: Boolean,
    yCoordinate: Number,
    xCoordinate: Number
});

const offerModel = mongoose.model<Offer & mongoose.Document>('Offer', offerSchema);
export default offerModel;