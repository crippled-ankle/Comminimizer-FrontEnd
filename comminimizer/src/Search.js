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
    chosenCurrency: "",
    quantity: 0,
    quantityType: "shares",
    comSearchResult: ""
  };
  
  onChange = e => {
    const { value } = e.target;
    this.setState({
      query: value
    });

    this.search(value);
  };
  
  search = query => {
    const url = `INSTRUMENT_SEARCH_LINK`  + query;
  
    fetch(url)
    .then(results => results.json())
    .then(data => {
      this.setState({instrs: data});
    });
  };
  
  stepGoBack() {
    this.setState({
      currentStep: this.state.currentStep - 1
    });
  }
  
  handleClickInstr(e, instr) {
    this.setState({
      currentStep: 2,
      chosenCurrency: instr["8. currency"],
      chosenInstr: instr["1. symbol"],
      chosenMarket: instr["4. region"]
    });
  }
  
  handleClickQuantity(quantityType, id) {
    document.getElementById(id).checked = true;
    this.setState({
      quantityType: quantityType
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
    
    //Need info:
    //Instr
    //Instr Type
    //Market
    //Price
    //Quantity
    //Quantity Type
    //Account Type
    //Currency(Product currency can be different than market currency)
    var criteria = `{"Instr": ` + this.state.chosenInstr +
                   `, "InstrType": ` + this.state.chosenInstrType +
                   `, "Market": "` + this.state.chosenMarket +
                   `", "Currency": "` + this.state.chosenCurrency +
                   `", "Quantity": ` + this.state.quantity +
                   `, "QuantityType": ` + this.state.quantityType +
                   `, "AccountType": ` + this.state.chosenAccountType + `}`;
    fetch("COMMISSION_SEARCH_LINK", {
      method: 'POST',
      body: JSON.stringify(criteria),
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
      .then(response => {
        this.setState({comSearchResult: response});
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
          transitionEnterTimeout={100} 
          transitionLeaveTimeout={100}>
        {this.renderPage()}
      </ReactCSSTransitionGroup>
    )
  }
  
  renderPage() {
    switch(this.state.currentStep){
      case 1:
        return (<Profiler id="Search-Profiler" onRender={this.showProfilingStat}>
                  <div className="search" key="search">
                    <div className="search-bar" key="search-bar">
                      <input type="text" placeholder="Start by typing in the instrument name" onChange={this.onChange}></input>
                    </div>
                    <div className="search-result" key="search-result">
                      { this.state.instrs.hasOwnProperty("bestMatches") &&
                        this.state.instrs.bestMatches.map((instr, i) => {
                          return <a key={i} href="#" onClick={(e) => this.handleClickInstr(e, instr)}>{instr["1. symbol"]} {instr["2. name"]}</a>
                      })}
                    </div>
                  </div>
                </Profiler>)
      case 2:
        return (<Profiler id="Question-Profiler" onRender={this.showProfilingStat}>
                  <div className="question-wrapper" key="question-wrapper">
                    <GoBackButton handler={this.stepGoBack}></GoBackButton>
                    <div className="quantity-question" key="quantity-question">
                      <p>Quantity?</p>
                      <input id="quantity-unit-shares" name="quantity" type="Radio" defaultChecked/>
                      <label onClick={(e) => this.handleClickQuantity("shares", "quantity-unit-shares")}>By Number of Units</label>
                      <input id="quantity-unit-dollar" name="quantity" type="Radio"/>
                      <label onClick={(e) => this.handleClickQuantity("dollar", "quantity-unit-dollar")}>By Dollar Amount</label><br />
                      <input className="quantity-input" type="number" min="1" max="1000000" id="quantity" onChange={(e) => this.handleQuantityChange(e)} required/>
                      <label id="unit"> {this.state.quantityType}</label><br />
                    </div>
                    <div className="account-question" key="account-question">
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
        return (<Profiler id="Result-Profiler" onRender={this.showProfilingStat}>
                  <div className="commission-panel-wrapper" key="commission-panel-wrapper">
                    <GoBackButton handler={this.stepGoBack}></GoBackButton>
                    <CommissionPanel comSearchResult={this.state.comSearchResult}
                                     quantity={this.state.quantity}
                                     quantityType={this.state.quantityType}
                                     instr={this.state.chosenInstr}>
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