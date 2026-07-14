-- ============================================================
-- NNN — LƯỢC ĐỒ DATABASE + LUẬT BẢO MẬT (Supabase / PostgreSQL)
--
-- Dán toàn bộ file này vào Supabase → SQL Editor → Run, một lần
-- duy nhất khi dựng project. Nó tạo ra:
--   1. Các bảng dữ liệu (sổ cái)
--   2. Bảng "catalog" (giá đồ, phần thưởng) — NGUỒN SỰ THẬT nằm ở
--      máy chủ, app KHÔNG được tự đặt giá hay tự cộng tiền.
--   3. Luật bảo mật RLS (ai đọc/sửa được gì)
--   4. Các hàm giao dịch (RPC) — mọi thay đổi 🍩 đều đi qua đây và
--      được máy chủ kiểm tra, chống gian lận "tự cộng tiền".
-- ============================================================

-- ---------- BẢNG CATALOG (nguồn sự thật, chỉ admin sửa) ----------
-- App đọc để hiển thị; app KHÔNG dùng giá do chính nó gửi lên.

create table if not exists catalog_items (
  id        text primary key,
  slot      text not null,
  name      text not null,
  price     int  not null check (price >= 0)
);

create table if not exists catalog_sets (
  id     text primary key,
  name   text not null,
  price  int  not null check (price >= 0),
  items  text[] not null           -- các item_id trong bộ
);

create table if not exists catalog_locations (
  id      text primary key,
  name    text not null,
  lat     double precision not null,
  lng     double precision not null,
  reward  int  not null check (reward >= 0)
);

create table if not exists catalog_missions (
  id      text primary key,
  name    text not null,
  reward  int  not null check (reward >= 0),
  goal    int  not null check (goal > 0)
);

