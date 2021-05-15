import React,{Component} from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css'
import "./Styles/audioStyles.css";
// import AudioPlayer from 'material-ui-audio-player';
import { Box, CircularProgress, Grid, Typography } from "@material-ui/core";

import { withStyles } from "@material-ui/core/styles";
import { styles } from "./Styles/postStyles";

import Post from "./PostAddition/postCard";
import { PhotoSizeSelectSmallOutlined } from '@material-ui/icons';
const apiUrl = "https://localhost:5001/api/posts";

class PostsList extends Component {

    constructor(props) {
        super(props);
        this.state = { posts: [], token: (`Bearer ${props.token}`), currentSong: null, songName: null, isLoading: true, user: props.user, role: props.role };
        this.PlaySong = this.PlaySong.bind(this);
        this.setTitle = this.setTitle.bind(this);
        this.onRemovePost = this.onRemovePost.bind(this);
        document.title = "Share Your Music";
        // this.onRemovePost = this.onRemovePost.bind(this);
        // this.onEditPost = this.onEditPost.bind(this);
    }
    setTitle(e){
        document.title = e;
    }
    // загрузка данных
    PlaySong(e, e2){
        this.setState({currentSong: e, songName: e2}, ()=>{this.setTitle(`${this.state.songName} [Share Your Music]`)});
    }
    loadData() {
        const requestOptions = {
            method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': this.state.token,
                        }
          }
          fetch(apiUrl, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                          this.setState({ posts: data, isLoading: false });
                          this.setTitle("Share Your Music")
                    });

    }
    componentDidMount() {
        this.loadData();
    }
    onRemovePost(postId) {
        if (postId) {
            var u = apiUrl + "/" + postId;
            var b = (this.state.role === "admin" ? u + "/admin" : u); 
            this.setState({ isLoading: true, currentSong: null })
            const requestOptions = {
                method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': this.state.token,
                            }
              }
            fetch(b, requestOptions)
            .then(response=>{this.loadData()});
        }
    }
    render() {
        const { classes } = this.props;
        var play = this.PlaySong;
        var userToken = this.state.token;
        var u = this.state.user; var r = this.state.role;
        var _delete = this.onRemovePost;
        return (
            <Box justifyContent="center" width="100%">
            {this.state.currentSong == null ?  null :
            <Box className={classes.audio}>
             <AudioPlayer 
             autoPlay={true} 
             src={`https://localhost:5001/Music/${this.state.currentSong.fileName}`}
             showJumpControls={false}
             hasDefaultKeyBindings={false}
             autoPlayAfterSrcChange={true}
             customProgressBarSection={[
             <Typography component="h5" variant="h5" style={{color: "white"}}>{this.state.songName}</Typography>,
             <div>&nbsp;&nbsp;&nbsp;</div>,
             RHAP_UI.MAIN_CONTROLS, 
             RHAP_UI.PROGRESS_BAR,
             RHAP_UI.CURRENT_TIME,
             <div style={{color: "white"}}>/</div>,
             RHAP_UI.DURATION,
             <div>&nbsp;&nbsp;&nbsp;</div>,
             RHAP_UI.VOLUME]}
             customControlsSection={[]}
             customAdditionalControls={[]}>
             </AudioPlayer>
            </Box> }
                    
            <div width="100%">
            
            {this.state.isLoading ? 
            <Grid container justify="center">
            <CircularProgress style={{marginTop: "55px"}}></CircularProgress>
            </Grid>
            :
            <Grid container justify="center" style={{marginBottom: "55px", marginTop: "55px"}}>
                {
                this.state.posts.length === 0 ? 
                <Typography style={{margin: "20px"}} component="h5" variant="h5">
                    Nothing...<br/>
                    Make the first post!
                </Typography> :
                this.state.posts.map(function (post) {

                    return <Post onDelete={_delete} key={post.postId} post={post} onPlay={play} token={userToken} user={u} role={r} />
                })
                }
            </Grid>}
            </div>
                
            </Box>
        )
    }
}

export default withStyles(styles)(PostsList);