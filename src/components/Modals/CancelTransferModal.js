import React from 'react'
import Paper from '@material-ui/core/Paper'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { formatCurrency } from '../../utils/CurrencyHelper'
import TextField from '@material-ui/core/TextField'
import Modal from '@material-ui/core/Modal'
import YesNo from '../YesNo'
import { useFormInput } from '../../CustomHooks'

const styles = {
	table: {
		'& th': {
			whiteSpace: 'nowrap',
			padding: 4
		},
		'& td': {
			padding: 4
		}
	},
	center: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		paddingTop: 40
	},
	btn: {
		margin: 8
	}
}

const CancelTransferModal = props => {
	const { classes, transfer, close, send } = props

	const comment = useFormInput('cancelled by admin')

	//const setComment = event => changeComment(event.target.value)

	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<div>
					<Typography gutterBottom variant="h5" component="h2">
						Cancel transfer
					</Typography>
					<Divider style={{ marginBottom: 40 }} />
					<Table className={classes.table}>
						<TableHead>
							<TableRow>
								<TableCell align="left">individual_transfer_amount</TableCell>
								<TableCell align="left">individual_transfer_id</TableCell>
								<TableCell align="left">bd_account_id</TableCell>
								<TableCell align="left">bd_transfer_id</TableCell>
								<TableCell align="left">transfer_reference_id</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							<TableRow>
								<TableCell align="left" component="th" scope="row">
									{formatCurrency(transfer.individual_transfer_amount)}
								</TableCell>
								<TableCell align="left">{transfer.individual_transfer_id}</TableCell>
								<TableCell align="left">{transfer.admin.bd_account_id}</TableCell>
								<TableCell align="left">{transfer.admin.bd_transfer_id}</TableCell>
								<TableCell align="left">{transfer.admin.transfer_reference_id}</TableCell>
							</TableRow>
						</TableBody>
					</Table>
					<div className={classes.center}>
						<TextField label="Comment" {...comment} />
						<Typography gutterBottom variant="h6">
							Are you sure you want cancel this transfer?
						</Typography>
						<YesNo yes={() => send(comment)} no={close} />
					</div>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(CancelTransferModal)
