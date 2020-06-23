import React from 'react'
import MUIDataTable from 'mui-datatables'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	cell: {
		width: '14%',
		display: 'inline-block',
		textAlign: 'right',
		lineHeight: '48px'
	},
	row: {
		display: 'block',
		height: 48,
		borderBottom: '1px solid rgba(224, 224, 224, 1)'
	},
	rowHeader: {
		color: 'rgba(0, 0, 0, 0.54)',
		fontSize: '0.75rem',
		fontWeight: 500,
		backgroundColor: '#ededed'
	},
	table: {
		marginTop: 8,
		boxShadow: 'none',
		border: '1px solid #ececec',
		'& tbody tr:not(.MuiTableRow-hover) td': {
			padding: '0 !important'
		}
	}
}

const columns = [
	{ name: 'applicant_type', label: 'applicant_type' },
	{ name: 'assets_worth', label: 'assets_worth' },
	{ name: 'birth_country', label: 'birth_country' },
	{ name: 'birthday', label: 'birthday' },
	{ name: 'citizenship_country', label: 'citizenship_country' },
	{ name: 'city', label: 'city' },
	{ name: 'country', label: 'country', options: { display: false } },
	{ name: 'customer_type', label: 'customer_type', options: { display: false } },
	{ name: 'email', label: 'email', options: { display: false } },
	{ name: 'employment_status', label: 'employment_status', options: { display: false } },
	{ name: 'first', label: 'first', options: { display: false } },
	{ name: 'income_range', label: 'income_range', options: { display: false } },
	{ name: 'investor_type', label: 'investor_type', options: { display: false } },
	{ name: 'last', label: 'last', options: { display: false } },
	{ name: 'line_1', label: 'line_1', options: { display: false } },
	{ name: 'line_2', label: 'line_2', options: { display: false } },
	{ name: 'middle', label: 'middle', options: { display: false } },
	{ name: 'mobile', label: 'mobile', options: { display: false } },
	{ name: 'postal_code', label: 'postal_code', options: { display: false } },
	{ name: 'state', label: 'state', options: { display: false } },
	{ name: 'visa_expiration', label: 'visa_expiration', options: { display: false } },
	{ name: 'visa_type', label: 'visa_type', options: { display: false } },
	{ name: 'account_id', label: 'account_id', options: { display: false } },
	{ name: 'applicant_id', label: 'applicant_id', options: { display: false } },
	{ name: 'applicant_owner', label: 'applicant_owner', options: { display: false } },
	{
		name: 'bd_applicant_created_time',
		label: 'bd_applicant_created_time',
		options: { display: false }
	},
	{ name: 'sprout_id', label: 'sprout_id', options: { display: false } },
	{ name: 'ssn', label: 'ssn', options: { display: false } },
	{ name: 'status', label: 'status', options: { display: false } },
	{ name: 'user_id', label: 'user_id', options: { display: false } }
]

const AccountApplicants = props => {
	let data = JSON.parse(JSON.stringify(props.data))

	data.map(appl => {
		Object.keys(appl.admin).map(key => {
			return (appl[key] = JSON.parse(JSON.stringify(appl.admin[key])))
		})
		return delete appl.admin
	})

	const { classes } = props

	const options = {
		filterType: 'checkbox',
		selectableRows: 'none',
		expandableRows: true,
		search: false,
		sort: false,
		filter: false,
		download: false,
		print: false,
		viewColumns: false,
		pagination: false,
		renderExpandableRow: (rowData, rowMeta) => {
			return (
				<TableRow>
					<TableCell colSpan={7}>
						<span className={`${classes.row} ${classes.rowHeader}`}>
							<span className={classes.cell}>country</span>
							<span className={classes.cell}>customer_type</span>
							<span className={classes.cell}>email</span>
							<span className={classes.cell}>employment_status</span>
							<span className={classes.cell}>first</span>
							<span className={classes.cell}>income_range</span>
							<span className={classes.cell}>investor_type</span>
						</span>
						<span className={classes.row}>
							<span className={classes.cell}>{rowData[6]}</span>
							<span className={classes.cell}>{rowData[7]}</span>
							<span className={classes.cell}>{rowData[8]}</span>
							<span className={classes.cell}>{rowData[9]}</span>
							<span className={classes.cell}>{rowData[10]}</span>
							<span className={classes.cell}>{rowData[11]}</span>
							<span className={classes.cell}>{rowData[12]}</span>
						</span>
						<span className={`${classes.row} ${classes.rowHeader}`}>
							<span className={classes.cell}>last</span>
							<span className={classes.cell}>line_1</span>
							<span className={classes.cell}>line_2</span>
							<span className={classes.cell}>middle</span>
							<span className={classes.cell}>mobile</span>
							<span className={classes.cell}>postal_code</span>
							<span className={classes.cell}>state</span>
						</span>
						<span className={classes.row}>
							<span className={classes.cell}>{rowData[13]}</span>
							<span className={classes.cell}>{rowData[14]}</span>
							<span className={classes.cell}>{rowData[15]}</span>
							<span className={classes.cell}>{rowData[16]}</span>
							<span className={classes.cell}>{rowData[17]}</span>
							<span className={classes.cell}>{rowData[18]}</span>
							<span className={classes.cell}>{rowData[19]}</span>
						</span>
						<span className={`${classes.row} ${classes.rowHeader}`}>
							<span className={classes.cell}>visa_expiration</span>
							<span className={classes.cell}>visa_type</span>
							<span className={classes.cell}>account_id</span>
							<span className={classes.cell}>applicant_id</span>
							<span className={classes.cell}>applicant_owner</span>
							<span className={classes.cell}>bd_applicant_created_time</span>
							<span className={classes.cell}>sprout_id</span>
						</span>
						<span className={classes.row} style={{ height: 96 }}>
							<span className={classes.cell}>{rowData[20]}</span>
							<span className={classes.cell}>{rowData[21]}</span>
							<span className={classes.cell}>{rowData[22]}</span>
							<span className={classes.cell}>{rowData[23]}</span>
							<span className={classes.cell}>{rowData[24]}</span>
							<span className={classes.cell}>{rowData[25]}</span>
							<span className={classes.cell}>{rowData[26]}</span>
						</span>
						<span className={`${classes.row} ${classes.rowHeader}`}>
							<span className={classes.cell}>ssn</span>
							<span className={classes.cell}>status</span>
							<span className={classes.cell}>user_id</span>
						</span>
						<span className={classes.row} style={{ height: 96 }}>
							<span className={classes.cell}>{rowData[27]}</span>
							<span className={classes.cell}>{rowData[28]}</span>
							<span className={classes.cell}>{rowData[29]}</span>
						</span>
					</TableCell>
				</TableRow>
			)
		}
	}

	return (
		<div style={{ marginTop: 32 }}>
			<span className="customTitle">Applicants</span>
			<MUIDataTable
				title={''}
				data={data}
				columns={columns}
				options={options}
				className={classes.table}
			/>
		</div>
	)
}

export default withStyles(styles)(AccountApplicants)
