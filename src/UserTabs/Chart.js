import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/styles'
import Highcharts from 'highcharts'
import {
	HighchartsChart,
	withHighcharts,
	XAxis,
	YAxis,
	Title,
	LineSeries
} from 'react-jsx-highcharts'

import { getDMYTFromUtc } from '../utils/DateHelper'
import getChunk from '../utils/GetChunk'
import { FETCH_CHART_PERFORMANCE_DATA, FETCH_CHART_PREDICTION_DATA } from '../root/Graphql'
import Progress from '../components/Progress'
import { Tabs, Tab } from '@material-ui/core/'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	chart: {
		flexBasis: '48%',
		minHeight: 400,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	divider: {
		margin: '24px 0'
	},
	tablist: {
		backgroundColor: '#f3f3f3'
	},
	containerChild: {
		display: 'flex',
		justifyContent: 'space-between',
		marginTop: 30
	}
})

const Charts = ({ addSnack, userId, childList }) => {
	const [performance, setPerformance] = useState([])
	const [performanceChild, setPerformanceChild] = useState([])
	const [prediction, setPrediction] = useState([])
	const [predictionChild, setPredictionChild] = useState([])
	const [activeChild, setActiveChild] = useState(0)
	const classes = useStyles()

	useEffect(() => {
		const variables = { user_id: userId }

		getChunk(FETCH_CHART_PERFORMANCE_DATA, variables).then(data => {
			if (
				data &&
				data.fetch_chart_performance_data &&
				data.fetch_chart_performance_data.performance_data
			) {
				let newData = []
				data.fetch_chart_performance_data.performance_data.map(string => {
					let item = []
					string
						.slice(1, -1)
						.split(',')
						.forEach(el => item.push(parseFloat(el)))
					return newData.push(item)
				})
				setPerformance(newData)
			} else {
				addSnack('GraphQL bad response fetching performance data')
			}
		})

		getChunk(FETCH_CHART_PREDICTION_DATA, variables).then(data => {
			if (
				data &&
				data.fetch_chart_prediction_data &&
				data.fetch_chart_prediction_data.prediction_data
			) {
				let newData = []
				data.fetch_chart_prediction_data.prediction_data.map(string => {
					let item = []
					string.split(',').forEach(el => item.push(parseFloat(el)))
					return newData.push(item)
				})
				setPrediction(newData)
			} else {
				addSnack('GraphQL bad response fetching perdiction data')
			}
		})

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	// for Child
	useEffect(() => {
		const variables = {
			user_id: userId,
			sprout_id: childList[activeChild] && childList[activeChild].sprout_id
		}

		getChunk(FETCH_CHART_PERFORMANCE_DATA, variables).then(data => {
			if (
				data &&
				data.fetch_chart_performance_data &&
				data.fetch_chart_performance_data.performance_data
			) {
				let newData = []
				data.fetch_chart_performance_data.performance_data.map(string => {
					let item = []
					string
						.slice(1, -1)
						.split(',')
						.forEach(el => item.push(parseFloat(el)))
					return newData.push(item)
				})
				setPerformanceChild(newData)
			} else {
				addSnack('GraphQL bad response fetching performance data child')
			}
		})

		getChunk(FETCH_CHART_PREDICTION_DATA, variables).then(data => {
			if (
				data &&
				data.fetch_chart_prediction_data &&
				data.fetch_chart_prediction_data.prediction_data
			) {
				let newData = []
				data.fetch_chart_prediction_data.prediction_data.map(string => {
					let item = []
					string.split(',').forEach(el => item.push(parseFloat(el)))
					return newData.push(item)
				})
				setPredictionChild(newData)
			} else {
				addSnack('GraphQL bad response fetching perdiction data child')
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [activeChild])

	const amountLine = []
	const marketValue = []
	const categories = []
	performance.map(item => {
		amountLine.push(item[1])
		marketValue.push(item[2])
		const date = new Date(item[0])
		return categories.push(getDMYTFromUtc(date))
	})

	const amountLineChild = []
	const marketValueChild = []
	const categoriesChild = []
	performanceChild.map(item => {
		amountLineChild.push(item[1])
		marketValueChild.push(item[2])
		const date = new Date(item[0])
		return categoriesChild.push(getDMYTFromUtc(date))
	})

	const predictionAmountLine = []
	const summaryLine = []
	const predictionCategories = []
	prediction.map(item => {
		predictionAmountLine.push(item[1])
		summaryLine.push(item[2])
		return predictionCategories.push(item[0])
	})

	const predictionAmountLineChild = []
	const summaryLineChild = []
	const predictionCategoriesChild = []
	predictionChild.map(item => {
		predictionAmountLineChild.push(item[1])
		summaryLineChild.push(item[2])
		return predictionCategoriesChild.push(item[0])
	})

	const changeActiveChild = index => setActiveChild(index)

	return (
		<div style={{ marginTop: 30 }}>
			<div className={classes.container}>
				{performance.length ? (
					<HighchartsChart className={classes.chart}>
						<Title>Performance</Title>
						<XAxis type="datetime" categories={categories}></XAxis>
						<YAxis>
							<LineSeries data={amountLine} />
							<LineSeries data={marketValue} />
						</YAxis>
					</HighchartsChart>
				) : (
					<div className={classes.chart}>
						<Progress />
					</div>
				)}
				{prediction.length ? (
					<HighchartsChart className={classes.chart}>
						<Title>Prediction</Title>
						<XAxis type="datetime" categories={predictionCategories}></XAxis>
						<YAxis>
							<LineSeries data={predictionAmountLine} />
							<LineSeries data={summaryLine} />
						</YAxis>
					</HighchartsChart>
				) : (
					<div className={classes.chart}>
						<Progress />
					</div>
				)}
			</div>
			<div style={{ marginTop: 30 }}>
				<Tabs
					value={activeChild}
					onChange={(event, value) => changeActiveChild(value)}
					indicatorColor="primary"
					variant="scrollable"
					scrollButtons="auto"
					textColor="primary"
					className={classes.tablist}
				>
					{childList &&
						childList.map((child, index) => (
							<Tab label={`${child.first_name} ${child.last_name}`} key={index} />
						))}
				</Tabs>
			</div>
			<div className={classes.containerChild}>
				{performanceChild.length ? (
					<HighchartsChart className={classes.chart}>
						<Title>Performance</Title>
						<XAxis type="datetime" categories={categoriesChild}></XAxis>
						<YAxis>
							<LineSeries data={amountLineChild} />
							<LineSeries data={marketValueChild} />
						</YAxis>
					</HighchartsChart>
				) : (
					<div className={classes.chart}>
						<Progress />
					</div>
				)}
				{predictionChild.length ? (
					<HighchartsChart className={classes.chart}>
						<Title>Prediction</Title>
						<XAxis type="datetime" categories={predictionCategoriesChild}></XAxis>
						<YAxis>
							<LineSeries data={predictionAmountLineChild} />
							<LineSeries data={summaryLineChild} />
						</YAxis>
					</HighchartsChart>
				) : (
					<div className={classes.chart}>
						<Progress />
					</div>
				)}
			</div>
		</div>
	)
}

export default withHighcharts(Charts, Highcharts)
