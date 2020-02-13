COPY CGM_station_velocities(station_id, ref_date_time, ref_north_latitude, ref_east_longitude, ref_up, ref_velocity_north, ref_velocity_east, ref_velocity_up, first_epoch, last_epoch)
    FROM PROGRAM 'tail -n +7 /home/postgres/CFM/schema/CGM_data/wus_gps_final_names.short.geocsv ' DELIMITER ', ' CSV;
