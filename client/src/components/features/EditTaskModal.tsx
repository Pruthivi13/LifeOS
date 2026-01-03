'use client';

import { useState, useEffect } from 'react';
import { Modal, Button, DatePicker } from '@/components/ui';
import { Priority, Category, Task } from '@/types';
import { Calendar, Flag, Tag, ChevronDown, Trash2, Check } from 'lucide-react';

interface EditTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Task>) => void;
    onDelete: (id: string) => void;
    task: Task | null;
    loading?: boolean;
}

export function EditTaskModal({ isOpen, onClose, onSave, onDelete, task, loading }: EditTaskModalProps) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

    // Populate form when task changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setPriority(task.priority);
            setCategory(task.category);
            setDueDate(new Date(task.dueDate).toISOString().split('T')[0]);
        }
    }, [task]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!task) return;

        onSave(task._id, {
            title,
            priority,
            category,
            dueDate: new Date(dueDate),
        });
    };

    const handleDelete = () => {
        if (!task) return;
        if (confirm('Are you sure you want to delete this task?')) {
            onDelete(task._id);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">Task Title</label>
                    <input
                        placeholder="e.g., Complete research paper"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                        className="w-full h-10 px-3 rounded-xl bg-background-secondary border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 flex items-center gap-2">
                            <Flag className="w-3.5 h-3.5" /> Priority
                        </label>
                        <div className="relative">
                            <select
                                value={priority}
                                onChange={(e) => setPriority(e.target.value as Priority)}
                                className="w-full h-10 px-3 pr-8 rounded-xl bg-background-secondary border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm appearance-none cursor-pointer"
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1 flex items-center gap-2">
                            <Tag className="w-3.5 h-3.5" /> Category
                        </label>
                        <div className="relative">
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value as Category)}
                                className="w-full h-10 px-3 pr-8 rounded-xl bg-background-secondary border border-foreground/20 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm appearance-none cursor-pointer"
                            >
                                <option value="personal">Personal</option>
                                <option value="academic">Academic</option>
                                <option value="work">Work</option>
                                <option value="health">Health</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground-muted pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5" /> Due Date
                    </label>
                    <DatePicker
                        value={dueDate}
                        onChange={setDueDate}
                        className="w-full"
                    />
                </div>

                <div className="pt-2 flex justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleDelete}
                        disabled={loading}
                        className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                    </Button>

                    <div className="flex gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading} className="px-6">
                            {loading ? 'Saving...' : <Check className="w-5 h-5" />}
                        </Button>
                    </div>
                </div>
            </form>
        </Modal>
    );
}
