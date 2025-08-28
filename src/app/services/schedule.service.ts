import { Injectable } from '@angular/core';
import { Schedule, ScheduleValidationResult, SCHEDULE_FIELDS } from '../models/schedule.model';

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



  /**
   * TODO (Interview Task 1): Implement cron expression parsing
   *
   * Requirements:
   * - Accepts a string with exactly 5 space-separated fields: minute hour dayOfMonth month dayOfWeek
   * - Trims extra whitespace between fields
   * - Returns a Schedule object when valid; otherwise returns null
   * - return null for invalid input
   *
   * Examples:
   * - '0,15,30,45 * * * *' -> { minute: '0,15,30,45', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' }
   * - '0 9,17 * * 1,5'     -> { minute: '0', hour: '9,17', dayOfMonth: '*', month: '*', dayOfWeek: '1,5' }
   */
  parseCronExpression(expression: string): Schedule | null {
    // IMPLEMENTATION REQUIRED BY CANDIDATE
    // Placeholder return to keep app compiling. Replace with a real implementation.
    return null;
  }

  formatCronExpression(schedule: Schedule): string {
    return `${schedule.minute} ${schedule.hour} ${schedule.dayOfMonth} ${schedule.month} ${schedule.dayOfWeek}`;
  }

  /**
   * TODO (Interview Task 2): Implement human-readable description generation
   *
   * Requirements:
   * - Translate non-'*' fields into a readable phrase, joining multiple values with ', '
   * - minute -> "at minute(s) X"
   * - hour -> "at hour(s) X"
   * - dayOfMonth -> "on day(s) X of the month"
   * - month -> map 1..12 to month names and output "in Jan/February/..."
   * - dayOfWeek -> map 0..6 to Sunday..Saturday and output "on <days>"
   * - If all are '*', return: 'Every minute of every hour, every day'
   */
  getHumanReadableDescription(schedule: Schedule): string {
    // IMPLEMENTATION REQUIRED BY CANDIDATE
    // Placeholder return to keep app compiling. Replace with a real implementation.
    return '';
  }

  /**
   * TODO (Interview Task 3): Normalize schedule values
   *
   * Requirements:
   * - For each non-'*' field, split by comma, trim, parse to integers
   * - Remove duplicates, sort ascending, and re-join with commas
   * - Drop values outside allowed ranges (use SCHEDULE_FIELDS for bounds)
   * - Return the normalized schedule object
   */
  normalizeSchedule(schedule: Schedule): Schedule {
    // IMPLEMENTATION REQUIRED BY CANDIDATE
    // Placeholder: return input unchanged to keep app functional.
    return schedule;
  }
}
