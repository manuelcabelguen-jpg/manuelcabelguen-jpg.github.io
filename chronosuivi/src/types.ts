export interface Constraint {
  id: string;
  date: string; // ISO string YYYY-MM-DD
  description: string;
  type: 'HOLIDAY' | 'LOGISTICS' | 'OTHER';
  periodId?: string;
}

export interface DaySchedule {
  dayIndex: number; // 1 = Monday, 5 = Friday
  sessionsCount: number; // How many sessions occur on this day
  label: string;
}

export interface Stage {
  id: string;
  name: string;
  sessionsRequired: number; // Changed from durationDays to sessionsRequired
  order: number;
}

export interface ProgramState {
  programName: string;
  intervenantName: string;
  startDate: string; // ISO string YYYY-MM-DD
  stages: Stage[];
  constraints: Constraint[];
  schedule: DaySchedule[];
}

export interface DayDetail {
  date: Date;
  status: 'SESSION' | 'WEEKEND' | 'HOLIDAY' | 'CONSTRAINT' | 'OFF';
  description?: string;
}

export interface CalculatedStage extends Stage {
  startDate: Date;
  endDate: Date;
  isDelayed: boolean;
  delayReason?: string;
  realDurationDays: number; // How many actual calendar days it took
  details: DayDetail[];
}
