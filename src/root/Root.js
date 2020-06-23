import React from 'react'
import { ApolloProvider } from 'react-apollo'
import { ThemeProvider } from '@material-ui/styles'
import { createMuiTheme } from '@material-ui/core/styles'
import blue from '@material-ui/core/colors/blue'
import CssBaseline from '@material-ui/core/CssBaseline'
import App from './App'
import './index.css'
import * as Sentry from '@sentry/browser'

import { ConnectedRouter } from 'react-router-redux'
import { Provider } from 'react-redux'
import { client, checkAuth, checkTokenIsProvided } from './client'

import configureStore, { history } from './configureStore'

if (process.env.NODE_ENV === 'production') {
	checkTokenIsProvided()
	checkAuth()
}

const store = configureStore()

export const theme = createMuiTheme({
	palette: {
		primary: blue,
		secondary: {
			main: '#fff'
		}
	},
	typography: {
		body1: {
			fontSize: '0.8125rem'
		}
	}
})

if (process.env.NODE_ENV === 'production') {
	Sentry.init({ dsn: 'https://017321b76e8a4c3c9a01469797bd47d2@sentry.io/1488868' })
}

const Root = () => (
	<ApolloProvider client={client}>
		<ThemeProvider theme={theme}>
			<CssBaseline />
			<Provider store={store}>
				<ConnectedRouter history={history}>
					<App />
				</ConnectedRouter>
			</Provider>
		</ThemeProvider>
	</ApolloProvider>
)

export default Root
