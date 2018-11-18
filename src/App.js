import React, { Component } from 'react';
import './App.css';
import carddata from './cards.json';

let sets = {
  "BS": "Base Set",
  "AW": "Awakening",
  "DE": "Dream's End",
  "ND": "Nightmare's Dawn",
  "VS": "Voice of the Storms",
  "PR": "Promos",
  "TR": "Traitor's Reach",
};

let regions = [
  "Arderial",
  "Cald",
  "Naroom",
  "Orothe",
  "Underneath",
  "Universal",
  "Core",
  "Kybar's Teeth",
  "Weave",
  "Bograth",
  "Paradwyn",
  "d'Resh",
  "Nar",
];

let cardTypes = ["Creature", "Magi", "Spell", "Relic"];
let rarities = ["Common", "Uncommon", "Rare", "Promo"];

/* props:
   ...give props that are callbacks?
*/
class QueryArea extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="QueryArea">
        Name contains: <input className="QueryArea-text" type="text" size="40" />
      </div>
    );
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
  constructor(props) {
    super(props);
    // ... set state...
  }
  render() {
    return (
      <div className="App">
        <header>
          <img src="/magination-logo.jpg" />
        </header>
        <QueryArea />
        <hr />
        <SearchResults cards={carddata} />
      </div>
    );
  }
}

export default App;
