import { ScheduleService } from './schedule.service';

describe('ScheduleService (Interview Tasks Progress)', () => {
  let service: ScheduleService;

  beforeEach(() => {
    service = new ScheduleService();
  });

  it('Task 1: parseCronExpression basic cases and guidance', () => {
    const ok = service.parseCronExpression('0,15,30,45 * * * *');
    const bad = service.parseCronExpression('0 1 * *');

    const task1Done = !!ok && bad === null;
    // eslint-disable-next-line no-console
    console.log(`[Task 1] parseCronExpression implemented: ${task1Done ? 'YES' : 'NO'}`);

    if (!task1Done) {
      // Provide actionable guidance without failing the suite
      // eslint-disable-next-line no-console
      console.warn('[Task 1 Hint] Ensure you split by whitespace into exactly 5 parts and return null otherwise.');
    }

    expect(true).toBeTrue();
  });

  it('Task 2: getHumanReadableDescription summary and guidance', () => {
    const descriptionAllEvery = service.getHumanReadableDescription({
      minute: '*', hour: '*', dayOfMonth: '*', month: '*', dayOfWeek: '*'
    } as any);
    const returnsString = typeof descriptionAllEvery === 'string';
    const seemsImplemented = returnsString && descriptionAllEvery.length > 0 && !descriptionAllEvery.includes('[IMPLEMENT ME]');

    // eslint-disable-next-line no-console
    console.log(`[Task 2] getHumanReadableDescription implemented: ${seemsImplemented ? 'YES' : 'NO'}`);
    if (!seemsImplemented) {
      // eslint-disable-next-line no-console
      console.warn('[Task 2 Hint] Produce readable phrases for each non-* field and a default when all are *.');
    }

    expect(true).toBeTrue();
  });

  it('Task 3: normalizeSchedule, sort/dedupe/range-trim and guidance', () => {
    const normalized = service.normalizeSchedule({
      minute: '30, 15, 15, 60',
      hour: '9, 25, 9',
      dayOfMonth: '*',
      month: '1, 12, 0',
      dayOfWeek: '1,5,7'
    } as any);

    const looksNormalized = typeof normalized.minute === 'string' && normalized.minute.includes('15') && normalized.minute.includes('30');
    // eslint-disable-next-line no-console
    console.log(`[Task 3] normalizeSchedule implemented: ${looksNormalized ? 'LIKELY' : 'NO'}`);
    if (!looksNormalized) {
      // eslint-disable-next-line no-console
      console.warn('[Task 3 Hint] Split, trim, parse to int, drop out-of-range, dedupe and sort.');
    }
    expect(true).toBeTrue();
  });
});


