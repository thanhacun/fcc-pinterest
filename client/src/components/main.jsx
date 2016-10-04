
import { getUser, getImages } from '../reducers/reducer';
//import { Link } from 'react-router';

import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';

import Masonry from 'react-masonry-component';
import {Navbar, Nav, NavItem, FormGroup, FormControl, Button, Badge, Glyphicon} from 'react-bootstrap';

const  masonryOptions = {
  columnWidth: 200,
  itemSelector: '.grid-item',
};

const UploadForm = React.createClass({
  getInitialState: function(){
    return {imgUrl: '', imgDes: ''};
  },
  imgUrlChange: function(ev){
    this.setState({imgUrl: ev.target.value});
  },
  imgDesChange: function(ev){
    this.setState({imgDes:ev.target.value});
  },
  submit: function(){
    this.props.handleSubmit(this.state.imgUrl, this.state.imgDes);
    //form reset
    this.setState({imgUrl: null, imgDes: null});
  },
  render: function(){
    return (
        <Navbar.Form pullLeft>
          <FormGroup>
            <FormControl type="text" id="img-link" name="imgLink" placeholder="Image URL" onChange={this.imgUrlChange} value={this.state.imgUrl}/>
            <FormControl type="text" id="img-des" name="imgDes" placeholder="Image description" onChange={this.imgDesChange} value={this.state.imgDes}/>
            <Button onClick={this.submit} disabled={!this.state.imgUrl || !this.state.imgDes}>Submit</Button>
          </FormGroup>
        </Navbar.Form>
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
    const deleteButton = (<div className="pull-right"><Button bsStyle="danger" onClick={this.props.delete.bind(null, this.props.image)} bsSize="small"><Glyphicon glyph="remove"/></Button></div>);
    //TODO:later
    const likeBadge = (<Button bsSize="small"><Badge>{this.props.image.like}</Badge></Button>);
    return (
        <div className="grid-item">
          <div className="image">
            <img src={this.props.image.imgUrl} onError={this.defaultImage}/>
            <p>{this.props.image.imgDes}</p>
          </div>
          <div className="info">
            <span className="pull-left">{this.props.image.user}</span>
            {(this.props.loggedIn && this.props.user.username === this.props.image.user) ? deleteButton: null}
          </div>
        </div>
      );
  }
});

const Main = React.createClass({
  handleSubmit: function(imgUrl, imgDes) {
    this.props.submit(imgUrl, imgDes);
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
      <div className="container">
        <Navbar>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="#">Pinterest FCC, welcome <span id="display-name">{user.username}</span>!</a>
            </Navbar.Brand>
          </Navbar.Header>
          {loggedIn ? <UploadForm handleSubmit={this.handleSubmit} ref="uploadValues"/> : null}
          
          <Nav pullRight>
            {loggedIn ? <NavItem onClick={this.toggleAllImage}>{showAll ? "Mine" : "All"}</NavItem>: null}
            <NavItem href={loggedIn ? "/logout" : "/auth/twitter"}>{loggedIn ? "Logout": "Login"}</NavItem>
          </Nav>
        </Navbar>
        
        <Masonry className='grid' elementType={'div'} options={masonryOptions} disableImagesLoaded={false} updateOnEachImageLoad={true}>
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
