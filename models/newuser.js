// // @models/newuser.js

// import { Schema, model, models } from 'mongoose';

// const NewUserSchema = new Schema({
//   username: {
//     type: String,
//     required: [true, 'Username is required'],
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: [true, 'Password is required'],
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now,
//   },
// });

// // Check if the model already exists in the `models` object (to avoid overwriting it during hot reloads), otherwise create it.
// const NewUser = models.NewUser || model('NewUser', NewUserSchema);

// export default NewUser;
