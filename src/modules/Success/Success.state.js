import { ADD_SUCCESS } from '../../redux/actionTypes'

const initialState = {
	message: ''
}

export const addSuccess = payload => ({
	type: ADD_SUCCESS,
	payload
})

const successReducers = {
	[ADD_SUCCESS]: (state, payload) => ({
		...state,
		message: payload
	})
}

export const successRootReducer = (state = initialState, action) => {
	let reducer = successReducers[action.type]
	return reducer ? reducer(state, action.payload) : state
}
