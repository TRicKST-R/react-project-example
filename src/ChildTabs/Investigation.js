import React, { useState, useEffect } from 'react'
import {
	Typography,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Divider,
	Checkbox,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Button,
	Paper,
	Badge
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import { green } from '@material-ui/core/colors'
import Error from '@material-ui/icons/Error'
import Check from '@material-ui/icons/Check'
import Block from '@material-ui/icons/Block'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { getDMYTFromUtc } from '../utils/DateHelper'
import getChunk from '../utils/GetChunk'
import { FETCH_INVESTIGATION_STATUS } from '../root/Graphql'
import Progress from '../components/Progress'
import { addSnack } from '../modules/Snack/Snack.state'
import { SendEmailModal2 } from '../components/Modals'

const styles = {
	root: {
		padding: 40
	},
	table: {
		'& td': {
			padding: 8
		},
		'& th': {
			padding: 8
		}
	},
	menuItem: {
		outline: 'none',
		textAlign: 'center',
		padding: 8
	},
	menu: {
		minWidth: 400,
		outline: 'none'
	},
	checkbox: {
		color: green[400],
		'&$checked': {
			color: green[600]
		}
	},
	checked: {},
	row: {
		display: 'flex',
		alignItems: 'center',
		width: 500,
		justifyContent: 'space-between',
		flexBasis: '48%'
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	selectItem: {
		'& div': {
			fontSize: 13
		}
	},
	red: {
		backgroundColor: 'rgb(220, 0, 78)',
		color: '#fff'
	},
	green: {
		backgroundColor: 'green',
		color: '#fff'
	},
	common: {
		backgroundColor: '#1976d2',
		color: '#fff'
	},
	equifaxItem: {
		lineHeight: '40px',
		borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
		display: 'flex',
		flexWrap: 'wrap',
		alignItems: 'center'
	},
	chipWrapper: {
		flexBasis: 180,
		'& svg': {
			fill: '#fff'
		}
	},
	number: {
		width: 24
	},
	message: {
		fontSize: 14
	},
	comment: {
		fontSize: 14
	},
	title: {
		marginLeft: 16,
		color: '#fff'
	},
	content: {
		width: 1300,
		margin: '120px auto 40px auto',
		padding: 40
	},
	headContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 8
	}
}

const ViewAccountModal = props => {
	const { classes, investigationProps, closeModal = null /*documentProps*/ } = props
	const [content, setContent] = useState(null)
	const [title, setTitle] = useState(null)
	const [open, setOpen] = useState(false)
	const [investigation, setInvestigation] = useState(null)
	const [emailOpened, setEmailOpened] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		setLoading(true)
		getChunk(FETCH_INVESTIGATION_STATUS, investigationProps).then(data => {
			setLoading(false)
			if (data && data.fetch_investigation_status) setInvestigation(data.fetch_investigation_status)
			else props.addSnack('Something wrong, investigation not opened')
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [investigationProps.sprout_id])

	const openTestModal = (title1, content1) => {
		setTitle(title1)
		setContent(content1)
		setOpen(true)
	}

	const closeTestModal = () => setOpen(false)

	const setChip = status => {
		switch (status) {
			case 'reject':
				return <Chip label={status} className={classes.red} icon={<Error />} />
			case 'accept':
				return <Chip label={status} className={classes.green} icon={<Check />} />
			default:
				return <Chip label={status} className={classes.common} icon={<Block />} />
		}
	}

	const setResultEquifaxData = (argument, index) => {
		const values = argument.split('|')
		return (
			<>
				<div className={classes.number}>{index + 1}.</div>
				<div className={classes.chipWrapper}>{setChip(values[0])}</div>
				<div>
					<div className={classes.message}>{values[1]}</div>
					<div className={classes.comment}>{values[2]}</div>
				</div>
			</>
		)
	}

	if (investigation === null) return <Progress />

	if (loading) return <Progress />

	return (
		<Paper className={classes.root}>
			<div className={classes.headContainer}>
				<Typography gutterBottom variant="h6" component="h3" style={{ marginBottom: 0 }}>
					Investigation
				</Typography>
				<Badge color="primary" showZero badgeContent={investigationProps.notification}>
					<Button variant="outlined" color="primary" onClick={() => setEmailOpened(true)}>
						Send notification
					</Button>
				</Badge>
			</div>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">archived</TableCell>
						<TableCell align="left">id</TableCell>
						<TableCell align="left">status</TableCell>
						<TableCell align="left">submitted_documents</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">
							<Checkbox
								checked={investigation.archived}
								classes={{
									root: classes.checkbox,
									checked: classes.checked
								}}
							/>
						</TableCell>
						<TableCell align="left">{investigation.id}</TableCell>
						<TableCell align="left">{investigation.status}</TableCell>
						<TableCell align="left">
							{investigation.submitted_documents.length
								? investigation.submitted_documents.map(document => `${document.name}, `)
								: 'null'}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Cip Categories
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">category_state</TableCell>
						<TableCell align="left">name</TableCell>
						<TableCell align="left">requested_documents</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{investigation.cip_categories.map((category, index) => (
						<TableRow key={index}>
							<TableCell align="left">{category.category_state}</TableCell>
							<TableCell align="left">{category.name}</TableCell>
							<TableCell align="left">
								{category.requested_documents.length
									? category.requested_documents.map(item => `${item.description}, `)
									: 'null'}
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				History
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">archived</TableCell>
						<TableCell align="left">comment</TableCell>
						<TableCell align="left">state_change</TableCell>
						<TableCell align="left">timestamp</TableCell>
						<TableCell align="left">user</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{investigation.history.map((item, index) => (
						<TableRow key={index}>
							<TableCell align="left">
								<Checkbox
									checked={item.archived}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</TableCell>
							<TableCell align="left">{item.comment ? item.comment : 'null'}</TableCell>
							<TableCell align="left">{item.state_change}</TableCell>
							<TableCell align="left">{getDMYTFromUtc(item.timestamp)}</TableCell>
							<TableCell align="left">{item.user}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Request
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">account</TableCell>
						<TableCell align="left">branch</TableCell>
						<TableCell align="left">correspondent_code</TableCell>
						<TableCell align="left">citizenship_country</TableCell>
						<TableCell align="left">date_of_birth</TableCell>
						<TableCell align="left">phone_number</TableCell>
						<TableCell align="left">social_security_number</TableCell>
						<TableCell align="left">include_identity_verification</TableCell>
						<TableCell align="left">source</TableCell>
						<TableCell align="left">source_id</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">{investigation.request.account}</TableCell>
						<TableCell align="left">{investigation.request.branch}</TableCell>
						<TableCell align="left">{investigation.request.correspondent_code}</TableCell>
						<TableCell align="left">{investigation.request.identity.citizenship_country}</TableCell>
						<TableCell align="left">{investigation.request.identity.date_of_birth}</TableCell>
						<TableCell align="left" style={{ whiteSpace: 'nowrap' }}>
							{investigation.request.identity.phone_number}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.social_security_number}
						</TableCell>
						<TableCell align="left">
							<Checkbox
								checked={investigation.request.include_identity_verification}
								classes={{
									root: classes.checkbox,
									checked: classes.checked
								}}
							/>
						</TableCell>
						<TableCell align="left">{investigation.request.source}</TableCell>
						<TableCell align="left">{investigation.request.source_id}</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Name
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">additional_names</TableCell>
						<TableCell align="left">family_name</TableCell>
						<TableCell align="left">given_name</TableCell>
						<TableCell align="left">prefix</TableCell>
						<TableCell align="left">suffix</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">
							{investigation.request.identity.name.additional_names.length
								? investigation.request.identity.name.additional_names.toString()
								: 'null'}
						</TableCell>
						<TableCell align="left">{investigation.request.identity.name.family_name}</TableCell>
						<TableCell align="left">{investigation.request.identity.name.given_name}</TableCell>
						<TableCell align="left">
							{investigation.request.identity.name.prefix
								? investigation.request.identity.name.prefix
								: 'null'}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.name.suffix
								? investigation.request.identity.name.suffix
								: 'null'}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Home address
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">home_address_city</TableCell>
						<TableCell align="left">home_address_country</TableCell>
						<TableCell align="left">home_address_postal_code</TableCell>
						<TableCell align="left">home_address_state</TableCell>
						<TableCell align="left">street_address_0</TableCell>
						<TableCell align="left">street_address_1</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">{investigation.request.identity.home_address.city}</TableCell>
						<TableCell align="left">
							{investigation.request.identity.home_address.country}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.home_address.postal_code}
						</TableCell>
						<TableCell align="left">{investigation.request.identity.home_address.state}</TableCell>
						<TableCell align="left">
							{investigation.request.identity.home_address.street_address[0]}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.home_address.street_address[1]
								? investigation.request.identity.home_address.street_address[1]
								: 'null'}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Mailing address
			</Typography>
			<Divider />
			<Table className={classes.table}>
				<TableHead>
					<TableRow>
						<TableCell align="left">mailing_address_city</TableCell>
						<TableCell align="left">mailing_address_country</TableCell>
						<TableCell align="left">mailing_address_postal_code</TableCell>
						<TableCell align="left">mailing_address_state</TableCell>
						<TableCell align="left">mailing_address_street_address_0</TableCell>
						<TableCell align="left">mailing_address_street_address_1</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					<TableRow>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.city}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.country}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.postal_code}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.state}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.street_address[0]}
						</TableCell>
						<TableCell align="left">
							{investigation.request.identity.mailing_address.street_address[1]
								? investigation.request.identity.mailing_address.street_address[1]
								: 'null'}
						</TableCell>
					</TableRow>
				</TableBody>
			</Table>

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 40 }}>
				Equifax
			</Typography>
			{investigation.result.equifax_result &&
				investigation.result.equifax_result.map((value, index) => (
					<div key={index} className={classes.equifaxItem}>
						{setResultEquifaxData(value, index)}
					</div>
				))}

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 10 }}>
				Dow Jones: &nbsp;
				<Button
					variant="outlined"
					color="primary"
					size="small"
					className={classes.btn}
					onClick={() => openTestModal('Dow Jones: ', investigation.result.dow_jones_result)}
				>
					Show More
				</Button>
			</Typography>
			<Divider className={classes.divider} />

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 10 }}>
				Notes (Dow jones): &nbsp;
				<Button
					variant="outlined"
					color="primary"
					size="small"
					className={classes.btn}
					onClick={() => openTestModal('Notes (Dow jones): ', investigation.result.dow_jones_notes)}
				>
					Show More
				</Button>
			</Typography>
			<Divider className={classes.divider} />

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 10 }}>
				Sources(Dow jones): &nbsp;
				<Button
					variant="outlined"
					color="primary"
					size="small"
					className={classes.btn}
					onClick={() =>
						openTestModal('Sources(Dow jones): ', investigation.result.dow_jones_sources)
					}
				>
					Show More
				</Button>
			</Typography>
			<Divider className={classes.divider} />

			<Typography gutterBottom variant="h6" component="h3" style={{ marginTop: 10 }}>
				DNDB:
			</Typography>
			<Table>
				<TableBody>
					{investigation.result.dndb_result &&
						investigation.result.dndb_result.map((value, index) => (
							<TableRow key={index}>
								<TableCell>{`${parseInt(index + 1)} ${value}`}</TableCell>
							</TableRow>
						))}
				</TableBody>
			</Table>

			{emailOpened && (
				<SendEmailModal2
					closeEmail={setEmailOpened}
					user_id={investigationProps.user_id}
					sprout_id={investigationProps.sprout_id}
					user_email={investigationProps.user_email}
					notification={investigationProps.notification}
					launched_from={investigationProps.fromChild ? 'child' : null}
					recipient={investigationProps.fromChild ? 'child' : null}
					closeModal={closeModal}
				/>
			)}

			<Dialog open={open} onClose={closeTestModal}>
				<DialogTitle>{title}</DialogTitle>
				<DialogContent>
					<Table>
						<TableBody>
							{content && (
								<TableRow key={1}>
									<TableCell>Data not found...</TableCell>
								</TableRow>
							)}

							{content &&
								content.map((value, index) => (
									<TableRow key={index}>
										<TableCell>{value}</TableCell>
									</TableRow>
								))}
						</TableBody>
					</Table>
				</DialogContent>
				<DialogActions>
					<Button onClick={closeTestModal} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	)
}

const Styled = withStyles(styles)(ViewAccountModal)

export default connect(
	null,
	dispatch => ({
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(Styled)
