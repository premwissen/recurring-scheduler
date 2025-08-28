export interface Schedule {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export interface ScheduleValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface SchedulePreview {
  nextRun: Date;
  expression: string;
}

export const SCHEDULE_FIELDS = {
  minute: { min: 0, max: 59, label: 'Minute' },
  hour: { min: 0, max: 23, label: 'Hour' },
  dayOfMonth: { min: 1, max: 31, label: 'Day of Month' },
  month: { min: 1, max: 12, label: 'Month' },
  dayOfWeek: { min: 0, max: 6, label: 'Day of Week' }
};
