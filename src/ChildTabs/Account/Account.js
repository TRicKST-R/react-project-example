import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
	Typography,
	Divider,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Button,
	CircularProgress
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import { getDMYTFromUtc } from '../../utils/DateHelper'
import { formatCurrency } from '../../utils/CurrencyHelper'
import {
	CLOSE_ACCOUNT,
	ADD_TRUSTED_CONTACT,
	VEIW_TRUSTED_CONTACT,
	GET_SUITABILITY,
	GET_ACCOUNT_PREFERENCES,
	GET_REQUEST_STATUS
} from '../../root/Graphql'
import {
	UPDATE_ACCOUNT_INVESTMENT,
	UPDATE_ACCOUNT_SUITABILITY,
	UPDATE_ACCOUNT_APPLICANT
} from '../../root/Mutations'
import getChunk, { mutation } from '../../utils/GetChunk'
import { GET_INVESTMENT_PROFILE } from '../../root/Graphql'
import AccountApplicants from './AccountApplicants'
import {
	CloseAccountModal,
	ViewTrustedContactModal,
	AddTrustedContactModal,
	UpdateInvestProfileModal,
	UpdateAccountSiutModal,
	UpdateAccountApplModal,
	ViewAccountPrefsModal,
	ViewRequestStatusModal,
	ViewInvestProfileModal,
	ViewAccountSuitModal
} from '../../components/Modals'

