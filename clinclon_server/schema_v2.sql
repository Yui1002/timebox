--
-- PostgreSQL database dump
--

-- Dumped from database version 14.13 (Homebrew)
-- Dumped by pg_dump version 16.0

-- Started on 2025-05-15 23:12:05 PDT

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4 (class 2615 OID 2200)
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

-- *not* creating schema, since initdb creates it


--
-- TOC entry 853 (class 1247 OID 24761)
-- Name: actions; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.actions AS ENUM (
    'INSERT',
    'UPDATE',
    'DELETE',
    'SELECT'
);


--
-- TOC entry 236 (class 1255 OID 24796)
-- Name: log_time_record_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.log_time_record_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
    BEGIN
        --
        -- Create a row in emp_audit to reflect the operation performed on emp,
        -- make use of the special variable TG_OP to work out the operation.
        --
        IF (TG_OP = 'DELETE') THEN
            INSERT INTO time_record_audits  SELECT OLD.time_record_id, OLD.start_time, OLD.end_time, now(), OLD.update_by, 'D';
            RETURN OLD;
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO time_record_audits SELECT NEW.time_record_id, NEW.start_time, NEW.end_time, now(), NEW.update_by, 'U';
            RETURN NEW;
        ELSIF (TG_OP = 'INSERT') THEN
            INSERT INTO time_record_audits SELECT NEW.time_record_id, NEW.start_time, NEW.end_time, now(), NEW.update_by, 'I';
            RETURN NEW;
        END IF;
        RETURN NULL; -- result is ignored since this is an AFTER trigger
    END;
$$;


--
-- TOC entry 224 (class 1255 OID 24857)
-- Name: set_epoch_times(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.set_epoch_times() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin 
	new.epoch_start_time := extract(epoch from new.start_time);
	new.epoch_end_time := extract(epoch from new.end_time);
	return new;
end;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 216 (class 1259 OID 17045)
-- Name: otp; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.otp (
    otp_id integer NOT NULL,
    otp character varying(10),
    email_address character varying(255),
    create_date timestamp with time zone
);


--
-- TOC entry 215 (class 1259 OID 17044)
-- Name: otp_otp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.otp ALTER COLUMN otp_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.otp_otp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 218 (class 1259 OID 17051)
-- Name: requests; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.requests (
    request_id integer NOT NULL,
    sender_email character varying(255),
    receiver_email character varying(255),
    status character varying(20),
    request_date timestamp with time zone,
    request_rate numeric(6,2),
    request_rate_type character varying(10),
    request_schedule_day character varying(20),
    request_schedule_start_time character varying(20),
    request_schedule_end_time character varying(20),
    request_mode boolean
);


--
-- TOC entry 217 (class 1259 OID 17050)
-- Name: requests_request_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.requests ALTER COLUMN request_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.requests_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 222 (class 1259 OID 24865)
-- Name: temp_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.temp_users (
    user_id integer NOT NULL,
    first_name character varying NOT NULL,
    last_name character varying NOT NULL,
    email_address character varying NOT NULL,
    password character varying NOT NULL,
    created_at bigint NOT NULL
);


--
-- TOC entry 223 (class 1259 OID 24873)
-- Name: temp_users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.temp_users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.temp_users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 221 (class 1259 OID 24846)
-- Name: time_record; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_record (
    time_record_id integer NOT NULL,
    status character varying(20) DEFAULT 'active'::character varying,
    update_date timestamp without time zone NOT NULL,
    update_by character varying(250) NOT NULL,
    id_user_transaction integer NOT NULL,
    epoch_start_time bigint,
    epoch_end_time bigint
);


--
-- TOC entry 219 (class 1259 OID 24784)
-- Name: time_record_audits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.time_record_audits (
    time_record_id integer NOT NULL,
    start_time timestamp without time zone,
    end_time timestamp without time zone,
    changed_on timestamp without time zone,
    updated_by character varying(255),
    trigger_action character varying(1) NOT NULL
);


--
-- TOC entry 220 (class 1259 OID 24845)
-- Name: time_record_time_record_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.time_record ALTER COLUMN time_record_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.time_record_time_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 214 (class 1259 OID 17017)
-- Name: user_schedule; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_schedule (
    user_schedule_id integer NOT NULL,
    day character varying(20),
    start_time character varying(20),
    end_time character varying(20),
    service_provider_id integer NOT NULL,
    user_transaction_id integer NOT NULL
);


--
-- TOC entry 213 (class 1259 OID 17016)
-- Name: user_schedule_user_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_schedule ALTER COLUMN user_schedule_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_schedule_user_schedule_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 212 (class 1259 OID 16999)
-- Name: user_transaction; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_transaction (
    user_transaction_id integer NOT NULL,
    rate numeric(6,2),
    rate_type character varying(10),
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    update_date timestamp with time zone NOT NULL,
    update_by character varying(250) NOT NULL,
    employer_user_id integer NOT NULL,
    service_provider_id integer NOT NULL,
    mode smallint
);


--
-- TOC entry 211 (class 1259 OID 16998)
-- Name: user_transaction_user_transaction_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.user_transaction ALTER COLUMN user_transaction_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.user_transaction_user_transaction_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 210 (class 1259 OID 16990)
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    first_name character varying(250) NOT NULL,
    last_name character varying(250) NOT NULL,
    email_address character varying(250) NOT NULL,
    password character varying(250),
    status character varying(10) DEFAULT 'active'::character varying NOT NULL,
    create_date timestamp with time zone NOT NULL
);