-- ---------- HỒ SƠ NGƯỜI CHƠI ----------
-- id trùng với tài khoản (kể cả tài khoản ẩn danh của Supabase Auth).
create table if not exists profiles (
  id            uuid primary key references auth.users(id) on delete cascade,
  display_name  text not null default 'Bé Na',
  donuts        int  not null default 50 check (donuts >= 0),
  equipped      jsonb not null default '{}'::jsonb,   -- {slot: item_id}
  last_login    date,                                 -- cho phần thưởng đăng nhập
  login_streak  int  not null default 0,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

-- ---------- ĐỒ ĐÃ SỞ HỮU ----------
create table if not exists owned_items (
  profile_id  uuid not null references profiles(id) on delete cascade,
  item_id     text not null references catalog_items(id),
  acquired_at timestamptz not null default now(),
  primary key (profile_id, item_id)
);

-- ---------- CHECK-IN / NHẬT KÝ ẢNH ----------
create table if not exists visits (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  location_id text not null references catalog_locations(id),
  photo_path  text,                       -- đường dẫn ảnh trong Storage
  created_at  timestamptz not null default now(),
  unique (profile_id, location_id)        -- mỗi nơi chỉ check-in 1 lần
);

-- ---------- NHIỆM VỤ ĐÃ NHẬN THƯỞNG ----------
create table if not exists mission_claims (
  profile_id  uuid not null references profiles(id) on delete cascade,
  mission_id  text not null references catalog_missions(id),
  claimed_at  timestamptz not null default now(),
  primary key (profile_id, mission_id)
);

-- ---------- KẾT BẠN ----------
-- Lưu 2 chiều (a→b và b→a) để truy vấn "bạn của tôi" cực nhanh.
create table if not exists friendships (
  profile_id  uuid not null references profiles(id) on delete cascade,
  friend_id   uuid not null references profiles(id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (profile_id, friend_id)
);

-- ---------- BẢNG TIN (feed) ----------
create table if not exists posts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references profiles(id) on delete cascade,
  type        text not null,              -- 'photo' | 'outfit'
  payload     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now()
);

-- ============================================================
-- BẬT RLS (Row Level Security) TRÊN MỌI BẢNG DỮ LIỆU NGƯỜI CHƠI
-- Mặc định: khóa hết, rồi mở đúng những gì cần.
-- ============================================================
alter table profiles       enable row level security;
alter table owned_items    enable row level security;
alter table visits         enable row level security;
alter table mission_claims enable row level security;
alter table friendships    enable row level security;
alter table posts          enable row level security;

-- Bảng catalog: ai đăng nhập cũng ĐỌC được (để hiển thị cửa hàng),
-- nhưng không ai SỬA được (không có policy insert/update/delete).
alter table catalog_items     enable row level security;
alter table catalog_sets      enable row level security;
alter table catalog_locations enable row level security;
alter table catalog_missions  enable row level security;
create policy "catalog đọc được" on catalog_items     for select using (true);
create policy "catalog đọc được" on catalog_sets      for select using (true);
create policy "catalog đọc được" on catalog_locations for select using (true);
create policy "catalog đọc được" on catalog_missions  for select using (true);

-- Hàm phụ: hai người có phải bạn bè không?
create or replace function are_friends(a uuid, b uuid)
returns boolean language sql stable as $$
  select exists(
    select 1 from friendships
    where profile_id = a and friend_id = b
  );
$$;

-- ---------- PROFILES ----------
-- Đọc: hồ sơ của mình + hồ sơ bạn bè (để xem avatar/đồ của bạn).
create policy "đọc hồ sơ mình và bạn" on profiles for select
  using (id = auth.uid() or are_friends(auth.uid(), id));

-- Sửa: chỉ chủ nhân, VÀ chỉ được đổi tên + đồ đang mặc.
-- (Cột donuts/streak bị chặn ở dưới bằng GRANT — chỉ hàm RPC đổi được.)
create policy "sửa hồ sơ của mình" on profiles for update
  using (id = auth.uid()) with check (id = auth.uid());

-- ---------- OWNED_ITEMS / VISITS / MISSION_CLAIMS ----------
-- Đọc của mình + của bạn bè; KHÔNG cho tự thêm (chỉ hàm RPC thêm).
create policy "đọc đồ của mình và bạn" on owned_items for select
  using (profile_id = auth.uid() or are_friends(auth.uid(), profile_id));

create policy "đọc visit của mình và bạn" on visits for select
  using (profile_id = auth.uid() or are_friends(auth.uid(), profile_id));

create policy "đọc nhiệm vụ của mình" on mission_claims for select
  using (profile_id = auth.uid());

-- ---------- FRIENDSHIPS ----------
create policy "đọc quan hệ bạn của mình" on friendships for select
  using (profile_id = auth.uid() or friend_id = auth.uid());
create policy "tự kết bạn" on friendships for insert
  with check (profile_id = auth.uid());
create policy "tự hủy kết bạn" on friendships for delete
  using (profile_id = auth.uid());

-- ---------- POSTS ----------
create policy "đọc feed của mình và bạn" on posts for select
  using (profile_id = auth.uid() or are_friends(auth.uid(), profile_id));

-- ============================================================
-- CHẶN APP TỰ SỬA TIỀN
-- Thu hồi quyền UPDATE trực tiếp lên các cột "có giá trị" của profiles.
-- Người chơi chỉ update được display_name và equipped; donuts, streak,
-- last_login chỉ thay đổi qua các hàm RPC (security definer) bên dưới.
-- ============================================================
revoke update on profiles from anon, authenticated;
grant  update (display_name, equipped, updated_at) on profiles to authenticated;

-- ============================================================
-- TỰ TẠO HỒ SƠ KHI CÓ TÀI KHOẢN MỚI (kể cả tài khoản ẩn danh)
-- ============================================================
create or replace function handle_new_user()
returns trigger language plpgsql security definer
set search_path = public as $$
begin
  insert into public.profiles (id) values (new.id) on conflict do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();

-- ============================================================
-- CÁC HÀM GIAO DỊCH (RPC) — MỌI THAY ĐỔI 🍩 ĐỀU QUA ĐÂY
-- security definer = chạy với quyền cao, nhưng luôn kiểm tra auth.uid()
-- nên người chơi chỉ tác động được lên chính mình.
-- ============================================================

-- ---- Check-in một địa điểm: cộng thưởng theo giá máy chủ ----
create or replace function rpc_checkin(p_location_id text, p_photo_path text)
returns int language plpgsql security definer as $$
declare
  v_reward int;
  v_me uuid := auth.uid();
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;

  select reward into v_reward from catalog_locations where id = p_location_id;
  if v_reward is null then raise exception 'địa điểm không tồn tại'; end if;

  -- unique(profile_id, location_id) đảm bảo không check-in trùng để farm tiền
  insert into visits (profile_id, location_id, photo_path)
    values (v_me, p_location_id, p_photo_path);

  update profiles set donuts = donuts + v_reward, updated_at = now()
    where id = v_me;

  insert into posts (profile_id, type, payload)
    values (v_me, 'photo',
            jsonb_build_object('location_id', p_location_id, 'photo_path', p_photo_path));

  return v_reward;
end;
$$;

-- ---- Mua một món đồ: trừ đúng giá máy chủ, không cho mua trùng ----
create or replace function rpc_buy_item(p_item_id text)
returns void language plpgsql security definer as $$
declare
  v_price int;
  v_slot  text;
  v_me uuid := auth.uid();
  v_donuts int;
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;

  select price, slot into v_price, v_slot from catalog_items where id = p_item_id;
  if v_price is null then raise exception 'món đồ không tồn tại'; end if;

  if exists(select 1 from owned_items where profile_id = v_me and item_id = p_item_id) then
    raise exception 'đã sở hữu món này';
  end if;

  select donuts into v_donuts from profiles where id = v_me for update;
  if v_donuts < v_price then raise exception 'không đủ donut'; end if;

  update profiles
    set donuts = donuts - v_price,
        equipped = equipped || jsonb_build_object(v_slot, p_item_id),
        updated_at = now()
    where id = v_me;

  insert into owned_items (profile_id, item_id) values (v_me, p_item_id);

  insert into posts (profile_id, type, payload)
    values (v_me, 'outfit', jsonb_build_object('item_id', p_item_id));
end;
$$;

-- ---- Mua trọn bộ set: trừ giá bộ, tặng các món chưa có ----
create or replace function rpc_buy_set(p_set_id text)
returns void language plpgsql security definer as $$
declare
  v_price int; v_items text[]; v_item text; v_slot text;
  v_me uuid := auth.uid(); v_donuts int;
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;
  select price, items into v_price, v_items from catalog_sets where id = p_set_id;
  if v_price is null then raise exception 'set không tồn tại'; end if;

  select donuts into v_donuts from profiles where id = v_me for update;
  if v_donuts < v_price then raise exception 'không đủ donut'; end if;

  update profiles set donuts = donuts - v_price, updated_at = now() where id = v_me;

  foreach v_item in array v_items loop
    select slot into v_slot from catalog_items where id = v_item;
    insert into owned_items (profile_id, item_id) values (v_me, v_item)
      on conflict do nothing;
    update profiles set equipped = equipped || jsonb_build_object(v_slot, v_item)
      where id = v_me;
  end loop;

  insert into posts (profile_id, type, payload)
    values (v_me, 'outfit', jsonb_build_object('set_id', p_set_id));
end;
$$;

-- ---- Nhận thưởng nhiệm vụ: máy chủ TỰ kiểm tra đã đạt mục tiêu chưa ----
create or replace function rpc_claim_mission(p_mission_id text)
returns int language plpgsql security definer as $$
declare
  v_reward int; v_goal int; v_progress int;
  v_me uuid := auth.uid();
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;
  select reward, goal into v_reward, v_goal from catalog_missions where id = p_mission_id;
  if v_reward is null then raise exception 'nhiệm vụ không tồn tại'; end if;

  if exists(select 1 from mission_claims where profile_id = v_me and mission_id = p_mission_id) then
    raise exception 'đã nhận thưởng nhiệm vụ này';
  end if;

  -- Tiến độ được tính từ dữ liệu THẬT trên máy chủ, không tin app gửi lên
  v_progress := case p_mission_id
    when 'first-checkin'  then (select count(*) from visits where profile_id = v_me)
    when 'three-checkins' then (select count(*) from visits where profile_id = v_me)
    when 'all-checkins'   then (select count(*) from visits where profile_id = v_me)
    when 'first-friend'   then (select count(*) from friendships where profile_id = v_me)
    when 'first-item'     then (select count(*) from owned_items where profile_id = v_me)
    when 'three-photos'   then (select count(*) from visits where profile_id = v_me and photo_path is not null)
    else 0 end;

  if v_progress < v_goal then raise exception 'chưa đạt mục tiêu nhiệm vụ'; end if;

  insert into mission_claims (profile_id, mission_id) values (v_me, p_mission_id);
  update profiles set donuts = donuts + v_reward, updated_at = now() where id = v_me;
  return v_reward;
end;
$$;

-- ---- Thưởng đăng nhập hằng ngày (có chuỗi streak) ----
-- Ngày 1:+10, ngày 2:+15, ... tối đa +30. Gọi mỗi lần mở app.
create or replace function rpc_daily_login()
returns int language plpgsql security definer as $$
declare
  v_me uuid := auth.uid();
  v_last date; v_streak int; v_reward int;
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;
  select last_login, login_streak into v_last, v_streak from profiles where id = v_me for update;

  if v_last = current_date then return 0; end if;        -- hôm nay nhận rồi

  if v_last = current_date - 1 then v_streak := v_streak + 1;   -- liên tục
  else v_streak := 1; end if;                                   -- đứt chuỗi

  v_reward := least(10 + (v_streak - 1) * 5, 30);
  update profiles
    set donuts = donuts + v_reward, last_login = current_date,
        login_streak = v_streak, updated_at = now()
    where id = v_me;
  return v_reward;
end;
$$;

-- ============================================================
-- REALTIME: cho phép app "nghe" thay đổi hồ sơ + feed của bạn bè
-- (RLS vẫn áp dụng — chỉ nhận được thay đổi mình có quyền đọc)
-- ============================================================
alter publication supabase_realtime add table profiles;
alter publication supabase_realtime add table posts;

-- ============================================================
-- SAU KHI CHẠY FILE NÀY: nạp dữ liệu catalog bằng seed.sql
-- (giá đồ, địa điểm, nhiệm vụ). File đó sinh tự động từ items.js
-- và store.js để hai bên (app ↔ máy chủ) luôn khớp nhau.
-- ============================================================
