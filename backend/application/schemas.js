import { z } from "zod"

//Admins table
const admins = z.object({
    id: z.number().int().optional(),
    email: z.string.email(),
    password: z.string().min(8),
    role: z.enum(["admin", "superadmin"]).default("admin"),
    created_at: z.iso.datetime().optional(),
    updated_at: z.iso.datetime().optional()
});

//products table
const products = z.object({
    id: z.number().int().optional(),
    title: z.string().min(1, "Title is required"),
    description: z.string().min(1, "Description is required"),
    short_description: z.string().max(80).optional().nullable(),
    price: z.number().nonnegative(),
    currency: z.string().length(3).default("GBP"),
    active: z.boolean().default(true),
    etsy_url: z.string().url().optional(),
    created_at: z.iso.datetime().optional(),
    updated_at: z.iso.datetime().optional(),
    created_by_admin_id: z.number().int(),
    updated_by_admin_id: z.number().int(),
});

//products images table
const product_images = z.object({
    id: z.number().int().optional(),
    product_id: z.number().int(),
    url: z.string().url(),
    alt_text: z.string().optional(),
    sort_order: z.number().int().optional(),
    is_primary: z.boolean(),
    created_at: z.iso.datetime().optional()
});