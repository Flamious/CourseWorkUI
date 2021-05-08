import { Box, Button, Card, CardContent, CardMedia, CircularProgress, Grid, IconButton, Input, Typography } from '@material-ui/core';
import { ArrowForwardIos, Close } from '@material-ui/icons';
import React,{Component} from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';

var apiUrl = "https://localhost:44377/api/posts";
var apiUrlFiles = apiUrl + "/files";
export default class PostForm extends Component{
    constructor(props) {
        super(props);
        this.state = { token: (`Bearer ${props.token}`), 
        songName: "", 
        songFileName: null, 
        imageFileName: null, 
        username: props.username, 
        songFile: null, 
        imageFile: null,
        isSongLoading: false,
        isImageLoading: false,
        isNameSet: false,
        isPostLoading: false
        };
        document.title = "New post - Share Your Music";
        this.onSongFileChange = this.onSongFileChange.bind(this);
        this.postSong = this.postSong.bind(this);
        this.deleteSong = this.deleteSong.bind(this);

        this.onImageFileChange = this.onImageFileChange.bind(this);
        this.postImage = this.postImage.bind(this);
        this.deleteImage = this.deleteImage.bind(this);

        this.setName = this.setName.bind(this);
        this.onNameChange = this.onNameChange.bind(this);

        this.cancel = this.cancel.bind(this);
        this.createPost = this.createPost.bind(this);
        // this.onEditPost = this.onEditPost.bind(this);
    }
    cancel(){
        if(this.state.songFileName !== null)
        {
            const requestOptionsSong = {
                method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': this.state.token,
                            },
            }
              fetch(apiUrlFiles + "/music/" + this.state.songFileName, requestOptionsSong);
        }
        if(this.state.imageFileName !== null)
        {
            const requestOptionsImage = {
                method: 'DELETE',
                            headers: {
                                'Accept': 'application/json',
                                'Authorization': this.state.token,
                            },
            }
            fetch(apiUrlFiles + "/image/" + this.state.imageFileName, requestOptionsImage);
        }
        this.props.returnToMain();
    }
    onSongFileChange(e){
        this.setState({songFile: e.target.files[0]});
    }
    onImageFileChange(e){
        this.setState({imageFile: e.target.files[0]});
    }
    onNameChange(e){
        this.setState({songName: e});
    }
    setName(){
        if(this.state.isNameSet)
        this.setState({isNameSet: false});
        else
        this.setState({isNameSet: true});
        console.log(this.state.songName);
    }
    postSong(){
        this.setState({isSongLoading: true});
        var formBody = new FormData();
        formBody.append("uploadedFile", this.state.songFile);
        const requestOptions = {
            method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        },
                        body: formBody,
          }
          fetch(apiUrlFiles + "/music", requestOptions)
          .then(response => response.json())
          .then(data => {
              if(data !== "No user" && data !== "No file")
                this.setState({songFileName: data, isSongLoading: false});
          });
    }
    deleteSong(){
        this.setState({isSongLoading: true});
        const requestOptions = {
            method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': this.state.token,
                        },
          }
          fetch(apiUrlFiles + "/music/" + this.state.songFileName, requestOptions)
          .then(response => {
              if(response.ok) this.setState({songFileName: null, isSongLoading: false});
           });
    }
    postImage(){
        this.setState({isImageLoading: true});
        var formBody = new FormData();
        formBody.append("uploadedFile", this.state.imageFile);
        const requestOptions = {
            method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        },
                        body: formBody,
          }
          fetch(apiUrlFiles + "/image", requestOptions)
          .then(response => response.json())
          .then(data => {
              if(data !== "No user" && data !== "No file")
                this.setState({imageFileName: data, isImageLoading: false});
          });
    }
    deleteImage(){
        this.setState({isImageLoading: true});
        const requestOptions = {
            method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Authorization': this.state.token,
                        },
          }
          fetch(apiUrlFiles + "/image/" + this.state.imageFileName, requestOptions)
          .then(response => {
              if(response.ok) this.setState({imageFileName: null, isImageLoading: false});
           });
    }
    createPost(){
        this.setState({isPostLoading: true});
        var formBody = new FormData();
        formBody.append("songName", this.state.songName);
        formBody.append("songPath", this.state.songFileName);
        if(this.state.imageFileName !== null) formBody.append("imagePath", this.state.imageFileName);
        const requestOptions = {
            method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        },
                        body: formBody,
          }
          fetch(apiUrl, requestOptions)
          .then(response => {
              if(response.ok) this.props.returnToMain();
              else this.setState({isPostLoading: false})
           });
    }
    isValid = () => {
        if (this.state.songName.trim() === "") {
          return false;
        }
        return true;
      };
    render(){
        return(
            <Grid container justify="center" style={{marginTop: "55px"}}>
                
                <Grid container>
                    <Grid container item xs={4} justify="center">
                        <Card style={{margin: 10, boxShadow: "0 1px 5px black"}}>
                            <Typography variant="h5" component="h5" style={{margin: 10, marginBottom: 0}}>Choose song*</Typography>
                            <Typography variant="subtitle1" component="subtitle1" style={{margin: 10, marginTop: 0}}>.mp3, .ogg</Typography>
                            <Grid container alignItems="center" style={{margin: 10}}>
                                <Grid container item xs={10} justify="flex-end">
                                    <Input disabled={this.state.songFileName !== null} type="file" inputProps={{accept: 'audio/mp3, audio/ogg' }} onChange={e=>this.onSongFileChange(e)}></Input>
                                </Grid>
                            <Grid container item xs={2} justify="flex-start">
                            {this.state.isSongLoading ? <CircularProgress></CircularProgress>
                            : 
                            this.state.songFileName === null ?
                            <IconButton disabled={this.state.songFile==null} title="Upload song" onClick={this.postSong}>
                                <ArrowForwardIos></ArrowForwardIos>
                            </IconButton>
                            : 
                            <IconButton disabled={this.state.isPostLoading} title="Delete song" onClick={this.deleteSong}>
                                <Close></Close>
                            </IconButton>}
                        </Grid>
                        </Grid>
                        </Card>
                    </Grid>
                    <Grid item xs={4}>
                    <Card style={{margin: 10, boxShadow: "0 1px 5px black"}}>
                            <Typography variant="h5" component="h5" style={{margin: 10}}>Name song*</Typography>
                            <Typography variant="subtitle1" component="subtitle1" style={{margin: 10, marginTop: 0}}>Up to 30 characters</Typography>

                            <Grid container alignItems="center" style={{margin: 10}}>
                                <Grid container item xs={10} justify="flex-end">
                                    <Input inputProps={{maxLength: '30'}} style={{width: "100%"}} disabled={this.state.isNameSet} value={this.state.songName} type="text" onChange={e=>this.onNameChange(e.target.value)}></Input>
                                </Grid>
                            <Grid container item xs={2} justify="flex-start">
                            {!this.state.isNameSet ?
                            <IconButton disabled={!this.isValid()} title="Set name" onClick={this.setName}>
                                <ArrowForwardIos></ArrowForwardIos>
                            </IconButton>
                            : 
                            <IconButton disabled={this.state.isPostLoading} title="Change name" onClick={this.setName}>
                                <Close></Close>
                            </IconButton>}
                        </Grid>
                        </Grid>
                        </Card>
                    </Grid>
                    <Grid container item xs={4} justify="center">
                        <Card style={{margin: 10, boxShadow: "0 1px 5px black"}}>
                            <Typography variant="h5" component="h5" style={{margin: 10, marginBottom: 0}}>Choose image</Typography>
                            <Typography variant="subtitle1" component="subtitle1" style={{margin: 10, marginTop: 0}}>.png, .jpg</Typography>

                            <Grid container alignItems="center" style={{margin: 10}}>
                                <Grid container item xs={10} justify="flex-end">
                                    <Input disabled={this.state.imageFileName !== null || this.state.isPostLoading} type="file" inputProps={{accept: 'image/jpeg, image/png' }} onChange={e=>this.onImageFileChange(e)}></Input>
                                </Grid>
                            <Grid container item xs={2} justify="flex-start">
                            {this.state.isImageLoading ? <CircularProgress></CircularProgress>
                            : 
                            this.state.imageFileName === null ?
                            <IconButton disabled={this.state.imageFile===null || this.state.isPostLoading} title="Upload image" onClick={this.postImage}>
                                <ArrowForwardIos></ArrowForwardIos>
                            </IconButton>
                            : 
                            <IconButton disabled={this.state.isPostLoading} title="Delete image" onClick={this.deleteImage}>
                                <Close></Close>
                            </IconButton>}
                        </Grid>
                        </Grid>
                        </Card>
                    </Grid>
                    <Grid container item xs={6}>
                        <Card style={{margin: 10, width: "100%", boxShadow: "0 1px 5px black"}}>
                            <Button disabled={this.state.isPostLoading} variant="contained" disableElevation fullWidth onClick={this.cancel}>Cancel</Button>
                        </Card>
                    </Grid>
                    <Grid container item xs={6}>
                    <Card style={{margin: 10, width: "100%", boxShadow: "0 1px 5px black"}}>
                            <Button disabled={this.state.songFileName === null || !this.state.isNameSet|| this.state.isPostLoading} variant="contained" color="primary" disableElevation fullWidth onClick={this.createPost}>Admit</Button>
                        </Card>
                    </Grid>
                </Grid>
            
            
                <Card style={{display: 'flex', marginTop: 10, marginLeft: 10, marginRight: 10, height: 150, boxShadow: "0 1px 5px black"}}>
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        <CardContent style={{flex: '1 0 auto'}}>
                            <Typography component="h5" variant="h5">
                            {this.state.songName}
                            </Typography>
                            <Typography component="subtitle1" color="textSecondary">
                            {this.state.username}
                            </Typography>
                        </CardContent>
                    </div>
                    <CardMedia 
                    style={{width: 150}}
                    image={this.state.imageFileName === null ? "https://localhost:44377/Default/default.jpg" : `https://localhost:44377/Images/${this.state.imageFileName}`}
                    title={`${this.state.songName} by ${this.state.username}`}>
                    </CardMedia>
                </Card>
            {this.state.songFileName == null ?  null :
            <Box style={{position: 'fixed', zIndex: 1000, bottom: 0, left: 0, width: '100%'}}>
             <AudioPlayer
             autoPlay={false} 
             src={`https://localhost:44377/Music/${this.state.songFileName}`}
             showJumpControls={false}
             hasDefaultKeyBindings={false}
             autoPlayAfterSrcChange={true}
             customProgressBarSection={[
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
            </Grid>
            

        )
    }
}