import React, { useState, useEffect } from 'react'
import { withStyles } from '@material-ui/core/styles'
import MUIDataTable from 'mui-datatables'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import getChunk from '../utils/GetChunk'
import { GET_ALE_EVENTS } from '../root/Graphql'
import { /*getDMYTFromUtc,*/ getDMYTSFromUtc } from '../utils/DateHelper'
import { changeColumnOptions, getItem } from '../utils/TableOptionsHelper'
import Progress from '../components/Progress'
import { addSnack } from '../modules/Snack/Snack.state'

const styles = {
	table: {
		'& td, & th': {
			padding: 8,
			fontSize: 15
		}
	},
	root: {
		padding: '24px 40px'
	}
}

const ChildEvents = props => {
	const { addSnack, classes, userId, accountId } = props
	const [events, setEvents] = useState([])
	const [loading, setLoading] = useState(false)
	const data = []

	useEffect(() => {
		setLoading(true)
		const variables = {
			user_id: userId,
			account_id: accountId,
			type: '' //'sentinel-ach-transfer-status'
		}

		getChunk(GET_ALE_EVENTS, variables).then(data => {
			setLoading(false)
			if (data && data.fetch_ale_events && data.fetch_ale_events.length)
				setEvents(data.fetch_ale_events)
			else addSnack('GraphQL bad response fetch_ale_events')
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	const jsonPrint = event => {
		return Object.keys(JSON.parse(event)).map((key, index) => {
			return (
				<div key={index}>
					<span>{key} : </span>
					<span>{JSON.parse(event)[key]}</span>
					<br />
				</div>
			)
		})
	}

	events.map(event => {
		const item = [
			getDMYTSFromUtc(event.raw_event.date_time) || 'null',
			event.event || 'null',
			jsonPrint(event.raw_event.payload),
			jsonPrint(event.transformed_event)
		]
		return data.push(item)
	})

	data.sort((x, y) => {
		if (x[0] < y[0]) return -1
		if (x[0] > y[0]) return 1
		return 0
	})

	const tableName = 'childEvents'
	const options = {
		filterType: 'checkbox',
		selectableRows: 'none',
		onColumnViewChange: changedColumn => {
			changeColumnOptions(tableName, changedColumn)
		}
	}

	const columns = [
		{
			name: 'date',
			label: 'Date',
			options: { filter: false, sort: true, display: getItem(tableName, 'date') }
		},
		{
			name: 'event',
			label: 'Event',
			options: { filter: true, sort: false, display: getItem(tableName, 'event') }
		},
		{
			name: 'raw_event',
			label: 'Raw Event',
			options: { filter: false, sort: false, display: getItem(tableName, 'raw_event') }
		},
		{
			name: 'transformed_event',
			label: 'Transformed Event',
			options: { filter: false, sort: false, display: getItem(tableName, 'transformed_event') }
		}
	]

	if (events === []) return <Progress />
	if (loading) return <Progress />
	return (
		<div className={classes.root}>
			<MUIDataTable
				title={'ALE Events'}
				data={data}
				columns={columns}
				options={options}
				className={classes.table}
			/>
		</div>
	)
}

const Styled = withStyles(styles)(ChildEvents)

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(Styled)
