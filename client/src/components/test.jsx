import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';

//Note the use of bind here to send parameter

const Test = ({name, thanh_click}) => (
    <div className="test">
        <h1>Hello World! {name}</h1>
        <button onClick={thanh_click.bind(null, name)} className="btn">Flip</button>
    </div>
);

function mapStateToProps(state)  {
    return {
        name: state.testState.name
    };
}

export const TestContainer = connect(mapStateToProps, actionCreators)(Test);

