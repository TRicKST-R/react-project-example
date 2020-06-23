import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Divider, Typography } from '@material-ui/core/'

import Stocks from '../../components/Detail/Stocks'
import Instructions from '../../components/Detail/Instructions'
import Transactions from '../../components/Detail/Transactions'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import Progress from '../../components/Progress'
import { formatCurrency } from '../../utils/CurrencyHelper'
import getChunk from '../../utils/GetChunk'
import { GET_GOAL_DETAIL } from '../../root/Graphql'

const styles = {
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
	}
}

const GoalDetail = props => {
	const { classes } = props
	const [detailFetched, setDetailFetched] = useState(false)
	const [detail, setDetail] = useState(null)

	useEffect(() => {
		const variables = { object_id: props.goalId, user_name: props.userName }
		getChunk(GET_GOAL_DETAIL, variables).then(data => {
			if (data.detail) {
				setDetailFetched(true)
				setDetail(data.detail.goal_detail)
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props.goalId])

	if (detailFetched === false) return <Progress />
	if (detail === null)
		return (
			<Typography gutterBottom component="p" className={classes.p}>
				goal_detail is null
			</Typography>
		)
	return (
		<>
			{detail && detail.goal && (
				<div style={{ marginBottom: 10 }}>
					<Typography gutterBottom variant="h5" component="h2">
						Goal
					</Typography>
					<Divider />
					<div className={classes.row}>
						<div className={classes.infoBlock} style={{ marginTop: 32, margin: 10 }}>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>last_updated_time:</span>
								{getDMYTFromUtc(detail.last_updated_time)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>available_value:</span>
								{formatCurrency(detail.goal.available_value)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>current_portfolio_id:</span>
								{detail.goal.current_portfolio_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>current_value:</span>
								{formatCurrency(detail.goal.current_value)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>end_date:</span>
								{detail.goal.end_date}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>goal_id:</span>
								{detail.goal.goal_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>growth_in_percentage:</span>
								{detail.goal.growth_in_percentage}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>growth_in_value:</span>
								{formatCurrency(detail.goal.growth_in_value)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>name:</span>
								{detail.goal.name}
							</Typography>
						</div>
						<div className={classes.infoBlock} style={{ marginTop: 32, margin: 10 }}>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>path_id:</span>
								{detail.goal.path_id}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>path_locked:</span>
								{detail.goal.path_locked}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>pending_transfer_amount:</span>
								{detail.goal.pending_transfer_amount}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>pending_withdrawal_amount:</span>
								{detail.goal.pending_withdrawal_amount}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>target:</span>
								{detail.goal.target}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>ticker_name:</span>
								{detail.goal.ticker_name}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>total_contributions:</span>
								{formatCurrency(detail.goal.total_contributions)}
							</Typography>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>is_active:</span>
								{detail.goal.is_active}
							</Typography>
						</div>
					</div>
				</div>
			)}
			<Divider />
			{detail.stocks && <Stocks stocks={detail.stocks} />}
			{detail.instructions && <Instructions instructions={detail.instructions} />}
			{detail.transactions && <Transactions transactions={detail.transactions} />}
		</>
	)
}

export default withStyles(styles)(GoalDetail)
