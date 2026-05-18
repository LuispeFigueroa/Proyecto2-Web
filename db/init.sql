-- Base de datos para una tienda de musica 
-- Base de datos: PostgreSQL
-- Usuario: proy2 / secret
 
-- ============================================================
-- DDL
-- ============================================================
 
CREATE TABLE categorias (
    id_categoria SERIAL PRIMARY KEY,
    nombre       VARCHAR(100) NOT NULL,
    descripcion  TEXT
);
 
CREATE TABLE proveedores (
    id_proveedor SERIAL PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    telefono     VARCHAR(20),
    email        VARCHAR(100),
    direccion    TEXT
);
 
CREATE TABLE productos (
    id_producto  SERIAL PRIMARY KEY,
    nombre       VARCHAR(150) NOT NULL,
    descripcion  TEXT,
    precio       NUMERIC(10,2) NOT NULL,
    stock        INTEGER NOT NULL DEFAULT 0,
    id_categoria INTEGER NOT NULL REFERENCES categorias(id_categoria),
    id_proveedor INTEGER NOT NULL REFERENCES proveedores(id_proveedor)
);
 
CREATE TABLE clientes (
    id_cliente SERIAL PRIMARY KEY,
    nombre     VARCHAR(150) NOT NULL,
    email      VARCHAR(100),
    telefono   VARCHAR(20),
    direccion  TEXT
);
 
CREATE TABLE empleados (
    id_empleado    SERIAL PRIMARY KEY,
    nombre         VARCHAR(150) NOT NULL,
    cargo          VARCHAR(100) NOT NULL,
    email          VARCHAR(100),
    fecha_contrato DATE NOT NULL
);
 
CREATE TABLE ventas (
    id_venta    SERIAL PRIMARY KEY,
    fecha       DATE NOT NULL DEFAULT CURRENT_DATE,
    total       NUMERIC(10,2) NOT NULL,
    id_cliente  INTEGER NOT NULL REFERENCES clientes(id_cliente),
    id_empleado INTEGER NOT NULL REFERENCES empleados(id_empleado)
);
 
CREATE TABLE detalle_venta (
    id_detalle      SERIAL PRIMARY KEY,
    cantidad        INTEGER NOT NULL,
    precio_unitario NUMERIC(10,2) NOT NULL,
    id_venta        INTEGER NOT NULL REFERENCES ventas(id_venta),
    id_producto     INTEGER NOT NULL REFERENCES productos(id_producto)
);
 
CREATE TABLE usuarios (
    id_usuario    SERIAL PRIMARY KEY,
    username      VARCHAR(80) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    id_empleado   INTEGER NOT NULL UNIQUE REFERENCES empleados(id_empleado)
);
 

-- ÍNDICES

 --búsquedas frecuentes por nombre en la UI
CREATE INDEX idx_productos_nombre   ON productos(nombre);
--reportes y filtros por rango de fechas
CREATE INDEX idx_ventas_fecha        ON ventas(fecha);
--JOINs constantes al cargar detalle
CREATE INDEX idx_detalle_id_venta    ON detalle_venta(id_venta);
 
-- VIEW 

 
CREATE VIEW vista_ventas_detalladas AS
SELECT
    v.id_venta,
    v.fecha,
    v.total,
    c.nombre          AS cliente,
    e.nombre          AS empleado,
    p.nombre          AS producto,
    dv.cantidad,
    dv.precio_unitario,
    (dv.cantidad * dv.precio_unitario) AS subtotal
FROM ventas v
JOIN clientes c       ON c.id_cliente  = v.id_cliente
JOIN empleados e      ON e.id_empleado = v.id_empleado
JOIN detalle_venta dv ON dv.id_venta   = v.id_venta
JOIN productos p      ON p.id_producto = dv.id_producto;
 
-- ============================================================
-- DATOS DE PRUEBA (Generados con IA)
-- ============================================================
 
