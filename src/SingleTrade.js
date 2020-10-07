import React, {Profiler} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import InstrumentSearch from './InstrumentSearch.js';
import Questionnaire from './Questionnaire.js';
import CommissionPanel from './CommissionPanel.js';
import GoBackButton from './GoBackButton.js';
import './App.css';

/**
 * This section presents the calculation process of trading an instrument once
 * The process consists of:
 * 1. Search and choose the instrument
 * 2. Answer the questionnaire (quantity, account type etc)
 * 3. Get the result
 */
class SingalTrade extends React.Component {
  constructor(props) {
    super(props)
    this.stepGoBack = this.stepGoBack.bind(this)
    this.handleSearchBarOnChange = this.handleSearchBarOnChange.bind(this)
		this.handleQuantityChange = this.handleQuantityChange.bind(this)
		this.handleClickInstr = this.handleClickInstr.bind(this)
		this.handleClickAcctType = this.handleClickAcctType.bind(this)
		this.handleClickCalculate = this.handleClickCalculate.bind(this)
  }

  state = {
    //used in the entire process
    currentStep: 1, //current step in the search process

    //used in the instrument search step
    query: "", //instrument keyword used in the search
    instrs: [], //instrument search result returned
    
    //used in the questionnaire step
    chosenAccountType: 3, //both regular and registered account types
    chosenInstr: "", //chosen instrument
    chosenInstrType: 1, //only supports stock for now
    chosenMarket: "", //market on which the chosen instrument is listed
    quantity: 0, //the quantity wished to be traded
    quantityType: "shares", //unit of the chosen instrument
    calculateDisabled: true,

    //used in the commission calculation result step
    comSearchResult: "", //the commission calculation result
	  showLoading: true //whether it is waiting for the commission search result
  };
  
  stepGoBack() {
    this.setState({
      currentStep: this.state.currentStep - 1,
      chosenAccountType: 3,
      quantity: 0,
      showLoading: true
    });
  }
  
  handleSearchBarOnChange(e) {
    const { value } = e.target;
    this.setState({
      query: value
    });

    const url = `http://comminimizer.com:8080/search-instrument/` + value;
  
    fetch(url)
    .then(results => results.json())
    .then(data => {
      this.setState({instrs: data});
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
    var input = document.getElementById("quantity");
    if(input.validity.valid) {
      const quantity = event.target.value;
      this.setState({
        calculateDisabled: false,
        quantity: quantity
      });
    } else {
      this.setState({
        calculateDisabled: true
      });
    }
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
      currentStep: 3
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
        return (<InstrumentSearch className="search"
                                  instrs={this.state.instrs}
                                  searchBarOnChangeHandler={this.handleSearchBarOnChange}
                                  instrumentChosenHandler={this.handleClickInstr}
                />)
      case 2:
        return (<div className="question-wrapper" key="question-wrapper">
                  <GoBackButton handler={this.stepGoBack}></GoBackButton>
                  <Questionnaire quantityType={this.state.quantityType}
																 quantityChangeHandler={this.handleQuantityChange}
                                 accountTypeHandler={this.handleClickAcctType}
                                 calculateDisabled={this.state.calculateDisabled}
																 calculateHandler={this.handleClickCalculate}/>
                </div>)
      case 3:
        return (<div className="commission-panel-wrapper" key="commission-panel-wrapper">
                  <GoBackButton handler={this.stepGoBack}></GoBackButton>
                  <CommissionPanel comSearchResult={this.state.comSearchResult}
                                   quantity={this.state.quantity}
                                   quantityType={this.state.quantityType}
                                   instr={this.state.chosenInstr}
                                   showLoading={this.state.showLoading}/>
                </div>)
      default:
        return (<div className="cannot-load-page-wrapper">
                  <p>Cannot load page</p>
                </div>)
    }
  }
}

export default SingalTrade;