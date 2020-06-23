import React, { Component } from 'react'
import {
	Paper,
	Typography,
	Divider,
	Checkbox,
	Button,
	IconButton,
	Chip,
	Badge,
	Card,
	CardContent
} from '@material-ui/core'
import { withStyles } from '@material-ui/core/styles'
import green from '@material-ui/core/colors/green'
import moment from 'moment'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import CopyIcon from '@material-ui/icons/FilterNone'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import Progress from '../components/Progress'
import { client } from '../root/client'
import { GET_PROPERTIES, GET_PERFORMANCE, GET_PORTFOLIO } from '../root/Graphql'
import Calendar from '../components/Calendar/Calendar'
import { formatCurrency } from '../utils/CurrencyHelper'
import Copy from '../modules/CopyToClip'
import { getDMYTFromUtc } from '../utils/DateHelper'
import InventoryAccountOrder from '../components/Management/InventoryAccountOrder'
import { addSuccess } from '../modules/Success/Success.state'

const styles = {
	root: {
		padding: '24px 40px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0'
	},
	checkbox: {
		color: green[600],
		'&$checked': {
			color: green[500]
		},
		padding: 0
	},
	checked: {},
	img: {
		maxHeight: 200,
		maxWidth: '100%'
	},
	container: {
		display: 'flex',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		alignItems: 'stretch'
	},
	item: {
		flexBasis: 350,
		maxWidth: 350,
		padding: 24,
		marginBottom: 24
	},
	btnContainer: {
		display: 'flex',
		margin: '40px 300px 0 300px',
		justifyContent: 'space-between'
	},
	badge: {
		marginBottom: 16
	},
	title: {
		fontSize: 18
	},
	card: {
		width: 330,
		margin: 16,
		'& p': {
			display: 'flex',
			justifyContent: 'space-between'
		},
		'& span': {
			fontWeight: 500
		}
	},
	cardContainer: {
		display: 'flex',
		justifyContent: 'space-between',
		flexWrap: 'wrap'
	},
	chip: {
		margin: 4,
		'& > span': {
			fontSize: 12
		}
	}
}

class Management extends Component {
	constructor(props) {
		super(props)
		this.state = {
			property: null,
			performance: null,
			portfolio: null,
			date: moment().startOf('year')
		}
	}

	componentWillMount() {
		client.query({ query: GET_PROPERTIES }).then(({ loading, error, data }) => {
			if (loading) return this.setState({ property: null })

			client.query({ query: GET_PERFORMANCE }).then(({ loading, error, data }) => {
				if (loading) return this.setState({ performance: null })

				client.query({ query: GET_PORTFOLIO }).then(({ loading, error, data }) => {
					if (loading) return this.setState({ portfolio: null })
					if (error) throw error
					if (data.fetch_portfolio && data.fetch_portfolio.portfolio)
						this.setState({ portfolio: data.fetch_portfolio.portfolio })
					else this.props.addSnack('fetch_portfolio = null')
				})

				if (error) throw error
				if (data.fetch_performance && data.fetch_performance.performance)
					this.setState({ performance: data.fetch_performance.performance })
				else this.props.addSnack('fetch_performance = null')
			})

			if (error) throw error
			if (data.fetch_property && data.fetch_property.property)
				this.setState({ property: data.fetch_property.property })
			else this.props.addSnack('fetch_property = null')
		})
	}

