import React from 'react';

let { PropTypes, Component } = React;

class Progress extends Component {
    constructor (props) {
        super(props);
        this.percentage = 100;
    }
    handleSeekTrack(e) {
        let { onSeekTrack, soundCloudAudio } = this.props;
        const xPos = (e.pageX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.offsetWidth;
        
        let value = Math.round(xPos * this.props.max);
        onSeekTrack && onSeekTrack.call(this, value, e);
    }

    render() {
        let { value, min, max } = this.props;

        if (value < min ) {
            value = min;
        }

        if (value > max) {
            value = max;
        }
        this.percentage = (value*100) / max;
        let style = {width: `${this.percentage}%`};
        let classNames = 'progress-container';
        let innerClassNames = "progress-inner"

        return (
            <div className={classNames} onClick={this.handleSeekTrack.bind(this)}>
                <div className={innerClassNames} style={style} />
            </div>
        );
    }
}


Progress.defaultProps = {
    value: 0,
    min:0,
    max: 100
};

export default Progress;