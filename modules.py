import requests
import json
from bs4 import BeautifulSoup

module_names = ['tekka2024', 'matka2024']
modules = []
for name in module_names:
	module = {"module": "", "codes": []}
	url = f"https://opinto-opas.jyu.fi/2024/fi/tutkintoohjelma/{name}/"
	response = requests.get(url)
	html_content = response.text
	soup = BeautifulSoup(html_content, 'html.parser')
	accordion_items = soup.find_all('div', {'data-accordion-component': 'AccordionItem'})
	course_codes = []
	module['codes'] = course_codes
	module['module'] = name
	for item in accordion_items:
	    link = item.find('a')
	    if link and 'href' in link.attrs:
	        course_code = link['href'].split('/')[-2]  # assuming course code is in the second last segment
	        course_codes.append(course_code.upper())
	modules.append(module)
with open("modules.json", "w") as outfile:
    outfile.write(json.dumps(modules, indent=4))
