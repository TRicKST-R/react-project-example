import React, { Component } from 'react'
import { getDMYTFromUtc } from '../utils/DateHelper'
import { SendEmailModal2, ViewAccountModal } from '../components/Modals/index'
import { withStyles } from '@material-ui/styles'
import getChunk, { mutation } from '../utils/GetChunk'
import { SEND_SQS_MESSAGE } from '../root/Mutations'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addSuccess } from '../modules/Success/Success.state'
import { addSnack } from '../modules/Snack/Snack.state'
import { FETCH_REJECTED_ACCOUNT_POST_APEX_MIGRATION } from '../root/Graphql'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'
import Tooltip from '@material-ui/core/Tooltip'
import { push } from 'react-router-redux'
import MUIDataTable from 'mui-datatables'
import DocumentRequested from '../assets/image/DocumentRequested.png'
import RefreshButton from '../components/RefreshButton'

const styles = {
	table: {
		'& td': {
			padding: 8
		},
		'& th': {
			padding: 8
		}
	}
}

class RejectedAccounts extends Component {
	constructor(props) {
		super(props)
		this.state = {
			anchorEl: null,
			viewOpened: false,
			sketch_id: null,
			user_id: null,
			investigation: null,
			account_id: null,
			emailOpened: false,
			res: [],
			sketch_investigation_id: '',
			rowIndex: 0,
			investigationVars: null,
			sprout_status: '',
			refreshIsActive: true,
		}
	}

	componentWillMount() {
		this.makeAPICall()
	}

	makeAPICall = () => {
		this.setState({refreshIsActive: false})
		const account_status = 'rejected'
		getChunk(FETCH_REJECTED_ACCOUNT_POST_APEX_MIGRATION, { account_status }).then(
			({ fetch_rejected_accounts_post_apex_migration }) => {
				// console.log(fetch_rejected_accounts_post_apex_migration)
				if (fetch_rejected_accounts_post_apex_migration) {
					this.setState({ res: fetch_rejected_accounts_post_apex_migration , refreshIsActive: true})
				} else {
					this.setState({ docsFetched: true, refreshIsActive: true })
					this.props.addSnack('GraphQL bad response view documents')
				}
			}
		)
	}

	openView = () => {
		const { rowIndex } = this.state
		const sketch_id = document.getElementById(`row${rowIndex}`)
			? document.getElementById(`row${rowIndex}`).value
			: null
		const variables = {
			user_id: this.state.user_id,
			sketch_id: sketch_id,
			account_id: this.state.account_id
		}
		if (sketch_id) {
			this.setState({ viewOpened: true, investigationVars: variables })
		} else {
			this.props.addSnack('GraphQL bad Request for investigation')
		}
	}

	closeView = () => this.setState({ viewOpened: false })
	closeEmail = () => this.setState({ emailOpened: false })
	handleChange = event => this.setState({ sketch_id: event.target.value })

	emailOpen = (user_id, sprout_id, user_email, sprout_status) =>
		this.setState({ emailOpened: true, user_id, sprout_id, user_email, sprout_status })

	sendSqs = payload => {
		const variables = {
			user_id: this.state.user_id,
			queue_name: 'email_Q',
			payload: JSON.stringify(payload)
		}
		mutation(SEND_SQS_MESSAGE, variables).then(data => {
			if (data.send_sqs_message && data.send_sqs_message.message)
				this.props.addSuccess(data.send_sqs_message.message)
		})

		this.closeEmail()
	}

	setInvestigation = (account, index) =>
		account.sketch_investigation_id && (
			<Select value={account.sketch_investigation_id[0]} id={`row${index}`}>
				{account.sketch_investigation_id.map((id, index) => (
					<MenuItem value={id} key={index}>
						{id}
					</MenuItem>
				))}
			</Select>
		)

	setInvestigationModal = (account, index) => (
		<span style={{ fontSize: '17px' }}>
			<Tooltip title="View" aria-label="add">
				<span>
					<i
						className="fa fa-eye fa-lg"
						style={{ color: '#2196f3' }}
						onClick={() => {
							this.setState(
								{
									user_id: account.user_id,
									account_id: account.account_id,
									rowIndex: index
								},
								() => this.openView()
							)
						}}
					></i>
				</span>
			</Tooltip>
		</span>
	)

