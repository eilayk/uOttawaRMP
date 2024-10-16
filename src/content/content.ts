import { populateProfessors } from "./helper";

// select iframe that displays class info
const iframe = document.querySelector('iframe').contentWindow.document;

// css to add space between prof name and rating
const style = document.createElement('style');
style.innerHTML = `
  .rating {
    margin-top: 7px;
  }
`;
iframe.head.appendChild(style);

// if viewing in schedule
populateProfessors(iframe, "DERIVED_CLS_DTL_SSR_INSTR_LONG$");
// if viewing in course selector
populateProfessors(iframe, "MTG_INSTR$");