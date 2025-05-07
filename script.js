const wedboxData = {
    'wedbox1': {
        thumbnail: 'images/1.jpg',
        carousel: [
            'images/img/1.1.jpg',
            'images/img/1.2.jpg',
            'images/img/1.3.jpg',
            'images/img/1.4.jpg'
        ]
    },
    'wedbox2': {
        thumbnail: 'images/2.jpg',
        carousel: [
            'images/img/2.1.jpg',
            'images/img/2.2.jpg',
            'images/img/2.3.jpg',
            'images/img/2.4.jpg'
        ]
    },
    'wedbox3': {
        thumbnail: 'images/3.jpg',
        carousel: [
            'images/img/3.1.jpg',
            'images/img/3.2.jpg',
            'images/img/3.3.jpg',
            'images/img/3.4.jpg'
        ]
    },
    'wedbox4': {
        thumbnail: 'images/4.jpg',
        carousel: [
            'images/img/4.1.jpg',
            'images/img/4.2.jpg',
            'images/img/4.3.jpg',
            'images/img/4.4.jpg'
        ]
    },
    'wedbox5': {
        thumbnail: 'images/5.jpg',
        carousel: [
            'images/img/5.1.jpg',
            'images/img/5.2.jpg',
            'images/img/5.3.jpg',
            'images/img/5.4.jpg'
        ]
    },
    'wedbox6': {
        thumbnail: 'images/6.jpg',
        carousel: [
            'images/img/6.1.jpg',
            'images/img/6.2.jpg',
            'images/img/6.3.jpg',
            'images/img/6.4.jpg'
        ]
    }
};

function renderThumbnail(wedboxId) {
    const data = wedboxData[wedboxId];
    return `
        <div class="thumbnail-container">
            <img src="${data.thumbnail}" alt="${wedboxId} thumbnail" class="thumbnail-image">
        </div>
    `;
}

function openCarousel(wedboxId, startIndex) {
    const dialog = document.getElementById('carouselDialog');
    const images = wedboxData[wedboxId].carousel;
    let currentIndex = startIndex;

    function renderCarousel() {
        return `
            <div class="carousel-container">
                <img src="${images[currentIndex]}" alt="${wedboxId} pic ${currentIndex + 1}" class="carousel-image">
                <button onclick="changeCarouselImage(-1)" class="prev-button">&lt;</button>
                <button onclick="changeCarouselImage(1)" class="next-button">&gt;</button>
                <button onclick="document.getElementById('carouselDialog').close()" class="close-button">×</button>
            </div>
        `;
    }

    window.changeCarouselImage = (delta) => {
        currentIndex = (currentIndex + delta + images.length) % images.length;
        document.getElementById('carouselContent').innerHTML = renderCarousel();
    };

    document.getElementById('carouselContent').innerHTML = renderCarousel();
    dialog.showModal();
}

document.addEventListener('DOMContentLoaded', () => {
    ['wedbox1', 'wedbox2', 'wedbox3', 'wedbox4', 'wedbox5', 'wedbox6'].forEach(wedboxId => {
        const element = document.getElementById(wedboxId);
        element.innerHTML = renderThumbnail(wedboxId);
        element.addEventListener('click', () => {
            openCarousel(wedboxId, 0);
        });
    });
});





























let totalBudget = 0;
let expenses = [];
let tasks = [];
let checklist = JSON.parse(localStorage.getItem('checklist')) || [];
const formatter = new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' });
const currentDate = new Date('2025-04-23'); // Current date for overdue tasks

function setBudget() {
    const budgetInput = document.getElementById('total-budget').value;
    const error = document.getElementById('budget-error');
    if (budgetInput <= 0 || isNaN(budgetInput)) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';
    totalBudget = parseFloat(budgetInput);
    updateBudgetStatus();
    console.log('Budget set to:', formatter.format(totalBudget)); // Debug
}

function addExpense() {
    const category = document.getElementById('expense-category').value;
    const cost = document.getElementById('expense-cost').value;
    const description = document.getElementById('expense-description').value;
    const error = document.getElementById('expense-error');

    if (!category || cost <= 0 || !description || isNaN(cost)) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';

    expenses.push({ category, cost: parseFloat(cost), description });
    updateExpenseTable();
    updateBudgetStatus();
    console.log('Expense added:', { category, cost: formatter.format(cost), description }); // Debug

    // Clear inputs
    document.getElementById('expense-category').value = '';
    document.getElementById('expense-cost').value = '';
    document.getElementById('expense-description').value = '';
}

function updateBudgetStatus() {
    const spent = expenses.reduce((sum, exp) => sum + exp.cost, 0);
    const remaining = totalBudget - spent;
    const utilization = totalBudget ? ((spent / totalBudget) * 100).toFixed(2) : 0;
    
    document.getElementById('budget-total').textContent = formatter.format(totalBudget);
    document.getElementById('budget-spent').textContent = formatter.format(spent);
    document.getElementById('budget-remaining').textContent = formatter.format(remaining);
    document.getElementById('budget-utilization').textContent = `${utilization}%`;

    const progressBar = document.getElementById('budget-progress');
    progressBar.style.width = utilization > 0 ? `${utilization}%` : '0%';
    progressBar.style.minWidth = utilization > 0 ? '2%' : '0'; // Ensure visibility even at low %
    progressBar.style.transition = 'width 0.5s ease-in-out'; // Smooth animation

    console.log('Budget status updated:', { spent: formatter.format(spent), remaining: formatter.format(remaining), utilization }); // Debug
}

