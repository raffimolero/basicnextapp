-- 1. Units of Measure Table
CREATE TABLE uom (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(15) UNIQUE NOT NULL,
    description TEXT
);

-- 2. Medical Test Categories Table
CREATE TABLE testcategories (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT
);

-- 3. Medical Tests Table
CREATE TABLE medicaltests (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    iduom BIGINT REFERENCES uom(id),
    idcategory BIGINT REFERENCES testcategories(id),
    normalmin REAL,
    normalmax REAL
);

-- Insert into uom
INSERT INTO uom (name, description) VALUES
('mg/dL', 'Measures concentration of substances in blood'),
('mmol/L', 'Measures concentration of chemicals in blood (International)'),
('g/dL', 'Measures protein levels such as hemoglobin'),
('IU/L', 'Measures enzyme or hormone activity levels'),
('cells/µL', 'Counts the number of cells in blood');

-- Insert into testcategories
INSERT INTO testcategories (name, description) VALUES
('BCT', 'Blood Glucose Test'),
('CBC', 'Complete Blood Count'),
('LFT', 'Liver Function Test');

-- Insert into medicaltests
-- First, ensure we reference the correct IDs for units and categories
-- Assuming IDs start at 1 in insertion order:

INSERT INTO medicaltests (name, idcategory, iduom, normalmin, normalmax) VALUES
('Fasting Blood Glucose', 
    (SELECT id FROM testcategories WHERE name='BCT'),
    (SELECT id FROM uom WHERE name='mg/dL'),
    70, 99
),
('Hemoglobin Male',
    (SELECT id FROM testcategories WHERE name='CBC'),
    (SELECT id FROM uom WHERE name='g/dL'),
    13.5, 17.5
),
('Hemoglobin Female',
    (SELECT id FROM testcategories WHERE name='CBC'),
    (SELECT id FROM uom WHERE name='g/dL'),
    12.5, 15.5
),
('White Blood Cell Count',
    (SELECT id FROM testcategories WHERE name='CBC'),
    (SELECT id FROM uom WHERE name='cells/µL'),
    4000, 11000
),
('Alanine Aminotransferase',
    (SELECT id FROM testcategories WHERE name='LFT'),
    (SELECT id FROM uom WHERE name='IU/L'),
    7, 56
);