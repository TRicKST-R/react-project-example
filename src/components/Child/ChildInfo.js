import Badge from '@material-ui/core/Badge'
import Button from '@material-ui/core/Button'
import green from '@material-ui/core/colors/green'
import Divider from '@material-ui/core/Divider'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Create from '@material-ui/icons/Create'
import React, { Component } from 'react'
import defaultUser from '../../assets/default_user.png'
import relationship from '../../assets/image/relationship.png'
import { VIEW_PROFILE_IMAGE, FETCH_OBJECT_DETAILS } from '../../root/Graphql'
import { SEND_SQS_MESSAGE } from '../../root/Mutations'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import getChunk, { mutation, getPublicChunk } from '../../utils/GetChunk'
import SendEmailModal from '../Modals/SendEmailModal'

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
		padding: '16px 40px',
		width: '100%'
	},
	infoBlock: {
		minWidth: 100
	},
	btnConatiner: {
		margin: '24px 0',
		display: 'flex'
	},
	btn: {
		marginRight: 24
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	btnWrapper: {
		position: 'relative'
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	avatar: {
		maxWidth: 50,
		display: 'block',
		margin: '0 auto 8px auto'
	}
}

class ChildInfo extends Component {
	constructor(props) {
		super(props)
		this.state = {
			emailOpened: false,
			currentImageBinary: null,
			createdByName: "",
			creadtedByFlag: false
		}
	}

	closeEmail = () => this.setState({ emailOpened: false })
	emailOpen = () => this.setState({ emailOpened: true })

	sendSqs = payload => {
		const payload2 = {
			sprout_id: this.props.child.sprout_id,
			documents: payload.document
		}
		const variables = {
			user_id: this.props.parentId,
			queue_name: payload.queue_name,
			payload: JSON.stringify({
				template: payload.template,
				user_id: this.props.parentId,
				payload: payload2
			})
		}
		mutation(SEND_SQS_MESSAGE, variables).then(data => {
			if (data && data.send_sqs_message && data.send_sqs_message.message)
				this.props.addSuccess(data.send_sqs_message.message)
		})
		this.closeEmail()
	}

	componentDidMount() {
		
		getPublicChunk(FETCH_OBJECT_DETAILS, {object_id: this.props.child.created_by}).then(data => {
			let fetch_detail = data.fetch_detail;
			if(fetch_detail && fetch_detail.output && fetch_detail.output.detail && fetch_detail.output.detail.length) {
				let fullParentName = fetch_detail.output.detail[0] ? fetch_detail.output.detail[0].caption_1 + " " + fetch_detail.output.detail[0].caption_2: null;
				this.setState({
					createdByName: fullParentName
				})
			}
		})
		
	}


	componentWillReceiveProps(nextProps) {
		if (nextProps.child.image_url !== null) {
			const variables = {
				key: nextProps.child.image_url,
				user_id: this.props.parentId
			}
			getChunk(VIEW_PROFILE_IMAGE, variables).then(data => {
				if (data && data.view_profile_image) {
					this.setState({ currentImageBinary: data.view_profile_image.binary_image_data })
				} else this.props.addSnack('GraphQL bad response view profile image')
			})
		} else {
			this.setState({
				currentImageBinary: null
			})
		}

	}

	render() {
		const { classes, child, parentId } = this.props

		return (
			<>
				{child && (
					<div className={classes.row}>
						<div className={classes.infoBlock}>
							<img
								src={
									this.state.currentImageBinary
										? `data:image/*;base64,${this.state.currentImageBinary}`
										: defaultUser
								}
								className={classes.avatar}
								alt="img"
							/>
							<Typography gutterBottom component="p" className="tltp" data-title="name">
								{`${child.first_name} ${child.last_name}`}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="date_of_birth">
								{child.date_of_birth}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title="sprout_id">
								{child.sprout_id}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="broker_dealer_account_id"
							>
								{child.broker_dealer_account_id}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="apex_account_id">
								{child.apex_account_id}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="share_code">
								{child.share_code}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="broker_dealer_account_status"
							>
								{child.broker_dealer_account_status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="status">
								{child.status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="relationship">
								{child.attributes.relationship}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="bank_created">
								{child.bank_created}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title="ssn_entered">
								{child.ssn_entered}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="account_status">
								{child.account_status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="bank_entered">
								{child.bank_entered}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="funding_status">
								{child.funding_status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="handle">
								{child.handle}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="secondary_bank_account"
							>
								{child.secondary_bank_account}
							</Typography>
							<Typography
								gutterBottom
								component="p"
								className="tltp"
								data-title="secondary_bank_name"
							>
								{child.secondary_bank_name}
							</Typography>
						</div>
						<div className={classes.infoBlock}>
							<Typography gutterBottom component="p" className="tltp" data-title={"created_by: " + child.created_by}>
								{this.state.createdByName}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="created_at">
								{getDMYTFromUtc(child.created_at)}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title={"updated_by: "+ child.updated_by}>
								{this.state.createdByName}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="updated_at">
								{getDMYTFromUtc(child.updated_at)}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="bank_status">
								{child.bank_status}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="referral_code">
								{child.referral_code}
							</Typography>
							<Typography gutterBottom component="p" className="tltp" data-title="feature">
								{child.feature}
							</Typography>
						</div>
						<Badge color="primary" showZero badgeContent={child.notification}>
							<Button
								size="small"
								color="primary"
								onClick={this.emailOpen}
								variant="outlined"
								className="tltp"
								data-title="notification"
								style={{ minWidth: 29 }}
							>
								<Create />
							</Button>
						</Badge>
					</div>
				)}
				{child && child.attribute && child.attribute[0] && child.attribute[0].relationship && (
					<div>
						<Divider />
						{child && child.attribute && child.attribute[1] && child.attribute[1].user && (
							<>
								<Typography gutterBottom component="p" style={{ marginLeft: 15 }}>
									<img height="95px" alt="not found" src={relationship} />
								</Typography>
								<div className={classes.row}>
									<div className={classes.infoBlock}>
										<img
											src={
												child.attribute[1].user.image_url
													? child.attribute[1].user.image_url
													: defaultUser
											}
											className={classes.avatar}
											alt="img"
										/>
										<Typography gutterBottom component="p" className="tltp" data-title="name">
											{`${child.attribute[1].user.first_name} ${child.attribute[1].user.last_name}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="email">
											{`${child.attribute[1].user.email}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="date_of_birth"
										>
											{`${child.attribute[1].user.date_of_birth}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="phone">
											{`${child.attribute[1].user.phone}`}
										</Typography>
									</div>
									<div className={classes.infoBlock}>
										<Typography gutterBottom component="p" className="tltp" data-title="address">
											{child.attribute[1].user.line_1}, {child.attribute[1].user.city},{' '}
											{child.attribute[1].user.state}, {child.attribute[1].user.country},{' '}
											{child.attribute[1].user.post_code}
										</Typography>
									</div>
									<div className={classes.infoBlock}>
										<Typography gutterBottom component="p" className="tltp" data-title="created_at">
											{getDMYTFromUtc(child.attribute[1].user.created_at) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="updated_at">
											{getDMYTFromUtc(child.attribute[1].user.updated_at) || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="created_by">
											{child.attribute[1].user.created_by || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="updated_by">
											{child.attribute[1].user.updated_by || 'null'}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="user_id">
											{`${child.attribute[1].user.user_id}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="handle">
											{`${child.attribute[1].user.handle}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="current_funding_source_id"
										>
											{`${child.attribute[1].user.current_funding_source_id}`}
										</Typography>
									</div>
									<div className={classes.infoBlock}>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="bank_entered"
										>
											{`${child.attribute[1].user.bank_entered}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="current_bank_name"
										>
											{`${child.attribute[1].user.current_bank_name}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="current_funding_source_account"
										>
											{`${child.attribute[1].user.current_funding_source_account}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="current_funding_source_account"
										>
											{`${child.attribute[1].user.referral_code}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="share_code">
											{`${child.attribute[1].user.share_code}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="current_funding_source_status"
										>
											{`${child.attribute[1].user.current_funding_source_status}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="email_verified"
										>
											{`${child.attribute[1].user.email_verified}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="funding_status"
										>
											{`${child.attribute[1].user.funding_status}`}
										</Typography>
									</div>
									<div className={classes.infoBlock}>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="ssn_entered"
										>
											{`${child.attribute[1].user.ssn_entered}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="risk_score">
											{`${child.attribute[1].user.risk_score}`}
										</Typography>
										<Typography gutterBottom component="p" className="tltp" data-title="is_active">
											{`${child.attribute[1].user.is_active}`}
										</Typography>
										<Typography
											gutterBottom
											component="p"
											className="tltp"
											data-title="notification"
										>
											{`${child.attribute[1].user.notification}`}
										</Typography>
									</div>
								</div>
							</>
						)}
						<Divider />
					</div>
				)}

				{this.state.emailOpened && (
					<SendEmailModal
						closeEmail={this.closeEmail}
						sendSqs={this.sendSqs}
						user_email={''}
						user_id={parentId}
						sprout_id={child.sprout_id}
						notification={child.notification}
						launched_from="child"
						recipient="child"
					/>
				)}
			</>
		)
	}
}

export default withStyles(styles)(ChildInfo)
