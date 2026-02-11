'use client';

// This page will act as the Project list and Org overview
import { useState } from 'react';
import { useGetProjectsQuery, useCreateProjectMutation } from '@/store/api/projectApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2, Folder, Calendar } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from '@/components/ui/card';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Project } from '@/types/project';

const createProjectSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
    description: z.string().optional(),
});

type CreateProjectFormData = z.infer<typeof createProjectSchema>;

export default function OrganizationDetailsPage() {
    const params = useParams();
    const orgId = params.orgId as string;

    // Note: We might need a separate endpoint to get Org Details (name, members)
    // For now focusing on Projects list
    const { data: projects, isLoading } = useGetProjectsQuery(orgId);
    const [createProject, { isLoading: isCreating }] = useCreateProjectMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateProjectFormData>({
        resolver: zodResolver(createProjectSchema),
    });

    const onSubmit = async (data: CreateProjectFormData) => {
        try {
            await createProject({ ...data, organizationId: orgId }).unwrap();
            setIsModalOpen(false);
            reset();
        } catch (err) {
            console.error('Failed to create project', err);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between border-b pb-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Organization Overview</h1>
                    <p className="text-muted-foreground">Manage projects and members</p>
                </div>
                <div className="flex gap-2">
                    <Link href={`/dashboard/organizations/${orgId}/members`}>
                        <Button variant="outline">Manage Members</Button>
                    </Link>
                    <Button onClick={() => setIsModalOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Project
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {projects?.map((project: Project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow group">
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="p-2 bg-primary/10 rounded-md text-primary">
                                    <Folder className="h-5 w-5" />
                                </div>
                                {/* Menu placeholder */}
                            </div>
                            <CardTitle className="pt-2">{project.name}</CardTitle>
                            <CardDescription className="line-clamp-2">{project.description || 'No description'}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="mr-2 h-4 w-4" />
                                <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/projects/${project.id}`} className="w-full">
                                <Button className="w-full group-hover:bg-primary/90">
                                    Open Project
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {projects?.length === 0 && (
                    <div className="col-span-full text-center p-12 border border-dashed rounded-lg bg-slate-50">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                            <Folder className="h-6 w-6 text-slate-400" />
                        </div>
                        <h3 className="mt-2 text-sm font-semibold text-slate-900">No projects</h3>
                        <p className="mt-1 text-sm text-slate-500">Get started by creating a new project.</p>
                        <div className="mt-6">
                            <Button onClick={() => setIsModalOpen(true)}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Project
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Project"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Project Name"
                        placeholder="Website Redesign"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Description</label>
                        <textarea
                            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[80px]"
                            placeholder="Project goals and details..."
                            {...register('description')}
                        />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Project
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
