import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor');
  CREATE TYPE "public"."enum_connects_category" AS ENUM('youth', 'men', 'women', 'family', 'young-adults', 'serve', 'general');
  CREATE TYPE "public"."enum_connects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__connects_v_version_category" AS ENUM('youth', 'men', 'women', 'family', 'young-adults', 'serve', 'general');
  CREATE TYPE "public"."enum__connects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_pages_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__pages_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_announcements_category" AS ENUM('Announcement', 'Sunday Service', 'Event', 'Ministry Update', 'Community Outreach');
  CREATE TYPE "public"."enum_announcements_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__announcements_v_version_category" AS ENUM('Announcement', 'Sunday Service', 'Event', 'Ministry Update', 'Community Outreach');
  CREATE TYPE "public"."enum__announcements_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_story_chapters_chapter_key" AS ENUM('prologue', 'evangelism', 'discipleship', 'leadership', 'mission');
  CREATE TYPE "public"."enum_story_chapters_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__story_chapters_v_version_chapter_key" AS ENUM('prologue', 'evangelism', 'discipleship', 'leadership', 'mission');
  CREATE TYPE "public"."enum__story_chapters_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_sermons_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__sermons_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_outreaches_branch_type" AS ENUM('Main Sanctuary', 'Planted Campus', 'Pioneering Outreach');
  CREATE TYPE "public"."enum_outreaches_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__outreaches_v_version_branch_type" AS ENUM('Main Sanctuary', 'Planted Campus', 'Pioneering Outreach');
  CREATE TYPE "public"."enum__outreaches_v_version_status" AS ENUM('draft', 'published');
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'admin' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar,
  	"caption" varchar,
  	"credit" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "speakers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"role" varchar,
  	"bio" varchar,
  	"photo_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "series" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"description" varchar,
  	"cover_image_id" integer,
  	"start_date" timestamp(3) with time zone,
  	"study_guide_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "connects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"description" varchar,
  	"category" "enum_connects_category" DEFAULT 'general',
  	"schedule" varchar,
  	"image_id" integer,
  	"icon" varchar,
  	"google_form_url" varchar,
  	"order" numeric DEFAULT 0,
  	"is_active" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_connects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_connects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_description" varchar,
  	"version_category" "enum__connects_v_version_category" DEFAULT 'general',
  	"version_schedule" varchar,
  	"version_image_id" integer,
  	"version_icon" varchar,
  	"version_google_form_url" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_is_active" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__connects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"hero_subtitle" varchar,
  	"content" jsonb,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_pages_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_pages_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_hero_subtitle" varchar,
  	"version_content" jsonb,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__pages_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"image_id" integer,
  	"category" "enum_announcements_category" DEFAULT 'Announcement',
  	"branch_id" integer,
  	"date" timestamp(3) with time zone,
  	"location" varchar,
  	"featured" boolean DEFAULT false,
  	"summary" varchar,
  	"content" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_announcements_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_announcements_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_image_id" integer,
  	"version_category" "enum__announcements_v_version_category" DEFAULT 'Announcement',
  	"version_branch_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_location" varchar,
  	"version_featured" boolean DEFAULT false,
  	"version_summary" varchar,
  	"version_content" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__announcements_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "story_chapters" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric,
  	"chapter_key" "enum_story_chapters_chapter_key",
  	"pillar_name" varchar,
  	"headline" varchar,
  	"subheadline" varchar,
  	"scripture_ref" varchar,
  	"scripture_text" varchar,
  	"background_media_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_story_chapters_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_story_chapters_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_order" numeric,
  	"version_chapter_key" "enum__story_chapters_v_version_chapter_key",
  	"version_pillar_name" varchar,
  	"version_headline" varchar,
  	"version_subheadline" varchar,
  	"version_scripture_ref" varchar,
  	"version_scripture_text" varchar,
  	"version_background_media_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__story_chapters_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "sermons_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tag" varchar
  );
  
  CREATE TABLE "sermons" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"speaker_id" integer,
  	"series_id" integer,
  	"date" timestamp(3) with time zone,
  	"scripture" varchar,
  	"summary" varchar,
  	"video_url" varchar,
  	"audio_id" integer,
  	"thumbnail_id" integer,
  	"study_guide_id" integer,
  	"study_notes" jsonb,
  	"status" "enum_sermons_status" DEFAULT 'published',
  	"featured" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_sermons_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_sermons_v_version_tags" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tag" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_sermons_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_speaker_id" integer,
  	"version_series_id" integer,
  	"version_date" timestamp(3) with time zone,
  	"version_scripture" varchar,
  	"version_summary" varchar,
  	"version_video_url" varchar,
  	"version_audio_id" integer,
  	"version_thumbnail_id" integer,
  	"version_study_guide_id" integer,
  	"version_study_notes" jsonb,
  	"version_status" "enum__sermons_v_version_status" DEFAULT 'published',
  	"version_featured" boolean DEFAULT false,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__sermons_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "outreaches_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" varchar DEFAULT 'Sunday',
  	"time" varchar DEFAULT '10:00 AM',
  	"service_name" varchar DEFAULT 'Worship & Word Celebration'
  );
  
  CREATE TABLE "outreaches" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"branch_type" "enum_outreaches_branch_type" DEFAULT 'Planted Campus',
  	"lead_pastor" varchar,
  	"address" varchar,
  	"city" varchar,
  	"country" varchar DEFAULT 'Philippines',
  	"latitude" numeric,
  	"longitude" numeric,
  	"cover_image_id" integer,
  	"contact_phone" varchar,
  	"contact_email" varchar,
  	"featured" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_outreaches_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_outreaches_v_version_service_times" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day" varchar DEFAULT 'Sunday',
  	"time" varchar DEFAULT '10:00 AM',
  	"service_name" varchar DEFAULT 'Worship & Word Celebration',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_outreaches_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_branch_type" "enum__outreaches_v_version_branch_type" DEFAULT 'Planted Campus',
  	"version_lead_pastor" varchar,
  	"version_address" varchar,
  	"version_city" varchar,
  	"version_country" varchar DEFAULT 'Philippines',
  	"version_latitude" numeric,
  	"version_longitude" numeric,
  	"version_cover_image_id" integer,
  	"version_contact_phone" varchar,
  	"version_contact_email" varchar,
  	"version_featured" boolean DEFAULT true,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__outreaches_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"media_id" integer,
  	"speakers_id" integer,
  	"series_id" integer,
  	"connects_id" integer,
  	"pages_id" integer,
  	"announcements_id" integer,
  	"story_chapters_id" integer,
  	"sermons_id" integer,
  	"outreaches_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"giving_qr_code_id" integer,
  	"giving_bank_name" varchar DEFAULT 'BDO Unibank / GCash / Maya',
  	"giving_account_name" varchar DEFAULT 'Jesus the Master Builder Global Ministry',
  	"giving_account_number" varchar DEFAULT '0012-3456-7890',
  	"mission_hero_image_id" integer,
  	"connect_hero_image_id" integer,
  	"church_address" varchar DEFAULT 'JMBGM Main Campus Sanctuary, Metro Manila, Philippines',
  	"church_phone" varchar DEFAULT '+63 (02) 8123-4567 / +63 917 123 4567',
  	"church_email" varchar DEFAULT 'info@jmbgm.org / connect@jmbgm.org',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "speakers" ADD CONSTRAINT "speakers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "series" ADD CONSTRAINT "series_study_guide_id_media_id_fk" FOREIGN KEY ("study_guide_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "connects" ADD CONSTRAINT "connects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_connects_v" ADD CONSTRAINT "_connects_v_parent_id_connects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."connects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_connects_v" ADD CONSTRAINT "_connects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v" ADD CONSTRAINT "_pages_v_parent_id_pages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."pages"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "announcements" ADD CONSTRAINT "announcements_branch_id_outreaches_id_fk" FOREIGN KEY ("branch_id") REFERENCES "public"."outreaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_parent_id_announcements_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."announcements"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_announcements_v" ADD CONSTRAINT "_announcements_v_version_branch_id_outreaches_id_fk" FOREIGN KEY ("version_branch_id") REFERENCES "public"."outreaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "story_chapters" ADD CONSTRAINT "story_chapters_background_media_id_media_id_fk" FOREIGN KEY ("background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_story_chapters_v" ADD CONSTRAINT "_story_chapters_v_parent_id_story_chapters_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."story_chapters"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_story_chapters_v" ADD CONSTRAINT "_story_chapters_v_version_background_media_id_media_id_fk" FOREIGN KEY ("version_background_media_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons_tags" ADD CONSTRAINT "sermons_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_speaker_id_speakers_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speakers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_series_id_series_id_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_audio_id_media_id_fk" FOREIGN KEY ("audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_thumbnail_id_media_id_fk" FOREIGN KEY ("thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "sermons" ADD CONSTRAINT "sermons_study_guide_id_media_id_fk" FOREIGN KEY ("study_guide_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v_version_tags" ADD CONSTRAINT "_sermons_v_version_tags_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_sermons_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_parent_id_sermons_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."sermons"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_speaker_id_speakers_id_fk" FOREIGN KEY ("version_speaker_id") REFERENCES "public"."speakers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_series_id_series_id_fk" FOREIGN KEY ("version_series_id") REFERENCES "public"."series"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_audio_id_media_id_fk" FOREIGN KEY ("version_audio_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_thumbnail_id_media_id_fk" FOREIGN KEY ("version_thumbnail_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_sermons_v" ADD CONSTRAINT "_sermons_v_version_study_guide_id_media_id_fk" FOREIGN KEY ("version_study_guide_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "outreaches_service_times" ADD CONSTRAINT "outreaches_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."outreaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "outreaches" ADD CONSTRAINT "outreaches_cover_image_id_media_id_fk" FOREIGN KEY ("cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_outreaches_v_version_service_times" ADD CONSTRAINT "_outreaches_v_version_service_times_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_outreaches_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_outreaches_v" ADD CONSTRAINT "_outreaches_v_parent_id_outreaches_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."outreaches"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_outreaches_v" ADD CONSTRAINT "_outreaches_v_version_cover_image_id_media_id_fk" FOREIGN KEY ("version_cover_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_speakers_fk" FOREIGN KEY ("speakers_id") REFERENCES "public"."speakers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_series_fk" FOREIGN KEY ("series_id") REFERENCES "public"."series"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_connects_fk" FOREIGN KEY ("connects_id") REFERENCES "public"."connects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_story_chapters_fk" FOREIGN KEY ("story_chapters_id") REFERENCES "public"."story_chapters"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sermons_fk" FOREIGN KEY ("sermons_id") REFERENCES "public"."sermons"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_outreaches_fk" FOREIGN KEY ("outreaches_id") REFERENCES "public"."outreaches"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_giving_qr_code_id_media_id_fk" FOREIGN KEY ("giving_qr_code_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_mission_hero_image_id_media_id_fk" FOREIGN KEY ("mission_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "site_settings" ADD CONSTRAINT "site_settings_connect_hero_image_id_media_id_fk" FOREIGN KEY ("connect_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE UNIQUE INDEX "speakers_slug_idx" ON "speakers" USING btree ("slug");
  CREATE INDEX "speakers_photo_idx" ON "speakers" USING btree ("photo_id");
  CREATE INDEX "speakers_updated_at_idx" ON "speakers" USING btree ("updated_at");
  CREATE INDEX "speakers_created_at_idx" ON "speakers" USING btree ("created_at");
  CREATE UNIQUE INDEX "series_slug_idx" ON "series" USING btree ("slug");
  CREATE INDEX "series_cover_image_idx" ON "series" USING btree ("cover_image_id");
  CREATE INDEX "series_study_guide_idx" ON "series" USING btree ("study_guide_id");
  CREATE INDEX "series_updated_at_idx" ON "series" USING btree ("updated_at");
  CREATE INDEX "series_created_at_idx" ON "series" USING btree ("created_at");
  CREATE UNIQUE INDEX "connects_slug_idx" ON "connects" USING btree ("slug");
  CREATE INDEX "connects_image_idx" ON "connects" USING btree ("image_id");
  CREATE INDEX "connects_updated_at_idx" ON "connects" USING btree ("updated_at");
  CREATE INDEX "connects_created_at_idx" ON "connects" USING btree ("created_at");
  CREATE INDEX "connects__status_idx" ON "connects" USING btree ("_status");
  CREATE INDEX "_connects_v_parent_idx" ON "_connects_v" USING btree ("parent_id");
  CREATE INDEX "_connects_v_version_version_slug_idx" ON "_connects_v" USING btree ("version_slug");
  CREATE INDEX "_connects_v_version_version_image_idx" ON "_connects_v" USING btree ("version_image_id");
  CREATE INDEX "_connects_v_version_version_updated_at_idx" ON "_connects_v" USING btree ("version_updated_at");
  CREATE INDEX "_connects_v_version_version_created_at_idx" ON "_connects_v" USING btree ("version_created_at");
  CREATE INDEX "_connects_v_version_version__status_idx" ON "_connects_v" USING btree ("version__status");
  CREATE INDEX "_connects_v_created_at_idx" ON "_connects_v" USING btree ("created_at");
  CREATE INDEX "_connects_v_updated_at_idx" ON "_connects_v" USING btree ("updated_at");
  CREATE INDEX "_connects_v_latest_idx" ON "_connects_v" USING btree ("latest");
  CREATE UNIQUE INDEX "pages_slug_idx" ON "pages" USING btree ("slug");
  CREATE INDEX "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX "pages__status_idx" ON "pages" USING btree ("_status");
  CREATE INDEX "_pages_v_parent_idx" ON "_pages_v" USING btree ("parent_id");
  CREATE INDEX "_pages_v_version_version_slug_idx" ON "_pages_v" USING btree ("version_slug");
  CREATE INDEX "_pages_v_version_version_updated_at_idx" ON "_pages_v" USING btree ("version_updated_at");
  CREATE INDEX "_pages_v_version_version_created_at_idx" ON "_pages_v" USING btree ("version_created_at");
  CREATE INDEX "_pages_v_version_version__status_idx" ON "_pages_v" USING btree ("version__status");
  CREATE INDEX "_pages_v_created_at_idx" ON "_pages_v" USING btree ("created_at");
  CREATE INDEX "_pages_v_updated_at_idx" ON "_pages_v" USING btree ("updated_at");
  CREATE INDEX "_pages_v_latest_idx" ON "_pages_v" USING btree ("latest");
  CREATE INDEX "announcements_image_idx" ON "announcements" USING btree ("image_id");
  CREATE INDEX "announcements_branch_idx" ON "announcements" USING btree ("branch_id");
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "announcements__status_idx" ON "announcements" USING btree ("_status");
  CREATE INDEX "_announcements_v_parent_idx" ON "_announcements_v" USING btree ("parent_id");
  CREATE INDEX "_announcements_v_version_version_image_idx" ON "_announcements_v" USING btree ("version_image_id");
  CREATE INDEX "_announcements_v_version_version_branch_idx" ON "_announcements_v" USING btree ("version_branch_id");
  CREATE INDEX "_announcements_v_version_version_updated_at_idx" ON "_announcements_v" USING btree ("version_updated_at");
  CREATE INDEX "_announcements_v_version_version_created_at_idx" ON "_announcements_v" USING btree ("version_created_at");
  CREATE INDEX "_announcements_v_version_version__status_idx" ON "_announcements_v" USING btree ("version__status");
  CREATE INDEX "_announcements_v_created_at_idx" ON "_announcements_v" USING btree ("created_at");
  CREATE INDEX "_announcements_v_updated_at_idx" ON "_announcements_v" USING btree ("updated_at");
  CREATE INDEX "_announcements_v_latest_idx" ON "_announcements_v" USING btree ("latest");
  CREATE INDEX "story_chapters_order_idx" ON "story_chapters" USING btree ("order");
  CREATE UNIQUE INDEX "story_chapters_chapter_key_idx" ON "story_chapters" USING btree ("chapter_key");
  CREATE INDEX "story_chapters_background_media_idx" ON "story_chapters" USING btree ("background_media_id");
  CREATE INDEX "story_chapters_updated_at_idx" ON "story_chapters" USING btree ("updated_at");
  CREATE INDEX "story_chapters_created_at_idx" ON "story_chapters" USING btree ("created_at");
  CREATE INDEX "story_chapters__status_idx" ON "story_chapters" USING btree ("_status");
  CREATE INDEX "_story_chapters_v_parent_idx" ON "_story_chapters_v" USING btree ("parent_id");
  CREATE INDEX "_story_chapters_v_version_version_order_idx" ON "_story_chapters_v" USING btree ("version_order");
  CREATE INDEX "_story_chapters_v_version_version_chapter_key_idx" ON "_story_chapters_v" USING btree ("version_chapter_key");
  CREATE INDEX "_story_chapters_v_version_version_background_media_idx" ON "_story_chapters_v" USING btree ("version_background_media_id");
  CREATE INDEX "_story_chapters_v_version_version_updated_at_idx" ON "_story_chapters_v" USING btree ("version_updated_at");
  CREATE INDEX "_story_chapters_v_version_version_created_at_idx" ON "_story_chapters_v" USING btree ("version_created_at");
  CREATE INDEX "_story_chapters_v_version_version__status_idx" ON "_story_chapters_v" USING btree ("version__status");
  CREATE INDEX "_story_chapters_v_created_at_idx" ON "_story_chapters_v" USING btree ("created_at");
  CREATE INDEX "_story_chapters_v_updated_at_idx" ON "_story_chapters_v" USING btree ("updated_at");
  CREATE INDEX "_story_chapters_v_latest_idx" ON "_story_chapters_v" USING btree ("latest");
  CREATE INDEX "sermons_tags_order_idx" ON "sermons_tags" USING btree ("_order");
  CREATE INDEX "sermons_tags_parent_id_idx" ON "sermons_tags" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "sermons_slug_idx" ON "sermons" USING btree ("slug");
  CREATE INDEX "sermons_speaker_idx" ON "sermons" USING btree ("speaker_id");
  CREATE INDEX "sermons_series_idx" ON "sermons" USING btree ("series_id");
  CREATE INDEX "sermons_audio_idx" ON "sermons" USING btree ("audio_id");
  CREATE INDEX "sermons_thumbnail_idx" ON "sermons" USING btree ("thumbnail_id");
  CREATE INDEX "sermons_study_guide_idx" ON "sermons" USING btree ("study_guide_id");
  CREATE INDEX "sermons_updated_at_idx" ON "sermons" USING btree ("updated_at");
  CREATE INDEX "sermons_created_at_idx" ON "sermons" USING btree ("created_at");
  CREATE INDEX "sermons__status_idx" ON "sermons" USING btree ("_status");
  CREATE INDEX "_sermons_v_version_tags_order_idx" ON "_sermons_v_version_tags" USING btree ("_order");
  CREATE INDEX "_sermons_v_version_tags_parent_id_idx" ON "_sermons_v_version_tags" USING btree ("_parent_id");
  CREATE INDEX "_sermons_v_parent_idx" ON "_sermons_v" USING btree ("parent_id");
  CREATE INDEX "_sermons_v_version_version_slug_idx" ON "_sermons_v" USING btree ("version_slug");
  CREATE INDEX "_sermons_v_version_version_speaker_idx" ON "_sermons_v" USING btree ("version_speaker_id");
  CREATE INDEX "_sermons_v_version_version_series_idx" ON "_sermons_v" USING btree ("version_series_id");
  CREATE INDEX "_sermons_v_version_version_audio_idx" ON "_sermons_v" USING btree ("version_audio_id");
  CREATE INDEX "_sermons_v_version_version_thumbnail_idx" ON "_sermons_v" USING btree ("version_thumbnail_id");
  CREATE INDEX "_sermons_v_version_version_study_guide_idx" ON "_sermons_v" USING btree ("version_study_guide_id");
  CREATE INDEX "_sermons_v_version_version_updated_at_idx" ON "_sermons_v" USING btree ("version_updated_at");
  CREATE INDEX "_sermons_v_version_version_created_at_idx" ON "_sermons_v" USING btree ("version_created_at");
  CREATE INDEX "_sermons_v_version_version__status_idx" ON "_sermons_v" USING btree ("version__status");
  CREATE INDEX "_sermons_v_created_at_idx" ON "_sermons_v" USING btree ("created_at");
  CREATE INDEX "_sermons_v_updated_at_idx" ON "_sermons_v" USING btree ("updated_at");
  CREATE INDEX "_sermons_v_latest_idx" ON "_sermons_v" USING btree ("latest");
  CREATE INDEX "outreaches_service_times_order_idx" ON "outreaches_service_times" USING btree ("_order");
  CREATE INDEX "outreaches_service_times_parent_id_idx" ON "outreaches_service_times" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "outreaches_slug_idx" ON "outreaches" USING btree ("slug");
  CREATE INDEX "outreaches_cover_image_idx" ON "outreaches" USING btree ("cover_image_id");
  CREATE INDEX "outreaches_updated_at_idx" ON "outreaches" USING btree ("updated_at");
  CREATE INDEX "outreaches_created_at_idx" ON "outreaches" USING btree ("created_at");
  CREATE INDEX "outreaches__status_idx" ON "outreaches" USING btree ("_status");
  CREATE INDEX "_outreaches_v_version_service_times_order_idx" ON "_outreaches_v_version_service_times" USING btree ("_order");
  CREATE INDEX "_outreaches_v_version_service_times_parent_id_idx" ON "_outreaches_v_version_service_times" USING btree ("_parent_id");
  CREATE INDEX "_outreaches_v_parent_idx" ON "_outreaches_v" USING btree ("parent_id");
  CREATE INDEX "_outreaches_v_version_version_slug_idx" ON "_outreaches_v" USING btree ("version_slug");
  CREATE INDEX "_outreaches_v_version_version_cover_image_idx" ON "_outreaches_v" USING btree ("version_cover_image_id");
  CREATE INDEX "_outreaches_v_version_version_updated_at_idx" ON "_outreaches_v" USING btree ("version_updated_at");
  CREATE INDEX "_outreaches_v_version_version_created_at_idx" ON "_outreaches_v" USING btree ("version_created_at");
  CREATE INDEX "_outreaches_v_version_version__status_idx" ON "_outreaches_v" USING btree ("version__status");
  CREATE INDEX "_outreaches_v_created_at_idx" ON "_outreaches_v" USING btree ("created_at");
  CREATE INDEX "_outreaches_v_updated_at_idx" ON "_outreaches_v" USING btree ("updated_at");
  CREATE INDEX "_outreaches_v_latest_idx" ON "_outreaches_v" USING btree ("latest");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_speakers_id_idx" ON "payload_locked_documents_rels" USING btree ("speakers_id");
  CREATE INDEX "payload_locked_documents_rels_series_id_idx" ON "payload_locked_documents_rels" USING btree ("series_id");
  CREATE INDEX "payload_locked_documents_rels_connects_id_idx" ON "payload_locked_documents_rels" USING btree ("connects_id");
  CREATE INDEX "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_story_chapters_id_idx" ON "payload_locked_documents_rels" USING btree ("story_chapters_id");
  CREATE INDEX "payload_locked_documents_rels_sermons_id_idx" ON "payload_locked_documents_rels" USING btree ("sermons_id");
  CREATE INDEX "payload_locked_documents_rels_outreaches_id_idx" ON "payload_locked_documents_rels" USING btree ("outreaches_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "site_settings_giving_qr_code_idx" ON "site_settings" USING btree ("giving_qr_code_id");
  CREATE INDEX "site_settings_mission_hero_image_idx" ON "site_settings" USING btree ("mission_hero_image_id");
  CREATE INDEX "site_settings_connect_hero_image_idx" ON "site_settings" USING btree ("connect_hero_image_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "speakers" CASCADE;
  DROP TABLE "series" CASCADE;
  DROP TABLE "connects" CASCADE;
  DROP TABLE "_connects_v" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "_pages_v" CASCADE;
  DROP TABLE "announcements" CASCADE;
  DROP TABLE "_announcements_v" CASCADE;
  DROP TABLE "story_chapters" CASCADE;
  DROP TABLE "_story_chapters_v" CASCADE;
  DROP TABLE "sermons_tags" CASCADE;
  DROP TABLE "sermons" CASCADE;
  DROP TABLE "_sermons_v_version_tags" CASCADE;
  DROP TABLE "_sermons_v" CASCADE;
  DROP TABLE "outreaches_service_times" CASCADE;
  DROP TABLE "outreaches" CASCADE;
  DROP TABLE "_outreaches_v_version_service_times" CASCADE;
  DROP TABLE "_outreaches_v" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_connects_category";
  DROP TYPE "public"."enum_connects_status";
  DROP TYPE "public"."enum__connects_v_version_category";
  DROP TYPE "public"."enum__connects_v_version_status";
  DROP TYPE "public"."enum_pages_status";
  DROP TYPE "public"."enum__pages_v_version_status";
  DROP TYPE "public"."enum_announcements_category";
  DROP TYPE "public"."enum_announcements_status";
  DROP TYPE "public"."enum__announcements_v_version_category";
  DROP TYPE "public"."enum__announcements_v_version_status";
  DROP TYPE "public"."enum_story_chapters_chapter_key";
  DROP TYPE "public"."enum_story_chapters_status";
  DROP TYPE "public"."enum__story_chapters_v_version_chapter_key";
  DROP TYPE "public"."enum__story_chapters_v_version_status";
  DROP TYPE "public"."enum_sermons_status";
  DROP TYPE "public"."enum__sermons_v_version_status";
  DROP TYPE "public"."enum_outreaches_branch_type";
  DROP TYPE "public"."enum_outreaches_status";
  DROP TYPE "public"."enum__outreaches_v_version_branch_type";
  DROP TYPE "public"."enum__outreaches_v_version_status";`)
}
