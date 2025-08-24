// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");

if (hamburger && navMenu) {
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
  });

  // Close mobile menu when clicking on a link
  document.querySelectorAll(".nav-link").forEach((n) =>
    n.addEventListener("click", () => {
      hamburger.classList.remove("active");
      navMenu.classList.remove("active");
    })
  );
}

// Animated Counter for Statistics
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  function updateCounter() {
    start += increment;
    if (start < target) {
      element.textContent = Math.floor(start);
      requestAnimationFrame(updateCounter);
    } else {
      element.textContent = target;
    }
  }

  updateCounter();
}

// Initialize counters when they come into view
const observerOptions = {
  threshold: 0.5,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumber = entry.target;
      const target = parseInt(statNumber.getAttribute("data-target"));
      animateCounter(statNumber, target);
      observer.unobserve(statNumber);
    }
  });
}, observerOptions);

// Observe all stat numbers
document.querySelectorAll(".stat-number").forEach((stat) => {
  observer.observe(stat);
});

// Quiz Functionality
class Quiz {
  constructor() {
    this.questions = [
      {
        question:
          "What is the recommended age to start annual mammography screening for most women?",
        options: ["30 years", "40 years", "50 years", "60 years"],
        correct: 1,
      },
      {
        question:
          "Which of the following is NOT a common symptom of breast cancer?",
        options: ["Breast lump", "Nipple discharge", "Fever", "Skin changes"],
        correct: 2,
      },
      {
        question:
          "What percentage of breast cancers are detected through screening?",
        options: ["25%", "50%", "75%", "90%"],
        correct: 2,
      },
      {
        question:
          "Which imaging technique uses sound waves to create breast images?",
        options: ["Mammography", "Ultrasound", "MRI", "CT Scan"],
        correct: 1,
      },
      {
        question: "What is the most common type of breast cancer?",
        options: [
          "Invasive Ductal Carcinoma",
          "Invasive Lobular Carcinoma",
          "Ductal Carcinoma in Situ",
          "Inflammatory Breast Cancer",
        ],
        correct: 0,
      },
    ];
    this.currentQuestion = 0;
    this.score = 0;
    this.init();
  }

  init() {
    this.updateQuestion();
    this.bindEvents();
  }

  updateQuestion() {
    const questionEl = document.getElementById("quiz-question");
    if (!questionEl) return;

    const question = this.questions[this.currentQuestion];
    questionEl.querySelector("h3").textContent = `Question ${
      this.currentQuestion + 1
    } of ${this.questions.length}`;
    questionEl.querySelector("p").textContent = question.question;

    const optionsContainer = questionEl.querySelector(".quiz-options");
    optionsContainer.innerHTML = "";

    question.options.forEach((option, index) => {
      const button = document.createElement("button");
      button.className = "quiz-option";
      button.textContent = option;
      button.setAttribute("data-correct", index === question.correct);
      optionsContainer.appendChild(button);
    });
  }

  bindEvents() {
    document.addEventListener("click", (e) => {
      if (e.target.classList.contains("quiz-option")) {
        this.handleAnswer(e.target);
      }
      if (e.target.id === "retake-quiz") {
        this.resetQuiz();
      }
    });
  }

  handleAnswer(selectedButton) {
    const isCorrect = selectedButton.getAttribute("data-correct") === "true";

    // Disable all options
    document.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.disabled = true;
      if (btn.getAttribute("data-correct") === "true") {
        btn.classList.add("correct");
      } else if (btn === selectedButton && !isCorrect) {
        btn.classList.add("incorrect");
      }
    });

    if (isCorrect) {
      this.score++;
    }

    setTimeout(() => {
      this.currentQuestion++;
      if (this.currentQuestion < this.questions.length) {
        this.updateQuestion();
      } else {
        this.showResults();
      }
    }, 1500);
  }

  showResults() {
    const questionEl = document.getElementById("quiz-question");
    const resultEl = document.getElementById("quiz-result");

    if (questionEl && resultEl) {
      questionEl.style.display = "none";
      resultEl.style.display = "block";
      document.getElementById("quiz-score").textContent = this.score;
    }
  }

  resetQuiz() {
    this.currentQuestion = 0;
    this.score = 0;
    const questionEl = document.getElementById("quiz-question");
    const resultEl = document.getElementById("quiz-result");

    if (questionEl && resultEl) {
      questionEl.style.display = "block";
      resultEl.style.display = "none";
      this.updateQuestion();
    }
  }
}

