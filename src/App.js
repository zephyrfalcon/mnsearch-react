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
let rarities = {
  "C": "Common", 
  "U": "Uncommon", 
  "R": "Rare", 
  "P": "Promo",
};

// return true if the card is in any of the given regions
function cardInRegions(card, regions) {
  console.log(card);
  console.log(regions);
  return card.regions.filter(region => regions.includes(region)).length > 0;
}

/* props:
   - onTextChange(event): callback for when text changes
   - onRegionChange(event)
   - onSetChange(event)
   - onCardTypeChange(event)
   - onRarityChange(event)
*/
class QueryArea extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className="QueryArea">
        <div className="QueryArea-search">
        Name contains: <input className="QueryArea-text" type="text" size="40"
                              onChange={this.props.onTextChange} />
        </div>
        <div className="QueryArea-panels">
          <div className="QueryArea-regions column">
            {regions.map(region =>
              <div>
                <input type="checkbox" name="region" value={region}
                       onChange={this.props.onRegionChange} />{region}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-sets column">
            {Object.keys(sets).map(set =>
              <div>
                <input type="checkbox" name="set" value={set}
                       onChange={this.props.onSetChange} />{sets[set]}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-cardtypes column">
            {cardTypes.map(cardType =>
              <div>
                <input type="checkbox" name="cardtype" value={cardType} 
                       onChange={this.props.onCardTypeChange} />{cardType}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-rarities column">
            {Object.keys(rarities).map(rarity =>
              <div>
                <input type="checkbox" name="rarity" value={rarity}
                       onChange={this.props.onRarityChange} />{rarities[rarity]}<br/>
              </div>
            )}
          </div>
          <div className="lastcolumn">&nbsp;</div>
        </div>
      </div>
    );
  }
}

/* props:
   - cards: list of JSON card data, already filtered
   - onSelectItem(id)
   - isCardSelected(card)
*/
class SearchResults extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="SearchResults-cards">
        <thead>
          <tr>
            <td style={{ width: '20%' }}>Name</td>
            <td style={{ width: '20%' }}>Region</td>
            <td style={{ width: '15%' }}>Set</td>
            <td style={{ width: '10%' }}>Type</td>
            <td style={{ width: '10%' }}>Rarity</td>
            <td style={{ width: '5%' }}>Cost/Starting Energy</td>
          </tr>
        </thead>
        <tbody>
        {this.props.cards
         .sort((a, b) => (a.name.toLowerCase() < b.name.toLowerCase()) ? -1 : 1)
         .map(card => <Card card={card} 
                            onSelectItem={this.props.onSelectItem}
                            isCardSelected={this.props.isCardSelected} />
         )}
        </tbody>
      </table>
    );
  }
}

/* props:
   - card
   - onSelectItem(key)
   - isCardSelected(card)
*/
class Card extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { card, onSelectItem, isCardSelected } = this.props;
    return (
      <React.Fragment>
        <tr className="Card-line" key={card.key} onClick={() => onSelectItem(card.key)}>
          <td>{card.name || "?!?"}</td>
          <td>{card.regions.length > 1 ? 
              card.regions[0] + "/" + card.regions[1] 
              : card.regions[0]}
          </td>
          <td>{sets[card.set]}</td>
          <td>{card.type}</td>
          <td>{rarities[card.rarity]}</td>
          <td>{card.cost}</td>
        </tr>
        {isCardSelected(card) ? <CardDetails card={card} /> : null}
      </React.Fragment>
    );
  }
}

/* props:
   - card
*/
class CardDetails extends Component {
  render() {
    return <tr>
      <td colspan="6">
        bah
      </td>
    </tr>
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      regions: [],
      sets: [],
      cardTypes: [],
      rarities: [],
      results: carddata,
      selected: [],
    };

    // stupid binding skulduggery
    this.onTextChange = this.onTextChange.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onSetChange = this.onSetChange.bind(this);
    this.onCardTypeChange = this.onCardTypeChange.bind(this);
    this.onRarityChange = this.onRarityChange.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.isCardSelected = this.isCardSelected.bind(this);
  }

  onTextChange(event) {
    this.setState({ text: event.target.value.trim() }, 
                  () => this.updateSearchResults());
                  // callback is necessary to use the updated state
  }

  onRegionChange(event) {
    let panel = event.target.parentElement.parentElement;
    let coll = panel.getElementsByTagName('input');
    let arr = [...coll];  // HTMLCollection -> Array
    let checkedRegions = arr.filter(inputElem => inputElem.checked)
                            .map(inputElem => inputElem.value);
    this.setState({ regions: checkedRegions }, 
                  () => this.updateSearchResults());
  }

  onSetChange(event) {
    let panel = event.target.parentElement.parentElement;
    let coll = panel.getElementsByTagName('input');
    let arr = [...coll];  // HTMLCollection -> Array
    let checkedSets = arr.filter(inputElem => inputElem.checked)
                         .map(inputElem => inputElem.value);
    this.setState({ sets: checkedSets }, 
                  () => this.updateSearchResults());
  }

  onCardTypeChange(event) {
    let panel = event.target.parentElement.parentElement;
    let coll = panel.getElementsByTagName('input');
    let arr = [...coll];  // HTMLCollection -> Array
    let checkedCardTypes = arr.filter(inputElem => inputElem.checked)
                              .map(inputElem => inputElem.value);
    this.setState({ cardTypes: checkedCardTypes }, 
                  () => this.updateSearchResults());
  }

  onRarityChange(event) {
    let panel = event.target.parentElement.parentElement;
    let coll = panel.getElementsByTagName('input');
    let arr = [...coll];  // HTMLCollection -> Array
    let checkedRarities = arr.filter(inputElem => inputElem.checked)
                             .map(inputElem => inputElem.value);
    this.setState({ rarities: checkedRarities }, 
                  () => this.updateSearchResults());
  }

  // XXX for now, we can only select one card.
  onSelectItem(id) {
    if (this.state.selected.includes(id)) {
      this.setState({ selected: [] });
    } else {
      this.setState({ selected: [id] });
    };
  }

  isCardSelected(card) {
    return this.state.selected.includes(card.key);
  }

  updateSearchResults() {
    let results = carddata;
    if (this.state.text > '') {
      results = results.filter(card => card.name.toLowerCase().includes(this.state.text.toLowerCase()));
    };
    if (this.state.regions.length > 0) {
      results = results.filter(card => cardInRegions(card, this.state.regions));
    }
    if (this.state.sets.length > 0) {
      results = results.filter(card => this.state.sets.includes(card.set));
    }
    if (this.state.cardTypes.length > 0) {
      results = results.filter(card => this.state.cardTypes.includes(card.type));
    }
    if (this.state.rarities.length > 0) {
      results = results.filter(card => this.state.rarities.includes(card.rarity));
    }
    this.setState({ results: results });
  }

  render() {
    return (
      <div className="App">
        <header>
          <img src="/magination-logo.jpg" />
        </header>
        <QueryArea onTextChange={this.onTextChange}
                   onRegionChange={this.onRegionChange}
                   onSetChange={this.onSetChange}
                   onCardTypeChange={this.onCardTypeChange}
                   onRarityChange={this.onRarityChange} />
        <hr />
        <SearchResults cards={this.state.results} 
                       onSelectItem={this.onSelectItem}
                       isCardSelected={this.isCardSelected} />
        <footer></footer>
      </div>
    );
  }
}

export default App;
