import React from 'react';
import SingleTrade from './SingleTrade.js';
import About from './About.js';
import Disclaimer from './Disclaimer.js';
import ErrorBoundary from './ErrorBoundary.js';
import './App.css';

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
    let header = (<div className="App-header">
                     <h1>Check the lowest brokerage commission charge for trading stocks in more than 40 markets worldwide with CIPF members.</h1>
                     <div className="menu">
                      <nav>
                        <ul>
                          <li><a onClick={(e) => this.handleMenuClick(1)}>Search</a></li>
                          <li><a onClick={(e) => this.handleMenuClick(2)}>About</a></li>
                        </ul>
                      </nav>
                    </div>
                  </div>);
    let disclaimer = (<Disclaimer />);
    let main;
    switch(this.state.page){
      case 1:
        main = <SingleTrade></SingleTrade>;
        break;
      case 2:
        main = <About></About>;
        break;
      default:
        main = <SingleTrade></SingleTrade>;
    }
    return (
      <>
        {header}
        <ErrorBoundary>
          {main}
        </ErrorBoundary>
        {disclaimer}
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
