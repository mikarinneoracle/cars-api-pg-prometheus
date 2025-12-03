const fs = require('fs');
const http = require("http");
const express = require('express');
const app = express();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const pg = require("pg");
const promClient = require("prom-client");

const port = 3000;
const { Pool } = pg;
var pool; 
var register = new promClient.Registry();
var configFile = "connection.txt";

// Create custom metrics for a counter
const counter = new promClient.Counter({
    name: "counter",
    help: "Custom counter for Cars API",
});

var collectDefaultMetrics = promClient.collectDefaultMetrics;
register.registerMetric(counter);
promClient.collectDefaultMetrics({
    app: "Cars API",
    prefix: 'node_',
    timeout: 10000,
    gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5],
    register
});

app.get('/metrics', async (_req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (err) {
    console.log(err);
    res.status(500).end(err);
  }
});

const options = {
  definition: {
    openapi: "1.0.0",
    info: {
      title: "Cars API",
      version: "1.0.0"
    }
  },
  apis: ["./index.js"],
};

let specs = swaggerJsdoc(options);
app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(specs)
);

/**
 * @swagger
 * tags:
 *   name: Cars API
 *   description: Cars API
 * /cars:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: A list of cars
 *     tags: [cars]
 *     responses:
 *       200:
 *         description: A list of cars
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "cars": [{ "id": 1, "name": "Toyota", "price": 20500 }, { "id": 2, "name": "BMW", "price": 47000 }, { "id": 3, "name": "Volvo", "price": 52100 }, { "id": 4, "name": "Tesla", "price": 63900 }] }
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Some server error
 *
 * /car/{id}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: A single car by id
 *     tags: [car]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: number
 *         required: true
 *         description: Car id
 *     responses:
 *       200:
 *         description: A single car by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "car": { "id": 1, "name": "Toyota", "price": 20500 } }
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Not found 
 *       500:
 *         description: Some server error
 * /price/{name}:
 *   get:
 *     security:
 *       - basicAuth: []
 *     summary: Car's price by car name
 *     tags: [car]
 *     parameters:
 *       - in: path
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: Car name
 *     responses:
 *       200:
 *         description: Car's price by car name
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/'
 *             example: { "car": { "id": 1, "name": "Toyota", "price": 20500 } }
 *       401:
 *         description: Unauthorized 
 *       404:
 *         description: Not found 
 *       500:
 *         description: Some server error
 */

app.get('/cars', (req, res) => {
  counter.inc();
  if(!pool) {
    try {
      connectionString = fs.readFileSync(configFile, 'utf8');
      console.log(connectionString);
      if(connectionString != null)
      {
 
        pool = new Pool({
           connectionString,
           ssl: { rejectUnauthorized: false }
        });
      }
     } catch (err)
     {
      res.status(503).send("Not Ready");
      return;
     }
  }
  pool.query('SELECT json_agg(cars) cars FROM cars', function(dberr, dbres) {
    if (dberr) {
        res.status(500).send(dberr.message);
    } else {
        var json = { "cars": dbres.rows[0].cars };
        res.send(JSON.stringify(json));
    }
  });
});

app.get('/car:id', (req, res) => {
  counter.inc();
  if(!pool) {
    try {
      connectionString = fs.readFileSync(configFile, 'utf8');
      console.log(connectionString);
      if(connectionString != null)
      {
 
        pool = new Pool({
           connectionString,
           ssl: { rejectUnauthorized: false }
        });
      }
     } catch (err)
     {
      res.status(503).send("Not Ready");
      return;
     }
  }
  pool.query('SELECT json_agg(cars) cars FROM cars WHERE id= $1', [ req.params['id'] ], function(dberr, dbres) {
    if (dberr) {
        res.status(500).send(dberr.message);
    } else {
      if(dbres.rows[0].cars == null) {
        res.status(404).send("Not Found");
      } else {
          var json = { "car": dbres.rows[0].cars[0] }
          res.send(JSON.stringify(json));
      }
    }
  });
});

app.get('/price/:name', (req, res) => {
  counter.inc();
  if(!pool) {
    try {
      connectionString = fs.readFileSync(configFile, 'utf8');
      console.log(connectionString);
      if(connectionString != null)
      {
 
        pool = new Pool({
           connectionString,
           ssl: { rejectUnauthorized: false }
        });
      }
     } catch (err)
     {
      res.status(503).send("Not Ready");
      return;
     }
  }
  pool.query('SELECT json_agg(cars) cars FROM cars WHERE name= $1', [ req.params['name'] ], function(dberr, dbres) {
    if (dberr) {
        res.status(500).send(dberr.message);
    } else {
      if(dbres.rows[0].cars == null) {
        res.status(404).send("Not Found");
      } else {
          var json = { "car": dbres.rows[0].cars[0] }
          res.send(JSON.stringify(json));
      }
    }
  });
});

app.listen(port);
console.log("Listening to port " + port);