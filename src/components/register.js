import React  from "react";
import { Redirect, Link } from 'react-router-dom'
import { Helmet } from "react-helmet";
import TextField, { Input } from '@material/react-text-field';
import axios from "axios";

const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";


class Register extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            email: "",
            password: "",
            confirmPassword: "",
            passwordErrorMessage: null,
            errorMessage: null,
            finished: false,
        };
        this.onSubmit = this.onSubmit.bind(this);
        this.onChangeEmail = this.onChangeEmail.bind(this);
        this.onChangePassword = this.onChangePassword.bind(this);
        this.onChangeConfirmPassword = this.onChangeConfirmPassword.bind(this);
    }
    onChangeEmail(e) {
        this.setState({ email: e.target.value });
    }

    onChangePassword(e) {
        this.setState({ password: e.target.value });
    }
    onChangeConfirmPassword(e) {
        this.setState({ confirmPassword: e.target.value });
    }

    onSubmit(e) {
        e.preventDefault();
        this.source = axios.CancelToken.source();
        const { email, password, confirmPassword } = this.state;
        if (password !== confirmPassword) {
            this.setState({ passwordErrorMessage: "The passwords doesn't match" });
        } else {
            axios.post(`${API_ROOT}/register`, { email, password }, { cancelToken: this.source.token })
                .then(res => {
                    this.setState({ finished: true });
                })
                .catch(error => {
                    if (!axios.isCancel(error)) {
                        
                        this.setState({ errorMessage: "Sorry, " + email + " already exists. Please use a different email adress." });
                    }
                });
        }

    }
    render() {
        const { email, password, confirmPassword, errorMessage,passwordErrorMessage, finished } = this.state;
        if (finished) {
            return <Redirect to='/login' />;
        }
        return (
            <>
                <div className="form-wrapper">
                    <Helmet>
                        <title>Register</title>
                    </Helmet>
                    <form onSubmit={this.onSubmit}>
                        <h1> REGISTER </h1>
                        <div className="form-item">
                            <TextField
                                label='Email'
                            ><Input
                                    value={email}
                                    onChange={this.onChangeEmail}
                                    required
                                    id="mail"
                                />
                            </TextField>
                        </div>
                        <div className="form-item">
                            <TextField
                                label='Password'
                            ><Input
                                    type="password"
                                    value={password}
                                    onChange={this.onChangePassword}
                                    required
                                    id="password"
                                />
                            </TextField>
                        </div>
                        <div className="form-item">
                            <TextField
                                label='Confirm Password'
                            ><Input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={this.onChangeConfirmPassword}
                                    required
                                    id="confirmpassword"
                                />
                            </TextField>
                        </div>
                        {errorMessage ? <p style={{ color: "red" }}><h3> Login failed:</h3>{errorMessage}</p> : null}
                        {passwordErrorMessage ?  <p style={{ color: "red" }}><h3> Login failed:</h3>{passwordErrorMessage}</p> : null}
                        <div className="button-panel">
                            <button type="submit">Submit</button>
                        </div>
                        <div className="form-footer">
                            <Link to={"/login"}>Already Member?</Link>
                        </div>
                    </form>
                </div>
            </>

        )
    }
}

export default Register