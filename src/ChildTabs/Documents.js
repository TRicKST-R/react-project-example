import React, { Component } from 'react'
import getChunk, { mutation, mutationUpload } from '../utils/GetChunk'
import Progress from '../components/Progress'
import {
	GET_LIST_DOCUMENTS,
	GET_BINARY_IMAGE,
	APPROVE_DOCUMENT,
	SKETCH_INVESTIGATION,
	SNAP_DOCUMENT,
	// UPLOAD_DOCUMENT,
	SNAP_DOCUMENT_METADATA,
	UPDATE_DOCUMENT_MATADATA,
	FETCH_INVESTIGATION_STATUS,
	COPY_DOCUMENT,
	UPDATE_FIRM_AFFILIATION
} from '../root/Graphql'
import { withStyles } from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import { Checkbox, TextField } from '@material-ui/core'
import MenuItem from '@material-ui/core/MenuItem'
import FormControl from '@material-ui/core/FormControl'
import Select from '@material-ui/core/Select'
import InputLabel from '@material-ui/core/InputLabel'
import Tooltip from '@material-ui/core/Tooltip'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import ViewAccountModal from '../components/Modals/ViewAccountModal'
import IconButton from '@material-ui/core/IconButton'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { addSnack } from '../modules/Snack/Snack.state'
import { addSuccess } from '../modules/Success/Success.state'
import { UPLOAD_DOCUMENT } from '../root/Mutations'

const styles = {
	container: {
		display: 'flex',
		justifyContent: 'center'
	},
	root: {
		padding: '10px 10px',
		marginBottom: 40
	},
	divider: {
		margin: '24px 0'
	},
	btn: {
		margin: 0,
		whiteSpace: 'nowrap'
	},
	pageContainer: {
		width: '1000px'
	},
	table: {
		'& td, & th': {
			padding: 8
		},
		'& th': {
			whiteSpace: 'nowrap'
		}
	},
	closeBtn: {
		position: 'relative',
		float: 'right',
		color: 'white',
		top: '-10px',
		right: '-10px'
	},
	intCust: {
		display: 'none'
	},
	formControl: {
		minWidth: 120
	},
	row: {
		display: 'flex',
		alignItems: 'center',
		width: 500,
		justifyContent: 'space-between',
		flexBasis: '48%'
	},
	borderBotNone: {
		borderBottom: 'none'
	}
}

const docsKind = [
	{ description: 'AFFILIATED_APPROVAL', name: 'AFFILIATED_APPROVAL', bitVal: 32 },
	{ description: 'DOCUMENT', name: 'DOCUMENT', bitVal: 64 },
	{ description: 'ID_DOCUMENT', name: 'ID_DOCUMENT', bitVal: 4 },
	{ description: 'SIGNATURE_IMAGE', name: 'SIGNATURE_IMAGE', bitVal: 1 },
	{ description: 'OTHER', name: 'OTHER', bitVal: 16 },
	{ description: 'SSN_CARD', name: 'SSN_CARD', bitVal: 8 },
	{ description: 'DRIVERS_LICENSE', name: 'DRIVERS_LICENSE', bitVal: 2 }
]

