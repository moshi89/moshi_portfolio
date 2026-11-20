export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: 'AI_HEALTH' | 'EMBEDDED_RTOS';
  role: string;
  description: string;
  fullOverview: string;
  demoUrl?: string;
  codeUrl?: string;
  techStack: { technology: string; role: string }[];
  highlights: string[];
}

export interface CognitiveDistortion {
  name: string;
  description: string;
  percentage: number;
}

export interface ActivitySuggestion {
  activity: string;
  category: 'Physical' | 'Cognitive' | 'Social' | 'Reflective';
  weatherNeeded: string;
  description: string;
}

export interface RtosTask {
  name: string;
  priority: number;
  trigger: string;
  responsibility: string;
}

export interface Competition {
  name: string;
  date: string;
  role: string;
  description: string;
  tags: string[];
  goals: string[];
}
