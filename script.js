"use strict";

const urlStudents = "https://petlatkea.dk/2021/hogwarts/students.json";
const urlFamilies = "https://petlatkea.dk/2021/hogwarts/families.json";

const HTML = {};

let systemHacked = false;

let allStudents = [];
let pureBloodFamilies = [];
let halfBloodFamilies = [];
let prefects = [];

const settings = {
  filterBy: "students",
  sortBy: "lastName",
  sortDir: "asc",
  search: "*",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
  bloodType: "",
  prefect: false,
  inquisitor: false,
  expelled: false,
  hacker: false,
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  HTML.list = document.querySelector(".studentList");
  HTML.filterSelector = document.querySelectorAll("select#filter > option");
  HTML.selectedFilter = document.querySelector("select#filter");
  HTML.sortSelector = document.querySelectorAll("select#sort > option");
  HTML.selectedSorting = document.querySelector("select#sort");
  HTML.sortDirBtn = document.querySelector('button[data-action="sort"]');
  HTML.searchInput = document.querySelector("input[data-action=search");
  HTML.allDialogs = document.querySelectorAll("article.dialog");
  HTML.studentCard = document.querySelector("article#studentCard");
  loadJSON();
  displayDefaultValues();
  trackSelectors();
}

async function loadJSON() {
  const respStudents = await fetch(urlStudents);
  const studentsData = await respStudents.json();
  const respFamilies = await fetch(urlFamilies);
  const familiesData = await respFamilies.json();
  // when loaded, prepare data
  prepareData(familiesData, studentsData);
}

function prepareData(familiesData, studentsData) {
  pureBloodFamilies = familiesData.pure;
  halfBloodFamilies = familiesData.half;
  allStudents = studentsData.map(prepareObject);
  console.log(allStudents);
  buildList();
}

function displayDefaultValues() {
  HTML.selectedFilter.value = "students";
  HTML.selectedSorting.value = "lastName";
  HTML.searchInput.value = "";
}

function trackSelectors() {
  HTML.filterSelector.forEach((element) => {
    element.addEventListener("click", getFilterBy);
  });
  HTML.sortSelector.forEach((element) => {
    element.addEventListener("click", getSortBy);
  });
  HTML.sortDirBtn.addEventListener("click", getSortDir);
  HTML.searchInput.addEventListener("input", getSearchInput);
}

function getFilterBy() {
  const selectedFilter = HTML.selectedFilter.value;
  console.log("User selected to filter by " + selectedFilter);
  updateFilterBySettings(selectedFilter);
}

function updateFilterBySettings(selectedFilter) {
  settings.filterBy = selectedFilter;
  buildList();
}

function getSortBy() {
  const selectedSorting = HTML.selectedSorting.value;
  console.log("User selected to sort by " + selectedSorting);
  updateSortBySettings(selectedSorting);
}

function updateSortBySettings(selectedSorting) {
  settings.sortBy = selectedSorting;
  buildList();
}

function getSortDir(event) {
  let selectedDirection = event.target.dataset.sortDirection;
  console.log("User changed direction to " + selectedDirection);
  if (selectedDirection === "asc") {
    event.target.dataset.sortDirection = "desc";
    selectedDirection = "desc";
    //TO DO change icon
  } else {
    event.target.dataset.sortDirection = "asc";
    selectedDirection = "asc";
    //TO DO change icon
  }
  updateSortDirSettings(selectedDirection);
  updateSortDirDisplay();
}

function updateSortDirSettings(selectedDirection) {
  settings.sortDir = selectedDirection;
  buildList();
}

function updateSortDirDisplay() {
  HTML.sortDirBtn.textContent = HTML.sortDirBtn.dataset.sortDirection;
}

function getSearchInput() {
  console.log("getSearchInput()");
  let searchInput;
  if (HTML.searchInput.value === "666") {
    searchInput = "";
    HTML.searchInput.value = "";
    hackTheSystem();
  } else {
    searchInput = HTML.searchInput.value;
  }
  updateSearchSettings(searchInput);
}

function updateSearchSettings(searchInput) {
  settings.search = searchInput;
  buildList();
}

