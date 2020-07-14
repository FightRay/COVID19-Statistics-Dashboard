/* 
 * @author Oshri (Ray) Bouhin
 * All that is written in this file is a property
 * of the ReyNetwork organization and the author of this file.
 * Please abide the rules and standards of this project's repository.
 */

import React from "react";
import DataTable from 'react-data-table-component';

export const defaultState = {
    options: {
        legend: {
            show: true
        },
        chart: {
            id: "basic-bar"
        },
        theme: {
            mode: 'dark'
        },
        xaxis: {
            categories: []
        },
        stroke: {
            curve: 'smooth'
        },
        fill: {
            colors: ['#4ECDC4', '#E91E63']
        },
        colors: ['#4ECDC4', '#E91E63']
    },
    series: [
        {
            name: "Cases",
            data: [30, 40, 45, 50, 49, 60, 70, 91, 11, 20]
        }
    ],
    dataLabels: {
        style: {
            colors: ['#C7F464', '#E91E63']
        }
    }
};

export const sub_columns = [
    {
        name: 'Date',
        sortable: true,
        cell: row => <div style={{fontWeight: 700}}>{ new Date(row.date).toDateString().substring(4) }</div>
    },
    {
        name: 'Confirmed Cases',
        selector: 'confirmed_cases',
        sortable: true,
        cell: row => <span>{parseInt(row.confirmed_cases).toLocaleString()}</span>
    },
    {
        name: 'New Cases',
        selector: 'daily_confirmed_cases',
        sortable: true,
        cell: row => <span>{parseInt(row.daily_confirmed_cases).toLocaleString()}</span>
    },
    {
        name: 'Total Deaths',
        selector: 'deaths',
        sortable: true,
        cell: row => <span>{parseInt(row.deaths).toLocaleString()}</span>
    },
    {
        name: 'New Deaths',
        selector: 'daily_deaths',
        sortable: true,
        cell: row => <span>{parseInt(row.daily_deaths).toLocaleString()}</span>
    }
];

export const SubTable = ({ data }) => <DataTable
    columns={sub_columns}
    data={data.dailydata}
    theme="light"
    pagination={true}
    />;

export async function getAndProcessData(mode) {
    const res = await fetch("./json/covid-may-jul.json");
    const stats = await res.json();
    stats.sort((a, b) => (a.date > b.date) ? 1 : -1);

    let countries = {};

    for (let x in stats) {
        if (countries[stats[x].country_territory_code] === undefined) {
            countries[stats[x].country_territory_code] = {fullname: stats[x].countries_and_territories, name: stats[x].countries_and_territories.replace(/_/g, " ").split(" ").slice(0, 2).join(" "), lastcases: stats[x].confirmed_cases, totalcases: 0, totaldeaths: 0, increase: 0, increaseAvg: 0, increased: 0, increasedAvg: 0, totalrows: 0, dailydata: [], stability: 0};
        }
        countries[stats[x].country_territory_code].dailydata.push(stats[x]);

        countries[stats[x].country_territory_code].totalrows++;
        countries[stats[x].country_territory_code].totalcases = parseInt(stats[x].confirmed_cases);
        countries[stats[x].country_territory_code].totaldeaths = parseInt(stats[x].deaths);

        countries[stats[x].country_territory_code].increase += parseInt(stats[x].daily_confirmed_cases);
        countries[stats[x].country_territory_code].increased += parseInt(stats[x].daily_deaths);
    }

    for (let x in countries) {
        countries[x].increaseAvg = parseFloat((countries[x].increase / countries[x].totalrows).toFixed(4));
        countries[x].increasedAvg = parseFloat((countries[x].increased / countries[x].totalrows).toFixed(4));
        countries[x].stability = countries[x].increaseAvg + countries[x].increasedAvg;
        if (countries[x].stability <= 0) {
            delete countries[x];
        }
    }


    countries = Object.values(countries);

    switch (mode) {
        case 0:
            countries.sort((a, b) => (a.totalcases < b.totalcases) ? 1 : -1);
            break;
        case 1:
            countries.sort((a, b) => (a.increaseAvg < b.increaseAvg) ? 1 : -1);
            break;
        case 2:
            countries.sort((a, b) => (a.stability > b.stability) ? 1 : -1);
            break;
        default:
            break;
    }

    countries = countries.slice(0, 10);

    let newcats = [];
    let newseriesdata = [];
    for (let x in countries) {
        countries[x].rank = parseInt(x) + 1;
        newcats.push(countries[x].name);

        switch (mode) {
            case 0:
                newseriesdata.push(countries[x].totalcases);
                break;
            case 1:
                newseriesdata.push(countries[x].increaseAvg);
                break;
            case 2:
                newseriesdata.push(countries[x].stability);
                break;
            default:
                break;
        }
    }

    return {countries: countries, newcats: newcats, newseriesdata: newseriesdata};
}
;