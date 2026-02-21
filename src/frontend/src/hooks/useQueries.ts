import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { SpeakingPrompt, SpeakingSession, UserProfile } from '../backend';

// Prompts
export function useGetAllPrompts() {
  const { actor, isFetching } = useActor();

  return useQuery<SpeakingPrompt[]>({
    queryKey: ['prompts'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrompts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetPrompt(promptId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SpeakingPrompt | null>({
    queryKey: ['prompt', promptId?.toString()],
    queryFn: async () => {
      if (!actor || !promptId) return null;
      return actor.getPrompt(promptId);
    },
    enabled: !!actor && !isFetching && promptId !== null,
  });
}

export function useCreatePrompt() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      title,
      description,
      difficultyLevel,
    }: {
      title: string;
      description: string;
      difficultyLevel: bigint;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createPrompt(title, description, difficultyLevel);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });
}

// Sessions
export function useGetUserSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<SpeakingSession[]>({
    queryKey: ['userSessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUserSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetSession(sessionId: bigint | null) {
  const { actor, isFetching } = useActor();

  return useQuery<SpeakingSession | null>({
    queryKey: ['session', sessionId?.toString()],
    queryFn: async () => {
      if (!actor || !sessionId) return null;
      return actor.getSession(sessionId);
    },
    enabled: !!actor && !isFetching && sessionId !== null,
  });
}

export function useGetAllSessions() {
  const { actor, isFetching } = useActor();

  return useQuery<SpeakingSession[]>({
    queryKey: ['allSessions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllSessions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useStartSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (promptId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.startSession(promptId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
    },
  });
}

export function useCompleteSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, recordingUrl }: { sessionId: bigint; recordingUrl: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.completeSession(sessionId, recordingUrl);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
    },
  });
}

export function useReviewSession() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ sessionId, feedback }: { sessionId: bigint; feedback: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.reviewSession(sessionId, feedback);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allSessions'] });
      queryClient.invalidateQueries({ queryKey: ['session'] });
      queryClient.invalidateQueries({ queryKey: ['userSessions'] });
    },
  });
}

// User Profile
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetCallerUserRole() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['currentUserRole'],
    queryFn: async () => {
      if (!actor) return 'guest';
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['isAdmin'],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}
