import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Schedule } from '../models/schedule.model';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-validator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './validator.component.html',
  styleUrls: ['./validator.component.scss']
})
export class ValidatorComponent {
  validatorForm: FormGroup;
  validationResult: any = null;
  humanReadableDescription: string = '';
  isValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.validatorForm = this.fb.group({
      cronExpression: ['', [Validators.required, Validators.pattern(/^[\d\s,*]+$/)]]
    });

    this.validatorForm.valueChanges.subscribe(() => {
      this.validateExpression();
    });
  }

  validateExpression(): void {
    const expression = this.validatorForm.get('cronExpression')?.value;
    
    if (!expression || !this.validatorForm.valid) {
      this.validationResult = null;
      this.humanReadableDescription = '';
      this.isValid = false;
      return;
    }

    const schedule = this.scheduleService.parseCronExpression(expression);
    
    if (!schedule) {
      this.validationResult = {
        isValid: false,
        error: 'Invalid cron expression format. Must have exactly 5 fields separated by spaces.'
      };
      this.humanReadableDescription = '';
      this.isValid = false;
      return;
    }

    const validation = this.scheduleService.validateSchedule(schedule);
    
    if (validation.isValid) {
      this.isValid = true;
      this.humanReadableDescription = this.scheduleService.getHumanReadableDescription(schedule);
      this.validationResult = {
        isValid: true,
        schedule: schedule
      };
    } else {
      this.isValid = false;
      this.humanReadableDescription = '';
      this.validationResult = {
        isValid: false,
        errors: validation.errors,
        warnings: validation.warnings
      };
    }
  }

  getExamples(): string[] {
    return [
      '0,15,30,45 * * * *',
      '0 9,17 * * 1,5',
      '30 12 1,15 * *',
      '0 0 1 1,7 *',
      '* * * * *'
    ];
  }
}
