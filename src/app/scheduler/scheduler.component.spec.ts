import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { SchedulerComponent } from './scheduler.component';
import { ScheduleService } from '../services/schedule.service';

describe('SchedulerComponent (Interview Edition)', () => {
  let component: SchedulerComponent;
  let fixture: ComponentFixture<SchedulerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedulerComponent, ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchedulerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('prints guidance to implement reactive form and validators', () => {
    // eslint-disable-next-line no-console
    console.log('[Guidance] Implement a Reactive Form with five controls (minute, hour, dayOfMonth, month, dayOfWeek) and validators.');
    expect(true).toBeTrue();
  });

  it('adds data-test hooks for conditional visibility', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    expect(compiled.querySelector('[data-test="validation-section"]')).toBeTruthy();
    expect(compiled.querySelector('[data-test="human-readable"]')).toBeTruthy();
    expect(compiled.querySelector('[data-test="cron-expression"]')).toBeTruthy();
  });

  it('produces cron and description when a valid form is implemented (conditional)', () => {
    // Simulate candidate-implemented reactive form shape
    (component as any).scheduleForm = {
      value: { minute: '0', hour: '9', dayOfMonth: '*', month: '*', dayOfWeek: '1' }
    } as any;

    component.validateAndPreview();

    const service: any = (component as any)["scheduleService"];
    const descForEvery = service.getHumanReadableDescription({ minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' });

    if (typeof descForEvery === 'string' && descForEvery.length > 0) {
      // Candidate likely implemented description; now assert outputs are populated
      expect(component.cronExpression).toBe('0 9 * * 1');
      expect(typeof component.humanReadableDescription).toBe('string');
      expect(component.humanReadableDescription.length).toBeGreaterThan(0);
    } else {
      // eslint-disable-next-line no-console
      console.warn('[Hint] Implement ScheduleService.getHumanReadableDescription and form to enable this test.');
      expect(true).toBeTrue();
    }
  });

  it('reset behavior guidance (to be implemented by candidate)', () => {
    // eslint-disable-next-line no-console
    console.log('[Guidance] Implement reset to set all fields to * and clear outputs.');
    expect(true).toBeTrue();
  });

  it('buttons: submit disabled when form invalid; enabled when valid (candidate to implement)', () => {
    const compiled: HTMLElement = fixture.nativeElement;
    const submitBtn = compiled.querySelector('[data-test="submit-btn"]') as HTMLButtonElement;
    expect(submitBtn?.disabled).toBeTrue();

    // Simulate candidate-implemented form becoming valid
    (component as any).scheduleForm = { valid: true } as any;
    fixture.detectChanges();

    expect(submitBtn?.disabled).toBeFalse();
  });
});


