import React, { useEffect, Component } from 'react';
import { withRouter } from 'react-router-dom';

 
 class Login extends Component {
   
  constructor(props) {
    super(props)
    this.state = {
      username : '',
      password: ''
    };
  }
  
  handleInputChange = (event) => {
  
    const { value, name } = event.target;
    this.setState({
      [name]: value
    });
  }

  
  onSubmit = () => {
    fetch('/authenticate', {
      method: 'POST',
      body: JSON.stringify(this.state),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      if (res.status === 200) {
        this.props.history.push('/admin/authenicated');
      } else {
        const error = new Error(res.error);
        throw error;
      }
    })
    .catch(err => {
      console.error(err);
    });
  }
  componentDidMount(){
    document.addEventListener('keydown', event=>{
        if(event.key==="Enter"){
            this.onSubmit()
        }
  })
}
  render() {
    return (
        <div className="login">
      <form onSubmit={this.onSubmit} autoComplete="off">
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={this.state.username}
          onChange={this.handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={this.state.password}
          onChange={this.handleInputChange}
          required
        />
      </form>
        </div>
    );
  }
}
export default withRouter(Login)