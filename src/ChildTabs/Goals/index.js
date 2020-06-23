import React, { useState, useEffect } from 'react'
import { List, ListItem, ListItemText, IconButton, Divider } from '@material-ui/core'
import More from '@material-ui/icons/Info'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { push } from 'react-router-redux'
import { makeStyles } from '@material-ui/styles'

import Info from './Info'
import TransfersN from './Transfers'
import getChunk from '../../utils/GetChunk'
import { GET_INSTRUCTION } from '../../root/Graphql'
import Progress from '../../components/Progress'
import GoalDetail from './Detail'
import { addSnack } from '../../modules/Snack/Snack.state'
import { addSuccess } from '../../modules/Success/Success.state'

const useStyles = makeStyles({
	item: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		width: 160,
		'& > div': {
			maxWidth: 112,
			minHeight: 48
		},
		'& > .Mui-selected': {
			backgroundColor: 'rgba(0, 0, 0, 0.054)'
		}
	},
	list: {
		padding: 0,
		minWidth: 160,
		borderRight: '1px solid rgba(0, 0, 0, 0.12)',
		position: 'relative',
		top: -1
	},
	container: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'flex-start',
		paddingRight: 16
	},
	infoContainer: {
		flexGrow: 1,
		maxWidth: 960,
		paddingTop: 16
	}
})

const Goal = props => {
	const { userName, push, goals, addSnack, uName } = props

	const [instructionFetched, setInstructionFetched] = useState(false)
	const [instruction, setInstruction] = useState(null)
	const [activeGoal, setActiveGoal] = useState(0)
	const [goalShowing, setGoalShowing] = useState(1)
	const classes = useStyles()

	let instructionGoals = []
	let TransfersProps = null

	const getInstruction = () => {
		const variables = { user_name: userName }
		const abortController = new AbortController()
		getChunk(GET_INSTRUCTION, variables).then(({ detail }) => {
			if (detail && detail.instruction) {
				setInstruction(detail.instruction)
				setInstructionFetched(true)
				// console.log(detail)
			} else {
				setInstructionFetched(true)
				addSnack('GraphQL bad response instruction')
			}
		})
		return () => {
			abortController.abort()
		}
	}

	useEffect(() => {
		getInstruction()

		return () => {}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [props])

	const infoProps = {
		userId: props.userId,
		info: goals[activeGoal],
		recallGoalsApi: getInstruction,
		addSnack: addSnack,
		push
	}

	const goalDetailProps = {
		goalId: (goals && goals[activeGoal] && goals[activeGoal].goal_id) || [],
		userName: props.userName
	}

	if (instructionFetched && instruction && goals[activeGoal]) {
		instruction.sprout.map(sprout => sprout.goal.map(goal => instructionGoals.push(goal)))
		TransfersProps = {
			transfers:
				instructionGoals.find(goal => goal.goal_id === goals[activeGoal].goal_id) &&
				instructionGoals.find(goal => goal.goal_id === goals[activeGoal].goal_id).transfers,
			withdrawals:
				instructionGoals.find(goal => goal.goal_id === goals[activeGoal].goal_id) &&
				instructionGoals.find(goal => goal.goal_id === goals[activeGoal].goal_id).withdrawals,
			instructionGoals,
			infoProps,
			userName: uName,
			email: userName,
			addSnack: addSnack,
			addSuccess: props.addSuccess
		}
	}
	return (
		<div className={classes.container}>
			<List component="nav" className={classes.list}>
				<Divider />
				{goals &&
					goals.map((goal, index) => [
						<div key={index} className={classes.item}>
							<ListItem
								button
								selected={activeGoal === index}
								onClick={() => {
									setActiveGoal(index)
									setGoalShowing(1)
								}}
							>
								<ListItemText primary={goal.name} />
							</ListItem>
							<IconButton
								color="primary"
								onClick={() => {
									setActiveGoal(index)
									setGoalShowing(0)
								}}
							>
								<More />
							</IconButton>
						</div>,
						<Divider key={`divider${index}`} />
					])}
			</List>
			{goals && goals[activeGoal] && (
				<div className={classes.infoContainer}>
					{goalShowing ? (
						<>
							{infoProps && <Info {...infoProps} />}
							{TransfersProps && TransfersProps.transfers && instructionFetched ? (
								<TransfersN {...TransfersProps} />
							) : (
								<Progress />
							)}
							{/*transfers ? <Transfers transfers={transfers} /> : <Progress />*/}
							{/*withdrawals ? <Withdrawals withdrawals={withdrawals} /> : <Progress />*/}
						</>
					) : (
						<GoalDetail {...goalDetailProps} />
					)}
				</div>
			)}
		</div>
	)
}

export default connect(
	null,
	dispatch => ({
		push: bindActionCreators(push, dispatch),
		addSnack: bindActionCreators(addSnack, dispatch),
		addSuccess: bindActionCreators(addSuccess, dispatch)
	})
)(Goal)
