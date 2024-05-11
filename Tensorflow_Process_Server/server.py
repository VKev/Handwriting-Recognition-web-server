import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
from flask import Flask, request, jsonify, render_template
import tensorflow.keras as keras
import numpy as np

app = Flask(__name__)

# Load the trained model
save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SaveModel")
save_dir = os.path.join(save_dir, 'saved_model.keras')
model = keras.models.load_model(save_dir)

@app.route('/predict', methods=['POST'])
def predict():
    # Receive JSON data from the request
    json_data = request.json
    
    # Convert JSON data to numpy array
    input_data = np.array(json_data['matrix'])

    # Preprocess the input data
    input_data = input_data.reshape(-1, 28, 28, 1)  # Reshape to match model input shape
    
    # Make prediction
    predictions = model.predict(input_data)

    # Get the predicted class
    predicted_class = np.argmax(predictions[0])

    # Return the prediction result
    return jsonify({'prediction': int(predicted_class)})

@app.route('/', methods=['GET'])
def home(): 
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=int(os.environ.get('PORT', 5000)))