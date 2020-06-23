export const changeColumnOptions = (tableName, columnName) => {
	let tableOpts = JSON.parse(localStorage.getItem(tableName))

	if (tableOpts) {
		const exist = tableOpts.find(item => item === columnName)

		if (exist) tableOpts = tableOpts.filter(item => item !== exist)
		else tableOpts = tableOpts.concat(columnName)
	} else tableOpts = [columnName]

	localStorage.setItem(tableName, JSON.stringify(tableOpts))
}

export const getItem = (tableName, columnName) => {
	let tableOpts = JSON.parse(localStorage.getItem(tableName))

	if (tableOpts) {
		const exist = tableOpts.find(item => item === columnName)

		if (exist) return 'false'
		else return 'true'
	}
	return 'true'
}
