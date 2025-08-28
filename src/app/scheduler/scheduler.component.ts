import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Schedule, ScheduleValidationResult } from '../models/schedule.model';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent {
  // TODO (Interview Task - Build Form): Define a FormGroup for the scheduler form
  scheduleForm: any;
  validationResult: ScheduleValidationResult | null = null;
  cronExpression: string = '';
  humanReadableDescription: string = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    // TODO (Interview Task - Build Form): Define a FormGroup for the scheduler form with validators
    // - Each control should allow '*' or comma-separated integers. '*' will be default value
    // - Add Validators for each field
    // - Controls: minute (0-59), hour (0-23), dayOfMonth (1-31), month (1-12), dayOfWeek (0-6)
  }

  validateAndPreview(): void {
    let schedule = this.scheduleForm.value;
    // TODO (Interview Task 3): After implementing service methods, wire up additional UI updates here if needed.
    // Currently this calls validation only. Keep this as-is unless tests instruct otherwise.
    // TODO (Interview Task 3): Normalize schedule prior to validation using ScheduleService.normalizeSchedule
    schedule = this.scheduleService.normalizeSchedule(schedule as any);
    this.validationResult = this.scheduleService.validateSchedule(schedule as any);

    // TODO (Interview Task 4): Generate cron expression and description using the service.
    // Replace the placeholder logic below after completing Task 1 & 2 in ScheduleService.
    if (this.validationResult.isValid) {
      // Placeholder until candidate implements getHumanReadableDescription
      this.cronExpression = this.scheduleService.formatCronExpression(schedule as any);
      this.humanReadableDescription = this.scheduleService.getHumanReadableDescription(schedule as any);
    } else {
      this.cronExpression = '';
      this.humanReadableDescription = '';
    }
  }



  submitSchedule(): void {
    this.validateAndPreview();
  }

  // TODO (Interview Task - Build Form Reset): Implement a reset method that resets the form to '*'
  resetForm(): void {
    // TODO: Candidate must implement reset using FormGroup.reset to:
    // - Set all fields to '*'
    // - Clear validationResult, cronExpression, and humanReadableDescription
  }
}
