'use client';

import { useState } from 'react';
import { Plus, MoreHorizontal, CheckCircle, ListTodo, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardHeader, Checkbox, Button, IconButton, Dropdown } from '@/components/ui';
import { Task, Priority } from '@/types';

interface TasksCardProps {
    tasks: Task[];
    onToggleTask?: (taskId: string) => void;
    onAddTask?: () => void;
    onEditTask?: (task: Task) => void;
}

const priorityLabels: Record<Priority, string> = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
};

export function TasksCard({ tasks, onToggleTask, onAddTask, onEditTask }: TasksCardProps) {
    // Removed local state to rely on parent props
    const handleToggle = (taskId: string) => {
        onToggleTask?.(taskId);
    };

    const formatDueDate = (date: Date) => {
        const today = new Date();
        const dueDate = new Date(date);

        if (dueDate.toDateString() === today.toDateString()) {
            return 'Today';
        }

        return dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    const dropdownItems = [
        {
            label: 'Add Task',
            icon: <Plus className="w-4 h-4" />,
            onClick: () => onAddTask?.(),
        },
        {
            label: 'View Completed',
            icon: <CheckCircle className="w-4 h-4" />,
            onClick: () => console.log('View completed tasks'),
        },
    ];

    return (
        <Card>
            <CardHeader
                title="Today's Tasks"
                action={<Dropdown items={dropdownItems} />}
            />

            <div className="space-y-3">
                <AnimatePresence mode="popLayout">
                    {tasks.map((task, index) => (
                        <motion.div
                            key={task._id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            transition={{ delay: index * 0.05 }}
                            className="group flex items-center justify-between gap-3 py-2"
                        >
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                                <Checkbox
                                    checked={task.completed}
                                    onChange={() => handleToggle(task._id)}
                                />
                                <div className="flex-1 min-w-0">
                                    <p className={`text-sm font-medium truncate transition-all ${task.completed ? 'text-foreground-muted line-through' : 'text-foreground'
                                        }`}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-foreground-muted">
                                        {formatDueDate(task.dueDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditTask?.(task)}
                                    className="p-1.5 rounded-lg text-foreground-muted hover:text-primary hover:bg-primary/10 opacity-0 group-hover:opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                                    title="Edit task"
                                >
                                    <Pencil className="w-4 h-4" />
                                </button>
                                <span className={`priority-tag priority-tag--${task.priority}`}>
                                    {priorityLabels[task.priority]}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <div className="mt-4 pt-4 border-t border-foreground/5">
                <Button
                    variant="ghost"
                    size="sm"
                    fullWidth
                    icon={<Plus className="w-4 h-4" />}
                    onClick={onAddTask}
                >
                    Add task
                </Button>
            </div>
        </Card>
    );
}

