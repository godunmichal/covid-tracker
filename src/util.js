import React from 'react'
import numeral from "numeral"
import {Circle, Popup} from 'react-leaflet';

const casesTypeColors = {
    cases:{
        hex: '#CC1034',
        multiplier:800
    },
    recovered:{
        hex: '#7DD71D',
        multiplier:1200
    },
    deaths:{
        hex: '#CC1034',
        multiplier:2000
    }
}

export const sortData = (data) =>{
    const sortedData = [...data];
    return sortedData.sort((a,b) => (a.cases > b.cases ? -1 : 1));
}
export const sortDataActive = (data) =>{
    const sortedData = [...data];
    return sortedData.sort((a,b) => (a.active > b.active ? -1 : 1));
}
export const changeGraphColor = (casesType) =>{
    let color =''
    if(casesType === 'recovered')
     {
        color='rgba(125,215,29, 0.5)'

    }
    else{
        color='rgba(204, 16, 52, 0.5)'
    }
    return color;
}

export const prettyPrintStat = (stat) => 
    stat ? `+${numeral(stat).format("0.0a")}`: "+0";


export const showDataOnMap = (data, casesType='cases') =>(
    data.map(country=>(
        <Circle
            center={[country.countryInfo.lat, country.countryInfo.long]}
            fillOpacity={0.4}
            color={casesTypeColors[casesType].hex}
            fillColor={casesTypeColors[casesType].hex}
            radius={
                Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
            }
        > 
            <Popup>
            <div className="info-container">
                <div className="info-flag" style={{backgroundImage: `url(${country.countryInfo.flag})`}}/>
                <div className="info-name" >{country.country}</div>
                <div className="info-confirmed">Cases: {numeral(country.cases).format("0,0")}</div>
                <div className="info-recovered">Recovered: {numeral(country.recovered).format("0,0")}</div>
                <div className="info-deaths">Deaths: {numeral(country.deaths).format("0,0")}</div>
                <div className="info-active">Active: {numeral(country.active).format("0,0")}</div>
            </div>


            </Popup>

        </Circle>
    ))
)