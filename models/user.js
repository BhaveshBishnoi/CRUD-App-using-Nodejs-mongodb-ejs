const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: [true, "Name is required"]
  },
  email: {
    type: String,
    trim: true,
    unique: true,
    match: [
      /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
      "Please enter a valid email"
    ],
    required: [true, "Email is required"]
  },
  phone: {
    type: String,
    trim: true,
    required: [true, "Phone number is required"],
    match: [/^[0-9]{10}$/, "Please enter a valid phone number"]
  },
  image: {
    type: String,
    default: null
  },
  created: {
    type: Date,
    default: Date.now
  },
  updated: {
    type: Date,
    default: Date.now
  }
});

// Update the 'updated' timestamp before saving
userSchema.pre('save', function(next) {
  // Only update timestamp if document is being modified
  if (this.isModified()) {
    this.updated = new Date();
  }
  
  // Validate required fields
  if (!this.name || !this.email || !this.phone) {
    const error = new Error('Required fields are missing');
    return next(error);
  }

  // Ensure created date is set on new documents
  if (this.isNew && !this.created) {
    this.created = new Date();
  }

  next();
});

// Create a method to return user data without sensitive information
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    image: user.image,
    created: user.created
  };
};

module.exports = mongoose.model("User", userSchema);
