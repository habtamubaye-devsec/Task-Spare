'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { FolderOpen, Calendar, Users, MoreHorizontal } from 'lucide-react';

const mockProjects = [
    { id: '1', name: 'Website Redesign', description: 'Revamp the company website with modern UI.', status: 'In Progress', dueDate: '2024-12-31', members: 5 },
    { id: '2', name: 'Mobile App Launch', description: 'Launch the new mobile app on iOS and Android.', status: 'Planning', dueDate: '2025-03-15', members: 8 },
    { id: '3', name: 'Internal Audit', description: 'Conduct a thorough audit of internal processes.', status: 'Completed', dueDate: '2024-10-01', members: 3 },
];

export default function ProjectsPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground">Manage and track your ongoing projects.</p>
                </div>
                <Button>
                    <FolderOpen className="mr-2 h-4 w-4" />
                    New Project
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {mockProjects.map((project) => (
                    <Card key={project.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{project.name}</CardTitle>
                                <Button variant="ghost" size="icon" className="-mt-2 -mr-2">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardDescription>{project.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2 text-sm">
                                <div className="flex items-center text-muted-foreground">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Due: {project.dueDate}
                                </div>
                                <div className="flex items-center text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    {project.members} members
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter>
                            <div className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                                project.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                project.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                'bg-yellow-100 text-yellow-700'
                            }`}>
                                {project.status}
                            </div>
                        </CardFooter>
                    </Card>
                ))}
            </div>
        </div>
    );
}
