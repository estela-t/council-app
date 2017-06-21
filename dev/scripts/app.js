import React from 'react';
import ReactDOM from 'react-dom';
import firebase, {auth, database, provider, dbRef} from "./firebase.js";
import { 
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';
import { Timeline } from 'react-twitter-widgets';
import {animateScroll as scroll} from 'react-scroll';
import Form from './form.js';
import Footer from './footer.js';

var Scroll = require('react-scroll');
var Element = Scroll.Element;
var scroller = Scroll.scroller;

class CouncilList extends React.Component {
	constructor() {
		super();
		this.state = {
			councillors: [],
			key: ""
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// fetch councillor objects from Firebase with their unique IDs
		dbRef.on("value", (snapshot) => {
			const dbCouncil = snapshot.val();
			let councilArray = [];
			// for in over full list to return individual councillor IDs
			for (let key in dbCouncil) {
				councilArray.push(dbCouncil[key]);
			}
			let sortedCouncil = councilArray.sort((a,b) => {
				return a.District_ID - b.District_ID;
			})
			this.setState({
				councillors: sortedCouncil
			});
		});
	}
	scrollToElement() {
		scroller.scrollTo('scrollElement', {
			duration: 1500,
			delay: 100,
			smooth: true,
			containerId: 'scrollContainer'
		});
	}

	render(){
		let list = this.state.councillors.map((singleCouncil, index) => {
			return (
				<Link to={`/councillor/${singleCouncil.District_ID}`} key={`councillor-${index}`}>
					<button key={singleCouncil.First_name} className="councillorButton"><span>{singleCouncil.District_ID}</span> - {singleCouncil.First_name} {singleCouncil.Last_name}</button>
				</Link>
			)
		});
		return(
			<div>
			<header>
				<img src="public/assets/city-hall.svg" alt=""/>
					<h1>City Council Meet</h1>
					<div className="navContainer">
						<button className="nav"><a href="#main" onClick={this.scrollToElement} >I'm meeting with a councillor</a></button>
					</div>
			</header>
			<Element name="scrollElement" id="scrollContainer">
			<main id="main" >
				<div className="wrapper">
					<p className="intro firstLine">City Council Meet keeps track of meetings between city councillors and their constituents on issues that matter to them.</p> <p className="intro">Is an organization that you belong to planning to meet with a councillor regarding public transit? Housing shortages? Urban sustainability? Go into your meeting with a strategy. Click on the councillor's name below to view any meetings they have had with other groups about the topic you will be meeting about. You will also have the option to fill out a form with the details of your own meeting, for other groups to access in the future. </p>
					<h2>Toronto Wards</h2>
					<p className="mapSubtitle">Unsure what the ward boundaries are? Check <a href="http://www1.toronto.ca/City%20Of%20Toronto/Toronto%20Building/Shared%20Content/Images/Ward%20Images/torontoWard_1540x1140.jpg" target="_blank">here</a>.</p>
					<div className="mapContainer">
						<img src="/public/assets/ward-map.svg" className="map" alt="map of toronto wards"/>
					</div>
					<h2>Select your councillor</h2>
					<div className="buttonsContainer">
					{ list }
					</div>
				</div>
			</main>
			</Element>
			<Footer />
			</div>
		)
	}
}

class CouncillorDetails extends React.Component {
	constructor(){
		super();
		this.state = {
			councillor: {},
			commentList: []
		};
	}
	componentDidMount() {
		window.scrollTo(0, 0);
		// grab the current list of comments from this.state.councillor.comments
		const councillorRef = firebase.database().ref(`/id_${this.props.match.params.districtid}`)
		councillorRef.on("value", (snapshot) => {
			const councillor = snapshot.val();
			const commentList = snapshot.val().comments;

			const commentArray = [];
			for (let key in commentList) {
				commentArray.push(commentList[key]);
			}
			this.setState({
				councillor,
				commentList: commentArray
			});
		});
	}
	render() {
		const twitterButton = () => {
			if (this.state.councillor.Twitter !== "") {
				return(
					<a href={this.state.councillor.Twitter} target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></a>
				)
			}
		}
		const websiteButton = () => {
			if (this.state.councillor.Website !== "") {
				return(
					<a href={this.state.councillor.Website} target="_blank"><i className="fa fa-mouse-pointer" aria-hidden="true"></i></a>
				)
			}
		}
		return (
			<div>
			<section className="councillorSection">
				<div className="wrapper councillorDetails">
					<img src={this.state.councillor.Photo_URL}/>
					<div className="councillorContact">
						<h3>{this.state.councillor.First_name} {this.state.councillor.Last_name}  / {this.state.councillor.District_name}</h3>
						<p><i className="fa fa-envelope-o" aria-hidden="true"></i>{this.state.councillor.Email}</p>
						<p><i className="fa fa-phone" aria-hidden="true"></i>{this.state.councillor.Phone}</p>
						{websiteButton()} {twitterButton()}
					</div>
				</div>
				<Form comments={this.state.comments} councillor={this.state.councillor} commentList={this.state.commentList}/>
				</section>
				<div className="recentMeetings">
					<h3>Recent Meetings</h3>
					<ul className="commentList">
					{this.state.commentList.map((comment) => {
						return (
							<li>
								<i className="fa fa-handshake-o" aria-hidden="true"></i><span className="issueArea">{comment.issue}</span> 
								<p>Met on: {comment.date} with <span className="postingGroup">{comment.group}</span></p>  
								<p>{comment.notes}</p>
							</li>
						)
					})}
					</ul>
				</div>
				<Footer />
			</div>
		)
	}
}

class App extends React.Component {
	render() {
		return (
			<Router onUpdate={() => window.scrollTo(0, 0)}>
				<div>
					<Route exact path="/" component={CouncilList} />
					<Route path="/councillor/:districtid" component={CouncillorDetails} />
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));



