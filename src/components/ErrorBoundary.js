import React, { Component } from 'react'
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

class ErrorBoundary extends Component {
	constructor(props) {
		super(props)
		this.state = { hasError: false, errorMessage: '' }
	}

	componentDidCatch = (error, info) => {
		this.setState({ hasError: true, errorMessage: error.message })
		console.log('error: ' + error)
	}

	render() {
		const { classes } = this.props
		const { hasError, errorMessage } = this.state
		if (hasError && errorMessage) {
			return (
				<Paper className={`paper ${classes.paper}`} elevation={10}>
					<Typography variant="h5" component="h3" align="center">
						Sorry, error occured: {errorMessage}
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="large"
						className={classes.btn}
						onClick={() => (window.location.href = '/')}
					>
						Go back
					</Button>
				</Paper>
			)
		}
		return this.props.children
	}
}

export default withStyles(styles)(ErrorBoundary)
