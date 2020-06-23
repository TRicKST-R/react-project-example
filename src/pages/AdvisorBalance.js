import React, { Component } from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
//import Progress from '../components/Progress'
import EquitiesPortfolio from '../components/EquitiesPortfolio'
import { formatCurrency } from '../utils/CurrencyHelper'
import { addSnack } from '../modules/Snack/Snack.state'
import { startSpinner, stopSpinner } from '../modules/Spinner/Spinner.state'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
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

class AdvisorBalance extends Component {
	constructor(props) {
		super(props)
		this.state = {
			balance: null
		}
	}

	componentWillMount() {
		this.props.startSpinner()
		fetch('https://api.uat2.test.lovedwealth.com/v1/advisorbalance?recommendation=true')
			.then(response => {
				if (response.status !== 200) {
					this.props.stopSpinner()
					console.log('Looks like there was a problem. Status Code: ' + response.status)
					return
				}
				response.json().then(data => {
					this.setState({ balance: data })
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
		const { balance } = this.state
		return (
			<div>
				{balance &&
				balance.account_cash_portfolio &&
				balance.account_cash_portfolio.pending &&
				balance.account_cash_portfolio.recommendation ? (
					<Paper className={classes.root} elevation={10}>
						<Typography gutterBottom variant="h5" component="h2">
							Advisor balance
						</Typography>
						<Divider className={classes.divider} />
						<div className={classes.container}>
							<div className={classes.infoBlock}>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>available_to_withdraw:</span>
									{formatCurrency(balance.account_cash_portfolio.available_to_withdraw)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>available_to_trade:</span>
									{formatCurrency(balance.account_cash_portfolio.available_to_trade)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>increase:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.increase)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>decrease:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.decrease)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>cash_balance:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.cash_balance)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>buy_trades:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.buy_trades)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>sell_trades:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.sell_trades)}
								</Typography>
							</div>
							<div className={classes.infoBlock}>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>withdrawals:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.withdrawals)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>deposits:</span>
									{formatCurrency(balance.account_cash_portfolio.pending.deposits)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>cash_balance:</span>
									{formatCurrency(balance.account_cash_portfolio.cash_balance)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>Recommendation:</span>
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>surplus_cash:</span>
									{formatCurrency(balance.account_cash_portfolio.recommendation.surplus_cash)}
								</Typography>
								<Typography gutterBottom component="p" className={classes.p}>
									<span>total_value:</span>
									{formatCurrency(balance.account_cash_portfolio.recommendation.total_value)}
								</Typography>
							</div>
						</div>

						<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 80 }}>
							account_equities_portfolio
						</Typography>
						<Divider className={classes.divider} />

						<EquitiesPortfolio equities={balance.account_equities_portfolio} />
					</Paper>
				) : (
					<h3>Advisor balance not found</h3>
				)}
			</div>
		)
	}
}

const Styled = withStyles(styles)(AdvisorBalance)

export default connect(
	null,
	dispatch => ({
		addSnack: bindActionCreators(addSnack, dispatch),
		startSpinner: bindActionCreators(startSpinner, dispatch),
		stopSpinner: bindActionCreators(stopSpinner, dispatch)
	})
)(Styled)
