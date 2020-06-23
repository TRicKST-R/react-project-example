import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Typography,
	Divider,
	Paper
} from '@material-ui/core/'

import { getDMYTFromUtc } from '../../utils/DateHelper'
import { formatCurrency } from '../../utils/CurrencyHelper'

const styles = {
	divider: {
		margin: '24px 0 0 0'
	},
	tableRow: {
		'& > th': {
			whiteSpace: 'nowrap',
			padding: 0,
			fontSize: 11
		},
		'& > td': {
			padding: 4,
			fontSize: 11
		}
	},
	root: {
		width: '100%',
		overflowX: 'auto'
	}
}

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
	{ id: 'transaction_amount', label: 'amount' },
	{ id: 'transaction_goal_id', label: 'goal_id' },
	{ id: 'transaction_instruction_reference', label: 'reference' },
	{ id: 'transaction_reference_id', label: 'reference_id' },
	{ id: 'transaction_sprout_id', label: 'sprout_id' },
	{ id: 'transaction_goal_name', label: 'goal_name' },
	{ id: 'transaction_sprout_name', label: 'name' },
	{ id: 'transaction_time', label: 'transaction_time' },
	{ id: 'transaction_stocks', label: 'stocks' },
	{ id: 'transaction_type', label: 'type' },
	{ id: 'transaction_status', label: 'transaction_status' },
	{ id: 'transaction_sub_type', label: 'sub_type' },
	{ id: 'transaction_comments', label: 'comments' },
	{ id: 'transaction_external_reference_id', label: 'external_reference_id' }
]

const EnhancedTableHead = props => {
	const { order, orderBy, onRequestSort } = props
	const createSortHandler = property => event => onRequestSort(event, property)

	return (
		<TableHead>
			<TableRow>
				{headRows.map((row, index) => (
					<TableCell
						style={{ padding: 4, whiteSpace: 'nowrap' }}
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
	const [orderBy, setOrderBy] = React.useState('transaction_amount')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const { classes, transactions } = props

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}

	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, transactions.length - page * rowsPerPage)

	return (
		<>
			<Typography gutterBottom variant="h5" component="h2">
				Transactions
			</Typography>
			<Divider className={classes.divider} />

			<Paper className={classes.root}>
				<Table>
					<EnhancedTableHead
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
						rowCount={transactions.length}
					/>
					<TableBody>
						{stableSort(transactions, getSorting(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => (
								<TableRow
									hover
									role="checkbox"
									tabIndex={-1}
									key={index}
									className={classes.tableRow}
								>
									<TableCell component="th" scope="row">
										{formatCurrency(row.transaction_amount)}
									</TableCell>
									<TableCell align="right">{row.transaction_goal_id}</TableCell>
									<TableCell align="right">{row.transaction_instruction_reference}</TableCell>
									<TableCell align="right">{row.transaction_reference_id}</TableCell>
									<TableCell align="right">{row.transaction_sprout_id}</TableCell>
									<TableCell align="right">{row.transaction_goal_name}</TableCell>
									<TableCell align="right">{`${row.transaction_sprout_first_name} ${row.transaction_sprout_last_name}`}</TableCell>
									<TableCell align="right">{getDMYTFromUtc(row.transaction_time)}</TableCell>
									<TableCell align="right">
										{row.transaction_stocks &&
											row.transaction_stocks.map((stock, index) => (
												<div key={index}>{`Equity: ${stock.equity} Units: ${stock.units}`}</div>
											))}
									</TableCell>
									<TableCell align="right">{row.transaction_type}</TableCell>
									<TableCell align="right">{row.transaction_status}</TableCell>
									<TableCell align="right">{row.transaction_sub_type}</TableCell>
									<TableCell align="right">{row.transaction_comments}</TableCell>
									<TableCell align="right">{row.transaction_external_reference_id}</TableCell>
								</TableRow>
							))}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 * emptyRows }}>
								<TableCell colSpan={11} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Paper>

			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={transactions.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</>
	)
}

export default withStyles(styles)(EnhancedTable)
