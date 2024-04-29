const departmentColors = [
    "#FFA500", // Orange
    "#FFFFFF", // White
    "#A6CC70", // Light Olive Green
    "#00FFFF", // Cyan (Aqua)
    "#C49191", // Pale Red (Rosy Brown)
    "#FF2222", // Red
    "#22FF11", // Neon Green
    "#33FFCC", // Medium Turquoise
    "#7DF9FF", // Electric Blue
    "#E666FF", // Bright Lavender
    "#4DB3FF", // Maya Blue
    "#DEB887", // Burlywood
    "#FFE4C4", // Bisque
    "#F0E68C", // Khaki
    "#FAFAD2", // Light Goldenrod Yellow
    "#D3D3D3", // Light Grey
    "#FFB6C1", // Light Pink
    "#FFD700", // Gold
    "#ADD8E6", // Light Blue
    "#E0FFFF", // Light Cyan
    "#F08080", // Light Coral
    "#F5DEB3", // Wheat
    "#FFFACD", // Lemon Chiffon
    "#FAEBD7", // Antique White
    "#BA55D3", // Medium Orchid
    "#FFC0CB", // Pink
    "#DDA0DD", // Plum
    "#B0E0E6", // Powder Blue
    "#FFF5EE",  // Seashell
    "#007722"
];

let courses = [];

function loadCourses() {
    fetch('reqs.json') // Adjust the path as necessary
    .then(response => response.json()) // Parses the JSON response into a JavaScript object
    .then(data => {
        courses = data; // Assigns the data to the courses array
        console.log("Courses loaded:", courses); // Log to verify
    })
    .catch(error => console.error("Error loading courses:", error)); // Log errors if any
}

let network;
let container = document.getElementById('network');
let options = {
    edges: {
        arrows: 'to'
    },
};

let details = [];

function loadDetails() {
    fetch('courses.json')
    .then(response => response.json())
    .then(allData => {
    // Assuming allData is an array of objects each containing a data.SISU.courseUnit array
    allData.forEach(item => {
                //console.log(item)
        if (item && item.result.data.SISU && item.result.data.SISU.courseUnit) {
        details = details.concat(item.result.data.SISU.courseUnit);  // Append each courseUnit array to the details array
        }
    });
    console.log("Details loaded...");
    })
    .catch(error => console.error("Error loading courses:", error));
}

function getCourseDetails(courseId) {
    const course = details.find(course => course.code === courseId);
    if (course) {
        displayCourseDetails(course);
    } else {
        alert("Course not found!");
    }
}

function displayCourseDetails(course) {
    const modal = document.getElementById('courseModal');
    const details = document.getElementById('courseDetails');
    details.innerHTML = `<strong>Nimi:</strong> ${course.name.fi} (${course.code})<br>
                <strong>Sisältö:</strong></br> ${course.content.fi}<br>
                <strong>Kuvaus:</strong></br> ${course.outcomes.fi}</br>
                                <strong>Esitiedot:</strong></br> ${course.prerequisites ? course.prerequisites.fi : "Ei esitietovaatimuksia."}`;
    modal.style.display = 'block';
}

// Function to read course IDs from the text area
function getHighlightedCourses() {
    const text = document.getElementById('text_output').value.trim(); // Ensure to trim to remove any extraneous whitespace
    return text ? text.split('\n') : [];
}

