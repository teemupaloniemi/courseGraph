import json
import re
import jmespath

def load_data():
    try:
        with open('courses.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return None

def make_prerequisites(courses):
    courses_and_preqs = []
    
    for course in courses:
        # Code
        query = "result.data.SISU.courseUnit[].code"
        course_ids = jmespath.search(query, course)
        course_id = None
        if course_ids is not None:
            course_id = course_ids[0]
        # Name
        query = "result.data.SISU.courseUnit[].name.fi"
        names = jmespath.search(query, course)
        name = None
        if names is not None:
            name = names[0]
        # Prerequisites
        query = "result.data.SISU.courseUnit[].prerequisites.en"
        reqs = jmespath.search(query, course)
        reqs = "" 
        if reqs is not None and len(reqs) > 0:
            reqs = reqs[0]
        query = "result.data.SISU.courseUnit[].prerequisites.fi"
        tmp = jmespath.search(query, course)
        if tmp is not None and len(tmp) > 0:
            if reqs is not None and len(reqs) > 0:
                reqs = f"{reqs[0]} {tmp[0]}" 
            else:
                reqs = tmp[0]

        req_list = None
        if reqs is not None:
            course_code_pattern = re.compile(r'\b[A-Z]{4}\d{3,4}\b')
            req_list = list(set(course_code_pattern.findall(reqs))) 

        # Deps
        query = "result.data.SISU.courseUnit[].responsibleOrganisations[].name.fi"
        tmp = jmespath.search(query, course)
        org = None
        if tmp is not None and len(tmp) > 0:
            org = tmp[0]
 
        # level
        query = "result.data.SISU.courseUnit[].studyLevel.name.fi"
        tmp = jmespath.search(query, course)
        level = None
        if tmp is not None and len(tmp) > 0:
            level = tmp[0]       
        
        if level is None or req_list is None or name is None or course_id is None or org is None:
            continue
     
        course_data = {
                'id': course_id,
                'name': name,
                'prerequisites': req_list,
                'department': org,  
                'level': level
        }
        
        courses_and_preqs.append(course_data)
    
    with open("reqs.json", 'w', encoding='utf-8') as req_f:
        req_f.write(json.dumps(courses_and_preqs, indent=4))

    return courses_and_preqs

courses = load_data()
prerequisites = make_prerequisites(courses)

