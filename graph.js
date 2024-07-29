const departmentColors = [
    "#CC3700",
    "#CC5238",
    "#CC663D",
    "#CC7200",
    "#CC8400",
    "#CCAA00",
    "#CCCC00",
    "#99CC26",
    "#66CC00",
    "#66A800",
    "#00CC00",
    "#29A329",
    "#009973",
    "#00CCCC",
    "#009BAA",
    "#366792",
    "#0066CC",
    "#324EA0",
    "#6A1FB2",
    "#7500A9",
    "#7D26A3",
    "#9C3FB2",
    "#CC00CC",
    "#CC1273",
    "#CC578F",
    "#CC8B99",
    "#CC9AA9",
    "#CCAA99",
    "#CCB492",
    "#CCDBA2",
];     
 
let courses = [];

function loadCourses() {
    fetch('reqs.json') 
    .then(response => response.json()) 
    .then(data => {
        courses = data; 
        console.log("Courses loaded:", courses);
    })
    .catch(error => console.error("Error loading courses:", error)); 
}

let network;
let container = document.getElementById('network');
let options = {
    nodes: { 
        size: 500,
    },
    edges: {
        arrows: 'to',
        width: 16,
        hoverWidth: 64,
        selectionWidth: 64,
        smooth: {
            enabled: true,
            type: 'continuous',
        },
    },
    layout: { 
        hierarchical: { 
            enabled: true,
            sortMethod: "directed",
            levelSeparation: 1000,
            nodeSpacing: 300,
        }, 
    }, 
    physics: { 
        enabled: false,
    },
};

let details = [];

function loadDetails() {
    fetch('courses.json')
    .then(response => response.json())
    .then(allData => {
    allData.forEach(item => {
        if (item && item.result.data.SISU && item.result.data.SISU.courseUnit) {
            details = details.concat(item.result.data.SISU.courseUnit); 
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

function getHighlightedCourses() {
    const text = document.getElementById('text_output').value.trim(); 
    return text ? text.split('\n') : [];
}

function coursePrerequisitenes(user_given_course) { 
    let ret = 0;
    courses.forEach( course_in_list => {
        if (course_in_list.prerequisites.includes(user_given_course.id)) ret++; 
    });
    return ret;
}


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
                let prerequisitenes = coursePrerequisitenes(course);
                if (prerequisitenes != 0) prerequisites = Math.round(Math.log(prerequisitenes));
                departmentNodes.push({
                    id: course.id,
                    label: formattedLabel,
                    level: 5*levels.indexOf(course.level) - prerequisitenes,
                    shape: 'circle',
                    font: {
                        multi: 'html',
                        size: 128,
                        face: 'arial',
                        color: 'black',
                        align: 'center',
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

const org_names = ['Kieli- ja viestintätieteiden laitos', 'Bio- ja ympäristötieteiden laitos', 'Liikuntatieteellinen tiedekunta', 'Yliopistopalvelut', 'Musiikin, taiteen ja kulttuurin tutkimuksen laitos', 'Humanistis-yhteiskuntatieteellinen tiedekunta', 'Psykologian laitos', 'Avoin yliopisto', 'Matematiikan ja tilastotieteen laitos', 'Informaatioteknologian tiedekunta', 'Kokkolan yliopistokeskus Chydenius - Kasvatustieteet', 'Kokkolan yliopistokeskus Chydenius - Yhteiskuntatieteet', 'Jyväskylän yliopiston kauppakorkeakoulu', 'Kokkolan yliopistokeskus Chydenius', 'Matemaattis-luonnontieteellinen tiedekunta', 'Yliopiston yhteiset', 'Avoimen tiedon keskus', 'Koulutuspalvelut', 'Historian ja etnologian laitos', 'Kemian laitos', 'Monikielisen akateemisen viestinnän keskus', 'Kokkolan yliopistokeskus Chydenius - Informaatioteknologia', 'Henkilöstöpalvelut', 'Kasvatustieteiden laitos', 'Yhteiskuntatieteiden ja filosofian laitos', 'Opettajankoulutuslaitos', 'Fysiikan laitos', 'Kasvatustieteiden ja psykologian tiedekunta', 'Jyväskylän yliopisto', 'Kaikki (Hidas!)']; 

const levels = ['Muut opinnot', 'Perusopinnot', 'Aineopinnot', 'Syventävät opinnot', 'Jatko-opinnot', 'Ammattiopinnot']

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

