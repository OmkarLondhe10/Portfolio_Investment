// Initialize an empty array to hold the goals
let goals = [];
let goalId = 0;  // to uniquely identify goals

// Function to handle adding a new goal
document.getElementById('add-goal').addEventListener('click', function() {
    const goalName = document.getElementById('goal-name').value;
    const targetAmount = parseFloat(document.getElementById('goal-amount').value);
    const duration = parseInt(document.getElementById('goal-duration').value);

    // Validation: Ensure all fields are filled and valid
    if (!goalName || isNaN(targetAmount) || isNaN(duration) || duration <= 0) {
        alert("Please enter valid data for the goal.");
        return;
    }

    // Create a goal object
    const goal = {
        id: goalId++, 
        name: goalName,
        targetAmount: targetAmount,
        duration: duration,
        status: 'In Progress'
    };

    // Add the goal to the goals array
    goals.push(goal);

    // Update the table and reset the form fields
    displayGoals();
    resetForm();
});

// Function to reset the form fields after adding a goal
function resetForm() {
    document.getElementById('goal-name').value = '';
    document.getElementById('goal-amount').value = '';
    document.getElementById('goal-duration').value = '';
}

// Function to display goals in the table
function displayGoals() {
    const tableBody = document.querySelector("#goal-table tbody");
    tableBody.innerHTML = ''; // Clear existing rows

    // Loop through the goals array and create table rows for each goal
    goals.forEach(goal => {
        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${goal.name}</td>
            <td>₹${goal.targetAmount.toFixed(2)}</td>
            <td>${goal.duration} Years</td>
            <td>${goal.status}</td>
            <td>
                <button class="edit-btn" onclick="editGoal(${goal.id})">Edit</button>
                <button class="delete-btn" onclick="deleteGoal(${goal.id})">Delete</button>
            </td>
        `;

        tableBody.appendChild(row);
    });
}

// Function to edit a goal
function editGoal(id) {
    // Find the goal by its ID
    const goal = goals.find(g => g.id === id);

    if (goal) {
        // Pre-fill the form with the existing goal data
        document.getElementById('goal-name').value = goal.name;
        document.getElementById('goal-amount').value = goal.targetAmount;
        document.getElementById('goal-duration').value = goal.duration;

        // Remove the goal from the array (we'll re-add it after editing)
        goals = goals.filter(g => g.id !== id);

        // Change the "Add Goal" button to "Save Changes"
        document.getElementById('add-goal').innerText = "Save Changes";
        document.getElementById('add-goal').removeEventListener('click', addGoal);
        document.getElementById('add-goal').addEventListener('click', function() {
            saveGoalChanges(id);
        });
    }
}

// Function to save changes after editing a goal
function saveGoalChanges(id) {
    const goalName = document.getElementById('goal-name').value;
    const targetAmount = parseFloat(document.getElementById('goal-amount').value);
    const duration = parseInt(document.getElementById('goal-duration').value);

    if (!goalName || isNaN(targetAmount) || isNaN(duration) || duration <= 0) {
        alert("Please enter valid data for the goal.");
        return;
    }

    const updatedGoal = {
        id: id, 
        name: goalName,
        targetAmount: targetAmount,
        duration: duration,
        status: 'In Progress'
    };

    // Find and update the goal
    goals = goals.map(g => g.id === id ? updatedGoal : g);

    // Reset the form and button text
    resetForm();
    document.getElementById('add-goal').innerText = "Add Goal";
    document.getElementById('add-goal').removeEventListener('click', saveGoalChanges);
    document.getElementById('add-goal').addEventListener('click', function() {
        addGoal();
    });

    // Update the table
    displayGoals();
}

// Function to delete a goal
function deleteGoal(id) {
    // Remove the goal from the array based on its ID
    goals = goals.filter(g => g.id !== id);

    // Re-render the goal table
    displayGoals();
}
/*
// Sample goals to initialize the table (optional, can be removed or replaced with actual user input)
goals.push({
    id: goalId++,
    name: "Retirement Fund",
    targetAmount: 500000,
    duration: 20,
    status: "In Progress"
});
goals.push({
    id: goalId++,
    name: "College Fund",
    targetAmount: 200000,
    duration: 10,
    status: "In Progress"
});

// Initially display the goals in the table
displayGoals();
*/