// import { OPEN_DRAWER, CLOSE_DRAWER } from '../../redux/actionTypes'

// const initialState = {
// 	open: Boolean(parseInt(localStorage.getItem('drawer')))
// }

// export const openDrawer = () => ({
// 	type: OPEN_DRAWER
// })

// export const closeDrawer = () => ({
// 	type: CLOSE_DRAWER
// })

// const drawerReducers = {
// 	[OPEN_DRAWER]: state => ({ ...state, open: true }),
// 	[CLOSE_DRAWER]: state => ({ ...state, open: false })
// }

// export const drawerRootReducer = (state = initialState, action) => {
// 	let reducer = drawerReducers[action.type]
// 	return reducer ? reducer(state, action.payload) : state
// }
