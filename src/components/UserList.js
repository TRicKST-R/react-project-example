import React from 'react'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import { withStyles } from '@material-ui/core/styles'
import Checkbox from '@material-ui/core/Checkbox'
import green from '@material-ui/core/colors/green'
import { getDMYFromUtc } from '../utils/DateHelper'

const styles = theme => ({
	userList: {
		minWidth: 700,
		overflowX: 'auto'
	},
	root: {
		color: green[600],
		'&$checked': {
			color: green[500]
		}
	},
	checked: {},
	head: {
		whiteSpace: 'nowrap'
	},
	row: {
		cursor: 'pointer',
		'& td': {
			padding: '0 40px 0 16px'
		}
	},
	tableHead: {
		borderBottom: `2px solid ${theme.palette.primary.main}`
	},
	table: {
		minWidth: 1000
	}
})

const UserList = props => {
	const { classes, users, closeDialog = null } = props
	const sortedUsers = users.sort((a, b) => new Date(b.create_date) - new Date(a.create_date))

	return (
		<Paper className={classes.userList} elevation={10}>
			<Table className={classes.table}>
				<TableHead className={classes.tableHead}>
					<TableRow>
						<TableCell>user_name</TableCell>
						<TableCell align="right">email</TableCell>
						<TableCell align="right">enabled</TableCell>
						<TableCell align="right">status</TableCell>
						<TableCell className={classes.head} align="right">
							last_modified_date
						</TableCell>
						<TableCell className={classes.head} align="right">
							create_date
						</TableCell>
					</TableRow>
				</TableHead>
				<TableBody>
					{sortedUsers.map((user, index) => (
						<TableRow
							key={index}
							onClick={() => {
								props.push(`/user/${user.user_name},${user.user_id}`)
								if (closeDialog) closeDialog(false)
							}}
							className={classes.row}
						>
							<TableCell component="th" scope="row">
								{user.user_name}
							</TableCell>
							<TableCell align="right">{user.email}</TableCell>
							<TableCell align="right">
								<Checkbox
									checked={user.enabled === 'true' ? true : false}
									classes={{
										root: classes.root,
										checked: classes.checked
									}}
								/>
							</TableCell>
							<TableCell align="right">{user.status}</TableCell>
							<TableCell align="right">{getDMYFromUtc(user.last_modified_date)}</TableCell>
							<TableCell align="right">{getDMYFromUtc(user.create_date)}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</Paper>
	)
}

export default withStyles(styles)(UserList)
