import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Protected from './Protected'
import LazyLoad from '../utils/LazyLoad'

const Home = LazyLoad(() => import('../pages/Home'))
const User = LazyLoad(() => import('../pages/User'))
const Events = LazyLoad(() => import('../pages/Events'))
const Operations = LazyLoad(() => import('../pages/Operations'))
const Management = LazyLoad(() => import('../pages/Management'))
const AdvisorBalance = LazyLoad(() => import('../pages/AdvisorBalance'))
const Rejected = LazyLoad(() => import('../pages/Rejected'))
const Indeterminate = LazyLoad(() => import('../pages/Indeterminate'))
const Reports = LazyLoad(() => import('../pages/Reports'))
const BouncedEmails = LazyLoad(() => import('../pages/BouncedEmails'))
const NotFound = LazyLoad(() => import('../pages/NotFound'))
const UnmatchedEmails = LazyLoad(() => import('../pages/UnmatchedEmails'))
const GiftCard = LazyLoad(() => import('../pages/GiftCard'))
const GiftMonitoring = LazyLoad(() => import('../pages/GiftMonitoring'))

const Routes = () => (
	<Switch>
		<Protected exact path="/" component={Home} />
		<Protected exact path="/user/:name" component={User} />
		<Protected exact path="/rejected-accounts" component={Rejected} />
		<Protected exact path="/indeterminate-accounts" component={Indeterminate} />
		<Protected exact path="/events" component={Events} />
		<Protected exact path="/operations" component={Operations} />
		<Protected exact path="/advisor-balance" component={AdvisorBalance} />
		<Protected exact path="/management" component={Management} />
		<Protected exact path="/reports" component={Reports} />
		<Protected exact path="/bounced-emails" component={BouncedEmails} />
		<Protected exact path="/unmatched-emails" component={UnmatchedEmails} />
		<Protected exact path="/gift-card" component={GiftCard} />
		<Protected exact path="/gift-monitoring" component={GiftMonitoring} />
		<Route path="*" component={NotFound} />
	</Switch>
)

export default Routes
