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
  // TODO (Interview Task - Build Form): Define a FormGroup with a single control 'cronExpression'
  validatorForm: any;
  validationResult: any = null;
  humanReadableDescription: string = '';
  isValid: boolean = false;

  constructor(
    private fb: FormBuilder,
    private scheduleService: ScheduleService
  ) {
    // TODO (Interview Task - Build Form): Initialize the form and subscribe to value changes
    // @ts-ignore
  }

  validateExpression(): void {
    const expression = this.validatorForm.get('cronExpression')?.value;
    
    // Keep this method thin and delegate main logic to a helper implemented by the candidate
    if (!expression || !this.validatorForm.valid) {
      this.clearOutputs();
      return;
    }

    // TODO (Interview Task - Implement): Implement updateStateFromExpression to:
    // - parse via ScheduleService.parseCronExpression
    // - if null => set invalid format error on validationResult, clear description and isValid=false
    // - if parsed => validate via ScheduleService.validateSchedule
    //   - when valid => set isValid=true, set humanReadableDescription via getHumanReadableDescription, set validationResult
    //   - when invalid => set isValid=false, set validationResult with errors/warnings, clear description
    this.updateStateFromExpression(expression);
  }

  // TODO (Interview Task - Implement): Write this helper to encapsulate the core logic described above.
  // This method should be unit-testable independently.
  protected updateStateFromExpression(_expression: string): void {
    // Placeholder: Candidate to implement. Keep component methods small and readable.
  }

  // Utility to clear current outputs
  protected clearOutputs(): void {
    this.validationResult = null;
    this.humanReadableDescription = '';
    this.isValid = false;
  }

}