function buildList() {
  console.log(allStudents);
  const filteredList = filterList(allStudents);
  console.log(filteredList);
  const sortedList = sortList(filteredList);
  const searchResults = filterBySearch(sortedList);
  displayList(searchResults);
}

function filterList(allStudents) {
  console.log("filterList()");
  let filteredList = allStudents;
  if (settings.filterBy === "students") {
    filteredList = allStudents.filter(isNotExpelled);
    function isNotExpelled(student) {
      if (student.expelled === false) {
        return true;
      }
    }
  } else if (settings.filterBy === "expelled") {
    filteredList = allStudents.filter(isExpelled);
    function isExpelled(student) {
      if (student.expelled === true) {
        return true;
      }
    }
    if (filteredList.length === 0) {
      //TO DO make a message "no expelled students yet"
    }
  } else {
    filteredList = allStudents.filter(whichHouse);
    function whichHouse(student) {
      if (settings.filterBy === student.house && student.expelled === false) {
        return true;
      }
    }
  }
  return filteredList;
}

function sortList(filteredList) {
  console.log("sortList(filteredList)");
  let sortDir = 1;
  if (settings.sortDir === "desc") {
    sortDir = -1;
  }
  let sortedList = filteredList.sort(compareBySortSelection);
  function compareBySortSelection(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1 * sortDir;
    }
    return 1 * sortDir;
  }
  return sortedList;
}

function filterBySearch(sortedList) {
  console.log("filterBySearch(sortedList)");
  if (settings.search === "*" || settings.search === "") {
    return sortedList;
  } else {
    const lowerCaseSearchInput = settings.search.toLowerCase();
    console.log(lowerCaseSearchInput);
    const searchResults = sortedList.filter((student) => student.lastName.toLowerCase().includes(lowerCaseSearchInput) || student.firstName.toLowerCase().includes(lowerCaseSearchInput));
    return searchResults;
  }
}

function displayList(students) {
  console.log("displayList()");
  // clear the list
  HTML.list.innerHTML = "";
  //display list from the array
  students.forEach(displayStudent);
}

