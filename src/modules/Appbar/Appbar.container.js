import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import AppbarView from './Appbar.view'
import { push } from 'react-router-redux'

import { addSnack } from '../Snack/Snack.state'

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch)
	})
)(AppbarView)
