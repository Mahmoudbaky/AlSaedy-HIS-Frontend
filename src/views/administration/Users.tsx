import BreadcrumbComp from 'src/layouts/full/shared/breadcrumb/BreadcrumbComp';
import CardBox from 'src/components/shared/CardBox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'src/components/ui/table';
import { Button } from 'src/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'src/components/ui/select';
import { Badge } from 'src/components/ui/badge';
import { useUsersForAdmin, useConfirmAccount, useChangeUserRole } from 'src/hooks/Administration/useUsers';
import { CheckCircle2, Loader2 } from 'lucide-react';

const BCrumb = [
  { to: '/', title: 'Home' },
  { to: '/admin/users', title: 'Administration' },
  { title: 'Users' },
];

const BRANCH_OPTIONS = ['Makkah', 'Jumum'] as const;
const ROLE_OPTIONS = ['admin', 'user'] as const;

const Users = () => {
  const { data: users = [], isLoading, error } = useUsersForAdmin();
  const confirmAccountMutation = useConfirmAccount();
  const changeRoleMutation = useChangeUserRole();

  const handleConfirm = (userId: string) => {
    confirmAccountMutation.mutate(userId);
  };

  const handleRoleChange = (userId: string, role: string) => {
    changeRoleMutation.mutate({ userId, role });
  };

  // TODO: Wire up when branch service is created
  const handleBranchChange = (_userId: string, _branch: string) => {
    // branchService.updateUserBranch(userId, branch);
  };

  if (isLoading) {
    return (
      <>
        <BreadcrumbComp title="Users" items={BCrumb} />
        <CardBox className="p-8 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardBox>
      </>
    );
  }

  if (error) {
    return (
      <>
        <BreadcrumbComp title="Users" items={BCrumb} />
        <CardBox className="p-8">
          <p className="text-destructive">Failed to load users. Please try again.</p>
        </CardBox>
      </>
    );
  }

  return (
    <>
      <BreadcrumbComp title="Users" items={BCrumb} />
      <CardBox className="p-6">
        <h3 className="text-xl font-semibold mb-4">Users Management</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-sm font-semibold">Username</TableHead>
                <TableHead className="text-sm font-semibold">Email</TableHead>
                <TableHead className="text-sm font-semibold">Branch</TableHead>
                <TableHead className="text-sm font-semibold">Role</TableHead>
                <TableHead className="text-sm font-semibold">Confirmed</TableHead>
                <TableHead className="text-sm font-semibold text-end">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                    No users found
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id} className="border-b border-border">
                    <TableCell className="font-medium">{user.username}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Select
                        value={user.branch || ''}
                        onValueChange={(value) => handleBranchChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-9">
                          <SelectValue placeholder="Select branch" />
                        </SelectTrigger>
                        <SelectContent>
                          {BRANCH_OPTIONS.map((branch) => (
                            <SelectItem key={branch} value={branch}>
                              {branch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select
                        value={user.role || 'user'}
                        onValueChange={(value) => handleRoleChange(user.id, value)}
                      >
                        <SelectTrigger className="w-[120px] h-9">
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          {ROLE_OPTIONS.map((role) => (
                            <SelectItem key={role} value={role}>
                              {role}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      {user.confirmed ? (
                        <Badge className="bg-success/20 text-success">Confirmed</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-warning/20 text-warning">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-end">
                      {!user.confirmed && (
                        <Button
                          size="sm"
                          variant="outlinesuccess"
                          onClick={() => handleConfirm(user.id)}
                          disabled={
                            confirmAccountMutation.isPending &&
                            confirmAccountMutation.variables === user.id
                          }
                        >
                          {confirmAccountMutation.isPending &&
                            confirmAccountMutation.variables === user.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <CheckCircle2 className="h-4 w-4 mr-1" />
                              Confirm
                            </>
                          )}
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardBox>
    </>
  );
};

export default Users;
