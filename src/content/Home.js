import { Box, Button, CircularProgress, Grid, IconButton, Typography } from '@material-ui/core';
import { AddCircleOutline, MeetingRoom, MusicNote } from '@material-ui/icons';
import React,{Component} from 'react';
import { Redirect } from 'react-router';
import PostList from './post';
import PostForm from './PostForm';
import './Styles/homeStyles.css';

const apiUrl = "https://localhost:44377/api/account/check";
export class Home extends Component{
    constructor(props) {
        super(props);
        this.state = { 
            loading: true,
            creatingPost: false, 
            login: false, 
            username: "", 
            role: "", 
            token: localStorage.getItem("token") };
        
        this.signOut = this.signOut.bind(this);
        this.createPost = this.createPost.bind(this);
        //this.setState({ username: localStorage.getItem("username"), token: localStorage.getItem("token")});
        //if(this.state.token !== null) this.setState({login: true});
        // this.onAddPost = this.onAddPost.bind(this);
        // this.onRemovePost = this.onRemovePost.bind(this);
        // this.onEditPost = this.onEditPost.bind(this);
    }

    componentDidMount() {
        if(this.state.token === null) this.signOut();
        else this.check();
    }

    signOut(){
        this.setState({username: "", token: "", role: ""});
        localStorage.removeItem("token");
        this.setState({login: false, loading: false});
    }
    // componentDidUpdate() {
    //     this.check();
    // }
    // componentDidCatch(){
    //     this.check();
    // }
    handleErrors(response){
        if(!response.ok){
            throw Error("error");
        }
        return response;
    }
    check()
    {
        const requestOptions = {
            method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${this.state.token}`
                        }
          }
          fetch(apiUrl, requestOptions)
                    .then(this.handleErrors)
                    .then(response => response.json())
                    .then(data => {
                        this.setState({token: data.token, username: data.username, role: data.role, login: true, loading: false});
                    })
                    .catch(error=>{
                        this.signOut()
                    });
    }
    createPost(){
        if(!this.state.creatingPost)
            this.setState({creatingPost: true});
        else
            this.setState({creatingPost: false});
    }
    render(){
        var signout = this.signOut;
        var createpost = this.createPost;
        return(
            <div>
                {this.state.loading ? <Grid container justify="center" alignItems="center"><CircularProgress></CircularProgress></Grid> :
                
                (!this.state.login) ? <Redirect to="/signin"></Redirect>:
                <div>
                    <Grid container className="header">
                    <Grid container item xs={8} alignItems="center">
                        <MusicNote style={{color: "white", marginLeft: 30}}></MusicNote>
                        <Typography component="h5" variant="h5" style={{color: "white", ontStyle: "italic"}}>Share Your Music, {this.state.username}!</Typography>
                    </Grid>
                    <Grid container item xs={4} justify="flex-end" alignItems="center">
                        {this.state.creatingPost ? null :
                        <IconButton title="Create post" onClick={createpost} style={{color: "white", marginRight: 20}}>
                            <AddCircleOutline></AddCircleOutline>
                        </IconButton>}
                        <IconButton title="Log out" onClick={signout} style={{color: "white", marginRight: 20}}>
                            <MeetingRoom></MeetingRoom>
                        </IconButton>
                    </Grid>
                    </Grid>
                    {this.state.creatingPost ? 
                        <div class="container">
                        <PostForm returnToMain={createpost} token={this.state.token} username={this.state.username}></PostForm>
                        </div>
                    : <PostList token={this.state.token} user={this.state.username} role={this.state.role}></PostList>}
                </div>}
            </div>
        )
    }
}