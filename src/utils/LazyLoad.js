import React, { lazy, Suspense } from 'react'
import { makeStyles } from '@material-ui/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles({
	root: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		zIndex: 10000
	}
})

const Spinner = () => {
	const classes = useStyles()
	return (
		<div className={classes.root}>
			<CircularProgress />
		</div>
	)
}

const LazyLoad = importFunc => {
	const LazyComponent = lazy(importFunc)

	return props => (
		<Suspense fallback={<Spinner />}>
			<LazyComponent {...props} />
		</Suspense>
	)
}

export default LazyLoad
