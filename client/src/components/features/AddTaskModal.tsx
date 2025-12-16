'use client';

import { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Priority, Category } from '@/types';
import { Calendar, Flag, Tag, ChevronDown } from 'lucide-react';

interface AddTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (task: { title: string; priority: Priority; category: Category; dueDate: Date }) => void;
    loading?: boolean;
}

export function AddTaskModal({ isOpen, onClose, onAdd, loading }: AddTaskModalProps) {
    const [title, setTitle] = useState('');
    const [priority, setPriority] = useState<Priority>('medium');
    const [category, setCategory] = useState<Category>('personal');
    const [dueDate, setDueDate] = useState(new Date().toISOString().split('T')[0]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            title,
            priority,
            category,
            dueDate: new Date(dueDate),
        });
        // Reset form
        setTitle('');
        setPriority('medium');
        setCategory('personal');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Task">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">What needs to be done?</label>
                    <Input
                        placeholder="e.g., Complete research paper"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        autoFocus
                        className="w-full"
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
                    <Input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full"
                    />
                </div>

                <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Task'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
