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