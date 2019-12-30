/**
* Month Constraint (M)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a month with no year constraint type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.monthEx = later.MX = {

  /**
  * The name of this constraint.
  */
  name: 'monthEx',

  /**
  * The rough amount of seconds between start and end for this constraint.
  * (doesn't need to be exact)
  */
  range: 2629740,

  /**
  * The month value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function (d) {
    return d.MX || (d.MX = later.date.diffInMonths(later.wy.start(later.DX.rangeStart), later.wy.start(d)));
  },

  /**
  * Returns true if the val is valid for the date specified.
  *
  * @param {Date} d: The date to check the value on
  * @param {Integer} val: The value to validate
  */
  isValid: function (d, val) {
    return later.MX.val(d) === (val || later.MX.extent(d)[1]);
  },

  /**
  * The minimum and maximum valid month values. 
  */
  extent: function (d) {
    if (d.MXExtent)
      return d.MXExtent;
    var end = later.date.diffInMonths(later.wy.start(later.DX.rangeStart), later.wy.start(later.DX.rangeEnd));
    return (d.MXExtent = [1, end]);
  },

  /**
  * The start of the month of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function (d) {
    return d.MXStart || (d.MXStart = later.date.next(later.Y.val(d), later.M.val(d)));
  },

  /**
  * The end of the month of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function (d) {
    return d.MXEnd || (d.MXEnd = later.date.prev(later.Y.val(d), later.M.val(d)));
  },

  /**
  * Returns the start of the next instance of the month value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function (d, val) {
    var result = new Date(later.wy.start(later.DX.rangeStart));
    result.setMonth(result.getMonth() + val);
    return result;
  },

  /**
  * Returns the end of the previous instance of the month value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function (d, val) {
    val = val > 12 ? 12 : val || 12;

    return later.date.prev(
      later.Y.val(d) - (val >= later.M.val(d) ? 1 : 0),
      val);
  }

};