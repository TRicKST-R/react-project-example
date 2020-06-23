import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

const styles = {
	btn: {
		margin: '20px auto',
		display: 'block'
	},
	paper: {
		width: 800,
		margin: '200px auto 0 auto'
	}
}

const NotFound = props => {
	const { classes } = props
	return (
		<Paper className={`paper ${classes.paper}`} elevation={10}>
			<Typography variant="h5" component="h3" align="center">
				Page Not Found 404
			</Typography>
			<Button
				variant="contained"
				color="primary"
				size="large"
				className={classes.btn}
				onClick={() => (window.location.href = '/')}
			>
				Go Home
			</Button>
		</Paper>
	)
}

export default withStyles(styles)(NotFound)
