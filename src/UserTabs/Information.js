import React, { useState, useEffect } from 'react'
import { Divider, Typography } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import getChunk from '../utils/GetChunk'
import { FETCH_INFORMATION_OBJECT } from '../root/Graphql'
import Progress from '../components/Progress'
import { getDMYFromUtc } from '../utils/DateHelper'

const useStyles = makeStyles({
	p: {
		'& > span': {
			fontWeight: 600,
			marginRight: 8
		}
	},
	row: {
		display: 'flex',
		justifyContent: 'space-between'
	},
	infoBlock: {
		maxWidth: 520,
		width: '100%',
		'& > p': {
			display: 'flex',
			justifyContent: 'space-between'
		}
	},
	custHr: {
		borderTop: '1px solid #8c8989'
	},
	table: {
		'& td, & th': {
			padding: 4
		},
		width: 2000
	},
	transactions: {
		'& td, & th': {
			padding: 4
		}
	}
})

const Information = props => {
	const [information, setInformation] = useState(null)
	const [informationFetched, setInformationFetched] = useState(false)
	const { userId, addSnack } = props
	const classes = useStyles()

	useEffect(() => {
		getChunk(FETCH_INFORMATION_OBJECT, { user_id: userId }).then(({ fetch_information_object }) => {
			console.log(fetch_information_object)
			if (fetch_information_object) {
				setInformation(fetch_information_object.information)
				setInformationFetched(true)
			} else {
				setInformationFetched(true)
				addSnack('GraphQL bad response  information')
			}
		})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	if (informationFetched === false) return <Progress />
	if (informationFetched === true && information === null) return null
	return (
		<>
			<div className={classes.row}>
				<div className={classes.infoBlock}>
					<span className="customTitle">Personal Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>user_id:</span>
						{information.user_id}
					</Typography>
					<Typography className="p">
						<span>first:</span>
						{information.first}
					</Typography>
					<Typography className="p">
						<span>last:</span>
						{information.last}
					</Typography>
					<Typography className="p">
						<span>middle:</span>
						{information.middle || 'null'}
					</Typography>
					<Typography className="p">
						<span>birth_country:</span>
						{information.birth_country}
					</Typography>
					<Typography className="p">
						<span>birthday:</span>
						{getDMYFromUtc(information.birthday)}
					</Typography>
					<Typography className="p" style={{ marginBottom: 16 }}>
						<span>assets_worth:</span>
						{information.assets_worth}
					</Typography>
					<span className="customTitle">Contact Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>email:</span>
						{information.email}
					</Typography>
					<Typography className="p">
						<span>line_1:</span>
						{information.line_1}
					</Typography>
					<Typography className="p">
						<span>line_2:</span>
						{information.line_2 || 'null'}
					</Typography>
					<Typography className="p" style={{ marginBottom: 16 }}>
						<span>mobile:</span>
						{information.mobile}
					</Typography>
					<span className="customTitle">Disclosure Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>disclosure_firm_affiliation_name:</span>
						{information.disclosure_firm_affiliation_name || 'null'}
					</Typography>
					<Typography className="p">
						<span>disclosure_political_exposure_organization:</span>
						{information.disclosure_political_exposure_organization || 'null'}
					</Typography>
					<Typography className="p">
						<span>disclosure_type:</span>
						{information.disclosure_type || 'null'}
					</Typography>
					<Typography className="p">
						<span>disclosure_political_exposure_family:</span>
						{information.disclosure_political_exposure_family || 'null'}
					</Typography>
					<Typography className="p">
						<span>disclosure_control_person_company_symbols:</span>
						{information.disclosure_control_person_company_symbols || 'null'}
					</Typography>
				</div>
				<div className={classes.infoBlock}>
					<span className="customTitle">Address Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>city:</span>
						{information.city}
					</Typography>
					<Typography className="p">
						<span>state:</span>
						{information.state}
					</Typography>
					<Typography className="p">
						<span>postal_code:</span>
						{information.postal_code}
					</Typography>
					<Typography className="p" style={{ marginBottom: 16 }}>
						<span>citizenship_country:</span>
						{information.citizenship_country}
					</Typography>
					<span className="customTitle">Employee Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>client_id:</span>
						{information.client_id}
					</Typography>
					<Typography className="p">
						<span>employer_name:</span>
						{information.employer_name || 'null'}
					</Typography>
					<Typography className="p" style={{ marginBottom: 16 }}>
						<span>employment_status:</span>
						{information.employment_status}
					</Typography>
					<span className="customTitle">Visa Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>visa_expiration:</span>
						{information.visa_expiration || 'null'}
					</Typography>
					<Typography className="p" style={{ marginBottom: 16 }}>
						<span>visa_type:</span>
						{information.visa_type || 'null'}
					</Typography>
					<span className="customTitle">Other Information</span>
					<Divider className="divider" />
					<Typography className="p">
						<span>income_range:</span>
						{information.income_range}
					</Typography>
					<Typography className="p">
						<span>investor_type:</span>
						{information.investor_type}
					</Typography>
					<Typography className="p">
						<span>liquidity_needs:</span>
						{information.liquidity_needs || 'null'}
					</Typography>
					<Typography className="p">
						<span>time_horizon:</span>
						{information.time_horizon || 'null'}
					</Typography>
					<Typography className="p">
						<span>user_ssn_hash:</span>
						{information.user_ssn_hash}
					</Typography>
					<Typography className="p">
						<span>last_updated_time:</span>
						{information.last_updated_time}
					</Typography>
					{information && information.admin && (
						<>
							<Typography className="p">
								<span>object_id:</span>
								{information.admin.object_id}
							</Typography>
							<Typography className="p">
								<span>ssn:</span>
								{information.admin.ssn || 'null'}
							</Typography>
							<Typography className="p">
								<span>status:</span>
								{information.admin.status}
							</Typography>
						</>
					)}
				</div>
			</div>
			<div className={classes.row}>
				{information && information.trusted_contact && (
					<div className={classes.infoBlock}>
						<span className="customTitle">Trusted Contact</span>
						<Divider className="divider" />
						<Typography className="p">
							<span>first_name:</span>
							{information.trusted_contact.first_name}
						</Typography>
						<Typography className="p">
							<span>last_name:</span>
							{information.trusted_contact.last_name}
						</Typography>
						<Typography className="p">
							<span>mobile:</span>
							{information.trusted_contact.mobile}
						</Typography>
						<Typography className="p">
							<span>email:</span>
							{information.trusted_contact.email}
						</Typography>
					</div>
				)}
				{information && information.sprout && (
					<div>
						<span className="customTitle" style={{ marginTop: 40 }}>
							Sprout
						</span>
						<Divider className="divider" />
						{information.sprout.map((item, index) => (
							<div style={{ width: 500 }} key={index}>
								<Typography className="p">
									<span>unique_code_url:</span>
									{item.unique_code_url}
								</Typography>
								<Typography className="p">
									<span>first_name:</span>
									{item.first_name}
								</Typography>
								<Typography className="p">
									<span>last_name:</span>
									{item.last_name}
								</Typography>
								<Typography className="p">
									<span>ssn_status:</span>
									{item.ssn_status}
								</Typography>
								<Typography className="p">
									<span>sprout_id:</span>
									{item.sprout_id}
								</Typography>
								<Typography className="p">
									<span>ssn_request_mobile:</span>
									{item.ssn_request_mobile}
								</Typography>
								<Typography className="p">
									<span>ssn_request_email:</span>
									{item.ssn_request_email}
								</Typography>
								<Typography className="p">
									<span>ssn_request_time:</span>
									{item.ssn_request_time}
								</Typography>
							</div>
						))}
					</div>
				)}
			</div>
		</>
	)
}

export default Information
