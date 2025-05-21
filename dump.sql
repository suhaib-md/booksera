--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4
-- Dumped by pg_dump version 17.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY "public"."users_userpreferences" DROP CONSTRAINT IF EXISTS "users_userpreferences_user_id_c5a5f271_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."users_userpreference" DROP CONSTRAINT IF EXISTS "users_userpreference_user_id_bdcaa563_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_user_permissions" DROP CONSTRAINT IF EXISTS "users_customuser_use_permission_id_baaa2f74_fk_auth_perm";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_user_permissions" DROP CONSTRAINT IF EXISTS "users_customuser_use_customuser_id_5771478b_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_groups" DROP CONSTRAINT IF EXISTS "users_customuser_groups_group_id_01390b14_fk_auth_group_id";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_groups" DROP CONSTRAINT IF EXISTS "users_customuser_gro_customuser_id_958147bf_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."users_bookshelf" DROP CONSTRAINT IF EXISTS "users_bookshelf_user_id_e1416fa4_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."users_bookcontentanalysis" DROP CONSTRAINT IF EXISTS "users_bookcontentana_book_id_da2b3e53_fk_users_boo";
ALTER TABLE IF EXISTS ONLY "public"."users_abtestoutcome" DROP CONSTRAINT IF EXISTS "users_abtestoutcome_assignment_id_60b92063_fk_users_abt";
ALTER TABLE IF EXISTS ONLY "public"."users_abtestassignment" DROP CONSTRAINT IF EXISTS "users_abtestassignment_user_id_14276196_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_usermediapreference" DROP CONSTRAINT IF EXISTS "media_recommendation_user_id_6004458a_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_movierecommendation" DROP CONSTRAINT IF EXISTS "media_recommendation_user_id_44202f01_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_mediarecommendation" DROP CONSTRAINT IF EXISTS "media_recommendation_user_id_092adc2a_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_mediarecommendation" DROP CONSTRAINT IF EXISTS "media_recommendation_source_book_id_e4e5cc47_fk_users_boo";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_usermediapreference" DROP CONSTRAINT IF EXISTS "media_recommendation_media_recommendation_a69a2d35_fk_media_rec";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_user_id_c564eba6_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_content_type_id_c4bce8eb_fk_django_co";
ALTER TABLE IF EXISTS ONLY "public"."communities_message" DROP CONSTRAINT IF EXISTS "communities_message_sender_id_59027e60_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."communities_message" DROP CONSTRAINT IF EXISTS "communities_message_book_club_id_303f4bd6_fk_communiti";
ALTER TABLE IF EXISTS ONLY "public"."communities_clubmembership" DROP CONSTRAINT IF EXISTS "communities_clubmemb_user_id_b596a290_fk_users_cus";
ALTER TABLE IF EXISTS ONLY "public"."communities_clubmembership" DROP CONSTRAINT IF EXISTS "communities_clubmemb_book_club_id_93f648c8_fk_communiti";
ALTER TABLE IF EXISTS ONLY "public"."communities_bookclub" DROP CONSTRAINT IF EXISTS "communities_bookclub_creator_id_4766529a_fk_users_customuser_id";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_content_type_id_2f476e4b_fk_django_co";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm";
DROP INDEX IF EXISTS "public"."users_userpreference_user_id_bdcaa563";
DROP INDEX IF EXISTS "public"."users_customuser_username_80452fdf_like";
DROP INDEX IF EXISTS "public"."users_customuser_user_permissions_permission_id_baaa2f74";
DROP INDEX IF EXISTS "public"."users_customuser_user_permissions_customuser_id_5771478b";
DROP INDEX IF EXISTS "public"."users_customuser_groups_group_id_01390b14";
DROP INDEX IF EXISTS "public"."users_customuser_groups_customuser_id_958147bf";
DROP INDEX IF EXISTS "public"."users_customuser_email_6445acef_like";
DROP INDEX IF EXISTS "public"."users_bookshelf_user_id_e1416fa4";
DROP INDEX IF EXISTS "public"."users_bookcontentanalysis_book_id_da2b3e53_like";
DROP INDEX IF EXISTS "public"."users_book_book_id_a08627ee_like";
DROP INDEX IF EXISTS "public"."users_abtestoutcome_assignment_id_60b92063";
DROP INDEX IF EXISTS "public"."users_abtestassignment_user_id_14276196";
DROP INDEX IF EXISTS "public"."media_recommendations_usermediapreference_user_id_6004458a";
DROP INDEX IF EXISTS "public"."media_recommendations_user_media_recommendation_id_a69a2d35";
DROP INDEX IF EXISTS "public"."media_recommendations_movierecommendation_user_id_44202f01";
DROP INDEX IF EXISTS "public"."media_recommendations_mediarecommendation_user_id_092adc2a";
DROP INDEX IF EXISTS "public"."media_recommendations_medi_source_book_id_e4e5cc47";
DROP INDEX IF EXISTS "public"."django_site_domain_a2e37b91_like";
DROP INDEX IF EXISTS "public"."django_session_session_key_c0390e0f_like";
DROP INDEX IF EXISTS "public"."django_session_expire_date_a5c62663";
DROP INDEX IF EXISTS "public"."django_cache_table_expires";
DROP INDEX IF EXISTS "public"."django_admin_log_user_id_c564eba6";
DROP INDEX IF EXISTS "public"."django_admin_log_content_type_id_c4bce8eb";
DROP INDEX IF EXISTS "public"."communities_message_sender_id_59027e60";
DROP INDEX IF EXISTS "public"."communities_message_book_club_id_303f4bd6";
DROP INDEX IF EXISTS "public"."communities_clubmembership_user_id_b596a290";
DROP INDEX IF EXISTS "public"."communities_clubmembership_book_club_id_93f648c8";
DROP INDEX IF EXISTS "public"."communities_bookclub_creator_id_4766529a";
DROP INDEX IF EXISTS "public"."auth_permission_content_type_id_2f476e4b";
DROP INDEX IF EXISTS "public"."auth_group_permissions_permission_id_84c5c92e";
DROP INDEX IF EXISTS "public"."auth_group_permissions_group_id_b120cbf9";
DROP INDEX IF EXISTS "public"."auth_group_name_a6ea08ec_like";
ALTER TABLE IF EXISTS ONLY "public"."users_userpreferences" DROP CONSTRAINT IF EXISTS "users_userpreferences_user_id_key";
ALTER TABLE IF EXISTS ONLY "public"."users_userpreferences" DROP CONSTRAINT IF EXISTS "users_userpreferences_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_userpreference" DROP CONSTRAINT IF EXISTS "users_userpreference_user_id_media_id_media_type_916749eb_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_userpreference" DROP CONSTRAINT IF EXISTS "users_userpreference_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser" DROP CONSTRAINT IF EXISTS "users_customuser_username_key";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_user_permissions" DROP CONSTRAINT IF EXISTS "users_customuser_user_permissions_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_user_permissions" DROP CONSTRAINT IF EXISTS "users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser" DROP CONSTRAINT IF EXISTS "users_customuser_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_groups" DROP CONSTRAINT IF EXISTS "users_customuser_groups_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser_groups" DROP CONSTRAINT IF EXISTS "users_customuser_groups_customuser_id_group_id_76b619e3_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_customuser" DROP CONSTRAINT IF EXISTS "users_customuser_email_key";
ALTER TABLE IF EXISTS ONLY "public"."users_bookshelf" DROP CONSTRAINT IF EXISTS "users_bookshelf_user_id_book_id_e1a96a61_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_bookshelf" DROP CONSTRAINT IF EXISTS "users_bookshelf_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_bookcontentanalysis" DROP CONSTRAINT IF EXISTS "users_bookcontentanalysis_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_bookcontentanalysis" DROP CONSTRAINT IF EXISTS "users_bookcontentanalysis_book_id_key";
ALTER TABLE IF EXISTS ONLY "public"."users_book" DROP CONSTRAINT IF EXISTS "users_book_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_abtestoutcome" DROP CONSTRAINT IF EXISTS "users_abtestoutcome_pkey";
ALTER TABLE IF EXISTS ONLY "public"."users_abtestassignment" DROP CONSTRAINT IF EXISTS "users_abtestassignment_user_id_test_name_b00d507c_uniq";
ALTER TABLE IF EXISTS ONLY "public"."users_abtestassignment" DROP CONSTRAINT IF EXISTS "users_abtestassignment_pkey";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_usermediapreference" DROP CONSTRAINT IF EXISTS "media_recommendations_usermediapreference_pkey";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_usermediapreference" DROP CONSTRAINT IF EXISTS "media_recommendations_us_user_id_media_recommenda_0e1455b1_uniq";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_movierecommendation" DROP CONSTRAINT IF EXISTS "media_recommendations_movierecommendation_pkey";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_movierecommendation" DROP CONSTRAINT IF EXISTS "media_recommendations_mo_user_id_book_id_movie_id_ac1cc1df_uniq";
ALTER TABLE IF EXISTS ONLY "public"."media_recommendations_mediarecommendation" DROP CONSTRAINT IF EXISTS "media_recommendations_mediarecommendation_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_site" DROP CONSTRAINT IF EXISTS "django_site_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_site" DROP CONSTRAINT IF EXISTS "django_site_domain_a2e37b91_uniq";
ALTER TABLE IF EXISTS ONLY "public"."django_session" DROP CONSTRAINT IF EXISTS "django_session_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_migrations" DROP CONSTRAINT IF EXISTS "django_migrations_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_content_type" DROP CONSTRAINT IF EXISTS "django_content_type_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_content_type" DROP CONSTRAINT IF EXISTS "django_content_type_app_label_model_76bd3d3b_uniq";
ALTER TABLE IF EXISTS ONLY "public"."django_cache_table" DROP CONSTRAINT IF EXISTS "django_cache_table_pkey";
ALTER TABLE IF EXISTS ONLY "public"."django_admin_log" DROP CONSTRAINT IF EXISTS "django_admin_log_pkey";
ALTER TABLE IF EXISTS ONLY "public"."communities_message" DROP CONSTRAINT IF EXISTS "communities_message_pkey";
ALTER TABLE IF EXISTS ONLY "public"."communities_clubmembership" DROP CONSTRAINT IF EXISTS "communities_clubmembership_user_id_book_club_id_a8658c9c_uniq";
ALTER TABLE IF EXISTS ONLY "public"."communities_clubmembership" DROP CONSTRAINT IF EXISTS "communities_clubmembership_pkey";
ALTER TABLE IF EXISTS ONLY "public"."communities_bookclub" DROP CONSTRAINT IF EXISTS "communities_bookclub_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_permission" DROP CONSTRAINT IF EXISTS "auth_permission_content_type_id_codename_01ab375a_uniq";
ALTER TABLE IF EXISTS ONLY "public"."auth_group" DROP CONSTRAINT IF EXISTS "auth_group_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_pkey";
ALTER TABLE IF EXISTS ONLY "public"."auth_group_permissions" DROP CONSTRAINT IF EXISTS "auth_group_permissions_group_id_permission_id_0cd325b0_uniq";
ALTER TABLE IF EXISTS ONLY "public"."auth_group" DROP CONSTRAINT IF EXISTS "auth_group_name_key";
DROP TABLE IF EXISTS "public"."users_userpreferences";
DROP TABLE IF EXISTS "public"."users_userpreference";
DROP TABLE IF EXISTS "public"."users_customuser_user_permissions";
DROP TABLE IF EXISTS "public"."users_customuser_groups";
DROP TABLE IF EXISTS "public"."users_customuser";
DROP TABLE IF EXISTS "public"."users_bookshelf";
DROP TABLE IF EXISTS "public"."users_bookcontentanalysis";
DROP TABLE IF EXISTS "public"."users_book";
DROP TABLE IF EXISTS "public"."users_abtestoutcome";
DROP TABLE IF EXISTS "public"."users_abtestassignment";
DROP TABLE IF EXISTS "public"."media_recommendations_usermediapreference";
DROP TABLE IF EXISTS "public"."media_recommendations_movierecommendation";
DROP TABLE IF EXISTS "public"."media_recommendations_mediarecommendation";
DROP TABLE IF EXISTS "public"."django_site";
DROP TABLE IF EXISTS "public"."django_session";
DROP TABLE IF EXISTS "public"."django_migrations";
DROP TABLE IF EXISTS "public"."django_content_type";
DROP TABLE IF EXISTS "public"."django_cache_table";
DROP TABLE IF EXISTS "public"."django_admin_log";
DROP TABLE IF EXISTS "public"."communities_message";
DROP TABLE IF EXISTS "public"."communities_clubmembership";
DROP TABLE IF EXISTS "public"."communities_bookclub";
DROP TABLE IF EXISTS "public"."auth_permission";
DROP TABLE IF EXISTS "public"."auth_group_permissions";
DROP TABLE IF EXISTS "public"."auth_group";
--
-- Name: SCHEMA "public"; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA "public" IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = "heap";

--
-- Name: auth_group; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_group" (
    "id" integer NOT NULL,
    "name" character varying(150) NOT NULL
);


--
-- Name: auth_group_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_group" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_group_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_group_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_group_permissions" (
    "id" bigint NOT NULL,
    "group_id" integer NOT NULL,
    "permission_id" integer NOT NULL
);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_group_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_group_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: auth_permission; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."auth_permission" (
    "id" integer NOT NULL,
    "name" character varying(255) NOT NULL,
    "content_type_id" integer NOT NULL,
    "codename" character varying(100) NOT NULL
);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."auth_permission" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."auth_permission_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: communities_bookclub; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."communities_bookclub" (
    "id" bigint NOT NULL,
    "name" character varying(100) NOT NULL,
    "description" "text" NOT NULL,
    "category" character varying(20) NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "image" "text",
    "current_book" character varying(255),
    "current_book_id" character varying(100),
    "current_book_image" "text",
    "creator_id" bigint NOT NULL
);


--
-- Name: communities_bookclub_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."communities_bookclub" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."communities_bookclub_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: communities_clubmembership; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."communities_clubmembership" (
    "id" bigint NOT NULL,
    "role" character varying(10) NOT NULL,
    "joined_at" timestamp with time zone NOT NULL,
    "book_club_id" bigint NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: communities_clubmembership_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."communities_clubmembership" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."communities_clubmembership_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: communities_message; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."communities_message" (
    "id" bigint NOT NULL,
    "content" "text" NOT NULL,
    "timestamp" timestamp with time zone NOT NULL,
    "book_club_id" bigint NOT NULL,
    "sender_id" bigint NOT NULL
);


--
-- Name: communities_message_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."communities_message" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."communities_message_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_admin_log; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_admin_log" (
    "id" integer NOT NULL,
    "action_time" timestamp with time zone NOT NULL,
    "object_id" "text",
    "object_repr" character varying(200) NOT NULL,
    "action_flag" smallint NOT NULL,
    "change_message" "text" NOT NULL,
    "content_type_id" integer,
    "user_id" bigint NOT NULL,
    CONSTRAINT "django_admin_log_action_flag_check" CHECK (("action_flag" >= 0))
);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_admin_log" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_admin_log_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_cache_table; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_cache_table" (
    "cache_key" character varying(255) NOT NULL,
    "value" "text" NOT NULL,
    "expires" timestamp with time zone NOT NULL
);


--
-- Name: django_content_type; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_content_type" (
    "id" integer NOT NULL,
    "app_label" character varying(100) NOT NULL,
    "model" character varying(100) NOT NULL
);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_content_type" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_content_type_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_migrations; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_migrations" (
    "id" bigint NOT NULL,
    "app" character varying(255) NOT NULL,
    "name" character varying(255) NOT NULL,
    "applied" timestamp with time zone NOT NULL
);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_migrations" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_migrations_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: django_session; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_session" (
    "session_key" character varying(40) NOT NULL,
    "session_data" "text" NOT NULL,
    "expire_date" timestamp with time zone NOT NULL
);


--
-- Name: django_site; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."django_site" (
    "id" integer NOT NULL,
    "domain" character varying(100) NOT NULL,
    "name" character varying(50) NOT NULL
);


--
-- Name: django_site_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."django_site" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."django_site_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_recommendations_mediarecommendation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."media_recommendations_mediarecommendation" (
    "id" bigint NOT NULL,
    "tmdb_id" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "media_type" character varying(20) NOT NULL,
    "overview" "text" NOT NULL,
    "poster_path" character varying(255),
    "release_date" "date",
    "similarity_score" double precision NOT NULL,
    "ai_explanation" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "source_book_id" bigint NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: media_recommendations_mediarecommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."media_recommendations_mediarecommendation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."media_recommendations_mediarecommendation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_recommendations_movierecommendation; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."media_recommendations_movierecommendation" (
    "id" bigint NOT NULL,
    "book_id" character varying(100) NOT NULL,
    "book_title" character varying(255) NOT NULL,
    "movie_id" character varying(100) NOT NULL,
    "movie_title" character varying(255) NOT NULL,
    "movie_poster" character varying(1000),
    "movie_overview" "text",
    "movie_release_date" character varying(20),
    "relevance_score" double precision NOT NULL,
    "recommendation_reason" "text",
    "created_at" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: media_recommendations_movierecommendation_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."media_recommendations_movierecommendation" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."media_recommendations_movierecommendation_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: media_recommendations_usermediapreference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."media_recommendations_usermediapreference" (
    "id" bigint NOT NULL,
    "is_interested" boolean NOT NULL,
    "watched" boolean NOT NULL,
    "rating" integer,
    "feedback" "text" NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "media_recommendation_id" bigint NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: media_recommendations_usermediapreference_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."media_recommendations_usermediapreference" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."media_recommendations_usermediapreference_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_abtestassignment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_abtestassignment" (
    "id" bigint NOT NULL,
    "test_name" character varying(100) NOT NULL,
    "variant" character varying(100) NOT NULL,
    "assigned_at" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: users_abtestassignment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_abtestassignment" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_abtestassignment_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_abtestoutcome; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_abtestoutcome" (
    "id" bigint NOT NULL,
    "outcome_value" double precision NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "assignment_id" bigint NOT NULL
);


--
-- Name: users_abtestoutcome_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_abtestoutcome" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_abtestoutcome_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_book; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_book" (
    "book_id" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "author" character varying(255),
    "description" "text",
    "cover_url" character varying(500),
    "isbn" character varying(20),
    "published_year" integer,
    "genres" "jsonb" NOT NULL
);


--
-- Name: users_bookcontentanalysis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_bookcontentanalysis" (
    "id" bigint NOT NULL,
    "keywords" "jsonb" NOT NULL,
    "mood" "jsonb" NOT NULL,
    "analyzed_at" timestamp with time zone NOT NULL,
    "book_id" character varying(100) NOT NULL,
    "themes" "jsonb" NOT NULL
);


--
-- Name: users_bookcontentanalysis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_bookcontentanalysis" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_bookcontentanalysis_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_bookshelf; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_bookshelf" (
    "id" bigint NOT NULL,
    "book_id" character varying(100) NOT NULL,
    "title" character varying(255) NOT NULL,
    "authors" character varying(255),
    "image" character varying(1000),
    "status" character varying(10) NOT NULL,
    "added_date" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL,
    "page_count" integer,
    "user_rating" numeric(3,1) NOT NULL,
    "categories" "jsonb" NOT NULL,
    "description" "text"
);


--
-- Name: users_bookshelf_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_bookshelf" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_bookshelf_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_customuser; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_customuser" (
    "id" bigint NOT NULL,
    "password" character varying(128) NOT NULL,
    "last_login" timestamp with time zone,
    "is_superuser" boolean NOT NULL,
    "first_name" character varying(150) NOT NULL,
    "last_name" character varying(150) NOT NULL,
    "is_staff" boolean NOT NULL,
    "is_active" boolean NOT NULL,
    "email" character varying(254) NOT NULL,
    "username" character varying(150) NOT NULL,
    "date_joined" timestamp with time zone NOT NULL,
    "bio" "text",
    "books_read" "jsonb" NOT NULL,
    "favorite_authors" character varying(255),
    "favorite_genres" character varying(255),
    "profile_picture" character varying(100),
    "reading_goal_completed" integer NOT NULL,
    "reading_goal_target" integer NOT NULL,
    "reading_goal_year" integer NOT NULL
);


--
-- Name: users_customuser_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_customuser_groups" (
    "id" bigint NOT NULL,
    "customuser_id" bigint NOT NULL,
    "group_id" integer NOT NULL
);


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_customuser_groups" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_customuser_groups_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_customuser_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_customuser" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_customuser_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_customuser_user_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_customuser_user_permissions" (
    "id" bigint NOT NULL,
    "customuser_id" bigint NOT NULL,
    "permission_id" integer NOT NULL
);


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_customuser_user_permissions" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_customuser_user_permissions_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_userpreference; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_userpreference" (
    "id" bigint NOT NULL,
    "media_id" integer NOT NULL,
    "media_type" character varying(10) NOT NULL,
    "rating" integer,
    "liked" boolean,
    "clicked" boolean NOT NULL,
    "ignored" boolean NOT NULL,
    "created_at" timestamp with time zone NOT NULL,
    "updated_at" timestamp with time zone NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: users_userpreference_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_userpreference" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_userpreference_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: users_userpreferences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE "public"."users_userpreferences" (
    "id" bigint NOT NULL,
    "favorite_genres" "text",
    "favorite_authors" "text",
    "books_read" "jsonb" NOT NULL,
    "user_id" bigint NOT NULL
);


--
-- Name: users_userpreferences_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE "public"."users_userpreferences" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."users_userpreferences_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Data for Name: auth_group; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_group" ("id", "name") FROM stdin;
\.


--
-- Data for Name: auth_group_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_group_permissions" ("id", "group_id", "permission_id") FROM stdin;
\.


--
-- Data for Name: auth_permission; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."auth_permission" ("id", "name", "content_type_id", "codename") FROM stdin;
1	Can add log entry	1	add_logentry
2	Can change log entry	1	change_logentry
3	Can delete log entry	1	delete_logentry
4	Can view log entry	1	view_logentry
5	Can add permission	2	add_permission
6	Can change permission	2	change_permission
7	Can delete permission	2	delete_permission
8	Can view permission	2	view_permission
9	Can add group	3	add_group
10	Can change group	3	change_group
11	Can delete group	3	delete_group
12	Can view group	3	view_group
13	Can add content type	4	add_contenttype
14	Can change content type	4	change_contenttype
15	Can delete content type	4	delete_contenttype
16	Can view content type	4	view_contenttype
17	Can add session	5	add_session
18	Can change session	5	change_session
19	Can delete session	5	delete_session
20	Can view session	5	view_session
21	Can add site	6	add_site
22	Can change site	6	change_site
23	Can delete site	6	delete_site
24	Can view site	6	view_site
25	Can add user	7	add_customuser
26	Can change user	7	change_customuser
27	Can delete user	7	delete_customuser
28	Can view user	7	view_customuser
29	Can add user preferences	8	add_userpreferences
30	Can change user preferences	8	change_userpreferences
31	Can delete user preferences	8	delete_userpreferences
32	Can view user preferences	8	view_userpreferences
33	Can add bookshelf	9	add_bookshelf
34	Can change bookshelf	9	change_bookshelf
35	Can delete bookshelf	9	delete_bookshelf
36	Can view bookshelf	9	view_bookshelf
37	Can add club membership	10	add_clubmembership
38	Can change club membership	10	change_clubmembership
39	Can delete club membership	10	delete_clubmembership
40	Can view club membership	10	view_clubmembership
41	Can add message	11	add_message
42	Can change message	11	change_message
43	Can delete message	11	delete_message
44	Can view message	11	view_message
45	Can add book club	12	add_bookclub
46	Can change book club	12	change_bookclub
47	Can delete book club	12	delete_bookclub
48	Can view book club	12	view_bookclub
49	Can add media recommendation	13	add_mediarecommendation
50	Can change media recommendation	13	change_mediarecommendation
51	Can delete media recommendation	13	delete_mediarecommendation
52	Can view media recommendation	13	view_mediarecommendation
53	Can add user media preference	14	add_usermediapreference
54	Can change user media preference	14	change_usermediapreference
55	Can delete user media preference	14	delete_usermediapreference
56	Can view user media preference	14	view_usermediapreference
57	Can add media recommendation	15	add_mediarecommendation
58	Can change media recommendation	15	change_mediarecommendation
59	Can delete media recommendation	15	delete_mediarecommendation
60	Can view media recommendation	15	view_mediarecommendation
61	Can add book	16	add_book
62	Can change book	16	change_book
63	Can delete book	16	delete_book
64	Can view book	16	view_book
65	Can add user preference	17	add_userpreference
66	Can change user preference	17	change_userpreference
67	Can delete user preference	17	delete_userpreference
68	Can view user preference	17	view_userpreference
69	Can add ab test outcome	18	add_abtestoutcome
70	Can change ab test outcome	18	change_abtestoutcome
71	Can delete ab test outcome	18	delete_abtestoutcome
72	Can view ab test outcome	18	view_abtestoutcome
73	Can add ab test assignment	19	add_abtestassignment
74	Can change ab test assignment	19	change_abtestassignment
75	Can delete ab test assignment	19	delete_abtestassignment
76	Can view ab test assignment	19	view_abtestassignment
77	Can add book content analysis	20	add_bookcontentanalysis
78	Can change book content analysis	20	change_bookcontentanalysis
79	Can delete book content analysis	20	delete_bookcontentanalysis
80	Can view book content analysis	20	view_bookcontentanalysis
81	Can add movie recommendation	21	add_movierecommendation
82	Can change movie recommendation	21	change_movierecommendation
83	Can delete movie recommendation	21	delete_movierecommendation
84	Can view movie recommendation	21	view_movierecommendation
\.


--
-- Data for Name: communities_bookclub; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."communities_bookclub" ("id", "name", "description", "category", "created_at", "image", "current_book", "current_book_id", "current_book_image", "creator_id") FROM stdin;
1	Potterheads	Harry Potter Book Club	fantasy	2025-03-16 17:25:51.168697+05:30		\N	\N	\N	5
2	Reachers	Jack Reacher Fanclub	thriller	2025-03-16 17:32:22.130738+05:30	data:image/jpeg;base64,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	\N	\N	\N	5
3	Narnians	Chronicles of Narnia fanclub	fantasy	2025-03-17 14:11:56.572652+05:30	https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5KrvEuwnGajKpFnNGMJ4x0vCMFK0wbHs9Rg&s	\N	\N	\N	5
4	Shakespeare society	Shakespeares society	classics	2025-03-20 23:04:07.550923+05:30	data:image/jpeg;base64,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	\N	\N	\N	5
5	Poetry Club	Poetry discussions	poetry	2025-03-21 00:29:04.598566+05:30	data:image/png;base64,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	\N	\N	\N	5
6	The Starks	Game of Thrones Fan Club	fantasy	2025-04-23 00:24:09.050546+05:30	data:image/jpeg;base64,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	\N	\N	\N	5
\.


--
-- Data for Name: communities_clubmembership; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."communities_clubmembership" ("id", "role", "joined_at", "book_club_id", "user_id") FROM stdin;
1	admin	2025-03-16 17:25:51.180088+05:30	1	5
2	admin	2025-03-16 17:32:22.134746+05:30	2	5
4	admin	2025-03-17 14:11:56.574651+05:30	3	5
5	member	2025-03-18 15:56:57.927098+05:30	1	12
6	admin	2025-03-20 23:04:07.563676+05:30	4	5
7	admin	2025-03-21 00:29:04.612043+05:30	5	5
8	member	2025-03-21 14:33:01.617491+05:30	4	7
9	member	2025-03-23 13:03:21.400717+05:30	1	13
10	member	2025-03-24 07:30:47.56147+05:30	1	14
11	member	2025-03-24 08:27:05.679443+05:30	2	15
12	admin	2025-04-23 00:24:09.057445+05:30	6	5
13	member	2025-04-23 08:49:13.386834+05:30	6	17
\.


--
-- Data for Name: communities_message; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."communities_message" ("id", "content", "timestamp", "book_club_id", "sender_id") FROM stdin;
1	Hello	2025-03-16 17:26:11.94373+05:30	1	5
2	Hi suhaib	2025-03-16 17:33:09.364688+05:30	1	7
3	Are you a potterhead too?	2025-03-16 17:33:25.186591+05:30	1	7
4	welcome bro	2025-03-17 14:10:58.124812+05:30	1	5
5	hello	2025-03-18 15:57:17.690345+05:30	1	12
6	welcome to the club	2025-03-21 00:36:55.540581+05:30	1	5
7	hello	2025-03-21 21:57:29.550661+05:30	1	5
8	Hello	2025-03-24 07:30:53.499685+05:30	1	14
9	hi	2025-03-24 08:27:15.998373+05:30	2	15
10	hello today we have third review	2025-04-15 08:26:01.463419+05:30	1	5
11	Hello Are we ready for viva tomorrow?	2025-04-23 00:22:18.879232+05:30	1	5
12	Hello....Winterfell is my favourite location in game of thrones	2025-04-23 00:24:53.582965+05:30	6	5
13	hello	2025-04-23 08:49:24.089743+05:30	6	17
\.


--
-- Data for Name: django_admin_log; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_admin_log" ("id", "action_time", "object_id", "object_repr", "action_flag", "change_message", "content_type_id", "user_id") FROM stdin;
\.


