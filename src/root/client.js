import { ApolloClient } from 'apollo-client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { HttpLink } from 'apollo-link-http'
import { onError } from 'apollo-link-error'
import { ApolloLink } from 'apollo-link'
import { addSnack } from '../modules/Snack/Snack.state'
import { AUTH_ADDRESS, API_ADDRESS, PUBLIC_API_KEY } from '../config'
import decode from 'jwt-decode'
import { createUploadLink } from 'apollo-upload-client'

export const checkTokenIsProvided = () => {
	if (window.location.href.indexOf('=') > 0 && window.location.href.indexOf('&') > 0) {
		localStorage.setItem(
			'id_token',
			window.location.href.slice(
				window.location.href.indexOf('=') + 1,
				window.location.href.indexOf('&')
			)
		)
		window.location.href = '/'
		return true
	} else return false
}

export const checkAuth = () => {
	const id_token = localStorage.getItem('id_token')
	if (id_token) {
		const decoded = decode(id_token)
		if (decoded.exp < Date.now() / 1000) {
			window.location.href = AUTH_ADDRESS
		}
		if (process.env.REACT_APP_ENVAR !== 'uat2.') {
			if (decoded.email !== 'dhannes@me.com') {
				window.location.href = AUTH_ADDRESS
			}
		}
	} else window.location.href = AUTH_ADDRESS
}

// checkTokenIsProvided()
// checkAuth()

const defaultOptions = {
	watchQuery: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'ignore'
	},
	query: {
		fetchPolicy: 'no-cache',
		errorPolicy: 'all'
	}
}

export const client = new ApolloClient({
	link: ApolloLink.from([
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					addSnack(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
				)
			if (networkError) {
				if (process.env.NODE_ENV === 'production') checkAuth()
				addSnack(`[Network error]: ${networkError}`)
			}
		}),
		new HttpLink({
			uri: API_ADDRESS,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('id_token')}`
			}
		})
	]),
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions
})

export const publicClient = new ApolloClient({
	link: ApolloLink.from([
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					addSnack(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
				)
			if (networkError) {
				// if (process.env.NODE_ENV === 'production') checkAuth()
				addSnack(`[Network error]: ${networkError}`)
			}
		}),
		new HttpLink({
			uri: 'https://publicapi.uat2.test.lovedwealth.com/graphql',
			headers: {
				'x-api-key': PUBLIC_API_KEY
			}
		})
	]),
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions
})

export const clientUpload = new ApolloClient({
	link: ApolloLink.from([
		onError(({ graphQLErrors, networkError }) => {
			if (graphQLErrors)
				graphQLErrors.map(({ message, locations, path }) =>
					addSnack(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`)
				)
			if (networkError) {
				if (process.env.NODE_ENV === 'production') checkAuth()
				addSnack(`[Network error]: ${networkError}`)
			}
		}),
		createUploadLink({
			uri: API_ADDRESS,
			headers: {
				Authorization: `Bearer ${localStorage.getItem('id_token')}`
			}
		})
	]),
	cache: new InMemoryCache(),
	defaultOptions: defaultOptions
})

export const s3FileUpload = async data => {
	return fetch(API_ADDRESS, {
		method: 'POST',
		body: data,
		headers: {
			Authorization: `Bearer ${localStorage.getItem('id_token')}`
		}
	})
		.then(response => response.json())
		.then(myJson => myJson)
}
