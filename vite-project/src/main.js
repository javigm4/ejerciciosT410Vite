import { Car } from "./Car.js";
import * as datosCoche from "./mockData.js";

/*-------------------MAPEO-----------------*/
export const mapeoArray = () => {
  return new Promise((resolve, reject) => {
    const cochesArray = datosCoche.cars.map((cochesData) => {
      const coche = new Car(cochesData.id, cochesData.make);
      coche.setModel(cochesData.model);
      coche.setYear(cochesData.year);
      coche.setType(cochesData.type);
      return coche;
    });

    if (cochesArray.length > 0) {
      resolve(cochesArray);
    } else {
      reject("No se ha leído bien el mockData");
    }
  });
};

/*--------CREAR EL SELECT---------*/
document.addEventListener("DOMContentLoaded", () => {
  const divFilters = document.createElement("div");
  const spanYear = document.createElement("span");
  const strongYear = document.createElement("strong");
  strongYear.textContent = "Year: ";

  const selectYear = document.createElement("select");
  selectYear.id = "selectYear";

  const spanMake = document.createElement("span");
  const strongMake = document.createElement("strong");
  strongMake.textContent = "Make: ";
  const selectMake = document.createElement("select");
  selectMake.id = "selectMake";

  const years = datosCoche.cars.map((coche) => coche.year);
  const sortedYears = [...new Set(years.map((year) => Number(year)))].sort(
    (a, b) => a - b
  );
  const makes = datosCoche.cars.map((coche) => coche.make);

  crearOpciones(sortedYears, selectYear);
  crearOpciones(makes, selectMake);

  spanYear.appendChild(strongYear);
  divFilters.appendChild(spanYear);
  divFilters.appendChild(selectYear);
  spanYear.appendChild(strongMake);
  divFilters.appendChild(spanMake);
  divFilters.appendChild(selectMake);
  document.body.appendChild(divFilters);

  selectYear.addEventListener("change", async () => {
    await crearDivContenido();
  });
  selectMake.addEventListener("change", async () => {
    await crearDivContenido();
  });

  crearDivContenido();
});

export const crearOpciones = (array, select) => {
  const optionAll = document.createElement("option");
  optionAll.value = "all";
  optionAll.textContent = "All";
  select.appendChild(optionAll);

  array.forEach((opcion) => {
    const option = document.createElement("option");
    option.value = opcion;
    option.textContent = opcion;
    select.appendChild(option);
  });
};

const url = "https://car-data.p.rapidapi.com/cars?limit=10&page=0";
const options = {
  method: "GET",
  headers: {
    "x-rapidapi-key": "23d49c55f5msh4b301c63fc79be9p10a5e6jsn1f207790f863",
    "x-rapidapi-host": "car-data.p.rapidapi.com",
  },
};

export const filtrarCochesPorAño = async () => {
  try {
    const response = await fetch(url, options);
    const cochesArray = await response.json();

    const añoSeleccionado = document.getElementById("selectYear").value;
    const marcaSeleccionada = document.getElementById("selectMake").value;

    const cochesFiltrados = cochesArray
      .filter(
        (coche) =>
          añoSeleccionado === "all" || coche.year == Number(añoSeleccionado)
      )
      .filter(
        (coche) =>
          marcaSeleccionada === "all" ||
          coche.make.toLowerCase() === marcaSeleccionada.toLowerCase()
      );

    if (cochesFiltrados.length > 0) {
      return cochesFiltrados;
    } else {
      console.log("No se han encontrado coches con esos datos");
      return [];
    }
  } catch (error) {
    console.log(error);
    return [];
  }
};

async function crearDivContenido() {
  const existingContent = document.querySelector(".container");
  if (existingContent) {
    existingContent.remove();
  }

  const cochesFiltrados = await filtrarCochesPorAño();

  if (!cochesFiltrados || cochesFiltrados.length === 0) {
    console.log("No hay coches para mostrar");
    return;
  }

  const h1 = document.createElement("h1");
  h1.textContent = "Coches según su año";
  const divContainer = document.createElement("div");
  divContainer.classList.add("container");

  const divBlock = document.createElement("div");
  divBlock.classList.add("block");

  cochesFiltrados.forEach((car) => {
    console.log(car); // Verifica que el objeto 'car' tiene los métodos y valores esperados
    const div = document.createElement("div");

    const pModeloMake = document.createElement("p");
    const pTypeYear = document.createElement("p");
    pModeloMake.textContent = `${car.getModel()} / ${car.getMake()}`;
    pTypeYear.textContent = `${car.getType()} / ${car.getYear()}`;

    div.appendChild(pModeloMake);
    div.appendChild(pTypeYear);
    divBlock.appendChild(div);
  });

  divContainer.appendChild(h1);
  divContainer.appendChild(divBlock);
  document.body.appendChild(divContainer);
}