// Updated renderNetwork function
function renderNetwork(departmentIndex, index) {
    const highlightedCourses = getHighlightedCourses();
    let departmentNodes = [];
    let departmentEdges = [];
    courses.forEach(course => {
        if (index === 29 || course.department === departmentIndex) {
           
            const nodeSize = getNodeSize(course.prerequisites.length);
            const formattedLabel = formatLabel(course.name, 15);

            if (!departmentNodes.some(node => node.id === course.id)) {
                const backgroundColor = departmentColors[org_names.indexOf(course.department)]; 
                let opacity = highlightedCourses.length === 0 || highlightedCourses.includes(course.id) ? 0.9 : 0.1; // Default opacity for all nodes if no text, otherwise reduce opacity for non-highlighted nodes
                opacity = levels.indexOf(course.level)*0.25
                const rgbaColor = `rgba(${parseInt(backgroundColor.slice(-6, -4), 16)}, ${parseInt(backgroundColor.slice(-4, -2), 16)}, ${parseInt(backgroundColor.slice(-2), 16)}, ${opacity})`;
                const textColor = backgroundColor === '#000000' ? 'lightgrey' : 'black';
                departmentNodes.push({
                    id: course.id,
                    label: formattedLabel,
                    value: nodeSize,
                    shape: 'circle',
                    font: {
                        multi: 'html',
                        size: 14,
                        face: 'arial',
                        color: textColor
                    },
                    shapeProperties: {
                        interpolation: false
                    },
                    color: {
                        background: rgbaColor,
                        border: 'black',
                    }
                });
            } else {
                console.log(`Node with id ${course.id} already exists.`);
            }

            course.prerequisites.forEach(prereq => {
                if (!departmentEdges.some(edge => edge.from === prereq && edge.to === course.id)) {
                    departmentEdges.push({from: prereq, to: course.id, arrows: 'to'});
                } else {
                    console.log(`Edge from ${prereq} to ${course.id} already exists.`);
                }
            });
        }
    });

    let data = {
        nodes: new vis.DataSet(departmentNodes),
        edges: new vis.DataSet(departmentEdges)
    };

    if (network) {
        network.destroy();
    }

    network = new vis.Network(container, data, options);
    network.on("click", function (params) {
        if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            getCourseDetails(nodeId);
        }
    });
}

loadCourses();
loadDetails();

// Add buttons for each department
const org_names = ['Kieli- ja viestintätieteiden laitos', 'Bio- ja ympäristötieteiden laitos', 'Liikuntatieteellinen tiedekunta', 'Yliopistopalvelut', 'Musiikin, taiteen ja kulttuurin tutkimuksen laitos', 'Humanistis-yhteiskuntatieteellinen tiedekunta', 'Psykologian laitos', 'Avoin yliopisto', 'Matematiikan ja tilastotieteen laitos', 'Informaatioteknologian tiedekunta', 'Kokkolan yliopistokeskus Chydenius - Kasvatustieteet', 'Kokkolan yliopistokeskus Chydenius - Yhteiskuntatieteet', 'Jyväskylän yliopiston kauppakorkeakoulu', 'Kokkolan yliopistokeskus Chydenius', 'Matemaattis-luonnontieteellinen tiedekunta', 'Yliopiston yhteiset', 'Avoimen tiedon keskus', 'Koulutuspalvelut', 'Historian ja etnologian laitos', 'Kemian laitos', 'Monikielisen akateemisen viestinnän keskus', 'Kokkolan yliopistokeskus Chydenius - Informaatioteknologia', 'Henkilöstöpalvelut', 'Kasvatustieteiden laitos', 'Yhteiskuntatieteiden ja filosofian laitos', 'Opettajankoulutuslaitos', 'Fysiikan laitos', 'Kasvatustieteiden ja psykologian tiedekunta', 'Jyväskylän yliopisto', 'kaikki (laskennallisesti raskas!)']; 

const levels = ['Muut opinnot', 'Aineopinnot', 'Perusopinnot', 'Syventävät opinnot', 'Jatko-opinnot', 'Ammattiopinnot']

const controls = document.getElementById('controls');
departmentColors.forEach((color, index) => {
    const button = document.createElement('button');
    button.textContent = `${org_names[index]} - ${index}`;
    button.style.backgroundColor = color;
    button.onclick = () => renderNetwork(org_names[index], index);
    controls.appendChild(button);
});

function getNodeSize(prerequisitesCount) {
    const baseSize = 1;
    return baseSize + (2 * prerequisitesCount);
}

function formatLabel(name, maxLineLength) {
    let parts = name.split(/\s+/);
    let newLabel = '';
    let line = '';

    parts.forEach(part => {
        if (line.length + part.length >= maxLineLength) {
            newLabel += line.trim() + '\n';
            line = '';
        }
        line += part + ' ';
    });

    newLabel += line.trim();
    return newLabel;
}
