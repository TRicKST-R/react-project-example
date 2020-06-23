import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ArrowUpward from '@material-ui/icons/ArrowUpward'
import ArrowDownward from '@material-ui/icons/ArrowDownward'
import Clear from '@material-ui/icons/Clear'
import {
	Typography,
	Divider,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	Button
} from '@material-ui/core'

import { mutation } from '../../utils/GetChunk'
import { UPDATE_INSTRUCTION } from '../../root/Graphql'
import { SEND_SQS_MESSAGE } from '../../root/Mutations'
import recurring from '../../assets/image/recurring.svg'
import boost from '../../assets/image/boost.png'
import { getDMYTFromUtc, getDMYFromUtc } from '../../utils/DateHelper'
import { formatCurrency } from '../../utils/CurrencyHelper'
import deposit from '../../assets/image/deposit.png'
import withdrawalimg from '../../assets/image/withdrawal.png'
import { CancelTransferModalGoal } from '../../components/Modals'

const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '1px 0'
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
		marginBottom: 15,
		marginTop: 15,
		'& > span': {
			fontWeight: 600,
			marginRight: 4,
			marginTop: 10,
			marginBottom: 10
		}
	},
	infoBlock: {
		maxWidth: 500,
		minWidth: 300,
		margin: '0 8px'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-around',
		marginBottom: 10
	},
	more: {
		display: 'block'
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	summary: {
		'& > div': {
			justifyContent: 'space-between',
			alignItems: 'center',
			textAlign: 'right',
			margin: 0,
			minHeight: 50
		}
	},
	detail: {
		padding: '8px'
	},
	heading: {
		display: 'flex',
		padding: 24,
		'& > p': {
			textAlign: 'center'
		}
	},
	purple: {
		height: 50,
		paddingTop: 8,
		border: '1px solid #8b0092',
		borderRadius: '25px',
		textAlign: 'center'
	}
}

