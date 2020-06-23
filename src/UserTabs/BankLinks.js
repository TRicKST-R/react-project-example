import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import InputLabel from '@material-ui/core/InputLabel'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormHelperText from '@material-ui/core/FormHelperText'

import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Checkbox,
	Divider,
	Paper
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import { getDMYTFromUtc } from '../utils/DateHelper'
import getChunk, { mutation, getPublicChunk } from '../utils/GetChunk'
import { FETCH_FUNDING_OBJECT, FETCH_BANK_INFORMATION, FETCH_OBJECT_DETAILS } from '../root/Graphql'
import Progress from '../components/Progress'
import { UPDATE_FUNDING_BANK_STATUS } from '../root/Mutations'
import { BADNAME } from 'dns'

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
	},
	formControl: {
		minWidth: 120
	},
	selectEmpty: {
		marginTop: '0 !important'
	}
})

const BankLinks = props => {
	const [funding, setFunding] = useState(null)
	const [fundingFetched, setFundingFetched] = useState(false)
	const [bank, setBank] = useState(null)
	const [bankFetched, setBankFetched] = useState(false)
	const { addSnack, userId } = props
	const classes = useStyles()

	const handleBankStatus = (event, referenceID, userID) => {
		let updatedFunding = funding.map(item => {
			if (referenceID === item.source_reference_id) {
				item.bank_status = event.target.value
			}
			return item
		})

		setFunding(updatedFunding)

		let variables = {
			user_id: userID,
			source_reference_id: referenceID,
			bank_status: event.target.value
		}

		mutation(UPDATE_FUNDING_BANK_STATUS, variables).then(data => {
			// if (data && data.send_sqs_message && data.send_sqs_message.message)
			props.addSuccess('successfully updated')
		})
	}
	useEffect(() => {
		getChunk(FETCH_FUNDING_OBJECT, { user_id: userId }).then(data => {
			console.log(data)
			if (data && data.fetch_funding_object && data.fetch_funding_object.funding) {
				setFunding(data.fetch_funding_object.funding)
				setFundingFetched(true)
			} else {
				setFundingFetched(true)
				addSnack('GraphQL bad response information')
			}
		})

		getChunk(FETCH_BANK_INFORMATION, { user_id: userId }).then(data => {
			console.log(data)

			if (
				data &&
				data.fetch_bank_information &&
				data.fetch_bank_information.bank_information &&
				data.fetch_bank_information.bank_information.user &&
				data.fetch_bank_information.bank_information.user.length
			) {
				setBank(data.fetch_bank_information.bank_information.user[0])

				if (data.fetch_bank_information.bank_information.user[0].nodes.custody_us) {
					let sproutIDs = []
					data.fetch_bank_information.bank_information.user[0].nodes.custody_us.forEach(item => {
						if (item.sprout_id) {
							sproutIDs.push(item.sprout_id)
						}
					})
					let newData = JSON.parse(JSON.stringify(data))
					Promise.all([
						getPublicChunk(FETCH_OBJECT_DETAILS, {
							object_id: data.fetch_bank_information.bank_information.user[0].user_id
						}),
						getPublicChunk(FETCH_OBJECT_DETAILS, { object_id: sproutIDs })
					]).then(data => {
						setBankFetched(true)
						newData.fetch_bank_information.bank_information.user[0].details =
							data[0].fetch_detail.output.detail[0]

						newData.fetch_bank_information.bank_information.user[0].nodes.custody_us.forEach(
							item => {
								data[1].fetch_detail.output.detail.forEach(sproutDetails => {
									if (item.sprout_id === sproutDetails.object_id) {
										item.details = sproutDetails
									}
								})
							}
						)
						setBank(newData.fetch_bank_information.bank_information.user[0])
					})
				}
			} else {
				setBankFetched(true)
				//addSnack('GraphQL bad response FETCH_BANK_INFORMATION')
			}
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// if (fundingFetched === false || bankFetched === false) return <Progress />
	// if ((fundingFetched === true && funding === null) || (bankFetched === true && bank === null)) return null
	return (
		<div className={classes.root}>
			{fundingFetched === false ? (
				<Progress />
			) : fundingFetched && funding ? (
				<>
					<h2>funding_source</h2>
					{funding.map((fundingItem, index) => (
						<ExpansionPanel key={index}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
								<Typography className={`field tltp`} data-title="source_reference_id">
									{(fundingItem && fundingItem.source_reference_id) || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="account_number">
									{(fundingItem && fundingItem.account_number) || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="account_type">
									{(fundingItem && fundingItem.account_type) || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="type">
									{(fundingItem && fundingItem.type) || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="funding_source_status">
									{fundingItem.funding_source_status || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_status">
									{/*() || 'null'*/}
									<FormControl className={classes.formControl}>
										<Select
											disableUnderline={true}
											value={fundingItem ? fundingItem.bank_status : ''}
											onChange={event =>
												handleBankStatus(
													event,
													fundingItem.source_reference_id,
													fundingItem.user_id
												)
											}
											displayEmpty
											className={classes.selectEmpty}
										>
											<MenuItem value="" disabled>
												Bank Status
											</MenuItem>
											<MenuItem value={'initial'}>initial</MenuItem>
											<MenuItem value={'ready_to_create'}>ready_to_create</MenuItem>
											<MenuItem value={'pending'}>pending</MenuItem>
											<MenuItem value={'bank_user_created'}>bank_user_created</MenuItem>
											<MenuItem value={'bank_ach_created'}>bank_ach_created</MenuItem>
											<MenuItem value={'bank_custody_created'}>bank_custody_created</MenuItem>
										</Select>
									</FormControl>
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.details}>
								<>
									{fundingItem && fundingItem.admin && (
										<div style={{ marginBottom: 32 }}>
											<span className="customTitle">funding_source</span>
											<Divider className="divider" />
											<div className={classes.container}>
												<div style={{ flexBasis: 400 }}>
													<Typography className="p">
														<span>verification_status:</span>
														{fundingItem.admin.verification_status || 'null'}
													</Typography>
													<Typography className="p">
														<span>bd_latest_event_time:</span>
														{fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.bd_latest_event_time &&
															getDMYTFromUtc(fundingItem.admin.bd_latest_event_time)}
													</Typography>
													<Typography className="p">
														<span>bd_request_time:</span>
														{fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.bd_request_time &&
															getDMYTFromUtc(fundingItem.admin.bd_request_time)}
													</Typography>
													<Typography className="p">
														<span>event_time:</span>
														{fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.eventTime &&
															getDMYTFromUtc(fundingItem.admin.eventTime)}
													</Typography>
													<Typography className="p">
														<span>request_time:</span>
														{fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.request_time &&
															getDMYTFromUtc(fundingItem.admin.request_time)}
													</Typography>
													<Typography className="p">
														<span>plaid_account_retrieval_time:</span>
														{fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.plaid_account_retrieval_time &&
															getDMYTFromUtc(fundingItem.admin.plaid_account_retrieval_time)}
													</Typography>
													<Typography className="p">
														<span>plaid_verification_time:</span>
														{(fundingItem &&
															fundingItem.plaid_verification_time &&
															getDMYTFromUtc(fundingItem.plaid_verification_time)) ||
															'null'}
													</Typography>
												</div>
												<div style={{ flexBasis: 540 }}>
													<Typography className="p">
														<span>verification_status:</span>
														{(fundingItem &&
															fundingItem.admin &&
															fundingItem.admin.verification_status) ||
															'null'}
													</Typography>
													<Typography className="p">
														<span>user_id:</span>
														{fundingItem.user_id}
													</Typography>
													<Typography className="p">
														<span>bank_routing_number:</span>
														{fundingItem.bank_routing_number || 'null'}
													</Typography>
													<Typography className="p">
														<span>event_Type:</span>
														{fundingItem.admin.event_Type}
													</Typography>
													<Typography className="p">
														<span>source_reference_id:</span>
														{fundingItem.admin.source_reference_id}
													</Typography>
													<Typography className="p">
														<span>plaid_access_token:</span>
														{fundingItem.admin.plaid_access_token}
													</Typography>
													<Typography className="p">
														<span>plaid_account_id:</span>
														{fundingItem.admin.plaid_account_id}
													</Typography>
													<Typography className="p">
														<span>plaid_item_id:</span>
														{fundingItem.admin.plaid_item_id}
													</Typography>
													<Typography className="p">
														<span>plaid_public_token:</span>
														{fundingItem.admin.plaid_public_token}
													</Typography>
												</div>
											</div>
										</div>
									)}
									<span className="customTitle">source</span>
									<div className={classes.tableContainer} style={{ marginBottom: 32 }}>
										<Table style={{ border: '1px solid #ececec', marginTop: 4 }}>
											<TableHead>
												<TableRow className={classes.tableRow}>
													<TableCell className="fieldName">account_id</TableCell>
													<TableCell className="fieldName" align="right">
														account_number
													</TableCell>
													<TableCell className="fieldName" align="right">
														account_type
													</TableCell>
													<TableCell className="fieldName" align="right">
														bank_name
													</TableCell>
													<TableCell className="fieldName" align="right">
														bank_node_id
													</TableCell>
													<TableCell className="fieldName" align="right">
														bank_routing_number
													</TableCell>
													<TableCell className="fieldName" align="right">
														bank_user_id
													</TableCell>
													<TableCell className="fieldName" align="right">
														client_verified
													</TableCell>
													<TableCell className="fieldName" align="right">
														event_type
													</TableCell>
													<TableCell className="fieldName" align="right">
														eventTime
													</TableCell>
													<TableCell className="fieldName" align="right">
														link_type
													</TableCell>
													<TableCell className="fieldName" align="right">
														deposit
													</TableCell>
													<TableCell className="fieldName" align="right">
														id
													</TableCell>
													<TableCell className="fieldName" align="right">
														label
													</TableCell>
													<TableCell className="fieldName" align="right">
														status
													</TableCell>
													<TableCell className="fieldName" align="right">
														type
													</TableCell>
													<TableCell className="fieldName" align="right">
														withdraw
													</TableCell>
													<TableCell className="fieldName" align="right">
														swift_code
													</TableCell>
													<TableCell className="fieldName" align="right">
														verification_method
													</TableCell>
												</TableRow>
											</TableHead>
											<TableBody>
												{fundingItem &&
													fundingItem.admin &&
													fundingItem.admin.sources &&
													fundingItem.admin.sources.map((source, index) => (
														<TableRow key={index} className={classes.tableRow}>
															<TableCell className="field" align="left">
																{source.account_id}
															</TableCell>
															<TableCell className="field" align="left">
																{source.account_number}
															</TableCell>
															<TableCell className="field" align="right">
																{source.account_type}
															</TableCell>
															<TableCell className="field" align="right">
																{source.bank_name}
															</TableCell>
															<TableCell className="field" align="right">
																{source.bank_node_id}
															</TableCell>
															<TableCell className="field" align="right">
																{source.bank_routing_number}
															</TableCell>
															<TableCell className="field" align="right">
																{source.bank_user_id}
															</TableCell>
															<TableCell align="right">
																<Checkbox
																	checked={source.client_verified}
																	classes={{
																		root: classes.checkbox,
																		checked: classes.checked
																	}}
																/>
															</TableCell>
															<TableCell className="field" align="right">
																{source.event_Type}
															</TableCell>
															<TableCell className="field" align="right">
																{source.eventTime}
															</TableCell>
															<TableCell className="field" align="right">
																{source.link_type}
															</TableCell>
															<TableCell align="right">
																<Checkbox
																	checked={source.source_deposit}
																	classes={{
																		root: classes.checkbox,
																		checked: classes.checked
																	}}
																/>
															</TableCell>
															<TableCell className="field" align="right">
																{source.source_id}
															</TableCell>
															<TableCell className="field" align="right">
																{source.source_label}
															</TableCell>
															<TableCell className="field" align="right">
																{source.source_status}
															</TableCell>
															<TableCell className="field" align="right">
																{source.source_type}
															</TableCell>
															<TableCell className="field" align="right">
																<Checkbox
																	checked={source.source_withdraw}
																	classes={{
																		root: classes.checkbox,
																		checked: classes.checked
																	}}
																/>
															</TableCell>
															<TableCell className="field" align="right">
																{source.swift_code}
															</TableCell>
															<TableCell className="field" align="right">
																{source.verification_method}
															</TableCell>
														</TableRow>
													))}
											</TableBody>
										</Table>
									</div>

									<span className="customTitle">bd_funding_source_link</span>
									<Table
										className={classes.table}
										style={{ border: '1px solid #ececec', marginTop: 4 }}
									>
										<TableHead>
											<TableRow>
												<TableCell className="fieldName">source_id</TableCell>
												<TableCell className="fieldName" align="left">
													source_reference_id
												</TableCell>
												<TableCell className="fieldName" align="left">
													source_status
												</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{fundingItem &&
												fundingItem.admin &&
												fundingItem.admin.bd_funding_source_link &&
												fundingItem.admin.bd_funding_source_link.map((link, index) => (
													<TableRow key={index}>
														<TableCell className="field" align="left">
															{link.source_id}
														</TableCell>
														<TableCell className="field" align="left">
															{link.source_reference_id}
														</TableCell>
														<TableCell className="field" align="left">
															{link.source_status}
														</TableCell>
													</TableRow>
												))}
										</TableBody>
									</Table>
								</>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}
				</>
			) : null}

			{bankFetched === false ? (
				<Progress />
			) : bankFetched && bank ? (
				<>
					<h2>bank</h2>
					{/* <ExpansionPanel>
						<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
							
						</ExpansionPanelSummary>
						<ExpansionPanelDetails className={classes.details}> */}
					<h3>bank_user</h3>
					<Paper
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							height: 48,
							alignItems: 'center',
							padding: '0 24px'
						}}
					>
						<Typography className={`field tltp`} data-title="initial_request_time">
							{bank.initial_request_time || 'null'}
						</Typography>
						<Typography className={`field tltp`} data-title={'user_id: ' + bank.user_id}>
							{bank.details ? bank.details.caption_1 + ' ' + bank.details.caption_2 : 'null'}
						</Typography>
						<Typography className={`field tltp`} data-title="bank_user_id">
							{bank.bank_user_id || 'null'}
						</Typography>
						<Typography className={`field tltp`} data-title="bank_node_id">
							{bank.bank_node_id || 'null'}
						</Typography>
						<Typography className={`field tltp`} data-title="bank_status">
							{bank.bank_status || 'null'}
						</Typography>
					</Paper>

					<h3>bank_ach_us</h3>
					{bank.nodes.ach_us.map((item, i) => (
						<ExpansionPanel key={i}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
								<Typography className={`field tltp`} data-title="initial_request_time">
									{item.initial_request_time || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title={'user_id: ' + bank.user_id}>
									{bank.details ? bank.details.caption_1 + ' ' + bank.details.caption_2 : 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_user_id">
									{item.bank_user_id || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_node_id">
									{item.bank_node_id || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_status">
									{item.bank_status || 'null'}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.details}>
								<Typography className="p">
									<span>node_is_active:</span>
									{item.node_is_active === true ? 'true' : 'false' || 'null'}
								</Typography>
								<Typography className="p">
									<span>node_permission:</span>
									{item.node_permission || 'null'}
								</Typography>
								<Typography className="p">
									<span>node_supp_id:</span>
									{item.node_supp_id || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_node_type:</span>
									{item.bank_node_type || 'null'}
								</Typography>
								<Typography className="p">
									<span>account_num:</span>
									{item.node_info.account_num || 'null'}
								</Typography>
								<Typography className="p">
									<span>address:</span>
									{item.node_info.address || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_code:</span>
									{item.node_info.bank_code || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_hlogo:</span>
									{item.node_info.bank_hlogo || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_logo:</span>
									{item.node_info.bank_logo || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_long_name:</span>
									{item.node_info.bank_long_name || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_name:</span>
									{item.node_info.bank_name || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_url:</span>
									{item.node_info.bank_url || 'null'}
								</Typography>
								<Typography className="p">
									<span>class:</span>
									{item.node_info.class || 'null'}
								</Typography>
								<Typography className="p">
									<span>name_on_account:</span>
									{item.node_info.name_on_account || 'null'}
								</Typography>
								<Typography className="p">
									<span>nickname:</span>
									{item.node_info.nickname || 'null'}
								</Typography>
								<Typography className="p">
									<span>routing_num:</span>
									{item.node_info.routing_num || 'null'}
								</Typography>
								<Typography className="p">
									<span>type:</span>
									{item.node_info.type || 'null'}
								</Typography>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}

					<h3>bank_custody_us</h3>
					{bank.nodes.custody_us.map((item, i) => (
						<ExpansionPanel key={i}>
							<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />} className={classes.summary}>
								<Typography className={`field tltp`} data-title="initial_request_time">
									{item.initial_request_time || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title={'sprout_id: ' + item.sprout_id}>
									{item.details ? item.details.caption_1 + ' ' + item.details.caption_2 : 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_user_id">
									{item.bank_user_id || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_node_id">
									{item.bank_node_id || 'null'}
								</Typography>
								<Typography className={`field tltp`} data-title="bank_status">
									{item.bank_status || 'null'}
								</Typography>
							</ExpansionPanelSummary>
							<ExpansionPanelDetails className={classes.details}>
								<Typography className="p">
									<span>node_is_active:</span>
									{item.node_is_active === true ? 'true' : 'false' || 'null'}
								</Typography>
								<Typography className="p">
									<span>node_permission:</span>
									{item.node_permission || 'null'}
								</Typography>
								<Typography className="p">
									<span>node_supp_id:</span>
									{item.node_supp_id || 'null'}
								</Typography>
								<Typography className="p">
									<span>bank_node_type:</span>
									{item.bank_node_type || 'null'}
								</Typography>
								<Typography className="p">
									<span>user_id:</span>
									{item.user_id || 'null'}
								</Typography>
								<Table
									className={classes.table}
									style={{ border: '1px solid #ececec', marginTop: 4 }}
								>
									<TableHead>
										<TableRow>
											<TableCell className="fieldName">account_number</TableCell>
											<TableCell className="fieldName" align="left">
												account_type
											</TableCell>
											<TableCell className="fieldName" align="left">
												bank_subnet_id
											</TableCell>
											<TableCell className="fieldName" align="left">
												status
											</TableCell>
											<TableCell className="fieldName" align="left">
												supp_id
											</TableCell>
											<TableCell className="fieldName" align="left">
												type
											</TableCell>
										</TableRow>
									</TableHead>
									<TableBody>
										{item.subnet &&
											item.subnet.map((item, i) => (
												<TableRow key={i}>
													<TableCell className="field" align="left">
														{item.account_number}
													</TableCell>
													<TableCell className="field" align="left">
														{item.account_type}
													</TableCell>
													<TableCell className="field" align="left">
														{item.bank_subnet_id}
													</TableCell>
													<TableCell className="field" align="left">
														{item.status}
													</TableCell>
													<TableCell className="field" align="left">
														{item.supp_id}
													</TableCell>
													<TableCell className="field" align="left">
														{item.type}
													</TableCell>
												</TableRow>
											))}
									</TableBody>
								</Table>
							</ExpansionPanelDetails>
						</ExpansionPanel>
					))}
					{/* </ExpansionPanelDetails>
					</ExpansionPanel> */}
				</>
			) : null}
		</div>
	)
}

export default BankLinks
