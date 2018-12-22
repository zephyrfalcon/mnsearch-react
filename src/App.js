import React, { Component } from 'react';
import './App.css';
import carddata from './cards.json';
import { sortBy } from 'lodash';


const VERSION = "0.10";

const SORTS = {
  name: list => sortBy(list, [(card) => card.name.toLowerCase()]),
  region: list => sortBy(list, [(card) => card.regions[0].toLowerCase()]),
  set: list => sortBy(list, 'set'),
  type: list => sortBy(list, 'type'),
  rarity: list => sortBy(list, 'rarity'),
  cost: list => sortBy(list, 'cost'),
};

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
  return card.regions.filter(region => regions.includes(region)).length > 0;
}

function cardInAllRegions(card, regions) {
  return card.regions.filter(
    region => regions.includes(region)).length === regions.length;
}

function showSortArrow(field, sortKey) {
  if (field === sortKey || "^"+field === sortKey) {
    return sortKey.startsWith("^") ? "↓" : "↑";
  } else return null;
}

// produce a string that contains all card text, in lowercase.
// note: opinions may vary about what goes in here. in principle, any text
// that contains functionality should be here.
// in any case, flavor text is NOT considered part of it.
const cardText = (card) => [
  card.name,
  card.type,
  card.effects && card.effects.map(effect => effect.name || "").join(" "),
  card.effects && card.effects.map(effect => effect.text || "").join(" "),
  card.powers && card.powers.map(power => power.name || "").join(" "),
  card.powers && card.powers.map(power => power.text || "").join(" "),
  card.starting && card.starting.join(" "),
  card.subtype || "",
  card.text || "",
  card.type === "Magi" && card.original_region && card.original_region + " Shadow Magi",
].join(" ").toLowerCase();

// everything on the card, except perhaps numbers, but including stuff that
// does not affect functionality, like flavor text and artists
const wholeCardText = (card) => {
  return [cardText(card),
    (card.flavor || ""),
    (card.artist || ""),
  ].join(" ").toLowerCase();
  // what else? 
}

