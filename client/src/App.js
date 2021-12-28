import logo from './logo.svg';
import './App.css';
import Backend from './backend';
import { Link, Route, Switch} from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import Home from './components/home';
import Admin from './components/admin';
import Login from './components/login';
import WithAuth from './components/withAuth';
function App() {
  return (
    <div>
      <Router>
        <Switch>
        <Route path="/admin/authenicated" component={WithAuth(Admin)}>
            </Route>
        <Route path="/admin">
            <Login />
            </Route>
          <Route path="/">
            <Home />

            </Route>
        </Switch>
        </Router>
      </div>
  );
}

export default App;
