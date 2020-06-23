import { makeStyles } from '@material-ui/core/styles'

export const useStyles = styles => {
	const func = makeStyles(styles)
	return func()
}
