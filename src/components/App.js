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

  let handleChange = e => {
    e.preventDefault();
    props.ruleSet(Number.parseInt(e.target.value, 10));
  };
  return (
    <div className="control-row">
      <span className="label">{`${props.title}:`}</span>
      {Array(props.length).fill(0).map((value, index) => {
        return (
        <label htmlFor="props.name" key={index} >
          <input type="checkbox" name="props.name" value={index+1} defaultChecked={props.defaultChecked.indexOf(index+1)>-1} onChange={e => handleChange(e)}/>
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
    const value = event.target.textContent;
    if(value === 'Start') {
      props.gameStart();
      event.target.value = 'stop';
      event.target.textContent = 'Stop';
    } 
    if(value === 'Stop') {
      props.gameStop();
      event.target.value = 'start';
      event.target.textContent = 'Start';
    }
  }
  let speedSet = speed => {
    return e => {
      e.preventDefault();
      props.speedSet(speed);
    };
  };

  let controlGame = type => {
    return e => {
      e.preventDefault();
      props[type]();
    };
  };
  return (
    <div className="side">
      <h2>Game of Life</h2>
      <GenerationsDisplay generations={props.generations} />
      <h4>Settings</h4>
      <form>
        <Slider name="width" title="Width" min={1} max={props.maxWidth} default={props.defaultWidth} value={props.width} change={props.widthSet}/>
        <Slider name="height" title="Height" min={1} max={props.maxHeight} default={props.defaultHeight} value={props.height} change={props.heightSet}/>
        <CheckLists length={8} title="Birth Rule" name="birth-rule" defaultChecked={props.defaultBirthRule} ruleSet={props.ruleSet('birthRule')}/>
        <CheckLists length={8} title="Survival Rule" name="survival-rule" defaultChecked={props.defaultSurviveRule} ruleSet={props.ruleSet('surviveRule')}/>
        <div className="speed control-row">
          <span className="label">Speed:</span>
          <input type="radio" name="speed" value='slow'defaultChecked={props.defaultSpeed === 'show'} onChange={e => speedSet('slow')(e)} /> Slow
          <input type="radio" name="speed" value='medium'defaultChecked={props.defaultSpeed === 'medium'}  onChange={e => speedSet('medium')(e)} /> Medium
          <input type="radio" name="speed" value='fast'defaultChecked={props.defaultSpeed === 'fast'}  onChange={e => speedSet('fast')(e)} /> Fast
        </div>
        <div className="control-row">
          <span className="label game-control">Control:</span>
          <button className="btn btn-game clear" onClick={e => controlGame('gameClear')(e)}>Clear</button>
          <button className="btn btn-game random" onClick={e => controlGame('gameRandom')(e)}>Random</button>
          <button className="btn btn-game toggle-game" value="start" onClick={e => toggleGame(e)}>{props.gameState==='start'?'Stop':'Start'}</button>
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
  generations: PropTypes.number.isRequired,
  gameState: PropTypes.string.isRequired,
  widthSet: PropTypes.func.isRequired,
  heightSet:PropTypes.func.isRequired,
  speedSet:PropTypes.func.isRequired,
  ruleSet:PropTypes.func.isRequired,
  gameStart:PropTypes.func.isRequired,
  gameStop:PropTypes.func.isRequired,
  gameRandom:PropTypes.func.isRequired,
};


class App extends React.Component {
  constructor(props) {
    super(props);
    this.getMaxDimension();
    this.defaultBirthRule = [3];
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
      surviveRule: this.defaultSurviveRule,
      gameState: 'stop',
    };
    this.cellClick = this.cellClick.bind(this);
    this.widthSet = this.widthSet.bind(this);
    this.heightSet = this.heightSet.bind(this);
    this.gameStart = this.gameStart.bind(this);
    this.gameStop = this.gameStop.bind(this);
    this.gameRandom = this.gameRandom.bind(this);
    this.gameClear = this.gameClear.bind(this);
    this.speedSet = this.speedSet.bind(this); 
    this.ruleSet = this.ruleSet.bind(this);
    this.updateStates = this.updateStates.bind(this);
    this.updateCellState = this.updateCellState.bind(this);
  }
  componentWillMount() {
    this.setState({
      cellStates: this.getRandomStates(),
    });
    // this.setState({
    //   cellStates: [0,0,0,1,1,1,0,0,0],
    // });
  }
  getMaxDimension() {
    this.maxWidth = Math.floor((window.innerWidth - 400 - 40 - 20)/10);
    this.maxHeight = Math.floor((window.innerHeight - 20 - 40 - 20)/10);
    this.defaultWidth = this.maxWidth >= 50 ? 50 : Math.floor(this.maxWidth/2);
    this.defaultHeight = this.maxHeight >= 50 ? 50 : Math.floor(this.maxHeight/2);
    // this.defaultWidth = 3; 
    // this.defaultHeight = 3;
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

  updateCellState(states, index, width, height) {
    let liveCnt = 0;
    const posY = Number.parseInt(index/width, 10);
    const posX = index - width * posY;
    for(let i=posX-1; i<posX+2; i++) {
      for(let j=posY-1; j<posY+2; j++) {
        if(i > -1 && i < width && j > -1 && j < height && (i!==posX || j!==posY)) {
          const cellState = states[j*width + i];
          liveCnt += (cellState === 1 ? 1 : 0);
        } 
      }
    }
    let curState = states[index];
    const birthRule = this.state.birthRule; 
    const surviveRule = this.state.surviveRule;
    if(birthRule.indexOf(liveCnt) !== -1) {
      curState = 1;
    } else if(curState === 1 && surviveRule.indexOf(liveCnt) !== -1) {
      curState = 1;
    } else {
      curState = 0;
    }
    return curState;
  }
  updateStates() {
    let equal = true;
    const cellStates = this.state.cellStates;
    const width = this.state.boardWidth;
    const height = this.state.boardHeight;
    const len = cellStates.length;
    const newStates = new Array(len);
    for(let i=0; i<len; i++) {
      const newState = this.updateCellState(cellStates, i, width, height);
      newStates[i] = newState;
      if(equal && newState !== cellStates[i]) {
        equal = false;
      }
    }
    const generations = this.state.generations + 1;
    if(equal === true) {
      this.gameStop();
      return;
    }
    this.setState({
      cellStates: newStates,
      generations: generations,
    });
  }
  speedSet(speed){
    this.gameStop();
    this.setState({
      speed: speed
    });
    this.gameStart();
  }

  ruleSet(type){
    return value => {
      const rule = this.state[type];
      const index = rule.indexOf(value);
      if(index !== -1) {
        rule.splice(index, 1);
      } else {
        rule.push(value).sort((v1,v2) => v1 - v2 < 0);
      }
      const newRule = {};
      newRule[type] = rule;
      this.setState({newRule});
    };
  }

  gameStart(){
    const speed = this.state.speed;
    const interval = (speed === 'slow' ? 500 : (speed === 'medium' ? 250 : 100));
    this.timerId = setInterval(this.updateStates, interval);
    this.setState({gameState: 'start'});
  }
  gameStop(){
    if(this.timerId) {
      clearInterval(this.timerId);
    }
    this.setState({gameState: 'stop'});
  }
  gameClear() {
    this.gameStop();
    const len = this.state.boardWidth * this.state.boardHeight;
    const newStates = new Array(len).fill(0);
    this.setState({
      cellStates: newStates,
      generations: 0,
    });   
  }
  gameRandom(){
    this.gameStop();
    let cellStates = this.getRandomStates();
    this.setState({
      cellStates: cellStates,
      generations: 0,
    });
    // this.gameStart();
  }
  render() {
    const dim = 10;    
    const pixelWidth = String(this.state.boardWidth * dim) + 'px';
    const widthStyle = {width: pixelWidth};
    const boardWidth = this.state.boardWidth;
    const boardHeight = this.state.boardHeight;
    const generations = this.state.generations;
    const gameState = this.state.gameState;
    const {maxWidth, maxHeight, defaultWidth, defaultHeight, defaultBirthRule, defaultSurviveRule, defaultSpeed} = this;
    const controlProps = {maxWidth, maxHeight, defaultWidth, defaultHeight, defaultBirthRule, defaultSurviveRule, defaultSpeed};
    const {widthSet, heightSet, gameStart, gameStop, gameRandom, gameClear, speedSet, ruleSet} = this;
    const funcProps = {widthSet, heightSet, gameStart, gameStop, gameRandom, gameClear, speedSet, ruleSet};
    return (
      <div className="App">
        <div className="left-side">
          <SideControl {...controlProps} gameState={gameState} width={boardWidth} height={boardHeight} generations={generations} {...funcProps} />
        </div>
        <div className="right-side" style={widthStyle}>
          <GameBoard boardWidth={this.state.boardWidth} boardHeight={this.state.boardHeight} handleClick={this.cellClick} cellStates={this.state.cellStates}/>
        </div>
      </div>    
    );
  }
}



export default App;