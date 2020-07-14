/* 
 * @author Oshri (Ray) Bouhin
 * All that is written in this file is a property
 * of the ReyNetwork organization and the author of this file.
 * Please abide the rules and standards of this project's repository.
 */

import React, { Component } from "react";
import Chart from "react-apexcharts";
import DataTable from 'react-data-table-component';
import {SubTable, getAndProcessData, defaultState} from '../globals.js';

class Cases extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
        this.columns = [
            {
                name: 'Country',
                sortable: true,
                cell: row => <div style={{fontWeight: 700}}>{row.rank}. {row.name}</div>
            },
            {
                name: 'Cases',
                selector: 'totalcases',
                sortable: true,
                cell: row => <span>{row.totalcases.toLocaleString()}</span>
            }
        ];

    }

    componentDidMount() {
        getAndProcessData(0).then((data) => {
            this.setState({
                countries: data.countries,
                options: {
                    xaxis: {categories: data.newcats}
                },
                series: [
                    {
                        name: "Cases",
                        data: data.newseriesdata
                    }
                ]
            });
        });
    }

    render() {
        return (
                <div className="App-content">
                    <span className="subTitle">Top 10 Countries with the Highest Total Cases</span>
                    <div className="row">
                        <div className="chartBox">
                
                            <Chart
                                options={this.state.options}
                                series={this.state.series}
                                type="bar"
                                height="100%"
                                width="100%"
                                />
                        </div>
                        <DataTable
                            columns={this.columns}
                            data={this.state.countries}
                            expandableRows
                            expandableRowsComponent={ < SubTable / > }
                            theme="dark"
                            pagination={false}
                            />
                    </div>
                </div>
                        );
            }
        }

        export default Cases;