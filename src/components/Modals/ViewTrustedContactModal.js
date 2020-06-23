import React from 'react'
// import Table from '@material-ui/core/Table'
// import TableBody from '@material-ui/core/TableBody'
// import TableCell from '@material-ui/core/TableCell'
// import TableHead from '@material-ui/core/TableHead'
// import TableRow from '@material-ui/core/TableRow'
import Modal from '@material-ui/core/Modal'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
	container: {
		display: 'flex',
		justifyContent: 'space-between'
	}
})

const ViewTrustedContactModal = props => {
	const { close, viewTrustedContact } = props
	const classes = useStyles()
	return (
		<Modal open={true} onClose={close}>
			<Paper className="modalInner" elevation={10}>
				<Typography gutterBottom variant="h5" component="h2" style={{ marginTop: 40 }}>
					Trusted Contact
				</Typography>
				{/* <Divider style={{ marginBottom: 40 }} />
				<Table>
					<TableHead>
						<TableRow>
							<TableCell align="right">applicant_id</TableCell>
							<TableCell align="right">applicant_type</TableCell>
							<TableCell align="right">name</TableCell>
							<TableCell align="right">email</TableCell>
							<TableCell align="right">birthday</TableCell>
							<TableCell align="right">ssn</TableCell>
							<TableCell align="right">w8_ben_tax_id</TableCell>
							<TableCell align="right">birth_country</TableCell>
							<TableCell align="right">citizenship_country</TableCell>
							<TableCell align="right">mobile</TableCell>
							<TableCell align="right">employment_status</TableCell>
							<TableCell align="right">employer</TableCell>
							<TableCell align="right">line_1</TableCell>
							<TableCell align="right">line_2</TableCell>
							<TableCell align="right">city</TableCell>
							<TableCell align="right">postal_code</TableCell>
							<TableCell align="right">state</TableCell>
							<TableCell align="right">country</TableCell>
							<TableCell align="right">organization</TableCell>
							<TableCell align="right">type</TableCell>
							<TableCell align="right">expiration</TableCell>
							<TableCell align="right">firm_affiliation_name</TableCell>
							<TableCell align="right">file_id</TableCell>
							<TableCell align="right">type</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{Boolean(viewTrustedContact.length) &&
							viewTrustedContact.map((contact, index) => (
								<TableRow key={index}>
									<TableCell align="left">{contact.applicant_id}</TableCell>
									<TableCell align="right">{contact.applicant_type}</TableCell>
									<TableCell align="right">
										{`${contact.name.first} ${contact.name.middle} ${contact.name.last}`}
									</TableCell>
									<TableCell align="right">{contact.email}</TableCell>
									<TableCell align="right">{contact.birthday}</TableCell>
									<TableCell align="right">{contact.ssn}</TableCell>
									<TableCell align="right">{contact.w8_ben_tax_id}</TableCell>
									<TableCell align="right">{contact.birth_country}</TableCell>
									<TableCell align="right">{contact.citizenship_country}</TableCell>
									<TableCell align="right">{contact.mobile}</TableCell>
									<TableCell align="right">{contact.employment_status}</TableCell>
									<TableCell align="right">{contact.employer}</TableCell>
									<TableCell align="right">{contact.address.line_1}</TableCell>
									<TableCell align="right">{contact.address.line_2}</TableCell>
									<TableCell align="right">{contact.address.city}</TableCell>
									<TableCell align="right">{contact.address.postal_code}</TableCell>
									<TableCell align="right">{contact.address.state}</TableCell>
									<TableCell align="right">{contact.address.country}</TableCell>
									<TableCell align="right">
										{contact.disclosures.political_exposure.organization}
									</TableCell>
									<TableCell align="right">{contact.disclosures.visa.type}</TableCell>
									<TableCell align="right">{contact.disclosures.visa.expiration}</TableCell>
									<TableCell align="right">{contact.disclosures.firm_affiliation.name}</TableCell>
									<TableCell align="right">{contact.disclosures.documents.file_id}</TableCell>
									<TableCell align="right">{contact.disclosures.documents.type}</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table> */}
				<Divider className="divider" />
				{Boolean(viewTrustedContact.length) &&
					viewTrustedContact.map((contact, index) => (
						<div className={classes.container} key={index}>
							<div style={{ flexBasis: 400 }}>
								<Typography className="p">
									<span>applicant_id</span>
									{contact.applicant_id || 'null'}
								</Typography>
								<Typography className="p">
									<span>applicant_type</span>
									{contact.applicant_type || 'null'}
								</Typography>
								<Typography className="p">
									<span>name</span>
									{`${contact.name.first} ${contact.name.middle} ${contact.name.last}`}
								</Typography>
								<Typography className="p">
									<span>email</span>
									{contact.email || 'null'}
								</Typography>
								<Typography className="p">
									<span>birthday</span>
									{contact.birthday || 'null'}
								</Typography>
								<Typography className="p">
									<span>ssn</span>
									{contact.ssn || 'null'}
								</Typography>
								<Typography className="p">
									<span>w8_ben_tax_id</span>
									{contact.w8_ben_tax_id || 'null'}
								</Typography>
								<Typography className="p">
									<span>birth_country</span>
									{contact.birth_country || 'null'}
								</Typography>
								<Typography className="p">
									<span>citizenship_country</span>
									{contact.citizenship_country || 'null'}
								</Typography>
								<Typography className="p">
									<span>mobile</span>
									{contact.mobile || 'null'}
								</Typography>
								<Typography className="p">
									<span>employment_status</span>
									{contact.employment_status || 'null'}
								</Typography>
								<Typography className="p">
									<span>employer</span>
									{contact.employer || 'null'}
								</Typography>
							</div>
							<div style={{ flexBasis: 480 }}>
								<Typography className="p">
									<span>line_1</span>
									{contact.address.line_1 || 'null'}
								</Typography>
								<Typography className="p">
									<span>line_2</span>
									{contact.address.line_2 || 'null'}
								</Typography>
								<Typography className="p">
									<span>city</span>
									{contact.city || 'null'}
								</Typography>
								<Typography className="p">
									<span>postal_code</span>
									{contact.postal_code || 'null'}
								</Typography>
								<Typography className="p">
									<span>state</span>
									{contact.state || 'null'}
								</Typography>
								<Typography className="p">
									<span>country</span>
									{contact.country || 'null'}
								</Typography>
								<Typography className="p">
									<span>organization</span>
									{contact.disclosures.political_exposure.organization || 'null'}
								</Typography>
								<Typography className="p">
									<span>type</span>
									{contact.disclosures.visa.type || 'null'}
								</Typography>
								<Typography className="p">
									<span>expiration</span>
									{contact.disclosures.visa.expiration || 'null'}
								</Typography>
								<Typography className="p">
									<span>firm_affiliation_name</span>
									{contact.disclosures.firm_affiliation.name || 'null'}
								</Typography>
								<Typography className="p">
									<span>file_id</span>
									{contact.disclosures.documents.file_id || 'null'}
								</Typography>
								<Typography className="p">
									<span>type</span>
									{contact.disclosures.documents.type || 'null'}
								</Typography>
							</div>
						</div>
					))}
			</Paper>
		</Modal>
	)
}

export default ViewTrustedContactModal
