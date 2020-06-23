import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { spinnerRootReducer } from '../modules/Spinner/Spinner.state'
import { snackRootReducer } from '../modules/Snack/Snack.state'
import { successRootReducer } from '../modules/Success/Success.state'

const rootReducer = combineReducers({
	routing: routerReducer,
	spinnerState: spinnerRootReducer,
	snackState: snackRootReducer,
	successState: successRootReducer
})

export default rootReducer
