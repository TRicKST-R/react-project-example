import React from 'react'
import ErrorBoundary from '../components/ErrorBoundary'
import Routes from './Routes'
import Spinner from '../modules/Spinner'
import Snack from '../modules/Snack'
import Success from '../modules/Success'

const App = () => (
	<React.Fragment>
		<ErrorBoundary>
			<Routes />
		</ErrorBoundary>
		<ErrorBoundary>
			<Spinner />
		</ErrorBoundary>
		<ErrorBoundary>
			<Snack />
		</ErrorBoundary>
		<ErrorBoundary>
			<Success />
		</ErrorBoundary>
	</React.Fragment>
)

export default App
