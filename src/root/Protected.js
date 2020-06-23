import React from 'react'
import { Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { checkAuth } from './client'

const Protected = ({ component: Component, ...rest }) => (
	<Route
		{...rest}
		render={props => {
			if (process.env.NODE_ENV === 'production') {
				checkAuth()
			}
			return (
				<AppLayout>
					<Component {...props} />
				</AppLayout>
			)
		}}
	/>
)

export default Protected
