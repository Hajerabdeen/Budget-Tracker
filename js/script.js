const ctx = document.getElementById("expenseChart").getContext("2d");

const data = {
  labels: ["Completed", "Remaining"],
  datasets: [
    {
      label: "Budget Distribution",
      data: [70, 30], // نسبة الجزء المكتمل والجزء الباقي
      backgroundColor: ["#4caf50", "#e0e0e0"], // الجزء المنجز باللون الأخضر والباقي باللون الرمادي
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
    cutout: "89%", // فراغ في وسط الدائرة
    plugins: {
      legend: {
        display: false, // إخفاء الأسطورة
      },
      tooltip: {
        enabled: false, // إخفاء التلميحات
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

        const fontSizePercentage = (height / 5).toFixed(2); // حجم النص للنسبة
        const fontSizeText = (height / 10).toFixed(2); // حجم النص للكلمة "Spent" (أصغر قليلًا)
        const percentage = "70%"; // النسبة المئوية
        const text = "Spent"; // النص السفلي

        ctx.textBaseline = "middle";
        ctx.textAlign = "center";

        // رسم النسبة المئوية
        ctx.font = `200 ${fontSizePercentage}px sans-serif`; // جعل الخط أرفع مع حجم أكبر
        ctx.fillStyle = "#000"; // لون النص الأسود
        ctx.fillText(percentage, width / 2, height / 2 - 10); // زيادة بسيطة للمسافة بين النسبة والنص

        // رسم النص "Spent"
        ctx.font = `200 ${fontSizeText}px sans-serif`; // نفس السماكة لكن بحجم أصغر
        ctx.fillText(text, width / 2, height / 2 + 20); // تقريب النص بشكل مناسب للنسبة
      },
    },
  ],
};

const expenseChart = new Chart(ctx, config);


// function updateDonutChart(el, percent, donut) {
//   percent = Math.round(percent);
//   if (percent > 100) {
//     percent = 100;
//   } else if (percent < 0) {
//     percent = 0;
//   }
//   var deg = Math.round(360 * (percent / 100));

//   if (percent > 50) {
//     $(el + " .pie").css("clip", "rect(auto, auto, auto, auto)");
//     $(el + " .right-side").css("transform", "rotate(180deg)");
//   } else {
//     $(el + " .pie").css("clip", "rect(0, 1em, 1em, 0.5em)");
//     $(el + " .right-side").css("transform", "rotate(0deg)");
//   }
//   if (donut) {
//     $(el + " .right-side").css("border-width", "0.1em");
//     $(el + " .left-side").css("border-width", "0.1em");
//     $(el + " .shadow").css("border-width", "0.1em");
//   } else {
//     $(el + " .right-side").css("border-width", "0.5em");
//     $(el + " .left-side").css("border-width", "0.5em");
//     $(el + " .shadow").css("border-width", "0.5em");
//   }
//   $(el + " .num").text(percent);
//   $(el + " .left-side").css("transform", "rotate(" + deg + "deg)");
// }

// // Pass in a number for the percent
// updateDonutChart("#specificChart", 66.67, true);
