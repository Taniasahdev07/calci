function addTask() {
    let input = document.getElementById("taskInput");
    let task = input.value;

    if (task === "") return;

    let li = document.createElement("li");
    li.innerText = task;

    // click to remove
    li.onclick = function () {
        this.remove();
    };

    document.getElementById("taskList").appendChild(li);

    input.value = "";
}