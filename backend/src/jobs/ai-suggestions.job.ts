
export interface AIJobData {
    cvId: string;
    section: string;
}

export interface AISuggestionResult {
    original: string;
    suggestions: string[];
    improvement_score: number;
}
