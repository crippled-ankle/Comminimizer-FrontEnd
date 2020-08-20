import React from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import './App.css';

class CommissionPanel extends React.Component {
  state = {
    showCAD: false
  };
  
  handleShowCADChange() {
    this.setState({
      showCAD: !this.state.showCAD
    });
  }
  
  convertCurrencyCode(originCode, unifiedCode) {
    if(this.state.showCAD) {
      return unifiedCode;
    } else {
      return originCode;
    }
  }
  
  convertCurrencyAmount(origin, unified) {
    if(this.state.showCAD) {
      return unified;
    } else {
      return origin;
    }
  }
  
  render() {
    return (
      <div className="broker-options">
        <div className="broker-options-header">
        <h2>Trading {this.props.quantity} {this.props.quantityType} of {this.props.instr} will cost ...</h2><br/>
            { Object.values(this.props.comSearchResult).filter((x) => x["ComCurrencyOrigin"] !== "CAD").length > 0 && 
              <><h3>Show in CAD</h3><br/>
              <input className="currency-switch-checkbox" id="currency-switch-checkbox" type="checkbox" checked={this.state.showCAD} onChange={(e) => this.handleShowCADChange()}/>
              <label className="currency-switch-label" htmlFor="currency-switch-checkbox" style={{background: this.state.showCAD && '#06D6A0'}}>
              <span className="currency-switch-button"/>
              </label></>}
        </div>
        { this.props.comSearchResult.length > 0 &&
          this.props.comSearchResult.map((entry, i) => {
              if(entry["ComAmountOrigin"] > 0 && entry["ComAmountUnified"] > 0) { // in case of FX rate or reference data fetch error
                return <div className="broker-option" key={i} role="button">
                   <img src={`IMAGELINK${entry["BrokerID"]}.svg`} alt="Not Fount"/>
                   <h3>{entry["BrokerName"]}</h3>
                   <h5>{entry["AccountType"]}</h5>
                   <p>{this.convertCurrencyCode(entry["ComCurrencyOrigin"], entry["ComCurrencyUnified"])} {this.convertCurrencyAmount(entry["ComAmountOrigin"], entry["ComAmountUnified"]).toFixed(2)}</p>
                 </div>
			  } else {
                return <></>
              }
        })}
      </div>
    );
  }
}

//chosenAccountType: 1 - Non-Registered Account Only, 2 - Registered Account Only, 3 - All
//chosenInstrType: 1 - Stock
class Search extends React.Component {
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
  
  stepGoBack(e) {
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
        return (<div className="search" key="search">
                  <div className="search-bar" key="search-bar">
                    <input type="text" placeholder="Start by typing in the instrument name" onChange={this.onChange}></input>
                  </div>
                  <div className="search-result" key="search-result">
                    { this.state.instrs.hasOwnProperty("bestMatches") &&
                      this.state.instrs.bestMatches.map((instr, i) => {
                        return <a key={i} href="#" onClick={(e) => this.handleClickInstr(e, instr)}>{instr["1. symbol"]} {instr["2. name"]}</a>
                    })}
                    </div>
                </div>)
      case 2:
        return (<div className="question-wrapper" key="question-wrapper">
                  <div className="go-back-button-1">
                   <svg viewBox="0 0 24 24" onClick={(e) => this.stepGoBack()}>
                     <path d="M 20 11 H 7 l 5.5 -5.5 L 12 4 l -8 8 l 8 8 l 1 -1 L 7 13 H 20 v -2 Z"></path>
                   </svg>
                  </div>
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
                </div>)
      case 3:
        return (<div className="commission-panel-wrapper" key="commission-panel-wrapper">
                  <div className="go-back-button-2">
                    <svg viewBox="0 0 24 24" onClick={(e) => this.stepGoBack()}>
                      <path d="M 20 11 H 7 l 5.5 -5.5 L 12 4 l -8 8 l 8 8 l 1 -1 L 7 13 H 20 v -2 Z"></path>
                    </svg>
                  </div>
                  <CommissionPanel comSearchResult={this.state.comSearchResult}
                                   quantity={this.state.quantity}
                                   quantityType={this.state.quantityType}
                                   instr={this.state.chosenInstr}>
                  </CommissionPanel>
                </div>)
      default:
        return (<div className="cannot-load-page-wrapper">
                  <p>Cannot load page</p>
                </div>)
    }
  }
}

class About extends React.Component {
  //TODO add email address in the message
  render() {
    return (
      <div className="about">
        <h1>About</h1>
        <p>{`This website is intended to guide investors in deciding which discount broker they will trade with, based solely on the commission amount of a single trade (either buy or sell).`}</p>
        <h2>What you can find here</h2>
        <p>{`Commission is calculated based on the chosen stock and quantity, so that the amount is correlated to the choice of investment.

All brokerage firms included in the result are CIPF members, so the investment is protected.

As many brokers in Canada are able to facilitate orders of international equities (outside of North American, and also to be held under TFSA or RRSP), investors may also find implicit market access information on this website.

Information is reviewed and updated periodically, and the final commission charged is based on the calculation by brokers.`}</p>
        <h2>What you also need to care about (but not presented here)</h2>
        <p>{`It is advised that this tool only presents the trading cost and excludes (not limited to):
1. exchange charges (e.g. the amount charged while selling shares on exchanges in US)
2. account maintainence cost (e.g. annual/monthly fee, inactivity fee, costs associated to funding the account)
3. possible costs for sending orders to alternative venues, or using algorithms
4. additional charges while getting multiple partial executions on an order

    The foreign currency conversion is done by leveraging the daily rate published by Bank of Canada. Brokers may use different rates, so it is not guarenteed that this rate can be achieved.`}</p>
        <h2>Contact Us</h2>
        <p>{`If you have discovered any mistakes in the information or have any feedback or comments, please direct your message to 

This website is currently under development and the team would like to expand the scope beyond the equity world, so stay tuned.
`}</p>
      </div>
    );
  }
}

class ErrorBoundary extends React.Component {
  state = {
    hasError: false
  }
  
  static getDerivedStateFromError(error) {
	return { hasError: true };
  }
  
  //TODO add service to collect error info
  componentDidCatch(error, errorInfo) {
    console.log(errorInfo);
  }
  
  render() {
    if(this.state.hasError) {
      return <h1>Unable to Load. Please try refreshing the page later.</h1>
    }
    return this.props.children;
  }
}

class MainContent extends React.Component {
  state = {
    page: 1
  };
  
  handleMenuClick(p) {
    this.setState({
      page: p
    });
  }
  
  render() {
    let content = (<div className="App-header">
                     <div className="menu">
                       <nav>
                         <ul>
                           <li><a onClick={(e) => this.handleMenuClick(1)}>Search</a></li>
                           <li><a onClick={(e) => this.handleMenuClick(2)}>About</a></li>
                         </ul>
                       </nav>
                     </div>
                   </div>);
    let main;
    switch(this.state.page){
      case 1:
        main = <Search></Search>;
        break;
      case 2:
        main = <About></About>;
        break;
      default:
        main = <Search></Search>;
    }
    return (
      <>
        {content}
        <ErrorBoundary>
          {main}
        </ErrorBoundary>
      </>);
  }
}

function App() {
  return (
    <div className="App">
      <MainContent>
      </MainContent>
    </div>
  );
}

export default App;
