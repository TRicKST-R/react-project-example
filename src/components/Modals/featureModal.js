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
import { featureKind as docsKind } from '../../config'

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

class FeatureModal extends Component {
	constructor(props) {
		super(props)
		this.state = {
			SHARE_CODE: false,
			GIFT_SEARCH: false,
			flags1: [],
			new_notification: 0,
			optionTagArray: [],
			selectBit: [0, 0],
			currentBit: [0, 0]
		}
	}

	componentWillMount() {
		this.setNotification(this.dec_to_bho(this.props.notification, 'B'))
	}

	setPayloadInterminate = () => {
		const payload = {
			user_id: this.props.user_id,
			queue_name: 'user_Q',
			feature: this.state.new_notification
		}
		this.props.sendSqs(payload)
	}

	setNotification = async number => {
		number = '00' + number

		number = number.substring(number.length - 2)
		const tmpArray = ['SHARE_CODE', 'GIFT_SEARCH']
		let currentBit = [0, 0]
		let SHARE_CODE = false
		let GIFT_SEARCH = false
		if (this.props.notification == 1 || this.props.notification == 3) {
			currentBit[0] = 1
			SHARE_CODE = true
		}
		if (this.props.notification == 2 || this.props.notification == 3) {
			currentBit[1] = 2
			GIFT_SEARCH = true
		}

		this.setState({
			currentBit: currentBit,
			SHARE_CODE,
			GIFT_SEARCH
		})
		// for (var i = number.length; i--; ) {
		// 	if (number[i] === '1') {
		// 		const tmpKey = tmpArray[i]
		// 		this.setState({ [tmpKey]: true })
		// 		const flags = await {
		// 			SHARE_CODE: this.state.SHARE_CODE,
		// 			GIFT_SEARCH: this.state.GIFT_SEARCH,
		// 		}
		// 		const tmp = await this.calculate_notification(docsKind, flags)
		// 		this.setState({ currentBit: tmp.selectBit })
		// 	}
		// }
	}

	calculate_notification = (documents, flags) => {
		const SHARE_CODE = 0 // 0000 0000 0001
		const GIFT_SEARCH = 1 // 0000 0000 0010

		for (const document of documents) {
			flags[document] = true
		}

		let share_code_feature = flags.SHARE_CODE ? 1 : 0
		share_code_feature <<= SHARE_CODE

		let gift_search_feature = flags.GIFT_SEARCH ? 1 : 0
		gift_search_feature <<= GIFT_SEARCH

		const feature = share_code_feature | gift_search_feature

		return {
			notification: feature,
			selectBit: [share_code_feature, gift_search_feature]
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
		}
		//await this.setState({})
		const flags = {
			SHARE_CODE: this.state.SHARE_CODE,
			GIFT_SEARCH: this.state.GIFT_SEARCH
		}
		const tmp = this.calculate_notification(docsKind, flags)
		this.setState({ new_notification: tmp.notification, selectBit: tmp.selectBit })
	}

	render() {
		const { classes, closeEmail, user_email, notification, launched_from } = this.props

		return (
			<Modal open={true} onClose={closeEmail}>
				<Paper className="modalInner" style={{ overflowY: 'unset' }} elevation={20}>
					<h2>Request information from Customer (select the required documents)</h2>
					{launched_from && (
						<div>
							<Divider />
							<br />
							current_feature : {notification} ({this.dec_to_bho(notification, 'B')})
							<br />
							new_feature : {this.state.new_notification} (
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
										<TableCell>current_feature</TableCell>
										{this.state.currentBit.map((doc, index) => (
											<TableCell key={index} style={{ paddingRight: 1 }}>
												{doc}
											</TableCell>
										))}
									</TableRow>
									<TableRow>
										<TableCell>new_feature</TableCell>
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

export default withStyles(styles)(FeatureModal)
