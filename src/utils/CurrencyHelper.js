const setCharAt = (str, index, chr) => {
	if (index > str.length - 1) return str
	return str.substr(0, index) + chr + str.substr(index + 1)
}

export const formatCurrency = (sum = '') => {
	if (sum === null || sum.length === 0) return ''
	let num = parseFloat(sum).toFixed(2)
	let sumStr = num.toString()

	let mas = []
	let floatRest = '.00'
	if (/\./g.test(sumStr)) {
		mas = sumStr.split('.')
		sumStr = mas[0]
		floatRest = ''
		floatRest = `.${mas[1]}`
	}

	let formattedSum = ''
	if (sumStr.length === 8) {
		formattedSum = sumStr.slice(0, 2) + ',' + sumStr.slice(2, 5) + ',' + sumStr.slice(5, 8)
	} else if (sumStr.length === 7) {
		formattedSum = sumStr.slice(0, 1) + ',' + sumStr.slice(1, 4) + ',' + sumStr.slice(4, 7)
	} else if (sumStr.length === 6) {
		formattedSum = sumStr.slice(0, 3) + ',' + sumStr.slice(3)
	} else if (sumStr.length === 5) {
		formattedSum = sumStr.slice(0, 2) + ',' + sumStr.slice(2)
	} else if (sumStr.length === 4) {
		formattedSum = sumStr.slice(0, 1) + ',' + sumStr.slice(1)
	} else {
		formattedSum = sumStr
	}
	let result = `${formattedSum}${floatRest}`

	if (result.charAt(0) === '-') {
		result = `-${setCharAt(result, 0, '$')}`
	} else result = `$${result}`
	return result
}
