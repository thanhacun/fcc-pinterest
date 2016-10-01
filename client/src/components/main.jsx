
import { getUser, getImages } from '../reducers/reducer';
//import { Link } from 'react-router';

import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';
import Masonry from 'react-masonry-component';

const  masonryOptions = {
  columnWidth: 200,
  itemSelector: '.grid-item',
};

const UploadForm = React.createClass({
  render: function(){
    return (
        <div className="form-inline">
          <h3>Upload image</h3>
          <div className="form-group">
              <label htmlFor="img-link" className="sr-only">Image URL</label>
              <input type="text" className="form-control" ref="img_link" id="img-link" name="imgLink" placeholder="Image URL"/>
          </div>
          <div className="form-group">
              <label htmlFor="img-des" className="sr-only">Description</label>
              <input type="text" className="form-control" ref="img_des" id="img-des" name="imgDes" placeholder="Image description"/>
          </div>
          <button onClick={this.props.handleSubmit} className="btn btn-default">Submit</button>
        </div>
      );
  }
});

const Main = React.createClass({
  handleSubmit: function() {
    let uploadValues = this.refs.uploadValues;
    this.props.submit(uploadValues.refs.img_link.value, uploadValues.refs.img_des.value);
    //cleanup the form
    uploadValues.refs.img_link.value = "";
    uploadValues.refs.img_des.value = "";
  },
  toggleAllImage: function() {
    this.props.toggle();
  },
  
  render: function() {
    var user = this.props.user ;
    var images = this.props.images;
    var loggedIn = this.props.loggedIn;
    var showAll = this.props.showAll;
    var imagesRender = images.filter(function(image) {
      if (showAll) {
        //return all images except no URL
        return image.imgUrl;
      } else {
        //return all images of the logged user
        return image.user === user.username && image.imgUrl;
      }
      
    }).map(function(image) {
      //Using react-masonry-component
      return (
          <div className="grid-item" key={image._id}>
            <div className="image">
              <img src={image.imgUrl}/>
              <p>{image.imgDes}</p>
            </div>
            <div className="info">
              <p>{image.user}</p>
            </div>
          </div>
        );
    });
  
    return (
      <div className="container">
        <div className="page-header">
          <h1>Pinterest like FCC, welcome <span id="display-name">{user.username}</span>!</h1>
          <div className="form-inline">
            {loggedIn ? <button className="btn btn-default" onClick={this.toggleAllImage}>{showAll ? "Mine" : "All"}</button>: null}
            <a className="btn btn-default" href={loggedIn ? "/logout" : "/auth/twitter"}>{loggedIn ? "Logout": "Login"}</a>
          </div>
          {loggedIn ? <UploadForm handleSubmit={this.handleSubmit} ref="uploadValues"/> : null}          
          
        </div>
        
        <div className="container_bak">
          <Masonry className='' elementType={'div'} options={masonryOptions} disableImagesLoaded={false} updateOnEachImageLoad={false}>
            {imagesRender}
          </Masonry>
        </div>
        
        
      </div>
    ); 
  }
});

Main.propTypes = {
  user: React.PropTypes.object,
  images: React.PropTypes.array,
  loggedIn: React.PropTypes.bool,
  showAll: React.PropTypes.bool,
  //submit: React.PropTypes.function,
  //toggle: React.PropTypes.function,
};

function mapStateToProps(state) {
  return {
    user: getUser(state.originalState),
    images: getImages(state.originalState),
    loggedIn: state.originalState.loggedIn,
    showAll: state.originalState.showAll
  };
}

export const MainComponent = Main;
export const MainContainer = connect(mapStateToProps, actionCreators)(Main);
