-- TỰ SINH từ items.js + store.js — đừng sửa tay. Chạy lại: npm run seed

delete from catalog_items;
insert into catalog_items (id, slot, name, price) values ('bg-mint', 'bg', 'Nền bạc hà', 30);
insert into catalog_items (id, slot, name, price) values ('bg-sunset', 'bg', 'Hoàng hôn Sài Gòn', 40);
insert into catalog_items (id, slot, name, price) values ('bg-night', 'bg', 'Đêm thành phố', 60);
insert into catalog_items (id, slot, name, price) values ('hair-short-brown', 'hair', 'Tóc nâu', 25);
insert into catalog_items (id, slot, name, price) values ('hair-short-pink', 'hair', 'Tóc hồng', 30);
insert into catalog_items (id, slot, name, price) values ('hair-long-black', 'hair', 'Tóc dài đen', 50);
insert into catalog_items (id, slot, name, price) values ('shirt-pink', 'shirt', 'Áo hồng', 20);
insert into catalog_items (id, slot, name, price) values ('shirt-blue', 'shirt', 'Áo xanh biển', 30);
insert into catalog_items (id, slot, name, price) values ('shirt-green', 'shirt', 'Áo xanh lá', 30);
insert into catalog_items (id, slot, name, price) values ('ao-dai-red', 'shirt', 'Áo dài đỏ', 80);
insert into catalog_items (id, slot, name, price) values ('shirt-gold', 'shirt', 'Áo hoàng kim', 100);
insert into catalog_items (id, slot, name, price) values ('pants-brown', 'pants', 'Quần nâu', 20);
insert into catalog_items (id, slot, name, price) values ('pants-blue', 'pants', 'Quần jean', 30);
insert into catalog_items (id, slot, name, price) values ('shorts-green', 'pants', 'Quần short', 35);
insert into catalog_items (id, slot, name, price) values ('non-la', 'hat', 'Nón lá', 40);
insert into catalog_items (id, slot, name, price) values ('cap-blue', 'hat', 'Mũ lưỡi trai', 35);
insert into catalog_items (id, slot, name, price) values ('crown', 'hat', 'Vương miện', 150);
insert into catalog_items (id, slot, name, price) values ('shades', 'glasses', 'Kính đen', 45);
insert into catalog_items (id, slot, name, price) values ('round-glasses', 'glasses', 'Kính tròn', 35);
insert into catalog_items (id, slot, name, price) values ('balloon', 'accL', 'Bóng bay', 25);
insert into catalog_items (id, slot, name, price) values ('banh-mi', 'accL', 'Bánh mì', 30);
insert into catalog_items (id, slot, name, price) values ('coffee', 'accR', 'Cà phê sữa đá', 25);
insert into catalog_items (id, slot, name, price) values ('flag', 'accR', 'Cờ đỏ sao vàng', 35);

delete from catalog_sets;
insert into catalog_sets (id, name, price, items) values ('set-du-khach', 'Set Du khách', 110, array['cap-blue', 'shades', 'shirt-blue', 'pants-blue']);
insert into catalog_sets (id, name, price, items) values ('set-sai-gon', 'Set Sài Gòn', 130, array['non-la', 'ao-dai-red', 'flag']);
insert into catalog_sets (id, name, price, items) values ('set-hoang-gia', 'Set Hoàng gia', 220, array['crown', 'shirt-gold', 'bg-night']);

delete from catalog_locations;
insert into catalog_locations (id, name, lat, lng, reward) values ('nha-tho-duc-ba', 'Nhà thờ Đức Bà', 10.7798, 106.699, 30);
insert into catalog_locations (id, name, lat, lng, reward) values ('buu-dien-tp', 'Bưu điện Thành phố', 10.7799, 106.6999, 20);
insert into catalog_locations (id, name, lat, lng, reward) values ('cho-ben-thanh', 'Chợ Bến Thành', 10.7721, 106.698, 25);
insert into catalog_locations (id, name, lat, lng, reward) values ('nguyen-hue', 'Phố đi bộ Nguyễn Huệ', 10.7743, 106.7038, 20);
insert into catalog_locations (id, name, lat, lng, reward) values ('dinh-doc-lap', 'Dinh Độc Lập', 10.7772, 106.6958, 30);
insert into catalog_locations (id, name, lat, lng, reward) values ('landmark-81', 'Landmark 81', 10.7951, 106.7218, 35);

delete from catalog_missions;
insert into catalog_missions (id, name, reward, goal) values ('first-checkin', 'Check-in địa điểm đầu tiên', 20, 1);
insert into catalog_missions (id, name, reward, goal) values ('three-checkins', 'Check-in 3 địa điểm', 40, 3);
insert into catalog_missions (id, name, reward, goal) values ('all-checkins', 'Khám phá đủ 6 địa điểm', 100, 6);
insert into catalog_missions (id, name, reward, goal) values ('first-friend', 'Kết bạn đầu tiên', 20, 1);
insert into catalog_missions (id, name, reward, goal) values ('first-item', 'Sắm món đồ đầu tiên', 30, 1);
insert into catalog_missions (id, name, reward, goal) values ('three-photos', 'Có 3 tấm ảnh trong Saigon Diary', 50, 3);
