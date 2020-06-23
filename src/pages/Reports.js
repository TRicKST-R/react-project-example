import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Highcharts from 'highcharts'
import { withHighcharts } from 'react-jsx-highcharts'
import DateFnsUtils from '@date-io/date-fns'
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { Grid, Button } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import { yyyyMMddFormat } from '../utils/DateHelper'
import getChunk from '../utils/GetChunk'
import { FETCH_SOD_STATISTICS } from '../root/Graphql'
import { addSuccess } from '../modules/Success/Success.state'
import { addSnack } from '../modules/Snack/Snack.state'
import DonutChart from '../components/charts/DonutChart'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: 32
	},
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	chart: {
		flexBasis: '100%'
	},
	divider: {
		margin: '24px 0'
	},
	button: {
		height: '35px',
		marginTop: '25px'
	}
})

const Charts = props => {
	const [prediction, setPrediction] = useState([])
	const [show, setShow] = useState(false)
	const [predictionAmountLine, setPredictionAmountLine] = useState([])
	const classes = useStyles()
	const startDate = new Date()
	const endDate = new Date()
	endDate.setDate(startDate.getDate() - 1)
	startDate.setDate(startDate.getDate() - 5)
	const [selectedStartDate, setSelectedStartDate] = useState(startDate)
	const [selectedEndDate, setSelectedEndDate] = useState(endDate)

	const handleStartDateChange = date => setSelectedStartDate(date)

	const handleEndDateChange = date => setSelectedEndDate(date)

	const dataReturn = data => {
		const tmpArray = []
		data.map(itemData => itemData.reports.map(dataItem => tmpArray.push(dataItem.report_number)))
		const arrTmp = []
		const keyArray = [...new Set(tmpArray)]
		keyArray.map(arrItem => {
			const t = []
			data.map(valueItm =>
				t.push(
					(valueItm.reports.find(tmp => tmp.report_number === arrItem) &&
						valueItm.reports.find(tmp => tmp.report_number === arrItem).extract_count) ||
						0
				)
			)
			arrTmp.push({ key: arrItem, data: t })
			return true
		})
		setPredictionAmountLine(arrTmp)
	}

	const fetchData = date => {
		const variable = {
			from: yyyyMMddFormat(selectedStartDate),
			to: yyyyMMddFormat(selectedEndDate)
		}

		getChunk(FETCH_SOD_STATISTICS, variable).then(data => {
			if (data && data.fetch_sod_statistics) {
				dataReturn(data.fetch_sod_statistics)
				setPrediction(data.fetch_sod_statistics)
				setShow(true)
			} else {
				props.addSnack('Somthing wrong')
			}
		})
	}

	const dateInfo = []
	prediction.map(item => dateInfo.push(item.date))

	useEffect(() => {
		setTimeout(() => {
			fetchData()
		}, 300)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return (
		<div style={{ marginTop: 30 }}>
			<MuiPickersUtilsProvider utils={DateFnsUtils}>
				<Grid container justify="space-around">
					<KeyboardDatePicker
						margin="normal"
						label="Start Date"
						format="yyyy-MM-dd"
						value={selectedStartDate}
						onChange={handleStartDateChange}
					/>
					<KeyboardDatePicker
						margin="normal"
						label="End Date"
						format="yyyy-MM-dd"
						value={selectedEndDate}
						onChange={handleEndDateChange}
					/>
					<Button
						variant="contained"
						onClick={fetchData}
						color="primary"
						className={classes.button}
					>
						Go
					</Button>
				</Grid>
			</MuiPickersUtilsProvider>
			<Grid container style={{ marginTop: '20px' }}>
				<Grid item xs={12}>
					<Typography variant="h4" component="h2" align="center">
						Reports
					</Typography>
				</Grid>
				<Grid item xs={2}></Grid>
				<Grid item xs={8}>
					<div className={classes.container} style={{}}>
						{show && <DonutChart data={predictionAmountLine} />}
					</div>
				</Grid>
			</Grid>
		</div>
	)
}

const Styled = withHighcharts(Charts, Highcharts)

export default connect(
	null,
	dispatch => ({
		addSuccess: bindActionCreators(addSuccess, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(Styled)
