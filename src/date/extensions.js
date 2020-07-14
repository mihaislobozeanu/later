/**
* Calculates and returns the difference in days between 2 dates.
*
* @param {DateTime} start: From date
* @param {DateTime} end: To date
*/
later.date.diffInDays = function (start, end) {
	return Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / later.DAY);
}

later.date.startOfWeek = function (value) {
	var date = new Date(value.getFullYear(), value.getMonth(), value.getDate()),
		day = date.getDay(),
		diff = date.getTime() - day * later.DAY;
	date.setTime(diff);
	return date;
}

later.date.endOfWeek = function (value) {
	var date = later.date.startOfWeek(value)
	date.setTime(date.getTime() + later.WEEK - later.SEC);
	return date;
}

/**
* Calculates and returns the difference in months between 2 dates.
*
* @param {DateTime} start: From date
* @param {DateTime} end: To date
*/
later.date.diffInMonths = function (start, end) {
	var months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
	return months <= 0 ? 0 : months;
}

later.date.startOfMonth = function (value) {
	return new Date(value.getFullYear(), value.getMonth(), 1);
}

later.date.endOfMonth = function (value) {
	var result = new Date(value.getFullYear(), value.getMonth() + 1, 1);
	result.setTime(result.getTime() - later.SEC);
	return result;
}

var daysInMonthCache = { weekDays: {}, weekendDays: {} };

function initDaysInMonth(year, month) {
	var daysInMonth = (new Date(year, month + 1, 0)).getDate(),
		dayOfWeekOffset = (new Date(year, month, 1)).getDay() - 1,
		result = { weekDays: { values: [], map: {} }, weekendDays: { values: [], map: {} } };

	var weekendDayIdx = -1, weekdayIdx = -1;
	for (var day = 1; day <= daysInMonth; day++) {
		var dayOfWeek = (day + dayOfWeekOffset) % 7;
		if (dayOfWeek == 0 || dayOfWeek == 6) {
			result.weekendDays.map[day] = { value: (weekendDayIdx = result.weekendDays.values.push(day) - 1), valid: true };
			result.weekDays.map[day] = { value: weekdayIdx + 1, valid: false };
		} else {
			result.weekDays.map[day] = { value: (weekdayIdx = result.weekDays.values.push(day) - 1), valid: true };
			result.weekendDays.map[day] = { value: weekendDayIdx + 1, valid: false };
		}
	}
	return result;
}

later.date.weekdaysInMonth = function (value) {
	var year = value.getFullYear(),
		month = value.getMonth(),
		yearMonth = year * 100 + month;
	var daysInMonth = daysInMonthCache[yearMonth] = daysInMonthCache[yearMonth] || initDaysInMonth(year, month);
	return daysInMonth.weekDays;
}

later.date.weekendDaysInMonth = function (value) {
	var year = value.getFullYear(),
		month = value.getMonth(),
		yearMonth = year * 100 + month;
	var daysInMonth = daysInMonthCache[yearMonth] = daysInMonthCache[yearMonth] || initDaysInMonth(year, month, yearMonth);
	return daysInMonth.weekendDays;
}


later.date.timeless = function (value) {
	var date = new Date(value);
	date.setHours(0, 0, 0, 0);
	return date;
}