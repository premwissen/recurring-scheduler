import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Schedule, ScheduleValidationResult, SchedulePreview } from '../models/schedule.model';
import { ScheduleService } from '../services/schedule.service';

@Component({
  selector: 'app-scheduler',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './scheduler.component.html',
  styleUrls: ['./scheduler.component.scss']
})
export class SchedulerComponent implements OnInit {
  scheduleForm: FormGroup;
  validationResult: ScheduleValidationResult | null = null;
  previews: SchedulePreview[] = [];
  cronExpression: string = '';

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    this.scheduleForm = this.fb.group({
      minute: ['*', Validators.required],
      hour: ['*', Validators.required],
      dayOfMonth: ['*', Validators.required],
      month: ['*', Validators.required],
      dayOfWeek: ['*', Validators.required]
    });
  }

  ngOnInit(): void {
    this.scheduleForm.valueChanges.subscribe(() => {
      this.validateAndPreview();
    });
  }

  validateAndPreview(): void {
    const schedule = this.scheduleForm.value;
    this.validationResult = this.scheduleService.validateSchedule(schedule);
    
    if (this.validationResult.isValid) {
      this.previews = this.scheduleService.generatePreview(schedule);
      this.cronExpression = this.scheduleService.formatCronExpression(schedule);
    } else {
      this.previews = [];
      this.cronExpression = '';
    }
  }

  exportSchedule(): void {
    const schedule = this.scheduleForm.value;
    const dataStr = JSON.stringify(schedule, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'schedule.json';
    link.click();
  }

  importSchedule(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        try {
          const schedule = JSON.parse(e.target.result);
          this.scheduleForm.patchValue(schedule);
        } catch (error) {
          console.error('Error parsing schedule file:', error);
        }
      };
      reader.readAsText(file);
    }
  }

  resetForm(): void {
    this.scheduleForm.reset({
      minute: '*',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*'
    });
    this.validationResult = null;
    this.previews = [];
    this.cronExpression = '';
  }
}
