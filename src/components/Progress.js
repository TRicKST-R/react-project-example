import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = {
	progress: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center',
		height: 60,
		marginBottom: 40
	}
}

const Progress = ({ classes }) => (
	<div className={classes.progress}>
		<CircularProgress />
	</div>
)

export default withStyles(styles)(Progress)
