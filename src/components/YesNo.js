import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import red from '@material-ui/core/colors/red'
import Done from '@material-ui/icons/Done'
import Clear from '@material-ui/icons/Clear'
import { CircularProgress } from '@material-ui/core'

const styles = {
	yes: {
		backgroundColor: green[600],
		color: '#fff',
		margin: 8,
		'&:hover': {
			backgroundColor: green[500]
		}
	},
	no: {
		backgroundColor: red[600],
		color: '#fff',
		margin: 8,
		'&:hover': {
			backgroundColor: red[500]
		}
	},
	rightIcon: {
		marginLeft: 8
	},
	btnWrapper: {
		position: 'relative'
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	btnsContainer: {
		display: 'flex',
		flexWrap: 'wrap'
	}
}

const YesNo = props => {
	const { classes, yes, no, yesText, noText, isDisable, waitingForResponse } = props
	return (
		<div className={classes.btnsContainer}>
			<div className={classes.btnWrapper}>
				<Button
					variant="contained"
					disabled={isDisable ? true : false}
					className={classes.yes}
					onClick={yes}
				>
					{yesText ? yesText : 'Yes'}
					<Done className={classes.rightIcon} />
				</Button>
				{waitingForResponse && <CircularProgress size={24} className={classes.buttonProgress} />}
			</div>
			<Button variant="contained" className={classes.no} onClick={no}>
				{noText ? noText : 'No'}
				<Clear className={classes.rightIcon} />
			</Button>
		</div>
	)
}

export default withStyles(styles)(YesNo)
