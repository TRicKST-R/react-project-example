import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Divider, Button } from '@material-ui/core/'

import { getDMYTFromUtc } from '../../utils/DateHelper'
import { AddMoneyModal } from '../../components/Modals'
import { mutation } from '../../utils/GetChunk'
import { CREATE_INSTRUCTION } from '../../root/Mutations'
import image from '../../assets/image/money-suitcase.png'

const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	container: {
		display: 'flex'
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	block: {
		width: 400
	},
	btn: {
		marginLeft: 'auto',
		display: 'block',
		height: 36
	}
}

const Info = props => {
	const [addMoneyModal, setAddMoneyModalStatus] = useState(false)
	const { classes, info } = props

	const openAddMoneyModal = () => setAddMoneyModalStatus(true)

	const closeAddMoneyModal = () => setAddMoneyModalStatus(false)

	const sendAddMoney = (transferType, amount, comments) => {
		const { info, userId, addSnack, recallGoalsApi } = props
		const variables = {
			user_id: userId,
			sprout_id: info.sprout_id,
			goal_id: info.goal_id,
			amount: amount,
			sub_type: transferType,
			comments: comments
		}

		mutation(CREATE_INSTRUCTION, variables).then(data => {
			if (data && data.create_instruction && data.create_instruction.status === 'submitted') {
				recallGoalsApi()
			} else {
				addSnack('GraphQL bad response while deposit')
			}
		})
	}

	return (
		<>
			{info && (
				<div>
					<Button
						className={`${classes.btn} tltp`}
						variant="outlined"
						color="primary"
						onClick={openAddMoneyModal}
						size="small"
						data-title="deposit"
					>
						<img src={image} alt=""></img>
					</Button>
					<div className={classes.container}>
						<div className={classes.block}>
							<span className="customTitle">Goal Information</span>
							<Divider className="divider" />
							<Typography gutterBottom component="p" className="p">
								<span>name:</span>
								{info.name}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>target:</span>
								{info.target || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>end_date:</span>
								{getDMYTFromUtc(info.end_date) || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>image_url:</span>
								{info.image_url || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>path_locked:</span>
								{info.path_locked}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>description:</span>
								{info.description || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>handle:</span>
								{info.handle}
							</Typography>
							<Typography gutterBottom component="p" className="p" style={{ marginBottom: 16 }}>
								<span>share_code:</span>
								{info.share_code}
							</Typography>
							<span className="customTitle">Transfer Information</span>

							<Divider className="divider" />
							<Typography gutterBottom component="p" className="p">
								<span>transfer_reference_status:</span>
								{info.transfer_reference_status}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>transfer_reference_id:</span>
								{info.transfer_reference_id}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>initial_transfer_date:</span>
								{info.initial_transfer_date}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>next_transfer_date:</span>
								{info.next_transfer_date}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>transfer_amount:</span>
								{info.transfer_amount}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>transfer_frequency:</span>
								{info.transfer_frequency}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>type:</span>
								{info.type}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>auto_deposit:</span>
								{info.auto_deposit}
							</Typography>
						</div>

						<div className={classes.block} style={{ marginLeft: 104 }}>
							<span className="customTitle">ID and status</span>
							<Divider className="divider" />
							<Typography gutterBottom component="p" className="p">
								<span>status:</span>
								{info.status}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>goal_id:</span>
								{info.goal_id}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>path_id:</span>
								{info.path_id}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>sprout_id:</span>
								{info.sprout_id}
							</Typography>
							<Typography gutterBottom component="p" className="p" style={{ marginBottom: 16 }}>
								<span>current_portfolio_id:</span>
								{info.current_portfolio_id}
							</Typography>
							<span className="customTitle">Other Information</span>
							<Divider className="divider" />
							<Typography gutterBottom component="p" className="p">
								<span>created_by:</span>
								{info.created_by}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>updated_by:</span>
								{info.updated_by}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>created_at:</span>
								{getDMYTFromUtc(info.created_at)}
							</Typography>
							<Typography gutterBottom component="p" className="p">
								<span>updated_at:</span>
								{getDMYTFromUtc(info.updated_at)}
							</Typography>
						</div>
						{addMoneyModal && <AddMoneyModal close={closeAddMoneyModal} send={sendAddMoney} />}
					</div>
				</div>
			)}
		</>
	)
}

export default withStyles(styles)(Info)
