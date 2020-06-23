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
	Typography,
	/*Paper,*/
	Divider,
	IconButton
} from '@material-ui/core'
import Email from '@material-ui/icons/Email'
import { Checkbox, Button } from '@material-ui/core'
import { SendTaxDocuments } from '../components/Modals'
//import { SEND_SQS_MESSAGE } from '../root/Mutations'
import _ from 'lodash'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import CopyIcon from '@material-ui/icons/FilterNone'

const useStyles = makeStyles({
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0 0 0',
		marginTop: '10px'
	},
	btn: {
		margin: 8
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
	{ id: 'chkbx', label: '' },
	{ id: 'date', label: 'date' },
	{ id: 'statement_type', label: 'statement_type' },
	{ id: 'url', label: 'url' }
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
	const [orderBy, setOrderBy] = React.useState('date')
	const [page, setPage] = React.useState(0)
	const [rowsPerPage, setRowsPerPage] = React.useState(5)
	const [rowArray, setRowArray] = React.useState([])
	const [emailMoadalOpen, setEmailMoadalOpen] = React.useState(false)
	const [popupMsg, setPopupMsg] = React.useState('')
	const [newEmail, setNewEmail] = React.useState('')
	const { taxDocuments, email, userName, addSuccess /*,parentId*/ } = props
	const classes = useStyles()

	const handleRequestSort = (event, property) => {
		const isDesc = orderBy === property && order === 'desc'
		setOrder(isDesc ? 'asc' : 'desc')
		setOrderBy(property)
	}
	const handleCheckBoxClick = e => {
		if (e.target.checked) {
			setRowArray(rowArray.concat(JSON.parse(e.target.value)))
		} else {
			const array = [...rowArray] // make a separate copy of the array
			const newVal = JSON.parse(e.target.value)
			const index = array.findIndex(x => _.isEqual(x, newVal))
			if (index !== -1) {
				array.splice(index, 1)
				setRowArray(array)
			}
		}
	}

	const openEmailModal = () => {
		const msg = `Send ${userName} the below documents on email`
		setNewEmail(email)
		setPopupMsg(msg)
		setEmailMoadalOpen(true)
	}
	const closeEmailModal = () => {
		setEmailMoadalOpen(false)
	}
	const sendMailtoUser = () => {
		props.addSuccess(newEmail)
		setEmailMoadalOpen(false)
		/*Uncomment when your API is ready and modify variable par require
			
			const variables = {
				user_id: parentId,
				queue_name:'email_Q',
				payload: JSON.stringify({
					template: payload.template,
					user_id: parentId,
					
				})
			}
			mutation(SEND_SQS_MESSAGE, variables).then(data => {
				if (data && data.send_sqs_message && data.send_sqs_message.message)
					props.addSuccess(data.send_sqs_message.message)
			})

		*/
	}
	const handleChangeEmail = e => {
		setNewEmail(e.target.value)
	}
	const modalProps = {
		closeEmailModal,
		sendMailtoUser,
		popupMsg,
		rowArray,
		newEmail,
		emailMoadalOpen,
		handleChangeEmail
	}
	const handleChangePage = (event, newPage) => setPage(newPage)

	const handleChangeRowsPerPage = event => setRowsPerPage(+event.target.value)

	const emptyRows = rowsPerPage - Math.min(rowsPerPage, taxDocuments.length - page * rowsPerPage)

	return (
		<div className={classes.root}>
			<div>
				<Typography gutterBottom variant="h5" component="h2">
					Tax Documents
				</Typography>
				{rowArray.length > 0 ? (
					<Button
						variant="outlined"
						style={{ float: 'right', marginTop: '-36px' }}
						onClick={() => openEmailModal()}
						color="primary"
					>
						<Email />
					</Button>
				) : null}
			</div>

			<Divider className={classes.divider} />

			<Table>
				<EnhancedTableHead
					order={order}
					orderBy={orderBy}
					onRequestSort={handleRequestSort}
					rowCount={taxDocuments.length}
				/>
				<TableBody>
					{stableSort(taxDocuments, getSorting(order, orderBy))
						.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
						.map((row, index) => (
							<TableRow hover role="checkbox" tabIndex={-1} key={index}>
								<TableCell>
									<Checkbox
										color="primary"
										onClick={handleCheckBoxClick}
										value={JSON.stringify(row)}
									/>
								</TableCell>
								<TableCell component="th" scope="row" padding="none">
									{row.date}
								</TableCell>
								<TableCell align="right">{row.statement_type}</TableCell>
								<TableCell style={{ wordBreak: 'break-all' }} align="right">
									<a href={row.url} style={{ textDecoration: 'none', color: '#000000de' }}>
										<Button className={classes.btn} variant="outlined" color="primary" size="small">
											Download Statement
										</Button>
									</a>
									<CopyToClipboard text={row.url} onCopy={() => addSuccess('Copied!')}>
										<IconButton size="small">
											<CopyIcon />
										</IconButton>
									</CopyToClipboard>
								</TableCell>
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
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={taxDocuments.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onChangePage={handleChangePage}
				onChangeRowsPerPage={handleChangeRowsPerPage}
			/>
			<SendTaxDocuments {...modalProps} />
		</div>
	)
}

export default EnhancedTable
