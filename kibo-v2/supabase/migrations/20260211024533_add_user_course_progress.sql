create table if not exists user_course_progress (
  user_id uuid references auth.users not null,
  course_id text not null,
  completed_lessons text[] default '{}',
  unlocked_hints jsonb default '{}'::jsonb,
  last_accessed_at timestamptz default now(),
  primary key (user_id, course_id)
);

alter table user_course_progress enable row level security;

create policy "Users can view their own course progress"
  on user_course_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert/update their own course progress"
  on user_course_progress for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
