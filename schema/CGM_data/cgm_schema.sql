\c CGM1_db;

CREATE TABLE cgm_station_velocities (
    gid serial PRIMARY KEY,
    station_id VARCHAR(100) NOT NULL,
    ref_date_time text, -- should be 'timestamp with time zone', but values in data are invalid
    ref_north_latitude numeric,
    ref_east_longitude numeric,
    ref_up numeric,
    ref_velocity_north numeric,
    ref_velocity_east numeric,
    ref_velocity_up numeric,
    first_epoch text, -- should be 'timestamp with time zone', but values in data are invalid
    last_epoch text, -- should be 'timestamp with time zone', but values in data are invalid
    station_type text,
    cgm_version text,
    source_filename text
);
