import React, {Profiler} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import CommissionPanel from './CommissionPanel.js';
import GoBackButton from './GoBackButton.js';
import './App.css';

//chosenAccountType: 1 - Non-Registered Account Only, 2 - Registered Account Only, 3 - All
//chosenInstrType: 1 - Stock
class Search extends React.Component {
  constructor(props) {
    super(props)
    this.stepGoBack = this.stepGoBack.bind(this)
  }

  state = {
    currentStep: 1,
    query: "",
    instrs: [],
    chosenAccountType: 3,
    chosenInstr: "",
    chosenInstrType: 1, //only supports stock for now
    chosenMarket: "",
    quantity: 0,
    quantityType: "shares",
    comSearchResult: "",
	showLoading: true
  };
  
  onChange = e => {
    const { value } = e.target;
    this.setState({
      query: value
    });

    this.search(value);
  };
  
  search = query => {
    const url = `http://comminimizer.com:8080/search-instrument/` + query;
  
    fetch(url)
    .then(results => results.json())
    .then(data => {
      this.setState({instrs: data});
    });
  };
  
  stepGoBack() {
    this.setState({
      currentStep: this.state.currentStep - 1,
      chosenAccountType: 3,
      quantity: 0,
      showLoading: true
    });
  }
  
  handleClickInstr(e, instr) {
    this.setState({
      currentStep: 2,
      chosenInstr: instr["symbol"],
      chosenMarket: instr["exchange"]
    });
  }
  
  handleQuantityChange(event) {
    const quantity = event.target.value;
    this.setState({
      quantity: quantity
    });
  }
  
  handleClickAcctType(acctType, id) {
    document.getElementById(id).checked = true;
    var type = 0;
    if(acctType === "regular")
      type = 1;
    else if(acctType === "registered")
      type = 2;
    else
      type = 3;
    this.setState({
      chosenAccountType: type
    });
  }
  
  handleClickCalculate() {
    //var dummyResult = JSON.parse("[{\"BrokerID\": \"1\",\"BrokerName\": \"Questrade Inc.\",\"AccountType\": \"Regular Account\",\"ComCurrency\": \"CAD\", \"ComAmount\": \"99.9\"}, \
    //                               {\"BrokerID\": \"2\",\"BrokerName\": \"InteractiveBrokers Inc.\",\"AccountType\": \"TFSA Account\",\"ComCurrency\": \"CAD\", \"ComAmount\": \"999.9\"}]");
    var criteria = `{"Instr": ` + this.state.chosenInstr +
                   `, "InstrType": ` + this.state.chosenInstrType +
                   `, "Market": "` + this.state.chosenMarket +
                   `", "Quantity": ` + this.state.quantity +
                   `, "QuantityType": ` + this.state.quantityType +
                   `, "AccountType": ` + this.state.chosenAccountType + `}`;
    fetch("http://comminimizer.com:8080/search/", {
      method: 'POST',
      body: JSON.stringify(criteria),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => {
        this.setState({
          comSearchResult: response,
          showLoading: false
        });
      }).catch(error => console.error('Error:', error));
  
    this.setState({
      currentStep: 3,
      quantityTyped: true
    });
  }
  
  showProfilingStat(
    id, // the "id" prop of the Profiler tree that has just committed
    phase, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration, // time spent rendering the committed update
    baseDuration, // estimated time to render the entire subtree without memoization
    startTime, // when React began rendering this update
    commitTime, // when React committed this update
    interactions // the Set of interactions belonging to this update
  ) {
    console.log( "The component", id, ", The phase", phase,", Time taken for the update", actualDuration, baseDuration, startTime, commitTime, interactions);
  }
  
  render() {
    return (
      <ReactCSSTransitionGroup 
          transitionName="step"
          transitionEnterTimeout={200} 
          transitionLeaveTimeout={200}>
        {this.renderPage()}
      </ReactCSSTransitionGroup>
    )
  }
  
  renderPage() {
    switch(this.state.currentStep){
      case 1:
        return (<Profiler id="Search-Profiler" key="search" onRender={this.showProfilingStat}>
                  <div className="search">
                    <div className="search-bar" key="search-bar">
                      <input type="text" placeholder="Start by typing in the instrument name (e.g. MSFT, Microsoft, 600519)" onChange={this.onChange}></input>
                    </div>
                    <div className="search-result" key="search-result">
                      { this.state.instrs.hasOwnProperty("quotes") &&
                        this.state.instrs.quotes.map((instr, i) => {
                          if(instr["quoteType"] === "EQUITY")
							return <a key={i} href="#" onClick={(e) => this.handleClickInstr(e, instr)}>{instr["symbol"]} {instr["longname"]}</a>
                          else
                            return <React.Fragment key={i}></React.Fragment>
                      })}
                    </div>
                  </div>
                </Profiler>)
      case 2:
        return (<Profiler id="Question-Profiler" key="question-wrapper" onRender={this.showProfilingStat}>
                  <div className="question-wrapper">
                    <GoBackButton handler={this.stepGoBack}></GoBackButton>
                    <div className="quantity-question">
                      <p>Quantity?</p>
                      <input className="quantity-input" type="number" min="1" max="1000000" id="quantity" onChange={(e) => this.handleQuantityChange(e)} required/>
                      <label id="unit"> {this.state.quantityType}</label><br />
                    </div>
                    <div className="account-question">
                      <p>Account Type?</p>
                      <input id="account-type-regular" name="account-type" type="Radio" />
                      <label onClick={(e) => this.handleClickAcctType("regular", "account-type-regular")}>Regular Account Only</label>
                      <input id="account-type-registered" name="account-type" type="Radio"/>
                      <label onClick={(e) => this.handleClickAcctType("registered", "account-type-registered")}>Registered Account Only</label>
                      <input id="account-type-all" name="account-type" type="Radio" defaultChecked/>
                      <label onClick={(e) => this.handleClickAcctType("all", "account-type-all")}>All Account Types</label><br />
                      <button type="button" onClick={(e) => this.handleClickCalculate()}>Calculate</button>
                    </div>
                  </div>
                </Profiler>)
      case 3:
        return (<Profiler id="Result-Profiler" key="commission-panel-wrapper" onRender={this.showProfilingStat}>
                  <div className="commission-panel-wrapper">
                    <GoBackButton handler={this.stepGoBack}></GoBackButton>
                    <CommissionPanel comSearchResult={this.state.comSearchResult}
                                     quantity={this.state.quantity}
                                     quantityType={this.state.quantityType}
                                     instr={this.state.chosenInstr}
                                     showLoading={this.state.showLoading}>
                    </CommissionPanel>
                  </div>
                </Profiler>)
      default:
        return (<div className="cannot-load-page-wrapper">
                  <p>Cannot load page</p>
                </div>)
    }
  }
}

export default Search;