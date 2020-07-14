/* 
 * @author Oshri (Ray) Bouhin
 * All that is written in this file is a property
 * of the ReyNetwork organization and the author of this file.
 * Please abide the rules and standards of this project's repository.
 */

import React, { Component } from "react";
import {
BrowserRouter as Router,
        Switch,
        Route,
        Link
} from "react-router-dom";
import logo from './img/logo.svg';
import Component_Cases from "./components/cases.js";
import Component_Increase from "./components/increase.js";
import Component_Stability from "./components/stability.js";
import './css/main.css';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                chart: {
                    id: "basic-bar"
                },
                xaxis: {
                    categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
                }
            },
            series: [
                {
                    name: "series-1",
                    data: [30, 40, 45, 50, 49, 60, 70, 91]
                }
            ]
        };
    }

    render() {
        return (
                <div className="App">
                    <div className="App-header">
                        <img src={logo} className="App-logo" alt="logo" />
                        <span className="App-logo-text">COVID19 Country Statistics</span>
                    </div>
                    <Router>
                        <div className="App-nav">
                            <Link to="/">
                                <div className="nav-item">
                                    <span className="sbutton">Top 10 Countries with the Highest Total Cases</span>
                                </div>
                            </Link>
                            <Link to="/increase">
                                <div className="nav-item">
                                    <span className="sbutton">Top 10 Countries with the Highest Increase Rate</span>
                                </div>
                            </Link>
                            <Link to="/stability">
                                <div className="nav-item">
                                    <span className="sbutton">Top 10 Most Stable Countries</span>
                                </div>
                            </Link>
                        </div>
                
                        <Switch>
                        <Route path="/stability">
                            <Component_Stability/>
                        </Route>
                        <Route path="/increase">
                            <Component_Increase/>
                        </Route>
                        <Route path="/">
                            <Component_Cases/>
                        </Route>
                        </Switch>
                    </Router>
                </div>
                );
    }
}

export default App;
