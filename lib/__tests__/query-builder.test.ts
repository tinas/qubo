import { QueryBuilder } from '../query-builder';

describe('QueryBuilder', () => {
  let builder: QueryBuilder<any>;

  beforeEach(() => {
    builder = new QueryBuilder<any>();
  });

  describe('basic operations', () => {
    it('should build an empty query', () => {
      expect(builder.build()).toEqual({});
    });

    it('should set field and value', () => {
      builder.field('name').value('John');
      expect(builder.build()).toEqual({ name: 'John' });
    });

    it('should throw error when setting value without field', () => {
      expect(() => builder.value('John')).toThrow('Field must be set before value');
    });
  });

  describe('comparison operators', () => {
    it('should build eq query', () => {
      builder.eq('age', 25);
      expect(builder.build()).toEqual({ age: { $eq: 25 } });
    });

    it('should build gt query', () => {
      builder.gt('age', 25);
      expect(builder.build()).toEqual({ age: { $gt: 25 } });
    });

    it('should build gte query', () => {
      builder.gte('age', 25);
      expect(builder.build()).toEqual({ age: { $gte: 25 } });
    });

    it('should build lt query', () => {
      builder.lt('age', 25);
      expect(builder.build()).toEqual({ age: { $lt: 25 } });
    });

    it('should build lte query', () => {
      builder.lte('age', 25);
      expect(builder.build()).toEqual({ age: { $lte: 25 } });
    });

    it('should build ne query', () => {
      builder.ne('age', 25);
      expect(builder.build()).toEqual({ age: { $ne: 25 } });
    });

    it('should build in query', () => {
      builder.in('age', [25, 30, 35]);
      expect(builder.build()).toEqual({ age: { $in: [25, 30, 35] } });
    });

    it('should build nin query', () => {
      builder.nin('age', [25, 30, 35]);
      expect(builder.build()).toEqual({ age: { $nin: [25, 30, 35] } });
    });
  });

  describe('logical operators', () => {
    it('should build and query', () => {
      const query1 = { name: 'John' };
      const query2 = { age: { $gt: 25 } };
      builder.and([query1, query2]);
      expect(builder.build()).toEqual({ $and: [query1, query2] });
    });

    it('should build or query', () => {
      const query1 = { name: 'John' };
      const query2 = { age: { $gt: 25 } };
      builder.or([query1, query2]);
      expect(builder.build()).toEqual({ $or: [query1, query2] });
    });

    it('should build not query', () => {
      const query = { name: 'John' };
      builder.not(query);
      expect(builder.build()).toEqual({ $not: [query] });
    });
  });

  describe('complex queries', () => {
    it('should build complex query with multiple operators', () => {
      builder
        .eq('name', 'John')
        .gt('age', 25)
        .in('roles', ['admin', 'user']);
      
      expect(builder.build()).toEqual({
        name: { $eq: 'John' },
        age: { $gt: 25 },
        roles: { $in: ['admin', 'user'] }
      });
    });

    it('should build complex query with nested logical operators', () => {
      const query1 = { name: 'John' };
      const query2 = { age: { $gt: 25 } };
      const query3 = { roles: { $in: ['admin'] } };
      
      builder.and([
        query1,
        { $or: [query2, query3] }
      ]);
      
      expect(builder.build()).toEqual({
        $and: [
          query1,
          { $or: [query2, query3] }
        ]
      });
    });
  });

  describe('date handling', () => {
    it('should handle date values in comparison operators', () => {
      const date = new Date('2024-01-25');
      
      builder
        .gt('createdAt', date)
        .lt('updatedAt', date);
      
      expect(builder.build()).toEqual({
        createdAt: { $gt: date },
        updatedAt: { $lt: date }
      });
    });
  });

  describe('type safety', () => {
    interface User {
      id: number;
      name: string;
      age: number;
    }

    it('should handle typed fields', () => {
      const typedBuilder = new QueryBuilder<User>();
      typedBuilder.field('name').value('John');
      expect(typedBuilder.build()).toEqual({ name: 'John' });
    });
  });
}); 