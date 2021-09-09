
\c CGM1_db;
-----------------------
CREATE TABLE tmp0 AS
    TABLE CGM_gnss_sites;
COPY tmp0(name)
    FROM '/home/postgres/CGM/CGM_data/surv_site.csv' DELIMITER ',' CSV HEADER;
UPDATE tmp0 set type = 'surv';

COPY CGM_gnss_sites(name)
    FROM '/home/postgres/CGM/CGM_data/cont_site.csv' DELIMITER ',' CSV HEADER;
UPDATE CGM_gnss_sites set type = 'cont';

insert into CGM_gnss_sites(name,type)
   select name,type from tmp0;

drop table tmp0;
-----------------------
CREATE TABLE tmp1 AS
    TABLE CGM_gnss_station_velocities;

create sequence tmp1_gid_seq;
alter table tmp1 alter column gid set default nextval('public.tmp1_gid_seq');
alter sequence tmp1_gid_seq owned by tmp1.gid;
alter table tmp1
    add constraint tmp1_pk
        primary key (gid);

COPY tmp1(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
    FROM PROGRAM 'tail -n +8 /home/postgres/CGM/CGM_data/wus_gps_final_names.short.geocsv ' DELIMITER ',' CSV;

UPDATE tmp1 set station_type = 'continuous';
UPDATE tmp1 set cgm_version = '1';
UPDATE tmp1 set source_filename = 'wus_gps_final_names.short.geocsv';

INSERT into CGM_gnss_station_velocities (select * from tmp1);

truncate table tmp1;
-----------------------

COPY tmp1(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
    FROM PROGRAM 'tail -n +8 /home/postgres/CGM/CGM_data/crowell_campaign_velocities.short.geocsv' DELIMITER ',' CSV;

UPDATE tmp1 set station_type = 'campaign';
UPDATE tmp1 set cgm_version = '1';
UPDATE tmp1 set source_filename = 'crowell_campaign_velocities.short.geocsv';

INSERT into CGM_gnss_station_velocities (select * from tmp1);

drop table tmp1;

-----------------------
DELETE FROM cgm_gnss_station_velocities t2
WHERE NOT EXISTS 
(SELECT 1 FROM cgm_gnss_sites t1
 WHERE t1.name = t2.station_id);

-----------------------
COPY cgm_insar_tracks(file,track,color,bb1_lat,bb1_lon,bb2_lat,bb2_lon,bb3_lat,bb3_lon,bb4_lat,bb4_lon,geocode_increment,geocode_range,ref_lat,ref_lon)
   FROM '/home/postgres/CGM/CGM_data/insar_track.csv' DELIMITER ',' CSV HEADER;
