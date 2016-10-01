import React from 'react';

export default React.createClass({
    render: function(){
        return (
            <div className="container">
                  <div className="form-group">
                      <label htmlFor="img-link">Image URL: </label>
                      <input type="text" className="form-control" ref="img_link" id="img-link" name="imgLink" placeholder="http://placehold.it/350x150"/>
                  </div>
                  <div className="form-group">
                      <label htmlFor="img-des">Image Description: </label>
                      <input type="text" className="form-control" ref="img_des" id="img-des" name="imgDes" placeholder="Your impression!"/>
                  </div>
                  <button onClick={this.props.handleSubmit.bind(this)} className="btn btn-default">Submit</button>
            </div>
        );
    }
});

    