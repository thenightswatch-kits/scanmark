// services/reportGenerator.js

import jsPDF from "jspdf";
import "jspdf-autotable";
// Date Fns is used to format the dates we receive
// from our API call
import { format } from "date-fns";

// define a generatePDF function that accepts a tickets argument
const generatePDF = tickets => {
  // initialize jsPDF
  const doc = new jsPDF();

  // define the columns we want and their titles
  const tableColumn = ["Sl. No.","Date","Time","Roll Number","Recorded By"];
  // define an empty array of rows
  const tableRows = [];

  // for each ticket pass all its data into an array
  tickets.forEach((ticket, index) => {
    const ticketData = [
      index+1,
      ticket.recorded_at.split(',')[0],
      ticket.recorded_at.split(',')[1],
      ticket.rollnumber,
      ticket.username,
    ];
    // push each tickcet's info into a row
    tableRows.push(ticketData);
  });


  // startY is basically margin-top
  doc.autoTable(tableColumn, tableRows, { startY: 20 });
  // ticket title. and margin-top + margin-left
  // we define the name of our PDF file.
  doc.save(`${tickets[0].event}.pdf`);
};

export default generatePDF;