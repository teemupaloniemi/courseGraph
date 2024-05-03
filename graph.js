const departmentColors = [
    "#B37400", // Darker Orange
    "#999999", // Darker White (Grey)
    "#708C4A", // Darker Olive Green
    "#007F7F", // Darker Cyan (Aqua)
    "#825D5D", // Darker Rosy Brown
    "#B20000", // Darker Red
    "#167D00", // Darker Neon Green
    "#228D79", // Darker Medium Turquoise
    "#527E9F", // Darker Electric Blue
    "#A349B6", // Darker Bright Lavender
    "#357BB5", // Darker Maya Blue
    "#A57859", // Darker Burlywood
    "#CFA673", // Darker Bisque
    "#B1A767", // Darker Khaki
    "#B7B38D", // Darker Light Goldenrod Yellow
    "#7F7F7F", // Darker Light Grey
    "#B24D75", // Darker Light Pink
    "#B28C00", // Darker Gold
    "#7F9DB9", // Darker Light Blue
    "#7F9F9F", // Darker Light Cyan
    "#B25A5A", // Darker Light Coral
    "#B1967B", // Darker Wheat
    "#B19D77", // Darker Lemon Chiffon
    "#B19885", // Darker Antique White
    "#8039A1", // Darker Medium Orchid
    "#B27784", // Darker Pink
    "#94699D", // Darker Plum
    "#7F999C", // Darker Powder Blue
    "#BFA5A3",  // Darker Seashell
    "#005619"  // Darker of the last color in the list
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
            const formattedLabel = formatLabel(course.name, 8);

            if (!departmentNodes.some(node => node.id === course.id)) {
                const backgroundColor = departmentColors[org_names.indexOf(course.department)]; 
                let opacity = highlightedCourses.length === 0 || highlightedCourses.includes(course.id) ? 1.0 : 0.0; // Default opacity for all nodes if no text, otherwise reduce opacity for non-highlighted nodes
                opacity *= levels.indexOf(course.level)*0.25
                const rgbaColor = `rgba(${parseInt(backgroundColor.slice(-6, -4), 16)}, ${parseInt(backgroundColor.slice(-4, -2), 16)}, ${parseInt(backgroundColor.slice(-2), 16)}, ${opacity})`;
                departmentNodes.push({
                    id: course.id,
                    label: formattedLabel,
                    size: nodeSize,
                    shape: 'circle',
                    font: {
                        multi: 'html',
                        size: 14,
                        face: 'arial',
                        color: 'black'
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
                    departmentEdges.push({from: prereq, to: course.id, arrows: 'to', color: 'black'});
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
const org_names = ['Kieli- ja viestintätieteiden laitos', 'Bio- ja ympäristötieteiden laitos', 'Liikuntatieteellinen tiedekunta', 'Yliopistopalvelut', 'Musiikin, taiteen ja kulttuurin tutkimuksen laitos', 'Humanistis-yhteiskuntatieteellinen tiedekunta', 'Psykologian laitos', 'Avoin yliopisto', 'Matematiikan ja tilastotieteen laitos', 'Informaatioteknologian tiedekunta', 'Kokkolan yliopistokeskus Chydenius - Kasvatustieteet', 'Kokkolan yliopistokeskus Chydenius - Yhteiskuntatieteet', 'Jyväskylän yliopiston kauppakorkeakoulu', 'Kokkolan yliopistokeskus Chydenius', 'Matemaattis-luonnontieteellinen tiedekunta', 'Yliopiston yhteiset', 'Avoimen tiedon keskus', 'Koulutuspalvelut', 'Historian ja etnologian laitos', 'Kemian laitos', 'Monikielisen akateemisen viestinnän keskus', 'Kokkolan yliopistokeskus Chydenius - Informaatioteknologia', 'Henkilöstöpalvelut', 'Kasvatustieteiden laitos', 'Yhteiskuntatieteiden ja filosofian laitos', 'Opettajankoulutuslaitos', 'Fysiikan laitos', 'Kasvatustieteiden ja psykologian tiedekunta', 'Jyväskylän yliopisto', 'Kaikki (Hidas!)']; 

const levels = ['Muut opinnot', 'Aineopinnot', 'Perusopinnot', 'Syventävät opinnot', 'Jatko-opinnot', 'Ammattiopinnot']

const controls = document.getElementById('controls');
departmentColors.forEach((color, index) => {
    const button = document.createElement('button');
    button.textContent = `${org_names[index]}`;
    button.style.color = color;
    button.onclick = () => renderNetwork(org_names[index], index);
    controls.appendChild(button);
});

function getNodeSize(prerequisitesCount) {
    const baseSize = 1;
    return baseSize + prerequisitesCount;
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
