import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import FastClone from 'fastest-clone'
import {
	Typography,
	Divider,
	Fab,
	ExpansionPanel,
	ExpansionPanelSummary,
	ExpansionPanelDetails,
	Checkbox
} from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import ExpandLessIcon from '@material-ui/icons/ExpandLess'
import green from '@material-ui/core/colors/green'

import { formatCurrency } from '../utils/CurrencyHelper'

const hasOwnProperty = Object.prototype.hasOwnProperty

function isEmpty(obj) {
	if (obj == null) return true
	if (obj.length > 0) return false
	if (obj.length === 0) return true
	if (typeof obj !== 'object') return true
	for (var key in obj) {
		if (hasOwnProperty.call(obj, key)) return false
	}
	return true
}

const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		height: 48,
		alignItems: 'center',
		'& p': {
			fontSize: 12
		}
	},
	childRow: {
		boxSizing: 'border-box'
	},
	checkbox: {
		color: green[600],
		'&$checked': {
			color: green[500]
		}
	},
	checked: {},
	subhead: {
		fontWeight: 'bold',
		textAlign: 'center',
		marginBottom: 4
	},
	expanded: {
		padding: '24px 314px'
	},
	plusBtn: {
		backgroundColor: green[600],
		'&:hover': {
			backgroundColor: green[500]
		}
	}
}

class Trades extends Component {
	constructor(props) {
		super(props)
		this.state = {
			orders: [],
			bdOrders: []
		}
	}

	componentWillMount = () => {
		const orders = FastClone.cloneArray(this.props.orders.admin.security_order_links)
		const bdOrders = FastClone.cloneArray(this.props.orders.admin.bd_orders)
		orders.map(order => (order.expanded = false))
		bdOrders.map(bdOrder => {
			bdOrder.expanded = false
			return (bdOrder.legsExpanded = false)
		})
		this.setState({ orders, bdOrders })
	}

	expandOrder = index => {
		const orders = FastClone.cloneArray(this.state.orders)
		orders[index].expanded = !this.state.orders[index].expanded
		this.setState({ orders })
	}

	expandBdOrder = index => {
		const bdOrders = FastClone.cloneArray(this.state.bdOrders)
		bdOrders[index].expanded = !this.state.bdOrders[index].expanded
		this.setState({ bdOrders })
	}

	expandBdOrderLegs = index => {
		const bdOrders = FastClone.cloneArray(this.state.bdOrders)
		bdOrders[index].legsExpanded = !this.state.bdOrders[index].legsExpanded
		this.setState({ bdOrders })
	}

