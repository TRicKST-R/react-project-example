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
import withdrawalimg from '../../assets/image/withdrawal.png'
import React from 'react'

const styles = {
	root: {
		marginBottom: 16
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
	},
	panel: {
		width: '100%'
	}
}

const Transfers = props => {
	const { classes, withdrawals } = props

	return (
		<div className={classes.root}>
			{withdrawals ? (
				withdrawals.map((transfer, index) => (
					<ExpansionPanel key={index}>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
							<img alt="not found" src={withdrawalimg} />
							<Typography style={{ width: 215 }} className="p">
								<span>initial_withdrawal_date: </span>
								{transfer.initial_withdrawal_date}
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
								<span>next_withdrawal_date:</span>
								{transfer.next_withdrawal_date}
							</Typography>
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.detail}>
							<div className={classes.container} key={index}>
								<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
									<span className="customTitle">Time Information</span>
									<Divider className="divider" />
									<Typography gutterBottom component="p" className="p">
										<span>bd_account_check_time:</span>
										{getDMYTFromUtc(transfer.admin.bd_account_check_time)}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>bd_funding_source_check_time:</span>
										{getDMYTFromUtc(transfer.admin.bd_funding_source_check_time)}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>last_updated_request_time:</span>
										{getDMYTFromUtc(transfer.admin.last_updated_request_time)}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>next_withdrawal_date:</span>
										{transfer.admin.next_withdrawal_date}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>initial_request_time:</span>
										{getDMYTFromUtc(transfer.initial_request_time)}
									</Typography>
									<Typography gutterBottom component="p" className="p lastP">
										<span>initial_withdrawal_date:</span>
										{transfer.initial_withdrawal_date}
									</Typography>
									<span className="customTitle">Status and Type Information</span>
									<Divider className="divider" />
									<Typography gutterBottom component="p" className="p">
										<span>withdrawal_status:</span>
										{transfer.admin.withdrawal_status}
									</Typography>
									<Typography gutterBottom component="p" className="p lastP">
										<span>instruction_type:</span>
										{transfer.instruction_type}
									</Typography>
								</div>
								<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
									<span className="customTitle">Other Information</span>
									<Divider className="divider" />
									<Typography gutterBottom component="p" className="p">
										<span>amount:</span>
										{formatCurrency(transfer.amount)}
									</Typography>
									<Typography gutterBottom component="p" className="p lastP">
										<span>frequency:</span>
										{transfer.frequency}
									</Typography>
									<span className="customTitle">Id Information</span>
									<Divider className="divider" />
									<Typography gutterBottom component="p" className="p">
										<span>bd_account_id:</span>
										{transfer.admin.bd_account_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>goal_id:</span>
										{transfer.admin.goal_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>source_id:</span>
										{transfer.admin.source_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>sprout_id:</span>
										{transfer.admin.sprout_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>withdrawal_instruction_id:</span>
										{transfer.admin.withdrawal_instruction_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>user_id:</span>
										{transfer.admin.user_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>portfolio_id:</span>
										{transfer.admin.portfolio_id}
									</Typography>
									<Typography gutterBottom component="p" className="p">
										<span>source_reference_id:</span>
										{transfer.admin.source_reference_id}
									</Typography>
								</div>
							</div>
							{transfer &&
								transfer.transactions &&
								transfer.transactions.map((transaction, index) => (
									<ExpansionPanel key={`${index}exp`} className={classes.panel}>
										<ExpansionPanelSummary
											expandIcon={<ExpandMoreIcon />}
											className={classes.summary}
										>
											<Typography className="tltp" data-title="individual_withdrawal_request_time">
												{getDMYTFromUtc(transaction.individual_withdrawal_request_time)}
											</Typography>
											<Typography className="tltp" data-title="individual_withdrawal_amount">
												{formatCurrency(transaction.individual_withdrawal_amount)}
											</Typography>
											<Typography className="tltp" data-title="individual_withdrawal_id">
												{transaction.individual_withdrawal_id}
											</Typography>
											<Typography className="tltp" data-title="individual_withdrawal_status">
												{transaction.individual_withdrawal_status}
											</Typography>
										</ExpansionPanelSummary>
										<ExpansionPanelDetails className={classes.detail}>
											<div
												key={index}
												style={{ width: '100%', margin: '16px auto', maxWidth: 854 }}
											>
												<span className="customTitle">Withdrawal Info</span>
												<Divider className="divider" />
												<div
													className={classes.container}
													style={{ justifyContent: 'space-between' }}
												>
													<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
														<Typography className="p">
															<span>individual_withdrawal_amount:</span>
															{formatCurrency(transaction.individual_withdrawal_amount)}
														</Typography>
														<Typography className="p">
															<span>individual_withdrawal_status:</span>
															{transaction.individual_withdrawal_status}
														</Typography>
													</div>
													<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
														<Typography className="p">
															<span>individual_withdrawal_request_time:</span>
															{getDMYTFromUtc(transaction.individual_withdrawal_request_time)}
														</Typography>
														<Typography className="p">
															<span>individual_withdrawal_id:</span>
															{transaction.individual_withdrawal_id}
														</Typography>
													</div>
												</div>

												<div className={classes.container} style={{ marginBottom: 40 }}>
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
														{transaction && transaction.amount_allocated && (
															<Table>
																<TableHead>
																	<TableRow>
																		<TableCell>equity</TableCell>
																		<TableCell align="right">amount</TableCell>
																	</TableRow>
																</TableHead>
																<TableBody>
																	{transaction.amount_allocated &&
																		transaction.amount_allocated.map((amount, index) => (
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
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
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
																			<TableCell>{security.equity}</TableCell>
																			<TableCell align="right">{security.units}</TableCell>
																		</TableRow>
																	))}
															</TableBody>
														</Table>
													</div>
												</div>

												<span className="customTitle">Order Link</span>
												<Divider className="divider" />
												{transaction.admin && transaction.admin.order_link && (
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
																<span>individual_transaction_id:</span>
																{transaction.admin.order_link.individual_transaction_id}
															</Typography>
															<Typography className="p">
																<span>individual_withdrawal_id:</span>
																{transaction.admin.order_link.individual_withdrawal_id}
															</Typography>
															<Typography className="p">
																<span>withdrawal_instruction_id:</span>
																{transaction.admin.order_link.withdrawal_instruction_id}
															</Typography>
															<Typography className="p">
																<span>order_id:</span>
																{transaction.admin.order_link.order_id}
															</Typography>
														</div>
													</div>
												)}

												<span className="customTitle">Order</span>
												<Divider className="divider" />
												{transaction && transaction.admin && transaction.admin.order && (
													<div
														className={classes.container}
														style={{ justifyContent: 'space-between' }}
													>
														<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
															<Typography className="p">
																<span>individual_withdrawal_amount:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	formatCurrency(
																		transaction.admin.order.individual_withdrawal_amount
																	)}
															</Typography>
															<Typography className="p">
																<span>order_status:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.order_status}
															</Typography>
															<Typography className="p">
																<span>transaction_type:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.transaction_type}
															</Typography>
														</div>
														<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
															<Typography className="p">
																<span>bd_account_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.bd_account_id}
															</Typography>
															<Typography className="p">
																<span>goal_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.goal_id}
															</Typography>

															<Typography className="p">
																<span>individual_withdrawal_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.individual_withdrawal_id}
															</Typography>
															<Typography className="p">
																<span>order_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.order_id}
															</Typography>
															<Typography className="p">
																<span>sprout_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.sprout_id}
															</Typography>
															<Typography className="p">
																<span>user_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.user_id}
															</Typography>
															<Typography className="p">
																<span>withdrawal_instruction_id:</span>
																{transaction.admin &&
																	transaction.admin.order &&
																	transaction.admin.order.withdrawal_instruction_id}
															</Typography>
														</div>
													</div>
												)}
												<span className="customTitle">Transaction Security Trade</span>
												<Divider className="divider" />
												{transaction &&
													transaction.admin &&
													transaction.admin.transaction_security_trade && (
														<div
															className={classes.container}
															style={{ justifyContent: 'space-between' }}
														>
															<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
																<Typography className="p">
																	<span>individual_withdrawal_amount:</span>
																	{formatCurrency(
																		transaction.admin.transaction_security_trade
																			.individual_withdrawal_amount
																	)}
																</Typography>
																<Typography className="p">
																	<span>trade_status:</span>
																	{transaction.admin.transaction_security_trade.trade_status}
																</Typography>
																<Typography className="p">
																	<span>transaction_type:</span>
																	{transaction.admin.transaction_security_trade.transaction_type}
																</Typography>
																<Typography className="p">
																	<span>current_portfolio_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.current_portfolio_id
																	}
																</Typography>
																<Typography className="p">
																	<span>user_id:</span>
																	{transaction.admin.transaction_security_trade.user_id}
																</Typography>
																<Typography className="p">
																	<span>order_id:</span>
																	{transaction.admin.transaction_security_trade.order_id}
																</Typography>
																<Typography className="p">
																	<span>sprout_id:</span>
																	{transaction.admin.transaction_security_trade.sprout_id}
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
																	<span>withdrawal_instruction_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.withdrawal_instruction_id
																	}
																</Typography>
																<Typography className="p">
																	<span>individual_transaction_id:</span>
																	{transaction.admin.transaction_security_trade
																		.individual_transaction_id || 'null'}
																</Typography>
																<Typography className="p">
																	<span>bd_account_id:</span>
																	{transaction.admin.transaction_security_trade.bd_account_id}
																</Typography>
																<Typography className="p">
																	<span>Goal id:</span>
																	{transaction.admin.transaction_security_trade.goal_id}
																</Typography>

																<Typography className="p">
																	<span>individual_withdrawal_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.individual_withdrawal_id
																	}
																</Typography>
																<Typography className="p">
																	<span>source_reference_id:</span>
																	{transaction.admin.transaction_security_trade.source_reference_id}
																</Typography>

																<Typography className="p">
																	<span>withdrawal_instruction_id:</span>
																	{
																		transaction.admin.transaction_security_trade
																			.withdrawal_instruction_id
																	}
																</Typography>
															</div>
														</div>
													)}
												<div className={classes.container} style={{ margin: '16px 0 40px 0' }}>
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
														<Table>
															<TableHead>
																<TableRow>
																	<TableCell>equity</TableCell>
																	<TableCell align="right"> amount</TableCell>
																</TableRow>
															</TableHead>
															<TableBody>
																{transaction &&
																	transaction.admin &&
																	transaction.admin.transaction_security_trade &&
																	transaction.admin.transaction_security_trade.amount_allocated.map(
																		(amount, index) => (
																			<TableRow key={index}>
																				<TableCell>{amount.equity}</TableCell>
																				<TableCell align="right">{amount.amount}</TableCell>
																			</TableRow>
																		)
																	)}
															</TableBody>
														</Table>
													</div>
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
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
																				<TableCell>{security.equity}</TableCell>
																				<TableCell align="right">{security.units}</TableCell>
																			</TableRow>
																		)
																	)}
															</TableBody>
														</Table>
													</div>
												</div>

												<span className="customTitle">security_order</span>
												<Divider className="divider" />
												{transaction && transaction.admin && transaction.admin.security_order && (
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
																<span>current_portfolio_id:</span>
																{transaction.admin.security_order.current_portfolio_id}
															</Typography>
															<Typography className="p">
																<span>goal_id:</span>
																{transaction.admin.security_order.goal_id}
															</Typography>
															<Typography className="p">
																<span>sprout_id:</span>
																{transaction.admin.security_order.sprout_id}
															</Typography>
															<Typography className="p">
																<span>user_id:</span>
																{transaction.admin.security_order.user_id}
															</Typography>
														</div>
														<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
															<Typography className="p">
																<span>withdrawal_instruction_id:</span>
																{transaction.admin.security_order.withdrawal_instruction_id}
															</Typography>
															<Typography className="p">
																<span>transaction_security_trade_id:</span>
																{transaction.admin.security_order.transaction_security_trade_id}
															</Typography>
															<Typography className="p">
																<span>bd_account_id:</span>
																{transaction.admin.security_order.bd_account_id}
															</Typography>
															<Typography className="p">
																<span>individual_withdrawal_id:</span>
																{transaction.admin.security_order.individual_withdrawal_id}
															</Typography>
															<Typography className="p">
																<span>security_order_id:</span>
																{transaction.admin.security_order.security_order_id}
															</Typography>
															<Typography className="p">
																<span>order_id:</span>
																{transaction.admin.security_order.order_id}
															</Typography>
															<Typography className="p">
																<span>transfer_reference_id:</span>
																{transaction.admin.security_order.transfer_reference_id || 'null'}
															</Typography>
														</div>
													</div>
												)}

												<div className={classes.container} style={{ margin: '16px 0 40px 0' }}>
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
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
													<div className={classes.infoBlock} style={{ minWidth: 280 }}>
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
																				<TableCell>{security.equity}</TableCell>
																				<TableCell align="right">{security.units}</TableCell>
																			</TableRow>
																		)
																	)}
															</TableBody>
														</Table>
													</div>
												</div>

												<span className="customTitle">Withdrawal Transaction</span>
												<Divider className="divider" />
												{transaction.admin && transaction.admin.withdrawal_transaction && (
													<div
														className={classes.container}
														style={{ justifyContent: 'space-between' }}
													>
														<div className={classes.infoBlock} style={{ flexBasis: 340 }}>
															<Typography className="p">
																<span>individual_withdrawal_amount:</span>
																{formatCurrency(
																	transaction.admin.withdrawal_transaction
																		.individual_withdrawal_amount
																)}
															</Typography>
															<Typography className="p">
																<span>withdrawal_status:</span>
																{transaction.admin.withdrawal_transaction.withdrawal_status}
															</Typography>
															<Typography className="p">
																<span>withdrawal_date:</span>
																{getDMYTFromUtc(
																	transaction.admin.withdrawal_transaction.withdrawal_date
																)}
															</Typography>
															<Typography className="p">
																<span>current_portfolio_id:</span>
																{transaction.admin.withdrawal_transaction.current_portfolio_id}
															</Typography>
															<Typography className="p">
																<span>user_id:</span>
																{transaction.admin.withdrawal_transaction.user_id}
															</Typography>
															<Typography className="p">
																<span>sprout_id:</span>
																{transaction.admin.withdrawal_transaction.sprout_id}
															</Typography>
														</div>
														<div className={classes.infoBlock} style={{ flexBasis: 440 }}>
															<Typography className="p">
																<span>withdrawal_instruction_id:</span>
																{transaction.admin.withdrawal_transaction.withdrawal_instruction_id}
															</Typography>
															<Typography className="p">
																<span>source_reference_id:</span>
																{transaction.admin.withdrawal_transaction.source_reference_id}
															</Typography>
															<Typography className="p">
																<span>bd_account_id:</span>
																{transaction.admin.withdrawal_transaction.bd_account_id}
															</Typography>
															<Typography className="p">
																<span>goal_id:</span>
																{transaction.admin.withdrawal_transaction.goal_id}
															</Typography>
															<Typography className="p">
																<span>individual_withdrawal_id:</span>
																{transaction.admin.withdrawal_transaction.individual_withdrawal_id}
															</Typography>
															<Typography className="p">
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
						</ExpansionPanelDetails>
					</ExpansionPanel>
				))
			) : (
				<span className="customTitle">Withdrawals is null</span>
			)}
		</div>
	)
}

export default withStyles(styles)(Transfers)
