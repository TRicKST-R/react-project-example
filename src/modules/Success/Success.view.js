import React, { useState, useEffect } from 'react'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import { green } from '@material-ui/core/colors'
import { useStyles } from '../../CustomHooks/'

const styles = {
	error: {
		backgroundColor: green[600]
	},
	message: {
		display: 'flex',
		alignItems: 'center'
	},
	root: {
		position: 'fixed',
		top: 0,
		width: '100%',
		zIndex: 2000,
		paddingTop: 8
	},
	snack: {
		position: 'relative',
		marginBottom: 8,
		maxWidth: 500,
		'& > div': {
			width: '100%'
		}
	},
	icon: {
		marginRight: 16
	}
}

const Success = props => {
	const [show, setShow] = useState(false)
	const [message, setMessage] = useState('')
	const classes = useStyles(styles)

	useEffect(() => {
		if (props.successState.message !== '') setShow(true)
		setMessage(props.successState.message)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	return (
		<div className={classes.root}>
			<Snackbar
				anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
				open={show}
				className={classes.snack}
				autoHideDuration={2000}
				onClose={() => setShow(false)}
			>
				<SnackbarContent
					className={classes.error}
					aria-describedby="client-snackbar"
					message={
						<span className={classes.message}>
							<CheckCircleIcon className={classes.icon} />
							{message}
						</span>
					}
				/>
			</Snackbar>
		</div>
	)
}

export default Success
