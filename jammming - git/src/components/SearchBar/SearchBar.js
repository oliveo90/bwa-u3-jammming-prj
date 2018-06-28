import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {term: ''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.keyTrigger = this.keyTrigger.bind(this);

  }
  search(term) {
    this.props.onSearch(this.state.term);
  }
  handleTermChange(event) {
    this.setState({term: event.target.value});
  }
  
  //feature request: Trigger Search with 'Enter' key
keyTrigger(event) {
    const key = event.keyCode || event.which;
    if(key === 13) {
      this.props.onSearch(this.state.term);
    }
}
//end feature request

  render() {
    return (
      <div className="SearchBar">
        <input placeholder="Enter A Song, Album, or Artist" onChange={this.handleTermChange}  onKeyPress={this.keyTrigger} />
        <a onClick={this.search}>SEARCH</a>
      </div>
  );
}
};

export default SearchBar;
