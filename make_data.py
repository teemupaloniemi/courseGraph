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

    # Create a dictionary to map course names to their codes
    name_to_code = {}

    for course in courses:

        code = jmespath.search("result.data.SISU.courseUnit[].code", course)

        if code:

            name = jmespath.search("result.data.SISU.courseUnit[].name.fi", course)

            if name:

                name_to_code[name[0]] = code[0]

    courses_and_preqs = []
    
    for course in courses:

        # Safely retrieve values with checks for empty results
        code = jmespath.search("result.data.SISU.courseUnit[].code", course)
        course_id = code[0] if code else None

        name = jmespath.search("result.data.SISU.courseUnit[].name.fi", course)
        course_name = name[0] if name else None

        en_reqs = jmespath.search("result.data.SISU.courseUnit[].prerequisites.en", course)
        fi_reqs = jmespath.search("result.data.SISU.courseUnit[].prerequisites.fi", course)

        reqs = (en_reqs[0] if en_reqs else '') + ' ' + (fi_reqs[0] if fi_reqs else '')

        # Finding all course codes in the prerequisites
        course_code_pattern = re.compile(r'\b[A-Z]{4}\d{3,4}\b')
        req_list = set(course_code_pattern.findall(reqs))
        
        # Use regex to capture potential course names (considering typical word breaks and possible numbers)
        potential_names = re.findall(r'\b[\w\s]+\b', reqs)

        # Match the longest potential names against known course names
        for potential_name in potential_names:

            potential_name = potential_name.strip()

            if potential_name in name_to_code:

                req_list.add(name_to_code[potential_name])

        req_list = list(req_list)

        orgs = jmespath.search("result.data.SISU.courseUnit[].responsibleOrganisations[].name.fi", course)
        org = orgs[0] if orgs else None

        levels = jmespath.search("result.data.SISU.courseUnit[].studyLevel.name.fi", course)
        level = levels[0] if levels else None
        
        if level and course_name and course_id and org:

            course_data = {

                'id': course_id,
                'name': course_name,
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
