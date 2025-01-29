// Chart Code

const ctx = document.getElementById("expenseChart").getContext("2d");
const data = {
  labels: ["Completed", "Remaining"],
  datasets: [
    {
      label: "Budget Distribution",
      data: [70, 30],
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
        const { width } = chart;
        const { height } = chart;
        const ctx = chart.ctx;

        ctx.restore();

        const fontSizePercentage = (height / 5).toFixed(2); 
        const fontSizeText = (height / 10).toFixed(2);
        const percentage = "70%"; 
        const text = "Spent"; 

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        ctx.font = `200 ${fontSizePercentage}px sans-serif`; 
        ctx.fillStyle = "#000"; 
        ctx.fillText(percentage, width / 2, height / 2 - 10);

        ctx.font = `200 ${fontSizeText}px sans-serif`; 
        ctx.fillText(text, width / 2, height / 2 + 20); 
      },
    },
  ],
};
const expenseChart = new Chart(ctx, config);


function ShowAlert(){
  Swal.fire({
    title: 'error!',
    text: 'Please fill out all fields!.',
    icon: 'error',
    confirmButtonText: 'OK'
});

}

function btnStartCalculation() {
  const formData = {
      income: document.getElementById("income").value.trim(),
      name: document.getElementById("name").value.trim(),
      goals: document.getElementById("goals").value.trim(),
  };
  if (!formData.income || !formData.name || !formData.goals) {
    ShowAlert()
    return;
  }
  localStorage.setItem("formData", JSON.stringify(formData));
  window.location.href = "home.html";
}