function exportExpenses() {
    const csv = ['Category,Cost,Description'];
    expenses.forEach(exp => {
        csv.push(`${exp.category},${exp.cost},"${exp.description}"`);
    });
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'expenses.csv';
    a.click();
    URL.revokeObjectURL(url);
    console.log('Expenses exported:', expenses.length, 'items'); // Debug
}

function updateExpenseTable() {
    const tableBody = document.getElementById('expense-table');
    tableBody.innerHTML = '';
    expenses.forEach(exp => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td class="p-3">${exp.category}</td>
            <td class="p-3">${formatter.format(exp.cost)}</td>
            <td class="p-3">${exp.description}</td>
        `;
        tableBody.appendChild(row);
    });
    console.log('Expense table updated with', expenses.length, 'items'); // Debug
}


function addTask() {
    const name = document.getElementById('task-name').value;
    const date = document.getElementById('task-date').value;
    const status = document.getElementById('task-status').value;
    const description = document.getElementById('task-description').value;
    const error = document.getElementById('task-error');

    if (!name || !date || !description) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';

    tasks.push({ name, date, status, description });
    updateTimelineTable();
    console.log('Task added:', { name, date, status, description }); // Debug

    // Clear inputs
    document.getElementById('task-name').value = '';
    document.getElementById('task-date').value = '';
    document.getElementById('task-status').value = 'Pending';
    document.getElementById('task-description').value = '';
}

function updateTimelineTable() {
    const tableBody = document.getElementById('timeline-table');
    tableBody.innerHTML = '';
    tasks.sort((a, b) => new Date(a.date) - new Date(b.date));
    tasks.forEach(task => {
        const isOverdue = new Date(task.date) < currentDate && task.status !== 'Completed';
        const row = document.createElement('tr');
        row.className = isOverdue ? 'task-overdue' : '';
        row.innerHTML = `
            <td class="p-3">${task.name}</td>
            <td class="p-3">${new Date(task.date).toLocaleDateString('en-IN')}</td>
            <td class="p-3 task-${task.status.toLowerCase()}">${task.status}</td>
            <td class="p-3">${task.description}</td>
        `;
        tableBody.appendChild(row);
    });
    console.log('Timeline table updated with', tasks.length, 'items'); // Debug
}

function addChecklistItem() {
    const item = document.getElementById('checklist-item').value;
    const error = document.getElementById('checklist-error');

    if (!item) {
        error.style.display = 'block';
        return;
    }
    error.style.display = 'none';

    checklist.push({ item, completed: false });
    saveChecklist();
    updateChecklist();
    console.log('Checklist item added:', item); // Debug

    // Clear input
    document.getElementById('checklist-item').value = '';
}

function toggleChecklistItem(index) {
    checklist[index].completed = !checklist[index].completed;
    saveChecklist();
    updateChecklist();
    console.log('Checklist item toggled:', checklist[index]); // Debug
}

function deleteCompletedItems() {
    checklist = checklist.filter(item => !item.completed);
    saveChecklist();
    updateChecklist();
    console.log('Completed checklist items deleted:', checklist.length, 'items remain'); // Debug
}

function saveChecklist() {
    localStorage.setItem('checklist', JSON.stringify(checklist));
}

function updateChecklist() {
    const checklistContainer = document.getElementById('checklist');
    checklistContainer.innerHTML = '';
    checklist.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = `checklist-item ${item.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input type="checkbox" ${item.completed ? 'checked' : ''} onclick="toggleChecklistItem(${index})">
            <span>${item.item}</span>
        `;
        checklistContainer.appendChild(li);
    });
    console.log('Checklist updated with', checklist.length, 'items'); // Debug
}



















function showVendorSection(sectionId) {
    // Hide all vendor sections
    document.querySelectorAll('.vendor-section').forEach(section => {
        section.classList.remove('active');
    });

    // Show the selected section
    document.getElementById(sectionId).classList.add('active');

    // Scroll to the top of the selected section smoothly
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Carousel navigation for Invitations section
document.addEventListener('DOMContentLoaded', () => {
    const carouselTrack = document.querySelector('.carousel-track');
    const prevButton = document.querySelector('.carousel-prev');
    const nextButton = document.querySelector('.carousel-next');

    if (carouselTrack && prevButton && nextButton) {
        const cardWidth = 220 + 15; // Card width (220px) + gap (15px)

        function scrollCarousel(direction) {
            const currentScroll = carouselTrack.scrollLeft;
            const newScroll = currentScroll + (direction * cardWidth);
            carouselTrack.scrollTo({
                left: newScroll,
                behavior: 'smooth'
            });
        }

        prevButton.addEventListener('click', () => scrollCarousel(-1));
        nextButton.addEventListener('click', () => scrollCarousel(1));
    }
});