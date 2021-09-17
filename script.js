"use strict";

const HTML = {};

let allStudents = [];

const settings = {
  filterBy: "students",
  sortBy: "lastName",
  sortDir: "",
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
  loadJSON();
  displayDefaultSelectionValues();
  trackFilterSelection();
  trackSortBySelection();
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
  console.log("prepareObjects()");
  allStudents = studentsJSON.map(prepareObject);
  console.log(allStudents);
  buildList(allStudents);
}

function displayDefaultSelectionValues() {
  HTML.selectedFilter.value = "students";
  HTML.selectedSorting.value = "lastName";
}

function trackFilterSelection() {
  HTML.filterSelector.forEach((element) => {
    element.addEventListener("click", updateFilterBy);
  });
}

function updateFilterBy() {
  const selectedFilter = HTML.selectedFilter.value;
  settings.filterBy = selectedFilter;
  buildList();
}

function trackSortBySelection() {
  HTML.sortSelector.forEach((element) => {
    element.addEventListener("click", updateSortBy);
  });
}

function updateSortBy() {
  const selectedSorting = HTML.selectedSorting.value;
  settings.sortBy = selectedSorting;
  buildList();
}

function buildList() {
  console.log("buildList()");
  const filteredList = filterList(allStudents);
  const sortedList = sortList(filteredList);
  // console.log(sortedList);
  displayList(sortedList);
}

function filterList(allStudents) {
  console.log("filterList()");
  console.log(settings.filterBy);
  console.log(allStudents);
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
  console.log(settings.sortBy);
  let sortedList = filteredList.sort(compareBySortSelection);
  function compareBySortSelection(a, b) {
    if (a[settings.sortBy] < b[settings.sortBy]) {
      return -1;
    }
    return 1;
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
    document.querySelector(".studentCard").classList.remove("hidden");
    //change content
    document.querySelector(".studentCard .img").src = "http://filipsoudakov.dk/kea/3rd-semester/11c_coding_visual_design/assignments/hacked_hogwarts_student_list/assets/img/" + student.img;
    document.querySelector(".studentCard .img").alt = `Image of ${student.firstName} ${student.lastName}`;
    if (student.nickName === null && student.middleName === null) {
      document.querySelector(".studentCard h3").textContent = `${student.firstName} ${student.lastName}`;
    } else if (student.nickName === null) {
      document.querySelector(".studentCard h3").textContent = `${student.firstName} ${student.middleName} ${student.lastName}`;
    } else if (student.middleName === null) {
      document.querySelector(".studentCard h3").textContent = `${student.firstName} ${student.nickName} ${student.lastName}`;
    }
    document.querySelector(".info .house").textContent = `House: ${student.house}`;
    document.querySelector(".info .bloodType").textContent = `Blood type: ${student.bloodType}`;
    if (student.gender === "girl") {
      document.querySelector(".expel").textContent = `Expel Ms. ${student.lastName}`;
    } else {
      document.querySelector(".expel").textContent = `Expel Mr. ${student.lastName}`;
    }
    document.querySelector(".closeStudentCard").addEventListener("click", closeStudentCard);
  }
  const parent = document.querySelector(".studentList");
  parent.appendChild(clone);
}

function closeStudentCard() {
  document.querySelector(".studentCard").classList.add("hidden");
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
  // console.log(nameCount.length);
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
