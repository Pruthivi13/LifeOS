'use client';

import { useState, useEffect } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Habit, Frequency } from '@/types';
import { RefreshCw, Trash2, Check } from 'lucide-react';

interface EditHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onEdit: (id: string, updates: Partial<Habit>) => void;
    onDelete: (id: string) => void;
    habit: Habit | null;
    loading?: boolean;
}

export function EditHabitModal({ isOpen, onClose, onEdit, onDelete, habit, loading }: EditHabitModalProps) {
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');

    useEffect(() => {
        if (habit) {
            setName(habit.name);
            setFrequency(habit.frequency);
        }
    }, [habit]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (habit) {
            onEdit(habit._id, { name, frequency });
        }
    };

    const handleDelete = () => {
        if (confirm('Are you sure you want to delete this habit?')) {
            if (habit) onDelete(habit._id);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Habit">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">Habit Name</label>
                    <Input
                        placeholder="e.g., Read for 30 mins"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1 flex items-center gap-2">
                        <RefreshCw className="w-3.5 h-3.5" /> Frequency
                    </label>
                    <select
                        value={frequency}
                        onChange={(e) => setFrequency(e.target.value as Frequency)}
                        className="w-full h-10 px-3 rounded-xl bg-background-secondary border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm appearance-none cursor-pointer"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                    </select>
                </div>

                <div className="pt-2 flex justify-between items-center border-t border-foreground/5 mt-6">
                    <Button
                        type="button"
                        variant="ghost"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/10 px-0"
                        onClick={handleDelete}
                        disabled={loading}
                    >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Habit
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
