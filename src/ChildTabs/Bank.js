import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	InputLabel,
	TextField,
	Tabs,
	Tab
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import { getDMYTFromUtc } from '../utils/DateHelper'
import { formatCurrency } from '../utils/CurrencyHelper'
import { SIMULATE_ACH_NOC, CANCEL_TRANSFER, SIMULATE_ACH_RETURN } from '../root/Graphql'
import { DELETE_FUNDING_SOURCE } from '../root/Mutations'
import { mutation } from '../utils/GetChunk'
import { CancelTransferModal, SimulateNocModal, SimulateReturnModal } from '../components/Modals'
import YesNo from '../components/YesNo'

const styles = {
	root: {
		padding: '24px 40px'
	},
	divider: {
		margin: '24px 0'
	},
	childAvatar: {
		maxWidth: 32,
		maxHeight: 32
	},
	checkbox: {
		color: green[600],
		padding: 0,
		margin: '0 !important',
		'&$checked': {
			color: green[500]
		}
	},
	checked: {},
	p: {
		height: '24px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	infoBlock: {
		maxWidth: 500,
		margin: '0 40px',
		width: '100%'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	table: {
		'& th': {
			whiteSpace: 'nowrap',
			padding: 4
		},
		'& td': {
			padding: 4
		}
	},
	row: {},
	rowmodal: {
		display: 'flex',
		alignItems: 'center',
		width: 500,
		justifyContent: 'space-between',
		flexBasis: '48%'
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	tablist: {
		backgroundColor: '#f3f3f3',
		marginTop: 10,
		marginBottom: 20,
		'& button': {
			minWidth: 100
		}
	},
	tabLabel: {
		fontSize: 11
	}
}

class Bank extends Component {
	constructor(props) {
		super(props)
		this.state = {
			bdTransferId: null,
			transfer: null,
			cancelTransferModalOpen: false,
			simulateNocModalOpen: false,
			simulateReturnModalOpen: false,
			CancelOpened: false,
			comment: '',
			activeTabIndex: 0,
			bank: this.props.banks[0]
		}
	}

	closeCancelTransferModal = () => this.setState({ cancelTransferModalOpen: false })
	cloveSimulateNocModal = () => this.setState({ simulateNocModalOpen: false })
	cloveSimulateReturnModal = () => this.setState({ simulateReturnModalOpen: false })
	openCancel = () => this.setState({ CancelOpened: true })
	cancelModal = () => this.setState({ CancelOpened: false })

	deleteSource = (user_id, account_id, source_id, comment) => {
		const variables = {
			user_id: user_id,
			account_id: account_id,
			source_id: source_id,
			comment: comment || 'cancelled by admin'
		}

		mutation(DELETE_FUNDING_SOURCE, variables).then(data => {
			if (data && data.delete_funding_source && data.delete_funding_source.message) {
				this.props.addSuccess('Deleted!')
				this.setState({ CancelOpened: false })
			} else {
				this.props.addSnack('Delete failed')
				this.setState({ CancelOpened: false })
			}
		})
	}

	cancelTransfer = transfer =>
		this.setState({
			transfer: transfer,
			cancelTransferModalOpen: true
		})

	simulateNoc = bdTransferId =>
		this.setState({
			bdTransferId: bdTransferId,
			simulateNocModalOpen: true
		})

	simulateReturn = bdTransferId =>
		this.setState({
			bdTransferId: bdTransferId,
			simulateReturnModalOpen: true
		})

	callCancelTransferApi = comment => {
		const { userId, accountId } = this.props
		const { transfer } = this.state
		const variables = {
			account_id: accountId,
			user_id: userId,
			transfer_id: transfer.admin.bd_transfer_id,
			comment: comment
		}

		mutation(CANCEL_TRANSFER, variables).then(({ cancel_transfer }) => {
			if (cancel_transfer && cancel_transfer.status) {
				this.props.addSuccess(`${variables.transfer_id} cancellation been submitted`)
				// TODO show the JSON recevied in a table of modal
			} else this.props.addSnack('Submission failed')
			this.setState({ cancelTransferModalOpen: false })
		})
	}

	callSimulateNocApi = (newAccountNo, newAccountType, routingNo) => {
		const { userId, accountId } = this.props
		const { bdTransferId } = this.state
		const variables = {
			account_id: accountId,
			user_id: userId,
			transfer_id: bdTransferId,
			new_account_number: newAccountNo.value,
			new_routing_number: routingNo.value,
			new_bank_account_type: newAccountType.value
		}

		mutation(SIMULATE_ACH_NOC, variables).then(({ simulate_ach_noc }) => {
			if (simulate_ach_noc && simulate_ach_noc.status) {
				this.props.addSucces(`${variables.transfer_id} SIMULATE_ACH_NOC been submitted`)
				// TODO show the JSON recevied in a table of modal
			} else this.props.addSnack('Submission failed')
		})
	}

	callSimulateReturnApi = () => {
		const { userId, accountId } = this.props
		const { bdTransferId } = this.state
		const variables = {
			account_id: accountId,
			user_id: userId,
			transfer_id: bdTransferId
		}

		mutation(SIMULATE_ACH_RETURN, variables).then(({ simulate_ach_return }) => {
			if (simulate_ach_return && simulate_ach_return.status) {
				this.props.addSuccess(`${variables.transfer_id} SIMULATE_ACH_RETURN been submitted`)
				// TODO show the JSON recevied in a table of modal
			} else this.props.addSnack('Submission failed')
		})
	}

	handleInputChange = event => {
		const target = event.target
		const name = target.name
		this.setState({ [name]: target.value })
	}

	render() {
		const { classes } = this.props
		const { bank } = this.state

		return (
			<div className={classes.root}>
				<Dialog open={this.state.CancelOpened} onClose={this.cancelModal}>
					<DialogTitle>Confim Cancel</DialogTitle>
					<DialogContent>
						<InputLabel>Please provide your comments to be sent with Cancel</InputLabel>
						<div className={classes.rowmodal}>
							<TextField
								margin="dense"
								label="(optional)"
								id="comment"
								value={this.state.comment}
								onChange={this.handleInputChange}
								name="comment"
								type="text"
								fullWidth
							/>
						</div>
					</DialogContent>
					<DialogActions>
						<YesNo
							yes={() =>
								this.deleteSource(
									bank.admin.user_id,
									bank.admin.bd_account_id,
									bank.admin.bd_source_id,
									this.state.comment
								)
							}
							no={this.cancelModal}
							yesText="Yes"
							noText="Cancel"
						/>
					</DialogActions>
				</Dialog>
				<div>
					<div style={{ display: 'inline-block', margin: 10 }}>
						<Typography gutterBottom variant="h6" component="h6">
							Bank
						</Typography>
					</div>
					<div style={{ display: 'inline-block', margin: 10 }}>
						<Button variant="outlined" color="primary" onClick={() => this.openCancel()}>
							Cancel
						</Button>
					</div>
				</div>
				{bank && bank.admin && (
					<div className={classes.container}>
						<div className={classes.infoBlock}>
							Account Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_account_id:</span>
								{bank.admin.transfer_transit_link.bd_account_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_account_check_grace_date:</span>
								{getDMYTFromUtc(bank.admin.transfer_transit_link.bd_account_check_grace_date)}
							</Typography>
							<hr className={classes.custHr} />
							Apex Account Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_apex_account_check_time:</span>
								{getDMYTFromUtc(bank.admin.transfer_transit_link.bd_apex_account_check_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_apex_request_date:</span>
								{getDMYTFromUtc(bank.admin.transfer_transit_link.bd_apex_request_date)}
							</Typography>
							<hr className={classes.custHr} />
							User Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>admin.bd_source_id:</span>
								{bank.admin.bd_source_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>sprout_id:</span>
								{bank.sprout_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>user_id:</span>
								{bank.admin.user_id}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							Transfer Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_transfer_id:</span>
								{bank.bd_transfer_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_transfer_request_time:</span>
								{getDMYTFromUtc(bank.bd_transfer_request_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>total_transfers:</span>
								{bank.total_transfers}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>transfer_status:</span>
								{bank.transfer_status}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_transfer_status:</span>
								{bank.admin.bd_transfer_status}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>total_amount:</span>
								{formatCurrency(bank.total_amount)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_transfer_latest_event_time:</span>
								{getDMYTFromUtc(bank.admin.bd_transfer_latest_event_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>type:</span>
								{bank.type}
							</Typography>
						</div>
					</div>
				)}

				<Typography gutterBottom variant="h6" component="h6" style={{ marginTop: 40 }}>
					Transfers
				</Typography>
				<Tabs
					value={this.state.activeTabIndex}
					onChange={(event, value) =>
						this.setState({
							activeTabIndex: value,
							bank: this.props.banks[value]
						})
					}
					indicatorColor="primary"
					textColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					className={classes.tablist}
				>
					{this.props.banks.map(item => (
						<Tab
							label={<span className={classes.tabLabel}>{item.bd_transfer_id}</span>}
							key={item.bd_transfer_id}
						/>
					))}
				</Tabs>
				{bank && bank.transfers && (
					<Table className={classes.table}>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>individual_transfer_amount</TableCell>
								<TableCell align="right">individual_transfer_id</TableCell>
								<TableCell align="right">bd_account_id</TableCell>
								<TableCell align="right">bd_transfer_id</TableCell>
								<TableCell align="right">transfer_reference_id</TableCell>
								<TableCell align="right">Cancel</TableCell>
								{process.env.NODE_ENV !== 'production' && (
									<>
										<TableCell align="right">Simulate NOC</TableCell>
										<TableCell align="right">Simulate Return</TableCell>
									</>
								)}
							</TableRow>
						</TableHead>
						<TableBody>
							{bank.transfers.map((transfer, index) => (
								<TableRow key={index} className={classes.row}>
									<TableCell component="th" scope="row">
										{formatCurrency(transfer.individual_transfer_amount)}
									</TableCell>
									<TableCell align="right">{transfer.individual_transfer_id}</TableCell>
									<TableCell align="right">{transfer.admin.bd_account_id}</TableCell>
									<TableCell align="right">{transfer.admin.bd_transfer_id}</TableCell>
									<TableCell align="right">{transfer.admin.transfer_reference_id}</TableCell>
									<TableCell align="right">
										<Button
											className={classes.btn}
											variant="outlined"
											size="small"
											color="primary"
											onClick={() => this.cancelTransfer(transfer)}
										>
											Cancel
										</Button>
									</TableCell>
									{process.env.NODE_ENV !== 'production' && (
										<>
											<TableCell align="right">
												<Button
													className={classes.btn}
													variant="outlined"
													size="small"
													color="primary"
													onClick={() => this.simulateNoc(transfer.admin.bd_transfer_id)}
												>
													Simulate NOC
												</Button>
											</TableCell>
											<TableCell align="right">
												<Button
													className={classes.btn}
													variant="outlined"
													size="small"
													color="primary"
													onClick={() => this.simulateReturn(transfer.admin.bd_transfer_id)}
												>
													Simulate Return
												</Button>
											</TableCell>
										</>
									)}
								</TableRow>
							))}
						</TableBody>
					</Table>
				)}
				{this.state.cancelTransferModalOpen && (
					<CancelTransferModal
						close={this.closeCancelTransferModal}
						transfer={this.state.transfer}
						send={this.callCancelTransferApi}
					/>
				)}
				{this.state.simulateNocModalOpen && (
					<SimulateNocModal
						close={this.cloveSimulateNocModal}
						bdTransferId={this.state.bdTransferId}
						send={this.callSimulateNocApi}
					/>
				)}
				{this.state.simulateReturnModalOpen && (
					<SimulateReturnModal
						close={this.cloveSimulateReturnModal}
						send={this.callSimulateReturnApi}
					/>
				)}
			</div>
		)
	}
}

export default withStyles(styles)(Bank)
