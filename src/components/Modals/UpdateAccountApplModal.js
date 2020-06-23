import React from 'react'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useFormInput } from '../../CustomHooks'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

const styles = {
	textField: {
		margin: 24,
		width: 200
	},
	formContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center'
	},
	btn: {
		margin: 8
	},
	center: {
		display: 'flex',
		justifyContent: 'center'
	}
}

const UpdateAccountApplModal = props => {
	const { classes, close, send, applicant_id } = props

	const firstCust = useFormInput('')
	const middleCust = useFormInput('')
	const lastCust = useFormInput('')

	const firstMinor = useFormInput('')
	const middleMinor = useFormInput('')
	const lastMinor = useFormInput('')

	const applicants = [
		{
			applicant_type: 'custodian',
			applicant_id,
			name: {
				first: firstCust.value,
				middle: middleCust.value,
				last: lastCust.value
			}
		},
		{
			applicant_type: 'minor',
			applicant_id,
			name: {
				first: firstMinor.value,
				middle: middleMinor.value,
				last: lastMinor.value
			}
		}
	]

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<h2>Update Account Applicants</h2>
				<Divider style={{ marginBottom: 40 }} />
				<div className={classes.formContainer}>
					<h3 className={classes.textField}>Custodian</h3>
					<TextField
						label="first_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...firstCust}
					/>
					<TextField
						label="middle_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...middleCust}
					/>
					<TextField
						label="last_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...lastCust}
					/>
				</div>
				<div className={classes.formContainer}>
					<h3 className={classes.textField}>Minor</h3>
					<TextField
						label="first_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...firstMinor}
					/>
					<TextField
						label="middle_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...middleMinor}
					/>
					<TextField
						label="last_name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...lastMinor}
					/>
				</div>
				<div className={classes.center}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => {
							send(applicants)
							close()
						}}
						className={classes.btn}
					>
						Update
					</Button>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={close}
						className={classes.btn}
					>
						Cancel
					</Button>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(UpdateAccountApplModal)
