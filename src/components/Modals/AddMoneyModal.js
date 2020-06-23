import React, { useRef, useState } from 'react'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import InputLabel from '@material-ui/core/InputLabel'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import YesNo from '../../components/YesNo'

const styles = {
	textField: {
		margin: 24,
		width: 300
	},
	formContainer: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'center',
		alignItems: 'center'
	},
	btn: {
		margin: 8
	},
	center: {
		display: 'flex',
		justifyContent: 'center'
	},
	paper: {
		textAlign: 'center'
	}
}

const AddMoneyModal = props => {
	const { send } = props
	const [transferType, setTransferType] = useState('')
	const [amount, setAmount] = useState('')
	const [comments, setComments] = useState('')
	const [showTransferTypeError, setTransfertypeError] = useState(false)
	const [showAmountError, setAmountError] = useState(false)
	const { close, classes } = props
	const inputLabel = useRef(null)

	const handleSubmit = () => {
		if (transferType) {
			if (amount) {
				send(transferType, amount, comments)
				close()
			} else {
				setAmountError(true)
			}
		} else if (amount) {
			setTransfertypeError(true)
		} else {
			setAmountError(true)
			setTransfertypeError(true)
		}
	}

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10} style={{ width: '35%', textAlign: 'center' }}>
				<h2>Instruction</h2>
				<div className={classes.formContainer}>
					<Grid container>
						<Grid item xs={5} style={{ textAlign: 'left', marginTop: '2%', marginBottom: 0 }}>
							<h3
								className={classes.textField}
								style={{ marginTop: '5%', marginBottom: 0, paddingLeft: '10%' }}
							>
								sub_type
							</h3>
						</Grid>
						<Grid item xs={7}>
							<FormControl
								className={classes.textField}
								style={{ marginTop: 0, marginBottom: 0, paddingRight: '20%', textAlign: 'left' }}
							>
								<InputLabel ref={inputLabel}>sub_type</InputLabel>
								<Select
									error={showTransferTypeError}
									value={transferType}
									onChange={event => {
										setTransferType(event.target.value)
										setTransfertypeError(false)
									}}
								>
									<MenuItem value={'refund'}>refund</MenuItem>
									<MenuItem value={'gift'}>gift</MenuItem>
									<MenuItem value={'transfer'}>transfer</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={5} style={{ textAlign: 'left', margin: 0, marginTop: '2%' }}>
							<h3
								className={classes.textField}
								style={{ marginTop: '5%', marginBottom: 0, paddingLeft: '10%' }}
							>
								amount
							</h3>
						</Grid>
						<Grid item xs={7} style={{ margin: 0 }}>
							<FormControl>
								<TextField
									error={showAmountError}
									type="number"
									id="amount"
									value={amount}
									style={{ marginTop: 0, marginBottom: 0, paddingRight: '20%' }}
									label="Amount"
									className={classes.textField}
									margin="normal"
									name="amount"
									onChange={event => {
										setAmount(event.target.value)
										setAmountError(false)
									}}
								/>
							</FormControl>
						</Grid>
						<Grid item xs={5} style={{ textAlign: 'left', margin: 0, marginTop: '2%' }}>
							<h3
								className={classes.textField}
								style={{ marginTop: '5%', marginBottom: 0, paddingLeft: '10%' }}
							>
								comments
							</h3>
						</Grid>
						<Grid item xs={7} style={{ margin: 0 }}>
							<TextField
								id="comments"
								value={comments}
								label="Comments"
								multiline
								style={{ marginTop: 0, marginBottom: 0, paddingRight: '20%' }}
								rows="1"
								placeholder="text to appear in activity"
								className={classes.textField}
								margin="normal"
								name="comments"
								onChange={event => setComments(event.target.value)}
							/>
						</Grid>
					</Grid>
				</div>
				<div className={classes.center} style={{ margin: '2%' }}>
					<YesNo yes={handleSubmit} no={close} yesText="Deposit" noText="Cancel" />
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(AddMoneyModal)
