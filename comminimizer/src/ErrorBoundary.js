import React from 'react';
import './App.css';

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

export default ErrorBoundary;