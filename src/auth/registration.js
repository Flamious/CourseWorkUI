import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./registrationStyles";

import CssBaseline from "@material-ui/core/CssBaseline";
import { Button, CircularProgress, Typography } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import IconButton from "@material-ui/core/IconButton";
import ErrorIcon from "@material-ui/icons/Error";
import CloseIcon from "@material-ui/icons/Close";
import { Redirect } from "react-router";
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Container from '@material-ui/core/Container';

const apiUrl = "https://localhost:5001/api/account/register";
class Registration extends Component {
  state = {
    username: "",
    email: "",
    password: "",
    passwordConfrim: "",
    error: null,
    errorOpen: false,
    registered: false,
    isLoading: false,
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

  passwordMatch = () => this.state.password === this.state.passwordConfrim;


  isValid = () => {
    if (this.state.email.trim() === "" || this.state.username.trim() === "" || this.state.password.trim() === "" || this.state.passwordConfrim.trim() === "") {
      return false;
    }
    return true;
  };
  submitRegistration = e => {
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
    if (!this.passwordMatch()) {
      this.setState({
        errorOpen: true,
        error: "Пароли не совпадают"
      });
    }
    else
    {
      this.setState({isLoading: true});
      var details = {
        username: this.state.username,
        email: this.state.email,
        password: this.state.password,
        passwordConfirmed: this.state.passwordConfrim
      };
      var formBody = [];
      for(var property in details)
      {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
      }
      formBody = formBody.join("&");
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
                    this.setState({registered: true});
                  }
                });
    }
  };

  render() {
    const { classes } = this.props;
    document.title = "Signup - Share Your Music";
    var t = localStorage.getItem("token");
    if(t != null) this.setState({registered: true});
    return (
      <Container component="main" maxWidth="xs">
      <CssBaseline />
      {(this.state.registered) ? <Redirect to="/signin"></Redirect> : null}
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h4">
            Share your music
          </Typography>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} onSubmit={() => this.submitRegistration} >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                onChange={this.handleChange("username")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={this.handleChange("email")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={this.handleChange("password")}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="passwordconfirmed"
                label="Confirm password"
                type="password"
                id="passwordconfirmed"
                autoComplete="current-password"
                onChange={this.handleChange("passwordConfrim")}
              />
            </Grid>
          </Grid>
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
            onClick={this.submitRegistration}
            disabled={!this.isValid()}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="/signin" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          </div>}
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
      </Container>
    );
  }
}

export default withStyles(styles)(Registration);
