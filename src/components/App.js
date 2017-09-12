import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';


class Cell extends React.PureComponent {

  handleClick() {
    this.props.handleClick(this.props.index);
  }
  render() {
    const dim = this.props.dim;
    const index = this.props.index;
    const height = this.props.height;
    const x = Number.parseInt(index/height, 10);
    const y = index - x * height;
    const cellStyle = {
      fill: this.props.cellState === 1 ? '#4D78CC' : '#FFF',
      strokeWidth: '1px',
      stroke: '#000'
    };
    return (
      <rect width={dim} height={dim} x={x * dim} y={y * dim} onClick={() => this.handleClick()} style={cellStyle}/>
    );
  }
}
Cell.propTypes = {
  height: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  cellState: PropTypes.number.isRequired, // 0 is dead, 1 is live
  handleClick: PropTypes.func.isRequired,
};


class GameBoard extends React.PureComponent {
  constructor() {
    super();
    this.dim = 10;
  }

  render() {
    const dim = this.dim;
    const height = this.props.boardHeight;
    const pixelWidth = this.props.boardWidth * dim;
    const pixelHeight = this.props.boardHeight * dim;
    const cellStates = this.props.cellStates;
    return (
      <svg width={pixelWidth.toString()} height={pixelHeight.toString()}>
        {cellStates.map((cellState, index) => <Cell dim={dim} height={height} cellState={cellState} index={index} key={index} handleClick={this.props.handleClick}/>)}
      </svg>
    );
  }
}
GameBoard.propTypes = {
  boardWidth: PropTypes.number.isRequired,
  boardHeight: PropTypes.number.isRequired,
  cellStates: PropTypes.array,
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cellStates : [],
      boardWidth : 50,
      boardHeight : 50,
    };
    this.cellClick = this.cellClick.bind(this);
  }

  componentWillMount() {
    this.setState({
      cellStates: this.getRandomStates(),
    });
  }
  getRandomStates() {
    const cellStates = [];
    const width = this.state.boardWidth;
    const height = this.state.boardHeight;
    for(let i = 0; i < width * height; i += 1) {
      cellStates.push(Math.round(Math.random()));
    }
    return cellStates;
  }

  cellClick(index) {
    const cellStates = this.state.cellStates.concat();
    cellStates[index] = 1;
    this.setState({cellStates: cellStates});
  }
  render() {
    return (
      <div className="App">
        <GameBoard boardWidth={this.state.boardWidth} boardHeight={this.state.boardHeight} handleClick={this.cellClick} cellStates={this.state.cellStates}/>
      </div>    
    );
  }
}



export default App;