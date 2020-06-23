import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SnackView from './Snack.view'
import { push } from 'react-router-redux'
import { removeSnack } from './Snack.state'

export default connect(
	state => ({
		snackState: state.snackState
	}),
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		removeSnack: bindActionCreators(removeSnack, dispatch)
	})
)(SnackView)
