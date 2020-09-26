import React from 'react';
import './App.css';

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
        <p>{`If you have discovered any mistakes in the information or have any feedback or comments, please direct your message to `}<a href="mailto:support@comminimizer.com">support@comminimizer.com</a>{`

This website is currently under development and the team would like to expand the scope beyond the equity world, so stay tuned.
`}</p>
      </div>
    );
  }
}

export default About;