-- Categorías 
INSERT INTO categorias (nombre, descripcion) VALUES
('Guitarras',        'Guitarras acústicas, eléctricas y bajos'),
('Teclados',         'Pianos digitales, sintetizadores y órganos'),
('Baterías',         'Baterías acústicas, electrónicas y percusión'),
('Viento',           'Trompetas, saxofones, flautas y clarinetes'),
('Accesorios',       'Cuerdas, púas, correas, afinadores y más'),
('Amplificación',    'Amplificadores, mezcladores y altavoces'),
('Cuerdas Clásicas', 'Violines, violas, cellos y contrabajos'),
('Percusión Menor',  'Panderetas, maracas, claves y triángulos'),
('Estudio',          'Micrófonos, interfaces y auriculares'),
('Iluminación',      'Luces y efectos para escenario'),
('Software',         'DAWs y plugins de producción musical'),
('Cables',           'Cables de audio, MIDI y alimentación'),
('Soportes',         'Atriles, soportes de teclado y guitarra'),
('Estuches',         'Fundas y cases para instrumentos'),
('Efectos',          'Pedales y procesadores de efectos'),
('Grabación',        'Equipos de grabación portátil y estudio'),
('DJ',               'Controladoras, tornamesas y mixers DJ'),
('Ukulele',          'Ukuleles soprano, concierto y tenor'),
('Mandolinas',       'Mandolinas y bandurrias'),
('Acordeones',       'Acordeones diatónicos y cromáticos'),
('Armónicas',        'Armónicas diatónicas y cromáticas'),
('Didgeridoo',       'Instrumentos de viento aborígenes'),
('Kalimba',          'Pianos de pulgar africanos'),
('Hang Drum',        'Instrumentos de percusión metálicos'),
('Theremin',         'Instrumentos electrónicos sin contacto');
 
-- Proveedores 
INSERT INTO proveedores (nombre, telefono, email, direccion) VALUES
('Fender Guatemala',       '2222-1111', 'ventas@fendergt.com',     'Zona 10, Ciudad de Guatemala'),
('Gibson Distribuciones',  '2333-2222', 'info@gibsongt.com',       'Zona 4, Ciudad de Guatemala'),
('Roland Centroamerica',   '2444-3333', 'roland@caribe.com',       'Zona 9, Ciudad de Guatemala'),
('Yamaha GT',              '2555-4444', 'yamaha@gt.com',           'Mixco, Guatemala'),
('Music Pro GT',           '2666-5555', 'contact@musicprogt.com',  'Zona 1, Ciudad de Guatemala'),
('Shure Centroamerica',    '2777-6666', 'shure@ca.com',            'Zona 10, Guatemala'),
('Boss Distribuciones',    '2888-7777', 'boss@gt.com',             'Zona 9, Guatemala'),
('Pearl Drums GT',         '2999-8888', 'pearl@gt.com',            'Zona 7, Guatemala'),
('Zildjian GT',            '3000-9999', 'zildjian@gt.com',         'Zona 11, Guatemala'),
('D''Addario GT',          '3111-0000', 'daddario@gt.com',         'Zona 12, Guatemala'),
('Audio Technica GT',      '3222-1111', 'at@gt.com',               'Zona 13, Guatemala'),
('Focusrite GT',           '3333-2222', 'focusrite@gt.com',        'Zona 14, Guatemala'),
('Dunlop GT',              '3444-3333', 'dunlop@gt.com',           'Zona 15, Guatemala'),
('Korg GT',                '3555-4444', 'korg@gt.com',             'Zona 16, Guatemala'),
('Ibanez GT',              '3666-5555', 'ibanez@gt.com',           'Zona 17, Guatemala'),
('Marshall GT',            '3777-6666', 'marshall@gt.com',         'Zona 18, Guatemala'),
('Behringer GT',           '3888-7777', 'behringer@gt.com',        'Mixco, Guatemala'),
('TC Electronic GT',       '3999-8888', 'tc@gt.com',               'Villa Nueva, Guatemala'),
('Electro-Voice GT',       '4000-9999', 'ev@gt.com',               'San Miguel Petapa'),
('Sennheiser GT',          '4111-0000', 'sennheiser@gt.com',       'Zona 3, Guatemala'),
('Mackie GT',              '4222-1111', 'mackie@gt.com',           'Zona 2, Guatemala'),
('Casio GT',               '4333-2222', 'casio@gt.com',            'Zona 6, Guatemala'),
('Epiphone GT',            '4444-3333', 'epiphone@gt.com',         'Zona 8, Guatemala'),
('PRS GT',                 '4555-4444', 'prs@gt.com',              'Zona 5, Guatemala'),
('Schecter GT',            '4666-5555', 'schecter@gt.com',         'Zona 19, Guatemala');
 
