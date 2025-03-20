import * as z from 'zod';

export const SettingsSchema = z
  .object({
    name: z.optional(z.string()),
    isTwoFactorEnabled: z.optional(z.boolean()),

    roleId: z.optional(z.string()),
    roles: z.optional(z.array(z.string())),
    company_id: z.optional(z.string()),
    branch_id: z.optional(z.string()),
    email: z.optional(z.string().email()),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),

    // role: z.optional([UserRole.ADMIN, UserRole.USER]),
    // roles: z.optional(z.array(z.enum([UserRole.ADMIN, UserRole.USER]))),
    // role: z.enum([UserRole.ADMIN, UserRole.USER]),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: 'New password is required!',
      path: ['newPassword'],
    }
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: 'Password is required!',
      path: ['password'],
    }
  );

export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: 'Minimum of 6 characters required',
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
});

export const LoginSchema = z.object({
  name: z.string().min(3, {
    message: 'Name is required',
  }),
  password: z.string().min(1, {
    message: 'Password is required',
  }),
  company_id: z.string().min(3, {
    message: 'Company is required',
  }),
  code: z.optional(z.string()),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: 'Email is required',
  }),
  password: z.string().min(6, {
    message: 'Minimum 6 characters required',
  }),
  name: z.string().min(1, {
    message: 'Name is required',
  }),
  // company_id: z.string().min(3, {
  //   message: 'Company is required',
  // }),
  // branch_id: z.string().min(3, {
  //   message: 'Company is required',
  // }),
});