const styles = {
	root: {
		padding: '24px 40px'
	},
	divider: {
		margin: '24px 0'
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
		maxWidth: 450,
		margin: '0 40px',
		width: '100%'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	table: {
		'& td, & th': {
			padding: 4
		},
		width: 4000
	},
	tableConatainer: {
		/*overflowX: 'auto'*/
	},
	transactions: {
		'& td, & th': {
			padding: 4
		}
	},
	inner: {
		width: 1170,
		outline: 'none',
		padding: 40,
		backgroundColor: '#fff',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		position: 'absolute'
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	btnWrapper: {
		position: 'relative'
	},
	btnsContainer: {
		display: 'flex',
		flexWrap: 'wrap'
	},
	btn: {
		margin: 8
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	btnGroup: {
		height: 40
	},
	btnList: {
		width: 180
	},
	itemList: {
		justifyContent: 'center'
	}
}

class Account extends Component {
	constructor(props) {
		super(props)
		this.state = {
			closeAccountModalOpened: false,
			openViewTrustedModal: false,
			openAddTrustedModal: false,
			openUpdateInvestProfileModal: false,
			openUpdateAccountSuitModal: false,
			openUpdateAccountApplModal: false,
			openViewAccountPrefsModal: false,
			openViewRequestStatusModal: false,
			openViewInvestProfileModal: false,
			openViewAccountSuitModal: false,
			investmentProfile: null,
			accountSuitability: null,
			accountPreferences: null,
			requestStatus: null,
			loadingViewTrusted: false,
			loadingUpdateInvest: false,
			loadingUpdateSuit: false,
			loadingAccountPrefs: false,
			loadingRequestStatus: false,
			loadingShowInvest: false,
			loadingShowSuit: false,

			btnSplitOpen: false,
			selectedIndex: 0
		}

		this.btn = React.createRef()
	}

	// Close Account
	openCloseAccountModal = () => this.setState({ closeAccountModalOpened: true })
	closeCloseAccountModal = () => this.setState({ closeAccountModalOpened: false })
	callCloseAccountApi = () => {
		const { account } = this.props
		const variables = {
			user_id: (account && account.user_id) || '',
			account_id: (account && account.account_id) || ''
		}
		mutation(CLOSE_ACCOUNT, variables).then(({ close_account }) => {
			if (close_account && close_account.message) this.props.addSuccess('Submitted!')
			else this.props.addSnack('Submission failed')
		})
	}

	// View Trusted Contact
	openViewTrustedModal = () => {
		this.setState({ loadingViewTrusted: true })
		const { account } = this.props
		const variables = {
			user_id: (account && account.user_id) || '',
			account_id: (account && account.account_id) || ''
		}
		getChunk(VEIW_TRUSTED_CONTACT, variables).then(({ fetch_trusted_contact }) => {
			if (fetch_trusted_contact) {
				this.setState({
					viewTrustedContact: fetch_trusted_contact,
					openViewTrustedModal: true,
					loadingViewTrusted: false
				})
			} else {
				this.setState({
					loadingViewTrusted: false
				})
				this.props.addSnack('GraphQL bad response trusted contact')
			}
		})
	}
	closeViewTrustedModal = () => this.setState({ openViewTrustedModal: false })

	// Add trusted contact
	openAddTrustedContactModal = () => this.setState({ openAddTrustedModal: true })
	closeAddTrustedContactModal = () => this.setState({ openAddTrustedModal: false })
	callAddTrustedAccountApi = (first_name, last_name, email, mobile) => {
		const { account } = this.props
		const variables = {
			user_id: (account && account.user_id) || '',
			account_id: (account && account.account_id) || '',
			first_name,
			last_name,
			email,
			mobile
		}
		!email && delete variables['email']
		!mobile && delete variables['mobile']
		mutation(ADD_TRUSTED_CONTACT, variables)
			.then(({ add_trusted_contact }) => {
				if (add_trusted_contact) this.props.addSuccess('Trusted contact added successfully.')
				else this.props.addSnack('Submission failed')
			})
			.catch(errors =>
				this.props.addSnack('GraphQL bad response trusted contact! Submission failed')
			)
	}

	// Update investment profile
	closeUpdateInvestProfileModal = () => this.setState({ openUpdateInvestProfileModal: false })
	openUpdateInvestProfileModal = () => {
		this.setState({ loadingUpdateInvest: true })
		if (this.state.investmentProfile)
			this.setState({ openUpdateInvestProfileModal: true, loadingUpdateInvest: false })
		else {
			const { account } = this.props
			const variables = {
				user_id: (account && account.user_id) || '',
				account_id: (account && account.account_id) || ''
			}
			getChunk(GET_INVESTMENT_PROFILE, variables)
				.then(data => {
					if (data.fetch_investment_profile) {
						const investmentProfile = {
							investmentObjective: data.fetch_investment_profile.investment_objective,
							investmentExperience: data.fetch_investment_profile.investment_experience,
							annualIncome: data.fetch_investment_profile.annual_income_usd,
							liquidNetWorth: data.fetch_investment_profile.liquid_net_worth_usd,
							totalNetWorth: data.fetch_investment_profile.total_net_worth_usd,
							riskTolerance: data.fetch_investment_profile.risk_tolerance,
							federalTaxBracketPercent: data.fetch_investment_profile.federal_tax_bracket_percent
						}
						this.setState({
							investmentProfile,
							openUpdateInvestProfileModal: true,
							loadingUpdateInvest: false
						})
					} else {
						this.setState({
							loadingUpdateInvest: false
						})
						this.props.addSnack('GraphQL bad response Update Invest Profile')
					}
				})
				.catch(errors => this.props.addSnack('GraphQL bad response Update Invest Profile'))
		}
	}
	sendAccountInvestment = (agent_name, risk_profile) => {
		const {
			account: { user_id, account_id }
		} = this.props
		const variables = { user_id, account_id, agent_name, risk_profile }
		mutation(UPDATE_ACCOUNT_INVESTMENT, variables).then(data => {
			if (data) this.props.addSuccess('Updated')
			else this.props.addSnack('Update failed')
		})
	}
	// Update Account Suitability
	closeUpdateAccountSuitModal = () => this.setState({ openUpdateAccountSuitModal: false })
	openUpdateAccountSuitModal = () => {
		this.setState({ loadingUpdateSuit: true })
		if (this.state.accountSuitability)
			this.setState({ openUpdateAccountSuitModal: true, loadingUpdateSuit: false })
		else {
			const variables = { user_name: this.props.user_name }
			getChunk(GET_SUITABILITY, variables).then(data => {
				if (data.detail.information) {
					const accountSuitability = {
						time_horizon: data.detail.information.time_horizon,
						liquidity_needs: data.detail.information.liquidity_needs
					}
					this.setState({
						accountSuitability,
						openUpdateAccountSuitModal: true,
						loadingUpdateSuit: false
					})
				} else {
					this.setState({
						loadingUpdateSuit: false
					})
					this.props.addSnack('GraphQL bad response Update Account Suit Modal')
				}
			})
		}
	}
	sendAccountSuitability = (agent_name, risk_profile) => {
		const { account } = this.props
		const variables = {
			user_id: (account && account.user_id) || '',
			account_id: (account && account.account_id) || '',
			agent_name,
			risk_profile
		}
		mutation(UPDATE_ACCOUNT_SUITABILITY, variables).then(data => {
			if (data) this.props.addSuccess('Updated')
			else this.props.addSnack('Update failed')
		})
	}

	// Update account applicant
	openUpdateAccountApplModal = () => this.setState({ openUpdateAccountApplModal: true })
	closeUpdateAccountApplModal = () => this.setState({ openUpdateAccountApplModal: false })
	sendAccountApplicant = applicants => {
		const { account } = this.props
		const variables = {
			user_id: (account && account.user_id) || '',
			account_id: (account && account.account_id) || '',
			applicant_id:
				account &&
				account.applicants &&
				account.applicants[0] &&
				account.applicants[0].admin &&
				account.applicants[0].admin.applicant_id,
			applicants
		}
		mutation(UPDATE_ACCOUNT_APPLICANT, variables)
			.then(data => {
				if (data.update_account_applicant) this.props.addSuccess('Updated')
				else this.props.addSnack('Update failed')
			})
			.catch(errors => this.props.addSnack('GraphQL bad response Account Applicant'))
	}

	// View Account Preferences
	closeViewAccountPrefsModal = () => this.setState({ openViewAccountPrefsModal: false })
	openViewAccountPrefsModal = () => {
		this.setState({ loadingAccountPrefs: true })
		const { account } = this.props
		const variables = {
			account_id: (account && account.admin && account.admin.account_id) || '',
			user_id: (account && account.admin && account.admin.user_id) || ''
		}
		getChunk(GET_ACCOUNT_PREFERENCES, variables).then(({ fetch_account_preferences }) => {
			if (fetch_account_preferences) {
				const accountPreferences = {
					e_proxy_indicator: fetch_account_preferences.e_proxy_indicator,
					e_statement_indicator: fetch_account_preferences.e_statement_indicator,
					e_confirm_indicator: fetch_account_preferences.e_confirm_indicator,
					e_prospectus_indicator: fetch_account_preferences.e_prospectus_indicator,
					e_tax_statement_indicator: fetch_account_preferences.e_tax_statement_indicator
				}
				this.setState({
					openViewAccountPrefsModal: true,
					accountPreferences,
					loadingAccountPrefs: false
				})
			} else {
				this.props.addSnack('Data not found')
				this.setState({
					loadingAccountPrefs: false
				})
			}
		})
	}

	// View Request Status
	closeViewRequestStatusModal = () => this.setState({ openViewRequestStatusModal: false })
	openViewRequestStatusModal = () => {
		this.setState({ loadingRequestStatus: true })
		const { account } = this.props
		const variables = {
			account_id: (account && account.admin && account.admin.account_id) || '',
			user_id: (account && account.admin && account.admin.user_id) || ''
		}
		getChunk(GET_REQUEST_STATUS, variables).then(({ fetch_account_request_status }) => {
			if (fetch_account_request_status) {
				const requestStatus = {
					account_id: fetch_account_request_status.account_id,
					status: fetch_account_request_status.status,
					can_trade: fetch_account_request_status.can_trade,
					can_trade_options: fetch_account_request_status.can_trade_options,
					can_fund: fetch_account_request_status.can_fund,
					margin_agreement: fetch_account_request_status.margin_agreement
				}
				this.setState({
					openViewRequestStatusModal: true,
					requestStatus,
					loadingRequestStatus: false
				})
			} else {
				this.props.addSnack('Data not found for Request Status')
				this.setState({
					loadingRequestStatus: false
				})
			}
		})
	}

	// View Investment Profile
	closeInvestProfileModal = () => this.setState({ openViewInvestProfileModal: false })
	openInvestProfileModal = () => {
		this.setState({ loadingShowInvest: true })
		if (this.state.investmentProfile)
			this.setState({ openViewInvestProfileModal: true, loadingShowInvest: false })
		else {
			const { account } = this.props
			const variables = {
				user_id: (account && account.user_id) || '',
				account_id: (account && account.account_id) || ''
			}
			getChunk(GET_INVESTMENT_PROFILE, variables).then(data => {
				if (data.fetch_investment_profile) {
					const investmentProfile = {
						investmentObjective: data.fetch_investment_profile.investment_objective,
						investmentExperience: data.fetch_investment_profile.investment_experience,
						annualIncome: data.fetch_investment_profile.annual_income_usd,
						liquidNetWorth: data.fetch_investment_profile.liquid_net_worth_usd,
						totalNetWorth: data.fetch_investment_profile.total_net_worth_usd,
						riskTolerance: data.fetch_investment_profile.risk_tolerance,
						federalTaxBracketPercent: data.fetch_investment_profile.federal_tax_bracket_percent
					}
					this.setState({
						investmentProfile,
						openViewInvestProfileModal: true,
						loadingShowInvest: false
					})
				} else {
					this.props.addSnack('Data not found for Investment Profile')
					this.setState({
						loadingShowInvest: false
					})
				}
			})
		}
	}

	// View Account Suitability
	closeViewAccountSuitModal = () => this.setState({ openViewAccountSuitModal: false })
	openViewAccountSuitModal = async () => {
		this.setState({ loadingShowSuit: true })
		if (this.state.accountSuitability)
			this.setState({ openViewAccountSuitModal: true, loadingShowSuit: false })
		else {
			const variables = { user_name: this.props.user_name }
			getChunk(GET_SUITABILITY, variables).then(data => {
				if (data.detail.information) {
					const accountSuitability = {
						time_horizon: data.detail.information.time_horizon,
						liquidity_needs: data.detail.information.liquidity_needs
					}
					this.setState({
						accountSuitability,
						openViewAccountSuitModal: true,
						loadingShowSuit: false
					})
				} else {
					this.props.addSnack('GraphQL bad response Account Suit Modal')
					this.setState({
						loadingShowSuit: false
					})
				}
			})
		}
	}

	handleCloseBtn = event => {
		if (this.btn.current && this.btn.current.contains(event.target)) {
			return
		}

		this.setState({ btnSplitOpen: false })
	}

	handleMenuItemClick = (event, index) => {
		this.setState({
			selectedIndex: index,
			btnSplitOpen: false
		})
	}

	render() {
		const { classes, account } = this.props
		return (
			<div className={classes.root}>
				<Typography gutterBottom variant="h5">
					Account
				</Typography>
				<div className={classes.btnsContainer}>
					{/* <ButtonGroup variant="contained" color="primary" ref={this.btn} className={classes.btnGroup}>
						<Button onClick={() => this.setState({btnSplitOpen: !this.state.btnSplitOpen})}>Trusted Contact</Button>
						<Button
							color="primary"
							size='small'
							onClick={() => this.setState({btnSplitOpen: !this.state.btnSplitOpen})}
						>
							<ArrowDropDownIcon />
						</Button>
					</ButtonGroup>
					<Popper open={this.state.btnSplitOpen} anchorEl={this.btn.current} transition disablePortal style={{zIndex: 1}}>
						{({ TransitionProps, placement }) => (
							<Grow
								{...TransitionProps}
								style={{
									transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom',
								}}
							>
								<Paper className={classes.btnList}>
									<ClickAwayListener onClickAway={this.handleCloseBtn}>
										<MenuList>
											<MenuItem
												selected={0 === this.state.selectedIndex}
												onClick={event => {
													this.handleMenuItemClick(event, 0)
													this.openViewTrustedModal()
												}}
												className={classes.itemList}
											>
												View
											</MenuItem>
											<MenuItem
												selected={1 === this.state.selectedIndex}
												//onClick={event => this.handleMenuItemClick(event, index)}
												className={classes.itemList}
											>
												Add
											</MenuItem>
										</MenuList>
									</ClickAwayListener>
								</Paper>
							</Grow>
						)}
					</Popper> */}

					<Button
						className={classes.btn}
						variant="outlined"
						color="primary"
						onClick={this.openCloseAccountModal}
						size="small"
					>
						<i className="fa fa-user-times " aria-hidden="true"></i>
					</Button>
					<div className={classes.btnWrapper}>
						<Button
							className={classes.btn}
							variant="outlined"
							color="primary"
							onClick={this.openViewTrustedModal}
							disabled={this.state.loadingViewTrusted}
							size="small"
						>
							View Trusted Contact
						</Button>
						{this.state.loadingViewTrusted && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<Button
						className={classes.btn}
						variant="outlined"
						color="primary"
						onClick={this.openAddTrustedContactModal}
						size="small"
					>
						Add a Trusted Contact
					</Button>
					<div className={classes.btnWrapper}>
						<Button
							variant="outlined"
							color="primary"
							onClick={this.openUpdateInvestProfileModal}
							className={classes.btn}
							disabled={this.state.loadingUpdateInvest}
							size="small"
						>
							Update Investment Profile
						</Button>
						{this.state.loadingUpdateInvest && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<div className={classes.btnWrapper}>
						<Button
							variant="outlined"
							color="primary"
							onClick={this.openUpdateAccountSuitModal}
							className={classes.btn}
							disabled={this.state.loadingUpdateSuit}
							size="small"
						>
							Update Suitability Information
						</Button>
						{this.state.loadingUpdateSuit && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<Button
						className={classes.btn}
						variant="outlined"
						color="primary"
						onClick={this.openUpdateAccountApplModal}
						size="small"
					>
						Update account applicants
					</Button>
					<div className={classes.btnWrapper}>
						<Button
							className={classes.btn}
							variant="outlined"
							color="primary"
							onClick={this.openViewAccountPrefsModal}
							disabled={this.state.loadingAccountPrefs}
							size="small"
						>
							Account Preferences
						</Button>
						{this.state.loadingAccountPrefs && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<div className={classes.btnWrapper}>
						<Button
							className={classes.btn}
							variant="outlined"
							color="primary"
							onClick={this.openViewRequestStatusModal}
							disabled={this.state.loadingRequestStatus}
							size="small"
						>
							Request Status
						</Button>
						{this.state.loadingRequestStatus && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<div className={classes.btnWrapper}>
						<Button
							className={classes.btn}
							variant="outlined"
							color="primary"
							onClick={this.openInvestProfileModal}
							disabled={this.state.loadingShowInvest}
							size="small"
						>
							Show Investment Profile
						</Button>
						{this.state.loadingShowInvest && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
					<div className={classes.btnWrapper}>
						<Button
							className={classes.btn}
							variant="outlined"
							color="primary"
							onClick={this.openViewAccountSuitModal}
							disabled={this.state.loadingShowSuit}
							size="small"
						>
							Show Suitability Information
						</Button>
						{this.state.loadingShowSuit && (
							<CircularProgress size={24} className={classes.buttonProgress} />
						)}
					</div>
				</div>

				<Divider className={classes.divider} />
				{account && account.admin && (
					<div className={classes.container}>
						<div className={classes.infoBlock}>
							Account Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>account_id:</span>
								{account.admin.account_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>account_status:</span>
								{account.account_status}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_account_request_time:</span>
								{getDMYTFromUtc(account.admin.bd_account_request_time)}
							</Typography>
							<hr className={classes.custHr} />
							Event Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>bd_latest_event_time:</span>
								{getDMYTFromUtc(account.admin.bd_latest_event_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>eventTime:</span>
								{getDMYTFromUtc(account.admin.eventTime)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>event_Type:</span>
								{account.admin.event_Type}
							</Typography>
							<hr className={classes.custHr} />
							Can Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>can_fund:</span>
								<Checkbox
									checked={account.can_fund}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>can_trade:</span>
								<Checkbox
									checked={account.can_trade}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>can_trade_options:</span>
								<Checkbox
									checked={account.can_trade_options}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>options:</span>
								<Checkbox
									checked={account.options}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							User Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>user_id:</span>
								{account.admin.user_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>email:</span>
								{account.email}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>customer_type:</span>
								{account.customer_type}
							</Typography>
							<hr className={classes.custHr} />
							Financial Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>income_range:</span>
								{account.income_range}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>assets_worth:</span>
								{account.assets_worth}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>investor_type:</span>
								{account.investor_type}
							</Typography>
							<hr className={classes.custHr} />
							Other Information
							<hr className={classes.custHr} />
							<Typography gutterBottom component="p" className={classes.p}>
								<span>request:</span>
								{account.request}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>request_time:</span>
								{getDMYTFromUtc(account.request_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>sprout_id:</span>
								{account.admin.sprout_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>status:</span>
								{account.admin.status}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>trade_authorization:</span>
								{account.admin.trade_authorization}
							</Typography>
						</div>
					</div>
				)}
				{account && account.applicants && (
					<AccountApplicants data={account.applicants} style={{ marginBottom: 10 }} />
				)}
				<div style={{ marginTop: 24 }}>
					<span className="customTitle" style={{ marginTop: 10 }}>
						bd_account_transactions
					</span>
					<Divider className={classes.divider} />
					<div className={classes.tableConatainer}>
						<Table className={classes.transactions}>
							<TableHead>
								<TableRow>
									<TableCell>amount</TableCell>
									<TableCell align="right">bd_account_id</TableCell>
									<TableCell align="right">bd_object_id</TableCell>
									<TableCell align="right">bd_transaction_id</TableCell>
									<TableCell align="right">description</TableCell>
									<TableCell align="right">reconciled</TableCell>
									<TableCell align="right">reference</TableCell>
									<TableCell align="right">reservation</TableCell>
									<TableCell align="right">settlement_time</TableCell>
									<TableCell align="right">transaction_id</TableCell>
									<TableCell align="right">transaction_time</TableCell>
									<TableCell align="right">transaction_type</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{account &&
									account.admin &&
									account.admin.bd_account_transactions &&
									Boolean(account.admin.bd_account_transactions.length) &&
									account.admin.bd_account_transactions.map((transaction, index) => (
										<TableRow key={index}>
											<TableCell align="left" className={classes.row}>
												{formatCurrency(transaction.amount)}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.bd_account_id}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.bd_object_id}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.bd_transaction_id}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.description}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												<Checkbox
													checked={transaction.reconciled}
													classes={{
														root: classes.checkbox,
														checked: classes.checked
													}}
												/>
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.reference}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												<Checkbox
													checked={transaction.reservation}
													classes={{
														root: classes.checkbox,
														checked: classes.checked
													}}
												/>
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{getDMYTFromUtc(transaction.settlement_time)}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.transaction_id}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{getDMYTFromUtc(transaction.transaction_time)}
											</TableCell>
											<TableCell align="right" className={classes.row}>
												{transaction.transaction_type}
											</TableCell>
										</TableRow>
									))}
							</TableBody>
						</Table>
					</div>
				</div>
				{account && account.admin && account.admin.bd_account_link && (
					<div style={{ marginTop: 25 }}>
						<span className="customTitle">bd_account_link</span>
						<Divider className={classes.divider} />
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>account_id</TableCell>
									<TableCell align="right">account_status</TableCell>
									<TableCell align="right">request_time</TableCell>
									<TableCell align="right">user_id</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								<TableRow>
									<TableCell align="left" className={classes.row}>
										{account.admin.bd_account_link.account_id}
									</TableCell>
									<TableCell align="right" className={classes.row}>
										{account.admin.bd_account_link.account_status}
									</TableCell>
									<TableCell align="right" className={classes.row}>
										{getDMYTFromUtc(account.admin.bd_account_link.request_time)}
									</TableCell>
									<TableCell align="right" className={classes.row}>
										{account.admin.bd_account_link.user_id}
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
					</div>
				)}
				{this.state.closeAccountModalOpened && (
					<CloseAccountModal close={this.closeCloseAccountModal} send={this.callCloseAccountApi} />
				)}

				{this.state.openViewTrustedModal && (
					<ViewTrustedContactModal
						close={this.closeViewTrustedModal}
						viewTrustedContact={this.state.viewTrustedContact}
					/>
				)}

				{this.state.openAddTrustedModal && (
					<AddTrustedContactModal
						close={this.closeAddTrustedContactModal}
						send={this.callAddTrustedAccountApi}
					/>
				)}

				{this.state.openUpdateInvestProfileModal && (
					<UpdateInvestProfileModal
						close={this.closeUpdateInvestProfileModal}
						data={this.state.investmentProfile}
						send={this.sendAccountInvestment}
					/>
				)}

				{this.state.openUpdateAccountSuitModal && (
					<UpdateAccountSiutModal
						close={this.closeUpdateAccountSuitModal}
						data={this.state.accountSuitability}
						send={this.sendAccountSuitability}
					/>
				)}

				{this.state.openUpdateAccountApplModal && (
					<UpdateAccountApplModal
						close={this.closeUpdateAccountApplModal}
						applicant_id={
							(this.props.account &&
								this.props.account.applicants &&
								this.props.account.applicants[0] &&
								this.props.account.applicants[0].admin &&
								this.props.account.applicants[0].admin.applicant_id) ||
							''
						}
						send={this.sendAccountApplicant}
					/>
				)}

				{this.state.openViewAccountPrefsModal && (
					<ViewAccountPrefsModal
						close={this.closeViewAccountPrefsModal}
						data={this.state.accountPreferences}
					/>
				)}

				{this.state.openViewRequestStatusModal && (
					<ViewRequestStatusModal
						close={this.closeViewRequestStatusModal}
						data={this.state.requestStatus}
					/>
				)}

				{this.state.openViewInvestProfileModal && (
					<ViewInvestProfileModal
						close={this.closeInvestProfileModal}
						data={this.state.investmentProfile}
					/>
				)}

				{this.state.openViewAccountSuitModal && (
					<ViewAccountSuitModal
						close={this.closeViewAccountSuitModal}
						data={this.state.accountSuitability}
					/>
				)}
			</div>
		)
	}
}

export default withStyles(styles)(Account)