-- Productos 
INSERT INTO productos (nombre, descripcion, precio, stock, id_categoria, id_proveedor) VALUES
('Guitarra Fender Stratocaster',    'Eléctrica sunburst con trémolo',          4500.00, 8,  1, 1),
('Guitarra Gibson Les Paul',        'Eléctrica color cherry, 2 humbuckers',    7200.00, 5,  1, 2),
('Bajo Fender Jazz Bass',           'Bajo eléctrico 4 cuerdas',                3800.00, 6,  1, 1),
('Guitarra Acústica Yamaha F310',   'Acústica tapa spruce, cuerdas acero',     1200.00, 15, 1, 4),
('Guitarra Clásica Valencia CG150', 'Clásica tapa cedro, nylon',                900.00, 10, 1, 5),
('Piano Digital Roland RD-88',      '88 teclas pesadas, 10 sonidos',          12000.00, 3,  2, 3),
('Teclado Yamaha PSR-E373',         '61 teclas sensitivas, 622 voces',         2200.00, 7,  2, 4),
('Sintetizador Roland JD-Xi',       'Sintetizador analógico/digital',          5500.00, 4,  2, 3),
('Órgano Hammond SK1',              'Órgano portátil de 61 teclas',            9800.00, 2,  2, 5),
('Teclado Casio CT-S300',           '61 teclas, 60 canciones incluidas',        650.00, 12, 2, 22),
('Batería Pearl Export',            'Batería acústica 5 piezas con platillos', 8900.00, 3,  3, 8),
('Batería Electrónica Roland TD-07','Módulo con 10 sonidos de batería',        6500.00, 4,  3, 3),
('Cajón Peruano LP',                'Cajón flamenco con cuerdas snare',         950.00, 9,  3, 5),
('Hi-Hat Zildjian 14"',             'Platillo hi-hat par, serie A',            1800.00, 6,  3, 9),
('Bongó Latin Percussion',          'Bongó profesional 8" y 10"',               750.00, 11, 3, 5),
('Trompeta Yamaha YTR-2330',        'Trompeta Bb latonada, lacada',            3200.00, 5,  4, 4),
('Saxofón Alto Yamaha YAS-280',     'Saxofón alto para estudiantes',           7500.00, 3,  4, 4),
('Flauta Traversa Pearl PF-505',    'Flauta plateada con estuche',             2800.00, 4,  4, 5),
('Clarinete Buffet E11',            'Clarinete Bb de madera',                  4200.00, 3,  4, 5),
('Trombón Bach TB200B',             'Trombón tenor Bb, vara',                  4800.00, 2,  4, 5),
('Cuerdas Elixir 10-46',            'Cuerdas eléctrica coated, set 6',          120.00, 50, 5, 1),
('Cuerdas D''Addario Acústica',     'Cuerdas acústica bronce, 12-53',           95.00, 45, 5, 10),
('Púas Dunlop Jazz III x12',        'Pack 12 púas jazz de nylon',               85.00, 80, 5, 13),
('Afinador Korg CA-50',             'Afinador cromático con micrófono',         150.00, 35, 5, 14),
('Correa Gibson Premium',           'Correa cuero para guitarra',               250.00, 20, 5, 2),
('Amplificador Fender Champion 40', 'Amplificador guitarra 40W',               2800.00, 6,  6, 1),
('Amplificador Roland Cube-10GX',   'Amplificador modelado 10W',               1600.00, 8,  6, 3),
('Mezclador Yamaha MG10',           'Mezclador 10 canales con efectos',        3500.00, 4,  6, 4),
('Altavoz JBL EON610',              'Altavoz activo 10" 1000W',                5200.00, 3,  6, 5),
('Interfaz de Audio Focusrite 2i2', 'Interfaz USB 2 entradas/salidas',         1800.00, 7,  6, 12);
 
