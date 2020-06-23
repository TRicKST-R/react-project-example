import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Divider, Typography, Tabs, Tab, Paper } from '@material-ui/core'
import { GET_USER_DETAIL } from '../root/Graphql'
import defaultUser from '../assets/default_user.png'
import Stocks from '../components/Detail/Stocks'
import Instructions from '../components/Detail/Instructions'
import Transactions from '../components/Detail/Transactions'
import { getDMYTFromUtc } from '../utils/DateHelper'
import Progress from '../components/Progress'
import getChunk from '../utils/GetChunk'
import { formatCurrency } from '../utils/CurrencyHelper'

const useStyles = makeStyles({
	root: {
		padding: '24px 40px',
		marginBottom: 40,
		position: 'relative'
	},
	p: {
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	avatar: {
		maxWidth: 128,
		maxHeight: 128,
		width: '100%',
		borderRadius: '50%',
		display: 'block'
	},
	infoBlock: {
		maxWidth: 520,
		width: '100%',
		'& > p': {
			display: 'flex',
			justifyContent: 'space-between'
		}
	},
	avatarContainer: {
		position: 'absolute',
		top: 16,
		left: 'calc(50% - 64px)'
	},
	btn: {
		margin: 8,
		whiteSpace: 'nowrap'
	},
	name: {
		color: '#121212',
		fontSize: '1.5rem',
		textAlign: 'center',
		marginTop: 108,
		marginBottom: 0
	},
	item: {
		flexBasis: 350,
		maxWidth: 370,
		padding: 17,
		marginBottom: 24,
		marginTop: 15,
		borderRadius: 30,
		border: '1px solid #2196f3',
		paddingBottom: 25,
		textAlign: 'center'
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'stretch'
	}
})

const TabContainer = ({ children }) => (
	<Typography component="div" role="tabpanel" style={{ width: '100%' }}>
		{children}
	</Typography>
)

const UserDetail = props => {
	const [detail, setDetail] = useState(null)
	const [activeTabIndex, setActiveTabIndex] = useState(0)
	const classes = useStyles()

	useEffect(() => {
		const variables = { object_id: props.userId, user_name: props.userName }
		getChunk(GET_USER_DETAIL, variables).then(data => {
			if (data.detail && data.detail.user_detail) setDetail(data.detail.user_detail)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (detail === null) return <Progress />

	return (
		<>
			{detail && detail.user && (
				<>
					<div style={{ position: 'relative', paddingTop: 40 }}>
						<div className={classes.avatarContainer}>
							<img
								src={detail.user.image_url ? detail.user.image_url : defaultUser}
								className={classes.avatar}
								alt="img"
							/>
						</div>
						<p className={classes.name}>{`${detail.user.first_name} ${detail.user.last_name}`}</p>
						<Divider />
						<div className={classes.row} style={{ marginBottom: 32 }}>
							<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 440 }}>
								<Typography className="p">
									<span>email:</span>
									{detail.user.email}
								</Typography>
								<Typography className="p">
									<span>birthday:</span>
									{detail.user.date_of_birth}
								</Typography>
								<Typography className="p">
									<span>last_updated_time:</span>
									{getDMYTFromUtc(detail.last_updated_time)}
								</Typography>
								<Typography className="p">
									<span>available_value:</span>
									{detail.user.available_value}
								</Typography>
								<Typography className="p">
									<span>current_value:</span>
									{detail.user.current_value}
								</Typography>
								<Typography className="p">
									<span>bank_entered:</span>
									{detail.user.bank_entered}
								</Typography>
								<Typography className="p">
									<span>funding_status:</span>
									{detail.user.funding_status}
								</Typography>
								<Typography className="p">
									<span>current_funding_source_account:</span>
									{detail.user.current_funding_source_account}
								</Typography>
								<Typography className="p">
									<span>current_funding_source_status:</span>
									{detail.user.current_funding_source_status}
								</Typography>
								<Typography className="p">
									<span>email_verified</span>
									{detail.user.email_verified}
								</Typography>
								<Typography className="p">
									<span>funding_status</span>
									{detail.user.funding_status}
								</Typography>
							</div>
							<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 500 }}>
								<Typography className="p">
									<span>user_id:</span>
									{detail.user.user_id}
								</Typography>
								<Typography className="p">
									<span>current_funding_source_id:</span>
									{detail.user.current_funding_source_id}
								</Typography>
								<Typography className="p">
									<span>growth_in_percentage:</span>
									{detail.user.growth_in_percentage}
								</Typography>
								<Typography className="p">
									<span>growth_in_value:</span>
									{detail.user.growth_in_value}
								</Typography>
								<Typography className="p">
									<span>pending_transfer_amount:</span>
									{detail.user.pending_transfer_amount}
								</Typography>
								<Typography className="p">
									<span>pending_withdrawal_amount:</span>
									{detail.user.pending_withdrawal_amount}
								</Typography>
								<Typography className="p">
									<span>risk_score:</span>
									{detail.user.risk_score}
								</Typography>
								<Typography className="p">
									<span>ssn_entered:</span>
									{detail.user.ssn_entered}
								</Typography>
								<Typography className="p">
									<span>total_contributions:</span>
									{detail.user.total_contributions}
								</Typography>
								<Typography className="p">
									<span>notification</span>
									{detail.user.notification}
								</Typography>
							</div>
						</div>
					</div>
				</>
			)}
			{detail && detail.sprouts && (
				<>
					<div style={{ marginBottom: 32 }}>
						<Typography gutterBottom variant="h5" component="h2">
							Childs
						</Typography>
						<Tabs
							value={activeTabIndex}
							onChange={(event, value) => setActiveTabIndex(value)}
							indicatorColor="primary"
							textColor="primary"
							className={classes.tablist}
						>
							{detail.sprouts.map((sprout, index) => {
								return <Tab label={`${sprout.first_name} ${sprout.last_name}`} key={index} />
							})}
						</Tabs>
						<TabContainer>
							<div className={classes.container}>
								{detail.sprouts[activeTabIndex] &&
									detail.sprouts[activeTabIndex].goals.map((goal, index) => (
										<Paper elevation={5} key={index} className={classes.item}>
											<div style={{ width: '100%', marginBottom: 10 }}>
												<Typography
													component="span"
													style={{ fontSize: 16 }}
													className="tltp"
													data-title="name"
												>
													{goal.name}
												</Typography>
												<Typography
													component="span"
													style={{ fontSize: 16 }}
													className="tltp"
													data-title="ticker_name"
												>
													{' | '}
													{goal.ticker_name}
												</Typography>
											</div>

											<Typography component="span" className="tltp" data-title="current_value">
												<h1 style={{ marginBottom: 0, marginTop: 0 }}>
													{formatCurrency(goal.current_value)}
												</h1>
											</Typography>
											<div style={{ width: '100%', marginBottom: 10 }}>
												<Typography
													component="span"
													className="tltp"
													data-title="growth_in_percentage"
													style={{ fontSize: 18 }}
												>
													{goal.growth_in_percentage}% {' | '}
												</Typography>
												<Typography
													component="span"
													className="tltp"
													data-title="growth_in_value"
													style={{ fontSize: 18 }}
												>
													{formatCurrency(goal.growth_in_value)}
												</Typography>
											</div>

											<Typography className="p">
												<span>current_portfolio_id:</span>
												{goal.current_portfolio_id}
											</Typography>
											<Typography className="p">
												<span>pending_withdrawal_amount:</span>
												{goal.pending_withdrawal_amount}
											</Typography>
											<Typography className="p">
												<span>pending_transfer_amount:</span>
												{goal.pending_transfer_amount}
											</Typography>

											<Typography className="p">
												<span>end_date:</span>
												{getDMYTFromUtc(goal.end_date)}
											</Typography>
											<Typography className="p">
												<span>target:</span>
												{goal.target}
											</Typography>
											<Typography className="p">
												<span>total_contributions:</span>
												{goal.total_contributions}
											</Typography>
											<Typography className="p">
												<span>path_locked:</span>
												{goal.path_locked}
											</Typography>
											<Typography className="p">
												<span>goal_id:</span>
												{goal.goal_id}
											</Typography>
											<Typography className="p">
												<span>path_id:</span>
												{goal.path_id}
											</Typography>

											<Typography component="span" className="tltp" data-title="available_value">
												<h2 style={{ marginBottom: 0, marginTop: 0, fontWeight: 400 }}>
													{formatCurrency(goal.available_value)}
												</h2>
											</Typography>
										</Paper>
									))}
							</div>
						</TabContainer>
					</div>
				</>
			)}

			{detail && detail.instructions && <Instructions instructions={detail.instructions} />}
			{detail && detail.transactions && <Transactions transactions={detail.transactions} />}
			{detail && detail.stocks && <Stocks stocks={detail.stocks} />}
		</>
	)
}

export default UserDetail
