import { marked } from "marked"

export async function exportToHTML(markdown: string, projectName: string): Promise<void> {
  const html = await marked(markdown)
  
  const fullHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName || "README"}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
    }
    h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
    }
    pre code {
      background: none;
      padding: 0;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
    img {
      max-width: 100%;
      height: auto;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.75em;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${html}
</body>
</html>
  `
  
  const blob = new Blob([fullHTML], { type: "text/html" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = `${projectName || "README"}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export async function exportToPDF(markdown: string, projectName: string): Promise<void> {
  // For PDF export, we'll create a print-friendly HTML and use browser's print to PDF
  const html = await marked(markdown)
  
  const printWindow = window.open("", "_blank")
  if (!printWindow) {
    throw new Error("Failed to open print window. Please allow popups.")
  }
  
  printWindow.document.write(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${projectName || "README"}</title>
  <style>
    @media print {
      body { margin: 0; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
      line-height: 1.6;
      max-width: 900px;
      margin: 0 auto;
      padding: 2rem;
      color: #333;
    }
    h1, h2, h3, h4, h5, h6 {
      margin-top: 1.5em;
      margin-bottom: 0.5em;
      font-weight: 600;
      page-break-after: avoid;
    }
    h1 { font-size: 2.5em; border-bottom: 2px solid #eee; padding-bottom: 0.3em; }
    h2 { font-size: 2em; border-bottom: 1px solid #eee; padding-bottom: 0.3em; }
    h3 { font-size: 1.5em; }
    code {
      background: #f5f5f5;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-family: 'Monaco', 'Consolas', monospace;
      font-size: 0.9em;
    }
    pre {
      background: #f5f5f5;
      padding: 1em;
      border-radius: 5px;
      overflow-x: auto;
      page-break-inside: avoid;
    }
    pre code {
      background: none;
      padding: 0;
    }
    a {
      color: #0366d6;
      text-decoration: none;
    }
    img {
      max-width: 100%;
      height: auto;
      page-break-inside: avoid;
    }
    blockquote {
      border-left: 4px solid #ddd;
      margin: 1em 0;
      padding-left: 1em;
      color: #666;
      page-break-inside: avoid;
    }
    table {
      border-collapse: collapse;
      width: 100%;
      margin: 1em 0;
      page-break-inside: avoid;
    }
    th, td {
      border: 1px solid #ddd;
      padding: 0.75em;
      text-align: left;
    }
    th {
      background: #f5f5f5;
      font-weight: 600;
    }
  </style>
</head>
<body>
  ${html}
  <script>
    window.onload = function() {
      window.print();
    }
  </script>
</body>
</html>
  `)
  printWindow.document.close()
}
