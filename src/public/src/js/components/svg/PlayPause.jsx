import React from 'react';

class PlayPause extends Component {

    render() {
    	let style = {
    		cursor: "pointer",
			position: "absolute",
			top: "50%",
			left: "50%",
			width: this.props.height,
			height: this.props.height,
			transform: "translate(-50%, -50%)"
		};
        return (
            <div>
            <svg className="play-pause-svg" style={style} width="100px" height="100px" viewBox={this.props.viewBox}></svg>
            </div>
        );
    }
}


PlayPause.defaultProps = {
	status: "PLAY",
	height: "100px",
	width: "100px",
	viewBox : "0 0 100 100"
};

export default PlayPause;