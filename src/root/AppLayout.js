import React from 'react'
import { makeStyles } from '@material-ui/styles'
import Appbar from '../modules/Appbar'
import Drawer from '../modules/Drawer'

const useStyles = makeStyles({
	root: {
		margin: '96px auto 0 auto',
		paddingBottom: 40,
		maxWidth: 1170
	}
})

const AppLayout = props => {
	const classes = useStyles()
	const goBackPage = () => props.children.props.history.goBack()
	return (
		<React.Fragment>
			<Appbar back={props.children.props.location.pathname !== '/' && goBackPage} />
			<Drawer />
			<div className={classes.root} id="route">
				{props.children}
			</div>
		</React.Fragment>
	)
}

export default AppLayout