--
-- Data for Name: django_cache_table; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_cache_table" ("cache_key", "value", "expires") FROM stdin;
:1:summary_bart_8240155658665448034_150_40	gAWVJAEAAAAAAABYHQEAAFRoZSBDYXRjaGVyIGluIHRoZSBSeWUsJnF1b3Q7IHdyaXR0ZW4gYnkgSi5ELiBTYWxpbmdlciBhbmQgcHVibGlzaGVkIGluIDE5NTEsIGlzIGEgY2xhc3NpYyBBbWVyaWNhbiBub3ZlbCB0aGF0IGV4cGxvcmVzIHRoZSB0aGVtZXMgb2YgYWRvbGVzY2VuY2UsIGFsaWVuYXRpb24sIGFuZCBpZGVudGl0eS4gVGhlIG5vdmVsIGlzIHNldCBpbiB0aGUgMTk1MHMgYW5kIGZvbGxvd3MgSG9sZGVuLCBhIDE2LXllYXItb2xkIHdobyBoYXMganVzdCBiZWVuIGV4cGVsbGVkIGZyb20gaGlzIHByZXAgc2Nob29sLpQu	2025-03-17 06:20:04+05:30
:1:book_summary_ScdAEQAAQBAJ_bart_150_40	gAWVJAEAAAAAAABYHQEAAFRoZSBDYXRjaGVyIGluIHRoZSBSeWUsJnF1b3Q7IHdyaXR0ZW4gYnkgSi5ELiBTYWxpbmdlciBhbmQgcHVibGlzaGVkIGluIDE5NTEsIGlzIGEgY2xhc3NpYyBBbWVyaWNhbiBub3ZlbCB0aGF0IGV4cGxvcmVzIHRoZSB0aGVtZXMgb2YgYWRvbGVzY2VuY2UsIGFsaWVuYXRpb24sIGFuZCBpZGVudGl0eS4gVGhlIG5vdmVsIGlzIHNldCBpbiB0aGUgMTk1MHMgYW5kIGZvbGxvd3MgSG9sZGVuLCBhIDE2LXllYXItb2xkIHdobyBoYXMganVzdCBiZWVuIGV4cGVsbGVkIGZyb20gaGlzIHByZXAgc2Nob29sLpQu	2025-03-23 06:20:04+05:30
:1:summary_bart_8240155658665448034_150_80	gAWVxgEAAAAAAABYvwEAAFRoZSBDYXRjaGVyIGluIHRoZSBSeWUsJnF1b3Q7IHdyaXR0ZW4gYnkgSi5ELiBTYWxpbmdlciBhbmQgcHVibGlzaGVkIGluIDE5NTEsIGlzIGEgY2xhc3NpYyBBbWVyaWNhbiBub3ZlbC4gSXQgZXhwbG9yZXMgdGhlIHRoZW1lcyBvZiBhZG9sZXNjZW5jZSwgYWxpZW5hdGlvbiwgYW5kIGlkZW50aXR5IHRocm91Z2ggdGhlIGV5ZXMgb2YgaXRzIHByb3RhZ29uaXN0LCBIb2xkZW4gQ2F1bGZpZWxkLiBUaGUgbm92ZWwgaXMgc2V0IGluIHRoZSAxOTUwcyBhbmQgZm9sbG93cyBIb2xkZW4sIGEgMTYteWVhci1vbGQgd2hvIGhhcyBqdXN0IGJlZW4gZXhwZWxsZWQgZnJvbSBoaXMgcHJlcCBzY2hvb2wsIFBlbmNleSBQcmVwLiBJdCBlbmRzIHdpdGggSG9sZGVuIGluIGEgbWVudGFsIGluc3RpdHV0aW9uLCB3aGVyZSBoZSBpcyBiZWluZyB0cmVhdGVkIGZvciBhIG5lcnZvdXMgYnJlYWtkb3duLpQu	2025-03-17 06:26:43+05:30
:1:summary_bart_7579362806234959270_150_40	gAWV4AAAAAAAAACM3DEyLXllYXItb2xkIEFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bC4gSGUncyBmYWlsZWQgdG8gZG8gc28gdGhyb3VnaCBhY2FkZW1pYSBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUgYW5udWFsIGtpdGUgZmlnaHRpbmcgdG91cm5hbWVudC6ULg==	2025-03-17 06:27:34+05:30
:1:summary_bart_7579362806234959270_150_65	gAWVPAEAAAAAAABYNQEAADEyLXllYXItb2xkIEFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bC4gSGUncyBmYWlsZWQgdG8gZG8gc28gdGhyb3VnaCBhY2FkZW1pYSBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUgYW5udWFsIGtpdGUgZmlnaHRpbmcgdG91cm5hbWVudC4gQW1pcidzIGZhdGhlciBpcyBvbmUgb2YgQWZnaGFuaXN0YW4ncyByaWNoZXN0IG1lcmNoYW50cy4gSGUgaXMgYWxzbyBhIGtlZW4ga2l0ZSBmaWdodGVyLpQu	2025-03-17 06:27:57+05:30
:1:summary_bart_-916082498216879436_150_40	gAWVwQAAAAAAAACMvUFTIExPTkcgQVMgVEhFIExFTU9OIFRSRUVTIEdST1cgaXMgYW4gZXBpYywgZW1vdGlvbmFsLCBicmVhdGh0YWtpbmcgc3Rvcnkgb2YgbG92ZSBhbmQgbG9zcyBzZXQgYW1pZCB0aGUgU3lyaWFuIHJldm9sdXRpb24uIFNob3J0bGlzdGVkIGZvciB0aGUgQlJJVElTSCBCT09LIEFXQVJEUyBESVNDT1ZFUiBCT09LIE9GIFRIRSBZRUFSLpQu	2025-03-17 06:29:06+05:30
:1:book_summary_11mHEAAAQBAJ_bart_150_40	gAWVwQAAAAAAAACMvUFTIExPTkcgQVMgVEhFIExFTU9OIFRSRUVTIEdST1cgaXMgYW4gZXBpYywgZW1vdGlvbmFsLCBicmVhdGh0YWtpbmcgc3Rvcnkgb2YgbG92ZSBhbmQgbG9zcyBzZXQgYW1pZCB0aGUgU3lyaWFuIHJldm9sdXRpb24uIFNob3J0bGlzdGVkIGZvciB0aGUgQlJJVElTSCBCT09LIEFXQVJEUyBESVNDT1ZFUiBCT09LIE9GIFRIRSBZRUFSLpQu	2025-03-23 06:29:06+05:30
:1:summary_bart_-916082498216879436_150_70	gAWVYgEAAAAAAABYWwEAAEFTIExPTkcgQVMgVEhFIExFTU9OIFRSRUVTIEdST1cgaXMgYW4gZXBpYywgZW1vdGlvbmFsLCBicmVhdGh0YWtpbmcgc3Rvcnkgb2YgbG92ZSBhbmQgbG9zcyBzZXQgYW1pZCB0aGUgU3lyaWFuIHJldm9sdXRpb24uIFRoZSBib29rIHdhcyBzaG9ydGxpc3RlZCBmb3IgdGhlIEJSSVRJU0ggQk9PSyBBV0FSRFMgRElTQ09WRVIgQk9PSyBPRiBUSEUgWUVBUi4gU2FsYW1hIEthc3NhYiB3YXMgYSBwaGFybWFjeSBzdHVkZW50IHdoZW4gdGhlIGNyaWVzIGZvciBmcmVlZG9tIGJyb2tlIG91dCBpbiBTeXJpYS4gU2hlIHdhcyBzdXBwb3NlZCB0byBiZSBtZWV0aW5nIGEgYm95IHRvIHRhbGsgYWJvdXQgbWFycmlhZ2UulC4=	2025-03-17 06:29:24+05:30
:1:summary_bart_-7275674051703199457_150_40	gAWVAgEAAAAAAACM/uKAnERhcmsgTWF0dGVy4oCdIGlzIGEg4oCcbWluZC1ibG93aW5n4oCdIHNwZWN1bGF0aXZlIHRocmlsbGVyIGFib3V0IGFuIG9yZGluYXJ5IG1hbiB3aG8gYXdha2VucyBpbiBhIHdvcmxkIGluZXhwbGljYWJseSBkaWZmZXJlbnQgZnJvbSB0aGUgcmVhbGl0eSBoZSB0aG91Z2h0IGhlIGtuZXcuIEF1dGhvciBCbGFrZSBDcm91Y2ggaXMgdGhlIGF1dGhvciBvZiB0aGUgV2F5d2FyZCBQaW5lcyB0cmlsb2d5IGFuZCB0aGUgVXBncmFkZSBzZXJpZXMulC4=	2025-03-17 06:30:39+05:30
:1:book_summary_85nrCgAAQBAJ_bart_150_40	gAWVAgEAAAAAAACM/uKAnERhcmsgTWF0dGVy4oCdIGlzIGEg4oCcbWluZC1ibG93aW5n4oCdIHNwZWN1bGF0aXZlIHRocmlsbGVyIGFib3V0IGFuIG9yZGluYXJ5IG1hbiB3aG8gYXdha2VucyBpbiBhIHdvcmxkIGluZXhwbGljYWJseSBkaWZmZXJlbnQgZnJvbSB0aGUgcmVhbGl0eSBoZSB0aG91Z2h0IGhlIGtuZXcuIEF1dGhvciBCbGFrZSBDcm91Y2ggaXMgdGhlIGF1dGhvciBvZiB0aGUgV2F5d2FyZCBQaW5lcyB0cmlsb2d5IGFuZCB0aGUgVXBncmFkZSBzZXJpZXMulC4=	2025-03-23 06:30:39+05:30
:1:summary_bart_-7275674051703199457_300_100	gAWV1wEAAAAAAABY0AEAAOKAnERhcmsgTWF0dGVy4oCdIGlzIGEg4oCcbWluZC1ibG93aW5n4oCdIHNwZWN1bGF0aXZlIHRocmlsbGVyIGFib3V0IGFuIG9yZGluYXJ5IG1hbiB3aG8gYXdha2VucyBpbiBhIHdvcmxkIGluZXhwbGljYWJseSBkaWZmZXJlbnQgZnJvbSB0aGUgcmVhbGl0eSBoZSB0aG91Z2h0IGhlIGtuZXcuIEF1dGhvciBCbGFrZSBDcm91Y2ggaXMgdGhlIGF1dGhvciBvZiBVcGdyYWRlLCBSZWN1cnNpb24sIGFuZCB0aGUgV2F5d2FyZCBQaW5lcyB0cmlsb2d5LiDigJxBcmUgeW91IGhhcHB5IHdpdGggeW91ciBsaWZlP+KAnSBhcmUgdGhlIGxhc3Qgd29yZHMgSmFzb24gRGVzc2VuIGhlYXJzIGJlZm9yZSB0aGUga2lkbmFwcGVyIGtub2NrcyBoaW0gdW5jb25zY2lvdXMuIEhlIGF3YWtlbnMgdG8gZmluZCBoaW1zZWxmIHN0cmFwcGVkIHRvIGEgZ3VybmV5LCBzdXJyb3VuZGVkIGJ5IHN0cmFuZ2VycyBpbiBoYXptYXQgc3VpdHMulC4=	2025-03-17 06:31:20+05:30
:1:summary_bart_-4588620976378622604_150_40	gAWVCQEAAAAAAABYAgEAAFdvcmxkLXJlbm93bmVkIGhhYml0cyBleHBlcnQgSmFtZXMgQ2xlYXIgaGFzIGRpc2NvdmVyZWQgYW5vdGhlciB3YXkuIEhlIGtub3dzIHRoYXQgcmVhbCBjaGFuZ2UgY29tZXMgZnJvbSB0aGUgY29tcG91bmQgZWZmZWN0IG9mIGh1bmRyZWRzIG9mIHNtYWxsIGRlY2lzaW9ucy4gVGhlc2UgaW5jbHVkZSBkb2luZyB0d28gcHVzaC11cHMgYSBkYXksIHdha2luZyB1cCBmaXZlIG1pbnV0ZXMgZWFybHksIG9yIGhvbGRpbmcgYSBzaG9ydCBwaG9uZSBjYWxsLpQu	2025-03-17 06:35:42+05:30
:1:book_summary_fFCjDQAAQBAJ_bart_150_40	gAWVCQEAAAAAAABYAgEAAFdvcmxkLXJlbm93bmVkIGhhYml0cyBleHBlcnQgSmFtZXMgQ2xlYXIgaGFzIGRpc2NvdmVyZWQgYW5vdGhlciB3YXkuIEhlIGtub3dzIHRoYXQgcmVhbCBjaGFuZ2UgY29tZXMgZnJvbSB0aGUgY29tcG91bmQgZWZmZWN0IG9mIGh1bmRyZWRzIG9mIHNtYWxsIGRlY2lzaW9ucy4gVGhlc2UgaW5jbHVkZSBkb2luZyB0d28gcHVzaC11cHMgYSBkYXksIHdha2luZyB1cCBmaXZlIG1pbnV0ZXMgZWFybHksIG9yIGhvbGRpbmcgYSBzaG9ydCBwaG9uZSBjYWxsLpQu	2025-03-23 06:35:42+05:30
:1:summary_bart_-4588620976378622604_300_100	gAWVOAIAAAAAAABYMQIAAFdvcmxkLXJlbm93bmVkIGhhYml0cyBleHBlcnQgSmFtZXMgQ2xlYXIgaGFzIGRpc2NvdmVyZWQgYW5vdGhlciB3YXkuIEhlIGtub3dzIHRoYXQgcmVhbCBjaGFuZ2UgY29tZXMgZnJvbSB0aGUgY29tcG91bmQgZWZmZWN0IG9mIGh1bmRyZWRzIG9mIHNtYWxsIGRlY2lzaW9ucy4gVGhlc2UgaW5jbHVkZSBkb2luZyB0d28gcHVzaC11cHMgYSBkYXksIHdha2luZyB1cCBmaXZlIG1pbnV0ZXMgZWFybHksIG9yIGhvbGRpbmcgYSBzaW5nbGUgc2hvcnQgcGhvbmUgY2FsbC4gSW4gdGhpcyBncm91bmQtYnJlYWtpbmcgYm9vaywgQ2xlYXJzIHJldmVhbHMgZXhhY3RseSBob3cgdGhlc2UgbWludXNjdWxlIGNoYW5nZXMgY2FuIGdyb3cgaW50byBzdWNoIGxpZmUtYWx0ZXJpbmcgb3V0Y29tZXMuIEhlIHVuY292ZXJzIGEgaGFuZGZ1bCBvZiBzaW1wbGUgbGlmZSBoYWNrcyAodGhlIGZvcmdvdHRlbiBhcnQgb2YgSGFiaXQgU3RhY2tpbmcsIHRoZSB1bmV4cGVjdGVkIHBvd2VyIG9mIHRoZSBUd28gTWludXRlIFJ1bGUsIG9yIHRoZSB0cmljayB0byBlbnRlcmluZyB0aGUgR29sZGlsb2NrcyBab25lKZQu	2025-03-17 06:36:06+05:30
:1:summary_bart_5216981589092543530_150_40	gAWV2AAAAAAAAACM1EtpbGxpbmcgRmxvb3IgaXMgdGhlIGZpcnN0IGJvb2sgaW4gdGhlIGludGVybmF0aW9uYWxseSBwb3B1bGFyIHNlcmllcy4gSXQgcHJlc2VudHMgUmVhY2hlciBmb3IgdGhlIGZpcnN0IHRpbWUsIGFzIHRoZSB0b3VnaCBleC1taWxpdGFyeSBjb3Agb2Ygbm8gZml4ZWQgYWJvZGUuIEluIFRvbyBEZWVwIGlzIHRoZSBsYXRlc3QgaW4gdGhlIEphY2sgUmVhY2hlciBzZXJpZXMulC4=	2025-03-18 11:44:29+05:30
:1:rate_limit_user_5_2025-05-21	gAVLFC4=	2025-05-22 11:24:44+05:30
:1:summary_t5_-468499854416088954_300_100	gAWVCwIAAAAAAABYBAIAAHdvcmxkLXJlbm93bmVkIGhhYml0cyBleHBlcnQgSmFtZXMgQ2xlYXIgaGFzIGRpc2NvdmVyZWQgdGhhdCByZWFsIGNoYW5nZSBjb21lcyBmcm9tIHRoZSBjb21wb3VuZCBlZmZlY3Qgb2YgaHVuZHJlZHMgb2Ygc21hbGwgZGVjaXNpb25zIC4gZG9pbmcgdHdvIHB1c2gtdXBzIGEgZGF5LCB3YWtpbmcgdXAgZml2ZSBtaW51dGVzIGVhcmx5LCBvciBob2xkaW5nIGEgc2luZ2xlIHNob3J0IHBob25lIGNhbGwgLiBoZSB1bmNvdmVycyBhIGhhbmRmdWwgb2Ygc2ltcGxlIGxpZmUgaGFja3MgYW5kIGRlbHZlcyBpbnRvIGN1dHRpbmctZWRnZSBwc3ljaG9sb2d5IGFuZCBuZXVyb3NjaWVuY2UgdG8gZXhwbGFpbiB3aHkgdGhleSBtYXR0ZXIgLiBhbG9uZyB0aGUgd2F5LCBoZSB0ZWxscyBpbnNwaXJpbmcgc3RvcmllcyBvZiBPbHltcGljIGdvbGQgbWVkYWxpc3RzLCBsZWFkaW5nIENFT3MsIGFuZCBkaXN0aW5ndWlzaGVkIHNjaWVudGlzdHMgd2hvIGhhdmUgdXNlZCB0aGUgc2NpZW5jZSBvZiB0aW55IGhhYml0cyB0b5Qu	2025-03-17 06:41:57+05:30
:1:summary_bart_-142692782630222641_150_40	gAWV5wAAAAAAAACM41RoZXJlJ3MgYSBzZXJpYWwga2lsbGVyIG9uIHRoZSBsb29zZS4gSGlzIG1hY2FicmUgY2FsbGluZyBjYXJkPyBUbyBsZWF2ZSB0aGUgQUJDIFJhaWx3YXkgR3VpZGUgYmVzaWRlIGVhY2ggdmljdGltJ3MgYm9keS4gSGVyY3VsZSBQb2lyb3QgaXMgaW50cmlndWVkIGJ5IHRoaXMgbXVyZGVyZXIncyBtaW5kLiBTb21ldGhpbmcganVzdCBkb2Vzbid0IHJpbmcgdHJ1ZSBhYm91dCBhIHBzeWNob3BhdGgulC4=	2025-03-17 07:57:07+05:30
:1:book_summary_BKjCQgAACAAJ_bart_150_40	gAWV5wAAAAAAAACM41RoZXJlJ3MgYSBzZXJpYWwga2lsbGVyIG9uIHRoZSBsb29zZS4gSGlzIG1hY2FicmUgY2FsbGluZyBjYXJkPyBUbyBsZWF2ZSB0aGUgQUJDIFJhaWx3YXkgR3VpZGUgYmVzaWRlIGVhY2ggdmljdGltJ3MgYm9keS4gSGVyY3VsZSBQb2lyb3QgaXMgaW50cmlndWVkIGJ5IHRoaXMgbXVyZGVyZXIncyBtaW5kLiBTb21ldGhpbmcganVzdCBkb2Vzbid0IHJpbmcgdHJ1ZSBhYm91dCBhIHBzeWNob3BhdGgulC4=	2025-03-23 07:57:07+05:30
:1:summary_t5_-142692782630222641_150_40	gAWVrgAAAAAAAACMqmhlcmN1bGUgcG9pcm90J3MgY2FsbGluZyBjYXJkPyBUbyBsZWF2ZSB0aGUgQUJDIFJhaWx3YXkgR3VpZGUgYmVzaWRlIGVhY2ggdmljdGltJ3MgYm9keSAuIHNvbWV0aGluZyBkb2Vzbid0IHJpbmcgdHJ1ZSBhYm91dCBhIHBzeWNob3BhdGggd2hvIGxheXMgaGlzIGNsdWVzIHNvIGNhcmVmdWxseSAulC4=	2025-03-17 07:57:28+05:30
:1:book_summary_BKjCQgAACAAJ_t5_150_40	gAWVrgAAAAAAAACMqmhlcmN1bGUgcG9pcm90J3MgY2FsbGluZyBjYXJkPyBUbyBsZWF2ZSB0aGUgQUJDIFJhaWx3YXkgR3VpZGUgYmVzaWRlIGVhY2ggdmljdGltJ3MgYm9keSAuIHNvbWV0aGluZyBkb2Vzbid0IHJpbmcgdHJ1ZSBhYm91dCBhIHBzeWNob3BhdGggd2hvIGxheXMgaGlzIGNsdWVzIHNvIGNhcmVmdWxseSAulC4=	2025-03-23 07:57:28+05:30
:1:summary_bart_146807815396114027_150_40	gAWVwgAAAAAAAACMvlNpbmNlIGl0cyByZWxlYXNlIGluIDE5MzYsIEhvdyB0byBXaW4gRnJpZW5kcyBhbmQgSW5mbHVlbmNlIFBlb3BsZSBoYXMgc29sZCBtb3JlIHRoYW4gMzAgbWlsbGlvbiBjb3BpZXMuIERhbGUgQ2FybmVnaWXigJlzIGZpcnN0IGJvb2sgaXMgYSB0aW1lbGVzcyBiZXN0c2VsbGVyLCBwYWNrZWQgd2l0aCByb2NrLXNvbGlkIGFkdmljZS6ULg==	2025-03-17 07:57:58+05:30
:1:book_summary_vOb1EAAAQBAJ_bart_150_40	gAWVwgAAAAAAAACMvlNpbmNlIGl0cyByZWxlYXNlIGluIDE5MzYsIEhvdyB0byBXaW4gRnJpZW5kcyBhbmQgSW5mbHVlbmNlIFBlb3BsZSBoYXMgc29sZCBtb3JlIHRoYW4gMzAgbWlsbGlvbiBjb3BpZXMuIERhbGUgQ2FybmVnaWXigJlzIGZpcnN0IGJvb2sgaXMgYSB0aW1lbGVzcyBiZXN0c2VsbGVyLCBwYWNrZWQgd2l0aCByb2NrLXNvbGlkIGFkdmljZS6ULg==	2025-03-23 07:57:58+05:30
:1:summary_bart_146807815396114027_300_100	gAWVEAIAAAAAAABYCQIAAFNpbmNlIGl0cyByZWxlYXNlIGluIDE5MzYsIEhvdyB0byBXaW4gRnJpZW5kcyBhbmQgSW5mbHVlbmNlIFBlb3BsZSBoYXMgc29sZCBtb3JlIHRoYW4gMzAgbWlsbGlvbiBjb3BpZXMuIERhbGUgQ2FybmVnaWXigJlzIGZpcnN0IGJvb2sgaXMgYSB0aW1lbGVzcyBiZXN0c2VsbGVyLCBwYWNrZWQgd2l0aCByb2NrLXNvbGlkIGFkdmljZSB0aGF0IGhhcyBjYXJyaWVkIHRob3VzYW5kcyBvZiBub3cgZmFtb3VzIHBlb3BsZSB1cCB0aGUgbGFkZGVyIG9mIHN1Y2Nlc3MgaW4gdGhlaXIgYnVzaW5lc3MgYW5kIHBlcnNvbmFsIGxpdmVzLkxlYXJuIHRoZSBzaXggd2F5cyB0byBtYWtlIHBlb3BsZSBsaWtlIHlvdSwgdGhlIHR3ZWx2ZSB3YXlzIHRvIHdpbiBwZW9wbGUgdG8geW91ciB3YXkgb2YgdGhpbmtpbmcsIGFuZCB0aGUgbmluZSB3YXlzIHRvIGNoYW5nZSBwZW9wbGUgd2l0aG91dCBhcm91c2luZyByZXNlbnRtZW50IGluIERhbGUgQ2FybmVnaWUncyBIb3cgVG8gV2luIEZyaWVuZHMgQW5kIEluZmx1ZW5jZSBQZW9wbGUulC4=	2025-03-17 07:58:17+05:30
:1:summary_t5_146807815396114027_300_100	gAWVqwEAAAAAAABYpAEAAEhvdyB0byBXaW4gRnJpZW5kcyBhbmQgSW5mbHVlbmNlIFBlb3BsZSBoYXMgc29sZCBtb3JlIHRoYW4gMzAgbWlsbGlvbiBjb3BpZXMgc2luY2UgaXRzIHJlbGVhc2UgaW4gMTkzNiAuIHRoZSBzaXggd2F5cyB0byBtYWtlIHBlb3BsZSBsaWtlIHlvdSwgdGhlIHR3ZWx2ZSB3YXlzIHRvIHdpbiBwZW9wbGUgdG8geW91ciB3YXkgb2YgdGhpbmtpbmcsIGFuZCB0aGUgbmluZSB3YXlzIHRvIGNoYW5nZSBwZW9wbGUgd2l0aG91dCBhcm91c2luZyByZXNlbnRtZW50IC4gJ3RoZSBzaXggd2F5cyB0byBtYWtlIHBlb3BsZSBsaWtlIHlvdSwgdGhlIHR3ZWx2ZSB3YXlzIHRvIHdpbiBwZW9wbGUgdG8geW91ciB3YXkgb2YgdGhpbmtpbmcsIGFuZCB0aGUgbmluZSB3YXlzIHRvIGNoYW5nZSBwZW9wbGUgd2l0aG91dCBhcm91c2luZyByZXNlbnRtZW50J5Qu	2025-03-17 07:58:41+05:30
:1:summary_bart_-5220870290175376909_150_40	gAWVDQEAAAAAAABYBgEAAFJlc2N1ZWQgZnJvbSB0aGUgb3V0cmFnZW91cyBuZWdsZWN0IG9mIGhpcyBhdW50IGFuZCB1bmNsZSwgYSB5b3VuZyBib3kgd2l0aCBhIGdyZWF0IGRlc3RpbnkgcHJvdmVzIGhpcyB3b3J0aCB3aGlsZSBhdHRlbmRpbmcgSG9nd2FydHMgU2Nob29sIG9mIFdpdGNoY3JhZnQgYW5kIFdpemFyZHJ5LiBUaGUgZmlsbSBpcyBiYXNlZCBvbiB0aGUgYm9vayAiSGFycnkgUG90dGVyIGFuZCB0aGUgRGVhdGhseSBIYWxsb3dzLCBQYXJ0IDIiIGJ5IEouSy4gUm93bGluZy6ULg==	2025-03-17 08:03:02+05:30
:1:book_summary_mSwvswEACAAJ_bart_150_40	gAWVDQEAAAAAAABYBgEAAFJlc2N1ZWQgZnJvbSB0aGUgb3V0cmFnZW91cyBuZWdsZWN0IG9mIGhpcyBhdW50IGFuZCB1bmNsZSwgYSB5b3VuZyBib3kgd2l0aCBhIGdyZWF0IGRlc3RpbnkgcHJvdmVzIGhpcyB3b3J0aCB3aGlsZSBhdHRlbmRpbmcgSG9nd2FydHMgU2Nob29sIG9mIFdpdGNoY3JhZnQgYW5kIFdpemFyZHJ5LiBUaGUgZmlsbSBpcyBiYXNlZCBvbiB0aGUgYm9vayAiSGFycnkgUG90dGVyIGFuZCB0aGUgRGVhdGhseSBIYWxsb3dzLCBQYXJ0IDIiIGJ5IEouSy4gUm93bGluZy6ULg==	2025-03-23 08:03:02+05:30
:1:summary_bart_6574372942740164630_150_40	gAWVHgEAAAAAAABYFwEAAFRoZSBsYXN0IE11Z2hhbCBlbXBlcm9yLCBaYWZhciwgY2FtZSB0byB0aGUgdGhyb25lIHdoZW4gdGhlIHBvbGl0aWNhbCBwb3dlciBvZiB0aGUgTXVnaGFscyB3YXMgYWxyZWFkeSBpbiBzdGVlcCBkZWNsaW5lLiBXaXRoIGFuIHVuc3VycGFzc2VkIHVuZGVyc3RhbmRpbmcgb2YgQnJpdGlzaCBhbmQgSW5kaWFuIGhpc3RvcnksIERhbHJ5bXBsZSBjcmFmdHMgYSBwcm92b2NhdGl2ZSwgcmV2ZWxhdG9yeSBhY2NvdW50IG9mIG9uZSB0aGUgYmxvb2RpZXN0IHVwaGVhdmFscyBpbiBoaXN0b3J5LpQu	2025-03-17 17:37:09+05:30
:1:book_summary_zlEDvkhEmL8C_bart_150_40	gAWVHgEAAAAAAABYFwEAAFRoZSBsYXN0IE11Z2hhbCBlbXBlcm9yLCBaYWZhciwgY2FtZSB0byB0aGUgdGhyb25lIHdoZW4gdGhlIHBvbGl0aWNhbCBwb3dlciBvZiB0aGUgTXVnaGFscyB3YXMgYWxyZWFkeSBpbiBzdGVlcCBkZWNsaW5lLiBXaXRoIGFuIHVuc3VycGFzc2VkIHVuZGVyc3RhbmRpbmcgb2YgQnJpdGlzaCBhbmQgSW5kaWFuIGhpc3RvcnksIERhbHJ5bXBsZSBjcmFmdHMgYSBwcm92b2NhdGl2ZSwgcmV2ZWxhdG9yeSBhY2NvdW50IG9mIG9uZSB0aGUgYmxvb2RpZXN0IHVwaGVhdmFscyBpbiBoaXN0b3J5LpQu	2025-03-23 17:37:09+05:30
:1:summary_bart_6574372942740164630_300_100	gAWVxwEAAAAAAABYwAEAAFRoZSBsYXN0IE11Z2hhbCBlbXBlcm9yLCBaYWZhciwgY2FtZSB0byB0aGUgdGhyb25lIHdoZW4gdGhlIHBvbGl0aWNhbCBwb3dlciBvZiB0aGUgTXVnaGFscyB3YXMgYWxyZWFkeSBpbiBzdGVlcCBkZWNsaW5lLiBXaXRoIGFuIHVuc3VycGFzc2VkIHVuZGVyc3RhbmRpbmcgb2YgQnJpdGlzaCBhbmQgSW5kaWFuIGhpc3RvcnksIFdpbGxpYW0gRGFscnltcGxlIGNyYWZ0cyBhIHByb3ZvY2F0aXZlLCByZXZlbGF0b3J5IGFjY291bnQgb2Ygb25lIHRoZSBibG9vZGllc3QgdXBoZWF2YWxzIGluIGhpc3RvcnkuIFRoZSBib29rIHVzZXMgcHJldmlvdXNseSB1bmRpc2NvdmVyZWQgc291cmNlcyB0byBpbnZlc3RpZ2F0ZSBhIHBpdm90YWwgbW9tZW50IGluIGhpc3RvcnksIGFuZCBpcyB3cml0dGVuIGluIHRoZSBzdHlsZSBvZiB0aGUgZ3JlYXQgSW5kaWFuIHBvZXQswqDCoFJhdmkgQWdyYXdhbC6ULg==	2025-03-17 17:37:43+05:30
:1:book_summary_bmn-azxohRoC_bart_150_40	gAWV2AAAAAAAAACM1EtpbGxpbmcgRmxvb3IgaXMgdGhlIGZpcnN0IGJvb2sgaW4gdGhlIGludGVybmF0aW9uYWxseSBwb3B1bGFyIHNlcmllcy4gSXQgcHJlc2VudHMgUmVhY2hlciBmb3IgdGhlIGZpcnN0IHRpbWUsIGFzIHRoZSB0b3VnaCBleC1taWxpdGFyeSBjb3Agb2Ygbm8gZml4ZWQgYWJvZGUuIEluIFRvbyBEZWVwIGlzIHRoZSBsYXRlc3QgaW4gdGhlIEphY2sgUmVhY2hlciBzZXJpZXMulC4=	2025-03-24 11:44:29+05:30
:1:summary_bart_8374951726819247664_150_40	gAWVPgEAAAAAAABYNwEAAERvbWluaWNhbi1ib3JuIEFtZXJpY2FuIGFjYWRlbWljIFJvb3NldmVsdCBNb250w6FzIHRlbGxzIHRoZSBzdG9yeSBvZiBob3cgYSBsaWJlcmFsIGVkdWNhdGlvbiB0cmFuc2Zvcm1lZCBoaXMgbGlmZS4gTW9udMOhcyBlbWlncmF0ZWQgZnJvbSB0aGUgRG9taW5pY2FuIFJlcHVibGljIHRvIFF1ZWVucywgTmV3IFlvcmssIHdoZW4gaGUgd2FzIHR3ZWx2ZS4gSGUgZW5jb3VudGVyZWQgdGhlIFdlc3Rlcm4gY2xhc3NpY3MgYXMgYW4gdW5kZXJncmFkdWF0ZSBpbiBDb2x1bWJpYSBVbml2ZXJzaXR54oCZcyByZW5vd25lZCBDb3JlIEN1cnJpY3VsdW0ulC4=	2025-03-18 14:03:58+05:30
:1:book_summary_v2qLEAAAQBAJ_bart_150_40	gAWVPgEAAAAAAABYNwEAAERvbWluaWNhbi1ib3JuIEFtZXJpY2FuIGFjYWRlbWljIFJvb3NldmVsdCBNb250w6FzIHRlbGxzIHRoZSBzdG9yeSBvZiBob3cgYSBsaWJlcmFsIGVkdWNhdGlvbiB0cmFuc2Zvcm1lZCBoaXMgbGlmZS4gTW9udMOhcyBlbWlncmF0ZWQgZnJvbSB0aGUgRG9taW5pY2FuIFJlcHVibGljIHRvIFF1ZWVucywgTmV3IFlvcmssIHdoZW4gaGUgd2FzIHR3ZWx2ZS4gSGUgZW5jb3VudGVyZWQgdGhlIFdlc3Rlcm4gY2xhc3NpY3MgYXMgYW4gdW5kZXJncmFkdWF0ZSBpbiBDb2x1bWJpYSBVbml2ZXJzaXR54oCZcyByZW5vd25lZCBDb3JlIEN1cnJpY3VsdW0ulC4=	2025-03-24 14:03:58+05:30
:1:summary_bart_917114610908056642_150_40	gAWVGQEAAAAAAABYEgEAAEdyZWF0IFN0b3JpZXMgZm9yIENoaWxkcmVuIGlzIGEgY29sbGVjdGlvbiBvZiBzb21lIG9mIFJ1c2tpbiBCb25kJ3MgbW9zdCBkZWxpZ2h0ZnVsIGNoaWxkcmVuJ3Mgc3Rvcmllcy4gSXQgc3RhcnMgVG90byB0aGUgbW9ua2V5IHdobyB0YWtlcyBhIGZhbmN5IHRvIHRoZSBuYXJyYXRvcidzIGF1bnQgbXVjaCB0byBoZXIgZGlzbWF5IGEgcHl0aG9uIGJlc290dGVkIGJ5IGhpcyBvd24gYXBwZWFyYW5jZSBhbmQgdGhyZWUgeW91bmcgY2hpbGRyZW4gc3RyYW5kZWQgaW4gYSBzdG9ybS6ULg==	2025-03-18 14:10:31+05:30
:1:book_summary__y8etwAACAAJ_bart_150_40	gAWVGQEAAAAAAABYEgEAAEdyZWF0IFN0b3JpZXMgZm9yIENoaWxkcmVuIGlzIGEgY29sbGVjdGlvbiBvZiBzb21lIG9mIFJ1c2tpbiBCb25kJ3MgbW9zdCBkZWxpZ2h0ZnVsIGNoaWxkcmVuJ3Mgc3Rvcmllcy4gSXQgc3RhcnMgVG90byB0aGUgbW9ua2V5IHdobyB0YWtlcyBhIGZhbmN5IHRvIHRoZSBuYXJyYXRvcidzIGF1bnQgbXVjaCB0byBoZXIgZGlzbWF5IGEgcHl0aG9uIGJlc290dGVkIGJ5IGhpcyBvd24gYXBwZWFyYW5jZSBhbmQgdGhyZWUgeW91bmcgY2hpbGRyZW4gc3RyYW5kZWQgaW4gYSBzdG9ybS6ULg==	2025-03-24 14:10:31+05:30
:1:summary_bart_7108711700661678780_150_40	gAWV8gAAAAAAAACM7lN1ZGhhIE11cnR54oCZcyBjb2xsZWN0aW9uIG9mIHN0b3JpZXMgaGFzIHNvbGQgY291bnRsZXNzIG51bWJlciBvZiBjb3BpZXMuIEZlYXR1cmluZyBnb3JnZW91cyBpbGx1c3RyYXRpb25zIGFuZCBhIG5ldyBpbnRyb2R1Y3Rpb24gYnkgdGhlIGF1dGhvciwgdGhpcyBzcGVjaWFsIGtlZXBzYWtlIGVkaXRpb24gYnJpbmdzIHRvIGJvb2sgbG92ZXJzIGFuIG9sZCBmYXZvdXJpdGUgaW4gYSBzdHVubmluZyBuZXcgbG9vay6ULg==	2025-03-18 14:10:47+05:30
:1:book_summary_jfb4EAAAQBAJ_bart_150_40	gAWV8gAAAAAAAACM7lN1ZGhhIE11cnR54oCZcyBjb2xsZWN0aW9uIG9mIHN0b3JpZXMgaGFzIHNvbGQgY291bnRsZXNzIG51bWJlciBvZiBjb3BpZXMuIEZlYXR1cmluZyBnb3JnZW91cyBpbGx1c3RyYXRpb25zIGFuZCBhIG5ldyBpbnRyb2R1Y3Rpb24gYnkgdGhlIGF1dGhvciwgdGhpcyBzcGVjaWFsIGtlZXBzYWtlIGVkaXRpb24gYnJpbmdzIHRvIGJvb2sgbG92ZXJzIGFuIG9sZCBmYXZvdXJpdGUgaW4gYSBzdHVubmluZyBuZXcgbG9vay6ULg==	2025-03-24 14:10:47+05:30
:1:summary_bart_-6448480004882667672_150_40	gAWVGAEAAAAAAABYEQEAAFRoZSBHbGFkZSBpcyBhIHdhbGxlZCBlbmNhbXBtZW50IGF0IHRoZSBjZW50cmUgb2YgYSBiaXphcnJlIGFuZCB0ZXJyaWJsZSBzdG9uZSBtYXplLiBUaGUgR2xhZGVycyBkb24ndCBrbm93IHdoeSBvciBob3cgdGhleSBjYW1lIHRvIGJlIHRoZXJlIC0gb3Igd2hhdCdzIGhhcHBlbmVkIHRvIHRoZSB3b3JsZCBvdXRzaWRlLiBBbGwgdGhleSBrbm93IGlzIHRoYXQgZXZlcnkgbW9ybmluZyB3aGVuIHRoZSB3YWxscyBzbGlkZSBiYWNrLCB0aGV5IHdpbGwgcmlzayBldmVyeXRoaW5nLpQu	2025-03-18 16:55:40+05:30
:1:book_summary_yo5GBAAAQBAJ_bart_150_40	gAWVGAEAAAAAAABYEQEAAFRoZSBHbGFkZSBpcyBhIHdhbGxlZCBlbmNhbXBtZW50IGF0IHRoZSBjZW50cmUgb2YgYSBiaXphcnJlIGFuZCB0ZXJyaWJsZSBzdG9uZSBtYXplLiBUaGUgR2xhZGVycyBkb24ndCBrbm93IHdoeSBvciBob3cgdGhleSBjYW1lIHRvIGJlIHRoZXJlIC0gb3Igd2hhdCdzIGhhcHBlbmVkIHRvIHRoZSB3b3JsZCBvdXRzaWRlLiBBbGwgdGhleSBrbm93IGlzIHRoYXQgZXZlcnkgbW9ybmluZyB3aGVuIHRoZSB3YWxscyBzbGlkZSBiYWNrLCB0aGV5IHdpbGwgcmlzayBldmVyeXRoaW5nLpQu	2025-03-24 16:55:40+05:30
:1:summary_bart_5716392773598742314_150_40	gAWVAAEAAAAAAACM/FNoZXJsb2NrIEhvbG1lcyBoYXMgYmVlbiBwbGF5ZWQgb24gc2NyZWVuIGJ5IEJhc2lsIFJhdGhib25lLCBKZXJlbXkgQnJldHQsIEJlbmVkaWN0IEN1bWJlcmJhdGNoLCBSb2JlcnQgRG93bmV5LCBKci4sIGFuZCBtYW55IG90aGVycy4gVGhpcyBib29rIGNvbnRhaW5zIHRoZSB0d2VsdmUgc3RvcmllcyBpZGVudGlmaWVkIGJ5IENvbmFuIERveWxlIGhpbXNlbGYgYXMgYmVpbmcgdGhlIHF1aW50ZXNzZW50aWFsIEhvbG1lcyBhZHZlbnR1cmVzLpQu	2025-03-19 00:29:58+05:30
:1:book_summary_75E9EQAAQBAJ_bart_150_40	gAWVAAEAAAAAAACM/FNoZXJsb2NrIEhvbG1lcyBoYXMgYmVlbiBwbGF5ZWQgb24gc2NyZWVuIGJ5IEJhc2lsIFJhdGhib25lLCBKZXJlbXkgQnJldHQsIEJlbmVkaWN0IEN1bWJlcmJhdGNoLCBSb2JlcnQgRG93bmV5LCBKci4sIGFuZCBtYW55IG90aGVycy4gVGhpcyBib29rIGNvbnRhaW5zIHRoZSB0d2VsdmUgc3RvcmllcyBpZGVudGlmaWVkIGJ5IENvbmFuIERveWxlIGhpbXNlbGYgYXMgYmVpbmcgdGhlIHF1aW50ZXNzZW50aWFsIEhvbG1lcyBhZHZlbnR1cmVzLpQu	2025-03-25 00:29:58+05:30
:1:summary_bart_6462133338939286379_150_40	gAWV1AEAAAAAAABYzQEAAFRoaXMgZWJvb2sgc2hvcnQgc3RvcnksIGFsc28gYXZhaWxhYmxlIGluIHRoZSBuZXcsIGNvbXBsZXRlIEphY2sgUmVhY2hlciBzaG9ydCBzdG9yeSBjb2xsZWN0aW9uIE5vIE1pZGRsZSBOYW1lLCBnb2VzIGJhY2sgdG8gMTk4OS4gQSB5b3VuZyBsaWV1dGVuYW50IGNvbG9uZWwsIGluIGEgc3R5bGlzaCBoYW5kbWFkZSB1bmlmb3JtLCByb2FycyB0aHJvdWdoIHRoZSBkYW1wIHdvb2RzIG9mIEdlb3JnaWEgaW4gaGVyIG5ldyBzaWx2ZXIgUG9yc2NoZS4gVW50aWwgc2hlIG1lZXRzIGEgdmVyeSB0YWxsIHNvbGRpZXIgd2l0aCBhIGJyb2tlbi1kb3duIGNhci4gV2hhdCBjb3VsZCBjb25uZWN0IGEgY29sZC1ibG9vZGVkIG9mZi1wb3N0IHNob290aW5nIHdpdGggUmVhY2hlciwgaGlzIGVsZGVyIGJyb3RoZXIgSm9lLCBhbmQgYSBzZWNyZXRpdmUgdW5pdCBvZiBwb2ludHktaGVhZHMgZnJvbSB0aGUgUGVudGFnb24/lC4=	2025-03-19 15:26:09+05:30
:1:summary_bart_5118066914556292224_150_40	gAWV9AAAAAAAAACM8EhhbGxvd2VlbiBpcyBhIGZldyBkYXlzIGF3YXkgd2hlbiBhbGwgb2YgdGhlIHB1bXBraW5zIGluIE5ldyBNb3VzZSBDaXR5IGRpc2FwcGVhci4gVGhlcmUncyBhIHRoaWVmIG9uIHRoZSBsb29zZSwgYW5kIHRoZSB0aGllZiB3YW50cyB0byBzdG9wIEhhbGxvd2Vlbi4gV2lsbCBHZXJvbmltbyBhbmQgSGVyY3VsZSBQb2lyYXQgYmUgYWJsZSB0byBzb2x2ZSB0aGUgbXlzdGVyeSBpbiB0aW1lIHRvIHNhdmUgSGFsbG93ZWVuP5Qu	2025-03-19 15:26:10+05:30
:1:book_summary_2r8IsOq15hkC_bart_150_40	gAWV9AAAAAAAAACM8EhhbGxvd2VlbiBpcyBhIGZldyBkYXlzIGF3YXkgd2hlbiBhbGwgb2YgdGhlIHB1bXBraW5zIGluIE5ldyBNb3VzZSBDaXR5IGRpc2FwcGVhci4gVGhlcmUncyBhIHRoaWVmIG9uIHRoZSBsb29zZSwgYW5kIHRoZSB0aGllZiB3YW50cyB0byBzdG9wIEhhbGxvd2Vlbi4gV2lsbCBHZXJvbmltbyBhbmQgSGVyY3VsZSBQb2lyYXQgYmUgYWJsZSB0byBzb2x2ZSB0aGUgbXlzdGVyeSBpbiB0aW1lIHRvIHNhdmUgSGFsbG93ZWVuP5Qu	2025-03-25 15:26:10+05:30
:1:summary_bart_4366236425763279881_150_40	gAWVHQEAAAAAAABYFgEAAFVsdHJhbGVhcm5pbmcgb2ZmZXJzIG5pbmUgcHJpbmNpcGxlcyB0byBtYXN0ZXIgaGFyZCBza2lsbHMgcXVpY2tseS4gVGhpcyBpcyB0aGUgZXNzZW50aWFsIGd1aWRlIHRvIGZ1dHVyZS1wcm9vZiB5b3VyIGNhcmVlciBhbmQgbWF4aW1pemUgeW91ciBjb21wZXRpdGl2ZSBhZHZhbnRhZ2UgdGhyb3VnaCBzZWxmLWVkdWNhdGlvbi4gU2NvdHQgSC4gWW91bmcgaW5jb3Jwb3JhdGVzIHRoZSBsYXRlc3QgcmVzZWFyY2ggYWJvdXQgdGhlIG1vc3QgZWZmZWN0aXZlIGxlYXJuaW5nIG1ldGhvZHMulC4=	2025-03-19 15:30:11+05:30
:1:book_summary_jyV2DwAAQBAJ_bart_150_40	gAWVHQEAAAAAAABYFgEAAFVsdHJhbGVhcm5pbmcgb2ZmZXJzIG5pbmUgcHJpbmNpcGxlcyB0byBtYXN0ZXIgaGFyZCBza2lsbHMgcXVpY2tseS4gVGhpcyBpcyB0aGUgZXNzZW50aWFsIGd1aWRlIHRvIGZ1dHVyZS1wcm9vZiB5b3VyIGNhcmVlciBhbmQgbWF4aW1pemUgeW91ciBjb21wZXRpdGl2ZSBhZHZhbnRhZ2UgdGhyb3VnaCBzZWxmLWVkdWNhdGlvbi4gU2NvdHQgSC4gWW91bmcgaW5jb3Jwb3JhdGVzIHRoZSBsYXRlc3QgcmVzZWFyY2ggYWJvdXQgdGhlIG1vc3QgZWZmZWN0aXZlIGxlYXJuaW5nIG1ldGhvZHMulC4=	2025-03-25 15:30:11+05:30
:1:summary_t5_-5983749622547154013_150_40	gAWV7QAAAAAAAACM6XRoaXMgYm9vayBjb250YWlucyB0aGUgdHdlbHZlIHN0b3JpZXMgaWRlbnRpZmllZCBieSBBcnRodXIgQ29uYW4gRG95bGUgYXMgYmVpbmcgdGhlIHF1aW50ZXNzZW50aWFsIEhvbG1lcyBhZHZlbnR1cmVzIC4gdG8gZGF0ZSwgSG9sbWVzIGhhcyBiZWVuIHBsYXllZCBvbiBzY3JlZW4gYnkgQmFzaWwgUmF0aGJvbmUsIEplcmVteSBCcmV0dCwgQmVuZWRpY3QgQ3VtYmVyYmF0Y2gsIGFuZCBtYW55IG90aGVycyAulC4=	2025-03-19 15:41:53+05:30
:1:rate_limit_user_5_2025-05-20	gAVLOC4=	2025-05-21 23:40:28+05:30
:1:book_summary_75E9EQAAQBAJ_t5_150_40	gAWV7QAAAAAAAACM6XRoaXMgYm9vayBjb250YWlucyB0aGUgdHdlbHZlIHN0b3JpZXMgaWRlbnRpZmllZCBieSBBcnRodXIgQ29uYW4gRG95bGUgYXMgYmVpbmcgdGhlIHF1aW50ZXNzZW50aWFsIEhvbG1lcyBhZHZlbnR1cmVzIC4gdG8gZGF0ZSwgSG9sbWVzIGhhcyBiZWVuIHBsYXllZCBvbiBzY3JlZW4gYnkgQmFzaWwgUmF0aGJvbmUsIEplcmVteSBCcmV0dCwgQmVuZWRpY3QgQ3VtYmVyYmF0Y2gsIGFuZCBtYW55IG90aGVycyAulC4=	2025-03-25 15:41:53+05:30
:1:summary_bart_4537621960653587520_150_40	gAWVTAEAAAAAAABYRQEAAEphY2sgSGFydCBpcyBhIG1hc3RlciB3cml0aW5nIGNvYWNoIGFuZCBmb3JtZXIgbWFuYWdpbmcgZWRpdG9yIG9mIHRoZSA8aT5PcmVnb25pYW48L2kuIEhlIGhhcyBndWlkZWQgc2V2ZXJhbCBQdWxpdHplciBQcml6ZeKAk3dpbm5pbmcgbmFycmF0aXZlcyB0byBwdWJsaWNhdGlvbi4gU2luY2UgaXRzIHB1YmxpY2F0aW9uIGluIDIwMTEsIGhpcyBib29rIGhhcyBiZWNvbWUgdGhlIGRlZmluaXRpdmUgZ3VpZGUgdG8gY3JhZnRpbmcgbmFycmF0aXZlIG5vbmZpY3Rpb24uIFRoaXMgaXMgdGhlIGJvb2sgdG8gcmVhZCB0byBsZWFybiB0aGUgYXJ0IG9mIHN0b3J5dGVsbGluZy6ULg==	2025-03-19 15:44:01+05:30
:1:book_summary_Q3sgEAAAQBAJ_bart_150_40	gAWVTAEAAAAAAABYRQEAAEphY2sgSGFydCBpcyBhIG1hc3RlciB3cml0aW5nIGNvYWNoIGFuZCBmb3JtZXIgbWFuYWdpbmcgZWRpdG9yIG9mIHRoZSA8aT5PcmVnb25pYW48L2kuIEhlIGhhcyBndWlkZWQgc2V2ZXJhbCBQdWxpdHplciBQcml6ZeKAk3dpbm5pbmcgbmFycmF0aXZlcyB0byBwdWJsaWNhdGlvbi4gU2luY2UgaXRzIHB1YmxpY2F0aW9uIGluIDIwMTEsIGhpcyBib29rIGhhcyBiZWNvbWUgdGhlIGRlZmluaXRpdmUgZ3VpZGUgdG8gY3JhZnRpbmcgbmFycmF0aXZlIG5vbmZpY3Rpb24uIFRoaXMgaXMgdGhlIGJvb2sgdG8gcmVhZCB0byBsZWFybiB0aGUgYXJ0IG9mIHN0b3J5dGVsbGluZy6ULg==	2025-03-25 15:44:01+05:30
:1:summary_bart_-8081108112131938131_150_40	gAWVDAEAAAAAAABYBQEAAElhbiBMZXNsaWUgbWFrZXMgYSBwYXNzaW9uYXRlIGNhc2UgZm9yIHRoZSBjdWx0aXZhdGlvbiBvZiBvdXIgZGVzaXJlIHRvIGtub3cuIEN1cmlvdXMgcGVvcGxlIHRlbmQgdG8gYmUgc21hcnRlciwgbW9yZSBjcmVhdGl2ZSBhbmQgbW9yZSBzdWNjZXNzZnVsLiBCdXQgYXQgdGhlIHZlcnkgbW9tZW50IHdoZW4gdGhlIHJld2FyZHMgb2YgY3VyaW9zaXR5IGhhdmUgbmV2ZXIgYmVlbiBoaWdoZXIsIGl0IGlzIG1pc3VuZGVyc3Rvb2QgYW5kIHVuZGVydmFsdWVkLpQu	2025-03-19 15:44:46+05:30
:1:book_summary_ZBRhBQAAQBAJ_bart_150_40	gAWVDAEAAAAAAABYBQEAAElhbiBMZXNsaWUgbWFrZXMgYSBwYXNzaW9uYXRlIGNhc2UgZm9yIHRoZSBjdWx0aXZhdGlvbiBvZiBvdXIgZGVzaXJlIHRvIGtub3cuIEN1cmlvdXMgcGVvcGxlIHRlbmQgdG8gYmUgc21hcnRlciwgbW9yZSBjcmVhdGl2ZSBhbmQgbW9yZSBzdWNjZXNzZnVsLiBCdXQgYXQgdGhlIHZlcnkgbW9tZW50IHdoZW4gdGhlIHJld2FyZHMgb2YgY3VyaW9zaXR5IGhhdmUgbmV2ZXIgYmVlbiBoaWdoZXIsIGl0IGlzIG1pc3VuZGVyc3Rvb2QgYW5kIHVuZGVydmFsdWVkLpQu	2025-03-25 15:44:46+05:30
:1:summary_bart_-2882978164472143874_150_40	gAWV1wAAAAAAAACM01RoaXMgaXMgdGhlIGZpcnN0IGJvb2sgaW4gRW5nbGlzaCB0byByZWxhdGUgdGhlIGhpc3Rvcnkgb2YgRGFtYXNjdXMuIEl0IHRyYWNlcyB0aGUgY2l0eSdzIGVtZXJnZW5jZSBpbiBhcm91bmQgNzAwMCBCQyB0aHJvdWdoIHRoZSBjaGFuZ2luZyBjYXZhbGNhZGUgb2YgQXJhbWFlYW4sIFBlcnNpYW4sIEdyZWVrLCBSb21hbiwgQnl6YW50aW5lIGFuZCBBcmFiIHJ1bGVycy6ULg==	2025-03-19 15:45:12+05:30
:1:book_summary_SVR2cjWptCAC_bart_150_40	gAWV1wAAAAAAAACM01RoaXMgaXMgdGhlIGZpcnN0IGJvb2sgaW4gRW5nbGlzaCB0byByZWxhdGUgdGhlIGhpc3Rvcnkgb2YgRGFtYXNjdXMuIEl0IHRyYWNlcyB0aGUgY2l0eSdzIGVtZXJnZW5jZSBpbiBhcm91bmQgNzAwMCBCQyB0aHJvdWdoIHRoZSBjaGFuZ2luZyBjYXZhbGNhZGUgb2YgQXJhbWFlYW4sIFBlcnNpYW4sIEdyZWVrLCBSb21hbiwgQnl6YW50aW5lIGFuZCBBcmFiIHJ1bGVycy6ULg==	2025-03-25 15:45:12+05:30
:1:summary_bart_-585328351554713376_150_40	gAWVEwEAAAAAAABYDAEAAEFuIGV4cXVpc2l0ZWx5IG1vdmluZyBzdG9yeSBhYm91dCBncmllZiwgbG92ZSBhbmQgZmFtaWx5LCBmcm9tIHRoZSBnbG9iYWwgcGhlbm9tZW5vbiBTYWxseSBSb29uZXkuIFBldGVyIGFuZCBJdmFuIEtvdWJlayBzZWVtIHRvIGhhdmUgbGl0dGxlIGluIGNvbW1vbi4gSW4gdGhlIGVhcmx5IHdlZWtzIG9mIGhpcyBiZXJlYXZlbWVudCwgSXZhbiBtZWV0cyBNYXJnYXJldCBhbmQgdGhlaXIgbGl2ZXMgYmVjb21lIHJhcGlkbHkgYW5kIGludGVuc2VseSBpbnRlcnR3aW5lZC6ULg==	2025-03-19 15:54:42+05:30
:1:book_summary_ifn3EAAAQBAJ_bart_150_40	gAWVEwEAAAAAAABYDAEAAEFuIGV4cXVpc2l0ZWx5IG1vdmluZyBzdG9yeSBhYm91dCBncmllZiwgbG92ZSBhbmQgZmFtaWx5LCBmcm9tIHRoZSBnbG9iYWwgcGhlbm9tZW5vbiBTYWxseSBSb29uZXkuIFBldGVyIGFuZCBJdmFuIEtvdWJlayBzZWVtIHRvIGhhdmUgbGl0dGxlIGluIGNvbW1vbi4gSW4gdGhlIGVhcmx5IHdlZWtzIG9mIGhpcyBiZXJlYXZlbWVudCwgSXZhbiBtZWV0cyBNYXJnYXJldCBhbmQgdGhlaXIgbGl2ZXMgYmVjb21lIHJhcGlkbHkgYW5kIGludGVuc2VseSBpbnRlcnR3aW5lZC6ULg==	2025-03-25 15:54:42+05:30
:1:summary_bart_5451569353519200331_150_40	gAWVoAAAAAAAAACMnEJlYXV0aWZ1bCBXb3JsZCwgV2hlcmUgQXJlIFlvdSBpcyBhIG5ldyBub3ZlbCBieSBTYWxseSBSb29uZXkuIFJvb25leSBpcyB0aGUgYmVzdHNlbGxpbmcgYXV0aG9yIG9mIDxpPk5vcm1hbCBQZW9wbGUgPC9pPiBhbmQgPGkgPkNvbnZlcnNhdGlvbnMgd2l0aCBGcmllbmRzLpQu	2025-03-19 15:56:26+05:30
:1:book_summary_sL4SEAAAQBAJ_bart_150_40	gAWVoAAAAAAAAACMnEJlYXV0aWZ1bCBXb3JsZCwgV2hlcmUgQXJlIFlvdSBpcyBhIG5ldyBub3ZlbCBieSBTYWxseSBSb29uZXkuIFJvb25leSBpcyB0aGUgYmVzdHNlbGxpbmcgYXV0aG9yIG9mIDxpPk5vcm1hbCBQZW9wbGUgPC9pPiBhbmQgPGkgPkNvbnZlcnNhdGlvbnMgd2l0aCBGcmllbmRzLpQu	2025-03-25 15:56:26+05:30
:1:summary_bart_-957671361834052192_150_40	gAWVBwEAAAAAAABYAAEAAEp1bmUgSm9yZGFuIGlzIGEgY29udGVtcG9yYXJ5IG9mIEFsaWNlIFdhbGtlciwgVG9uaSBNb3JyaXNvbiBhbmQgQXVkcmUgTG9yZGUuIEZpcnN0IHB1Ymxpc2hlZCBpbiAxOTk0LCBoZXIgcG9ldHJ5IHJlbWFpbnMgcG9saXRpY2FsbHkgcG90ZW50LCBseXJpY2FsbHkgaW52ZW50aXZlIGFuZCBicmVhdGh0YWtpbmdseSByb21hbnRpYy4gU2XDoW4gSGV3aXR0OiAiTG92ZSBQb2VtcyIgaXMgYSB2aXRhbGx5IGltcG9ydGFudCBtb2Rlcm4gY2xhc3NpYyKULg==	2025-03-19 23:49:54+05:30
:1:book_summary_k4R0EAAAQBAJ_bart_150_40	gAWVBwEAAAAAAABYAAEAAEp1bmUgSm9yZGFuIGlzIGEgY29udGVtcG9yYXJ5IG9mIEFsaWNlIFdhbGtlciwgVG9uaSBNb3JyaXNvbiBhbmQgQXVkcmUgTG9yZGUuIEZpcnN0IHB1Ymxpc2hlZCBpbiAxOTk0LCBoZXIgcG9ldHJ5IHJlbWFpbnMgcG9saXRpY2FsbHkgcG90ZW50LCBseXJpY2FsbHkgaW52ZW50aXZlIGFuZCBicmVhdGh0YWtpbmdseSByb21hbnRpYy4gU2XDoW4gSGV3aXR0OiAiTG92ZSBQb2VtcyIgaXMgYSB2aXRhbGx5IGltcG9ydGFudCBtb2Rlcm4gY2xhc3NpYyKULg==	2025-03-25 23:49:54+05:30
:1:summary_bart_6867078680367618022_150_40	gAWVXwEAAAAAAABYWAEAAEphbWVzIEhhbHBlcmluJ3Mgc3R1bm5pbmcgbm92ZWwgb2YgdGhlIHRyaXVtcGggb3ZlciBkZWF0aCBpdHNlbGYuIEluIDIwNzEsIGN1dHRpbmctZWRnZSBzY2llbmNlIGhhcyBtYWRlIGV0ZXJuYWwgeW91dGgsIGJlYXV0eSwgYW5kIGdvb2QgaGVhbHRoIHVuaXZlcnNhbGx5IGF2YWlsYWJsZS4gQnV0IGV2ZW4gYXMgdGhleSBtYXJ2ZWwgYXQgdGhlIG1pcmFjbGVzIG9mIGZ1dHVyZSBzY2llbmNlLCBCZW4gU21pdGggYW5kIGhpcyBldGVybmFsIGZhbWlseSByZWFsaXplIHRoYXQgdGhlIGRlZXBlc3QgZXRoaWNhbCBhbmQgZW1vdGlvbmFsIGRpbGVtbWFzIG9mIGh1bWFua2luZCByZW1haW4gdW5zb2x2ZWQulC4=	2025-03-20 00:32:03+05:30
:1:book_summary_koxFAAAAYAAJ_bart_150_40	gAWVXwEAAAAAAABYWAEAAEphbWVzIEhhbHBlcmluJ3Mgc3R1bm5pbmcgbm92ZWwgb2YgdGhlIHRyaXVtcGggb3ZlciBkZWF0aCBpdHNlbGYuIEluIDIwNzEsIGN1dHRpbmctZWRnZSBzY2llbmNlIGhhcyBtYWRlIGV0ZXJuYWwgeW91dGgsIGJlYXV0eSwgYW5kIGdvb2QgaGVhbHRoIHVuaXZlcnNhbGx5IGF2YWlsYWJsZS4gQnV0IGV2ZW4gYXMgdGhleSBtYXJ2ZWwgYXQgdGhlIG1pcmFjbGVzIG9mIGZ1dHVyZSBzY2llbmNlLCBCZW4gU21pdGggYW5kIGhpcyBldGVybmFsIGZhbWlseSByZWFsaXplIHRoYXQgdGhlIGRlZXBlc3QgZXRoaWNhbCBhbmQgZW1vdGlvbmFsIGRpbGVtbWFzIG9mIGh1bWFua2luZCByZW1haW4gdW5zb2x2ZWQulC4=	2025-03-26 00:32:03+05:30
:1:summary_bart_-2590959269863204037_150_40	gAWVEAEAAAAAAABYCQEAAFJvbWFuY2UgV3JpdGluZyBleHBsb3JlcyB0aGUgY2hhbmdpbmcgbmF0dXJlIG9mIGJvdGggdGhlIHJvbWFuY2UgZ2VucmUgYW5kIHRoZSBkaXNjb3Vyc2Ugb2Ygcm9tYW50aWMgbG92ZSBmcm9tIHRoZSBzZXZlbnRlZW50aCBjZW50dXJ5IHRvIHRoZSBwcmVzZW50IGRheS4gSXQgaXMgb25lIG9mIHRoZSBmaXJzdCBzdHVkaWVzIHRvIGFwcHJvYWNoIHJvbWFudGljIGxvdmUgYXMgYm90aCBnZW5yZSBhbmQgZGlzY291cnNlIGluIG1vcmUgdGhhbiBzaXh0eSB5ZWFycy6ULg==	2025-03-20 00:32:32+05:30
:1:book_summary_we4jl507M4EC_bart_150_40	gAWVEAEAAAAAAABYCQEAAFJvbWFuY2UgV3JpdGluZyBleHBsb3JlcyB0aGUgY2hhbmdpbmcgbmF0dXJlIG9mIGJvdGggdGhlIHJvbWFuY2UgZ2VucmUgYW5kIHRoZSBkaXNjb3Vyc2Ugb2Ygcm9tYW50aWMgbG92ZSBmcm9tIHRoZSBzZXZlbnRlZW50aCBjZW50dXJ5IHRvIHRoZSBwcmVzZW50IGRheS4gSXQgaXMgb25lIG9mIHRoZSBmaXJzdCBzdHVkaWVzIHRvIGFwcHJvYWNoIHJvbWFudGljIGxvdmUgYXMgYm90aCBnZW5yZSBhbmQgZGlzY291cnNlIGluIG1vcmUgdGhhbiBzaXh0eSB5ZWFycy6ULg==	2025-03-26 00:32:32+05:30
:1:summary_bart_-5610174152724795190_150_40	gAWVugAAAAAAAACMtlRoZSBCbGFjayBCb29rIGJ5IE9yaGFuIFBhbXVrIGlzIGEgbXlzdGVyeSBub3ZlbCBhYm91dCBhIG1pc3Npbmcgd2lmZS4gVGhlIG5vdmVsIGhhcyBiZWVuIG5lZ2xlY3RlZCBieSBFbmdsaXNoLWxhbmd1YWdlIHJlYWRlcnMuIE1hdXJlZW4gRnJlZWx5IGhhcyB0cmFuc2xhdGVkIHRoZSBub3ZlbCBpbnRvIEVuZ2xpc2gulC4=	2025-03-20 00:43:06+05:30
:1:book_summary_EnCBAAAAIAAJ_bart_150_40	gAWVugAAAAAAAACMtlRoZSBCbGFjayBCb29rIGJ5IE9yaGFuIFBhbXVrIGlzIGEgbXlzdGVyeSBub3ZlbCBhYm91dCBhIG1pc3Npbmcgd2lmZS4gVGhlIG5vdmVsIGhhcyBiZWVuIG5lZ2xlY3RlZCBieSBFbmdsaXNoLWxhbmd1YWdlIHJlYWRlcnMuIE1hdXJlZW4gRnJlZWx5IGhhcyB0cmFuc2xhdGVkIHRoZSBub3ZlbCBpbnRvIEVuZ2xpc2gulC4=	2025-03-26 00:43:06+05:30
:1:summary_bart_3393107039788637991_150_40	gAWVSwEAAAAAAABYRAEAAFZlcm5l4oCZcyBpbWFnaW5hdGl2ZSB0YWxlIGlzIGF0IG9uY2UgdGhlIHVsdGltYXRlIHNjaWVuY2UgZmljdGlvbiBhZHZlbnR1cmUgYW5kIGEgcmVmbGVjdGlvbiBvbiB0aGUgcGVyZmVjdGliaWxpdHkgb2YgaHVtYW4gdW5kZXJzdGFuZGluZyBhbmQgdGhlIHBzeWNob2xvZ3kgb2YgdGhlIHF1ZXN0b3IuIEFzIERhdmlkIEJyaW4gbm90ZXMgaW4gaGlzIEludHJvZHVjdGlvbiwgPGI+Sm91cm5leSB0byB0aGUgQ2VudHJlIG9mIHRoZSBFYXJ0aDwvYj4gaXMg4oCcaW5hcmd1YWJseSBvbmUgb2YgdGhlIHdlbGxzcHJpbmdzIGZyb20gd2hpY2ggaXQgYWxsIGJlZ2FuLuKAnZQu	2025-03-20 00:43:20+05:30
:1:book_summary_icKmd-tlvPMC_bart_150_40	gAWVSwEAAAAAAABYRAEAAFZlcm5l4oCZcyBpbWFnaW5hdGl2ZSB0YWxlIGlzIGF0IG9uY2UgdGhlIHVsdGltYXRlIHNjaWVuY2UgZmljdGlvbiBhZHZlbnR1cmUgYW5kIGEgcmVmbGVjdGlvbiBvbiB0aGUgcGVyZmVjdGliaWxpdHkgb2YgaHVtYW4gdW5kZXJzdGFuZGluZyBhbmQgdGhlIHBzeWNob2xvZ3kgb2YgdGhlIHF1ZXN0b3IuIEFzIERhdmlkIEJyaW4gbm90ZXMgaW4gaGlzIEludHJvZHVjdGlvbiwgPGI+Sm91cm5leSB0byB0aGUgQ2VudHJlIG9mIHRoZSBFYXJ0aDwvYj4gaXMg4oCcaW5hcmd1YWJseSBvbmUgb2YgdGhlIHdlbGxzcHJpbmdzIGZyb20gd2hpY2ggaXQgYWxsIGJlZ2FuLuKAnZQu	2025-03-26 00:43:20+05:30
:1:summary_bart_6352633206254375996_150_40	gAWV2QAAAAAAAACM1VRoZSBQaWN0dXJlIG9mIERvcmlhbiBHcmF5IGlzIHRoZSBvbmx5IHB1Ymxpc2hlZCBub3ZlbCBieSBPc2NhciBXaWxkZS4gSXQgYXBwZWFyZWQgYXMgdGhlIGxlYWQgc3RvcnkgaW4gTGlwcGluY290dCdzIE1vbnRobHkgTWFnYXppbmUgb24gMjAgSnVuZSAxODkwLiBUb2RheSwgV2lsZGUncyBmaW4gZGUgc2nDqGNsZSBub3ZlbGxhIGlzIGNvbnNpZGVyZWQgYSBjbGFzc2ljLpQu	2025-03-20 00:58:15+05:30
:1:book_summary_6vGiDwAAQBAJ_bart_150_40	gAWV2QAAAAAAAACM1VRoZSBQaWN0dXJlIG9mIERvcmlhbiBHcmF5IGlzIHRoZSBvbmx5IHB1Ymxpc2hlZCBub3ZlbCBieSBPc2NhciBXaWxkZS4gSXQgYXBwZWFyZWQgYXMgdGhlIGxlYWQgc3RvcnkgaW4gTGlwcGluY290dCdzIE1vbnRobHkgTWFnYXppbmUgb24gMjAgSnVuZSAxODkwLiBUb2RheSwgV2lsZGUncyBmaW4gZGUgc2nDqGNsZSBub3ZlbGxhIGlzIGNvbnNpZGVyZWQgYSBjbGFzc2ljLpQu	2025-03-26 00:58:15+05:30
:1:summary_bart_6054361248700914549_150_40	gAWVwAEAAAAAAABYuQEAAEFtZXJpY2FuIGF1dGhvciBvZiBjb250ZW1wb3JhcnkgaG9ycm9yLCBzdXNwZW5zZSwgc2NpZW5jZSBmaWN0aW9uIGFuZCBmYW50YXN5LCBTdGVwaGVuIEtpbmcgKGIuIDE5NDcpIFRoZSBmaXJzdCB0aGlyZCBvZiB0aGUgYm9vayBjb250YWlucyBLaW5nJ3MgbWVtb2lyLCB3aGljaCBpbmNsdWRlcyBoZWFydGZlbHQgdGlkYml0cyBhYm91dCBoaXMgYnJvdGhlciwgbW90aGVyIGFuZCBoaXMgbG9uZyBiYXR0bGVzIHdpdGggYWxjb2hvbCBhbmQgZHJ1ZyBhZGRpY3Rpb24uIEtpbmcgZGVzY3JpYmVzIHRoZSBzeW1ib2xpc20gaW4gbWFueSBvZiBoaXMgbm92ZWxzIGFuZCBvZmZlcnMgd3JpdGVycyBjb21tb24gc2Vuc2UgYWR2aWNlLiBIZSBkZXNjcmliZXMgaGlzIHdyaXRlcidzIHRvb2xib3gsIGluY2x1ZGluZyBleGFtcGxlcyBvZiBib3RoIGdvb2QgYW5kIGJhZCB3cml0aW5nLpQu	2025-03-22 16:42:12+05:30
:1:book_summary_d999Z2KbZJYC_bart_150_40	gAWVwAEAAAAAAABYuQEAAEFtZXJpY2FuIGF1dGhvciBvZiBjb250ZW1wb3JhcnkgaG9ycm9yLCBzdXNwZW5zZSwgc2NpZW5jZSBmaWN0aW9uIGFuZCBmYW50YXN5LCBTdGVwaGVuIEtpbmcgKGIuIDE5NDcpIFRoZSBmaXJzdCB0aGlyZCBvZiB0aGUgYm9vayBjb250YWlucyBLaW5nJ3MgbWVtb2lyLCB3aGljaCBpbmNsdWRlcyBoZWFydGZlbHQgdGlkYml0cyBhYm91dCBoaXMgYnJvdGhlciwgbW90aGVyIGFuZCBoaXMgbG9uZyBiYXR0bGVzIHdpdGggYWxjb2hvbCBhbmQgZHJ1ZyBhZGRpY3Rpb24uIEtpbmcgZGVzY3JpYmVzIHRoZSBzeW1ib2xpc20gaW4gbWFueSBvZiBoaXMgbm92ZWxzIGFuZCBvZmZlcnMgd3JpdGVycyBjb21tb24gc2Vuc2UgYWR2aWNlLiBIZSBkZXNjcmliZXMgaGlzIHdyaXRlcidzIHRvb2xib3gsIGluY2x1ZGluZyBleGFtcGxlcyBvZiBib3RoIGdvb2QgYW5kIGJhZCB3cml0aW5nLpQu	2025-03-28 16:42:12+05:30
:1:summary_bart_-5500079496437431428_150_40	gAWV5gAAAAAAAACM4lRoZXNlIDE1IHNob3J0IHN0b3JpZXMgd2VyZSBjaG9zZW4gYnkgZm9ybWVyIGVkaXRvciBvZiAnU2hlcmxvY2snIG1hZ2F6aW5lLCBEYXZpZCBTdHVhcnQgRGF2aWVzLiBUaGV5IHNob3cgdGhlIG1hc3RlciBkZXRlY3RpdmUgYXQgaGlzIG1vc3QgaW5nZW5pb3VzLiBUaGUgc2hvcnQgc3RvcmllcyBhcmUgY2hvc2VuIGJ5IERhdmllcyBvbiBiZWhhbGYgb2YgdGhlIG1hZ2F6aW5lJ3MgcmVhZGVycy6ULg==	2025-03-22 16:46:47+05:30
:1:book_summary_UomtUqgaJlkC_bart_150_40	gAWV5gAAAAAAAACM4lRoZXNlIDE1IHNob3J0IHN0b3JpZXMgd2VyZSBjaG9zZW4gYnkgZm9ybWVyIGVkaXRvciBvZiAnU2hlcmxvY2snIG1hZ2F6aW5lLCBEYXZpZCBTdHVhcnQgRGF2aWVzLiBUaGV5IHNob3cgdGhlIG1hc3RlciBkZXRlY3RpdmUgYXQgaGlzIG1vc3QgaW5nZW5pb3VzLiBUaGUgc2hvcnQgc3RvcmllcyBhcmUgY2hvc2VuIGJ5IERhdmllcyBvbiBiZWhhbGYgb2YgdGhlIG1hZ2F6aW5lJ3MgcmVhZGVycy6ULg==	2025-03-28 16:46:47+05:30
:1:summary_bart_4096217311859484555_150_40	gAWVrAAAAAAAAACMqFRoZSBzdG9yeSB0YWtlcyBwbGFjZSBpbiBub3J0aGVybiBGcmFuY2UsIGdpdmluZyBQb2lyb3QgYSBob3N0aWxlIGNvbXBldGl0b3IgZnJvbSB0aGUgUGFyaXMgU8O7cmV0w6kuIFRoZSBib29rIGlzIG5vdGFibGUgZm9yIGEgc3VicGxvdCBpbiB3aGljaCBIYXN0aW5ncyBmYWxscyBpbiBsb3ZlLpQu	2025-03-22 16:55:02+05:30
:1:book_summary_xg2iDwAAQBAJ_bart_150_40	gAWVrAAAAAAAAACMqFRoZSBzdG9yeSB0YWtlcyBwbGFjZSBpbiBub3J0aGVybiBGcmFuY2UsIGdpdmluZyBQb2lyb3QgYSBob3N0aWxlIGNvbXBldGl0b3IgZnJvbSB0aGUgUGFyaXMgU8O7cmV0w6kuIFRoZSBib29rIGlzIG5vdGFibGUgZm9yIGEgc3VicGxvdCBpbiB3aGljaCBIYXN0aW5ncyBmYWxscyBpbiBsb3ZlLpQu	2025-03-28 16:55:02+05:30
:1:summary_bart_3443421592965185999_150_40	gAWVCAEAAAAAAABYAQEAAFdpbnRlciBpcyBjb21pbmcuIEhvdXNlIFN0YXJrIGlzIHRoZSBub3J0aGVybm1vc3Qgb2YgdGhlIGZpZWZkb21zIHRoYXQgb3dlIGFsbGVnaWFuY2UgdG8gS2luZyBSb2JlcnQgQmFyYXRoZW9uIGluIGZhci1vZmYgS2luZ+KAmXMgTGFuZGluZy4gUHJpbmNlIFZpc2VyeXMsIGhlaXIgb2YgdGhlIGZhbGxlbiBIb3VzZSBUYXJnYXJ5ZW4sIHNjaGVtZXMgdG8gcmVjbGFpbSB0aGUgdGhyb25lIHdpdGggYW4gYXJteSBvZiBiYXJiYXJpYW4gRG90aHJha2kulC4=	2025-03-22 17:54:46+05:30
:1:book_summary_bIZiAAAAMAAJ_bart_150_40	gAWVCAEAAAAAAABYAQEAAFdpbnRlciBpcyBjb21pbmcuIEhvdXNlIFN0YXJrIGlzIHRoZSBub3J0aGVybm1vc3Qgb2YgdGhlIGZpZWZkb21zIHRoYXQgb3dlIGFsbGVnaWFuY2UgdG8gS2luZyBSb2JlcnQgQmFyYXRoZW9uIGluIGZhci1vZmYgS2luZ+KAmXMgTGFuZGluZy4gUHJpbmNlIFZpc2VyeXMsIGhlaXIgb2YgdGhlIGZhbGxlbiBIb3VzZSBUYXJnYXJ5ZW4sIHNjaGVtZXMgdG8gcmVjbGFpbSB0aGUgdGhyb25lIHdpdGggYW4gYXJteSBvZiBiYXJiYXJpYW4gRG90aHJha2kulC4=	2025-03-28 17:54:46+05:30
:1:summary_bart_4849994742340972444_150_40	gAWVIgEAAAAAAABYGwEAAEhhcnJ5IFBvdHRlciBoYXMgbm8gaWRlYSBob3cgZmFtb3VzIGhlIGlzLiBUaGF0J3MgYmVjYXVzZSBoZSdzIGJlaW5nIHJhaXNlZCBieSBoaXMgbWlzZXJhYmxlIGF1bnQgYW5kIHVuY2xlIHdobyBhcmUgdGVycmlmaWVkIEhhcnJ5IHdpbGwgbGVhcm4gdGhhdCBoZSdzIHJlYWxseSBhIHdpemFyZCwganVzdCBhcyBoaXMgcGFyZW50cyB3ZXJlLiBCdXQgZXZlcnl0aGluZyBjaGFuZ2VzIHdoZW4gSGFycnkgaXMgc3VtbW9uZWQgdG8gYXR0ZW5kIGFuIGluZmFtb3VzIHNjaG9vbCBmb3Igd2l6YXJkcy6ULg==	2025-03-22 19:14:19+05:30
:1:bookservice_book_details_335bf15f9c7acce7e7da50a23a9c411d	gAWVlgAAAAAAAAB9lCiMBXRpdGxllIwSSWJhYWRkbyBLYS1CYcq8aXNvlIwGYXV0aG9ylIwhRWlrZSBIYWJlcmxhbmQsIE1hcmNlbGxvIExhbWJlcnRplIwLZGVzY3JpcHRpb26UTowGZ2VucmVzlF2UjBVBYmF5YSBMYWtlIChFdGhpb3BpYSmUYYwOcHVibGlzaGVkX3llYXKUTcQHdS4=	2025-03-29 18:08:03+05:30
:1:bookservice_book_details_c3cc095bac5e94094b6f1145e17dc030	gAWVkgAAAAAAAAB9lCiMBXRpdGxllIw0Rm9jdXMgT246IDEwMCBNb3N0IFBvcHVsYXIgQWN0cmVzc2VzIGluIEhpbmRpIENpbmVtYZSMBmF1dGhvcpSMFldpa2lwZWRpYSBjb250cmlidXRvcnOUjAtkZXNjcmlwdGlvbpROjAZnZW5yZXOUXZSMDnB1Ymxpc2hlZF95ZWFylE51Lg==	2025-03-29 18:08:07+05:30
:1:bookservice_book_details_a9b9d392bd72dfa96cd8b7d12bac66ec	gAWVkgAAAAAAAAB9lCiMBXRpdGxllIw0Rm9jdXMgT246IDEwMCBNb3N0IFBvcHVsYXIgQWN0cmVzc2VzIGluIEhpbmRpIENpbmVtYZSMBmF1dGhvcpSMFldpa2lwZWRpYSBjb250cmlidXRvcnOUjAtkZXNjcmlwdGlvbpROjAZnZW5yZXOUXZSMDnB1Ymxpc2hlZF95ZWFylE51Lg==	2025-03-29 18:08:11+05:30
:1:bookservice_book_details_a6d1b53ed9af1df6bf792999f0f469be	gAWVkgAAAAAAAAB9lCiMBXRpdGxllIw0Rm9jdXMgT246IDEwMCBNb3N0IFBvcHVsYXIgQWN0cmVzc2VzIGluIEhpbmRpIENpbmVtYZSMBmF1dGhvcpSMFldpa2lwZWRpYSBjb250cmlidXRvcnOUjAtkZXNjcmlwdGlvbpROjAZnZW5yZXOUXZSMDnB1Ymxpc2hlZF95ZWFylE51Lg==	2025-03-29 18:08:15+05:30
:1:bookservice_book_details_35c17b513d492df4905a63a00ee5d15a	gAWVRAMAAAAAAAB9lCiMBXRpdGxllIwGU3BoZXJllIwGYXV0aG9ylIwQTWljaGFlbCBDcmljaHRvbpSMC2Rlc2NyaXB0aW9ulFjUAgAARnJvbSB0aGUgYXV0aG9yIG9mIEp1cmFzc2ljIFBhcmssIFRpbWVsaW5lLCBhbmQgQ29uZ28gY29tZXMgYSBwc3ljaG9sb2dpY2FsIHRocmlsbGVyIGFib3V0IGEgZ3JvdXAgb2Ygc2NpZW50aXN0cyB3aG8gaW52ZXN0aWdhdGUgYSBzcGFjZXNoaXAgZGlzY292ZXJlZCBvbiB0aGUgb2NlYW4gZmxvb3IuIEluIHRoZSBtaWRkbGUgb2YgdGhlIFNvdXRoIFBhY2lmaWMsIGEgdGhvdXNhbmQgZmVldCBiZWxvdyB0aGUgc3VyZmFjZSwgYSBodWdlIHZlc3NlbCBpcyB1bmVhcnRoZWQuIFJ1c2hlZCB0byB0aGUgc2NlbmUgaXMgYSB0ZWFtIG9mIEFtZXJpY2FuIHNjaWVudGlzdHMgd2hvIGRlc2NlbmQgdG9nZXRoZXIgaW50byB0aGUgZGVwdGhzIHRvIGludmVzdGlnYXRlIHRoZSBhc3RvbmlzaGluZyBkaXNjb3ZlcnkuIFdoYXQgdGhleSBmaW5kIGRlZmllcyB0aGVpciBpbWFnaW5hdGlvbnMgYW5kIG1vY2tzIHRoZWlyIGF0dGVtcHRzIGF0IGxvZ2ljYWwgZXhwbGFuYXRpb24uIEl0IGlzIGEgc3BhY2VzaGlwLCBidXQgYXBwYXJlbnRseSBpdCBpcyB1bmRhbWFnZWQgYnkgaXRzIGZhbGwgZnJvbSB0aGUgc2t5LiBBbmQsIG1vc3Qgc3RhcnRsaW5nLCBpdCBhcHBlYXJzIHRvIGJlIGF0IGxlYXN0IHRocmVlIGh1bmRyZWQgeWVhcnMgb2xkLCBjb250YWluaW5nIGEgdGVycmlmeWluZyBhbmQgZGVzdHJ1Y3RpdmUgZm9yY2UgdGhhdCBtdXN0IGJlIGNvbnRyb2xsZWQgYXQgYWxsIGNvc3RzLpSMBmdlbnJlc5RdlIwHRmljdGlvbpRhjA5wdWJsaXNoZWRfeWVhcpRN3Ad1Lg==	2025-03-29 18:08:16+05:30
:1:summary_bart_-5044319082507595975_150_40	gAWV4AAAAAAAAACM3EEgZ3JvdXAgb2Ygc2NpZW50aXN0cyBpbnZlc3RpZ2F0ZSBhIHNwYWNlc2hpcCBkaXNjb3ZlcmVkIG9uIHRoZSBvY2VhbiBmbG9vci4gVGhlIHZlc3NlbCBhcHBlYXJzIHRvIGJlIGF0IGxlYXN0IHRocmVlIGh1bmRyZWQgeWVhcnMgb2xkLiBJdCBjb250YWlucyBhIHRlcnJpZnlpbmcgYW5kIGRlc3RydWN0aXZlIGZvcmNlIHRoYXQgbXVzdCBiZSBjb250cm9sbGVkIGF0IGFsbCBjb3N0cy6ULg==	2025-03-24 00:50:43+05:30
:1:book_summary_t4b69z5hs58C_bart_150_40	gAWV4AAAAAAAAACM3EEgZ3JvdXAgb2Ygc2NpZW50aXN0cyBpbnZlc3RpZ2F0ZSBhIHNwYWNlc2hpcCBkaXNjb3ZlcmVkIG9uIHRoZSBvY2VhbiBmbG9vci4gVGhlIHZlc3NlbCBhcHBlYXJzIHRvIGJlIGF0IGxlYXN0IHRocmVlIGh1bmRyZWQgeWVhcnMgb2xkLiBJdCBjb250YWlucyBhIHRlcnJpZnlpbmcgYW5kIGRlc3RydWN0aXZlIGZvcmNlIHRoYXQgbXVzdCBiZSBjb250cm9sbGVkIGF0IGFsbCBjb3N0cy6ULg==	2025-03-30 00:50:43+05:30
:1:summary_bart_5419371653987495683_150_40	gAWVyQAAAAAAAACMxVRoZSBMb3JkIG9mIHRoZSBSaW5nczogVGhlIFJpbmdzIG9mIFBvd2VyIHNlYXNvbiAyIG9uIFByaW1lIFZpZGVvLiBUaGUgdGhpcmQgcGFydCBvZiBKLlIuIFIuIFRvbGtpZW7igJlzIGVwaWMgYWR2ZW50dXJlIFRIRSBMT1JEIE9GIFRIRSBSSU5HUy4g4oCYRXh0cmFvcmRpbmFyaWx5IGltYWdpbmF0aXZlLCBhbmQgd2hvbGx5IGV4Y2l0aW5n4oCZlC4=	2025-03-24 01:21:55+05:30
:1:book_summary_dQkFLM8_5ZEC_bart_150_40	gAWVyQAAAAAAAACMxVRoZSBMb3JkIG9mIHRoZSBSaW5nczogVGhlIFJpbmdzIG9mIFBvd2VyIHNlYXNvbiAyIG9uIFByaW1lIFZpZGVvLiBUaGUgdGhpcmQgcGFydCBvZiBKLlIuIFIuIFRvbGtpZW7igJlzIGVwaWMgYWR2ZW50dXJlIFRIRSBMT1JEIE9GIFRIRSBSSU5HUy4g4oCYRXh0cmFvcmRpbmFyaWx5IGltYWdpbmF0aXZlLCBhbmQgd2hvbGx5IGV4Y2l0aW5n4oCZlC4=	2025-03-30 01:21:55+05:30
:1:summary_bart_4728596185705971934_150_40	gAWVMwEAAAAAAABYLAEAAE1laGFyLCBhIHlvdW5nIGJyaWRlIGluIHJ1cmFsIFB1bmphYiwgaXMgdHJ5aW5nIHRvIGRpc2NvdmVyIHRoZSBpZGVudGl0eSBvZiBoZXIgbmV3IGh1c2JhbmQuIE1laGFyJ3Mgc3RvcnkgaXMgdGhhdCBvZiBhIHlvdW5nIG1hbiB3aG8gaW4gMTk5OSBmbGVlcyBmcm9tIEVuZ2xhbmQgdG8gdGhlIGRlc2VydGVkIHN1bi1zY29yY2hlZCBmYXJtLiBDYW4gYSBzdW1tZXIgc3BlbnQgbGVhcm5pbmcgb2YgbG92ZSBhbmQgb2YgaGlzIGZhbWlseSdzIHBhc3QgZ2l2ZSBoaW0gdGhlIHN0cmVuZ3RoIGZvciB0aGUgam91cm5leSBob21lP5Qu	2025-03-24 13:01:28+05:30
:1:book_summary_gqX1DwAAQBAJ_bart_150_40	gAWVMwEAAAAAAABYLAEAAE1laGFyLCBhIHlvdW5nIGJyaWRlIGluIHJ1cmFsIFB1bmphYiwgaXMgdHJ5aW5nIHRvIGRpc2NvdmVyIHRoZSBpZGVudGl0eSBvZiBoZXIgbmV3IGh1c2JhbmQuIE1laGFyJ3Mgc3RvcnkgaXMgdGhhdCBvZiBhIHlvdW5nIG1hbiB3aG8gaW4gMTk5OSBmbGVlcyBmcm9tIEVuZ2xhbmQgdG8gdGhlIGRlc2VydGVkIHN1bi1zY29yY2hlZCBmYXJtLiBDYW4gYSBzdW1tZXIgc3BlbnQgbGVhcm5pbmcgb2YgbG92ZSBhbmQgb2YgaGlzIGZhbWlseSdzIHBhc3QgZ2l2ZSBoaW0gdGhlIHN0cmVuZ3RoIGZvciB0aGUgam91cm5leSBob21lP5Qu	2025-03-30 13:01:29+05:30
:1:summary_bart_3315436773579697598_150_40	gAWV1QAAAAAAAACM0VRoZSBwbGF5IHdpbGwgcmVjZWl2ZSBpdHMgd29ybGQgcHJlbWllcmUgaW4gTG9uZG9uJ3MgV2VzdCBFbmQgb24gSnVseSAzMCwgMjAxNi4gQmFzZWQgb24gYW4gb3JpZ2luYWwgbmV3IHN0b3J5IGJ5IEouSy4gUm93bGluZywgSm9obiBUaWZmYW55LCBhbmQgSmFjayBUaG9ybmUsIGl0IGlzIHRoZSBlaWdodGggc3RvcnkgaW4gdGhlIEhhcnJ5IFBvdHRlciBzZXJpZXMulC4=	2025-03-24 13:02:50+05:30
:1:book_summary_Jx1ojwEACAAJ_bart_150_40	gAWV1QAAAAAAAACM0VRoZSBwbGF5IHdpbGwgcmVjZWl2ZSBpdHMgd29ybGQgcHJlbWllcmUgaW4gTG9uZG9uJ3MgV2VzdCBFbmQgb24gSnVseSAzMCwgMjAxNi4gQmFzZWQgb24gYW4gb3JpZ2luYWwgbmV3IHN0b3J5IGJ5IEouSy4gUm93bGluZywgSm9obiBUaWZmYW55LCBhbmQgSmFjayBUaG9ybmUsIGl0IGlzIHRoZSBlaWdodGggc3RvcnkgaW4gdGhlIEhhcnJ5IFBvdHRlciBzZXJpZXMulC4=	2025-03-30 13:02:50+05:30
:1:summary_bart_-8246918005127744495_150_40	gAWVNwEAAAAAAABYMAEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBEaXZlcmdlbnQgc2VyaWVzIGhhcyBzb2xkIG1pbGxpb25zIG9mIGNvcGllcyB3b3JsZC13aWRlLiBJbiB0aGUgd29ybGQgb2YgRGl2ZXJnZW50LCBzb2NpZXR5IGlzIGRpdmlkZWQgaW50byBmaXZlIGZhY3Rpb25zIC0gQ2FuZG9yLCBBYm5lZ2F0aW9uLCBEYXVudGxlc3MsIEFtaXR5IGFuZCBFcnVkaXRlLiBFdmVyeSB5ZWFyLCBhbGwgc2l4dGVlbi15ZWFyLW9sZHMgbXVzdCBzZWxlY3QgdGhlIGZhY3Rpb24gdG8gd2hpY2ggdGhleSB3aWxsIGRldm90ZSB0aGUgcmVzdCBvZiB0aGVpciBsaXZlcy6ULg==	2025-03-24 15:58:44+05:30
:1:book_summary_uYwyjgEACAAJ_bart_150_40	gAWVNwEAAAAAAABYMAEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBEaXZlcmdlbnQgc2VyaWVzIGhhcyBzb2xkIG1pbGxpb25zIG9mIGNvcGllcyB3b3JsZC13aWRlLiBJbiB0aGUgd29ybGQgb2YgRGl2ZXJnZW50LCBzb2NpZXR5IGlzIGRpdmlkZWQgaW50byBmaXZlIGZhY3Rpb25zIC0gQ2FuZG9yLCBBYm5lZ2F0aW9uLCBEYXVudGxlc3MsIEFtaXR5IGFuZCBFcnVkaXRlLiBFdmVyeSB5ZWFyLCBhbGwgc2l4dGVlbi15ZWFyLW9sZHMgbXVzdCBzZWxlY3QgdGhlIGZhY3Rpb24gdG8gd2hpY2ggdGhleSB3aWxsIGRldm90ZSB0aGUgcmVzdCBvZiB0aGVpciBsaXZlcy6ULg==	2025-03-30 15:58:44+05:30
:1:summary_bart_8967494424864730041_150_40	gAWV5gAAAAAAAACM4kEgS05JR0hUIE9GIFRIRSBTRVZFTiBLSU5HRE9NUyBjb21waWxlcyB0aGUgZmlyc3QgdGhyZWUgb2ZmaWNpYWwgcHJlcXVlbCBub3ZlbGxhcyB0byBHZW9yZ2UgUi5SLiBNYXJ0aW7igJlzIG9uZ29pbmcgbWFzdGVyd29yaywgQSBTT05HIE9GIElDRSBBTkQgRklSRS4gQSBjZW50dXJ5IGJlZm9yZSBBIEdBTUUgT0YgVEhST05FUywgdHdvIHVubGlrZWx5IGhlcm9lcyB3YW5kZXJlZCBXZXN0ZXJvcy6ULg==	2025-03-24 16:11:03+05:30
:1:book_summary_mk-dBAAAQBAJ_bart_150_40	gAWV5gAAAAAAAACM4kEgS05JR0hUIE9GIFRIRSBTRVZFTiBLSU5HRE9NUyBjb21waWxlcyB0aGUgZmlyc3QgdGhyZWUgb2ZmaWNpYWwgcHJlcXVlbCBub3ZlbGxhcyB0byBHZW9yZ2UgUi5SLiBNYXJ0aW7igJlzIG9uZ29pbmcgbWFzdGVyd29yaywgQSBTT05HIE9GIElDRSBBTkQgRklSRS4gQSBjZW50dXJ5IGJlZm9yZSBBIEdBTUUgT0YgVEhST05FUywgdHdvIHVubGlrZWx5IGhlcm9lcyB3YW5kZXJlZCBXZXN0ZXJvcy6ULg==	2025-03-30 16:11:03+05:30
:1:summary_bart_-6270296408194654591_150_40	gAWV2wAAAAAAAACM10dlb3JnZSBSLiBSLiBNYXJ0aW4ncyBBIFNvbmcgb2YgSWNlIGFuZCBGaXJlIHNlcmllcyBoYXMgYmVjb21lLCBpbiBtYW55IHdheXMsIHRoZSBnb2xkIHN0YW5kYXJkIGZvciBtb2Rlcm4gZXBpYyBmYW50YXN5LiBJdCBpcyB0aGlzIHZlcnkgdml0YWxpdHkgdGhhdCBoYXMgbGVkIGl0IHRvIGJlIGFkYXB0ZWQgYXMgdGhlIEhCTyBtaW5pc2VyaWVzICJHYW1lIG9mIFRocm9uZXMilC4=	2025-03-24 16:28:39+05:30
:1:book_summary_9KWp0AEACAAJ_bart_150_40	gAWV2wAAAAAAAACM10dlb3JnZSBSLiBSLiBNYXJ0aW4ncyBBIFNvbmcgb2YgSWNlIGFuZCBGaXJlIHNlcmllcyBoYXMgYmVjb21lLCBpbiBtYW55IHdheXMsIHRoZSBnb2xkIHN0YW5kYXJkIGZvciBtb2Rlcm4gZXBpYyBmYW50YXN5LiBJdCBpcyB0aGlzIHZlcnkgdml0YWxpdHkgdGhhdCBoYXMgbGVkIGl0IHRvIGJlIGFkYXB0ZWQgYXMgdGhlIEhCTyBtaW5pc2VyaWVzICJHYW1lIG9mIFRocm9uZXMilC4=	2025-03-30 16:28:39+05:30
:1:summary_bart_-623873017515246785_150_40	gAWVEwEAAAAAAABYDAEAAEhhcnJ5IFBvdHRlciBhbmQgdGhlIERlYXRobHkgSGFsbG93cywgUGFydCAyIGlzIG91dCBub3cuIFRoZSBmaW5hbCBib29rIGluIHRoZSBIYXJyeSBQb3R0ZXIgc2VyaWVzLiBIYXJyeSBtdXN0IGZhY2UgYSBkZWFkbHkgY29uZnJvbnRhdGlvbiB0aGF0IGlzIGhpcyBhbG9uZSB0byBmaWdodC4gT25seSBieSBkZXN0cm95aW5nIFZvbGRlbW9ydCdzIHJlbWFpbmluZyBIb3JjcnV4ZXMgY2FuIEhhcnJ5IGZyZWUgaGltc2VsZiBhbmQgb3ZlcmNvbWUgdGhlIERhcmsgTG9yZC6ULg==	2025-03-25 07:27:34+05:30
:1:book_summary_GZAoAQAAIAAJ_bart_150_40	gAWVEwEAAAAAAABYDAEAAEhhcnJ5IFBvdHRlciBhbmQgdGhlIERlYXRobHkgSGFsbG93cywgUGFydCAyIGlzIG91dCBub3cuIFRoZSBmaW5hbCBib29rIGluIHRoZSBIYXJyeSBQb3R0ZXIgc2VyaWVzLiBIYXJyeSBtdXN0IGZhY2UgYSBkZWFkbHkgY29uZnJvbnRhdGlvbiB0aGF0IGlzIGhpcyBhbG9uZSB0byBmaWdodC4gT25seSBieSBkZXN0cm95aW5nIFZvbGRlbW9ydCdzIHJlbWFpbmluZyBIb3JjcnV4ZXMgY2FuIEhhcnJ5IGZyZWUgaGltc2VsZiBhbmQgb3ZlcmNvbWUgdGhlIERhcmsgTG9yZC6ULg==	2025-03-31 07:27:34+05:30
:1:summary_t5_-623873017515246785_100_30	gAWV1AAAAAAAAACM0GluIHRoaXMgZHJhbWF0aWMgY29uY2x1c2lvbiB0byB0aGUgc2VyaWVzLCBIYXJyeSBtdXN0IGxlYXZlIGhpcyBtb3N0IGxveWFsIGZyaWVuZHMgYmVoaW5kIC4gb25seSBieSBkZXN0cm95aW5nIFZvbGRlbW9ydCdzIHJlbWFpbmluZyBIb3JjcnV4ZXMgY2FuIGhlIGZyZWUgaGltc2VsZiBhbmQgb3ZlcmNvbWUgdGhlIERhcmsgTG9yZCdzIGZvcmNlcyBvZiBldmlsIC6ULg==	2025-03-25 07:28:09+05:30
:1:summary_bart_-7712409185755271497_150_40	gAWVqgEAAAAAAABYowEAAFRoZSBmaXJzdCB2b2x1bWUgb2YgVGhlIExvcmQgb2YgdGhlIFJpbmdzLCBub3cgZmVhdHVyaW5nIFRvbGtpZW4ncyBvcmlnaW5hbCB1bnVzZWQgZHVzdC1qYWNrZXQgZGVzaWduLiBJbmNsdWRlcyBzcGVjaWFsIHBhY2thZ2luZyBhbmQgdGhlIGRlZmluaXRpdmUgZWRpdGlvbiBvZiB0aGUgdGV4dCB3aXRoIGZvbGQtb3V0IG1hcCBhbmQgY29sb3VyIHBsYXRlIHNlY3Rpb24uIFNhdXJvbiwgdGhlIERhcmsgTG9yZCwgaGFzIGdhdGhlcmVkIHRvIGhpbSBhbGwgdGhlIFJpbmdzIG9mIFBvd2VyIC0gdGhlIG1lYW5zIGJ5IHdoaWNoIGhlIGludGVuZHMgdG8gcnVsZSBNaWRkbGUtZWFydGguIEFsbCBoZSBsYWNrcyBpbiBoaXMgcGxhbnMgZm9yIGRvbWluaW9uIGlzIHRoZSBPbmUgUmluZyAtIHRoZSByaW5nIHRoYXQgcnVsZXMgdGhlbSBhbGwulC4=	2025-03-25 07:29:57+05:30
:1:book_summary_bm2cPwAACAAJ_bart_150_40	gAWVqgEAAAAAAABYowEAAFRoZSBmaXJzdCB2b2x1bWUgb2YgVGhlIExvcmQgb2YgdGhlIFJpbmdzLCBub3cgZmVhdHVyaW5nIFRvbGtpZW4ncyBvcmlnaW5hbCB1bnVzZWQgZHVzdC1qYWNrZXQgZGVzaWduLiBJbmNsdWRlcyBzcGVjaWFsIHBhY2thZ2luZyBhbmQgdGhlIGRlZmluaXRpdmUgZWRpdGlvbiBvZiB0aGUgdGV4dCB3aXRoIGZvbGQtb3V0IG1hcCBhbmQgY29sb3VyIHBsYXRlIHNlY3Rpb24uIFNhdXJvbiwgdGhlIERhcmsgTG9yZCwgaGFzIGdhdGhlcmVkIHRvIGhpbSBhbGwgdGhlIFJpbmdzIG9mIFBvd2VyIC0gdGhlIG1lYW5zIGJ5IHdoaWNoIGhlIGludGVuZHMgdG8gcnVsZSBNaWRkbGUtZWFydGguIEFsbCBoZSBsYWNrcyBpbiBoaXMgcGxhbnMgZm9yIGRvbWluaW9uIGlzIHRoZSBPbmUgUmluZyAtIHRoZSByaW5nIHRoYXQgcnVsZXMgdGhlbSBhbGwulC4=	2025-03-31 07:29:57+05:30
:1:summary_bart_2614864494964930092_150_40	gAWVDgEAAAAAAABYBwEAAFZpa3RvciBLb3PDoXJlaywgYSBuZXdseSB0cmFpbmVkIHBzeWNoaWF0cmlzdCwgYXJyaXZlcyBhdCB0aGUgaW5mYW1vdXMgSHJhZCBPcmx1IEFzeWx1bSBmb3IgdGhlIENyaW1pbmFsbHkgSW5zYW5lLiBWaWt0b3IgaW50ZW5kcyB0byB1c2UgYSBuZXcgbWVkaWNhbCB0ZWNobmlxdWUgdG8gcHJvdmUgdGhhdCB0aGVzZSBwYXRpZW50cyBzaGFyZSBhIGNvbW1vbiBhcmNoZXR5cGUgb2YgZXZpbCwgYSBwaGVub21lbm9uIGhlIGNhbGxzIFRoZSBEZXZpbCBBc3BlY3QulC4=	2025-03-25 08:31:21+05:30
:1:book_summary_qOyNEAAAQBAJ_bart_150_40	gAWVDgEAAAAAAABYBwEAAFZpa3RvciBLb3PDoXJlaywgYSBuZXdseSB0cmFpbmVkIHBzeWNoaWF0cmlzdCwgYXJyaXZlcyBhdCB0aGUgaW5mYW1vdXMgSHJhZCBPcmx1IEFzeWx1bSBmb3IgdGhlIENyaW1pbmFsbHkgSW5zYW5lLiBWaWt0b3IgaW50ZW5kcyB0byB1c2UgYSBuZXcgbWVkaWNhbCB0ZWNobmlxdWUgdG8gcHJvdmUgdGhhdCB0aGVzZSBwYXRpZW50cyBzaGFyZSBhIGNvbW1vbiBhcmNoZXR5cGUgb2YgZXZpbCwgYSBwaGVub21lbm9uIGhlIGNhbGxzIFRoZSBEZXZpbCBBc3BlY3QulC4=	2025-03-31 08:31:21+05:30
:1:summary_bart_-7472003731640080503_150_40	gAWV7QAAAAAAAACM6UphbWVzIENsZWFyIGlzIG9uZSBvZiB0aGUgd29ybGQncyBsZWFkaW5nIGV4cGVydHMgb24gaGFiaXQgZm9ybWF0aW9uLiBIZSByZXZlYWxzIHByYWN0aWNhbCBzdHJhdGVnaWVzIHRoYXQgd2lsbCB0ZWFjaCB5b3UgZXhhY3RseSBob3cgdG8gZm9ybSBnb29kIGhhYml0cywgYnJlYWsgYmFkIG9uZXMsIGFuZCBtYXN0ZXIgdGhlIHRpbnkgYmVoYXZpb3JzIHRoYXQgbGVhZCB0byByZW1hcmthYmxlIHJlc3VsdHMulC4=	2025-03-25 08:31:35+05:30
:1:book_summary_XfFvDwAAQBAJ_bart_150_40	gAWV7QAAAAAAAACM6UphbWVzIENsZWFyIGlzIG9uZSBvZiB0aGUgd29ybGQncyBsZWFkaW5nIGV4cGVydHMgb24gaGFiaXQgZm9ybWF0aW9uLiBIZSByZXZlYWxzIHByYWN0aWNhbCBzdHJhdGVnaWVzIHRoYXQgd2lsbCB0ZWFjaCB5b3UgZXhhY3RseSBob3cgdG8gZm9ybSBnb29kIGhhYml0cywgYnJlYWsgYmFkIG9uZXMsIGFuZCBtYXN0ZXIgdGhlIHRpbnkgYmVoYXZpb3JzIHRoYXQgbGVhZCB0byByZW1hcmthYmxlIHJlc3VsdHMulC4=	2025-03-31 08:31:35+05:30
:1:summary_bart_-4195949240555156825_150_40	gAWVOwEAAAAAAABYNAEAAEluIDE5ODgsIEJlbmphbWluIFNtaXRoIHN1ZmZlcnMgYSBtYXNzaXZlIGhlYXJ0IGF0dGFjay4gSGUgaGFzIGFycmFuZ2VkIHRvIGhhdmUgaGlzIGJvZHkgZnJvemVuIHVudGlsIHRoZSBkYXkgd2hlbiBodW1hbml0eSB3aWxsIHBvc3Nlc3MgdGhlIGtub3dsZWRnZSwgdGhlIHRlY2hub2xvZ3ksIGFuZCB0aGUgY291cmFnZSB0byByZXZpdmUgaGltLiBXaGVuIEJlbiByZXN1bWVzIGxpZmUgYWZ0ZXIgYSBmcm96ZW4gaW50ZXJ2YWwgb2YgZWlnaHR5LXRocmVlIHllYXJzLCB0aGUgd29ybGQgaXMgYWx0ZXJlZCBiZXlvbmQgcmVjb2duaXRpb24ulC4=	2025-04-09 21:45:02+05:30
:1:book_summary_9EKTEAAAQBAJ_bart_150_40	gAWVOwEAAAAAAABYNAEAAEluIDE5ODgsIEJlbmphbWluIFNtaXRoIHN1ZmZlcnMgYSBtYXNzaXZlIGhlYXJ0IGF0dGFjay4gSGUgaGFzIGFycmFuZ2VkIHRvIGhhdmUgaGlzIGJvZHkgZnJvemVuIHVudGlsIHRoZSBkYXkgd2hlbiBodW1hbml0eSB3aWxsIHBvc3Nlc3MgdGhlIGtub3dsZWRnZSwgdGhlIHRlY2hub2xvZ3ksIGFuZCB0aGUgY291cmFnZSB0byByZXZpdmUgaGltLiBXaGVuIEJlbiByZXN1bWVzIGxpZmUgYWZ0ZXIgYSBmcm96ZW4gaW50ZXJ2YWwgb2YgZWlnaHR5LXRocmVlIHllYXJzLCB0aGUgd29ybGQgaXMgYWx0ZXJlZCBiZXlvbmQgcmVjb2duaXRpb24ulC4=	2025-04-15 21:45:02+05:30
:1:summary_bart_8318902801124230880_150_40	gAWVCQEAAAAAAABYAgEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBsYW5kbWFyayBzZXJpZXMgdGhhdCBoYXMgcmVkZWZpbmVkIGltYWdpbmF0aXZlIGZpY3Rpb24gYW5kIGJlY29tZSBhIG1vZGVybiBtYXN0ZXJwaWVjZS4gU3dlZXBpbmcgZnJvbSBhIGxhbmQgb2YgYnJ1dGFsIGNvbGQgdG8gYSBkaXN0YW50IHN1bW1lcnRpbWUga2luZ2RvbSBvZiBlcGljdXJlYW4gcGxlbnR5LCBoZXJlIGlzIGEgdGFsZSBvZiBsb3JkcyBhbmQgbGFkaWVzLCBzb2xkaWVycyBhbmQgc29yY2VyZXJzLpQu	2025-04-16 08:25:00+05:30
:1:book_summary_5NomkK4EV68C_bart_150_40	gAWVCQEAAAAAAABYAgEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBsYW5kbWFyayBzZXJpZXMgdGhhdCBoYXMgcmVkZWZpbmVkIGltYWdpbmF0aXZlIGZpY3Rpb24gYW5kIGJlY29tZSBhIG1vZGVybiBtYXN0ZXJwaWVjZS4gU3dlZXBpbmcgZnJvbSBhIGxhbmQgb2YgYnJ1dGFsIGNvbGQgdG8gYSBkaXN0YW50IHN1bW1lcnRpbWUga2luZ2RvbSBvZiBlcGljdXJlYW4gcGxlbnR5LCBoZXJlIGlzIGEgdGFsZSBvZiBsb3JkcyBhbmQgbGFkaWVzLCBzb2xkaWVycyBhbmQgc29yY2VyZXJzLpQu	2025-04-22 08:25:00+05:30
:1:summary_bart_713471985626200189_150_40	gAWVIgEAAAAAAABYGwEAAEhhcnJ5IFBvdHRlciBoYXMgbm8gaWRlYSBob3cgZmFtb3VzIGhlIGlzLiBUaGF0J3MgYmVjYXVzZSBoZSdzIGJlaW5nIHJhaXNlZCBieSBoaXMgbWlzZXJhYmxlIGF1bnQgYW5kIHVuY2xlIHdobyBhcmUgdGVycmlmaWVkIEhhcnJ5IHdpbGwgbGVhcm4gdGhhdCBoZSdzIHJlYWxseSBhIHdpemFyZCwganVzdCBhcyBoaXMgcGFyZW50cyB3ZXJlLiBCdXQgZXZlcnl0aGluZyBjaGFuZ2VzIHdoZW4gSGFycnkgaXMgc3VtbW9uZWQgdG8gYXR0ZW5kIGFuIGluZmFtb3VzIHNjaG9vbCBmb3Igd2l6YXJkcy6ULg==	2025-04-16 10:23:48+05:30
:1:book_summary_FrSPEAAAQBAJ_bart_150_40	gAWVIgEAAAAAAABYGwEAAEhhcnJ5IFBvdHRlciBoYXMgbm8gaWRlYSBob3cgZmFtb3VzIGhlIGlzLiBUaGF0J3MgYmVjYXVzZSBoZSdzIGJlaW5nIHJhaXNlZCBieSBoaXMgbWlzZXJhYmxlIGF1bnQgYW5kIHVuY2xlIHdobyBhcmUgdGVycmlmaWVkIEhhcnJ5IHdpbGwgbGVhcm4gdGhhdCBoZSdzIHJlYWxseSBhIHdpemFyZCwganVzdCBhcyBoaXMgcGFyZW50cyB3ZXJlLiBCdXQgZXZlcnl0aGluZyBjaGFuZ2VzIHdoZW4gSGFycnkgaXMgc3VtbW9uZWQgdG8gYXR0ZW5kIGFuIGluZmFtb3VzIHNjaG9vbCBmb3Igd2l6YXJkcy6ULg==	2025-04-22 10:23:48+05:30
:1:book_summary_FrSPEAAAQBAJ_t5_150_40	gAWVYgAAAAAAAACMXkVycm9yIGdlbmVyYXRpbmcgc3VtbWFyeTogJ21vZHVsZScgb2JqZWN0IGlzIG5vdCBjYWxsYWJsZS4gRGlkIHlvdSBtZWFuOiAncmFuZG9tLnJhbmRvbSguLi4pJz+ULg==	2025-04-22 10:38:00+05:30
:1:summary_t5_-4016410342034840928_150_40	gAWV5wEAAAAAAABY4AEAAGluLWRlcHRoIGtub3dsZWRnZSBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZiB0aGUgc3BlY2lmaWNzIG9mIHRoZSBzcGVjaWZpY3Mgb2YgdGhlIHNwZWNpZmljcyBvZpQu	2025-04-20 15:56:38+05:30
:1:summary_bart_6753820810148935496_150_40	gAWVSAEAAAAAAABYQQEAAFRyZXZvciBSdWxlIGhhcyBmYWxsZW4gaW4gbG92ZSB3aXRoIGEgd29tYW4gaGUnZCBuZXZlciBzZWVtLS1qdXN0IHJlYWRpbmcgdGhlIGxvdmUgbGV0dGVycyBzaGUnZCB3cml0dGVuIHRvIGhlciBodXNiYW5kLiBIZSBuZWVkZWQgdG8gcHJvdmUgdG8gS3lsYSB0aGF0IGhlIGxvdmVkIGhlciBlbm91Z2ggdG8gbWFyeSBoZXIgYW5kIGJlIGEgZmF0aGVyIHRvIGhlciBiYWJ5LiBCdXQgVHJldm9yIHdhcyBoYXJib3JpbmcgYSBzZWNyZXQsIGEgc2VjcmV0IHdpdGggdGhlIHBvd2VyIHRvIGRlc3Ryb3kgd2hhdCBoZSB3YXMgdHJ5aW5nIHNvIGhhcmQgdG8gY3JlYXRlLpQu	2025-04-20 15:57:16+05:30
:1:book_summary_QES7mCcS4EwC_bart_150_40	gAWVSAEAAAAAAABYQQEAAFRyZXZvciBSdWxlIGhhcyBmYWxsZW4gaW4gbG92ZSB3aXRoIGEgd29tYW4gaGUnZCBuZXZlciBzZWVtLS1qdXN0IHJlYWRpbmcgdGhlIGxvdmUgbGV0dGVycyBzaGUnZCB3cml0dGVuIHRvIGhlciBodXNiYW5kLiBIZSBuZWVkZWQgdG8gcHJvdmUgdG8gS3lsYSB0aGF0IGhlIGxvdmVkIGhlciBlbm91Z2ggdG8gbWFyeSBoZXIgYW5kIGJlIGEgZmF0aGVyIHRvIGhlciBiYWJ5LiBCdXQgVHJldm9yIHdhcyBoYXJib3JpbmcgYSBzZWNyZXQsIGEgc2VjcmV0IHdpdGggdGhlIHBvd2VyIHRvIGRlc3Ryb3kgd2hhdCBoZSB3YXMgdHJ5aW5nIHNvIGhhcmQgdG8gY3JlYXRlLpQu	2025-04-26 15:57:16+05:30
:1:summary_t5_6753820810148935496_150_40	gAWVMwAAAAAAAACML24uIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEulC4=	2025-04-20 15:57:41+05:30
:1:book_summary_QES7mCcS4EwC_t5_150_40	gAWVMwAAAAAAAACML24uIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEulC4=	2025-04-26 15:57:41+05:30
:1:summary_t5_-357921906815868248_150_40	gAWVMwAAAAAAAACML24uIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEuIGEulC4=	2025-04-20 15:59:02+05:30
:1:summary_bart_-118076566136615266_150_40	gAWV4AAAAAAAAACM3DEyLXllYXItb2xkIEFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bC4gSGUncyBmYWlsZWQgdG8gZG8gc28gdGhyb3VnaCBhY2FkZW1pYSBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUgYW5udWFsIGtpdGUgZmlnaHRpbmcgdG91cm5hbWVudC6ULg==	2025-04-20 16:01:49+05:30
:1:book_summary_MH48bnzN0LUC_bart_150_40	gAWV4AAAAAAAAACM3DEyLXllYXItb2xkIEFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bC4gSGUncyBmYWlsZWQgdG8gZG8gc28gdGhyb3VnaCBhY2FkZW1pYSBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUgYW5udWFsIGtpdGUgZmlnaHRpbmcgdG91cm5hbWVudC6ULg==	2025-04-26 16:01:49+05:30
:1:summary_t5_-118076566136615266_150_40	gAWV4gAAAAAAAACM3jEyLXllYXItb2xkIGFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bCAuIGhlJ3MgZmFpbGVkIHRvIGRvIHNvIHRocm91Z2ggYWNhZGVtaWEgb3IgYnJhd24gYnV0IHRoZSBvbmUgYXJlYSB0aGV5IGNvbm5lY3QgaXMgdGhlIGFubnVhbCBraXRlIGZpZ2h0aW5nIHRvdXJuYW1lbnQgLpQu	2025-04-20 16:02:01+05:30
:1:book_summary_MH48bnzN0LUC_t5_150_40	gAWV4gAAAAAAAACM3jEyLXllYXItb2xkIGFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bCAuIGhlJ3MgZmFpbGVkIHRvIGRvIHNvIHRocm91Z2ggYWNhZGVtaWEgb3IgYnJhd24gYnV0IHRoZSBvbmUgYXJlYSB0aGV5IGNvbm5lY3QgaXMgdGhlIGFubnVhbCBraXRlIGZpZ2h0aW5nIHRvdXJuYW1lbnQgLpQu	2025-04-26 16:02:01+05:30
:1:summary_t5_-118076566136615266_240_65	gAWVRgEAAAAAAABYPwEAADEyLXllYXItb2xkIGFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bCAuIGhlJ3MgZmFpbGVkIHRvIGRvIHNvIHRocm91Z2ggYWNhZGVtaWEgb3IgYnJhd24gYnV0IHRoZSBvbmUgYXJlYSB0aGV5IGNvbm5lY3QgaXMgdGhlIGFubnVhbCBraXRlIGZpZ2h0aW5nIHRvdXJuYW1lbnQgLiBoZSdzIGZhaWxlZCB0byBkbyBzbyB0aHJvdWdoIGFjYWRlbWljcyBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyBraXRlIGZpZ2h0aW5nIC6ULg==	2025-04-20 16:02:32+05:30
:1:summary_bart_2832968733806488607_150_40	gAWVFAEAAAAAAABYDQEAAFJhcmUgZWRpdGlvbiB3aXRoIHVuaXF1ZSBpbGx1c3RyYXRpb25zLiBUaGlzIGlzIHRoZSBzdG9yeSBvZiBhbiBVbmRlcndhdGVyIFRvdXIgb2YgdGhlIFdvcmxkIGFuZCBpcyBhIGNsYXNzaWMgc2NpZW5jZSBmaWN0aW9uIG5vdmVsIGJ5IEZyZW5jaCB3cml0ZXIgSnVsZXMgVmVybmUgcHVibGlzaGVkIGluIDE4NzAuIEl0IGlzIHJlZ2FyZGVkIGFzIG9uZSBvZiB0aGUgcHJlbWllcmUgYWR2ZW50dXJlIG5vdmVscyBhbmQgb25lIG9mIFZlcm5lJ3MgZ3JlYXRlc3Qgd29ya3MulC4=	2025-04-20 16:13:53+05:30
:1:book_summary_os5CuQEACAAJ_bart_150_40	gAWVFAEAAAAAAABYDQEAAFJhcmUgZWRpdGlvbiB3aXRoIHVuaXF1ZSBpbGx1c3RyYXRpb25zLiBUaGlzIGlzIHRoZSBzdG9yeSBvZiBhbiBVbmRlcndhdGVyIFRvdXIgb2YgdGhlIFdvcmxkIGFuZCBpcyBhIGNsYXNzaWMgc2NpZW5jZSBmaWN0aW9uIG5vdmVsIGJ5IEZyZW5jaCB3cml0ZXIgSnVsZXMgVmVybmUgcHVibGlzaGVkIGluIDE4NzAuIEl0IGlzIHJlZ2FyZGVkIGFzIG9uZSBvZiB0aGUgcHJlbWllcmUgYWR2ZW50dXJlIG5vdmVscyBhbmQgb25lIG9mIFZlcm5lJ3MgZ3JlYXRlc3Qgd29ya3MulC4=	2025-04-26 16:13:53+05:30
:1:summary_t5_2832968733806488607_200_60	gAWV/QAAAAAAAACM+XRoaXMgaXMgdGhlIHN0b3J5IG9mIGFuIFVuZGVyd2F0ZXIgVG91ciBvZiB0aGUgV29ybGQgLiBpdCB0ZWxscyB0aGUgc3Rvcnkgb2YgQ2FwdGFpbiBOZW1vIGFuZCBoaXMgc3VibWFyaW5lIE5hdXRpbHVzIC4gdGhlIGJvb2sgaXMgcmVnYXJkZWQgYXMgb25lIG9mIHRoZSBwcmVtaWVyZSBhZHZlbnR1cmUgbm92ZWxzIG9mIHRoZSAxODcwcyAuIGl0IGlzIGFsc28gcmVnYXJkZWQgYXMgb25lIG9mIFZlcm5lJ3MgZ3JlYXRlc3Qgd29ya3MgLpQu	2025-04-20 16:14:12+05:30
:1:summary_bart_896210953220901518_150_40	gAWV/AAAAAAAAACM+FRoZSBwcmVzZW50IGVkaXRpb24gcHJvdmlkZXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IGZyb20gZWFybGllc3QgbWFudXNjcmlwdCB0byBmaW5hbCBsaWZldGltZSBwcmludGluZyBvZiB0aGUgcG9lbXMgcHVibGlzaGVkIGluIHRoZSBlcG9jaGFsIEx5cmljYWwgQmFsbGFkcy4gRm9yIHRob3NlIHBvZW1zIG9yaWdpbmFsbHkgcHVibGlzaGVkIGluIDE4MDAsIHRoaXMgZWRpdGlvbiBpcyB0aGUgZmlyc3QulC4=	2025-04-22 16:08:53+05:30
:1:book_summary_741bAAAAMAAJ_bart_150_40	gAWV/AAAAAAAAACM+FRoZSBwcmVzZW50IGVkaXRpb24gcHJvdmlkZXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IGZyb20gZWFybGllc3QgbWFudXNjcmlwdCB0byBmaW5hbCBsaWZldGltZSBwcmludGluZyBvZiB0aGUgcG9lbXMgcHVibGlzaGVkIGluIHRoZSBlcG9jaGFsIEx5cmljYWwgQmFsbGFkcy4gRm9yIHRob3NlIHBvZW1zIG9yaWdpbmFsbHkgcHVibGlzaGVkIGluIDE4MDAsIHRoaXMgZWRpdGlvbiBpcyB0aGUgZmlyc3QulC4=	2025-04-28 16:08:53+05:30
:1:summary_t5_896210953220901518_150_40	gAWVUQEAAAAAAABYSgEAAHRoZSBwcmVzZW50IGVkaXRpb24gcHJvdmlkZXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IGZyb20gZWFybGllc3QgbWFudXNjcmlwdCB0byBmaW5hbCBsaWZldGltZSBwcmludGluZyAuIGZvciB0aG9zZSBwb2VtcyBvcmlnaW5hbGx5IHB1Ymxpc2hlZCBpbiAxODAwLCB0aGlzIGVkaXRpb24gaXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IC4gZm9yIHRob3NlIHBvZW1zIG9yaWdpbmFsbHkgcHVibGlzaGVkIGluIDE4MDAsIHRoaXMgZWRpdGlvbiBpcyB0aGUgZmlyc3QgY29tcHJlaGVuc2l2ZSB0ZXh0dWFsIGhpc3RvcnkgLpQu	2025-04-22 16:09:13+05:30
:1:book_summary_741bAAAAMAAJ_t5_150_40	gAWVUQEAAAAAAABYSgEAAHRoZSBwcmVzZW50IGVkaXRpb24gcHJvdmlkZXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IGZyb20gZWFybGllc3QgbWFudXNjcmlwdCB0byBmaW5hbCBsaWZldGltZSBwcmludGluZyAuIGZvciB0aG9zZSBwb2VtcyBvcmlnaW5hbGx5IHB1Ymxpc2hlZCBpbiAxODAwLCB0aGlzIGVkaXRpb24gaXMgdGhlIGZpcnN0IGNvbXByZWhlbnNpdmUgdGV4dHVhbCBoaXN0b3J5IC4gZm9yIHRob3NlIHBvZW1zIG9yaWdpbmFsbHkgcHVibGlzaGVkIGluIDE4MDAsIHRoaXMgZWRpdGlvbiBpcyB0aGUgZmlyc3QgY29tcHJlaGVuc2l2ZSB0ZXh0dWFsIGhpc3RvcnkgLpQu	2025-04-28 16:09:13+05:30
:1:summary_t5_1963433815138622787_290_90	gAWVvgEAAAAAAABYtwEAADEyLXllYXItb2xkIGFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bCAuIGhlJ3MgZmFpbGVkIHRvIGRvIHNvIHRocm91Z2ggYWNhZGVtaWEgb3IgYnJhd24gYnV0IHRoZSBvbmUgYXJlYSB0aGV5IGNvbm5lY3QgaXMgdGhlIGFubnVhbCBraXRlIGZpZ2h0aW5nIHRvdXJuYW1lbnQgLiBoZSdzIGZhaWxlZCB0byBkbyBzbyB0aHJvdWdoIGFjYWRlbWljcyBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUga2l0ZSBmaWdodGluZyB0b3VybmFtZW50IC4gaGUncyBmYWlsZWQgdG8gZG8gc28gdGhyb3VnaCBhY2FkZW1pYSBvciBicmF3biBidXQgdGhlIG9uZSBhcmVhIHRoZXkgY29ubmVjdCBpcyB0aGUgYW5udWFsIGtpdGUgZmlnaHRpbmeULg==	2025-04-22 16:10:07+05:30
:1:summary_t5_1963433815138622787_180_45	gAWV4gAAAAAAAACM3jEyLXllYXItb2xkIGFtaXIgaXMgZGVzcGVyYXRlIHRvIHdpbiB0aGUgYXBwcm92YWwgb2YgaGlzIGZhdGhlciwgb25lIG9mIHRoZSByaWNoZXN0IG1lcmNoYW50cyBpbiBLYWJ1bCAuIGhlJ3MgZmFpbGVkIHRvIGRvIHNvIHRocm91Z2ggYWNhZGVtaWEgb3IgYnJhd24gYnV0IHRoZSBvbmUgYXJlYSB0aGV5IGNvbm5lY3QgaXMgdGhlIGFubnVhbCBraXRlIGZpZ2h0aW5nIHRvdXJuYW1lbnQgLpQu	2025-04-22 16:10:29+05:30
:1:summary_bart_-1817757878929525603_150_40	gAWVOQEAAAAAAABYMgEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBEaXZlcmdlbnQgc2VyaWVzIGhhcyBzb2xkIG1pbGxpb25zIG9mIGNvcGllcyB3b3JsZC13aWRlLiBJbiB0aGUgd29ybGQgb2YgRGl2ZXJnZW50LCBzb2NpZXR5IGlzIGRpdmlkZWQgaW50byBmaXZlIGZhY3Rpb25zIOKAkyBDYW5kb3IsIEFibmVnYXRpb24sIERhdW50bGVzcywgQW1pdHkgYW5kIEVydWRpdGUuIEV2ZXJ5IHllYXIsIGFsbCBzaXh0ZWVuLXllYXItb2xkcyBtdXN0IHNlbGVjdCB0aGUgZmFjdGlvbiB0byB3aGljaCB0aGV5IHdpbGwgZGV2b3RlIHRoZSByZXN0IG9mIHRoZWlyIGxpdmVzLpQu	2025-04-22 16:11:27+05:30
:1:book_summary_OX8lAAAAQBAJ_bart_150_40	gAWVOQEAAAAAAABYMgEAAFRoZSBmaXJzdCBib29rIGluIHRoZSBEaXZlcmdlbnQgc2VyaWVzIGhhcyBzb2xkIG1pbGxpb25zIG9mIGNvcGllcyB3b3JsZC13aWRlLiBJbiB0aGUgd29ybGQgb2YgRGl2ZXJnZW50LCBzb2NpZXR5IGlzIGRpdmlkZWQgaW50byBmaXZlIGZhY3Rpb25zIOKAkyBDYW5kb3IsIEFibmVnYXRpb24sIERhdW50bGVzcywgQW1pdHkgYW5kIEVydWRpdGUuIEV2ZXJ5IHllYXIsIGFsbCBzaXh0ZWVuLXllYXItb2xkcyBtdXN0IHNlbGVjdCB0aGUgZmFjdGlvbiB0byB3aGljaCB0aGV5IHdpbGwgZGV2b3RlIHRoZSByZXN0IG9mIHRoZWlyIGxpdmVzLpQu	2025-04-28 16:11:27+05:30
:1:summary_t5_-1817757878929525603_150_40	gAWVCAEAAAAAAABYAQEAAFZlcm9uaWNhIFJvdGggYnVyc3Qgb250byB0aGUgc2NlbmUgd2l0aCB0aGUgZmlyc3QgYm9vayBpbiB0aGUgc2VyaWVzIHRoYXQgaGFzIHN3ZXB0IHRoZSBnbG9iZSDigJMgc2VsbGluZyBtaWxsaW9ucyBvZiBjb3BpZXMgd29ybGQtd2lkZSAuIGluIHRoZSB3b3JsZCBvZiBEaXZlcmdlbnQsIHNvY2lldHkgaXMgZGl2aWRlZCBpbnRvIGZpdmUgZmFjdGlvbnMg4oCTIENhbmRvciwgQWJuZWdhdGlvbiwgRGF1bnRsZXNzLCBBbWl0eSBhbmQgRXJ1ZGl0ZSAulC4=	2025-04-22 16:11:57+05:30
:1:book_summary_OX8lAAAAQBAJ_t5_150_40	gAWVCAEAAAAAAABYAQEAAFZlcm9uaWNhIFJvdGggYnVyc3Qgb250byB0aGUgc2NlbmUgd2l0aCB0aGUgZmlyc3QgYm9vayBpbiB0aGUgc2VyaWVzIHRoYXQgaGFzIHN3ZXB0IHRoZSBnbG9iZSDigJMgc2VsbGluZyBtaWxsaW9ucyBvZiBjb3BpZXMgd29ybGQtd2lkZSAuIGluIHRoZSB3b3JsZCBvZiBEaXZlcmdlbnQsIHNvY2lldHkgaXMgZGl2aWRlZCBpbnRvIGZpdmUgZmFjdGlvbnMg4oCTIENhbmRvciwgQWJuZWdhdGlvbiwgRGF1bnRsZXNzLCBBbWl0eSBhbmQgRXJ1ZGl0ZSAulC4=	2025-04-28 16:11:57+05:30
:1:summary_bart_-5506163382029265089_150_40	gAWV7gAAAAAAAACM6kFubmUgRnJhbmsncyBkaWFyeSBoYXMgbW92ZWQgbWlsbGlvbnMgd2l0aCBpdHMgdGVzdGFtZW50IHRvIHRoZSBodW1hbiBzcGlyaXQncyBpbmRlc3RydWN0aWJpbGl0eS4gVGhpcyBuZXcgdHJhbnNsYXRpb24sIHBlcmZvcm1lZCBieSBXaW5vbmEgUnlkZXIsIHJlc3RvcmVzIG5lYXJseSBvbmUgdGhpcmQgb2YgQW5uZSdzIGVudHJpZXMgZXhjaXNlZCBieSBoZXIgZmF0aGVyIGluIHByZXZpb3VzIGVkaXRpb25zLpQu	2025-04-24 00:14:34+05:30
:1:book_summary__GmDPwAACAAJ_bart_150_40	gAWV7gAAAAAAAACM6kFubmUgRnJhbmsncyBkaWFyeSBoYXMgbW92ZWQgbWlsbGlvbnMgd2l0aCBpdHMgdGVzdGFtZW50IHRvIHRoZSBodW1hbiBzcGlyaXQncyBpbmRlc3RydWN0aWJpbGl0eS4gVGhpcyBuZXcgdHJhbnNsYXRpb24sIHBlcmZvcm1lZCBieSBXaW5vbmEgUnlkZXIsIHJlc3RvcmVzIG5lYXJseSBvbmUgdGhpcmQgb2YgQW5uZSdzIGVudHJpZXMgZXhjaXNlZCBieSBoZXIgZmF0aGVyIGluIHByZXZpb3VzIGVkaXRpb25zLpQu	2025-04-30 00:14:34+05:30
:1:summary_t5_-5506163382029265089_150_40	gAWVxQAAAAAAAACMwXRoaXMgbmV3IHRyYW5zbGF0aW9uIHJlc3RvcmVzIG5lYXJseSBvbmUgdGhpcmQgb2YgQW5uZSdzIGVudHJpZXMgZXhjaXNlZCBieSBoZXIgZmF0aGVyIGluIHByZXZpb3VzIGVkaXRpb25zIC4gcmV2ZWFsaW5nIGhlciBidXJnZW9uaW5nIHNleHVhbGl0eSwgc3Rvcm15IHJlbGF0aW9uc2hpcCB3aXRoIGhlciBtb3RoZXIsIGFuZCBtb3JlIC6ULg==	2025-04-24 00:15:15+05:30
:1:book_summary__GmDPwAACAAJ_t5_150_40	gAWVxQAAAAAAAACMwXRoaXMgbmV3IHRyYW5zbGF0aW9uIHJlc3RvcmVzIG5lYXJseSBvbmUgdGhpcmQgb2YgQW5uZSdzIGVudHJpZXMgZXhjaXNlZCBieSBoZXIgZmF0aGVyIGluIHByZXZpb3VzIGVkaXRpb25zIC4gcmV2ZWFsaW5nIGhlciBidXJnZW9uaW5nIHNleHVhbGl0eSwgc3Rvcm15IHJlbGF0aW9uc2hpcCB3aXRoIGhlciBtb3RoZXIsIGFuZCBtb3JlIC6ULg==	2025-04-30 00:15:15+05:30
:1:summary_bart_-5506163382029265089_200_60	gAWVSQEAAAAAAABYQgEAAEFubmUgRnJhbmsncyBkaWFyeSBoYXMgbW92ZWQgbWlsbGlvbnMgd2l0aCBpdHMgdGVzdGFtZW50IHRvIHRoZSBodW1hbiBzcGlyaXQncyBpbmRlc3RydWN0aWJpbGl0eS4gVGhpcyBuZXcgdHJhbnNsYXRpb24sIHBlcmZvcm1lZCBieSBXaW5vbmEgUnlkZXIsIHJlc3RvcmVzIG5lYXJseSBvbmUgdGhpcmQgb2YgQW5uZSdzIGVudHJpZXMgZXhjaXNlZCBieSBoZXIgZmF0aGVyIGluIHByZXZpb3VzIGVkaXRpb25zLiBJdCByZXZlYWxzIGhlciBidXJnZW9uaW5nIHNleHVhbGl0eSwgaGVyIHN0b3JteSByZWxhdGlvbnNoaXAgd2l0aCBoZXIgbW90aGVyLCBhbmQgbW9yZS6ULg==	2025-04-24 00:16:17+05:30
:1:summary_bart_-4650315626690974319_150_40	gAWVSAEAAAAAAABYQQEAAFRoaXMgYm9vayBsb29rcyBhdCBzb2NpYWwgcmVwcmVzZW50YXRpb25zIG9mIHJvbWFudGljIGxvdmUgYXMgcG9ydHJheWVkIGluIGZpbG1zIGFuZCBpbnRlcnByZXRlZCBieSB0aGVpciBhdWRpZW5jZXMuIEl0IHVzZXMgY2luZW1hIGFzIGEgbWVhbnMgZm9yIGFuYWx5c2luZyB0aGUgc3RhdGUgb2Ygcm9tYW50aWNMb3ZlIHRvZGF5LiBDb25jZXJucyBhbmQgZGViYXRlcyBvdmVyIG1vbm9nYW15LCB0aGUgdGVsZW9sb2d5IHJvbWFudGljIGxvdmUgYW5kIHRoZSBkaXZpc2lvbiBvZiBsYWJvdXIgaW4gcmVsYXRpb25zaGlwcyBwZXJjb2xhdGUgaW4gdGhpcyBib29rLpQu	2025-04-24 00:18:00+05:30
:1:book_summary_q_kvEAAAQBAJ_bart_150_40	gAWVSAEAAAAAAABYQQEAAFRoaXMgYm9vayBsb29rcyBhdCBzb2NpYWwgcmVwcmVzZW50YXRpb25zIG9mIHJvbWFudGljIGxvdmUgYXMgcG9ydHJheWVkIGluIGZpbG1zIGFuZCBpbnRlcnByZXRlZCBieSB0aGVpciBhdWRpZW5jZXMuIEl0IHVzZXMgY2luZW1hIGFzIGEgbWVhbnMgZm9yIGFuYWx5c2luZyB0aGUgc3RhdGUgb2Ygcm9tYW50aWNMb3ZlIHRvZGF5LiBDb25jZXJucyBhbmQgZGViYXRlcyBvdmVyIG1vbm9nYW15LCB0aGUgdGVsZW9sb2d5IHJvbWFudGljIGxvdmUgYW5kIHRoZSBkaXZpc2lvbiBvZiBsYWJvdXIgaW4gcmVsYXRpb25zaGlwcyBwZXJjb2xhdGUgaW4gdGhpcyBib29rLpQu	2025-04-30 00:18:00+05:30
:1:summary_bart_1036832066633658964_150_40	gAWV1AEAAAAAAABYzQEAAFRoaXMgZWJvb2sgc2hvcnQgc3RvcnksIGFsc28gYXZhaWxhYmxlIGluIHRoZSBuZXcsIGNvbXBsZXRlIEphY2sgUmVhY2hlciBzaG9ydCBzdG9yeSBjb2xsZWN0aW9uIE5vIE1pZGRsZSBOYW1lLCBnb2VzIGJhY2sgdG8gMTk4OS4gQSB5b3VuZyBsaWV1dGVuYW50IGNvbG9uZWwsIGluIGEgc3R5bGlzaCBoYW5kbWFkZSB1bmlmb3JtLCByb2FycyB0aHJvdWdoIHRoZSBkYW1wIHdvb2RzIG9mIEdlb3JnaWEgaW4gaGVyIG5ldyBzaWx2ZXIgUG9yc2NoZS4gVW50aWwgc2hlIG1lZXRzIGEgdmVyeSB0YWxsIHNvbGRpZXIgd2l0aCBhIGJyb2tlbi1kb3duIGNhci4gV2hhdCBjb3VsZCBjb25uZWN0IGEgY29sZC1ibG9vZGVkIG9mZi1wb3N0IHNob290aW5nIHdpdGggUmVhY2hlciwgaGlzIGVsZGVyIGJyb3RoZXIgSm9lLCBhbmQgYSBzZWNyZXRpdmUgdW5pdCBvZiBwb2ludHktaGVhZHMgZnJvbSB0aGUgUGVudGFnb24/lC4=	2025-04-24 00:20:36+05:30
:1:book_summary_ttjnCQAAQBAJ_bart_150_40	gAWV1AEAAAAAAABYzQEAAFRoaXMgZWJvb2sgc2hvcnQgc3RvcnksIGFsc28gYXZhaWxhYmxlIGluIHRoZSBuZXcsIGNvbXBsZXRlIEphY2sgUmVhY2hlciBzaG9ydCBzdG9yeSBjb2xsZWN0aW9uIE5vIE1pZGRsZSBOYW1lLCBnb2VzIGJhY2sgdG8gMTk4OS4gQSB5b3VuZyBsaWV1dGVuYW50IGNvbG9uZWwsIGluIGEgc3R5bGlzaCBoYW5kbWFkZSB1bmlmb3JtLCByb2FycyB0aHJvdWdoIHRoZSBkYW1wIHdvb2RzIG9mIEdlb3JnaWEgaW4gaGVyIG5ldyBzaWx2ZXIgUG9yc2NoZS4gVW50aWwgc2hlIG1lZXRzIGEgdmVyeSB0YWxsIHNvbGRpZXIgd2l0aCBhIGJyb2tlbi1kb3duIGNhci4gV2hhdCBjb3VsZCBjb25uZWN0IGEgY29sZC1ibG9vZGVkIG9mZi1wb3N0IHNob290aW5nIHdpdGggUmVhY2hlciwgaGlzIGVsZGVyIGJyb3RoZXIgSm9lLCBhbmQgYSBzZWNyZXRpdmUgdW5pdCBvZiBwb2ludHktaGVhZHMgZnJvbSB0aGUgUGVudGFnb24/lC4=	2025-04-30 00:20:36+05:30
:1:summary_bart_4079309330403942931_150_40	gAWVKwEAAAAAAABYJAEAAFRoZSB3b3JsZCdzIG1vc3QgZmFtb3VzIHRyYXZlbGxpbmcgcmVwb3J0ZXIgbXVzdCB1bmVhcnRoIHRoZSB0cnV0aCBiZWhpbmQgdGhlIHN0cmFuZ2UgY2lnYXJzIGJlYXJpbmcgYSBwaGFyYW9oJ3Mgc3ltYm9sLiBUaGUgQWR2ZW50dXJlcyBvZiBUaW50aW4gY29udGludWUgdG8gY2hhcm0gbW9yZSB0aGFuIDgwIHllYXJzIGFmdGVyIHRoZXkgZmlyc3QgZm91bmQgdGhlaXIgd2F5IGludG8gcHVibGljYXRpb24uIFNpbmNlIHRoZW4gYW4gZXN0aW1hdGVkIDIzMCBtaWxsaW9uIGNvcGllcyBoYXZlIGJlZW4gc29sZC6ULg==	2025-04-24 00:28:51+05:30
:1:book_summary_YNHCkgEACAAJ_bart_150_40	gAWVKwEAAAAAAABYJAEAAFRoZSB3b3JsZCdzIG1vc3QgZmFtb3VzIHRyYXZlbGxpbmcgcmVwb3J0ZXIgbXVzdCB1bmVhcnRoIHRoZSB0cnV0aCBiZWhpbmQgdGhlIHN0cmFuZ2UgY2lnYXJzIGJlYXJpbmcgYSBwaGFyYW9oJ3Mgc3ltYm9sLiBUaGUgQWR2ZW50dXJlcyBvZiBUaW50aW4gY29udGludWUgdG8gY2hhcm0gbW9yZSB0aGFuIDgwIHllYXJzIGFmdGVyIHRoZXkgZmlyc3QgZm91bmQgdGhlaXIgd2F5IGludG8gcHVibGljYXRpb24uIFNpbmNlIHRoZW4gYW4gZXN0aW1hdGVkIDIzMCBtaWxsaW9uIGNvcGllcyBoYXZlIGJlZW4gc29sZC6ULg==	2025-04-30 00:28:51+05:30
:1:summary_t5_4079309330403942931_150_40	gAWV3AAAAAAAAACM2HRoZSBhZHZlbnR1cmVzIG9mIFRpbnRpbiBjb250aW51ZSB0byBjaGFybSBtb3JlIHRoYW4gODAgeWVhcnMgYWZ0ZXIgdGhleSBmaXJzdCBmb3VuZCB0aGVpciB3YXkgaW50byBwdWJsaWNhdGlvbiAuIGFuIGVzdGltYXRlZCAyMzAgbWlsbGlvbiBjb3BpZXMgaGF2ZSBiZWVuIHNvbGQsIHByb3ZpbmcgY29taWMgYm9va3MgaGF2ZSB0aGUgc2FtZSBwb3dlciB0byBlbnRlcnRhaW4gLpQu	2025-04-24 08:50:49+05:30
:1:summary_bart_3950723804823897565_150_40	gAWV4gAAAAAAAACM3kp1bGVzIFZlcm5lIGNvbGxlY3RzIHNvbWUgb2YgdGhlIGF1dGhvcuKAmXMgYmVzdC1rbm93biB3b3JrcyBpbiBvbmUgdm9sdW1lLiBJbmNsdWRlcyB0aGUgQWZyaWNhbiBleHBsb3JhdGlvbiBvZiBGaXZlIFdlZWtzIGluIGEgQmFsbG9vbi4gVGhlIHN0b3J5IG9mIENhcHRhaW4gTmVtbyBhbmQgaGlzIHN1Ym1hcmluZSBpbiBUd2VudHkgVGhvdXNhbmQgTGVhZ3VlcyBVbmRlciB0aGUgU2VhLpQu	2025-05-22 00:01:33+05:30
:1:book_summary_wClZDwAAQBAJ_bart_150_40	gAWV4gAAAAAAAACM3kp1bGVzIFZlcm5lIGNvbGxlY3RzIHNvbWUgb2YgdGhlIGF1dGhvcuKAmXMgYmVzdC1rbm93biB3b3JrcyBpbiBvbmUgdm9sdW1lLiBJbmNsdWRlcyB0aGUgQWZyaWNhbiBleHBsb3JhdGlvbiBvZiBGaXZlIFdlZWtzIGluIGEgQmFsbG9vbi4gVGhlIHN0b3J5IG9mIENhcHRhaW4gTmVtbyBhbmQgaGlzIHN1Ym1hcmluZSBpbiBUd2VudHkgVGhvdXNhbmQgTGVhZ3VlcyBVbmRlciB0aGUgU2VhLpQu	2025-05-28 00:01:33+05:30
:1:summary_bart_1226032332041692555_150_40	gAWV8gAAAAAAAACM7kpvdXJuZXkgb2YgSG9wZSBhbmQgQ291cmFnZSBpcyBhIHRob3VnaHQtcHJvdm9raW5nIGFuZCBlbXBvd2VyaW5nIGd1aWRlIHRvIHBlcnNvbmFsIGdyb3d0aCwgcmVzaWxpZW5jZSwgYW5kIHRyYW5zZm9ybWF0aW9uLiBQYXNxdWFsZSBEZSBNYXJjbyBza2lsbGZ1bGx5IHdlYXZlcyB0b2dldGhlciBwZXJzb25hbCBhbmVjZG90ZXMsIGluc3BpcmluZyBzdG9yaWVzLCBhbmQgZXZpZGVuY2UtYmFzZWQgc3RyYXRlZ2llcy6ULg==	2025-05-21 23:08:32+05:30
:1:book_summary_YqVZEQAAQBAJ_bart_150_40	gAWV8gAAAAAAAACM7kpvdXJuZXkgb2YgSG9wZSBhbmQgQ291cmFnZSBpcyBhIHRob3VnaHQtcHJvdm9raW5nIGFuZCBlbXBvd2VyaW5nIGd1aWRlIHRvIHBlcnNvbmFsIGdyb3d0aCwgcmVzaWxpZW5jZSwgYW5kIHRyYW5zZm9ybWF0aW9uLiBQYXNxdWFsZSBEZSBNYXJjbyBza2lsbGZ1bGx5IHdlYXZlcyB0b2dldGhlciBwZXJzb25hbCBhbmVjZG90ZXMsIGluc3BpcmluZyBzdG9yaWVzLCBhbmQgZXZpZGVuY2UtYmFzZWQgc3RyYXRlZ2llcy6ULg==	2025-05-27 23:08:32+05:30
:1:rate_limit_user_7_2025-05-20	gAVLFy4=	2025-05-21 23:55:04+05:30
\.