class Documents extends Component {
	constructor(props) {
		super(props)
		this.state = {
			docsFetched: false,
			docs: [],
			lightboxOpen: false,
			currentImage: '',
			currentImageBinary: '',
			openSnapMetaData: false,
			snapMetaData: null,
			open: false,
			open2: false,
			snapData: null,
			sketch_id: (this.props && this.props.sketch_ids && this.props.sketch_ids[0]) || '',
			sketchArray: this.props.sketch_ids,
			account_id: this.props.accountId,
			broker_dealer_account_id: this.props.accountId,
			user_id: this.props.parentId,
			optionArray: [],
			tmp: true,
			optionTagArray: [],
			openFileDilog: false,
			file: '',
			role: '',
			tag: '',
			bitValue: 0,
			document_type: '',
			fileName: '',
			openTagDilog: false,
			cTag: '',
			tagUpdateKey: '',
			openCopyModal: false,
			sprout: this.props.sprout,
			sprout_id: this.props.sprout_id,
			investigation: [],
			viewOpened: false,
			flagAccept: true,
			openAcceptModal: false,
			acceptStatus: '',
			comment: '',
			firmOpen: false,
			loading: false
		}
		this.baseState = this.state
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			account_id: nextProps.accountId,
			sketchArray: nextProps.sketch_ids,
			sketch_id: (nextProps.sketch_ids && nextProps.sketch_ids[0]) || '',
			sprout_id: (nextProps.sprout_id && nextProps.sprout_id) || ''
		})
		const ids = []
		const variables = { user_id: nextProps.parentId, sprout_id: nextProps.sprout_id }
		this.makeAPICall(ids, variables)
	}

	handleClose = () => this.setState({ open: false })

	openImage = key => {
		const user_id = this.state.user_id
		getChunk(GET_BINARY_IMAGE, { key, user_id }).then(({ view_document }) => {
			if (view_document && view_document.binary_image_data) {
				this.setState({ currentImageBinary: view_document.binary_image_data, lightboxOpen: true })
			} else this.props.addSnack('GraphQL bad response view document')
		})
	}

	openTagEdit = (cTag, key) =>
		this.setState({ openTagDilog: true, cTag: cTag, optionTagArray: [], tagUpdateKey: key })

	openCopy = key => this.setState({ openCopyModal: true, copyKey: key })

	closeCopy = () => this.setState({ openCopyModal: false })

	openAccept = key => this.setState({ openAcceptModal: true, acceptStatus: key })

	closeAccept = () => this.setState({ openAcceptModal: false })

	handleTagClose = () => this.setState({ openTagDilog: false })

	handleChange = event => this.setState({ sketch_id: event.target.value })

	handleSproutIdChange = event => this.setState({ sprout_id: event.target.value })

	handleCheckBoxClick = async e => {
		if (e.target.checked) {
			await this.setState({
				optionArray: this.state.optionArray.concat(e.target.value),
				flagAccept: false
			})
		} else {
			const array = [...this.state.optionArray] // make a separate copy of the array
			const index = array.indexOf(e.target.value)
			if (index !== -1) {
				array.splice(index, 1)
				await this.setState({ optionArray: array, flagAccept: index === 0 ? true : false })
			}
		}
	}

	handleTagCheckBoxClick = async e => {
		if (e.target.checked) {
			await this.setState({ optionTagArray: this.state.optionTagArray.concat(e.target.value) })
		} else {
			const array = [...this.state.optionTagArray] // make a separate copy of the array
			const index = array.indexOf(e.target.value)
			if (index !== -1) {
				array.splice(index, 1)
				await this.setState({ optionTagArray: array })
			}
		}
	}

	approve = (key, apexId) => {
		/*account_id:"abd0a6ee-5da5-460f-b9f4-5329a4aa106e"*/
		const variables = {
			key: key,
			user_id: this.state.user_id,
			apex_account_id: apexId,
			account_id: this.state.account_id
		} //, apex_account_id: apexId
		mutation(APPROVE_DOCUMENT, variables).then(({ approve_document }) => {
			if (approve_document) {
				this.props.addSucces('Document has been successfully uploaded to SNAP')
				this.refreshDocumentList()
			} else this.props.addSnack('Document has failed uploading to SNAP')
		})
	}

	getSnapData = snap_id => {
		const user_id = this.state.user_id
		const account_id = this.state.account_id
		getChunk(SNAP_DOCUMENT, { snap_id, user_id, account_id }).then(({ fetch_snap_document }) => {
			if (fetch_snap_document && fetch_snap_document.document) {
				this.setState({ currentImageBinary: fetch_snap_document.document, lightboxOpen: true })
			} else this.props.addSnack('Snap data fails')
		})
	}

	getSnapMetaData = snap_id => {
		const user_id = this.state.user_id
		const account_id = this.state.account_id
		getChunk(SNAP_DOCUMENT_METADATA, { snap_id, user_id, account_id }).then(
			({ fetch_snap_document_metadata }) => {
				if (fetch_snap_document_metadata) {
					this.setState({
						snapMetaData: fetch_snap_document_metadata,
						openSnapMetaData: true,
						open: true
					})
				} else this.props.addSnack('Snap view fails')
			}
		)
	}

	acceptAndAppeal = async action => {
		if (this.state.sketch_id === '') {
			this.props.addSnack('Select sketch ID')
		} else {
			const variables = {
				user_id: this.state.user_id,
				account_id: this.state.account_id,
				sketch_id: this.state.sketch_id,
				snap_ids: this.state.optionArray,
				action:
					action === 'ACCEPTED' ? 'accepted' : action === 'REJECTED' ? 'REJECTED' : 'appealed',
				comments: this.state.comment
			}
			mutation(SKETCH_INVESTIGATION, variables)
				.then(data => {
					if (data.sketch_investigation) {
						this.props.addSucces(action + ' action is successfully submitted')
						this.refreshDocumentList()
					} else {
						this.props.addSnack(`failed cannot transition from ACCEPTED to ${action}`)
					}
				})
				.catch(err => this.props.addSnack(action + ' failed'))
		}
	}

	clearState = () =>
		this.setState({
			docsFetched: false,
			docs: [],
			lightboxOpen: false,
			currentImage: '',
			currentImageBinary: '',
			openSnapMetaData: false
		})

	refreshDocumentList = () => {
		this.setState(this.baseState)
		const ids = []
		const variables = { user_id: this.props.parentId, sprout_id: this.state.sprout_id }
		this.makeAPICall(ids, variables)
	}

	uploadDocument = () => {
		// const variables = {
		//     user_id : this.state.docs[0].meta_data.user_id,
		//     sprout_id: this.state.docs[0].meta_data.sprout_id,
		//     document_type :"jpg",
		//     tag: "test"
		// }
		// mutation(UPLOAD_DOCUMENT, variables).then((data) => {
		//     user_id : this.state.user_id,
		//     sprout_id: this.state.sprout_id,
		//     document_type :this.state.document_type,
		//     tag: this.state.document_type,
		//     file:this.state.file
		// })
		//UPLOAD_DOCUMENT2
		// mutation1(UPLOAD_DOCUMENT2, variables).then((data) => {
		//     if(data) {
		//       alert('Upload Complate');
		//     }else{
		//       this.props.addSnack('Upload Fail.');
		//     }
		//   })
	}

	// onFileChangeHandler = async (event) => {
	handleFileClose = async () => this.setState({ openFileDilog: false })

	handleFileOpen = () =>
		this.setState({
			user_id: this.state.user_id,
			sprout_id: this.state.sprout_id,
			role: 'admin',
			fileName: '',
			file: '',
			document_type: '',
			tag: '',
			openFileDilog: true
		})

	handleFirmOpen = () => this.setState({ firmOpen: true, user_id: this.state.user_id })

	handleFirmClose = () => this.setState({ firmOpen: false })

	firmAffiliationAccount = () => {
		if (this.state.optionArray.length <= 0) {
			this.props.addSnack('Select Snaps')
		} else {
			const variables = {
				user_id: this.state.user_id,
				affiliated_approval: this.state.optionArray,
				account_id: this.state.broker_dealer_account_id
			}
			mutation(UPDATE_FIRM_AFFILIATION, variables).then(({ update_firm_affiliation }) => {
				if (update_firm_affiliation.status) {
					this.props.addSucces('Firm Affiliation Account ' + update_firm_affiliation.status)
					this.refreshDocumentList()
				} else this.props.addSnack('Firm Affiliation Account failed')
			})
		}
	}

	handleInputChange = async event => {
		// const toBase64 = file => new Promise((resolve, reject) => {
		// 	const reader = new FileReader();
		// 	reader.readAsDataURL(file);
		// 	reader.onload = () => resolve(reader.result);
		// 	reader.onerror = error => reject(error);
		// });

		const target = event.target
		let value = null
		if (target.type === 'file') {
			// value = await toBase64(target.files[0])
			value = target.files[0]
		} else {
			value = target.value
		}

		const name = target.name

		const found = docsKind.find(element => (element.name === target.value ? element.bitVal : 0))

		if (target.name === 'document_type') {
			this.setState({ bitValue: found.bitVal })
		}

		this.setState({
			[name]: value,
			fileName: target.type === 'file' ? target.files : ''
		})
	}

	onFileChangeHandler = async () => {
		const file = await this.state.file.arrayBuffer()
		const variables = {
			user_id: this.state.user_id,
			sprout_id: this.state.sprout_id,
			document_type: this.state.document_type,
			tag: this.state.document_type,
			file: this.state.file,
			bit: this.state.bitValue
		}

		console.log(this.state.fileName)
		console.log(variables)
		mutationUpload(UPLOAD_DOCUMENT, variables)
			.then(data => {
				console.log('success', data)
				if (data.errors) {
					addSnack('error in uploading file')
				}
			})
			.catch(err => console.log('err', err))
	}

	updateTag = () => {
		const variables = {
			user_id: this.state.docs[0].meta_data.user_id,
			key: this.state.tagUpdateKey,
			tag: this.state.optionTagArray
		}

		mutation(UPDATE_DOCUMENT_MATADATA, variables).then(({ update_document_metadata }) => {
			if (update_document_metadata.status) {
				this.props.addSucces(update_document_metadata.status)
				this.refreshDocumentList()
			} else this.props.addSnack('Somthing wrong in Mata Upadte')
		})
	}

	copyData = () => {
		const variables = {
			user_id: this.state.docs[0].meta_data.user_id,
			key: this.state.copyKey,
			target_sprout_id: this.state.sprout_id
		}
		mutation(COPY_DOCUMENT, variables).then(({ copy_document }) => {
			if (copy_document.status === 'error occured') {
				this.props.addSnack(copy_document.status)
			} else {
				this.props.addSucces(copy_document.status)
				this.refreshDocumentList()
			}
		})
	}

	openView = () => {
		const sketch_id = this.state.sketch_id
		const variables = {
			user_id: this.state.user_id,
			sketch_id: sketch_id,
			account_id: this.state.account_id
		}
		getChunk(FETCH_INVESTIGATION_STATUS, variables).then((data, errors) => {
			if (data && data.fetch_investigation_status) {
				this.setState({ investigation: data.fetch_investigation_status, viewOpened: true })
			} else {
				this.props.addSnack('somthing wrong')
			}
		})
	}

	closeView = () => this.setState({ viewOpened: false })

	makeAPICall = (ids, variables) => {
		this.setState({ loading: true })
		getChunk(GET_LIST_DOCUMENTS, variables).then(data => {
			if (data.list_documents && data.list_documents.document) {
				this.setState({ docsFetched: true, docs: data.list_documents.document, loading: false })
			} else {
				this.setState({ docsFetched: true, loading: false })
				this.props.addSnack('GraphQL bad response view documents')
			}
		})
	}

	componentWillMount() {
		const ids = []
		const variables = { user_id: this.props.parentId, sprout_id: this.state.sprout_id }
		this.makeAPICall(ids, variables)
	}

	render() {
		const { classes } = this.props

		if (this.state.loading) return <Progress />
		return (
			<div className={classes.pageContainer}>
				{this.state.open && (
					<Dialog open={this.state.open} onClose={this.handleClose}>
						<DialogTitle>Snap Meta Deta</DialogTitle>
						<DialogContent>
							<Table>
								<TableBody>
									<TableRow>
										<TableCell>id</TableCell>
										<TableCell>{this.state.snapMetaData.id}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>account</TableCell>
										<TableCell>{this.state.snapMetaData.account}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>correspondent</TableCell>
										<TableCell>{this.state.snapMetaData.correspondent}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>image_name</TableCell>
										<TableCell>{this.state.snapMetaData.image_name}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>tag</TableCell>
										<TableCell>{this.state.snapMetaData.tag}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>tags</TableCell>
										<TableCell>{this.state.snapMetaData.tags.toString()}</TableCell>
									</TableRow>
									<TableRow>
										<TableCell>uploaded_on</TableCell>
										<TableCell>{this.state.snapMetaData.uploaded_on}</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleClose} variant="outlined" color="primary">
								Close
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.openFileDilog && (
					<Dialog open={this.state.openFileDilog} onClose={this.handleFileClose}>
						<DialogTitle>Upload Document</DialogTitle>
						<DialogContent>
							<form encType="multipart/form-data">
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										autoFocus
										margin="dense"
										value={this.state.user_id}
										onChange={this.handleInputChange}
										id="user_id"
										name="user_id"
										label="User Id"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										margin="dense"
										value={this.state.sprout_id}
										onChange={this.handleInputChange}
										id="sprout_id"
										name="sprout_id"
										label="Sprout Id"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										margin="dense"
										value={this.state.document_type}
										onChange={this.handleInputChange}
										id="tag"
										name="tag"
										label="Tag"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										margin="dense"
										value={this.state.bitValue}
										onChange={this.handleInputChange}
										id="bitValue"
										name="tag"
										label="Bit"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										autoFocus
										margin="dense"
										id="role"
										value={this.state.role}
										onChange={this.handleInputChange}
										name="role"
										label="Role"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<InputLabel>Document Type</InputLabel>
									<Select
										fullWidth
										margin="dense"
										name="document_type"
										value={this.state.document_type}
										onChange={this.handleInputChange}
										label="Sprout Id"
									>
										{docsKind.map((doc, index) => (
											<MenuItem margin="dense" key={index} value={doc.name}>
												{doc.description}
											</MenuItem>
										))}
									</Select>
								</FormControl>
								<FormControl className={classes.formControl} style={{ marginTop: '10px' }}>
									<input
										className={classes.intCust}
										id="contained-button-file"
										multiple
										type="file"
										name="file"
										onChange={this.handleInputChange}
									/>
									<label htmlFor="contained-button-file">
										<Button variant="outlined" margin="dense" color="primary" component="span">
											Upload Document
											<CloudUploadIcon className={classes.rightIcon} />
										</Button>
										{this.state.fileName && this.state.fileName[0] && this.state.fileName[0].name}
									</label>
								</FormControl>
							</form>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleFileClose} color="primary">
								Cancel
							</Button>
							<Button onClick={this.onFileChangeHandler} color="primary">
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.firmOpen && (
					<Dialog open={this.state.firmOpen} onClose={this.handleFirmClose}>
						<DialogTitle>Firm Affiliation Account</DialogTitle>
						<DialogContent>
							<form>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										autoFocus
										margin="dense"
										value={this.state.user_id}
										onChange={this.handleInputChange}
										id="user_id"
										name="user_id"
										label="User Id"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										margin="dense"
										value={this.state.broker_dealer_account_id}
										onChange={this.handleInputChange}
										id="account_id"
										name="account_id"
										label="Account Id"
										type="text"
										fullWidth
									/>
								</FormControl>
								<FormControl className={classes.formControl} fullWidth>
									<TextField
										disabled
										margin="dense"
										value={this.state.optionArray}
										onChange={this.handleInputChange}
										id="snap_ids"
										name="snap_ids"
										label="Snap Ids"
										type="text"
										fullWidth
									/>
								</FormControl>
							</form>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleFirmClose} color="primary">
								Cancel
							</Button>
							<Button onClick={this.firmAffiliationAccount} color="primary">
								Submit
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.openTagDilog && (
					<Dialog open={this.state.openTagDilog} onClose={this.handleTagClose}>
						<DialogTitle>Edit Tag</DialogTitle>
						<DialogContent>
							<p>Current Document Type: {this.state.cTag}</p>
							{docsKind.map((doc, index) => (
								<div key={index} className={classes.row}>
									<Typography component="p">{doc.description}</Typography>
									<Checkbox
										color="primary"
										onClick={this.handleTagCheckBoxClick}
										value={doc.name}
									/>
								</div>
							))}
						</DialogContent>
						<DialogActions>
							<Button onClick={this.handleTagClose} variant="outlined" color="primary">
								Cancel
							</Button>
							<Button onClick={this.updateTag} variant="outlined" color="primary">
								Edit
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.openCopyModal && (
					<Dialog open={this.state.openCopyModal} onClose={this.closeCopy}>
						<DialogTitle>Copy document to other kid</DialogTitle>
						<br />
						<DialogContent>
							<div className={classes.row}>
								<Select
									fullWidth
									margin="dense"
									name="sprout_id"
									value={this.state.sprout_id}
									onChange={this.handleSproutIdChange}
									label="sprout_id"
								>
									{this.state.sprout &&
										this.state.sprout.map((id, index) => (
											<MenuItem
												key={index}
												selected
												value={id.sprout_id}
											>{`${id.first_name} ${id.last_name}`}</MenuItem>
										))}
								</Select>
							</div>
						</DialogContent>
						<DialogActions>
							<Button onClick={this.closeCopy} variant="outlined" color="primary">
								Cancel
							</Button>
							<Button onClick={this.copyData} variant="outlined" color="primary">
								Copy
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.openAcceptModal && (
					<Dialog open={this.state.openAcceptModal} onClose={this.closeAccept}>
						<DialogTitle>Investigation Comments</DialogTitle>
						<DialogContent>
							<InputLabel>Please provide your comments to be sent with investigation</InputLabel>
							<div className={classes.row}>
								<TextField
									margin="dense"
									label="(optional)"
									id="comment"
									value={this.state.comment}
									onChange={this.handleInputChange}
									name="comment"
									type="text"
									fullWidth
								/>
							</div>
						</DialogContent>
						<DialogActions>
							<Button
								onClick={() => this.acceptAndAppeal('REJECTED')}
								variant="outlined"
								color="primary"
							>
								REJECTED
							</Button>
							<Button
								onClick={() => this.acceptAndAppeal(this.state.acceptStatus)}
								variant="outlined"
								color="primary"
							>
								{this.state.acceptStatus}
							</Button>
						</DialogActions>
					</Dialog>
				)}

				{this.state.viewOpened && this.state.investigation && (
					<ViewAccountModal closeView={this.closeView} investigation={this.state.investigation} />
				)}

				{this.state.docsFetched ? (
					<>
						<Table className={classes.table}>
							<TableBody>
								<TableRow hover>
									<TableCell align="left">
										<Typography gutterBottom variant="h5" component="h2">
											Account Documents
										</Typography>
									</TableCell>
									<TableCell align="left">
										<FormControl>
											<Select value={this.state.sketch_id} onChange={this.handleChange}>
												{this.state.sketchArray &&
													this.state.sketchArray.map((sketchId, index) => (
														<MenuItem key={index} selected value={sketchId}>
															{sketchId}
														</MenuItem>
													))}
											</Select>
										</FormControl>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="Refresh Documents" aria-label="add">
											<IconButton
												className={classes.btn}
												variant="outlined"
												color="primary"
												onClick={() => this.refreshDocumentList()}
											>
												<i className="fa fa-refresh"></i>
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="View Investigation" aria-label="add">
											<IconButton
												className={classes.btn}
												variant="outlined"
												color="primary"
												onClick={() => this.openView()}
											>
												<i className="fa fa-eye" aria-hidden="true"></i>
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="Appeal Investigation" aria-label="add">
											<span>
												<IconButton
													className={classes.btn}
													variant="outlined"
													color="primary"
													onClick={() => this.openAccept('APPEALED')}
												>
													<i className="fa fa-question-circle" aria-hidden="true"></i>
												</IconButton>
												{/* <IconButton className={classes.btn} variant="outlined" disabled={this.state.flagAccept}  color="primary" onClick={() => this.openAccept('APPEALED')}><i className="fa fa-question-circle" aria-hidden="true"></i></IconButton> */}
											</span>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="Accept Investigation" aria-label="add">
											<span>
												<IconButton
													className={classes.btn}
													variant="outlined"
													color="primary"
													onClick={() => this.openAccept('ACCEPTED')}
												>
													<i className="fa fa-check-circle"></i>
												</IconButton>
												{/* <IconButton className={classes.btn} variant="outlined" disabled={this.state.flagAccept} color="primary" onClick={() => this.openAccept('ACCEPTED')}><i className="fa fa-check-circle" ></i></IconButton> */}
											</span>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="Firm Affiliation Account" aria-label="add">
											<IconButton
												variant="outlined"
												color="primary"
												component="span"
												className={classes.btn}
												onClick={() => this.handleFirmOpen()}
											>
												<i className="fa fa-building-o"></i>
											</IconButton>
										</Tooltip>
									</TableCell>
									<TableCell align="left">
										<Tooltip title="Upload Documents" aria-label="add">
											<IconButton
												variant="outlined"
												color="primary"
												component="span"
												className={classes.btn}
												onClick={() => this.handleFileOpen()}
											>
												<i className="fa fa-upload"></i>
											</IconButton>
										</Tooltip>
									</TableCell>
								</TableRow>
							</TableBody>
						</Table>
						{typeof this.state.docs !== 'undefined' && this.state.docs.length > 0 ? (
							<Table>
								<TableBody>
									{this.state.docs.map((document, index) => (
										<React.Fragment key={index}>
											<TableRow>
												<TableCell colSpan={8} className={classes.borderBotNone}>
													<p>{document.key}</p>
												</TableCell>
											</TableRow>
											<TableRow>
												<TableCell className={classes.borderBotNone}>
													{document.meta_data.snap_id && (
														<Checkbox
															color="primary"
															onClick={this.handleCheckBoxClick}
															value={document.meta_data.snap_id}
														></Checkbox>
													)}
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="User Id" aria-label="UserID">
														<span>{document.meta_data.user_id}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="Sprout Id" aria-label="sprout_id">
														<span>{document.meta_data.sprout_id}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="Apex Account Id" aria-label="apex_account_id">
														<span>{document.meta_data.apex_account_id}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="Snap Id" aria-label="snap_id">
														<span>{document.meta_data.snap_id}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="Tag" aria-label="tag">
														<span>{document.meta_data.tag}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}>
													<Tooltip title="Bit" aria-label="bit">
														<span>{document.meta_data.bit}</span>
													</Tooltip>
												</TableCell>
												<TableCell className={classes.borderBotNone}></TableCell>
											</TableRow>
											<TableRow>
												<TableCell className={classes.borderBotNone}></TableCell>
												<TableCell>
													<Tooltip
														title="Document Type"
														placement="bottom"
														aria-label="document_type"
													>
														<span>{document.meta_data.document_type}</span>
													</Tooltip>
												</TableCell>
												<TableCell>
													<Tooltip title="Role" placement="bottom" aria-label="role">
														<span>{document.meta_data.role}</span>
													</Tooltip>
												</TableCell>
												<TableCell>
													<Tooltip title="Status" placement="bottom" aria-label="status">
														<span>{document.meta_data.status}</span>
													</Tooltip>
												</TableCell>
												<TableCell colSpan={6}>
													<Tooltip
														title="View customer uploaded document"
														placement="bottom"
														aria-label="add"
													>
														<IconButton
															className={classes.btn}
															variant="outlined"
															color="primary"
															onClick={() => this.openImage(document.key)}
														>
															<i className="fa fa-eye" aria-hidden="true"></i>
														</IconButton>
													</Tooltip>
													<Tooltip
														title="Edit Tags of the customer uploaded document"
														aria-label="add"
													>
														<span>
															<IconButton
																className={classes.btn}
																style={{ margin: '0px 10px' }}
																variant="outlined"
																color="primary"
																onClick={() =>
																	this.openTagEdit(document.meta_data.tag, document.key)
																}
															>
																<i
																	className="fa fa-pencil"
																	disabled={document.meta_data.snap_id}
																	aria-hidden="true"
																></i>
															</IconButton>
														</span>
													</Tooltip>
													<Tooltip title="Approve and Upload to Snap" aria-label="add1">
														<div style={{ display: 'inline-block' }}>
															<IconButton
																className={classes.btn}
																disabled={Boolean(document.meta_data.snap_id)}
																variant="outlined"
																color="primary"
																onClick={() =>
																	this.approve(document.key, document.meta_data.apex_account_id)
																}
															>
																<i className="fa fa-check" aria-hidden="true"></i>
															</IconButton>
														</div>
													</Tooltip>
													<Tooltip title="View Snap upload document" aria-label="add1">
														<div style={{ display: 'inline-block' }}>
															<IconButton
																className={classes.btn}
																style={{ marginRight: 10, width: 50, marginLeft: 10 }}
																variant="outlined"
																disabled={!document.meta_data.snap_id}
																color="primary"
																onClick={() => this.getSnapData(document.meta_data.snap_id)}
															>
																<i className="fa fa-search" aria-hidden="true"></i>
															</IconButton>
														</div>
													</Tooltip>
													<Tooltip title="View Snap document metadata" aria-label="add1">
														<div style={{ display: 'inline-block' }}>
															<IconButton
																className={classes.btn}
																variant="outlined"
																color="primary"
																disabled={!document.meta_data.snap_id}
																onClick={() => this.getSnapMetaData(document.meta_data.snap_id)}
															>
																<i className="fa fa-file-text" aria-hidden="true"></i>
															</IconButton>
														</div>
													</Tooltip>
													<Tooltip title="Copy document to another kid" aria-label="add1">
														<div style={{ display: 'inline-block' }}>
															<IconButton
																className={classes.btn}
																style={{ marginLeft: 5 }}
																variant="outlined"
																color="primary"
																onClick={() => this.openCopy(document.key)}
															>
																<i className="fa fa-files-o" aria-hidden="true"></i>
															</IconButton>
														</div>
													</Tooltip>
												</TableCell>
											</TableRow>
										</React.Fragment>
									))}
								</TableBody>
							</Table>
						) : (
							<div>
								<h3>Document not found</h3>
							</div>
						)}
						{this.state.lightboxOpen && (
							<Lightbox
								mainSrc={`data:image/*;base64,${this.state.currentImageBinary}`}
								onCloseRequest={() => this.setState({ lightboxOpen: false })}
							/>
						)}
					</>
				) : (
					<Progress />
				)}
			</div>
		)
	}
}

const Styled = withStyles(styles)(Documents)

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch),
		addSucces: bindActionCreators(addSuccess, dispatch)
	})
)(Styled)
