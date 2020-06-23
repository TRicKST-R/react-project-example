// packages
import { Dialog, DialogActions, DialogContent, DialogTitle, Divider, Tab, Tabs, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import Account from '../ChildTabs/Account/Account'
import Bank from '../ChildTabs/Bank'
import Confirmations from '../ChildTabs/Confirmations'
import Documents from '../ChildTabs/Documents'
import ChildEvents from '../ChildTabs/Events'
import Gifts from '../ChildTabs/Gifts'
import Goal from '../ChildTabs/Goals/index'
import Investigation from '../ChildTabs/Investigation'
import Referrals from '../ChildTabs/Referrals'
import Statements from '../ChildTabs/Statements'
import TaxDocuments from '../ChildTabs/TaxDocuments'
// tabs
import ChildInfo from '../components/Child/ChildInfo'
import Progress from '../components/Progress'
import YesNo from '../components/YesNo'
import { addSnack } from '../modules/Snack/Snack.state'
import { addSuccess } from '../modules/Success/Success.state'
import { GET_ACCOUNT_STATEMENTS, GET_BANK, GET_BROKER_DEALER_CONFIRMATIONS, GET_REWARDS, GET_TAX_DOCUMENTS, UPDATE_ACCOUNT } from '../root/Graphql'
import SproutDetail from '../UserTabs/SproutDetail'
// other
import getChunk, { mutation } from '../utils/GetChunk'


const useStyles = makeStyles({
	item: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 160,
		'& > div': {
			maxWidth: 112,
			minHeight: 48
		}
	},
	container: {
		padding: '16px 16px 0 16px'
	},
	tablist: {
		backgroundColor: '#f3f3f3',
		'& button': {
			minWidth: 100
		}
	},
	list: {
		padding: 0
	}
})

const TabContainer = ({ children }) => (
	<Typography component="div" role="tabpanel" style={{ width: '100%' }}>
		{children}
	</Typography>
)