	render() {
		const { classes } = this.props

		return (
			<div style={{ marginTop: 30 }}>
				<ExpansionPanel square>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<span className="customTitle">Orders</span>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ display: 'block', height: 500, overflowY: 'scroll' }}>
						<div className={classes.row}>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								allocations
							</Typography>
							<Typography component="p" style={{ flexBasis: 200 }} className="fieldName">
								quantity
							</Typography>
							<Typography component="p" style={{ flexGrow: 1 }} className="fieldName">
								security_order_id
							</Typography>
							<Typography component="p" style={{ flexBasis: 180 }} className="fieldName">
								security_order_status
							</Typography>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								symbol
							</Typography>
							<Typography component="p" style={{ flexBasis: 120 }} className="fieldName">
								total_amount
							</Typography>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								type
							</Typography>
						</div>
						{this.state.orders.map((order, index) => (
							<div key={index}>
								<Divider />
								<div className={classes.row}>
									<div style={{ flexBasis: 100 }}>
										<Fab
											size="small"
											color="primary"
											onClick={() => this.expandOrder(index)}
											className={this.state.orders[index].expanded ? '' : classes.plusBtn}
										>
											{this.state.orders[index].expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
										</Fab>
									</div>
									<Typography component="p" style={{ flexBasis: 200 }} className="field">
										{order.quantity}
									</Typography>
									<Typography component="p" style={{ flexGrow: 1, fontSize: 12 }} className="field">
										{order.security_order_id}
									</Typography>
									<Typography
										component="p"
										style={{ flexBasis: 180, fontSize: 12 }}
										className="field"
									>
										{order.security_order_status}
									</Typography>
									<Typography component="p" style={{ flexBasis: 100 }} className="field">
										{order.symbol}
									</Typography>
									<Typography component="p" style={{ flexBasis: 120 }} className="field">
										{formatCurrency(order.total_amount)}
									</Typography>
									<Typography component="p" style={{ flexBasis: 100 }} className="field">
										{order.type}
									</Typography>
								</div>
								{this.state.orders[index].expanded && (
									<div key={index} className={classes.expanded}>
										<Typography className={classes.subhead}>Allocations</Typography>
										<Divider />
										<div className={`${classes.row} ${classes.childRow}`}>
											<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
												Amount
											</Typography>
											<Typography
												component="p"
												style={{ flexGrow: 1, textAlign: 'right' }}
												className="fieldName"
											>
												Account
											</Typography>
										</div>
										{this.state.orders[index].allocations.map((allocation, index) => {
											return [
												<Divider key={`${index}divider`} />,
												<div className={`${classes.row} ${classes.childRow}`} key={index}>
													<Typography component="p" style={{ flexBasis: 100 }} className="field">
														{formatCurrency(allocation.amount)}
													</Typography>
													<Typography
														component="p"
														style={{ flexGrow: 1, textAlign: 'right' }}
														className="field"
													>
														{allocation.account}
													</Typography>
												</div>
											]
										})}
									</div>
								)}
							</div>
						))}
					</ExpansionPanelDetails>
				</ExpansionPanel>

				<ExpansionPanel>
					<ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
						<span className="customTitle">BD Orders</span>
					</ExpansionPanelSummary>
					<ExpansionPanelDetails style={{ display: 'block', height: 500, overflowY: 'scroll' }}>
						<div className={classes.row}>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								Allocations
							</Typography>
							<Typography component="p" style={{ flexBasis: 210 }} className="fieldName">
								BD order id
							</Typography>
							<Typography component="p" style={{ flexBasis: 175 }} className="fieldName">
								BD order status
							</Typography>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								All or none
							</Typography>
							<Typography component="p" style={{ flexBasis: 120 }} className="fieldName">
								Allocation type
							</Typography>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								Legs
							</Typography>
							<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
								Limit price
							</Typography>
							<Typography component="p" style={{ flexBasis: 80 }} className="fieldName">
								Order type
							</Typography>
							<Typography component="p" style={{ flexBasis: 80 }} className="fieldName">
								Quantity
							</Typography>
							<Typography component="p" style={{ flexBasis: 80 }} className="fieldName">
								Time in force
							</Typography>
						</div>
						{this.state.bdOrders.map((order, index) => (
							<div key={index}>
								<Divider />
								<div className={classes.row}>
									<div style={{ flexBasis: 100 }}>
										<Fab
											size="small"
											color="primary"
											onClick={() => this.expandBdOrder(index)}
											className={this.state.bdOrders[index].expanded ? '' : classes.plusBtn}
										>
											{this.state.bdOrders[index].expanded ? (
												<ExpandLessIcon />
											) : (
												<ExpandMoreIcon />
											)}
										</Fab>
									</div>
									<Typography component="p" style={{ flexBasis: 210 }} className="field">
										{order.bd_order_id}
									</Typography>
									<Typography component="p" style={{ flexBasis: 175 }} className="field">
										{order.bd_order_status}
									</Typography>
									<Checkbox
										style={{ flexBasis: 100 }}
										checked={order.payload.all_or_none}
										classes={{
											root: classes.checkbox,
											checked: classes.checked
										}}
									/>
									<Typography component="p" style={{ flexBasis: 120 }} className="field">
										{order.payload.allocation_type}
									</Typography>
									<div style={{ flexBasis: 100 }}>
										<Fab
											size="small"
											color="primary"
											onClick={() => this.expandBdOrderLegs(index)}
											className={this.state.bdOrders[index].legsExpanded ? '' : classes.plusBtn}
										>
											{this.state.bdOrders[index].legsExpanded ? (
												<ExpandLessIcon />
											) : (
												<ExpandMoreIcon />
											)}
										</Fab>
									</div>
									<Typography component="p" style={{ flexBasis: 100 }} className="field">
										{isEmpty(order.payload.limit_price) ? 'null' : order.payload.limit_price}
									</Typography>
									<Typography component="p" style={{ flexBasis: 80 }} className="field">
										{order.payload.order_type}
									</Typography>
									<Typography component="p" style={{ flexBasis: 80 }} className="field">
										{order.payload.quantity}
									</Typography>
									<Typography component="p" style={{ flexBasis: 80 }} className="field">
										{order.payload.time_in_force}
									</Typography>
								</div>
								{this.state.bdOrders[index].expanded && (
									<div key={index} className={classes.expanded}>
										<Typography className={classes.subhead}>Allocations</Typography>
										<Divider />
										<div className={`${classes.row} ${classes.childRow}`}>
											<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
												Amount
											</Typography>
											<Typography
												component="p"
												style={{ flexGrow: 1, textAlign: 'right' }}
												className="fieldName"
											>
												Account
											</Typography>
										</div>
										{this.state.bdOrders[index].payload.allocations.map((allocation, index) => {
											return [
												<Divider key={`${index}divider`} />,
												<div className={`${classes.row} ${classes.childRow}`} key={index}>
													<Typography component="p" style={{ flexBasis: 100 }} className="field">
														{formatCurrency(allocation.amount)}
													</Typography>
													<Typography
														component="p"
														style={{ flexGrow: 1, textAlign: 'right' }}
														className="field"
													>
														{allocation.account}
													</Typography>
												</div>
											]
										})}
									</div>
								)}
								{this.state.bdOrders[index].legsExpanded && (
									<div key={`${index}leg`} className={classes.expanded}>
										<Typography className={classes.subhead}>Legs</Typography>
										<Divider />
										<div className={`${classes.row} ${classes.childRow}`}>
											<Typography component="p" style={{ flexBasis: 100 }} className="fieldName">
												Asset type
											</Typography>
											<Typography
												component="p"
												style={{ flexGrow: 1, textAlign: 'right' }}
												className="fieldName"
											>
												Position effect
											</Typography>
											<Typography
												component="p"
												style={{ flexBasis: 100, textAlign: 'right' }}
												className="fieldName"
											>
												Side
											</Typography>
											<Typography
												component="p"
												style={{ flexBasis: 100, textAlign: 'right' }}
												className="fieldName"
											>
												Symbol
											</Typography>
										</div>
										{this.state.bdOrders[index].payload.legs.map((leg, index) => {
											return [
												<Divider key={`${index}divider`} />,
												<div className={`${classes.row} ${classes.childRow}`} key={index}>
													<Typography component="p" style={{ flexBasis: 100 }} className="field">
														{leg.asset_type}
													</Typography>
													<Typography
														component="p"
														style={{ flexBasis: 100, textAlign: 'right' }}
														className="field"
													>
														{leg.position_effect}
													</Typography>
													<Typography
														component="p"
														style={{ flexBasis: 100, textAlign: 'right' }}
														className="field"
													>
														{leg.side}
													</Typography>
													<Typography
														component="p"
														style={{ flexBasis: 100, textAlign: 'right' }}
														className="field"
													>
														{leg.symbol}
													</Typography>
												</div>
											]
										})}
									</div>
								)}
							</div>
						))}
					</ExpansionPanelDetails>
				</ExpansionPanel>
			</div>
		)
	}
}

export default withStyles(styles)(Trades)
