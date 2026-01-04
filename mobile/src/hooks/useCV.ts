
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { cvService } from '../services/cv.service';

/**
 * Hook to manage a single CV's data
 */
export function useCVData(cvId: string) {
    const queryClient = useQueryClient();

    const { data: cv, isLoading, error } = useQuery({
        queryKey: ['cv', cvId],
        queryFn: () => cvService.getCV(cvId),
        enabled: !!cvId,
    });

    const mutation = useMutation({
        mutationFn: (updates: any) => cvService.updateCV(cvId, updates),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['cv', cvId] });
            queryClient.invalidateQueries({ queryKey: ['cvs'] });
        },
    });

    return {
        cv,
        isLoading,
        error,
        updateCV: mutation.mutateAsync,
        isSaving: mutation.isPending
    };
}

/**
 * Hook to list all user CVs
 */
export function useCVs() {
    return useQuery({
        queryKey: ['cvs'],
        queryFn: cvService.listCVs,
    });
}
