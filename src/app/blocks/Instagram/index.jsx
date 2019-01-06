import React, { Component } from 'react';
import axios from 'axios';
import './style';
import HeartIcon from 'Icons/heart';
import { _isInvalid } from 'Helpers/data';
import AspectRatio from 'Components/AspectRatio';
import ProgressIndicator from 'Components/ProgressIndicator';

export default class Instagram extends Component {
    state = {
        followersCount: 0,
        latestsPosts: [],
        refreshSeconds: 60,
        isLoading: true
    };

    componentDidMount() {
        const { refreshSeconds } = this.state;

        this.getInstagramData();

        setInterval(() => {
            this.getInstagramData();
        }, refreshSeconds * 1000);
    }

    componentDidUpdate() {
        const { latestsPosts, isLoading } = this.state;

        if (isLoading && !_isInvalid(latestsPosts)) {
            this.setState({
                isLoading: false
            });
        }
    }

    getInstagramData() {
        const { username } = this.props.config;

        axios(`https://www.instagram.com/${username}/`).then(({ data }) => {
            const sharedData = JSON.parse(data.match(/<script type="text\/javascript">window\._sharedData = (.*)<\/script>/)[1].slice(0, -1));
            const userData = sharedData.entry_data.ProfilePage[0].graphql.user;
            const followersCount = userData.edge_followed_by.count;
            const latestsPosts = userData.edge_owner_to_timeline_media.edges.slice(0, 5).map(({ node: post }) => ({
                id: post.id,
                preview: post.thumbnail_src,
                description: post.edge_media_to_caption.edges[0].node.text,
                likesCount: post.edge_liked_by.count,
                url: `https://www.instagram.com/p/${post.shortcode}/`
            }));

            this.setState({
                followersCount,
                latestsPosts
            });
        });
    }

    render() {
        const { followersCount, latestsPosts, isLoading } = this.state;

        return isLoading ? (
            <ProgressIndicator />
        ) : (
            <div>
                <div className="followers-count">
                    <p className="value">{followersCount}</p>
                    <p className="label">followerů</p>
                </div>

                <div className="posts">
                    {
                        latestsPosts.map(post => (
                            <AspectRatio key={post.id} ratio="1:1" className="post-container">
                                <a className="post" href={post.url}>
                                    <img className="preview" src={post.preview} alt="" />

                                    <div className="likes-count">
                                        <img className="icon" src={HeartIcon} alt="" />
                                        <p className="value">{post.likesCount}</p>
                                    </div>
                                </a>
                            </AspectRatio>
                        ))
                    }
                </div>
            </div>
        );
    }
}
