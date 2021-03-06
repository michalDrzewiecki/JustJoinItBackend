import * as mongoose from 'mongoose';
import User from '../interfaces/user.interface';

export const userSchema = new mongoose.Schema({
  email: String,
  name: String,
  surname: String,
  password: String,
});

const userModel = mongoose.model<User & mongoose.Document>('User', userSchema);

export default userModel;
