import React from 'react'
import {
  BrowserRouter as Router,
  Route,
  Link
} from 'react-router-dom'

import PlaylistsList from './components/PlaylistsList/index.js'

const App = () =>
  <Router>
    <div>
      <ul>
        <li><Link to="/qwest">qwest</Link></li>
        <li><Link to="/axios">axios</Link></li>
      </ul>
      <Route path="/qwest" component={PlaylistsList}/>
      <Route path="/axios" component={PlaylistsList}/>
    </div>
  </Router>

export default App