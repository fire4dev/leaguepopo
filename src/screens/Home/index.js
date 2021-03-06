/* eslint-disable no-undef */
import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Navbar,
  Nav,
  InputGroup,
  DropdownButton,
  Dropdown,
  FormControl,
  ListGroup, Card
} from 'react-bootstrap';

import LeaguePoPoAPI from './../../service/api';

import {
  Link
} from 'react-router-dom';

import './../style/Home.css';
import ServerList from './../../config/api/servers.json';
import Loader from './../../components/Loader';
import ContentLoader from './../../components/ContentLoader';
import Logo from './../../assets/logo.png'
export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      isLoading: true,
      contentIsLoading: true,
      summonerName: null,
      server: 'Servidor',
      championFkList: null,
      summonerData: null
    }
  }

  getServer = (server) => {
    this.setState({ server })
  }

  getSummoner = (summonerName) =>{
    this.setState({ summonerName })
  }

  loader = () => {
    $( document ).ready(() => {
      this.setState({ isLoading: false });
    })
  }

  contentLoader = () => {
    $( document ).ready(() => {
      this.setState({ contentIsLoading: false })
    })
  }

  sendToSummonerV4API = async () => {
    const send_to_api = await LeaguePoPoAPI.get(`api/dashboard/${this.state.server}/${this.state.summonerName}`);
    this.setState({ summonerData: send_to_api.data });
  }

  championV3 = async () => {
    let body = await LeaguePoPoAPI.get('api/champion/freeweek');
    if (body.status !== 200) throw Error(body.statusText);
    return body.data;
  }

  componentDidMount = () => {
    this.loader();
    this.championV3().then(res=>{
      let url = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/";
      let test = res.names.map((body, index) => {
        return (
          <div>
            <ListGroup.Item key={index} className="row">
              <img src={url + body.data.key + '_0.jpg'} alt="Champions Free Week" className="rounded champions-img" />
              <span className="ml-3 champions-name">{body.data.name}</span>
            </ListGroup.Item>
          </div>
        );
      })
      this.setState({ championFkList: test })
      this.contentLoader();
    })
    .catch(err => console.log(err));
  }

  render() { 
    return (
      this.state.isLoading ?
      <Loader/> 
      :
      <div className="App">
        {/** HEADER PART */}
        <div className="header">
          <div className="pt-2 logo-part d-inline-flex px-3">
            <h2 className="logo-text"><a href="/" title="LeaguePoPo">LeaguePoPo</a></h2>
          </div>
          <Navbar expand="lg" className="justify-content-start navmenu" activeKey="/home">
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Início</Nav.Link>
                <Nav.Link eventKey="link-1">Melhores players</Nav.Link>
                <Nav.Link eventKey="link-2">Estatisticas de campeões</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </div>
        {/** HEADER PART END */}
        {/** CONTENT PART */}
        <div className="content container-fluid">
          <div className="row justify-content-center">
            <div>
              <img src={Logo} width="256px" title="LeaguePoPo" alt="LeaguePoPo" />
            </div>
          </div>
          <div className="row justify-content-center my-5">
            <div>
              <InputGroup className="mb-3" >
                <DropdownButton
                  as={InputGroup.Prepend}
                  variant="outline-secondary"
                  title={this.state.server}
                  id="input-group-dropdown-1"
                >
                  {ServerList.Servers.map((res) => 
                    <Dropdown.Item key={res.id} onClick={() => {this.getServer(res.region)}}>{res.serverId}</Dropdown.Item>
                  )}
                </DropdownButton>
                <FormControl name="summonerName" aria-describedby="basic-addon1" placeholder="Invocador" title="Nome do invocador" onChange={(val) => { this.getSummoner(val.target.value) }} />
              </InputGroup>
            </div>
            <div className="ml-3 wrap">
              <Link to={{pathname: `dashboard?server=${this.state.server}&summonerName=${this.state.summonerName}`, params: this.state.summonerData}} onClick={() => this.sendToSummonerV4API()}>
                <button className='btn-go'>
                  Buscar
                </button>
              </Link>
            </div>
          </div>
          <div className="row justify-content-center champions-fk-list">
            <div className="col-md-10">
              <div className="row justify-content-center">
                <h3 style={{ color: '#fff', margin: '5rem 0 5rem 0',}}>Campeões Semanais Grátis</h3>
              </div>
              <ListGroup className="rounded col-md-11 col-11 mx-auto">
                {
                this.state.contentIsLoading?
                  <ListGroup.Item key="1" className="row champions-relative-position">
                    <ContentLoader />
                  </ListGroup.Item>
                    :
                  this.state.championFkList
                }
              </ListGroup>
            </div>
          </div>
        </div>
        {/** CONTENT PART END */}
      </div>
      );
  }
}
