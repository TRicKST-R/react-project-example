import React from 'react'
import { Checkbox, Dialog, DialogActions, DialogContent } from '@material-ui/core'
import YesNo from '../YesNo'

const CancelTransferModalGoal = props => {
	const {
		openCancelRequest,
		closeCancelRequestModal,
		popupMsg,
		popupMsgCheckBox,
		handleChange,
		checkedSendMail,
		setCencel
	} = props
	return (
		<Dialog open={openCancelRequest} onClose={closeCancelRequestModal}>
			<DialogContent>
				<h3>{popupMsg}</h3>
				<div style={{ display: 'flex', alignItems: 'center' }}>
					<Checkbox onChange={handleChange} value={checkedSendMail} color="primary" />
					<p style={{ margin: '18px 0 0 0' }}>{popupMsgCheckBox}</p>
				</div>
			</DialogContent>
			<DialogActions>
				<YesNo
					yes={() => setCencel('true')}
					no={closeCancelRequestModal}
					yesText="Submit"
					noText="Cancel"
				/>
			</DialogActions>
		</Dialog>
	)
}

export default CancelTransferModalGoal
