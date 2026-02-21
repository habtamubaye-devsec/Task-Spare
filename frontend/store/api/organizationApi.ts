import { baseApi } from './baseApi'
import type { Organization } from '@/types/organization'

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyOrganization: builder.query<Organization | null, void>({
      query: () => '/organizations/me',
      providesTags: ['Organization'],
    }),
    createOrganization: builder.mutation<Organization, { name: string }>({
      query: (body) => ({
        url: '/organizations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Organization'],
    }),
    updateMyOrganization: builder.mutation<Organization, { name?: string }>({
      query: (body) => ({
        url: '/organizations/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
})

export const {
  useGetMyOrganizationQuery,
  useCreateOrganizationMutation,
  useUpdateMyOrganizationMutation,
} = organizationApi
