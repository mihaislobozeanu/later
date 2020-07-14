/**
* Day Extended Constraint (DX)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a day with no constraint(week, month or year) type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.dayEx = later.DX = {

  rangeStart: new Date(2015, 0, 1),
  rangeEnd: new Date(2050, 0, 1),


  /**
  * The name of this constraint.
  */
  name: 'dayEx',

  /**
  * The rough amount of seconds between start and end for this constraint.
  * (doesn't need to be exact)
  */
  range: 86400,

  /**
  * The day value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function (d) {
    return d.DX || (d.DX = later.date.diffInDays(later.DX.rangeStart, d));//Math.floor(d.getTime() / later.DAY) - Math.floor(later.DX.rangeStart.getTime() / later.DAY)); //Math.floor((d.getTime() - later.DX.rangeStart.getTime()) / later.DAY));
  },

  /**
  * Returns true if the val is valid for the date specified.
  *
  * @param {Date} d: The date to check the value on
  * @param {Integer} val: The value to validate
  */
  isValid: function (d, val) {
    return later.DX.val(d) === (val || later.DX.extent(d)[1]);
  },

  /**
  * The minimum and maximum valid day values.
  *
  * @param {Date} d: The date to find the extent of
  */
  extent: function (d) {
    if (d.DXExtent)
      return d.DXExtent;
    var end = Math.floor(later.DX.rangeEnd.getTime() / later.DAY) - Math.floor(later.DX.rangeStart.getTime() / later.DAY);
    return (d.DXExtent = [1, end]);
  },

  /**
  * The start of the day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function (d) {
    return d.DXStart || (d.DXStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * The end of the day of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function (d) {
    return d.DXEnd || (d.DXEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
  },

  /**
  * Returns the start of the next instance of the day value indicated. 
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function (d, val) {
    return new Date(later.DX.rangeStart.getTime() + val * later.DAY);
  },

  /**
  * Returns the end of the previous instance of the day value indicated. Returns
  * the last day in the previous month if val is greater than the number of days
  * in the previous month.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function (d, val) {
    return new Date(later.DX.rangeStart.getTime() + val * later.DAY);
  }

};