// TypeScript interfaces matching the database schema

export interface User {
    id: number;
    username: string;
    fullName: string;
    role: 'admin' | 'member';
    password?: string; // Only for creation payload, never returned really
    token?: string; // JWT token
}

// Basic Candidate Info (List View)
export interface Candidate {
    id?: number;
    fullName: string;
    latestQualification?: string;
    lastCompany?: string;
    totalExperienceYears?: number;
    expertise?: string;
    photoPath?: string;
    // Military fields
    employeeId?: string;
    branch?: string;
    timer?: number;
    rank?: string;
    unit?: string;
    appt?: string;
    dop?: string;
    dor?: string;
    category?: string;
    decorations?: string;
    relyingHrs?: number;
    photo2Path?: string;
    reviewed?: boolean;
    // Personal fields (direct access)
    phone?: string;
    email?: string;
    nationality?: string;
    currentAddress?: string;
    permanentAddress?: string;
    dob?: string;
    gender?: string;
    maritalStatus?: string;
    // Navigation helpers
    nextCandidateId?: number | null;
    prevCandidateId?: number | null;
}

// Full Candidate Details including embedded collections
export interface CandidateFull extends Candidate {
    // Determine if we need to flatten this or keep structure.
    // Backend returns Candidate entity which contains lists.
    // Let's align with Backend Entity structure
    personal?: PersonalDetails;
    qualifications?: Qualification[];
    experiences?: Experience[];
    certifications?: Certification[];
}

export interface PersonalDetails {
    // id?: number; // Embedded in backend entity or separate? 
    // Actually in backend Candidate entity:
    /*
    @Embedded
    private PersonalDetails personal;
    */
    // So it's an object property.
    address?: string;
    nationality?: string;
    phone?: string;
    father?: string;
    mother?: string;
    spouse?: string;
    children?: string;
}

export interface Qualification {
    level: string;
    subject?: string;
    institution?: string;
    year?: number;
    marks?: string;
    grade?: string;
    sortOrder?: number;
}

export interface Experience {
    fromYear: number;
    toYear: number;
    company: string;
    address?: string;
    roleTitle?: string;
}

export interface Certification {
    title: string;
    authority?: string;
    year?: number;
    notes?: string;
}

// User / Auth
export type SessionUser = User; // Alias for backward compat if needed

export interface LoginCredentials {
    username: string;
    password?: string;
}

// Voting
export interface Vote {
    id?: number;
    candidateId: number;
    userId: number;
    marks: number;
    submittedAt?: string;
}

export interface VoteStatus {
    userId: number;
    fullName: string;
    username: string;
    role: 'admin' | 'member';
    marks: number | null;
    submittedAt: string | null;
}

// Meeting State
export interface MeetingState {
    id: number;
    currentCandidateId: number | null;
    voteOpen: boolean;
    voteOpenedAt: string | null;
}

// WebSocket Payloads
export interface MeetingUpdatePayload {
    currentCandidateId: number | null;
    voteOpen: boolean;
    voteOpenedAt: string | null;
}

export interface VoteSubmittedPayload {
    candidateId: number;
    userId: number;
    marks: number | null;
    at: string;
}
