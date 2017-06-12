import React from 'react';
import ReactDOM from 'react-dom';
import firebase, {auth, database, provider, dbRef} from "./firebase.js";
import { 
	BrowserRouter as Router,
	NavLink as Link,
	Route
} from 'react-router-dom';

class Form extends React.Component {
	constructor() {
		super();
		this.state ={
			comments: {
				date: "",
				issue: "",
				name: "",
				group: "",
				notes: ""
			}
		};
		this.handleChange = this.handleChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	handleChange(e) {
		// setState triggers a re-render.
		console.log(e.target.value);
		const comments = Object.assign({}, this.state.comments);
		comments[e.target.name] = e.target.value;
		this.setState({comments});
	}
	handleSubmit(e) {
		e.preventDefault();
		const commentsRef = firebase.database().ref(`id_${this.props.councillor.District_ID}/comments`);
		commentsRef.push(this.state.comments);
		commentsRef.on("value", (snapshot) => {
			console.log("hello i'm working: ", snapshot.val());
		});
			this.setState({
				comments: {
					date: "",
					issue: "",
					name: "",
					group: "",
					notes: ""
				}
			});
	}
	render() {
		return (
			<form onSubmit={this.handleSubmit} className="meetingForm">

				<label htmlFor="date">Meeting Date</label>
				<input type="text" name ="date" value={this.state.comments.date} onChange={this.handleChange}/>

				<label htmlFor="issue">Issue Area</label>
				<select type="select" name ="issue" value={this.state.comments.issue} onChange={this.handleChange}>
					<option value="issue1" defaultValue>Arts & Culture</option>
					<option value="issue2">Education</option>
					<option value="issue3">Environment & Energy</option> 
					<option value="issue4">Health</option>
					<option value="issue5">Parks & Forestry</option>
					<option value="issue6">Transit</option>
					<option value="issue7">Other</option>
				</select>

				<label htmlFor="name"></label>
				<input type="text" name ="name" placeholder="Your name" value={this.state.comments.name} onChange={this.handleChange}/>

				<label htmlFor="group"></label>
				<input type="text" name ="group" value={this.state.comments.group} placeholder="What group do you represent?" onChange={this.handleChange}/>

				<label htmlFor="notes"></label>
				<textarea name ="notes" value={this.state.comments.notes} placeholder="Meeting details/notes" onChange={this.handleChange}/>

				<input type="submit" value="Submit meeting"/>
			</form>
		)
	}

	}


// maxlength="50"

export default Form;