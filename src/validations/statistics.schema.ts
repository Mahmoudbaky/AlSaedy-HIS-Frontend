import { z } from 'zod';

// Statistics filters validation schema
export const statisticsFiltersSchema = z
  .object({
    fromDate: z
      .string()
      .min(1, 'From date is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid from date format'),
    toDate: z
      .string()
      .min(1, 'To date is required')
      .refine((date) => !isNaN(Date.parse(date)), 'Invalid to date format'),
  })
  .refine((data) => new Date(data.fromDate) <= new Date(data.toDate), {
    message: 'From date must be before or equal to to date',
    path: ['toDate'],
  });

export type StatisticsFiltersFormData = z.infer<typeof statisticsFiltersSchema>;
