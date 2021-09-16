"use strict";

const HTML = {};

const Student = {
  firstName: "",
  lastName: "",
  middleName: "",
  nickName: "",
  img: "",
  house: "",
};

window.addEventListener("DOMContentLoaded", start);

function start() {
  console.log("ready");
  HTML.list = document.querySelector(".studentList");
  loadJSON();
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
  const students = studentsJSON.map(prepareObject);
  buildList(students);
}

function buildList(array) {
  console.log("buildList()");
  displayList(array);
}

function displayList(array) {
  console.log("displayList()");
  // clear the list
  HTML.list.innerHTML = "";
  //display list from the array
  array.forEach(displayStudent);
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

  //grab parent
  const parent = document.querySelector(".studentList");
  //append
  parent.appendChild(clone);
}

function prepareObject(student) {
  const studentObj = Object.create(Student);
  studentObj.firstName = getFirstName(student.fullname);
  studentObj.middleName = getMiddleName(student.fullname);
  studentObj.nickName = getNickName(student.fullname);
  studentObj.lastName = getLastName(student.fullname);
  studentObj.house = getHouse(student.house);
  studentObj.img = getImage(student.fullname);
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
