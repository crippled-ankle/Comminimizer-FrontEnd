import React from 'react';
import './App.css';
import loading from './loading.jpg';

function importAll(r) {
    let images = {};
    r.keys().map((item, index) => { images[item.replace('./', '')] = r(item); });
    return images;
}

const images = importAll(require.context('../img', false, /\.svg/));

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
        { this.props.showLoading &&
          <div name="loading-mask-wrapper">
            <img src={loading} className="loading-spinner" alt="" />
          </div>
        }
        { this.props.comSearchResult.length > 0 && !this.props.showLoading &&
          this.props.comSearchResult.map((entry, i) => {
            if(entry["ComAmountOrigin"] > 0 && entry["ComAmountUnified"] > 0) { // in case of FX rate or reference data fetch error
              return <div className="broker-option" key={i} role="button">
                 <img src={images[`${entry["BrokerID"]}.svg`]} alt=""/>
                 <h3>{entry["BrokerName"]}</h3>
                 <h5>{entry["AccountType"]}</h5>
                 <p>{this.convertCurrencyCode(entry["ComCurrencyOrigin"], entry["ComCurrencyUnified"])} {this.convertCurrencyAmount(entry["ComAmountOrigin"], entry["ComAmountUnified"]).toFixed(2)}</p>
               </div>
			  } else {
                return <React.Fragment key={i}></React.Fragment>
            }
        })}
      </div>
    );
  }
}

export default CommissionPanel;