import React from 'react'
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

const UnmatchedEmailsModal = props => {
	const {
		closeEmail,
		emailOpened,
		account,
		handleChangeEmail,
		email,
		handleChange,
		checkedSendMail,
		updateEmail,
		emailValid
	} = props

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
					isDisable={emailValid}
					noText="Cancel"
				/>
			</DialogActions>
		</Dialog>
	)
}

export default UnmatchedEmailsModal
