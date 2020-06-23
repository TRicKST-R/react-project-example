import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import SpinnerView from './Spinner.view'
import { push } from 'react-router-redux'
// import { startSpinner } from './Spinner.state'
// import { stopSpinner } from './Spinner.state'

export default connect(
	state => ({
		spinnerState: state.spinnerState
	}),
	dispatch => ({
		push: bindActionCreators(push, dispatch)
		// startSpinner: bindActionCreators(startSpinner, dispatch),
		// stopSpinner: bindActionCreators(stopSpinner, dispatch)
	})
)(SpinnerView)
