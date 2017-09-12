import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';


function Cell(props) {
  let cellProps = {
    width: props.width.toString(),
    height: props.width.toString(),
    x: (props.positionX * props.width).toString(),
    y: (props.positionY * props.width).toString(),
  };
  // live blue, dead black
  let cellStyle = {
    fill: props.cellState === 1 ? '#4D78CC' : '#FFF',
    strokeWidth: '1px',
    stroke: '#000'
  };
  let handleClick = function() {
    props.handleClick(props.positionX, props.positionY);
  };
  return (
    <rect {...cellProps} onClick={handleClick} style={cellStyle}/>
  );
}
Cell.propTypes = {
  width: PropTypes.number.isRequired,
  positionX: PropTypes.number.isRequired,
  positionY: PropTypes.number.isRequired,
  cellState: PropTypes.number.isRequired, // 0 is dead, 1 is live
  handleClick: PropTypes.func.isRequired,
};


class GameBoard extends React.Component {
  constructor() {
    super();
    this.dim = 10;
  }

  constructBoard() {
    const boardWidth = this.props.boardWidth;
    const boardHeight = this.props.boardHeight;
    const boardCells = [];
    for(let i = 0; i < boardWidth; i += 1) {
      for(let j = 0; j < boardHeight; j += 1) {
        const cellProps = {
          width: this.dim,
          positionX: i,
          positionY: j,
          cellState: this.props.cellStates[i][j], // 0 is dead, 1 is live
          handleClick: this.props.handleClick,
          key: i * boardWidth + j,
        };
        boardCells.push(
          <Cell {...cellProps}/>
        );
      }
    }
    return boardCells;
  }



  render() {
    const pixelWidth = this.props.boardWidth * this.dim;
    const pixelHeight = this.props.boardHeight * this.dim;
    return (
      <svg width={pixelWidth.toString()} height={pixelHeight.toString()}>
        {this.constructBoard()}
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
  constructor() {
    super();
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
    for(let i = 0; i < width; i += 1) {
      cellStates.push([]);
      for(let j = 0; j < height; j += 1) {
        cellStates[i].push(Math.round(Math.random()));
      }
    }
    return cellStates;
  }

  cellClick(positionX, positionY) {
    const cellStates = this.state.cellStates;
    cellStates[positionX][positionY] = 1;
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