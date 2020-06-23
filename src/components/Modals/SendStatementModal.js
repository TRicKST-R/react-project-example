import React from 'react'
import { Dialog, DialogActions, DialogContent } from '@material-ui/core'
import YesNo from '../YesNo'
import { TextField } from '@material-ui/core'

const SendStatementModal = props => {
	const {
		closeEmailModal,
		popupMsg,
		rowArray,
		newEmail,
		sendMailtoUser,
		emailMoadalOpen,
		handleChangeEmail
	} = props

	let payload = rowArray.map(item => {
		const date = item.date
		const url = item.url
		return {
			date: date,
			url: url
		}
	})

	return (
		<Dialog open={emailMoadalOpen} onClose={closeEmailModal}>
			<DialogContent>
				<h3>{popupMsg}</h3>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<ul>
						{rowArray.map((item, index) => (
							<li key={index} style={{ wordBreak: 'break-all' }}>
								{item.url}
							</li>
						))}
					</ul>
				</div>
				<TextField
					id="standard-name"
					label="Email"
					value={newEmail}
					onChange={handleChangeEmail}
					margin="normal"
				/>
			</DialogContent>
			<DialogActions>
				<YesNo
					yes={() => sendMailtoUser(payload, newEmail)}
					no={closeEmailModal}
					yesText="Send"
					noText="Cancel"
				/>
			</DialogActions>
		</Dialog>
	)
}

export default SendStatementModal