// Initialize quiz if on diagnostic page
if (document.getElementById("quiz-question")) {
  new Quiz();
}

// Treatment Comparison Tool
class TreatmentComparison {
  constructor() {
    this.treatments = {
      surgical: {
        name: "Surgical Treatments",
        options: ["Lumpectomy", "Mastectomy", "Lymph Node Surgery"],
        successRates: [85, 92, 95],
        recoveryTime: ["2-4 weeks", "4-8 weeks", "1-2 weeks"],
      },
      radiation: {
        name: "Radiation Therapy",
        options: ["External Beam", "Brachytherapy", "Proton Therapy"],
        successRates: [90, 88, 92],
        recoveryTime: ["6-8 weeks", "2-4 weeks", "8-10 weeks"],
      },
      chemotherapy: {
        name: "Chemotherapy",
        options: ["Anthracyclines", "Taxanes", "Targeted Therapy"],
        successRates: [75, 80, 85],
        recoveryTime: ["3-6 months", "4-8 months", "6-12 months"],
      },
      hormone: {
        name: "Hormone Therapy",
        options: ["SERMs", "Aromatase Inhibitors", "Ovarian Suppression"],
        successRates: [70, 75, 80],
        recoveryTime: ["5-10 years", "5 years", "Variable"],
      },
    };
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    const treatmentFilter = document.getElementById("treatment-filter");
    const stageFilter = document.getElementById("stage-filter");
    const searchBtn = document.getElementById("search-cases");

    if (treatmentFilter) {
      treatmentFilter.addEventListener("change", () => this.updateComparison());
    }
    if (stageFilter) {
      stageFilter.addEventListener("change", () => this.updateComparison());
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.searchCases());
    }
  }

  updateComparison() {
    const treatmentType = document.getElementById("treatment-filter")?.value;
    const stage = document.getElementById("stage-filter")?.value;
    const resultsEl = document.getElementById("comparison-results");

    if (!resultsEl || !treatmentType) {
      return;
    }

    const treatment = this.treatments[treatmentType];
    if (!treatment) {
      resultsEl.innerHTML = "<p>Select a treatment type to see comparison</p>";
      return;
    }

    let html = `<h3>${treatment.name} Comparison</h3>`;
    html += '<div class="comparison-table">';
    html +=
      "<table><thead><tr><th>Treatment</th><th>Success Rate</th><th>Recovery Time</th></tr></thead><tbody>";

    treatment.options.forEach((option, index) => {
      html += `<tr>
                <td>${option}</td>
                <td>${treatment.successRates[index]}%</td>
                <td>${treatment.recoveryTime[index]}</td>
            </tr>`;
    });

    html += "</tbody></table></div>";

    if (stage) {
      html += `<p><strong>Stage ${stage}:</strong> Treatment recommendations may vary based on cancer stage and individual factors.</p>`;
    }

    resultsEl.innerHTML = html;
  }

  searchCases() {
    const stage = document.getElementById("stage-filter")?.value;
    const age = document.getElementById("age-filter")?.value;
    const outcome = document.getElementById("outcome-filter")?.value;
    const resultsEl = document.getElementById("search-results");

    if (!resultsEl) return;

    let results = [];

    // Simulate search results based on filters
    if (stage || age || outcome) {
      results = [
        {
          title: "Case Study: Early Detection Success",
          stage: "Stage I",
          age: "42",
          outcome: "Successful",
        },
        {
          title: "Case Study: Advanced Stage Management",
          stage: "Stage III",
          age: "58",
          outcome: "Complex",
        },
        {
          title: "Case Study: Genetic Predisposition",
          stage: "Stage II",
          age: "35",
          outcome: "Successful",
        },
      ].filter((case_) => {
        return (
          (!stage || case_.stage.includes(stage)) &&
          (!age ||
            (age === "young" && case_.age < 40) ||
            (age === "middle" && case_.age >= 40 && case_.age <= 60) ||
            (age === "senior" && case_.age > 60)) &&
          (!outcome || case_.outcome.toLowerCase() === outcome)
        );
      });
    }

    if (results.length > 0) {
      let html = '<h3>Search Results</h3><div class="search-results-list">';
      results.forEach((result) => {
        html += `<div class="search-result-item">
                    <h4>${result.title}</h4>
                    <p>Stage: ${result.stage} | Age: ${result.age} | Outcome: ${result.outcome}</p>
                </div>`;
      });
      html += "</div>";
      resultsEl.innerHTML = html;
    } else {
      resultsEl.innerHTML =
        "<p>No cases found matching your criteria. Try adjusting your filters.</p>";
    }
  }
}

