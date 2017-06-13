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

class CouncilList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			councillors: [],
			key: ""
		};
	}
	componentDidMount() {
		// fetch councillor objects from Firebase with their unique IDs
		dbRef.on("value", (snapshot) => {
			const dbCouncil = snapshot.val();
			// console.log(dbCouncil);
			let councilArray = [];
			// for in over full list to return individual councillor IDs
			for (let key in dbCouncil) {
				councilArray.push(dbCouncil[key]);
			}
			this.setState({
				councillors: councilArray
			});
			// console.log(this.state);
		});
	}

	scrollToTop() {
		scroll.scrollToTop();
	}

	render(){

		let list = this.state.councillors.map((singleCouncil, index) => {
			// console.log(singleCouncil.District_ID);
			return (
				<Link to={`/councillor/${singleCouncil.District_ID}`} key={`councillor-${index}`}>
					<button key={singleCouncil.First_name} className="councillorButton">{singleCouncil.District_ID} - {singleCouncil.First_name} {singleCouncil.Last_name}</button>
				</Link>
			)
		});
		return(
			<div>
			<header>
				<h1>City Council Meet</h1>
				<div className="navContainer">
					<button className="nav"><a href="#main">Find Your Councillor</a></button>
					<button className="nav"><a href="http://app.toronto.ca/tmmis/meetingCalendarView.do?function=meetingCalendarView" target="_blank">Upcoming Council Meetings</a></button>
				</div>
			</header>
			<main id="main">
				<div className="wrapper">
					<h2>Toronto Wards</h2>
					<div className="mapContainer">
						<img src="/public/assets/ward-map.svg" className="map" alt="map of toronto wards"/>
					</div>
					<h2>Select your councillor</h2>
					{ list }
				</div>
			</main>
			<footer><p>Councillor information and <i class="fa fa-camera" aria-hidden="true"></i> courtesy of City of Toronto.</p>
			<a onClick={this.scrollToTop} id="toTop">To top^</a>
			</footer>
			</div>
		)
	}
}

class CouncillorDetails extends React.Component {
	constructor(){
		super();
		this.state = {
			councillor: {},
			commentList: {}
		};
	}
	componentDidMount() {
		// grab the current list of comments from this.state.councillor.comments
		const councillorRef = firebase.database().ref(`/id_${this.props.match.params.districtid}`)
		councillorRef.on("value", (snapshot) => {
			const councillor = snapshot.val();
			const commentList = snapshot.val().comments;
			this.setState({
				councillor,
				commentList
			})
		console.log(commentList);
		});
		// console.log('params thing: ', this.props.match.params.districtid);
		const commentArray = [];
		for (let key in this.state.commentList) {
			commentArray.push(this.state.commentList[key]);
		}
		this.setState({
				commentList: commentArray
			});
		console.log(commentArray);
	}

	render() {
		const twitterButton = () => {
			if (this.state.councillor.Twitter !== "") {
			return(
				<i class="fa fa-twitter" aria-hidden="true"></i>
			)
			}
		}
		// console.log(this.state.councillor.Twitter);
		return (
			<div className="wrapper">
					<img src={this.state.councillor.Photo_URL}/>
					<div className="councillorContact">
						<h3>{this.state.councillor.First_name} {this.state.councillor.Last_name}  / {this.state.councillor.District_name}</h3>
						<p><i className="fa fa-envelope-o" aria-hidden="true"></i>{this.state.councillor.Email}</p>
						<p><i className="fa fa-phone" aria-hidden="true"></i>{this.state.councillor.Phone}</p>
						
				</div>
				{/*<div className="twitterTimeline">
					<Timeline
						dataSource = {{
							sourceType: "url",
							url: {this.state.councillor.Twitter}
						}}
				</div>*/}
				<Form comments={this.state.comments} councillor={this.state.councillor} commentList={this.state.commentList}/>
			</div>
		)
	}
}


class App extends React.Component {
	render() {
		return (
			<Router>
				<div>

					<Route exact path="/" component={CouncilList} />
					<Route path="/councillor/:districtid" component={CouncillorDetails} />
				</div>
			</Router>
		)
	}
}

ReactDOM.render(<App />, document.getElementById('app'));



