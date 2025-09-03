import mongoose, { Schema, Document, Model } from "mongoose";
import bcrypt from "bcryptjs";

export interface Address {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault?: boolean;
  latitude?: number;
  longitude?: number;
}

export interface IUser extends Document {
  name?: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: "admin" | "user";
  isPhoneVerified: boolean;
  isEmailVerified: boolean;
  addresses?: Address[];
  refreshToken?: string; // For JWT refresh flow
  lastLogin?: Date;
  isActive: boolean;
  comparePassword(candidate: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema<Address>(
  {
    street: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    postalCode: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    isDefault: { type: Boolean, default: false },
    latitude: { type: Number },
    longitude: { type: Number }
  },
);

const userSchema = new Schema<IUser>(
  {
    name: { type: String, trim: true },
    phoneNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    password: {
      type: String,
      required: false,
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user"
    },
    isPhoneVerified: {
      type: Boolean,
      default: false
    },
    isEmailVerified: {
      type: Boolean,
      default: false
    },
    addresses: {
      type: [addressSchema],
      default: [],
      validate: {
        validator: function (addresses: Address[]) {
          return addresses.filter(address => address.isDefault).length <= 1;
        },
        message: "Only one default address is allowed"
      }
    },
    refreshToken: {
      type: String,
      default: null,
      select: false
    },
    lastLogin: {
      type: Date
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// 🔒 Password hashing before save
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// 🔑 Compare password method
userSchema.methods.comparePassword = async function (
  candidate: string
): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
