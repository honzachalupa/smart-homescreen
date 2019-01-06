import React, { Component } from 'react';
import './style';
import LoadingCircleImage from 'Icons/loading-circle';

export default class ProgressIndicator extends Component {
    render() {
        return (
            <div>
                <img className="icon" src={LoadingCircleImage} alt="" />
            </div>
        );
    }
}
