export default ({ store, redirect }) => {
  if (!store.state.user) {
    redirect("/setup");
  }
};
