import React, { useState } from 'react'
import { withStyles } from '@material-ui/core/styles'
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TablePagination,
	TableRow,
	TableSortLabel,
	Paper,
	Typography,
	Divider,
	Button
} from '@material-ui/core/'
import { mutation } from '../utils/GetChunk'
import { NewReferralModal } from '../components/Modals'
import { CREATE_REWARD } from '../root/Mutations'
import Progress from '../components/Progress'

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
			padding: 2,
			fontSize: 11
		}
	},
	root: {
		width: '100%',
		overflowX: 'auto'
	},
	headContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingBottom: 8
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
	{ id: 'user_id', label: 'user_id' },
	{ id: 'sprout_id', label: 'sprout_id' },
	{ id: 'goal_id', label: 'goal_id' },
	{ id: 'reward_id', label: 'reward_id' },
	{ id: 'goal_name', label: 'goal_name' },
	{ id: 'external_reference_id', label: 'external_reference_id' },
	{ id: 'status', label: 'status' },
	{ id: 'request_time', label: 'request_time' },
	{ id: 'instruction_id', label: 'instruction_id' }
]

const EnhancedTableHead = props => {
	const { order, orderBy, onRequestSort } = props
	const createSortHandler = property => event => onRequestSort(event, property)

	return (
		<TableHead>
			<TableRow>
				{headRows.map((row, index) => (
					<TableCell
						style={{ padding: 2, whiteSpace: 'nowrap' }}
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
	const [order, setOrder] = React.useState('desc')
	const [orderBy, setOrderBy] = React.useState('request_time')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(10)
	const [newReferralModal, setNewReferralModalStatus] = useState(false)
	const { classes, referrals, goals, loading } = props

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}

	const openNewReferralModal = () => setNewReferralModalStatus(true)

	const closeNewReferralModal = () => setNewReferralModalStatus(false)

	const sendNewReferral = (goalId, amount, comments, referenceId) => {
		const { sprout_id, userId, addSnack, recallGoalsApi, addSuccess } = props
		const variables = {
			user_id: userId,
			sprout_id: sprout_id,
			goal_id: goalId,
			amount: amount,
			comments: comments,
			external_reference_id: referenceId
		}

		mutation(CREATE_REWARD, variables).then(data => {
			if (data && data.create_reward && data.create_reward.status === 'submitted') {
				recallGoalsApi()
				addSuccess('Successfully created reward')
			} else {
				addSnack('GraphQL bad response while create reward')
			}
		})
	}

	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, referrals.length - page * rowsPerPage)

	if (loading) return <Progress />

	return (
		<div style={{ margin: '40px 50px auto 50px' }}>
			<div className={classes.headContainer}>
				<Typography gutterBottom variant="h5" component="h2">
					Referrals
				</Typography>
				<Button variant="outlined" color="primary" onClick={openNewReferralModal}>
					New Referral
				</Button>
			</div>

			<Divider className={classes.divider} />
			<Paper className={classes.root}>
				<Table>
					<EnhancedTableHead
						order={order}
						orderBy={orderBy}
						onRequestSort={handleRequestSort}
						rowCount={referrals.length}
					/>
					<TableBody>
						{stableSort(referrals, getSorting(order, orderBy))
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
										{row.user_id}
									</TableCell>
									<TableCell align="right">{row.sprout_id}</TableCell>
									<TableCell align="right">{row.goal_id}</TableCell>
									<TableCell align="right">{row.reward_id}</TableCell>
									<TableCell align="right">{row.goal_name}</TableCell>
									<TableCell align="right">{row.external_reference_id}</TableCell>
									<TableCell align="right">{row.status}</TableCell>
									<TableCell align="right">{row.request_time}</TableCell>
									<TableCell align="right">{row.instruction_id}</TableCell>
								</TableRow>
							))}
						{emptyRows > 0 && (
							<TableRow style={{ height: 49 * emptyRows }}>
								<TableCell colSpan={12} />
							</TableRow>
						)}
					</TableBody>
				</Table>
			</Paper>

			<TablePagination
				rowsPerPageOptions={[10, 20, 50]}
				component="div"
				count={referrals.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			{newReferralModal && (
				<NewReferralModal close={closeNewReferralModal} send={sendNewReferral} goals={goals} />
			)}
		</div>
	)
}

export default withStyles(styles)(EnhancedTable)
