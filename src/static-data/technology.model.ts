import * as mongoose from 'mongoose';
import Technology from './technology.interface';

export const technologySchema = new mongoose.Schema({
  name: String,
  isHidden: Boolean,
  color: String,
});

const technologyModel = mongoose.model<Technology & mongoose.Document>('Technology', technologySchema);

export default technologyModel;