'use client';

import { useState } from 'react';
import { Modal, Input, Button } from '@/components/ui';
import { Frequency } from '@/types';
import { RefreshCw, Tag } from 'lucide-react';

interface AddHabitModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (habit: { name: string; frequency: Frequency }) => void;
    loading?: boolean;
}

export function AddHabitModal({ isOpen, onClose, onAdd, loading }: AddHabitModalProps) {
    const [name, setName] = useState('');
    const [frequency, setFrequency] = useState<Frequency>('daily');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAdd({
            name,
            frequency,
        });
        // Reset form
        setName('');
        setFrequency('daily');
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="New Habit">
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1.5 ml-1">Habit Name</label>
                    <Input
                        placeholder="e.g., Read for 30 mins"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        autoFocus
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

                <div className="pt-2 flex justify-end gap-3">
                    <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={loading}>
                        {loading ? 'Adding...' : 'Add Habit'}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
