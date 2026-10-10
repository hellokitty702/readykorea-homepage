import { relations } from 'drizzle-orm';
import {
  date,
  index,
  integer,
  jsonb,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';
import {
  APPLICATION_EVENT_TYPES,
  APPLICATION_STATUSES,
  JOB_BADGES,
  JOB_STATUSES,
  MEDIA_DISKS,
  POST_STATUSES,
  USER_ROLES,
} from './enums';

export * from './enums';

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
};

// ---------------------------------------------------------------------------
// Users + sessions
// ---------------------------------------------------------------------------

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  name: varchar('name', { length: 120 }).notNull(),
  passwordHash: text('password_hash').notNull(),
  role: varchar('role', { length: 20, enum: USER_ROLES }).notNull().default('user'),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  ...timestamps,
});

export const sessions = pgTable(
  'sessions',
  {
    /** SHA-256 of the token in the cookie, so a database leak can't be replayed as a login. */
    id: text('id').primaryKey(),
    userId: integer('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('sessions_user_id_idx').on(t.userId)],
);

// ---------------------------------------------------------------------------
// Jobs
// ---------------------------------------------------------------------------

export type JobFaq = { q: string; a: string };

/** Text shown on the Job Board card and detail view, in one language. */
export type JobContent = {
  title: string;
  /** Card label, e.g. "English kindergarten". */
  type: string;
  location: string;
  /** Short salary for the card and the detail header, e.g. "₩2.7–3.0M / month". */
  salary: string;
  /** Short housing note for the card, e.g. "Provided". */
  housing: string;
  /** Typical response time for the card, e.g. "~6 hours". */
  response: string;
  workingHours: string;
  monthlySalary: string;
  housingType: string;
  studentAge: string;
  workingDays: string;
  openings: string;
  salaryDetails: string;
  housingPolicy: string;
  vacation: string;
  severance: string;
  insurance: string;
  airfare: string;
  distinctive: string;
  faq: JobFaq[];
};

export const jobs = pgTable(
  'jobs',
  {
    id: serial('id').primaryKey(),
    /** Public job ID shown on the detail view and used in /apply/?job=…, e.g. RK-2026-GN-001. */
    code: varchar('code', { length: 40 }).notNull().unique(),
    /** Public page at /jobs/<slug>/, e.g. kindergarten-lead-teacher-k2-k3. Set once; changing it breaks shared links. */
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    status: varchar('status', { length: 20, enum: JOB_STATUSES }).notNull().default('draft'),
    badge: varchar('badge', { length: 20, enum: JOB_BADGES }),
    school: varchar('school', { length: 160 }).notNull(),
    startDate: date('start_date'),
    /** Free text for the card, e.g. "4.7 · 32 reviews". */
    rating: varchar('rating', { length: 60 }).notNull().default(''),
    en: jsonb('en').$type<JobContent>().notNull(),
    /** Korean text; any empty field falls back to English. */
    ko: jsonb('ko').$type<Partial<JobContent>>().notNull().default({}),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    createdById: integer('created_by_id').references(() => users.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (t) => [index('jobs_status_idx').on(t.status)],
);

// ---------------------------------------------------------------------------
// Applications
// ---------------------------------------------------------------------------

export const applications = pgTable(
  'applications',
  {
    id: serial('id').primaryKey(),
    /** Null for a general application (not tied to a listed job). */
    jobId: integer('job_id').references(() => jobs.id, { onDelete: 'set null' }),
    status: varchar('status', { length: 20, enum: APPLICATION_STATUSES }).notNull().default('new'),
    fullName: varchar('full_name', { length: 160 }).notNull(),
    email: varchar('email', { length: 255 }).notNull(),
    passportCountry: varchar('passport_country', { length: 60 }).notNull(),
    position: varchar('position', { length: 60 }).notNull(),
    regions: text('regions').array().notNull(),
    experience: varchar('experience', { length: 30 }).notNull(),
    introduction: text('introduction').notNull().default(''),
    /** Site language when the form was sent. */
    lang: varchar('lang', { length: 2 }).notNull().default('en'),
    ...timestamps,
  },
  (t) => [
    index('applications_job_id_idx').on(t.jobId),
    index('applications_status_idx').on(t.status),
    index('applications_created_at_idx').on(t.createdAt),
  ],
);

/** Timeline of an application: submission, every status change, and admin notes. */
export const applicationEvents = pgTable(
  'application_events',
  {
    id: serial('id').primaryKey(),
    applicationId: integer('application_id')
      .notNull()
      .references(() => applications.id, { onDelete: 'cascade' }),
    type: varchar('type', { length: 20, enum: APPLICATION_EVENT_TYPES }).notNull(),
    fromStatus: varchar('from_status', { length: 20, enum: APPLICATION_STATUSES }),
    toStatus: varchar('to_status', { length: 20, enum: APPLICATION_STATUSES }),
    note: text('note').notNull().default(''),
    userId: integer('user_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('application_events_application_id_idx').on(t.applicationId)],
);

// ---------------------------------------------------------------------------
// Blog
// ---------------------------------------------------------------------------

export const categories = pgTable('categories', {
  id: serial('id').primaryKey(),
  /** /blog/category/<slug>/ */
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 80 }).notNull(),
  /** Intro on the category page. */
  description: varchar('description', { length: 400 }).notNull().default(''),
  ...timestamps,
});

/** Created from the post form as they are typed; removed once no post uses them. */
export const tags = pgTable('tags', {
  id: serial('id').primaryKey(),
  /** /blog/tag/<slug>/ */
  slug: varchar('slug', { length: 100 }).notNull().unique(),
  name: varchar('name', { length: 60 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const posts = pgTable(
  'posts',
  {
    id: serial('id').primaryKey(),
    /** Public page at /blog/<slug>/. */
    slug: varchar('slug', { length: 100 }).notNull().unique(),
    status: varchar('status', { length: 20, enum: POST_STATUSES }).notNull().default('draft'),
    title: varchar('title', { length: 200 }).notNull(),
    /** Shown on the blog index; also the meta description when `seoDescription` is blank. */
    summary: varchar('summary', { length: 400 }).notNull().default(''),
    /** Shorter text for the homepage "Latest Posts" cards; falls back to the summary. */
    teaser: varchar('teaser', { length: 200 }).notNull().default(''),
    /** Article HTML from the admin editor, sanitized on save (lib/blog-html.ts). */
    body: text('body').notNull().default(''),
    /** Optional YouTube video shown above the article. */
    youtubeId: varchar('youtube_id', { length: 20 }).notNull().default(''),
    seoTitle: varchar('seo_title', { length: 200 }).notNull().default(''),
    seoDescription: varchar('seo_description', { length: 400 }).notNull().default(''),
    categoryId: integer('category_id').references(() => categories.id, { onDelete: 'set null' }),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    authorId: integer('author_id').references(() => users.id, { onDelete: 'set null' }),
    ...timestamps,
  },
  (t) => [index('posts_status_idx').on(t.status), index('posts_category_id_idx').on(t.categoryId)],
);

export const postTags = pgTable(
  'post_tags',
  {
    postId: integer('post_id')
      .notNull()
      .references(() => posts.id, { onDelete: 'cascade' }),
    tagId: integer('tag_id')
      .notNull()
      .references(() => tags.id, { onDelete: 'cascade' }),
  },
  (t) => [primaryKey({ columns: [t.postId, t.tagId] }), index('post_tags_tag_id_idx').on(t.tagId)],
);

// ---------------------------------------------------------------------------
// Media (uploaded images)
// ---------------------------------------------------------------------------

/** Files uploaded from the admin panel. Posts reference them by `url`, inside their HTML. */
export const media = pgTable(
  'media',
  {
    id: serial('id').primaryKey(),
    disk: varchar('disk', { length: 20, enum: MEDIA_DISKS }).notNull(),
    /** Path inside the storage, e.g. uploads/2026/10/classroom-k3x9qa.jpg. */
    key: varchar('key', { length: 300 }).notNull().unique(),
    /** Address used in posts: /uploads/… locally, the R2 public URL in production. */
    url: text('url').notNull(),
    /** Name of the file on the uploader's computer. */
    filename: varchar('filename', { length: 255 }).notNull(),
    mimeType: varchar('mime_type', { length: 100 }).notNull(),
    /** Bytes. */
    size: integer('size').notNull(),
    width: integer('width'),
    height: integer('height'),
    /** Default alt text when the image is inserted into a post. */
    alt: varchar('alt', { length: 300 }).notNull().default(''),
    uploadedById: integer('uploaded_by_id').references(() => users.id, { onDelete: 'set null' }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [index('media_created_at_idx').on(t.createdAt)],
);

// ---------------------------------------------------------------------------
// Relations (for db.query)
// ---------------------------------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  createdBy: one(users, { fields: [jobs.createdById], references: [users.id] }),
  applications: many(applications),
}));

export const applicationsRelations = relations(applications, ({ one, many }) => ({
  job: one(jobs, { fields: [applications.jobId], references: [jobs.id] }),
  events: many(applicationEvents),
}));

export const applicationEventsRelations = relations(applicationEvents, ({ one }) => ({
  application: one(applications, { fields: [applicationEvents.applicationId], references: [applications.id] }),
  user: one(users, { fields: [applicationEvents.userId], references: [users.id] }),
}));

export type User = typeof users.$inferSelect;
export type Job = typeof jobs.$inferSelect;
export type Application = typeof applications.$inferSelect;
export type Post = typeof posts.$inferSelect;
export type Category = typeof categories.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type Media = typeof media.$inferSelect;
