'use client';

import { useState } from 'react';
import { useGetOrganizationsQuery, useCreateOrganizationMutation } from '@/store/api/organizationApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Loader2 } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Organization } from '@/types/organization';

const createOrgSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters'),
});

type CreateOrgFormData = z.infer<typeof createOrgSchema>;

export default function OrganizationsPage() {
    const { data: organizations, isLoading } = useGetOrganizationsQuery({});
    const [createOrganization, { isLoading: isCreating }] = useCreateOrganizationMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<CreateOrgFormData>({
        resolver: zodResolver(createOrgSchema),
    });

    const onSubmit = async (data: CreateOrgFormData) => {
        try {
            await createOrganization(data).unwrap();
            setIsModalOpen(false);
            reset();
        } catch (err) {
            console.error('Failed to create organization', err);
        }
    };

    if (isLoading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Organizations</h1>
                <Button onClick={() => setIsModalOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Organization
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {organizations?.map((org: Organization) => (
                    <Card key={org.id} className="hover:shadow-md transition-shadow">
                        <CardHeader>
                            <CardTitle>{org.name}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Role: <span className="font-medium text-foreground">{org.role || 'Member'}</span>
                            </p>
                        </CardContent>
                        <CardFooter>
                            <Link href={`/dashboard/organizations/${org.id}`} className="w-full">
                                <Button variant="outline" className="w-full">
                                    View Details
                                </Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
                {organizations?.length === 0 && (
                    <div className="col-span-full text-center p-12 border border-dashed rounded-lg">
                        <h3 className="text-lg font-medium text-muted-foreground">No organizations found</h3>
                        <p className="text-sm text-muted-foreground mt-1">Create your first organization to get started.</p>
                    </div>
                )}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Create Organization"
            >
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <Input
                        label="Organization Name"
                        placeholder="Acme Corp"
                        error={errors.name?.message}
                        {...register('name')}
                    />
                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isCreating}>
                            {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
