/**
* Week of Year Constraint (wy)
* (c) 2013 Bill, BunKat LLC.
*
* Definition for a week with no constraint (month, year) type.
*
* Later is freely distributable under the MIT license.
* For all details and documentation:
*     http://github.com/bunkat/later
*/
later.weekEx = later.WX = {

  /**
  * The name of this constraint.
  */
  name: 'weekEx',

  /**
  * The rough amount of seconds between start and end for this constraint.
  * (doesn't need to be exact)
  */
  range: 604800,

  /**
  * The ISO week year value of the specified date.
  *
  * @param {Date} d: The date to calculate the value of
  */
  val: function (d) {
    if (d.WX)
      return d.WX;

    return d.WX = Math.ceil(later.date.diffInDays(later.wy.start(later.DX.rangeStart), d) / 7);
  },

  /**
  * Returns true if the val is valid for the date specified.
  *
  * @param {Date} d: The date to check the value on
  * @param {Integer} val: The value to validate
  */
  isValid: function (d, val) {
    return later.WX.val(d) === (val || later.WX.extent(d)[1]);
  },

  /**
  * The minimum and maximum valid ISO week values for the year indicated.
  *
  * @param {Date} d: The date indicating the year to find ISO values for
  */
  extent: function (d) {
    if (d.WXExtent)
      return d.WXExtent;
    var end = Math.floor(later.date.diffInDays(later.wy.start(later.DX.rangeStart), later.wy.start(later.DX.rangeEnd)) / 7);
    return (d.WXExtent = [1, end]);
  },

  /**
  * The start of the ISO week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  start: function (d) {
    return d.WXStart || (d.WXStart = later.date.next(
      later.Y.val(d),
      later.M.val(d),
      // jump to the Monday of the current week
      later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)
    ));
  },

  /**
  * The end of the ISO week of the specified date.
  *
  * @param {Date} d: The specified date
  */
  end: function (d) {
    return d.WXEnd || (d.WXEnd = later.date.prev(
      later.Y.val(d),
      later.M.val(d),
      // jump to the Saturday of the current week
      later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)
    ));
  },

  /**
  * Returns the start of the next instance of the ISO week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  next: function (d, val) {
    return new Date(later.wy.start(later.DX.rangeStart).getTime() + val * later.WEEK);
  },

  /**
  * Returns the end of the previous instance of the ISO week value indicated.
  *
  * @param {Date} d: The starting date
  * @param {int} val: The desired value, must be within extent
  */
  prev: function (d, val) {
    return new Date(later.wy.start(later.DX.rangeStart).getTime() + val * later.WEEK);
  }
};