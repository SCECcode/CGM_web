\c CGM1_db;

CREATE TABLE cgm_gnss_station_velocities (
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

CREATE TABLE cgm_gnss_sites(
    gid serial PRIMARY KEY,
    name VARCHAR(10) NOT NULL,
    type VARCHAR(10) DEFAULT 'SCEC'
);

CREATE TABLE cgm_insar_tracks(
    gid serial PRIMARY KEY,
    name VARCHAR(5) NOT NULL,
    color VARCHAR(10) NOT NULL,
    bb1_lat numeric NOT NULL,
    bb1_lon numeric NOT NULL,
    bb2_lat numeric NOT NULL,
    bb2_lon numeric NOT NULL,
    bb3_lat numeric NOT NULL,
    bb3_lon numeric NOT NULL,
    bb4_lat numeric NOT NULL,
    bb4_lon numeric NOT NULL,
    geocode_increment VARCHAR(100) NOT NULL,
    geocode_range VARCHAR(100) NOT NULL,
}
