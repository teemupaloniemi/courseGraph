pip3 install -r requirements.txt
[ ! -f courses.json ] && wget http://users.jyu.fi/~tealjapa/ops/courses.json
[ ! -f reqs.json ] && wget http://users.jyu.fi/~tealjapa/ops/reqs.json
[ ! -f modules.json ] && wget http://users.jyu.fi/~tealjapa/ops/modules.json
[ ! -f couse_acm.json ] && wget http://users.jyu.fi/~tealjapa/ops/course_acm.json
./server.py $1
