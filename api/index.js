/* eslint-disable no-undef */
"use strict"
import express from "express";
import cors from "cors";
import "dotenv/config";
import JWT from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import CryptoJS from "crypto-js";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
const router = express.Router();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"], 
    allowedHeaders: ["Content-Type", "Authorization"], 
  }));

app.use(express.urlencoded({ extended: false, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));

const sql = async (path) => {
    try {
        let nameDB = path.substring(path.lastIndexOf("/") + 1, path.length);
        let sql = await open({ filename: path, driver: sqlite3.Database });
        console.info("〈\x1b[1m\x1b[32m✔\x1b[0m 〉\x1b[1m\x1b[32m" + "SQLite - " + nameDB + " connected!\x1b[0m");
        return sql;
    } catch (error) {
        console.error("〈\x1b[1m\x1b[31m✘\x1b[0m 〉\x1b[1m\x1b[31m" + "Unable to connect SQLite - " + nameDB + "!\x1b[0m");
    }
}

(async () => { app.locals.db = await sql("./db.db") })();

const tokenHandle = async (req, res, next) => {
    try {
        let ERR = new Error("Unauthorized");
        ERR.statusCode = 401;
        let db = req.app.locals.db;
        if(!req.headers?.authorization) throw ERR;
        let accessTokenValid = JWT.verify(req.headers.authorization, process.env.JWT_SECRET);
        if(!accessTokenValid) throw ERR;
        if((new Date(accessTokenValid.exp) - (new Date() / 1000) < 0)) throw ERR;
        let user = await db.all(`SELECT id, username, role, name FROM staff WHERE id = "${accessTokenValid.id}"`)
        if(!user[0]) throw ERR;
        req.app.locals.tokenData = {
            id: user[0].id,
            username: user[0].username,
            name: user[0].name,
            role: user[0].role
        };
        next();
    } catch (e) {
        next(e);
    }
}

// ! Report CRUD
router.get("/report", [ tokenHandle ], async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const results = await db.all(`SELECT * FROM report WHERE 1 = 1`);
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
});

router.post("/report", async (req, res, next) => {
    try {
        const { citizenid, prefixname, firstname, lastname, address, subdistrict, district, province, phone, detail, channel } = req.body;
        const db = req.app.locals.db;
        const result = await db.run(`INSERT INTO report(
            id, citizenid, prefixname, firstname, lastname, address, village, road, 
            alley, subdistrict, district, province, phone, email, line, 
            detail, channel, sector, type, image, progress, createdAt 
        ) VALUES (
            :id, :citizenid, :prefixname, :firstname, :lastname, :address, :village, :road, 
            :alley, :subdistrict, :district, :province, :phone, :email, :line, 
            :detail, :channel, :sector, :type, :image, :progress, :createdAt 
        )`, {
            ":id": req.body.id, 
            ":citizenid": citizenid, 
            ":prefixname": prefixname, 
            ":firstname": firstname, 
            ":lastname": lastname, 
            ":address": address, 
            ":village": req.body.village || "", 
            ":road": req.body.road || "", 
            ":alley": req.body.alley || "", 
            ":subdistrict": subdistrict, 
            ":district": district, 
            ":province": province, 
            ":phone": phone, 
            ":email": req.body.email || "", 
            ":line": req.body.line || "", 
            ":detail": detail, 
            ":channel": channel, 
            ":sector": req.body.sector || "", 
            ":type": req.body.type || "", 
            ":image": req.body.image || "", 
            ":progress": "w", 
            ":createdAt": new Date().toISOString() 
        });
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

router.put("/report", [ tokenHandle ], async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const { id, citizenid, prefixname, firstname, lastname, address, subdistrict, district, province, phone, detail, channel } = req.body;
        const findReport = await db.all(`SELECT * FROM report WHERE id = "${id}"`);
        const result = await db.run(`UPDATE report SET 
            citizenid = :citizenid, 
            prefixname = :prefixname, 
            firstname = :firstname, 
            lastname = :lastname, 
            address = :address, 
            village = :village, 
            road = :road, 
            alley = :alley, 
            subdistrict = :subdistrict, 
            district = :district, 
            province = :province, 
            phone = :phone, 
            email = :email, 
            line = :line, 
            detail = :detail, 
            channel = :channel, 
            sector = :sector, 
            type = :type, 
            image = :image, 
            progress = :progress 
            WHERE id = "${id}" 
        `, {
            ":citizenid": citizenid || findReport[0].citizenid, 
            ":prefixname": prefixname || findReport[0].prefixname, 
            ":firstname": firstname || findReport[0].firstname, 
            ":lastname": lastname || findReport[0].lastname, 
            ":address": address || findReport[0].address, 
            ":village": req.body.village || findReport[0].village, 
            ":road": req.body.road || findReport[0].road, 
            ":alley": req.body.alley || findReport[0].alley, 
            ":subdistrict": subdistrict || findReport[0].subdistrict, 
            ":district": district || findReport[0].district, 
            ":province": province || findReport[0].province, 
            ":phone": phone || findReport[0].phone, 
            ":email": req.body.email || findReport[0].email, 
            ":line": req.body.line || findReport[0].line, 
            ":detail": detail || findReport[0].detail, 
            ":channel": channel || findReport[0].channel, 
            ":sector": req.body.sector || findReport[0].sector, 
            ":type": req.body.type || findReport[0].type, 
            ":image": req.body.image || findReport[0].image, 
            ":progress": req.body.progress || findReport[0].progress 
        });
        res.status(200).json(result);
    } catch (error) {
        console.log(error)
        next(error);
    }
});

router.delete("/report/:id", [ tokenHandle ], async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const result = await db.run(`UPDATE report SET state = "Revoke" WHERE id = "${req.params.id}"`);
        res.status(200).json(result);
    } catch (error) {
        next(error);
    }
});

