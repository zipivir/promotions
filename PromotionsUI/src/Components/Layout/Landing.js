import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Footer from './Footer';

class Landing extends Component {
    render() {
        return (
            <div className="landing">
                <div className="dark-overlay landing-inner text-light">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h1 className="display-3 mb-4">MoonActive Test</h1>
                                <p className="lead"> Loading Promotions</p>
                                <hr />
                                <Link to="/promotions" className="btn btn-lg btn-light">Promotions</Link>
                            </div>
                        </div>
                    </div>
                    <Footer />
                </div>
            </div>
        );
    }
}

export default Landing;
