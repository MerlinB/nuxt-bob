export default function({ store, redirect }) {
  if (!store.state.authenticated && !store.state.wallet) {
    return redirect("/login");
  }
}
