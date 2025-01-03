later = function() {
  "use strict";
  const later = {
    version: "1.0.0"
  };
  if (!Array.prototype.indexOf) {
    Array.prototype.indexOf = function(searchElement) {
      "use strict";
      if (this == null) {
        throw new TypeError();
      }
      const t = Object(this);
      const len = t.length >>> 0;
      if (len === 0) {
        return -1;
      }
      let n = 0;
      if (arguments.length > 1) {
        n = Number(arguments[1]);
        if (n != n) {
          n = 0;
        } else if (n != 0 && n != Infinity && n != -Infinity) {
          n = (n > 0 || -1) * Math.floor(Math.abs(n));
        }
      }
      if (n >= len) {
        return -1;
      }
      let k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
      for (;k < len; k++) {
        if (k in t && t[k] === searchElement) {
          return k;
        }
      }
      return -1;
    };
  }
  if (!String.prototype.trim) {
    String.prototype.trim = function() {
      return this.replace(/^\s+|\s+$/g, "");
    };
  }
  later.array = {};
  later.array.sort = function(arr, zeroIsLast) {
    arr.sort(function(a, b) {
      return +a - +b;
    });
    if (zeroIsLast && arr[0] === 0) {
      arr.push(arr.shift());
    }
  };
  later.array.next = function(val, values, extent) {
    let cur, nextIdx = 0;
    const zeroIsLargest = extent[0] !== 0;
    for (let i = values.length - 1; i > -1; --i) {
      cur = values[i];
      if (cur === val) {
        return cur;
      }
      if (cur > val || cur === 0 && zeroIsLargest && extent[1] > val) {
        nextIdx = i;
        continue;
      }
      break;
    }
    return values[nextIdx];
  };
  later.array.nextInvalid = function(val, values, extent) {
    const min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0;
    let next = val;
    let i = values.indexOf(val);
    const start = next;
    while (next === (values[i] || zeroVal)) {
      next++;
      if (next > max) {
        next = min;
      }
      i++;
      if (i === len) {
        i = 0;
      }
      if (next === start) {
        return undefined;
      }
    }
    return next;
  };
  later.array.prev = function(val, values, extent) {
    let cur;
    const len = values.length, zeroIsLargest = extent[0] !== 0;
    let prevIdx = len - 1;
    for (let i = 0; i < len; i++) {
      cur = values[i];
      if (cur === val) {
        return cur;
      }
      if (cur < val || cur === 0 && zeroIsLargest && extent[1] < val) {
        prevIdx = i;
        continue;
      }
      break;
    }
    return values[prevIdx];
  };
  later.array.prevInvalid = function(val, values, extent) {
    const min = extent[0], max = extent[1], len = values.length, zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0;
    let next = val;
    let i = values.indexOf(val);
    const start = next;
    while (next === (values[i] || zeroVal)) {
      next--;
      if (next < min) {
        next = max;
      }
      i--;
      if (i === -1) {
        i = len - 1;
      }
      if (next === start) {
        return undefined;
      }
    }
    return next;
  };
  later.day = later.D = {
    name: "day",
    range: 86400,
    val: function(d) {
      return d.D || (d.D = later.date.getDate.call(d));
    },
    isValid: function(d, val) {
      return later.D.val(d) === (val || later.D.extent(d)[1]);
    },
    extent: function(d) {
      if (d.DExtent) return d.DExtent;
      const month = later.M.val(d);
      let max = later.DAYS_IN_MONTH[month - 1];
      if (month === 2 && later.dy.extent(d)[1] === 366) {
        max = max + 1;
      }
      return d.DExtent = [ 1, max ];
    },
    start: function(d) {
      return d.DStart || (d.DStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    end: function(d) {
      return d.DEnd || (d.DEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    next: function(d, val) {
      val = val > later.D.extent(d)[1] ? 1 : val;
      const month = later.date.nextRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
      val = val > DMax ? 1 : val || DMax;
      return later.date.next(later.Y.val(month), later.M.val(month), val);
    },
    prev: function(d, val) {
      const month = later.date.prevRollover(d, val, later.D, later.M), DMax = later.D.extent(month)[1];
      return later.date.prev(later.Y.val(month), later.M.val(month), val > DMax ? DMax : val || DMax);
    }
  };
  later.dayEx = later.DX = {
    rangeStart: new Date(2015, 0, 1),
    rangeEnd: new Date(2050, 0, 1),
    name: "dayEx",
    range: 86400,
    val: function(d) {
      return d.DX || (d.DX = later.date.diffInDays(later.DX.rangeStart, d));
    },
    isValid: function(d, val) {
      return later.DX.val(d) === (val || later.DX.extent(d)[1]);
    },
    extent: function(d) {
      if (d.DXExtent) return d.DXExtent;
      var end = Math.floor(later.DX.rangeEnd.getTime() / later.DAY) - Math.floor(later.DX.rangeStart.getTime() / later.DAY);
      return d.DXExtent = [ 1, end ];
    },
    start: function(d) {
      return d.DXStart || (d.DXStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    end: function(d) {
      return d.DXEnd || (d.DXEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    next: function(d, val) {
      return new Date(later.DX.rangeStart.getTime() + val * later.DAY);
    },
    prev: function(d, val) {
      return new Date(later.DX.rangeStart.getTime() + val * later.DAY);
    }
  };
  later.weekday = later.WD = {
    name: "weekday",
    range: 86400,
    val: function(d) {
      if (d.WD) return d.WD;
      const weekdaysInMonth = later.WD.weekdaysInMonth(d), day = later.date.getDate.call(d);
      return d.WD = weekdaysInMonth.map[day].value + 1;
    },
    weekdaysInMonth: function(d) {
      return d.weekdaysInMonth || (d.weekdaysInMonth = later.date.weekdaysInMonth(d));
    },
    isValid: function(d, val) {
      if (later.WD.val(d) === (val || later.WD.extent(d)[1])) {
        const weekdaysInMonth = later.WD.weekdaysInMonth(d), day = later.date.getDate.call(d);
        return weekdaysInMonth.map[day].valid;
      }
      return false;
    },
    extent: function(d) {
      if (d.WDExtent) return d.WDExtent;
      const weekdaysInMonth = later.WD.weekdaysInMonth(d);
      return d.WDExtent = [ 1, weekdaysInMonth.values.length ];
    },
    start: function(d) {
      return d.WDStart || (d.WDStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    end: function(d) {
      return d.WDEnd || (d.WDEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    next: function(d, val) {
      let DMax = later.WD.extent(d)[1];
      val = val > DMax ? 1 : val;
      let weekdaysInMonth = later.WD.weekdaysInMonth(d);
      let day = weekdaysInMonth.values[(val || DMax) - 1];
      const month = later.date.nextRollover(d, day, later.D, later.M);
      DMax = later.WD.extent(month)[1];
      val = val > DMax ? 1 : val || DMax;
      weekdaysInMonth = later.WD.weekdaysInMonth(month);
      day = weekdaysInMonth.values[val - 1];
      return later.date.next(later.Y.val(month), later.M.val(month), day);
    },
    prev: function(d, val) {
      let weekdaysInMonth = later.WD.weekdaysInMonth(d), day = weekdaysInMonth.values[(val || DMax) - 1];
      const month = later.date.prevRollover(d, day, later.D, later.M);
      var DMax = later.WD.extent(month)[1];
      val = val > DMax ? DMax : val || DMax;
      weekdaysInMonth = later.WD.weekdaysInMonth(month);
      day = weekdaysInMonth.values[val - 1];
      return later.date.prev(later.Y.val(month), later.M.val(month), day);
    }
  };
  later.weekendDay = later.WED = {
    name: "weekendDay",
    range: 86400,
    val: function(d) {
      if (d.WED) return d.WED;
      const weekendDaysInMonth = later.WED.weekendDaysInMonth(d), day = later.date.getDate.call(d);
      return d.WED = weekendDaysInMonth.map[day].value + 1;
    },
    weekendDaysInMonth: function(d) {
      return d.weekendDaysInMonth || (d.weekendDaysInMonth = later.date.weekendDaysInMonth(d));
    },
    isValid: function(d, val) {
      if (later.WED.val(d) === (val || later.WED.extent(d)[1])) {
        const weekendDaysInMonth = later.WED.weekendDaysInMonth(d), day = later.date.getDate.call(d);
        return weekendDaysInMonth.map[day].valid;
      }
      return false;
    },
    extent: function(d) {
      if (d.WDExtent) return d.WDExtent;
      const weekendDaysInMonth = later.WED.weekendDaysInMonth(d);
      return d.WDExtent = [ 1, weekendDaysInMonth.values.length ];
    },
    start: function(d) {
      return d.WDStart || (d.WDStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    end: function(d) {
      return d.WDEnd || (d.WDEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d)));
    },
    next: function(d, val) {
      let DMax = later.WED.extent(d)[1];
      val = val > DMax ? 1 : val;
      let weekendDaysInMonth = later.WED.weekendDaysInMonth(d), day = weekendDaysInMonth.values[(val || DMax) - 1];
      const month = later.date.nextRollover(d, day, later.D, later.M);
      DMax = later.WED.extent(month)[1];
      val = val > DMax ? 1 : val || DMax;
      weekendDaysInMonth = later.WED.weekendDaysInMonth(month);
      day = weekendDaysInMonth.values[val - 1];
      return later.date.next(later.Y.val(month), later.M.val(month), day);
    },
    prev: function(d, val) {
      let weekendDaysInMonth = later.WD.weekendDaysInMonth(d), day = weekendDaysInMonth.values[(val || DMax) - 1];
      const month = later.date.prevRollover(d, day, later.D, later.M);
      var DMax = later.WD.extent(month)[1];
      val = val > DMax ? DMax : val || DMax;
      weekendDaysInMonth = later.WD.weekendDaysInMonth(month);
      day = weekendDaysInMonth.values[val - 1];
      return later.date.prev(later.Y.val(month), later.M.val(month), day);
    }
  };
  later.dayOfWeekCount = later.dc = {
    name: "day of week count",
    range: 604800,
    val: function(d) {
      return d.dc || (d.dc = Math.floor((later.D.val(d) - 1) / 7) + 1);
    },
    isValid: function(d, val) {
      return later.dc.val(d) === val || val === 0 && later.D.val(d) > later.D.extent(d)[1] - 7;
    },
    extent: function(d) {
      return d.dcExtent || (d.dcExtent = [ 1, Math.ceil(later.D.extent(d)[1] / 7) ]);
    },
    start: function(d) {
      return d.dcStart || (d.dcStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(1, (later.dc.val(d) - 1) * 7 + 1 || 1)));
    },
    end: function(d) {
      return d.dcEnd || (d.dcEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.dc.val(d) * 7, later.D.extent(d)[1])));
    },
    next: function(d, val) {
      val = val > later.dc.extent(d)[1] ? 1 : val;
      var month = later.date.nextRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
      val = val > dcMax ? 1 : val;
      var next = later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
      if (next.getTime() <= d.getTime()) {
        month = later.M.next(d, later.M.val(d) + 1);
        return later.date.next(later.Y.val(month), later.M.val(month), val === 0 ? later.D.extent(month)[1] - 6 : 1 + 7 * (val - 1));
      }
      return next;
    },
    prev: function(d, val) {
      var month = later.date.prevRollover(d, val, later.dc, later.M), dcMax = later.dc.extent(month)[1];
      val = val > dcMax ? dcMax : val || dcMax;
      return later.dc.end(later.date.prev(later.Y.val(month), later.M.val(month), 1 + 7 * (val - 1)));
    }
  };
  later.dayOfWeek = later.dw = later.d = {
    name: "day of week",
    range: 86400,
    val: function(d) {
      return d.dw || (d.dw = later.date.getDay.call(d) + 1);
    },
    isValid: function(d, val) {
      return later.dw.val(d) === (val || 7);
    },
    extent: function() {
      return [ 1, 7 ];
    },
    start: function(d) {
      return later.D.start(d);
    },
    end: function(d) {
      return later.D.end(d);
    },
    next: function(d, val) {
      val = val > 7 ? 1 : val || 7;
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val <= later.dw.val(d) ? 7 : 0));
    },
    prev: function(d, val) {
      val = val > 7 ? 7 : val || 7;
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val - later.dw.val(d)) + (val >= later.dw.val(d) ? -7 : 0));
    }
  };
  later.dayOfYear = later.dy = {
    name: "day of year",
    range: 86400,
    val: function(d) {
      return d.dy || (d.dy = Math.ceil(1 + (later.D.start(d).getTime() - later.Y.start(d).getTime()) / later.DAY));
    },
    isValid: function(d, val) {
      return later.dy.val(d) === (val || later.dy.extent(d)[1]);
    },
    extent: function(d) {
      const year = later.Y.val(d);
      return d.dyExtent || (d.dyExtent = [ 1, year % 4 ? 365 : 366 ]);
    },
    start: function(d) {
      return later.D.start(d);
    },
    end: function(d) {
      return later.D.end(d);
    },
    next: function(d, val) {
      val = val > later.dy.extent(d)[1] ? 1 : val;
      const year = later.date.nextRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
      val = val > dyMax ? 1 : val || dyMax;
      return later.date.next(later.Y.val(year), later.M.val(year), val);
    },
    prev: function(d, val) {
      const year = later.date.prevRollover(d, val, later.dy, later.Y), dyMax = later.dy.extent(year)[1];
      val = val > dyMax ? dyMax : val || dyMax;
      return later.date.prev(later.Y.val(year), later.M.val(year), val);
    }
  };
  later.hour = later.h = {
    name: "hour",
    range: 3600,
    val: function(d) {
      return d.h || (d.h = later.date.getHour.call(d));
    },
    isValid: function(d, val) {
      return later.h.val(d) === val;
    },
    extent: function() {
      return [ 0, 23 ];
    },
    start: function(d) {
      return d.hStart || (d.hStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
    },
    end: function(d) {
      return d.hEnd || (d.hEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d)));
    },
    next: function(d, val) {
      val = val > 23 ? 0 : val;
      let next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.h.val(d) ? 1 : 0), val);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), val + 1);
      }
      return next;
    },
    prev: function(d, val) {
      val = val > 23 ? 23 : val;
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.h.val(d) ? -1 : 0), val);
    }
  };
  later.minute = later.m = {
    name: "minute",
    range: 60,
    val: function(d) {
      return d.m || (d.m = later.date.getMin.call(d));
    },
    isValid: function(d, val) {
      return later.m.val(d) === val;
    },
    extent: function(d) {
      return [ 0, 59 ];
    },
    start: function(d) {
      return d.mStart || (d.mStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },
    end: function(d) {
      return d.mEnd || (d.mEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d)));
    },
    next: function(d, val) {
      const m = later.m.val(d), s = later.s.val(d), inc = val > 59 ? 60 - m : val <= m ? 60 - m + val : val - m;
      let next = new Date(d.getTime() + inc * later.MIN - s * later.SEC);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
        next = new Date(d.getTime() + (inc + 120) * later.MIN - s * later.SEC);
      }
      return next;
    },
    prev: function(d, val) {
      val = val > 59 ? 59 : val;
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d) + (val >= later.m.val(d) ? -1 : 0), val);
    }
  };
  later.month = later.M = {
    name: "month",
    range: 2629740,
    val: function(d) {
      return d.M || (d.M = later.date.getMonth.call(d) + 1);
    },
    isValid: function(d, val) {
      return later.M.val(d) === (val || 12);
    },
    extent: function() {
      return [ 1, 12 ];
    },
    start: function(d) {
      return d.MStart || (d.MStart = later.date.next(later.Y.val(d), later.M.val(d)));
    },
    end: function(d) {
      return d.MEnd || (d.MEnd = later.date.prev(later.Y.val(d), later.M.val(d)));
    },
    next: function(d, val) {
      val = val > 12 ? 1 : val || 12;
      return later.date.next(later.Y.val(d) + (val > later.M.val(d) ? 0 : 1), val);
    },
    prev: function(d, val) {
      val = val > 12 ? 12 : val || 12;
      return later.date.prev(later.Y.val(d) - (val >= later.M.val(d) ? 1 : 0), val);
    }
  };
  later.monthEx = later.MX = {
    name: "monthEx",
    range: 2629740,
    val: function(d) {
      return d.MX || (d.MX = later.date.diffInMonths(later.MX.start(later.DX.rangeStart), later.MX.start(d)));
    },
    isValid: function(d, val) {
      return later.MX.val(d) === (val || later.MX.extent(d)[1]);
    },
    extent: function(d) {
      if (d.MXExtent) return d.MXExtent;
      var end = later.date.diffInMonths(later.MX.start(later.DX.rangeStart), later.MX.start(later.DX.rangeEnd));
      return d.MXExtent = [ 1, end ];
    },
    start: function(d) {
      return d.MXStart || (d.MXStart = later.date.startOfMonth(d));
    },
    end: function(d) {
      return d.MXEnd || (d.MXEnd = later.date.endOfMonth(d));
    },
    next: function(d, val) {
      var result = new Date(later.MX.start(later.DX.rangeStart));
      result.setMonth(result.getMonth() + val);
      return result;
    },
    prev: function(d, val) {
      var result = new Date(later.MX.start(later.DX.rangeStart));
      result.setMonth(result.getMonth() + val);
      result.setTime(result.getTime() - later.SEC);
      return result;
    }
  };
  later.second = later.s = {
    name: "second",
    range: 1,
    val: function(d) {
      return d.s || (d.s = later.date.getSec.call(d));
    },
    isValid: function(d, val) {
      return later.s.val(d) === val;
    },
    extent: function() {
      return [ 0, 59 ];
    },
    start: function(d) {
      return d;
    },
    end: function(d) {
      return d;
    },
    next: function(d, val) {
      const s = later.s.val(d), inc = val > 59 ? 60 - s : val <= s ? 60 - s + val : val - s;
      let next = new Date(d.getTime() + inc * later.SEC);
      if (!later.date.isUTC && next.getTime() <= d.getTime()) {
        next = new Date(d.getTime() + (inc + 7200) * later.SEC);
      }
      return next;
    },
    prev: function(d, val, cache) {
      val = val > 59 ? 59 : val;
      return later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d), later.h.val(d), later.m.val(d) + (val >= later.s.val(d) ? -1 : 0), val);
    }
  };
  later.time = later.t = {
    name: "time",
    range: 1,
    val: function(d) {
      return d.t || (d.t = later.h.val(d) * 3600 + later.m.val(d) * 60 + later.s.val(d));
    },
    isValid: function(d, val) {
      return later.t.val(d) === val;
    },
    extent: function() {
      return [ 0, 86399 ];
    },
    start: function(d) {
      return d;
    },
    end: function(d) {
      return d;
    },
    next: function(d, val) {
      val = val > 86399 ? 0 : val;
      let next = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val <= later.t.val(d) ? 1 : 0), 0, 0, val);
      if (!later.date.isUTC && next.getTime() < d.getTime()) {
        next = later.date.next(later.Y.val(next), later.M.val(next), later.D.val(next), later.h.val(next), later.m.val(next), val + 7200);
      }
      return next;
    },
    prev: function(d, val) {
      val = val > 86399 ? 86399 : val;
      return later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) + (val >= later.t.val(d) ? -1 : 0), 0, 0, val);
    }
  };
  later.weekOfMonth = later.wm = {
    name: "week of month",
    range: 604800,
    val: function(d) {
      return d.wm || (d.wm = (later.D.val(d) + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(d))) / 7);
    },
    isValid: function(d, val) {
      return later.wm.val(d) === (val || later.wm.extent(d)[1]);
    },
    extent: function(d) {
      return d.wmExtent || (d.wmExtent = [ 1, (later.D.extent(d)[1] + (later.dw.val(later.M.start(d)) - 1) + (7 - later.dw.val(later.M.end(d)))) / 7 ]);
    },
    start: function(d) {
      return d.wmStart || (d.wmStart = later.date.next(later.Y.val(d), later.M.val(d), Math.max(later.D.val(d) - later.dw.val(d) + 1, 1)));
    },
    end: function(d) {
      return d.wmEnd || (d.wmEnd = later.date.prev(later.Y.val(d), later.M.val(d), Math.min(later.D.val(d) + (7 - later.dw.val(d)), later.D.extent(d)[1])));
    },
    next: function(d, val) {
      val = val > later.wm.extent(d)[1] ? 1 : val;
      const month = later.date.nextRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
      val = val > wmMax ? 1 : val || wmMax;
      return later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2)));
    },
    prev: function(d, val) {
      const month = later.date.prevRollover(d, val, later.wm, later.M), wmMax = later.wm.extent(month)[1];
      val = val > wmMax ? wmMax : val || wmMax;
      return later.wm.end(later.date.next(later.Y.val(month), later.M.val(month), Math.max(1, (val - 1) * 7 - (later.dw.val(month) - 2))));
    }
  };
  later.weekOfYear = later.wy = {
    name: "week of year (ISO)",
    range: 604800,
    val: function(d) {
      if (d.wy) return d.wy;
      const wThur = later.dw.next(later.wy.start(d), 5), YThur = later.dw.next(later.Y.prev(wThur, later.Y.val(wThur) - 1), 5);
      return d.wy = 1 + Math.ceil((wThur.getTime() - YThur.getTime()) / later.WEEK);
    },
    isValid: function(d, val) {
      return later.wy.val(d) === (val || later.wy.extent(d)[1]);
    },
    extent: function(d) {
      if (d.wyExtent) return d.wyExtent;
      const year = later.dw.next(later.wy.start(d), 5), dwFirst = later.dw.val(later.Y.start(year)), dwLast = later.dw.val(later.Y.end(year));
      return d.wyExtent = [ 1, dwFirst === 5 || dwLast === 5 ? 53 : 52 ];
    },
    start: function(d) {
      return d.wyStart || (d.wyStart = later.date.next(later.Y.val(d), later.M.val(d), later.D.val(d) - (later.dw.val(d) > 1 ? later.dw.val(d) - 2 : 6)));
    },
    end: function(d) {
      return d.wyEnd || (d.wyEnd = later.date.prev(later.Y.val(d), later.M.val(d), later.D.val(d) + (later.dw.val(d) > 1 ? 8 - later.dw.val(d) : 0)));
    },
    next: function(d, val) {
      val = val > later.wy.extent(d)[1] ? 1 : val;
      const wyThur = later.dw.next(later.wy.start(d), 5);
      let year = later.date.nextRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {
        year = later.dw.next(year, 2);
      }
      const wyMax = later.wy.extent(year)[1], wyStart = later.wy.start(year);
      val = val > wyMax ? 1 : val || wyMax;
      return later.date.next(later.Y.val(wyStart), later.M.val(wyStart), later.D.val(wyStart) + 7 * (val - 1));
    },
    prev: function(d, val) {
      const wyThur = later.dw.next(later.wy.start(d), 5);
      let year = later.date.prevRollover(wyThur, val, later.wy, later.Y);
      if (later.wy.val(year) !== 1) {
        year = later.dw.next(year, 2);
      }
      const wyMax = later.wy.extent(year)[1], wyEnd = later.wy.end(year);
      val = val > wyMax ? wyMax : val || wyMax;
      return later.wy.end(later.date.next(later.Y.val(wyEnd), later.M.val(wyEnd), later.D.val(wyEnd) + 7 * (val - 1)));
    }
  };
  later.weekEx = later.WX = {
    name: "weekEx",
    range: 604800,
    val: function(d) {
      if (d.WX) return d.WX;
      return d.WX = Math.ceil(later.date.diffInDays(later.WX.start(later.DX.rangeStart), later.WX.start(d)) / 7);
    },
    isValid: function(d, val) {
      return later.WX.val(d) === (val || later.WX.extent(d)[1]);
    },
    extent: function(d) {
      if (d.WXExtent) return d.WXExtent;
      var end = Math.floor(later.date.diffInDays(later.WX.start(later.DX.rangeStart), later.WX.start(later.DX.rangeEnd)) / 7);
      return d.WXExtent = [ 1, end ];
    },
    start: function(d) {
      return d.WXStart || (d.WXStart = later.date.startOfWeek(d));
    },
    end: function(d) {
      return d.WXEnd || (d.WXEnd = later.date.endOfWeek(d));
    },
    next: function(d, val) {
      return later.date.timeless(new Date(later.WX.start(later.DX.rangeStart).getTime() + val * later.WEEK));
    },
    prev: function(d, val) {
      var result = later.date.timeless(new Date(later.WX.start(later.DX.rangeStart).getTime() + val * later.WEEK));
      result.setTime(result.getTime() - later.SEC);
      return result;
    }
  };
  later.year = later.Y = {
    name: "year",
    range: 31556900,
    val: function(d) {
      return d.Y || (d.Y = later.date.getYear.call(d));
    },
    isValid: function(d, val) {
      return later.Y.val(d) === val;
    },
    extent: function() {
      return [ 1970, 2099 ];
    },
    start: function(d) {
      return d.YStart || (d.YStart = later.date.next(later.Y.val(d)));
    },
    end: function(d) {
      return d.YEnd || (d.YEnd = later.date.prev(later.Y.val(d)));
    },
    next: function(d, val) {
      return val > later.Y.val(d) && val <= later.Y.extent()[1] ? later.date.next(val) : later.NEVER;
    },
    prev: function(d, val) {
      return val < later.Y.val(d) && val >= later.Y.extent()[0] ? later.date.prev(val) : later.NEVER;
    }
  };
  later.fullDate = later.fd = {
    name: "full date",
    range: 1,
    val: function(d) {
      return d.fd || (d.fd = d.getTime());
    },
    isValid: function(d, val) {
      return later.fd.val(d) === val;
    },
    extent: function() {
      return [ 0, 3250368e7 ];
    },
    start: function(d) {
      return d;
    },
    end: function(d) {
      return d;
    },
    next: function(d, val) {
      return later.fd.val(d) < val ? new Date(val) : later.NEVER;
    },
    prev: function(d, val) {
      return later.fd.val(d) > val ? new Date(val) : later.NEVER;
    }
  };
  later.modifier = {};
  later.modifier.after = later.modifier.a = function(constraint, values) {
    const value = values[0];
    return {
      name: "after " + constraint.name,
      range: (constraint.extent(new Date())[1] - value) * constraint.range,
      val: constraint.val,
      isValid: function(d, val) {
        return this.val(d) >= value;
      },
      extent: constraint.extent,
      start: constraint.start,
      end: constraint.end,
      next: function(startDate, val) {
        if (val != value) val = constraint.extent(startDate)[0];
        return constraint.next(startDate, val);
      },
      prev: function(startDate, val) {
        val = val === value ? constraint.extent(startDate)[1] : value - 1;
        return constraint.prev(startDate, val);
      }
    };
  };
  later.modifier.before = later.modifier.b = function(constraint, values) {
    const value = values[values.length - 1];
    return {
      name: "before " + constraint.name,
      range: constraint.range * (value - 1),
      val: constraint.val,
      isValid: function(d, val) {
        return this.val(d) < value;
      },
      extent: constraint.extent,
      start: constraint.start,
      end: constraint.end,
      next: function(startDate, val) {
        val = val === value ? constraint.extent(startDate)[0] : value;
        return constraint.next(startDate, val);
      },
      prev: function(startDate, val) {
        val = val === value ? value - 1 : constraint.extent(startDate)[1];
        return constraint.prev(startDate, val);
      }
    };
  };
  later.compile = function(schedDef) {
    const constraints = [];
    let constraintsLen = 0, tickConstraint;
    for (const key in schedDef) {
      const nameParts = key.split("_"), name = nameParts[0], mod = nameParts[1], vals = schedDef[key], constraint = mod ? later.modifier[mod](later[name], vals) : later[name];
      constraints.push({
        constraint: constraint,
        vals: vals
      });
      constraintsLen++;
    }
    constraints.sort(function(a, b) {
      const ra = a.constraint.range, rb = b.constraint.range;
      return rb < ra ? -1 : rb > ra ? 1 : 0;
    });
    tickConstraint = constraints[constraintsLen - 1].constraint;
    function compareFn(dir) {
      return dir === "next" ? function(a, b) {
        return a.getTime() > b.getTime();
      } : function(a, b) {
        return b.getTime() > a.getTime();
      };
    }
    return {
      start: function(dir, startDate) {
        let next = startDate;
        const nextVal = later.array[dir];
        let maxAttempts = 1e3, done;
        while (maxAttempts-- && !done && next) {
          done = true;
          for (let i = 0; i < constraintsLen; i++) {
            const constraint = constraints[i].constraint, curVal = constraint.val(next), extent = constraint.extent(next), newVal = nextVal(curVal, constraints[i].vals, extent);
            if (!constraint.isValid(next, newVal)) {
              next = constraint[dir](next, newVal);
              done = false;
              break;
            }
          }
        }
        if (next !== later.NEVER) {
          next = dir === "next" ? tickConstraint.start(next) : tickConstraint.end(next);
        }
        return next;
      },
      end: function(dir, startDate) {
        let result;
        const nextVal = later.array[dir + "Invalid"], compare = compareFn(dir);
        for (let i = constraintsLen - 1; i >= 0; i--) {
          const constraint = constraints[i].constraint, curVal = constraint.val(startDate), extent = constraint.extent(startDate), newVal = nextVal(curVal, constraints[i].vals, extent);
          let next;
          if (newVal !== undefined) {
            next = constraint[dir](startDate, newVal);
            if (next && (!result || compare(result, next))) {
              result = next;
            }
          }
        }
        return result;
      },
      tick: function(dir, date) {
        return new Date(dir === "next" ? tickConstraint.end(date).getTime() + later.SEC : tickConstraint.start(date).getTime() - later.SEC);
      },
      tickStart: function(date) {
        return tickConstraint.start(date);
      }
    };
  };
  later.schedule = function(sched) {
    if (!sched) throw new Error("Missing schedule definition.");
    if (!sched.schedules) throw new Error("Definition must include at least one schedule.");
    const schedules = [], schedulesLen = sched.schedules.length, exceptions = [], exceptionsLen = sched.exceptions ? sched.exceptions.length : 0;
    for (let i = 0; i < schedulesLen; i++) {
      schedules.push(later.compile(sched.schedules[i]));
    }
    for (let j = 0; j < exceptionsLen; j++) {
      exceptions.push(later.compile(sched.exceptions[j]));
    }
    function getInstances(dir, count, startDate, endDate, isRange) {
      const compare = compareFn(dir), schedStarts = [], exceptStarts = [], results = [], isForward = dir === "next", rStart = isForward ? 0 : 1, rEnd = isForward ? 1 : 0;
      let next, end, lastResult, maxAttempts = 1e3, loopCount = count;
      startDate = startDate ? new Date(startDate) : new Date();
      if (!startDate || !startDate.getTime()) throw new Error("Invalid start date.");
      setNextStarts(dir, schedules, schedStarts, startDate);
      setRangeStarts(dir, exceptions, exceptStarts, startDate);
      while (maxAttempts-- && loopCount && (next = findNext(schedStarts, compare))) {
        if (endDate && compare(next, endDate)) {
          break;
        }
        if (exceptionsLen) {
          updateRangeStarts(dir, exceptions, exceptStarts, next);
          if (end = calcRangeOverlap(dir, exceptStarts, next)) {
            updateNextStarts(dir, schedules, schedStarts, end);
            continue;
          }
        }
        if (isRange) {
          const maxEndDate = calcMaxEndDate(exceptStarts, compare);
          end = calcEnd(dir, schedules, schedStarts, next, maxEndDate);
          const r = isForward ? [ new Date(Math.max(startDate, next)), end ? new Date(endDate ? Math.min(end, endDate) : end) : undefined ] : [ end ? new Date(endDate ? Math.max(endDate, end.getTime() + later.SEC) : end.getTime() + later.SEC) : undefined, new Date(Math.min(startDate, next.getTime() + later.SEC)) ];
          if (lastResult && r[rStart].getTime() === lastResult[rEnd].getTime()) {
            lastResult[rEnd] = r[rEnd];
            loopCount++;
          } else {
            lastResult = r;
            results.push(lastResult);
          }
          if (!end) break;
          updateNextStarts(dir, schedules, schedStarts, end);
        } else {
          results.push(isForward ? new Date(Math.max(startDate, next)) : getStart(schedules, schedStarts, next, endDate));
          tickStarts(dir, schedules, schedStarts, next);
        }
        loopCount--;
      }
      for (let i = 0, len = results.length; i < len; i++) {
        const result = results[i];
        results[i] = Object.prototype.toString.call(result) === "[object Array]" ? [ cleanDate(result[0]), cleanDate(result[1]) ] : cleanDate(result);
      }
      return results.length === 0 ? later.NEVER : count === 1 ? results[0] : results;
    }
    function cleanDate(d) {
      if (d instanceof Date && !isNaN(d.valueOf())) {
        return new Date(d);
      }
      return undefined;
    }
    function setNextStarts(dir, schedArr, startsArr, startDate) {
      for (let i = 0, len = schedArr.length; i < len; i++) {
        startsArr[i] = schedArr[i].start(dir, startDate);
      }
    }
    function updateNextStarts(dir, schedArr, startsArr, startDate) {
      const compare = compareFn(dir);
      for (let i = 0, len = schedArr.length; i < len; i++) {
        if (startsArr[i] && !compare(startsArr[i], startDate)) {
          startsArr[i] = schedArr[i].start(dir, startDate);
        }
      }
    }
    function setRangeStarts(dir, schedArr, rangesArr, startDate) {
      const compare = compareFn(dir);
      for (let i = 0, len = schedArr.length; i < len; i++) {
        const nextStart = schedArr[i].start(dir, startDate);
        if (!nextStart) {
          rangesArr[i] = later.NEVER;
        } else {
          rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];
        }
      }
    }
    function updateRangeStarts(dir, schedArr, rangesArr, startDate) {
      const compare = compareFn(dir);
      for (let i = 0, len = schedArr.length; i < len; i++) {
        if (rangesArr[i] && !compare(rangesArr[i][0], startDate)) {
          const nextStart = schedArr[i].start(dir, startDate);
          if (!nextStart) {
            rangesArr[i] = later.NEVER;
          } else {
            rangesArr[i] = [ nextStart, schedArr[i].end(dir, nextStart) ];
          }
        }
      }
    }
    function tickStarts(dir, schedArr, startsArr, startDate) {
      for (let i = 0, len = schedArr.length; i < len; i++) {
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
          startsArr[i] = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));
        }
      }
    }
    function getStart(schedArr, startsArr, startDate, minEndDate) {
      let result;
      for (let i = 0, len = startsArr.length; i < len; i++) {
        if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
          const start = schedArr[i].tickStart(startDate);
          if (minEndDate && start < minEndDate) {
            return minEndDate;
          }
          if (!result || start > result) {
            result = start;
          }
        }
      }
      return result;
    }
    function calcRangeOverlap(dir, rangesArr, startDate) {
      const compare = compareFn(dir);
      let result;
      for (let i = 0, len = rangesArr.length; i < len; i++) {
        const range = rangesArr[i];
        if (range && !compare(range[0], startDate) && (!range[1] || compare(range[1], startDate))) {
          if (!result || compare(range[1], result)) {
            result = range[1];
          }
        }
      }
      return result;
    }
    function calcMaxEndDate(exceptsArr, compare) {
      let result;
      for (let i = 0, len = exceptsArr.length; i < len; i++) {
        if (exceptsArr[i] && (!result || compare(result, exceptsArr[i][0]))) {
          result = exceptsArr[i][0];
        }
      }
      return result;
    }
    function calcEnd(dir, schedArr, startsArr, startDate, maxEndDate) {
      const compare = compareFn(dir);
      let result;
      for (let i = 0, len = schedArr.length; i < len; i++) {
        const start = startsArr[i];
        if (start && start.getTime() === startDate.getTime()) {
          const end = schedArr[i].end(dir, start);
          if (maxEndDate && (!end || compare(end, maxEndDate))) {
            return maxEndDate;
          }
          if (!result || compare(end, result)) {
            result = end;
          }
        }
      }
      return result;
    }
    function compareFn(dir) {
      return dir === "next" ? function(a, b) {
        return !a || !b || a.getTime() > b.getTime();
      } : function(a, b) {
        return !a || !b || b.getTime() > a.getTime();
      };
    }
    function findNext(arr, compare) {
      let next = arr[0];
      for (let i = 1, len = arr.length; i < len; i++) {
        if (arr[i] && compare(next, arr[i])) {
          next = arr[i];
        }
      }
      return next;
    }
    return {
      isValid: function(d) {
        return getInstances("next", 1, d, d) !== later.NEVER;
      },
      next: function(count, startDate, endDate) {
        return getInstances("next", count || 1, startDate, endDate);
      },
      prev: function(count, startDate, endDate) {
        return getInstances("prev", count || 1, startDate, endDate);
      },
      nextRange: function(count, startDate, endDate) {
        return getInstances("next", count || 1, startDate, endDate, true);
      },
      prevRange: function(count, startDate, endDate) {
        return getInstances("prev", count || 1, startDate, endDate, true);
      }
    };
  };
  later.setTimeout = function(fn, sched) {
    const s = later.schedule(sched);
    let t;
    if (fn) {
      scheduleTimeout();
    }
    function scheduleTimeout() {
      const now = Date.now(), next = s.next(2, now);
      if (!next[0]) {
        t = undefined;
        return;
      }
      let diff = next[0].getTime() - now;
      if (diff < 1e3) {
        diff = next[1] ? next[1].getTime() - now : 1e3;
      }
      if (diff < 2147483647) {
        t = setTimeout(fn, diff);
      } else {
        t = setTimeout(scheduleTimeout, 2147483647);
      }
    }
    return {
      isDone: function() {
        return !t;
      },
      clear: function() {
        clearTimeout(t);
      }
    };
  };
  later.setInterval = function(fn, sched) {
    if (!fn) {
      return;
    }
    let t = later.setTimeout(scheduleTimeout, sched), done = t.isDone();
    function scheduleTimeout() {
      if (!done) {
        fn();
        t = later.setTimeout(scheduleTimeout, sched);
      }
    }
    return {
      isDone: function() {
        return t.isDone();
      },
      clear: function() {
        done = true;
        t.clear();
      }
    };
  };
  later.date = {};
  later.date.timezone = function(useLocalTime) {
    later.date.build = useLocalTime ? function(Y, M, D, h, m, s) {
      return new Date(Y, M, D, h, m, s);
    } : function(Y, M, D, h, m, s) {
      return new Date(Date.UTC(Y, M, D, h, m, s));
    };
    const get = useLocalTime ? "get" : "getUTC", d = Date.prototype;
    later.date.getYear = d[get + "FullYear"];
    later.date.getMonth = d[get + "Month"];
    later.date.getDate = d[get + "Date"];
    later.date.getDay = d[get + "Day"];
    later.date.getHour = d[get + "Hours"];
    later.date.getMin = d[get + "Minutes"];
    later.date.getSec = d[get + "Seconds"];
    later.date.isUTC = !useLocalTime;
  };
  later.date.UTC = function() {
    later.date.timezone(false);
  };
  later.date.localTime = function() {
    later.date.timezone(true);
  };
  later.date.UTC();
  later.SEC = 1e3;
  later.MIN = later.SEC * 60;
  later.HOUR = later.MIN * 60;
  later.DAY = later.HOUR * 24;
  later.WEEK = later.DAY * 7;
  later.DAYS_IN_MONTH = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];
  later.NEVER = 0;
  later.date.next = function(Y, M, D, h, m, s) {
    return later.date.build(Y, M !== undefined ? M - 1 : 0, D !== undefined ? D : 1, h || 0, m || 0, s || 0);
  };
  later.date.nextRollover = function(d, val, constraint, period) {
    const cur = constraint.val(d), max = constraint.extent(d)[1];
    return (val || max) <= cur || val > max ? new Date(period.end(d).getTime() + later.SEC) : period.start(d);
  };
  later.date.prev = function(Y, M, D, h, m, s) {
    var len = arguments.length;
    M = len < 2 ? 11 : M - 1;
    D = len < 3 ? later.D.extent(later.date.next(Y, M + 1))[1] : D;
    h = len < 4 ? 23 : h;
    m = len < 5 ? 59 : m;
    s = len < 6 ? 59 : s;
    return later.date.build(Y, M, D, h, m, s);
  };
  later.date.prevRollover = function(d, val, constraint, period) {
    const cur = constraint.val(d);
    return val >= cur || !val ? period.start(period.prev(d, period.val(d) - 1)) : period.start(d);
  };
  later.date.diffInDays = function(start, end) {
    return Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / later.DAY);
  };
  later.date.startOfWeek = function(value) {
    const date = new Date(value.getFullYear(), value.getMonth(), value.getDate()), day = date.getDay(), diff = date.getTime() - day * later.DAY;
    date.setTime(diff);
    return date;
  };
  later.date.endOfWeek = function(value) {
    const date = later.date.startOfWeek(value);
    date.setTime(date.getTime() + later.WEEK - later.SEC);
    return date;
  };
  later.date.diffInMonths = function(start, end) {
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    return months <= 0 ? 0 : months;
  };
  later.date.startOfMonth = function(value) {
    return new Date(value.getFullYear(), value.getMonth(), 1);
  };
  later.date.endOfMonth = function(value) {
    const result = new Date(value.getFullYear(), value.getMonth() + 1, 1);
    result.setTime(result.getTime() - later.SEC);
    return result;
  };
  const daysInMonthCache = {
    weekDays: {},
    weekendDays: {}
  };
  function initDaysInMonth(year, month) {
    const daysInMonth = new Date(year, month + 1, 0).getDate(), dayOfWeekOffset = new Date(year, month, 1).getDay() - 1, result = {
      weekDays: {
        values: [],
        map: {}
      },
      weekendDays: {
        values: [],
        map: {}
      }
    };
    let weekendDayIdx = -1, weekdayIdx = -1;
    for (let day = 1; day <= daysInMonth; day++) {
      const dayOfWeek = (day + dayOfWeekOffset) % 7;
      if (dayOfWeek == 0 || dayOfWeek == 6) {
        result.weekendDays.map[day] = {
          value: weekendDayIdx = result.weekendDays.values.push(day) - 1,
          valid: true
        };
        result.weekDays.map[day] = {
          value: weekdayIdx + 1,
          valid: false
        };
      } else {
        result.weekDays.map[day] = {
          value: weekdayIdx = result.weekDays.values.push(day) - 1,
          valid: true
        };
        result.weekendDays.map[day] = {
          value: weekendDayIdx + 1,
          valid: false
        };
      }
    }
    return result;
  }
  later.date.weekdaysInMonth = function(value) {
    const year = value.getFullYear(), month = value.getMonth(), yearMonth = year * 100 + month;
    const daysInMonth = daysInMonthCache[yearMonth] = daysInMonthCache[yearMonth] || initDaysInMonth(year, month);
    return daysInMonth.weekDays;
  };
  later.date.weekendDaysInMonth = function(value) {
    const year = value.getFullYear(), month = value.getMonth(), yearMonth = year * 100 + month;
    const daysInMonth = daysInMonthCache[yearMonth] = daysInMonthCache[yearMonth] || initDaysInMonth(year, month, yearMonth);
    return daysInMonth.weekendDays;
  };
  later.date.timeless = function(value) {
    const date = new Date(value);
    date.setHours(0, 0, 0, 0);
    return date;
  };
  return later;
}();