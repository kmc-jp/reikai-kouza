CREATE DATABASE reikai_kouza;
USE reikai_kouza;

CREATE TABLE members (
  id VARCHAR(30) PRIMARY KEY,
  registration_date DATE NOT NULL,
  preferred_day_of_week TINYINT UNSIGNED NOT NULL,
  is_active BOOLEAN NOT NULL
);

CREATE TABLE meetings (
  date DATE PRIMARY KEY,
  will_be_held BOOLEAN NOT NULL
);

CREATE TABLE assignments (
  member_id VARCHAR(30) PRIMARY KEY,
  has_assigned BOOLEAN NOT NULL,
  last_assigned_date DATE NOT NULL,
  FOREIGN KEY (member_id)
    REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE history (
  assignment_id INT UNSIGNED AUTO_INCREMENT,
  member_id VARCHAR(30) NOT NULL,
  assignment_date DATE NOT NULL,
  is_waiting_response BOOLEAN NOT NULL,
  has_canceled BOOLEAN NOT NULL,
  title VARCHAR(200) NOT NULL,
  material_url VARCHAR(200) NOT NULL,
  PRIMARY KEY(assignment_id),
  FOREIGN KEY (member_id)
    REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT,
  FOREIGN KEY (assignment_date)
    REFERENCES meetings(date)
    ON DELETE RESTRICT ON UPDATE RESTRICT
) AUTO_INCREMENT = 1000000;

CREATE TABLE tokens (
  token VARCHAR(200) PRIMARY KEY,
  is_management_permission_required BOOLEAN NOT NULL
);

CREATE TABLE nonces (
  nonce VARCHAR(200) PRIMARY KEY,
  opaque VARCHAR(200) UNIQUE NOT NULL,
  id VARCHAR(30) NOT NULL,
  is_admin_level BOOLEAN NOT NULL,
  nonce_count TINYINT NOT NULL,
  valid_until DATETIME NOT NULL,
  FOREIGN KEY (id)
    REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
);

CREATE TABLE owners (
  id VARCHAR(30) PRIMARY KEY,
  FOREIGN KEY (id)
    REFERENCES members(id)
    ON DELETE RESTRICT ON UPDATE RESTRICT
);