--
-- Data for Name: django_content_type; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_content_type" ("id", "app_label", "model") FROM stdin;
1	admin	logentry
2	auth	permission
3	auth	group
4	contenttypes	contenttype
5	sessions	session
6	sites	site
7	users	customuser
8	users	userpreferences
9	users	bookshelf
10	communities	clubmembership
11	communities	message
12	communities	bookclub
13	media_recommendations	mediarecommendation
14	media_recommendations	usermediapreference
15	users	mediarecommendation
16	users	book
17	users	userpreference
18	users	abtestoutcome
19	users	abtestassignment
20	users	bookcontentanalysis
21	media_recommendations	movierecommendation
\.


--
-- Data for Name: django_migrations; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_migrations" ("id", "app", "name", "applied") FROM stdin;
1	contenttypes	0001_initial	2025-02-26 22:22:53.93789+05:30
2	contenttypes	0002_remove_content_type_name	2025-02-26 22:22:53.945876+05:30
3	auth	0001_initial	2025-02-26 22:22:53.996214+05:30
4	auth	0002_alter_permission_name_max_length	2025-02-26 22:22:54.00285+05:30
5	auth	0003_alter_user_email_max_length	2025-02-26 22:22:54.00686+05:30
6	auth	0004_alter_user_username_opts	2025-02-26 22:22:54.010865+05:30
7	auth	0005_alter_user_last_login_null	2025-02-26 22:22:54.01408+05:30
8	auth	0006_require_contenttypes_0002	2025-02-26 22:22:54.016077+05:30
9	auth	0007_alter_validators_add_error_messages	2025-02-26 22:22:54.020072+05:30
10	auth	0008_alter_user_username_max_length	2025-02-26 22:22:54.025077+05:30
11	auth	0009_alter_user_last_name_max_length	2025-02-26 22:22:54.029447+05:30
12	auth	0010_alter_group_name_max_length	2025-02-26 22:22:54.035433+05:30
13	auth	0011_update_proxy_permissions	2025-02-26 22:22:54.040529+05:30
14	auth	0012_alter_user_first_name_max_length	2025-02-26 22:22:54.044431+05:30
19	sessions	0001_initial	2025-02-26 22:22:54.151921+05:30
20	sites	0001_initial	2025-02-26 22:22:54.158779+05:30
21	sites	0002_alter_domain_unique	2025-02-26 22:22:54.166821+05:30
22	users	0001_initial	2025-02-26 23:40:34.5202+05:30
23	admin	0001_initial	2025-02-26 23:40:34.555017+05:30
24	admin	0002_logentry_remove_auto_add	2025-02-26 23:40:34.561027+05:30
25	admin	0003_logentry_add_action_flag_choices	2025-02-26 23:40:34.567549+05:30
26	users	0002_userpreferences	2025-03-02 15:02:27.635572+05:30
27	users	0003_customuser_bio_customuser_books_read_and_more	2025-03-02 16:19:05.079414+05:30
28	users	0004_alter_customuser_books_read_bookshelf	2025-03-03 23:35:37.202265+05:30
29	users	0005_alter_customuser_books_read	2025-03-04 00:01:24.741385+05:30
30	communities	0001_initial	2025-03-16 16:42:07.47557+05:30
31	communities	0002_alter_bookclub_current_book_image_and_more	2025-03-16 17:27:55.133192+05:30
32	users	0006_customuser_reading_goal_completed_and_more	2025-03-18 00:28:14.149967+05:30
33	users	0007_bookshelf_page_count_bookshelf_user_rating_and_more	2025-03-18 15:04:38.710611+05:30
34	users	0008_alter_bookshelf_page_count	2025-03-18 15:17:48.442113+05:30
35	users	0009_alter_bookshelf_image	2025-03-19 00:56:06.495496+05:30
37	users	0010_bookshelf_categories_bookshelf_description	2025-03-21 16:26:39.500963+05:30
38	users	0010_mediarecommendation	2025-03-21 17:45:16.729447+05:30
39	users	0011_bookshelf_categories	2025-03-21 19:04:24.180865+05:30
40	users	0012_alter_bookshelf_categories	2025-03-21 19:10:38.245135+05:30
41	users	0013_book_userpreference	2025-03-22 15:25:26.918878+05:30
42	users	0014_abtestassignment_abtestoutcome_bookcontentanalysis	2025-03-22 18:01:15.00551+05:30
43	users	0015_remove_bookcontentanalysis_target_audience_and_more	2025-03-22 22:38:23.262357+05:30
44	users	0013_delete_mediarecommendation	2025-03-23 00:28:38.076501+05:30
45	media_recommendations	0001_initial	2025-03-23 00:36:12.007381+05:30
\.


