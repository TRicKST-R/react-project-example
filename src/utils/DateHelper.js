export const utcToIso = utc => new Date(utc).toISOString()

const addZero = num => {
	return num < 10 ? `0${num}` : num
}

export const getDMYFromUtc = utc => {
	if (utc === null) return ''
	const date = new Date(utc)

	let month = addZero(date.getUTCMonth() + 1)
	let day = addZero(date.getUTCDate())
	return `${month}.${day}.${date.getUTCFullYear()}`
}

export const getDMYTFromUtc = utc => {
	if (utc === null) return ''
	const date = new Date(utc)

	let month = addZero(date.getUTCMonth() + 1)
	let day = addZero(date.getUTCDate())
	let hours = addZero(date.getHours())
	let minutes = addZero(date.getMinutes())
	return `${month}.${day}.${date.getUTCFullYear()} ${hours}:${minutes}`
}

export const getDMYTSFromUtc = utc => {
	if (utc === null) return ''
	const date = new Date(utc)
	let month = addZero(date.getUTCMonth() + 1)
	let day = addZero(date.getUTCDate())
	let hours = addZero(date.getHours())
	let minutes = addZero(date.getMinutes())
	let milliseconds = addZero(date.getMilliseconds())
	let seconds = addZero(date.getSeconds())
	return `${month}.${day}.${date.getUTCFullYear()} ${hours}:${minutes}:${seconds}.${milliseconds}`
}

export const yyyyMMddFormat = utc => {
	if (utc === null) return ''
	const date = new Date(utc)
	let month = addZero(date.getUTCMonth() + 1)
	let day = addZero(date.getUTCDate())
	return `${date.getUTCFullYear()}-${month}-${day}`
}
