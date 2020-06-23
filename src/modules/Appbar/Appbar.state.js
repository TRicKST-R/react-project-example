// import { SHIFT_APPBAR, UNSHIFT_APPBAR } from '../../redux/actionTypes'

// const initialState = {
// 	shifted: Boolean(parseInt(localStorage.getItem('drawer')))
// }

// export const shiftAppbar = () => ({
// 	type: SHIFT_APPBAR
// })

// export const unshiftAppbar = () => ({
// 	type: UNSHIFT_APPBAR
// })

// const appbarReducers = {
// 	[SHIFT_APPBAR]: state => ({ ...state, shifted: true }),
// 	[UNSHIFT_APPBAR]: state => ({ ...state, shifted: false })
// }

// export const appbarRootReducer = (state = initialState, action) => {
// 	let reducer = appbarReducers[action.type]
// 	return reducer ? reducer(state, action.payload) : state
// }
