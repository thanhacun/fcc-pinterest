
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

const ImageItem = React.createClass({
  defaultImage: function(ev){
    const placeholderUrl = 'http://placehold.it/200?text=Broken image!';
    console.log('Broken image detected!', ev.target.src);
    ev.target.src = placeholderUrl;
  },
  render: function(){
    const deleteButton = (<button onClick={this.props.delete.bind(null, this.props.image)} className="btn btn-danger">Delete</button>);
    //TODO:later
    const likeBadge = (<button className="btn btn-default">L <span className="badge">{this.props.image.like}</span></button>);
    return (
        <div className="grid-item">
          <div className="image">
            <img src={this.props.image.imgUrl} onError={this.defaultImage}/>
            <p>{this.props.image.imgDes}</p>
          </div>
          <div className="info">
            <div>{this.props.image.user}</div>
            {(this.props.loggedIn && this.props.user.username === this.props.image.user) ? deleteButton: null}
          </div>
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
  
  handleDeleteImage: function(image) {
    console.log('User', image.user, 'want to delete image', image._id);
    this.props.delete_image(image);
  },
  
  render: function() {
    var self= this;
    var user = this.props.user ;
    var images = this.props.images;
    var loggedIn = this.props.loggedIn;
    var showAll = this.props.showAll;
    //var deleteImage = this.handleDeleteImage;
    var imagesRender = images.filter(function(image) {
      if (showAll) {
        //return all images except no URL
        return image.imgUrl;
      } else {
        //return all images of the logged user
        return image.user === user.username && image.imgUrl;
      }
      
    }).map(function(image, key) {
      return ( <ImageItem image={image} delete={self.handleDeleteImage} loggedIn={loggedIn}  user={user} key={"item-" + key} /> );
    });
  
    return (
      //Using react-masonry-component
      <div className="container">
        <div className="page-header">
          <h1>Pinterest like FCC, welcome <span id="display-name">{user.username}</span>!</h1>
          <div className="form-inline">
            {loggedIn ? <button className="btn btn-default" onClick={this.toggleAllImage}>{showAll ? "Mine" : "All"}</button>: null}
            <a className="btn btn-default" href={loggedIn ? "/logout" : "/auth/twitter"}>{loggedIn ? "Logout": "Login"}</a>
          </div>
          {loggedIn ? <UploadForm handleSubmit={this.handleSubmit} ref="uploadValues"/> : null}          
        </div>
        
        <Masonry className='' elementType={'div'} options={masonryOptions} disableImagesLoaded={false} updateOnEachImageLoad={true}>
          {imagesRender}
        </Masonry>
        
        
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
