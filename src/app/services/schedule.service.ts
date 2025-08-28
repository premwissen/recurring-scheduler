import { Injectable } from '@angular/core';
import { Schedule, ScheduleValidationResult, SchedulePreview, SCHEDULE_FIELDS } from '../models/schedule.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {

  validateSchedule(schedule: Schedule): ScheduleValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    // Validate each field
    Object.entries(schedule).forEach(([field, value]) => {
      if (!value || value.trim() === '') {
        errors.push(`${SCHEDULE_FIELDS[field as keyof typeof SCHEDULE_FIELDS].label} is required`);
        return;
      }

      const values = value.split(',').map((v: string) => v.trim());
      const fieldConfig = SCHEDULE_FIELDS[field as keyof typeof SCHEDULE_FIELDS];

      values.forEach((val: string) => {
        if (val === '*') return; // Wildcard is valid

        const num = parseInt(val, 10);
        if (isNaN(num)) {
          errors.push(`${fieldConfig.label} must contain valid numbers separated by commas`);
          return;
        }

        if (num < fieldConfig.min || num > fieldConfig.max) {
          errors.push(`${fieldConfig.label} must be between ${fieldConfig.min} and ${fieldConfig.max}`);
        }
      });
    });

    // Check for conflicting constraints
    if (schedule.dayOfMonth !== '*' && schedule.dayOfWeek !== '*') {
      warnings.push('Both Day of Month and Day of Week are specified. This may cause conflicts.');
    }

    return {
      isValid: errors.length === 0,
      errors,
      warnings
    };
  }

  generatePreview(schedule: Schedule, count: number = 5): SchedulePreview[] {
    const validation = this.validateSchedule(schedule);
    if (!validation.isValid) {
      return [];
    }

    const previews: SchedulePreview[] = [];
    let currentDate = new Date();
    currentDate.setSeconds(0, 0); // Reset seconds and milliseconds

    for (let i = 0; i < count; i++) {
      const nextRun = this.findNextRun(schedule, currentDate);
      if (nextRun) {
        previews.push({
          nextRun,
          expression: this.formatCronExpression(schedule)
        });
        currentDate = new Date(nextRun.getTime() + 60000); // Move to next minute
      }
    }

    return previews;
  }

  private findNextRun(schedule: Schedule, fromDate: Date): Date | null {
    let currentDate = new Date(fromDate);
    let attempts = 0;
    const maxAttempts = 1000; // Prevent infinite loops

    while (attempts < maxAttempts) {
      if (this.matchesSchedule(schedule, currentDate)) {
        return currentDate;
      }
      currentDate = new Date(currentDate.getTime() + 60000); // Add 1 minute
      attempts++;
    }

    return null;
  }

  private matchesSchedule(schedule: Schedule, date: Date): boolean {
    const minute = date.getMinutes();
    const hour = date.getHours();
    const dayOfMonth = date.getDate();
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const dayOfWeek = date.getDay();

    return this.fieldMatches(schedule.minute, minute) &&
           this.fieldMatches(schedule.hour, hour) &&
           this.fieldMatches(schedule.dayOfMonth, dayOfMonth) &&
           this.fieldMatches(schedule.month, month) &&
           this.fieldMatches(schedule.dayOfWeek, dayOfWeek);
  }

  private fieldMatches(fieldValue: string, actualValue: number): boolean {
    if (fieldValue === '*') return true;
    const values = fieldValue.split(',').map(v => parseInt(v.trim(), 10));
    return values.includes(actualValue);
  }

  parseCronExpression(expression: string): Schedule | null {
    const parts = expression.trim().split(/\s+/);
    if (parts.length !== 5) {
      return null;
    }

    return {
      minute: parts[0],
      hour: parts[1],
      dayOfMonth: parts[2],
      month: parts[3],
      dayOfWeek: parts[4]
    };
  }

  formatCronExpression(schedule: Schedule): string {
    return `${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`;
  }

  getHumanReadableDescription(schedule: Schedule): string {
    const parts: string[] = [];

    if (schedule.minute !== '*') {
      const minutes = schedule.minute.split(',').map(m => m.trim());
      parts.push(`at minute${minutes.length > 1 ? 's' : ''} ${minutes.join(', ')}`);
    }

    if (schedule.hour !== '*') {
      const hours = schedule.hour.split(',').map(h => h.trim());
      parts.push(`at hour${hours.length > 1 ? 's' : ''} ${hours.join(', ')}`);
    }

    if (schedule.dayOfMonth !== '*') {
      const days = schedule.dayOfMonth.split(',').map(d => d.trim());
      parts.push(`on day${days.length > 1 ? 's' : ''} ${days.join(', ')} of the month`);
    }

    if (schedule.month !== '*') {
      const months = schedule.month.split(',').map(m => m.trim());
      const monthNames = months.map(m => {
        const monthNum = parseInt(m, 10);
        const date = new Date(2000, monthNum - 1, 1);
        return date.toLocaleDateString('en-US', { month: 'long' });
      });
      parts.push(`in ${monthNames.join(', ')}`);
    }

    if (schedule.dayOfWeek !== '*') {
      const weekdays = schedule.dayOfWeek.split(',').map(w => w.trim());
      const weekdayNames = weekdays.map(w => {
        const weekdayNum = parseInt(w, 10);
        const weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return weekdays[weekdayNum];
      });
      parts.push(`on ${weekdayNames.join(', ')}`);
    }

    if (parts.length === 0) {
      return 'Every minute of every hour, every day';
    }

    return parts.join(', ');
  }
}