/* props:
   - onTextChange(event): callback for when text changes
   - onRefinedTextChange(event)
   - onRefinedFieldChange(event)
   - onRegionChange(event)
   - onSetChange(event)
   - onCardTypeChange(event)
   - onRarityChange(event)
   - onOnlyMultiRegions(event)
   - onAllRegionsChange(event)
*/
class QueryArea extends Component {
  render() {
    return (
      <div className="QueryArea">
        <div className="QueryArea-search">
          <table className="QueryArea-top-table">
            <tbody>
              <tr>
                <td style={{ textAlign: 'left', paddingLeft: '5px' }}>Name</td> 
                <td>contains:</td>
                <td><input className="QueryArea-text" type="text" size="30"
                                    onChange={this.props.onTextChange} />
                </td>
              </tr>
              <tr>
                <td>
                  <select className="dropdown-refined" 
                          onChange={this.props.onRefinedFieldChange}>
                    <option value="card-text">Card Text</option>
                    <option value="effect-name">Effect name</option>
                    <option value="effect-text">Effect text</option>
                    <option value="power-name">Power name</option>
                    <option value="power-text">Power text</option>
                    <option value="subtype">Subtype</option>
                    <option value="flavor-text">Flavor text</option>
                    <option value="artist">Artist</option>
                    <option value="whole-card">Whole card</option>
                  </select>
                </td>
                <td>contains:</td>
                <td>
                    <input className="QueryArea-refined-text" type="text" size="30"
                          onChange={this.props.onRefinedTextChange} />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="QueryArea-panels">
          <div className="QueryArea-regions column">
            {regions.map(region =>
              <div key={region}>
                <input type="checkbox" name="region" value={region}
                       onChange={this.props.onRegionChange} />{region}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-sets column">
            {Object.keys(sets).map(set =>
              <div key={set}>
                <input type="checkbox" name="set" value={set}
                       onChange={this.props.onSetChange} />{sets[set]}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-cardtypes column">
            {cardTypes.map(cardType =>
              <div key={cardType}>
                <input type="checkbox" name="cardtype" value={cardType} 
                       onChange={this.props.onCardTypeChange} />{cardType}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-rarities column">
            {Object.keys(rarities).map(rarity =>
              <div key={rarity}>
                <input type="checkbox" name="rarity" value={rarity}
                       onChange={this.props.onRarityChange} />{rarities[rarity]}<br/>
              </div>
            )}
          </div>
          <div className="QueryArea-misc column">
            <CheckBox name="multi-regions"
                      value="multi-regions"
                      text="only show multi-region cards"
                      onChange={this.props.onOnlyMultiRegions} />
            <CheckBox name="all-regions" 
                      value="all-regions" text="only cards with ALL regions selected" 
                      onChange={this.props.onAllRegionsChange} />
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
   - toggleSort(field)
   - sortKey
   - hasMRPData(card)
   - getMRPData(card)
*/
class SearchResults extends Component {
  render() {
    return (
      <div className="SearchResults">
        <div className="SearchResults-cards-found">Cards found: {this.props.cards.length}</div>
        <table className="SearchResults-cards">
          <thead>
            <tr>
              <td onClick={() => this.props.toggleSort('name')} 
                  style={{ width: '20%' }}>Name{showSortArrow("name", this.props.sortKey)}</td>
              <td onClick={() => this.props.toggleSort('region')} 
                  style={{ width: '20%' }}>Region{showSortArrow("region", this.props.sortKey)}</td>
              <td onClick={() => this.props.toggleSort('set')} 
                  style={{ width: '15%' }}>Set{showSortArrow("set", this.props.sortKey)}</td>
              <td onClick={() => this.props.toggleSort('type')} 
                  style={{ width: '10%' }}>Type{showSortArrow("type", this.props.sortKey)}</td>
              <td onClick={() => this.props.toggleSort('rarity')} 
                  style={{ width: '10%' }}>Rarity{showSortArrow("rarity", this.props.sortKey)}</td>
              <td onClick={() => this.props.toggleSort('cost')} 
                  style={{ width: '5%' }}>Cost/Starting Energy{showSortArrow("cost", this.props.sortKey)}</td>
            </tr>
          </thead>
          <tbody>
          {this.props.cards.map((card, index) => 
            <Card card={card} 
                  index={index}
                  key={card.key}
                  onSelectItem={this.props.onSelectItem}
                  isCardSelected={this.props.isCardSelected}
                  hasMRPData={this.props.hasMRPData}
                  getMRPData={this.props.getMRPData} />
          )}
          </tbody>
        </table>
      </div>
    );
  }
}

/* props:
   - card
   - index (starting at 0)
   - onSelectItem(key)
   - isCardSelected(card)
   - hasMRPData(card)
   - getMRPData(card)
*/
class Card extends Component {
  render() {
    const { card, onSelectItem, isCardSelected, index } = this.props;
    return (
      <React.Fragment>
        <tr className={"Card-line Card-line-color-"+(index % 2)}
            key={card.key} onClick={() => onSelectItem(card.key)}>
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
        {isCardSelected(card) ? 
          <CardDetails card={card} 
                       hasMRPData={this.props.hasMRPData}
                       getMRPData={this.props.getMRPData} /> : null}
      </React.Fragment>
    );
  }
}

/* props:
   - card
   - hasMRPData(card)
   - getMRPData(card)
*/
class CardDetails extends Component {
  render() {
    const { card } = this.props;
    return <tr>
      <td colspan="6">
        <div className="CardDetails-panel">
          <div className="CardDetails-image">
            <img src={card.image} alt="" />
          </div>
          <div className="CardDetails-text">
            <table className="CardDetails-text-table">
              <tbody>
                <tr>
                  <td>Name</td>
                  <td>{card.name}</td>
                </tr>
                <tr>
                  <td>Region(s)</td>
                  <td>{card.regions.length === 1 ? 
                       card.regions[0] : 
                       card.regions[0] + "/" + card.regions[1]}</td>
                </tr>
                <tr>
                  <td>Set</td>
                  <td>{sets[card.set]}</td>
                </tr>
                <tr>
                  <td>Card Type</td>
                  <td>{card.type}&nbsp;
                    {card.type === "Magi" && 
                     card.regions.includes("Core") && 
                     card.original_region && 
                     <span className="CardDetails-shadow-magi">{card.original_region} Shadow Magi</span>}
                  </td>
                </tr>
                {card.subtype &&
                <tr>
                  <td>Subtype</td>
                  <td>{card.subtype}</td>
                </tr>
                }
                <tr>
                  <td>Rarity</td>
                  <td>{rarities[card.rarity]}</td>
                </tr>
                <tr>
                  <td>{card.type === "Magi" ? "Starting Energy" : "Cost"}</td>
                  <td>{card.cost}</td>
                </tr>
                {card.energize &&
                <tr>
                  <td>Energize</td>
                  <td>{card.energize}</td>
                </tr>
                }
                {card.starting &&
                 <tr>
                   <td>Starting cards</td>
                   <td>{card.starting.join(", ")}</td>
                 </tr>
                }
                {card.text &&
                 <tr>
                   <td>Text</td>
                   <td>{card.text}</td>
                 </tr>
                }
                {card.effects && 
                  <tr>
                    <td>Effects</td>
                    <td>
                      {card.effects.map(effect => 
                        <span><strong>Effect - {effect.name}</strong>: {effect.text}<br/></span>
                      )}
                    </td>
                  </tr>
                }
                {card.powers &&
                  <tr>
                    <td>Powers</td>
                    <td>
                      {card.powers.map(power =>
                        <span><strong>Power -	{power.name}</strong>: {power.cost ? <strong>{"("+power.cost+") "}</strong> : null}{power.text}<br/></span>
                      )}
                    </td>
                  </tr>
                }
                {card.flavor &&
                  <tr>
                    <td>Flavor Text</td>
                    <td><em>{card.flavor}</em></td>
                  </tr>
                }
                <tr>
                  <td>Artist(s)</td>
                  <td>{card.artist}</td>
                </tr>
                {this.props.hasMRPData(card) &&
                  <tr>
                    <td className="MRP" colspan="2">
                      <p>This card has MRP data.</p>
                      <div className="MRP-text" dangerouslySetInnerHTML={{__html: this.props.getMRPData(card)}}></div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        </div>
      </td>
    </tr>
  }
}

const AboutLink = (props) => 
  <div className="AboutLink"><a name="top" href="#about">About/Instructions</a></div>

/* props:
   - name
   - value
   - text
   - onChange
*/
class CheckBox extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
    };
    this.onClick = this.onClick.bind(this);
  };
  onClick(event) {
    this.input.checked = !this.input.checked;
    this.props.onChange(event);
  }
  render() {
    return (
      <span>
        <input type="checkbox" 
               name={this.props.name} 
               value={this.props.value}
               onChange={this.props.onChange}
               ref={elem => this.input = elem} />
        <span onClick={this.onClick}>{this.props.text}</span>
        <br/>
      </span>
    );
  }
}

class About extends Component {
  render() {
    return (
      <div className="About">
        <a name="about" />
        <div>
          <p><strong>Magi-Nation Search version {VERSION}</strong></p>
          <p>Magi-Nation Search was written by&nbsp;
            <a href="http://aquila.blue">Hans Nowak</a>.</p>
          <p>Quick instructions:</p>
          <ul>
            <li>Select checkboxes to filter by region, set, etc.</li>
            <li>Typing in the name text field immediately filters the search results; 
              pressing Enter is not necessary.
            </li>
            <li>Click on a card to show details.</li>
            <li>Click on a header field to sort by that field; click again
              on the same field for reverse sort.
            </li>
          </ul>
          <p>Source code is available on&nbsp;
            <a href="https://github.com/zephyrfalcon/mnsearch-react">Github</a>. 
            If you find bugs, or have suggestions for new features, please&nbsp;
            <a href="https://github.com/zephyrfalcon/mnsearch-react/issues">add an issue</a> there.</p>
            <p>If you find Magi-Nation Search useful, please consider
              buying me a <a target="_blank" rel="noopener noreferrer" 
                             href="https://ko-fi.com/zephyrfalcon">coffee</a>. :3
            </p>
            <p>[<a href="#top">back to top</a>]</p>
        </div>
      </div>
    );
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
      refinedSearchField: 'card-text',
      refinedSearchText: '',
      sortBy: 'name',
      filters: {
        onlyMultiRegions: false,
        allRegions: false,  /* only show cards with ALL regions selected */
      },
      MRPCards: [],  /* cards that have MRP data */
      MRPData: {},  /* cache for MRP data */
    };

    // stupid binding skulduggery
    this.onTextChange = this.onTextChange.bind(this);
    this.onRefinedTextChange = this.onRefinedTextChange.bind(this);
    this.onRefinedFieldChange = this.onRefinedFieldChange.bind(this);
    this.onRegionChange = this.onRegionChange.bind(this);
    this.onSetChange = this.onSetChange.bind(this);
    this.onCardTypeChange = this.onCardTypeChange.bind(this);
    this.onRarityChange = this.onRarityChange.bind(this);
    this.onOnlyMultiRegions = this.onOnlyMultiRegions.bind(this);
    this.onAllRegionsChange = this.onAllRegionsChange.bind(this);
    this.onSelectItem = this.onSelectItem.bind(this);
    this.isCardSelected = this.isCardSelected.bind(this);
    this.toggleSort = this.toggleSort.bind(this);
    this.hasMRPData = this.hasMRPData.bind(this);
    this.getMRPData = this.getMRPData.bind(this);
  }

  componentDidMount() {
    // CORS is the default anyway; I'll leave this here as a reminder that
    // it needs to be enabled on mn-search-api.pingoland.xyz.
    fetch("http://mn-search-api.pingoland.xyz/api/cards", {mode: "cors"})
      .then(response => response.json())
      .then(result => this.setState({ MRPCards: result }))
      .catch(error => error);
  }

  hasMRPData(card) {
    return this.state.MRPCards.includes(card.normalized_name);
  }

  needToFetchMRPData(card) {
    return !(card.normalized_name in this.state.MRPData);
  }

  fetchMRPData(card) {
    const name = card.normalized_name;
    fetch(`http://mn-search-api.pingoland.xyz/api/cards/${name}`, {mode: "cors"})
      .then(response => response.json())
      .then(result => this.setState({ MRPData: { ...this.state.MRPData, [name]: result.text } }))
      .catch(error => error);
  }

  getMRPData(card) {
    if (this.needToFetchMRPData(card)) {
      this.fetchMRPData(card);
    };
    return this.state.MRPData[card.normalized_name];
  }

  toggleSort(field) {
    let newField = field;
    if (this.state.sortBy === field) {
      // field was already selected for ascending order, sort in descending order now
      newField = "^" + field;
    }
    this.setState({ sortBy: newField },
                  () => this.updateSearchResults());
  }

  onTextChange(event) {
    this.setState({ text: event.target.value.trim() }, 
                  () => this.updateSearchResults());
                  // callback is necessary to use the updated state
  }

  onRefinedTextChange(event) {
    this.setState({ refinedSearchText: event.target.value.trim() },
                  () => this.updateSearchResults());
  }

  onRefinedFieldChange(event) {
    this.setState({ refinedSearchField: event.target.value },
                  () => this.updateSearchResults());
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

  onOnlyMultiRegions(event) {
    this.setState({ filters: { ...this.state.filters, onlyMultiRegions: event.target.checked } },
                  () => this.updateSearchResults());
  }

  onAllRegionsChange(event) {
    //let panel = event.target.parentElement.parentElement;
    //let coll = panel.getElementsByTagName('input');
    //let arr = [...coll];  // HTMLCollection -> Array
    this.setState({ filters: { ...this.state.filters, allRegions: event.target.checked } }, 
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

    // filters
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
    if (this.state.filters.onlyMultiRegions) {
      results = results.filter(card => card.regions.length > 1);
    }
    if (this.state.filters.allRegions) {
      results = results.filter(card => cardInAllRegions(card, this.state.regions));
    }

    if (this.state.refinedSearchText) {
      let text = this.state.refinedSearchText.toLowerCase();;
      if (this.state.refinedSearchField === 'artist') {
        results = results.filter(card => card.artist.toLowerCase().includes(text));
      }
      else if (this.state.refinedSearchField === 'card-text') {
        results = results.filter(card => cardText(card).includes(text));
      } 
      else if (this.state.refinedSearchField === 'whole-card') {
        results = results.filter(card => wholeCardText(card).includes(text));
      } 
      else if (this.state.refinedSearchField === 'effect-name') {
        results = results.filter(
          card => card.effects && card.effects.some(
            effect => effect.name && effect.name.toLowerCase().includes(text)));
      } 
      else if (this.state.refinedSearchField === 'effect-text') {
        results = results.filter(
          card => card.effects && card.effects.some(
            effect => effect.text && effect.text.toLowerCase().includes(text)));
      } 
      else if (this.state.refinedSearchField === 'power-name') {
        results = results.filter(
          card => card.powers && card.powers.some(
            power => power.name && power.name.toLowerCase().includes(text)));
      } 
      else if (this.state.refinedSearchField === 'power-text') {
        results = results.filter(
          card => card.powers && card.powers.some(
            power => power.text && power.text.toLowerCase().includes(text)))
      } 
      else if (this.state.refinedSearchField === 'subtype') {
        results = results.filter(
          card => card.subtype && card.subtype.toLowerCase().includes(text));
          // does not include things like "Weave Shadow Magi"
      } 
      else if (this.state.refinedSearchField === 'flavor-text') {
        results = results.filter(
          card => card.flavor && card.flavor.toLowerCase().includes(text));
      } 
      else 
        alert("not implemented yet: " + this.state.refinedSearchField);
    }

    // sorting
    const sortKey = this.state.sortBy.startsWith("^") ? this.state.sortBy.slice(1) : this.state.sortBy;
    results = SORTS[sortKey](results);
    if (this.state.sortBy.startsWith("^")) results.reverse();

    this.setState({ results: results });
  }

  render() {
    return (
      <div className="App">
        <AboutLink />
        <header>
          <img src="/magination-logo.jpg" alt="Magi-Nation Search" />
        </header>
        <QueryArea onTextChange={this.onTextChange}
                   onRefinedTextChange={this.onRefinedTextChange}
                   onRefinedFieldChange={this.onRefinedFieldChange}
                   onRegionChange={this.onRegionChange}
                   onSetChange={this.onSetChange}
                   onCardTypeChange={this.onCardTypeChange}
                   onRarityChange={this.onRarityChange}
                   onOnlyMultiRegions={this.onOnlyMultiRegions}
                   onAllRegionsChange={this.onAllRegionsChange} />
        <hr />
        <SearchResults cards={this.state.results} 
                       onSelectItem={this.onSelectItem}
                       isCardSelected={this.isCardSelected} 
                       toggleSort={this.toggleSort}
                       sortKey={this.state.sortBy}
                       hasMRPData={this.hasMRPData}
                       getMRPData={this.getMRPData} />
        <footer>
          <About />
        </footer>
      </div>
    );
  }
};

export default App;
