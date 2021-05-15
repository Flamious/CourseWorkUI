import { Box, CircularProgress, Grid, IconButton, Paper, TextField, Typography } from '@material-ui/core';
import { ArrowForwardIos, Check, Close, Edit, Send } from '@material-ui/icons';
import React,{Component} from 'react';

class Commentary extends Component {

    constructor(props) {
        super(props);
        this.state = { data: props.commentary, 
            user: props.user,
            role: props.role,
            isDeleted: false};
        this.deletePost = this.deletePost.bind(this);
        this.editpost = this.editpost.bind(this);
        this.onDelete = props.deleteComment;
        this.onEdit = props.editComment;
    }
    deletePost()
    {
        this.setState({isDeleted: true});
        this.onDelete(this.state.data.commentaryId);
    }
    editpost(){
        this.onEdit(this.state.data.commentaryId, this.state.data.message);
    }
    render() {
        return <div>
            {!this.state.isDeleted ?
            <Box margin="10px">
                
            <Grid container alignItems="center">
            <Grid item xs={2}>
                <IconButton style={{fontSize: "2em"}}>
                    <ArrowForwardIos color="disabled"></ArrowForwardIos>
                </IconButton>
            </Grid>
            <Grid item xs={6} style={{marginleft: 5}}>
                <Typography component="h6" variant="h6">
                    {this.state.data.user.userName}
                </Typography>
            </Grid>
            <Grid item xs={2}>
            {this.state.user === this.state.data.user.userName ?
            <IconButton onClick={this.editpost} style={{fontSize: "2em", marginLeft: 5 }}>
                        <Edit></Edit>
            </IconButton> : null}
            </Grid>
            <Grid item xs={2}>
                {this.state.user === this.state.data.user.userName || this.state.role === "admin" ?
            <IconButton onClick={this.deletePost} style={{fontSize: "2em", marginRight: 10 }}>
                        <Close></Close>
            </IconButton> : null}
            </Grid>
            </Grid>
            <Grid container>
                {/* <Typography component="h6" variant="h5" marginLeft="5" style={{maxWidth: "300"}}>
                        {this.state.data.message}
                </Typography> */}
                <TextField multiline style={{marginLeft: 10, marginRight: 20, width: "100%"}} InputLabelProps={{readOnly: true,}} value={this.state.data.message}>

                </TextField>
            </Grid>
            </Box> : null}
        </div>;
    }
}



class CommenatariesList extends Component {

