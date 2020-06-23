import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import {
	Grid,
	Button,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { yyyyMMddFormat, getDMYTFromUtc } from '../utils/DateHelper'
import getChunk from '../utils/GetChunk'
import { FETCH_GIFT_MONITORING_STATS } from '../root/Graphql'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'

const useStyles = makeStyles({
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	chart: {
		flexBasis: '100%'
	},
	divider: {
		margin: '24px 0'
	},
	button: {
		height: '35px',
		marginTop: '25px'
	},
	container: {
		display: 'flex',
		marginTop: 32
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	block: {
		width: 500,
		marginRight: 50
	},
	btn: {
		marginLeft: 'auto',
		display: 'block',
		height: 36
	},
	summary: {
		'& > div': {
			display: 'flex',
			justifyContent: 'flex-start'
		}
	},
	details: {
		display: 'block'
	}
})

const GiftMonitoring = props => {
	const classes = useStyles()
	const startDate = new Date()
	const endDate = new Date()
	endDate.setDate(startDate.getDate() - 1)
	startDate.setDate(startDate.getDate() - 5)
	const [selectedStartDate, setSelectedStartDate] = useState(startDate)
	const [selectedEndDate, setSelectedEndDate] = useState(endDate)
	const [giftArray, setGiftArray] = useState([])
	const handleStartDateChange = date => setSelectedStartDate(date)
	const handleEndDateChange = date => setSelectedEndDate(date)

	const fetchData = () => {
		const variable = {
			from: yyyyMMddFormat(selectedStartDate),
			to: yyyyMMddFormat(selectedEndDate)
		}

		getChunk(FETCH_GIFT_MONITORING_STATS, variable).then(({ fetch_gift_monitoring_statistics }) => {
			console.log(fetch_gift_monitoring_statistics)
			setGiftArray(fetch_gift_monitoring_statistics.gift)
		})
	}

	useEffect(() => {
		setTimeout(() => {
			fetchData()
		}, 300)
	}, [])

	return (
		<div style={{ marginTop: 30 }}>
			<Grid container alignitems="left" style={{ marginTop: '20px' }}>
				<Grid item xs={12}>
					<MuiPickersUtilsProvider utils={DateFnsUtils}>
						<Grid container justify="space-around">
							<KeyboardDatePicker
								margin="normal"
								label="Start Date"
								format="yyyy-MM-dd"
								value={selectedStartDate}
								onChange={handleStartDateChange}
							/>
							<KeyboardDatePicker
								margin="normal"
								label="End Date"
								format="yyyy-MM-dd"
								value={selectedEndDate}
								onChange={handleEndDateChange}
							/>
							<Button
								variant="contained"
								onClick={fetchData}
								color="primary"
								className={classes.button}
							>
								Go
							</Button>
						</Grid>
					</MuiPickersUtilsProvider>
				</Grid>
			</Grid>
			<Grid container style={{ marginTop: '20px' }}>
				<Grid item xs={12}>
					<Typography variant="h4" component="h2" align="center">
						Gifts Monitoring
					</Typography>
				</Grid>
				<Grid item xs={12}>
					{giftArray.map(gift => (
						<ExpansionPanel key={gift.gift_id}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
								<div style={{flexBasis: 180}}>
									<Typography className={`field tltp`} data-title="gifter_name">
										{gift.gifter_name || 'null'}
									</Typography>
								</div>
								<div style={{flexBasis: 180}}>
									<Typography className={`field tltp`} data-title="giftee_name">
										{gift.giftee_name || 'null'}
									</Typography>
								</div>
								<div style={{flexBasis: 140}}>
									<Typography className={`field tltp`} data-title="gift_receipt_code">
										{gift.gift_receipt_code || 'null'}
									</Typography>
								</div>
								<div style={{flexBasis: 320}}>
									<Typography className={`field tltp`} data-title="gift_id">
										{gift.gift_id || 'null'}
									</Typography>
								</div>
								<div style={{flexBasis: 180}}>
									<Typography className={`field tltp`} data-title="gift_status">
										{gift.gift_status || 'null'}
									</Typography>
								</div>
								<div style={{flexBasis: 120}}>
									<Typography className={`field tltp`} data-title="initial_request_time">
										{getDMYTFromUtc(gift.initial_request_time || null)}
									</Typography>
								</div>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.details}>
								<div className={classes.container}>
									<div className={classes.block}>
										<span className="customTitle">General Gift Information</span>
										<Divider className="divider" />
										<Typography gutterBottom component="p" className="p">
											<span>handle:</span>
											{gift.handle}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>user_id:</span>
											{gift.user_id}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>gifter_name: </span>
											{gift.gifter_name}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>giftee_name: </span>
											{gift.giftee_name}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>gift_receipt_code: </span>
											{gift.gift_receipt_code}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>handle:</span>
											{gift.handle}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>object_id:</span>
											{gift.object_id}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>gift_id: </span>
											{gift.gift_id}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>gift_status: </span>
											{gift.gift_status}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>initial_request_time: </span>
											{gift.initial_request_time}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>plaid_balance_check_time: </span>
											{gift.plaid_balance_check_time}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>type: </span>
											{gift.type}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>frequency: </span>
											{gift.frequency}
										</Typography>

										{gift.claimant ? (
											<React.Fragment>
												<span className="customTitle">Claimant Information</span>
												<Divider className="divider" />

												<Typography gutterBottom component="p" className="p">
													<span>claimed_by: </span>
													{gift.claimant.claimed_by}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>email: </span>
													{gift.claimant.email}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>first_name: </span>
													{gift.claimant.first_name}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>gift_hash: </span>
													{gift.claimant.gift_hash}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>last_name: </span>
													{gift.claimant.last_name}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>phone: </span>
													{gift.claimant.phone}
												</Typography>
											</React.Fragment>
										) : null}
									</div>

									<div className={classes.block}>
										<span className="customTitle">General Gift Information</span>
										<Divider className="divider" />
										<Typography gutterBottom component="p" className="p">
											<span>type: </span>
											{gift.type}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>frequency: </span>
											{gift.frequency}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>timestamp: </span>
											{gift.timestamp}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>last_updated_time: </span>
											{gift.last_updated_time}
										</Typography>
										<Divider className="divider" />
										<Typography gutterBottom component="p" className="p">
											<span>next_gift_date:</span>
											{(gift.data && gift.data.next_gift_date) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>total:</span>
											{(gift.data && gift.data.total) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>ip: </span>
											{(gift.data && gift.data.ip) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>ach_type: </span>
											{(gift.data && gift.data.ach_type) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>handle: </span>
											{(gift.data && gift.data.handle) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>frequency_type:</span>
											{(gift.data && gift.data.frequency_type) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>initial_gift_date:</span>
											{(gift.data && gift.data.initial_gift_date) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="p">
											<span>frequency: </span>
											{(gift.data && gift.data.frequency) || 'null'}
										</Typography>
										{gift.finance ? (
											<React.Fragment>
												<span className="customTitle">Finance Information</span>
												<Divider className="divider" />

												<Typography gutterBottom component="p" className="p">
													<span>finance_link_time: </span>
													{gift.finance.finance_link_time}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>plaid_access_token: </span>
													{gift.finance.plaid_access_token}
												</Typography>
												<Typography gutterBottom component="p" className="p">
													<span>plaid_account_id: </span>
													{gift.finance.plaid_account_id}
												</Typography>
												{gift.finance.transactions ? (
													<React.Fragment>
														<Typography gutterBottom component="p" className="p">
															<span>bank_transfer_id: </span>
															{gift.finance.transactions.bank_transfer_id}
														</Typography>
														<Typography gutterBottom component="p" className="p">
															<span>individual_transfer_amount: </span>
															{gift.finance.transactions.individual_transfer_amount}
														</Typography>
														<Typography gutterBottom component="p" className="p">
															<span>individual_transfer_creation_time: </span>
															{gift.finance.transactions.individual_transfer_creation_time}
														</Typography>
														<Typography gutterBottom component="p" className="p">
															<span>individual_transfer_request_time: </span>
															{gift.finance.transactions.individual_transfer_request_time}
														</Typography>
														<Typography gutterBottom component="p" className="p">
															<span>individual_transfer_status: </span>
															{gift.finance.transactions.individual_transfer_status}
														</Typography>
													</React.Fragment>
												) : null}
											</React.Fragment>
										) : null}
									</div>
								</div>
								{(gift.instruction && gift.instruction.length && (
									<div>
										<span className="customTitle">Instructions</span>
										<Table>
											<TableHead>
												<TableRow>
													<TableCell align="right">amount</TableCell>
													<TableCell align="right">frequency</TableCell>
													<TableCell align="right">goal_id</TableCell>
													<TableCell align="right">goal_name</TableCell>
													<TableCell align="right">initial_gift_date</TableCell>
													<TableCell align="right">portfolio_id</TableCell>
													<TableCell align="right">sprout_id</TableCell>

													<TableCell align="right">user_id</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{gift.instruction.map((instruction, index) => (
													<TableRow key={index}>
														<TableCell align="left">{instruction.amount}</TableCell>
														<TableCell align="left">{instruction.frequency}</TableCell>
														<TableCell align="left">{instruction.goal_id}</TableCell>
														<TableCell align="left">{instruction.goal_name}</TableCell>
														<TableCell align="left">{instruction.initial_gift_date}</TableCell>
														<TableCell align="left">{instruction.portfolio_id}</TableCell>
														<TableCell align="left">{instruction.sprout_id}</TableCell>
														<TableCell align="left">{instruction.user_id}</TableCell>
													</TableRow>
												))}
											</TableBody>
										</Table>
									</div>
								)) ||
									''}
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}
				</Grid>
			</Grid>
		</div>
	)
}

export default connect(
	null,
	null
)(GiftMonitoring)
