import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";

const UploadExcel = () => {
  const [excelData, setExcelData] = useState([]);
  const [template, setTemplate] = useState("standard");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewLines, setPreviewLines] = useState([]);
  const handleTemplateChange = (e) => {
    setTemplate(e.target.value);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = (event) => {
      const binaryStr = event.target.result;
      const workbook = XLSX.read(binaryStr, { type: "binary" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      setExcelData(jsonData);
    };
    reader.readAsBinaryString(file);
  };

const handleSubmit = async () => {
  if (!selectedFile) {
    alert("Please upload an Excel file first.");
    return;
  }

  const formData = new FormData();
  formData.append("file", selectedFile);
  formData.append("template", template);

  try {
  const response = await axios.post("https://formatpro-backend.onrender.com/upload", formData);

  console.log("Upload response:", response.data); // 👈 ADD THIS

  if (response.data.preview && response.data.preview.length > 0) {
    setPreviewLines(response.data.preview);
  } else {
    alert("No preview returned.");
  }
} catch (error) {
  console.error("Error uploading file:", error);
  alert("There was a problem processing your file.");
}
};

  return (
  <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
    <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-2xl border border-gray-200">
    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
      Machine Inventory Formatter
    </h1>

<div className="mb-6">
  <label className="block mb-2 font-medium text-gray-700">Choose Template:</label>
  <select
    value={template}
    onChange={handleTemplateChange}
    className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="standard">Standard</option>
    <option value="date_after_sn">Date After Serial Number</option>
  </select>
</div>


     <div className="mb-6">
  <label className="block mb-2 font-medium text-gray-700">Upload Excel File:</label>
  <input
    type="file"
    accept=".xlsx, .xls"
    onChange={handleFileUpload}
    className="border border-gray-300 px-4 py-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
  />
</div>

<div className="flex flex-wrap gap-4 mt-6">
  <button
    onClick={handleSubmit}
    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
  >
    Generate Word File
  </button>
  {previewLines.length > 0 && (
    <button
      onClick={async () => {
        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("template", template);

        try {
          const response = await axios.post("https://formatpro-backend.onrender.com/download", formData, {
            responseType: "blob",
          });

          const blob = new Blob([response.data], {
            type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          });

          const url = window.URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.setAttribute("download", "formatted_inventory.docx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (error) {
          console.error("Error downloading file:", error);
          alert("There was a problem downloading your Word file.");
        }
      }}
      className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 transition font-medium"
    >
      Download Word File
    </button>
  )}
</div>

      {previewLines.length > 0 && (
        <>
          <div className="mt-6">
            <h2 className="text-lg font-bold mb-2">Formatted Preview:</h2>
            
            <div className="bg-gray-50 border border-gray-300 rounded-lg p-4 max-h-96 overflow-y-scroll whitespace-pre-wrap font-mono text-sm max-w-2xl mx-auto shadow-inner">
              {previewLines.map((line, idx) => (
                <div key={idx}>{line}</div>
              ))}
            </div>
          </div>


        </>
      )}
    </div>  
  </div>   
  );
};
export default UploadExcel;