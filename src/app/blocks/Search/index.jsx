import React, { Component } from 'react';
import AnimateHeight from 'react-animate-height';
import { autobind } from 'core-decorators';
import './style';
import SearchIcon from 'Icons/search';
import GoogleIcon from 'Icons/google';
import GoogleMapsIcon from 'Icons/google-maps';
import AlzaIcon from 'Icons/alza';
import CsfdIcon from 'Icons/csfd';

export default class Search extends Component {
    state = {
        providers: [{
            name: 'Google',
            url: 'https://www.google.com/search?q=@query',
            icon: GoogleIcon
        }, {
            name: 'Mapy',
            url: 'https://www.google.com/maps/search/@query/',
            icon: GoogleMapsIcon
        }, {
            name: 'Alza',
            url: 'https://www.alza.cz/search.htm?exps=@query',
            icon: AlzaIcon
        }, {
            name: 'ČSFD',
            url: 'https://www.csfd.cz/hledat/?q=@query',
            icon: CsfdIcon
        }],
        query: ''
    };

    @autobind
    handleSearch(providerName) {
        const { providers, query } = this.state;

        const provider = providers.find(provider => provider.name === providerName);
        const url = encodeURI(provider.url.replace('@query', query));

        window.open(url);
    }

    render() {
        const { providers, query } = this.state;

        return (
            <div>
                <div className="search-box">
                    <img className="icon" src={SearchIcon} alt="" />
                    <input className="query" type="search" placeholder="Co si přejete hledat?" onChange={e => this.setState({ query: e.target.value })} />
                </div>

                <AnimateHeight duration={300} height={query ? 'auto' : 0} animateOpacity>
                    <div className="providers">
                        {
                            providers.map(provider => (
                                <button key={provider.name} className="provider" type="button" onClick={() => this.handleSearch(provider.name)}>
                                    <img className="icon" src={provider.icon} alt="" />
                                    <p className="label">{provider.name}</p>
                                </button>
                            ))
                        }
                    </div>
                </AnimateHeight>
            </div>
        );
    }
}
