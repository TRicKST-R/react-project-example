import React, { useState } from 'react'
import { makeStyles } from '@material-ui/styles'
import {
	Typography,
	Checkbox,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Divider
} from '@material-ui/core'
import green from '@material-ui/core/colors/green'

import PaginationTable from './Table'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import AccountApplicants from '../../ChildTabs/Account/AccountApplicants'
import { Tabs, Tab } from '@material-ui/core/'
const useStyles = makeStyles({
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0 24px 0'
	},
	p: {
		height: '24px',
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		'& > span': {
			fontWeight: 600,
			marginRight: 4
		}
	},
	infoBlock: {
		maxWidth: 280,
		margin: '0 40px',
		width: '100%',
		'& > p': {
			display: 'flex',
			justifyContent: 'space-between'
		}
	},
	checkbox: {
		color: green[600],
		'&$checked': {
			color: green[500]
		},
		padding: 0
	},
	checked: {},
	details: {
		display: 'block',
		overflowX: 'auto'
	},
	heading: {
		fontSize: 16
	},
	container: {
		display: 'flex',
		justifyContent: 'center'
	},
	containerNew: {
		display: 'flex',
		justifyContent: 'space-between',
		marginBottom: 10,
		whiteSpace: 'nowrap'
	},
	containerList: {
		padding: '0 40px'
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	detail: {
		display: 'block'
	},
	tablist: {
		backgroundColor: '#f3f3f3',
		marginBottom: 24
	},
	info: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	}
})

const Accounts = ({ account }) => {
	const classes = useStyles()
	const [dataDisplay, setDataToDisplay] = useState(account[0])
	const [currentChildIndex, setCurrentChildIndex] = useState(0)
	const dataToDisplay = value => {
		setCurrentChildIndex(value)
		setDataToDisplay(account[value])
	}
	return (
		<>
			<Tabs
				value={currentChildIndex}
				onChange={(event, value) => dataToDisplay(value)}
				indicatorColor="primary"
				textColor="primary"
				className={classes.tablist}
			>
				{account &&
					account.map((account, index) => <Tab label={`Account ${index + 1}`} key={index} />)}
			</Tabs>
			<div className={classes.containerList}>
				{dataDisplay && dataDisplay.admin && (
					<div className={classes.info}>
						<div style={{ flexBasis: 440 }}>
							<span className="customTitle">Account Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>account_id:</span>
								{dataDisplay.admin.account_id}
							</Typography>
							<Typography className="p">
								<span>account_status:</span>
								{dataDisplay.account_status}
							</Typography>
							<Typography className="p" style={{ marginBottom: 16 }}>
								<span>bd_account_request_time:</span>
								{getDMYTFromUtc(dataDisplay.admin.bd_account_request_time)}
							</Typography>
							<span className="customTitle">Event Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>bd_latest_event_time:</span>
								{getDMYTFromUtc(dataDisplay.admin.bd_latest_event_time)}
							</Typography>
							<Typography className="p">
								<span>eventTime:</span>
								{getDMYTFromUtc(dataDisplay.admin.eventTime)}
							</Typography>
							<Typography className="p" style={{ marginBottom: 16 }}>
								<span>event_Type:</span>
								{dataDisplay.admin.event_Type}
							</Typography>
							<span className="customTitle">Can Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>can_fund:</span>
								<Checkbox
									checked={dataDisplay.can_fund}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography className="p">
								<span>can_trade:</span>
								<Checkbox
									checked={dataDisplay.can_trade}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography className="p">
								<span>can_trade_options:</span>
								<Checkbox
									checked={dataDisplay.can_trade_options}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
							<Typography className="p">
								<span>options:</span>
								<Checkbox
									checked={dataDisplay.options}
									classes={{
										root: classes.checkbox,
										checked: classes.checked
									}}
								/>
							</Typography>
						</div>
						<div style={{ flexBasis: 500 }}>
							<span className="customTitle">User Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>user_id:</span>
								{dataDisplay.admin.user_id}
							</Typography>
							<Typography className="p">
								<span>email:</span>
								{dataDisplay.email}
							</Typography>
							<Typography className="p" style={{ marginBottom: 16 }}>
								<span>customer_type:</span>
								{dataDisplay.customer_type}
							</Typography>
							<span className="customTitle">Financial Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>income_range:</span>
								{dataDisplay.income_range}
							</Typography>
							<Typography className="p">
								<span>assets_worth:</span>
								{dataDisplay.assets_worth}
							</Typography>
							<Typography className="p" style={{ marginBottom: 16 }}>
								<span>investor_type:</span>
								{dataDisplay.investor_type}
							</Typography>
							<span className="customTitle">Other Information</span>
							<Divider className="divider" />
							<Typography className="p">
								<span>request:</span>
								{dataDisplay.request}
							</Typography>
							<Typography className="p">
								<span>request_time:</span>
								{getDMYTFromUtc(dataDisplay.request_time)}
							</Typography>
							<Typography className="p">
								<span>sprout_id:</span>
								{dataDisplay.admin.sprout_id}
							</Typography>
							<Typography className="p">
								<span>status:</span>
								{dataDisplay.admin.status}
							</Typography>
							<Typography className="p">
								<span>trade_authorization:</span>
								{dataDisplay.admin.trade_authorization}
							</Typography>
						</div>
					</div>
				)}
				<div style={{ width: 600, margin: '16px auto 0 auto' }}>
					{dataDisplay && dataDisplay.admin && dataDisplay.admin.applicants && (
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>applicant_id</TableCell>
									<TableCell align="right">applicant_type</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{dataDisplay.admin.applicants.map((data, index) => (
									<TableRow key={index}>
										<TableCell>{data.applicant_id}</TableCell>
										<TableCell align="right">{data.applicant_type}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					)}
				</div>
				{dataDisplay && dataDisplay.applicants && (
					<AccountApplicants data={dataDisplay.applicants} />
				)}
				{dataDisplay && dataDisplay.admin && dataDisplay.admin.bd_account_transactions && (
					<div style={{ marginTop: 32 }}>
						<span className="customTitle">BD transactions</span>
						<PaginationTable accounts={dataDisplay.admin.bd_account_transactions} />
					</div>
				)}
				{dataDisplay &&
					dataDisplay.admin &&
					dataDisplay.admin.bd_account_link &&
					dataDisplay.admin.bd_account_link.account_status && (
						<div style={{ marginTop: 32 }}>
							<span className="customTitle">BD account link</span>
							<Table style={{ marginTop: 8, border: '1px solid #ececec' }}>
								<TableHead>
									<TableRow>
										<TableCell>account_id</TableCell>
										<TableCell align="right">account_status</TableCell>
										<TableCell align="right">request_time</TableCell>
										<TableCell align="right">user_id</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									<TableRow>
										<TableCell align="left" className={classes.row}>
											{dataDisplay.admin.bd_account_link.account_id}
										</TableCell>
										<TableCell align="right" className={classes.row}>
											{dataDisplay.admin.bd_account_link.account_status}
										</TableCell>
										<TableCell align="right" className={classes.row}>
											{getDMYTFromUtc(dataDisplay.admin.bd_account_link.request_time)}
										</TableCell>
										<TableCell align="right" className={classes.row}>
											{dataDisplay.admin.bd_account_link.user_id}
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</div>
					)}
			</div>
		</>
	)
}

export default Accounts
