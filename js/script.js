
// Welcome Page code
document.addEventListener("DOMContentLoaded", function () {
  const storedData = localStorage.getItem("formData");
  const alreadyRedirected = sessionStorage.getItem("redirected");

  if (storedData && !alreadyRedirected) {
    sessionStorage.setItem("redirected", "true");
    window.location.href = "home.html";
    return;
  }
  resetForm();
});

function resetForm() {
  const incomeField = document.getElementById("income");
  const nameField = document.getElementById("name");
  const goalsField = document.getElementById("goals");

  if (incomeField && nameField && goalsField) {
    incomeField.value = '';
    nameField.value = '';
    goalsField.value = '';
  } else {
    console.warn("One or more form fields are missing in this page.");
  }
}
function btnStartCalculation() {
  const formData = {
    income: document.getElementById("income").value.trim(),
    name: document.getElementById("name").value.trim(),
    goals: document.getElementById("goals").value.trim(),
  };

  if (!formData.income || !formData.name || !formData.goals) {
    alert("Please fill out all fields!");
    return;
  }

  localStorage.setItem("formData", JSON.stringify(formData));
  sessionStorage.setItem("redirected", "true");
  resetForm();
  setTimeout(() => {
    window.location.href = "home.html";
  }, 500);
}

// Home Page Code

// Bring Data from welcome Page
document.addEventListener("DOMContentLoaded", function () {
  const userData = JSON.parse(localStorage.getItem("formData"));
  if (userData) {
    document.getElementById("user").textContent = `Welcome ${userData.name}`;
    const formattedIncome = parseFloat(userData.income).toLocaleString('en-GB', {
      style: 'currency',
      currency: 'GBP',
    });
    document.getElementById("income").innerHTML = `${formattedIncome}`;
  } else {
    console.warn("No user data found in localStorage.");
  }
});


// expense list
let myChart = null;
let myObject = JSON.parse(localStorage.getItem('expenses')) || {};
const expensesList = document.getElementById('expenses-list');
const emptyState = document.getElementById('empty-state');
const expenseForm = document.getElementById('expense-form');
var layer = document.querySelector(".layer");
const addButton = document.querySelector('#add-expense-btn');
const resetButton = document.querySelector('#reset-btn');

// add expense form
document.querySelector('.add-expense-btn').addEventListener('click', function () {
  layer.classList.replace("d-none", "d-flex");
});
document.querySelector('.add-expense-btn-mobile').addEventListener('click', function () {
  layer.classList.replace("d-none", "d-flex");
});

function closeForm() {
  layer.classList.replace("d-flex", "d-none");
}

// create chart
const ctx = document.getElementById('expenseChart').getContext('2d');

// Display content of expenses list
function displayContent(obj) {
  if (Object.keys(obj).length === 0) {
    expensesList.innerHTML = '';
    if (!document.contains(emptyState)) {
      expensesList.appendChild(emptyState);
    }
  } else {
    if (document.contains(emptyState)) {
      emptyState.remove();
    }
    expensesList.innerHTML = '';
    for (let key in obj) {
      if (obj.hasOwnProperty(key)) {
        const expense = obj[key];
        const expenseDiv = document.createElement('div');
        expenseDiv.classList.add('expenses-item', 'd-flex', 'justify-content-between', 'align-items-center', 'ps-0');
        expenseDiv.innerHTML = `
          <div class="content d-flex align-items-center text-light">
            <img src="${expense.icon}" alt="${expense.category}">
            <div class="d-flex flex-column ms-1">
              <p class="fw-400 m-0 ms-2 fs-16 text-capitalize">${expense.category}</p>
              <p class="fw-400 m-0 ms-2 fs-13 text-capitalize">Date: <span class="fw-700">${expense.date}</span></p>
            </div>
          </div>
          <div class="d-flex align-items-center text-light">
            <p class="fw-400 m-0 text-uppercase fs-4">${expense.amount}</p>
          </div>
        `;
        expensesList.appendChild(expenseDiv);
      }
    }
  }
}

// get income
function getIncome() {
  const storedData = localStorage.getItem("formData");
  return storedData ? JSON.parse(storedData).income : 0;
}

//(spent)
function calculateSpent(expenses) {
  let totalSpent = 0;
  for (let key in expenses) {
    if (expenses.hasOwnProperty(key)) {
      totalSpent += parseFloat(expenses[key].amount.replace(/[^\d.-]/g, ""));
    }
  }
  return totalSpent;
}

function formatCurrency(amount) {
  return parseFloat(amount).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 2,
  });
}

