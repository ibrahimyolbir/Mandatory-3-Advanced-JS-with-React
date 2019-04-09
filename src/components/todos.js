import React  from 'react';
import { Redirect } from "react-router-dom";
import { Helmet } from "react-helmet";
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { token$ } from "./auth";
import axios from "axios";
import TodoList from "./todolist";


const API_ROOT = "http://ec2-13-53-32-89.eu-north-1.compute.amazonaws.com:3000";

class Todos extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            token: token$.value,
            data: [],
            content: ""
        }
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.fetchData = this.fetchData.bind(this);
        this.onDelete = this.onDelete.bind(this);
    }

    fetchData() {
        this.source = axios.CancelToken.source();
        axios.get(`${API_ROOT}/todos`, {
            cancelToken: this.source.token,
            headers: {
                Authorization: `Bearer ${token$.value}`,
            }
        })
            .then(res => {
                

                this.setState({ data: res.data.todos });
            })
            .catch((e) => {
            })
    }

    componentDidMount() {
        this.subscription = token$.subscribe((token) => {
            this.setState({ token });
        });
        this.fetchData();
    }

    componentWillUnmount() {
        this.source.cancel();
        this.subscription.unsubscribe();
    }

    onSubmit(e) {
        e.preventDefault()
        axios.post(`${API_ROOT}/todos`, { content: this.state.content }, {
            cancelToken: this.source.token,
            headers: {
                Authorization: `Bearer ${token$.value}`,
            }
        })
            .then(res => {
                this.fetchData();
                this.setState({
                    content: "",
                })
            })
    }

    onChange(e) {
        this.setState({
            content: e.target.value
        })
    }

    onDelete(id) {
        axios.delete(`${API_ROOT}/todos/` + id, {
            cancelToken: this.source.token,
            headers: {
                Authorization: `Bearer ${token$.value}`,
            }
        })
            .then(res => {
                
                this.fetchData();
            }).catch(err => {
                
                this.fetchData();
            })
    }

    render() {
        let todos = this.state.data;
        const listItems = todos.map((todo) => (<li key={todo.id}>{todo.content}<button onClick={(e) => this.onDelete(todo.id)} data-id={todo.id} className="remove-task"><i className="far fa-trash-alt"></i></button></li>));
        
        if (this.state.token === null) {
            return <Redirect to="/" />;
        }
        
        return (
            <>
                <Helmet>
                    <title>Todos</title>
                </Helmet>

                <div>
                    <TodoList
                        handleSubmit={this.onSubmit}
                        handleOnChange={this.onChange}
                        content={this.state.content}
                    />
                    <ul className="todos">
                        <ReactCSSTransitionGroup
                            transitionName="fade"
                            transitionEnterTimeout={500}
                            transitionLeaveTimeout={500}>
                            {listItems}
                        </ReactCSSTransitionGroup>
                    </ul>

                </div>

            </>
        )
    }

}

export default Todos