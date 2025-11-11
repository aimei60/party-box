import express from "express";
import helmet from "helmet";
import pool from "../utilities/db.js";

const app = express()

app.use(express.json());
app.use(helmet());

