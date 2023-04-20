const apiKey = 'keyYP0xoBjKkq0xDE';
const baseId = 'appqxKp9r7hTBdsFD';
const tableName = 'tblCGcAGT9lb0g731';

async function fetchData() {
  try {
    const response = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}?maxRecords=50`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return await response.json();
  } catch (error) {
    console.error(error);
  }
}

function updateContent(fields) {
  const publishedAt = document.querySelector(".published-at");
  const sourceName = document.querySelector(".source-name");
  const newsCategory = document.querySelector(".news-category");
  const mainMessage = document.querySelector(".main-message");
  const scoreValue = document.querySelector(".score-value");

  publishedAt.textContent = `Published on ${fields.publishedAt}`;
  sourceName.textContent = fields.source_name;
  sourceName.href = fields.url;
  newsCategory.textContent = fields.gpt3_news_category;
  mainMessage.textContent = fields.gpt3_what;
  scoreValue.textContent = `${fields.gpt3_importance}/5`;

  updateGradient(fields.gpt3_political_leaning);

}

const gradientLine = document.querySelector(".gradient-line");
const verticalLine = document.createElement("div");
const label = document.createElement("div");

verticalLine.classList.add("vertical-line");
gradientLine.appendChild(verticalLine);
label.classList.add("label");
gradientLine.appendChild(label);

function updateGradient(politicalLeaning) {
  const biasToPercent = {
    "Extreme left": 0/6,
    "Moderate left": 1/6,
    "Mildly left": 2/6,
    "Neutral": 3/6,
    "Mildly right": 4/6,
    "Moderate right": 5/6,
    "Extreme right": 6/6
  };

  gradientLine.style.setProperty("--x", biasToPercent[politicalLeaning]);
  gradientLine.appendChild(verticalLine);
  verticalLine.classList.add("vertical-line");
  verticalLine.style.setProperty("--x", biasToPercent[politicalLeaning]);
  verticalLine.style.setProperty("--h", "0.8");
  gradientLine.appendChild(label);
  label.classList.add("label");
  label.textContent = politicalLeaning;
  label.style.setProperty("--x", biasToPercent[politicalLeaning]);
}


(async () => {
  const data = await fetchData();
  let currentIndex = 0;
  updateContent(data.records[currentIndex].fields);

  const nextButtons = document.querySelectorAll('.next-button');
  const prevButtons = document.querySelectorAll('.prev-button');

  nextButtons.forEach((nextButton) => {
    nextButton.addEventListener('click', () => {
      if (currentIndex < data.records.length - 1) {
        currentIndex++;
        updateContent(data.records[currentIndex].fields);
      }
    });
  });

  prevButtons.forEach((prevButton) => {
    prevButton.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
        updateContent(data.records[currentIndex].fields);
      }
    });
  });
  
  const whyButton = document.querySelector(".why-button");
  const how2Button = document.querySelector(".how2-button");
  const modalContainerImportance = document.querySelector(".modal-container-importance");
  const modalImportance = document.querySelector(".modal-importance");
  const modalHeaderImportance = document.querySelector(".modal-header-importance h2");
  const modalBodyImportance = document.querySelector(".modal-body-importance");
  const closeButtonImportance = document.querySelector(".close-button-importance");
  
  whyButton.addEventListener("click", () => {
  modalHeaderImportance.textContent = "Why should I care?";
  modalBodyImportance.textContent = data.records[currentIndex].fields.gpt3_why;
  modalContainerImportance.style.display = "flex";
});

how2Button.addEventListener("click", () => {
  modalHeaderImportance.textContent = "How This Affects Me?";
  modalBodyImportance.textContent = data.records[currentIndex].fields.gpt3_how;
  modalContainerImportance.style.display = "flex";
});

closeButtonImportance.addEventListener("click", () => {
  modalContainerImportance.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target === modalContainerImportance) {
    modalContainerImportance.style.display = "none";
  }
});

  

  const leftButton = document.querySelector(".left-button");
  const rightButton = document.querySelector(".right-button");
  const modalContainer = document.querySelector(".modal-container");
  const modal = document.querySelector(".modal");
  const modalHeader = document.querySelector(".modal-header h2");
  const modalBody = document.querySelector(".modal-body");
  const closeButton = document.querySelector(".close-button");

  leftButton.addEventListener("click", () => {
    modalHeader.textContent = "Left Interpretation";
    modalBody.textContent = data.records[currentIndex].fields.gpt3_left_interpretation
    modalContainer.style.display = "flex";
  });

  rightButton.addEventListener("click", () => {
    modalHeader.textContent = "Right Interpretation";
    modalBody.textContent = data.records[currentIndex].fields.gpt3_right_interpretation;
    modalContainer.style.display = "flex";
  });

  closeButton.addEventListener("click", () => {
    modalContainer.style.display = "none";
  });

  window.addEventListener("click", (event) => {
    if (event.target === modalContainer) {
      modalContainer.style.display = "none";
    }
  });

})();
