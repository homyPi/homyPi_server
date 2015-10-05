import React from "react";
import {Paper} from "material-ui";
import MusicSearch from './SearchMusic.jsx';

class Music extends React.Component {
    constructor (props) {
        super(props);
        console.log("music props = ", props);
    }

	render() {
		let search = "";
		
		return (
			<Paper id="music" className="container">	
	          {
	            this.props.children || ""
	          }
			</Paper>
		); 
	}
};
Music.defaultProps = {};
export default Music;