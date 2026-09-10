import { MoreHorizontal, UserMinus, UserRoundCheck, UserRoundPen, UserRoundX } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import type { MemberActionsProps } from '@/types/staff';

export function MemberActions({
  member,
  onEdit,
  onSuspend,
  onReactivate,
  onRemove,
}: MemberActionsProps) {
  if (member.role === 'Owner') {
    return <span className="text-xs text-muted-foreground">Protected owner</span>;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={<Button variant="ghost" size="icon-sm" aria-label={`Actions for ${member.name}`} />}
      >
        <MoreHorizontal />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit}>
            <UserRoundPen /> Change role
          </DropdownMenuItem>
          {member.status === 'active' ? (
            <DropdownMenuItem onClick={onSuspend}>
              <UserRoundX /> Suspend member
            </DropdownMenuItem>
          ) : null}
          {member.status === 'suspended' ? (
            <DropdownMenuItem onClick={onReactivate}>
              <UserRoundCheck /> Reactivate member
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onRemove}>
            <UserMinus /> Remove member
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