function displayStudent(student) {
  //grab template
  const template = document.querySelector("template#studentListTemplate").content;
  // create clone
  const clone = template.cloneNode(true);
  // change content
  if (student.hacker) {
    clone.querySelector(".img").src = student.img;
  } else {
    clone.querySelector(".img").src = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/" + student.img;
  }
  clone.querySelector(".img").alt = `Image of ${student.firstName} ${student.lastName}`;
  if (student.nickName === null && student.middleName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.lastName}`;
  } else if (student.nickName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else if (student.middleName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.nickName} ${student.lastName}`;
  }
  const appointPrefectBtn = clone.querySelector("[data-field=prefect]");
  //change view of prefect button based on status
  appointPrefectBtn.dataset.prefect = student.prefect;
  appointPrefectBtn.addEventListener("click", changePrefectStatus);

  //prefect-status
  function changePrefectStatus() {
    console.log("changePrefectStatus");
    console.log(student);
    if (student.prefect === true) {
      student.prefect = false;
    } else {
      tryToAddToPrefects(student);
    }
    function tryToAddToPrefects() {
      console.log("tryToAddToPrefects");
      console.log(prefects);
      if (prefects.some((obj) => obj.house === student.house)) {
        const prefectsOfSameHouse = prefects.filter((prefect) => prefect.house === student.house);
        console.log(prefectsOfSameHouse);
        if (prefectsOfSameHouse.length === 2) {
          console.log("there are already 2 prefects in this house");
          openTooManyPrefectsDialog(prefectsOfSameHouse);
        } else {
          if (prefectsOfSameHouse.some((prefect) => prefect.gender === student.gender)) {
            console.log("there are already prefects of this gender in this house");
            openSameGenderPrefectDialog(prefectsOfSameHouse);
          } else {
            console.log("there were no prefects of the same genre in this house");
            student.prefect = true;
          }
        }
      } else {
        console.log("There are NO prefects from same house gender");
        student.prefect = true;
      }
    }
    buildPrefectsList();
    buildList();
  }

  const appointInquisitorBtn = clone.querySelector("[data-field=inquisitor]");
  appointInquisitorBtn.dataset.inquisitor = student.inquisitor;
  appointInquisitorBtn.addEventListener("click", changeInquisitorStatus);

  //inquisitor-status
  function changeInquisitorStatus() {
    console.log("changeInquisitorStatus()");
    if (student.inquisitor) {
      student.inquisitor = false;
    } else {
      tryToAddToInquisitors();
    }
    function tryToAddToInquisitors() {
      if (student.bloodType === "pure-blood" || student.house === "Slytherin") {
        student.inquisitor = true;
        if (systemHacked === true) {
          setTimeout(getInquisitor, 5000);
          function getInquisitor() {
            removeFromInquisitors(student);
          }
        }
      } else {
        openCannotAppointToInquisitorsDialog();
      }
    }
    buildList();
  }
  //expelled student
  if (student.expelled === true) {
    changeListViewToExpelled();
    function changeListViewToExpelled() {
      console.log("changeListViewToExpelled()");
      clone.querySelector("button.expelBtn").classList.add("hidden");
      clone.querySelector(".img").classList.add("faded");
    }
  }
  clone.querySelector(".openStudentCard").addEventListener("click", openStudentCard);
  if (student.gender === "girl") {
    clone.querySelector("button.expelBtn").textContent = `Expel Ms. ${student.lastName}`;
  } else {
    clone.querySelector("button.expelBtn").textContent = `Expel Mr. ${student.lastName}`;
  }

  //expelling
  clone.querySelector("button.expelBtn").addEventListener("click", checkIfHacker);
  function checkIfHacker() {
    const studentClone = this.parentElement;
    if (student.hacker === true) {
      console.log("Hacker can't be expelled");
      showExpelHackerAnimation(studentClone);
    } else {
      openExpelStudentDialog(student, studentClone);
    }
  }

  //build student card view
  function openStudentCard() {
    console.log(student);
    HTML.studentCard.classList.remove("hidden");
    //change content
    if (student.hacker === true) {
      document.querySelector("#studentCard .img").src = student.img;
    } else {
      document.querySelector("#studentCard .img").src = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/" + student.img;
    }
    document.querySelector("#studentCard .img").alt = `Image of ${student.firstName} ${student.lastName}`;
    if (student.nickName === null && student.middleName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.lastName}`;
    } else if (student.nickName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
    } else if (student.middleName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.nickName} ${student.lastName}`;
    }
    document.querySelector(".info li.house span").textContent = `${student.house}`;
    document.querySelector(".info li.bloodType span").textContent = `${student.bloodType}`;

    //house colours
    if (student.house === "Gryffindor") {
      HTML.studentCard.classList.add("gryffindor");
    } else if (student.house === "Slytherin") {
      HTML.studentCard.classList.add("slytherin");
    } else if (student.house === "Ravenclaw") {
      HTML.studentCard.classList.add("ravenclaw");
    } else {
      HTML.studentCard.classList.add("hufflepuff");
    }

    //expelled student
    if (student.expelled === true) {
      HTML.studentCard.classList.add("faded");
    }
    document.querySelector(".closeStudentCard").addEventListener("click", closeStudentCard);
  }

  const parent = document.querySelector(".studentList");
  parent.appendChild(clone);
}

function openTooManyPrefectsDialog(array) {
  console.log(array);
  document.querySelector("article#tooManyPrefects").classList.remove("hidden");
  document.querySelector("article#tooManyPrefects span#house").textContent = array[0].house;
  if (array[0].gender === "girl") {
    document.querySelector("article#tooManyPrefects p span.student1").textContent = "Ms. " + array[0].lastName;
  } else {
    document.querySelector("article#tooManyPrefects p span.student1").textContent = "Mr. " + array[0].lastName;
  }
  if (array[1].gender === "girl") {
    document.querySelector("article#tooManyPrefects p span.student2").textContent = "Ms. " + array[1].lastName;
  } else {
    document.querySelector("article#tooManyPrefects p span.student2").textContent = "Mr. " + array[1].lastName;
  }
  document.querySelector("article#tooManyPrefects [data-action=remove1").addEventListener("click", removePrefect1);
  function removePrefect1() {
    array[0].prefect = false;
    buildPrefectsList();
    closeDialog();
  }
  document.querySelector("article#tooManyPrefects [data-action=remove2").addEventListener("click", removePrefect2);
  function removePrefect2() {
    array[1].prefect = false;
    buildPrefectsList();
    closeDialog();
  }
  document.querySelector("article#tooManyPrefects button.closeDialog").addEventListener("click", closeDialog);
}

