import React, { Component } from 'react';
import {
  Row,
  Container,
  Collapse,
  Navbar,
  NavbarToggler,
  Nav,
  NavItem,
  NavLink,
  Button,
  Popover,
  PopoverHeader,
  PopoverBody } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

import Movie from './Movie';


class App extends Component {
  constructor(props) {
    super(props);
    this.toggleNavBar = this.toggleNavBar.bind(this);
    this.togglePopOver = this.togglePopOver.bind(this);
    this.handleClickLikeOn = this.handleClickLikeOn.bind(this);
    this.handleClickLikeOff = this.handleClickLikeOff.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      isOpenNavBar: false,
      isOpenPopOver: false,
      viewOnlyLike: false,
      moviesCount: 0,
      moviesNameList: [],
      movies: [],
      moviesLiked: [],
    };
  }

  // We need to wait until the end of the fetch to render our component
  componentDidMount() {
    var ctx = this;
    fetch('http://localhost:3000/movies')
    .then(function(response){
      return response.json();
    }).then(function(data){
      console.log(data.movies)
      ctx.setState({movies: data.movies});
    }).catch(function(error){
      console.error(error);
    });

    fetch('http://localhost:3000/mymovies')
    .then(function(response){
      return response.json();
    }).then(function(movies) {
      var moviesNameListCopy = movies.data.map((movie) => {
        return movie.title;
      });
      ctx.setState({
        moviesLiked: movies.data,
        moviesCount: movies.data.length,
        moviesNameList: moviesNameListCopy
      });
      console.log('HERE THE MOVIES LIKED',ctx.state.moviesLiked);
    }).catch(function(error) {
      console.error(error);
    });
  };


  toggleNavBar() {
    this.setState({
      isOpenNavBar: !this.state.isOpenNavBar
    });
  }

  togglePopOver() {
    this.setState({
      isOpenPopOver: !this.state.isOpenPopOver
    });
  }

  handleClickLikeOn() {
    console.log("I only want to see the liked films")
    this.setState({
      viewOnlyLike: true
    })
  }

  handleClickLikeOff() {
    console.log("I want to see all the films available")
    this.setState({
      viewOnlyLike: false
    })
  }

  handleClick(isLike, name) {
    // 1) First of all, we want to realize a copy of our state because it is an Array and we do not want to create a simple reference (for arrays and objects) but a real copy.
    var moviesNameListCopy = [...this.state.moviesNameList];

    // 2) If the movie is liked :
    if (isLike) {
      // 2.1) We want to push this specific movie and increment this.state.moviesCout
      moviesNameListCopy.push(name);
      this.setState({
        moviesCount: this.state.moviesCount+1,
        moviesNameList: moviesNameListCopy,
      })
    }
    // 3) If the movie is disliked :
    else {
      // 3.1) We want to target this specific movie, and then splice it
      var index = moviesNameListCopy.indexOf(name)
      moviesNameListCopy.splice(index, 1);
      this.setState({
        moviesCount: this.state.moviesCount-1,
        moviesNameList: moviesNameListCopy,
      })
    }
  }

  render() {

    // Fake test dababase
    // const moviesData = [
    //   {name: 'L\'Odyssée de Pi', desc: 'Après que leur bateau est victime d\'une violente tempête et coule au fond du Pacifique, un adolescent et un tigre du Bengale …', img: '/pi.jpg'},
    //   {name: 'Maléfique', desc: 'Poussée par la vengeance et une volonté farouche de protéger les terres qu\'elle préside, Maléfique place ...', img: '/malefique.jpg'},
    //   {name: 'Les Aventures de Tintin', desc: 'Parce qu\'il achète la maquette d\'un bateau appelé la Licorne, Tintin, un jeune reporter, se retrouve entraîné dans une fantastique aventure...', img: '/tintin.jpg'},
    // ];


    var movieList = this.state.movies.map((movie, i) => {
      var isLiked = false;
      for (var y = 0; y < this.state.moviesLiked.length; y++) {
        if (movie.id === this.state.moviesLiked[y].idMovieDB) {
          isLiked = true;
          break;
        }
      }
      return(<Movie key={i} movieName={movie.title} movieDesc={movie.overview} movieImg={movie.poster_path} displayOnlyLike={this.state.viewOnlyLike} handleClickParent={this.handleClick} idMovie={movie.id} isLiked={isLiked}/>)
    });


    let moviesLast = this.state.moviesNameList.slice(-3)
        if (this.state.moviesCount === 0) {
          moviesLast = "Aucun film sélectionné.";
        } else if (this.state.moviesCount > 3) {
          moviesLast = moviesLast.join(", ") + "...";
        } else {
          moviesLast = moviesLast.join(", ") + ".";
        }

    return (

      <div>

        <div style={{marginBottom: 90}}>
          <Navbar color="dark" dark expand="md" fixed="top">
            <span className="navbar-brand">
              <img src="./logo.png" width="30" height="30" className="d-inline-block align-top" alt="logo myMoviz"/>
            </span>
            <NavbarToggler onClick={this.toggleNavBar} />
            <Collapse isOpen={this.state.isOpenNavBar} navbar>
              <Nav className="" navbar>
                <NavItem>
                  <NavLink onClick={this.handleClickLikeOff} href="#" style={{color: "#FFFFFF"}}>Last Releases</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink onClick={this.handleClickLikeOn} href="#" style={{color: "#FFFFFF", marginRight: 10}}>My Movies</NavLink>
                </NavItem>
                <Button id="Popover1" onClick={this.togglePopOver} color="secondary">{this.state.moviesCount}{this.state.moviesCount > 1 ? ' films' : ' film'}</Button>
                  <Popover placement="bottom" isOpen={this.state.isOpenPopOver} target="Popover1" toggle={this.togglePopOver}>
                    <PopoverHeader>Derniers films</PopoverHeader>
                    <PopoverBody>{moviesLast}</PopoverBody>
                  </Popover>
              </Nav>
            </Collapse>
          </Navbar>
        </div>

        <Container>
          <Row>
            {movieList}
          </Row>
        </Container>

      </div>

    );
  }
}


export default App;
