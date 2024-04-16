const express = require("express");

const sdApp = express();

const productionLine = process.env.ProductionLine || "production-line-001";
const emulatedMachineCount = process.env.NumberOfEmulatedMachines || 6;
const externalIp = process.env.ExternalIp || "127.0.0.1";
const port = process.env.Port || 3000;

const maxTemperature = 80.0;
const idealTemperature = 65.0;
const minTemperature = 50.0;
const temperatureChange = 0.8;

let machineTemperatures = [];

sdApp.get("/service-discovery", (req, res) => {
  res.setHeader("Content-Type", "application/json");

  let response = [];

  for (let i = 0; i < emulatedMachineCount; i++) {
    response.push({
      targets: [`${externalIp}:${port + i}`],
      labels: {
        __meta_machine_type: "emulated",
        __meta_production_line: productionLine,
        __meta_machine_id: `machine-${i}`,
      },
    });
  }

  res.send(JSON.stringify(response));
});

for (let i = 0; i < emulatedMachineCount; i++) {
  const machineApp = express();

  machineApp.get("/metrics", (req, res) => {
    res.setHeader("Content-Type", "application/text");

    if (machineTemperatures[req.params.machineId] === undefined) {
      machineTemperatures[req.params.machineId] = idealTemperature;
    }

    let emulatedTemperature = getMachineTemperatur(req.params.machineId);
    machineTemperatures[req.params.machineId] = emulatedTemperature;

    res.send(`machine_temperature ${emulatedTemperature.toFixed(2)}`);
  });

  machineApp.listen(port + i, () => {
    console.log(
      `Starting virtual machine no ${i}. On port: '${port + i}'`
    );
  });
}

function getMachineTemperatur(machineId) {
  let random = Math.random();
  let currentTemperature = machineTemperatures[machineId];

  if (currentTemperature >= maxTemperature) {
    return currentTemperature - temperatureChange;
  }

  if (currentTemperature <= minTemperature) {
    return currentTemperature + temperatureChange;
  }

  if (currentTemperature >= idealTemperature) {
    let change = random > 0.55 ? temperatureChange : -temperatureChange;
    return currentTemperature + change;
  }

  if (currentTemperature < idealTemperature) {
    let change = random > 0.55 ? -temperatureChange : temperatureChange;
    return currentTemperature + change;
  }
}

sdApp.listen(port, () => {
  console.log(
    `Starting software emulation of production line: '${productionLine}' with '${emulatedMachineCount}' machines to be emulated. On port: '${port}'`
  );
});
