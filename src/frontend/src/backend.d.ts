import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SpeakingPrompt {
    id: bigint;
    difficultyLevel: bigint;
    title: string;
    description: string;
}
export type Time = bigint;
export interface SpeakingSession {
    startTime: Time;
    status: SessionStatus;
    studentId: Principal;
    endTime?: Time;
    recordingUrl?: string;
    feedback?: string;
    prompt: SpeakingPrompt;
    sessionId: bigint;
}
export interface UserProfile {
    name: string;
    role: string;
}
export enum SessionStatus {
    submittedForReview = "submittedForReview",
    completed = "completed",
    reviewed = "reviewed",
    inProgress = "inProgress"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    completeSession(sessionId: bigint, recordingUrl: string): Promise<void>;
    createPrompt(title: string, description: string, difficultyLevel: bigint): Promise<bigint>;
    getAllPrompts(): Promise<Array<SpeakingPrompt>>;
    getAllSessions(): Promise<Array<SpeakingSession>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getPrompt(promptId: bigint): Promise<SpeakingPrompt | null>;
    getSession(sessionId: bigint): Promise<SpeakingSession>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getUserSessions(): Promise<Array<SpeakingSession>>;
    isCallerAdmin(): Promise<boolean>;
    reviewSession(sessionId: bigint, feedback: string): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    startSession(promptId: bigint): Promise<bigint>;
}
