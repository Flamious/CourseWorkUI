import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./loginStyles";

import CssBaseline from "@material-ui/core/CssBaseline";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import { Redirect } from "react-router";
const apiUrl = "https://localhost:5001/api/account/login";
var User = { 
  username: "",
  token: ""
}
class Login extends Component {
  state = {
    email: "",
    password: "",
    error: null,
    errorOpen: false,
    loggedIn: false,
    rememberMe: false,
    isLoading: false
  };

  errorClose = e => {
    this.setState({
      errorOpen: false
    });
  };

  handleChange = name => e => {
    this.setState({
      [name]: e.target.value
    });
  };


  isValid = () => {
    if (this.state.email.trim() === "" || this.state.password.trim() === "") {
      return false;
    }
    return true;
  };
  submitLogin = e => {
    e.preventDefault();
    var emailValidation = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!emailValidation.test(this.state.email))
    {
      this.setState({
        errorOpen: true,
        error: "E-mail введен неверно"
      });
    }
    else
    {
      this.setState({isLoading: true});
      var details = {
        email: this.state.email,
        password: this.state.password,
      };
      var formBody = [];
      for(var property in details)
      {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
      console.log(details);
      const requestOptions = {
        method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: formBody
      }
      fetch(apiUrl, requestOptions)
                .then(response => response.json())
                .then(data => {
                  if(data.message === "error")
                  {
                    this.setState({
                    errorOpen: true,
                    error: data.error,
                    isLoading: false
                    });
                  }
                  else
                  {
                    User.token = data.token;
                    localStorage.setItem("token", User.token);
                    this.setState({loggedIn: true});
                  }
                });
    }
  };

  render() {
    document.title = "Login - Share Your Music";
    const { classes } = this.props;
    var t = localStorage.getItem("token");
    if(t != null) this.setState({loggedIn: true});
    return (
        <Grid container component="main" className={classes.root}>
          {this.state.loggedIn ? <Redirect to="/"></Redirect> : null}
        <CssBaseline />
        <Grid item xs={false} sm={4} md={7} className={classes.image} />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <LockOutlinedIcon/>
            </Avatar>
            <Typography component="h1" variant="h4">
              Share your music
            </Typography>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <form className={classes.form} onSubmit={() => this.submitLogin}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={this.handleChange("email")}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={this.handleChange("password")}
                autoComplete="current-password"
              />
              {this.state.isLoading ? <Grid container justify="center" style={{marginTop: 5}}>
              <CircularProgress></CircularProgress>
              </Grid> :
              <div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={this.submitLogin}
                disabled={!this.isValid()}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password? We won't help you, lol
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="signup" variant="body2">
                      Sign Up
                  </Link>
                </Grid>
              </Grid>
              </div>}
              {/* <Box mt={5}>
                <Copyright />
              </Box> */}
            </form>
            {this.state.error ? (
            <Snackbar
              variant="error"
              key={this.state.error}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
              }}
              open={this.state.errorOpen}
              onClose={this.errorClose}
              autoHideDuration={3000}
            >
              <SnackbarContent
                className={classes.error}
                message={
                  <div>
                    <span style={{ marginRight: "8px" }}>
                      <ErrorIcon fontSize="large" color="error" />
                    </span>
                    <span> {this.state.error} </span>
                  </div>
                }
                action={[
                  <IconButton
                    key="close"
                    aria-label="close"
                    onClick={this.errorClose}
                  >
                    <CloseIcon color="error" />
                  </IconButton>
                ]}
              />
            </Snackbar>
          ) : null}
          </div>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Login);
