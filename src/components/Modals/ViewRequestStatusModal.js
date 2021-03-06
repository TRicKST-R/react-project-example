import React from 'react'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import green from '@material-ui/core/colors/green'
import Divider from '@material-ui/core/Divider'

const styles = {
	p: {
		height: '24px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	center: {
		width: 500,
		margin: '0 auto'
	},
	btn: {
		display: 'block',
		margin: '40px auto 0 auto'
	},
	checkbox: {
		color: green[600],
		marginRight: '-14px !important',
		'&$checked': {
			color: green[500]
		}
	},
	checked: {}
}

const ViewRequestStatusModal = props => {
	const { close, data, classes } = props
	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 40 }}>
					Account Request Status
				</Typography>
				<Divider style={{ marginBottom: 40 }} />
				<div className={classes.center}>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>account_id:</span> {data.account_id}
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>status:</span> {data.status}
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>can_trade:</span>
						<Checkbox
							checked={data.can_trade}
							classes={{
								root: classes.checkbox,
								checked: classes.checked
							}}
						/>
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>can_trade_options:</span>
						<Checkbox
							checked={data.can_trade_options}
							classes={{
								root: classes.checkbox,
								checked: classes.checked
							}}
						/>
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>can_fund:</span>
						<Checkbox
							checked={data.can_fund}
							classes={{
								root: classes.checkbox,
								checked: classes.checked
							}}
						/>
					</Typography>
					<Typography gutterBottom component="p" className={classes.p}>
						<span>margin_agreement:</span> {data.margin_agreement || 'null'}
					</Typography>
					<Button
						variant="contained"
						color="primary"
						size="large"
						onClick={close}
						className={classes.btn}
					>
						Close
					</Button>
				</div>
			</Paper>
		</Modal>
	)
}

export default withStyles(styles)(ViewRequestStatusModal)