--
-- Data for Name: django_session; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_session" ("session_key", "session_data", "expire_date") FROM stdin;
mtjp6x04slpu35c1k09fwjtbnqpebl3s	.eJxVjMsOwiAQRf-FtSG8KS7d-w1kGAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKc2ZkpdvrdEuCD2g7yHdqtc-xtXebEd4UfdPBrz_S8HO7fQYVRv7XPQjoPQYMBEk4YKZMPwZeglaHigkvWqmy8FZNKiFn4hM6WiVSwqAt7fwDBLzdT:1tnLBQ:GkHjCux_vpHokF2QM61ll2ZPnz0ukf3KEIFZSn57IKg	2025-02-27 22:56:56.060379+05:30
9jmmfjzv03em81t10jht50x51mdd1p2q	.eJxVjMsOwiAQRf-FtSG8KS7d-w1kGAapGkhKuzL-uzbpQrf3nHNfLMK21rgNWuKc2ZkpdvrdEuCD2g7yHdqtc-xtXebEd4UfdPBrz_S8HO7fQYVRv7XPQjoPQYMBEk4YKZMPwZeglaHigkvWqmy8FZNKiFn4hM6WiVSwqAt7fwDBLzdT:1tnLSz:dmT5P9Cd-xZrw5_b0cp12K4brurxcf5jFbYtYe_pTPU	2025-02-27 23:15:05.756252+05:30
b3uz72yiyebqu2ro3phu2zlxahw8sao0	.eJxVi0EOAiEMRe_C2kzSQhnqTj0IKQMEY9TEDivj3WWSWejy_ff-20Tpa4tdyyteszkaMIffLclyK49NbKjTzjpduq7P-2mE5z35-zXRNk6YmRCwhuQhMRWHM2SPZIFm9hgW64aswsKhOkD2xGDJBRFMJVfz-QKaNTOm:1tnM9B:76l8t_2CI-PRzDQlfVPB078XRTOpRK3R_zrslr1VafE	2025-02-27 23:58:41.095507+05:30
vomzjxsifa8jclrqeddtowpjr1qd7v69	.eJxVi0EOAiEMRe_C2kzSQhnqTj0IKQMEY9TEDivj3WWSWejy_ff-20Tpa4tdyyteszkaMIffLclyK49NbKjTzjpduq7P-2mE5z35-zXRNk6YmRCwhuQhMRWHM2SPZIFm9hgW64aswsKhOkD2xGDJBRFMJVfz-QKaNTOm:1tnMA8:ZvEhrLqTRUCm_bfNsGRH3JPdnAWHQpbrgaip3uR1ry8	2025-02-27 23:59:40.358807+05:30
85qa3okqcs28trt2qw2tcvff43n9lww4	.eJxVi0EOwiAQRe_C2jR0QGZwZz0ImWFKMEZNpKyMd7dNutDl-_-9t0ncl5p6m1_pquZkwBx-N-F8mx_bsWEbdm7DpbfleT-v4rQrf13lVtdIi4hntl7ZjwJUNFsJAYQggINjGUtA70hLRhc9xxiCJY-IhKKRzOcL46Y0Zg:1tniVZ:hYH7G0RWv7goGMT06zhm2Wr77KZfVfe0prajmUKXtuA	2025-02-28 23:51:17.159289+05:30
i3ujuvteg97onc6n4byuduapx7s6mfm3	.eJxVi0EOwiAQRe_C2jR0QGZwZz0ImWFKMEZNpKyMd7dNutDl-_-9t0ncl5p6m1_pquZkwBx-N-F8mx_bsWEbdm7DpbfleT-v4rQrf13lVtdIi4hntl7ZjwJUNFsJAYQggINjGUtA70hLRhc9xxiCJY-IhKKRzOcL46Y0Zg:1tniVZ:hYH7G0RWv7goGMT06zhm2Wr77KZfVfe0prajmUKXtuA	2025-02-28 23:51:17.689488+05:30
nwnqq2vrg54qoinpu5akw8br21ccggl3	.eJxVi0EOwiAQRe_C2jR0QGZwZz0ImWFKMEZNpKyMd7dNutDl-_-9t0ncl5p6m1_pquZkwBx-N-F8mx_bsWEbdm7DpbfleT-v4rQrf13lVtdIi4hntl7ZjwJUNFsJAYQggINjGUtA70hLRhc9xxiCJY-IhKKRzOcL46Y0Zg:1tniVq:6LOoGWFVBX3_cZ4APys_YM85zy0oYuWclAuIiMYnPWs	2025-02-28 23:51:34.234184+05:30
o42mdpy1stwdzupj6r6doq00x6rde9vv	.eJxVi0EOwiAQRe_C2jR0QGZwZz0ImWFKMEZNpKyMd7dNutDl-_-9t0ncl5p6m1_pquZkwBx-N-F8mx_bsWEbdm7DpbfleT-v4rQrf13lVtdIi4hntl7ZjwJUNFsJAYQggINjGUtA70hLRhc9xxiCJY-IhKKRzOcL46Y0Zg:1tnich:IrsozKfoTyN-b-3ezfVKom9UM57ZzqMS8CNXbFG8HAk	2025-02-28 23:58:39.819352+05:30
g29q5u40xkzd95uqmk0abyru4hkhvl40	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnikh:5FV2q4mQ8jyrGvBXPNXYuvF15K6R_e9xXEpf6kfvmtQ	2025-03-01 00:06:55.514429+05:30
m2335lfnxfsywi74s307bbb9ozh3b4xg	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnioa:JjeUQ_AQlISaguRa4x0X36UELsrLz7WJZBTcUHGyNag	2025-03-01 00:10:56.522407+05:30
7zc28w557ce5h1nh5j284n3b7576ua3j	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnixq:3D9TleuvZ-X76pE4kL_O-cqlJU3MGHjGnLlR_zTH5FY	2025-03-01 00:20:30.573897+05:30
xf4ccwphdofpv6630mud15fr2uwq7yiv	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnj8T:MnXCyobam6Bhl2AnRqOHorx7vOFjjqLZvvrL_kZJPTU	2025-03-01 00:31:29.954792+05:30
c94vdpvz3xkza5hgcl1mgip9kf5x7r75	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjKU:c8Rknqhta-NC-gDZvdcVOgEuuweKt86oDZbMcFHo4aM	2025-03-01 00:43:54.850929+05:30
qczn2gmi8f2xxg2xufwpz8u8yhpeokcx	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjN4:xPisLiHmkmcVU6C2bb-X4WsEN2UmV1lf5DD9fZ_eBTU	2025-03-01 00:46:34.659801+05:30
wndwxbnqmdoaza90f82rdotgmxn3t2tm	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjSJ:GqsmSd08mSLZbbdhcFyH24pGjKCQU2xd80qQlgt55ZU	2025-03-01 00:51:59.97619+05:30
lm62mj84w6r5rakbivls8t4iywbt9xsy	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjaP:YqyN0u8X7gSrKkLoFGUCJjiIuKe1LJ8MIzH3KEqbPNE	2025-03-01 01:00:21.967189+05:30
649ajmdig1h1w8wqpgsh48vb0bg0dtdd	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjbX:sLSyN6hADsHhObxmUEpKzj_qWADMoGM47jM9TQt0pl4	2025-03-01 01:01:31.593376+05:30
g88bqq6tc6b0q6nlfjj6kmh4rry3l0pl	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjcp:6TrAbgr-c4iNQ1XgKjZ1tUt9GiVLyroG2owkEsPCqlk	2025-03-01 01:02:51.973379+05:30
p60fd9k0fw4upys8oitk4biqkp0br9o4	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjdL:AUJJgX6EhEw3evedNm-DUblU70IHhf6FykG3NfQp53U	2025-03-01 01:03:23.026856+05:30
veyuq22hoeeth15aw29im28d82mcpvro	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnjk0:4u4iPt504uSHLJf6XrbFKhUsztog9uRXB2pDyrsLZWY	2025-03-01 01:10:16.970414+05:30
awe60s16uhok9md8d1xi5whrk5nesrnt	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnpBr:JQPf-wcxJssFcpDGdc6obawxXtGT83bfyTQPjhn61fw	2025-03-01 06:59:23.883831+05:30
gv8iw7b1ms7vkb8hgm0j665xsah64w4v	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnpFx:Tacw8ImKXwr-DO9jODBJMvAosR9P0cBvDAbS7Bmo8_k	2025-03-01 07:03:37.616251+05:30
359owmntak0xljrkuk5ftef52s8a1wdw	.eJxVjMEOgjAQRP-lZ2NKWbdbbuqHNLu0DcQIhoVEY_x3IeGgx5l5b94m8jJ3cdE8xT6Zxjhz-O2E21setmGLetyzHq-LzuP9vIKXHfnzOtZulVIRAWYLiaESRyW1VhCdkENXu1OpCnqoKZXW1wE4BERL4L0nLynQdqpZtR-HmJ-PfnqZhhCs_XwBNZk8dQ:1tnpJ4:UqyCVqWrT7RzDumnKJcEAloGdPWViTonzQSRCmWrz8Y	2025-03-01 07:06:50.678698+05:30
azttw4la1c4xbpnjwbc26b2vuxui7n5n	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toRyf:vj1QFqlHvvLqOQDMsqjMa4sergp1XQXKmcAaRpziPMo	2025-03-03 00:24:21.782026+05:30
2xf67a6iftt6l2otf5pkvme4dj2hxxlj	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toS03:xj-u4fAj6tbll9tAIFjZVDJllEqR3Uvlt_LVC_MmcXI	2025-03-03 00:25:47.999031+05:30
t0ru4349ds7sbszam5qfbv63vppobycu	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toS0j:PmW7y594BmM2QLxwmSCci3T3wdmHD46zg-o4ElVuu9k	2025-03-03 00:26:29.042387+05:30
j0gz07d7gtrz4pkdlxxdptsnxawk8etz	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toS5i:f9gEyLbvekimxLGDFR_lnsgwE5CN56B7Eolx7VABgCM	2025-03-03 00:31:38.293638+05:30
twua7k6nq1p7tu7044lu86v96iid94sm	.eJxVjsEKwjAQRP8lZylrshvT3qwfEpJmQ4vYSrcBRfx3W-lBjzPzHsxL-VCW3hfh2Q9JNYrU4beLobvyuA1blGrPUl2KLNPtvILtjvx5fZB-leJRZzaGLCZC0DG7BAEymehSOGHNaOuuM5HQGEStgRkdB9IAYAm-Z4RFhmn0_LgP81M1ziLA-wMKETvn:1trXDj:rmTD5H07PD5Y19HH0IUCTM8HvVfdgnTiQW88Z7Ry7X4	2025-03-11 12:36:39.728842+05:30
ybk7ntp0oz7eunvfffugfh79l6pukfc6	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toS6b:n3-ZWH6ElUdgB4zXPt-BYLDgiP2DuG7BYIL1VayqCcs	2025-03-03 00:32:33.915089+05:30
2apz4i7mh8g4lk8plw48jsrop28rbufd	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toS95:CJ4JftRurSRhmUtGdvpqr2tWMwyLudCDRbtXf17csWU	2025-03-03 00:35:07.907358+05:30
j4ir5qfnp3w1s6evvv1hgf96liptpydt	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toSAL:0JW9qbmBl_zVFI0Ek-hoCNgLmZqb-tMZsARBxqVQ6wI	2025-03-03 00:36:25.645922+05:30
tjdk1vj5jb9n6m6a4i4y47yvuqrwzsmn	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toSDc:aVCZoimUG3z4W5L1o32NtDKUtcFozfWUmeLyj9t1TE8	2025-03-03 00:39:48.357589+05:30
xd9236rv2l3j7v3pg6jd0gefz2eflu5f	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toSKB:CrrgR3TTPxxZH-nJqJBibANaCodtakKkGOqaFQb_yxE	2025-03-03 00:46:35.828616+05:30
he3alovdhjpijlgx9wn8uhxgtg9re4jh	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toSNP:sQtDnyLcCeqikjZxVZfLLjEu181lzrt18n5A0cPUFBE	2025-03-03 00:49:55.106101+05:30
ioy3tir6mrubt2dxa7oxw9e7fh26q9r6	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toWDf:dFquCsD4cU-6bRBkdchCZjOO3H2dpynTQRDBLS_4XyI	2025-03-03 04:56:07.293328+05:30
3e05yx1shgg73ywleprmcc0opp16qe35	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toWGo:gKD0NUSL8KdkLl5dv-zJvG9sfo3HJbotG7HTTy9x3KQ	2025-03-03 04:59:22.146524+05:30
lhw72ubojxncvrk7t9cazkumfwiwuhfp	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toWK7:K9dzOAnh2il2o0_GO-qamPzy5OdmEP57pjIhFOlM3cY	2025-03-03 05:02:47.56741+05:30
yly3z4cwswlz167tc1epcdvlx14zfpcy	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toWT6:JE5fXc5Y2eROO2zoQL28s2jJ83bexcXP3LDUX7yeBHo	2025-03-03 05:12:04.22915+05:30
0q9p4xjqiuiw8odgepq1vjt76osl03fi	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1tpJVd:cMjyzq_fDVRoCD-_b27TG98UkKuQNqvkvwnatOXojI0	2025-03-05 09:33:57.780159+05:30
yo0hp7aycftjqs848lnm8ssjrltmta4u	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toWVf:9wNydAqhQycgyvwaDAx4XmTyWYFZp6xvSz1L9ZlE7oE	2025-03-03 05:14:43.690899+05:30
z49jb8nx8om28wvb0ktwn60cid2r5oe3	.eJxVjMEOgjAQRP-lZ0Na2LYLN_VDmqXdBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVKa9Ov11P8cbTPuxRqiNLdS2yzvfzBl4O5M8bSIZNcoQ2RiIdE2cymsEZ3fhM1tXADaeEUGPvNiQ1rYmAAL5GNBaszi3up8Ii4zwFfj7G5aU6dKD15wtItTy_:1tsGSP:iK_ikzu3azN1BkcDE576yOYEoA5zfPxfBPCEapCyVXE	2025-03-13 12:54:49.872286+05:30
ydsbgpesx34g0x52p5lajq2sk5wqeomu	.eJxVi0EOwiAQRe_C2jTCDAy4sx6EAJ0JxqiJlJXx7tKkC12-_997q5j6WmNv_IrXRZ0UqMPvllO58WM7NmzTzm269LY-7-chzrvy19XU6oiCB1eOCEgEThZAT559slqyaMMSWEpGQgEMOhsHEHiwsTZTIGvV5wu1wDPr:1toWZU:clU6QnAeoiOBYyN1UP-60hkIblmncL5ms5yxaH05QFA	2025-03-03 05:18:40.535192+05:30
1ie82s1t25kgyq7zzxy82q8re1g7lstj	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toWiH:Pk8PQD3MeanmrRcwyzRTt6OzAGmTBHmuNqjpoZxalG0	2025-03-03 05:27:45.709701+05:30
di9n8yix5wrze9c33fkgqedqye84be80	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toeo3:fMD0LsqBeah-HS1Cx0-kNoK0ctuWb62KkeEJ_fY3P4Y	2025-03-03 14:06:15.626756+05:30
y4thza2g4d8rhtgbhdfi7g54q0h4ydso	e30:1tpryQ:UC1vuXbrBNtWTBOxDBdmjCZXbPsKEWbvsnGmQwclW6o	2025-03-19 22:21:58.646939+05:30
vqfyl4t0coku3kjt54kdajqib5u6c60e	.eJxVjM0KwjAQhN8lZyltdvPXm_ogIWk3NIitdBtQxHe3gR70-M18M2_hQ9kmX5hWn0fRCxCn3yyG4UZzLSpyczA318Lbcj_v4uVQ_nZT4GkfOQt6aBHQGNBpBLTGkg2qSzF1kpKjNEQ0mABdF6UGcLSzVCoaZ5Sqp0zMeZk9PR95fYneamzbzxf8HDv6:1toh7v:BfocB95ZJK7XtdbP-WbacKRSPHtsUPku7lJb60hBb9Q	2025-03-03 16:34:55.050768+05:30
tjyi5eyhrabq7i9dmc5r5otqonpvnt8r	.eJxVjMEOgjAQRP-lZ0PaspQtN_VDmi3dBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVqUadfrtI_Y2nfdijVEeW6lpkne_nDbwcyJ83kAybhEyRGjDWJsiIOQNS32tn65ZajQlrk3zKHI3xDNFFRwzWePQQNVDcT4VFxnkK_HyMy0t16EDrzxdE3D0g:1twZSl:b2q_yV_GxU6tgsPICKLcMqMzTmUVdtyiJK_CBRbDZK0	2025-03-25 10:00:59.539385+05:30
4jfxmvt1qx3he0afc54b90oc4uvzexpu	.eJxVjMEOgjAQRP-lZ0PaspQtN_VDmi3dBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVqUadfrtI_Y2nfdijVEeW6lpkne_nDbwcyJ83kAybhEyRGjDWJsiIOQNS32tn65ZajQlrk3zKHI3xDNFFRwzWePQQNVDcT4VFxnkK_HyMy0t16EDrzxdE3D0g:1tuce9:T3FKgSemGVB1bs2n74goX_xE4-PDkT1I0L_UHpHKAzg	2025-03-20 01:00:41.680378+05:30
9djgb9niy63f1d9fpba43uazf387neyu	.eJxVjMEOgjAQRP-lZ0Na2LYLN_VDmqXdBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVKa9Ov11P8cbTPuxRqiNLdS2yzvfzBl4O5M8bSIZNcoQ2RiIdE2cymsEZ3fhM1tXADaeEUGPvNiQ1rYmAAL5GNBaszi3up8Ii4zwFfj7G5aU6dKD15wtItTy_:1tsnbs:DQv63xWy2YWBo8tDJYWWvATRMMp6eiXKZbBxQs2gJZ4	2025-03-15 00:18:48.348414+05:30
c7cwmgp5x2meo0oksxbcet3ve24821co	.eJxVi0sKAjEQRO-StQzppPMZd-pBQk_STURUMJOVeHczMAtdFa_q1Vsl6mtNvfErXYs6qqAOv91C-caPbdiwTTu36dLb-ryfhnjelb9fpVbHSSOi-AzRO2sBJZuitWdgARdYinguUIwVAo866iVisME4Q24eOavPF7n8M8A:1u2u4j:WtYDFbgO4CcA3DaTF8hjDZgJAWyj2UFkWnM3Nap8lHY	2025-04-24 21:14:21.980475+05:30
zjyaqmp64g6lkajwkiy3xti2z7ik1pxy	.eJx1T0tTgzAQ_i85YwfCkobeKNaxOo7WgzM9MRsIj2KhktDHdPrfTZwetODevt3vtWeSYK_LpFeyS6qMzEhAnN87gWktG3uwUE2uWE3iXul2Gxni_Er5oytRlUbEJQoMwKM0g5zzPAeOaeoy6k9x6vKM-14WZrkUnhdKEEwwlEC9kIcgXEBhTZVUqmqbRB53VXciM87AdR0i2rZOMtSYpJiWkszOpG6PD5GZdRQ9WbzDQsZt32gy84E6BPeyM6t31FVTmN3FIceCVveHKFrNBxIvZIag9aaJV6MEAHOvGYdHkxmPZHJLoB1fqtcvLyjr-IYQBoNOMAmMZnP6oP-08l1rumjiuf10OUwFxoaf_rj268NpUyzGqgKfDkRWUqXP2-xOf-7fXm7LU3BHcy6Xb7vPv2k:1u6I6H:1QC00AEbMUBh0UxuWgvwbLfN5zkXsL9tMvwx7C3aYsQ	2025-04-21 05:29:57.74312+05:30
ytbpdvxbigd40vlc0on90wjgf8yfqlqp	.eJx1UMtugzAQ_BefaQRmcQw3QtI2raomPVTKCdlgHqGBFJs8FPHvtasc2kB8m92ZnRlfUMw6VcSdFG1cpihAHrL-zjhLKlGbhYFycsVyEnVSNbtQE2dXyj9dwWShRVQwzjxwME4hozTLgLIksQl2p2xq05S6TuqnmeCO4wvghBMmADs-9YHbwLg5KoWUZVPH4rQv2zMKKAHbthBvmipOmWJxwpJCoOCCqub0GOq3CcMXg_csF1HT1QoFLmALsYNo9eiDqbLO9ay30CnH5fwYhuvZQOL4RBOU2tbRepQAoPcVofCsPaMRT2oIuKVL-f7teEUV3RB8b5AJJp7WbM-f-E4q1zZHF3U0M02XQ1cgZNj092q3OZ63-WIsKtDpQGQkZfK6Sx_U12H1dhseg33HJ37azVfH0S_B1B1W7vv-B2JJz5k:1uHcPo:L3FSd0aW5zj9uS05NyqT8UaoJLp5STNWS0jdBDbDIz8	2025-05-22 11:24:56.295211+05:30
eu0p5pwbo0vsxr4xe1xofiy1p0ruimf9	.eJxVjMEOgjAQRP-lZ0PaspQtN_VDmi3dBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVqUadfrtI_Y2nfdijVEeW6lpkne_nDbwcyJ83kAybhEyRGjDWJsiIOQNS32tn65ZajQlrk3zKHI3xDNFFRwzWePQQNVDcT4VFxnkK_HyMy0t16EDrzxdE3D0g:1u2BbK:DCxQH-bo--tOsawDj3AYxJWKcGGOJhERG9txDSuHFQs	2025-04-09 21:45:02.706966+05:30
huyvisfc3zej82r8hrcvpfpgh6l5t07h	.eJxVjMEOgjAQRP-lZ0PaspQtN_VDmi3dBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVqUadfrtI_Y2nfdijVEeW6lpkne_nDbwcyJ83kAybhEyRGjDWJsiIOQNS32tn65ZajQlrk3zKHI3xDNFFRwzWePQQNVDcT4VFxnkK_HyMy0t16EDrzxdE3D0g:1u6uT1:CBsJLF8wzGRecEG3SHKTxhiuU-ouielvfjW_-x3GPJg	2025-04-22 22:27:59.85703+05:30
fe89sno3wanwxh7gky9ern5w5235us3v	.eJx1T0tTgzAQ_i85YwfCkobeKNaxOo7WgzM9MRsIj2KhktDHdPrfTZwetODevt3vtWeSYK_LpFeyS6qMzEhAnN87gWktG3uwUE2uWE3iXul2Gxni_Er5oytRlUbEJQoMwKM0g5zzPAeOaeoy6k9x6vKM-14WZrkUnhdKEEwwlEC9kIcgXEBhTZVUqmqbRB53VXciM87AdR0i2rZOMtSYpJiWkszOpG6PD5GZdRQ9WbzDQsZt32gy84E6BPeyM6t31FVTmN3FIceCVveHKFrNBxIvZIag9aaJV6MEAHOvGYdHkxmPZHJLoB1fqtcvLyjr-IYQBoNOMAmMZnP6oP-08l1rumjiuf10OUwFxoaf_rj268NpUyzGqgKfDkRWUqXP2-xOf-7fXm7LU3BHcy6Xb7vPv2k:1u4lzy:qHM0pb_0hdyrLv7naens0XmEReQ14XUp5-T8RrduzcU	2025-04-17 01:01:10.361521+05:30
1owjhn1ljecz7z64wtdoc199u8keewtq	.eJxVjMEOgjAQRP-lZ0PaspQtN_VDmi3dBmIEw9JEY_x3IeGgx5l5b94qUFmHUISXMCbVqUadfrtI_Y2nfdijVEeW6lpkne_nDbwcyJ83kAybhEyRGjDWJsiIOQNS32tn65ZajQlrk3zKHI3xDNFFRwzWePQQNVDcT4VFxnkK_HyMy0t16EDrzxdE3D0g:1u7Syi:8GRfVJbHAXhyMlsSZUKl6NGOJSbYmcvOou0VWksp-5I	2025-04-24 11:19:00.626166+05:30
\.


