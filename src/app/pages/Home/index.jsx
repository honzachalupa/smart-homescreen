import React, { Component } from 'react';
import Layout_Main from 'Layouts/Main';
import Container from './../../containers/Main';
import TimeComponent from 'Blocks/Time';
import SearchComponent from 'Blocks/Search';
import WeatherComponent from 'Blocks/Weather';
import WeatherIcon from 'Icons/weather';
import InstagramComponent from 'Blocks/Instagram';
import InstagramIcon from 'Icons/instagram';
import NewsComponent from 'Blocks/News';
import NewsIcon from 'Icons/news';

export default class Page_Home extends Component {
    constructor() {
        super();

        this.state = {
            configs: {
                news_ctk: {
                    providers: [{
                        name: 'ČTK',
                        url: 'https://www.ceskenoviny.cz/sluzby/rss/zpravy.php'
                    }],
                    numberOfArticles: 4
                },
                news_idnes: {
                    providers: [{
                        name: 'Idnes',
                        url: 'http://servis.idnes.cz/rss.aspx?c=zpravodaj'
                    }],
                    numberOfArticles: 4
                },
                news_refresher: {
                    providers: [{
                        name: 'Refresher',
                        url: 'https://refresher.cz/rss'
                    }],
                    numberOfArticles: 4
                },
                instagram: {
                    username: 'honzachalupa_photography'
                },
                instagram_Kathy: {
                    username: 'kathy_binder'
                }
            }
        };
    }

    render() {
        const { news_ctk, news_idnes, news_refresher, instagram, instagram_Kathy } = this.state.configs;

        return (
            <section>
                <Layout_Main page={this.state.page}>
                    <TimeComponent />
                    <SearchComponent />

                    <Container header="Počasí" icon={WeatherIcon} className="narrow">
                        <WeatherComponent />
                    </Container>

                    <div className="grid">
                        <Container header="ČTK" icon={NewsIcon}>
                            <NewsComponent config={news_ctk} />
                        </Container>

                        <Container header="Idnes" icon={NewsIcon}>
                            <NewsComponent config={news_idnes} />
                        </Container>

                        <Container header="Refresher" icon={NewsIcon} style={{ flexGrow: 1 }}>
                            <NewsComponent config={news_refresher} />
                        </Container>
                    </div>

                    <Container header="Instagram" icon={InstagramIcon} className="narrow">
                        <InstagramComponent config={instagram} />
                    </Container>

                    <Container header={`Instagram (${instagram_Kathy.username})`} icon={InstagramIcon} className="narrow">
                        <InstagramComponent config={instagram_Kathy} />
                    </Container>
                </Layout_Main>
            </section>
        );
    }
}
