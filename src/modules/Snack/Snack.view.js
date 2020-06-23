import React, { useState, useEffect } from 'react'
import ErrorIcon from '@material-ui/icons/Error'
import CloseIcon from '@material-ui/icons/Close'
import Snackbar from '@material-ui/core/Snackbar'
import SnackbarContent from '@material-ui/core/SnackbarContent'
import IconButton from '@material-ui/core/IconButton'
import { useStyles } from '../../CustomHooks'

const styles = {
	error: {
		backgroundColor: '#ff0000'
	},
	message: {
		display: 'flex',
		alignItems: 'center'
	},
	root: {
		position: 'fixed',
		top: 0,
		width: '100%',
		zIndex: 2000
	},
	snack: {
		position: 'relative',
		marginBottom: 8,
		maxWidth: 500,
		top: 8,
		'& > div': {
			width: '100%'
		}
	},
	icon: {
		marginRight: 16
	}
}

const Snack = props => {
	const [show, setShow] = useState(false)
	const [messages, setMessages] = useState([])
	const { removeSnack } = props
	const classes = useStyles(styles)

	useEffect(() => {
		setMessages(props.snackState.messages)
		setShow(true)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.snackState.messages])

	return (
		<div className={classes.root}>
			{messages.map((message, index) => (
				<Snackbar
					key={index}
					anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
					open={show}
					className={classes.snack}
				>
					<SnackbarContent
						className={classes.error}
						message={
							<span className={classes.message}>
								<ErrorIcon className={classes.icon} />
								{message}
							</span>
						}
						action={[
							<IconButton key="close" color="inherit" onClick={() => removeSnack(index)}>
								<CloseIcon />
							</IconButton>
						]}
					/>
				</Snackbar>
			))}
		</div>
	)
}

export default Snack
