import React from 'react'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Dialog from '@material-ui/core/Dialog'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Investigation from '../../ChildTabs/Investigation'
import { Paper } from '@material-ui/core'

const styles = {
	title: {
		marginLeft: 16,
		color: '#fff'
	},
	content: {
		width: 1300,
		margin: '120px auto 40px auto'
	}
}

const ViewAccountModal = props => {
	const { classes, investigationProps } = props

	return (
		<Dialog fullScreen open={true} onClose={props.closeView}>
			<AppBar>
				<Toolbar>
					<IconButton edge="start" color="inherit" onClick={props.closeView}>
						<CloseIcon />
					</IconButton>
					<Typography variant="h6" className={classes.title}>
						Investigation
					</Typography>
				</Toolbar>
			</AppBar>
			<Paper className={classes.content}>
				<Investigation investigationProps={investigationProps} closeModal={props.closeView} />
			</Paper>
		</Dialog>
	)
}

export default withStyles(styles)(ViewAccountModal)
