import React, { Component } from 'react'
import { withStyles } from '@material-ui/styles'
import getChunk, { mutation } from '../utils/GetChunk'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addSuccess } from '../modules/Success/Success.state'
import { addSnack } from '../modules/Snack/Snack.state'
import { FETCH_EMAIL_UNMATCHED_USERS, UPDATE_EMAIL } from '../root/Graphql'
import Tooltip from '@material-ui/core/Tooltip'
import { push } from 'react-router-redux'
import MUIDataTable from 'mui-datatables'
import UnmatchedEmailsModal from '../components/Modals/UnmatchedEmailsModal'
import CreateIcon from '@material-ui/icons/Create'
import Button from '@material-ui/core/Button'
import RefreshButton from '../components/RefreshButton'

const styles = {
	table: {
		'& td': {
			padding: 8
		},
		'& th': {
			padding: 8
		},
		'& > div:nth-child(1)': {
			'& > div:nth-child(2)': {
				display: 'flex',
				justifyContent: 'flex-end',
				'& > button:nth-child(2)': {
					order: 1
				},
				'& > button:nth-child(1)': {
					order: 2
				},
				'& > span': {
					order: 3
				}
			}
		}
	}
}

class UnmatchedEmails extends Component {
	constructor(props) {
		super(props)
		this.state = {
			account: [],
			email: '',
			emailOpened: false,
			checkedSendMail: false,
			res: [],
			emailValid: false,
			refreshIsActive: true,
		}
	}

	componentWillMount() {
		this.makeAPICall()
	}

	makeAPICall = () => {
		this.setState({refreshIsActive: false})
		getChunk(FETCH_EMAIL_UNMATCHED_USERS).then(data => {
			if (data && data.fetch_unmatched_emails) {
				this.setState({ res: data.fetch_unmatched_emails, refreshIsActive: true })
			} else {
				this.setState({ docsFetched: true, refreshIsActive: true })
				this.props.addSnack('GraphQL bad response on fetch unmatched emails')
			}
		})
	}

	closeEmail = () => this.setState({ emailOpened: false, checkedSendMail: false })

	emailOpen = account => this.setState({ emailOpened: true, account: account, emailValid: false })

	updateEmail = () => {
		//this.props.addSuccess(`Call email update query `)
		const variable = {
			user_id: this.state.account.user_id,
			updated_email: this.state.email,
			send_verification_email: this.state.checkedSendMail
		}
		mutation(UPDATE_EMAIL, variable).then(data => {
			if (data && data.update_email && data.update_email.is_successfully_updated === 'true') {
				this.props.addSuccess(`Email Update successfully`)
				this.setState({ emailOpened: false, checkedSendMail: false })
			} else {
				this.props.addSnack('GraphQL bad response,Something wrong on update E-mail')
			}
		})
	}

	handleChangeEmail = e => {
		let emailValid = e.target.value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i)
		emailValid = emailValid ? false : true
		this.setState({ email: e.target.value, emailValid: emailValid })
	}

	handleChange = argument => {
		if (argument.target.value) this.setState({ checkedSendMail: !this.state.checkedSendMail })
		else this.setState({ checkedSendMail: false })
	}

	updateButton = account => (
		<span>
			<Tooltip title="Update">
				<Button variant="outlined" onClick={() => this.emailOpen(account)} color="primary">
					<CreateIcon />
				</Button>
			</Tooltip>
		</span>
	)

	buildNameColumn = account => (
		<a
			href={`/user/${account.email},${account.user_id}`}
			target="_blank"
			rel="noopener noreferrer"
			style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.87)' }}
		>
			{account.email}
		</a>
	)

	render() {
		const { classes } = this.props
		const { res } = this.state
		const data = []
		res &&
			res.map((account, index) => {
				const item = [
					this.buildNameColumn(account),
					account.first_name,
					account.last_name,
					account.phone,
					account.email_verified,
					this.updateButton(account)
				]
				return data.push(item)
			})

		const modalProps = {
			closeEmail: this.closeEmail,
			emailOpen: this.emailOpen,
			emailOpened: this.state.emailOpened,
			account: this.state.account,
			handleChangeEmail: this.handleChangeEmail,
			email: this.email,
			checkedSendMail: this.state.checkedSendMail,
			handleChange: this.handleChange,
			updateEmail: this.updateEmail,
			emailValid: this.state.emailValid
		}

		const sortedData = data.sort((a, b) => new Date(b[0]) - new Date(a[0]))

		const options = {
			filterType: 'checkbox',
			selectableRows: 'none',
			download: false,
			print: false,
			viewColumns: false,
			rowsPerPage: 100,
		}
		const columns = [
			{ name: 'email', label: 'E-mail', options: { filter: false, sort: true } },
			{ name: 'first_name', label: 'First Name', options: { filter: false } },
			{ name: 'last_name', label: 'Last Name', options: { filter: false } },
			{ name: 'phone', label: 'Phone', options: { filter: false } },
			{ name: 'email_verified', label: 'Email Verified', options: { filter: false } },
			{ name: '', label: '', options: { filter: false } }
		]

		return (
			<>
				<UnmatchedEmailsModal {...modalProps} />
				<MUIDataTable
					title={'Unmatched Emails'}
					data={sortedData}
					columns={columns}
					options={options}
					className={classes.table}
				/>
				<RefreshButton func={this.makeAPICall} isActive={this.state.refreshIsActive} />
			</>
		)
	}
}

const Styled = withStyles(styles)(UnmatchedEmails)

export default connect(
	null,
	dispatch => ({
		addSuccess: bindActionCreators(addSuccess, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch),
		push: bindActionCreators(push, dispatch)
	})
)(Styled)
