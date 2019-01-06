import React, { Component } from 'react';
import './style';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import { _isInvalid } from 'Helpers/data';
import ProgressIndicator from 'Components/ProgressIndicator';

export default class Weather extends Component {
    state = {
        forecast: {
            current: {},
            byHours: []
        },
        chartData: {},
        chartOptions: {
            legend: {
                display: false
            },
            elements: {
                point: {
                    radius: 0
                }
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        callback: temperature => `${temperature} °C`
                    }
                }]
            },
            maintainAspectRatio: false
        },
        isLoading: true
    };

    componentDidMount() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(e => this.getForecast(e.coords.latitude, e.coords.longitude));
        } else {
            console.log('Geolocation is not supported by this browser.');
        }
    }

    componentDidUpdate() {
        const { chartData, isLoading } = this.state;

        if (isLoading && !_isInvalid(chartData)) {
            this.setState({
                isLoading: false
            });
        }
    }

    async getForecast(latitude, longitude) {
        const token = 'da796da89e88fc8449949d64a0be3a54';
        const corsProxy = 'https://cors-anywhere.herokuapp.com/';
        const url = `${corsProxy}https://api.darksky.net/forecast/${token}/${latitude},${longitude}`;

        axios(url).then(({ data }) => {
            const { currently: currentyForecast, hourly } = data;

            const current = this.processForecast(currentyForecast);
            const byHours = hourly.data.slice(0, 6);

            byHours.map(hourForecast => this.processForecast(hourForecast));

            this.setState({
                forecast: {
                    current
                },
                chartData: this.getChartData(byHours)
            });
        });
    }

    processForecast(forecast) {
        forecast.temperature = this.fahrenheitToCelsius(forecast.temperature);
        forecast.apparentTemperature = this.fahrenheitToCelsius(forecast.apparentTemperature);
        forecast.precipIntensity *= 100;
        forecast.precipProbability *= 100;

        return forecast;
    }

    getChartData(forecasts) {
        const data = {
            labels: [],
            datasets: [{
                label: 'Teplota',
                data: [],
                backgroundColor: 'transparent',
                borderColor: 'black'
            }, {
                label: 'Teplota (pocitová)',
                data: [],
                backgroundColor: 'transparent',
                borderColor: 'black'
            }, {
                label: 'Srážky',
                data: [],
                backgroundColor: 'transparent',
                borderColor: 'blue'
            }]
        };

        forecasts.forEach((forecast, i) => {
            const { temperature, apparentTemperature, precipIntensity, precipProbability } = forecast;

            data.labels.push(`+${i + 1}h`);
            data.datasets[0].data.push(temperature);
            data.datasets[1].data.push(apparentTemperature);
            data.datasets[2].data.push((precipIntensity + precipProbability) / 20);
        });

        return data;
    }

    fahrenheitToCelsius(fahrenheits) {
        return Math.round((fahrenheits - 32) / 1.8);
    }

    render() {
        const { forecast, chartData, chartOptions, isLoading } = this.state;
        const { current } = forecast;

        return isLoading ? (
            <ProgressIndicator />
        ) : (
            <div>
                <div className="current">
                    <p className="temperature">{current.apparentTemperature} °C</p>
                    <p className="label">Nyní</p>
                </div>

                <div className="chart">
                    <div className="legend">
                        <p>Teplotní rozsah</p>
                        <p style={{ color: 'blue' }}>Srážky</p>
                    </div>
                    <Line data={chartData} options={chartOptions} />
                </div>
            </div>
        );
    }
}
