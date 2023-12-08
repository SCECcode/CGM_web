
\c CGM2_db;
-----------------------
CREATE TABLE tmp0 AS
    TABLE CGM_gnss_sites;
COPY tmp0(ulabel)
    FROM '/home/postgres/CGM/CGM_data/surv_site.csv' DELIMITER ',' CSV HEADER;
UPDATE tmp0 set type = 'surv';

COPY CGM_gnss_sites(ulabel)
    FROM '/home/postgres/CGM/CGM_data/cont_site.csv' DELIMITER ',' CSV HEADER;
UPDATE CGM_gnss_sites set type = 'cont';

INSERT INTO CGM_gnss_sites(ulabel,type)
   SELECT ulabel,type FROM tmp0;

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

COPY tmp1(ulabel, Dot, velType, Ref_epoch, Ref_jday, Ref_X, Ref_Y, Ref_Z, Ref_Nlat, Ref_Elong, Ref_Up, dXOdt, dYOdt, dZOdt, SXd, SYd, SZd, Rxy, Rxz, Rzy, dNOdt, dEOdt, dUOdt, SNd, SEd, SUd, Rne, Rnu, Reu, first_epoch, last_epoch, n_observations)
    FROM '/home/postgres/CGM/CGM_data/SCEC_CGMv2.0.0_GNSS_vels-nam14_final.csv' DELIMITER ',' CSV;
UPDATE tmp1 set cgm_version = '2.0.0';

INSERT into CGM_gnss_station_velocities (select * from tmp1);

drop table tmp1;
-----------------------
/*
DELETE FROM cgm_gnss_station_velocities t2
WHERE NOT EXISTS 
(SELECT 1 FROM cgm_gnss_sites t1
 WHERE t1.name = t2.station_id);

UPDATE CGM_gnss_station_velocities t2
   SET station_type = 
      ( select type FROM CGM_gnss_sites t1
           where t2.station_id = t1.name);	
UPDATE CGM_gnss_station_velocities t2
   SET station_type = 
      ( SELECT COUNT(*) FROM CGM_gnss_sites t1
           where t2.station_id = t1.name);	
*/

-----------------------
COPY cgm_insar_tracks(file,track,color,bb1_lat,bb1_lon,bb2_lat,bb2_lon,bb3_lat,bb3_lon,bb4_lat,bb4_lon,geocode_increment,geocode_range,ref_lat,ref_lon)
   FROM '/home/postgres/CGM/CGM_data/insar_track.csv' DELIMITER ',' CSV HEADER;
