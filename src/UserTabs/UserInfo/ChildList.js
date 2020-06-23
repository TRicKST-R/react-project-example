import React from 'react'
import { Tabs, Tab } from '@material-ui/core/'
import { makeStyles } from '@material-ui/styles'

const useStyles = makeStyles({
	tablist: {
		backgroundColor: '#f3f3f3'
	}
})

const ChildList = props => {
	const { childList, currentChildIndex, changeActiveChild } = props
	const classes = useStyles();
	return (
		<Tabs
			value={currentChildIndex}
			onChange={(event, value) => changeActiveChild(value)}
			indicatorColor="primary"
			variant="scrollable"
			scrollButtons="auto"
			textColor="primary"
			className={classes.tablist}
		>
			{childList &&
				childList.map((child, index) => (
					<Tab label={`${child.first_name} ${child.last_name}`} key={index} icon={child.isSelfAccountExists ? <i className="fa fa-user" aria-hidden="true" style={{fontSize: "18px"}}></i>: <i className="fa fa-child" aria-hidden="true" style={{fontSize: "18px"}}></i>}/>
				))}
		</Tabs>
	)
}

export default ChildList
