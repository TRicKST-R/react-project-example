import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import Modal from '@material-ui/core/Modal'
import Checkbox from '@material-ui/core/Checkbox'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { green } from '@material-ui/core/colors'
import { docsKind } from '../../config'
import { mutation } from '../../utils/GetChunk'
import { SEND_SQS_MESSAGE } from '../../root/Mutations'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addSuccess } from '../../modules/Success/Success.state'

const styles = {
	checkbox: {
		color: green[400],
		'&$checked': {
			color: green[600]
		}
	},
	checked: {},
	row: {
		display: 'flex',
		alignItems: 'center',
		width: 500,
		justifyContent: 'space-between',
		flexBasis: '48%'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	}
}

class SendEmailModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			DRIVERS_LICENSE: false,
			STATE_ID_CARD: false,
			SIGNATURE_IMAGE: false,
			AFFLIATED_DOCUMENT: false,
			PASSPORT: false,
			SSN_CARD: false,
			DOCUMENT: false,
			flags1: [],

			SSA_LETTER: false,
			MILITARY_ID: false,
			IRS_ITIN_LETTER: false,
			CDD_DOCUMENT: false,
			OTHER_GOVERNMENT_ID: false,
			ALL_PASSING_CIP_RESULTS: false,
			new_notification: 0,
			optionTagArray: [],
			selectBit: [0, 0, 0, 0, 0, 0, 0],
			currentBit: [0, 0, 0, 0, 0, 0, 0]
		}
	}

	componentWillMount() {
		this.setNotification(this.dec_to_bho(this.props.notification, 'B'))
	}

	sendSqs = payload => {
		const variables = {
			user_id: this.props.user_id,
			queue_name: 'email_Q',

			payload: JSON.stringify(payload)
		}
		mutation(SEND_SQS_MESSAGE, variables).then(data => {
			if (data.send_sqs_message && data.send_sqs_message.message)
				this.props.addSuccess(data.send_sqs_message.message)
		})

		this.props.closeEmail()
	}

	setPayloadInterminate = () => {
		let payload = {}
		payload.template = 'account_document_required'
		payload.user_id = this.props.user_id
		payload.sprout_id = this.props.sprout_id
		payload.queue_name = 'email_Q'
		payload.status = this.props.sprout_status
		payload.document = []
		docsKind.map(doc => {
			if (this.state[doc.name]) payload.document.push(doc.name)
			return true
		})

		this.sendSqs(payload)

		this.props.closeModal && this.props.closeModal()
	}

	setNotification = async number => {
		number = '0000000' + number

		number = number.substring(number.length - 7)
		const tmpArray = [
			'DOCUMENT',
			'LETTER',
			'OTHER_GOVERNMENT_ID',
			'SSN_CARD',
			'PASSPORT',
			'DRIVERS_LICENSE',
			'SIGNATURE_IMAGE'
		]
		for (var i = number.length; i--; ) {
			if (number[i] === '1') {
				const tmpKey = tmpArray[i]
				this.setState({ [tmpKey]: true })
				const flags = await {
					SIGNATURE_IMAGE: this.state.SIGNATURE_IMAGE,
					DRIVERS_LICENSE: this.state.DRIVERS_LICENSE,
					PASSPORT: this.state.PASSPORT,
					SSN_CARD: this.state.SSN_CARD,
					OTHER_GOVERNMENT_ID: this.state.OTHER_GOVERNMENT_ID,
					AFFLIATED_DOCUMENT: this.state.LETTER,
					DOCUMENT: this.state.DOCUMENT
				}
				const tmp = await this.calculate_notification(docsKind, flags)
				this.setState({ currentBit: tmp.selectBit })
			}
		}
	}

	calculate_notification = (documents, flags) => {
		const SIGNATURE_IMAGE = 0 // 0000 0000 0001
		const DRIVERS_LICENSE = 1 // 0000 0000 0010
		const PASSPORT = 2 // 0000 0000 0100
		const SSN_CARD = 3 // 0000 0000 1000
		const OTHER_GOVERNMENT_ID = 4 // 0000 0001 0000
		const LETTER = 5 // 0000 0010 0000
		const DOCUMENT = 6 // 0000 0100 0000

		for (const document of documents) {
			flags[document] = true
		}

		let signature_image_notification = flags.SIGNATURE_IMAGE ? 1 : 0
		signature_image_notification <<= SIGNATURE_IMAGE

		let drivers_license_notification = flags.DRIVERS_LICENSE ? 1 : 0
		drivers_license_notification <<= DRIVERS_LICENSE

		let passport_notification = flags.PASSPORT ? 1 : 0
		passport_notification <<= PASSPORT

		let ssn_card_notification = flags.SSN_CARD ? 1 : 0
		ssn_card_notification <<= SSN_CARD

		let other_goverment_id_notification = flags.OTHER_GOVERNMENT_ID ? 1 : 0
		other_goverment_id_notification <<= OTHER_GOVERNMENT_ID

		let letter_notification = flags.AFFLIATED_DOCUMENT ? 1 : 0
		letter_notification <<= LETTER

		let document_notifiction = flags.DOCUMENT ? 1 : 0
		document_notifiction <<= DOCUMENT

		const notification =
			signature_image_notification |
			drivers_license_notification |
			passport_notification |
			ssn_card_notification |
			other_goverment_id_notification |
			letter_notification |
			document_notifiction

		return {
			notification: notification,
			selectBit: [
				signature_image_notification,
				drivers_license_notification,
				passport_notification,
				ssn_card_notification,
				other_goverment_id_notification,
				letter_notification,
				document_notifiction
			]
		}
	}

	dec_to_bho = (n, base) => {
		if (n < 0) {
			n = 0xffffffff + n + 1
		}
		switch (base) {
			case 'B':
				return parseInt(n, 10).toString(2)
			default:
				return 'Wrong input.........'
		}
	}

	handleTagCheckBoxClick = async e => {
		if (e.target.checked) {
			await this.setState({
				optionTagArray: this.state.optionTagArray.concat(e.target.value),
				[e.target.name]: e.target.checked
			})
		} else {
			const array = [...this.state.optionTagArray] // make a separate copy of the array
			const index = array.indexOf(e.target.value)
			if (index !== -1) {
				array.splice(index, 1)
				await this.setState({ optionTagArray: array, [e.target.name]: e.target.checked })
			} else {
				await this.setState({ [e.target.name]: e.target.checked })
			}
			//await this.setState({})
			/*const flags = {
				SIGNATURE_IMAGE: this.state.SIGNATURE_IMAGE,
				DRIVERS_LICENSE: this.state.DRIVERS_LICENSE,
				PASSPORT: this.state.PASSPORT,
				SSN_CARD: this.state.SSN_CARD,
				OTHER_GOVERNMENT_ID: this.state.OTHER_GOVERNMENT_ID,
				AFFLIATED_DOCUMENT: this.state.AFFLIATED_DOCUMENT,
				DOCUMENT: this.state.DOCUMENT
			}
			console.log("flags",flags)
			const tmp = await this.calculate_notification(docsKind, flags)
			await this.setState({ new_notification: tmp.notification, selectBit: tmp.selectBit })*/
		}
		//await this.setState({})
		const flags = {
			SIGNATURE_IMAGE: this.state.SIGNATURE_IMAGE,
			DRIVERS_LICENSE: this.state.DRIVERS_LICENSE,
			PASSPORT: this.state.PASSPORT,
			SSN_CARD: this.state.SSN_CARD,
			OTHER_GOVERNMENT_ID: this.state.OTHER_GOVERNMENT_ID,
			AFFLIATED_DOCUMENT: this.state.AFFLIATED_DOCUMENT,
			DOCUMENT: this.state.DOCUMENT
		}
		const tmp = this.calculate_notification(docsKind, flags)
		this.setState({ new_notification: tmp.notification, selectBit: tmp.selectBit })
	}

	render() {
		const { classes, user_email, notification, launched_from } = this.props

		return (
			<Modal open={true} onClose={() => this.props.closeEmail(false)}>
				<Paper className="modalInner" style={{ overflowY: 'unset' }} elevation={20}>
					<h2>Request information from Customer (select the required documents)</h2>
					{launched_from && (
						<div>
							<Divider />
							<br />
							current_notification : {notification} ({this.dec_to_bho(notification, 'B')})
							<br />
							new_notification : {this.state.new_notification} (
							{this.dec_to_bho(this.state.new_notification, 'B')})
							<br />
							<br />
							<Divider />
							<Table>
								<TableBody>
									<TableRow>
										<TableCell></TableCell>
										{docsKind.map((doc, index) => (
											<TableCell key={index} style={{ paddingRight: 1 }}>
												{[doc.name]}
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>current_notification</TableCell>
										{this.state.currentBit.map((doc, index) => (
											<TableCell key={index} style={{ paddingRight: 1 }}>
												{doc}
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>new_notification</TableCell>
										{this.state.selectBit.map((doc, index) => (
											<TableCell key={index} style={{ paddingRight: 1 }}>
												{doc}
											</TableCell>
										))}
									</TableRow>
								</TableBody>
							</Table>
						</div>
					)}

					<div className={classes.container} style={{ overflowY: 'unset' }}>
						{docsKind.map((doc, index) => (
							<div key={index} className={classes.row}>
								<Typography component="p">
									{doc.description}
									{doc.name}
								</Typography>
								<Checkbox
									checked={this.state[doc.name]}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
									color="primary"
									value={doc.description}
									name={doc.name}
									onChange={this.handleTagCheckBoxClick}
								/>
							</div>
						))}
					</div>
					<Button
						variant="contained"
						color="primary"
						onClick={this.props.rejected ? this.setPayloadInterminate : this.setPayloadInterminate}
					>
						{launched_from ? (
							<div>Update {this.state.new_notification}</div>
						) : (
							<div>Send e-mail to {user_email}</div>
						)}
					</Button>
				</Paper>
			</Modal>
		)
	}
}

const Styled = withStyles(styles)(SendEmailModal)

export default connect(
	null,
	dispatch => ({
		addSuccess: bindActionCreators(addSuccess, dispatch)
	})
)(Styled)
