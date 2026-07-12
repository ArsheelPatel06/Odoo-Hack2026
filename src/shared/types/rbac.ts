import { permissions, roles } from "@/shared/constants/rbac";

export type Role = (typeof roles)[keyof typeof roles];
export type Permission = (typeof permissions)[keyof typeof permissions];
