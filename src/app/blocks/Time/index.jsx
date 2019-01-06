import React, { Component } from 'react';
import moment from 'moment';
import './style';

export default class Time extends Component {
    state = {
        time: null,
        date: null
    };

    componentDidMount() {
        this.getCurrentDateTime();

        setInterval(() => {
            this.getCurrentDateTime();
        }, 10000);
    }

    getCurrentDateTime() {
        moment.locale('cs');

        const time = moment().format('H:mm');
        const date = moment().format('dddd Do MMMM');

        this.setState({
            time,
            date
        });
    }

    render() {
        const { time, date } = this.state;

        return (
            <div>
                <p className="time">
                    {time}
                </p>

                <p className="date">
                    {date}
                </p>
            </div>
        );
    }
}
