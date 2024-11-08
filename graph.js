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
let ACMClasses = [];
let selectedDepartments = [];
let selectedACMClasses = [];
let cy = null;

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
const ACMControls = document.getElementById('ACMControls');
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


/*
 * Function: addModuleControls
 * ----------------------------
 *   Adds checkboxes to the moduleControls elements
 *   which control what items are shown in the graph.
 *
 *   returns: None 
 */
function addModuleControls() {

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


/*
 * Function: addACMControls
 * ----------------------------
 *   Adds checkboxes to the ACM-selector elements
 *   which control what items are shown in the graph.
 *
 *   returns: None 
 */
function addACMControls() {

    ACMControls.innerHTML = '';
    let ACMClassesSet = new Set();  
    ACMClasses.forEach(item => {
    	    item['acm_level_1_classes'].forEach(acm_class_name => {
    	    	    ACMClassesSet.add(acm_class_name);
	    });
    });


    ACMClassesSet.forEach(item => {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = item;
        checkbox.style.marginRight = '8px';
        checkbox.onchange = () => refreshACMClasses(item, checkbox.checked);
        
	const label = document.createElement('label');
        label.appendChild(checkbox);
        label.appendChild(document.createTextNode(item));

        ACMControls.appendChild(label);
        ACMControls.appendChild(document.createElement('br'));

    });

}




/*
 * Function: search
 * ----------------------------
 *   Searches for a course in the graph and centers the graph on it.
 *
 *   returns: None
 */
function search() {

    let input = document.getElementById("search-input-course").value;
    let node = getNode(input);

    if (node !== null) {

        centerOnNode(node, 0.4);

    }

}

/*
 * Function: getNode
 * ----------------------------
 *   Finds the node with the given name or id.
 *   If no course is found, returns null.
 *
 *   input: string that contains the name or id of the node we want to search
 *
 *   returns: node, the node object or null
 */
function getNode(input) {

    input = input.toLowerCase();
    input = input.trim();
    let partialMatches = [];

    for (let node of cy.nodes()) {

        let data = node.data();
        let courseId = data.id.toLowerCase();
        let courseName = data.label.toLowerCase();
        if (input === courseId || input === courseName) {

            console.log(courseId, courseName);
            return node;

        }
        if (courseName.includes(input) || courseId.includes(input)) { 
	
	    partialMatches.push(node);

	}


    }

    if (partialMatches.length > 0) { 
	if (partialMatches.length === 1) { 
            return partialMatches[0];
	}
	let names = [];
	for (let node of partialMatches) { 

            names.push(`${node.data().label.toLowerCase()} - ${node.data().id.toLowerCase()}`);

	}

        alert(`Tarkoititko:\n-----------------\n\n${names.join("\n")}`);

    } else { 

        alert(input + " ei löytynyt!"); 

    }
    return null;

}

/*
 * Function: centerOnNode
 * ----------------------------
 *   Centers the graph on a given node with a specified zoom level.
 *
 *   node: the node to center on
 *   zoomLevel: the zoom level to set
 *
 *   returns: None
 */
function centerOnNode(node, zoomLevel) {

    if (cy !== null) {

        cy.animate({

            center: { eles: node },
            zoom: zoomLevel,
            duration: 0 		

        });

    }

}


//================ Load data ================


/**
 * Function: loadCourses
 * ----------------------------
 *   Uses the Fetch API to load prerequisites data for the courses.
 *
 *   *** Example data: ***
 *   [
 *       {
 *           "id": "AHAS008",
 *           "name": "Työharjoittelu",
 *           "prerequisites": [],
 *           "department": "Historian ja etnologian laitos",
 *           "level": "Syventävät opinnot"
 *       }, 
 *       {
 *           "id": "BENA4036",
 *           "name": "Ilmastonmuutos",
 *           "prerequisites": [],
 *           "department": "Bio- ja ympäristötieteiden laitos",
 *           "level": "Aineopinnot"
 *       }
 *   ]
 *
 *   !!! Changes the global variable *courses* !!!
 *
 *   returns: None
 */
function loadCourses() {

    fetch('reqs.json')

        .then(response => response.json())

        .then(data => {

            courses = data;
            console.log("Courses loaded:", courses);

        })

        .catch(error => console.error("Error loading courses:", error));

}


/**
 * Function: loadModules
 * ----------------------------
 *   Uses the Fetch API to load module information.
 *
 *   *** Example data: ***
 *   [
 *       {
 *           "module": "etaka2020", 
 *           "codes": [
 *               "ETAPER",
 *               "ETAP1101",
 *               "ETAP1102",
 *
 *                .
 *                .
 *                .
 *
 *               "ETAP1104",
 *               "ETNY002"
 *           ] 
 *       },
 *       more the same...
 *   ]
 *
 *   ! Changes the global variable *modules*
 *
 *   returns: None
 */
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


/**
 * Function: loadACM
 * ----------------------------
 *   Uses the Fetch API to load ACM calssifications for the courses (in development).
 *
 *   *** Example data: ***
 *    [
 *	{
 *	  "acm_level_1_classes": [
 *	    "Theory of computation",
 *	    "Software and its engineering",
 *	    "Social and professional topics"
 *	  ],
 *	  "course_id": "ITKJ8000"
 *	},
 *	...
 *	{
 *	  "acm_level_1_classes": [
 *	    "Security and privacy",
 *	    "Social and professional topics"
 *	  ],
 *	  "course_id": "ITKA2000"
 *	},
 *    ]
 *
 *
 *   ! Changes the global variable *ACMClasses*
 *
 *   returns: None
 */
function loadACM() {

    fetch('course_acm.json')

        .then(response => response.json())

        .then(allData => {

            ACMClasses = allData 
            console.log("ACM classes loaded:", ACMClasses);
            addACMControls();

        })

        .catch(error => console.error("Error loading ACMClassifications:", error));

}


//================ Events ================
 
/* The refreshDepartments and refreshModules look the same to the user. */ 
/* but they take a different route to make that happen.                 */ 
/*                                                                      */
/* refreshDepartments uses a global variable where the items are stored */
/* to change the behaviour of the renderNetwork() function.             */
/* renderNetwork() uses the selectedDepartments variable.               */
/*                                                                      */
/* refresModules uses a HTML textarea where the items are written       */
/* to change the behaviour of the renderNetwork() function.             */
/* renderNetwork() read the HTML textarea for the module codes          */
/* the selectedDepartments variable.                                    */


/*
 * Function: refreshDepartments
 * ----------------------------
 *   Refresh the list of selected departments as the checkboxes get clicked
 *
 *   name: name of the clicked department
 *   checked: boolean telling wether the checkbox is checked or not
 *
 *   ! Renders the network according to the modified departments
 *
 *   returns: None  
 */
function refreshDepartments(name, checked) {

    checked ? selectedDepartments.push(name) : selectedDepartments.splice(selectedDepartments.indexOf(name), 1);
    renderNetwork();

}


/*
 * Function: refreshACMClasses
 * ----------------------------
 *   Refresh the list of selected ACM classes as the checkboxes get clicked
 *
 *   name: name of the clicked class
 *   checked: boolean telling wether the checkbox is checked or not
 *
 *   ! Renders the network according to the modified classes
 *
 *   returns: None  
 */
function refreshACMClasses(name, checked) {

    checked ? selectedACMClasses.push(name) : selectedACMClasses.splice(selectedACMClasses.indexOf(name), 1);
    renderNetwork();

}




/*
 * Function: refreshModules
 * ----------------------------
 *   Refresh the list of selected modules as the checkboxes get clicked
 *
 *   codes: list of course codes in the module
 *   checked: boolean telling wether the checkbox is checked or not
 *
 *   ! Renders the network according to the modified modules
 *
 *   returns: None  
 */
function refreshModules(codes, checked) {

    const textOutput = document.getElementById('textOutput');
    textOutput.innerHTML = checked ? codes.join("\n") : '';
    renderNetwork();

}


//================ Graph ================

/*
 * Function: renderNetwork
 * ----------------------------
 *   Renders the network according to the current state of the global variables
 *
 *   returns: None 
 */                     
function renderNetwork() {

    showLoadingScreen(); 

    let highlightedCourses = getHighlightedCourses();
    highlightedCourses = filterACMClasses(highlightedCourses);
    const departmentNodes = [], departmentEdges = [];
    const levelSpacing = 1000, nodeSpacing = 600; 

    // Make a map for each level current postion so we can keep track of them when drawing.  
    let nodeLevelPositions = levels.reduce((acc, _, i) => (acc[i] = 0, acc), {}); 

    courses.forEach(course => {

        if (selectedDepartments.includes(course.department) && (highlightedCourses.includes(course.id) || highlightedCourses.length === 0) && inSelectedACMClass(course.id)) {

            addCourseNode(course, departmentNodes, nodeLevelPositions, levelSpacing, nodeSpacing);
            addCourseEdges(course, departmentEdges, highlightedCourses);

        }

    });

    cy = cytoscape({

        container: document.getElementById('network'),

        elements: { nodes: departmentNodes, edges: departmentEdges },

        style: [

            {

                selector: 'node',

                style: {

                    'label': 'data(label)',
                    'width': 450, 
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

    // Add an event listener to each node for details
    cy.on('tap', 'node', evt => getCourseDetails(evt.target.id()));

    hideLoadingScreen(); 

}

/*
 * Function: addCourseNode
 * ----------------------------
 *   Adding a node to the nodes-list for drawing
 *
 *   course: the course object that this node represents
 *   nodes: the list of nodes where the new node will be added
 *   nodeLevelPositions: list of current draw position for each level
 *   levelSpacing: integer defining how far levels are from each other (vertical)
 *   nodeSpacing: integer defining how far nodes are form each other (horizontal)
 *
 *   returns: None 
 */ 
function addCourseNode(course, nodes, nodeLevelPositions, levelSpacing, nodeSpacing) {

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
	    'font-size': 32,
	    'text-halign': 'center',
	    'text-valign': 'center',
	    'border-color': 'black',
	    'border-width': 2,

	},

        position: {

            // Horizontal postion comes from the list
            x: nodeLevelPositions[courseLevelIndex],
	
	    // Course vertical position is based on its level and prerequisiteness
            y: courseLevelIndex * levelSpacing - coursePrerequisitenes(course) * 0.2 * levelSpacing  

        }

    });

    // Move horisontally to next node spot in the grid
    nodeLevelPositions[courseLevelIndex] += nodeSpacing;

}


/*
 * Function: addCourseEdges
 * ----------------------------
 *   Adding a edges between this course and its prerequisites
 *
 *   course: the course object that this node represents
 *   edges: the list of edges where the new edges will be added
 *   highlightedCourses: list of highlighted courses, we dont want to connect to courses that are not on the display
 *
 *   returns: None 
 */ 
function addCourseEdges(course, edges, highlightedCourses) {

    course.prerequisites.forEach(prereq => {

        const prereqCourse = courses.find(c => c.id === prereq);

        if (prereqCourse && selectedDepartments.includes(prereqCourse.department) && (highlightedCourses.includes(prereq) || highlightedCourses.length === 0) && inSelectedACMClass(prereq)) {

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

/*
 * Function: showLoadingScreen
 * ----------------------------
 *   Reason is trivial, let me know if this is arrogant or ignorant or something
 *   I just thought maybe the naming was self explanatory. 
 *
 *   returns: None 
 */
function showLoadingScreen() {

    document.getElementById('loading-screen').style.display = 'flex';

}


/*
 * Function: hideLoadingScreen
 * ----------------------------
 *   Reason is trivial, let me know if this is arrogant or ignorant or something
 *   I just thought maybe the naming was self explanatory. 
 *
 *   returns: None 
 */
function hideLoadingScreen() {

    document.getElementById('loading-screen').style.display = 'none';

}


/*
 * Function: getHighlightedCourses
 * -------------------------------
 *   Extract the course codes given in the UI textarea.
 *
 *   returns: list[string] of course codes 
 */
function getHighlightedCourses() {

    const text = document.getElementById('textOutput').value.trim(); 
    return text ? text.split("\n") : [];

}


/*
 * Function: filterACMClasses
 * -------------------------------
 *   Filter a given list of course_ids.
 *
 *   returns: list[string] of course codes that are classified in selected ACM classes
 */
function filterACMClasses(course_ids) { 
    let ret = []; 
    for (let course_id of course_ids) 
    	    if (inSelectedACMClass(course_id)) 
    	    	    ret.push(course_id);   
    return ret; 
}


/*
 * Function: inSelectedACMClass
 * -------------------------------
 *   Check if the input id has a classification same as the user input.
 *
 *   returns: bool // true if course in selected ACM class else false (if no selected ACM class ret is always true)  
 */
function inSelectedACMClass(id) {
    if (selectedACMClasses.length == 0) 
        return true

    for (let class_name of selectedACMClasses) { 
	    for (let item of ACMClasses) 
		if (item['course_id'] == id && item['acm_level_1_classes'].includes(class_name)) 
		    return true;
    }
    return false;

}


/*
 * Function: getCourseDetails
 * -------------------------------
 *   Display course details based on courseId.
 *
 *   courseId: ID of the course we want to display
 *
 *   returns: None, this is kinda weird when the name is "get.*" but who reads my code anyways 
 */
function getCourseDetails(courseId) { displayCourseDetails(courseId); }


/*
 * Function: displayCourseDetails
 * -------------------------------
 *   Display course details.
 *
 *   course: Course object for that is displayd. See example_details.json for example.
 *
 *   returns: None
 */
function displayCourseDetails(courseId) {
    const modal = document.getElementById('courseModal');
    const detail = document.getElementById('courseDetails');
    detail.innerHTML = `<iframe src="https://opinto-opas.jyu.fi/2024/fi/opintojakso/${courseId.toLowerCase()}/" style="width:100%"></iframe>`;
    modal.style.display = 'block';
}


/*
 * Function: coursePrerequisiteness
 * -------------------------------
 *   Calculate how often this course is needed in the future studies.
 *
 *   course: Course object for that is displayd. See example_details.json for example.
 *
 *   returns: None
 */
function coursePrerequisitenes(userCourse) { 

    let ret = 0;

    courses.forEach(databaseCourse => {

	if (databaseCourse.prerequisites.includes(userCourse.id)) ret++; 

    });

    // We only want to separate these from the mass 
    // high hitrate is only marginally more important that small hitrate
    if (ret != 0) return Math.round(Math.log(ret));

    return 0;

}


//================ Main ================

/*
 * Function: Main
 * --------------
 *   This is where the first calls happen as the page is loaded
 *
 *   returns: None
 */
function main() { 

    hideLoadingScreen();
    loadCourses();
    loadModules();
    loadACM();

}


//================ Start ================
main();
