import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { useStyles } from '../../CustomHooks'

const styles = {
	root: {
		position: 'fixed',
		top: 0,
		left: 0,
		width: '100vw',
		height: '100vh',
		backgroundColor: 'rgba(255,255,255,.6)',
		justifyContent: 'center',
		alignItems: 'center',
		display: 'flex',
		zIndex: 10000
	},
	hide: {
		display: 'none'
	}
}

function SpinnerComponent(props) {
	const { spinnerState } = props
	const { started } = spinnerState
	const classes = useStyles(styles)

	return (
		<div className={started ? classes.root : classes.hide}>
			<CircularProgress />
		</div>
	)
}

export default SpinnerComponent
