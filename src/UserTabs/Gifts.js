import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Divider,
	Tooltip
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import getChunk, { getPublicChunk } from '../utils/GetChunk'
import {
	FETCH_GIFTS_GIVENBY_USER,
	FETCH_OBJECT_DETAILS,
	FETCH_GIFT_INSTRUCTIONS
} from '../root/Graphql'
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

const Gifts = props => {
	const [gifts, setGifts] = useState(null)
	const [giftsFetched, setGiftsFetched] = useState(false)
	const [giftDetailsFetched, setGiftDetailsFetched] = useState(false)
	const [childInfo, setChildInfo] = useState(null)
	const { addSnack, userId } = props
	const classes = useStyles()
	const [instructions, setInstructions] = useState(null)
	const [instructionsFetched, setInstructionsFetched] = useState(false)

	useEffect(() => {
		const variables = { user_type: 'user', user_id: userId, role: 'gifter' }
		getChunk(FETCH_GIFTS_GIVENBY_USER, variables).then(data => {
			if (data && data.fetch_gift && data.fetch_gift.gifting && data.fetch_gift.gifting.length) {
				setGifts(data.fetch_gift.gifting)
				setGiftsFetched(true)
			} else {
				setGiftsFetched(true)
				addSnack('GraphQL bad response  information')
			}
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	const onExpansion = receiptCode => (event, isExpanded) => {
		if (isExpanded) {
			let filterDataWithReceiptCode = gifts.filter(item => {
				if (item.gift_receipt_code == receiptCode) {
					return item
				}
			})

			let sproutIDs = []
			let goalIds = []

			if (
				filterDataWithReceiptCode.length &&
				filterDataWithReceiptCode[0].gift &&
				filterDataWithReceiptCode[0].gift.instruction
			) {
				filterDataWithReceiptCode[0].gift.instruction.forEach((item, index) => {
					sproutIDs.push(item.sprout_id)
					goalIds.push(item.goal_id)
				})
			}

			Promise.all([
				getPublicChunk(FETCH_OBJECT_DETAILS, { object_id: sproutIDs[0] }),
				getPublicChunk(FETCH_OBJECT_DETAILS, { object_id: goalIds })
			]).then(data => {
				console.log('child gift===', data)
				let goalData =
					(data[1] &&
						data[1].fetch_detail &&
						data[1].fetch_detail.output &&
						data[1].fetch_detail.output.detail) ||
					[]
				let sproutData =
					(data[0] &&
						data[0].fetch_detail &&
						data[0].fetch_detail.output &&
						data[0].fetch_detail.output.detail) ||
					[]
				let a = {}
				let fullName =
					(sproutData[0] && sproutData[0]['caption_1'] + ' ' + sproutData[0]['caption_2']) || ''
				if (goalData.length) {
					goalData.forEach(item => {
						if (!a.hasOwnProperty(item.object_id)) {
							a[item.object_id] = item || {}
							if (a[item.object_id]) {
								a[item.object_id].fullName = fullName
							}
						}
					})
				}

				let cloneGifts = JSON.parse(JSON.stringify(gifts))
				let indexGift
				cloneGifts.forEach((item, index) => {
					if (item.gift_receipt_code == receiptCode) {
						indexGift = index
					}
				})

				if (
					cloneGifts[indexGift] &&
					cloneGifts[indexGift].gift &&
					cloneGifts[indexGift].gift.instruction &&
					cloneGifts[indexGift].gift.instruction.length
				) {
					cloneGifts[indexGift].gift.instruction.forEach((item, index) => {
						if (a[item.goal_id] && !item['item_detail']) {
							item['item_detail'] = a[item.goal_id]
						}
					})
				}
				setGifts(cloneGifts)
				console.log(cloneGifts)
				// console.log("fsf", b)
				// if (data && data.fetch_gift && data.fetch_gift.gifting && data.fetch_gift.gifting.length) {
				// 	setGifts(data.fetch_gift.gifting)
				// 	setGiftsFetched(true)
				// } else {
				// 	setGiftsFetched(true)
				// 	addSnack('GraphQL bad response  information')
				// }
			})

			// getPublicChunk(FETCH_OBJECT_DETAILS, {object_id:goalIds}).then(data => {
			// 			console.log("child gift goalIds===", data);
			// 				// if (data && data.fetch_gift && data.fetch_gift.gifting && data.fetch_gift.gifting.length) {
			// 				// 	setGifts(data.fetch_gift.gifting)
			// 				// 	setGiftsFetched(true)
			// 				// } else {
			// 				// 	setGiftsFetched(true)
			// 				// 	addSnack('GraphQL bad response  information')
			// 				// }
			// })
		}
	}

	useEffect(() => {
		console.log('===>', gifts)
		if (gifts) {
			let giftIds = gifts.map(gift => {
				return gift.gift_id
			})

			getChunk(FETCH_GIFT_INSTRUCTIONS, { gift_ids: giftIds }).then(data => {
				// console.log(data)
				if (data && data.fetch_gift_transactions && data.fetch_gift_transactions.gifts) {
					setInstructions(data.fetch_gift_transactions.gifts)
					console.log('@@@@', data.fetch_gift_transactions.gifts)
					data.fetch_gift_transactions.gifts.forEach(instruction => {
						gifts.forEach(gift => {
							// gift.transaction = {}
							if (instruction.gift_id === gift.gift_id) {
								instruction.giftDetails = gift
								gift.transaction = instruction
							}
						})
					})
					console.log('====>', gifts)
					setInstructionsFetched(true)
				} else {
					setInstructionsFetched(true)
					addSnack('GraphQL bad response FETCH_GIFT_INSTRUCTIONS')
				}
			})
		}
	}, [gifts])

	if (giftsFetched === false) return <Progress />
	if (instructionsFetched === false) return <Progress />
	if (giftsFetched === true && gifts === null) return null
	return (
		<div className={classes.root}>
			<h2 className="customTitle">gifts_given</h2>
			{gifts.map((giftItem, index) => (
				<ExpansionPanel key={index} onChange={onExpansion(giftItem.gift_receipt_code)}>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
						<Typography className="p">
							<span>initial_gift_date</span>
							{(giftItem.gift && giftItem.gift.data && giftItem.gift.data.initial_gift_date) ||
								'null'}
						</Typography>
						<Typography className="p" data-title="gift_receipt_code">
							{giftItem ? 'gift_receipt_code ' + giftItem.gift_receipt_code : null}
						</Typography>
						<Typography className="p">
							<span>handle</span>
							{(giftItem.gift && giftItem.gift.data && giftItem.gift.data.handle) || 'null'}
						</Typography>
						<Typography className="p">
							<span>total</span>
							{giftItem.gift && giftItem.gift.data && giftItem.gift.data.total
								? '$ ' + giftItem.gift.data.total
								: 'null'}
						</Typography>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails className={classes.details}>
						<>
							{giftItem && (
								<div style={{ marginBottom: 32 }}>
									<span className="customTitle">gift_details</span>
									<Divider className="divider" />
									<div className={classes.container}>
										<div style={{ flexBasis: 470 }}>
											<Typography className="p">
												<span>handle</span>
												{(giftItem.gift && giftItem.gift.data && giftItem.gift.data.handle) ||
													'null'}
											</Typography>
											<Typography className="p">
												<span>gift_id</span>
												{giftItem.gift_id || 'null'}
											</Typography>
											<Typography className="p">
												<span>gift_receipt_code</span>
												{giftItem.gift_receipt_code || 'null'}
											</Typography>
											<Typography className="p">
												<span>gift_status</span>
												{giftItem.gift_status}
											</Typography>
											<Typography className="p">
												<span>
													{giftItem.gift && giftItem.gift.claimant
														? 'claimant_name'
														: 'giftee_name'}
												</span>
												{giftItem.giftee_name || 'null'}
											</Typography>
											<Typography className="p">
												<span>claimant_phone</span>
												{(giftItem.gift &&
													giftItem.gift.claimant &&
													giftItem.gift.claimant.phone) ||
													'null'}
											</Typography>
										</div>
										<div style={{ flexBasis: 470 }}>
											<Typography className="p">
												<span>type</span>
												{(giftItem.gift && giftItem.gift.type) || 'null'}
											</Typography>
											<Typography className="p">
												<span>initial_gift_date</span>
												{(giftItem.gift &&
													giftItem.gift.data &&
													giftItem.gift.data.initial_gift_date) ||
													'null'}
											</Typography>
											<Typography className="p">
												<span>next_gift_date</span>
												{(giftItem.gift &&
													giftItem.gift.data &&
													giftItem.gift.data.next_gift_date) ||
													'null'}
											</Typography>
											<Typography className="p">
												<span>frequency</span>
												{(giftItem.gift && giftItem.gift.frequency) || 'null'}
											</Typography>

											<Typography className="p">
												<span>claimant_email</span>
												{(giftItem.gift &&
													giftItem.gift.claimant &&
													giftItem.gift.claimant.email) ||
													'null'}
											</Typography>
										</div>
									</div>
								</div>
							)}

							{instructions.length && <h3>ach_transfers:</h3>}
							{instructions.length &&
								giftItem.transaction &&
								giftItem.transaction.ach_transfers &&
								giftItem.transaction.ach_transfers.map((transfer, index) => (
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
															<Typography className={`field tltp`} data-title="gift_instruction_id">
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
						</>
					</ExpansionPanelDetails>
				</ExpansionPanel>
			))}
		</div>
	)
}

export default Gifts
