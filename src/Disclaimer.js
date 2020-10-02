import React from 'react';
import './App.css';
import cross from './cross.png';

class Disclaimer extends React.Component {
  state = {
    visible: true
  };

  handleDismiss() {
    this.setState({
      visible: false
    });
  }

  render() {
    return (
      <div className="disclaimer" style={{visibility: this.state.visible ? 'visible' : 'hidden' }}>
        <div className="disclaimer-header">
          <button type="button" onClick={(e) => this.handleDismiss()}>
            <img src={cross} alt=""/>
          </button>
        </div>
        <p><b>Disclaimer:</b> Commission is estimated based on the available instrument price and foreign exchange rates, 
          and it is not guaranteed that brokers will charge the same amount. 
          Commission data is adopted from presentation by brokers on their premises and its usage by ComMinimizer does not imply any implicit gain. 
          ComMinimizer makes no representations as to accuracy, completeness, suitability, or validity, of any information. 
          Information presented on this website is for informational use only and does not serve as specific investment advice. 
          It is advised that investors shall seek such advice from licensed professionals. 
          Investment products do not guarantee profits and contain varying levels of risk and complexity. 
          Investors should understand the nature and risks before investing. 
          ComMinimizer accepts no liability for any investment loss, damages, legal consequences arising from any decision you make based on information on this website.
        </p>
        <p>&copy; 2020 ComMinimizer. All rights reserved.</p>
      </div>);
  }
}

export default Disclaimer;