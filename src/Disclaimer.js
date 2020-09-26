import React from 'react';
import './App.css';

class Disclaimer extends React.Component {
  render() {
    return (
      <div className="disclaimer">
        <p><b>Disclaimer:</b> Commission is estimated based on the available insrument price and foreign exchange rates, 
          and it is not guarenteed that brokers will charge the same amount. 
          Commmission data is adopted from presentation by brokers on their premises and its usage by ComMinimizer does not imply any implicit gain. 
          ComMinimizer makes no representaions as to accuracy, completeness, suitability, or validity, of any information. 
          Information presented on this website is for informational use only and does not serve as specific investment advice. 
          It is advised that investors shall seek such advice from licensed profissionals. 
          Investment products do not guarentee profits and contain varying levels of risk and complexity. 
          Investors should understand the nature and risks before investing. 
          ComMinimizer accepts no liability for any investment loss, damages, legal consequences arising from any decision you make based on information on this website.
        </p>
        <p>&copy; 2020 ComMinimizer. All rights reserved.</p>
      </div>);
  }
}

export default Disclaimer;