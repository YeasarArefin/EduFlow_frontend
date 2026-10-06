import {
  Crown,
  MoreHorizontal,
  UserMinus,
  UserRoundCheck,
  UserRoundPen,
  UserRoundX,
} from 'lucide-react';
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
    return (
      <span className="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/50 px-2.5 py-1 text-xs font-medium text-muted-foreground">
        <Crown className="size-3 text-amber-500 shrink-0" />
        Protected
      </span>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            className="hover:bg-accent/70 data-[state=open]:bg-accent"
            aria-label={`Actions for ${member.name}`}
          />
        }
      >
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={onEdit} className="gap-2 text-xs">
            <UserRoundPen className="size-3.5 text-muted-foreground" />
            <span>Change role</span>
          </DropdownMenuItem>
          {member.status === 'active' ? (
            <DropdownMenuItem onClick={onSuspend} className="gap-2 text-xs">
              <UserRoundX className="size-3.5 text-amber-500" />
              <span>Suspend member</span>
            </DropdownMenuItem>
          ) : null}
          {member.status === 'suspended' ? (
            <DropdownMenuItem onClick={onReactivate} className="gap-2 text-xs">
              <UserRoundCheck className="size-3.5 text-emerald-500" />
              <span>Reactivate member</span>
            </DropdownMenuItem>
          ) : null}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem variant="destructive" onClick={onRemove} className="gap-2 text-xs">
            <UserMinus className="size-3.5" />
            <span>Remove member</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