function openSameGenderPrefectDialog(array) {
  document.querySelector("article#sameGenderPrefect").classList.remove("hidden");
  //change content
  document.querySelector("article#sameGenderPrefect span#gender").textContent = array[0].gender;
  document.querySelector("article#sameGenderPrefect span#house").textContent = array[0].house;
  if (array[0].gender === "girl") {
    document.querySelector("article#sameGenderPrefect p span.student1").textContent = "Ms. " + array[0].lastName;
  } else {
    document.querySelector("article#sameGenderPrefect p span.student1").textContent = "Mr. " + array[0].lastName;
  }
  document.querySelector("article#sameGenderPrefect [data-action=remove1").addEventListener("click", removeSameGenderPrefect);
  function removeSameGenderPrefect() {
    array[0].prefect = false;
    buildPrefectsList();
    closeDialog();
  }
  document.querySelector("article#sameGenderPrefect button.closeDialog").addEventListener("click", closeDialog);
}

function openCannotAppointToInquisitorsDialog() {
  document.querySelector("article#cannotAppointToInquisitors").classList.remove("hidden");
  document.querySelector("article#cannotAppointToInquisitors button.closeDialog").addEventListener("click", closeDialog);
}

function closeDialog() {
  HTML.allDialogs.forEach((dialog) => dialog.classList.add("hidden"));
}

function buildPrefectsList() {
  prefects = allStudents.filter((student) => student.prefect === true);
  console.log(prefects);
  buildList();
}

function removeFromInquisitors(student) {
  console.log("remove inquisitor " + student.lastName);
  student.inquisitor = false;
  buildList();
}

function showExpelHackerAnimation(article) {
  console.log("showExpelHackerAnimation()");
  article.classList.add("shakeAnimation");
  article.addEventListener("animationend", buildList);
}

function openExpelStudentDialog(student, studentClone) {
  console.log("You are expelling " + student.lastName);
  document.querySelector("article#expelStudentDialog").classList.remove("hidden");
  if (student.gender === "girl") {
    document.querySelector("article#expelStudentDialog span.student1").textContent = `Ms. ${student.lastName}`;
  } else {
    document.querySelector("article#expelStudentDialog span.student1").textContent = `Mr. ${student.lastName}`;
  }
  document.querySelector("button[data-action=expel]").addEventListener("click", expelStudent);
  function expelStudent() {
    student.expelled = true;
    console.log("expelled " + student.lastName);
    closeDialog();
    showExpelAnimation(studentClone);
  }
  document.querySelector("article#expelStudentDialog button.closeDialog").addEventListener("click", closeDialog);
}

function showExpelAnimation(article) {
  console.log("showExpelAnimation()");
  article.classList.add("expelAnimation");
  article.addEventListener("animationend", buildList);
}

function closeStudentCard() {
  HTML.studentCard.classList = "";
  HTML.studentCard.classList.add("hidden");
}

function prepareObject(student) {
  const studentObj = Object.create(Student);
  studentObj.firstName = getFirstName(student.fullname);
  studentObj.middleName = getMiddleName(student.fullname);
  studentObj.nickName = getNickName(student.fullname);
  studentObj.lastName = getLastName(student.fullname);
  studentObj.house = getHouse(student.house);
  studentObj.img = getImage(student.fullname);
  studentObj.gender = student.gender;
  studentObj.bloodType = getBloodType(studentObj.lastName);
  return studentObj;
}

//finds a first name
function getFirstName(fullname) {
  const trimmedName = fullname.trim().toLowerCase();
  const firsNameEnd = trimmedName.indexOf(" ");
  const firstNameCaps = trimmedName[0].toUpperCase() + trimmedName.substring(1, firsNameEnd);
  return firstNameCaps;
}

