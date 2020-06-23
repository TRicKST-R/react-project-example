import { SPINNER_START, SPINNER_STOP } from '../../redux/actionTypes'

const initialState = {
	started: false
}

export const startSpinner = () => ({
	type: SPINNER_START
})

export const stopSpinner = () => ({
	type: SPINNER_STOP
})

const spinnerReducers = {
	[SPINNER_START]: state => ({ ...state, started: true }),
	[SPINNER_STOP]: state => ({ ...state, started: false })
}

export const spinnerRootReducer = (state = initialState, action) => {
	let reducer = spinnerReducers[action.type]
	return reducer ? reducer(state, action.payload) : state
}