-- Empleados 
-- Empleados (25)
INSERT INTO empleados (nombre, cargo, email, fecha_contrato) VALUES
('Carlos Mendez',      'Gerente',       'cmendez@tiendamusical.com',    '2020-01-15'),
('Sofia Herrera',      'Vendedora',     'sherrera@tiendamusical.com',   '2020-03-10'),
('Miguel Torres',      'Vendedor',      'mtorres@tiendamusical.com',    '2021-06-01'),
('Ana Garcia',         'Cajera',        'agarcia@tiendamusical.com',    '2021-08-20'),
('Roberto Silva',      'Vendedor',      'rsilva@tiendamusical.com',     '2022-01-10'),
('Laura Castillo',     'Vendedora',     'lcastillo@tiendamusical.com',  '2022-03-15'),
('Diego Ramirez',      'Bodeguero',     'dramirez@tiendamusical.com',   '2022-05-01'),
('Valentina Cruz',     'Vendedora',     'vcruz@tiendamusical.com',      '2022-07-20'),
('Andres Lopez',       'Vendedor',      'alopez@tiendamusical.com',     '2022-09-01'),
('Gabriela Mora',      'Cajera',        'gmora@tiendamusical.com',      '2022-11-15'),
('Kevin Johnson',      'Vendedor',      'kjohnson@tiendamusical.com',   '2023-01-10'),
('Ashley Williams',    'Vendedora',     'awilliams@tiendamusical.com',  '2023-02-20'),
('Brandon Smith',      'Tecnico',       'bsmith@tiendamusical.com',     '2023-04-01'),
('Maria Gonzalez',     'Vendedora',     'mgonzalez@tiendamusical.com',  '2023-05-15'),
('Daniel Martinez',    'Vendedor',      'dmartinez@tiendamusical.com',  '2023-07-01'),
('Jessica Brown',      'Recepcionista', 'jbrown@tiendamusical.com',     '2023-08-10'),
('Luis Reyes',         'Vendedor',      'lreyes@tiendamusical.com',     '2023-09-01'),
('Emily Davis',        'Contadora',     'edavis@tiendamusical.com',     '2023-10-15'),
('Fernando Ruiz',      'Vendedor',      'fruiz@tiendamusical.com',      '2023-11-01'),
('Stephanie Wilson',   'Vendedora',     'swilson@tiendamusical.com',    '2024-01-10'),
('Pablo Morales',      'Bodeguero',     'pmorales@tiendamusical.com',   '2024-02-01'),
('Amanda Taylor',      'Vendedora',     'ataylor@tiendamusical.com',    '2024-03-15'),
('Ricardo Vega',       'Tecnico',       'rvega@tiendamusical.com',      '2024-04-01'),
('Monica Flores',      'Vendedora',     'mflores@tiendamusical.com',    '2024-05-10'),
('James Anderson',     'Vendedor',      'janderson@tiendamusical.com',  '2024-06-01');

 
-- Clientes 
INSERT INTO clientes (nombre, email, telefono, direccion) VALUES
('Carlos Mendoza',   'carlos.m@gmail.com',   '5555-0001', 'Zona 1, Guatemala'),
('María López',      'maria.l@hotmail.com',  '5555-0002', 'Zona 5, Guatemala'),
('Juan García',      'juan.g@gmail.com',     '5555-0003', 'Mixco, Guatemala'),
('Ana Pérez',        'ana.p@yahoo.com',      '5555-0004', 'Villa Nueva, Guatemala'),
('Luis Hernández',   'luis.h@gmail.com',     '5555-0005', 'Zona 10, Guatemala'),
('Sofía Ramírez',    'sofia.r@gmail.com',    '5555-0006', 'Zona 14, Guatemala'),
('Diego Torres',     'diego.t@hotmail.com',  '5555-0007', 'Zona 7, Guatemala'),
('Valeria Morales',  'val.m@gmail.com',      '5555-0008', 'San José Pinula'),
('Roberto Castillo', 'rob.c@gmail.com',      '5555-0009', 'Zona 6, Guatemala'),
('Fernanda Ruiz',    'fer.r@hotmail.com',    '5555-0010', 'Zona 12, Guatemala'),
('Andrés Molina',    'andres.m@gmail.com',   '5555-0011', 'Mixco, Guatemala'),
('Claudia Jiménez',  'claudia.j@gmail.com',  '5555-0012', 'Zona 2, Guatemala'),
('Pablo Aguilar',    'pablo.a@yahoo.com',    '5555-0013', 'Zona 3, Guatemala'),
('Gabriela Vásquez', 'gabi.v@gmail.com',     '5555-0014', 'Santa Catarina Pinula'),
('Marco Reyes',      'marco.r@gmail.com',    '5555-0015', 'Zona 11, Guatemala'),
('Lucía Ortega',     'lucia.o@hotmail.com',  '5555-0016', 'Villa Hermosa'),
('Sebastián Cruz',   'seb.c@gmail.com',      '5555-0017', 'Zona 18, Guatemala'),
('Daniela Flores',   'dani.f@gmail.com',     '5555-0018', 'Zona 16, Guatemala'),
('Jorge Méndez',     'jorge.m@yahoo.com',    '5555-0019', 'Amatitlán'),
('Karla Santizo',    'karla.s@gmail.com',    '5555-0020', 'Zona 9, Guatemala'),
('Eduardo Lima',     'edu.l@gmail.com',      '5555-0021', 'Fraijanes'),
('Patricia Xiloj',   'patri.x@gmail.com',    '5555-0022', 'Zona 4, Guatemala'),
('Héctor Ajú',       'hector.a@hotmail.com', '5555-0023', 'San Miguel Petapa'),
('Vanessa Tzul',     'van.t@gmail.com',      '5555-0024', 'Zona 13, Guatemala'),
('Ricardo Boc',      'ric.b@gmail.com',      '5555-0025', 'Zona 17, Guatemala');
 
