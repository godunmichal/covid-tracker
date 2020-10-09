import React, { useState, useEffect } from "react";
import "./App.css";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@material-ui/core";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Table from "./Table";
import { sortData,sortDataActive, prettyPrintStat } from "./util";
import numeral from "numeral";
import Map from "./Map";
import "leaflet/dist/leaflet.css";
import axios from 'axios';

const App = () => {
  const [country, setInputCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [countries, setCountries] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 27.121723, lng: 21.687672 });
  const [mapZoom, setMapZoom] = useState(2);
  const [tableDataActive, setTableDataActive] = useState([]);
  useEffect(() => {
    axios.get("https://disease.sh/v3/covid-19/all")
      // .then((response) => response.json())
      .then(response => {
        setCountryInfo(response.data);
      })
      .catch(err => {
        console.log(err);
    });
    // fetch("https://disease.sh/v3/covid-19/all")
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setCountryInfo(data);
    //   });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      axios.get("https://disease.sh/v3/covid-19/countries")
      // .then((response) => response.json())
      .then(response => {
        const countries = response.data.map((country) => ({
          name: country.country,
          value: country.countryInfo.iso2,
        }));
        let sortedData = sortData(response.data);
        let sortedDataActive = sortDataActive(response.data);
        setCountries(countries);
        setMapCountries(response.data);
        setTableData(sortedData);
        setTableDataActive(sortedDataActive);
      })      
      .catch(err => {
        console.log(err);
    });
      // fetch("https://disease.sh/v3/covid-19/countries")
      //   .then((response) => response.json())
      //   .then((data) => {
      //     const countries = data.map((country) => ({
      //       name: country.country,
      //       value: country.countryInfo.iso2,
      //     }));
      //     let sortedData = sortData(data);
      //     let sortedDataActive = sortDataActive(data);
      //     setCountries(countries);
      //     setMapCountries(data);
      //     setTableData(sortedData);
      //     setTableDataActive(sortedDataActive);
      //   });
    };

    getCountriesData();
  }, []);

  console.log(casesType);

  const onCountryChange = async (e) => {
    let countryCode = e.target.value;
    const url =
      countryCode !== "worldwide"
        ? `https://disease.sh/v3/covid-19/countries/${countryCode}`
        : "https://disease.sh/v3/covid-19/all";
    await axios.get(url)
      .then(response =>{
        setInputCountry(countryCode);
        setCountryInfo(response.data);
        if(countryCode !== "worldwide"){
          setMapCenter([response.data.countryInfo.lat, response.data.countryInfo.long]);
          setMapZoom(5);
        }
        else{
          setMapCenter([27.121723, 21.687672]);
          setMapZoom(2);
        }

        
      })
      .catch(err => {
        console.log(err);
    });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              name="search"
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus Cases"
            isRed
            active={casesType === "cases"}
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={numeral(countryInfo.cases).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            active={casesType === "recovered"}
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={numeral(countryInfo.recovered).format("0.0a")}
          />
          <InfoBox
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            isRed
            active={casesType === "deaths"}
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={numeral(countryInfo.deaths).format("0.0a")}
          />
        </div>
        <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <div className="app__information">
            <h3>Live Cases by Country</h3>
            <Table countries={tableData} active={tableDataActive}/>
            <h3>Worldwide new {casesType}</h3>
            <LineGraph casesType={casesType} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default App;