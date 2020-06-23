import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal'
import YesNo from '../YesNo'
import { useFormInput } from '../../CustomHooks'

const styles = {
	center: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: 40
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		height: 60
	},
	textField: {
		width: 300
	}
}

const SimulateNocModal = props => {
	const { classes, close, send } = props
	const accountNumber = useFormInput('')
	const routingNumber = useFormInput('')
	const accountType = useFormInput('')

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<div>
					<Typography gutterBottom variant="h5" component="h2">
						Simulate transfer NOC
					</Typography>
					<Divider style={{ marginBottom: 40 }} />
					<div className={classes.container}>
						<TextField label="New Account No." {...accountNumber} className={classes.textField} />
						<TextField label="New Routing No." {...routingNumber} className={classes.textField} />
						<TextField label="New Type" {...accountType} className={classes.textField} />
					</div>
					<div className={classes.center}>
						<Typography gutterBottom variant="h6">
							Are you sure you want simulate notice of change for this transfer?
						</Typography>
						<YesNo yes={() => send(accountNumber, routingNumber, accountType)} no={close} />
					</div>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(SimulateNocModal)
