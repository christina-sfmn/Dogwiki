// VARIABLES
const dogsContainer = document.getElementById("dogsContainer");
const btnBack = document.getElementById("btnBack");
const title = document.getElementById("title");
const modal = document.getElementById("modal");
const modalContent = document.getElementById("modalContent");

// ---------- STANDARD FEATURES ----------

// FETCH GROUPS
function fetchGroup() {
  fetch("https://dogapi.dog/api/v2/groups", { method: "GET" })
    .then((response) => response.json())
    .then((groups) => {
      // Show group list
      showGroupList(groups);
    })
    .catch((error) => console.error("Error fetching dog groups!", error));
}

// FETCH BREEDS
function fetchBreeds(group, groups) {
  // Get IDs from breeds
  let breedIDs = group.relationships.breeds.data.map((breed) => breed.id);

  // Fetch all breeds with ID matching with group
  Promise.all(
    breedIDs.map((breedID) =>
      fetch(`https://dogapi.dog/api/v2/breeds/${breedID}`, {
        method: "GET",
      }).then((response) => response.json())
    )
  )
    .then((breeds) => {
      // Show breed list
      showBreedList(breeds, group, groups);
    })
    .catch((error) => console.error("Error fetching dog breeds!", error));
}

// SHOW GROUP LIST
function showGroupList(groups) {
  // Hide back-button
  btnBack.className = "hidden";

  // Empty container & add class + add title
  dogsContainer.innerHTML = "";
  dogsContainer.className = "group-container";
  title.innerText = "Select your group:";

  // Create cards for each element & add to container
  groups.data.forEach((group) => {
    const card = document.createElement("div");
    card.className = "group-card";
    card.onclick = () => fetchBreeds(group, groups);

    const heading = document.createElement("h3");
    heading.innerText = group.attributes.name;

    const image = document.createElement("img");
    image.setAttribute("src", "../assets/dog_gray_watermark.png");

    card.appendChild(heading);
    card.appendChild(image);
    dogsContainer.appendChild(card);
  });
}

// SHOW BREED LIST
function showBreedList(breeds, group, groups) {
  // Add text to back-button, display button & go back to group list
  btnBack.innerText = "← Go back";
  btnBack.className = "block";
  btnBack.addEventListener("click", () => {
    showGroupList(groups);
  });

  // Empty container & change class + change title
  dogsContainer.innerHTML = "";
  dogsContainer.className = "breed-container";
  title.innerHTML =
    "Selected group: " +
    `<span class="highlight">${group.attributes.name}</span>`;

  // Create cards for each element & add to container
  breeds.forEach((breed) => {
    const card = document.createElement("div");
    card.className = "breed-card";
    card.onclick = () => showBreedInfo(breed, breeds, group, groups);

    const heading = document.createElement("h3");
    heading.innerText = breed.data.attributes.name;

    const image = document.createElement("img");
    image.setAttribute("src", "../assets/dog_gray_watermark.png");

    card.appendChild(heading);
    card.appendChild(image);
    dogsContainer.appendChild(card);
  });
}

// SHOW BREED INFO
function showBreedInfo(breed, breeds, group, groups) {
  // Go back to breed list
  btnBack.addEventListener("click", () => {
    showBreedList(breeds, group, groups);
  });

  // Empty container & remove class + empty title
  dogsContainer.innerHTML = "";
  dogsContainer.classList.remove("breed-container");
  title.innerHTML = "";

  // Check if dog is hypoallergenic
  let hypoallergenicStatus;
  if (breed.data.attributes.hypoallergenic === true) {
    hypoallergenicStatus = "yes";
  } 
  if (breed.data.attributes.hypoallergenic === false) {
    hypoallergenicStatus = "no";
  }

  // Create content-elements for breed info
  const details = `
  <div class="dog">
        <p><span class="highlight">Name:</span> ${breed.data.attributes.name}</p>
        <p><span class="highlight">Description:</span> ${breed.data.attributes.description}</p>
        <p><span class="highlight">Life:</span> max. ${breed.data.attributes.life.max} years / min. ${breed.data.attributes.life.min} years</p>
        <p><span class="highlight">Hypoallergenic:</span> ${hypoallergenicStatus}</p>
        <p><span class="highlight">Male weight:</span> max. ${breed.data.attributes.male_weight.max} years / min. ${breed.data.attributes.male_weight.min} years</p>
        <p><span class="highlight">Female weight:</span> max. ${breed.data.attributes.female_weight.max} years / min. ${breed.data.attributes.female_weight.min} years</p>
        </div>
    `;
  dogsContainer.innerHTML = details;
}

// ---------- ADVANCED FEATURES ----------

// FETCH RANDOM FACT
function fetchRandomFact() {
  fetch("https://dogapi.dog/api/v2/facts", { method: "GET" })
    .then((response) => response.json())
    .then((fact) => {
      // Create content-elements for random fact
      const randomFact = `
  <div class="random-fact">
        <h2>Random Fact</h2>
        <p>${fact.data[0].attributes.body}</p>
  </div>
    `;
      modalContent.innerHTML = randomFact;
    })
    .catch((error) => console.error("Error fetching random fact!", error));
  openModal();
}

// OPEN MODAL
function openModal() {
  modal.style.display = "block";
}

// CLOSE MODAL
function closeModal() {
  modal.style.display = "none";
}
