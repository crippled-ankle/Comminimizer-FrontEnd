import React from 'react';
import './App.css';

class GoBackButton extends React.Component {
  render() {
    return (
      <div className="go-back-button">
        <svg viewBox="0 0 24 24" onClick={this.props.handler}>
          <path d="M 20 11 H 7 l 5.5 -5.5 L 12 4 l -8 8 l 8 8 l 1 -1 L 7 13 H 20 v -2 Z"></path>
        </svg>
      </div>);
  }
}

export default GoBackButton;