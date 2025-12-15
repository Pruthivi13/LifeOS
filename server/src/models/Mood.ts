import mongoose, { Document, Schema } from 'mongoose';

export interface IMood extends Document {
    user: mongoose.Schema.Types.ObjectId;
    mood: number; // 1-5
    note?: string;
    date: Date;
    createdAt: Date;
}

const MoodSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        mood: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        note: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IMood>('Mood', MoodSchema);
