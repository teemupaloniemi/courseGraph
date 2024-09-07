//================ Init ================
cytoscape.use( cytoscapeCoseBilkent );

const departmentColors =
[
  ["#1e8136", "#1a7230", "#16632a", "#125424", "#0e461e", "#0a3718"],
  ["#c3755b", "#b16a52", "#9f5f49", "#8d5440", "#7b4937", "#693f2e"],
  ["#f6cbab", "#ddba9a", "#c5a989", "#ac9878", "#938767", "#7a7656"],
  ["#db984e", "#c38646", "#ab753e", "#936337", "#7b522f", "#634127"],
  ["#584991", "#4f4283", "#463b75", "#3d3467", "#342d59", "#2b264b"],
  ["#9fa9f4", "#8f98dc", "#7f88c4", "#6f77ac", "#5f6694", "#4f567c"],
  ["#c18afb", "#ae7ddf", "#9a6fc4", "#8762a9", "#73548e", "#604673"],
  ["#f2fb80", "#dbef73", "#c4e367", "#adc75a", "#96ac4e", "#7f9042"],
  ["#df5f8f", "#c75480", "#af4971", "#973e62", "#7f3353", "#672844"],
  ["#035bf9", "#034fe0", "#0344c7", "#0338ae", "#022d95", "#02227c"],
  ["#e78024", "#cf731f", "#b7661b", "#9f5916", "#874d12", "#6f400d"],
  ["#93e013", "#84c310", "#76a60e", "#67890b", "#586d09", "#4a5006"],
  ["#055825", "#044e21", "#04441d", "#043b19", "#033115", "#032711"],
  ["#7e9654", "#71874c", "#647844", "#57693c", "#4a5b34", "#3d4c2c"],
  ["#cdb312", "#b79f10", "#a18c0e", "#8b790b", "#756609", "#5f5307"],
  ["#c65765", "#b04e5a", "#9a454e", "#843c43", "#6d3338", "#572a2c"],
  ["#caafec", "#b49ed3", "#9e8cba", "#887ba1", "#726988", "#5c5870"],
  ["#a84279", "#963b6c", "#85345e", "#742d51", "#632643", "#521f36"],
  ["#d7cee2", "#c2b9cc", "#ada5b7", "#9890a1", "#837b8b", "#6f6776"],
  ["#108d40", "#0f7f3a", "#0e7233", "#0d652d", "#0c5727", "#0a4a21"],
  ["#bd56b3", "#a94ca1", "#95428e", "#82387b", "#6e2e69", "#5a2456"],
  ["#db0083", "#c60076", "#b10069", "#9c005b", "#87004e", "#720041"],
  ["#d72031", "#c11c2c", "#ab1826", "#961421", "#80101b", "#6a0c16"],
  ["#183398", "#162e89", "#14297a", "#12246b", "#101f5c", "#0e1a4d"],
  ["#0a417a", "#093b6e", "#083562", "#073055", "#062a49", "#05243d"],
  ["#afa706", "#9e9605", "#8d8504", "#7c7403", "#6b6302", "#5a5202"],
  ["#71cde4", "#66b8cd", "#5ba3b7", "#508ea0", "#457989", "#3a6473"],
  ["#90e3d3", "#82ccc0", "#74b5ad", "#669e9a", "#588787", "#4a7074"],
  ["#65649d", "#5b5a8d", "#514f7e", "#47456e", "#3e3b5e", "#34304f"],
  ["#5ab933", "#51a32e", "#488e28", "#407822", "#37621c", "#2e4d17"]
]

let courses = [];
let modules = [];
let details = [];
let selectedDepartments = [];

