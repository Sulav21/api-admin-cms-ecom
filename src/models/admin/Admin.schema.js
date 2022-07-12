import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema(
  {
    status: {
      type: String,
      default: 'inactive',
    },

    fName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "First Name must be less than 20 characters"],
    },

    lName: {
      type: String,
      required: true,
      trim: true,
      maxlength: [20, "Last Name must be less than 20 characters"],
    },

    dob: {
      type: Date,
      default: null,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, "Email must be less than 50 characters"],
      unique: true,
      index: 1,
    },
    emailValidationCode: {
      type: String,
      default:"",
    },
    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: [15, "Phone Number must be less than 15 characters"],
      minlength: [9, "Phone Number must be more than 9 characters"],
    },

    password: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      default: "n/a",
    },
    refreshJWT:{
      type:String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Admin", AdminSchema);
