import React from 'react';
import Search from './Search.js';
import About from './About.js';
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
