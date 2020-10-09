import React, {useState} from 'react'
import './Table.css'
import numeral from 'numeral'
import { Button } from '@material-ui/core'



  


function Table({countries, active}) {

    const CasesResults = () => (
        <div className="table">
     
        {countries.map(({country, cases}) =>(
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(cases).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
    
        </div>
      )
      const ActiveResults = () => (
        <div className="table">
     
        {active.map(({country, active}) =>(
                <tr>
                    <td>{country}</td>
                    <td>
                        <strong>{numeral(active).format("0,0")}</strong>
                    </td>
                </tr>
            ))}
    
        </div>
      )

    const [showResults, setShowResults] = useState(false)
    
    return (
      <div>
        <Button 
                className="table__Button" 
                variant='outlined' 
                onClick={()=> setShowResults(!showResults)}>
                { showResults ? "Click to show Active Cases by Country" : "Click to show Total Cases by Country" }
                </Button>
                { showResults ? <CasesResults /> : <ActiveResults/>  }

      </div>
    )
      
}

export default Table
