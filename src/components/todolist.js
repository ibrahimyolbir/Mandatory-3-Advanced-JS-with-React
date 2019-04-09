import React, { Component } from 'react';

class TodoList extends Component {
    render() {
        return (    
            <div className="">
                <header className="main-header">
                    <h1>todo<span>list</span></h1>
                    <h2>Mandatory - 3 Advanced JS with React</h2>
                </header>
                <form  onSubmit={this.props.handleSubmit}>
                    <div className="todo__header">
                        <input 
                            onChange={this.props.handleOnChange}
                            value = {this.props.content}
                            autoFocus={true}
                            type="text" 
                            className="validate" />
                        {/* <button type="submit"><i className="fa fa-fw fa-plus"></i></button> */}
                    </div>
                </form>
            </div>
        )
    }

}

export default TodoList
 