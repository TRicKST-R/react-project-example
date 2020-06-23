import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/styles'
import { Typography, Button, Badge } from '@material-ui/core/'
import Create from '@material-ui/icons/Create'

import { getDMYFromUtc } from '../../utils/DateHelper'
import { SEND_SQS_MESSAGE } from '../../root/Mutations'
import { mutation } from '../../utils/GetChunk'
import { SendNotifModal } from '../../components/Modals'
import { FeatureModal } from '../../components/Modals'
import defaultUser from '../../assets/default_user.png'

const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40,
		position: 'relative'
	},
	p: {
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'baseline',
		padding: '16px 0 0 0'
	},
	avatar: {
		maxWidth: 128,
		maxHeight: 128,
		width: '100%',
		borderRadius: '50%',
		display: 'block'
	},
	avatarSmall: {
		maxHeight: 50,
		display: 'block'
	},
	infoBlock: {},
	avatarContainer: {
		position: 'absolute',
		top: 16,
		left: 'calc(50% - 64px)'
	},
	btn: {
		margin: '16px 8px 0 8px'
	},
	hrBorder: { borderTop: '1px solid #8c8989' }
}

class UserInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			userNotification: '',
			featureModal: false
		}
	}
	toggleFeature = boolean => {
		this.setState({
			featureModal: boolean
		})
	}
	closeEmail = () => this.setState({ emailOpened: false })
	emailOpen = userNotification => this.setState({ emailOpened: true, userNotification })
	sendSqs = payload => {
		let variables = {
			user_id: this.props.userId,
			queue_name: payload.queue_name,
			payload: JSON.stringify({
				user_id: this.props.userId,
				notification: payload.notification
			})
		}
		if (payload.queue_name === 'email_Q') {
			variables = {
				user_id: this.props.userId,
				queue_name: payload.queue_name,
				payload: JSON.stringify({
					user_id: this.props.userId,
					template: payload.template
				})
			}
		}
		mutation(SEND_SQS_MESSAGE, variables).then(data => {
			if (data && data.send_sqs_message && data.send_sqs_message.message)
				this.props.addSuccess(data.send_sqs_message.message)
		})
		this.closeEmail()
	}

	sendSqsFeature = payload => {
		let variables = {
			user_id: this.props.userId,
			queue_name: payload.queue_name,
			payload: JSON.stringify({
				user_id: this.props.userId,
				feature: payload.feature
			})
		}

		mutation(SEND_SQS_MESSAGE, variables).then(data => {
			if (data && data.send_sqs_message && data.send_sqs_message.message)
				this.props.addSuccess(data.send_sqs_message.message)
		})
		this.toggleFeature(false)
	}

	render() {
		const { classes, user, currentImageBinary } = this.props

		return (
			<>
				{user ? (
					<div className={classes.row}>
						<div className={classes.infoBlock}>
							<div style={{ marginBottom: 5, marginLeft: 30 }}>
								<img
									src={
										currentImageBinary ? `data:image/*;base64,${currentImageBinary}` : defaultUser
									}
									className={classes.avatarSmall}
									alt="img"
								/>
							</div>
							<Typography gutterBottom component="p" className="tltp" data-title="name">
								{`${user.first_name} ${user.last_name}`}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="email">
								{user.email}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="phone">
								{user.phone}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="date_of_birth">
								{getDMYFromUtc(user.date_of_birth)}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title="address">
								{user.line_1}, {user.city}, {user.state}, {user.country}, {user.post_code}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="user_id">
								{user && user.admin && user.admin.user_id}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="current_funding_source_id"
							>
								{user.current_funding_source_id}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="referral_code">
								{user.referral_code}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="share_code">
								{user.share_code}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="current_bank_name"
							>
								{user.current_bank_name}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="current_funding_source_account"
							>
								{user.current_funding_source_account}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="current_funding_source_status"
							>
								{user.current_funding_source_status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="bank_entered">
								{user.bank_entered}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="funding_status">
								{user.funding_status}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="secondary_bank_account"
							>
								{user.secondary_bank_account}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="secondary_bank_name"
							>
								{user.secondary_bank_name}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title="risk_score">
								{user.risk_score}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="is_active">
								{user && user.admin && (user.admin.is_active === true ? 'Active' : '')}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="email_verified">
								{user.email_verified}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="status">
								{(user && user.status) || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="handle">
								{user.handle}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title="created_by">
								{(user && user.admin && user.admin.created_by) || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="created_at">
								{(user && user.admin && user.admin.created_at) || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="updated_by">
								{(user && user.admin && user.admin.updated_by) || 'null'}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="updated_at">
								{(user && user.admin && user.admin.updated_at) || 'null'}
							</Typography>
						</div>
						<div
							className={classes.infoBlock}
							style={{ display: 'flex', flexWrap: 'wrap', width: '50px' }}
						>
							<Badge
								color="primary"
								showZero
								badgeContent={user.notification}
								style={{ marginBottom: '20px' }}
							>
								<Button
									size="small"
									style={{ minWidth: '29px' }}
									color="primary"
									onClick={() => this.emailOpen(user.notification)}
									variant="outlined"
									className="tltp"
									data-title="notification"
								>
									<Create />
								</Button>
							</Badge>
							<Badge color="primary" showZero badgeContent={user.feature}>
								<Button
									size="small"
									style={{ minWidth: '29px' }}
									color="primary"
									onClick={() => this.toggleFeature(true)}
									variant="outlined"
									className="tltp"
									data-title="feature"
								>
									<Create />
								</Button>
							</Badge>
						</div>
					</div>
				) : (
					<h3>User info not found</h3>
				)}
				{this.state.emailOpened && (
					<SendNotifModal
						closeEmail={this.closeEmail}
						sendSqs={this.sendSqs}
						user_email={user.email}
						current_notification={user.notification}
						recipient="user"
						userNotification={this.state.userNotification}
					/>
				)}
				{this.state.featureModal ? (
					<FeatureModal
						launched_from="Parent"
						recipient="Parent"
						user_id={this.props.user_id}
						user_email={''}
						notification={user.feature}
						closeEmail={this.toggleFeature}
						sendSqs={this.sendSqsFeature}
					/>
				) : null}
			</>
		)
	}
}

export default withStyles(styles)(UserInfo)
