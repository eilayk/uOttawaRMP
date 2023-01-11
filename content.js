// Description: This script is injected into the page when the extension is enabled.
// It sends a message to the background script to retrieve the professor's info from RMP.
// The background script then sends the info back to this script, which inserts it into the page.

// select iframe that displays class info
const iframe = document.querySelector('iframe').contentWindow.document;

// css mostly for vsb tooltip and fixing vsb nasty css
const style = document.createElement("style");
style.innerHTML = `
  .rating {
    margin-top: 7px;
  }
  .vsb-rating {
    margin-top: 5px;
  }
  .prof-tooltip {
    position: relative;
    display: inline-block;
    cursor: pointer;
    z-index: 9999;
  }
  .prof-tooltip .tooltip-text {
    visibility: hidden;
    background-color: #333;
    color: #fff;
    text-align: center;
    border-radius: 4px;
    padding: 5px;
    position: absolute;
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.3s;
    width: 200px;
    pointer-events: none;
    left: -200px;
    top: -50px;
  }
  .prof-tooltip:hover .tooltip-text {
    visibility: visible;
    opacity: 1;
    pointer-events: auto;
  }
  .rightnclear {
    float: inherit;
    clear: both;
  }
`;

iframe.head.appendChild(style);
function Search() {
  const professorLinks = [];
  let i = 0;
  let prevProf = "";

  // if viewing in schedule
  let currElement = iframe.getElementById("DERIVED_CLS_DTL_SSR_INSTR_LONG$" + i.toString());
  console.log(currElement);
  while (currElement != null) {
    if (currElement.textContent != 'Staff' && currElement.textContent != prevProf) {
      professorLinks.push(currElement);
      prevProf = currElement.textContent;
    }
    i++;
    currElement = iframe.getElementById("DERIVED_CLS_DTL_SSR_INSTR_LONG$" + i.toString());
  }
  
  // if viewing in course selector
  currElement = iframe.getElementById("MTG_INSTR$" + i.toString());
  while (currElement != null) {
    if (currElement.textContent != 'Staff' && currElement.textContent != prevProf) {
      professorLinks.push(currElement);
      prevProf = currElement.textContent;
    }
    i++;
    currElement = iframe.getElementById("MTG_INSTR$" + i.toString());
  }

  professorLinks.forEach(async (link) => {
    const professorName = link.textContent;

    try {
      const port = chrome.runtime.connect({ name: 'professor-rating' });
      port.postMessage({ professorName });
      port.onMessage.addListener((teacher) => {

        // If the professor is not registered on RMP, the background script will return an error message
        if (teacher.error) {
          insertNoProfError(link);
        } else {
          // get the professor's info from the response
          const avgRating = teacher.avgRating;
          const numRatings = teacher.numRatings;
          const avgDifficulty = teacher.avgDifficulty;
          const wouldTakeAgainPercent = parseInt(teacher.wouldTakeAgainPercent);
          const legacyId = teacher.legacyId;

          // if the professor has no ratings, RMP will return -1 for this field
          if (wouldTakeAgainPercent === -1) {
            insertNoRatingsError(link, legacyId);
            return;
          }

          // insert the professor's info into the page
          insertNumRatings(link, numRatings, legacyId);
          insertWouldTakeAgainPercent(link, wouldTakeAgainPercent);
          insertAvgDifficulty(link, avgDifficulty);
          insertRating(link, avgRating);
        }
      });
    } catch (error) {
      // insert an error message if the request fails
      insertNoProfError(link);
    }
  });
}

// execute extension when icon is clicked
chrome.browserAction.onClicked.addListener(function(tab) {
  Search();
});

// helper functions to insert the professor's info into the page

function insertRating(link, avgRating) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="rating"><b>Rating:</b> ${avgRating}/5</div>`
  );
}

function insertVSBRating(link, avgRating) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="vsb-rating"><b>Rating:</b> ${avgRating}/5</div>`
  );
}

function insertAvgDifficulty(link, avgDifficulty) {
  link.insertAdjacentHTML(
    "afterend",
    `<div><b>Difficulty:</b> ${avgDifficulty}/5</div>`
  );
}

function insertWouldTakeAgainPercent(link, wouldTakeAgainPercent) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="rating"><b>${wouldTakeAgainPercent}%</b> of students would take this professor again.</div>`
  );
}

function insertNumRatings(link, numRatings, legacyId) {
  const profLink = `<a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>${numRatings} ratings</a>`;
  link.insertAdjacentHTML("afterend", `<div>${profLink}</div>`);
}

function insertNoRatingsError(link, legacyId) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="rating"><b>Error:</b> this professor has <a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>no ratings on RateMyProfessors.</a></div>`
  );
}

function insertNoProfError(link) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="rating"><b>Error:</b> this professor is not registered on RateMyProfessors.</div>`
  );
}

function insertVSBNoRatingsError(link, legacyId) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="vsb-rating"><b>Error:</b> this professor has <a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>no ratings on RateMyProfessors.</a></div>`
  );
}

function insertVSBNoProfError(link) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="vsb-rating"><b>Error:</b> this professor is not registered on RateMyProfessors.</div>`
  );
}

function insertProxyError(link, errorMessage) {
  link.insertAdjacentHTML(
    "afterend",
    `<div class="rating"><b>Error:</b> ${errorMessage}</div>`
  );
}

function insertNoProfTooltip(element) {
  const tooltipContent = `<div><b>Error:</b> this professor is not registered on RateMyProfessors.</div>`;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-text error-tooltip";
  tooltip.innerHTML = tooltipContent;

  const tooltipContainer = document.createElement("span");
  tooltipContainer.className = "prof-tooltip";
  tooltipContainer.appendChild(element.cloneNode(true));
  tooltipContainer.appendChild(tooltip);
  element.parentNode.appendChild(tooltipContainer);
  positionTooltip(element);

  element.replaceWith(tooltipContainer);

  tooltipContainer.addEventListener("mouseenter", () => {
    tooltip.style.visibility = "visible";
    clearTimeout(timeoutId);
  });

  tooltipContainer.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      tooltip.style.visibility = "hidden";
    }, 1000);
  });
}

function insertNoRatingsTooltip(element, legacyId) {
  const tooltipContent = `
    <div><b>Error:</b> this professor has <a href='https://www.ratemyprofessors.com/professor?tid=${legacyId}'>no ratings on RateMyProfessors.</a></div>
  `;

  const tooltip = document.createElement("div");
  tooltip.className = "tooltip-text error-tooltip";
  tooltip.innerHTML = tooltipContent;

  const tooltipContainer = document.createElement("span");
  tooltipContainer.className = "prof-tooltip";
  tooltipContainer.appendChild(element.cloneNode(true));
  tooltipContainer.appendChild(tooltip);
  element.parentNode.appendChild(tooltipContainer);
  positionTooltip(element);

  element.replaceWith(tooltipContainer);

  tooltipContainer.addEventListener("mouseenter", () => {
    tooltip.style.visibility = "visible";
    clearTimeout(timeoutId);
  });

  tooltipContainer.addEventListener("mouseleave", () => {
    timeoutId = setTimeout(() => {
      tooltip.style.visibility = "hidden";
    }, 1000);
  });
}