// ! History
router.get("/history/:rid", [ tokenHandle ], async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const results = await db.all(`SELECT * FROM history WHERE rid = "${req.params.rid}"`);
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
});

router.post("/history", [ tokenHandle ], async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const { rid, detail, image, staff } = req.body;
        const results = await db.run(`INSERT INTO history (
            id, rid, detail, image, staff, updatedAt 
        ) VALUES (
            :id, 
            :rid, 
            :detail, 
            :image, 
            :staff, 
            :updatedAt 
        )`,{ 
            ":id": uuidv4().replaceAll("-", ""), 
            ":rid": rid, 
            ":detail": detail, 
            ":image": image, 
            ":staff": staff, 
            ":updatedAt": new Date().toISOString() 
        });
        res.status(200).json(results);
    } catch (error) {
        next(error);
    }
});

// ! Track
router.get("/track/:id", async (req, res, next) => {
    try {
        const db = req.app.locals.db;
        const resultReport = await db.all(`SELECT * FROM report WHERE id = "${req.params.id}"`);
        const resultHistory = await db.all(`SELECT * FROM history WHERE rid = "${req.params.id}"`);
        console.log(req.params)
        res.status(200).json({...resultReport[0], history: [...resultHistory]});
    } catch (error) {
        next(error);
    }
});

// ! Staff
const comparePassword = (plaintext, hash) => CryptoJS.SHA256(plaintext).toString(CryptoJS.enc.Base64) == hash;

router.get("/staff/profile", [ tokenHandle ], (req, res) => {
    res.status(200).json(req.app.locals.tokenData);
});

router.post("/staff/login", async (req, res, next) => {
    try {
        const { username, password } = req.body;
        if(Object.values(req.body).filter(elem => elem.length !== 0).length !== 2) throw new Error("Information invalid.");
        const db = req.app.locals.db;
        const findUser = await db.all(`SELECT * FROM staff WHERE username = "${username}"`);
        if(findUser.length !== 1 || findUser[0].state !== "Invoke") throw new Error("ไม่พบชื่อผู้ใช้");
        const passwordValid = comparePassword(password, findUser[0].password);
        if(!passwordValid) throw new Error("รหัสผ่านไม่ถูกต้อง");
        const accessToken = JWT.sign({ 
            id: findUser[0].id, 
            username: findUser[0].username,
            name: findUser[0].name,
            role: findUser[0].role
        }, process.env.JWT_SECRET, { expiresIn: "1d"});
        res.status(200).json({
            id: findUser[0].id, 
            username: findUser[0].username,
            name: findUser[0].name,
            role: findUser[0].role,
            accessToken: accessToken
        });
    } catch (error) {
        next(error);
    }
});

app.use("/api/v1", router);


app.get("/", (req, res) => {
    res.status(200).json({ msg: "ok"})
})
app.use("*", (req, res) => {
    res.status(200).json({ msg: "ok"})
})

// ! errorHandler
app.use((err, req, res) => {
    return res.status(err.statusCode || 500).json({ 
        code: err.statusCode || 500,
        message: err.message || ""
     });
});

app.listen(PORT, () => console.info(`Server is running at http://localhost:${PORT}`));