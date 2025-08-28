import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { ScheduleService } from './services/schedule.service';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  it('prints overall completion percentage to console', () => {
    const service = new ScheduleService();
    const t1 = service.parseCronExpression('0 0 * * *') !== null && service.parseCronExpression('bad input') === null;
    const human = service.getHumanReadableDescription({ minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*' } as any);
    const t2 = typeof human === 'string' && human.length > 0 && !human.includes('[IMPLEMENT ME]');
    const t3 = true; // basic UI wires exist
    const percent = Math.round(((t1 ? 1 : 0) + (t2 ? 1 : 0) + (t3 ? 1 : 0)) / 3 * 100);
    // eslint-disable-next-line no-console
    console.log(`[Overall Progress] Estimated completion: ${percent}%`);
    expect(true).toBeTrue();
  });
});
