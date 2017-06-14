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
				<div className="formRow">
					<div className="dateContainer inputContainer">
						<label htmlFor="date">Meeting Date</label>
						<input type="date" name ="date" required value={this.state.comments.date} onChange={this.handleChange}/>
					</div>

					<div className="inputContainer">
						<label htmlFor="issue">Issue Area</label>
						<select type="select" name ="issue" value={this.state.comments.issue} onChange={this.handleChange}>
							<option value="default" defaultValue>Choose one</option>
							<option value="Arts & Culture">Arts & Culture</option>
							<option value="Education">Education</option>
							<option value="Environment & Energy">Environment & Energy</option>
							<option value="Health">Health</option>
							<option value="Immigration">Immigration</option>
							<option value="Parks & Forestry">Parks & Forestry</option>
							<option value="Transit">Transit</option>
							<option value="Other">Other</option>
						</select>
					</div>
				</div>

				<div className="formRow">
					<div className="inputContainer">
						<label htmlFor="name">Name</label>
						<input type="text" name ="name" placeholder="Your name" value={this.state.comments.name} onChange={this.handleChange}/>
					</div>

					<div className="inputContainer">
						<label htmlFor="group">Group</label>
						<input type="text" name ="group" required value={this.state.comments.group} placeholder="What group do you represent?" onChange={this.handleChange}/>
					</div>
				</div>

				<div className="notesContainer">
					<label htmlFor="notes">Meeting Notes</label>
					<textarea rows="12" name ="notes" required value={this.state.comments.notes} placeholder="Add details and notes from your meeting here" onChange={this.handleChange}/>
				</div>
				<div className="submitContainer">
					<input type="submit" value="Submit"/>
				</div>
			</form>
		)
	}
	}


// maxlength="50"

export default Form;