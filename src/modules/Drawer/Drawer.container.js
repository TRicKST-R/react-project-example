import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import DrawerView from './Drawer.view'
import { push } from 'react-router-redux'
// import { closeDrawer } from './Drawer.state'
// import { unshiftAppbar } from '../Appbar/Appbar.state'

export default connect(
	// state => ({
	// 	drawerState: state.drawerState
	// }),
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch)
		// closeDrawer: bindActionCreators(closeDrawer, dispatch),
		// unshiftAppbar: bindActionCreators(unshiftAppbar, dispatch)
	})
)(DrawerView)
