import { ADD_SNACK, REMOVE_SNACK } from '../../redux/actionTypes'

const initialState = {
	messages: []
}

export const addSnack = payload => ({
	type: ADD_SNACK,
	payload
})

export const removeSnack = payload => ({
	type: REMOVE_SNACK,
	payload
})

const snackReducers = {
	[ADD_SNACK]: (state, payload) => ({
		...state,
		messages: [...state.messages, payload]
	}),
	[REMOVE_SNACK]: (state, payload) => {
		let messages = state.messages.slice()
		messages = messages.filter((item, index) => index !== payload)
		return {
			...state,
			messages
		}
	}
}

export const snackRootReducer = (state = initialState, action) => {
	let reducer = snackReducers[action.type]
	return reducer ? reducer(state, action.payload) : state
}