	setEmailModal = account => (
		<span style={{ fontSize: '17px' }}>
			<Tooltip title="E-Mail" aria-label="add">
				<span>
					<i
						className="fa fa-envelope-o fa-lg"
						style={{ color: '#2196f3' }}
						aria-hidden="true"
						onClick={() =>
							this.emailOpen(
								account.user_id,
								account.sprout_id,
								account.user_email,
								account.sprout_status
							)
						}
					></i>
				</span>
			</Tooltip>
		</span>
	)

	setclose = account => (
		<span style={{ fontSize: '17px' }}>
			<Tooltip title={account.account_status} aria-label="add">
				<span>
					<i className="fa fa-times-circle-o fa-lg" style={{ color: 'red' }} aria-hidden="true"></i>
				</span>
			</Tooltip>
		</span>
	)
	setDocument = account => (
		<span>
			<Tooltip title={account.sprout_status === '2' ? 'Document Requested' : ''} aria-label="add">
				{account.sprout_status === '2' ? (
					<span>
						<img
							width="25px"
							style={{ marginTop: '6px' }}
							alt="not found"
							src={DocumentRequested}
						/>
					</span>
				) : (
					<></>
				)}
			</Tooltip>
		</span>
	)

	buildNameColumn = account => (
		<a
			href={`/user/${account.user_email},${account.user_id}`}
			target="_blank"
			rel="noopener noreferrer"
			style={{ textDecoration: 'underline', color: 'rgba(0, 0, 0, 0.87)' }}
		>
			{account.user_name}
		</a>
	)

	render() {
		const { classes } = this.props
		const { res } = this.state
		const data = []
		res &&
			res.map((account, index) => {
				const item = [
					getDMYTFromUtc(account.request_time),
					this.buildNameColumn(account),
					account.sprout_name,
					account.user_email,
					account.apex_account_id,
					this.setInvestigation(account, index),
					this.setInvestigationModal(account, index),
					this.setEmailModal(account),
					this.setclose(account),
					this.setDocument(account)
				]
				return data.push(item)
			})

		const sortedData = data.sort((a, b) => new Date(b[0]) - new Date(a[0]))

		const options = {
			filterType: 'checkbox',
			selectableRows: 'none',
			download: false,
			print: false,
			viewColumns: false,
			rowsPerPage: 100,
			customSort: (data, col, order) => {
				let sortedData = []
				if (order === 'asc')
					sortedData = data.sort((a, b) => new Date(a.data[0]) - new Date(b.data[0]))
				else sortedData = data.sort((a, b) => new Date(b.data[0]) - new Date(a.data[0]))
				return sortedData
			}
		}
		const columns = [
			{ name: 'date', label: 'Date', options: { filter: false, sort: true } },
			{ name: 'user_name', label: 'User', options: { filter: false } },
			{ name: 'sprout_name', label: 'Kid', options: { filter: false } },
			{ name: 'user_email', label: 'Email', options: { filter: false } },
			{ name: 'apex_account_id', label: 'Account', options: { filter: false } },
			{ name: 'investigation', label: 'Investigation', options: { filter: false } },
			{ name: '', label: '', options: { filter: false } },
			{ name: '', label: '', options: { filter: false } },
			{ name: '', label: '', options: { filter: false } },
			{ name: '', label: '', options: { filter: false } }
		]

		return (
			<>
				{this.state.viewOpened && (
					<ViewAccountModal
						closeView={this.closeView}
						investigationProps={this.state.investigationVars}
					/>
				)}

				{this.state.emailOpened && (
					<SendEmailModal2
						closeEmail={this.closeEmail}
						sendSqs={this.sendSqs}
						user_email={this.state.user_email}
						user_id={this.state.user_id}
						sprout_id={this.state.sprout_id}
						account_status={this.state.account_status}
						sprout_status={this.state.sprout_status}
						rejected={true}
					/>
				)}

				<MUIDataTable
					title={'Rejected Accounts'}
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

const Styled = withStyles(styles)(RejectedAccounts)

export default connect(
	null,
	dispatch => ({
		addSuccess: bindActionCreators(addSuccess, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch),
		push: bindActionCreators(push, dispatch)
	})
)(Styled)
