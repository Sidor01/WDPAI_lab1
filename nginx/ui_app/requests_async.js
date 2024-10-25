async function sendPostRequest() {
    const firstName = document.querySelector('input[id="first_name"]').value;
    const lastName = document.querySelector('input[id="last_name"]').value;
    const role = document.querySelector('select[id="role"]').value;

    const data = {
        first_name: firstName,
        last_name: lastName,
        role: role
    };

    try {
        const response = await fetch("http://localhost:8000/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const result = await response.json();
        console.log("User added:", result);
        fetchItems();
    } catch (error) {
        console.error('Error:', error);
    }
}

document.querySelector('.submit_button').addEventListener('click', (event) => {
    event.preventDefault();
    sendPostRequest();
});

async function fetchItems() {
    const url = "http://localhost:8000/";

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log("Fetched items:", data);

        if (Array.isArray(data)) {
            displayItems(data);
        } else {
            console.error('Expected an array, but got:', data);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}



function displayItems(items) {
    const itemList = document.getElementById("user_list");
    itemList.innerHTML = "";

    items.forEach((item, index) => {
        const listItem = document.createElement("li");
        listItem.className = "user_item";
        listItem.textContent = `${item.first_name} ${item.last_name} (${item.role})`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete_button";
        deleteButton.onclick = function () {
            deleteItem(index);
        };

        listItem.appendChild(deleteButton);
        itemList.appendChild(listItem);
    });
}


async function deleteItem(index) {
    try {
        const response = await fetch(`http://localhost:8000/${index}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status}`);
        }

        const result = await response.json();
        console.log("User deleted:", result);

        fetchItems();
    } catch (error) {
        console.error('Error:', error);
    }
}

fetchItems();
