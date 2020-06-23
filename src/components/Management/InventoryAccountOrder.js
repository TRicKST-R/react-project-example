import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import InputLabel from '@material-ui/core/InputLabel'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import { CREATE_INVENTORY_ORDER } from '../../root/Graphql'
import { mutation } from '../../utils/GetChunk'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	formControl: {},
	inline: {
		display: 'inline-block',
		margin: '10px'
	},
	row: {
		display: 'flex',
		justifyContent: 'space-around',
		marginBottom: 10
	},
	infoBlock: {
		maxWidth: 500,
		minWidth: 275,
		margin: '0 4px'
	},
	mainDiv: {
		display: 'flex',
		alignItems: 'baseline',
		justifyContent: 'space-between'
	},
	divSpace: {
		width: '25%',
		margin: '0 20px'
	},
	p: {
		height: '24px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 15,
		marginTop: 15,
		'& > span': {
			fontWeight: 600,
			marginRight: 4,
			marginTop: 10,
			marginBottom: 10
		}
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	}
}

class InventoryAccountOrder extends Component {
	constructor(props) {
		super(props)
		this.state = {
			side: '',
			quantity: 1,
			symbol: '',
			sideError: false,
			symbolError: false,
			openOrderAcceptModal: false,
			orderInfo: null
		}
	}
	handleInputChange = event => {
		const target = event.target
		const value = target.type === 'file' ? target.files[0] : target.value
		const name = target.name
		this.setState({
			[name]: value
		})
	}
	closeOrderAccept = () => this.setState({ openOrderAcceptModal: false })
	setOrder = () => {
		if (this.state.side === '') {
			this.setState({ sideError: true })
		} else if (this.state.symbol === '') {
			this.setState({ symbolError: true, sideError: false })
		} else {
			var variables = {
				side: this.state.side,
				quantity: this.state.quantity,
				symbol: this.state.symbol
			}
			mutation(CREATE_INVENTORY_ORDER, variables)
				.then(data => {
					if (data && data.create_inventory_order) {
						this.setState({
							side: '',
							symbol: '',
							symbolError: false,
							sideError: false,
							openOrderAcceptModal: true,
							orderInfo: data.create_inventory_order
						})
					} else {
						this.props.addSnack('Somthing wrong')
					}
				})
				.catch(errors => this.props.addSnack('GraphQL bad response INVENTORY ORDER! '))
		}
	}

	render() {
		const { classes, property } = this.props
		const tickers =
			property &&
			JSON.parse(property.find(item => item.key === 'performance_tickers').MapAttribute)
				.tickers.split(',')
				.sort()

		return (
			<Paper className="paper" elevation={10}>
				<Typography gutterBottom variant="h6" component="h6">
					Place Order for Inventory Account
				</Typography>
				<div>
					<Grid item xs={12}>
						<form className={classes.root} autoComplete="off">
							<div className={classes.mainDiv}>
								<FormControl
									className={classes.formControl}
									error={this.state.sideError}
									style={{ width: '25%' }}
								>
									<InputLabel htmlFor="age-simple">Side</InputLabel>
									<Select name="side" value={this.state.side} onChange={this.handleInputChange}>
										<MenuItem value="Buy">Buy</MenuItem>
										<MenuItem value="Sell">Sell</MenuItem>
									</Select>
								</FormControl>
								<FormControl className={classes.divSpace}>
									<TextField
										id="standard-number"
										label="Quantity"
										type="number"
										name="quantity"
										value={this.state.quantity}
										margin="normal"
										onChange={this.handleInputChange}
										inputProps={{ min: 1, max: 100 }}
									/>
								</FormControl>

								<FormControl className={classes.divSpace} error={this.state.symbolError}>
									<InputLabel htmlFor="age-simple">Symbol</InputLabel>
									<Select name="symbol" value={this.state.symbol} onChange={this.handleInputChange}>
										{tickers &&
											tickers.map((doc, index) => (
												<MenuItem key={index} value={doc}>
													{doc}
												</MenuItem>
											))}
									</Select>
								</FormControl>

								<FormControl
									className={classes.formControl}
									style={{ marginTop: 25, width: '25%' }}
								>
									<Button
										variant="outlined"
										color="primary"
										onClick={this.setOrder}
										className={classes.button}
									>
										Place Order
									</Button>
								</FormControl>
							</div>
						</form>
					</Grid>
				</div>
				{this.state.openOrderAcceptModal && (
					<Dialog
						open={this.state.openOrderAcceptModal}
						maxWidth="md"
						onClose={this.closeOrderAccept}
					>
						<DialogTitle>Inventory order</DialogTitle>
						<DialogContent>
							{this.state.orderInfo && (
								<div className={classes.row}>
									<div className={classes.infoBlock}>
										legs Information
										<hr className={classes.custHr} />
										{this.state.orderInfo.legs && this.state.orderInfo.legs[0] && (
											<>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>leg_id :</span>
													{this.state.orderInfo.legs[0].leg_id}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>symbol :</span>
													{this.state.orderInfo.legs[0].symbol}
												</Typography>
												<Typography gutterBottom component="p" className={classes.p}>
													<span>side :</span>
													{this.state.orderInfo.legs[0].side}
												</Typography>
											</>
										)}
										<hr className={classes.custHr} />
										Id Information
										<hr className={classes.custHr} />
										<Typography gutterBottom component="p" className={classes.p}>
											<span>order_id:</span>
											{this.state.orderInfo.order_id}
										</Typography>
										<Typography gutterBottom component="p" className={classes.p}>
											<span>owner:</span>
											{this.state.orderInfo.owner}
										</Typography>
									</div>

									<div className={classes.infoBlock}>
										Order Information
										<hr className={classes.custHr} />
										<Typography gutterBottom component="p" className={classes.p}>
											<span>status :</span>
											{this.state.orderInfo.status}
										</Typography>
										<Typography gutterBottom component="p" className={classes.p}>
											<span>quantity :</span>
											{this.state.orderInfo.quantity}
										</Typography>
										<Typography gutterBottom component="p" className={classes.p}>
											<span>allocation_type :</span>
											{this.state.orderInfo.allocation_type}
										</Typography>
										<Typography gutterBottom component="p" className={classes.p}>
											<span>fill_simulation :</span>
											{this.state.orderInfo.fill_simulation}
										</Typography>
										<Typography gutterBottom component="p" className={classes.p}>
											<span>time_stamp :</span>
											{this.state.orderInfo.time_stamp}
										</Typography>
									</div>
								</div>
							)}
						</DialogContent>
						<DialogActions>
							<Button onClick={this.closeOrderAccept} color="primary">
								Close
							</Button>
						</DialogActions>
					</Dialog>
				)}
			</Paper>
		)
	}
}

export default withStyles(styles)(InventoryAccountOrder)