	render() {
		const { classes, addSuccess } = this.props
		const { property, performance, portfolio } = this.state
		let mods = [
			{
				date: moment(),
				classNames: ['current'],
				component: ['day', 'month', 'week']
			}
		]
		if (property) {
			const holidays = []
			holidays.push(
				property.find(
					item =>
						item.key === '2018_holiday_calendar' &&
						property.find(item => item.key === '2018_holiday_calendar').MapAttribute &&
						property.find(item => item.key === '2018_holiday_calendar').MapAttribute
				).holidays
			)
			holidays.push(
				property.find(item => item.key === '2019_holiday_calendar') &&
					property.find(item => item.key === '2019_holiday_calendar').MapAttribute &&
					JSON.parse(property.find(item => item.key === '2019_holiday_calendar').MapAttribute)
						.holidays
			)
			holidays.push(
				property.find(item => item.key === '2020_holiday_calendar') &&
					property.find(item => item.key === '2020_holiday_calendar').MapAttribute &&
					JSON.parse(property.find(item => item.key === '2020_holiday_calendar').MapAttribute)
						.holidays
			)

			holidays.map(day =>
				mods.push({
					date: moment(day),
					classNames: ['holiday'],
					component: ['day']
				})
			)
		}

		let since_datetime, high_water_mark
		if (property) {
			since_datetime =
				property.find(item => item.key === 'ale_trade-posting-status') &&
				property.find(item => item.key === 'ale_trade-posting-status').MapAttribute &&
				JSON.parse(property.find(item => item.key === 'ale_trade-posting-status').MapAttribute)
					.since_datetime
			high_water_mark =
				property.find(item => item.key === 'ale_trade-posting-status') &&
				property.find(item => item.key === 'ale_trade-posting-status').MapAttribute &&
				JSON.parse(property.find(item => item.key === 'ale_trade-posting-status').MapAttribute)
					.high_water_mark
		}

		let sentSince_datetime, sentHigh_water_mark
		if (property) {
			sentSince_datetime =
				property.find(item => item.key === 'ale_sentinel-ach-relationship-status') &&
				property.find(item => item.key === 'ale_sentinel-ach-relationship-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sentinel-ach-relationship-status').MapAttribute
				).since_datetime
			sentHigh_water_mark =
				property.find(item => item.key === 'ale_sentinel-ach-relationship-status') &&
				property.find(item => item.key === 'ale_sentinel-ach-relationship-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sentinel-ach-relationship-status').MapAttribute
				).high_water_mark
		}

		let sketchSince_datetime, sketchHigh_water_mark
		if (property) {
			sketchSince_datetime =
				property.find(item => item.key === 'ale_sketch-investigation-status') &&
				property.find(item => item.key === 'ale_sketch-investigation-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sketch-investigation-status').MapAttribute
				).since_datetime
			sketchHigh_water_mark =
				property.find(item => item.key === 'ale_sketch-investigation-status') &&
				property.find(item => item.key === 'ale_sketch-investigation-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sketch-investigation-status').MapAttribute
				).high_water_mark
		}

		let snapSince_datetime, snapHigh_water_mark
		if (property) {
			snapSince_datetime =
				property.find(item => item.key === 'ale_snap-document-upload') &&
				property.find(item => item.key === 'ale_snap-document-upload').MapAttribute &&
				JSON.parse(property.find(item => item.key === 'ale_snap-document-upload').MapAttribute)
					.since_datetime
			snapHigh_water_mark =
				property.find(item => item.key === 'ale_snap-document-upload') &&
				property.find(item => item.key === 'ale_snap-document-upload').MapAttribute &&
				JSON.parse(property.find(item => item.key === 'ale_snap-document-upload').MapAttribute)
					.high_water_mark
		}

		let atlasSince_datetime, atlasHigh_water_mark
		if (property) {
			atlasSince_datetime =
				property.find(item => item.key === 'ale_atlas-account_request-status') &&
				property.find(item => item.key === 'ale_atlas-account_request-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_atlas-account_request-status').MapAttribute
				).since_datetime
			atlasHigh_water_mark =
				property.find(item => item.key === 'ale_atlas-account_request-status') &&
				property.find(item => item.key === 'ale_atlas-account_request-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_atlas-account_request-status').MapAttribute
				).high_water_mark
		}

		let achSentSince_datetime, achSentHigh_water_mark
		if (property) {
			achSentSince_datetime =
				property.find(item => item.key === 'ale_sentinel-ach-transfer-status') &&
				property.find(item => item.key === 'ale_sentinel-ach-transfer-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sentinel-ach-transfer-status').MapAttribute
				).since_datetime
			achSentHigh_water_mark =
				property.find(item => item.key === 'ale_sentinel-ach-transfer-status') &&
				property.find(item => item.key === 'ale_sentinel-ach-transfer-status').MapAttribute &&
				JSON.parse(
					property.find(item => item.key === 'ale_sentinel-ach-transfer-status').MapAttribute
				).high_water_mark
		}
		const propertyValue = {
			property,
			addSnack: this.props.addSnack,
			addSuccess: this.props.addSuccess
		}
		return (
			<div>
				{property && <InventoryAccountOrder {...propertyValue} />}
				{property ? (
					<Paper className={classes.root} elevation={10}>
						<Typography gutterBottom variant="h5" component="h2">
							Properties
						</Typography>
						<Divider className={classes.divider} />

						<div className={classes.cardContainer}>
							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale trade-posting-status:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(since_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {high_water_mark}
									</Typography>
								</CardContent>
							</Card>

							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale sentinel-ach-relationship-status:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(sentSince_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {sentHigh_water_mark}
									</Typography>
								</CardContent>
							</Card>

							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale sketch-investigation-status:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(sketchSince_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {sketchHigh_water_mark}
									</Typography>
								</CardContent>
							</Card>

							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale snap-document-upload:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(snapSince_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {snapHigh_water_mark}
									</Typography>
								</CardContent>
							</Card>

							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale atlas-account_request-status:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(atlasSince_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {atlasHigh_water_mark}
									</Typography>
								</CardContent>
							</Card>

							<Card className={classes.card}>
								<CardContent>
									<Typography className={classes.title} color="textSecondary" gutterBottom>
										Ale sentinel-ach-transfer-status:
									</Typography>
									<Typography variant="body2" component="p">
										<span>Since datetime:</span> {getDMYTFromUtc(achSentSince_datetime)}
									</Typography>
									<Typography variant="body2" component="p">
										<span>High water mark:</span> {achSentHigh_water_mark}
									</Typography>
								</CardContent>
							</Card>
						</div>

						<div
							style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', marginBottom: 32 }}
						>
							<Typography gutterBottom component="p" className={classes.p}>
								<span>Perfomance Tickers:</span>
							</Typography>
							{property.find(item => item.key === 'performance_tickers') &&
								property.find(item => item.key === 'performance_tickers').MapAttribute &&
								JSON.parse(property.find(item => item.key === 'performance_tickers').MapAttribute)
									.tickers.split(',')
									.map((ticker, index) => (
										<Chip label={ticker} className={classes.chip} color="primary" key={index} />
									))}
						</div>

						<div className={classes.p}>
							<span>Product types:</span>
							{property.find(item => item.key === 'product_types') &&
								property.find(item => item.key === 'product_types').MapAttribute &&
								JSON.parse(
									property.find(item => item.key === 'product_types').MapAttribute
								).types.map((type, index) => (
									<Badge
										color="primary"
										badgeContent={type.display_order}
										className={classes.badge}
										key={index}
									>
										<Chip
											label={type.name}
											className="field"
											style={{ backgroundColor: '#efefef' }}
										></Chip>
									</Badge>
								))}
						</div>

						<div className={classes.p}>
							<span>Ale topics:</span>
							{property.find(item => item.key === 'ale_topics') &&
								property.find(item => item.key === 'ale_topics').MapAttribute &&
								JSON.parse(property.find(item => item.key === 'ale_topics').MapAttribute)
									.split(',')
									.map((topic, index) => (
										<Chip
											label={topic}
											component="p"
											className="field"
											key={index}
											style={{ margin: 8, backgroundColor: '#efefef' }}
										></Chip>
									))}
						</div>

						<div className={classes.p}>
							<span>Sod report numbers:</span>

							{property.find(item => item.key === 'sod_report_numbers') &&
								property.find(item => item.key === 'sod_report_numbers').MapAttribute &&
								JSON.parse(
									property.find(item => item.key === 'sod_report_numbers').MapAttribute
								).report_numbers.map((number, index) => (
									<Chip
										label={number}
										component="p"
										className="field"
										key={index}
										style={{ margin: 8, backgroundColor: '#efefef' }}
									></Chip>
								))}
						</div>

						<div
							style={{
								display: 'flex',
								justifyContent: 'space-between',
								marginBottom: 24,
								marginTop: 32
							}}
						>
							<div style={{ flexBasis: 440 }}>
								<div>
									<span className="customTitle">
										{property.find(item => item.key === 'FwmjyAdK32a0SscySwm') &&
											property.find(item => item.key === 'FwmjyAdK32a0SscySwm').key}
										:
									</span>
									<Copy label="Access token">
										{property.find(item => item.key === 'FwmjyAdK32a0SscySwm') &&
											property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute &&
											JSON.parse(
												property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute
											).access_token}
									</Copy>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span className="fieldName">Last updated at:</span>
										<span className="field">
											{property.find(item => item.key === 'FwmjyAdK32a0SscySwm') &&
												property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute &&
												getDMYTFromUtc(
													JSON.parse(
														property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute
													).last_updated_at
												)}
										</span>
									</div>
									<div style={{ display: 'flex', justifyContent: 'space-between' }}>
										<span className="fieldName">Expiry:</span>
										<span className="field">
											{property.find(item => item.key === 'FwmjyAdK32a0SscySwm') &&
												property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute &&
												getDMYTFromUtc(
													JSON.parse(
														property.find(item => item.key === 'FwmjyAdK32a0SscySwm').MapAttribute
													).expiry
												)}
										</span>
									</div>
								</div>
								<div className={classes.p} style={{ marginBottom: 24, marginTop: 32 }}>
									<span className="customTitle">customer.io:</span>
									<Copy label="Site id">
										{property.find(item => item.key === 'customer.io') &&
											property.find(item => item.key === 'customer.io').MapAttribute &&
											JSON.parse(property.find(item => item.key === 'customer.io').MapAttribute)
												.site_id}
									</Copy>
									<Copy label="API key">
										{property.find(item => item.key === 'customer.io') &&
											property.find(item => item.key === 'customer.io').MapAttribute &&
											JSON.parse(property.find(item => item.key === 'customer.io').MapAttribute)
												.api_key}
									</Copy>
								</div>
							</div>
							<div style={{ flexBasis: 540 }}>
								<Copy label="Long polling api key sequence number">
									{property.find(item => item.key === 'long_polling_api_key') &&
										property.find(item => item.key === 'long_polling_api_key').MapAttribute &&
										JSON.parse(
											property.find(item => item.key === 'long_polling_api_key').MapAttribute
										).sequence_number}
								</Copy>

								<Copy label="Segment">
									{property.find(item => item.key === 'segment') &&
										property.find(item => item.key === 'segment').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'segment').MapAttribute)
											.write_key}
								</Copy>

								<Copy label="Document key encrypted value">
									{property.find(item => item.key === 'documentkey') &&
										property.find(item => item.key === 'documentkey').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'documentkey').MapAttribute)
											.encrypted_value}
								</Copy>

								<Copy label="Apex private key">
									{property.find(item => item.key === 'apex_private_key') &&
										property.find(item => item.key === 'apex_private_key').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'apex_private_key').MapAttribute)
											.apex_private_key}
								</Copy>

								<Copy label="Sendgrid email API key">
									{property.find(item => item.key === 'sendgrid_email') &&
										property.find(item => item.key === 'sendgrid_email').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'sendgrid_email').MapAttribute)
											.api_key}
								</Copy>

								<Copy label="Iex token">
									{property.find(item => item.key === 'iex_token') &&
										property.find(item => item.key === 'iex_token').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'iex_token').MapAttribute).token}
								</Copy>

								<Copy label="Graphcms auth token">
									{property.find(item => item.key === 'graphcms') &&
										property.find(item => item.key === 'graphcms').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'graphcms').MapAttribute)
											.auth_token}
								</Copy>

								<Copy label="Apex login access token">
									{property.find(item => item.key === 'apex_login') &&
										property.find(item => item.key === 'apex_login').MapAttribute &&
										JSON.parse(property.find(item => item.key === 'apex_login').MapAttribute)
											.access_token}
								</Copy>
							</div>
						</div>

						<div style={{ display: 'flex', alignItems: 'center', marginTop: 80 }}>
							<div
								style={{ backgroundColor: '#0030ff', width: 32, height: 32, marginRight: 16 }}
							></div>
							<Typography style={{ marginRight: 40 }} gutterBottom>
								- Holiday
							</Typography>
							<div
								style={{ backgroundColor: '#4caf50', width: 32, height: 32, marginRight: 16 }}
							></div>
							<Typography gutterBottom>- Current day</Typography>
						</div>

						<Calendar
							weekNumbers={true}
							startDate={this.state.date}
							date={this.state.date}
							endDate={this.state.date.clone().endOf('year')}
							mods={mods}
						/>

						<div className={classes.btnContainer}>
							<Button
								variant="contained"
								color="primary"
								size="large"
								onClick={() => this.setState({ date: this.state.date.clone().subtract(1, 'year') })}
							>
								Prev year
							</Button>
							<Button
								variant="contained"
								color="primary"
								size="large"
								onClick={() => this.setState({ date: this.state.date.clone().add(1, 'year') })}
							>
								Next year
							</Button>
						</div>
					</Paper>
				) : (
					<Progress />
				)}

				{performance ? (
					<Paper className={classes.root} elevation={10}>
						<Typography gutterBottom variant="h5" component="h2">
							Performance
						</Typography>
						<Divider className={classes.divider} />
						<div className={classes.container}>
							{performance.map((item, index) => (
								<Paper elevation={5} key={index} className={classes.item}>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>backdrop_image:</span>
										<img src={item.backdrop_image} className={classes.img} alt="img" />
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>cms_id:</span>
										{item.cms_id}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>description:</span>
										{item.description}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>dividend_yield:</span>
										{item.dividend_yield}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>expenses:</span>
										{formatCurrency(item.expenses)}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>holdings:</span>
										{item.description}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>image:</span>
										<img src={item.image} className={classes.img} alt="img" />
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>Description:</span>
										<Checkbox
											checked={item.is_dream === 'true' ? true : false}
											classes={{
												root: classes.checkbox,
												checked: classes.checked
											}}
										/>
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>last_price:</span>
										{formatCurrency(item.last_price)}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>name:</span>
										{item.name}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>portfolio_id:</span>
										{item.portfolio_id}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>return_since_inception:</span>
										{item.return_since_inception}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>standard_deviation:</span>
										{item.standard_deviation}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>ticker:</span>
										{item.ticker}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>type:</span>
										{item.type}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>underlying:</span>
										{item.underlying}
									</Typography>

									<div style={{ display: 'flex', alignItems: 'center' }}>
										<span style={{ fontWeight: 'bold', marginRight: 8 }}>URL:</span>
										<CopyToClipboard text={item.url} onCopy={() => addSuccess('Copied!')}>
											<span
												style={{
													display: 'block',
													maxWidth: 240,
													overflow: 'hidden',
													textOverflow: 'ellipsis'
												}}
											>
												{item.url}
											</span>
										</CopyToClipboard>
										<CopyToClipboard text={item.url} onCopy={() => addSuccess('Copied!')}>
											<IconButton size="small">
												<CopyIcon />
											</IconButton>
										</CopyToClipboard>
									</div>

									<Typography gutterBottom component="p" className={classes.p}>
										<span>what_is_the_investment:</span>
										{item.what_is_the_investment}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>what_will_they_learn:</span>
										{item.what_will_they_learn}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>year_10_change_percent:</span>
										{item.year_10_change_percent}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>year_1_change_percent:</span>
										{item.year_1_change_percent}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>year_3_change_percent:</span>
										{item.year_3_change_percent}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>year_5_change_percent:</span>
										{item.year_5_change_percent}
									</Typography>
								</Paper>
							))}
						</div>
					</Paper>
				) : (
					<Progress />
				)}

				{portfolio ? (
					<Paper className={classes.root} elevation={10}>
						<Typography gutterBottom variant="h5" component="h2">
							Portfolio
						</Typography>
						<Divider className={classes.divider} />
						<div className={classes.container}>
							{portfolio.map((item, index) => (
								<Paper elevation={5} key={index} className={classes.item}>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>profile_index:</span>
										{item.profile_index}
									</Typography>
									<Typography
										gutterBottom
										component="p"
										className={classes.p}
										style={{ overflow: 'auto' }}
									>
										<span>glide_path:</span>
										{item.securities[0].glide_path}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>security_name:</span>
										{item.securities[0].security_name}
									</Typography>
									<Typography gutterBottom component="p" className={classes.p}>
										<span>security_type:</span>
										{item.securities[0].security_type}
									</Typography>
								</Paper>
							))}
						</div>
					</Paper>
				) : (
					<Progress />
				)}
			</div>
		)
	}
}

const Styled = withStyles(styles)(Management)

export default connect(
	state => ({
		spinnerState: state.spinnerState
	}),
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSuccess: bindActionCreators(addSuccess, dispatch)
	})
)(Styled)
