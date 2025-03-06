import './App.sass';
import React, { createRef } from 'react';
import {useState, useEffect, useRef} from 'react'
import cmdLogo from './img/cmd-logo.svg'
import loader from './img/loader.svg'
import blockLogo from './img/undertop-logo.png'
import vector from './img/vector.svg'
import errIcon from './img/error-icon.svg'
import './fonts/fonts.sass'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons'
import { CSSTransition } from 'react-transition-group';

const baseURL = 'https://app.ftoyd.com/fronttemp-service';


function App() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedOption, setSelectionOption] = useState('Все статусы')
  const [menuState, menuActivate] = useState(false)
  const [activeIndexes, indexActivate] = useState([])
  const [filterState, filterShow] = useState('all')
  const [vectorMovileActiv, vectorState] = useState(true)
  const nodeRef = useRef([])
  const errorRef = useRef(null) 
  const menuRef = useRef(null)
  const taskText = { 
    'Finished': {text:'Finished', color: '#EB0237', width: '92px'},
    'Ongoing': {text: 'Live', color: '#43AD28', width: '92px'},
    'Scheduled': {text: 'Preparing', color: '#EB6402', width: '112px'}
  }

const fetchMatches = () => {
  setLoading(true)
  setError('')

  fetch(`${baseURL}/fronttemp`).then(res => {
    if (!res.ok) throw new Error('Ошибка: не удалось загрузить информацию')
    return res.json()
  }).then(data => {setMatches(data.data.matches) 
    console.log(data)
  }).catch(err => setError(err.message)).finally(() => setLoading(false))
}
const handleClick = (value) => {
  if (value == 'all') {
    setSelectionOption('Все статусы') 
  } else if (value =='Ongoing') {
    setSelectionOption('Live')
  } else if (value == 'Finished') { 
    setSelectionOption('Finished')
  } else if (value == 'Scheduled') { 
    setSelectionOption('Match preparing')
  } 
  if (value) { 
    filterShow(prev => value)
    menuActivate(prev => !prev)
  }
}
const vectorActivate = (index) => {
    indexActivate(prev => {
      if (prev.includes(index)) {
        vectorState(index)
        return prev.filter((i) => i !== index)
      } else {
        return [...prev, index]
      }
    })
}
  useEffect(() => {
    fetchMatches();
  }, []);

  useEffect(() => {
      const timeoutId = setTimeout(() => {
        setError('')
      }, 3000);
      return () => {
        clearTimeout(timeoutId); 
      };
  }, [error])

  return (
    <div className="main">
      
      <header className='header'>
        <div className="logo-wrapper">
        <h1 className="main-logo"><a href="#">Match Tracker</a></h1>
        <ul className="drop-list" onClick={() => menuActivate(!menuState)}>
          <li className={menuState? 'drop-list-li-active arrow-rotate' : 'drop-list-li-active'} onClick={() => handleClick(null)}>{selectedOption}<FontAwesomeIcon icon={faCaretDown} /></li>
          <ul className={menuState? 'drop-list-ul drop-list-ul__active' : 'drop-list-ul'} ref={menuRef} >
            <li className="drop-list-li" onClick={() => handleClick('all')}>Все статусы </li>
            <li className="drop-list-li" onClick={() => handleClick('Ongoing')}>Live</li>
            <li className="drop-list-li" onClick={() => handleClick('Finished')}>Finished</li>
            <li className="drop-list-li" onClick={() => handleClick('Scheduled')}>Match preparing</li>
          </ul>
        </ul>
        </div> 
        <div className="btn-wrapper">
          
          <CSSTransition in={(error !== '')} timeout={300} classNames="error-anim"  unmountOnExit nodeRef={errorRef}>
          <div className="error-message" ref={errorRef}><img src={errIcon} alt="#" /><h4>{error}</h4></div>
          </CSSTransition>
          <button className="btn" onClick={fetchMatches}><span>Обновить</span> {loading && <img src={loader} alt="" className='loader'/>}</button>
        </div>

      </header>
      <div className="main-section">

        {
          matches.map((task, index) => {

            if (!nodeRef.current[index]) {
              nodeRef.current[index] = React.createRef()
            }
            const config = taskText[task.status]
            if (task.status === filterState || filterState == 'all') {
              return (
                <div className="main-section-block" key={index}>
                  <div className="main-section-block__wrapper" onClick={() => {vectorActivate(index) 
                    vectorState(prev => !prev)}}>

                    <div className="main-section-box box-l ">
                    <img src={cmdLogo} alt="" />
                    <h2 className="box-title">{task.awayTeam.name}</h2>
                    
                  </div>
                  <div className="main-section-box box-c">
                    <span className="box-score">{task.awayScore}:{task.homeScore}</span>
                    <button className="live-btn"style={{backgroundColor: config.color, width: config.width}}><span>{config.text}</span></button>
                  </div>
                  <div className="main-section-box box-r">
                  <h2 className="box-title">{task.homeTeam.name}</h2>
                  <img src={cmdLogo}alt="#" />
                  <img src={vector} alt="#" className='vector' style={{ transform: activeIndexes.includes(index) ? 'rotate(0deg)' : 'rotate(180deg)' }} />
                  </div>
                  
                  </div>
                  <CSSTransition in={activeIndexes.includes(index)}
                          timeout={700}
                          classNames="mainunder-animation"
                          unmountOnExit
                          nodeRef={nodeRef.current[index]}
                          key={task.awayScore}>
                  <div className="main-section__undertext" ref={nodeRef.current[index]} >
                    <div className="main-section__undertext-frist">
                      <ul className="undertext-top-ul">
                        {task.awayTeam.players.map((content, index) => (
                            <li className="undertext-top-li" key={index}>
                              <img src={blockLogo} alt="#" />
                              <h3 className="undertext-top__title">{content.username}</h3>
                              <p className="undertext-top__text"><span>Убийств:</span> {content.kills}</p>
                            </li>
                        )
                        )}
                      </ul>

                      <div className="undertext-down" >
                        <ul className="undertext-down-ul ">
                          <li className="undertext-down-li undertext-top__text"><span>Points:</span> {task.awayTeam.points}</li>
                          <li className="undertext-down-li undertext-top__text"><span>Место:</span> {task.awayTeam.place}</li>
                          <li className="undertext-down-li undertext-top__text"><span>Всего убийств:</span> {task.awayTeam.total_kills}</li>
                        </ul>
                      </div>
                    </div>
                    <div className="undertext-medium__phone">VS</div>
                    <div className="mai-section__undertext-second">
                    <ul className="undertext-top-ul">
                      
                        {task.homeTeam.players.map((content, index) => (
                            <li className="undertext-top-li" key={index}>
                              <img src={blockLogo} alt="#" />
                              <h3 className="undertext-top__title">{content.username}</h3>
                              <p className="undertext-top__text"><span>Убийств:</span> {content.kills}</p>
                            </li>
                            
                            )
                        )}
                      </ul>
                      <div className="undertext-down">
                        <ul className="undertext-down-ul ">
                          <li className="undertext-down-li undertext-top__text"><span>Points:</span> {task.homeTeam.points}</li>
                          <li className="undertext-down-li undertext-top__text"><span>Место:</span> {task.homeTeam.place}</li>
                          <li className="undertext-down-li undertext-top__text"><span>Всего убийств:</span> {task.homeTeam.total_kills}</li>
                        </ul>
                      </div>
                    </div>
                    
                  </div>
                  </CSSTransition>
                  <img onClick={() => {vectorActivate(index)}} src={vector} alt="#" className='vector vector-mobile' style={{ transform: activeIndexes.includes(index) ? 'rotate(0deg)' : 'rotate(180deg)' }}/>  
              </div>
              )
            }
})
        }
      </div>
    </div>
  );
}

export default App;
