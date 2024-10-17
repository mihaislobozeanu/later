/**
* Weekday Constraint (D)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a weekday of month (date) constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.weekday = later.WD = {

  /**
  * The name of this constraint.
  */
  name: 'weekday',

  /**
  * The rough amount of seconds between start and end for this constraint.
  * (doesn't need to be exact)
  */
  range: 86400,

  /**
  * The weekday value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function (d) {
    if (d.WD)
      return d.WD;

    const weekdaysInMonth = later.WD.weekdaysInMonth(d),
      day = later.date.getDate.call(d);
    return (d.WD = weekdaysInMonth.map[day].value + 1);
  },

  weekdaysInMonth: function (d) {
    return d.weekdaysInMonth || (d.weekdaysInMonth = later.date.weekdaysInMonth(d));
  },

  /**
  * Returns true if the val is valid for the date specified.
  *
  * @param {Date} d: The date to check the value on
  * @param {Integer} val: The value to validate
  */
  isValid: function (d, val) {
    if (later.WD.val(d) === (val || later.WD.extent(d)[1])) {
      const weekdaysInMonth = later.WD.weekdaysInMonth(d),
        day = later.date.getDate.call(d);
      return weekdaysInMonth.map[day].valid;
    }
    return false;
  },

  /**
  * The minimum and maximum valid weekday values of the month specified.
  * Zero to specify the last weekday of the month.
  *
  * @param {Date} d: The date indicating the month to find the extent of
  */
  extent: function (d) {
    if (d.WDExtent)
      return d.WDExtent;

    const weekdaysInMonth = later.WD.weekdaysInMonth(d);
    return (d.WDExtent = [1, weekdaysInMonth.values.length]);
  },

  /**
  * The start of the weekday of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function (d) {
    return d.WDStart || (d.WDStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * The end of the weekday of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function (d) {
    return d.WDEnd || (d.WDEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * Returns the start of the next instance of the weekday value indicated. Returns
  * the first weekday of the next month if val is greater than the number of
  * days in the following month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function (d, val) {
    let DMax = later.WD.extent(d)[1];
    val = val > DMax ? 1 : val;

    let weekdaysInMonth = later.WD.weekdaysInMonth(d);
    let day = weekdaysInMonth.values[(val || DMax) - 1];
    const month = later.date.nextRollover(d, day, later.D, later.M);
    DMax = later.WD.extent(month)[1];

    val = val > DMax ? 1 : val || DMax;
    weekdaysInMonth = later.WD.weekdaysInMonth(month);
    day = weekdaysInMonth.values[val - 1];

    return later.date.next(
      later.Y.val(month),
      later.M.val(month),
      day
    );
  },

  /**
  * Returns the end of the previous instance of the weekday value indicated. Returns
  * the last weekday in the previous month if val is greater than the number of days
  * in the previous month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function (d, val) {
    let weekdaysInMonth = later.WD.weekdaysInMonth(d),
      day = weekdaysInMonth.values[(val || DMax) - 1];
    const month = later.date.prevRollover(d, day, later.D, later.M);
    var DMax = later.WD.extent(month)[1];

    val = val > DMax ? DMax : val || DMax;
    weekdaysInMonth = later.WD.weekdaysInMonth(month);
    day = weekdaysInMonth.values[val - 1];

    return later.date.prev(
      later.Y.val(month),
      later.M.val(month),
      day
    );
  }

};