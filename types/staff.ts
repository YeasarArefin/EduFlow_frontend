export const MEMBER_STATUSES = ['active', 'suspended', 'removed'] as const;
export type MemberStatus = (typeof MEMBER_STATUSES)[number];
export type WorkspaceMember = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: string | null;
  roleId: string | null;
  roleCode: number;
  status: MemberStatus;
  joinedAt: string | null;
  createdAt: string;
};
export type MemberListParams = {
  page: number;
  limit: number;
  search?: string;
  roleId?: string;
  status?: MemberStatus;
};
export type StaffPaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};
export type AddMemberInput = { name: string; email: string; password: string; roleId: string };
export type AddMemberMutationInput = AddMemberInput & { workspaceId: string };
export type UpdateMemberRoleMutationInput = { workspaceId: string; id: string; roleId: string };
export type UpdateMemberStatusMutationInput = {
  workspaceId: string;
  id: string;
  status: Extract<MemberStatus, 'active' | 'suspended'>;
};
export type RemoveMemberMutationInput = { workspaceId: string; id: string };
export type Permission = {
  code: number;
  key: string;
  name: string | null;
  module: string | null;
  description: string | null;
};
export type WorkspaceRole = { id: string; name: string; description: string | null };
export type PermissionOverride = { permissionCode: number; allowed: boolean };
export type PermissionConfiguration = {
  roles: WorkspaceRole[];
  permissions: Array<Permission & { roles: Record<string, boolean> }>;
};
export type MemberPermissionConfiguration = {
  member: { id: string; roleId: string; name: string; email: string };
  permissions: Array<Permission & { inheritedAllowed: boolean; overrideAllowed: boolean | null }>;
};
export type RoleInput = { name: string; description?: string; permissions: PermissionOverride[] };
export type CreateRoleMutationInput = RoleInput & { workspaceId: string };
export type UpdateRoleMutationInput = RoleInput & { workspaceId: string; roleId: string };
export type DeleteRoleMutationInput = { workspaceId: string; roleId: string };
export type UpdateMemberOverridesMutationInput = {
  workspaceId: string;
  memberId: string;
  overrides: PermissionOverride[];
};
export type ResetMemberOverridesMutationInput = { workspaceId: string; memberId: string };
export type StaffPageProps = { workspaceId: string };
export type MemberDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string;
  member?: WorkspaceMember;
};
export type MemberFormValues = { name: string; email: string; password: string; roleId: string };
export type MemberActionsProps = {
  member: WorkspaceMember;
  onEdit: () => void;
  onSuspend: () => void;
  onReactivate: () => void;
  onRemove: () => void;
};
export type PermissionManagementPageProps = { workspaceId: string };
