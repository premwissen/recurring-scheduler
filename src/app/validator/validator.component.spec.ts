import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { ValidatorComponent } from './validator.component';
import { ScheduleService } from '../services/schedule.service';
import { Schedule } from '../models/schedule.model';

describe('ValidatorComponent', () => {
  let component: ValidatorComponent;
  let fixture: ComponentFixture<ValidatorComponent>;
  let scheduleService: jasmine.SpyObj<ScheduleService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ScheduleService', [
      'parseCronExpression',
      'validateSchedule',
      'getHumanReadableDescription'
    ]);

    await TestBed.configureTestingModule({
      imports: [ValidatorComponent, ReactiveFormsModule],
      providers: [
        { provide: ScheduleService, useValue: spy }
      ]
    }).compileComponents();

    scheduleService = TestBed.inject(ScheduleService) as jasmine.SpyObj<ScheduleService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.validatorForm.get('cronExpression')?.value).toBe('');
    expect(component.validationResult).toBeNull();
    expect(component.humanReadableDescription).toBe('');
    expect(component.isValid).toBeFalse();
  });

  it('should validate expression on form value changes', () => {
    const input = fixture.nativeElement.querySelector('input');
    input.value = '0,15,30,45 * * * *';
    input.dispatchEvent(new Event('input'));

    expect(scheduleService.parseCronExpression).toHaveBeenCalledWith('0,15,30,45 * * * *');
  });

  it('should handle valid cron expression', () => {
    const mockSchedule: Schedule = {
      minute: '0,15,30,45',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*'
    };

    const mockValidation = {
      isValid: true,
      errors: [],
      warnings: []
    };

    const mockDescription = 'at minutes 0, 15, 30, 45';

    scheduleService.parseCronExpression.and.returnValue(mockSchedule);
    scheduleService.validateSchedule.and.returnValue(mockValidation);
    scheduleService.getHumanReadableDescription.and.returnValue(mockDescription);

    component.validatorForm.patchValue({ cronExpression: '0,15,30,45 * * * *' });
    component.validateExpression();

    expect(component.isValid).toBeTrue();
    expect(component.humanReadableDescription).toBe(mockDescription);
    expect(component.validationResult.isValid).toBeTrue();
    expect(component.validationResult.schedule).toEqual(mockSchedule);
  });

  it('should handle invalid cron expression format', () => {
    scheduleService.parseCronExpression.and.returnValue(null);

    component.validatorForm.patchValue({ cronExpression: 'invalid' });
    component.validateExpression();

    expect(component.isValid).toBeFalse();
    expect(component.humanReadableDescription).toBe('');
    expect(component.validationResult).toBeTruthy();
    expect(component.validationResult.isValid).toBeFalse();
    expect(component.validationResult.error).toContain('Invalid cron expression format');
  });

  it('should handle validation errors', () => {
    const mockSchedule: Schedule = {
      minute: '60',
      hour: '*',
      dayOfMonth: '*',
      month: '*',
      dayOfWeek: '*'
    };

    const mockValidation = {
      isValid: false,
      errors: ['Minute must be between 0 and 59'],
      warnings: []
    };

    scheduleService.parseCronExpression.and.returnValue(mockSchedule);
    scheduleService.validateSchedule.and.returnValue(mockValidation);

    component.validatorForm.patchValue({ cronExpression: '60 * * * *' });
    component.validateExpression();

    expect(component.isValid).toBeFalse();
    expect(component.humanReadableDescription).toBe('');
    expect(component.validationResult.isValid).toBeFalse();
    expect(component.validationResult.errors).toContain('Minute must be between 0 and 59');
  });

  it('should handle validation warnings', () => {
    const mockSchedule: Schedule = {
      minute: '*',
      hour: '*',
      dayOfMonth: '1',
      month: '*',
      dayOfWeek: '1'
    };

    const mockValidation = {
      isValid: true,
      errors: [],
      warnings: ['Both Day of Month and Day of Week are specified. This may cause conflicts.']
    };

    const mockDescription = 'on day 1 of the month, on Monday';

    scheduleService.parseCronExpression.and.returnValue(mockSchedule);
    scheduleService.validateSchedule.and.returnValue(mockValidation);
    scheduleService.getHumanReadableDescription.and.returnValue(mockDescription);

    component.validatorForm.patchValue({ cronExpression: '* * 1 * 1' });
    component.validateExpression();

    expect(component.isValid).toBeTrue();
    expect(component.humanReadableDescription).toBe(mockDescription);
    expect(component.validationResult.warnings).toBeDefined();
    expect(component.validationResult.warnings).toContain('Both Day of Month and Day of Week are specified. This may cause conflicts.');
  });

  it('should clear results when expression is empty', () => {
    // First set some values
    component.validatorForm.patchValue({ cronExpression: '0 * * * *' });
    component.validateExpression();

    // Then clear the expression
    component.validatorForm.patchValue({ cronExpression: '' });
    component.validateExpression();

    expect(component.validationResult).toBeNull();
    expect(component.humanReadableDescription).toBe('');
    expect(component.isValid).toBeFalse();
  });

  it('should return example expressions', () => {
    const examples = component.getExamples();
    
    expect(examples).toContain('0,15,30,45 * * * *');
    expect(examples).toContain('0 9,17 * * 1,5');
    expect(examples).toContain('30 12 1,15 * *');
    expect(examples).toContain('0 0 1 1,7 *');
    expect(examples).toContain('* * * * *');
    expect(examples.length).toBe(5);
  });

  it('should handle form validation errors', () => {
    const input = component.validatorForm.get('cronExpression');
    
    // Test required validator
    input?.setValue('');
    expect(input?.hasError('required')).toBeTrue();
    
    // Test pattern validator
    input?.setValue('0 * * * *');
    expect(input?.hasError('pattern')).toBeFalse();
    
    input?.setValue('0 * * * * abc');
    expect(input?.hasError('pattern')).toBeTrue();
  });

  it('should not validate when form is invalid', () => {
    component.validatorForm.patchValue({ cronExpression: 'invalid format' });
    component.validateExpression();

    expect(scheduleService.parseCronExpression).not.toHaveBeenCalled();
    expect(component.validationResult).toBeNull();
    expect(component.humanReadableDescription).toBe('');
    expect(component.isValid).toBeFalse();
  });
});
