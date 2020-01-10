/**
* Weekend day Constraint (D)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a day of month (date) constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.weekendDay = later.WED = {

  /**
  * The name of this constraint.
  */
  name: 'weekendDay',

  /**
  * The rough amount of seconds between start and end for this constraint.
  * (doesn't need to be exact)
  */
  range: 86400,

  /**
  * The weekend day value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function (d) {
    if (d.WED)
      return d.WED;

    var weekendDaysInMonth = later.WED.weekendDaysInMonth(d),
      day = later.date.getDate.call(d);
    return (d.WED = weekendDaysInMonth.map[day].value + 1);
  },

  weekendDaysInMonth: function (d) {
    return d.weekendDaysInMonth || (d.weekendDaysInMonth = later.date.weekendDaysInMonth(d));
  },

  /**
  * Returns true if the val is valid for the date specified.
  *
  * @param {Date} d: The date to check the value on
  * @param {Integer} val: The value to validate
  */
  isValid: function (d, val) {
    if (later.WED.val(d) === (val || later.WED.extent(d)[1])) {
      var weekendDaysInMonth = later.WED.weekendDaysInMonth(d),
        day = later.date.getDate.call(d);
      return weekendDaysInMonth.map[day].valid;
    }
    return false;
  },

  /**
  * The minimum and maximum valid weekend day values of the month specified.
  * Zero to specify the last weekend day of the month.
  *
  * @param {Date} d: The date indicating the month to find the extent of
  */
  extent: function (d) {
    if (d.WDExtent)
      return d.WDExtent;

    var weekendDaysInMonth = later.WED.weekendDaysInMonth(d);
    return (d.WDExtent = [1, weekendDaysInMonth.values.length]);
  },

  /**
  * The start of the weekend day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function (d) {
    return d.WDStart || (d.WDStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * The end of the weekend day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function (d) {
    return d.WDEnd || (d.WDEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * Returns the start of the next instance of the weekend day value indicated. Returns
  * the first weekend day of the next month if val is greater than the number of
  * days in the following month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function (d, val) {
    var DMax = later.WED.extent(d)[1];
    val = val > DMax ? 1 : val;

    var weekendDaysInMonth = later.WED.weekendDaysInMonth(d),
      day = weekendDaysInMonth.values[(val || DMax) - 1],
      month = later.date.nextRollover(d, day, later.D, later.M);
    DMax = later.WED.extent(month)[1];

    val = val > DMax ? 1 : val || DMax;
    weekendDaysInMonth = later.WED.weekendDaysInMonth(month);
    day = weekendDaysInMonth.values[val - 1];

    return later.date.next(
      later.Y.val(month),
      later.M.val(month),
      day
    );
  },

  /**
  * Returns the end of the previous instance of the weekend day value indicated. Returns
  * the last weekend day in the previous month if val is greater than the number of days
  * in the previous month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function (d, val) {
    var weekendDaysInMonth = later.WD.weekendDaysInMonth(d),
      day = weekendDaysInMonth.values[(val || DMax) - 1],
      month = later.date.prevRollover(d, day, later.D, later.M),
      DMax = later.WD.extent(month)[1];

    val = val > DMax ? DMax : val || DMax;
    weekendDaysInMonth = later.WD.weekendDaysInMonth(month);
    day = weekendDaysInMonth.values[val - 1];

    return later.date.prev(
      later.Y.val(month),
      later.M.val(month),
      day
    );
  }

};