import React, { Component } from 'react'
import moment from 'moment'
import classnames from 'classnames'
import { getModsByCompType } from './util'

import Month from './Month'

export default class Calendar extends Component {
	static defaultProps = {
		locale: 'en',
		yearHeaderFormat: 'YYYY'
	}

	moment() {
		const localMoment = moment.apply(null, arguments)

		localMoment.locale(this.props.locale)

		return localMoment
	}

	renderHeader = () => (
		<header key="header" className={classnames('rc-Calendar-header')}>
			{this.moment(this.props.date).format(this.props.yearHeaderFormat)}
		</header>
	)

	getMonthRange() {
		const focus = this.moment(this.props.date || this.props.startDate).startOf('month')
		const start = this.moment(this.props.startDate)
		const end = this.moment(this.props.endDate)
		const size = end.diff(start, 'month') + 1

		return Array(size)
			.fill(0)
			.map((n, i) => focus.clone().add(n + i, 'months'))
	}

	render() {
		const { mods } = this.props
		const monthMods = getModsByCompType('month', mods)
		let weekMods = getModsByCompType('week', mods)
		let dayMods = getModsByCompType('day', mods)

		return (
			<div className="calendar">
				{this.renderHeader()}
				<div>
					{this.getMonthRange().map((date, i) => (
						<Month
							key={`month-${i}`}
							date={date}
							weekNumbers={this.props.weekNumbers}
							mods={monthMods}
							week={weekMods}
							day={dayMods}
						/>
					))}
				</div>
			</div>
		)
	}
}
