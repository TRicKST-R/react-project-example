import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import { Typography, Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import getChunk from '../utils/GetChunk'
import { FETCH_GIFTS_GIVENBY_USER, FETCH_GIFT_INSTRUCTIONS } from '../root/Graphql'
import Progress from '../components/Progress'

const useStyles = makeStyles({
	divider: {
		margin: '24px 0'
	},
	p: {
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	checkbox: {
		color: green[600],
		'&$checked': {
			color: green[500]
		},
		padding: 0
	},
	checked: {},
	heading: {
		fontSize: 17
	},
	tableRow: {
		height: 48,
		'& > th': {
			whiteSpace: 'nowrap',
			padding: 4,
			fontSize: 11
		},
		'& > td': {
			padding: 4,
			fontSize: 11
		}
	},
	tableContainer: {
		overflowX: 'auto'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	headingPanel: {
		display: 'flex',
		padding: 24,
		'& > p': {
			textAlign: 'center'
		}
	},
	summary: {
		'& > div': {
			display: 'flex',
			justifyContent: 'space-between'
		}
	},
	details: {
		display: 'block'
	},
	root: {
		paddingTop: 24
	}
})

{
	/*  */
}

const Gifts = props => {
	const [gifts, setGifts] = useState(null)
	const [giftsFetched, setGiftsFetched] = useState(false)
	const [instructions, setInstructions] = useState(null)
	const [instructionsFetched, setInstructionsFetched] = useState(false)
	const { addSnack, userId, sprout_id, first_name, last_name } = props
	const classes = useStyles()
	const typo = null
	useEffect(() => {
		const variables = { user_type: 'sprout', user_id: sprout_id, role: 'giftee' }
		getChunk(FETCH_GIFTS_GIVENBY_USER, variables).then(data => {
			if (data && data.fetch_gift && data.fetch_gift.gifting && data.fetch_gift.gifting.length) {
				setGifts(data.fetch_gift.gifting)
				setGiftsFetched(true)
				console.log(data)
			} else {
				setGiftsFetched(true)
				addSnack('GraphQL bad response information')
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (gifts) {
			const giftIds = []
			gifts.map(el => giftIds.push(el.gift_id))
			console.log(giftIds)
			getChunk(FETCH_GIFT_INSTRUCTIONS, { gift_ids: giftIds }).then(data => {
				console.log(data)
				if (data && data.fetch_gift_transactions && data.fetch_gift_transactions.gifts) {
					setInstructions(data.fetch_gift_transactions.gifts)
					data.fetch_gift_transactions.gifts.forEach(instruction => {
						gifts.forEach(gift => {
							if (instruction.gift_id === gift.gift_id) {
								instruction.giftDetails = gift
							}
						})
					})
					console.log('====>', data.fetch_gift_transactions.gifts, gifts)
					setInstructionsFetched(true)
				} else {
					setInstructionsFetched(true)
					addSnack('GraphQL bad response FETCH_GIFT_INSTRUCTIONS')
				}
			})
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [gifts])

	// if (giftsFetched === false) return <Progress />
	// if (giftsFetched === true && gifts === null) return null
	return (
		<div className={classes.root} style={{ paddingLeft: '20px', paddingRight: '20px' }}>
			{instructionsFetched === false ? (
				<Progress />
			) : instructionsFetched && instructions ? (
				<>
					<h3>gifts</h3>

					<div
						style={{
							display: 'flex',
							height: '50px',
							border: '0.5px solid #d3d3d3',
							boxShadow: '2px 2px 2px #d3d3d3'
						}}
					>
						<div style={{ alignSelf: 'center', width: '6.5%' }}>
							<span>total_gifts</span>
						</div>
						<div style={{ alignSelf: 'center', width: '10%' }}>
							<span>gift_receipt_code</span>
						</div>
						<div style={{ alignSelf: 'center', width: '23%' }}>
							<span>gift_id</span>
						</div>
						<div style={{ alignSelf: 'center', width: '7%' }}>
							<span>total</span>
						</div>
						<div style={{ alignSelf: 'center', width: '7%' }}>
							<span>frequency</span>
						</div>
						<div style={{ alignSelf: 'center', width: '9%' }}>
							<span>initial_gift_date</span>
						</div>
						<div style={{ alignSelf: 'center', width: '10%' }}>
							<span>next_gift_date</span>
						</div>
						<div style={{ alignSelf: 'center', width: '23%' }}>
							<span>user_id</span>
						</div>
					</div>
					{instructions.map((item, i) => (
						<ExpansionPanel key={i}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
								<Typography className={`field tltp`} align="left" data-title="Total Gifts">
									{item.ach_transfers.length}
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="Gift Receipt Code">
									<strong>{item.giftDetails.gift_receipt_code}</strong>
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="Gift Id">
									{item.gift_id || 'null'}
								</Typography>

								<Typography className={`field tltp`} align="left" data-title="Gift Total">
									{(item.giftDetails.gift &&
										item.giftDetails.gift.data &&
										item.giftDetails.gift.data.total) ||
										'null'}
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="Gift Frequency">
									{(item.giftDetails.gift && item.giftDetails.gift.frequency) || 'null'}
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="Initial Gift Date">
									{(item.giftDetails.gift &&
										item.giftDetails.gift.data &&
										item.giftDetails.gift.data.initial_gift_date &&
										item.giftDetails.gift.data.initial_gift_date.slice(0, 10)) ||
										'null'}
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="Next Gift Date">
									{(item.giftDetails.gift &&
										item.giftDetails.gift.data &&
										item.giftDetails.gift.data.next_gift_date &&
										item.giftDetails.gift.data.next_gift_date.slice(0, 10)) ||
										'null'}
								</Typography>
								<Typography className={`field tltp`} align="left" data-title="User ID">
									{item.giftDetails.user_id}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.details}>
								<h3>Ach_transfers:</h3>
								{item.ach_transfers &&
									item.ach_transfers.map((transfer, index) => (
										<ExpansionPanel key={index}>
											<ExpansionPanelSummary
												expandIcon={<ExpandMoreIcon />}
												className={classes.summary}
											>
												<Typography className={`field tltp`} data-title="amount">
													{transfer.amount || 'null'}
												</Typography>
												<Typography className={`field tltp`} data-title="bank_transaction_id">
													{transfer.bank_transaction_id || 'null'}
												</Typography>
												<Typography className={`field tltp`} data-title="bank_transfer_id">
													{transfer.bank_transfer_id || 'null'}
												</Typography>
												<Typography className={`field tltp`} data-title="object_id">
													{transfer.object_id || 'null'}
												</Typography>
											</ExpansionPanelSummary>
											<ExpansionPanelDetails className={classes.details}>
												<Typography className="p">
													<span>ip:</span>
													{transfer.ip || 'null'}
												</Typography>
												<Typography className="p">
													<span>object_type:</span>
													{transfer.object_type || 'null'}
												</Typography>
												<Typography className="p">
													<span>same_day_settlement:</span>
													{transfer.same_day_settlement === true ? 'true' : 'false' || 'null'}
												</Typography>
												<Typography className="p">
													<span>status:</span>
													{transfer.bank_transfer_status || 'null'}
												</Typography>
												<Typography className="p">
													<span>transaction_creation_time:</span>
													{transfer.transaction_creation_time || 'null'}
												</Typography>
												<Typography className="p">
													<span>transaction_process_time:</span>
													{transfer.transaction_process_time || 'null'}
												</Typography>
												<Typography className="p">
													<span>transaction_request_time:</span>
													{transfer.transaction_request_time || 'null'}
												</Typography>
												<Typography className="p">
													<span>transaction_settlement_time:</span>
													{transfer.transaction_settlement_time || 'null'}
												</Typography>
												<Typography className="p">
													<span>type:</span>
													{transfer.type || 'null'}
												</Typography>
												<Typography className="p">
													<span>webhook_log_id:</span>
													{transfer.webhook_log_id || 'null'}
												</Typography>

												<h3>Fees:</h3>
												<Table
													className={classes.table}
													style={{ border: '1px solid #ececec', marginTop: 4 }}
												>
													<TableHead>
														<TableRow>
															<TableCell className="fieldName">fee</TableCell>
															<TableCell className="fieldName" align="left">
																id
															</TableCell>
															<TableCell className="fieldName" align="left">
																note
															</TableCell>
														</TableRow>
													</TableHead>
													<TableBody>
														{transfer.fees &&
															transfer.fees.map((fee, indexFee) => (
																<TableRow key={indexFee}>
																	<TableCell className="field" align="left">
																		{fee.fee}
																	</TableCell>
																	<TableCell className="field" align="left">
																		{fee.id}
																	</TableCell>
																	<TableCell className="field" align="left">
																		{fee.note}
																	</TableCell>
																</TableRow>
															))}
													</TableBody>
												</Table>

												<h3>From:</h3>
												<Typography className="p">
													<span>node_id:</span>
													{transfer.from.node_id || 'null'}
												</Typography>
												<Typography className="p">
													<span>type:</span>
													{transfer.from.type || 'null'}
												</Typography>
												<Typography className="p">
													<span>user_id:</span>
													{transfer.from.user_id || 'null'}
												</Typography>

												<h3>To:</h3>
												<Typography className="p">
													<span>node_id:</span>
													{transfer.to.node_id || 'null'}
												</Typography>
												<Typography className="p">
													<span>type:</span>
													{transfer.to.type || 'null'}
												</Typography>
												<Typography className="p">
													<span>user_id:</span>
													{transfer.to.user_id || 'null'}
												</Typography>
												<h3>Instructions:</h3>
												{transfer.gift_instructions &&
													transfer.gift_instructions.map((instruction, index) => (
														<ExpansionPanel key={index}>
															<ExpansionPanelSummary
																expandIcon={<ExpandMoreIcon />}
																className={classes.summary}
															>
																<Typography className={`field tltp`} data-title="amount">
																	{instruction.amount || 'null'}
																</Typography>
																<Typography
																	className={`field tltp`}
																	data-title="bank_balance_check_time"
																>
																	{instruction.bank_balance_check_time || 'null'}
																</Typography>
																<Typography className={`field tltp`} data-title="frequency">
																	{instruction.frequency || 'null'}
																</Typography>
																<Typography
																	className={`field tltp`}
																	data-title="gift_instruction_id"
																>
																	{instruction.gift_instruction_id || 'null'}
																</Typography>
															</ExpansionPanelSummary>
															<ExpansionPanelDetails className={classes.details}>
																<Typography className="p">
																	<span>goal_id:</span>
																	{instruction.goal_id || 'null'}
																</Typography>
																<Typography className="p">
																	<span>investment_request_time:</span>
																	{instruction.investment_request_time || 'null'}
																</Typography>
																<Typography className="p">
																	<span>sprout_id:</span>
																	{instruction.sprout_id || 'null'}
																</Typography>
																<Typography className="p">
																	<span>status:</span>
																	{instruction.status || 'null'}
																</Typography>
																<Typography className="p">
																	<span>transfer_reference_id:</span>
																	{instruction.transfer_reference_id || 'null'}
																</Typography>
																<Typography className="p">
																	<span>user_id:</span>
																	{instruction.user_id || 'null'}
																</Typography>

																<h3>Transactions:</h3>
																{instruction.transactions &&
																	instruction.transactions.map((trasaction, transIndex) => (
																		<ExpansionPanel key={index}>
																			<ExpansionPanelSummary
																				expandIcon={<ExpandMoreIcon />}
																				className={classes.summary}
																			>
																				<Typography className={`field tltp`} data-title="amount">
																					{trasaction.amount || 'null'}
																				</Typography>
																				<Typography
																					className={`field tltp`}
																					data-title="bank_transaction_id"
																				>
																					{trasaction.bank_transaction_id || 'null'}
																				</Typography>
																				<Typography
																					className={`field tltp`}
																					data-title="bank_transfer_id"
																				>
																					{trasaction.bank_transfer_id || 'null'}
																				</Typography>
																				<Typography className={`field tltp`} data-title="object_id">
																					{trasaction.object_id || 'null'}
																				</Typography>
																			</ExpansionPanelSummary>
																			<ExpansionPanelDetails className={classes.details}>
																				<Typography className="p">
																					<span>ip:</span>
																					{trasaction.ip || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>object_type:</span>
																					{trasaction.object_type || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>same_day_settlement:</span>
																					{trasaction.same_day_settlement === true
																						? 'true'
																						: 'false' || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>Bank Transfer Status:</span>
																					{trasaction.bank_transfer_status || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>status:</span>
																					{trasaction.individual_transfer_status || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>transaction_creation_time:</span>
																					{trasaction.transaction_creation_time || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>transaction_process_time:</span>
																					{trasaction.transaction_process_time || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>transaction_request_time:</span>
																					{trasaction.transaction_request_time || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>transaction_settlement_time:</span>
																					{trasaction.transaction_settlement_time || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>type:</span>
																					{trasaction.type || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>webhook_log_id:</span>
																					{trasaction.webhook_log_id || 'null'}
																				</Typography>

																				{/*trasaction.fees && (
															<>
																<h3>Fees:</h3>
																<Table className={classes.table} style={{ border: '1px solid #ececec', marginTop: 4 }}>
																	<TableHead>
																		<TableRow>
																			<TableCell className="fieldName">fee</TableCell>
																			<TableCell className="fieldName" align="left">id</TableCell>
																			<TableCell className="fieldName" align="left">note</TableCell>
																		</TableRow>
																	</TableHead>
																	<TableBody>
																		{trasaction.fees && trasaction.fees.map((fee, indexFee) => (
																			<TableRow key={indexFee}>
																				<TableCell className="field" align="left">{fee.fee}</TableCell>
																				<TableCell className="field" align="left">{fee.id}</TableCell>
																				<TableCell className="field" align="left">{fee.note}</TableCell>
																			</TableRow>
																		))}
																	</TableBody>
																</Table>
															</>
																		)*/}

																				<h3>From:</h3>
																				<Typography className="p">
																					<span>node_id:</span>
																					{trasaction.from.node_id || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>type:</span>
																					{trasaction.from.type || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>user_id:</span>
																					{trasaction.from.user_id || 'null'}
																				</Typography>

																				<h3>To:</h3>
																				<Typography className="p">
																					<span>node_id:</span>
																					{trasaction.to.node_id || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>type:</span>
																					{trasaction.to.type || 'null'}
																				</Typography>
																				<Typography className="p">
																					<span>user_id:</span>
																					{trasaction.to.user_id || 'null'}
																				</Typography>
																			</ExpansionPanelDetails>
																		</ExpansionPanel>
																	))}
															</ExpansionPanelDetails>
														</ExpansionPanel>
													))}
											</ExpansionPanelDetails>
										</ExpansionPanel>
									))}
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}
				</>
			) : null}
		</div>
	)
}

export default Gifts
