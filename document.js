document.getElementById('drop_zone').addEventListener('click', function() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'application/pdf';
    fileInput.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            loadPdf(file);
        }
    };
    fileInput.click();
});

document.getElementById('drop_zone').addEventListener('dragover', function(event) {
    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';
});

document.getElementById('drop_zone').addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    const files = event.dataTransfer.files;
    if (files && files[0]) {
        loadPdf(files[0]);
    }
});

function loadPdf(file) {
    const fileReader = new FileReader();
    fileReader.onload = function() {
        const typedarray = new Uint8Array(this.result);
    
        pdfjsLib.getDocument(typedarray).promise.then(pdf => {
            console.log('PDF loaded');
            console.log(`Number of pages: ${pdf.numPages}`);
    
            // Initialize an array to store all course IDs
            let courseIds = [];
    
            // Function to process each page
            const processPage = (pageNum) => {
                return pdf.getPage(pageNum).then(function(page) {
                    console.log('Page loaded', pageNum);
                    
                    // Get the text content of the page
                    return page.getTextContent().then(function(textContent) {
                        // Use a regular expression to find course IDs
                        const regex = /\b[A-Z]{4}\d{3,4}\b/g; // Adjust the regex if course codes differ
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        const foundIds = pageText.match(regex);
                        if (foundIds) {
                            courseIds = courseIds.concat(foundIds);
                        }
                    });
                });
            };
    
            // Create a promise array to handle all pages
            const promises = [];
            for (let i = 1; i <= pdf.numPages; i++) { // PDF.js uses 1-based indexing for pages
                promises.push(processPage(i));
            }
    
            // When all pages have been processed, update the textarea
            Promise.all(promises).then(() => {
                // Remove duplicates and update the textarea
                const uniqueCourseIds = [...new Set(courseIds)];
                document.getElementById('text_output').value = uniqueCourseIds.join('\n');
            });
        });
    };
    fileReader.readAsArrayBuffer(file);
}

