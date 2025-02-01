const habitNameInput = document.getElementById("habit-name");
const newCategory = document.getElementById("new-category");
const habitCategory = document.getElementById("habit-category");
const habitForm = document.getElementById("habit-form");
const habitsList = document.getElementById("habits-list");
const categoryList = document.getElementById("category-list");
const categoryForm = document.getElementById("category-form");
const totalHabits = document.getElementById("total-habits");
const completedHabitsElement = document.getElementById("completed-habits");

let habits = [];
let categories = [];

// Add Habit Form Submission
habitForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const habitName = habitNameInput.value.trim();
    const selectedCategory = habitCategory.value;

    if (habitName === '' || selectedCategory === '') {
        alert("Please enter a habit and select a category");
        return;
    }

    habits.push({ name: habitName, category: selectedCategory, completed: false });
    habitNameInput.value = '';
    habitCategory.value = ''; // Reset dropdown to default
    renderHabits();
    updateTotalHabits();
    updateHabitsCompletedToday();
    updateCircularProgress()
});

// Render Habits
function renderHabits() {
    habitsList.innerHTML = '';
    habits.forEach((habit, index) => {
        const habitDiv = document.createElement('div');
        habitDiv.classList.add('habit');

        // Habit name and category
        const habitName = document.createElement('span');
        habitName.textContent = habit.name;
        if (habit.completed) {
            habitName.style.textDecoration = 'line-through';
        }

        const habitCategory = document.createElement('span');
        habitCategory.textContent = ` (${habit.category})`;
        habitCategory.style.fontStyle = 'italic';
        habitCategory.style.marginLeft = '10px';

        // "Mark as Complete" button
        const completeButton = document.createElement('button');
        completeButton.classList.add('complete-button');
        completeButton.textContent = habit.completed ? 'Completed' : 'Mark as Complete';
        completeButton.addEventListener('click', () => {
            toggleHabitCompletion(index);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('edit-button');
        editButton.textContent = 'Edit';
      
        editButton.addEventListener('click', () => {
            startEditingHabit(index, habitDiv, habitName);
        });

        // "Delete" button
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.classList.add('delete-button');
     
        deleteButton.addEventListener('click', () => {
            deleteHabit(index);
        });

        habitDiv.appendChild(habitName);
        habitDiv.appendChild(habitCategory);
        habitDiv.appendChild(completeButton);
        habitDiv.appendChild(deleteButton);
        habitsList.appendChild(habitDiv);
        habitDiv.appendChild(editButton);

         // Replace the habit name and edit button with the input and save button
    })
}
function startEditingHabit(index,habitDiv,habitNameElement){
    const inputField=document.createElement('input');
    inputField.type="text";
    inputField.value=habits[index].name
  
    const saveButton = document.createElement('button');
    saveButton.classList.add('save-button'); 
    saveButton.textContent = 'Save';
    const completeButton = habitDiv.querySelector('.complete-button');
    if (completeButton) {
        completeButton.style.display = 'none'; // Hide the button
    }

     // Replace the habit name and edit button with the input and save button
     habitDiv.replaceChild(inputField, habitNameElement);
     const editButton = habitDiv.querySelector('button:nth-child(4)'); // Assuming edit button is the 4th child
     habitDiv.replaceChild(saveButton, editButton);
     saveButton.addEventListener('click', () => {
        const newName = inputField.value.trim();
        if (newName) {
            habits[index].name = newName; // Update the habit name in the array
            renderHabits(); // Re-render the habit list
        } else {
            alert('Habit name cannot be empty!');
        }
    });

}
// Toggle Habit Completion
function toggleHabitCompletion(index) {
    habits[index].completed = !habits[index].completed;
    renderHabits();
    updateHabitsCompletedToday();
    updateCircularProgress() 
}

// Delete Habit
function deleteHabit(index) {
    habits.splice(index, 1);
    renderHabits();
    updateTotalHabits();
    updateHabitsCompletedToday();
    updateCircularProgress()
}

// Add Category Form Submission
categoryForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const newOption = newCategory.value.trim();
    if (newOption) {
        categories.push(newOption);
        newCategory.value = '';
        updateHabitCategoryDropdown();
        renderCategories();
    } else {
        alert("Please enter a valid category");
    }
});

// Update Habit Category Dropdown
function updateHabitCategoryDropdown() {
    habitCategory.innerHTML = '<option value="" disabled selected>Select a category</option>';
    categories.forEach((category) => {
        const categoryElement = document.createElement('option');
        categoryElement.textContent = category;
        categoryElement.value = category;
        habitCategory.appendChild(categoryElement);
    });
}

// Render Categories in Category List
function renderCategories() {
    categoryList.innerHTML = '';
    categories.forEach((category) => {
        const categoryElement = document.createElement('div');
        categoryElement.textContent = category;
        categoryElement.classList.add('category-item');
        categoryList.appendChild(categoryElement);
    });
}

// Update Total Habits Count
function updateTotalHabits() {
    totalHabits.textContent = habits.length;
}

// Update Completed Habits Count
function updateHabitsCompletedToday() {
    const completedCount = habits.filter((habit) => habit.completed).length;
    completedHabitsElement.textContent = completedCount;
}

// Initialize Categories Dropdown
updateHabitCategoryDropdown();
const darkModeToggle=document.getElementById("dark-mode-toggle");
if (localStorage.getItem("theme")==='dark'){
    document.body.classList.add("dark-mode")
}
darkModeToggle.addEventListener('click',()=>{
    document.body.classList.toggle('dark-mode'); // Toggle the class
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
})


function updateCircularProgress() {
    const totalHabits = habits.length;
    const completedHabits = habits.filter(habit => habit.completed).length;
    const progressPercentage = totalHabits > 0 ? (completedHabits / totalHabits) * 100 : 0;

    // Update the circle's stroke-dashoffset
    const progressCircle = document.getElementById('progress-circle');
    const offset = 100 - progressPercentage; // SVG stroke-dashoffset calculation
    progressCircle.style.strokeDashoffset = offset;

    // Update the progress text
    const progressText = document.getElementById('progress-text');
    progressText.textContent = `${Math.round(progressPercentage)}%`;
}