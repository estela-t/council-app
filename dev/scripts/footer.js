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

class Footer extends React.Component {
	constructor(props){
		super(props);
	}
	scrollToTop() {
		scroll.scrollToTop();
	}

	render (){
		return(
			<footer>
				<div className="wrapper">
					<div className="footerColumn">
						<div className="makerContainer">
							<p>Designed and built by Estela T.</p>
								<span className="social">
									<a href="https://twitter.com/estelatee" target="_blank"><i className="fa fa-twitter" aria-hidden="true"></i></a>
									<a href="https://www.instagram.com/estelatee/" target="_blank"><i className="fa fa-instagram" aria-hidden="true"></i></a>
									<a href="https://www.linkedin.com/in/estela-thomson-b06704b4/" target="_blank"><i className="fa fa-linkedin" aria-hidden="true"></i></a>
								</span>
						</div>
						<p className="attribution">Councillor <i className="fa fa-camera" aria-hidden="true"></i>s courtesy of the City of Toronto. City Hall icon by Andrew Youk of Noun Project. </p>
					</div>
					<a onClick={this.scrollToTop} id="toTop">Back to top  <i className="fa fa-chevron-up" aria-hidden="true"></i></a>
				</div>
			</footer>
		)
	}
}

export default Footer;

