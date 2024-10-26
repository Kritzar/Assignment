from flask import Flask, request, jsonify
from flask_cors import CORS
from Rule import get_rule 

app = Flask(__name__)
CORS(app)

@app.route('/process-rule', methods=['POST'])
def process_rule():
    data = request.json
    try:
        if 'rule' not in data:
            return jsonify({"error": "Rule not provided"}), 400
        
        rule = data['rule'] 
        if not rule.strip(): 
            processed_rule = ''
        else:
            processed_rule = str(get_rule(data['rule']))

        return jsonify({"processed_rule": processed_rule}), 200
        
    except Exception as err:
        return jsonify({"error": str(err)}), 500

@app.route('/evaluate-rule', methods=['POST'])
def evaluate_rule():
    data = request.json
    try:
        if 'rule' not in data:
            return jsonify({"error": "Rule not provided"}), 400
        if 'rows' not in data:
            return jsonify({"error": "Rows not provided"}), 400
            
        rule = get_rule(data['rule'])
        filtered_data = [row for row in data['rows'] if rule.test(row)]

        return jsonify({"filtered_data": filtered_data}), 200
        
    except Exception as err:
        return jsonify({"error": str(err)}), 500


@app.route('/combine-rules', methods=['POST'])
def combine_rules():
    data = request.json
    try:
        if 'rules' not in data:
            return jsonify({"error": "Rules are not provided"}), 400
        
        combined_rule = ' AND '.join(f"({rule})" for rule in data['rules'])
        processed_rule = str(get_rule(combined_rule))

        return jsonify({"processed_rule": processed_rule}), 200
        
    except Exception as err:
        return jsonify({"error": str(err)}), 500


if __name__ == '__main__':
    app.run(debug=True)