const Transfers = props => {
	const { classes, infoProps, userName, email } = props
	const [tmpData, setTmpData] = useState(null)
	const [amountSort, setAmountSort] = useState(true)
	const [initialDateSort, setInitialDateSort] = useState(true)
	const [arrowFlg, setArrowFlg] = useState(true)
	const [checkedSendMail, setCheckedSendMail] = useState(false)
	const [adminInfo, setAdminInfo] = useState(null)
	const [openCancelRequest, setOpenCancelRequest] = useState(false)
	const [popupMsg, setPopupMsg] = useState('')
	const [popupMsgCheckBox, setPopupMsgCheckBox] = useState('')
	const newArray = []

	useEffect(() => {
		const bothArray = props.transfers.concat(props.withdrawals)

		bothArray.forEach((item, key) => {
			if (Object.keys(item).indexOf('initial_transfer_date') !== -1) {
				item.data = item.initial_transfer_date
				item.statusNew = 'transfer'
				item.stateNew = item.admin.transfer_status
				item.nextData = item.next_transfer_date
				newArray.push(item)
			}
			if (Object.keys(item).indexOf('initial_withdrawal_date') !== -1) {
				item.data = item.initial_withdrawal_date
				item.statusNew = 'withdrawal'
				item.stateNew = item.admin.withdrawal_status
				item.nextData = item.next_withdrawal_date
				newArray.push(item)
			}
		})

		const tmp = newArray
			.sort((a, b) => {
				return new Date(a.initial_request_time) - new Date(b.initial_request_time)
			})
			.reverse()
		setTmpData(tmp)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	const closeCancelRequestModal = () => {
		setAdminInfo(null)
		setOpenCancelRequest(false)
	}
	const OpenCancelRequestModal = (price, frq, type, admin) => {
		setAdminInfo(admin)
		setCheckedSendMail(false)
		let gname = (infoProps && infoProps.info && infoProps.info.name) || ''
		let msg = `Are you sure You want to cancel the ${type} transaction $${price} ${frq} for goal ${gname}?`
		let msgCheck = `Do you want to notify ${userName} on ${email} for cancellation  this transaction ?`
		setPopupMsg(msg)
		setPopupMsgCheckBox(msgCheck)
		setOpenCancelRequest(true)
	}

	const setCencel = argument => {
		let variable = {
			user_id: adminInfo.user_id,
			sprout_id: adminInfo.sprout_id,
			goal_id: adminInfo.goal_id,
			transfer_reference_id: adminInfo.transfer_reference_id,
			action: 'stop'
		}

		mutation(UPDATE_INSTRUCTION, variable).then(data => {
			if (data && data.update_instruction) {
				setOpenCancelRequest(false)
				if (data.update_instruction.status === 'updated') {
					props.addSuccess('Transaction cancel successfully')
					if (checkedSendMail) {
						const variables = {
							user_id: variable.user_id,
							queue_name: 'email_Q',
							payload: JSON.stringify({
								user_id: variable.user_id
							})
						}
						mutation(SEND_SQS_MESSAGE, variables).then(data => {
							if (data && data.send_sqs_message && data.send_sqs_message.message) {
								props.addSuccess(
									`Transaction cancel successfully and ${data.send_sqs_message.message}`
								)
							} else {
								props.addSnack('Something wrong on send mail')
							}
						})
					}
				} else {
					props.addSnack('Something wrong on Transaction cancel')
				}
			} else {
				props.addSnack('Something wrong on Transaction cancel')
			}
		})
	}
	const handleChange = argument => {
		if (argument.target.value) setCheckedSendMail(true)
		else setCheckedSendMail(false)
	}

	const amountOrder = () => {
		if (amountSort) {
			const temp = tmpData.sort((a, b) => a.amount - b.amount).reverse()
			setTmpData(temp)
			setAmountSort(false)
			setArrowFlg(false)
		} else {
			const temp = tmpData.sort((a, b) => a.amount - b.amount)
			setTmpData(temp)
			setAmountSort(true)
			setArrowFlg(false)
		}
	}

	const initialDateOrder = () => {
		if (initialDateSort) {
			const temp = tmpData.sort((a, b) => {
				return new Date(a.initial_request_time) - new Date(b.initial_request_time)
			})

			setTmpData(temp)
			setInitialDateSort(false)
			setArrowFlg(true)
		} else {
			const temp = tmpData
				.sort((a, b) => {
					return new Date(a.initial_request_time) - new Date(b.initial_request_time)
				})
				.reverse()
			setTmpData(temp)
			setInitialDateSort(true)
			setArrowFlg(true)
		}
	}

	const modalProps = {
		openCancelRequest,
		closeCancelRequestModal,
		popupMsg,
		handleChange,
		checkedSendMail,
		popupMsgCheckBox,
		setCencel
	}

	const rowColor = type => {
		const transfer = '#D5EFF7'
		const refund = '#F3D5D3'
		const gift = '#D6EDD5'
		if (type === 'transfer') {
			return transfer
		}
		if (type === 'refund') {
			return refund
		}
		if (type === 'gift') {
			return gift
		}
	}

	return (
		<div style={{ marginTop: 50, marginBottom: 15 }}>
			<div className={classes.heading}>
				<Typography style={{ flexBasis: 64 }}>Action</Typography>
				<Typography style={{ flexBasis: 64 }}>type</Typography>
				<Typography style={{ flexBasis: 72 }}>frequency</Typography>
				<Typography style={{ flexBasis: 156 }}>
					<span onClick={() => initialDateOrder()}>
						request date
						{arrowFlg ? (
							initialDateSort ? (
								<ArrowUpward style={{ fontSize: 15 }} />
							) : (
								<ArrowDownward style={{ fontSize: 15 }} />
							)
						) : null}
					</span>
				</Typography>
				<Typography style={{ flexBasis: 120 }}>
					<span onClick={() => amountOrder()}>
						instruction_amount
						{arrowFlg === false ? (
							amountSort ? (
								<ArrowUpward style={{ fontSize: 15 }} />
							) : (
								<ArrowDownward style={{ fontSize: 15 }} />
							)
						) : null}
					</span>
				</Typography>
				<Typography style={{ flexBasis: 120 }}>
					<span>total_amount</span>
				</Typography>
				<Typography style={{ flexBasis: 120 }}>next date</Typography>
				<Typography style={{ flexBasis: 148 }}>initial date</Typography>
				<Typography style={{ flexBasis: 128 }}>transfer status</Typography>
			</div>
			{tmpData &&
				tmpData.map((transfer, index) => (
					<ExpansionPanel key={index}>
						<ExpansionPanelSummary
							expandIcon={<ExpandMoreIcon />}
							className={classes.summary}
							style={{ backgroundColor: rowColor(transfer.sub_type) }}
						>
							<Typography style={{ width: 50 }}>
								{transfer.stateNew !== 'complete' &&
								transfer.stateNew !== 'bd_transfer_request_placed' ? (
									<span className="tltp" style={{ borderBottom: 'none' }} data-title="cancel">
										<Button
											onClick={() =>
												OpenCancelRequestModal(
													transfer.amount,
													transfer.frequency,
													transfer.statusNew,
													transfer.admin
												)
											}
										>
											<Clear color="error" />
										</Button>
									</span>
								) : null}
							</Typography>
							<Typography
								style={{ width: 50, textAlign: 'center' }}
								className={transfer.sub_type && classes.purple}
							>
								{transfer.statusNew === 'transfer' ? (
									<span
										className="tltp"
										style={{ borderBottom: 'none' }}
										data-title={transfer.statusNew}
									>
										<img alt="not found" src={deposit} />
									</span>
								) : (
									<span
										className="tltp"
										style={{ borderBottom: 'none' }}
										data-title={transfer.statusNew}
									>
										<img alt="not found" src={withdrawalimg} />
									</span>
								)}
							</Typography>
							<Typography
								style={{ width: 50, textAlign: 'center' }}
								className={transfer.sub_type && classes.purple}
							>
								{transfer.frequency === 'once' ? (
									<span
										className="tltp"
										style={{ borderBottom: 'none' }}
										data-title={transfer.frequency}
									>
										<img alt="not found" height="25px" src={boost} />
									</span>
								) : (
									<span
										className="tltp"
										style={{ borderBottom: 'none' }}
										data-title={transfer.frequency}
									>
										<img alt="not found" height="25px" src={recurring} />
									</span>
								)}
							</Typography>
							<Typography style={{ width: 100 }}>
								{getDMYFromUtc(transfer.initial_request_time)}
							</Typography>
							<Typography style={{ width: 100 }}>{formatCurrency(transfer.amount)}</Typography>
							<Typography style={{ width: 100 }}>
								{formatCurrency(transfer.total_amount)}
							</Typography>
							<Typography style={{ width: 100 }}>{getDMYFromUtc(transfer.nextData)}</Typography>
							<Typography style={{ width: 100 }}>{getDMYFromUtc(transfer.data)}</Typography>
							<Typography style={{ width: 100 }}>
								{transfer.statusNew === 'transfer'
									? transfer.admin.transfer_status
									: transfer.admin.withdrawal_status}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.detail}>
							{transfer.statusNew === 'transfer' ? (
								<div key={index} style={{ width: '100%' }}>
									{transfer && transfer.admin && (
										<div className={classes.container}>
											<div className={classes.infoBlock}>
												Time Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_account_lookup_time:</span>
													{transfer.admin.bd_account_lookup_time}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_funding_source_lookup_time:</span>
													{transfer.admin.bd_funding_source_lookup_time}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>eventTime:</span>
													{transfer.admin.eventTime}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>last_updated_request_time:</span>
													{getDMYTFromUtc(transfer.admin.last_updated_request_time)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>next_transfer_date:</span>
													{getDMYTFromUtc(transfer.admin.next_transfer_date)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>initial_transfer_date:</span>
													{getDMYTFromUtc(transfer.initial_transfer_date)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>initial_request_time:</span>
													{getDMYTFromUtc(transfer.initial_request_time)}
												</Typography>
												<hr className={classes.custHr} />
												Id Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_account_id:</span>
													{transfer && transfer.admin && transfer.admin.bd_account_id
														? transfer.admin.bd_account_id
														: null}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>goal_id:</span>
													{transfer.admin.goal_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>source_reference_id:</span>
													{transfer.admin.source_reference_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>sprout_id:</span>
													{transfer.admin.sprout_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>transfer_reference_id:</span>
													{transfer.admin.transfer_reference_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>user_id:</span>
													{transfer.admin.user_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>transfer_reference_id:</span>
													{transfer.transfer_reference_id}
												</Typography>
											</div>
											<div className={classes.infoBlock}>
												Status Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>transfer_status:</span>
													{transfer.admin.transfer_status}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>last_transaction_status:</span>
													{transfer.admin.last_transaction_status}
												</Typography>
												<hr className={classes.custHr} />
												Plaid Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>plaid_access_token:</span>
													<Checkbox
														checked={transfer.admin.plaid_access_token}
														classes={{ root: classes.checkbox, checked: classes.checked }}
													/>
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>plaid_account_id:</span>
													<Checkbox
														checked={transfer.admin.plaid_account_id}
														classes={{ root: classes.checkbox, checked: classes.checked }}
													/>
												</Typography>
												transaction
												<Typography gutterBottom component="p" className={classes.p}>
													<span>source:</span>
													<Checkbox
														checked={transfer.admin.source}
														classes={{ root: classes.checkbox, checked: classes.checked }}
													/>
												</Typography>
												<hr className={classes.custHr} />
												Type Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>event_Type:</span>
													{transfer.admin.event_Type}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>transfer_type:</span>
													{transfer.transfer_type}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>type:</span>
													{transfer.type === 'recurring' ? (
														<span
															className="tltp"
															style={{ borderBottom: 'none' }}
															data-title="recurring"
														>
															<img alt="not found" height="25px" src={recurring} />
														</span>
													) : transfer.type === 'boost' ? (
														<span
															className="tltp"
															style={{ borderBottom: 'none' }}
															data-title="boost"
														>
															<img alt="not found" height="25px" src={boost} />
														</span>
													) : (
														transfer.type
													)}
												</Typography>
												<hr className={classes.custHr} />
												Other Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>initial_transfer_date:</span>
													{transfer.initial_transfer_date}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>amount:</span>
													{formatCurrency(transfer.amount)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>frequency:</span>
													{transfer.frequency}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>version:</span>
													{transfer.version}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>sub_type:</span>
													{transfer.sub_type || 'null'}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>external_reference_id:</span>
													{transfer.external_reference_id || 'null'}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>comments:</span>
													{transfer.comments || 'null'}
												</Typography>
											</div>
										</div>
									)}
									{transfer.transactions.length ? (
										transfer.transactions.map((transaction, index) => (
											<ExpansionPanel key={index} style={{ padding: 0 }}>
												<ExpansionPanelSummary
													expandIcon={<ExpandMoreIcon />}
													className={classes.summary}
												>
													<Typography>
														{getDMYTFromUtc(transaction.individual_transfer_request_time)}
													</Typography>
													<Typography>
														{formatCurrency(transaction.individual_transfer_amount)}
													</Typography>
													<Typography>{transaction.individual_transfer_id}</Typography>
													<Typography>{transaction.individual_transfer_status}</Typography>
												</ExpansionPanelSummary>
												<ExpansionPanelDetails className={classes.detail}>
													<div key={index}>
														<div className={classes.container}>
															<div className={classes.infoBlock}>
																<Typography gutterBottom component="p" className={classes.p}>
																	<span>individual_transfer_amount:</span>
																	{formatCurrency(transaction.individual_transfer_amount)}
																</Typography>
																<Typography gutterBottom component="p" className={classes.p}>
																	<span>individual_transfer_request_time:</span>
																	{getDMYTFromUtc(transaction.individual_transfer_request_time)}
																</Typography>
																<Typography gutterBottom component="p" className={classes.p}>
																	<span>individual_transfer_status:</span>
																	{transaction.individual_transfer_status}
																</Typography>
															</div>
															<div className={classes.infoBlock}>
																<Typography gutterBottom component="p" className={classes.p}>
																	<span>bd_transfer_id:</span>
																	{transaction.admin.bd_transfer_id}
																</Typography>
																<Typography gutterBottom component="p" className={classes.p}>
																	<span>individual_transfer_id:</span>
																	{transaction.individual_transfer_id}
																</Typography>
															</div>
														</div>
														<Typography style={{ fontWeight: 600, marginTop: 40 }}>
															Transactions Details
														</Typography>
														<div className={classes.container}>
															<div className={classes.infoBlock}>
																{transaction && transaction.amount_allocated && (
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell align="right">equity</TableCell>
																				<TableCell>amount</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.amount_allocated.map((amount, index) => (
																				<TableRow key={index}>
																					<TableCell align="right">{amount.equity}</TableCell>
																					<TableCell component="th" scope="row">
																						{formatCurrency(amount.amount)}
																					</TableCell>
																				</TableRow>
																			))}
																		</TableBody>
																	</Table>
																)}
															</div>
															<div className={classes.infoBlock}>
																{transaction && transaction.securities_allocated && (
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell>equity</TableCell>
																				<TableCell align="right">units</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.securities_allocated.map((security, index) => (
																				<TableRow key={index}>
																					<TableCell component="th" scope="row">
																						{security.equity}
																					</TableCell>
																					<TableCell align="right">{security.units}</TableCell>
																				</TableRow>
																			))}
																		</TableBody>
																	</Table>
																)}
															</div>
														</div>
														{transaction.admin.order_link ? (
															<>
																<Typography gutterBottom variant="h6" style={{ marginTop: 40 }}>
																	order_link
																</Typography>
																<Divider className={classes.divider} />
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.order_link.order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_id:</span>
																			{transaction.admin.order_link.bd_transfer_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_transaction_id:</span>
																			{transaction.admin.order_link.individual_transaction_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_status:</span>
																			{transaction.admin.order_link.order_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin.order_link.transaction_type}
																		</Typography>
																	</div>
																</div>
															</>
														) : null}
														{transaction.admin.bd_transfer ? (
															<div>
																<Typography
																	gutterBottom
																	variant="h6"
																	component="h2"
																	style={{ marginTop: 10 }}
																>
																	bd_transfer
																</Typography>
																<Divider className={classes.divider} />
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_id:</span>
																			{transaction.admin.bd_transfer.bd_transfer_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.bd_transfer.bd_account_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_source_id:</span>
																			{transaction.admin.bd_transfer.bd_source_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.bd_transfer.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_apex_account_check_time:</span>
																			{transaction.admin.bd_transfer.bd_apex_account_check_time}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_request_time:</span>
																			{transaction.admin.bd_transfer.bd_transfer_request_time}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_status:</span>
																			{transaction.admin.bd_transfer.bd_transfer_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>total_amount:</span>
																			{transaction.admin.bd_transfer.total_amount}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>type:</span>
																			{transaction.admin.bd_transfer.type}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>total_transfers:</span>
																			{transaction.admin.bd_transfer.total_transfers}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_latest_event_time:</span>
																			{transaction.admin.bd_transfer.bd_transfer_latest_event_time}
																		</Typography>
																	</div>
																</div>
															</div>
														) : null}
														{transaction.admin.transfer_transit_link ? (
															<div>
																<Typography
																	gutterBottom
																	variant="h6"
																	component="h2"
																	style={{ marginTop: 10 }}
																>
																	transfer_transit_link
																</Typography>
																<Divider className={classes.divider} />
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.transfer_transit_link.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.transfer_transit_link.bd_account_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_check_grace_date:</span>
																			{
																				transaction.admin.transfer_transit_link
																					.bd_account_check_grace_date
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_apex_account_check_time:</span>
																			{
																				transaction.admin.transfer_transit_link
																					.bd_apex_account_check_time
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_apex_request_date:</span>
																			{transaction.admin.transfer_transit_link.bd_apex_request_date}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transfer_status:</span>
																			{transaction.admin.transfer_transit_link.transfer_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transfer_status:</span>
																			{transaction.admin.transfer_transit_link.transfer_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>total_amount:</span>
																			{transaction.admin.transfer_transit_link.total_amount}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>total_transfers:</span>
																			{transaction.admin.transfer_transit_link.total_transfers}
																		</Typography>
																	</div>
																</div>
															</div>
														) : null}
														{transaction.admin.order ? (
															<div>
																<Typography
																	gutterBottom
																	variant="h6"
																	component="h2"
																	style={{ marginTop: 10 }}
																>
																	order
																</Typography>
																<Divider className={classes.divider} />
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.order.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.order.bd_account_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>goal_id:</span>
																			{transaction.admin.order.goal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_transaction_id:</span>
																			{transaction.admin.order.individual_transaction_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>instruction_reference_id:</span>
																			{transaction.admin.order.instruction_reference_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.order.order_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_status:</span>
																			{transaction.admin.order.order_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_amount:</span>
																			{formatCurrency(transaction.admin.order.transaction_amount)}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin.order.transaction_type}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_id:</span>
																			{transaction.admin.order.bd_transfer_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin.order.sprout_id}
																		</Typography>
																	</div>
																</div>
															</div>
														) : null}
														{transaction.admin.transaction_security_trade ? (
															<div>
																<Typography
																	gutterBottom
																	variant="h6"
																	component="h2"
																	style={{ marginTop: 11 }}
																>
																	transaction_security_trade
																</Typography>
																<Divider className={classes.divider} />
																{transaction && transaction.admin && (
																	<div className={classes.container}>
																		<div className={classes.infoBlock}>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_account_id:</span>
																				{transaction.admin.transaction_security_trade.bd_account_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_transfer_id:</span>
																				{
																					transaction.admin.transaction_security_trade
																						.bd_transfer_id
																				}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>goal_id:</span>
																				{transaction.admin.transaction_security_trade.goal_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>individual_transaction_id:</span>
																				{
																					transaction.admin.transaction_security_trade
																						.individual_transaction_id
																				}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>instruction_reference_id:</span>
																				{
																					transaction.admin.transaction_security_trade
																						.instruction_reference_id
																				}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>order_id:</span>
																				{transaction.admin.transaction_security_trade.order_id}
																			</Typography>
																		</div>
																		<div className={classes.infoBlock}>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>trade_status:</span>
																				{transaction.admin.transaction_security_trade.trade_status}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>transaction_amount:</span>
																				{formatCurrency(
																					transaction.admin.transaction_security_trade
																						.transaction_amount
																				)}
																			</Typography>

																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>transaction_type:</span>
																				{
																					transaction.admin.transaction_security_trade
																						.transaction_type
																				}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>sprout_id:</span>
																				{transaction.admin.transaction_security_trade.sprout_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>user_id:</span>
																				{transaction.admin.transaction_security_trade.user_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>transaction_security_trade_id:</span>
																				{
																					transaction.admin.transaction_security_trade
																						.transaction_security_trade_id
																				}
																			</Typography>
																		</div>
																	</div>
																)}
																<div className={classes.container} style={{ margin: '40px 0' }}>
																	<div className={classes.infoBlock}>
																		<Table>
																			<TableHead>
																				<TableRow>
																					<TableCell align="right">equity</TableCell>
																					<TableCell>amount</TableCell>
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{transaction.admin.transaction_security_trade.amount_allocated.map(
																					(amount, index) => (
																						<TableRow key={index}>
																							<TableCell align="right">{amount.equity}</TableCell>
																							<TableCell component="th" scope="row">
																								{formatCurrency(amount.amount)}
																							</TableCell>
																						</TableRow>
																					)
																				)}
																			</TableBody>
																		</Table>
																	</div>
																	<div className={classes.infoBlock}>
																		<Table>
																			<TableHead>
																				<TableRow>
																					<TableCell>equity</TableCell>
																					<TableCell align="right">units</TableCell>
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{transaction.admin.transaction_security_trade.securities_allocated.map(
																					(security, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{security.equity}
																							</TableCell>
																							<TableCell align="right">{security.units}</TableCell>
																						</TableRow>
																					)
																				)}
																			</TableBody>
																		</Table>
																	</div>
																</div>
															</div>
														) : (
															<Typography gutterBottom component="p" className={classes.p}>
																transaction.admin.transaction_security_trade is null
															</Typography>
														)}
														{transaction.admin.security_order ? (
															<div>
																<Typography
																	gutterBottom
																	variant="h6"
																	component="h2"
																	style={{ marginTop: 10 }}
																>
																	security_order
																</Typography>
																<Divider className={classes.divider} />
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.security_order.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.security_order.bd_account_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_transfer_id:</span>
																			{transaction.admin.security_order.bd_transfer_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>goal_id:</span>
																			{transaction.admin.security_order.goal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_transaction_id:</span>
																			{transaction.admin.security_order.individual_transaction_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.security_order.order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>security_order_id:</span>
																			{transaction.admin.security_order.security_order_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>security_order_status:</span>
																			{transaction.admin.security_order.security_order_status}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_amount:</span>
																			{formatCurrency(
																				transaction.admin.security_order.transaction_amount
																			)}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin.security_order.transaction_type}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin.security_order.sprout_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_security_trade_id:</span>
																			{
																				transaction.admin.security_order
																					.transaction_security_trade_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transfer_reference_id:</span>
																			{transaction.admin.security_order.transfer_reference_id}
																		</Typography>
																	</div>
																</div>
																<div className={classes.container} style={{ margin: '40px 0' }}>
																	<div className={classes.infoBlock}>
																		<Table>
																			<TableHead>
																				<TableRow>
																					<TableCell align="right">equity</TableCell>
																					<TableCell>amount</TableCell>
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{transaction.admin.security_order.amount_allocated.map(
																					(amount, index) => (
																						<TableRow key={index}>
																							<TableCell align="right">{amount.equity}</TableCell>
																							<TableCell component="th" scope="row">
																								{formatCurrency(amount.amount)}
																							</TableCell>
																						</TableRow>
																					)
																				)}
																			</TableBody>
																		</Table>
																	</div>
																	<div className={classes.infoBlock}>
																		<Table>
																			<TableHead>
																				<TableRow>
																					<TableCell>equity</TableCell>
																					<TableCell align="right">units</TableCell>
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{transaction.admin.security_order.securities_allocated.map(
																					(security, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{security.equity}
																							</TableCell>
																							<TableCell align="right">{security.units}</TableCell>
																						</TableRow>
																					)
																				)}
																			</TableBody>
																		</Table>
																	</div>
																</div>
															</div>
														) : (
															<Typography gutterBottom component="p" className={classes.p}>
																transaction.admin.security_order is null
															</Typography>
														)}
													</div>
												</ExpansionPanelDetails>
											</ExpansionPanel>
										))
									) : (
										<Typography
											gutterBottom
											component="p"
											className={classes.p}
											style={{ marginTop: 80 }}
										>
											No transactions
										</Typography>
									)}
								</div>
							) : (
								<div>
									<div key={index}>
										<div className={classes.container} key={index}>
											<div className={classes.infoBlock}>
												Other Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>amount:</span>
													{transfer.amount}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>frequency:</span>
													{transfer.frequency}
												</Typography>
												<hr className={classes.custHr} />
												Id Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_account_id:</span>
													{transfer.admin.bd_account_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>goal_id:</span>
													{transfer.admin.goal_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>source_id:</span>
													{transfer.admin.source_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>sprout_id:</span>
													{transfer.admin.sprout_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>withdrawal_instruction_id:</span>
													{transfer.admin.withdrawal_instruction_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>user_id:</span>
													{transfer.admin.user_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>portfolio_id:</span>
													{transfer.admin.portfolio_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>source_reference_id:</span>
													{transfer.admin.source_reference_id}
												</Typography>
											</div>
											<div className={classes.infoBlock}>
												Status and Type Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>withdrawal_status:</span>
													{transfer.admin.withdrawal_status}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>instruction_type:</span>
													{transfer.instruction_type}
												</Typography>
												<hr className={classes.custHr} />
												Time Information
												<hr className={classes.custHr} />
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_account_check_time:</span>
													{getDMYTFromUtc(transfer.admin.bd_account_check_time)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>bd_funding_source_check_time:</span>
													{getDMYTFromUtc(transfer.admin.bd_funding_source_check_time)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>last_updated_request_time:</span>
													{getDMYTFromUtc(transfer.admin.last_updated_request_time)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>next_withdrawal_date:</span>
													{transfer.admin.next_withdrawal_date}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>initial_request_time:</span>
													{getDMYTFromUtc(transfer.initial_request_time)}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>initial_withdrawal_date:</span>
													{transfer.initial_withdrawal_date}
												</Typography>
											</div>
										</div>
										<div>
											{transfer.transactions.map((transaction, index) => (
												<ExpansionPanel key={`${index}exp`}>
													<ExpansionPanelSummary
														expandIcon={<ExpandMoreIcon />}
														className={classes.summary}
													>
														<Typography>
															{getDMYTFromUtc(transaction.individual_withdrawal_request_time)}
														</Typography>
														<Typography>{transaction.individual_withdrawal_amount}</Typography>
														<Typography>{transaction.individual_withdrawal_id}</Typography>
														<Typography>{transaction.individual_withdrawal_status}</Typography>
													</ExpansionPanelSummary>
													<ExpansionPanelDetails className={classes.detail}>
														<div key={index} style={{ width: '100%', marginBottom: 40 }}>
															<div className={classes.container}>
																<div className={classes.infoBlock}>
																	<Typography gutterBottom component="p" className={classes.p}>
																		<span>individual_withdrawal_amount:</span>
																		{transaction.individual_withdrawal_amount}
																	</Typography>
																	<Typography gutterBottom component="p" className={classes.p}>
																		<span>individual_withdrawal_status:</span>
																		{transaction.individual_withdrawal_status}
																	</Typography>
																</div>
																<div className={classes.infoBlock}>
																	<Typography gutterBottom component="p" className={classes.p}>
																		<span>individual_withdrawal_request_time:</span>
																		{getDMYTFromUtc(transaction.individual_withdrawal_request_time)}
																	</Typography>
																	<Typography gutterBottom component="p" className={classes.p}>
																		<span>individual_withdrawal_id:</span>
																		{transaction.individual_withdrawal_id}
																	</Typography>
																</div>
															</div>

															<div className={classes.container} style={{ marginBottom: 40 }}>
																<div className={classes.infoBlock}>
																	{transaction && transaction.amount_allocated && (
																		<Table>
																			<TableHead>
																				<TableRow>
																					<TableCell align="right">equity</TableCell>
																					<TableCell>amount</TableCell>
																				</TableRow>
																			</TableHead>
																			<TableBody>
																				{transaction.amount_allocated &&
																					transaction.amount_allocated.map((amount, index) => (
																						<TableRow key={index}>
																							<TableCell align="right">{amount.equity}</TableCell>
																							<TableCell component="th" scope="row">
																								{amount.amount}
																							</TableCell>
																						</TableRow>
																					))}
																			</TableBody>
																		</Table>
																	)}
																</div>
																<div className={classes.infoBlock}>
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell>equity</TableCell>
																				<TableCell align="right">units</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.securities_allocated &&
																				transaction.securities_allocated.map((security, index) => (
																					<TableRow key={index}>
																						<TableCell component="th" scope="row">
																							{security.equity}
																						</TableCell>
																						<TableCell align="right">{security.units}</TableCell>
																					</TableRow>
																				))}
																		</TableBody>
																	</Table>
																</div>
															</div>

															<Typography gutterBottom variant="h6" component="h2">
																order_link
															</Typography>
															<Divider className={classes.divider} />

															{transaction.admin && transaction.admin.order_link && (
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_transaction_id:</span>
																			{transaction.admin.order_link.individual_transaction_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_id:</span>
																			{transaction.admin.order_link.individual_withdrawal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.order_link.order_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_status:</span>
																			{transaction.admin.order_link.order_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{transaction.admin.order_link.withdrawal_instruction_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin.order_link.transaction_type}
																		</Typography>
																	</div>
																</div>
															)}
															{transaction.admin.bd_transfer ? (
																<div>
																	<Typography
																		gutterBottom
																		variant="h6"
																		component="h2"
																		style={{ marginTop: 10 }}
																	>
																		bd_transfer
																	</Typography>
																	<Divider className={classes.divider} />
																	<div className={classes.container}>
																		<div className={classes.infoBlock}>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_transfer_id:</span>
																				{transaction.admin.bd_transfer.bd_transfer_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_account_id:</span>
																				{transaction.admin.bd_transfer.bd_account_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_source_id:</span>
																				{transaction.admin.bd_transfer.bd_source_id}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>user_id:</span>
																				{transaction.admin.bd_transfer.user_id}
																			</Typography>

																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_transfer_request_time:</span>
																				{transaction.admin.bd_transfer.bd_transfer_request_time}
																			</Typography>
																		</div>
																		<div className={classes.infoBlock}>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_transfer_status:</span>
																				{transaction.admin.bd_transfer.bd_transfer_status}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>type:</span>
																				{transaction.admin.bd_transfer.type}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>total_amount:</span>
																				{transaction.admin.bd_transfer.total_amount}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>total_transfers:</span>
																				{transaction.admin.bd_transfer.total_transfers}
																			</Typography>
																			<Typography gutterBottom component="p" className={classes.p}>
																				<span>bd_transfer_latest_event_time:</span>
																				{
																					transaction.admin.bd_transfer
																						.bd_transfer_latest_event_time
																				}
																			</Typography>
																		</div>
																	</div>
																</div>
															) : null}
															<Typography gutterBottom variant="h6" component="h2">
																order
															</Typography>
															<Divider className={classes.divider} />
															{transaction.admin && transaction.admin.order && (
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.bd_account_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>goal_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.goal_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.individual_withdrawal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.sprout_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_status:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.order_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_amount:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.individual_withdrawal_amount}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.transaction_type}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{transaction.admin &&
																				transaction.admin.order &&
																				transaction.admin.order.withdrawal_instruction_id}
																		</Typography>
																	</div>
																</div>
															)}
															<Typography
																gutterBottom
																variant="h6"
																component="h2"
																style={{ marginTop: 10 }}
															>
																transaction_security_trade
															</Typography>
															<Divider className={classes.divider} />
															{transaction.admin.transaction_security_trade && (
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_transaction_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.individual_transaction_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.transaction_security_trade.bd_account_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>Goal id:</span>
																			{transaction.admin.transaction_security_trade.goal_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.individual_withdrawal_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.transaction_security_trade.order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin.transaction_security_trade.sprout_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>source_reference_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.source_reference_id
																			}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.withdrawal_instruction_id
																			}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>trade_status:</span>
																			{transaction.admin.transaction_security_trade.trade_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_amount:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.individual_withdrawal_amount
																			}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.transaction_type
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>current_portfolio_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.current_portfolio_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_security_trade_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.transaction_security_trade_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.transaction_security_trade.user_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{
																				transaction.admin.transaction_security_trade
																					.withdrawal_instruction_id
																			}
																		</Typography>
																	</div>
																</div>
															)}
															<div className={classes.container} style={{ margin: '40px 0' }}>
																<div className={classes.infoBlock}>
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell>equity</TableCell>
																				<TableCell align="right"> amount</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.admin.transaction_security_trade &&
																				transaction.admin.transaction_security_trade.amount_allocated.map(
																					(amount, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{amount.equity}
																							</TableCell>
																							<TableCell align="right">{amount.amount}</TableCell>
																						</TableRow>
																					)
																				)}
																		</TableBody>
																	</Table>
																</div>
																<div className={classes.infoBlock}>
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell>equity</TableCell>
																				<TableCell align="right">units</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.admin.transaction_security_trade &&
																				transaction.admin.transaction_security_trade.securities_allocated.map(
																					(security, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{security.equity}
																							</TableCell>
																							<TableCell align="right">{security.units}</TableCell>
																						</TableRow>
																					)
																				)}
																		</TableBody>
																	</Table>
																</div>
															</div>
															<Typography
																gutterBottom
																variant="h6"
																component="h2"
																style={{ marginTop: 10 }}
															>
																security_order
															</Typography>
															<Divider className={classes.divider} />
															{transaction.admin && transaction.admin.security_order && (
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.security_order.bd_account_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>goal_id:</span>
																			{transaction.admin.security_order.goal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_id:</span>
																			{transaction.admin.security_order.individual_withdrawal_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>order_id:</span>
																			{transaction.admin.security_order.order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>security_order_id:</span>
																			{transaction.admin.security_order.security_order_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin.security_order.sprout_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.security_order.user_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>security_order_status:</span>
																			{transaction.admin.security_order.security_order_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_amount:</span>
																			{transaction.admin.security_order.transaction_amount}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_type:</span>
																			{transaction.admin.security_order.transaction_type}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transfer_reference_id:</span>
																			{transaction.admin.security_order.transfer_reference_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>current_portfolio_id:</span>
																			{transaction.admin.security_order.current_portfolio_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{transaction.admin.security_order.withdrawal_instruction_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>transaction_security_trade_id:</span>
																			{
																				transaction.admin.security_order
																					.transaction_security_trade_id
																			}
																		</Typography>
																	</div>
																</div>
															)}

															<div className={classes.container} style={{ margin: '40px 0' }}>
																<div className={classes.infoBlock}>
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell> equity</TableCell>
																				<TableCell align="right">amount</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.admin.security_order &&
																				transaction.admin.security_order.amount_allocated.map(
																					(amount, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{amount.equity}
																							</TableCell>
																							<TableCell align="right">{amount.amount}</TableCell>
																						</TableRow>
																					)
																				)}
																		</TableBody>
																	</Table>
																</div>
																<div className={classes.infoBlock}>
																	<Table>
																		<TableHead>
																			<TableRow>
																				<TableCell>equity</TableCell>
																				<TableCell align="right">units</TableCell>
																			</TableRow>
																		</TableHead>
																		<TableBody>
																			{transaction.admin.security_order &&
																				transaction.admin.security_order.securities_allocated.map(
																					(security, index) => (
																						<TableRow key={index}>
																							<TableCell component="th" scope="row">
																								{security.equity}
																							</TableCell>
																							<TableCell align="right">{security.units}</TableCell>
																						</TableRow>
																					)
																				)}
																		</TableBody>
																	</Table>
																</div>
															</div>

															<Typography
																gutterBottom
																variant="h6"
																component="h2"
																style={{ marginTop: 10 }}
															>
																withdrawal_transaction
															</Typography>
															<Divider className={classes.divider} />
															{transaction.admin && transaction.admin.withdrawal_transaction && (
																<div className={classes.container}>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>sprout_id:</span>
																			{transaction.admin.withdrawal_transaction.sprout_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>user_id:</span>
																			{transaction.admin.withdrawal_transaction.user_id}
																		</Typography>

																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_instruction_id:</span>
																			{
																				transaction.admin.withdrawal_transaction
																					.withdrawal_instruction_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>source_reference_id:</span>
																			{transaction.admin.withdrawal_transaction.source_reference_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>bd_account_id:</span>
																			{transaction.admin.withdrawal_transaction.bd_account_id}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>goal_id:</span>
																			{transaction.admin.withdrawal_transaction.goal_id}
																		</Typography>
																	</div>
																	<div className={classes.infoBlock}>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_amount:</span>
																			{
																				transaction.admin.withdrawal_transaction
																					.individual_withdrawal_amount
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_status:</span>
																			{transaction.admin.withdrawal_transaction.withdrawal_status}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>withdrawal_date:</span>
																			{transaction.admin.withdrawal_transaction.withdrawal_date}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>current_portfolio_id:</span>
																			{
																				transaction.admin.withdrawal_transaction
																					.current_portfolio_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>individual_withdrawal_id:</span>
																			{
																				transaction.admin.withdrawal_transaction
																					.individual_withdrawal_id
																			}
																		</Typography>
																		<Typography gutterBottom component="p" className={classes.p}>
																			<span>source_id:</span>
																			{transaction.admin.withdrawal_transaction.source_id}
																		</Typography>
																	</div>
																</div>
															)}
														</div>
													</ExpansionPanelDetails>
												</ExpansionPanel>
											))}
										</div>
									</div>
								</div>
							)}
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))}

			<CancelTransferModalGoal {...modalProps} />
		</div>
	)
}

export default withStyles(styles)(Transfers)
