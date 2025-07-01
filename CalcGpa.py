import os
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/calculate', methods=['POST'])
def calculate():
    data = request.get_json()
    subjects = data['subjects']

    sum_g = 0
    sum_h = 0
    results = []

    for sub in subjects:
        sub_name = sub['name']
        sub_grade = float(sub['grade'])
        sub_hours = int(sub['hours'])

        if sub_grade >= 90:
            lgrade = "A"
            grade = 4.00
        elif sub_grade >= 82:
            lgrade = "B+"
            grade = 3.50
        elif sub_grade >= 74:
            lgrade = "B"
            grade = 3.00
        elif sub_grade >= 66:
            lgrade = "C+"
            grade = 2.50
        elif sub_grade >= 58:
            lgrade = "C"
            grade = 2.00
        elif sub_grade >= 50:
            lgrade = "D"
            grade = 1.50
        else:
            lgrade = "F"
            grade = 0

        sum_g += grade * sub_hours
        sum_h += sub_hours
        results.append({"name": sub_name, "letter": lgrade})

    gpa = round(sum_g / sum_h, 2) if sum_h != 0 else 0

    return jsonify({
        "subjects": results,
        "gpa": gpa
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
