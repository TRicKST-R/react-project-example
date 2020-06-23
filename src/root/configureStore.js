import { createStore, compose, applyMiddleware } from 'redux'
import reduxImmutableStateInvariant from 'redux-immutable-state-invariant'
import thunk from 'redux-thunk'
import logger from 'redux-logger'
import rootReducer from '../redux'
import { routerMiddleware } from 'react-router-redux'
import { createBrowserHistory } from 'history'
export const history = createBrowserHistory()

const configureStore = initialState => {
	const reactRouterMiddleware = routerMiddleware(history)

	let middlewares = []

	if (process.env.NODE_ENV === 'development') {
		middlewares = [
			// Add other middleware on this line...
			reactRouterMiddleware,
			// Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
			reduxImmutableStateInvariant(),
			// thunk middleware can also accept an extra argument to be passed to each thunk action
			// https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
			thunk,
			logger
		]
	} else {
		middlewares = [
			// Add other middleware on this line...
			reactRouterMiddleware,
			// Redux middleware that spits an error on you when you try to mutate your state either inside a dispatch or between dispatches.
			reduxImmutableStateInvariant(),
			// thunk middleware can also accept an extra argument to be passed to each thunk action
			// https://github.com/gaearon/redux-thunk#injecting-a-custom-argument
			thunk
		]
	}
	// add support for Redux dev tools
	const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
	let store
	if (process.env.NODE_ENV === 'development') {
		store = createStore(
			rootReducer,
			initialState,
			composeEnhancers(applyMiddleware(...middlewares))
		)
	} else {
		store = createStore(rootReducer, initialState, applyMiddleware(...middlewares))
	}

	return store
}

export default configureStore
