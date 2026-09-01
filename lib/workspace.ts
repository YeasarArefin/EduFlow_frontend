export const SELECTED_WORKSPACE_COOKIE = "eduflow.workspaceId";

export function clearSelectedWorkspace() {
  window.localStorage.removeItem(SELECTED_WORKSPACE_COOKIE);
  document.cookie = `${SELECTED_WORKSPACE_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}
