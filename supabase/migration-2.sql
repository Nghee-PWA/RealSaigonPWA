-- ============================================================
-- NÂNG CẤP 2: Mã kết bạn thật + Báo cáo ảnh
-- Chạy MỘT LẦN trong Supabase → SQL Editor (trên project đã dựng
-- schema.sql trước đó). Chạy xong không cần chạy lại.
-- ============================================================

-- ---------- 1. MÃ KẾT BẠN ----------
-- Mỗi người chơi có một mã 6 ký tự (không chứa ký tự dễ nhầm như 0/O, 1/I)

alter table profiles add column if not exists friend_code text;

create or replace function gen_friend_code()
returns text language plpgsql as $$
declare v_code text;
begin
  loop
    select string_agg(substr('ABCDEFGHJKMNPQRSTUVWXYZ23456789', (floor(random() * 31) + 1)::int, 1), '')
      into v_code
      from generate_series(1, 6);
    exit when not exists (select 1 from profiles where friend_code = v_code);
  end loop;
  return v_code;
end;
$$;

update profiles set friend_code = gen_friend_code() where friend_code is null;
alter table profiles alter column friend_code set default gen_friend_code();
alter table profiles alter column friend_code set not null;
create unique index if not exists profiles_friend_code_key on profiles (friend_code);

-- Kết bạn bằng mã: máy chủ tự tra mã (app không đọc được hồ sơ người lạ),
-- ghi quan hệ 2 chiều để cả hai bên đều thấy nhau ngay.
create or replace function rpc_add_friend(p_code text)
returns text language plpgsql security definer
set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_other uuid;
  v_other_name text;
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;

  select id, display_name into v_other, v_other_name
    from profiles where friend_code = upper(trim(p_code));
  if v_other is null then raise exception 'không tìm thấy mã này'; end if;
  if v_other = v_me then raise exception 'không thể kết bạn với chính mình'; end if;
  if exists (select 1 from friendships where profile_id = v_me and friend_id = v_other) then
    raise exception 'hai bạn đã là bạn bè rồi';
  end if;

  insert into friendships (profile_id, friend_id)
    values (v_me, v_other), (v_other, v_me);

  insert into posts (profile_id, type, payload)
    values (v_me, 'friend', jsonb_build_object('friend_name', v_other_name));

  return v_other_name;
end;
$$;

-- ---------- 2. BÁO CÁO ẢNH ----------
-- Ai cũng báo cáo được 1 lần/bài; đủ 3 lượt báo cáo thì bài tự ẩn khỏi feed.

alter table posts add column if not exists hidden boolean not null default false;

create table if not exists photo_reports (
  reporter   uuid not null references profiles(id) on delete cascade,
  post_id    uuid not null references posts(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (reporter, post_id)
);

-- Khóa chặt: người chơi không đọc/ghi trực tiếp — chỉ đi qua hàm RPC.
-- (Admin xem danh sách báo cáo trong Supabase Dashboard → Table Editor.)
alter table photo_reports enable row level security;

create or replace function rpc_report_post(p_post_id uuid)
returns void language plpgsql security definer
set search_path = public as $$
declare
  v_me uuid := auth.uid();
  v_count int;
begin
  if v_me is null then raise exception 'chưa đăng nhập'; end if;

  insert into photo_reports (reporter, post_id) values (v_me, p_post_id)
    on conflict do nothing;

  select count(*) into v_count from photo_reports where post_id = p_post_id;
  if v_count >= 3 then
    update posts set hidden = true where id = p_post_id;
  end if;
end;
$$;
