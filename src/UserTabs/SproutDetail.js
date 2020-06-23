import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import { Divider, Typography, Tabs, Tab } from '@material-ui/core'

import { GET_SPROUT_DETAIL } from '../root/Graphql'
import defaultUser from '../assets/default_user.png'
import Stocks from '../components/Detail/Stocks'
import Instructions from '../components/Detail/Instructions'
import Transactions from '../components/Detail/Transactions'
import { getDMYTFromUtc } from '../utils/DateHelper'
import Progress from '../components/Progress'
import getChunk from '../utils/GetChunk'

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
	}
})

const TabContainer = ({ children }) => (
	<Typography component="div" role="tabpanel" style={{ width: '100%' }}>
		{children}
	</Typography>
)

const SproutDetail = props => {
	const [detail, setDetail] = useState(null)
	const [activeTabIndex, setActiveTabIndex] = useState(0)
	const [loading, setLoading] = useState(false)
	const classes = useStyles()

	useEffect(() => {
		setLoading(true)
		const variables = { object_id: props.sprout_id, user_name: props.userName }
		getChunk(GET_SPROUT_DETAIL, variables).then(data => {
			setLoading(false)
			if (data.detail && data.detail.sprout_detail) setDetail(data.detail.sprout_detail)
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.sprout_id])

	if (detail === null) return <Progress />

	if (loading) return <Progress />

	return (
		<>
			{detail && (
				<>
					<div style={{ position: 'relative', paddingTop: 40 }}>
						<div className={classes.avatarContainer}>
							<img
								src={detail.sprout.image_url ? detail.sprout.image_url : defaultUser}
								className={classes.avatar}
								alt="img"
							/>
						</div>
						<p
							className={classes.name}
						>{`${detail.sprout.first_name} ${detail.sprout.last_name}`}</p>
						<Divider />
						<div className={classes.row} style={{ marginBottom: 32 }}>
							<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 440 }}>
								<Typography className="p">
									<span>sprout_id:</span>
									{detail.sprout_id}
								</Typography>
								<Typography className="p">
									<span>last_updated_time:</span>
									{getDMYTFromUtc(detail.last_updated_time)}
								</Typography>
								<Typography className="p">
									<span>available_value:</span>
									{detail.sprout.available_value}
								</Typography>
								<Typography className="p">
									<span>broker_dealer_account_id:</span>
									{detail.sprout.broker_dealer_account_id}
								</Typography>
								<Typography className="p">
									<span>current_value:</span>
									{detail.sprout.current_value}
								</Typography>
								<Typography className="p">
									<span>funding_status:</span>
									{detail.sprout.funding_status}
								</Typography>
								<Typography className="p">
									<span>growth_in_value:</span>
									{detail.sprout.growth_in_value}
								</Typography>
								<Typography className="p">
									<span>pending_withdrawal_amount:</span>
									{detail.sprout.pending_withdrawal_amount}
								</Typography>
								<Typography className="p">
									<span>total_contributions:</span>
									{detail.sprout.total_contributions}
								</Typography>
							</div>
							<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 500 }}>
								<Typography className="p">
									<span>object_id:</span>
									{detail.object_id}
								</Typography>
								<Typography className="p">
									<span>account_status:</span>
									{detail.sprout.account_status}
								</Typography>
								<Typography className="p">
									<span>bank_entered:</span>
									{detail.sprout.bank_entered}
								</Typography>
								<Typography className="p">
									<span>broker_dealer_account_status:</span>
									{detail.sprout.broker_dealer_account_status}
								</Typography>
								<Typography className="p">
									<span>date_of_birth:</span>
									{detail.sprout.date_of_birth}
								</Typography>
								<Typography className="p">
									<span>growth_in_percentage:</span>
									{detail.sprout.growth_in_percentage}
								</Typography>
								<Typography className="p">
									<span>pending_transfer_amount:</span>
									{detail.sprout.pending_transfer_amount}
								</Typography>
								<Typography className="p">
									<span>ssn_entered:</span>
									{detail.sprout.ssn_entered}
								</Typography>
							</div>
						</div>
					</div>
				</>
			)}
			{detail && detail.goals && (
				<>
					<div style={{ marginBottom: 32 }}>
						<Typography gutterBottom variant="h5" component="h2">
							Goals
						</Typography>
						<Tabs
							value={activeTabIndex}
							onChange={(event, value) => setActiveTabIndex(value)}
							indicatorColor="primary"
							textColor="primary"
							className={classes.tablist}
						>
							{detail.goals.map((goal, index) => (
								<Tab label={`${goal.name}`} key={index} />
							))}
						</Tabs>
						<TabContainer>
							{detail.goals[activeTabIndex] && (
								<>
									<div className={classes.row} style={{ marginBottom: 32 }}>
										<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 440 }}>
											<Typography className="p">
												<span>name:</span>
												{detail.goals[activeTabIndex].name}
											</Typography>
											<Typography className="p">
												<span>goal_id:</span>
												{detail.goals[activeTabIndex].goal_id}
											</Typography>
											<Typography className="p">
												<span>current_portfolio_id:</span>
												{detail.goals[activeTabIndex].current_portfolio_id}
											</Typography>
											<Typography className="p">
												<span>end_date:</span>
												{detail.goals[activeTabIndex].end_date}
											</Typography>
											<Typography className="p">
												<span>growth_in_value:</span>
												{detail.goals[activeTabIndex].growth_in_value}
											</Typography>
											<Typography className="p">
												<span>pending_transfer_amount:</span>
												{detail.goals[activeTabIndex].pending_transfer_amount}
											</Typography>
											<Typography className="p">
												<span>target:</span>
												{detail.goals[activeTabIndex].target}
											</Typography>
											<Typography className="p">
												<span>total_contributions:</span>
												{detail.goals[activeTabIndex].total_contributions}
											</Typography>
										</div>
										<div className={classes.infoBlock} style={{ marginTop: 16, flexBasis: 500 }}>
											<Typography className="p">
												<span>path_id:</span>
												{detail.goals[activeTabIndex].path_id}
											</Typography>
											<Typography className="p">
												<span>available_value:</span>
												{detail.goals[activeTabIndex].available_value}
											</Typography>
											<Typography className="p">
												<span>current_value:</span>
												{detail.goals[activeTabIndex].current_value}
											</Typography>
											<Typography className="p">
												<span>growth_in_percentage:</span>
												{detail.goals[activeTabIndex].growth_in_percentage}
											</Typography>
											<Typography className="p">
												<span>path_locked:</span>
												{detail.goals[activeTabIndex].path_locked}
											</Typography>
											<Typography className="p">
												<span>pending_withdrawal_amount:</span>
												{detail.goals[activeTabIndex].pending_withdrawal_amount}
											</Typography>
											<Typography className="p">
												<span>ticker_name:</span>
												{detail.goals[activeTabIndex].ticker_name}
											</Typography>
										</div>
									</div>
								</>
							)}
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

export default SproutDetail
