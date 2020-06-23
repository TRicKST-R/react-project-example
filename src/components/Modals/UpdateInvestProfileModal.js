import React from 'react'
import Paper from '@material-ui/core/Paper'
import Modal from '@material-ui/core/Modal'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import { useFormInput } from '../../CustomHooks'
import { withStyles } from '@material-ui/core/styles'
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

const UpdateInvestProfileModal = props => {
	const { classes, close, send, data } = props
	const {
		investmentObjective,
		investmentExperience,
		annualIncome,
		liquidNetWorth,
		totalNetWorth,
		riskTolerance,
		federalTaxBracketPercent
	} = data

	const agentName = useFormInput('')
	const investmentObjectiveField = useFormInput(investmentObjective || '')
	const investmentExperienceField = useFormInput(investmentExperience || '')
	const annualIncomeField = useFormInput(annualIncome || '')
	const liquidNetWorthField = useFormInput(liquidNetWorth || '')
	const totalNetWorthField = useFormInput(totalNetWorth || '')
	const riskToleranceField = useFormInput(riskTolerance || '')
	const federalTaxBracketPercentField = useFormInput(federalTaxBracketPercent || '')

	const risk_profile = {
		investment_objective: investmentObjectiveField.value,
		investment_experience: investmentExperienceField.value,
		annual_income: annualIncomeField.value,
		liquid_net_worth: liquidNetWorthField.value,
		total_net_worth: totalNetWorthField.value,
		risk_tolerance: riskToleranceField.value,
		federal_tax_bracket_percent: federalTaxBracketPercentField.value
	}

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<h2>Update Account Investment</h2>
				<Divider style={{ marginBottom: 40 }} />
				<div className={classes.formContainer}>
					<TextField
						label="Agent name"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...agentName}
					/>
					<TextField
						label="Investment objective"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...investmentObjectiveField}
					/>
					<TextField
						label="Investment experience"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...investmentExperienceField}
					/>
					<TextField
						label="Risk tolerance"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...riskToleranceField}
					/>
					<TextField
						label="Annual income"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...annualIncomeField}
					/>
					<TextField
						label="Liquid net worth"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...liquidNetWorthField}
					/>
					<TextField
						label="Total net worth"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...totalNetWorthField}
					/>
					<TextField
						label="Federal tax bracket percent"
						className={classes.textField}
						margin="normal"
						variant="outlined"
						{...federalTaxBracketPercentField}
					/>
				</div>
				<div className={classes.center}>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={() => {
							send(agentName.value, risk_profile)
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

export default withStyles(styles)(UpdateInvestProfileModal)
