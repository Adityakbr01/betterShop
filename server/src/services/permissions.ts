// =====================================================
// 1. PERMISSION SYSTEM TYPES & CONSTANTS
// =====================================================

// Role definitions
export const RoleKey = {
  ADMIN: "ADMIN",
  MANAGEMENT: "MANAGEMENT",
  MANAGER: "MANAGER",
  INSTRUCTOR: "INSTRUCTOR",
  LEARNER: "LEARNER"
} as const;

export type RoleKey = (typeof RoleKey)[keyof typeof RoleKey];

// Resource definitions
export const Resource = {
  COURSE: "COURSE",
  MODULE: "MODULE",
  LESSON: "LESSON",
  USER: "USER",
  ORDER: "ORDER",
  PAYMENT: "PAYMENT",
  INVOICE: "INVOICE",
  COUPON: "COUPON",
  COHORT: "COHORT",
  ENROLLMENT: "ENROLLMENT",
  QUIZ: "QUIZ",
  SUBMISSION: "SUBMISSION",
  CERTIFICATE: "CERTIFICATE",
  SYSTEM: "SYSTEM",
  NOTIFICATION: "NOTIFICATION"
} as const;
export type Resource = (typeof Resource)[keyof typeof Resource];

// Action definitions
export const Action = {
  CREATE: "create",
  READ: "read",
  UPDATE: "update",
  DELETE: "delete",
  READ_OWN: "read_own",
  UPDATE_OWN: "update_own",
  DELETE_OWN: "delete_own",
  REFUND: "refund",
  GRADE: "grade"
} as const;
export type Action = (typeof Action)[keyof typeof Action];

// Permission string type
export type PermissionString = `${Action}.${Resource}` | "*.*";

// Permission builder
export const P = (action: Action, resource: Resource): PermissionString =>
  `${action}.${resource}`;
