import React, { Component } from 'react';
import { autobind } from 'core-decorators';
import './style';
import { _onWindowResize } from 'Helpers/browser';

export default class AspectRatio extends Component {
    state = {
        height: 0
    };

    componentDidMount() {
        _onWindowResize(this.handleResize).mount();
    }

    componentWillUnmount() {
        _onWindowResize(this.handleResize).unmount();
    }

    @autobind
    handleResize() {
        const { ratio } = this.props;
        const ratioX = Number(ratio.split(':')[0]);
        const ratioY = Number(ratio.split(':')[1]);
        const height = Math.round((this.container.offsetWidth * ratioY) / ratioX);

        this.setState({
            height
        });
    }

    render() {
        const { children, className } = this.props;
        const { height } = this.state;

        return (
            <div className={className} style={{ height }} ref={element => this.container = element}>
                {children}
            </div>
        );
    }
}
