import React, { useRef } from 'react'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useFormInput } from '../../CustomHooks'
import { withStyles } from '@material-ui/core/styles'
import Select from '@material-ui/core/Select'
import OutlinedInput from '@material-ui/core/OutlinedInput'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'
import Divider from '@material-ui/core/Divider'

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
	}
}

const UpdateAccountSuitModal = props => {
	const { classes, close, send, data } = props
	const { time_horizon, liquidity_needs } = data
	const inputLabel = useRef(null)

	const agentName = useFormInput('')
	const time_horizonField = useFormInput(time_horizon)
	const liquidity_needsField = useFormInput(liquidity_needs)

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<h2>Update Account Suitability</h2>
				<Divider style={{ marginBottom: 40 }} />
				<div className={classes.formContainer}>
					<TextField
						label="Agent name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...agentName}
					/>
					<FormControl variant="outlined" className={classes.textField}>
						<InputLabel ref={inputLabel}>Time horizon</InputLabel>
						<Select {...time_horizonField} input={<OutlinedInput labelWidth={100} />}>
							<MenuItem value={'SHORT'}>SHORT</MenuItem>
							<MenuItem value={'AVERAGE'}>AVERAGE</MenuItem>
							<MenuItem value={'LONGEST'}>LONGEST</MenuItem>
						</Select>
					</FormControl>
					<FormControl variant="outlined" className={classes.textField}>
						<InputLabel ref={inputLabel}>liquidity needs</InputLabel>
						<Select {...liquidity_needsField} input={<OutlinedInput labelWidth={100} />}>
							<MenuItem value={'VERY_IMPORTANT'}>VERY_IMPORTANT</MenuItem>
							<MenuItem value={'SOMEWHAT_IMPORTANT'}>SOMEWHAT_IMPORTANT</MenuItem>
							<MenuItem value={'NOT_IMPORTANT'}>NOT_IMPORTANT</MenuItem>
						</Select>
					</FormControl>
				</div>
				<div className={classes.center}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => {
							send(agentName.value, {
								time_horizon: time_horizonField.value,
								liquidity_needs: liquidity_needsField.value
							})
							close()
						}}
						className={classes.btn}
					>
						Update
					</Button>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={close}
						className={classes.btn}
					>
						Cancel
					</Button>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(UpdateAccountSuitModal)
