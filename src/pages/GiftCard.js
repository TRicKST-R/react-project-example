import React, { useState } from 'react'
import { Paper, InputBase, Divider, IconButton, Typography } from '@material-ui/core'
import SearchIcon from '@material-ui/icons/Search'
import CloseIcon from '@material-ui/icons/Close'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'

import { GET_GIFTS } from '../root/Graphql'
import Userlist from '../components/UserList'
import getChunk from '../utils/GetChunk'
import { useStyles } from '../CustomHooks'
import Progress from '../components/Progress'
import { addSnack } from '../modules/Snack/Snack.state'

const styles = {
	root: {
		display: 'flex',
		justifyContent: 'center',
		flexDirection: 'column'
	},
	search: {
		padding: '2px 4px',
		display: 'flex',
		alignItems: 'center',
		width: 500,
		margin: '0 auto 40px auto'
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
		margin: 4
	}
}

const Home = props => {
	const [input, setInput] = useState('')
	const [users, setUsers] = useState(null)
	const [searching, setSearching] = useState(false)
	const classes = useStyles(styles)

	const search = () => {
		setSearching(true)
		const variables = {
			user_id: input,
			gift_id: input,
			gift_receipt_code: input,
			handle: input
		}
		getChunk(GET_GIFTS, variables).then(data => {
			if (data.get_gifts) setUsers(data.get_gifts)
			else props.addSnack('Search_user query response with null')
			setSearching(false)
		})
	}

	const renderUsers = () => {
		if (searching && users === null) return <Progress />
		if (users === null) return null
		if (users === [])
			return (
				<Typography variant="h5" component="h3" align="center">
					Nothing found
				</Typography>
			)
		return <Userlist users={users} push={props.push} />
	}

	return (
		<div className={classes.root}>
			<Paper className={classes.search} elevation={5}>
				<InputBase
					className={classes.input}
					placeholder="email, username, user_id, account_id, apex_account_id"
					value={input}
					onChange={e => setInput(e.target.value)}
					onKeyPress={e => {
						if (e.key === 'Enter') search()
					}}
				/>
				<IconButton className={classes.iconButton} aria-label="Search" onClick={() => setInput('')}>
					<CloseIcon />
				</IconButton>
				<Divider className={classes.divider} />
				<IconButton className={classes.iconButton} aria-label="Search" onClick={search}>
					<SearchIcon />
				</IconButton>
			</Paper>

			{renderUsers()}
		</div>
	)
}

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(Home)
