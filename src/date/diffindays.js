/**
* Calculates and returns the difference in days between 2 dates.
*
* @param {DateTime} start: From date
* @param {DateTime} end: To date
*/
later.date.diffInDays = function (start, end) {
	return Math.floor((Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()) - Date.UTC(start.getFullYear(), start.getMonth(), start.getDate())) / later.DAY);
}