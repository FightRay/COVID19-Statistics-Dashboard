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

class Stability extends Component {
    constructor(props) {
        super(props);
        this.state = defaultState;
        this.columns = [
            {
                name: 'Country',
                sortable: true,
                cell: row => <div style={{fontWeight: 700}}>{row.rank}. {row.fullname}</div>
            },
            {
                name: 'Stability (Less is better)',
                selector: 'stability',
                sortable: true,
                cell: row => <span>{row.stability.toLocaleString()}</span>
            }
        ];

    }

    componentDidMount() {
        window.dash = this;
        getAndProcessData(2).then((data) => {
            this.setState({
                countries: data.countries,
                options: {
                    xaxis: {categories: data.newcats}
                },
                series: [
                    {
                        name: "Stability",
                        data: data.newseriesdata
                    }
                ]
            });
        });
    }

    render() {
        return (
                <div className="App-content">
                    <span className="subTitle">Top 10 Most Stable Countries</span>
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

        export default Stability;