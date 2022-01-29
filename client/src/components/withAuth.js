import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
export default function WithAuth(ComponentToProtect) {
  return class extends Component {
    constructor() {
      super();
      this.state = {
        loading: true,
        redirect: false,
      };
    }
    componentDidMount() {
      fetch('https://us-central1-connorspackman-49d00.cloudfunctions.net/app/checkToken',{
        credentials: 'include',
      })
        .then(res => {
          if (res.status === 200) {
            this.setState({ loading: false });
          } else {
            const error = new Error(res.error);
            throw error;
          }
        })
        .catch(err => {
          console.error(err);
          this.setState({ loading: false, redirect: true });
        });
    }
    render() {
      const { loading, redirect } = this.state;
      if (loading) {
        return null;
      }
      if (redirect) {
        return <Redirect to="/admin" />;
      }
      return <ComponentToProtect {...this.props} />;
    }
  }
}