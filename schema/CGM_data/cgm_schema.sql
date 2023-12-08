\c CGM1_db;

CREATE TABLE cgm_gnss_station_velocities (
    gid serial PRIMARY KEY,
    ulabel VARCHAR(10) NOT NULL,   -- 0001_s
    Dot VARCHAR(5) NOT NULL,       --* 0001
    velType VARCHAR(10) NOT NULL,  -- survey
    Ref_epoch  numeric,            --* 19941103120000
    Ref_jday numeric,              -- 49659.5000
    Ref_X numeric,                 -- -2581457.64570
    Ref_Y numeric,                 -- -4600859.94210
    Ref_Z numeric,                 -- 3572641.78449
    Ref_Nlat numeric,              --* 34.2848530892
    Ref_Elong numeric,             --* 240.7040208756
    Ref_Up numeric,                --* 77.90925
    dXOdt text,                    -- NaN
    dYOdt text,                    -- NaN
    dZOdt text,                    -- NaN
    SXd text,                      -- NaN
    SYd text,                      -- NaN
    SZd text,                      -- NaN
    Rxy text,                      -- NaN
    Rxz text,                      -- NaN
    Rzy text,                      -- NaN
    dNOdt numeric,                 --* 0.03578
    dEOdt numeric,                 --* -0.03713
    dUOdt numeric,                 --* -0.00155
    SNd text,                      -- 0.00152
    SEd text,                      -- 0.00147
    SUd text,                      -- 0.00573
    Rne text,                      -- -0.000
    Rnu text,                      -- NaN
    Reu text,                      -- NaN
    first_epoch numeric,           --* 19920605120000
    last_epoch numeric,            --* 19941103120000
    n_observations  numeric,       -- 6
    cgm_version text,
);

CREATE TABLE cgm_gnss_sites(
    gid serial PRIMARY KEY,
    ulabel VARCHAR(10) NOT NULL,
    type VARCHAR(10) DEFAULT 'cont'
);

CREATE TABLE cgm_insar_tracks(
    gid serial PRIMARY KEY,
    file VARCHAR(50) NOT NULL,
    track VARCHAR(4) NOT NULL,
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
    ref_lat numeric NOT NULL,
    ref_lon numeric NOT NULL
);
