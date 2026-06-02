export type Destination =
  | 'Twitter'
  | 'LinkedIn'
  | 'Instagram'
  | 'YouTube'
  | 'Google'
  | 'Formal Email'
  | 'Casual Email'
  | 'Facebook'
  | 'Cover Letter'
  | 'LinkedIn Post'
  | 'Blog Introduction'
  | 'Newsletter Intro'
  | 'Personal Statement'
  | 'CV'
  | 'Slack'
  | 'Boss'
  | 'Medium'
  | 'WhatsApp'
  | 'Blog'
  | 'Email';

export type Tone =
  | 'Editorial'
  | 'Formal'
  | 'Casual'
  | 'Professional'
  | 'Friendly'
  | 'Persuasive'
  | 'Inspirational';

export interface RewriteRecord {
  id: string;
  destination: Destination | string;
  tone: Tone | string;
  original: string;
  shaped: string;
  createdAt: string;
}

export interface UserProfile {
  displayName: string;
  email: string;
  photoURL: string | null;
  bio: string;
  title: string;
  industry: string;
  topics: string[];
  audience: string;
  writingStyle?: string;
  writingStyleUpdatedAt?: string;
  historyCountAtLastUpdate?: number;
}

export interface TransformOptions {
  language?: string;
  smartContext?: boolean;
  userContext?: UserProfile;
  model?: 'gemini' | 'gpt';
}

export type PlanTier = 'basic' | 'premium';

export interface UserUsage {
  geminiCount: number;
  geminiMonthKey: string;
  gptTrialUsed: boolean;
  gptCount: number;
  gptMonthKey: string;
}

export interface UserSettings {
  smartContext: boolean;
  autoCopy: boolean;
  showBadge: boolean;
  language: string;
  preferredTone: Tone;
}
