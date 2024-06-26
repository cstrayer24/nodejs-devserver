const newEl = document.createElement("button");
newEl.onclick = (ev) => {
  alert("hello world");
};
newEl.innerText = "click this";
document.body.appendChild(newEl);