--
-- Data for Name: django_site; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."django_site" ("id", "domain", "name") FROM stdin;
1	example.com	example.com
\.


--
-- Data for Name: media_recommendations_mediarecommendation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."media_recommendations_mediarecommendation" ("id", "tmdb_id", "title", "media_type", "overview", "poster_path", "release_date", "similarity_score", "ai_explanation", "created_at", "source_book_id", "user_id") FROM stdin;
\.


--
-- Data for Name: media_recommendations_movierecommendation; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."media_recommendations_movierecommendation" ("id", "book_id", "book_title", "movie_id", "movie_title", "movie_poster", "movie_overview", "movie_release_date", "relevance_score", "recommendation_reason", "created_at", "user_id") FROM stdin;
1	BKjCQgAACAAJ	The ABC Murders	6026	The Alphabet Murders	https://image.tmdb.org/t/p/w500/AiBmQsxpMage7Vbs7NgUZT4EkhY.jpg	The Belgian detective Hercule Poirot investigates a series of murders in London in which the victims are killed according to their initials.	1965-12-26	0.6261138916015625	'The Alphabet Murders' explores themes similar to 'The ABC Murders'.	2025-03-23 00:49:46.293751+05:30	5
14	FrSPEAAAQBAJ	Harry Potter and the Sorcerer's Stone	671	Harry Potter and the Philosopher's Stone	https://image.tmdb.org/t/p/w500/wuMc08IPKEatf9rnMNXvIDxqP4W.jpg	Harry Potter has lived under the stairs at his aunt and uncle's house his whole life. But on his 11th birthday, he learns he's a powerful wizard—with a place waiting for him at the Hogwarts School of Witchcraft and Wizardry. As he learns to harness his newfound powers with the help of the school's kindly headmaster, Harry uncovers the truth about his parents' deaths—and about the villain who's to blame.	2001-11-16	0.7095462679862976	'Harry Potter and the Philosopher's Stone' offers a cinematic experience that complements 'Harry Potter and the Sorcerer's Stone'.	2025-03-23 01:04:30.527525+05:30	5
15	EnCBAAAAIAAJ	The Black Book	1172009	The Black Book	https://image.tmdb.org/t/p/w500/kn28W24slBLyGr8ZIZnxNE5YZrY.jpg	After his son is wrongly accused of kidnapping, a deacon who has just lost his wife takes matters into his own hands and fights a crooked police gang to clear him.	2023-09-22	0.4267510771751404	Fans of 'The Black Book' often enjoy 'The Black Book'.	2025-03-23 01:04:40.132715+05:30	5
16	EnCBAAAAIAAJ	The Black Book	432131	Black Butler: Book of the Atlantic	https://image.tmdb.org/t/p/w500/4jU2Bdk1MB2OvP4BBvTJIPQc0BF.jpg	Ciel learns of a "Aurora Society", that is rumored to be researching how to bring the dead back to life. Their next meeting is scheduled to be conducted on the ship Campania, voyaging across the Atlantic Ocean. Much to Ciel's dismay, Elizabeth "Lizzy" Midford, is taking the same ship, thus leaving him with no choice but to get aboard as well.	2017-01-21	0.3302405774593353	The narrative style of 'The Black Book' is reflected in 'Black Butler: Book of the Atlantic'.	2025-03-23 01:04:40.134717+05:30	5
17	EnCBAAAAIAAJ	The Black Book	879600	The Black Book	https://image.tmdb.org/t/p/w500/j3J57RrKvOeGgbqtBzIvRTFF55Y.jpg	Horror anthology from multiple directors.	2021-07-07	0.31500476598739624	The narrative style of 'The Black Book' is reflected in 'The Black Book'.	2025-03-23 01:04:40.135714+05:30	5
18	6vGiDwAAQBAJ	The Picture of Dorian Gray	464271	Il Novelliere - Il salotto di Oscar Wilde	https://image.tmdb.org/t/p/w500/hMnwf3SA9h7sPo4U7wIp6KzPfq3.jpg	This is an Italian made-for-TV movie starring Terence Hill	1958-01-01	0.3034043610095978	'Il Novelliere - Il salotto di Oscar Wilde' offers a cinematic experience that complements 'The Picture of Dorian Gray'.	2025-03-23 01:08:47.715855+05:30	5
20	uYwyjgEACAAJ	Divergent	157350	Divergent	https://image.tmdb.org/t/p/w500/aNh4Q3iuPKDMPi2SL7GgOpiLukX.jpg	In a world divided into factions based on personality types, Tris learns that she's been classified as Divergent and won't fit in. When she discovers a plot to destroy Divergents, Tris and the mysterious Four must find out what makes Divergents dangerous before it's too late.	2014-03-14	0.7002321481704712	The narrative style of 'Divergent' is reflected in 'Divergent'.	2025-03-23 01:08:59.801051+05:30	5
21	Ae2MBqG9bGkC	The Light of Asia	143953	The Light of Asia	https://image.tmdb.org/t/p/w500/4wNdb6XDeYLaQUBcDYG02FLyCIU.jpg	Living an indolent life in a luxurious palace, Prince Gautama (Rai) is insulated by his family from the harshness of the world outside. But he is destined to learn greater truths: shocked to discover the pain and suffering of so many in his kingdom, he abandons his privileged existence, and his wife Gopa (Seeta Devi), to become a wandering teacher, eventually finding enlightenment and founding Buddhism. Featuring superimposed images and deep-focus shots that were highly impressive for the time, Light of Asia astutely combines a deeply felt spirituality with the surefire attraction of Indian exotica, which helped make it a considerable success in Europe.	1925-10-22	0.7045183777809143	The narrative style of 'The Light of Asia' is reflected in 'The Light of Asia'.	2025-03-23 01:10:05.659184+05:30	5
25	ttjnCQAAQBAJ	Small Wars	1265507	Small Wars	https://image.tmdb.org/t/p/w500/pRkkigZj3E8bgUTfQFdaSTyzwOV.jpg	With a style that mirrors documentary photography, Lê depicts Vietnam War reenactors staging theatrical battles in the forests of Virginia and soldiers at the Twentynine Palms, California, military base training for the current wars in Iraq and Afghanistan — warlike activities without the mortal dangers of war.	2002-01-01	0.41271933913230896	Fans of 'Small Wars' often enjoy 'Small Wars'.	2025-03-23 01:10:17.184116+05:30	5
26	icKmd-tlvPMC	Journey to the Center of the Earth	45361	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/on6hrhmind13nVHVtk8M6IepEjh.jpg	When an accident leaves a group of researchers trapped beneath the earth's crust, it's up to a drill team, led by Joseph Harnet, to rescue them. But once underground, the team discovers a mysterious -- and horrifying -- subterranean universe.	2008-07-01	0.6198712587356567	Both 'Journey to the Center of the Earth' (Fiction / Classics) and 'Journey to the Center of the Earth' (Action) share similar genres.	2025-03-23 01:16:53.798392+05:30	5
27	icKmd-tlvPMC	Journey to the Center of the Earth	122894	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/yHjOfJ0WMYWdH9iY7Us9GXD4p9n.jpg	An English nanny and one of two brothers fall down a Hawaiian cave, all the way to Atlantis.	1988-07-30	0.4823080003261566	Both 'Journey to the Center of the Earth' (Fiction / Classics) and 'Journey to the Center of the Earth' (Fantasy) share similar genres.	2025-03-23 01:16:53.803417+05:30	5
41	9KWp0AEACAAJ	A Song of Ice and Fire	1313025	A Song of Ice and Fire	https://image.tmdb.org/t/p/w500/nXpd3MmML6vApcLlksQrqQFH4th.jpg	The epic story of the rise and fall of kings and queens.		0.6237466335296631	If you enjoyed 'A Song of Ice and Fire', you might like 'A Song of Ice and Fire'.	2025-03-24 04:58:25.461898+05:30	7
42	GZAoAQAAIAAJ	Harry Potter and the Deathly Hallows	12444	Harry Potter and the Deathly Hallows: Part 1	https://image.tmdb.org/t/p/w500/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg	Harry, Ron and Hermione walk away from their last year at Hogwarts to find and destroy the remaining Horcruxes, putting an end to Voldemort's bid for immortality. But with Harry's beloved Dumbledore dead and Voldemort's unscrupulous Death Eaters on the loose, the world is more dangerous than ever.	2010-11-17	0.7669550180435181	'Harry Potter and the Deathly Hallows: Part 1' explores themes similar to 'Harry Potter and the Deathly Hallows'.	2025-03-24 07:27:28.98993+05:30	14
43	GZAoAQAAIAAJ	Harry Potter and the Deathly Hallows	12445	Harry Potter and the Deathly Hallows: Part 2	https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoom3.jpg	Harry, Ron and Hermione continue their quest to vanquish the evil Voldemort once and for all. Just as things begin to look hopeless for the young wizards, Harry discovers a trio of magical objects that endow him with powers to rival Voldemort's formidable skills.	2011-07-12	0.6753003597259521	'Harry Potter and the Deathly Hallows: Part 2' explores themes similar to 'Harry Potter and the Deathly Hallows'.	2025-03-24 07:27:28.993938+05:30	14
28	AgthzgEACAAJ	Unknown Title	651342	J.R.R. Tolkien and the Birth of "The Lord of the Rings" and "The Hobbit"	https://image.tmdb.org/t/p/w500/jp0NQtIQTwen5vHBNcCK2iLKoY7.jpg	In a house in Oxford lived a remarkable man called J.R.R. Tolkien who told stories that thrilled the world. To this very day readers and film audiences are enjoying his magnificent epics “THE LORD OF THE RINGS” and “The Hobbit” – adapted to the big screen by producer, Peter Jackson. Although everybody has heard of Tolkien’s writing, very few people could tell you much about the man responsible for creating the best loved magical creatures that have become household names. This program will give you a real insight into the man behind the legends of “THE LORD OF THE RINGS,” and the people and places that shaped his unique literary genius. From the rolling English countryside to the sooty streets of Industrial Birmingham, the dreaming spires of Oxford to the World War I trenches of the blood soaked Somme; this is the story of the quintessential English College Professor who made epic mythology and legend accessible to one and all.	2004-12-31	0.5043632984161377	'J.R.R. Tolkien and the Birth of "The Lord of the Rings" and "The Hobbit"' offers a cinematic experience that complements 'The Lord of the Rings'.	2025-03-23 01:22:33.181757+05:30	5
29	AgthzgEACAAJ	Unknown Title	123	The Lord of the Rings	https://image.tmdb.org/t/p/w500/liW0mjvTyLs7UCumaHhx3PpU4VT.jpg	The Fellowship of the Ring embark on a journey to destroy the One Ring and end Sauron's reign over Middle-earth.	1978-11-15	0.4373891353607178	Both 'The Lord of the Rings' (Fiction / Classics) and 'The Lord of the Rings' (Adventure) share similar genres.	2025-03-23 01:22:33.201677+05:30	5
30	AgthzgEACAAJ	Unknown Title	120	The Lord of the Rings: The Fellowship of the Ring	https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg	Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.	2001-12-18	0.433991402387619	'The Lord of the Rings: The Fellowship of the Ring' offers a cinematic experience that complements 'The Lord of the Rings'.	2025-03-23 01:22:33.206429+05:30	5
31	t4b69z5hs58C	Sphere	10153	Sphere	https://image.tmdb.org/t/p/w500/5IMr0L4BoONvN5i9kyVd0zGww3L.jpg	A spacecraft is discovered on the floor of the Pacific Ocean, presumed to be at least 300 years old and of alien origin. A crack team of scientists and experts is assembled and taken to the Habitat, a state-of-the-art underwater living environment, to investigate.	1998-02-13	0.6621222496032715	'Sphere' offers a cinematic experience that complements 'Sphere'.	2025-03-23 01:22:33.675852+05:30	5
32	t4b69z5hs58C	Sphere	995349	Sphere	\N	The film is created using satellite images of the Earth. Abstract and unconventional visuals combined together give the impression of new worlds, which we can all interpret in our own way; the emergence of life on Earth, the passage of time or the catastrophic development of civilization. The possibilities of these interpretations are endless. It all depends on the imagination and personal impressions of the viewer.	2022-06-22	0.5233549475669861	The narrative style of 'Sphere' is reflected in 'Sphere'.	2025-03-23 01:22:33.680852+05:30	5
33	N2LhAAAAMAAJ	The Absolutely True Diary of a Part-Time Indian	1093742	The Absolutely True Diary of a Part-Time Indian	\N	A teen named Junior, a budding cartoonist, grows up on the Spokane Indian Reservation. Determined to take his future into his own hands, he leaves his troubled school on the reservation to attend an all-white farm town high school where the only other Indian is the school mascot.		0.8677895665168762	'The Absolutely True Diary of a Part-Time Indian' offers a cinematic experience that complements 'The Absolutely True Diary of a Part-Time Indian'.	2025-03-23 12:55:20.795023+05:30	5
34	LHbigwXO4s0C	Unknown Title	1451074	Red Storm Rising: The Struggle for the American Communist Party	\N	Red Storm Rising” looks at the rise and fall of the American Communist Party, examining its political context, its leadership, its appeal to the American public, and why it never became mainstream.	2025-03-17	0.5240267515182495	If you enjoyed 'Red Storm Rising', you might like 'Red Storm Rising: The Struggle for the American Communist Party'.	2025-03-23 12:55:25.24726+05:30	5
35	MH48bnzN0LUC	The Kite Runner	7979	The Kite Runner	https://image.tmdb.org/t/p/w500/dom2esWWW8C9jS2v7dOhW48LwHh.jpg	After spending years in California, Amir returns to his homeland in Afghanistan to help his old friend Hassan, whose son is in trouble.	2007-12-14	0.7051644325256348	Both 'The Kite Runner' (Fiction / General) and 'The Kite Runner' (Drama) share similar genres.	2025-03-23 16:29:25.567162+05:30	7
36	icKmd-tlvPMC	Journey to the Center of the Earth	11571	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/nWn9MRFkC1M13hVf17mT0BfYKbg.jpg	An Edinburgh professor and assorted colleagues follow an explorer's trail down an extinct Icelandic volcano to the earth's center.	1959-12-15	0.6718978881835938	'Journey to the Center of the Earth' explores themes similar to 'Journey to the Center of the Earth'.	2025-03-24 04:58:23.676162+05:30	7
37	icKmd-tlvPMC	Journey to the Center of the Earth	88751	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/dGTtW6GUcs4FaLzGi9KBxpo8MWb.jpg	On a quest to find out what happened to his missing brother, a scientist, his nephew and their mountain guide discover a fantastic and dangerous lost world in the center of the earth.	2008-07-10	0.6278744339942932	Both 'Journey to the Center of the Earth' (Fiction / Classics) and 'Journey to the Center of the Earth' (Action) share similar genres.	2025-03-24 04:58:23.703131+05:30	7
38	icKmd-tlvPMC	Journey to the Center of the Earth	257001	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/5NYLJdcmgNamWzEomppp2NGgjPv.jpg	This made-for-TV film version uses the title and general premise of Jules Verne's novel, but had its heroes carry out the journey in an earth-penetrating machine. A television series was supposed to follow, but was never produced. Cast includes John Neville, F. Murray Abraham and Kim Miyori.	1993-07-01	0.6219028234481812	'Journey to the Center of the Earth' shares significant thematic elements with 'Journey to the Center of the Earth'.	2025-03-24 04:58:23.706126+05:30	7
39	icKmd-tlvPMC	Journey to the Center of the Earth	45361	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/on6hrhmind13nVHVtk8M6IepEjh.jpg	When an accident leaves a group of researchers trapped beneath the earth's crust, it's up to a drill team, led by Joseph Harnet, to rescue them. But once underground, the team discovers a mysterious -- and horrifying -- subterranean universe.	2008-07-01	0.6198712587356567	'Journey to the Center of the Earth' offers a cinematic experience that complements 'Journey to the Center of the Earth'.	2025-03-24 04:58:23.708149+05:30	7
40	icKmd-tlvPMC	Journey to the Center of the Earth	122894	Journey to the Center of the Earth	https://image.tmdb.org/t/p/w500/yHjOfJ0WMYWdH9iY7Us9GXD4p9n.jpg	An English nanny and one of two brothers fall down a Hawaiian cave, all the way to Atlantis.	1988-07-30	0.4823080003261566	'Journey to the Center of the Earth' explores themes similar to 'Journey to the Center of the Earth'.	2025-03-24 04:58:23.710122+05:30	7
47	bm2cPwAACAAJ	The Fellowship of the Ring	120	The Lord of the Rings: The Fellowship of the Ring	https://image.tmdb.org/t/p/w500/6oom5QYQ2yQTMJIbnvbkBL9cHo6.jpg	Young hobbit Frodo Baggins, after inheriting a mysterious ring from his uncle Bilbo, must leave his home in order to keep it from falling into the hands of its evil creator. Along the way, a fellowship is formed to protect the ringbearer and make sure that the ring arrives at its final destination: Mt. Doom, the only place where it can be destroyed.	2001-12-18	0.8611437082290649	'The Lord of the Rings: The Fellowship of the Ring' is an excellent match for readers of 'The Fellowship of the Ring'.	2025-03-24 07:30:14.130549+05:30	14
48	bm2cPwAACAAJ	The Fellowship of the Ring	1381105	Trouble of the Rings: The Fellowship	\N	A parody of Peter Jackson's award winning success, "The Lord of the Rings" - filmed with low budget in and around Moscow. Everything began with Sauron forging the Great Ring of Power. By chance this ring got lost by all of his masters - until it came to the hobbit Frodo Baggins. Thus he has been sent by Gandalf the Gray to an ero.. exotic walk to Bree. Still, the evil does not sleep - the power-thriving Sarumom tries participate in the expansive globalization plans of the evil Mordor conglomerate. And the 8 1/2 Nazgul have already rode out, looking for the Ring...	2002-12-21	0.7567715644836426	Both 'The Fellowship of the Ring' (Fiction / Fantasy / General) and 'Trouble of the Rings: The Fellowship' (Comedy) share similar genres.	2025-03-24 07:30:14.134498+05:30	14
49	bm2cPwAACAAJ	The Fellowship of the Ring	362889	Secrets of Middle-Earth:  Inside Tolkien's The Fellowship of the Ring	https://image.tmdb.org/t/p/w500/dmTBVbqMSCSYxQJ1J7bXp8ty8JC.jpg	The documentary Inside Tolkien's The Fellowship of the Ring traces the journey taken by the characters in the classic novel. In addition to offering insight into the characters, the filmmakers show what real-life works shaped the author's imagination as he created one of the most beloved books of the 20th century.	2003-11-18	0.6654726266860962	'Secrets of Middle-Earth:  Inside Tolkien's The Fellowship of the Ring' offers a cinematic experience that complements 'The Fellowship of the Ring'.	2025-03-24 07:30:14.1355+05:30	14
50	bm2cPwAACAAJ	The Fellowship of the Ring	192349	Beyond the Movie: The Fellowship of the Ring	https://image.tmdb.org/t/p/w500/knCJvfbr4LWNZBkTDlwRdM28PuR.jpg	A documentary about the influences on Tolkien, covering in brief his childhood and how he detested the onslaught of industry through the idyllic countryside, moving on to describe his fighting experience from WWI, and closing with a look at the Finnish inspiration for the scholar's self-invented languages of Elfish. In between are interviews with the cast of the films and some clips, by far the most from "The Fellowship of the Ring", but a few glimpses of Rohan riders (from "The Two Towers") are provided. Also, there are interviews with a range of the filmmakers.	2001-12-23	0.5263495445251465	'Beyond the Movie: The Fellowship of the Ring' offers a cinematic experience that complements 'The Fellowship of the Ring'.	2025-03-24 07:30:14.136548+05:30	14
51	bm2cPwAACAAJ	The Fellowship of the Ring	622231	The Making of The Fellowship of the Ring	https://image.tmdb.org/t/p/w500/9vdxS5MUDzD0Aoi2SrAEY3VxQ8J.jpg	A behind-the-scenes documentary on the making of "The Lord of the Rings: The Fellowship of the Ring." Created by filmmaker Costa Botes (personally selected by Peter Jackson), this documentary uses raw footage to reveal the inside story on how the greatest adventure film franchise was born.	2002-04-01	0.4416334927082062	'The Making of The Fellowship of the Ring' explores themes similar to 'The Fellowship of the Ring'.	2025-03-24 07:30:14.138502+05:30	14
52	38iSPwAACAAJ	Prince Caspian	1167899	The Chronicles of Narnia: Prince Caspian: Sets of Narnia: A Classic Comes to Life	https://image.tmdb.org/t/p/w500/aI4rVz3BRUhwy0CBL75vhVIPyf.jpg	This piece presents viewers with a look at the challenges of creating the look for Narnia, and Prince Caspian in particular. As C.S. Lewis's stories often left much to the imagination, it was up to the filmmakers to find just the right shooting locations, build the perfect sets, and fashion the right props to bring this imaginative world to life. Each new segment of the feature is introduced by a reading of the appropriate passage in the novel which sets the stage nicely for appreciating the work that went into creating all of the film's major set pieces.		0.7840989828109741	'The Chronicles of Narnia: Prince Caspian: Sets of Narnia: A Classic Comes to Life' explores themes similar to 'Prince Caspian'.	2025-03-24 07:30:25.091447+05:30	14
53	38iSPwAACAAJ	Prince Caspian	2454	The Chronicles of Narnia: Prince Caspian	https://image.tmdb.org/t/p/w500/qxz3WIyjZiSKUhaTIEJ3c1GcC9z.jpg	One year after their incredible adventures in the Lion, the Witch and the Wardrobe, Peter, Edmund, Lucy and Susan Pevensie return to Narnia to aid a young prince whose life has been threatened by the evil King Miraz. Now, with the help of a colorful cast of new characters, including Trufflehunter the badger and Nikabrik the dwarf, the Pevensie clan embarks on an incredible quest to ensure that Narnia is returned to its rightful heir.	2008-05-15	0.710115909576416	'The Chronicles of Narnia: Prince Caspian' offers a cinematic experience that complements 'Prince Caspian'.	2025-03-24 07:30:25.092447+05:30	14
54	38iSPwAACAAJ	Prince Caspian	693737	The Chronicles of Narnia: Prince Caspian & The Voyage of the Dawn Treader	https://image.tmdb.org/t/p/w500/wK7Sn9z7Hq3CYMezbePkDyYvz85.jpg	Young Prince Caspian of Narnia wonders and dreams about the old days of Narnia when animals talked, and there were mythical creatures and four rulers in Cair Paravel. But his uncle and aunt don’t like to hear him thinking of such things, and plan to murder him and take his throne. Caspian’s tutor, Dr. Cornelius manages to save him, and not only teach him about the old ways, but bring him into the real Narnia and introduce him to the real Narnia. But Caspian’s plight is desperate, and he must use the legendary horn to call help from another world: Peter, Susan, Edmund, and Lucy.  Then, Lucy and Edmund are sent back to Narnia, along with their cousin Eustace, to assist Caspian on a voyage. Along their journey the children battle dragons and sea serpents, and sail across a golden lake to reach the edge of the world.	1989-11-19	0.7070062160491943	If you enjoyed 'Prince Caspian', you might like 'The Chronicles of Narnia: Prince Caspian & The Voyage of the Dawn Treader'.	2025-03-24 07:30:25.093448+05:30	14
55	Hj6pQAAACAAJ	The Two Towers	121	The Lord of the Rings: The Two Towers	https://image.tmdb.org/t/p/w500/5VTN0pR8gcqV3EPUHHfMGnJYN9L.jpg	Frodo Baggins and the other members of the Fellowship continue on their sacred quest to destroy the One Ring--but on separate paths. Their destinies lie at two towers--Orthanc Tower in Isengard, where the corrupt wizard Saruman awaits, and Sauron's fortress at Barad-dur, deep within the dark lands of Mordor. Frodo and Sam are trekking to Mordor to destroy the One Ring of Power while Gimli, Legolas and Aragorn search for the orc-captured Merry and Pippin. All along, nefarious wizard Saruman awaits the Fellowship members at the Orthanc Tower in Isengard.	2002-12-18	0.7729421854019165	If you enjoyed '2 Towers', you might like 'The Lord of the Rings: The Two Towers'.	2025-03-24 07:30:27.775578+05:30	14
59	l0kJEQAAQBAJ	Hyde	1245080	Hyde	https://image.tmdb.org/t/p/w500/fdSs2QMCF1JP8SVj8QcAHncUyNT.jpg	Based on the classic novella by Robert Louis Stevenson, "Hyde" tells the story of successful defense attorney Edward Hyde, who has the perfect family to go along with his perfect job...even though he finds himself struggling to balance the two at times. Once a horrible tragedy strikes, Edward begins to go down a dark path that leads him to spiral out of control...transforming into something else entirely.	2025-03-28	0.6927306652069092	The narrative style of 'Hyde' is reflected in 'Hyde'.	2025-03-24 08:26:39.943004+05:30	15
60	l0kJEQAAQBAJ	Hyde	789473	The Mysterious Mr. Hyde	https://image.tmdb.org/t/p/w500/zB5cW1fWAVid1DCYaxXlCB2SW2Y.jpg	The television adaptation of Stevenson's well-known short story enriched the story with a new motif, because the good and evil in a person change not only under the influence of drugs, but also under the influence of insatiable love. We meet Mr. Hyde, who is an assistant to the elderly Dr. Jekyll, on the street when he kills a neighbor's dog. Dr. Utterson and his friend witness this when they go to visit a friend of theirs, Jekyll, who they are worried about. They believe that he is under the influence of his assistant, they fear for his life. Jekyll is the family doctor of Lady Danvers, with whom he is secretly in love. He is a talented scientist and has invented a liquid, a substance whose effect is very strange - it rejuvenates, but at the same time changes the character. And that gradually becomes fatal for him...	1964-01-01	0.5619586706161499	Both 'Hyde' (Fiction / Mystery & Detective / General) and 'The Mysterious Mr. Hyde' (Drama) share similar genres.	2025-03-24 08:26:39.949056+05:30	15
61	GZAoAQAAIAAJ	Harry Potter and the Deathly Hallows	12444	Harry Potter and the Deathly Hallows: Part 1	https://image.tmdb.org/t/p/w500/iGoXIpQb7Pot00EEdwpwPajheZ5.jpg	Harry, Ron and Hermione walk away from their last year at Hogwarts to find and destroy the remaining Horcruxes, putting an end to Voldemort's bid for immortality. But with Harry's beloved Dumbledore dead and Voldemort's unscrupulous Death Eaters on the loose, the world is more dangerous than ever.	2010-11-17	0.7669550180435181	Both 'Harry Potter and the Deathly Hallows' (Juvenile Fiction / Action & Adventure / General) and 'Harry Potter and the Deathly Hallows: Part 1' (Adventure) share similar genres.	2025-03-24 09:59:48.080875+05:30	5
62	GZAoAQAAIAAJ	Harry Potter and the Deathly Hallows	12445	Harry Potter and the Deathly Hallows: Part 2	https://image.tmdb.org/t/p/w500/c54HpQmuwXjHq2C9wmoACjxoom3.jpg	Harry, Ron and Hermione continue their quest to vanquish the evil Voldemort once and for all. Just as things begin to look hopeless for the young wizards, Harry discovers a trio of magical objects that endow him with powers to rival Voldemort's formidable skills.	2011-07-12	0.6753003597259521	The narrative style of 'Harry Potter and the Deathly Hallows' is reflected in 'Harry Potter and the Deathly Hallows: Part 2'.	2025-03-24 09:59:48.09187+05:30	5
63	5NomkK4EV68C	A Game of Thrones	591278	Game of Thrones: The Last Watch	https://image.tmdb.org/t/p/w500/326nGnxFNGN1zDXvKU9qjzLhcVH.jpg	For a year, acclaimed British filmmaker Jeanie Finlay was embedded on the set of the hit HBO series “Game of Thrones,” chronicling the creation of the show’s most ambitious and complicated season.  Debuting one week after the series 8 finale, GAME OF THRONES: THE LAST WATCH delves deep into the mud and blood to reveal the tears and triumphs involved in the challenge of bringing the fantasy world of Westeros to life in the very real studios, fields and car-parks of Northern Ireland.  Made with unprecedented access, GAME OF THRONES: THE LAST WATCH is an up-close and personal portrait from the trenches of production, following the crew and the cast as they contend with extreme weather, punishing deadlines and an ever-excited fandom hungry for spoilers.  Much more than a “making of” documentary, this is a funny, heartbreaking story, told with wit and intimacy, about the bittersweet pleasures of what it means to create a world – and then have to say goodbye to it.	2019-05-26	0.5238765478134155	Fans of 'A Game of Thrones' often enjoy 'Game of Thrones: The Last Watch'.	2025-04-15 08:24:54.441766+05:30	5
64	5NomkK4EV68C	A Game of Thrones	492606	Game of Thrones - Conquest & Rebellion: An Animated History of the Seven Kingdoms	https://image.tmdb.org/t/p/w500/b3HXxFnhy0pamuDY9rqJ4mk7L1t.jpg	HBO's animated history of Westeros brings to life all the events that shaped the Seven Kingdoms in the thousands of years before Game of Thrones' story begins.	2017-12-12	0.5070308446884155	Both 'A Game of Thrones' (Fiction / Fantasy / Epic) and 'Game of Thrones - Conquest & Rebellion: An Animated History of the Seven Kingdoms' (Animation) share similar genres.	2025-04-15 08:24:54.462897+05:30	5
65	5NomkK4EV68C	A Game of Thrones	607300	Purge of Kingdoms	https://image.tmdb.org/t/p/w500/pDIIRD9f1WuXUrkn138ZrJlGepY.jpg	In a parody of "Game of Thrones," nobles from the Eight Kingdoms gather for Purge Fest 3000 to try and put an end to their violent conflicts, while members of the Fat King's own family conspire to overthrow him.	2019-12-16	0.45464929938316345	Fans of 'A Game of Thrones' often enjoy 'Purge of Kingdoms'.	2025-04-15 08:24:54.463899+05:30	5
66	5NomkK4EV68C	A Game of Thrones	340200	Game of Thrones: A Day in the Life	https://image.tmdb.org/t/p/w500/bkBNHdbqN1Hb43zSrycZmsPkQPo.jpg	Glimpse the epic scale of Game of Thrones in this featurette that spends one day touring various Season 5 sets in Croatia, Spain and Ireland.	2015-02-08	0.4264002740383148	If you enjoyed 'A Game of Thrones', you might like 'Game of Thrones: A Day in the Life'.	2025-04-15 08:24:54.466985+05:30	5
67	GOlWAAAAYAAJ	Around the World in Eighty Days	2897	Around the World in Eighty Days	https://image.tmdb.org/t/p/w500/kk6Rrwh0toMz9tjuUHdS4O3v2Rk.jpg	Based on the famous book by Jules Verne the movie follows Phileas Fogg on his journey around the world. Which has to be completed within 80 days, a very short period for those days.	1956-10-17	0.7460270524024963	The narrative style of 'Around the World in Eighty Days' is reflected in 'Around the World in Eighty Days'.	2025-04-15 08:56:12.422835+05:30	5
68	MH48bnzN0LUC	The Kite Runner	7979	The Kite Runner	https://image.tmdb.org/t/p/w500/dom2esWWW8C9jS2v7dOhW48LwHh.jpg	After spending years in California, Amir returns to his homeland in Afghanistan to help his old friend Hassan, whose son is in trouble.	2007-12-14	0.7051644325256348	'The Kite Runner' offers a cinematic experience that complements 'The Kite Runner'.	2025-04-19 16:01:41.172627+05:30	5
69	os5CuQEACAAJ	Twenty Thousand Leagues Under the Sea	577911	20,000 Leagues Under the Sea	https://image.tmdb.org/t/p/w500/1wHX4kEGmgaVJfSxOH7eUi7tvfI.jpg	Professor Arronax and Ned Land meet Captain Nemo, who reveals that the so-called sea monster they've been told about is actually his submarine The Nautilus.	1973-11-22	0.6564353704452515	'20,000 Leagues Under the Sea' shares significant thematic elements with 'Twenty Thousand Leagues Under the Sea'.	2025-04-19 16:13:46.361578+05:30	5
70	_GmDPwAACAAJ	Anne Frank	2576	The Diary of Anne Frank	https://image.tmdb.org/t/p/w500/i7kUdUAF9eTxQG7GdR6lKUK96En.jpg	The true, harrowing story of a young Jewish girl who, with her family and their friends, is forced into hiding in an attic in Nazi-occupied Amsterdam.	1959-03-18	0.608476459980011	Fans of 'Anne Frank' often enjoy 'The Diary of Anne Frank'.	2025-04-23 00:14:28.293456+05:30	5
71	_GmDPwAACAAJ	Anne Frank	377060	The Diary of Anne Frank	https://image.tmdb.org/t/p/w500/vkapO6E74s1v52GUzAHLnrRoA0S.jpg	The story of Anne Frank, the Jewish girl who went into hiding with her family in Amsterdam and became a victim of the Holocaust.	2016-03-03	0.6019459962844849	Fans of 'Anne Frank' often enjoy 'The Diary of Anne Frank'.	2025-04-23 00:14:28.32479+05:30	5
72	_GmDPwAACAAJ	Anne Frank	128396	Anne Frank's Diary	https://image.tmdb.org/t/p/w500/cFVgglkfaEoBZodxeP1VG9QrNd6.jpg	During World War II, a teenage Jewish girl named Anne Frank and her family are forced into hiding in the Nazi-occupied Netherlands.	1995-08-19	0.5586152076721191	If you enjoyed 'Anne Frank', you might like 'Anne Frank's Diary'.	2025-04-23 00:14:28.326103+05:30	5
73	YNHCkgEACAAJ	Cigars of the Pharaoh	441108	Cigars of the Pharaoh	https://image.tmdb.org/t/p/w500/yj8UC8bcHJLK9AgR2sTKdSZ4jZJ.jpg	While on vacation in Egypt, Tintin encounters an eccentric archaeologist who believes to have found the whereabouts of Pharaoh Kih-Oskh's tomb. Tintin finds there a cigar marked with a strange emblem.	1991-11-06	0.745914101600647	If you enjoyed 'Cigars of the Pharaoh', you might like 'Cigars of the Pharaoh'.	2025-04-23 00:28:47.508574+05:30	5
74	wClZDwAAQBAJ	Jules Verne	416742	Jules Verne. A Life Long Journey	https://image.tmdb.org/t/p/w500/ny8T7HxQ3KU5gdLPhTuiBavBKrI.jpg	The traveler who never leaves his cabinet – that’s what his contemporaries used to call Jules Verne. He was a person with an extraordinary lust for life whose fantasy had no limits, he literally taught us how to dream. Which of us did not aspire of circling the world with Phileas Fogg and Jean Passepartout? Who hasn’t dreamt of roaming the sea with captain Nemo on his quest for vengeance?  This film is yet another piece from the series “Great Dreamers” which already includes some of the most well-known visionaries such as Nicola Tesla (“Free Energy of Tesla”) and Konstantin Tsiolkovsky (“Tsiolkovsky’s Worlds of Miracle”). By having utilized advanced CGI technologies we were able to recreate the life of outstanding persons, pioneers and path breakers in science and research.	2013-04-09	0.5765010118484497	The narrative style of 'Jules Verne' is reflected in 'Jules Verne. A Life Long Journey'.	2025-05-21 00:01:10.426342+05:30	5
75	wClZDwAAQBAJ	Jules Verne	19759	The Fabulous World of Jules Verne	https://image.tmdb.org/t/p/w500/aJ9GqbghpkPJ4siOycoCXEdVC1u.jpg	As the world progresses into the industrial age, a professor studying the "nature of pure matter" is spirited away by a would-be dictator and connived into building a super-bomb, as a  young reporter and a girl rescued from the sea attempt to warn him of their mutual kidnapper's intentions to dominate the world with a new and more-deadly-yet  weapon.	1958-08-22	0.47978276014328003	'The Fabulous World of Jules Verne' explores themes similar to 'Jules Verne'.	2025-05-21 00:01:10.442676+05:30	5
76	wClZDwAAQBAJ	Jules Verne	48135	Jules Verne's Rocket to the Moon	https://image.tmdb.org/t/p/w500/rXKXIYkAAOsEpxm2HBjIran2o1c.jpg	Phineas T. Barnum and friends finance the first flight to the moon but find the task a little above them. They attempt to blast their rocket into orbit from a massive gun barrel built into the side of a Welsh mountain, but money troubles, spies and saboteurs ensure that the plan is doomed before it starts...	1967-07-13	0.44446003437042236	Both 'Jules Verne' (Fiction / Action & Adventure) and 'Jules Verne's Rocket to the Moon' (Comedy) share similar genres.	2025-05-21 00:01:10.444792+05:30	5
\.


