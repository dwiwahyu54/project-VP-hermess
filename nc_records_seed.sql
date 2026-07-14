-- Seed NC records (429 rows) into public.nc_records
-- Run AFTER creating the table. Safe to re-run (ON CONFLICT DO UPDATE).

BEGIN;
INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(7066, 'Express Mas', 'Beberapa plafon di ruangan  akomodasi ditemukan jebol', 'Internal Audit', 'ISM Code', '10. Maintenance of The Ship & Equipment', 'Accomodation', 'Allaway', 'Warning', '2023-01-11', '2023', 'Audit 1', '2023-03-10', '2025-03-10', 'CLOSED', '', 'Capt Aris', ''),
(353, 'Express Mas', 'Cargo securing manual tidak tersedia di atas kapal', 'Internal audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Manual/Drawing Approval', 'Normal', '2024-01-25', '2024', 'Audit 1', '2024-04-30', NULL, 'OPEN', '', '', ''),
(539, 'Mavendra Mas', 'Echosounder tidak berfungsi (mendeteksi kedalaman kapal)', 'Internal audit', 'ISM Code', '7. Shipboard Operation', 'Bridge Area', 'Echo Sounder', 'Normal', '2024-02-02', '2024', 'Audit 1', NULL, '2025-11-11', 'CLOSED', '', '', ''),
(549, 'Mavendra Mas', 'Pipa sounding ballast tank buntu', 'Internal audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Air/Sounding Pipe', 'Normal', '2024-02-02', '2024', 'Audit 1', NULL, '2025-04-15', 'CLOSED', '', '', ''),
(602, 'Pratama Mas', 'Sounding table ballast tank tidak tersedia', 'Internal audit', 'ISM Code', '7. Shipboard Operation', 'Deck Area', 'Air/Sounding Pipe', 'Normal', '2024-07-17', '2024', 'Audit 2', '2024-09-30', NULL, 'OPEN', '', '', ''),
(647, 'Express Mas', 'Gyro compass error dan belum terbackup emergency battery ( UPS tidak bisa back up)', 'Internal audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Gyro Compass', 'Normal', '2024-07-17', '2024', 'Audit 2', '2024-10-30', '2025-08-08', 'CLOSED', '', '', ''),
(711, 'Mavendra Mas', 'Vent bahan bakar di maindeck keropos', 'Internal audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ventilation System', 'Normal', '2024-07-22', '2024', 'Audit 2', NULL, '2025-11-11', 'CLOSED', '', '', ''),
(737, 'Express Mas', 'Koki a.n Regi Acmat Yani tidak memiliki SCRB', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Crew Documents', 'Certificate of Proficiency', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-03-17', '2025-01-22', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(738, 'Express Mas', 'Cadet Engine a.n Agis masa expired MCU 11 Febuari 2025 (masa magang 12 bulan)-> on board 16 Agustus 2024', 'Internal Audit', 'ISM Code', '11. Documentation', 'Crew Documents', 'Medical Certificate', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-01-22', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(739, 'Express Mas', 'General fire alarm modul terbakar (unit diturunkan ke darat)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Bridge Area', 'General Alarm', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-03-17', '2025-02-19', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(740, 'Express Mas', 'DC power backup alat navigasi dan alat komunikasi tidak ada', 'Internal Audit', 'ISM Code', '11. Documentation', 'Bridge Area', 'DC Power Supply', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-05-15', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(741, 'Express Mas', 'Radar nomor 1 tidak dapat berfungsi (scanner rusak)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Bridge Area', 'Radar', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-05-23', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(742, 'Express Mas', 'Fire alarm ditemukan fault pada zone 4 (Deck B) dan zone 6 (Upper deck)', 'Internal Audit', 'ISM Code', '11. Documentation', 'LSA FFA', 'Fire Alarm', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-05-15', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(743, 'Express Mas', 'Monitor CCTV tidak ada', 'Internal Audit', 'ISM Code', '11. Documentation', 'Bridge Area', 'Monitor CCTV', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-03-21', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(745, 'Express Mas', 'Log Book tidak tersedia di kapal :
1. GMDSS Log Book
2. Radar Log Book', 'Internal Audit', 'ISM Code', '11. Documentation', 'Bridge Area', 'Bridge Record book', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-02-28', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(746, 'Express Mas', 'Valve hydrant main deck P/S bay 1 tidak sesuai dengan coupling fire hose', 'Internal Audit', 'ISM Code', '11. Documentation', 'LSA FFA', 'Fire Hydrant', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-03-21', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(747, 'Express Mas', 'Anak tangga EFP room patah dan berlubang', 'Internal Audit', 'ISM Code', '11. Documentation', 'Deck Area', 'Accomodation Ladder', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-01-22', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(748, 'Express Mas', 'AE 3 terdapat kerusakan pada alternator 
(unit alternator diturunkan ke darat)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-06-29', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(749, 'Express Mas', 'Terdapat rembesan oli dari injector nozzle cylinder 6 AE 2', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-01-31', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(750, 'Express Mas', 'FO booster pump No. 2 tidak ada 
(diturunkan ke darat untuk repair)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-03-17', '2025-06-06', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(751, 'Express Mas', 'Safety valve FO booster valve pump No. 1 terdapat rembesan', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-01-31', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(752, 'Express Mas', 'Manometer suction tidak ada pada Ballast dan GS pump', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-05-16', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(753, 'Express Mas', 'Manometer suction dan discharge Fire pump tidak ada', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', '2025-05-16', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(754, 'Express Mas', 'LO Pressure ME error 
(Check first modul LO Pressure)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-04-17', '2025-08-21', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(755, 'Express Mas', 'Pipa sounding ditemukan tidak terdapat tutup : 
1. SWBT S/B
2. WBT & SWBT 2A S/B', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Piping Condition', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-01-14', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(756, 'Express Mas', 'Jalur drain air kamar mandi 3rd Officer tersumbat', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Cabin', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-02-17', NULL, 'OPEN', '', 'Ferik H', 'Ihsan'),
(757, 'Express Mas', 'Plimsol mark S/B ditemukan korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Plimsoll Mark', 'Normal', '2025-01-17', '2025', 'Audit 1', '2025-01-24', '2025-01-24', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(758, 'Pratama Mas', '1 unit hose hydrant haluan P/S di bay 1 bocor', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Hydrant', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-24', '2025-01-16', 'CLOSED', '', 'Ferik H', 'Ihsan'),
(759, 'Pratama Mas', 'Pipa hydrant bocor :
1. Haluan P/S bay 1
2. Haluan S/B bay 1 ', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Hydrant', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-02-27', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(760, 'Pratama Mas', 'Railing ditemukan deformasi dan patah :
1. main deck P/S bay 19
2. Forecastle P/S', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-28', '2025-02-19', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(761, 'Pratama Mas', 'Fire alarm ditemukan rusak', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Alarm', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-23', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(762, 'Pratama Mas', 'Cable power emergency generator tidak ter-connect ke panel ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Emergency Generator', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-17', '2025-01-31', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(763, 'Pratama Mas', 'Valve LO pump ditemukan tidak kedap dan terdapat  rembesan oli', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-23', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(764, 'Pratama Mas', 'Injector cooler tidak berfungsi ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Main Engine', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-17', '2025-02-02', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(765, 'Pratama Mas', 'Tank top di Engine Room kotor (banyak lumpur)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Tanktop Condition', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-17', '2025-01-24', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(766, 'Pratama Mas', 'Marking pompa - pompa di engine room tidak ada ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'General Maintenance/Marking', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-24', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(767, 'Pratama Mas', 'Limit switch steering gear P/S ditemukan rusak (karena terbentur / bengkok) ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-17', '2025-02-14', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(768, 'Pratama Mas', 'Checklist perawatan battery tidak ada : 
1. Perawatan battery E/G
2. Perawatan battery AE', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Emergency battery', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-24', '2025-01-24', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(769, 'Pratama Mas', 'Checklist pengetesan rutin bulanan tidak ada : 
1. Emergency generator
2. Emergency fire pump
3. OWS 
4. Perawatan LO Cooler gearbox', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'General Maintenance/Marking', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-24', '2025-01-31', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(770, 'Pratama Mas', '010 (Risk Assesment) tim engine belum dibuatkan
010 (Risk Assesment)tim deck belum membahas terkait bahahya manuver di alur dan dermaga', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-24', '2025-01-24', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(771, 'Pratama Mas', 'Laporan kerusakan (062) & Laporan perbaikan (063) tidak berjalan sesuai sistem SMK', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-23', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(772, 'Pratama Mas', 'AIS log book tidak ada ', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Record Book', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-24', '2025-01-23', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(773, 'Pratama Mas', 'Dokumen MCU crew tidak ada di atas kapal :
1. Lukman Hamidi Al B.
2. Rio Surya Permana
3. Adenis Louren Reza Utomo', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Crew Documents', 'Medical Certificate', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-31', 'CLOSED', '', 'Meita Dwi S', 'Ihsan'),
(774, 'Prakarsa Mas', 'Rudder stock ditemukan tidak kedap, ditemukan genangan oli bercampur air laut', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-01-16', '2025', 'Audit 1', NULL, '2025-01-26', 'CLOSED', 'Dry Docking Item', 'Demianus rorano', 'Ihsan'),
(775, 'Prakarsa Mas', 'Pipa hidrolik steering P/S terdapat rembesan oli', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(776, 'Prakarsa Mas', 'Pipa hidrolik windlass di pompa 1 terdapat kebocoran', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(777, 'Prakarsa Mas', 'Pompa windlass 1 tekanan tidak sesuai dengan kebutuhan operasional jangkar', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-02-19', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(778, 'Prakarsa Mas', 'Terdapat rembesan oli pada LO filter', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Filter', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(779, 'Prakarsa Mas', 'Terdapat kebocoran pada pipa LO cooler', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Cooling System', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(780, 'Prakarsa Mas', 'Flange pada SW pump AE 3 terdapat rembesan air', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(781, 'Prakarsa Mas', 'GS pump tidak kedap', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(782, 'Prakarsa Mas', 'Pipa overboard sewage dari tanki sewage buntu', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Piping', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-26', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(783, 'Prakarsa Mas', 'Forepeak tank terdapat kebocoran', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Tank Condition', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-03-16', '2025-02-17', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(784, 'Prakarsa Mas', 'Plat paltform EFP berlubang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Forecastle Deck Condition', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-03-16', '2025-02-17', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(785, 'Prakarsa Mas', 'Marking pipa sounding maindeck S/B', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'General Maintenance/Marking', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-01-24', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(786, 'Prakarsa Mas', 'DC power backup AIS tidak ada', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Emergency battery', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-23', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(787, 'Prakarsa Mas', 'Buku publikasi :
1. Tabel pasang surut tahun 2024
2. Almanak nautika 2024
3. Tabel arus pasang surut tahun 2024

Belum tersedia update 2025', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-24', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(788, 'Prakarsa Mas', 'Platform deck sekoci P/S tidak ada', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Accomodation deck', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-02-16', '2025-01-24', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(789, 'Prakarsa Mas', 'Pompa steering P/S di temukan rembesan oli', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-01-16', '2025', 'Audit 1', '2025-01-31', '2025-02-03', 'CLOSED', '', 'Demianus rorano', 'Ihsan'),
(790, 'Sahabat Mas', 'Form 084-A-F ditemukan tidak terlampir di dokumentasi', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-11', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(791, 'Sahabat Mas', 'Indikator smoke detectore di turunkan ke darat', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Smoke Detector', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-03-21', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(792, 'Sahabat Mas', 'Air cooler bocor pada head emergency generator', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Emergency Generator', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-08', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(793, 'Sahabat Mas', 'Kebocoran pada pompa cooler AE 1', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-08', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(794, 'Sahabat Mas', '1 unit fairlead sebelah buritan SB tidak ada', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fairlead', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-14', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(795, 'Sahabat Mas', 'Elmot winch lifeboat SB ditemukan berlubang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Lifeboat', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-08', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(796, 'Sahabat Mas', 'Davit lifeboat P/S ditemukan korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Davit Launching', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-11', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(797, 'Sahabat Mas', 'Anak tangga davit lifeboat SB ditemukan kotosi dan berlubang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Davit Launching', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-14', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(798, 'Sahabat Mas', '2 unit limit switch steering gear tidak dapat berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-26', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(799, 'Sahabat Mas', 'Wearpack crew engine ditemukan kotor dan rusak', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Working Space', 'Personnel Protective Equipment', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-26', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(800, 'Sahabat Mas', '2 limit switch davit lifeboat SB ditemukan tidak terpasang', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Normal', '2025-02-05', '2025', 'Audit 1', '2025-03-06', '2025-02-08', 'CLOSED', '', 'Teddy Makanoneng', 'Ihsan'),
(801, 'Segoro Mas', 'Log Book tidak di record secara konsisten :
1. Radar log book 
2. GMDSS log book', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Record Book', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-14', 'CLOSED', '', 'Junianto', 'Ihsan'),
(802, 'Segoro Mas', 'AIS log book tidak ada ', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Record Book', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-23', 'CLOSED', '', 'Junianto', 'Ihsan'),
(803, 'Segoro Mas', 'Form ISM Code :
1. 084 A - F tidak ada lampiran dokumentasi
2. 023 (Abbandon Ship) - Keterangan tertulis bahwa mesin rusak tetapi pada aktual mesin dapat berfungsi
3. 059 - H Inventaris LSA FFA data expired MOB tidak sesuai', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-14', 'CLOSED', '', 'Junianto', 'Ihsan'),
(804, 'Segoro Mas', 'Poster MARPOL Annex V (Garbage) belum terpasang pada tempat sampah outdoor dan dapur', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Deck Area', 'Garbage Management', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-16', 'CLOSED', '', 'Junianto', 'Ihsan'),
(805, 'Segoro Mas', 'Caution Beware snapback zone pada windlass area dan winch area belum dibuat', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Deck Area', 'Identity Mark', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-28', 'CLOSED', '', 'Junianto', 'Ihsan'),
(806, 'Segoro Mas', 'Crew belum memahami prosedur pemakaian alat keselamatan  :
1. Fireman outfit ', 'Internal Audit', 'ISM Code', '5. Master responsibility& Authority', 'Working Space', 'Crew Responsibilty', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-22', 'CLOSED', '', 'Junianto', 'Ihsan'),
(807, 'Segoro Mas', 'Smoke detector tidak dapat berfungsi :
1. Zona 2 (captain deck) 
2. Zona 4 (boat deck)
3. Zona 6 (steering gear)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Smoke Detector', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-16', 'CLOSED', '', 'Junianto', 'Ihsan'),
(808, 'Segoro Mas', '1 unit lifejacket di anjungan tidak dilengkapi dengan lampu', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifejacket', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-14', 'CLOSED', '', 'Junianto', 'Ihsan'),
(809, 'Segoro Mas', 'Monitor CCTV tidak berfungsi ', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Bridge Area', 'Monitor CCTV', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-25', 'CLOSED', '', 'Junianto', 'Ihsan'),
(810, 'Segoro Mas', 'Kampas winch rescue boat aus ', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Rescue boat', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-27', 'CLOSED', '', 'Junianto', 'Ihsan'),
(811, 'Segoro Mas', 'Permintaan sounding tape belum on board (permintaan dari 02 Januari & 31 Januari 2025)', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Deck Area', 'Sounding tape', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-23', 'CLOSED', '', 'Junianto', 'Ihsan'),
(812, 'Segoro Mas', 'Seachest SB tidak dapat open / close karena wheel patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Sea Chest', 'Normal', '2025-02-14', '2025', 'Audit 1', NULL, '2025-09-15', 'CLOSED', '', 'Junianto', 'Ihsan'),
(813, 'Segoro Mas', 'Auxiliary Engine 2 tidak dapat dioperasikan karena eksitor konslet', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-09', 'CLOSED', '', 'Junianto', 'Ihsan'),
(814, 'Segoro Mas', 'Pompa general service tidak ada di atas kapal karena elmot terbakar (diturunkan ke darat)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-28', 'CLOSED', '', 'Junianto', 'Ihsan'),
(815, 'Segoro Mas', 'Manometer suhu FW cooler ME cyl 4 tidak ada dan cyl 1 rusak ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Manometer', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-15', 'CLOSED', '', 'Junianto', 'Ihsan'),
(816, 'Segoro Mas', 'Automatic charge aki AE tidak dapat berfungsi (pada saat audit kapal blackout dan aki tidak dapat untuk starter AE 1)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-05-03', 'CLOSED', 'Closed by manajemen : di kapal sudah ganti manual semua', 'Junianto', 'Ihsan'),
(817, 'Segoro Mas', 'Pintu emergency escape hanya memiliki 1 engsel pintu (mengakibatkan pintu sulit di buka / tutup)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Escape', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-22', 'CLOSED', '', 'Junianto', 'Ihsan'),
(818, 'Segoro Mas', 'Radar No. 2 tidak dapat medeteksi objek lebih dari 2 Nm', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Radar', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-27', 'CLOSED', '', 'Junianto', 'Ihsan'),
(819, 'Segoro Mas', 'Lampu berlabuh tidak ada backup DC power', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Emergency battery', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-15', 'CLOSED', '', 'Junianto', 'Ihsan'),
(820, 'Segoro Mas', 'Manometer suction tidak ada pada Ballast dan GS pump', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-22', 'CLOSED', '', 'Junianto', 'Ihsan'),
(821, 'Mavendra Mas', 'CPU PC di Office rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Working Space', 'PC / Laptop', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-21', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(822, 'Mavendra Mas', 'Buku pasang surut, arus, dan almanak nautica edisi tahun 2024', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-04-01', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(823, 'Mavendra Mas', 'MCU expired : 
1. AB a.n Moch. Farid expired 17 Januari 2025', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Crew Documents', 'Medical Certificate', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-19', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(824, 'Mavendra Mas', 'Limit switch davvit sekoci PS dan SB tidak berfungsi ', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-13', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(825, 'Mavendra Mas', 'Poster garbage MARPOL V belum terpasang di dapur dan tempat sampah umum', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-27', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(826, 'Mavendra Mas', '2 unit SART expired Febuari 2025', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'SART', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-03-02', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(827, 'Mavendra Mas', 'EPIRB expired Febuari 2025', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'EPIRB', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-03-02', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(828, 'Mavendra Mas', 'Magnetic Compass bergelembung  ', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Bridge Area', 'Magnetic Compass', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-17', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(829, 'Mavendra Mas', 'Prosedur operasional pada Quick Closing Valve Box tidak ada ', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-17', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(830, 'Mavendra Mas', 'Rudder indicator pada steering gear room tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-24', '2025-02-18', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(831, 'Mavendra Mas', 'Insulation pada escape thrunk terlepas ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Escape', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-24', '2025-09-14', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(832, 'Mavendra Mas', 'LO Analysis tidak ada ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'LO Analysis', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-05-08', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(833, 'Mavendra Mas', 'Water jet cleaning deck tidak ada di atas kapal', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Working Space', 'Waterjet', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-26', 'CLOSED', '', 'Wakhid Wisnu', 'Ihsan'),
(834, 'Semangat Mas', 'Form Ism Code : 
1. Daftar isi safety drill 022 & 025 tidak ada 
2. 025 - Data kondisi atmosfir tidak ada 
3. Dokumentasi safety drill 026 & 027 tidak ada 
4. 084 A - F tidak ada dokumentasi
5. 078 - Pilotage checklist dokumen terakhir 12 Januari 2025
6. 092 - Loading Cargo dokumen terakhir 13 Agustus 2024', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-23', 'CLOSED', '', '', ''),
(835, 'Semangat Mas', 'Davit Sekoci :
1. Limit Switch davit S/B tidak ada 1 unit 
2. Limit Switch davit P/S rusak 1 unit', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-26', 'CLOSED', '', '', ''),
(836, 'Semangat Mas', 'Sepatu kampas rem windlass P/S keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-02-14', '2025', 'Audit 1', NULL, '2025-06-13', 'CLOSED', '', '', ''),
(837, 'Semangat Mas', 'Stopper ditemukan dalam kondisi terlepas dan deformasi :
1. Bay 9 S/B deformasi
2. Bay 7 P/S terlepas', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Stopper hatch cover', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2024-03-14', 'CLOSED', '', '', ''),
(838, 'Semangat Mas', 'Braket dudukan lunas sekoci S/B bagian depan ditemukan keropos dan patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Davit Launching', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-15', 'CLOSED', '', '', ''),
(839, 'Semangat Mas', 'Safety net dan handrail pada gangway tidak terpasang pada saat sandar', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Deck Area', 'Gangway Equipment', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-19', 'CLOSED', '', '', ''),
(840, 'Semangat Mas', 'Tangga pilot S/B berlubang dan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Accomodation Ladder', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-15', 'CLOSED', '', '', ''),
(841, 'Semangat Mas', 'Kontaktor panel windlass pump S/B tidak ada', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-31', '2025-03-10', 'CLOSED', '', '', ''),
(842, 'Semangat Mas', 'Emergency pump steering no. 1 tidak dapat digunakan ketika cikar kanan / kiri', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Emergency Steering Gear', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-26', 'CLOSED', '', '', ''),
(843, 'Semangat Mas', 'Nameplate ILR S/B tidak ada ', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Liferaft', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-15', 'CLOSED', '', '', ''),
(844, 'Semangat Mas', 'Tidak terdapat manual quick release pada installasi HRU ILR S/B & P/S ', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-26', 'CLOSED', '', '', ''),
(845, 'Semangat Mas', 'Cover flywheel genset tidak ada ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Cover flywheel', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-19', 'CLOSED', '', '', ''),
(846, 'Semangat Mas', 'Braket roller block davit S/B keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Davit Launching', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-15', 'CLOSED', '', '', ''),
(847, 'Selaras Mas', 'Log Book tidak di record secara konsisten :
1. Radar 
2. GMDSS Radio ', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Record Book', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-20', 'CLOSED', '', '', ''),
(848, 'Selaras Mas', 'Safety Meeting belum melakukan pembahasan monthly news dan FIFA', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-17', 'CLOSED', '', '', ''),
(849, 'Selaras Mas', 'Document Crew :
1. MCU Mualim II a.n Sukses Fitrianto expired 6 Januari 2025
2. MCU KKM a.n Saharullah expired 6 November 2024
3. MCU Masinis III a.n Sadam expired 16 Januari 2025', 'Internal Audit', 'ISM Code', '11. Documentation', 'Crew Documents', 'Medical Certificate', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-19', 'CLOSED', '', '', ''),
(850, 'Selaras Mas', 'Form ISM Code :
1. 084 A - F tidak ada tanda tangan dan dokumentasi 
2. 092 terkait voyage 11 - 13 tidak ada
', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-20', 'CLOSED', '', '', ''),
(851, 'Selaras Mas', '010 (Risk Assesment) Deck belum dibuat pembahasan terkait :
1. Manuver di alur
2. Kegiatan bongkar muat
3. Operasional mooring dan anchor', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-17', 'CLOSED', '', '', ''),
(852, 'Selaras Mas', 'Poster MARPOL Annex IV belum terpasang di sekitar tempat sampah dan di dapur ', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-17', 'CLOSED', '', '', ''),
(853, 'Selaras Mas', 'Manometer tidak berfungsi :
1. Pompa windlass S/B
2. Ballast and GS pump
3. LO Primming pump
4. SW pump A/E 2 (manometer dilepas karena bocor)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Manometer', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-18', 'CLOSED', '', '', ''),
(854, 'Selaras Mas', 'Sepatu kampas windlass S/B keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-02-14', '2025', 'Audit 1', NULL, '2025-03-26', 'CLOSED', '', '', ''),
(855, 'Selaras Mas', 'Prosedur launching sekoci S/B pudar', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Poster', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-17', 'CLOSED', '', '', ''),
(856, 'Selaras Mas', 'Limit switch davit sekoci P/S dan S/B tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-02', 'CLOSED', '', '', ''),
(857, 'Selaras Mas', 'Catalog peta edisi tahun 2021', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-02', 'CLOSED', '', '', ''),
(858, 'Selaras Mas', 'Cooler gearbox terdapat kebocoran (O-ring spare merk python di kapal tidak sesuai) ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', '', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-23', 'CLOSED', '', '', ''),
(859, 'Selaras Mas', 'Pompa SW Cooler M/E tidak kedap pada impeller shaft', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-27', 'CLOSED', '', '', ''),
(860, 'Selaras Mas', 'Cyl. No. 1 M.E :
1. Running Hours pada PMS Januari 2025 5561 Jam (memasuki jadwal Overhoul)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'PMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-04-14', '2025-02-19', 'CLOSED', '', '', ''),
(861, 'Selaras Mas', 'Exhaust M/E ditemukan robek', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', '', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-26', 'CLOSED', '', '', ''),
(862, 'Selaras Mas', 'Vibration damper belum dilakukan pergantian  (sudah memasuki due date perawatan pada PMS 040 - A)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-19', 'CLOSED', '', '', ''),
(863, 'Selaras Mas', 'SIL Lifebouy buritan P/S tidak menyala', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Self Igniting Light', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-14', 'CLOSED', '', '', ''),
(864, 'Selaras Mas', 'Valve - valve disimpan pada forecastle store dan tidak terdapat dalam inventori engine', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'SMS Record', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-27', 'CLOSED', '', '', ''),
(865, 'Selaras Mas', 'Crankshaft deflection belum dilaksanakan ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', '', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-02-17', 'CLOSED', '', '', ''),
(866, 'Selaras Mas', 'Warepack crew ditemukan robek ', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Working Space', 'Personnel Protective Equipment', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-02-28', '2025-02-27', 'CLOSED', '', '', ''),
(867, 'Selaras Mas', 'Hasil LO analysis tidak ada di kapal (Sampel oli sudah turun ke darat)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'LO Analysis', 'Normal', '2025-02-14', '2025', 'Audit 1', '2025-03-14', '2025-03-18', 'CLOSED', '', '', ''),
(868, 'Semangat Mas', 'Tank top engine terdapat genangan minyak / oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Tanktop Condition', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-25', 'CLOSED', '', '', ''),
(869, 'Semangat Mas', 'Panel alarm lampu navigasi di anjungan tidak berfungsi (lampu indikator)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Navigation Light', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-10-04', 'CLOSED', '', '', ''),
(870, 'Semangat Mas', 'Manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Call Point', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-10-04', 'CLOSED', '', '', ''),
(871, 'Semangat Mas', 'Terdapat kebocoran pada pipa cerobong / funnel', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Piping', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-09-26', 'CLOSED', '', '', ''),
(872, 'Semangat Mas', 'Permintaan manifold TC  ME belum di penuhi perusahaan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Main Engine', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-12-18', 'CLOSED', '', '', ''),
(873, 'Semangat Mas', 'Watertight door di emergency generator korosi, tidak terdapat karet.', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-10-04', 'CLOSED', '', '', ''),
(874, 'Semangat Mas', 'Tidak tersedia record maintenance dan prosedur penggunaan pada emergency generator dan emergency fire pump', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-05', '2025-08-25', 'CLOSED', '', '', ''),
(875, 'Semangat Mas', 'Tidak terdapat record maintenance battery  di battery room', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-05', '2025-07-28', 'CLOSED', '', '', ''),
(876, 'Semangat Mas', 'Cover gear winch buritan tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-09-01', 'CLOSED', '', '', ''),
(877, 'Semangat Mas', 'Manhole di cross deck keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Manhole Cover', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-08-27', 'CLOSED', '', '', ''),
(878, 'Semangat Mas', 'Base plate /  dudukan sepatu banyak yang rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Lashing Equipment', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-08-22', 'CLOSED', '', '', ''),
(879, 'Semangat Mas', 'Drum winch forcastle sebelah kanan rusak, perlu perbaikan.', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-09-04', 'CLOSED', '', '', ''),
(880, 'Semangat Mas', 'Bulwark di forecastle korosi dan railing deformasi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bulwark', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-08-23', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(881, 'Semangat Mas', 'Winch di forecastle rembes ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-28', 'CLOSED', '', '', ''),
(882, 'Semangat Mas', 'Tangga di tiang mast forecastle korosi, sudah tipis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mast', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-09-02', 'CLOSED', '', '', ''),
(883, 'Semangat Mas', 'Beberapa stopper hatch cover patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Stopper hatch cover', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-07-27', 'CLOSED', '', '', ''),
(884, 'Semangat Mas', 'dinding deck house forecastle keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Forecastle Deck Condition', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-22', 'CLOSED', '', '', ''),
(885, 'Semangat Mas', 'Cargo crane rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Cargo Crane', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-28', 'CLOSED', '', '', ''),
(886, 'Semangat Mas', 'Wheel valve firepump di maindeck sebelah kiri tidak ada.', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Foam Fixed Firefighting', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-08-19', 'CLOSED', '', '', ''),
(887, 'Semangat Mas', 'Bolder di forecastle keropos / lubang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-08-19', 'CLOSED', '', '', ''),
(888, 'Prakarsa Mas', 'Tidak tersedia cover fly wheel AE 2 dan 3', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Cover flywheel', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-25', 'CLOSED', '', '', ''),
(889, 'Prakarsa Mas', 'Tidak tersedia prosedur pengoperasian dan record maintenance OWS', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-07-31', '2025-07-25', 'CLOSED', '', '', ''),
(890, 'Prakarsa Mas', 'Tidak tersedia marking pada pompa pompa di kamar mesin :
a. Fire pump
b. Ballast pump
c. GS pump', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Engine Room Steering Gear', 'General Maintenance/Marking', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-05', '2025-08-05', 'CLOSED', '', '', ''),
(891, 'Prakarsa Mas', 'Pondasi ballast pump dan fire pump korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-07-22', '2025', 'Audit 2', NULL, NULL, 'OPEN', '', '', ''),
(892, 'Prakarsa Mas', 'Dinding akomodasi (lining) di maindeck deck rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Celling & lining', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-06', 'CLOSED', '', '', ''),
(893, 'Prakarsa Mas', 'EPIRB tidak dapat dilakukan pengetesan, tidak fungsi, dan expired april 2025.', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'EPIRB', 'Warning', '2025-07-22', '2025', 'Audit 2', '2025-08-31', '2025-08-27', 'CLOSED', '', '', ''),
(894, 'Prakarsa Mas', 'SART expired april 2025', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'SART', 'Warning', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-27', 'CLOSED', '', '', ''),
(895, 'Prakarsa Mas', 'Jumlah line throwing apparatus kurang 2, hanya tersedia 2 unit.', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Line Throwing Apparatus', 'Warning', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-29', 'CLOSED', '', '', ''),
(896, 'Prakarsa Mas', 'Fire manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Call Point', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-08-11', 'CLOSED', '', '', ''),
(897, 'Prakarsa Mas', 'SOLAS tersedia tahun 2020 ( belum update) , versi terakhir tahun 2024', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-10', 'CLOSED', '', '', ''),
(898, 'Prakarsa Mas', 'Terdapat gelembung pada magnetic compass', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Magnetic Compass', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-29', 'CLOSED', '', '', ''),
(899, 'Prakarsa Mas', 'Terdapat fault pada fire alarm nomor 6 (engine control room)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Control Panel', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-07-28', 'CLOSED', '', '', ''),
(900, 'Prakarsa Mas', 'Pondasi roller fairlead di maindeck belakang korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fairlead', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-09-04', 'CLOSED', '', '', ''),
(901, 'Prakarsa Mas', 'Tidak tersedia prosedur pengoperasian dan record maintenance pada emergency generator dan emergency fire pump', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-05', '2025-07-25', 'CLOSED', '', '', ''),
(902, 'Prakarsa Mas', 'Stanchion di maindeck sebelah kanan keropos /  retak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-05', 'CLOSED', '', '', ''),
(903, 'Prakarsa Mas', 'Roller fairlead :
a. spring di haluan sebelah kanan tidak dapat berputar
b. Tros di haluan sebelah kiri tidak dapat berputar', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fairlead', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-09-30', 'CLOSED', '', '', ''),
(904, 'Prakarsa Mas', 'Bolder di forecastle keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-09-15', 'CLOSED', '', '', ''),
(905, 'Prakarsa Mas', 'Winch di forecastle rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-07', 'CLOSED', '', '', ''),
(906, 'Prakarsa Mas', 'Cargo crane :
a. Banyak rembes
b. Tangga tidak ada dudukan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Cargo Crane', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-05', 'CLOSED', '', '', ''),
(907, 'Prakarsa Mas', 'Watertight door :
a. CO2 room : Keropos
b. Emergency exit : keropos dan tidak tersedia karet
c. Bosun store forecastle : keropos dan deformasi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-10-18', 'CLOSED', '', '', ''),
(908, 'Prakarsa Mas', 'Railling di maindeck sebelah banyak korosi dan ada yang hilang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-07', 'CLOSED', '', '', ''),
(909, 'Sahabat Mas', 'Wheel valve fuel transfer pump tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-07-31', '2025-07-24', 'CLOSED', '', '', ''),
(910, 'Sahabat Mas', 'Marking pompa GS dan ballast tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-07-31', '2025-07-24', 'CLOSED', '', '', ''),
(911, 'Sahabat Mas', 'Manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Call Point', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-09-04', 'CLOSED', '', '', ''),
(912, 'Sahabat Mas', 'Flashlight pada fireman outfit tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fireman Outfit', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-15', 'CLOSED', '', '', ''),
(913, 'Sahabat Mas', 'Tidak tersedia spare battery two way radio', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Communication Equipment', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-01', 'CLOSED', '', '', ''),
(914, 'Sahabat Mas', 'Alarm panel lampu navigasi error', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Navigation Light', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-09-18', 'CLOSED', '', '', ''),
(915, 'Sahabat Mas', 'Beberapa Stopper hatch cover  patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Stopper hatch cover', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-30', 'CLOSED', '', '', ''),
(916, 'Sahabat Mas', 'Stanchion di maindeck sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-07-30', 'CLOSED', '', '', ''),
(917, 'Sahabat Mas', 'Hatch coaming di maindeck sebelah kiri dan kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-08-27', 'CLOSED', '', '', ''),
(918, 'Sahabat Mas', 'Watertight door :
a. winch house : keropos
b. Store forecastle : Keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-10-22', '2025-11-05', 'CLOSED', '', '', ''),
(919, 'Sahabat Mas', 'Emergency firepump:
a. Elmot tidak tersedia
b. Prosedur pengoperasian dan record maintenance tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-08-29', 'CLOSED', '', '', ''),
(920, 'Sahabat Mas', 'IMO simbol di APAR tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'IMO Symbol', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-01', 'CLOSED', '', '', ''),
(921, 'Sahabat Mas', 'Panama chock di maindeck sebelah kiri deformasi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Panama chock', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-08-03', 'CLOSED', '', '', ''),
(922, 'Sahabat Mas', 'D ring di bay 19 ditemukan rusak /  hilang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Lashing Equipment', 'Normal', '2025-07-22', '2025', 'Audit 2', '2025-08-22', '2025-08-03', 'CLOSED', '', '', ''),
(923, 'Sahabat Mas', 'Pipa jalur CO2 ke palka ditemukan korosi berlebih dan rusak.', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'CO2 Fixed Pipe Line', 'Warning', '2025-07-22', '2025', 'Audit 2', '2025-09-22', '2025-08-27', 'CLOSED', '', '', ''),
(924, 'Selaras Mas', 'Ceiling & lining ditemukan rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Celling & lining', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-10-29', '2025-08-20', 'CLOSED', '', '', ''),
(925, 'Selaras Mas', 'Echo sounder tidak dapat menampilkan kedalaman', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Echo Sounder', 'Normal', '2025-07-29', '2025', 'Audit 2', NULL, '2025-10-01', 'CLOSED', '', '', ''),
(926, 'Selaras Mas', 'Radar no 1 perlu penggantian magnetron sudah running 22rb jam', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Radar', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-08-12', 'CLOSED', '', '', ''),
(927, 'Selaras Mas', 'Pompa kemudi nomor 1 perlu perbaikan, tidak bisa ke kanan, solenoid  valve lemah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Warning', '2025-07-29', '2025', 'Audit 2', '2025-09-29', '2025-10-22', 'CLOSED', '', '', ''),
(928, 'Selaras Mas', 'Mesin sekoci sebelah kiri belum selesai perbaikan', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Warning', '2025-07-29', '2025', 'Audit 2', '2025-09-29', '2025-12-02', 'CLOSED', '', '', ''),
(929, 'Selaras Mas', 'Steering gear room rembes,oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-07-31', '2025-07-30', 'CLOSED', '', '', ''),
(930, 'Selaras Mas', 'Record maintenance emergency fire pump tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-07-31', '2025-07-30', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(931, 'Selaras Mas', 'Stiffener hatch coaming palka 1 sebelah kiri  keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-10-29', '2025-09-24', 'CLOSED', '', '', ''),
(932, 'Selaras Mas', 'Tangga ke emergency fire pump room patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Superstructure Condition', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-07-30', 'CLOSED', '', '', ''),
(933, 'Selaras Mas', 'Railling tangga dari maindeck ke forecastle sebelah kanan deformasi dan korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Accomodation Ladder', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-08-08', 'CLOSED', '', '', ''),
(934, 'Selaras Mas', 'Bulwark di maindeck sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bulwark', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-08-07', 'CLOSED', '', '', ''),
(935, 'Selaras Mas', 'Railling di maindeck sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-08-08', 'CLOSED', '', '', ''),
(936, 'Selaras Mas', 'Record maintenance battery di battery room  tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-07-31', '2025-07-31', 'CLOSED', '', '', ''),
(937, 'Selaras Mas', 'As kemudi di steering gear room rembes (air)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Steering Gear', 'Normal', '2025-07-29', '2025', 'Audit 2', NULL, '2025-12-12', 'CLOSED', 'Kapal tidak digunakan lagi', '', ''),
(938, 'Selaras Mas', 'Prosedur pengoperasian dan record miantenance emergency fire pump tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-07-31', '2025-07-31', 'CLOSED', '', '', ''),
(939, 'Selaras Mas', 'Buku publikasi Marpol tidak tersedia di atas kapal', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-08-12', 'CLOSED', '', '', ''),
(940, 'Selaras Mas', 'Permintaan cutter gear scalling belum dipenuhi oleh perusahaan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Store', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-09-04', 'CLOSED', '', '', ''),
(941, 'Selaras Mas', 'Pompa boster pump rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-08-29', '2025-07-31', 'CLOSED', '', '', ''),
(942, 'Selaras Mas', 'OWS tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Warning', '2025-07-29', '2025', 'Audit 2', '2025-10-29', '2025-10-09', 'CLOSED', '', '', ''),
(943, 'Selaras Mas', 'Tidak ada marking pompa pompa di kamar mesin', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'General Maintenance/Marking', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-07-31', '2025-07-30', 'CLOSED', '', '', ''),
(944, 'Selaras Mas', 'Tank top engine oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Tanktop Condition', 'Normal', '2025-07-29', '2025', 'Audit 2', '2025-09-29', '2025-10-01', 'CLOSED', '', '', ''),
(945, 'Mavendra Mas', 'OWS
1. Sensor ppm OWS tidak berfungsi
2. record maintenance tidak tersedia
3.Prosedur pengoperasian tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-09-30', '2025-09-28', 'CLOSED', '', '', ''),
(946, 'Mavendra Mas', 'Marking jalur CO2 di CO2 room tidak jelas', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'CO2 Fixed Firefighting', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-08-10', '2025-08-02', 'CLOSED', '', '', ''),
(947, 'Mavendra Mas', 'Fire Manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Fire Call Point', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-10-31', '2025-09-15', 'CLOSED', '', '', ''),
(948, 'Mavendra Mas', 'Kampas winch di forecastle sebalah kanan sudah tipis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-10-31', '2025-08-01', 'CLOSED', '', '', ''),
(949, 'Mavendra Mas', 'Emergency fire pump : 
1. Elmot belum terpasang saat dilaksanakan audit
2. Tidak ada prosedur perngoperasian
3. Tidak ada record maintenance', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2025-07-31', '2025', 'Audit 2', '2025-09-30', '2025-08-26', 'CLOSED', '', '', ''),
(950, 'Mavendra Mas', 'Hydrolik winch di winch house rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-08-07', '2025-08-02', 'CLOSED', '', '', ''),
(951, 'Mavendra Mas', 'Watertight door di winch house keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2025-07-31', '2025', 'Audit 2', NULL, '2025-09-14', 'CLOSED', '', '', ''),
(952, 'Mavendra Mas', 'Sepatu sepatu di stanchion di temukan banyak yang rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2025-07-31', '2025', 'Audit 2', NULL, '2025-09-16', 'CLOSED', '', '', ''),
(953, 'Mavendra Mas', 'Stopper hatch cover bay 17 sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Stopper hatch cover', 'Normal', '2025-07-31', '2025', 'Audit 2', '2025-10-31', '2025-08-20', 'CLOSED', '', '', ''),
(954, 'Mavendra Mas', 'Beberapa sepatu di hatch cover ditemukan rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Cover', 'Normal', '2025-07-31', '2025', 'Audit 2', NULL, '2025-09-19', 'CLOSED', '', '', ''),
(955, 'Pratama Mas', 'Fire Manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Fire Call Point', 'Warning', '2025-08-06', '2025', 'Audit 2', '2025-11-06', '2025-08-10', 'CLOSED', '', '', ''),
(956, 'Pratama Mas', 'Safety device ME tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Safety Device', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-08-15', 'CLOSED', '', '', ''),
(957, 'Pratama Mas', 'Bilge alarm kamar mesin tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Engine Room Bilge Alarm', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-08-15', 'CLOSED', '', '', ''),
(958, 'Pratama Mas', 'Sensor ppm di OWS tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Warning', '2025-08-06', '2025', 'Audit 2', '2025-11-06', '2025-09-29', 'CLOSED', '', '', ''),
(959, 'Pratama Mas', 'Tank top engine oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Tanktop Condition', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-10-06', '2025-08-27', 'CLOSED', '', '', ''),
(960, 'Pratama Mas', 'SOLAS belum tersedia edisi terbaru ( tersedia tahun 2020)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-09-02', 'CLOSED', '', '', ''),
(961, 'Pratama Mas', 'Magnetic compass :
1. ada gelembung
2. Tidak tersedia spare', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Magnetic Compass', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-09-02', 'CLOSED', '', '', ''),
(962, 'Pratama Mas', 'Tidak tersedia prosedur pengoperasian emergency generator', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-08-10', '2026-08-14', 'CLOSED', '', '', ''),
(963, 'Pratama Mas', 'Beberapa stanchion di maindeck sebelah kiri keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-11-06', '2025-09-22', 'CLOSED', '', '', ''),
(964, 'Pratama Mas', 'Deck forecastle sebalah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Forecastle Deck Condition', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-11-06', '2025-09-23', 'CLOSED', '', '', ''),
(965, 'Pratama Mas', 'Hidrolik winchlass di forecastle rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-10-06', '2025-08-19', 'CLOSED', '', '', ''),
(966, 'Pratama Mas', 'Scupper plug tidak terpasang saat kapal bunker', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Deck Area', 'Scupper plug', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-08-26', 'CLOSED', '', '', ''),
(967, 'Pratama Mas', 'Plimsoll mark dilambung kapal sebelah kiri kurang jelas dan perlu di marking ulang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Plimsoll Mark', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-08-11', 'CLOSED', '', '', ''),
(968, 'Pratama Mas', 'Permintaan buku kepanduan bahari belum dipenuhi perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Ship Documents', 'Publication Book', 'Normal', '2025-08-06', '2025', 'Audit 2', '2025-09-06', '2025-08-16', 'CLOSED', '', '', ''),
(969, 'Express Mas', 'Bulwark di maindeck keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bulwark', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-09-07', '2025-09-27', 'CLOSED', '', '', ''),
(970, 'Express Mas', 'Gangway tidak dapat di operasikan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Gangway Equipment', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-09-07', '2025-10-09', 'CLOSED', '', '', ''),
(971, 'Express Mas', 'Pilot ladder sebelah kiri patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Pilot Ladder', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-08-15', '2025-08-08', 'CLOSED', '', '', ''),
(972, 'Express Mas', 'Peranginan bahan bakar  FO tidak tersedia wire mest', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ventilation System', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-08-15', '2025-08-08', 'CLOSED', '', '', ''),
(973, 'Express Mas', 'Peranginan bahan bakar FO sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ventilation System', 'Normal', '2025-08-07', '2025', 'Audit 2', NULL, NULL, 'OPEN', '', '', ''),
(974, 'Express Mas', 'Windlass forecastle (hydrolik) rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-08-07', '2025-08-08', 'CLOSED', '', '', ''),
(975, 'Express Mas', 'Capstan winch forecastle keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2025-08-07', '2025', 'Audit 2', NULL, '2025-08-12', 'CLOSED', '', '', ''),
(976, 'Express Mas', 'Kampas winch forecastle sebelah kiri sudah tipis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-10-07', '2025-08-09', 'CLOSED', '', '', ''),
(977, 'Express Mas', 'Handle stopper jangkar sebelah kiri tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-11-07', '2025-09-15', 'CLOSED', '', '', ''),
(978, 'Express Mas', 'handle winch forecastle rembes', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-09-07', '2025-08-11', 'CLOSED', '', '', ''),
(979, 'Express Mas', 'Railling cabin crane keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Cargo Crane', 'Warning', '2025-08-07', '2025', 'Audit 2', '2025-11-07', '2025-10-08', 'CLOSED', '', '', ''),
(980, 'Express Mas', 'Kaca ruang operator cargo crane lepas (riskan kalau hujan)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Cargo Crane', 'Warning', '2025-08-07', '2025', 'Audit 2', '2025-11-07', '2025-10-08', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(981, 'Express Mas', 'Marking jalur CO2 ke engine dll belum tersedia', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'CO2 Fixed Pipe Line', 'Warning', '2025-08-07', '2025', 'Audit 2', '2025-08-15', '2025-08-08', 'CLOSED', '', '', ''),
(982, 'Express Mas', 'Fire alarm fault di nomor 2 dan 6', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Alarm', 'Warning', '2025-08-07', '2025', 'Audit 2', '2025-10-07', '2025-08-29', 'CLOSED', '', '', ''),
(983, 'Express Mas', 'Sekoci sebelah kiri tidak bisa di operasikan ( aki soak / waktunya ganti)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Warning', '2025-08-07', '2025', 'Audit 2', '2025-09-07', '2025-08-15', 'CLOSED', '', '', ''),
(984, 'Express Mas', 'Fire manual callpoint tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Call Point', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-11-07', '2025-08-29', 'CLOSED', '', '', ''),
(985, 'Express Mas', 'Lube oil analise belum tesredia di kapal (overdue)', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Ship Documents', 'LO Analysis', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-10-07', '2025-08-11', 'CLOSED', '', '', ''),
(986, 'Express Mas', 'Permintaan bantal belum dipenuhi oleh perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Accomodation', 'Pillow', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-10-07', '2025-08-08', 'CLOSED', '', '', ''),
(987, 'Express Mas', 'Permintaan equipment sekoci belum dipenuhi oleh perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'LSA FFA', 'Lifeboat', 'Normal', '2025-08-07', '2025', 'Audit 2', '2025-10-07', '2025-08-21', 'CLOSED', '', '', ''),
(988, 'Segoro Mas', '076 Hot work permit belum dilaksanakan', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-09', 'CLOSED', '', '', ''),
(989, 'Segoro Mas', 'Risk Assemsent belum dilaksanakan di atas kapal', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-09', 'CLOSED', '', '', ''),
(990, 'Segoro Mas', 'Familiarisasi koki tidak tersedia', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-09', 'CLOSED', '', '', ''),
(991, 'Segoro Mas', 'Buku SOLAS tersedia edisi 2020 (terbaru edisi 2024)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Publication Book', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-31', '2025-10-09', 'CLOSED', '', '', ''),
(992, 'Segoro Mas', 'MCB tidak tersedia cover :
a. DI Messroom tidak tersedia cover
b. Anjungan ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-31', '2025-10-18', 'CLOSED', '', '', ''),
(993, 'Segoro Mas', 'Manual call point tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Manual call point', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-18', 'CLOSED', '', '', ''),
(994, 'Segoro Mas', 'Lampu di toilet deck 3 tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-31', '2025-10-10', 'CLOSED', '', '', ''),
(995, 'Segoro Mas', 'Jangkauan AIS hanya kurang lebih 1 - 2 NM, perlu dilakukan pengecekan dan  perbaikan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'AIS', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-11-17', 'CLOSED', '', '', ''),
(996, 'Segoro Mas', 'Jangkauan Radar no 2 hanya 2 mil, gain tidak berfungsi normal, Magnetron sudah 17rb jam', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Radar', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(997, 'Segoro Mas', 'Radar no 1 tidak berungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Radar', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(998, 'Segoro Mas', 'alarm got palka tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bilge Hold Alarm', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-22', 'CLOSED', '', '', ''),
(999, 'Segoro Mas', 'Anemometer tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Anemometer', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-31', '2025-10-09', 'CLOSED', '', '', ''),
(1000, 'Segoro Mas', 'Radio VHF No 2 receiver & transmit kurang bagus, Jarak kurang lebih 4 mil suara samar2', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'VHF', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-10-31', '2025-11-04', 'CLOSED', '', '', ''),
(1001, 'Segoro Mas', 'Tedapat barang yang menghalangi emergency exit', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Emergency Exit', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-15', 'CLOSED', '', '', ''),
(1002, 'Segoro Mas', 'Tangga dewi dewi korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Davit Launching', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(1003, 'Segoro Mas', 'Limit switch sekoci tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Davit Launching', 'Warning', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(1004, 'Segoro Mas', 'Stiffener di hatch coaming maindeck kiri banyak keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-12-04', 'CLOSED', '', '', ''),
(1005, 'Segoro Mas', 'Bolder di maindeck  keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(1006, 'Segoro Mas', 'Air jangkar tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Piping Condition', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-11-25', 'CLOSED', '', '', ''),
(1007, 'Segoro Mas', 'Manhole di forecastle ke WBT 1 keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Manhole Cover', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-11-23', 'CLOSED', '', '', ''),
(1008, 'Segoro Mas', 'Manhole di depan store bosun cover rusak (engsel)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Manhole Cover', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-09', 'CLOSED', '', '', ''),
(1009, 'Segoro Mas', 'Tidak ada record maintenance emergency firepump', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'Maintenance/Test Record', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-15', 'CLOSED', '', '', ''),
(1010, 'Segoro Mas', 'Beberapa stanchion keropos dan ditambal menggunakan fiber/resin', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-12-31', '2025-10-09', 'CLOSED', '', '', ''),
(1011, 'Segoro Mas', 'Base plat sepatu di stanchion bay 19 S/S  rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Dovetail Foundation', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2026-01-07', 'CLOSED', '', '', ''),
(1012, 'Segoro Mas', 'Ceiling & lining ditemukan rusak di maindeck', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Celling & lining', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-11-18', 'CLOSED', '', '', ''),
(1013, 'Segoro Mas', 'Box electrik provision crane rusak (riskan kalau hujan)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Provision Crane', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-11-20', 'CLOSED', '', '', ''),
(1014, 'Segoro Mas', 'Bulwark di buritan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bulwark', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-12-31', '2025-12-04', 'CLOSED', '', '', ''),
(1015, 'Segoro Mas', 'Perbaikan GS pump belum selesai dikerjakan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Pump', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-11-30', '2025-10-18', 'CLOSED', '', '', ''),
(1016, 'Segoro Mas', 'Sensor PPM OWS tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Warning', '2025-10-10', '2025', 'Audit 2', '2026-01-20', '2025-11-14', 'CLOSED', '', '', ''),
(1017, 'Segoro Mas', 'Drill belum di record di log book engine', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Logbook', 'Normal', '2025-10-10', '2025', 'Audit 2', '2025-10-20', '2025-10-15', 'CLOSED', '', '', ''),
(1018, 'Prakarsa Mas', 'Critical spare - 059-B12 belum tersedia', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-13', 'CLOSED', '', '', ''),
(1019, 'Prakarsa Mas', 'PMS belum di terupdate :
- Lub oil analis - Terakhir 20 May 2025
- Nozzle injektor ME no 2 (- 536 Jam), no 5 (- 906 jam), no 6 (- 266 jam), no 7 (- 0 jam)
- Generator resistance - 816
- Crankshaft deflection (048) belum dilaksanakan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-28', '2026-03-04', 'CLOSED', '', '', ''),
(1020, 'Prakarsa Mas', 'Watertight door poop deck keropos P/S', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-20', 'CLOSED', '', '', ''),
(1021, 'Prakarsa Mas', 'Ceiling & lining rusak perlu dilakukan perbaikan :
1. Anjungan
2. Poop deck kiri', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Celling & lining', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-04-16', 'CLOSED', '', '', ''),
(1022, 'Prakarsa Mas', 'Beberapa lampu tidak tersedia cover:
1. Gangway akomodasi
2. Kamar C/O
3. Kamar mandi anjungan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Working Space', 'Lighting Condition', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-11', 'CLOSED', '', '', ''),
(1023, 'Prakarsa Mas', 'Dokumen crew :
a. MCU- Triyono - wiper - exp 23 Januari 2026
b. SCRB - Didy setiadi Alamaon - 3/E - Exp 6 Januari 2026', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Crew Documents', 'Medical Certificate', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1024, 'Prakarsa Mas', 'Radio VHF :
a. no 3  tidak dapat menerima (receiver)
b. No 1 layar blank tidak bisa membaca channel berapa', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'VHF', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-21', 'CLOSED', '', '', ''),
(1025, 'Prakarsa Mas', 'PA sistem tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Public Addressor', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-12', 'CLOSED', '', '', ''),
(1026, 'Prakarsa Mas', 'Intercom di CO2 system tidk berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Communication to CO2', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-11', 'CLOSED', '', '', ''),
(1027, 'Prakarsa Mas', 'CO2 system :
a. limit switch panel (alarm) tidak berfungsi
b. Blow test belum dilaksanakan di atas kapal', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Safety Device', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-13', 'CLOSED', '', '', ''),
(1028, 'Prakarsa Mas', 'Radar log book belum dikerjakan secara konsisten (terakhir 2 jan 2025)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-11', 'CLOSED', '', '', ''),
(1029, 'Prakarsa Mas', 'Blower kamar mesin tidak berfungsi dan korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Blower', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-15', '2026-03-05', 'CLOSED', '', '', ''),
(1030, 'Prakarsa Mas', 'Lifeboat sebelah kanan mesin tidak dapat dioperasikan (selang bahan bkar tidak tersedia)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Critical', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-19', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(1031, 'Prakarsa Mas', 'Tidak tersedia quick closing valve pada genset ( lebih dari 500l wajib tersedia)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Quick Closing Valve', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-05-18', 'CLOSED', '', '', ''),
(1032, 'Prakarsa Mas', 'Terdapat rembes pada genset ( solenoid dan filter), lantai oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Auxilliary Engine', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-11', 'CLOSED', '', '', ''),
(1033, 'Prakarsa Mas', 'hydrant poop deck sebelah kiri tidak dapat dioperasikan (wheel macet)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Hydrant', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-28', '2026-02-11', 'CLOSED', '', '', ''),
(1034, 'Prakarsa Mas', 'Terdapat barang yang menghalangi di emergency exit', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Emergency System', 'Emergency Exit', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-11', 'CLOSED', '', '', ''),
(1035, 'Prakarsa Mas', 'Railling keropos:
a. forecastle
b. Maindeck sebelah kanan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-11', 'CLOSED', '', '', ''),
(1036, 'Prakarsa Mas', 'Stanchion sebelah kanan retak (pondasi pada miandeck)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-13', 'CLOSED', '', '', ''),
(1037, 'Prakarsa Mas', 'Manhole di maindeck keropos ( air hujan masuk palka)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Manhole Cover', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-11', 'CLOSED', '', '', ''),
(1038, 'Prakarsa Mas', 'Tidak tersedia manometer di emg fire pump dan main fire pump', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire pump', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-04-02', 'CLOSED', '', '', ''),
(1039, 'Prakarsa Mas', 'Pondasi emg firepump keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Fire pump', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-12', 'CLOSED', '', '', ''),
(1040, 'Prakarsa Mas', 'Tidak tersedia prosedur pengoperasian emg fire pump dan checklist perawatan', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'LSA FFA', 'General Maintenance/Marking', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1041, 'Prakarsa Mas', 'Hydrolik winch forecastle rember oli', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1042, 'Prakarsa Mas', 'Penyangga gangway (wire) keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Gangway Equipment', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-24', 'CLOSED', '', '', ''),
(1043, 'Prakarsa Mas', 'Draft dan plimsol mark lambung kanan kurang jelas', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Draft Mark', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-11', 'CLOSED', '', '', ''),
(1044, 'Express Mas', 'Spare battery two way radio exp 2024', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Bridge Area', 'Two Way Radio GMDSS', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-03', 'CLOSED', '', '', ''),
(1045, 'Express Mas', 'Terdapat fault pada  fire alarm control panel', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Control Panel', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-23', 'CLOSED', '', '', ''),
(1046, 'Express Mas', 'Alarm lampu navigasi tidak tersedia (jika rusak)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Navigation Light', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', NULL, 'OPEN', '', '', ''),
(1047, 'Express Mas', 'Clear view screen tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Clear View Screen / Wiper', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-05', '2026-02-23', 'CLOSED', '', '', ''),
(1048, 'Express Mas', 'Lampu kanopi sekoci kiri kanan tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Lifeboat', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-06', 'CLOSED', '', '', ''),
(1049, 'Express Mas', 'Blower engine room keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Blower', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-23', '2026-02-12', 'CLOSED', '', '', ''),
(1050, 'Express Mas', 'Lantai deck C luar sebelah kiri (ke Lifeboat) keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Accomodation deck', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-12', 'CLOSED', '', '', ''),
(1051, 'Express Mas', 'Watertight door di deck B keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Weather Tight Door', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-04', '2026-04-10', 'CLOSED', '', '', ''),
(1052, 'Express Mas', 'Tidak tersedia imo simbol pada alat pemadam api ringan', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'IMO Symbol', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-23', 'CLOSED', '', '', ''),
(1053, 'Express Mas', 'Apar di cargo crane operator terakhir inspection 2024', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Portable Fire Extinguisher', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-23', 'CLOSED', '', '', ''),
(1054, 'Express Mas', 'MCB di dapur tidak tersedia cover', 'Internal Audit', 'ISM Code', '7. Shipboard Operation', 'Working Space', 'Portable Fire Extinguisher', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-05', 'CLOSED', '', '', ''),
(1055, 'Express Mas', 'Peranginan tanki tanki rusak (tidak tersedia wire mesh dan korosi)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ventilation System', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-04', '2026-04-10', 'CLOSED', '', '', ''),
(1056, 'Express Mas', 'Hatch coaming sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-04', '2026-03-17', 'CLOSED', '', '', ''),
(1057, 'Express Mas', 'Railing maindeck ke forecastle korosi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-19', 'CLOSED', '', '', ''),
(1058, 'Express Mas', 'Roller fairlead patah 1 (terkena tali yang putus)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fairlead', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-19', 'CLOSED', '', '', ''),
(1059, 'Express Mas', 'Spring di haluan ada satu yang rantas', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Line', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-19', 'CLOSED', '', '', ''),
(1060, 'Express Mas', 'Emg fire pump tidak dapat digunakan ketika trim besar (draft depan kecil)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-03', 'CLOSED', '', '', ''),
(1061, 'Express Mas', 'Lifebouy maindeck kurang jelas nama kapal dan port register', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Lifebuoy', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-12', 'CLOSED', '', '', ''),
(1062, 'Express Mas', 'Tabung fireplan tidak dapat dibuka di poop deck', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Fire & Safety plan tube', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1063, 'Express Mas', 'Dirp tray maindeck sebelah kiri keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Spill Box', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-04', NULL, 'OPEN', '', '', ''),
(1064, 'Express Mas', 'Permintaan wearpack belum dipenuhi perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Working Space', 'Personnel Protective Equipment', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-03-03', 'CLOSED', '', '', ''),
(1065, 'Semangat Mas', 'Beberapa apar under / overpressure,(contoh : foam di engine room)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Portable Fire Extinguisher', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-04-01', 'CLOSED', '', '', ''),
(1066, 'Semangat Mas', 'Pyrotechnik lifeboat :
- Red hand flare exp Dec 2025
- Smoke signal exp Dec 2025', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Pyrotechnic', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-24', 'CLOSED', '', '', ''),
(1067, 'Semangat Mas', 'Terdapat stop kontak di luar akomodasi tidak ada cover (resiko kalau hujan)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'Deck Area', 'Ducting Cable', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-20', 'CLOSED', '', '', ''),
(1068, 'Semangat Mas', 'Beberapa peranginan di maindeck kiri tidak tersedia wiremesh', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ventilation System', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-19', 'CLOSED', '', '', ''),
(1069, 'Semangat Mas', 'Handle watertightdoor di forecastle keropos, sudah tipis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-19', 'CLOSED', '', '', ''),
(1070, 'Semangat Mas', 'Beberapa IMO symbol tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'IMO Symbol', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-24', 'CLOSED', '', '', ''),
(1071, 'Semangat Mas', 'Hampir semua stopper hatch cover  keropos dan beberapa patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Stopper hatch cover', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-05-04', '2026-04-02', 'CLOSED', '', '', ''),
(1072, 'Semangat Mas', 'Sensor 15 PPM OWS tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1073, 'Semangat Mas', 'Alarm got kamar mesin tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Engine Room Bilge Alarm', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-19', 'CLOSED', '', '', ''),
(1074, 'Semangat Mas', 'SART & EPIRB  exp januari 2026', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'EPIRB', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-12', 'CLOSED', '', '', ''),
(1075, 'Semangat Mas', 'Emergency Fire pump tidak dapat digunakan (air mengambil dari ballast dan ballast kosong)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-05-04', '2026-02-19', 'CLOSED', '', '', ''),
(1076, 'Semangat Mas', 'Permintaan wearpack belum dipenuhi perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Working Space', 'Personnel Protective Equipment', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-04', 'CLOSED', '', '', ''),
(1077, 'Semangat Mas', 'Box fire plan tidak bisa dibuka', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Emergency System', 'Fire & Safety plan tube', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1078, 'Mavendra Mas', 'Drill belum dicatat dalam Log book engine', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Logbook', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1079, 'Mavendra Mas', '009 B belum dilaksanakan di atas kapal', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-26', 'CLOSED', '', '', ''),
(1080, 'Mavendra Mas', 'PMS :
a. 048 Crank deflection belum dilaksanakan
b. Lub oil analys belum dilaksanakan
c. Connection road ME overdue', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'PMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-04', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(1081, 'Mavendra Mas', '007 B master review belum dilaksanakan', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-20', 'CLOSED', '', '', ''),
(1082, 'Mavendra Mas', 'Emg fire pump dan Main fire pump tidak tersedia manometer', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire pump', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-04-04', '2026-02-20', 'CLOSED', '', '', ''),
(1083, 'Mavendra Mas', 'Lifejacket di ECR lampu tidak berfungsi dan tidak tersedia peluit', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifejacket', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-20', 'CLOSED', '', '', ''),
(1084, 'Mavendra Mas', 'Pressure Quick closing valve tidak ada (kosong)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Quick Closing Valve', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-12', 'CLOSED', '', '', ''),
(1085, 'Mavendra Mas', 'Mesin sekoci sebelah kanan tidak berfungsi (aki drop)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Warning', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-05', 'CLOSED', '', '', ''),
(1086, 'Mavendra Mas', 'Marking penggantian wire sekoci tidak tersedia', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Davit Launching', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-02-15', '2026-02-05', 'CLOSED', '', '', ''),
(1087, 'Mavendra Mas', 'Beberapa lampu di akomodasi tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-20', 'CLOSED', '', '', ''),
(1088, 'Mavendra Mas', 'Heat detectore di galley tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Heat Detector', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-12', 'CLOSED', '', '', ''),
(1089, 'Mavendra Mas', 'Permintaan wearpack belum dipenuhi perusahaan', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Working Space', 'Personnel Protective Equipment', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-03-12', 'CLOSED', '', '', ''),
(1090, 'Mavendra Mas', 'Bantal di akomodasi crew tidak layak', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Accomodation', 'Pillow', 'Normal', '2026-02-05', '2026', 'Audit 1', '2026-03-04', '2026-02-20', 'CLOSED', '', '', ''),
(1091, 'Segoro Mas', 'Kabel kabel di kamar mesin tidak tersedia ducting dan tidak rapi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Ducting Cable', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-03-04', 'CLOSED', '', '', ''),
(1092, 'Segoro Mas', 'Tank top engine room oily', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Tanktop Condition', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-02-19', 'CLOSED', '', '', ''),
(1093, 'Segoro Mas', 'LO filter oily, ada rembesan oli', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Filter', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-02-16', '2026-02-11', 'CLOSED', '', '', ''),
(1094, 'Segoro Mas', 'Pintu di akomodasi poop deck (store engine room) berlubang', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Pintu kamar / toilet', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-02-16', '2026-02-11', 'CLOSED', '', '', ''),
(1095, 'Segoro Mas', 'MCB di kamar master tidak diberikan cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ducting Cable', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-02-12', 'CLOSED', '', '', ''),
(1096, 'Segoro Mas', 'Spare magnetic compass terdapat gelembung', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Magnetic Compass', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-03-10', 'CLOSED', '', '', ''),
(1097, 'Segoro Mas', 'Alarm panel lampu navigasi tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Navigation Light', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-04-08', 'CLOSED', '', '', ''),
(1098, 'Segoro Mas', 'Pyrotechnic di anjungan exp feb 2026', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Pyrotechnic', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-03-05', 'CLOSED', '', '', ''),
(1099, 'Segoro Mas', 'Lampu di ruang radio / cctv dan store cat tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-02-16', '2026-02-12', 'CLOSED', '', '', ''),
(1100, 'Segoro Mas', 'Rel mooring line di buritan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Rel', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-05-07', 'CLOSED', '', '', ''),
(1101, 'Segoro Mas', 'Watertight door di buritan dan forecastle (tengah) keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-05-09', '2026-05-05', 'CLOSED', '', '', ''),
(1102, 'Segoro Mas', 'Superstructure akomodasi keropos (banyak yang difiber)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Superstructure Condition', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-05-09', '2026-03-10', 'CLOSED', '', '', ''),
(1103, 'Segoro Mas', 'Hatch coaming maindeck sebelah kiri keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-04-09', '2026-05-05', 'CLOSED', '', '', ''),
(1104, 'Segoro Mas', 'Bolder di forecastle keropos dan di lapisi fiber', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-04-09', '2026-03-12', 'CLOSED', '', '', ''),
(1105, 'Segoro Mas', 'Sepatu kampas winch tidak presisi, kampas habis tidak rata dan sudah tipis dibagian ujung', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-04-09', '2026-05-05', 'CLOSED', '', '', ''),
(1106, 'Segoro Mas', 'Roller guide jangkar kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Roller guide', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-04-09', '2026-02-13', 'CLOSED', '', '', ''),
(1107, 'Segoro Mas', 'Hatch coaming cross deck keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-04-09', '2026-04-22', 'CLOSED', '', '', ''),
(1108, 'Segoro Mas', 'Rat guard buritan tidak terpasang saat kapal sandar', 'Internal Audit', 'ISM Code', '', 'Deck Area', 'Rat guard', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-02-16', '2026-02-14', 'CLOSED', '', '', ''),
(1109, 'Segoro Mas', 'Kabel kabel di akomodasi luar tidak tersedia ducting', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Ducting Cable', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-03-04', 'CLOSED', '', '', ''),
(1110, 'Segoro Mas', 'Selang pemadam di kamar mesin tersedia 20M (max 15m)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fire Box (Hose, Nozzle, Couplings)', 'Normal', '2026-02-09', '2026', 'Audit 1', '2026-03-09', '2026-03-13', 'CLOSED', '', '', ''),
(1111, 'Segoro Mas', 'Emergency firepump tidak berfungsi & Record pengetesan dan maintenance emg firepump belum dilaksanakan secara konsisten (engine running namun tidak mau hisap air)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2026-02-09', '2026', 'Audit 1', '2026-05-09', '2026-02-13', 'CLOSED', '', '', ''),
(1112, 'Pratama Mas', 'CE standing order & night order tidak tersedia di kamar mesin', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Standing Order / Night Order', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-02-28', '2026-02-23', 'CLOSED', '', '', ''),
(1113, 'Pratama Mas', 'Emg firepump didepan elmot tidak ada ( diganti dibelakang dengan dongfeng di steering gear room . Masih satu compartment dengan engine room)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Emergency Fire pump', 'Warning', '2026-02-23', '2026', 'Audit 1', NULL, NULL, 'OPEN', '', '', ''),
(1114, 'Pratama Mas', 'Gangway kanan tidak dapat digunakan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Gangway Equipment', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', NULL, 'OPEN', '', '', ''),
(1115, 'Pratama Mas', 'Stanchion di maindeck sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-02-24', 'CLOSED', '', '', ''),
(1116, 'Pratama Mas', 'Railling di forecastle patah', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Railing', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-02-24', 'CLOSED', '', '', ''),
(1117, 'Pratama Mas', 'pondasi roller guide anchor chain keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Roller guide anchor chain', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-04-23', 'CLOSED', '', '', ''),
(1118, 'Pratama Mas', 'lampu di emg fire pump room tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-03-05', 'CLOSED', '', '', ''),
(1119, 'Pratama Mas', 'Lifebouy maindeck tidak tersedia SIL', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Self Igniting Light', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-02-28', '2026-02-23', 'CLOSED', '', '', ''),
(1120, 'Pratama Mas', 'Handhold pilot ladder korosi berlebih', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Handhold pilot ladder', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-02-23', 'CLOSED', '', '', ''),
(1121, 'Pratama Mas', 'Drip tray ventilasi bahan bakar keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Spill Box', 'Normal', '2026-02-23', '2026', 'Audit 1', NULL, NULL, 'OPEN', '', '', ''),
(1122, 'Pratama Mas', 'Lambung kapal depan dibawah roller fairlead sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hull', 'Normal', '2026-02-23', '2026', 'Audit 1', NULL, NULL, 'OPEN', '', '', ''),
(1123, 'Pratama Mas', 'Plimsol mark kurang jelas', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Plimsoll Mark', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-03-03', 'CLOSED', '', '', ''),
(1124, 'Pratama Mas', 'Bolder di maindeck kiri kanan korosi berlebih', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-02-24', 'CLOSED', '', '', ''),
(1125, 'Pratama Mas', 'PMS:
- Lub oil analys belum tersedia di atas kapal
- Mean bearing unit 1 - 8 (-6950)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'PMS Record', 'Normal', '2026-02-23', '2026', 'Audit 1', NULL, NULL, 'OPEN', '', '', ''),
(1126, 'Pratama Mas', '059-B12  critical sparepart belum tersedia di atas kapal', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-02-28', '2026-02-28', 'CLOSED', '', '', ''),
(1127, 'Sahabat Mas', 'Rudder indicator di anjungan tidak sama dengan di steering room (di anjungan 25 di steering room 30)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Bridge Area', 'Rudder Indicator', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-02-25', 'CLOSED', '', '', ''),
(1128, 'Sahabat Mas', 'Baju tahan api  (celana terkelupas)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Fireman Outfit', 'Warning', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-03-06', 'CLOSED', '', '', ''),
(1129, 'Sahabat Mas', 'Sekoci sebelah kanan baling baling tidak bisa berputar ( jika mesin hidup kemudian maju mesin mati )', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Critical', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-02-24', 'CLOSED', '', '', ''),
(1130, 'Sahabat Mas', 'Alternator emergency generator rusak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Emergency Generator', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-04-01', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

INSERT INTO public.nc_records (
  no, vessel, description, audit_type, cluster1, cluster2, category, sub_category,
  risk, issued_date, audit_year, audit_round, due_date, closed_date, status, remark, captain, auditor
) VALUES
(1131, 'Sahabat Mas', 'Bolder di maindeck sebelah kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bollard', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-03-23', '2026-02-26', 'CLOSED', '', '', ''),
(1132, 'Sahabat Mas', 'Hatch coaming banyak yang keropos di maindeck kanan kiri', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Coaming', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-05-16', 'CLOSED', '', '', ''),
(1133, 'Sahabat Mas', 'Jalur CO2 ke cargo hold di maindeck sebelah kiri keropos', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'CO2 Fixed Pipe Line', 'Warning', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-02-26', 'CLOSED', '', '', ''),
(1134, 'Sahabat Mas', 'Hatch cover bay 3 deformasi, di row 3 ada retak', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Cover', 'Normal', '2026-02-23', '2026', 'Audit 1', NULL, NULL, 'OPEN', '', '', ''),
(1135, 'Sahabat Mas', 'Stopper jangkar kanan keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Anchor stopper spiral', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-03-07', 'CLOSED', '', '', ''),
(1136, 'Sahabat Mas', 'Hatch cover bay 9 keropos (lubang)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hatch Cover', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-02-23', 'CLOSED', '', '', ''),
(1137, 'Sahabat Mas', 'Kampas winch forecastle sebelah kiri habis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Windlass', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-03-20', 'CLOSED', '', '', ''),
(1138, 'Sahabat Mas', 'Jalur hydrant di bay 9-11 keropos (bocor saat dilakukan pengetesan)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'LSA FFA', 'Fire Hydrant', 'Warning', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-02-25', 'CLOSED', '', '', ''),
(1139, 'Sahabat Mas', 'Watertight door di forecastle keropos (paint store)', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Water Tight Door', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-04-01', 'CLOSED', '', '', ''),
(1140, 'Sahabat Mas', 'Bulwark maindeck sebelah kiri keropos dan korosi berlebih', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bulwark', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-04-22', 'CLOSED', '', '', ''),
(1141, 'Sahabat Mas', 'Beberapa stanchion di maindeck sebelah kiri keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Fixed Stanchion', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-06-06', 'CLOSED', '', '', ''),
(1142, 'Sahabat Mas', 'Lambung kapal sebelah kiri disamping bolder maindeck keropos', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Hull', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-04-28', 'CLOSED', '', '', ''),
(1143, 'Sahabat Mas', 'Lub oil analys belum tersedia', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'PMS Record', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-04-23', '2026-03-02', 'CLOSED', '', '', ''),
(1144, 'Sahabat Mas', 'Sensor 15 ppm OWS tidak tersedia', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Normal', '2026-02-23', '2026', 'Audit 1', '2026-05-23', '2026-04-16', 'CLOSED', '', '', ''),
(1145, 'Selaras Mas', 'Risk Assesment belum dikerjakan secara konsisten. (ada hot work 30  april 2026)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-18', '2026-05-12', 'CLOSED', '', '', ''),
(1146, 'Selaras Mas', 'Kalibrasi gas detektor terakhir 2024', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Calibration Record', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-18', '2026-06-17', 'CLOSED', '', '', ''),
(1147, 'Selaras Mas', 'MCU CE - Andi Syahputra exp 19 April 2026', 'Internal Audit', 'ISM Code', '6. Resource & personel', 'Crew Documents', 'Medical Certificate', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-30', '2026-05-12', 'CLOSED', '', '', ''),
(1148, 'Selaras Mas', 'Catatan pemahaman SMK belum terupdate ( Oiler - Hendra belum membaca SMK, Onboard feb 26)', 'Internal Audit', 'ISM Code', '5. Master responsibility& Authority', 'Ship Documents', 'SMS Record', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-18', '2026-05-12', 'CLOSED', '', '', ''),
(1149, 'Selaras Mas', 'Garbage management plan tidak tersedia di atas kapal', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'Manual/Drawing Approval', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', NULL, 'OPEN', '', '', ''),
(1150, 'Selaras Mas', 'Form overhoule engine belum dikerjakan ( terakhir GO cyl 5 bulan April 2026)', 'Internal Audit', 'ISM Code', '11. Documentation', 'Ship Documents', 'SMS Record', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-18', '2026-05-12', 'CLOSED', '', '', ''),
(1151, 'Selaras Mas', 'Limit switch lifeboat kanan tidak berfungsi', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Lifeboat', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-30', '2026-05-21', 'CLOSED', '', '', ''),
(1152, 'Selaras Mas', 'Tabung gas LPG tidak tersedia bracket', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Bracket tabung LPG', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-30', '2026-05-12', 'CLOSED', '', '', ''),
(1153, 'Selaras Mas', 'Tidak tersedia marking SWL pada bolder di buritan', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'General Maintenance/Marking', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-05-30', '2026-05-12', 'CLOSED', '', '', ''),
(1154, 'Selaras Mas', 'kampas winch buritan sudah tipis', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Mooring Winch', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-05-12', 'CLOSED', '', '', ''),
(1155, 'Selaras Mas', 'Dinding kamar mandi di deck  2 rusak ', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Accomodation', 'Service Toilet', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-05-12', 'CLOSED', '', '', ''),
(1156, 'Selaras Mas', 'Lampu d anjungan tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Deck Area', 'Deck Lighting', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-06-04', 'CLOSED', '', '', ''),
(1157, 'Selaras Mas', 'sensor 15 ppm OWS tidak berfungsi', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Oily Water Separator', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-05-13', 'CLOSED', '', '', ''),
(1158, 'Selaras Mas', 'Flywheel AE 1 dan AE 2 tidak tersedia cover', 'Internal Audit', 'ISM Code', '10. Maintenance of the ship', 'Engine Room Steering Gear', 'Cover flywheel', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-06-04', 'CLOSED', '', '', ''),
(1159, 'Selaras Mas', 'LDV masker breathing apparatus mudah lepas (pengait longgar)', 'Internal Audit', 'ISM Code', '8. Emergency Preparedness', 'LSA FFA', 'Self Contained Breathing Apparatus', 'Normal', '2026-05-07', '2026', 'Audit 1', '2026-06-30', '2026-05-13', 'CLOSED', '', '', '')
ON CONFLICT (no) DO UPDATE SET
  vessel = EXCLUDED.vessel,
  description = EXCLUDED.description,
  audit_type = EXCLUDED.audit_type,
  cluster1 = EXCLUDED.cluster1,
  cluster2 = EXCLUDED.cluster2,
  category = EXCLUDED.category,
  sub_category = EXCLUDED.sub_category,
  risk = EXCLUDED.risk,
  issued_date = EXCLUDED.issued_date,
  audit_year = EXCLUDED.audit_year,
  audit_round = EXCLUDED.audit_round,
  due_date = EXCLUDED.due_date,
  closed_date = EXCLUDED.closed_date,
  status = EXCLUDED.status,
  remark = EXCLUDED.remark,
  captain = EXCLUDED.captain,
  auditor = EXCLUDED.auditor;

COMMIT;

-- Verify:
-- select count(*) from public.nc_records;