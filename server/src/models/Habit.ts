import mongoose, { Document, Schema } from 'mongoose';

export interface IHabit extends Document {
    user: mongoose.Schema.Types.ObjectId;
    name: string;
    frequency: 'daily' | 'weekly';
    streakCount: number;
    completedDates: Date[];
    createdAt: Date;
}

const HabitSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            enum: ['daily', 'weekly'],
            default: 'daily',
        },
        streakCount: {
            type: Number,
            default: 0,
        },
        completedDates: [
            {
                type: Date,
            },
        ],
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<IHabit>('Habit', HabitSchema);
