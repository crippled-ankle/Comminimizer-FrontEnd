import React from 'react';
import './App.css';

class Questionnaire extends React.Component {
	
	render() {
		return (
			<>
        <div className="quantity-question">
          <p>Quantity?</p>
          <input className="quantity-input" type="number" min="1" max="1000000" id="quantity" onChange={(e) => this.props.quantityChangeHandler(e)} required/>
          <label id="unit"> {this.props.quantityType}</label>
          <p className="invalid-quantity-notice">Please input a valid value: 1~1000000</p>
        </div>
        <div className="account-question">
          <p>Account Type?</p>
          <input id="account-type-regular" name="account-type" type="Radio" />
          <label onClick={(e) => this.props.accountTypeHandler("regular", "account-type-regular")}>Regular Account Only</label>
          <input id="account-type-registered" name="account-type" type="Radio"/>
          <label onClick={(e) => this.props.accountTypeHandler("registered", "account-type-registered")}>Registered Account Only</label>
          <input id="account-type-all" name="account-type" type="Radio" defaultChecked/>
          <label onClick={(e) => this.props.accountTypeHandler("all", "account-type-all")}>All Account Types</label><br />
        </div>
        <button type="button" onClick={this.props.calculateHandler} disabled={this.props.calculateDisabled}>Calculate</button>
			</>
		)
	}
	
}

export default Questionnaire;