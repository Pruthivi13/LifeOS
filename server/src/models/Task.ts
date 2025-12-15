import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
    user: mongoose.Schema.Types.ObjectId;
    title: string;
    description?: string;
    priority: 'low' | 'medium' | 'high';
    category: 'academic' | 'personal' | 'health' | 'work';
    dueDate: Date;
    completed: boolean;
    createdAt: Date;
}

const TaskSchema: Schema = new Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
        },
        category: {
            type: String,
            enum: ['academic', 'personal', 'health', 'work'],
            default: 'personal',
        },
        dueDate: {
            type: Date,
            default: Date.now,
        },
        completed: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model<ITask>('Task', TaskSchema);
