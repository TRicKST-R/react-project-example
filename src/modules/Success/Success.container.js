import { connect } from 'react-redux'
import SuccessView from './Success.view'

export default connect(
	state => ({
		successState: state.successState
	}),
	dispatch => ({})
)(SuccessView)
