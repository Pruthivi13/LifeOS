import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email?: string;
    phone?: string;
    password?: string;
    avatar?: string;
    googleId?: string;
    resetOTP?: string;
    resetPasswordExpire?: Date;
    loginOTP?: string;
    loginOTPExpire?: Date;
    phoneOTP?: string;
    phoneOTPExpire?: Date;
    createdAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: false, // Optional since user can register with phone
            unique: true,
            sparse: true, // Allows multiple null values for unique field
        },
        phone: {
            type: String,
            required: false,
            unique: true,
            sparse: true, // Allows multiple null values for unique field
        },
        password: {
            type: String,
            required: false, // Optional for Google Auth users
        },
        avatar: {
            type: String,
            default: '',
        },
        googleId: {
            type: String,
        },
        resetOTP: {
            type: String,
        },
        resetPasswordExpire: {
            type: Date,
        },
        loginOTP: {
            type: String,
        },
        loginOTPExpire: {
            type: Date,
        },
        phoneOTP: {
            type: String,
        },
        phoneOTPExpire: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IUser>('User', UserSchema);
