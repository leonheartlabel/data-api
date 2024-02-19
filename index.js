const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

require('dotenv').config();

console.log(process.env.DATABASE_URL);
// Now you can access the DATABASE_URL variable
const DATABASE_URL = process.env.DATABASE_URL;

const sequelize = new Sequelize(DATABASE_URL, {
    dialect: 'postgres',
    dialectOptions: {
        ssl:{
            require: true,
            rejectUnauthorized: false
        }
    }
})

const SensorData = sequelize.define('sensor-data', {
    serial: {
        type: DataTypes.STRING,
        allowNull: false
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    temperature: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
})

const app = express();
app.use(express.json())

// const dataList = []; before set up of postgres

app.get('/data', async (req, res) => {
    const allData = await SensorData.findAll()
    res.status(200).send(allData)
    return;
})

app.post('/data', async (req, res) => {
    let data = req.body;
    // dataList.push(data);
    const sensorData = await SensorData.create(data)
    res.status(201).send();
    return;
})

app.listen({ port:8080}, () => {
    try {
        sequelize.authenticate()
        console.log('Conected to database')

        sequelize.sync({alter: true})
        console.log('Sync to database')
    } catch (error) {
        console.log('Could not connect to the database', error);
    }

    console.log('Server is running');
})