// Initialize treatment comparison if on remedial page
if (document.getElementById("treatment-filter")) {
  new TreatmentComparison();
}

// Case Study Expansion
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("case-expand")) {
    const caseCard = e.target.closest(".case-card");
    const caseDetails = caseCard.querySelector(".case-details");

    if (caseDetails.style.display === "none" || !caseDetails.style.display) {
      caseDetails.style.display = "block";
      e.target.textContent = "Collapse Case";
    } else {
      caseDetails.style.display = "none";
      e.target.textContent = "View Full Case";
    }
  }
});

// Form Submissions
document.addEventListener("submit", (e) => {
  if (e.target.id === "caseForm") {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    alert(
      "Case study submitted successfully! Thank you for your contribution."
    );
    e.target.reset();
  }

  if (e.target.id === "collaborationForm") {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Simulate form submission
    alert("Collaboration proposal submitted! We will contact you soon.");
    e.target.reset();
  }
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Chart Functionality (Simple Canvas-based charts)
class SimpleChart {
  constructor(canvasId, data, type = "bar") {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext("2d");
    this.data = data;
    this.type = type;
    this.init();
  }

  init() {
    this.drawChart();
  }

  drawChart() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const padding = 40;
    const chartWidth = width - 2 * padding;
    const chartHeight = height - 2 * padding;

    // Clear canvas
    this.ctx.clearRect(0, 0, width, height);

    // Draw background
    this.ctx.fillStyle = "#f5f5f5";
    this.ctx.fillRect(0, 0, width, height);

    // Draw title
    this.ctx.fillStyle = "#333";
    this.ctx.font = "16px Poppins";
    this.ctx.textAlign = "center";
    this.ctx.fillText("Breast Cancer Statistics", width / 2, 25);

    if (this.type === "bar") {
      this.drawBarChart(chartWidth, chartHeight, padding);
    } else if (this.type === "line") {
      this.drawLineChart(chartWidth, chartHeight, padding);
    }
  }

  drawBarChart(chartWidth, chartHeight, padding) {
    const barWidth = chartWidth / this.data.length - 10;
    const maxValue = Math.max(...this.data.map((d) => d.value));
    const colors = ["#E91E63", "#009688", "#BA68C8", "#80CBC4"];

    this.data.forEach((item, index) => {
      const barHeight = (item.value / maxValue) * chartHeight;
      const x = padding + index * (chartWidth / this.data.length) + 5;
      const y = this.canvas.height - padding - barHeight;

      // Draw bar
      this.ctx.fillStyle = colors[index % colors.length];
      this.ctx.fillRect(x, y, barWidth, barHeight);

      // Draw label
      this.ctx.fillStyle = "#333";
      this.ctx.font = "12px Poppins";
      this.ctx.textAlign = "center";
      this.ctx.fillText(
        item.label,
        x + barWidth / 2,
        this.canvas.height - padding + 20
      );
      this.ctx.fillText(item.value + "%", x + barWidth / 2, y - 10);
    });
  }

  drawLineChart(chartWidth, chartHeight, padding) {
    const maxValue = Math.max(...this.data.map((d) => d.value));
    const colors = ["#E91E63", "#009688"];

    this.ctx.strokeStyle = colors[0];
    this.ctx.lineWidth = 3;
    this.ctx.beginPath();

    this.data.forEach((item, index) => {
      const x = padding + (index / (this.data.length - 1)) * chartWidth;
      const y =
        this.canvas.height - padding - (item.value / maxValue) * chartHeight;

      if (index === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }

      // Draw point
      this.ctx.fillStyle = colors[0];
      this.ctx.beginPath();
      this.ctx.arc(x, y, 5, 0, 2 * Math.PI);
      this.ctx.fill();
    });

    this.ctx.stroke();
  }
}

// Initialize charts if on case analysis page
if (document.getElementById("dataChart")) {
  const chartData = [
    { label: "Stage I", value: 90 },
    { label: "Stage II", value: 85 },
    { label: "Stage III", value: 70 },
    { label: "Stage IV", value: 25 },
  ];

  const chart = new SimpleChart("dataChart", chartData, "bar");

  // Chart controls
  document.querySelectorAll(".chart-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelectorAll(".chart-btn")
        .forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const chartType = btn.getAttribute("data-chart");
      let newData;

      switch (chartType) {
        case "survival":
          newData = [
            { label: "Stage I", value: 90 },
            { label: "Stage II", value: 85 },
            { label: "Stage III", value: 70 },
            { label: "Stage IV", value: 25 },
          ];
          break;
        case "stages":
          newData = [
            { label: "Stage 0", value: 15 },
            { label: "Stage I", value: 30 },
            { label: "Stage II", value: 35 },
            { label: "Stage III", value: 15 },
            { label: "Stage IV", value: 5 },
          ];
          break;
        case "treatments":
          newData = [
            { label: "Surgery", value: 95 },
            { label: "Radiation", value: 90 },
            { label: "Chemo", value: 75 },
            { label: "Hormone", value: 80 },
          ];
          break;
        case "age":
          newData = [
            { label: "20-39", value: 5 },
            { label: "40-49", value: 20 },
            { label: "50-59", value: 30 },
            { label: "60-69", value: 25 },
            { label: "70+", value: 20 },
          ];
          break;
      }

      if (newData) {
        chart.data = newData;
        chart.drawChart();
      }
    });
  });
}

