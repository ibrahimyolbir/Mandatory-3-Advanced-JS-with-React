import React from "react";
import { Redirect, Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import { updateToken } from "./auth";
import axios from "axios";
import TextField, { Input } from '@material/react-text-field';
import '@material/react-text-field/dist/text-field.css';

const jwt = require('jsonwebtoken');
const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            email: "",
            password: "",
            errorMessage: null,
            finished: false,
            token: ""
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
    }

    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }
   
    onSubmit(e) {
        e.preventDefault();
        this.source = axios.CancelToken.source();
        const { email, password, token } = this.state;
      
        axios.post(`${API_ROOT}/auth`, { email, password }, { cancelToken: this.source.token }, { headers: { "Authorization": `Bearer ${token}` } })
            .then(res => {
                this.setState({ finished: true });
                const decoded = jwt.decode(res.data.token);
                updateToken(res.data.token);

            })
            .catch(error => {
                
                if (!axios.isCancel(error)) {
                    this.setState({ errorMessage: "Something went wrong!" });
                }
            });
    }
    render() {
        const { email, password, errorMessage, finished } = this.state;
       
        if (finished) {
            return <Redirect to='/' />;
        }
        return (
            <>
                <Helmet>
                    <title>Register</title>
                </Helmet>
                <div className="form-wrapper">
                    <form onSubmit={this.onSubmit}>
                        <h1> SIGN IN </h1>
                        <div className="form-item">
                            <TextField
                                label='Email'
                            ><Input
                                    value={email}
                                    onChange={this.onChangeEmail}
                                    required
                                    id="email"
                                />
                            </TextField>
                        </div>
                        <div className="form-item">
                            <TextField
                                label='Password'
                            ><Input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={this.onChangePassword}
                                    id="password"
                                />
                            </TextField>
                        </div>
                        {errorMessage ? <p style={{ color: "red" }}>{errorMessage}</p> : null}
                        <div className="button-panel">
                            <button type="submit">Submit</button>
                        </div>
                        <div className="form-footer">
                            <Link to={"/register"}>Create an account</Link>
                            <p><button>Forgot password?</button></p>
                        </div>
                    </form>
                </div>
            </>

        )
    }
}

export default Login