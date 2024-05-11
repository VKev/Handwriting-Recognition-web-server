import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
import tensorflow as tf
from tensorflow.keras import layers, models
import numpy as np
import FuncAll as fa

data_dir= os.path.join( os.path.dirname(os.path.abspath(__file__)), "Dataset")
# Load MNIST dataset
mnist = tf.keras.datasets.mnist
(x_train, y_train), (x_test, y_test) = mnist.load_data()

xtrain_emnist = fa.load_ubyte(os.path.join(data_dir, 'emnist-digits-train-images-idx3-ubyte'))
ytrain_emnist = fa.load_ubyte(os.path.join(data_dir,'emnist-digits-train-labels-idx1-ubyte'))

x_train = np.concatenate((x_train, xtrain_emnist), axis=0)
y_train = np.concatenate((y_train, ytrain_emnist), axis=0)

xtest_emnist = fa.load_ubyte(os.path.join(data_dir,'emnist-digits-test-images-idx3-ubyte'))
ytest_emnist = fa.load_ubyte(os.path.join(data_dir,'emnist-digits-test-labels-idx1-ubyte'))

x_test = np.concatenate((x_test, xtest_emnist), axis=0)
y_test = np.concatenate((y_test, ytest_emnist), axis=0)

# Preprocess the data
x_train, x_test = x_train / 255.0, x_test / 255.0


# Model Architecture
model = models.Sequential([
    layers.Input(shape=(28, 28, 1)),
    layers.Conv2D(32, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(64, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.MaxPooling2D((2, 2)),
    layers.Conv2D(128, (3, 3), activation='relu'),
    layers.BatchNormalization(),
    layers.Flatten(),
    layers.Dropout(0.5),
    layers.Dense(128, activation='relu'),
    layers.Dropout(0.5),
    layers.Dense(10, activation='softmax')
])

# Compile the model
model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
              loss='sparse_categorical_crossentropy',
              metrics=['accuracy'])

# Train the model
model.fit(x_train.reshape(-1, 28, 28, 1), y_train, epochs=30, batch_size=128, validation_split=0.2)

# Evaluate the model
test_loss, test_acc = model.evaluate(x_test.reshape(-1, 28, 28, 1), y_test)
print('Test accuracy:', test_acc)

# Save the model
save_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "SaveModel")
save_dir = os.path.join(save_dir, 'saved_model.keras')
model.save(save_dir)