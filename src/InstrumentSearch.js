import React from 'react';
import './App.css';

class InstrumentSearch extends React.Component {

  render() {
    return (<>
              <div className="search-bar" key="search-bar">
                <input type="text" placeholder="Start by typing in the instrument name (e.g. MSFT, Microsoft, 600519)" onChange={(e) => this.props.searchBarOnChangeHandler(e)}></input>
              </div>
              <div className="search-result" key="search-result">
                { this.props.instrs.hasOwnProperty("quotes") &&
                  this.props.instrs.quotes.map((instr, i) => {
                    if(instr["quoteType"] === "EQUITY")
                      return <a key={i} href="#" onClick={(e) => this.props.instrumentChosenHandler(e, instr)}>{instr["symbol"]} {instr["longname"]}</a>
                    else
                      return <React.Fragment key={i}></React.Fragment>
                })}
              </div>
            </>
           )
  }
}

export default InstrumentSearch;