import React from 'react'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TableSortLabel from '@material-ui/core/TableSortLabel'
import { getDMYTFromUtc } from '../../utils/DateHelper'
import { formatCurrency } from '../../utils/CurrencyHelper'
import { useStyles } from '../../CustomHooks/styles'
import { Paper } from '@material-ui/core/'

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
			padding: 4,
			fontSize: 11
		}
	},
	head: {
		'& .MuiTableSortLabel-active': {
			fontWeight: 'bold'
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
	{ id: 'stock_available_units', label: 'available_units' },
	{ id: 'stock_current_value', label: 'current_value' },
	{ id: 'stock_fetch_time', label: 'fetch_time' },
	{ id: 'stock_growth_in_percentage', label: 'growth_in_percentage' },
	{ id: 'stock_growth_in_value', label: 'growth_in_value' },
	{ id: 'stock_invested_amount', label: 'invested_amount' },
	{ id: 'stock_name', label: 'name' },
	{ id: 'stock_ticker', label: 'ticker' },
	{ id: 'stock_unit_price', label: 'unit_price' },
	{ id: 'stock_units', label: 'units' }
]

const EnhancedTableHead = props => {
	const { order, orderBy, onRequestSort } = props
	const createSortHandler = property => event => onRequestSort(event, property)
	const classes = useStyles(styles)

	return (
		<TableHead className={classes.head}>
			<TableRow style={{ height: 40 }}>
				{headRows.map((row, index) => (
					<TableCell
						style={{ padding: 4, whiteSpace: 'nowrap' }}
						key={row.id}
						align={index === 0 ? 'left' : 'right'}
						sortDirection={orderBy === row.id ? order : false}
						className="fieldName"
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
	const [orderBy, setOrderBy] = React.useState('stock_available_units')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const { stocks } = props
	const classes = useStyles(styles)

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}

	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, stocks.length - page * rowsPerPage)

	return (
		<>
			<span className="customTitle">Stocks</span>
			<Paper className={classes.root}>
				<Table style={{ marginTop: 4, border: '1px solid rgb(236, 236, 236)' }}>
					<EnhancedTableHead
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
						rowCount={stocks.length}
					/>
					<TableBody>
						{stableSort(stocks, getSorting(order, orderBy))
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, index) => (
								<TableRow
									hover
									role="checkbox"
									tabIndex={-1}
									key={index}
									className={classes.tableRow}
								>
									<TableCell className="field">{row.stock_available_units}</TableCell>
									<TableCell className="field" align="right">
										{formatCurrency(row.stock_current_value)}
									</TableCell>
									<TableCell className="field" align="right">
										{getDMYTFromUtc(row.stock_fetch_time)}
									</TableCell>
									<TableCell className="field" align="right">
										{row.stock_growth_in_percentage}%
									</TableCell>
									<TableCell className="field" align="right">
										{formatCurrency(row.stock_growth_in_value)}
									</TableCell>
									<TableCell className="field" align="right">
										{formatCurrency(row.stock_invested_amount)}
									</TableCell>
									<TableCell className="field" align="right">
										{row.stock_name}
									</TableCell>
									<TableCell className="field" align="right">
										{row.stock_ticker}
									</TableCell>
									<TableCell className="field" align="right">
										{formatCurrency(row.stock_unit_price)}
									</TableCell>
									<TableCell className="field" align="right">
										{row.stock_units}
									</TableCell>
								</TableRow>
							))}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 * emptyRows }}>
								<TableCell colSpan={10} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Paper>
			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={stocks.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
		</>
	)
}

export default EnhancedTable
