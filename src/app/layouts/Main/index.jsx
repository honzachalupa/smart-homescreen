import React, { Component } from 'react';
import './style';
import WallpaperDay from 'Images/mojave-day';
import WallpaperNight from 'Images/mojave-night';

export default class Layout_Main extends Component {
    render() {
        const image = Math.round(Math.random() * 10) % 2 === 0 ? WallpaperDay : WallpaperNight;

        return (
            <div style={{ backgroundImage: `url(${image})` }}>
                {this.props.children}

                <footer className="footer">
                    <a href="https://wwww.honzachalupa.cz/">&copy; 2019 Jan Chalupa</a>
                </footer>
            </div>
        );
    }
}
