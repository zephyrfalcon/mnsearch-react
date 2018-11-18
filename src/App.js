import React, { Component } from 'react';
import './App.css';
import carddata from './cards.json';

class QueryArea extends Component {
  render() {
    return '';
  }
}

/* props:
   - cards: list of JSON card data
*/
class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="SearchResults-cards">
        {[].concat(this.props.cards)
         .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
         .map(card => 
           <tr key={card.key}>
             <td>{card.name || "?!?"}</td>
           </tr>
        )}
      </table>
    );
  }
}

class App extends Component {
  render() {
    return (
      <div className="App">
          <p>
            Now with data for {carddata.length} cards!
          </p>
          <QueryArea />
          <SearchResults cards={carddata} />
      </div>
    );
  }
}

export default App;
