import React from 'react'
import { makeStyles } from '@material-ui/styles'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Checkbox
} from '@material-ui/core'

import green from '@material-ui/core/colors/green'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import { formatCurrency } from '../../utils/CurrencyHelper'

const useStyles = makeStyles({
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0 0 0'
	},
	checbox: {
		color: green[600],
		'&$checked': {
			color: green[500]
		},
		padding: 0
	},
	checked: {},
	row: {
		'& > td': {
			padding: 0
		}
	},
	table: {
		border: '1px solid #ececec',
		marginTop: 8,
		'& tr': {
			height: 48
		},
		'& th, & td': {
			paddingLeft: 8,
			paddingRight: 8
		}
	}
})

const desc = (a, b, orderBy) => {
	if (b[orderBy] < a[orderBy]) return -1
	if (b[orderBy] > a[orderBy]) return 1
	return 0
}

const stableSort = (array, cmp) => {
	const stabilizedThis = array.map((el, index) => [el, index])
	stabilizedThis.sort((a, b) => {
		const order = cmp(a[0], b[0])
		if (order !== 0) return order
		return a[1] - b[1]
	})
	return stabilizedThis.map(el => el[0])
}

const getSorting = (order, orderBy) =>
	order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy)

const headRows = [
	{ id: 'amount', label: 'amount' },
	{ id: 'description', label: 'description' },
	{ id: 'reconciled', label: 'reconciled' },
	{ id: 'reservation', label: 'reservation' },
	{ id: 'settlement_time', label: 'settlement_time' },
	{ id: 'transaction_id	', label: 'transaction_id	' },
	{ id: 'transaction_time', label: 'transaction_time' },
	{ id: 'transaction_type', label: 'transaction_type' }
]

const EnhancedTableHead = props => {
	const { order, orderBy, onRequestSort } = props
	const createSortHandler = property => event => onRequestSort(event, property)

	return (
		<TableHead>
			<TableRow>
				{headRows.map((row, index) => (
					<TableCell
						key={row.id}
						align={index === 0 ? 'left' : 'right'}
						sortDirection={orderBy === row.id ? order : false}
					>
						<TableSortLabel
							active={orderBy === row.id}
							direction={order}
							onClick={createSortHandler(row.id)}
						>
							{row.label}
						</TableSortLabel>
					</TableCell>
				))}
			</TableRow>
		</TableHead>
	)
}

const EnhancedTable = props => {
	const [order, setOrder] = React.useState('asc')
	const [orderBy, setOrderBy] = React.useState('amount')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const { accounts } = props
	const classes = useStyles()

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}

	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, accounts.length - page * rowsPerPage)

	return (
		<div className={classes.table}>
			<Table>
				<EnhancedTableHead
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={accounts.length}
				/>
				<TableBody>
					{stableSort(accounts, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row, index) => (
							<TableRow hover role="checkbox" tabIndex={-1} key={index} className={classes.row}>
								<TableCell>{formatCurrency(row.amount)}</TableCell>
								<TableCell align="right">{row.description}</TableCell>
								<TableCell align="right">
									<Checkbox
										checked={row.reconciled}
										classes={{
											root: classes.checbox,
											checked: classes.checked
										}}
									/>
								</TableCell>
								<TableCell align="right">
									<Checkbox
										checked={row.reservation}
										classes={{
											root: classes.checbox,
											checked: classes.checked
										}}
									/>
								</TableCell>
								<TableCell align="right">{getDMYTFromUtc(row.settlement_time)}</TableCell>
								<TableCell align="right">{row.transaction_id}</TableCell>
								<TableCell align="right">{getDMYTFromUtc(row.transaction_time)}</TableCell>
								<TableCell align="right">{row.transaction_type}</TableCell>
							</TableRow>
						))}
					{emptyRows > 0 && (
						<TableRow style={{ height: 49 * emptyRows }}>
							<TableCell colSpan={8} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={accounts.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</div>
	)
}

export default EnhancedTable