    constructor(props) {
        super(props);
        this.state = { 
            commentaries: [], 
            apiUrl: `https://localhost:5001/api/posts/${props.postId}/commentaries`, 
            token: props.token, 
            isLoading: true, 
            comm: "", 
            isEnabledComm: false, 
            user: props.user,
            role: props.role, 
            editableCommentId: -1
        };
        this.onCommentaryChange = this.onCommentaryChange.bind(this);
        this.postComment = this.postComment.bind(this);
        this.editComment = this.editComment.bind(this);
        this.deleteComment = this.deleteComment.bind(this);
        this.loadData = this.loadData.bind(this);
        this.setEditableComment = this.setEditableComment.bind(this);
        this.removeEditableComment = this.removeEditableComment.bind(this);
    }
    onCommentaryChange(_value)
    {
        this.setState({comm: _value.target.value, isEnabledComm: _value.target.value.trim()!==""});
    }
    setEditableComment(id, message){
        this.setState({editableCommentId: id, comm: message, isEnabledComm: message.trim()!==""});
    }
    removeEditableComment(){
        this.setState({editableCommentId: -1, comm: "", isEnabledComm: false});
    }
    // загрузка данных
    loadData() {
        const requestOptions = {
            method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        }
          }
          fetch(this.state.apiUrl, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                        console.log(data);
                          this.setState({ commentaries: data, isLoading: false })
                    });
        // fetch(this.props.apiUrl)
        //     .then(response=>response.json())
        //     .then(data=>this.setState({commentaries: data}
        //     ));
    }
    postComment(){
        this.setState({isLoading: true, comm: "", isEnabledComm: false});
        const requestOptions = {
            method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        },
                        body: JSON.stringify({
                            Message: this.state.comm
                        })
          }
          fetch(this.state.apiUrl, requestOptions)
          .then(response => response.json())
          .then(data => {
              console.log(data);
                this.setState({ commentaries: data, isLoading: false })
          });
    }
    editComment(){
        this.setState({isLoading: true, comm: "", isEnabledComm: false});
        const requestOptions = {
            method: 'Put',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        },
                        body: JSON.stringify({
                            Message: this.state.comm
                        })
          }
          fetch(this.state.apiUrl + `/${this.state.editableCommentId}`, requestOptions)
          .then(response => response.json())
                    .then(data => {
                        console.log(data);
                          this.setState({ commentaries: data, isLoading: false });
                          this.removeEditableComment()
                    });
    }
    deleteComment(commId){
        var a = this.state.role === "admin" ? "/admin" : "";
        const requestOptions = {
            method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                            //'Access-Control-Allow-Origin': "*",
                            // 'Access-Control-Allow-Headers': "X-Requested-With",
                            'Authorization': this.state.token,
                        }
          }
          fetch(this.state.apiUrl + `/${commId}` + a, requestOptions)
          .then(response => response.json())
                    .then(data => {
                        console.log(data);
                          this.setState({ commentaries: data, isLoading: false })
                    });
    }
    componentDidMount() {
        this.loadData();
    }
    
    render() {
        var a = this.onCommentaryChange;
        var b = this.postComment;
        var c = this.deleteComment;
        var e = this.editComment;
        var u = this.state.user; var role = this.state.role;
        var r = this.removeEditableComment;
        var s = this.setEditableComment;
        return <div style={{width: "300px"}}>
        {this.state.editableCommentId > 0 ?
        <Grid container style={{marginLeft: "10px", marginRight: "10px"}}>

            <Grid item xs={2}>
            <IconButton onClick={r}>
                    <Close></Close>
            </IconButton>
            </Grid>
            <Grid item xs={7}>
            <TextField multiline onChange={a} label="Edit comment" style={{width: "100%"}} value={this.state.comm} rowsMax="1"></TextField>
            </Grid>
            
            <Grid item xs={3} style={{fontSize: "2em"}}>
                    {this.state.isEnabledComm&& !this.state.isLoading ?
                <IconButton onClick={e} style={{marginLeft: 5}}>
                    <Check></Check>
                </IconButton> : null}
            </Grid>
        </Grid> :
        <Grid container style={{marginLeft: "10px", marginRight: "10px"}}>
<           Grid item xs={9}>
                <TextField multiline onChange={a} label="Comment on..." style={{width: "100%", marginLeft: "10px"}} value={this.state.comm} rowsMax="1"></TextField>
            </Grid>
            <Grid item xs={3} style={{fontSize: "2em"}}>
                    {this.state.isEnabledComm && !this.state.isLoading ?
                <IconButton onClick={b} style={{marginLeft: 5}}>
                    <Send></Send>
                </IconButton> : null}
            </Grid>
        </Grid>}
            {this.state.isLoading ?
            <Grid container justify="center">
            <CircularProgress justify="center"></CircularProgress>
            </Grid>
            :
            this.state.commentaries.length === 0 ? 
            <Typography style={{margin: "10px", marginLeft: 20}} component="h6" variant="h6">
                Nobody's here...<br/>
                Be first to comment!
            </Typography> :
            <Paper style={{height: 255, overflow: 'auto'}}>
                {
                    this.state.commentaries.map(function (commentary) {

                        return <Commentary user={u} role={role} key={commentary.commentaryId} commentary={commentary} deleteComment={c} editComment={s}/>
                    })
                }
            </Paper>}
        </div>;
    }
}

export default CommenatariesList;