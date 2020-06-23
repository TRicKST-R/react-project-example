import React from 'react'
import { withStyles } from '@material-ui/core/styles'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import Paper from '@material-ui/core/Paper'
import { formatCurrency } from '../utils/CurrencyHelper'

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
			whiteSpace: 'nowrap',
			padding: 4
		}
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
	{ id: 'asset_type', label: 'asset_type' },
	{ id: 'average_price', label: 'average_price' },
	{ id: 'symbol', label: 'symbol' },
	{ id: 'quantity_settled', label: 'quantity_settled' },
	{ id: 'quantity_pending', label: 'quantity_pending' },
	{ id: 'unit_price', label: 'unit_price' },
	{ id: 'last_price', label: 'last_price' },
	{ id: 'current_value', label: 'current_value' },
	{ id: 'fill_value_left', label: 'fill_value_left' },
	{ id: 'surplus_units', label: 'surplus_units' },
	{ id: 'surplus_amount', label: 'surplus_amount' }
]

const EnhancedTableHead = props => {
	const { order, orderBy, onRequestSort, classes } = props
	const createSortHandler = property => event => onRequestSort(event, property)

	return (
		<TableHead>
			<TableRow className={classes.tableRow}>
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
const EnhancedTableHeadStyles = withStyles(styles)(EnhancedTableHead)

const EnhancedTable = props => {
	const [order, setOrder] = React.useState('asc')
	const [orderBy, setOrderBy] = React.useState('asset_type')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(20)
	const { classes, equities } = props

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}

	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, equities.length - page * rowsPerPage)

	return (
		<Paper className="paper" elevation={5}>
			<Table>
				<EnhancedTableHeadStyles
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={equities.length}
				/>
				<TableBody>
					{stableSort(equities, getSorting(order, orderBy))
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
									{row.asset_type}
								</TableCell>
								<TableCell align="right">{formatCurrency(row.average_price)}</TableCell>
								<TableCell align="right">{row.symbol}</TableCell>
								<TableCell align="right">{row.quantity_settled}</TableCell>
								<TableCell align="right">{row.quantity_pending}</TableCell>
								<TableCell align="right">{formatCurrency(row.unit_price)}</TableCell>
								<TableCell align="right">{formatCurrency(row.last_price)}</TableCell>
								<TableCell align="right">{formatCurrency(row.current_value)}</TableCell>
								<TableCell align="right">{formatCurrency(row.fill_value_left)}</TableCell>
								<TableCell align="right">{row.surplus_units}</TableCell>
								<TableCell align="right">{row.surplus_amount}</TableCell>
							</TableRow>
						))}
					{emptyRows > 0 && (
						<TableRow style={{ height: 49 * emptyRows }}>
							<TableCell colSpan={6} />
						</TableRow>
					)}
				</TableBody>
			</Table>
			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={equities.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</Paper>
	)
}

export default withStyles(styles)(EnhancedTable)
