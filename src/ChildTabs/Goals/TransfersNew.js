import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { formatCurrency } from '../../utils/CurrencyHelper'
import Checkbox from '@material-ui/core/Checkbox'
import deposit from '../../assets/image/deposit.png'
import React from 'react'

const styles = {
	root: {
		marginTop: 40,
		marginBottom: 8
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
		minWidth: 300
	},
	container: {
		display: 'flex',
		justifyContent: 'space-around',
		marginBottom: 16,
		width: '100%'
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
			textAlign: 'right'
		}
	},
	detail: {
		padding: '8px',
		flexWrap: 'wrap'
	}
}

const Transfers = props => {
	const { classes, transfers } = props

	return (
		<div className={classes.root}>
			{transfers ? (
				transfers.map((transfer, index) => (
					<ExpansionPanel key={index}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
							<img alt="not found" src={deposit} />
							<Typography style={{ width: 215 }} className="p">
								<span>initial_transfer_date:</span>
								{transfer.initial_transfer_date}
							</Typography>
							<Typography style={{ width: 100 }} className="p">
								<span>amount:</span>
								{formatCurrency(transfer.amount)}
							</Typography>
							<Typography style={{ width: 100 }} className="p">
								<span>frequency:</span>
								{transfer.frequency}
							</Typography>
							<Typography style={{ width: 215 }} className="p">
								<span>next_transfer_date:</span>
								{transfer.next_transfer_date}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.detail}>
							<div className={classes.container} key={index}>
								<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
									<span className="customTitle">Status Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>transfer_status:</span>
										{transfer.admin.transfer_status}
									</Typography>
									<Typography className="p" style={{ marginBottom: 16 }}>
										<span>last_transaction_status:</span>
										{transfer.admin.last_transaction_status}
									</Typography>

									<span className="customTitle">Plaid Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>plaid_access_token:</span>
										<Checkbox
											checked={transfer.admin.plaid_access_token}
											classes={{ root: classes.checkbox, checked: classes.checked }}
										/>
									</Typography>
									<Typography className="p">
										<span>plaid_account_id:</span>
										<Checkbox
											checked={transfer.admin.plaid_account_id}
											classes={{ root: classes.checkbox, checked: classes.checked }}
										/>
									</Typography>
									<Typography className="p" style={{ marginBottom: 16 }}>
										<span>source:</span>
										<Checkbox
											checked={transfer.admin.source}
											classes={{ root: classes.checkbox, checked: classes.checked }}
										/>
									</Typography>
									<span className="customTitle">Type Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>event_Type:</span>
										{transfer.admin.event_Type}
									</Typography>
									<Typography className="p">
										<span>transfer_type:</span>
										{transfer.transfer_type}
									</Typography>
									<Typography className="p" style={{ marginBottom: 16 }}>
										<span>type:</span>
										{transfer.type}
									</Typography>
									<span className="customTitle">Other Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>initial_transfer_date:</span>
										{transfer.initial_transfer_date}
									</Typography>
									<Typography className="p">
										<span>amount:</span>
										{formatCurrency(transfer.amount)}
									</Typography>
									<Typography className="p">
										<span>frequency:</span>
										{transfer.frequency}
									</Typography>
									<Typography className="p">
										<span>version:</span>
										{transfer.version}
									</Typography>
								</div>
								<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
									<span className="customTitle">Time Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>bd_account_lookup_time:</span>
										{transfer.admin.bd_account_lookup_time}
									</Typography>
									<Typography className="p">
										<span>bd_funding_source_lookup_time:</span>
										{transfer.admin.bd_funding_source_lookup_time}
									</Typography>
									<Typography className="p">
										<span>eventTime:</span>
										{transfer.admin.eventTime}
									</Typography>
									<Typography className="p">
										<span>last_updated_request_time:</span>
										{getDMYTFromUtc(transfer.admin.last_updated_request_time)}
									</Typography>
									<Typography className="p">
										<span>next_transfer_date:</span>
										{getDMYTFromUtc(transfer.admin.next_transfer_date)}
									</Typography>
									<Typography className="p" style={{ marginBottom: 16 }}>
										<span>initial_request_time:</span>
										{getDMYTFromUtc(transfer.initial_request_time)}
									</Typography>
									<span className="customTitle">Id Information</span>
									<Divider className="divider" />
									<Typography className="p">
										<span>bd_account_id:</span>
										{transfer && transfer.admin && transfer.admin.bd_account_id
											? transfer.admin.bd_account_id
											: 'null'}
									</Typography>
									<Typography className="p">
										<span>goal_id:</span>
										{transfer.admin.goal_id}
									</Typography>
									<Typography className="p">
										<span>source_reference_id:</span>
										{transfer.admin.source_reference_id}
									</Typography>
									<Typography className="p">
										<span>sprout_id:</span>
										{transfer.admin.sprout_id}
									</Typography>
									<Typography className="p">
										<span>transfer_reference_id:</span>
										{transfer.admin.transfer_reference_id}
									</Typography>
									<Typography className="p">
										<span>user_id:</span>
										{transfer.admin.user_id}
									</Typography>
									<Typography className="p">
										<span>transfer_reference_id:</span>
										{transfer.transfer_reference_id}
									</Typography>
								</div>
							</div>
							{transfer.transactions.length ? (
								transfer.transactions.map((transaction, index) => (
									<ExpansionPanel key={index} style={{ padding: 0, width: '100%' }}>
										<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											className={classes.summary}
										>
											<Typography className="tltp" data-title="individual_transfer_request_time">
												{getDMYTFromUtc(transaction.individual_transfer_request_time)}
											</Typography>
											<Typography className="tltp" data-title="individual_transfer_amount">
												{formatCurrency(transaction.individual_transfer_amount)}
											</Typography>
											<Typography className="tltp" data-title="individual_transfer_id">
												{transaction.individual_transfer_id}
											</Typography>
											<Typography className="tltp" data-title="individual_transfer_status">
												{transaction.individual_transfer_status}
											</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails className={classes.detail}>
											<div
												key={index}
												style={{ width: '100%', margin: '40px auto 16px auto', maxWidth: 854 }}
											>
												<span className="customTitle">Transfer Info</span>
												<Divider className="divider" />
												<div
													className={classes.container}
													style={{ justifyContent: 'space-between' }}
												>
													<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
														<Typography className="p">
															<span>individual_transfer_amount:</span>
															{formatCurrency(transaction.individual_transfer_amount)}
														</Typography>
														<Typography className="p">
															<span>individual_transfer_request_time:</span>
															{getDMYTFromUtc(transaction.individual_transfer_request_time)}
														</Typography>
														<Typography className="p">
															<span>individual_transfer_status:</span>
															{transaction.individual_transfer_status}
														</Typography>
													</div>
													<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
														<Typography className="p">
															<span>bd_transfer_id:</span>
															{transaction.admin.bd_transfer_id}
														</Typography>
														<Typography className="p">
															<span>individual_transfer_id:</span>
															{transaction.individual_transfer_id}
														</Typography>
													</div>
												</div>
												<div className={classes.container} style={{ marginBottom: 40 }}>
													<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
														{transaction && transaction.amount_allocated && (
															<Table>
																<TableHead>
																	<TableRow>
																		<TableCell>equity</TableCell>
																		<TableCell align="right">amount</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	{transaction.amount_allocated.map((amount, index) => (
																		<TableRow key={index}>
																			<TableCell>{amount.equity}</TableCell>
																			<TableCell align="right">
																				{formatCurrency(amount.amount)}
																			</TableCell>
																		</TableRow>
																	))}
																</TableBody>
															</Table>
														)}
													</div>
													<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
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
																			<TableCell>{security.equity}</TableCell>
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
														<span className="customTitle">Order link</span>
														<Divider className="divider" />
														<div
															className={classes.container}
															style={{ justifyContent: 'space-between' }}
														>
															<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
																<Typography className="p">
																	<span>order_status:</span>
																	{transaction.admin.order_link.order_status}
																</Typography>
																<Typography className="p">
																	<span>transaction_type:</span>
																	{transaction.admin.order_link.transaction_type}
																</Typography>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
																<Typography className="p">
																	<span>order_id:</span>
																	{transaction.admin.order_link.order_id}
																</Typography>
																<Typography className="p">
																	<span>bd_transfer_id:</span>
																	{transaction.admin.order_link.bd_transfer_id}
																</Typography>
																<Typography className="p">
																	<span>individual_transaction_id:</span>
																	{transaction.admin.order_link.individual_transaction_id}
																</Typography>
															</div>
														</div>
													</>
												) : null}
												{transaction.admin.order ? (
													<div>
														<span className="customTitle">Order</span>
														<Divider className="divider" />
														<div
															className={classes.container}
															style={{ justifyContent: 'space-between' }}
														>
															<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
																<Typography className="p">
																	<span>order_status:</span>
																	{transaction.admin.order.order_status}
																</Typography>
																<Typography className="p">
																	<span>transaction_amount:</span>
																	{formatCurrency(transaction.admin.order.transaction_amount)}
																</Typography>
																<Typography className="p">
																	<span>transaction_type:</span>
																	{transaction.admin.order.transaction_type}
																</Typography>
																<Typography className="p">
																	<span>user_id:</span>
																	{transaction.admin.order.user_id}
																</Typography>
																<Typography className="p">
																	<span>sprout_id:</span>
																	{transaction.admin.order.sprout_id}
																</Typography>
																<Typography className="p">
																	<span>goal_id:</span>
																	{transaction.admin.order.goal_id}
																</Typography>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
																<Typography className="p">
																	<span>bd_transfer_id:</span>
																	{transaction.admin.order.bd_transfer_id}
																</Typography>
																<Typography className="p">
																	<span>bd_account_id:</span>
																	{transaction.admin.order.bd_account_id}
																</Typography>
																<Typography className="p">
																	<span>individual_transaction_id:</span>
																	{transaction.admin.order.individual_transaction_id}
																</Typography>
																<Typography className="p">
																	<span>instruction_reference_id:</span>
																	{transaction.admin.order.instruction_reference_id}
																</Typography>
																<Typography className="p">
																	<span>order_id:</span>
																	{transaction.admin.order.order_id}
																</Typography>
															</div>
														</div>
													</div>
												) : null}
												{transaction.admin.transaction_security_trade ? (
													<>
														<span className="customTitle">transaction_security_trade</span>
														<Divider className="divider" />
														<div
															className={classes.container}
															style={{ justifyContent: 'space-between' }}
														>
															<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
																<Typography className="p">
																	<span>trade_status:</span>
																	{transaction.admin.transaction_security_trade.trade_status}
																</Typography>
																<Typography className="p">
																	<span>transaction_amount:</span>
																	{formatCurrency(
																		transaction.admin.transaction_security_trade.transaction_amount
																	)}
																</Typography>
																<Typography className="p">
																	<span>transaction_type:</span>
																	{transaction.admin.transaction_security_trade.transaction_type}
																</Typography>
																<Typography className="p">
																	<span>sprout_id:</span>
																	{transaction.admin.transaction_security_trade.sprout_id}
																</Typography>
																<Typography className="p">
																	<span>user_id:</span>
																	{transaction.admin.transaction_security_trade.user_id}
																</Typography>
																<Typography className="p">
																	<span>goal_id:</span>
																	{transaction.admin.transaction_security_trade.goal_id}
																</Typography>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
																<Typography className="p">
																	<span>transaction_security_trade_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.transaction_security_trade_id
																	}
																</Typography>
																<Typography className="p">
																	<span>bd_account_id:</span>
																	{transaction.admin.transaction_security_trade.bd_account_id}
																</Typography>
																<Typography className="p">
																	<span>bd_transfer_id:</span>
																	{transaction.admin.transaction_security_trade.bd_transfer_id}
																</Typography>
																<Typography className="p">
																	<span>individual_transaction_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.individual_transaction_id
																	}
																</Typography>
																<Typography className="p">
																	<span>instruction_reference_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.instruction_reference_id
																	}
																</Typography>
																<Typography className="p">
																	<span>order_id:</span>
																	{transaction.admin.transaction_security_trade.order_id}
																</Typography>
															</div>
														</div>

														<div className={classes.container} style={{ marginBottom: 40 }}>
															<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
																<Table>
																	<TableHead>
																		<TableRow>
																			<TableCell>equity</TableCell>
																			<TableCell align="right">amount</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{transaction.admin.transaction_security_trade.amount_allocated.map(
																			(amount, index) => (
																				<TableRow key={index}>
																					<TableCell>{amount.equity}</TableCell>
																					<TableCell align="right">
																						{formatCurrency(amount.amount)}
																					</TableCell>
																				</TableRow>
																			)
																		)}
																	</TableBody>
																</Table>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
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
																					<TableCell>{security.equity}</TableCell>
																					<TableCell align="right">{security.units}</TableCell>
																				</TableRow>
																			)
																		)}
																	</TableBody>
																</Table>
															</div>
														</div>
													</>
												) : (
													<Typography gutterBottom component="p" className={classes.p}>
														transaction.admin.transaction_security_trade is null
													</Typography>
												)}
												{transaction.admin.security_order ? (
													<>
														<span className="customTitle">Security Order</span>
														<Divider className="divider" />
														<div
															className={classes.container}
															style={{ justifyContent: 'space-between' }}
														>
															<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
																<Typography className="p">
																	<span>security_order_status:</span>
																	{transaction.admin.security_order.security_order_status}
																</Typography>
																<Typography className="p">
																	<span>transaction_amount:</span>
																	{formatCurrency(
																		transaction.admin.security_order.transaction_amount
																	)}
																</Typography>
																<Typography className="p">
																	<span>transaction_type:</span>
																	{transaction.admin.security_order.transaction_type}
																</Typography>
																<Typography className="p">
																	<span>sprout_id:</span>
																	{transaction.admin.security_order.sprout_id}
																</Typography>
																<Typography className="p">
																	<span>user_id:</span>
																	{transaction.admin.security_order.user_id}
																</Typography>
																<Typography className="p">
																	<span>goal_id:</span>
																	{transaction.admin.security_order.goal_id}
																</Typography>
																<Typography className="p">
																	<span>order_id:</span>
																	{transaction.admin.security_order.order_id}
																</Typography>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
																<Typography className="p">
																	<span>transaction_security_trade_id:</span>
																	{transaction.admin.security_order.transaction_security_trade_id}
																</Typography>
																<Typography className="p">
																	<span>transfer_reference_id:</span>
																	{transaction.admin.security_order.transfer_reference_id}
																</Typography>
																<Typography className="p">
																	<span>bd_account_id:</span>
																	{transaction.admin.security_order.bd_account_id}
																</Typography>
																<Typography className="p">
																	<span>bd_transfer_id:</span>
																	{transaction.admin.security_order.bd_transfer_id}
																</Typography>
																<Typography className="p">
																	<span>individual_transaction_id:</span>
																	{transaction.admin.security_order.individual_transaction_id}
																</Typography>
																<Typography className="p">
																	<span>security_order_id:</span>
																	{transaction.admin.security_order.security_order_id}
																</Typography>
															</div>
														</div>
														<div className={classes.container} style={{ marginBottom: 16 }}>
															<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
																<Table>
																	<TableHead>
																		<TableRow>
																			<TableCell>equity</TableCell>
																			<TableCell align="right">amount</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{transaction.admin.security_order.amount_allocated.map(
																			(amount, index) => (
																				<TableRow key={index}>
																					<TableCell>{amount.equity}</TableCell>
																					<TableCell align="right">
																						{formatCurrency(amount.amount)}
																					</TableCell>
																				</TableRow>
																			)
																		)}
																	</TableBody>
																</Table>
															</div>
															<div className={classes.infoBlock} style={{ flexBasis: 280 }}>
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
																					<TableCell>{security.equity}</TableCell>
																					<TableCell align="right">{security.units}</TableCell>
																				</TableRow>
																			)
																		)}
																	</TableBody>
																</Table>
															</div>
														</div>
													</>
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
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))
			) : (
				<span className="customTitle">Transfers is null</span>
			)}
		</div>
	)
}

export default withStyles(styles)(Transfers)
