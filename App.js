import DatePicker from "./components/DatePicker/index.js"

function App({ $root }) {
  const $datePicker = new DatePicker({ $container: $root, width: "300" })
  // const $datePicker2 = new DatePicker({ $container: $root, width: "300" })
  this.render = () => {
    $datePicker.render()
    // $datePicker2.render()
  }
}

new App({ $root: document.querySelector("#root") }).render()
