export const styles = theme => ({
  audio: {
    position: 'fixed',
    zIndex: 1000,
    bottom: 0,
    left: 0,
    width: '100%',
  },
  cardRoot:{
    display: 'flex',
    marginTop: 10,
    marginLeft: 10,
    marginRight: 10,
    height: 150,
    boxShadow: "0 1px 5px black",
  },
  addCardRoot:{
    display: 'flex',
    marginBottom: 10,
    marginTop: 2,
    marginLeft: 10,
    marginRight: 10,
    boxShadow: "0 1px 5px black",
  },
  commCardRoot:{
    position: 'fixed',
    height: 350,
    width: 300,
    right: 5,
    bottom: 60,
    zIndex: 1200,
    boxShadow: "0 1px 5px black",
  },
  cardDetails:{
    display: 'flex',
    flexDirection: 'column',
  },
  cardContent:{
    flex: '1 0 auto',
  },
  cardCover:{
    width: 150,
  },
  cardControls:{
    display: 'flex',
    alignItems: 'center',
    paddinfLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
});