// Update Budget (spent, available)
function updateBudget() {
  const income = parseFloat(getIncome());
  const spent = calculateSpent(myObject);
  const available = income - spent;

  document.getElementById("income").textContent = formatCurrency(income);
  document.getElementById("spent").textContent = formatCurrency(spent);
  document.getElementById("available").textContent = formatCurrency(available);

  updateChart(spent, income);
}

// Update Chart
function updateChart(spent, income) {
  const percentage = (spent / income) * 100;

  const data = {
    labels: ["Completed", "Remaining"],
    datasets: [
      {
        label: "Budget Distribution",
        data: [percentage, 100 - percentage],
        backgroundColor: ["#4caf50", "#e0e0e0"],
        hoverBackgroundColor: ["#66bb6a", "#e0e0e0"],
        borderColor: "#fff",
        borderWidth: 1,
      },
    ],
  };

  const config = {
    type: "doughnut",
    data: data,
    options: {
      responsive: true,
      cutout: "89%",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          enabled: false,
        },
      },
    },
    plugins: [
      {
        id: "centerText",
        beforeDraw(chart) {
          const { width, height } = chart;
          const ctx = chart.ctx;

          ctx.restore();

          const fontSizePercentage = (height / 5).toFixed(2);
          const fontSizeText = (height / 10).toFixed(2);
          const percentageText = `${percentage.toFixed(0)}%`;
          const text = "Spent";

          ctx.textBaseline = "middle";
          ctx.textAlign = "center";

          ctx.font = `200 ${fontSizePercentage}px sans-serif`;
          ctx.fillStyle = "#000";
          ctx.fillText(percentageText, width / 2, height / 2 - 10);

          ctx.font = `200 ${fontSizeText}px sans-serif`;
          ctx.fillText(text, width / 2, height / 2 + 20);
        },
      },
    ],
  };
 // Destroy existing chart if it exists
  if (myChart) {
    myChart.destroy();
  }
   // Create new chart and store the instance
  myChart = new Chart(ctx, config);
}

document.addEventListener("DOMContentLoaded", function () {
  updateBudget();
  displayContent(myObject);

  const spent = localStorage.getItem("spent");
  if (spent) {
    const income = parseFloat(getIncome());
    const percentage = (parseFloat(spent) / income) * 100;
    updateChart(parseFloat(spent), income);
  }
});

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const category = document.getElementById("category").value;
  const date = document.getElementById("date").value;
  const price = document.getElementById("price").value;

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).replace(",", "").replace(/ /g, ", ");

  const formattedPrice = formatCurrency(price);

  let expenseId = null;
  for (let key in myObject) {
    if (myObject[key].category === category) {
      expenseId = key;
      break;
    }
  }

  if (expenseId) {
    myObject[expenseId].amount = formatCurrency(
      parseFloat(myObject[expenseId].amount.replace(/[^\d.-]/g, "")) + parseFloat(price)
    );
    myObject[expenseId].date = formattedDate;
  } else {
    expenseId = "expense" + (Object.keys(myObject).length + 1);
    myObject[expenseId] = {
      category: category,
      date: formattedDate,
      amount: formattedPrice,
      icon: `img/${category}.svg`,
    };
  }

  localStorage.setItem("expenses", JSON.stringify(myObject));

  const totalSpent = calculateSpent(myObject);
  localStorage.setItem("spent", totalSpent);

  document.querySelector(".filter-cat").textContent = "All";
  displayContent(myObject);
  updateBudget();
  layer.classList.add('d-none');
  expenseForm.reset();
  closeForm();
});

addButton.addEventListener("click", function () {
  closeForm();
});

// filter Button
function filterExpenses(category) {
  const filteredExpenses = category === 'all'
    ? myObject
    : Object.fromEntries(Object.entries(myObject).filter(([key, expense]) => expense.category === category));
  if (Object.keys(filteredExpenses).length === 0) {
    expensesList.innerHTML = '';
    expensesList.appendChild(emptyState);
  } else {
    displayContent(filteredExpenses);
  }
}

document.querySelectorAll('.dropdown-item').forEach(item => {
  item.addEventListener('click', function (event) {
    event.preventDefault();
    const category = item.getAttribute('data-category');
    document.querySelector('.filter-cat').textContent = item.textContent;
    filterExpenses(category);
  });
});

// reset button
resetButton.addEventListener('click', function () {
  localStorage.removeItem('expenses');
  localStorage.removeItem('spent');
  myObject = {};
  updateChart(0, getIncome());
  expensesList.innerHTML = '';
  if (!document.contains(emptyState)) {
    expensesList.appendChild(emptyState);
  }
  updateBudget();
});

document.addEventListener("DOMContentLoaded", function () {
  updateBudget();
  displayContent(myObject);
});
