import React, { Component } from 'react';
import './style';

export default class MainContainer extends Component {
    render() {
        const { header, children, icon, className, style } = this.props;

        return (
            <div className={className} style={style}>
                <div className="border">
                    <header className="header">
                        {icon && (
                            <img className="icon" src={icon} alt="" />
                        )}

                        <p className="label">{header}</p>
                    </header>

                    <div className="content">{children}</div>
                </div>
            </div>
        );
    }
}
