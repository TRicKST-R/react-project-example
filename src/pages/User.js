// packages
import { Divider, Paper, Tab, Tabs, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'
import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import Progress from '../components/Progress'
import { addSnack } from '../modules/Snack/Snack.state'
import { addSuccess } from '../modules/Success/Success.state'
import Child from '../pages/Child'
import { FETCH_READ_OBJECT, GET_ACCOUNT, VIEW_PROFILE_IMAGE } from '../root/Graphql'
import Accounts from '../UserTabs/Accounts/Accounts'
import BankLinks from '../UserTabs/BankLinks'
import Chart from '../UserTabs/Chart'
import Detail from '../UserTabs/Detail'
import Gifts from '../UserTabs/Gifts'
import Information from '../UserTabs/Information'
import Trades from '../UserTabs/Trades'
import ChildList from '../UserTabs/UserInfo/ChildList'
// main Tabs
import UserInfo from '../UserTabs/UserInfo/UserInfo'
// other
import getChunk from '../utils/GetChunk'



const useStyles = makeStyles({
	container: {
		padding: '0 40px'
	},
	tablist: {
		backgroundColor: '#f3f3f3'
	},
	root: {
		paddingBottom: 24
	}
})

const TabContainer = ({ children }) => (
	<Typography component="div" role="tabpanel">
		{children}
	</Typography>
)

const User = props => {
	const [user, setUser] = useState(null)
	const [userFetched, setUserFetched] = useState(false)
	const [currentImageBinary, setCurrentImageBinary] = useState(null)
	const [account, setAccount] = useState(null)
	const [accountFetched, setAccountFetched] = useState(false)

	const [activeTab, setActiveTab] = useState(0)

	const userName = props.match.params.name.split(',')[0]
	const userId = props.match.params.name.split(',')[1]

	const [activeChild, setActiveChild] = useState(0)

	const [orders, setOrders] = useState(null)

	useEffect(() => {
		const variables = { user_name: userName }
		getChunk(FETCH_READ_OBJECT, { user_id: userId }).then(({ fetch_read_object }) => {
			if (fetch_read_object && fetch_read_object.user) {
				if (fetch_read_object.user.image_url !== null) {
					getViewProfileImage(fetch_read_object.user.image_url)
				}
				if (fetch_read_object.user && fetch_read_object.user.sprout) {
					let sortedChildList = []
					fetch_read_object.user.sprout.forEach(sprout => {
						let isSelfAccountExists = false
						sprout.attribute.forEach(attr => {
							if (attr.relationship === 'self') {
								isSelfAccountExists = true
							}
						})

						if (isSelfAccountExists) {
							sprout.isSelfAccountExists = true
							sortedChildList.unshift(sprout)
						} else {
							sprout.isSelfAccountExists = false
							sortedChildList.push(sprout)
						}
					})
					fetch_read_object.user.sprout = sortedChildList
					setUser(fetch_read_object.user)
				} else {
					setUser(fetch_read_object.user)
				}
				setUserFetched(true)
			} else {
				setUserFetched(true)
				props.addSnack('GraphQL bad response  information')
			}
		})

		getChunk(GET_ACCOUNT, variables).then(data => {
			if (data && data.detail && data.detail.account) {
				setAccount(data.detail.account)
				setAccountFetched(true)
			} else {
				setAccountFetched(true)
				props.addSnack('GraphQL bad response account')
			}
		})

		return () => {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	const getViewProfileImage = imageUrl => {
		const variables = {
			key: imageUrl,
			user_id: userId
		}
		getChunk(VIEW_PROFILE_IMAGE, variables).then(data => {
			if (data && data.view_profile_image) {
				setCurrentImageBinary(data.view_profile_image.binary_image_data)
			} else this.props.addSnack('GraphQL bad response view profile image')
		})
	}

	const changeActiveChild = index => setActiveChild(index)
	const handleChange = (event, value) => {
		setActiveTab(value)
	}

	const { push } = props
	const classes = useStyles()

	const userInfoProps = {
		addSuccess: props.addSuccess,
		user,
		userId: userId,
		activeTab,
		currentImageBinary: currentImageBinary
	}
	const infoProps = {
		addSnack: props.addSnack,
		userId: userId
	}
	const childListProps = {
		childList: user ? user.sprout : null,
		push,
		startSpinner: props.startSpinner,
		valid: user && user.sprout ? true : false,
		currentChildIndex: activeChild,
		changeActiveChild: changeActiveChild
	}
	const accountsProps = {
		addSnack: props.addSnack,
		stopSpinner: props.stopSpinner,
		userId: userId,
		startSpinner: props.startSpinner,
		account
	}
	const ordersProps = {
		orders,
		valid: orders && orders.admin ? true : false
	}
	const bankProps = {
		addSnack: props.addSnack,
		userId: userId,
		addSuccess: props.addSuccess
	}
	const detailProps = {
		push,
		userId: userId,
		userName: userName
	}
	const chartsProps = {
		addSnack: props.addSnack,
		userId: userId,
		childList: user ? user.sprout : null
	}

	const ChildProps = {
		userName: userName,
		user: (user && `${user.first_name} ${user.last_name}`) || '',
		currentChildIndex: activeChild,
		sprout: user && user.sprout,
		account: account ? account : null,
		userId: userId,
		user_email: user ? user.email : null
	}

	console.log(ChildProps)

	const giftsProps = {
		addSnack: props.addSnack,
		userId: userId
	}

	return (
		<>
			<Paper elevation={10} className={classes.root}>
				<Tabs
					value={activeTab}
					onChange={handleChange}
					indicatorColor="primary"
					textColor="primary"
					className={classes.tablist}
					variant="scrollable"
					scrollButtons="auto"
				>
					<Tab label="User" />
					<Tab label="Information" />
					<Tab label="Account" />
					<Tab label="Funding" />
					<Tab label="Gift" />
					<Tab label="App" />
					<Tab label="Trade" />
					<Tab label="Chart" />
				</Tabs>
				<Divider />
				<div className={classes.container}>{userFetched && <UserInfo {...userInfoProps} />}</div>
				<TabContainer>
					{activeTab === 0 && (
						<>
							{userFetched ? (
								childListProps.valid ? (
									<>
										<ChildList {...childListProps} />
										<Divider />
									</>
								) : null
							) : (
								<Progress />
							)}
							{userFetched && accountFetched && user && user.sprout.length && (
								<Child {...ChildProps} />
							)}
							{userFetched && accountFetched && user && user.sprout.length === 0 && (
								<h6>User have not any child</h6>
							)}
						</>
					)}
				</TabContainer>
				<div className={classes.container}>
					<TabContainer>
						{activeTab === 1 && userFetched && <Information {...infoProps} />}
					</TabContainer>
				</div>
				<TabContainer>
					{activeTab === 2 &&
						accountFetched &&
						accountsProps && accountsProps.account && <Accounts {...accountsProps} />}
				</TabContainer>
				<div className={classes.container}>
					<TabContainer>{activeTab === 3 && <BankLinks {...bankProps} />}</TabContainer>
				</div>
				<div className={classes.container}>
					<TabContainer>{activeTab === 4 && <Gifts {...giftsProps} />}</TabContainer>
				</div>
				<div className={classes.container}>
					<TabContainer>{activeTab === 5 && <Detail {...detailProps} />}</TabContainer>
				</div>
				<div className={classes.container}>
					<TabContainer>
						{activeTab === 6 &&
							(ordersProps && ordersProps.valid ? <Trades {...ordersProps} /> : null)}
					</TabContainer>
				</div>
				<div className={classes.container}>
					<TabContainer>{activeTab === 7 && <Chart {...chartsProps} />}</TabContainer>
				</div>
			</Paper>
		</>
	)
}

export default connect(null, dispatch => ({
	push: bindActionCreators(push, dispatch),
	addSnack: bindActionCreators(addSnack, dispatch),
	addSuccess: bindActionCreators(addSuccess, dispatch)
}))(User)
