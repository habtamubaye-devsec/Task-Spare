'use client';

import { useState } from 'react';
import { useGetTasksQuery, useCreateTaskMutation, useUpdateTaskMutation } from '@/store/api/taskApi';
import { useGetProjectQuery } from '@/store/api/projectApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, CheckCircle2, Circle, Clock } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Task, TaskPriority } from '@/types/task';

const createTaskSchema = z.object({
    title: z.string().min(2, 'Title must be at least 2 characters'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

export default function ProjectDetailsPage() {
    const params = useParams();
    const projectId = params.projectId as string;

    const { data: project, isLoading: isProjectLoading } = useGetProjectQuery(projectId);
    const { data: tasks, isLoading: isTasksLoading } = useGetTasksQuery(projectId);
    const [createTask, { isLoading: isCreating }] = useCreateTaskMutation();
    const [updateTask] = useUpdateTaskMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateTaskFormData>({
        resolver: zodResolver(createTaskSchema),
    });

    const onSubmit = async (data: CreateTaskFormData) => {
        try {
            await createTask({ ...data, projectId }).unwrap();
            setIsModalOpen(false);
            reset();
        } catch (err) {
            console.error('Failed to create task', err);
        }
    };

    const toggleTaskStatus = async (task: Task) => {
        try {
            const newStatus = task.status === 'DONE' ? 'TODO' : 'DONE';
            await updateTask({ id: task.id, status: newStatus }).unwrap();
        } catch (err) {
            console.error('Failed to update task', err);
        }
    };

    if (isProjectLoading || isTasksLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <span>Projects</span>
                        <span>/</span>
                        <span>{project?.name}</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight">{project?.name}</h1>
                    <p className="text-muted-foreground">{project?.description}</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Task
                </Button>
            </div>

            <div className="grid gap-4">
                {tasks?.map((task: Task) => (
                    <Card key={task.id} className="hover:shadow-sm transition-shadow">
                        <CardContent className="p-4 flex items-center gap-4">
                            <button onClick={() => toggleTaskStatus(task)} className="text-muted-foreground hover:text-primary transition-colors">
                                {task.status === 'DONE' ? (
                                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                                ) : (
                                    <Circle className="h-6 w-6" />
                                )}
                            </button>
                            <div className="flex-1">
                                <h3 className={`font-medium ${task.status === 'DONE' ? 'line-through text-muted-foreground' : ''}`}>
                                    {task.title}
                                </h3>
                                <p className="text-sm text-muted-foreground line-clamp-1">{task.description}</p>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {task.priority && (
                                    <span className={`px-2 py-0.5 rounded-full border ${task.priority === 'HIGH' ? 'bg-red-50 text-red-600 border-red-200' :
                                        task.priority === 'MEDIUM' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' :
                                            'bg-slate-50 text-slate-600 border-slate-200'
                                        }`}>
                                        {task.priority}
                                    </span>
                                )}
                                {task.assignee && (
                                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                                        {task.assignee.name?.[0] || 'U'}
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {tasks?.length === 0 && (
                    <div className="text-center p-12 border border-dashed rounded-lg bg-slate-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <CheckCircle2 className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-slate-900">No tasks yet</h3>
                        <p className="mt-1 text-sm text-slate-500">Create a task to get started.</p>
                        <div className="mt-6">
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Task
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Task"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Task Title"
                        placeholder="Fix login bug"
                        error={errors.title?.message}
                        {...register('title')}
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                            placeholder="Details about the task..."
                            {...register('description')}
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Priority</label>
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            {...register('priority')}
                        >
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Medium</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Task
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
