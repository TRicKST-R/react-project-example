import moment from 'moment'

export function weeksOfMonth(month) {
	const thisMonth = month.month()
	const weeks = []

	month = moment(month)
		.startOf('month')
		.startOf('week')

	do {
		weeks.push(month.clone())
		month.add(1, 'week')
	} while (month.month() === thisMonth)

	return weeks
}

export function monthEdges(month) {
	const start = moment(month)
		.startOf('month')
		.startOf('week')
	const end = moment(month)
		.endOf('month')
		.endOf('week')

	const result = []

	while (start.month() !== month.month()) {
		result.push(start.clone())
		start.add(1, 'day')
	}

	while (end.month() !== month.month()) {
		result.push(end.clone())
		end.subtract(1, 'day')
	}

	return result
}

export function daysOfWeek(week) {
	week = moment(week).startOf('week')

	return Array(7)
		.fill(0)
		.map((n, i) => week.clone().add(n + i, 'day'))
}