--
-- TOC entry 209 (class 1259 OID 16989)
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.users ALTER COLUMN user_id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.users_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 3505 (class 2606 OID 17049)
-- Name: otp otp_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.otp
    ADD CONSTRAINT otp_pkey PRIMARY KEY (otp_id);


--
-- TOC entry 3507 (class 2606 OID 17055)
-- Name: requests requests_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.requests
    ADD CONSTRAINT requests_pkey PRIMARY KEY (request_id);


--
-- TOC entry 3511 (class 2606 OID 24871)
-- Name: temp_users temp_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.temp_users
    ADD CONSTRAINT temp_users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3509 (class 2606 OID 24851)
-- Name: time_record time_record_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_record
    ADD CONSTRAINT time_record_pkey PRIMARY KEY (time_record_id);


--
-- TOC entry 3501 (class 2606 OID 17021)
-- Name: user_schedule user_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schedule
    ADD CONSTRAINT user_schedule_pkey PRIMARY KEY (user_schedule_id);


--
-- TOC entry 3497 (class 2606 OID 17062)
-- Name: user_transaction user_transaction_employee_service_uk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_transaction
    ADD CONSTRAINT user_transaction_employee_service_uk UNIQUE (employer_user_id, service_provider_id);


--
-- TOC entry 3503 (class 2606 OID 17068)
-- Name: user_schedule user_transaction_id_day_uk; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schedule
    ADD CONSTRAINT user_transaction_id_day_uk UNIQUE (day, user_transaction_id);


--
-- TOC entry 3499 (class 2606 OID 17004)
-- Name: user_transaction user_transaction_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_transaction
    ADD CONSTRAINT user_transaction_pkey PRIMARY KEY (user_transaction_id);


--
-- TOC entry 3495 (class 2606 OID 16997)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- TOC entry 3516 (class 2606 OID 24852)
-- Name: time_record time_record_id_user_transaction_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.time_record
    ADD CONSTRAINT time_record_id_user_transaction_fkey FOREIGN KEY (id_user_transaction) REFERENCES public.user_transaction(user_transaction_id);


--
-- TOC entry 3514 (class 2606 OID 17022)
-- Name: user_schedule user_schedule_service_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schedule
    ADD CONSTRAINT user_schedule_service_provider_id_fkey FOREIGN KEY (service_provider_id) REFERENCES public.users(user_id);


--
-- TOC entry 3515 (class 2606 OID 17027)
-- Name: user_schedule user_schedule_user_transaction_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_schedule
    ADD CONSTRAINT user_schedule_user_transaction_id_fkey FOREIGN KEY (user_transaction_id) REFERENCES public.user_transaction(user_transaction_id);


--
-- TOC entry 3512 (class 2606 OID 17005)
-- Name: user_transaction user_transaction_employer_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_transaction
    ADD CONSTRAINT user_transaction_employer_user_id_fkey FOREIGN KEY (employer_user_id) REFERENCES public.users(user_id);


--
-- TOC entry 3513 (class 2606 OID 17010)
-- Name: user_transaction user_transaction_service_provider_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_transaction
    ADD CONSTRAINT user_transaction_service_provider_id_fkey FOREIGN KEY (service_provider_id) REFERENCES public.users(user_id);


-- Completed on 2025-05-15 23:12:05 PDT

--
-- PostgreSQL database dump complete
--

