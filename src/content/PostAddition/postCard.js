import React,{Component} from 'react';
import { withStyles } from "@material-ui/core/styles";
import { styles } from "../Styles/postStyles";
import { Card, CardContent, CardMedia, Collapse, Grid, IconButton, Typography } from '@material-ui/core';
import { Box } from '@material-ui/core';
import { ChatBubble, ChatBubbleOutline, Check, Close, PlayArrow } from '@material-ui/icons';
import Assessment from "./assessment";
import CommentaryList from "./commentary.js";

class Post extends Component {

    constructor(props) {
        super(props);
        this.state={
            data: props.post, 
            imageName: props.post.imageName ?? "default.jpg", 
            token: props.token,
            mouseEntered: false,
            commentsOpened: false,
            user: props.user,
            role: props.role,
            isDeleting: false};

        this.onClick = this.onClick.bind(this);
        this.onMouseEntered = this.onMouseEntered.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onCommentsClick = this.onCommentsClick.bind(this);
        this.setDeleting = this.setDeleting.bind(this);
        this.onDeletePost = this.onDeletePost.bind(this);
    }
    onClick() {
        var a = `${this.state.data.user.userName} - ${this.state.data.content}`;
        this.props.onPlay(this.state.data, a); 
    }
    onMouseEntered(){
        this.setState({mouseEntered: true});
    }
    onMouseLeave(){
        this.setState({mouseEntered: false});
    }
    onCommentsClick(){
        this.setState({commentsOpened: !this.state.commentsOpened});
    }
    setDeleting(){
        if(this.state.isDeleting) this.setState({isDeleting: false});
        else this.setState({isDeleting: true});
    }
    onDeletePost(){
        this.props.onDelete(this.state.data.postId);
    }
    render() {
        const { classes } = this.props;
        return(<div><Card className={classes.cardRoot}>
            <div className={classes.cardDetails}>
                <CardContent className={classes.cardContent}>
                    <Typography component="h5" variant="h5">
                        {this.state.data.content}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {this.state.data.user.userName}
                    </Typography>
                    <Typography variant="subtitle1" color="textSecondary">
                        {this.state.data.creatingDate}
                    </Typography>
                </CardContent>
                    {/* <div className={classes.cardControls}>
                    </div> */}
                     </div>
                    <CardMedia 
                    className={classes.cardCover}
                    image={this.state.imageName === "default.jpg" ? "https://localhost:5001/Default/default.jpg" : `https://localhost:5001/Images/${this.state.imageName}`}
                    title={`${this.state.data.content} by ${this.state.data.user.userName}`}
                    onMouseEnter={this.onMouseEntered}
                    onMouseLeave={this.onMouseLeave}>
                        {this.state.mouseEntered ? <PlayArrow style={{position: "absolute", fontSize: "10em", marginRight: "0"}} onClick={this.onClick}></PlayArrow> : null}
                    </CardMedia>
                    </Card>
                    <Card className={classes.addCardRoot}>
                        <Box borderTop={1} width="100%" borderColor="grey.500">
                            {this.state.isDeleting ? 
                            <Grid container alignItems="center">
                                <Grid container item xs={3} justify="flex-start">
                                    <IconButton onClick={this.setDeleting}>
                                            <Close color="primary"></Close>
                                    </IconButton>
                                </Grid>
                                <Grid container item xs={6} justify="center" alignItems="center">
                                    <Typography variant="subtitle1">Delete post?</Typography>
                                </Grid>
                                <Grid container item xs={3} justify="flex-end">
                                    <IconButton onClick={this.onDeletePost}>
                                            <Check color="error"></Check>
                                    </IconButton>
                                </Grid>
                            </Grid> :
                            <Grid container alignItems="center">
                                <Grid item xs={6}>
                                    <Assessment token={this.state.token} postId={this.state.data.postId}></Assessment>
                                </Grid>
                                <Grid container item direction="row" xs={6} justify="flex-end">
                                    {this.state.data.user.userName === this.state.user || this.state.role === "admin" ?
                                    <IconButton onClick={this.setDeleting} title={`Delete ${this.state.data.content}`} >
                                            <Close></Close>
                                    </IconButton>
                                    : null}
                                    <IconButton onClick={this.onCommentsClick}>
                                        {this.state.commentsOpened ? 
                                            <ChatBubble></ChatBubble> : <ChatBubbleOutline></ChatBubbleOutline>}
                                    </IconButton>
                                </Grid>
                            </Grid>}
                        </Box>
                    </Card>
                    {this.state.commentsOpened ?
                        <Card className={classes.commCardRoot}>
                            <Grid container alignItems="center" style={{marginLeft: 10}}>
                                <Grid item container xs={10} alignItems="center">
                                    <Typography variant="h5" style={{width: 250}}>
                                        {this.state.data.content.length > 20 ? this.state.data.content.substring(0, 17) + '...' : this.state.data.content}
                                    </Typography>
                                    <Typography variant="subtitle1" color="textSecondary">
                                        by {this.state.data.user.userName}
                                    </Typography>
                                </Grid>
                                <Grid item container xs={2} justify="center" alignItmes="center">
                                    <IconButton onClick={this.onCommentsClick} style={{marginRight: "10px"}}>
                                        <Close></Close>
                                    </IconButton>
                                </Grid>
                            </Grid>
                            <CommentaryList user={this.state.user} role={this.state.role} postId={this.state.data.postId} token={this.state.token}/>
                        </Card> : null}
                    </div> )
    }
}

export default withStyles(styles)(Post);