-- Usuarios 
-- Usuarios (25)
INSERT INTO usuarios (username, password_hash, id_empleado) VALUES
('cmendez',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 1),
('sherrera',   '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 2),
('mtorres',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 3),
('agarcia',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 4),
('rsilva',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 5),
('lcastillo',  '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 6),
('dramirez',   '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 7),
('vcruz',      '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 8),
('alopez',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 9),
('gmora',      '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 10),
('kjohnson',   '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 11),
('awilliams',  '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 12),
('bsmith',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 13),
('mgonzalez',  '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 14),
('dmartinez',  '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 15),
('jbrown',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 16),
('lreyes',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 17),
('edavis',     '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 18),
('fruiz',      '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 19),
('swilson',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 20),
('pmorales',   '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 21),
('ataylor',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 22),
('rvega',      '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 23),
('mflores',    '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 24),
('janderson',  '$2b$12$d.z.qIGILMTW49bpiDCb0.X1JKhdpPIfmpNtUODIiSsQXjCwmIexe', 25);

-- Ventas 
INSERT INTO ventas (fecha, total, id_cliente, id_empleado) VALUES
('2025-01-05',  4620.00,  1,  1),
('2025-01-12',  1200.00,  2,  2),
('2025-01-18',  7320.00,  3,  1),
('2025-02-02',  2350.00,  4,  3),
('2025-02-14',  9050.00,  5,  2),
('2025-02-20',  1285.00,  6,  4),
('2025-03-03',  3800.00,  7,  1),
('2025-03-10',  6550.00,  8,  3),
('2025-03-22',   850.00,  9,  2),
('2025-04-01',  5620.00, 10,  1),
('2025-04-09', 12200.00, 11,  5),
('2025-04-15',  2800.00, 12,  6),
('2025-05-03',  1050.00, 13,  2),
('2025-05-11',  3500.00, 14,  3),
('2025-05-20',  7700.00, 15,  1),
('2025-06-02',   950.00, 16,  4),
('2025-06-15',  4500.00, 17,  2),
('2025-07-04',  2450.00, 18,  6),
('2025-07-18',  8900.00, 19,  1),
('2025-08-01',  1350.00, 20,  3),
('2025-08-14',  5300.00, 21,  2),
('2025-09-02',  3200.00, 22,  1),
('2025-09-19',  7500.00, 23,  5),
('2025-10-05',  1800.00, 24,  6),
('2025-11-11',  9800.00, 25,  1);
 
-- Detalle de ventas
INSERT INTO detalle_venta (cantidad, precio_unitario, id_venta, id_producto) VALUES
(1, 4500.00, 1,  1), (1,  120.00, 1, 21),
(1, 1200.00, 2,  4),
(1, 7200.00, 3,  2), (1,  120.00, 3, 21),
(1, 2200.00, 4,  7), (1,  150.00, 4, 24),
(1, 8900.00, 5, 11), (1,  150.00, 5, 24),
(2,  120.00, 6, 21), (1,   85.00, 6, 23), (1, 95.00, 6, 22), (1, 85.00, 6, 23),
(1, 3800.00, 7,  3),
(1, 6500.00, 8, 12),
(1,  850.00, 9, 13),
(1, 5200.00,10, 29), (1,  250.00,10, 25), (1, 150.00,10, 24),
(1,12000.00,11,  6), (1,  200.00,11, 24),
(1, 2800.00,12, 26),
(1,  950.00,13, 13), (1,   95.00,13, 22),
(1, 3500.00,14, 28),
(1, 7500.00,15, 17), (1,  200.00,15, 24),
(1,  950.00,16, 13),
(1, 4500.00,17,  1),
(1, 2200.00,18,  7), (1,  250.00,18, 25),
(1, 8900.00,19, 11),
(2,  150.00,20, 24), (3,   85.00,20, 23),
(1, 5200.00,21, 29), (1,  100.00,21, 23),
(1, 3200.00,22, 16),
(1, 7500.00,23, 17),
(1, 1800.00,24, 14),
(1, 9800.00,25,  9);
 
