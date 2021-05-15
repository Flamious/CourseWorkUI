import { Component } from "react";
import { ThumbDown, ThumbDownOutlined, ThumbUp, ThumbUpOutlined } from "@material-ui/icons";
import { CircularProgress, Grid, IconButton, LinearProgress, Typography } from "@material-ui/core";


class Assessment extends Component{
    constructor(props) {
        super(props);
        this.state={
            totalAssess: 0, 
            color: "textPrimary", 
            token: props.token, 
            userAssessment: "none", 
            apiUrl: `https://localhost:5001/api/posts/${props.postId}/assess`,
            isLoading: true};

        console.log(this.state.apiUrl);
        // this.state = { data: props.post, comments: false, editing: false };
        this.postAssessment = this.postAssessment.bind(this);
        this.deleteAssessment = this.deleteAssessment.bind(this);
        this.putLike = this.putLike.bind(this);
        this.putDislike = this.putDislike.bind(this);

        this.style = {
            verticalAlign: "middle",
        }
        //this.onCommentClick = this.onCommentClick.bind(this);
    }

    componentDidMount()
    {
        this.loadData();
    }
    loadData(){
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
                          this.setState({ totalAssess: data.number, userAssessment: data.userAssess, isLoading: false });
                    });
    }

    postAssessment(assess){
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
                            AssessmentString: assess
                        })
          }
          fetch(this.state.apiUrl, requestOptions)
                    .then(response => response.json())
                    .then(data => {
                          this.setState({ totalAssess: data.number, userAssessment: data.userAssess, isLoading: false });
                    });
    }

    deleteAssessment(){
        const requestOptions = {
            method: 'DELETE',
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
                          this.setState({ totalAssess: data, userAssessment: "none", isLoading: false })
                    });
    }

    putLike(){
        this.setState({isLoading: true});
        if(this.state.userAssessment === "True") 
        {
            console.log("delete");
            this.deleteAssessment();
        }
        else 
        {
            console.log("like");
            this.postAssessment("true");
        }
    }
    putDislike(){
        this.setState({isLoading: true}, function(){
            console.log(this.state.isLoading);
            if(this.state.userAssessment === "False") this.deleteAssessment();
            else this.postAssessment("false");
        });
    }

    render() {
        return(
            <div style={{marginRight: "10px", marginLeft: "5px", maxWidth: "120px"}}>
            {this.state.isLoading ? <Grid container justify="center">
            <CircularProgress></CircularProgress>
            </Grid>:
                <Grid container alignItems="center">
                    <Grid item xs={4}>
                    <IconButton onClick={this.putLike}>
                        {this.state.userAssessment === "True" ? <ThumbUp></ThumbUp> : <ThumbUpOutlined></ThumbUpOutlined>}
                    </IconButton>
                    </Grid>
                    <Grid container item xs={4} justify="center">
                        <Typography variant="subtitle1"> {this.state.totalAssess} </Typography>
                        
                    </Grid>
                    <Grid item xs={4}>
                    <IconButton onClick={this.putDislike}>
                        {this.state.userAssessment === "False" ? <ThumbDown></ThumbDown> : <ThumbDownOutlined></ThumbDownOutlined>}
                    </IconButton>
                    </Grid>
    
                </Grid>}
            </div>
        )
    }
}

export default Assessment;