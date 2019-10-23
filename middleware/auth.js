export default ({ store, redirect }) => {
  if (!store.state.userNodeTx) {
    redirect("/setup");
  }
};
