import React, { Component } from 'react';
import RssParser from 'rss-parser';
import './style';
import { _isInvalid } from 'Helpers/data';
import Article from './Article';
import ProgressIndicator from 'Components/ProgressIndicator';

export default class News extends Component {
    state = {
        articles: [],
        isLoading: true
    };

    async componentDidMount() {
        const { providers, numberOfArticles } = this.props.config;
        const { articles: currentArticles } = this.state;

        const corsProxy = 'https://cors-anywhere.herokuapp.com/';

        providers.forEach(async provider => {
            const feed = await new RssParser().parseURL(`${corsProxy}${provider.url}`);
            const articles = feed.items.slice(0, numberOfArticles);

            articles.map(article => this.processArticle(provider, article));

            const mergedArticles = [...currentArticles, ...articles].slice(0, numberOfArticles);

            this.setState({
                articles: mergedArticles
            });
        });
    }

    componentDidUpdate() {
        const { articles, isLoading } = this.state;

        if (isLoading && !_isInvalid(articles)) {
            this.setState({
                isLoading: false
            });
        }
    }

    processArticle(provider, article) {
        article.title = `${article.title.replace(/^\s*/, '')}.`;
        article.content = article.content.replace(/\s*<ul><b>Další články k tématu.*/, '').replace(/^\s*/, '');
        article.source = provider.name;

        return article;
    }

    render() {
        const { articles, isLoading } = this.state;

        return isLoading ? (
            <ProgressIndicator />
        ) : (
            <div>
                {
                    articles.map(article => <Article key={article.title} {...article} />)
                }
            </div>
        );
    }
}
