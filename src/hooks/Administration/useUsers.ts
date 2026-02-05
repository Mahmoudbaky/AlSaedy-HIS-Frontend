import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { authService, User } from 'src/services/auth.service';
import { toast } from 'sonner';

// Get users for admin
export const useUsersForAdmin = () => {
    return useQuery<User[]>({
        queryKey: ['users', 'admin'],
        queryFn: () => authService.getUsersForAdmin(),
        retry: 1,
        refetchOnWindowFocus: true,
    });
};

// Confirm user account mutation
export const useConfirmAccount = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (userId: string) => authService.confirmAccount(userId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
            toast.success('Account confirmed successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Account confirmation failed');
        },
    });
};

// Change user role mutation
export const useChangeUserRole = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ userId, role }: { userId: string; role: string }) =>
            authService.changeUserRole(userId, role),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users', 'admin'] });
            toast.success('Role updated successfully');
        },
        onError: (error: Error) => {
            toast.error(error.message || 'Role change failed');
        },
    });
};