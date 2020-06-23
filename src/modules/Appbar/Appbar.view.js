import React, { useState } from 'react'
import {
	AppBar,
	Toolbar,
	IconButton,
	Typography,
	Avatar,
	Button,
	InputBase,
	Divider,
	DialogTitle,
	Dialog,
	CircularProgress
} from '@material-ui/core'
import { makeStyles, fade } from '@material-ui/core/styles'
import FullscreenIcon from '@material-ui/icons/Fullscreen'
// import Autorenew from '@material-ui/icons/Autorenew'
import screenfull from 'screenfull'
import Back from '@material-ui/icons/KeyboardBackspace'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import green from '@material-ui/core/colors/green'

import { SEARCH_USERS } from '../../root/Graphql'
import getChunk from '../../utils/GetChunk'
import UserList from '../../components/UserList'

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%'
	},
	searchbar: {
		flexGrow: 1,
		display: 'flex',
		position: 'relative'
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1
	},
	info: {
		display: 'flex',
		alignItems: 'center'
	},
	infoItem: {
		margin: '0 8px'
	},
	button: {
		margin: '0 24px'
	},
	input: {
		marginLeft: 8,
		flex: 1
	},
	iconButton: {
		padding: 10
	},
	divider: {
		width: 1,
		height: 28,
		margin: 4,
		backgroundColor: '#dedede'
	},
	search: {
		borderRadius: theme.shape.borderRadius,
		backgroundColor: fade(theme.palette.common.white, 0.15),
		'&:hover': {
			backgroundColor: fade(theme.palette.common.white, 0.25)
		},
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 'auto'
		},
		display: 'flex',
		height: 36
	},
	searchIcon: {
		width: theme.spacing(5),
		height: '100%',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'center'
	},
	inputRoot: {
		color: 'inherit',
		paddingLeft: 8
	},
	inputInput: {
		transition: theme.transitions.create('width'),
		width: '100%',
		[theme.breakpoints.up('sm')]: {
			width: 120,
			'&:focus': {
				width: 400
			}
		}
	},
	userList: {
		width: 1170
	},
	userListContainer: {
		padding: '0 24px 16px 24px'
	},
	wrapper: {
		position: 'relative',
		marginRight: 40
	},
	buttonProgress: {
		color: green[500],
		position: 'absolute',
		top: '50%',
		left: '50%',
		marginTop: -12,
		marginLeft: -12
	},
	progressSubstrate: {
		backgroundColor: 'rgba(173,173,173, .4)',
		width: '100%',
		height: '100%',
		position: 'absolute',
		top: 0,
		left: 0,
		borderRadius: 4
	}
}))

const AppBarComponent = props => {
	const { back } = props
	const [fullScreen, setFullScreen] = useState(false)
	const [input, setInput] = useState('')
	const [users, setUsers] = useState(null)
	const [searching, setSearching] = useState(false)
	const [modalOpened, setModalOpened] = useState(false)
	const classes = useStyles()

	const onClickFullscreen = () => {
		screenfull.toggle(document.getElementById('root'))
		setFullScreen(!fullScreen)
	}

	const logout = () => {
		localStorage.removeItem('id_token')
		window.location.reload()
	}

	const search = () => {
		setSearching(true)
		const variables = {
			user_name: input,
			email: input,
			user_id: input,
			account_id: input,
			apex_account_id: input,
			handle: input,
			gift_id: input,
			gift_receipt_code: input,
			object_id: input
		}
		getChunk(SEARCH_USERS, variables).then(data => {
			if (data.search_user && data.search_user.user) {
				setUsers(data.search_user.user)
				setModalOpened(true)
			} else props.addSnack('Search_user query response with null')
			setSearching(false)
		})
	}

	return (
		<div className={classes.root}>
			<AppBar position="fixed" className={classes.appBar}>
				<Toolbar disableGutters style={{ paddingLeft: 122 }}>
					<Typography className={classes.title} variant="h6" color="inherit" noWrap>
						Admin Portal
					</Typography>
					{back && (
						<Button variant="outlined" color="secondary" className={classes.button} onClick={back}>
							<Back style={{ marginRight: 8 }} />
							Back
						</Button>
					)}
					<div className={classes.searchbar}>
						<div style={{ flexGrow: 1 }}></div>
						<div className={classes.wrapper}>
							<div className={classes.search}>
								<InputBase
									placeholder="Search…"
									classes={{
										root: classes.inputRoot,
										input: classes.inputInput
									}}
									value={input}
									onChange={e => setInput(e.target.value)}
									onKeyPress={e => {
										if (e.key === 'Enter') search()
									}}
								/>
								<div className={classes.searchIcon} onClick={() => setInput('')}>
									<CloseIcon />
								</div>
								<Divider className={classes.divider} />
								<div className={classes.searchIcon} onClick={search}>
									<SearchIcon />
								</div>
							</div>
							{searching && (
								<div className={classes.progressSubstrate}>
									<CircularProgress size={24} className={classes.buttonProgress} />
								</div>
							)}
						</div>
						<Dialog
							open={modalOpened}
							fullWidth={true}
							maxWidth="lg"
							onClose={() => setModalOpened(false)}
						>
							<DialogTitle>Users</DialogTitle>
							<div className={classes.userListContainer}>
								<UserList users={users} push={props.push} closeDialog={setModalOpened} />
							</div>
						</Dialog>
					</div>
					<div className={classes.info}>
						<Typography component="p" color="inherit" noWrap className={classes.infoItem}>
							Logged in as admin
						</Typography>
						<Avatar className={classes.infoItem} />
						<Button
							variant="outlined"
							color="secondary"
							className={classes.button}
							onClick={logout}
						>
							Logout
						</Button>
						<IconButton color="inherit" className={classes.infoItem} onClick={onClickFullscreen}>
							<FullscreenIcon />
						</IconButton>
					</div>
				</Toolbar>
			</AppBar>
		</div>
	)
}

export default AppBarComponent
