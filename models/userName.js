import { Schema, model, models } from 'mongoose';

const UserNameSchema = new Schema({
  userId: {
    type: String,
    required: [true, 'Email is required!'],
  },
  password: {
    type: String,
    required: [true, 'Password is required!'],
  }
});

const UserName = models.UserName || model("UserName", UserNameSchema);

export default UserName;