const orgNames = [
    'Kieli- ja viestintätieteiden laitos', 
    'Bio- ja ympäristötieteiden laitos', 
    'Liikuntatieteellinen tiedekunta', 
    'Yliopistopalvelut',
    'Musiikin, taiteen ja kulttuurin tutkimuksen laitos', 
    'Humanistis-yhteiskuntatieteellinen tiedekunta', 
    'Psykologian laitos', 
    'Avoin yliopisto', 
    'Matematiikan ja tilastotieteen laitos', 
    'Informaatioteknologian tiedekunta', 
    'Kokkolan yliopistokeskus Chydenius - Kasvatustieteet', 
    'Kokkolan yliopistokeskus Chydenius - Yhteiskuntatieteet', 
    'Jyväskylän yliopiston kauppakorkeakoulu', 
    'Kokkolan yliopistokeskus Chydenius', 
    'Matemaattis-luonnontieteellinen tiedekunta', 
    'Yliopiston yhteiset',
    'Avoimen tiedon keskus',
    'Koulutuspalvelut', 
    'Historian ja etnologian laitos', 
    'Kemian laitos', 
    'Monikielisen akateemisen viestinnän keskus', 
    'Kokkolan yliopistokeskus Chydenius - Informaatioteknologia', 
    'Henkilöstöpalvelut', 
    'Kasvatustieteiden laitos', 
    'Yhteiskuntatieteiden ja filosofian laitos', 
    'Opettajankoulutuslaitos', 
    'Fysiikan laitos', 
    'Kasvatustieteiden ja psykologian tiedekunta', 
    'Jyväskylän yliopisto'
]; 

const levels = [
    'Muut opinnot', 
    'Perusopinnot', 
    'Aineopinnot', 
    'Syventävät opinnot', 
    'Jatko-opinnot', 
    'Ammattiopinnot'
]

const controls = document.getElementById('controls');
const moduleControls = document.getElementById('modules');


//================ UI controls ================


orgNames.forEach((name, index) => {

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    checkbox.style.marginRight = '8px';
    checkbox.onchange = () => refreshDepartments(name, checkbox.checked);

    const label = document.createElement('label');
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));

    controls.appendChild(label);
    controls.appendChild(document.createElement('br'));

});


function addModuleControls(data) {

    moduleControls.innerHTML = '';

    modules.forEach(item => {

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item['module'];
        checkbox.style.marginRight = '8px';
        checkbox.onchange = () => refreshModules(item['codes'], checkbox.checked);
        
	const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item['module']));

        moduleControls.appendChild(label);
        moduleControls.appendChild(document.createElement('br'));

    });

}


//================ Load data ================


function loadCourses() {

    fetch('reqs.json')

        .then(response => response.json())

        .then(data => {

            courses = data;
            console.log("Courses loaded:", courses);

        })

        .catch(error => console.error("Error loading courses:", error));

}


function loadModules() {

    fetch('modules.json')

        .then(response => response.json())

        .then(data => {

            modules = data;
            addModuleControls(data);
            console.log("Modules loaded:", modules);

        })

        .catch(error => console.error("Error loading modules:", error));

}


function loadDetails() {

    fetch('courses.json')

        .then(response => response.json())

        .then(allData => {

            details = allData.flatMap(item => item.result?.data?.SISU?.courseUnit || []);
            console.log("Details loaded:", details);

        })

        .catch(error => console.error("Error loading course details:", error));

}




//================ Events ================


function refreshDepartments(name, checked) {

    checked ? selectedDepartments.push(name) : selectedDepartments.splice(selectedDepartments.indexOf(name), 1);
    renderNetwork();

}


function refreshModules(codes, checked) {

    const textOutput = document.getElementById('textOutput');
    textOutput.innerHTML = checked ? codes.join("\n") : '';
    renderNetwork();

}


//================ Graph ================


