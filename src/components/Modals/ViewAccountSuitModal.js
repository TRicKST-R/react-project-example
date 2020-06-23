import React from 'react'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'

const styles = {
	p: {
		height: '24px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	center: {
		width: 500,
		margin: '0 auto'
	},
	btn: {
		display: 'block',
		margin: '40px auto 0 auto'
	}
}

const ViewInvestProfileModal = props => {
	const { close, data, classes } = props
	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 40 }}>
					Account Suitability
				</Typography>
				<Divider style={{ marginBottom: 40 }} />
				<div className={classes.center}>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>time_horizon:</span> {data.time_horizon}
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>liquidity_needs:</span> {data.liquidity_needs}
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={close}
						className={classes.btn}
					>
						Close
					</Button>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(ViewInvestProfileModal)
