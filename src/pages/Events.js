import React, { useState } from 'react'
import {
	Paper,
	InputBase,
	Divider,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import IconButton from '@material-ui/core/IconButton'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { GET_EVENTS } from '../root/Graphql'
import { getDMYTFromUtc } from '../utils/DateHelper'
import getChunk from '../utils/GetChunk'
import { addSnack } from '../modules/Snack/Snack.state'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	search: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 500,
		margin: '0 auto 40px auto'
	},
	input: {
		marginLeft: 8,
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	paper: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4
	}
})

const Events = props => {
	const [input, setInput] = useState('')
	const [events, setEvents] = useState(null)
	const classes = useStyles()

	const search = () => {
		if (input === '') return props.addSnack('value is required')
		const variables = {
			object_id: input,
			sequence_number: input
		}

		getChunk(GET_EVENTS, variables).then(data => {
			if (data.search_event) setEvents(data.search_event.event)
			else props.addSnack('Nothing found')
		})
	}

	return (
		<div className={classes.root}>
			<Paper className={classes.search} elevation={5}>
				<InputBase
					className={classes.input}
					placeholder="object_id / sequence number"
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyPress={e => {
						if (e.key === 'Enter') search()
					}}
				/>
				<IconButton className={classes.iconButton} aria-label="Search" onClick={() => setInput('')}>
					<CloseIcon />
				</IconButton>
				<Divider className={classes.divider} />
				<IconButton className={classes.iconButton} aria-label="Search" onClick={search}>
					<SearchIcon />
				</IconButton>
			</Paper>

			{events && events.length !== 0 && (
				<Paper className={classes.paper} elevation={10}>
					<p className="customTitle">Events</p>
					<Divider className="divider" />
					<Table className={classes.table}>
						<TableHead className={classes.tableHead}>
							<TableRow>
								<TableCell>account_id</TableCell>
								<TableCell align="right">timestamp</TableCell>
								<TableCell align="right">type</TableCell>
								<TableCell align="right">status</TableCell>
								<TableCell align="right">object_id</TableCell>
								<TableCell align="right">application_id</TableCell>
								<TableCell align="right">seq</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{events.map((event, index) => {
								return (
									<TableRow key={index} className={classes.row}>
										<TableCell className="field">{event.account_id}</TableCell>
										<TableCell className="field" align="right">
											{getDMYTFromUtc(event.timestamp)}
										</TableCell>
										<TableCell className="field" align="right">
											{event.type}
										</TableCell>
										<TableCell className="field" align="right">
											{event.status}
										</TableCell>
										<TableCell className="field" align="right">
											{event.object_id}
										</TableCell>
										<TableCell className="field" align="right">
											{event.application_id}
										</TableCell>
										<TableCell className="field" align="right">
											{event.seq}
										</TableCell>
									</TableRow>
								)
							})}
						</TableBody>
					</Table>
				</Paper>
			)}
		</div>
	)
}

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(Events)
