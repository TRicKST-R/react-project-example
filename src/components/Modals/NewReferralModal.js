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

const NewReferralModal = props => {
	const { send, goals } = props
	const [goalId, setGoalId] = useState('')
	const [amount, setAmount] = useState('')
	const [comments, setComments] = useState('')
	const [referenceId, setReferenceId] = useState('')
	const [showGoalNameError, setGoalNameError] = useState(false)
	const [showAmountError, setAmountError] = useState(false)
	const [showReferenceError, setReferenceError] = useState(false)
	const { close, classes } = props
	const inputLabel = useRef(null)

	const handleSubmit = () => {
		if (goalId) {
			if (amount) {
				if (referenceId) {
					send(goalId, amount, comments, referenceId)
					close()
				} else {
					setReferenceError(true)
				}
			} else {
				setAmountError(true)
				if (!referenceId) {
					setReferenceError(true)
				}
			}
		} else if (amount) {
			if (!referenceId) {
				setReferenceError(true)
			}
			setGoalNameError(true)
		} else {
			if (!referenceId) {
				setReferenceError(true)
			}
			setAmountError(true)
			setGoalNameError(true)
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
								goal name
							</h3>
						</Grid>
						<Grid item xs={7}>
							<FormControl
								className={classes.textField}
								style={{ marginTop: 0, marginBottom: 0, paddingRight: '20%', textAlign: 'left' }}
							>
								<InputLabel ref={inputLabel}>goal name</InputLabel>
								<Select
									error={showGoalNameError}
									value={goalId}
									onChange={event => {
										setGoalId(event.target.value)
										setGoalNameError(false)
									}}
								>
									{goals &&
										goals.map((goal, index) => (
											<MenuItem value={goal.goal_id} key={index}>
												{goal.name}
											</MenuItem>
										))}
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
						<Grid item xs={5} style={{ textAlign: 'left', margin: 0, marginTop: '2%' }}>
							<h3
								className={classes.textField}
								style={{ marginTop: '5%', marginBottom: 0, paddingLeft: '10%' }}
							>
								external_reference_id
							</h3>
						</Grid>
						<Grid item xs={7} style={{ margin: 0 }}>
							<TextField
								error={showReferenceError}
								id="external_reference_id"
								value={referenceId}
								label="external_reference_id"
								multiline
								style={{ marginTop: 0, marginBottom: 0, paddingRight: '20%' }}
								rows="1"
								className={classes.textField}
								margin="normal"
								name="external_reference_id"
								onChange={event => {
									setReferenceId(event.target.value)
									setReferenceError(false)
								}}
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

export default withStyles(styles)(NewReferralModal)
