import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import Divider from '@material-ui/core/Divider'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import HomeIcon from '@material-ui/icons/Home'
import EventIcon from '@material-ui/icons/Event'
import AssessmentIcon from '@material-ui/icons/Assessment'
import AttachMoney from '@material-ui/icons/AttachMoney'
import CalendarIcon from '@material-ui/icons/CalendarToday'
import PersonAddDisabled from '@material-ui/icons/PersonAddDisabled'
import PersonAdd from '@material-ui/icons/PersonAdd'
import ShowChart from '@material-ui/icons/ShowChart'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import CardGiftcard from '@material-ui/icons/CardGiftcard'
const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex'
	},
	drawer: {
		flexShrink: 0,
		whiteSpace: 'nowrap',
		'& > div': {
			paddingTop: 64
		}
	},
	list: {
		'& > div': {
			flexDirection: 'column',
			padding: '8px !important',
			alignItems: 'center'
		},
		'& .MuiListItemIcon-root': {
			minWidth: 'inherit'
		},
		'& .MuiListItemText-root': {
			fontSize: 12,
			marginBottom: 0
		}
	}
}))

const MiniDrawer = props => {
	const { push } = props

	const classes = useStyles()

	return (
		<div className={classes.root}>
			<Drawer variant="permanent" className={classes.drawer}>
				<List className={classes.list}>
					<ListItem button onClick={() => push('/')}>
						<ListItemIcon>
							<HomeIcon />
						</ListItemIcon>
						<ListItemText primary="Accounts" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/rejected-accounts')}>
						<ListItemIcon>
							<PersonAddDisabled />
						</ListItemIcon>
						<ListItemText primary="Rejected" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/indeterminate-accounts')}>
						<ListItemIcon>
							<PersonAdd />
						</ListItemIcon>
						<ListItemText primary="Indeterminate" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/events')}>
						<ListItemIcon>
							<EventIcon />
						</ListItemIcon>
						<ListItemText primary="Events" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/operations')}>
						<ListItemIcon>
							<AssessmentIcon />
						</ListItemIcon>
						<ListItemText primary="Operations" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/advisor-balance')}>
						<ListItemIcon>
							<AttachMoney />
						</ListItemIcon>
						<ListItemText primary="Adv. Balance" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/management')}>
						<ListItemIcon>
							<CalendarIcon />
						</ListItemIcon>
						<ListItemText primary="Management" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/reports')}>
						<ListItemIcon>
							<ShowChart />
						</ListItemIcon>
						<ListItemText primary="SOD Reports" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/bounced-emails')}>
						<ListItemIcon>
							<MailOutlineIcon />
						</ListItemIcon>
						<ListItemText primary="Bounced Emails" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/unmatched-emails')}>
						<ListItemIcon>
							<MailOutlineIcon />
						</ListItemIcon>
						<ListItemText primary="Unmatched Emails" />
					</ListItem>
					<Divider />
					<ListItem button onClick={() => push('/gift-monitoring')}>
						<ListItemIcon>
							<MailOutlineIcon />
						</ListItemIcon>
						<ListItemText primary="Gift Monitoring" />
					</ListItem>
					<Divider />
				</List>
			</Drawer>
		</div>
	)
}

export default MiniDrawer
