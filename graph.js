/*
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
*/
//const departmentColors = Array.from({ length: 30 }, getRandomColor);
const departmentColors = [
  "#1E8136",
  "#C3755B",
  "#F6CBAB",
  "#DB984E",
  "#584991",
  "#9FA9F4",
  "#C18AFB",
  "#F2FB80",
  "#DF5F8F",
  "#035BF9",
  "#E78024",
  "#93E013",
  "#055825",
  "#7E9654",
  "#CDB312",
  "#C65765",
  "#CAAFEC",
  "#A84279",
  "#D7CEE2",
  "#108D40",
  "#BD56B3",
  "#DB0083",
  "#D72031",
  "#183398",
  "#0A417A",
  "#AFA706",
  "#71CDE4",
  "#90E3D3",
  "#65649D",
  "#5AB933"
]

let courses = [];
let modules = [];
let details = [];
let selectedDepartments = [];

const org_names = ['Kieli- ja viestintätieteiden laitos', 'Bio- ja ympäristötieteiden laitos', 'Liikuntatieteellinen tiedekunta', 'Yliopistopalvelut', 'Musiikin, taiteen ja kulttuurin tutkimuksen laitos', 'Humanistis-yhteiskuntatieteellinen tiedekunta', 'Psykologian laitos', 'Avoin yliopisto', 'Matematiikan ja tilastotieteen laitos', 'Informaatioteknologian tiedekunta', 'Kokkolan yliopistokeskus Chydenius - Kasvatustieteet', 'Kokkolan yliopistokeskus Chydenius - Yhteiskuntatieteet', 'Jyväskylän yliopiston kauppakorkeakoulu', 'Kokkolan yliopistokeskus Chydenius', 'Matemaattis-luonnontieteellinen tiedekunta', 'Yliopiston yhteiset', 'Avoimen tiedon keskus', 'Koulutuspalvelut', 'Historian ja etnologian laitos', 'Kemian laitos', 'Monikielisen akateemisen viestinnän keskus', 'Kokkolan yliopistokeskus Chydenius - Informaatioteknologia', 'Henkilöstöpalvelut', 'Kasvatustieteiden laitos', 'Yhteiskuntatieteiden ja filosofian laitos', 'Opettajankoulutuslaitos', 'Fysiikan laitos', 'Kasvatustieteiden ja psykologian tiedekunta', 'Jyväskylän yliopisto']; 

const controls = document.getElementById('controls');

org_names.forEach((name, index) => {
    const label = document.createElement('label');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.value = name;
    checkbox.style.marginRight = '8px';
    checkbox.onchange = () => { refreshDepartments(name, checkbox.checked); };
    label.appendChild(checkbox);
    label.appendChild(document.createTextNode(name));
    controls.appendChild(label);
    controls.appendChild(document.createElement('br'));
});

function addModuleControls(data) { 
    const module_controls = document.getElementById('modules');
    modules.forEach((item) => {
	   const label = document.createElement('label');
	   const checkbox = document.createElement('input');
	   checkbox.type = 'checkbox';
	   checkbox.value = item['module'];
	   checkbox.style.marginRight = '8px';
	   checkbox.onchange = () => { refreshModules(item['codes'], checkbox.checked); };
	   label.appendChild(checkbox);
	   label.appendChild(document.createTextNode(item['module']));
	   module_controls.appendChild(label);
	   module_controls.appendChild(document.createElement('br'));
   });
} 

const levels = ['Muut opinnot', 'Perusopinnot', 'Aineopinnot', 'Syventävät opinnot', 'Jatko-opinnot', 'Ammattiopinnot']

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
    details.innerHTML = `<strong>Nimi:</strong> ${course.name.fi} (<a href="https://opinto-opas.jyu.fi/2024/fi/opintojakso/${course.code.toLowerCase()}/" target="_blank" rel="noopener noreferrer">${course.code}</a>)<br>
	<strong>Sisältö:</strong></br> ${course.content.fi}<br>
	<strong>Kuvaus:</strong></br> ${course.outcomes.fi}</br>
	<strong>Esitiedot:</strong></br> ${course.prerequisites ? course.prerequisites.fi : "Ei esitietovaatimuksia."}`;
    modal.style.display = 'block';
}

function getHighlightedCourses() {
    const text = document.getElementById('textOutput').value.trim(); 
    return text ? text.split('\n') : [];
}

function coursePrerequisitenes(user_given_course) { 
    let ret = 0;
    courses.forEach(course_in_list => {
	if (course_in_list.prerequisites.includes(user_given_course.id)) ret++; 
    });
    if (ret != 0) return Math.round(Math.log(ret));
    return 0;
}

function renderNetwork() {
    console.log("Rendering courses...")
    const highlightedCourses = getHighlightedCourses();
    let departmentNodes = [];
    let departmentEdges = [];
    courses.forEach(course => {
	if (selectedDepartments.includes(course.department) ){ // && highlightedCourses.includes(course.id)) { // for less revealing view use this
	    const nodeSize = getNodeSize(course.prerequisites.length);
	    const formattedLabel = formatLabel(course.name, 8); 
	    if (!departmentNodes.some(node => node.id === course.id)) {
		const backgroundColor = departmentColors[org_names.indexOf(course.department)]; 
		let opacity = highlightedCourses.length === 0 || highlightedCourses.includes(course.id) ? 1.0 : 0.0; // Default opacity for all nodes if no text, otherwise reduce opacity for non-highlighted nodes
		opacity *= levels.indexOf(course.level) * 0.5
		const rgbaColor = `rgba(${parseInt(backgroundColor.slice(-6, -4), 16)}, ${parseInt(backgroundColor.slice(-4, -2), 16)}, ${parseInt(backgroundColor.slice(-2), 16)}, ${opacity})`;
		let prerequisitenes = coursePrerequisitenes(course);
		departmentNodes.push({
		    id: course.id,
		    label: formattedLabel,
		    level: 5*levels.indexOf(course.level) - prerequisitenes,
		    font: {
			multi: 'html',
			size: 256,
			face: 'monospace',
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
    let network_renderer = new vis.Network(container, data, options);
    network_renderer.on("click", function (params) {
	if (params.nodes.length > 0) {
	    const nodeId = params.nodes[0];
	    getCourseDetails(nodeId);
	}
    });
}

loadCourses();
loadModules();
loadDetails();

const container = document.getElementById('network');
const options = {
    nodes: { 
	shape: 'box',
	size: 200,
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
	    levelSeparation: 850,
	    nodeSpacing: 400,
	}, 
    }, 
    physics: { 
        enabled: false,
    },
};


function refreshModules(codes, checked) { 
     text = document.getElementById('textOutput');
     text.innerHTML = "";
     if (checked) { 
         codes.forEach((code) => { text.innerHTML += code + "\n"; });
     }
     renderNetwork();
}

function refreshDepartments(name, checked) { 
        console.log(checked)
        if (checked) { 
            selectedDepartments.push(name);
        } else { 
            selectedDepartments.splice(selectedDepartments.indexOf(name), 1);
        }
        console.log(selectedDepartments)
	renderNetwork();
}

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
