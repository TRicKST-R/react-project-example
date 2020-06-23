import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'

const styles = {}

class SendNotifModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			notification: ''
		}
	}

	setPayloadUser = () => {
		const payload = {
			user_id: this.props.user_id,
			queue_name: 'user_Q',
			notification: this.state.notification
		}
		this.props.sendSqs(payload)
		if (this.state.notification === '1') {
			const payload2 = {}
			payload2.user_id = this.props.user_id
			payload2.queue_name = 'email_Q'
			payload2.template = 'account_esign'
			this.props.sendSqs(payload2)
		}
	}

	setPayloadChild = () => {
		const payload = {
			user_id: this.props.user_id,
			queue_name: 'child_Q',
			notification: this.state.notification
		}
		this.props.sendSqs(payload)
	}

	send = () => {
		if (this.props.recipient === 'user') {
			return this.setPayloadUser()
		}
		if (this.props.recipient === 'child') {
			return this.setPayloadChild()
		}
	}

	onChange = event => this.setState({ notification: event.target.value })

	render() {
		const { closeEmail, current_notification } = this.props

		return (
			<Modal open={true} onClose={closeEmail}>
				<Paper className="modalInner" style={{ overflowY: 'unset' }} elevation={10}>
					<h3>Update user notification flag - {current_notification}</h3>
					<Divider />
					<TextField
						label="new_notification"
						multiline
						margin="normal"
						variant="outlined"
						value={this.state.notification}
						onChange={this.onChange}
					/>
					<br />
					<br />
					<Divider />
					<br />
					current_notification : {current_notification}
					<br />
					<br />
					new_notification : {this.state.notification}
					<br />
					<br />
					<Divider />
					<br />
					<br />
					<Button variant="contained" color="primary" onClick={this.send}>
						Update
					</Button>
				</Paper>
			</Modal>
		)
	}
}

export default withStyles(styles)(SendNotifModal)
