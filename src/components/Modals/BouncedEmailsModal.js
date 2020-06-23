import React, { useState, useEffect } from 'react'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Typography,
	Checkbox,
	FormHelperText,
	FormControl
} from '@material-ui/core'
import YesNo from '../YesNo'
import { TextField } from '@material-ui/core'

const BouncedEmailsModal = props => {
	const [disable, setDisable] = useState(false)
	const {
		closeEmail,
		emailOpened,
		account,
		handleChangeEmail,
		email,
		handleChange,
		checkedSendMail,
		updateEmail,
		emailValid,
		waitingForResponse
	} = props

	useEffect(() => {
		disableLogic()
	})

	const disableLogic = () => {
		if (emailValid) {
			setDisable(true)
		} else {
			setDisable(false)
			if (waitingForResponse) {
				setDisable(true)
			} else {
				setDisable(false)
			}
		}
	}

	return (
		<Dialog open={emailOpened} onClose={closeEmail}>
			<DialogTitle>
				Update {account.first_name} {account.last_name} email address
			</DialogTitle>
			<DialogContent>
				<div>
					<div>
						<Typography variant="subtitle2" gutterBottom>
							Email address: {account.email}
						</Typography>
					</div>
					<div>
						<div>
							<FormControl error={emailValid}>
								<TextField
									id="standard-name"
									label="New email address"
									value={email}
									onChange={handleChangeEmail}
									margin="normal"
									error={emailValid}
									placeholder="New email address"
								/>
								{emailValid && (
									<FormHelperText id="component-error-text">Enter Valid E-mail</FormHelperText>
								)}
							</FormControl>
						</div>
						<div style={{ display: 'flex', alignItems: 'center' }}>
							<Checkbox onChange={handleChange} value={checkedSendMail} color="primary" />
							<p style={{ margin: '0px 0 0 0' }}>
								Send verification email to {account.first_name} {account.last_name}
							</p>
						</div>
					</div>
				</div>
			</DialogContent>
			<DialogActions>
				<YesNo
					yes={() => updateEmail()}
					no={closeEmail}
					yesText="Save"
					isDisable={disable}
					noText="Cancel"
					waitingForResponse={waitingForResponse}
				/>
			</DialogActions>
		</Dialog>
	)
}

export default BouncedEmailsModal
