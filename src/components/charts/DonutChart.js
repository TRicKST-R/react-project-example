import React, { Component } from 'react'
import * as Highcharts from 'highcharts'

class DonutChart extends Component {
	componentDidMount() {
		this.generateLabelsAndValues(this.props)
	}

	componentWillReceiveProps(nextProps) {
		this.generateLabelsAndValues(nextProps)
	}

	generateLabelsAndValues = rawData => {
		const { data } = rawData

		const formattedData = data.map(item => {
			const sumValue = item.data.reduce((previous, current) => {
				return (current += previous)
			})
			const avgValue = parseInt(sumValue / item.data.length)

			return {
				name: item.key,
				y: avgValue
			}
		})

		Highcharts.chart('container', {
			chart: {
				plotBackgroundColor: null,
				plotBorderWidth: null,
				plotShadow: false,
				type: 'pie',
				width: '750',
				height: '600',
				marginTop: '0'
			},
			title: {
				text: ''
			},
			tooltip: {
				pointFormat: '<b>{point.y}</b>'
			},
			plotOptions: {
				pie: {
					allowPointSelect: true,
					cursor: 'pointer',
					dataLabels: {
						enabled: true,
						format: '<b>{point.name}</b>: {point.y}'
					}
				}
			},
			credits: {
				enabled: false
			},
			series: [
				{
					name: 'Reports',
					colorByPoint: true,
					innerSize: '50%',
					data: [...formattedData]
				}
			]
		})
	}

	render() {
		return <div id="container"></div>
	}
}

export default DonutChart
