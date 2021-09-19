"use strict";

const HTML = {};

let allStudents = [];

const settings = {
  filterBy: "students",
  sortBy: "lastName",
  sortDir: "asc",
};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
  bloodType: "muggle",
  prefect: false,
  inquisitor: false,
  expelled: false,
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
  HTML.studentCard = document.querySelector("article#studentCard");
  HTML.expelBtn = document.querySelector("button#expelBtn");
  loadJSON();
  displayDefaultSelectionValues();
  trackSelectors();
}

function loadJSON() {
  fetch("students.json")
    .then((response) => response.json())
    .then((jsonData) => {
      // when loaded, prepare objects
      prepareObjects(jsonData);
    });
}

function prepareObjects(studentsJSON) {
  allStudents = studentsJSON.map(prepareObject);
  console.log(allStudents);
  buildList(allStudents);
}

function displayDefaultSelectionValues() {
  HTML.selectedFilter.value = "students";
  HTML.selectedSorting.value = "lastName";
}

function trackSelectors() {
  HTML.filterSelector.forEach((element) => {
    element.addEventListener("click", getFilterBy);
  });
  HTML.sortSelector.forEach((element) => {
    element.addEventListener("click", getSortBy);
  });
  HTML.sortDirBtn.addEventListener("click", getSortDir);
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

function buildList() {
  const filteredList = filterList(allStudents);
  const sortedList = sortList(filteredList);
  displayList(sortedList);
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
  clone.querySelector(".img").src = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/" + student.img;
  clone.querySelector(".img").alt = `Image of ${student.firstName} ${student.lastName}`;
  if (student.nickName === null && student.middleName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.lastName}`;
  } else if (student.nickName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
  } else if (student.middleName === null) {
    clone.querySelector(".name").textContent = `${student.firstName} ${student.nickName} ${student.lastName}`;
  }
  clone.querySelector(".student").addEventListener("click", openStudentCard);
  //build student card view
  function openStudentCard() {
    HTML.studentCard.classList.remove("hidden");
    //change content
    document.querySelector("#studentCard .img").src = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/" + student.img;
    document.querySelector("#studentCard .img").alt = `Image of ${student.firstName} ${student.lastName}`;
    if (student.nickName === null && student.middleName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.lastName}`;
    } else if (student.nickName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
    } else if (student.middleName === null) {
      document.querySelector("#studentCard h3").textContent = `${student.firstName} ${student.nickName} ${student.lastName}`;
    }
    document.querySelector(".info .house").textContent = `House: ${student.house}`;
    document.querySelector(".info .bloodType").textContent = `Blood type: ${student.bloodType}`;
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
    //expelling
    if (student.gender === "girl") {
      HTML.expelBtn.textContent = `Expel Ms. ${student.lastName}`;
    } else {
      HTML.expelBtn.textContent = `Expel Mr. ${student.lastName}`;
    }
    HTML.expelBtn.addEventListener("click", expelStudent);
    function expelStudent() {
      student.expelled = true;
      showExpelAnimation();
    }
    //expelled student
    if (student.expelled === true) {
      console.log(student);
      changeToExpelledCard(student);
    }
    document.querySelector(".closeStudentCard").addEventListener("click", closeStudentCard);
  }
  const parent = document.querySelector(".studentList");
  parent.appendChild(clone);
}

function showExpelAnimation() {
  console.log("showExpelAnimation()");
  HTML.studentCard.classList.add("expelAnimation");
  HTML.studentCard.addEventListener("animationend", closeStudentCard);
}

function changeToExpelledCard() {
  HTML.expelBtn.disabled = true;
  HTML.studentCard.style.filter = "grayscale(100%)";
}

function closeStudentCard() {
  HTML.studentCard.classList = "";
  HTML.studentCard.classList.add("hidden");
  HTML.expelBtn.disabled = false;
  HTML.studentCard.style.filter = "grayscale(0%)";
  buildList();
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
