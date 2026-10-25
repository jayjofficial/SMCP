import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  inquiries: defineTable({
    name: v.string(),
    email: v.string(),
    organization: v.optional(v.string()),
    category: v.string(),
    subject: v.string(),
    message: v.string(),
    submittedAt: v.string(),
    source: v.optional(v.string()),
  }),
});
