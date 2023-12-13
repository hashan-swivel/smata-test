import * as z from 'zod';

export const SampleFormSchema = z.object({
  name: z.string().trim().min(2, { message: 'Name must be 2 or more characters long' }),
  email: z.string().trim().min(1, { message: 'Email is required' }).email(),
  phone: z.string().min(10, { message: 'Phone numbers are a minimum of 10 digits' }),
  gender: z.string().min(1, { message: 'Gender is required' }),
  website: z
    .string()
    .trim()
    .toLowerCase()
    .min(5, { message: 'URLs must be a minimum of 5 characters' })
    .refine((val) => val.indexOf('.') !== -1, { message: 'Invalid URL' })
    .optional()
    .or(z.literal(''))
});

export type SampleForm = z.infer<typeof SampleFormSchema>;
