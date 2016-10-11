
import { getUser, getImages, getLoggedIn, getShowAll } from '../reducers/reducer';
//import { Link } from 'react-router';

import React from 'react';
import { connect } from 'react-redux';
import * as actionCreators from '../actions';

import Masonry from 'react-masonry-component';
import {Navbar, Nav, NavItem, Form, FormGroup, FormControl, Button, Glyphicon, Image, NavDropdown, MenuItem, Thumbnail} from 'react-bootstrap';

import Loader from 'react-loader-advanced';
import FontAwesome from 'react-fontawesome';

const  masonryOptions = {
  columnWidth: '.grid-item',
  itemSelector: '.grid-item',
  percentPosition: true,
};

const UploadForm = React.createClass({
  getInitialState: function(){
    return {imgUrl: '', imgDes: '', keepOpen: false};
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
    this.setState({imgUrl: null, imgDes: null, keepOpen: false});
  },
  
  keepOpen: function(isOpen){
    this.setState({keepOpen: true});
  },
  closeDropdown: function(){
    this.setState({keepOpen: false});
  },
  render: function(){
    return (
        <Nav pullLeft>
          <NavDropdown title="Add picture" id="add-picture-dropdown" className={this.state.dropForm} onToggle={this.keepOpen} onClose={this.closeDropdown} open={this.state.keepOpen}>
              <Form >
                <FormControl type="text" id="img-link" name="imgLink" placeholder="Image URL"  onChange={this.imgUrlChange} value={this.state.imgUrl}/>
                <FormControl type="text" id="img-des" name="imgDes" placeholder="Image description" onChange={this.imgDesChange} value={this.state.imgDes}/>
                <Button block onClick={this.submit} disabled={!this.state.imgUrl || !this.state.imgDes}>Submit</Button>
              </Form>
          </NavDropdown>
        </Nav>
      );
  }
});

const ImageItem = React.createClass({
  //TODO: stateless component
  getInitialState: function(){
    return ({brokenImage: false});
  },

  defaultImage: function(ev){
    const placeholderUrl = '/img/broken_image_500.png';
    console.log('Broken image detected!', ev.target.src);
    ev.target.src = placeholderUrl;
    //disable like button
    this.setState({brokenImage: true});
  },
  render: function(){
    const disLikeStatus = this.props.image.like.indexOf(this.props.user.username) === -1;
    const deleteButton = (<span className="pull-right"><Button onClick={this.props.delete.bind(null, this.props.image)}><Glyphicon glyph="remove" className="text-danger"/></Button></span>);
    const likeBadge = (<span className="pull-right">
                          <Button ref="likeBadge" disabled={!this.props.loggedIn || this.state.brokenImage} onClick={this.props.likeToggle.bind(null, this.props.image, this.props.user.username, !disLikeStatus)} >
                            <Glyphicon glyph={disLikeStatus ? "star-empty" : "star"}/><span> {this.props.image.like.length}</span>
                          </Button>
                          
                        </span>);
    return (
        <div className="grid-item col-sm-3 col-xs-4">
          <div className="grid-item-content">
            <div className="image">
              <Image responsive thumbnail src={this.props.image.imgUrl} onError={this.defaultImage} />
              {/*<img className="img-responsive" src={this.state.imgUrl} onError={this.defaultImage} />*/}
              <p>{this.props.image.imgDes}</p>
            </div>
            <div className="info">
              <span className="pull-left">{this.props.image.user}</span>
              {(this.props.loggedIn && this.props.user.username === this.props.image.user) ? deleteButton: null}
              {likeBadge}
            </div>
          </div>
        </div>
      );
  }
});

const Main = React.createClass({
  componentDidMount: function(){
    if (this.props.serverRender) { this.props.reload_images(this.props.images);}
  },
  handleSubmit: function(imgUrl, imgDes) {
    this.props.submit(imgUrl, imgDes, this.props.showAll ? 'all': 'mine');
  },
  
  toggleAllImage: function() {
    this.props.get_all_images(this.props.showAll ? 'mine' : 'all');
  },
  
  handleDeleteImage: function(image) {
    console.log('User', image.user, 'want to delete image', image.imgDes);
    this.props.delete_image(image, this.props.showAll ? 'all': 'mine');
  },
  
  handleLikeToggle: function(image, likeUser, like){
    console.log('User', likeUser, !like ? 'like': 'dislike', 'the image', image.imgDes);
    const userIndex = image.like.indexOf(likeUser);
    if (userIndex === -1) {
      image.like.push(likeUser);
    } else {
      image.like.splice(userIndex, 1);
    }
   
    this.props.like_toggle(image, this.props.showAll ? 'all' : 'mine');
  },
  
   render: function() {
    let self= this;
    let user = this.props.user ;
    let images = this.props.images;
    let loggedIn = this.props.loggedIn;
    let showAll = this.props.showAll;
    let serverRender = this.props.serverRender;
    const imagesRender = serverRender ? [] : images.map(function(image, key) {
      return ( <ImageItem image={image} delete={self.handleDeleteImage} loggedIn={loggedIn}  likeToggle={self.handleLikeToggle} user={user} key={"item-" + key} ref="test"/> );
    });
    
    if(this.props.loading){ console.log(this.props.loading); }
    const spinner = (<FontAwesome name="spinner" size="3x" spin />);
    
    return (
      <Loader show={!!this.props.loading} message={spinner}>
        <div className="container">
          <Navbar fluid={true}>
            <Navbar.Header>
              <Navbar.Brand>
                <a href="#">Welcome <span id="display-name">{user.username}</span>!</a>
              </Navbar.Brand>
            </Navbar.Header>
            {loggedIn ? <UploadForm handleSubmit={this.handleSubmit} ref="uploadValues"/> : null}
            
            <Nav pullRight>
              {loggedIn ? <NavItem onClick={this.toggleAllImage}>{showAll ? "Mine" : "All"}</NavItem>: null}
              <NavItem href={loggedIn ? "/logout" : "/auth/twitter"}>{loggedIn ? "Logout": "Login"}</NavItem>
            </Nav>
          </Navbar>
          
            <Masonry className='grid' elementType={'div'} options={masonryOptions} disableImagesLoaded={false} updateOnEachImageLoad={false}>
              <div>{imagesRender}</div>
            </Masonry>
            
        </div>
      </Loader>
      ); 
  }
});

Main.propTypes = {
  user: React.PropTypes.object,
  images: React.PropTypes.array,
  loggedIn: React.PropTypes.bool,
  showAll: React.PropTypes.bool,
};

function mapStateToProps(state) {
  return {
    user: getUser(state.originalState),
    images: getImages(state.originalState),
    loggedIn: getLoggedIn(state.originalState),
    showAll: getShowAll(state.originalState),
    loading: state.originalState.loading,
    serverRender: state.originalState.serverRender,
    renderImages: state.originalState.renderImages
  };
}

export const MainComponent = Main;
export const MainContainer = connect(mapStateToProps, actionCreators)(Main);
