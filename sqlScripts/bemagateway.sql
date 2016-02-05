--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'LATIN1';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: historical_queue; Type: TABLE; Schema: public; Owner: bematech; Tablespace: 
--

CREATE TABLE historical_queue (
    historical_queue_id bigint NOT NULL,
    content jsonb
);


ALTER TABLE historical_queue OWNER TO bematech;

--
-- Name: historical_queue_historical_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: bematech
--

CREATE SEQUENCE historical_queue_historical_queue_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE historical_queue_historical_queue_id_seq OWNER TO bematech;

--
-- Name: historical_queue_historical_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bematech
--

ALTER SEQUENCE historical_queue_historical_queue_id_seq OWNED BY historical_queue.historical_queue_id;


--
-- Name: request_queue; Type: TABLE; Schema: public; Owner: bematech; Tablespace: 
--

CREATE TABLE request_queue (
    content jsonb NOT NULL,
    attempt integer DEFAULT 1 NOT NULL,
    processing boolean DEFAULT false NOT NULL,
    request_date timestamp with time zone DEFAULT now() NOT NULL,
    request_id bigint NOT NULL,
    queue_name character varying(20) NOT NULL
);


ALTER TABLE request_queue OWNER TO bematech;

--
-- Name: request_queue_requestID_seq; Type: SEQUENCE; Schema: public; Owner: bematech
--

CREATE SEQUENCE "request_queue_requestID_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "request_queue_requestID_seq" OWNER TO bematech;

--
-- Name: request_queue_requestID_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bematech
--

ALTER SEQUENCE "request_queue_requestID_seq" OWNED BY request_queue.request_id;


--
-- Name: response_queue; Type: TABLE; Schema: public; Owner: bematech; Tablespace: 
--

CREATE TABLE response_queue (
    response_id bigint NOT NULL,
    content jsonb,
    request_id bigint,
    status integer,
    queue_name character varying(20)
);


ALTER TABLE response_queue OWNER TO bematech;

--
-- Name: response_queue_response_id_seq; Type: SEQUENCE; Schema: public; Owner: bematech
--

CREATE SEQUENCE response_queue_response_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE response_queue_response_id_seq OWNER TO bematech;

--
-- Name: response_queue_response_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: bematech
--

ALTER SEQUENCE response_queue_response_id_seq OWNED BY response_queue.response_id;


--
-- Name: historical_queue_id; Type: DEFAULT; Schema: public; Owner: bematech
--

ALTER TABLE ONLY historical_queue ALTER COLUMN historical_queue_id SET DEFAULT nextval('historical_queue_historical_queue_id_seq'::regclass);


--
-- Name: request_id; Type: DEFAULT; Schema: public; Owner: bematech
--

ALTER TABLE ONLY request_queue ALTER COLUMN request_id SET DEFAULT nextval('"request_queue_requestID_seq"'::regclass);


--
-- Name: response_id; Type: DEFAULT; Schema: public; Owner: bematech
--

ALTER TABLE ONLY response_queue ALTER COLUMN response_id SET DEFAULT nextval('response_queue_response_id_seq'::regclass);


--
-- Data for Name: historical_queue; Type: TABLE DATA; Schema: public; Owner: bematech
--

COPY historical_queue (historical_queue_id, content) FROM stdin;
\.


--
-- Name: historical_queue_historical_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bematech
--

SELECT pg_catalog.setval('historical_queue_historical_queue_id_seq', 233, true);


--
-- Data for Name: request_queue; Type: TABLE DATA; Schema: public; Owner: bematech
--

COPY request_queue (content, attempt, processing, request_date, request_id, queue_name) FROM stdin;
\.


--
-- Name: request_queue_requestID_seq; Type: SEQUENCE SET; Schema: public; Owner: bematech
--

SELECT pg_catalog.setval('"request_queue_requestID_seq"', 433, true);


--
-- Data for Name: response_queue; Type: TABLE DATA; Schema: public; Owner: bematech
--

COPY response_queue (response_id, content, request_id, status, queue_name) FROM stdin;
\.


--
-- Name: response_queue_response_id_seq; Type: SEQUENCE SET; Schema: public; Owner: bematech
--

SELECT pg_catalog.setval('response_queue_response_id_seq', 363, true);


--
-- Name: historical_queue_pk; Type: CONSTRAINT; Schema: public; Owner: bematech; Tablespace: 
--

ALTER TABLE ONLY historical_queue
    ADD CONSTRAINT historical_queue_pk PRIMARY KEY (historical_queue_id);


--
-- Name: pk_request_queue; Type: CONSTRAINT; Schema: public; Owner: bematech; Tablespace: 
--

ALTER TABLE ONLY request_queue
    ADD CONSTRAINT pk_request_queue PRIMARY KEY (request_id);


--
-- Name: pk_response_queue; Type: CONSTRAINT; Schema: public; Owner: bematech; Tablespace: 
--

ALTER TABLE ONLY response_queue
    ADD CONSTRAINT pk_response_queue PRIMARY KEY (response_id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