const Child = props => {
	const { sprout, userId, user_email } = props

	const [brokerDealerStatementsFetched, setBrokerDealerStatementsFetched] = useState(false)
	const [brokerDealerStatements, setBrokerDealerStatements] = useState(null)
	const [brokerDealerConfirmationsFetched, setBrokerDealerConfirmationsFetched] = useState(false)
	const [brokerDealerConfirmations, setBrokerDealerConfirmations] = useState(null)
	const [taxDocumentsFetched, setTaxDocumentsFetched] = useState(false)
	const [taxDocuments, setTaxDocuments] = useState(null)
	const [bankFetched, setBankFetched] = useState(false)
	const [bank, setBank] = useState(null)
	const [tabNum, setTabNum] = useState(0)
	const [esigneOpened, setEsigneOpened] = useState(false)
	const [activeTabIndex, setActiveTabIndex] = useState(0)
	const [referrals, setReferrals] = useState(null)
	const [referralsFetched, setReferralsFetched] = useState(false)
	const [loadingRewards, setLoadingRewards] = useState(false)
	const [loadingStatments, setLoadingStatments] = useState(false)
	const [loadingConfirmations, setLoadingConfirmations] = useState(true)

	const closeEsignedModal = () => setEsigneOpened(false)
	useEffect(() => {
		let ab = tabNum
		setTabNum(0)
		setTimeout(() => {
			setTabNum(ab)
		}, 1000)
	}, [props.currentChildIndex])
	const setEsigned = action => {
		const variables = {
			user_id: userId,
			account_id: child.broker_dealer_account_id,
			esigned: action
		}
		mutation(UPDATE_ACCOUNT, variables).then(data => {
			if (data.update_account) {
				setEsigneOpened(false)
				props.addSuccess('Account Updated Successfully')
			} else {
				props.addSnack('Somthing wrong, account not updated')
				setEsigneOpened(false)
			}
		})
	}

	useEffect(() => {
		const variables = { user_name: props.userName }
		if (tabNum === 2) {
			getChunk(GET_BANK, variables).then(({ detail }) => {
				if (detail && detail.bank) {
					setBank(detail.bank)
					setBankFetched(true)
				} else {
					setBankFetched(true)
					props.addSnack('GraphQL bad response bank')
				}
			})
		}
		if (tabNum === 8) {
			getStatements(variables)
		}
		if (tabNum === 9) {
			getConfirmations(variables)
		}
		if (tabNum === 10) {
			getTaxDocuments(variables)
		}

		return () => {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props, tabNum])

	const getStatements = variables => {
		setLoadingStatments(true)
		getChunk(GET_ACCOUNT_STATEMENTS, variables).then(data => {
			if (data && data.detail && data.detail.broker_dealer) {
				setLoadingStatments(false)
				setBrokerDealerStatements(data.detail.broker_dealer)
				setBrokerDealerStatementsFetched(true)
			} else {
				setLoadingStatments(false)
				setBrokerDealerStatementsFetched(true)
				props.addSnack('GraphQL bad response broker_dealer')
			}
		})
	}

	const getConfirmations = variables => {
		setLoadingConfirmations(true)
		getChunk(GET_BROKER_DEALER_CONFIRMATIONS, variables).then(data => {
			if (data && data.detail && data.detail.broker_dealer) {
				setLoadingConfirmations(false)
				setBrokerDealerConfirmations(data.detail.broker_dealer)
				setBrokerDealerConfirmationsFetched(true)
			} else {
				setLoadingConfirmations(false)
				setBrokerDealerConfirmationsFetched(true)
				props.addSnack('GraphQL bad response broker_dealer')
			}
		})
	}

	const getTaxDocuments = variables => {
		getChunk(GET_TAX_DOCUMENTS, variables).then(data => {
			if (data && data.detail && data.detail.broker_dealer) {
				setTaxDocuments(data.detail.broker_dealer)
				setTaxDocumentsFetched(true)
			} else {
				setTaxDocumentsFetched(true)
				props.addSnack('GraphQL bad response broker_dealer')
			}
		})
	}

	const { push, currentChildIndex, account } = props
	const classes = useStyles()
	const child = sprout[currentChildIndex]
	const aid =
		account &&
		account.length !== 0 &&
		account.find(element => element.sprout_id === child.sprout_id)

	const parentId =
		(child && child.attribute && child.attribute[0] && child.attribute[0].user_id) || ''

	const sketch_ids =
		(aid && aid.sketch_investigation_id) ||
		(account && account.length !== 0 && account[0].sketch_investigation_id)

	const accountId =
		(aid && aid.account_id) || (account && account.length !== 0 && account[0].account_id)

	const infoProps = {
		addSnack: props.addSnack,
		push,
		child,
		parentId,
		startSpinner: props.startSpinner,
		sketch_ids,
		accountId,
		addSuccess: props.addSuccess
	}

	const infoStatements =
		brokerDealerStatements &&
		brokerDealerStatements.filter(item => item.sprout_id === child.sprout_id)

	const infoConfirmations =
		brokerDealerConfirmations &&
		brokerDealerConfirmations.filter(item => item.sprout_id === child.sprout_id)

	const infoTaxDocuments =
		taxDocuments && taxDocuments.filter(item => item.sprout_id === child.sprout_id)

	useEffect(() => {
		if (tabNum === 11) {
			setLoadingRewards(true)
			getRewards()
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tabNum, props])

	const getRewards = () => {
		const variables = {
			user_id: props.userId,
			sprout_id: child.sprout_id
		}
		setLoadingRewards(true)
		getChunk(GET_REWARDS, variables).then(data => {
			if (data && data.get_rewards) {
				setReferrals(data.get_rewards)
				setReferralsFetched(true)
				setLoadingRewards(false)
			} else {
				setReferralsFetched(true)
				setLoadingRewards(false)
				props.addSnack('GraphQL bad response get_rewards')
			}
		})
	}

	const referralsProps = referrals && {
		referrals: referrals,
		goals: (child && child.goal) || [],
		userId: parentId,
		sprout_id: (child && child.sprout_id) || '',
		addSnack: props.addSnack,
		recallGoalsApi: getRewards,
		loading: loadingRewards,
		addSuccess: props.addSuccess
	}

	const statementsProps = brokerDealerStatements &&
		infoStatements && {
			statements: infoStatements[0]
				? infoStatements[0].account_statement
				: [
						{
							date: '2017-07-28',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/statement.pdf',
							statement_type: 'account_statement'
						},
						{
							date: '2017-08-30',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/statement.pdf',
							statement_type: 'account_statement'
						}
				  ],
			email: props.userName,
			userName: props.user,
			addSnack: props.addSnack,
			addSuccess: props.addSuccess,
			loading: loadingStatments,
			sprout_id: child && child.sprout_id,
			parentId
		}

	const confirmationsProps = brokerDealerConfirmations &&
		infoConfirmations && {
			confirmations: infoConfirmations[0]
				? infoConfirmations[0].confirmations
				: [
						{
							date: '2017-07-20',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/confirmation.pdf'
						},
						{
							date: '2017-07-30',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/confirmation.pdf'
						}
				  ],
			email: props.userName,
			userName: props.user,
			addSnack: props.addSnack,
			addSuccess: props.addSuccess,
			loading: loadingConfirmations,
			parentId
		}

	const taxDocumentsProps = taxDocuments &&
		infoTaxDocuments && {
			taxDocuments: infoTaxDocuments[0]
				? infoTaxDocuments[0].tax_statement
				: [
						{
							date: '2017-07-20',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/confirmation.pdf'
						},
						{
							date: '2017-07-30',
							url: 'https://api.sandbox.thirdparty.com/v1/testfile/confirmation.pdf'
						}
				  ],
			email: props.userName,
			userName: props.user,
			addSnack: props.addSnack,
			addSuccess: props.addSuccess,
			parentId
		}

	const childAccount = account && account.filter(item => item.sprout_id === child.sprout_id)

	let accountProps = null
	if (childAccount) {
		accountProps = {
			account: childAccount[0],
			addSnack: props.addSnack,
			addSuccess: props.addSuccess,
			user_name:
				(child && child.attribute && child.attribute[0] && child.attribute[0].user.user_name) || ''
		}
	}

	const childBank = bank && bank.filter(item => item.sprout_id === child.sprout_id)

	const bankProps = bank && {
		addSuccess: props.addSuccess,
		addSnack: props.addSnack,
		userId: parentId,
		banks: childBank ? childBank : null,
		accountId
	}

	const eventProps = {
		addSnack: props.addSnack,
		userId: parentId,
		accountId
	}

	const documentProps = {
		addSnack: props.addSnack,
		stopSpinner: props.stopSpinner,
		userId: parentId,
		accountId:
			(child && child.attribute && child.attribute[0] && child.broker_dealer_account_id) || '',
		sketch_ids,
		sprout_id:
			(child && child.sprout_id) ||
			(aid && aid.account_id) ||
			(account && account.length !== 0 && account[0].account_id),
		sprout: sprout,
		parentId: userId
	}

	const appViewProps = {
		addSnack: props.addSnack,
		stopSpinner: props.stopSpinner,
		userId: parentId,
		accountId,
		push: props.push,
		userName: props.userName,
		sprout_id: child && child.sprout_id
	}

	const GoalProps = {
		userName: props.userName,
		uName: props.user,
		goals: (child && child.goal) || [],
		userId: parentId
	}

	const giftsProps =
		(child &&
			child.sprout_id && {
				addSnack: props.addSnack,
				userId: parentId,
				sprout_id: child.sprout_id,
				first_name: child.first_name,
				last_name: child.last_name
			}) ||
		null

	const investigationProps = {
		sketch_id:
			(aid && aid.sketch_investigation_id) ||
			(account && account.length !== 0 && account[0].sketch_investigation_id),
		account_id:
			(aid && aid.account_id) || (account && account.length !== 0 && account[0].account_id),
		user_id: userId,
		sprout_id:
			(child && child.sprout_id) ||
			(aid && aid.account_id) ||
			(account && account.length !== 0 && account[0].account_id),
		user_email,
		notification: child.notification,
		fromChild: true,
		documentProps
	}

	const openTab = number => {
		if (number >= 0 && number <= 12) setActiveTabIndex(number)
		if (number === 12) return setEsigneOpened(true)
		else return setTabNum(number)
	}

	return (
		<>
			{infoProps ? <ChildInfo {...infoProps} /> : <Progress />}
			<Tabs
				value={activeTabIndex}
				onChange={(event, value) => openTab(value)}
				indicatorColor="primary"
				textColor="primary"
				variant="scrollable"
				scrollButtons="auto"
				className={classes.tablist}
			>
				<Tab label="Goal" />
				<Tab label="Account" />
				<Tab label="Funding" />
				<Tab label="Document" />
				<Tab label="Gift" />
				<Tab label="Investigation" />
				<Tab label="Event" />
				<Tab label="Detail" />
				<Tab label="Statement" />
				<Tab label="Confirmation" />
				<Tab label="Tax Document" />
				<Tab label="Referral" />
				<Tab label="E-Sign" />
			</Tabs>
			<Divider />
			<TabContainer>{tabNum === 0 && GoalProps && <Goal {...GoalProps} />}</TabContainer>
			<TabContainer>
				{tabNum === 1 &&
					(accountProps.account ? (
						<Account {...accountProps} />
					) : (
						<h3>Account details not found</h3>
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 2 &&
					(bankFetched ? (
						(bankProps && bankProps.banks && <Bank {...bankProps} />) || <h3>Bank not found</h3>
					) : (
						<Progress />
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 3 && documentProps && <Documents {...documentProps} />}
			</TabContainer>
			<TabContainer>
				{tabNum === 4 &&
					(giftsProps ? <Gifts {...giftsProps} /> : <h3>Gifts details not found</h3>)}
			</TabContainer>
			<TabContainer>
				{tabNum === 5 &&
					(documentProps ? (
						investigationProps.sketch_id ? (
							<Investigation investigationProps={investigationProps} />
						) : (
							<h3>sketch_id not found</h3>
						)
					) : (
						<Progress />
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 6 && (eventProps ? <ChildEvents {...eventProps} /> : <Progress />)}
			</TabContainer>
			<TabContainer>
				{tabNum === 7 &&
					(appViewProps ? (
						<div style={{ padding: '0 40px 24px 40px' }}>
							<SproutDetail {...appViewProps} />
						</div>
					) : (
						<Progress />
					))}
			</TabContainer>

			<TabContainer>
				{tabNum === 8 &&
					(brokerDealerStatementsFetched ? (
						(statementsProps && statementsProps.statements && (
							<Statements {...statementsProps} />
						)) || <h3>Statements not found</h3>
					) : (
						<Progress />
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 9 &&
					(brokerDealerConfirmationsFetched ? (
						(confirmationsProps && confirmationsProps.confirmations && (
							<Confirmations {...confirmationsProps} />
						)) || <h3>Confirmations not found</h3>
					) : (
						<Progress />
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 10 &&
					(taxDocumentsFetched ? (
						(taxDocumentsProps && taxDocumentsProps.taxDocuments && (
							<TaxDocuments {...taxDocumentsProps} />
						)) || <h3>Tax document not found</h3>
					) : (
						<Progress />
					))}
			</TabContainer>
			<TabContainer>
				{tabNum === 11 &&
					(referralsFetched ? (
						(referralsProps && <Referrals {...referralsProps} />) || <h3>Referrals not found</h3>
					) : (
						<Progress />
					))}
			</TabContainer>
			<Dialog open={esigneOpened} onClose={closeEsignedModal}>
				<DialogTitle>Confim e-sign</DialogTitle>
				<DialogContent>
					<h3>
						Please confim your action to e-sign for{' '}
						{`${(child && child.first_name) || ''} ${(child && child.last_name) || ''}`} at APEX?
					</h3>
				</DialogContent>
				<DialogActions>
					<YesNo
						yes={() => setEsigned('true')}
						no={closeEsignedModal}
						yesText="e-sign"
						noText="Cancel"
					/>
				</DialogActions>
			</Dialog>
		</>
	)
}

export default connect(null, dispatch => ({
	push: bindActionCreators(push, dispatch),
	addSnack: bindActionCreators(addSnack, dispatch),
	addSuccess: bindActionCreators(addSuccess, dispatch)
}))(Child)
