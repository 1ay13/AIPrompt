import { Schema, model, models } from 'mongoose';

const UserSchema = new Schema({
  email: {
    type: String,
    unique: true,  // Make email unique (for both Google and local users)
    sparse: true,  // Allows some users (e.g., local users) to not have an email
  },
  username: {
    type: String,
    required: [true, 'Username is required!'],
    unique: true, // Username should be unique for both methods
    // match: [/^(?=.{8,30}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/, "Username invalid, it should contain 8-20 alphanumeric letters and be unique!"]
  },
  password: {
    type: String, // Password is only required for local (credentials) users
    select: false, // To avoid returning the password by default in queries
  },
  googleId: {
    type: String, // Google OAuth ID for Google sign-in users
    unique: true, // Google users should have unique IDs
    sparse: true, // Allows non-Google users to not have a googleId
  },
  image: {
    type: String, // Profile image (mostly for Google users, but local users can have it too)
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Check if the model already exists in the `models` object (to avoid overwriting it during hot reloads), otherwise create it.
const User = models.User || model('User', UserSchema);

export default User;