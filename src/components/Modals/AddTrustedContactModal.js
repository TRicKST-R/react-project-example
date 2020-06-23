import React, { useState } from 'react'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useFormInput } from '../../CustomHooks'
import { withStyles } from '@material-ui/core/styles'
import Divider from '@material-ui/core/Divider'

const styles = {
	textField: {
		margin: 16,
		width: 300
	},
	formContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	error: {
		color: 'red',
		fontSize: 14
	},
	btn: {
		margin: 8
	},
	center: {
		display: 'flex',
		justifyContent: 'center'
	}
}

const AddTrustedContactModal = props => {
	const { classes, close, send } = props
	//const { phoneNo, fName, lName, email, openAddTrustedModal, error, line_1, line_2, state, city, postal_code, country } = this.state

	const [errors, setErrors] = useState('')

	const firstName = useFormInput('')
	const lastName = useFormInput('')
	const email = useFormInput('')
	const phoneNumber = useFormInput('')
	const line1 = useFormInput('')
	const line2 = useFormInput('')
	const city = useFormInput('')
	const state = useFormInput('')
	const country = useFormInput('')
	const postalCode = useFormInput('')

	const confirm = () => {
		if (firstName.value === '') setErrors('First Name is required')
		else if (lastName.value === '') setErrors('Last Name is required')
		else if (email.value === '' && phoneNumber.value === '')
			setErrors('Email Or Phone number is required')
		//else if (phoneNumber.value === '') setErrors('Phone Number Name is required')
		else {
			setErrors('')
			send(firstName.value, lastName.value, email.value, phoneNumber.value)
		}
	}

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<h2>Add a trusted contact</h2>
				<Divider style={{ marginBottom: 16 }} />
				<p className={classes.error}>{errors}</p>
				<div className={classes.formContainer}>
					<TextField
						label="First Name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						required
						{...firstName}
					/>
					<TextField
						label="Last Name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						required
						{...lastName}
					/>
					<TextField
						label="Email"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						required
						{...email}
					/>
					<TextField
						label="Phone Number"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						required
						{...phoneNumber}
					/>
					<TextField
						label="Line1"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...line1}
					/>
					<TextField
						label="Line2"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...line2}
					/>
					<TextField
						label="City"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...city}
					/>
					<TextField
						label="State"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...state}
					/>
					<TextField
						label="Country"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...country}
					/>
					<TextField
						label="Postal Code"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...postalCode}
					/>
				</div>
				<div className={classes.center}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={confirm}
						className={classes.btn}
					>
						ADD
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

export default withStyles(styles)(AddTrustedContactModal)