function renderNetwork() {

    showLoadingScreen(); 

    const highlightedCourses = getHighlightedCourses();
    const departmentNodes = [], departmentEdges = [];
    const levelSpacing = 1000, nodeSpacing = 300; 
    let nodeLevelPositions = levels.reduce((acc, _, i) => (acc[i] = 0, acc), {}); 

    courses.forEach(course => {

        if (selectedDepartments.includes(course.department) && (highlightedCourses.includes(course.id) || highlightedCourses.length === 0)) {

            addCourseNode(course, departmentNodes, nodeLevelPositions, levelSpacing, nodeSpacing, highlightedCourses);
            addCourseEdges(course, departmentEdges, highlightedCourses);

        }

    });

    let cy = cytoscape({

        container: document.getElementById('network'),

        elements: { nodes: departmentNodes, edges: departmentEdges },

        style: [

            {

                selector: 'node',

                style: {

                    'label': 'data(label)',
                    'width': 225, 
                    'height': 150, 

                }

            },

            {

                selector: 'edge',

                style: {

                    'width': 2,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'

                }

            }

        ],

        layout: { 

		name: 'preset', 
		fit: true 

	}

    });

    cy.on('tap', 'node', evt => getCourseDetails(evt.target.id()));

    hideLoadingScreen(); 

}


function addCourseNode(course, nodes, nodeLevelPositions, levelSpacing, nodeSpacing, highlightedCourses) {

    const courseLevelIndex = levels.indexOf(course.level);
    const backgroundColor = departmentColors[orgNames.indexOf(course.department)][courseLevelIndex];

    nodes.push({

        data: {

            id: course.id,
            label: course.name,
            level: courseLevelIndex

        },

	style: {

	    'shape': 'rectangle',
	    'background-color': backgroundColor, 
	    'label': course.name,
	    'font-size': 16,
	    'text-halign': 'center',
	    'text-valign': 'center',
	    'border-color': 'black',
	    'border-width': 2,

	},

        position: {

            x: nodeLevelPositions[courseLevelIndex],
            y: courseLevelIndex * levelSpacing - coursePrerequisitenes(course) * 0.2 * levelSpacing  

        }

    });

    nodeLevelPositions[courseLevelIndex] += nodeSpacing;

}

function addCourseEdges(course, edges, highlightedCourses) {

    course.prerequisites.forEach(prereq => {

        const prereqCourse = courses.find(c => c.id === prereq);

        if (prereqCourse && selectedDepartments.includes(prereqCourse.department) && (highlightedCourses.includes(prereq) || highlightedCourses.length === 0)) {

            edges.push({

                data: { source: prereq, target: course.id },

                style: {

                    'line-color': 'black',
                    'target-arrow-shape': 'triangle'

                }

            });

        }

    });

}


//================ Utils ================


function showLoadingScreen() {

    document.getElementById('loading-screen').style.display = 'flex';

}


function hideLoadingScreen() {

    document.getElementById('loading-screen').style.display = 'none';

}


function getHighlightedCourses() {

    const text = document.getElementById('textOutput').value.trim();
    return text ? text.split('\n') : [];

}


function formatLabel(name, maxLineLength) {

    let parts = name.split(/\s+/);
    return parts.reduce((acc, part) => (acc += (acc.length + part.length >= maxLineLength ? '\n' : ' ') + part));

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

    details.innerHTML = `
        <strong>Name:</strong> ${course.name.fi} (<a href="https://opinto-opas.jyu.fi/2024/fi/opintojakso/${course.code.toLowerCase()}/" target="_blank">${course.code}</a>)<br>
        <strong>Content:</strong><br>${course.content.fi}<br>
        <strong>Learning outcomes::</strong><br>${course.outcomes.fi}<br>
        <strong>Prerequisites:</strong><br>${course.prerequisites?.fi || "None"}
    `;

    modal.style.display = 'block';

}


function coursePrerequisitenes(user_given_course) { 

    let ret = 0;

    courses.forEach(course_in_list => {

	if (course_in_list.prerequisites.includes(user_given_course.id)) ret++; 

    });

    if (ret != 0) return Math.round(Math.log(ret));

    return 0;

}



//================ Main ================
function main() { 

    hideLoadingScreen();
    loadCourses();
    loadModules();
    loadDetails();

}



//================ Start ================
main();
