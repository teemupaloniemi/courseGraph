document.getElementById('dropZone').addEventListener('click', function() {

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


document.getElementById('dropZone').addEventListener('dragover', function(event) {

    event.preventDefault();
    event.stopPropagation();
    event.dataTransfer.dropEffect = 'copy';

});


document.getElementById('dropZone').addEventListener('drop', function(event) {

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
    
            let courseIds = [];
    
            const processPage = (pageNum) => {

                return pdf.getPage(pageNum).then(function(page) {

                    console.log('Page loaded', pageNum);
                    
                    return page.getTextContent().then(function(textContent) {

                        const regex = /\b[A-Z]{4}\d{3,4}\b/g; 
                        const pageText = textContent.items.map(item => item.str).join(' ');
                        const foundIds = pageText.match(regex);

                        if (foundIds) {

                            courseIds = courseIds.concat(foundIds);

                        }

                    });

                });

            };
    
            const promises = [];

            for (let i = 1; i <= pdf.numPages; i++) { 
		   
                promises.push(processPage(i));

            }
    
            Promise.all(promises).then(() => {

                const uniqueCourseIds = [...new Set(courseIds)];
                document.getElementById('textOutput').value = uniqueCourseIds.join('\n');

            });

        });

    };

    fileReader.readAsArrayBuffer(file);

}
