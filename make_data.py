import json
import re
import jmespath
from flask import Flask, jsonify, request, render_template 
 
app = Flask(__name__)

def load_data():
    try:
        with open('courses.json', 'r', encoding='utf-8') as file:
            return json.load(file)
    except FileNotFoundError:
        return None

def search_by_id(course_data, search_id):
    query = "result.data.SISU.courseUnit[].code"
    course_ids = jmespath.search(query, course_data)
    if course_ids is None:
        return None
    if course_ids[0].lower() == search_id.lower():
        return course_data
    return None

def search_by_name(course_data, search_name):
    query = "result.data.SISU.courseUnit[].name.fi"
    course_ids = jmespath.search(query, course_data)
    if course_ids is None:
        return None
    if search_name.lower() in course_ids[0].lower(): 
        return course_data
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
        query = "result.data.SISU.courseUnit[].responsibleOrganisations.name.fi"
        tmp = jmespath.search(query, course)
        org = None
        if tmp is not None and len(tmp) > 0:
            org = tmp[0]
        
        if req_list is None or name is None or course_id is None or org is None:
            continue
     
        course_data = {
                'id': course_id,
                'name': name,
                'prerequisites': req_list,
                'Department': org  
        }
        
        courses_and_preqs.append(course_data)
    
    with open("reqs.json", 'a', encoding='utf-8') as req_f:
        for course in courses_and_preqs:
            print(json.dumps(course)+"\n")

    return courses_and_preqs

@app.route("/search", methods=["GET"])
def search():
    data = load_data()
    if data is None:
        return jsonify({"error": "Data file not found"}), 404
    
    search_term = request.args.get('course')
    print("Search term:", search_term)
    if search_term is not None:
        search_term = search_term.strip()
    for course in data:
        result = search_by_id(course, search_term)
        if result is None:
            result = search_by_name(course, search_term)
        if result is not None:
            return render_template('course.html', course=result)
             
    return jsonify({"error": "No matching course found"}), 404


@app.route("/home")
def home():
   courses = load_data()
   prerequisites = make_prerequisites(courses)
   return render_template("index.html", courses=prerequisites) 


if __name__ == '__main__':
    app.run(debug=True, port=5000)
