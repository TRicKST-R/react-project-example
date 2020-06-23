import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Fab from '@material-ui/core/Fab'
import CircularProgress from '@material-ui/core/CircularProgress'

const useStyles = makeStyles({
	root: {
		flex: '0 0 auto',
		color: 'rgba(0, 0, 0, 0.54)',
		padding: 12,
		overflow: 'visible',
		fontSize: '1.5rem',
		textAlign: 'center',
		transition: 'background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms',
		borderRadius: '50%',
		height: 48,
		width: 48,
		minWidth: 'inherit',
		position: 'absolute',
		top: 0,
		right: -50,
		backgroundColor: '#fff'
	},
	disabled: {
		backgroundColor: '#d5d5d5'
	}
})

const RefreshButton = props => {
	const classes = useStyles()
	return (
		<Tooltip title="Refresh">
			<Fab className={`${classes.root} ${props.isActive ? '' : classes.disabled}`} onClick={() => {
				if(props.isActive) props.func()
			}}>
				<svg
					xmlns="http://www.w3.org/2000/svg"
					className="refresh"
					width="24"
					height="24"
					viewBox="0 0 18 18"
				>
					<path d="M9 13.5c-2.49 0-4.5-2.01-4.5-4.5S6.51 4.5 9 4.5c1.24 0 2.36.52 3.17 1.33L10 8h5V3l-1.76 1.76C12.15 3.68 10.66 3 9 3 5.69 3 3.01 5.69 3.01 9S5.69 15 9 15c2.97 0 5.43-2.16 5.9-5h-1.52c-.46 2-2.24 3.5-4.38 3.5z" />
				</svg>
			</Fab>
		</Tooltip>
	)
}

export default RefreshButton
