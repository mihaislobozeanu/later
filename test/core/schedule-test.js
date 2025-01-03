const later = require('../../index'),
    schedule = later.schedule,
    should = require('should');

describe('Schedule', function() {
  later.date.UTC();

  describe('isValid', function() {
    const d = new Date('2013-03-21T00:00:05Z');

    it('should return true if date is valid', function() {
      const s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).isValid(d).should.eql(true);
    });

    it('should return false if date is invalid', function() {
      const s = {schedules: [{Y:[2012]}]};
      schedule(s).isValid(d).should.eql(false);
    });

  });

  describe('next', function() {
    const d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return the start date if it is valid', function() {
      const s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).next(1, d).should.eql(d);
    });

    it('should return next valid date if one exists', function() {
      const s = {schedules: [{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with composite', function() {
      const s = {schedules: [{Y:[2017]},{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2015-01-01T00:00:00Z'));
    });

    it('should return next valid date if one exists with exceptions', function() {
      const s = {schedules: [{Y:[2015,2016,2017]}], exceptions: [{Y:[2015]}]};
      schedule(s).next(1, d).should.eql(new Date('2016-01-01T00:00:00Z'));
    });

    it('should return count valid dates if they exist', function() {
      const s = {schedules: [{Y:[2015,2016,2017]}]};
      schedule(s).next(3, d).should.eql([
        new Date('2015-01-01T00:00:00Z'),
        new Date('2016-01-01T00:00:00Z'),
        new Date('2017-01-01T00:00:00Z')
        ]);
    });

    it('should return later.NEVER if no next valid date exists', function() {
      const s = {schedules: [{Y:[2012]}]};
      should.equal(schedule(s).next(1, d), later.NEVER);
    });

    it('should return later.NEVER if end date precludes a valid schedule', function() {
      const s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).next(1, d, e), later.NEVER);
    });

    it('should return next schedule if previous schedule has next date later.NEVER', function () {
      const d = new Date('2013-03-21T00:00:05Z');
      const s = { schedules: [{ Y: [2012] }, { Y: [2017] }] };
      schedule(s).next(1, d).should.eql(new Date('2017-01-01T00:00:00Z'));
    });

    it('should return next three (3) valid dates from a composite schedule', function () {
      const nextYear = (new Date()).getFullYear() + 1;
      const expectingDates = [
        new Date(`${nextYear}-02-01T18:30:00Z`),
        new Date(`${nextYear}-02-02T17:30:00Z`),
        new Date(`${nextYear + 1}-02-01T18:30:00Z`)
      ];
      const s = {
        schedules: [
          { s: [0], m: [30], h: [18], D: [1], M: [2] },
          { s: [0], m: [30], h: [17], D: [2], M: [2], Y: [nextYear] }
        ],
        exceptions: []
      };
      schedule(s)
        .next(3)
        .should.eql(expectingDates);
    });

    it('should return next three (3) valid dates from a composite schedule', function () {
      const nextYear = (new Date()).getFullYear() + 1;
      const expectingDates = [
        new Date(`${nextYear}-01-01T18:30:00Z`),
        new Date(`${nextYear}-02-02T17:30:00Z`),
        new Date(`${nextYear + 1}-01-01T18:30:00Z`)
      ];
      const s = {
        schedules: [
          { s: [0], m: [30], h: [17], D: [2], M: [2], Y: [nextYear] },
          { s: [0], m: [30], h: [18], D: [1], M: [1] }
        ],
        exceptions: []
      };
      schedule(s)
        .next(3)
        .should.eql(expectingDates);
    });
  });

  describe('prev', function() {
    const d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2010-01-01T00:00:05Z');

    it('should return the start date if it is valid', function() {
      const s = {schedules: [{Y:[2013], M:[3], D:[21], s:[5]}]};
      schedule(s).prev(1,d).should.eql(d);
    });

    it('should return prev valid date if one exists', function() {
      const s = {schedules: [{Y:[2012]}]};
      schedule(s).prev(1,d).should.eql(new Date('2012-01-01T00:00:00Z'));
    });

    it('should return prev valid date if one exists with exceptions', function() {
      const s = {schedules: [{Y:[2012,2013,2014]}], exceptions: [{Y:[2013]}]};
      schedule(s).prev(1,d).should.eql(new Date('2012-01-01T00:00:00Z'));
    });

    it('should return count valid dates if they exist', function() {
      const s = {schedules: [{Y:[2010, 2011,2012]}]};
      schedule(s).prev(3,d).should.eql([
        new Date('2012-01-01T00:00:00Z'),
        new Date('2011-01-01T00:00:00Z'),
        new Date('2010-01-01T00:00:00Z')
        ]);
    });

    it('should return later.NEVER if no prev valid date exists', function() {
      const s = {schedules: [{Y:[2017]}]};
      should.equal(schedule(s).prev(1,d), later.NEVER);
    });

    it('should return later.NEVER if end date precludes a valid schedule', function() {
      const s = {schedules: [{Y:[2009]}]};
      should.equal(schedule(s).prev(1,d, e), later.NEVER);
    });

  });

  describe('nextRange', function() {
    it('should return next valid range if one exists', function() {
      const d = new Date('2013-03-21T00:00:05Z'),
          e = new Date('2016-01-01T00:00:05Z');

      const s = {schedules: [{Y:[2015,2016,2017]}]};
      schedule(s).nextRange(1, d).should.eql([
        new Date('2015-01-01T00:00:00Z'),
        new Date('2018-01-01T00:00:00Z')
      ]);
    });

    it('should correctly calculate ranges', function() {
      const d = new Date('2013-03-21T00:00:05Z');

      const s = {
          schedules: [ { dw: [ 2, 3, 4, 5, 6 ], h_a: [ 8 ], h_b: [ 16 ] } ],
          exceptions:
             [ { fd_a: [ 1362420000000 ], fd_b: [ 1362434400000 ] },
               { fd_a: [ 1363852800000 ], fd_b: [ 1363860000000 ] },
               { fd_a: [ 1364499200000 ], fd_b: [ 1364516000000 ] } ]
        };

      schedule(s).nextRange(1, d).should.eql([
        new Date('2013-03-21T10:00:00Z'),
        new Date('2013-03-21T16:00:00Z')
      ]);

    });

    it('should return undefined as end if there is no end date', function() {
      const d = new Date('2013-03-21T00:00:05Z');

      const s = {
          schedules: [ { fd_a: [ 1363824005000 ] } ]
        };

      schedule(s).nextRange(3, d).should.eql([
        [new Date('2013-03-21T00:00:05Z'), undefined]
      ]);
    });

    // issue #27
    it('should merge valid ranges across anded schedule definitions', function() {
      const d = new Date("Sat Sep 28 2013 11:00:00 GMT+0600 (YEKT)");

      const s = later.parse.recur()
        .every().hour().between(0,8).onWeekday()
        .and()
        .onWeekend();

      schedule(s).nextRange(2, d).should.eql([
        [new Date('2013-09-28T05:00:00Z'), new Date('2013-09-30T09:00:00Z')],
        [new Date('2013-10-01T00:00:00Z'), new Date('2013-10-01T09:00:00Z')]
      ]);
    });
  });

  describe('prevRange', function() {
    const d = new Date('2013-03-21T00:00:05Z'),
        e = new Date('2016-01-01T00:00:05Z');

    it('should return next valid range if one exists', function() {
      const s = {schedules: [{Y:[2011,2012]}]};
      schedule(s).prevRange(1, d).should.eql([
        new Date('2011-01-01T00:00:00Z'),
        new Date('2013-01-01T00:00:00Z')
      ]);
    });

    it('should return undefined as end if there is no end date', function() {
      const d = new Date('2013-03-21T00:00:05Z');

      const s = {
          schedules: [ { fd_b: [ 1363824005000 ] } ]
        };

      schedule(s).prevRange(3, d).should.eql([
        [undefined, new Date('2013-03-21T00:00:05Z')]
      ]);
    });

    // issue #27
    it('should merge valid ranges across anded schedule definitions', function() {
      const d = new Date("2013-09-30T09:00:00Z");

      const s = later.parse.recur()
        .every().hour().between(0,8).onWeekday()
        .and()
        .onWeekend();

      schedule(s).prevRange(2, d).should.eql([
        [new Date('2013-09-28T00:00:00Z'), new Date('2013-09-30T09:00:00Z')],
        [new Date('2013-09-27T00:00:00Z'), new Date('2013-09-27T09:00:00Z')]
      ]);
    });
  });

});