import { dateOperators } from '..';
import { DateWithinOperator } from '../date-within.operator';
import { DateBetweenOperator } from '../date-between.operator';
import { DateAfterOperator } from '../date-after.operator';
import { DateBeforeOperator } from '../date-before.operator';
import { SameDayOperator } from '../same-day.operator';

describe('Date operators index', () => {
  it('should export all date operators with correct keys', () => {
    expect(dateOperators.size).toBe(5);
    
    expect(dateOperators.get('$dateWithin')).toBeInstanceOf(DateWithinOperator);
    expect(dateOperators.get('$dateBetween')).toBeInstanceOf(DateBetweenOperator);
    expect(dateOperators.get('$dateAfter')).toBeInstanceOf(DateAfterOperator);
    expect(dateOperators.get('$dateBefore')).toBeInstanceOf(DateBeforeOperator);
    expect(dateOperators.get('$sameDay')).toBeInstanceOf(SameDayOperator);
  });

  it('should export all operator classes', () => {
    expect(DateWithinOperator).toBeDefined();
    expect(DateBetweenOperator).toBeDefined();
    expect(DateAfterOperator).toBeDefined();
    expect(DateBeforeOperator).toBeDefined();
    expect(SameDayOperator).toBeDefined();
  });
}); 