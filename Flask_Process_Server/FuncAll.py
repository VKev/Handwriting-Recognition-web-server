import numpy as np
import os


def load_ubyte(filename):
    with open(filename, 'rb') as f:
        magic_number = int.from_bytes(f.read(4), 'big')

        if magic_number == 2051: 
            num_items = int.from_bytes(f.read(4), 'big')
            num_rows = int.from_bytes(f.read(4), 'big')
            num_cols = int.from_bytes(f.read(4), 'big')
            data = np.fromfile(f, dtype=np.uint8)
            data = data.reshape(num_items, num_rows, num_cols)

        elif magic_number == 2049: 
            num_items = int.from_bytes(f.read(4), 'big')
            data = np.fromfile(f, dtype=np.uint8)

        else:
            raise ValueError("Unsupported magic number. The file is not in idx1 or idx3 format.")

    return data
