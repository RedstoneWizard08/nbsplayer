import { render } from "preact";
import { NBSPlayer } from "./NBSPlayer";

const container = document.getElementById("root") as HTMLDivElement;

render(<NBSPlayer />, container);

console.log("Render complete!");