// Paper Search Functionality
if (document.getElementById("search-papers")) {
  document.getElementById("search-papers").addEventListener("click", () => {
    const searchTerm = document.getElementById("paper-search").value;
    const year = document.getElementById("year-filter").value;
    const journal = document.getElementById("journal-filter").value;
    const category = document.getElementById("category-filter").value;

    // Simulate search results
    const resultsEl = document.querySelector(".papers-list");
    if (resultsEl) {
      let html = "";
      const mockResults = [
        {
          title: "Advances in Breast Cancer Detection",
          authors: "Smith, J., Johnson, A.",
          journal: "Nature Medicine",
          year: "2024",
          category: "Diagnostic Advances",
        },
        {
          title: "Novel Treatment Approaches",
          authors: "Brown, S., Davis, R.",
          journal: "JAMA Oncology",
          year: "2023",
          category: "Treatment Innovations",
        },
      ].filter((paper) => {
        return (
          (!searchTerm ||
            paper.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
          (!year || paper.year === year) &&
          (!journal ||
            paper.journal.toLowerCase().includes(journal.toLowerCase())) &&
          (!category || paper.category === category)
        );
      });

      if (mockResults.length > 0) {
        mockResults.forEach((paper) => {
          html += `<div class="paper-result-item">
                        <h4>${paper.title}</h4>
                        <p><strong>Authors:</strong> ${paper.authors}</p>
                        <p><strong>Journal:</strong> ${paper.journal} (${paper.year})</p>
                        <p><strong>Category:</strong> ${paper.category}</p>
                    </div>`;
        });
      } else {
        html = "<p>No papers found matching your criteria.</p>";
      }

      resultsEl.innerHTML = html;
    }
  });
}

// Add some CSS for the new elements
const additionalStyles = `
    .comparison-table table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
    }
    
    .comparison-table th,
    .comparison-table td {
        padding: 12px;
        text-align: left;
        border-bottom: 1px solid #f0f0f0;
    }
    
    .comparison-table th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #333;
    }
    
    .search-results-list {
        margin-top: 20px;
    }
    
    .search-result-item {
        background: #f8f9fa;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 8px;
        border-left: 4px solid #E91E63;
    }
    
    .search-result-item h4 {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    .search-result-item p {
        margin: 5px 0;
        color: #666;
        font-size: 0.9rem;
    }
    
    .paper-result-item {
        background: #f8f9fa;
        padding: 20px;
        margin-bottom: 15px;
        border-radius: 10px;
        border-left: 4px solid #009688;
    }
    
    .paper-result-item h4 {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    .paper-result-item p {
        margin: 5px 0;
        color: #666;
    }
`;

// Inject additional styles
const styleSheet = document.createElement("style");
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Lazy loading for images (if any are added later)
document.addEventListener("DOMContentLoaded", () => {
  const images = document.querySelectorAll("img[data-src]");
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach((img) => imageObserver.observe(img));
});

// Add scroll-based animations
const scrollObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }
);

// Observe elements for scroll animations
document
  .querySelectorAll(
    ".method-card, .treatment-card, .case-card, .paper-card, .category-card"
  )
  .forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(30px)";
    el.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    scrollObserver.observe(el);
  });

console.log("Breast Cancer Research Website - JavaScript loaded successfully!");
