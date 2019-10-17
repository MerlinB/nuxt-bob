export default ({ store, redirect }) => {
  if (!store.state.userNode) {
    redirect("/setup");
  }
};
