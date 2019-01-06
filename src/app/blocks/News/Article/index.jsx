import React, { Component } from 'react';
import moment from 'moment';

export default class NewsArticle extends Component {
    render() {
        const { title, pubDate, link } = this.props;

        return (
            <div>
                <p className="time">{moment(pubDate).format('H:mm')}</p>
                <a className="title" href={link}>{title}</a>
            </div>
        );
    }
}
