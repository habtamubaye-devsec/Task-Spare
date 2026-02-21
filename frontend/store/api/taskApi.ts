import { baseApi } from './baseApi'
import type { Task } from '@/types/task'

export const taskApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], string | void>({
      query: (projectId) =>
        projectId ? `/tasks?projectId=${projectId}` : '/tasks',
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Task' as const, id })),
              { type: 'Task', id: 'LIST' },
            ]
          : [{ type: 'Task', id: 'LIST' }],
    }),
    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Task', id }],
    }),
    createTask: builder.mutation<
      Task,
      { title: string; description?: string; projectId: string; assigneeId?: string }
    >({
      query: (body) => ({
        url: '/tasks',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, 'Project'],
    }),
    updateTask: builder.mutation<
      Task,
      {
        id: string
        title?: string
        description?: string
        status?: Task['status']
        assigneeId?: string | null
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/tasks/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _err, { id }) => [
        { type: 'Task', id },
        { type: 'Task', id: 'LIST' },
        'Project',
      ],
    }),
    deleteTask: builder.mutation<void, string>({
      query: (id) => ({
        url: `/tasks/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Task', id: 'LIST' }, 'Project'],
    }),
  }),
})

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi
