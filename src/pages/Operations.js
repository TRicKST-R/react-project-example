import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import { getDMYTFromUtc } from '../utils/DateHelper'
import Divider from '@material-ui/core/Divider'
//import Progress from '../components/Progress'
import Trades from '../components/Trades'
import { formatCurrency } from '../utils/CurrencyHelper'

import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addSnack } from '../modules/Snack/Snack.state'
import { startSpinner, stopSpinner } from '../modules/Spinner/Spinner.state'

const styles = {
	container: {
		display: 'flex',
		justifyContent: 'center'
	},
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0'
	},
	p: {
		lineHeight: '24px',
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	infoBlock: {
		maxWidth: 340,
		margin: '0 40px',
		width: '100%',
		'& > p': {
			display: 'flex',
			justifyContent: 'space-between'
		}
	},
	tableRow: {
		'& > th': {
			whiteSpace: 'nowrap',
			padding: 4,
			fontSize: 11
		},
		'& > td': {
			whiteSpace: 'nowrap',
			padding: 4
		}
	},
	tableContainer: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	tableWrapper: {
		flexBasis: '48%'
	}
}

class Operations extends Component {
	constructor(props) {
		super(props)
		this.state = {
			statistics: null,
			stopProgress: true
		}
	}

	componentWillMount() {
		this.props.startSpinner()
		fetch(
			'https://uat2.payments.lovedwealth.com/datasets/2019/05/18/lw-sam-bau-statistics-3-UAT2.json'
		)
			.then(response => {
				this.props.stopSpinner()
				if (response.status !== 200) {
					this.props.stopSpinner()
					console.log('Looks like there was a problem. Status Code: ' + response.status)
					return
				}
				response.json().then(data => {
					this.setState({ statistics: data })
					this.props.stopSpinner()
				})
			})
			.catch(err => {
				this.props.addSnack(err.message)
				this.props.stopSpinner()
			})
	}

	render() {
		const { classes } = this.props
		const { statistics } = this.state
		return (
			<div>
				{statistics ? (
					<Paper className={classes.root} elevation={10}>
						<Typography gutterBottom variant="h5" component="h2">
							Statistics
						</Typography>
						<Divider className={classes.divider} />
						<div className={classes.container}>
							<div className={classes.infoBlock}>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>environment:</span>
									{statistics.environment}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>start_time:</span>
									{getDMYTFromUtc(statistics.start_time)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>end_time:</span>
									{statistics.end_time}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>time_taken:</span>
									{statistics.time_taken}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>users_count:</span>
									{statistics.user.count}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>sprouts_count:</span>
									{statistics.sprout.count}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>goals_count:</span>
									{statistics.goal.count}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>approved_accounts:</span>
									{statistics.account.approved_accounts}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>linked_funding_sources:</span>
									{statistics.funding_source.linked_funding_sources}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>linked_sources:</span>
									{statistics.funding_source.linked_sources}
								</Typography>
							</div>
							<div className={classes.infoBlock}>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>buy_count:</span>
									{statistics.trades.total.buy.count}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>amount:</span>
									{formatCurrency(statistics.trades.total.buy.amount)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>sell_count:</span>
									{statistics.trades.total.sell.count}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>sell_amount:</span>
									{formatCurrency(statistics.trades.total.sell.amount)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_transit_links:</span>
									{statistics.transfer.total_transit_links}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_transfers:</span>
									{statistics.transfer.total_transfers}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_transferred_amount:</span>
									{formatCurrency(statistics.transfer.total_transferred_amount)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_withdrawals:</span>
									{statistics.withdrawal.total_withdrawals}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_withdrawn_amount:</span>
									{formatCurrency(statistics.withdrawal.total_withdrawn_amount)}
								</Typography>
							</div>
						</div>

						<div className={classes.tableContainer}>
							<div className={classes.tableWrapper}>
								<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 80 }}>
									buy
								</Typography>
								<Divider className={classes.divider} />
								<Trades trades={statistics.trades.buy} />
							</div>
							<div className={classes.tableWrapper}>
								<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 80 }}>
									sell
								</Typography>
								<Divider className={classes.divider} />
								<Trades trades={statistics.trades.sell} />
							</div>
						</div>
					</Paper>
				) : (
					<h3>Operations not found</h3>
				)}
			</div>
		)
	}
}

const Styled = withStyles(styles)(Operations)

export default connect(
	null,
	dispatch => ({
		addSnack: bindActionCreators(addSnack, dispatch),
		startSpinner: bindActionCreators(startSpinner, dispatch),
		stopSpinner: bindActionCreators(stopSpinner, dispatch)
	})
)(Styled)