function getLastName(fullname) {
  const trimmedName = fullname.trim().toLowerCase();
  let lastNameCaps = trimmedName[trimmedName.lastIndexOf(" ") + 1].toUpperCase() + trimmedName.substring(trimmedName.lastIndexOf(" ") + 2);
  if (lastNameCaps.includes("-")) {
    const indexOfDash = lastNameCaps.indexOf("-");
    lastNameCaps = lastNameCaps.substring(0, indexOfDash) + "-" + lastNameCaps[indexOfDash + 1].toUpperCase() + lastNameCaps.substring(indexOfDash + 2);
    return lastNameCaps;
  }
  return lastNameCaps;
}

//returns a nickname if exists
function getNickName(fullname) {
  if (fullname.includes('"')) {
    const nickNameTrim = fullname.substring(fullname.indexOf('"'), fullname.lastIndexOf('"') + 1);
    const nickNameCaps = '"' + nickNameTrim[1].toUpperCase() + nickNameTrim.substring(2).toLowerCase();
    return nickNameCaps;
  } else {
    return null;
  }
}

//finds a middle name and returns null if it is a nickname or no middlename
function getMiddleName(fullname) {
  const trimmedName = fullname.trim().toLowerCase();
  const nameCount = trimmedName.split(" ");
  if (nameCount.length > 2) {
    const middleName = trimmedName.substring(trimmedName.indexOf(" ") + 1, trimmedName.lastIndexOf(" "));

    if (middleName.startsWith('"')) {
      return null;
    } else {
      const middleNameCaps = middleName[0].toUpperCase() + middleName.substring(1);
      return middleNameCaps;
    }
  } else {
    return null;
  }
}

function getHouse(house) {
  const trimmedHouse = house.trim().toLowerCase();
  const houseCaps = trimmedHouse[0].toUpperCase() + trimmedHouse.substring(1);
  return houseCaps;
}

function getImage(fullname) {
  const trimmedName = fullname.trim().toLowerCase();
  const names = trimmedName.split(" ");
  let lastName = names[names.length - 1];
  if (lastName.includes("-")) {
    lastName = lastName.substring(lastName.indexOf("-") + 1);
  }
  const imgFileName = lastName + "_" + trimmedName[0] + ".png";
  return imgFileName;
  // image on FileZilla: http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/zabini_b.png
}

function getBloodType(lastName) {
  if (halfBloodFamilies.some((obj) => obj === lastName)) {
    return "half-blood";
  } else if (pureBloodFamilies.some((obj) => obj === lastName)) {
    return "pure-blood";
  } else {
    return "muggle";
  }
}

//Hacking

function hackTheSystem() {
  console.log("system is HACKED");
  systemHacked = true;
  changeUiToHacked();
  addHackerToStudents();
  makeBloodTypesRandom();
  trackSelectorsToRandomizeBloodType();
  buildList();
}

function addHackerToStudents() {
  console.log("addHackerToStudents()");
  const hacker = Object.create(Student);
  console.log(hacker);
  hacker.firstName = "Abu";
  hacker.lastName = "Abba";
  hacker.middleName = null;
  hacker.nickName = null;
  hacker.house = "Slytherin";
  hacker.gender = "boy";
  hacker.bloodType = "cold-blood";
  hacker.img = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/hacker.jpg";
  hacker.hacker = true;
  allStudents.unshift(hacker);
}

function trackSelectorsToRandomizeBloodType() {
  HTML.filterSelector.forEach((element) => {
    element.addEventListener("click", makeBloodTypesRandom);
  });
  HTML.sortSelector.forEach((element) => {
    element.addEventListener("click", makeBloodTypesRandom);
  });
}

function makeBloodTypesRandom() {
  console.log("makeBloodTypesRandom()");
  allStudents.forEach((student) => {
    if (student.bloodType === "pure-blood") {
      console.log(student);
      const bloodTypes = ["half-blood", "pure-blood", "muggle"];
      const randomNumber = Math.floor(Math.random() * 3);
      student.bloodType = bloodTypes[randomNumber];
      console.log(student.lastName + " became " + student.bloodType);
    } else {
      console.log(student);
      student.bloodType = "pure-blood";
      console.log(student.lastName + " became pure-blood");
    }
  });
  buildList();
}

function changeUiToHacked() {
  console.log("changeUiToHacked()");
}
