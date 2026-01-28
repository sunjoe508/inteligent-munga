
import { jsPDF } from "jspdf";

export const downloadAsText = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/plain" });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.txt`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadAsPDF = (content: string, filename: string) => {
  const doc = new jsPDF();
  const splitText = doc.splitTextToSize(content, 180);
  doc.text(splitText, 10, 10);
  doc.save(`${filename}.pdf`);
};

export const downloadAsMarkdown = (content: string, filename: string) => {
  const element = document.createElement("a");
  const file = new Blob([content], { type: "text/markdown" });
  element.href = URL.createObjectURL(file);
  element.download = `${filename}.md`;
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};
