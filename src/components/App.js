import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';


class Cell extends React.PureComponent {

  handleClick() {
    this.props.handleClick(this.props.index);
  }
  render() {
    const className = this.props.cellState === 1 ? 'cell live' : 'cell';
    return (
      <div className={className} onClick={() => this.handleClick()}/>
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
    // this.dim = 10;
  }

  render() {
    // const dim = this.dim;
    const height = this.props.boardHeight;
    // const pixelWidth = this.props.boardWidth * dim;
    // const pixelHeight = this.props.boardHeight * dim;
    const cellStates = this.props.cellStates;
    return (
      <div className = "game-board">
        {cellStates.map((cellState, index) => <Cell cellState={cellState} index={index} key={index} handleClick={this.props.handleClick}/>)}
      </div>
    );
  }
}
GameBoard.propTypes = {
  boardWidth: PropTypes.number.isRequired,
  boardHeight: PropTypes.number.isRequired,
  cellStates: PropTypes.array,
};

function CheckLists(props) {

  return (
    <div className="control-row">
      <span className="label">{`${props.title}:`}</span>
      {Array(props.length).fill(0).map((value, index) => {
        return (
        <label htmlFor="props.name">
          <input type="checkbox" name="props.name" defaultChecked={props.defaultChecked.indexOf(index+1)>-1}/>
          <span>{index + 1}</span>
        </label>
        );
      })}
    </div>
  );
}
CheckLists.propTypes = {
  length: PropTypes.length,
  title: PropTypes.title,
  name: PropTypes.name,
};

class Slider extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state={
      value: this.props.default
    };
  }
  handleChange(event) {
    event.preventDefault();
    // this.props.change();
    this.setState({
      value: event.target.value
    });
  }
  render() {
    return (
      <div className="control-row">
        <label className="label" htmlFor={this.props.name}>{`${this.props.title}:`}</label>
        <input type="range" min={this.props.min} max={this.props.max} name={this.props.name} id={this.props.name}  defaultValue={this.props.default} onChange={e => this.handleChange(e)}/>
        <span className="value">{this.state.value}</span>
      </div>
    );
  }
}
Slider.propTypes = {
  name: PropTypes.string,
  title: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  default: PropTypes.number,
};
function SideControl(props) {
  
  return (
    <div className="side">
      <h2>Game of Life</h2>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Alias, vero?</p>
      <h4>Settings</h4>
      <form>
        <Slider name="width" title="Width" min={1} max={100} default={50}/>
        <Slider name="height" title="Height" min={1} max={100} default={50}/>
        <CheckLists length={8} title="Birth Rule" name="birth-rule" defaultChecked={[3]}/>
        <CheckLists length={8} title="Survival Rule" name="survival-rule" defaultChecked={[2,3]}/>
        <div className="speed control-row">
          <span className="label">Speed:</span>
          <button className="btn slow">Slow</button>
          <button className="btn medium">Medium</button>
          <button className="btn fast">Fast</button>
        </div>
        <div className="control-row">
        <span className="label">Control:</span>
          <button className="btn btn-game clear">Clear</button>
          <button className="btn btn-game random">Random</button>
          <button className="btn btn-game toggle-game">{props.gameState+'test'}</button>
        </div>
      </form>
    </div>
  );
}


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
        <div className="left-side">
          <SideControl />
        </div>
        <div className="right-side">
          <GameBoard boardWidth={this.state.boardWidth} boardHeight={this.state.boardHeight} handleClick={this.cellClick} cellStates={this.state.cellStates}/>
        </div>
      </div>    
    );
  }
}



export default App;