--
-- Data for Name: media_recommendations_usermediapreference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."media_recommendations_usermediapreference" ("id", "is_interested", "watched", "rating", "feedback", "created_at", "updated_at", "media_recommendation_id", "user_id") FROM stdin;
\.


--
-- Data for Name: users_abtestassignment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_abtestassignment" ("id", "test_name", "variant", "assigned_at", "user_id") FROM stdin;
\.


--
-- Data for Name: users_abtestoutcome; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_abtestoutcome" ("id", "outcome_value", "created_at", "assignment_id") FROM stdin;
\.


--
-- Data for Name: users_book; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_book" ("book_id", "title", "author", "description", "cover_url", "isbn", "published_year", "genres") FROM stdin;
ttjnCQAAQBAJ	When Strangers Marry	Lisa Kleypas	Anxious to esacpe her impending wedding to a much-despised fiance, Lysette Kersaint seeks refuge with Maximilien Vallerand, a dangerous and powerful rake for whom the innocent beauty represents his ultimate tool for revenge.	\N	\N	2003	["Large print books"]
jyV2DwAAQBAJ	When Strangers Marry	Lisa Kleypas	Anxious to esacpe her impending wedding to a much-despised fiance, Lysette Kersaint seeks refuge with Maximilien Vallerand, a dangerous and powerful rake for whom the innocent beauty represents his ultimate tool for revenge.	\N	\N	2003	["Large print books"]
EnCBAAAAIAAJ	The Zoological Record	\N	Indexes the world's zoological and animal science literature, covering all research from biochemistry to veterinary medicine. The database provides a collection of references from over 4,500 international serial publications, plus books, meetings, reviews and other no- serial literature from over 100 countries. It is the oldest continuing database of animal biology, indexing literature published from 1864 to the present. Zoological Record has long been recognized as the "unofficial register" for taxonomy and systematics, but other topics in animal biology are also covered.	\N	\N	1897	["Classification"]
t4b69z5hs58C	Sphere	Michael Crichton	From the author of Jurassic Park, Timeline, and Congo comes a psychological thriller about a group of scientists who investigate a spaceship discovered on the ocean floor. In the middle of the South Pacific, a thousand feet below the surface, a huge vessel is unearthed. Rushed to the scene is a team of American scientists who descend together into the depths to investigate the astonishing discovery. What they find defies their imaginations and mocks their attempts at logical explanation. It is a spaceship, but apparently it is undamaged by its fall from the sky. And, most startling, it appears to be at least three hundred years old, containing a terrifying and destructive force that must be controlled at all costs.	\N	\N	2012	["Fiction"]
BKjCQgAACAAJ	Red Card	Ranju Aery Dadhwal	This book examines the politicization of victims of terrorism and the reality of the victimization experience of Hindus of Punjab. A very short introduction into the historical, ideological and local and foreign roots of terrorist violence in Punjab in which Hindus are being embattled till today. This violent war of politics and power lasted for almost a decade. Families of Hindus killed or migrated from the state have been shedding tears for the last three decades. Terrorism/ Terrorist does not have a widely agreed definition but is widely accepted as a method of coercion. Victims of terrorism are a unique group of individuals whose experience is overlooked in Punjab on terrorism. Unlike America, where we have seen lobbying activities and political involvement of the victims of terrorism in policy-making and law-enforcement transformations, Punjab has forgotten Hindu terrorist victims for political gains. Killed to lay the foundation of Khalistan or were terrorized and forced to flee the state. To this day these People are deprived of not only justice but even the red-cards given to the families of the victims of terrorism. Without the card they are deprived of the government concessions available to them. This book is based on field work in Punjab, Haryana, some parts of Himachal and Delhi. This focuses on the needs and experiences of victims of terrorism and political violence and does not intend to create a rift between the communities. This book will be of much interest to students of terrorism and political violence for power, victim’s condition and disparities in justice delivered, if any.	\N	\N	2021	["Fiction"]
uYwyjgEACAAJ	Soft Computing and its Engineering Applications	Kanubhai K. Patel, Gayatri Doctor, Atul Patel, Pawan Lingras	This book constitutes the refereed proceedings of the Third International Conference on Soft Computing and its Engineering Applications, icSoftComp 2021, held in Changa, India, in December 2021. Due to the COVID-19 pandemic the conference was held online. The 29 full papers and 4 short papers presented were carefully reviewed and selected from 247 submissions. The papers present recent research on theory and applications in fuzzy computing, neuro computing, and evolutionary computing.	\N	\N	2022	["Computers"]
FrSPEAAAQBAJ	The Jewish Writings	Hannah Arendt	Although Hannah Arendt is not primarily known as a Jewish thinker, she probably wrote more about Jewish issues than any other topic. When she was in her mid-twenties and still living in Germany, Arendt wrote about the history of German Jews as a people living in a land that was not their own. In 1933, at the age of twenty-six, she fled to France, where she helped to arrange for German and eastern European Jewish youth to quit Europe and become pioneers in Palestine. During her years in Paris, Arendt’s principal concern was with the transformation of antisemitism from a social prejudice to a political policy, which would culminate in the Nazi “final solution” to the Jewish question–the physical destruction of European Jewry. After France fell at the beginning of World War II, Arendt escaped from an internment camp in Gurs and made her way to the United States. Almost immediately upon her arrival in New York she wrote one article after another calling for a Jewish army to fight the Nazis, and for a new approach to Jewish political thinking. After the war, her attention was focused on the creation of a Jewish homeland in a binational (Arab-Jewish) state of Israel. Although Arendt’s thoughts eventually turned more to the meaning of human freedom and its inseparability from political life, her original conception of political freedom cannot be fully grasped apart from her experience as a Jew. In 1961 she attended Adolf Eichmann’s trial in Jerusalem. Her report on that trial, Eichmann in Jerusalem, provoked an immense controversy, which culminated in her virtual excommunication from the worldwide Jewish community. Today that controversy is the subject of serious re-evaluation, especially among younger people in America, Europe, and Israel. The publication of The Jewish Writings–much of which has never appeared before–traces Arendt’s life and thought as a Jew. It will put an end to any doubts about the centrality, from beginning to end, of Arendt’s Jewish experience.	\N	\N	2009	["Religion"]
N2LhAAAAMAAJ	On the Rez	Ian Frazier	Raw account of modern day Oglala Sioux who now live on the Pine Ridge Indian reservation.	\N	\N	2001	["Biography & Autobiography"]
koxFAAAAYAAJ	Ibaaddo Ka-Baʼiso	Eike Haberland, Marcello Lamberti	\N	\N	\N	1988	["Abaya Lake (Ethiopia)"]
xg2iDwAAQBAJ	Focus On: 100 Most Popular Actresses in Hindi Cinema	Wikipedia contributors	\N	\N	\N	\N	[]
6vGiDwAAQBAJ	Focus On: 100 Most Popular Actresses in Hindi Cinema	Wikipedia contributors	\N	\N	\N	\N	[]
MZyXEAAAQBAJ	Focus On: 100 Most Popular Actresses in Hindi Cinema	Wikipedia contributors	\N	\N	\N	\N	[]
\.


