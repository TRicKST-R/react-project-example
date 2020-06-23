import React from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'
import IconButton from '@material-ui/core/IconButton'
import CopyIcon from '@material-ui/icons/FilterNone'
import { withStyles } from '@material-ui/core/styles'

const styles = {
	p: {
		lineHeight: '24px',
		display: 'flex',
		alignItems: 'center',
		'& > span': {
			marginRight: 8
		}
	},
	text: {
		display: 'block',
		maxWidth: 265,
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		fontWeight: 'normal',
		marginRight: 0,
		maxHeight: 24
	}
}

const CopyToClip = props => {
	const { classes, addSuccess, children, label } = props
	return (
		<div className="copyToCLipboard">
			<span className="fieldName">{`${label}:`}</span>
			<div style={{ flexGrow: 1 }}></div>
			<CopyToClipboard text={children} onCopy={() => addSuccess('Copied!')}>
				<span className={`${classes.text} field`}>{children}</span>
			</CopyToClipboard>
			<CopyToClipboard text={children} onCopy={() => addSuccess('Copied!')}>
				<IconButton size="small">
					<CopyIcon />
				</IconButton>
			</CopyToClipboard>
		</div>
	)
}

export default withStyles(styles)(CopyToClip)
