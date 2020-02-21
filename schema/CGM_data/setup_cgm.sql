
COPY CGM_station_velocities(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
    FROM PROGRAM 'tail -n +7 /home/postgres/CFM/schema/CGM_data/wus_gps_final_names.short.geocsv ' DELIMITER ', ' CSV;

COPY CGM_station_velocities(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
    FROM PROGRAM 'tail -n +8 /home/postgres/CFM/schema/CGM_data/crowell_campaign_velocities.short.geocsv' DELIMITER ', ' CSV;


-- CREATE TEMP TABLE tmp1 (
--     gid serial PRIMARY KEY,
--     station_id VARCHAR(100) NOT NULL,
--     ref_date_time text, -- should be 'timestamp with time zone', but values in data are invalid
--     ref_north_latitude numeric,
--     ref_east_longitude numeric,
--     ref_up numeric,
--     ref_velocity_north numeric,
--     ref_velocity_east numeric,
--     ref_velocity_up numeric,
--     first_epoch text, -- should be 'timestamp with time zone', but values in data are invalid
--     last_epoch text, -- should be 'timestamp with time zone', but values in data are invalid
--     station_type text,
--     cgm_version text,
--     source_filename text
--     );
--
--
--
-- COPY tmp1(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
--     FROM PROGRAM 'tail -n +7 /home/postgres/CFM/schema/CGM_data/wus_gps_final_names.short.geocsv ' DELIMITER ', ' CSV;
--
-- UPDATE tmp1 set station_type = 'continuous';
-- UPDATE tmp1 set cgm_version = '1';
-- UPDATE tmp1 set source_filename = 'wus_gps_final_names.short.geocsv';
--
-- CREATE TABLE CGM_station_velocities AS
--     TABLE tmp1;
--
--
-- create table cgm_station_velocities_v2
-- (
--     station_id         text,
--     ref_date_time      numeric,
--     ref_velocity_north numeric,
--     ref_velocity_east  numeric
-- );
--
-- create table cgm_stations
-- (
--     station_id         text not null
--         constraint cgm_station_name_pk
--             primary key,
--     ref_north_latitude numeric,
--     ref_east_longitude numeric,
--     ref_up             numeric,
--     first_epoch        text,
--     last_epoch         text
-- );
--
--
--
--