--
-- Data for Name: users_bookcontentanalysis; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_bookcontentanalysis" ("id", "keywords", "mood", "analyzed_at", "book_id", "themes") FROM stdin;
\.


--
-- Data for Name: users_bookshelf; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_bookshelf" ("id", "book_id", "title", "authors", "image", "status", "added_date", "user_id", "page_count", "user_rating", "categories", "description") FROM stdin;
1	EvqJCGeqKhsC	Pride and Prejudice	Jane Austen	http://books.google.com/books/content?id=EvqJCGeqKhsC&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-03-03 23:42:07.229454+05:30	3	0	0.0	[]	\N
5	fFCjDQAAQBAJ	Atomic Habits	James Clear	http://books.google.com/books/content?id=fFCjDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-03 23:42:28.836635+05:30	3	0	0.0	[]	\N
51	QES7mCcS4EwC	Above and Beyond	Sandra Brown	http://books.google.com/books/content?id=QES7mCcS4EwC&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-03-21 19:13:02.123987+05:30	5	\N	0.0	[]	\N
4	75E9EQAAQBAJ	The Best of Sherlock Holmes	Arthur Conan Doyle	http://books.google.com/books/content?id=75E9EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-03 23:42:22.870677+05:30	3	0	0.0	[]	\N
3	PGR2AwAAQBAJ	To Kill a Mockingbird	Harper Lee	http://books.google.com/books/content?id=PGR2AwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-03 23:42:14.916873+05:30	3	0	0.0	[]	\N
2	uyr8BAAAQBAJ	1984	George Orwell	http://books.google.com/books/content?id=uyr8BAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-03 23:42:11.487245+05:30	3	0	0.0	[]	\N
10	75E9EQAAQBAJ	The Best of Sherlock Holmes	Arthur Conan Doyle	http://books.google.com/books/content?id=75E9EQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-15 15:36:54.047259+05:30	7	0	0.0	[]	\N
11	MH48bnzN0LUC	The Kite Runner	Khaled Hosseini	http://books.google.com/books/content?id=MH48bnzN0LUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-15 15:37:01.395139+05:30	7	0	0.0	[]	\N
12	CscDAAAAMBAJ	Best Life	Unknown Author	http://books.google.com/books/content?id=CscDAAAAMBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-17 12:01:13.419527+05:30	8	0	0.0	[]	\N
14	fFCjDQAAQBAJ	Atomic Habits	James Clear	http://books.google.com/books/content?id=fFCjDQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-17 16:53:54.215685+05:30	11	0	0.0	[]	\N
31	koxFAAAAYAAJ	The First Immortal	James L. Halperin	http://books.google.com/books/content?id=koxFAAAAYAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-19 00:31:37.278886+05:30	5	\N	0.0	[]	\N
32	003H8QT_jpkC	Journal of a UFO Investigator	David Halperin	http://books.google.com/books/content?id=003H8QT_jpkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-19 00:40:23.380583+05:30	5	\N	0.0	[]	\N
33	Ae2MBqG9bGkC	The Light of Asia	Sir Edwin Arnold	http://books.google.com/books/content?id=Ae2MBqG9bGkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-19 00:40:30.947786+05:30	5	\N	0.0	[]	\N
20	xg2iDwAAQBAJ	The Murder On The Links	Agatha Christie	http://books.google.com/books/content?id=xg2iDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-18 14:23:48.946948+05:30	5	0	0.0	[]	\N
27	ttjnCQAAQBAJ	Small Wars	Lee Child	http://books.google.com/books/content?id=ttjnCQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-18 14:52:36.407708+05:30	5	0	0.0	[]	\N
26	k684HAAACAAJ	Mr. Timothy	Louis Bayard	http://books.google.com/books/content?id=k684HAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-18 14:52:31.690701+05:30	5	0	0.0	[]	\N
28	2r8IsOq15hkC	The Peculiar Pumpkin Thief	Geronimo Stilton	http://books.google.com/books/content?id=2r8IsOq15hkC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-18 14:52:40.54249+05:30	5	0	0.0	[]	\N
29	jyV2DwAAQBAJ	Ultralearning	Scott H. Young	http://books.google.com/books/content?id=jyV2DwAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-18 14:52:45.352127+05:30	5	0	0.0	[]	\N
30	sL4SEAAAQBAJ	Beautiful World, Where Are You	Sally Rooney	http://books.google.com/books/content?id=sL4SEAAAQBAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-18 15:56:03.469485+05:30	12	\N	0.0	[]	\N
35	EnCBAAAAIAAJ	The Black Book	Orhan Pamuk	http://books.google.com/books/content?id=EnCBAAAAIAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73ldQdlFCYITVrSbcbqb9qZrzn_YSlV7JKgM22QSxks5_WPUYZ2-JQ-7s6WyOr3SEtd_peWCaQXJyXhd_6d2wQRBbj10YAmV29YWM6FgE_Vp4WRQ2gPDiRfnDtqcz8JfpvUDqHA&source=gbs_api	read	2025-03-19 00:56:44.767047+05:30	5	\N	0.0	[]	\N
36	6vGiDwAAQBAJ	The Picture of Dorian Gray	Oscar Wilde	http://books.google.com/books/publisher/content?id=6vGiDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE71fkQp1K1UaOtliF9rryVk-EYXxR0jHwQG7UNPD6Jj_fn15Lu5JZWtzhO1z1cXF0AjgvpYs8lxu-7e6fjzBQ7Sz_-vczUmthRIzJZbraXGIejt6CpVPb8z02s9OcpE9lJr-yyRe&source=gbs_api	to_read	2025-03-19 00:59:28.336522+05:30	5	\N	0.0	[]	\N
37	BKjCQgAACAAJ	The ABC Murders	Agatha Christie	http://books.google.com/books/content?id=BKjCQgAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70anvSDlOgnnPoiys2vExpywMAsoWMauWmPN00EpHcv5MMK6hXFacEVw82AQ1NzWK_vkjhsxskxb3dIC0gbC7jpXe0tAcj1vZmSEe2a5PDcYJbvb0CE9BqlOFbVt9sQVs293CM_&source=gbs_api	to_read	2025-03-20 15:10:00.925832+05:30	5	\N	0.0	[]	\N
48	uYwyjgEACAAJ	Divergent	Veronica Roth	http://books.google.com/books/content?id=uYwyjgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-21 19:11:07.161697+05:30	5	\N	0.0	["[\\"Chicago (Ill.)\\"]"]	\N
49	xnCCDwAAQBAJ	Promote Your Book	Patricia Fry	http://books.google.com/books/content?id=xnCCDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-21 19:12:07.247754+05:30	5	275	0.0	["[\\"Language Arts & Disciplines\\"]"]	\N
54	N2LhAAAAMAAJ	The Absolutely True Diary of a Part-Time Indian	Sherman Alexie	http://books.google.com/books/content?id=N2LhAAAAMAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-03-21 21:57:13.159399+05:30	5	254	0.0	["[\\"Young Adult Fiction\\"]"]	\N
55	MZyXEAAAQBAJ	Mohini Theevu	Kalki	http://books.google.com/books/content?id=MZyXEAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-21 21:58:21.351963+05:30	5	\N	0.0	[]	\N
56	t4b69z5hs58C	Sphere	Michael Crichton	http://books.google.com/books/content?id=t4b69z5hs58C&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-22 18:02:24.062061+05:30	5	\N	0.0	["[\\"Not specified\\"]"]	\N
60	gqX1DwAAQBAJ	China Room	Sunjeev Sahota	http://books.google.com/books/content?id=gqX1DwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-23 12:59:34.380707+05:30	13	\N	0.0	["[\\"Not specified\\"]"]	\N
34	icKmd-tlvPMC	Journey to the Center of the Earth	Jules Verne	http://books.google.com/books/content?id=icKmd-tlvPMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-19 00:42:39.652186+05:30	5	\N	0.0	[]	\N
53	FrSPEAAAQBAJ	Harry Potter and the Sorcerer's Stone	J.K. Rowling	http://books.google.com/books/publisher/content?id=FrSPEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE72tDwZsnMkp1qyeyqIwF4oKgB9PkWI3QsvaJqo1lU6yBrNmx9Ne9HCsoTe0Mvld94XMqnr0jrnhZH9dSuNd-P61JNfWkrsrh5E496v8xYo6tlqdDPAoJjFuGK9JxH1vQvPGLb5e&source=gbs_api	read	2025-03-21 19:14:25.797105+05:30	5	\N	0.0	[]	\N
70	hapdAAAAQBAJ	The World of Ice & Fire	George R. R. Martin, Elio M. García Jr., Linda Antonsson	http://books.google.com/books/content?id=hapdAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-23 16:27:40.223411+05:30	7	\N	0.0	[]	\N
71	QlAnF4NFb6EC	A Dance With Dragons: Part 2 After The Feast (A Song of Ice and Fire, Book 5)	George R.R. Martin	http://books.google.com/books/content?id=QlAnF4NFb6EC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-23 16:27:43.19388+05:30	7	\N	0.0	[]	\N
72	mk-dBAAAQBAJ	A Knight of the Seven Kingdoms	George R.R. Martin	http://books.google.com/books/content?id=mk-dBAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-23 16:27:46.070286+05:30	7	\N	0.0	[]	\N
74	x3tgDwAAQBAJ	Normal People	Sally Rooney	http://books.google.com/books/content?id=x3tgDwAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-24 07:26:32.249949+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
76	D--1AAAAIAAJ	Mrs. Gandhi	Dom Moraes	http://books.google.com/books/content?id=D--1AAAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-03-24 07:26:46.397102+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
78	d2WZDgAAQBAJ	Einstein	Walter Isaacson	http://books.google.com/books/content?id=d2WZDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-24 07:26:55.653647+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
75	GZAoAQAAIAAJ	Harry Potter and the Deathly Hallows	J. K. Rowling	http://books.google.com/books/content?id=GZAoAQAAIAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-24 07:26:36.404523+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
77	38iSPwAACAAJ	Prince Caspian	Clive Staples Lewis	http://books.google.com/books/content?id=38iSPwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-24 07:26:50.292049+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
73	WbtvDgAAQBAJ	Conversations with Friends	Sally Rooney	http://books.google.com/books/content?id=WbtvDgAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-24 07:26:27.462947+05:30	14	\N	0.0	["[\\"Not specified\\"]"]	\N
79	ld5GswEACAAJ	The Fellowship of the Ring	John Ronald Reuel Tolkien	http://books.google.com/books/content?id=ld5GswEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-03-24 07:29:16.940089+05:30	14	\N	0.0	[]	\N
82	dQkFLM8_5ZEC	The Return of the King (The Lord of the Rings, Book 3)	J. R. R. Tolkien	http://books.google.com/books/content?id=dQkFLM8_5ZEC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-03-24 07:29:32.33926+05:30	14	\N	0.0	[]	\N
80	bm2cPwAACAAJ	The Fellowship of the Ring	J. R. R. Tolkien	http://books.google.com/books/content?id=bm2cPwAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-24 07:29:21.101052+05:30	14	\N	0.0	[]	\N
81	Hj6pQAAACAAJ	The Two Towers	J. R. R. Tolkien	http://books.google.com/books/content?id=Hj6pQAAACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-24 07:29:28.713244+05:30	14	\N	0.0	[]	\N
83	l0kJEQAAQBAJ	Hyde	Craig Russell	http://books.google.com/books/content?id=l0kJEQAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-24 08:26:21.20494+05:30	15	\N	0.0	["[\\"Not specified\\"]"]	\N
84	qOyNEAAAQBAJ	The Devil Aspect	Craig Russell	http://books.google.com/books/publisher/content?id=qOyNEAAAQBAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE70truS5XaGWD0N5JlVr_3HAoWv_s-aPgYFuY3yCGGVruroMxqMVLHUyxZ05pqad-LYbPkPXBh5ePZBZ99EGS41NUY21qjuf6yaz37NbbSqRpN_k4G9BILeB54UylDlhBRlxylsd&source=gbs_api	read	2025-03-24 08:31:16.109923+05:30	15	\N	0.0	[]	\N
85	5NomkK4EV68C	A Game of Thrones	George R. R. Martin	http://books.google.com/books/content?id=5NomkK4EV68C&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-04-15 08:27:05.650878+05:30	5	\N	0.0	[]	\N
61	icKmd-tlvPMC	Journey to the Center of the Earth	Jules Verne	http://books.google.com/books/content?id=icKmd-tlvPMC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	read	2025-03-23 16:09:54.160085+05:30	7	\N	0.0	[]	\N
69	9KWp0AEACAAJ	A Song of Ice and Fire	George R. R. Martin	http://books.google.com/books/content?id=9KWp0AEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	read	2025-03-23 16:27:33.760727+05:30	7	\N	0.0	[]	\N
86	MH48bnzN0LUC	The Kite Runner	Khaled Hosseini	http://books.google.com/books/content?id=MH48bnzN0LUC&printsec=frontcover&img=1&zoom=1&edge=curl&source=gbs_api	to_read	2025-04-19 16:13:27.107222+05:30	5	337	0.0	["[\\"Fiction\\"]"]	\N
87	OX8lAAAAQBAJ	Divergent (Divergent Trilogy, Book 1)	Veronica Roth	http://books.google.com/books/publisher/content?id=OX8lAAAAQBAJ&printsec=frontcover&img=1&zoom=1&edge=curl&imgtk=AFLRE73TvzxqcyOliCbV253uwI6KczIzV7Z8EbtXfpLBNyTU7LFDUTnerCvsJA3MFH1QT8NyYxAD3cuQVoYhz4BLrXWt0bekp6bmucR6EMvUbt-1u5tPTh1w6M0IWNIqwvUSMnTymuoD&source=gbs_api	to_read	2025-04-21 16:12:14.323204+05:30	5	\N	0.0	[]	\N
88	_GmDPwAACAAJ	Anne Frank	Anne Frank	http://books.google.com/books/content?id=_GmDPwAACAAJ&printsec=frontcover&img=1&zoom=1&imgtk=AFLRE73m9irITcvc-heVX1u16fI5k8WhdXn3yAWghIs47al7PW9coUF7EVL7uUbcAIYm8i0Z24k3r9mzWPxfvGf9Y2rvapbJVZDlJqYmIJeEhWSd9lpQI-Z8XUrgBVkqQ1vbuuQOgrws&source=gbs_api	read	2025-04-23 00:14:55.938505+05:30	5	\N	0.0	[]	\N
89	YNHCkgEACAAJ	Cigars of the Pharaoh	Hergé	http://books.google.com/books/content?id=YNHCkgEACAAJ&printsec=frontcover&img=1&zoom=1&source=gbs_api	to_read	2025-04-23 00:28:35.349823+05:30	5	\N	0.0	[]	\N
\.


