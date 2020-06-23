import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import CopyToClipView from './CopyToClip.view'
import { addSuccess } from '../../modules/Success/Success.state'

export default connect(
	null,
	dispatch => ({
		addSuccess: bindActionCreators(addSuccess, dispatch)
	})
)(CopyToClipView)
