import React from 'react';
import PropTypes from 'prop-types';
import '../styles/App.css';


class Cell extends React.PureComponent {

  handleClick() {
    if(this.props.cellState === 1) return;
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
  index: PropTypes.number.isRequired,
  cellState: PropTypes.number.isRequired, // 0 is dead, 1 is live
  handleClick: PropTypes.func.isRequired,
};


class GameBoard extends React.PureComponent {

  render() {
    const dim = 10;
    const pixelWidth = String(this.props.boardWidth * dim) + 'px';
    const pixelHeight = String(this.props.boardHeight * dim) + 'px';
    const widthStyle = {width:pixelWidth};
    const style = {width:pixelWidth, height:pixelHeight};
    const cellStates = this.props.cellStates;
    return (
      <div className="board-wrapper" style={widthStyle}>
        <div className = "game-board" style={style}>
          {cellStates.map((cellState, index) => <Cell cellState={cellState} index={index} key={index} handleClick={this.props.handleClick}/>)}
        </div>
      </div>
    );
  }
}
GameBoard.propTypes = {
  boardWidth: PropTypes.number.isRequired,
  boardHeight: PropTypes.number.isRequired,
  cellStates: PropTypes.array.isRequired,
};

function GenerationsDisplay(props) {
  return (
    <div className="show">
      <span className='label'>Generations:</span>
      <span className="generations">{props.generations}</span>
    </div>
  );
}
GenerationsDisplay.propTypes = {
  generations: PropTypes.number.isRequired,
};
function CheckLists(props) {

  return (
    <div className="control-row">
      <span className="label">{`${props.title}:`}</span>
      {Array(props.length).fill(0).map((value, index) => {
        return (
        <label htmlFor="props.name" key={index} >
          <input type="checkbox" name="props.name" defaultChecked={props.defaultChecked.indexOf(index+1)>-1}/>
          <span>{index + 1}</span>
        </label>
        );
      })}
    </div>
  );
}
CheckLists.propTypes = {
  length: PropTypes.number.isRequired,
  title: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

class Slider extends React.PureComponent {

  handleChange(event) {
    event.preventDefault();
    this.props.change(Number.parseInt(event.target.value,10));
  }
  render() {
    return (
      <div className="control-row">
        <label className="label" htmlFor={this.props.name}>{`${this.props.title}:`}</label>
        <input type="range" min={this.props.min} max={this.props.max} name={this.props.name} id={this.props.name}  defaultValue={this.props.default} onChange={e => this.handleChange(e)}/>
        <span className="value">{this.props.value}</span>
      </div>
    );
  }
}
Slider.propTypes = {
  name: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  default: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
  change: PropTypes.func.isRequired,
};
function SideControl(props) {
  function toggleGame(event) {
    event.preventDefault();
    const value = event.target.value;
    if(value === 'Start') {
      // props.gameStart();
      event.target.value = 'stop';
      event.target.textContent = 'Stop';
    } 
    if(value === 'Stop') {
      // props.gameStop();
      event.target.value = 'start';
      event.target.textContent = 'Start';
    }
  }

  let gameRandom = e => {
    e.preventDefault();
    props.gameRandom();
  };
  return (
    <div className="side">
      <h2>Game of Life</h2>
      <GenerationsDisplay generations={100} />
      <h4>Settings</h4>
      <form>
        <Slider name="width" title="Width" min={1} max={props.maxWidth} default={props.defaultWidth} value={props.width} change={props.widthSet}/>
        <Slider name="height" title="Height" min={1} max={props.maxHeight} default={props.defaultHeight} value={props.height} change={props.heightSet}/>
        <CheckLists length={8} title="Birth Rule" name="birth-rule" defaultChecked={props.defaultBirthRule}/>
        <CheckLists length={8} title="Survival Rule" name="survival-rule" defaultChecked={props.defaultSurviveRule}/>
        <div className="speed control-row">
          <span className="label">Speed:</span>
          <input type="radio" name="speed" value='slow'defaultChecked={props.defaultSpeed === 'show'} /> Slow
          <input type="radio" name="speed" value='medium'defaultChecked={props.defaultSpeed === 'medium'} /> Medium
          <input type="radio" name="speed" value='fast'defaultChecked={props.defaultSpeed === 'fast'} /> Fast
        </div>
        <div className="control-row">
          <span className="label game-control">Control:</span>
          <button className="btn btn-game clear">Clear</button>
          <button className="btn btn-game random" onClick={e => gameRandom(e)}>Random</button>
          <button className="btn btn-game toggle-game" value="start" onClick={e => toggleGame(e)}>Start</button>
        </div>
      </form>
    </div>
  );
}

SideControl.propTypes ={
  maxWidth: PropTypes.number.isRequired,
  maxHeight: PropTypes.number.isRequired,
  defaultWidth: PropTypes.number.isRequired,
  defaultHeight: PropTypes.number.isRequired,
  defaultBirthRule: PropTypes.array.isRequired,
  defaultSurviveRule: PropTypes.array.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  widthSet: PropTypes.func.isRequired,
  heightSet:PropTypes.func.isRequired,
  speedSet:PropTypes.func.isRequired,
  birthRuleSet:PropTypes.func.isRequired,
  surviveRuleSet:PropTypes.func.isRequired,
  gameStart:PropTypes.func.isRequired,
  gameStop:PropTypes.func.isRequired,
  gameRandom:PropTypes.func.isRequired,
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.getMaxDimension();
    this.defaultBirthRule = [2];
    this.defaultSurviveRule = [2,3];
    this.defaultSpeed = 'medium';  //slow, medium, fast
    this.timerId = 0;
    this.state = {
      cellStates: [],
      boardWidth: this.defaultWidth,
      boardHeight: this.defaultHeight,
      generations: 0,
      speed: this.defaultSpeed, //slow, medium, fast
      birthRule: this.defaultBirthRule,
      survivalRule: this.defaultSurviveRule,
    };
    this.cellClick = this.cellClick.bind(this);
    this.widthSet = this.widthSet.bind(this);
    this.heightSet = this.heightSet.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.gameStop = this.gameStop.bind(this);
    this.gameRandom = this.gameRandom.bind(this);
    this.speedSet = this.speedSet.bind(this); 
    this.birthRuleSet = this.birthRuleSet.bind(this);
    this.surviveRuleSet = this.surviveRuleSet.bind(this);
  }
  componentWillMount() {
    this.setState({
      cellStates: this.getRandomStates(),
    });
  }
  getMaxDimension() {
    this.maxWidth = Math.floor((window.innerWidth - 400 - 40 - 20)/10);
    this.maxHeight = Math.floor((window.innerHeight - 20 - 40 - 20)/10);
    this.defaultWidth = this.maxWidth >= 50 ? 50 : Math.floor(this.maxWidth/2);
    this.defaultHeight = this.maxHeight >= 50 ? 50 : Math.floor(this.maxHeight/2);
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

  widthSet(width) {
    const prevWidth = this.state.boardWidth;
    const prevHeight = this.state.boardHeight;
    if(width === prevWidth) return;
    const prevStates = this.state.cellStates;
    let cellStates = [];
    if(width > prevWidth) {
      for(let i = 0; i < prevHeight; i += 1) 
      {
        console.log(i);
        const newColumn = prevStates.slice(i*prevWidth, (i+1)*prevWidth).concat(Array(width-prevWidth).fill(0));
        cellStates = cellStates.concat(newColumn);
      }
    }
    if(width < prevWidth) {
      for(let i = 0; i < prevHeight; i += 1) 
      {
        console.log(i);
        const newColumn = prevStates.slice(i*prevWidth, i*prevWidth+width);
        cellStates = cellStates.concat(newColumn);
      }
    }
    this.setState({
      cellStates: cellStates,
      boardWidth: width,
    });
  }
  heightSet(height){
    const prevWidth = this.state.boardWidth;
    const prevHeight = this.state.boardHeight;
    if(height === prevHeight) return;
    const prevStates = this.state.cellStates;
    let cellStates;
    if(height > prevHeight) {
      cellStates = prevStates.concat(Array((height - prevHeight)*prevWidth).fill(0));
    }
    if(height < prevHeight) {
      cellStates = prevStates.slice(0, height * prevWidth);
    }
    this.setState({
      cellStates: cellStates,
      boardHeight: height,
    });
  }
  speedSet(){

  }
  birthRuleSet(){

  }
  surviveRuleSet(){

  }
  gameStart(){

  }
  gameStop(){

  }
  gameRandom(){
    let cellStates = this.getRandomStates();
    this.setState({cellStates: cellStates});
  }
  render() {
    const dim = 10;    
    const pixelWidth = String(this.state.boardWidth * dim) + 'px';
    const widthStyle = {width: pixelWidth};
    const boardWidth = this.state.boardWidth;
    const boardHeight = this.state.boardHeight;
    const {maxWidth, maxHeight, defaultWidth, defaultHeight, defaultBirthRule, defaultSurviveRule, defaultSpeed} = this;
    const controlProps = {maxWidth, maxHeight, defaultWidth, defaultHeight, defaultBirthRule, defaultSurviveRule, defaultSpeed};
    const {widthSet, heightSet, gameStart, gameStop, gameRandom, speedSet, birthRuleSet, surviveRuleSet} = this;
    const funcProps = {widthSet, heightSet, gameStart, gameStop, gameRandom, speedSet, birthRuleSet, surviveRuleSet};
    return (
      <div className="App">
        <div className="left-side">
          <SideControl {...controlProps} width={boardWidth} height={boardHeight} {...funcProps} />
        </div>
        <div className="right-side" style={widthStyle}>
          <GameBoard boardWidth={this.state.boardWidth} boardHeight={this.state.boardHeight} handleClick={this.cellClick} cellStates={this.state.cellStates}/>
        </div>
      </div>    
    );
  }
}



export default App;