--
-- Data for Name: users_customuser; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_customuser" ("id", "password", "last_login", "is_superuser", "first_name", "last_name", "is_staff", "is_active", "email", "username", "date_joined", "bio", "books_read", "favorite_authors", "favorite_genres", "profile_picture", "reading_goal_completed", "reading_goal_target", "reading_goal_year") FROM stdin;
13	pbkdf2_sha256$870000$kiX0csBEZiF6LIhjhF7Vvc$dPR0bD8O3/Djfz5vtG4moxHqKJlb/6JcbUq5WrjKRco=	2025-03-23 12:59:12.105858+05:30	f			f	t	Cheannai@gmail.com	Chennaiexpress	2025-03-23 12:59:09.960151+05:30	\N	["gqX1DwAAQBAJ"]	\N	\N		0	0	2025
1	pbkdf2_sha256$870000$dLCCrV3fna7HSKX21NWiMC$tIN28arOWlQrrgRyeDktjY/edbLGXtoXYrDZk3pcOl4=	2025-02-26 23:59:40.353746+05:30	f			f	t	suhaib@gmail.com	suhaib	2025-02-26 23:40:56.10099+05:30	\N	[]	\N	\N	\N	0	0	2025
16	pbkdf2_sha256$870000$cjloO7RZUyoKKehmi0Ukhq$dnrEF7P81O6a1zoK4YKnyH9/c0p8h14bC0sgzn6BLjI=	2025-04-23 00:09:52.129756+05:30	f			f	t	saad@gmail.com	saad	2025-04-23 00:09:51.196186+05:30	\N	[]	\N	\N		0	0	2025
4	pbkdf2_sha256$870000$B6JljLspLxIb6173oLqcOA$ntkmdlVORbPPykVm3tFpD7fadopHUsQbn8PPMoubSrs=	2025-03-02 15:22:39.277185+05:30	f			f	t	sam1@gmail.com	sam1	2025-03-02 15:22:29.817735+05:30	\N	[]	\N	\N	\N	0	0	2025
8	pbkdf2_sha256$870000$FIhAV71BxIb2VCwmLwNlZt$0pcIIMZQWBrw/i7Ab7lYgSFDqIjGJgfwAoI21SDzFGw=	2025-03-17 11:57:14.712152+05:30	f			f	t	stan@gmail.com	stanley	2025-03-17 11:57:14.141343+05:30	\N	["The Chronicles of Narnia"]	J R R Tolkien, C S Lewis	Fantasy, Biography		0	0	2025
9	pbkdf2_sha256$870000$iGxEFl8DNvQId3ajANkNgN$hMdmjRsOebKHnms+NZ/2aFen7AoG6/REIBruos3K1Ns=	2025-03-17 12:23:54.420483+05:30	f			f	t	sh@gmail.com	shaun	2025-03-17 12:23:53.729464+05:30	\N	[]	\N	\N		0	0	2025
3	pbkdf2_sha256$870000$87bVtW4F3gdGq2uNvfstjh$/e+XN4d9s8lYR5PrvrFVTtxeU9zI84cQfcTC1AEzYz4=	2025-03-11 23:48:20.69225+05:30	f			f	t	john@gmail.com	john	2025-03-02 00:24:08.150932+05:30	i like to read books	["Never go back", "1984", "PGR2AwAAQBAJ", "uyr8BAAAQBAJ"]	J K Rowling, Lee Child	History, Fiction	profile_pictures/3_Profile pic new-min.png	0	0	2025
15	pbkdf2_sha256$870000$vdpWPJ8FO7Vus7in8vKtHh$+RibB3stXKjPgIC2pTyMyZ4AtrCPoGsVXAqu/tSGSgg=	2025-03-24 08:25:12.570712+05:30	f			f	t	harrisjo1810@gmail.com	harrisjoshua	2025-03-24 08:25:11.591989+05:30	\N	["l0kJEQAAQBAJ", "qOyNEAAAQBAJ"]	\N	\N		0	1	2025
12	pbkdf2_sha256$870000$OThUBdnGcCMghh1HrGjq04$pLDui1wpGfNf7Zc2oQ3IQe4UYCA4AnOlMt8CqEC3MyY=	2025-03-18 15:52:37.046851+05:30	f			f	t	shjh@gmsil.com	shalwin	2025-03-18 15:52:35.063999+05:30	\N	["Normal People", "sL4SEAAAQBAJ"]	Sally Rooney	Romance		1	0	2025
2	pbkdf2_sha256$870000$lVZdNjD0GwqT6HVtvkO4dA$ifQQtvcAMWaJhEgaczR1YTdqNRmXg1zGsk79OZUXgnY=	2025-02-28 07:06:50.671694+05:30	f			f	t	sam@gmail.com	sam	2025-02-27 23:51:03.386538+05:30	\N	[]	\N	\N	\N	0	0	2025
10	pbkdf2_sha256$870000$s3BjebexO4Ud0f0vhC2RVm$61Th0K3O+OH/To64qoMc2dKDm5/KftlvDkrTlnPIL2o=	2025-03-17 15:45:00.360708+05:30	f			f	t	harry@gmail.com	harry	2025-03-17 15:44:58.382168+05:30	\N	[]	\N	\N		0	0	2025
11	pbkdf2_sha256$870000$axduBswy0tvd4GUGiw8VGW$s5TnMUI0aA8dhcXRbfcz9mQYlKtJmlw1GHqdD2Dtyow=	2025-03-17 16:51:37.216756+05:30	f			f	t	sm@gmail.com	sta	2025-03-17 16:51:34.958661+05:30	\N	[]	\N	\N		0	0	2025
17	pbkdf2_sha256$870000$SIhnGe7WEhjYB8symDbXmF$GOSLwukF9kulfIEk5zEgnH6WUICrJx8OnQ7pGYhoUdI=	2025-04-23 08:48:53.058023+05:30	f			f	t	byleen@gmail.com	byleen	2025-04-23 08:48:51.058512+05:30	\N	[]	\N	\N		0	0	2025
7	pbkdf2_sha256$870000$NogVRLxoGeEuUmKwaOP4CE$u4H/qlqX/lJpMth+SAXyQsCs2KWR+6tXUtXbxfCY3Ds=	2025-05-20 23:49:02.985645+05:30	t			t	t	suhaib.muhammed2002@gmail.com	admin	2025-03-11 23:53:52.222075+05:30	\N	["Harry Potter", "To kill a mockingbird", "don quixote", "1984", "Never go back", "MH48bnzN0LUC", "icKmd-tlvPMC", "9KWp0AEACAAJ"]	J K Rowling, Lee Child, Blake Crouch, Anthony Doerr	History, Fiction, Biography, Mystery, Thriller	profile_pictures/7_bg.jpg	2	0	2025
14	pbkdf2_sha256$870000$0zCJTCnCTzPhsO0rG41pC3$n2XdFIzorq4eK2jVES/fPF0ekuhDnJNraP5j6++6rvI=	2025-03-24 07:25:02.000021+05:30	f			f	t	harryp@gmail.com	harryp	2025-03-24 07:25:01.539828+05:30	i like to read	["Intermezzo", "GZAoAQAAIAAJ", "38iSPwAACAAJ", "WbtvDgAAQBAJ", "bm2cPwAACAAJ", "Hj6pQAAACAAJ"]	Sally Rooney	Fantasy, Biography		5	0	2025
5	pbkdf2_sha256$870000$BHUKbLaqS8gq4uWcUTHXul$3irjzJj5VwJ76PCH1Re69ibWjETWwA0HQDmbSw1b5bA=	2025-05-21 00:00:33.886533+05:30	f			f	t	mdsuhaib@gmail.com	mdsuhaib	2025-03-03 23:01:49.425583+05:30	i like to read	["Never Go Back", "Murder on the orient express", "And then there were none", "xg2iDwAAQBAJ", "ttjnCQAAQBAJ", "k684HAAACAAJ", "2r8IsOq15hkC", "jyV2DwAAQBAJ", "koxFAAAAYAAJ", "EnCBAAAAIAAJ", "uYwyjgEACAAJ", "icKmd-tlvPMC", "FrSPEAAAQBAJ", "_GmDPwAACAAJ"]	J R R Tolkien, Lee Child, Khaled Hosseini	Mystery, Poetry, Thriller	profile_pictures/5_20240828_133320.jpg	10	24	2025
\.


--
-- Data for Name: users_customuser_groups; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_customuser_groups" ("id", "customuser_id", "group_id") FROM stdin;
\.


--
-- Data for Name: users_customuser_user_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_customuser_user_permissions" ("id", "customuser_id", "permission_id") FROM stdin;
\.


--
-- Data for Name: users_userpreference; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_userpreference" ("id", "media_id", "media_type", "rating", "liked", "clicked", "ignored", "created_at", "updated_at", "user_id") FROM stdin;
1	1301650	movie	2	\N	f	f	2025-03-22 19:59:08.708554+05:30	2025-03-22 19:59:08.708554+05:30	5
2	822119	movie	2	\N	f	f	2025-03-22 19:59:14.83693+05:30	2025-03-22 19:59:14.83693+05:30	5
\.


--
-- Data for Name: users_userpreferences; Type: TABLE DATA; Schema: public; Owner: -
--

COPY "public"."users_userpreferences" ("id", "favorite_genres", "favorite_authors", "books_read", "user_id") FROM stdin;
1			[]	4
2			[]	5
3			[]	8
4			[]	9
5			[]	10
6			[]	11
7			[]	12
8			[]	13
9			[]	14
10			[]	15
11			[]	16
12			[]	17
\.


--
-- Name: auth_group_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_group_id_seq"', 1, false);


--
-- Name: auth_group_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_group_permissions_id_seq"', 1, false);


--
-- Name: auth_permission_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."auth_permission_id_seq"', 84, true);


--
-- Name: communities_bookclub_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."communities_bookclub_id_seq"', 6, true);


--
-- Name: communities_clubmembership_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."communities_clubmembership_id_seq"', 13, true);


--
-- Name: communities_message_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."communities_message_id_seq"', 13, true);


--
-- Name: django_admin_log_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_admin_log_id_seq"', 1, false);


--
-- Name: django_content_type_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_content_type_id_seq"', 21, true);


--
-- Name: django_migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_migrations_id_seq"', 45, true);


--
-- Name: django_site_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."django_site_id_seq"', 1, true);


--
-- Name: media_recommendations_mediarecommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."media_recommendations_mediarecommendation_id_seq"', 1, false);


--
-- Name: media_recommendations_movierecommendation_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."media_recommendations_movierecommendation_id_seq"', 76, true);


--
-- Name: media_recommendations_usermediapreference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."media_recommendations_usermediapreference_id_seq"', 1, false);


--
-- Name: users_abtestassignment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_abtestassignment_id_seq"', 1, false);


--
-- Name: users_abtestoutcome_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_abtestoutcome_id_seq"', 1, false);


--
-- Name: users_bookcontentanalysis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_bookcontentanalysis_id_seq"', 1, false);


--
-- Name: users_bookshelf_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_bookshelf_id_seq"', 89, true);


--
-- Name: users_customuser_groups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_customuser_groups_id_seq"', 1, false);


--
-- Name: users_customuser_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_customuser_id_seq"', 17, true);


--
-- Name: users_customuser_user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_customuser_user_permissions_id_seq"', 1, false);


--
-- Name: users_userpreference_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_userpreference_id_seq"', 2, true);


--
-- Name: users_userpreferences_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('"public"."users_userpreferences_id_seq"', 12, true);


--
-- Name: auth_group auth_group_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group"
    ADD CONSTRAINT "auth_group_name_key" UNIQUE ("name");


--
-- Name: auth_group_permissions auth_group_permissions_group_id_permission_id_0cd325b0_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_group_id_permission_id_0cd325b0_uniq" UNIQUE ("group_id", "permission_id");


--
-- Name: auth_group_permissions auth_group_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_pkey" PRIMARY KEY ("id");


--
-- Name: auth_group auth_group_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group"
    ADD CONSTRAINT "auth_group_pkey" PRIMARY KEY ("id");


--
-- Name: auth_permission auth_permission_content_type_id_codename_01ab375a_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_content_type_id_codename_01ab375a_uniq" UNIQUE ("content_type_id", "codename");


--
-- Name: auth_permission auth_permission_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_pkey" PRIMARY KEY ("id");


--
-- Name: communities_bookclub communities_bookclub_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_bookclub"
    ADD CONSTRAINT "communities_bookclub_pkey" PRIMARY KEY ("id");


--
-- Name: communities_clubmembership communities_clubmembership_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_clubmembership"
    ADD CONSTRAINT "communities_clubmembership_pkey" PRIMARY KEY ("id");


--
-- Name: communities_clubmembership communities_clubmembership_user_id_book_club_id_a8658c9c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_clubmembership"
    ADD CONSTRAINT "communities_clubmembership_user_id_book_club_id_a8658c9c_uniq" UNIQUE ("user_id", "book_club_id");


--
-- Name: communities_message communities_message_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_message"
    ADD CONSTRAINT "communities_message_pkey" PRIMARY KEY ("id");


--
-- Name: django_admin_log django_admin_log_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_pkey" PRIMARY KEY ("id");


--
-- Name: django_cache_table django_cache_table_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_cache_table"
    ADD CONSTRAINT "django_cache_table_pkey" PRIMARY KEY ("cache_key");


--
-- Name: django_content_type django_content_type_app_label_model_76bd3d3b_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_content_type"
    ADD CONSTRAINT "django_content_type_app_label_model_76bd3d3b_uniq" UNIQUE ("app_label", "model");


--
-- Name: django_content_type django_content_type_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_content_type"
    ADD CONSTRAINT "django_content_type_pkey" PRIMARY KEY ("id");


--
-- Name: django_migrations django_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_migrations"
    ADD CONSTRAINT "django_migrations_pkey" PRIMARY KEY ("id");


--
-- Name: django_session django_session_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_session"
    ADD CONSTRAINT "django_session_pkey" PRIMARY KEY ("session_key");


--
-- Name: django_site django_site_domain_a2e37b91_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_site"
    ADD CONSTRAINT "django_site_domain_a2e37b91_uniq" UNIQUE ("domain");


--
-- Name: django_site django_site_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_site"
    ADD CONSTRAINT "django_site_pkey" PRIMARY KEY ("id");


--
-- Name: media_recommendations_mediarecommendation media_recommendations_mediarecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_mediarecommendation"
    ADD CONSTRAINT "media_recommendations_mediarecommendation_pkey" PRIMARY KEY ("id");


--
-- Name: media_recommendations_movierecommendation media_recommendations_mo_user_id_book_id_movie_id_ac1cc1df_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_movierecommendation"
    ADD CONSTRAINT "media_recommendations_mo_user_id_book_id_movie_id_ac1cc1df_uniq" UNIQUE ("user_id", "book_id", "movie_id");


--
-- Name: media_recommendations_movierecommendation media_recommendations_movierecommendation_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_movierecommendation"
    ADD CONSTRAINT "media_recommendations_movierecommendation_pkey" PRIMARY KEY ("id");


--
-- Name: media_recommendations_usermediapreference media_recommendations_us_user_id_media_recommenda_0e1455b1_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_usermediapreference"
    ADD CONSTRAINT "media_recommendations_us_user_id_media_recommenda_0e1455b1_uniq" UNIQUE ("user_id", "media_recommendation_id");


--
-- Name: media_recommendations_usermediapreference media_recommendations_usermediapreference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_usermediapreference"
    ADD CONSTRAINT "media_recommendations_usermediapreference_pkey" PRIMARY KEY ("id");


--
-- Name: users_abtestassignment users_abtestassignment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_abtestassignment"
    ADD CONSTRAINT "users_abtestassignment_pkey" PRIMARY KEY ("id");


--
-- Name: users_abtestassignment users_abtestassignment_user_id_test_name_b00d507c_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_abtestassignment"
    ADD CONSTRAINT "users_abtestassignment_user_id_test_name_b00d507c_uniq" UNIQUE ("user_id", "test_name");


--
-- Name: users_abtestoutcome users_abtestoutcome_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_abtestoutcome"
    ADD CONSTRAINT "users_abtestoutcome_pkey" PRIMARY KEY ("id");


--
-- Name: users_book users_book_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_book"
    ADD CONSTRAINT "users_book_pkey" PRIMARY KEY ("book_id");


--
-- Name: users_bookcontentanalysis users_bookcontentanalysis_book_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookcontentanalysis"
    ADD CONSTRAINT "users_bookcontentanalysis_book_id_key" UNIQUE ("book_id");


--
-- Name: users_bookcontentanalysis users_bookcontentanalysis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookcontentanalysis"
    ADD CONSTRAINT "users_bookcontentanalysis_pkey" PRIMARY KEY ("id");


--
-- Name: users_bookshelf users_bookshelf_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookshelf"
    ADD CONSTRAINT "users_bookshelf_pkey" PRIMARY KEY ("id");


--
-- Name: users_bookshelf users_bookshelf_user_id_book_id_e1a96a61_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookshelf"
    ADD CONSTRAINT "users_bookshelf_user_id_book_id_e1a96a61_uniq" UNIQUE ("user_id", "book_id");


--
-- Name: users_customuser users_customuser_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser"
    ADD CONSTRAINT "users_customuser_email_key" UNIQUE ("email");


--
-- Name: users_customuser_groups users_customuser_groups_customuser_id_group_id_76b619e3_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_groups"
    ADD CONSTRAINT "users_customuser_groups_customuser_id_group_id_76b619e3_uniq" UNIQUE ("customuser_id", "group_id");


--
-- Name: users_customuser_groups users_customuser_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_groups"
    ADD CONSTRAINT "users_customuser_groups_pkey" PRIMARY KEY ("id");


--
-- Name: users_customuser users_customuser_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser"
    ADD CONSTRAINT "users_customuser_pkey" PRIMARY KEY ("id");


--
-- Name: users_customuser_user_permissions users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_user_permissions"
    ADD CONSTRAINT "users_customuser_user_pe_customuser_id_permission_7a7debf6_uniq" UNIQUE ("customuser_id", "permission_id");


--
-- Name: users_customuser_user_permissions users_customuser_user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_user_permissions"
    ADD CONSTRAINT "users_customuser_user_permissions_pkey" PRIMARY KEY ("id");


--
-- Name: users_customuser users_customuser_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser"
    ADD CONSTRAINT "users_customuser_username_key" UNIQUE ("username");


--
-- Name: users_userpreference users_userpreference_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreference"
    ADD CONSTRAINT "users_userpreference_pkey" PRIMARY KEY ("id");


--
-- Name: users_userpreference users_userpreference_user_id_media_id_media_type_916749eb_uniq; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreference"
    ADD CONSTRAINT "users_userpreference_user_id_media_id_media_type_916749eb_uniq" UNIQUE ("user_id", "media_id", "media_type");


--
-- Name: users_userpreferences users_userpreferences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreferences"
    ADD CONSTRAINT "users_userpreferences_pkey" PRIMARY KEY ("id");


--
-- Name: users_userpreferences users_userpreferences_user_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreferences"
    ADD CONSTRAINT "users_userpreferences_user_id_key" UNIQUE ("user_id");


--
-- Name: auth_group_name_a6ea08ec_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_name_a6ea08ec_like" ON "public"."auth_group" USING "btree" ("name" "varchar_pattern_ops");


--
-- Name: auth_group_permissions_group_id_b120cbf9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_permissions_group_id_b120cbf9" ON "public"."auth_group_permissions" USING "btree" ("group_id");


--
-- Name: auth_group_permissions_permission_id_84c5c92e; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_group_permissions_permission_id_84c5c92e" ON "public"."auth_group_permissions" USING "btree" ("permission_id");


--
-- Name: auth_permission_content_type_id_2f476e4b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "auth_permission_content_type_id_2f476e4b" ON "public"."auth_permission" USING "btree" ("content_type_id");


--
-- Name: communities_bookclub_creator_id_4766529a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communities_bookclub_creator_id_4766529a" ON "public"."communities_bookclub" USING "btree" ("creator_id");


--
-- Name: communities_clubmembership_book_club_id_93f648c8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communities_clubmembership_book_club_id_93f648c8" ON "public"."communities_clubmembership" USING "btree" ("book_club_id");


--
-- Name: communities_clubmembership_user_id_b596a290; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communities_clubmembership_user_id_b596a290" ON "public"."communities_clubmembership" USING "btree" ("user_id");


--
-- Name: communities_message_book_club_id_303f4bd6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communities_message_book_club_id_303f4bd6" ON "public"."communities_message" USING "btree" ("book_club_id");


--
-- Name: communities_message_sender_id_59027e60; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "communities_message_sender_id_59027e60" ON "public"."communities_message" USING "btree" ("sender_id");


--
-- Name: django_admin_log_content_type_id_c4bce8eb; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_admin_log_content_type_id_c4bce8eb" ON "public"."django_admin_log" USING "btree" ("content_type_id");


--
-- Name: django_admin_log_user_id_c564eba6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_admin_log_user_id_c564eba6" ON "public"."django_admin_log" USING "btree" ("user_id");


--
-- Name: django_cache_table_expires; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_cache_table_expires" ON "public"."django_cache_table" USING "btree" ("expires");


--
-- Name: django_session_expire_date_a5c62663; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_session_expire_date_a5c62663" ON "public"."django_session" USING "btree" ("expire_date");


--
-- Name: django_session_session_key_c0390e0f_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_session_session_key_c0390e0f_like" ON "public"."django_session" USING "btree" ("session_key" "varchar_pattern_ops");


--
-- Name: django_site_domain_a2e37b91_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "django_site_domain_a2e37b91_like" ON "public"."django_site" USING "btree" ("domain" "varchar_pattern_ops");


--
-- Name: media_recommendations_medi_source_book_id_e4e5cc47; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "media_recommendations_medi_source_book_id_e4e5cc47" ON "public"."media_recommendations_mediarecommendation" USING "btree" ("source_book_id");


--
-- Name: media_recommendations_mediarecommendation_user_id_092adc2a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "media_recommendations_mediarecommendation_user_id_092adc2a" ON "public"."media_recommendations_mediarecommendation" USING "btree" ("user_id");


--
-- Name: media_recommendations_movierecommendation_user_id_44202f01; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "media_recommendations_movierecommendation_user_id_44202f01" ON "public"."media_recommendations_movierecommendation" USING "btree" ("user_id");


--
-- Name: media_recommendations_user_media_recommendation_id_a69a2d35; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "media_recommendations_user_media_recommendation_id_a69a2d35" ON "public"."media_recommendations_usermediapreference" USING "btree" ("media_recommendation_id");


--
-- Name: media_recommendations_usermediapreference_user_id_6004458a; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "media_recommendations_usermediapreference_user_id_6004458a" ON "public"."media_recommendations_usermediapreference" USING "btree" ("user_id");


--
-- Name: users_abtestassignment_user_id_14276196; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_abtestassignment_user_id_14276196" ON "public"."users_abtestassignment" USING "btree" ("user_id");


--
-- Name: users_abtestoutcome_assignment_id_60b92063; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_abtestoutcome_assignment_id_60b92063" ON "public"."users_abtestoutcome" USING "btree" ("assignment_id");


--
-- Name: users_book_book_id_a08627ee_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_book_book_id_a08627ee_like" ON "public"."users_book" USING "btree" ("book_id" "varchar_pattern_ops");


--
-- Name: users_bookcontentanalysis_book_id_da2b3e53_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_bookcontentanalysis_book_id_da2b3e53_like" ON "public"."users_bookcontentanalysis" USING "btree" ("book_id" "varchar_pattern_ops");


--
-- Name: users_bookshelf_user_id_e1416fa4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_bookshelf_user_id_e1416fa4" ON "public"."users_bookshelf" USING "btree" ("user_id");


--
-- Name: users_customuser_email_6445acef_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_email_6445acef_like" ON "public"."users_customuser" USING "btree" ("email" "varchar_pattern_ops");


--
-- Name: users_customuser_groups_customuser_id_958147bf; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_groups_customuser_id_958147bf" ON "public"."users_customuser_groups" USING "btree" ("customuser_id");


--
-- Name: users_customuser_groups_group_id_01390b14; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_groups_group_id_01390b14" ON "public"."users_customuser_groups" USING "btree" ("group_id");


--
-- Name: users_customuser_user_permissions_customuser_id_5771478b; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_user_permissions_customuser_id_5771478b" ON "public"."users_customuser_user_permissions" USING "btree" ("customuser_id");


--
-- Name: users_customuser_user_permissions_permission_id_baaa2f74; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_user_permissions_permission_id_baaa2f74" ON "public"."users_customuser_user_permissions" USING "btree" ("permission_id");


--
-- Name: users_customuser_username_80452fdf_like; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_customuser_username_80452fdf_like" ON "public"."users_customuser" USING "btree" ("username" "varchar_pattern_ops");


--
-- Name: users_userpreference_user_id_bdcaa563; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "users_userpreference_user_id_bdcaa563" ON "public"."users_userpreference" USING "btree" ("user_id");


--
-- Name: auth_group_permissions auth_group_permissio_permission_id_84c5c92e_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissio_permission_id_84c5c92e_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_group_permissions auth_group_permissions_group_id_b120cbf9_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_group_permissions"
    ADD CONSTRAINT "auth_group_permissions_group_id_b120cbf9_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: auth_permission auth_permission_content_type_id_2f476e4b_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."auth_permission"
    ADD CONSTRAINT "auth_permission_content_type_id_2f476e4b_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: communities_bookclub communities_bookclub_creator_id_4766529a_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_bookclub"
    ADD CONSTRAINT "communities_bookclub_creator_id_4766529a_fk_users_customuser_id" FOREIGN KEY ("creator_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: communities_clubmembership communities_clubmemb_book_club_id_93f648c8_fk_communiti; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_clubmembership"
    ADD CONSTRAINT "communities_clubmemb_book_club_id_93f648c8_fk_communiti" FOREIGN KEY ("book_club_id") REFERENCES "public"."communities_bookclub"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: communities_clubmembership communities_clubmemb_user_id_b596a290_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_clubmembership"
    ADD CONSTRAINT "communities_clubmemb_user_id_b596a290_fk_users_cus" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: communities_message communities_message_book_club_id_303f4bd6_fk_communiti; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_message"
    ADD CONSTRAINT "communities_message_book_club_id_303f4bd6_fk_communiti" FOREIGN KEY ("book_club_id") REFERENCES "public"."communities_bookclub"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: communities_message communities_message_sender_id_59027e60_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."communities_message"
    ADD CONSTRAINT "communities_message_sender_id_59027e60_fk_users_customuser_id" FOREIGN KEY ("sender_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_content_type_id_c4bce8eb_fk_django_co; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_content_type_id_c4bce8eb_fk_django_co" FOREIGN KEY ("content_type_id") REFERENCES "public"."django_content_type"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: django_admin_log django_admin_log_user_id_c564eba6_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."django_admin_log"
    ADD CONSTRAINT "django_admin_log_user_id_c564eba6_fk_users_customuser_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: media_recommendations_usermediapreference media_recommendation_media_recommendation_a69a2d35_fk_media_rec; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_usermediapreference"
    ADD CONSTRAINT "media_recommendation_media_recommendation_a69a2d35_fk_media_rec" FOREIGN KEY ("media_recommendation_id") REFERENCES "public"."media_recommendations_mediarecommendation"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: media_recommendations_mediarecommendation media_recommendation_source_book_id_e4e5cc47_fk_users_boo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_mediarecommendation"
    ADD CONSTRAINT "media_recommendation_source_book_id_e4e5cc47_fk_users_boo" FOREIGN KEY ("source_book_id") REFERENCES "public"."users_bookshelf"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: media_recommendations_mediarecommendation media_recommendation_user_id_092adc2a_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_mediarecommendation"
    ADD CONSTRAINT "media_recommendation_user_id_092adc2a_fk_users_cus" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: media_recommendations_movierecommendation media_recommendation_user_id_44202f01_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_movierecommendation"
    ADD CONSTRAINT "media_recommendation_user_id_44202f01_fk_users_cus" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: media_recommendations_usermediapreference media_recommendation_user_id_6004458a_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."media_recommendations_usermediapreference"
    ADD CONSTRAINT "media_recommendation_user_id_6004458a_fk_users_cus" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_abtestassignment users_abtestassignment_user_id_14276196_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_abtestassignment"
    ADD CONSTRAINT "users_abtestassignment_user_id_14276196_fk_users_customuser_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_abtestoutcome users_abtestoutcome_assignment_id_60b92063_fk_users_abt; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_abtestoutcome"
    ADD CONSTRAINT "users_abtestoutcome_assignment_id_60b92063_fk_users_abt" FOREIGN KEY ("assignment_id") REFERENCES "public"."users_abtestassignment"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_bookcontentanalysis users_bookcontentana_book_id_da2b3e53_fk_users_boo; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookcontentanalysis"
    ADD CONSTRAINT "users_bookcontentana_book_id_da2b3e53_fk_users_boo" FOREIGN KEY ("book_id") REFERENCES "public"."users_book"("book_id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_bookshelf users_bookshelf_user_id_e1416fa4_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_bookshelf"
    ADD CONSTRAINT "users_bookshelf_user_id_e1416fa4_fk_users_customuser_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_groups users_customuser_gro_customuser_id_958147bf_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_groups"
    ADD CONSTRAINT "users_customuser_gro_customuser_id_958147bf_fk_users_cus" FOREIGN KEY ("customuser_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_groups users_customuser_groups_group_id_01390b14_fk_auth_group_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_groups"
    ADD CONSTRAINT "users_customuser_groups_group_id_01390b14_fk_auth_group_id" FOREIGN KEY ("group_id") REFERENCES "public"."auth_group"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_user_permissions users_customuser_use_customuser_id_5771478b_fk_users_cus; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_user_permissions"
    ADD CONSTRAINT "users_customuser_use_customuser_id_5771478b_fk_users_cus" FOREIGN KEY ("customuser_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_customuser_user_permissions users_customuser_use_permission_id_baaa2f74_fk_auth_perm; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_customuser_user_permissions"
    ADD CONSTRAINT "users_customuser_use_permission_id_baaa2f74_fk_auth_perm" FOREIGN KEY ("permission_id") REFERENCES "public"."auth_permission"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_userpreference users_userpreference_user_id_bdcaa563_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreference"
    ADD CONSTRAINT "users_userpreference_user_id_bdcaa563_fk_users_customuser_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- Name: users_userpreferences users_userpreferences_user_id_c5a5f271_fk_users_customuser_id; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY "public"."users_userpreferences"
    ADD CONSTRAINT "users_userpreferences_user_id_c5a5f271_fk_users_customuser_id" FOREIGN KEY ("user_id") REFERENCES "public"."users_customuser"("id") DEFERRABLE INITIALLY DEFERRED;


--
-- PostgreSQL database dump complete
--

