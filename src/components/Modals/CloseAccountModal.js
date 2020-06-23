import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Modal from '@material-ui/core/Modal'
import YesNo from '../YesNo'

const styles = {
	center: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: 40
	}
}

const CloseAccountModal = props => {
	const { classes, close, send } = props

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<div>
					<Typography gutterBottom variant="h5" component="h2">
						Close Account
					</Typography>
					<Divider style={{ marginBottom: 40 }} />
					<div className={classes.center}>
						<Typography gutterBottom variant="h6">
							Are you sure you want to close account?
							<br />
							This action is non recoverable, please confirm!
						</Typography>
						<YesNo
							yes={() => {
								send()
								close()
							}}
							no={close}
						/>
					</div>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(CloseAccountModal)
